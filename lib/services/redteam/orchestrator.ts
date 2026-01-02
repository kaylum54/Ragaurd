// Scan Orchestrator - Coordinates Garak and PyRIT scans
import {
  checkGarakHealth,
  startGarakScan,
  getGarakScanStatus,
  getGarakResults,
  cancelGarakScan,
} from './garak';
import {
  checkPyritHealth,
  startPyritAnalysis,
  getPyritAnalysisStatus,
  getPyritResults,
  cancelPyritAnalysis,
} from './pyrit';
import { updateScanStatus, updateScanProgress } from '@/lib/services/db/redteam';
import type {
  ScanJobRequest,
  ScanJobResponse,
  AttackResult,
  AggregatedResults,
  ATTACK_SUITE_CONFIG,
} from './types';

const POLL_INTERVAL_MS = 5000; // 5 seconds
const MAX_POLL_ATTEMPTS = 720; // 1 hour at 5s intervals

interface ActiveJob {
  jobId: string;
  service: 'garak' | 'pyrit';
  status: ScanJobResponse['status'];
}

export async function executeScan(
  scanId: string,
  targetEndpoint: string,
  attackSuite: 'basic' | 'standard' | 'comprehensive',
  totalAttacks: number,
  config?: ScanJobRequest['config']
): Promise<void> {
  console.log(`[Orchestrator] Starting scan ${scanId} against ${targetEndpoint}`);

  const request: ScanJobRequest = {
    scan_id: scanId,
    target_endpoint: targetEndpoint,
    attack_suite: attackSuite,
    total_attacks: totalAttacks,
    config,
  };

  try {
    // Check which services are available
    const [garakHealth, pyritHealth] = await Promise.all([
      checkGarakHealth(),
      checkPyritHealth(),
    ]);

    console.log(`[Orchestrator] Garak healthy: ${garakHealth.healthy}`);
    console.log(`[Orchestrator] PyRIT healthy: ${pyritHealth.healthy}`);

    if (!garakHealth.healthy && !pyritHealth.healthy) {
      await updateScanStatus(scanId, 'failed', {
        error_message: 'No security scanning services available',
      });
      throw new Error('No security scanning services available');
    }

    // Start scans on available services
    const activeJobs: ActiveJob[] = [];

    if (garakHealth.healthy) {
      try {
        const garakJob = await startGarakScan(request);
        activeJobs.push({
          jobId: garakJob.job_id,
          service: 'garak',
          status: 'running',
        });
        console.log(`[Orchestrator] Garak job started: ${garakJob.job_id}`);

        // Store Garak job ID in database
        await updateScanProgress(scanId, {
          garak_job_id: garakJob.job_id,
        });
      } catch (error) {
        console.error('[Orchestrator] Failed to start Garak scan:', error);
      }
    }

    if (pyritHealth.healthy) {
      try {
        const pyritJob = await startPyritAnalysis(request);
        activeJobs.push({
          jobId: pyritJob.job_id,
          service: 'pyrit',
          status: 'running',
        });
        console.log(`[Orchestrator] PyRIT job started: ${pyritJob.job_id}`);

        // Store PyRIT job ID in database
        await updateScanProgress(scanId, {
          pyrit_job_id: pyritJob.job_id,
        });
      } catch (error) {
        console.error('[Orchestrator] Failed to start PyRIT analysis:', error);
      }
    }

    if (activeJobs.length === 0) {
      await updateScanStatus(scanId, 'failed', {
        error_message: 'Failed to start any scanning jobs',
      });
      throw new Error('Failed to start any scanning jobs');
    }

    // Poll until all jobs complete
    await pollUntilComplete(scanId, activeJobs);

    // Aggregate results from all services
    const results = await aggregateResults(activeJobs);

    // Update scan with final results
    await updateScanStatus(scanId, 'completed', {
      blocked_attacks: results.blocked_attacks,
      passed_attacks: results.passed_attacks,
      error_attacks: results.error_attacks,
      block_rate: results.block_rate,
      avg_latency_ms: results.avg_latency_ms,
      report_json: results as unknown as Record<string, unknown>,
    });

    console.log(`[Orchestrator] Scan ${scanId} completed successfully`);
  } catch (error) {
    console.error(`[Orchestrator] Scan ${scanId} failed:`, error);

    await updateScanStatus(scanId, 'failed', {
      error_message: error instanceof Error ? error.message : 'Unknown error',
    });

    throw error;
  }
}

