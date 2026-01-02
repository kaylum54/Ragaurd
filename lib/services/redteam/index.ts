// Red Team Services - Exports
// Client for the actual red team server
export * from './client';

// Legacy exports (Garak/PyRIT) - may be removed later
export {
  checkGarakHealth,
  startGarakScan,
  getGarakScanStatus,
  getGarakResults,
  cancelGarakScan,
} from './garak';

export {
  checkPyritHealth,
  startPyritAnalysis,
  getPyritAnalysisStatus,
  getPyritResults,
  cancelPyritAnalysis,
} from './pyrit';

export {
  executeScan,
  executeScanBackground,
  cancelScan,
  checkServicesHealth,
} from './orchestrator';