async function pollUntilComplete(
  scanId: string,
  jobs: ActiveJob[]
): Promise<void> {
  let attempts = 0;

  while (attempts < MAX_POLL_ATTEMPTS) {
    attempts++;

    // Check status of all active jobs
    const statusPromises = jobs.map(async (job) => {
      if (job.status === 'completed' || job.status === 'failed') {
        return job;
      }

      try {
        const status =
          job.service === 'garak'
            ? await getGarakScanStatus(job.jobId)
            : await getPyritAnalysisStatus(job.jobId);

        job.status = status.status;

        // Update progress in database
        if (status.progress) {
          await updateScanProgress(scanId, {
            blocked_attacks: status.progress.blocked,
            passed_attacks: status.progress.passed,
          });
        }

        return job;
      } catch (error) {
        console.error(`[Orchestrator] Error polling ${job.service}:`, error);
        job.status = 'failed';
        return job;
      }
    });

    await Promise.all(statusPromises);

    // Check if all jobs are done
    const allDone = jobs.every(
      (job) => job.status === 'completed' || job.status === 'failed'
    );

    if (allDone) {
      return;
    }

    // Calculate aggregate progress
    const totalProgress = {
      blocked: 0,
      passed: 0,
      completed: 0,
    };

    for (const job of jobs) {
      if (job.status === 'running') {
        try {
          const status =
            job.service === 'garak'
              ? await getGarakScanStatus(job.jobId)
              : await getPyritAnalysisStatus(job.jobId);

          if (status.progress) {
            totalProgress.blocked += status.progress.blocked;
            totalProgress.passed += status.progress.passed;
            totalProgress.completed +=
              status.progress.blocked + status.progress.passed;
          }
        } catch {
          // Ignore polling errors
        }
      }
    }

    // Update database with progress
    await updateScanProgress(scanId, {
      blocked_attacks: totalProgress.blocked,
      passed_attacks: totalProgress.passed,
    });

    // Wait before next poll
    await sleep(POLL_INTERVAL_MS);
  }

  // Timeout - cancel remaining jobs
  console.log(`[Orchestrator] Scan ${scanId} timed out, cancelling jobs`);

  for (const job of jobs) {
    if (job.status === 'running') {
      if (job.service === 'garak') {
        await cancelGarakScan(job.jobId);
      } else {
        await cancelPyritAnalysis(job.jobId);
      }
    }
  }

  throw new Error('Scan timed out');
}

async function aggregateResults(jobs: ActiveJob[]): Promise<AggregatedResults> {
  const allResults: AttackResult[] = [];
  const categories: Record<string, { blocked: number; passed: number; total: number }> = {};

  for (const job of jobs) {
    if (job.status !== 'completed') continue;

    try {
      const results =
        job.service === 'garak'
          ? await getGarakResults(job.jobId)
          : await getPyritResults(job.jobId);

      for (const result of results) {
        allResults.push(result);

        // Aggregate by category
        if (!categories[result.category]) {
          categories[result.category] = { blocked: 0, passed: 0, total: 0 };
        }

        categories[result.category].total++;
        if (result.result === 'blocked') {
          categories[result.category].blocked++;
        } else if (result.result === 'passed') {
          categories[result.category].passed++;
        }
      }
    } catch (error) {
      console.error(`[Orchestrator] Failed to get results from ${job.service}:`, error);
    }
  }

  const blocked = allResults.filter((r) => r.result === 'blocked').length;
  const passed = allResults.filter((r) => r.result === 'passed').length;
  const errors = allResults.filter((r) => r.result === 'error').length;
  const total = allResults.length;

  const totalLatency = allResults.reduce((sum, r) => sum + (r.latency_ms || 0), 0);

  return {
    total_attacks: total,
    blocked_attacks: blocked,
    passed_attacks: passed,
    error_attacks: errors,
    block_rate: total > 0 ? (blocked / total) * 100 : 0,
    avg_latency_ms: total > 0 ? totalLatency / total : 0,
    results: allResults,
    categories,
    garak_job_id: jobs.find((j) => j.service === 'garak')?.jobId,
    pyrit_job_id: jobs.find((j) => j.service === 'pyrit')?.jobId,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fire-and-forget wrapper for background execution
export function executeScanBackground(
  scanId: string,
  targetEndpoint: string,
  attackSuite: 'basic' | 'standard' | 'comprehensive',
  totalAttacks: number,
  config?: ScanJobRequest['config']
): void {
  executeScan(scanId, targetEndpoint, attackSuite, totalAttacks, config).catch(
    async (error) => {
      console.error(`[Orchestrator] Background scan failed:`, error);
      await updateScanStatus(scanId, 'failed', {
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  );
}

// Cancel a running scan
export async function cancelScan(
  scanId: string,
  garakJobId?: string,
  pyritJobId?: string
): Promise<void> {
  const cancelPromises: Promise<boolean>[] = [];

  if (garakJobId) {
    cancelPromises.push(cancelGarakScan(garakJobId));
  }
  if (pyritJobId) {
    cancelPromises.push(cancelPyritAnalysis(pyritJobId));
  }

  await Promise.all(cancelPromises);

  await updateScanStatus(scanId, 'cancelled', {
    completed_at: new Date().toISOString(),
  });
}

// Check health of all services
export async function checkServicesHealth(): Promise<{
  garak: boolean;
  pyrit: boolean;
  anyAvailable: boolean;
}> {
  const [garakHealth, pyritHealth] = await Promise.all([
    checkGarakHealth(),
    checkPyritHealth(),
  ]);

  return {
    garak: garakHealth.healthy,
    pyrit: pyritHealth.healthy,
    anyAvailable: garakHealth.healthy || pyritHealth.healthy,
  };
}
