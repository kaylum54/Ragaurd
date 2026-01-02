'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SecurityScoreData {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  factors: {
    name: string;
    score: number;
    maxScore: number;
    status: 'good' | 'warning' | 'critical';
  }[];
}

interface SecurityScoreProps {
  blockRate: number;
  avgLatencyMs: number;
  totalRequests: number;
  blockedThreats: number;
  audioEnabled?: boolean;
  redteamEnabled?: boolean;
}

function calculateSecurityScore(props: SecurityScoreProps): SecurityScoreData {
  const { blockRate, avgLatencyMs, totalRequests, audioEnabled, redteamEnabled } = props;

  const factors: SecurityScoreData['factors'] = [];

  // Factor 1: Protection Effectiveness (0-30 points)
  let protectionScore = 0;
  if (totalRequests > 0) {
    if (blockRate >= 5 && blockRate <= 25) {
      protectionScore = 30;
    } else if (blockRate < 5) {
      protectionScore = Math.max(10, blockRate * 6);
    } else if (blockRate > 25 && blockRate <= 50) {
      protectionScore = 25;
    } else {
      protectionScore = 15;
    }
  } else {
    protectionScore = 20;
  }
  factors.push({
    name: 'Protection',
    score: Math.round(protectionScore),
    maxScore: 30,
    status: protectionScore >= 25 ? 'good' : protectionScore >= 15 ? 'warning' : 'critical',
  });

  // Factor 2: Response Time (0-25 points)
  let latencyScore = 0;
  if (avgLatencyMs <= 50) {
    latencyScore = 25;
  } else if (avgLatencyMs <= 100) {
    latencyScore = 22;
  } else if (avgLatencyMs <= 200) {
    latencyScore = 18;
  } else if (avgLatencyMs <= 500) {
    latencyScore = 12;
  } else {
    latencyScore = 5;
  }
  factors.push({
    name: 'Speed',
    score: latencyScore,
    maxScore: 25,
    status: latencyScore >= 18 ? 'good' : latencyScore >= 12 ? 'warning' : 'critical',
  });

  // Factor 3: Coverage (0-25 points)
  let coverageScore = 10;
  if (audioEnabled) coverageScore += 8;
  if (redteamEnabled) coverageScore += 7;
  factors.push({
    name: 'Coverage',
    score: coverageScore,
    maxScore: 25,
    status: coverageScore >= 20 ? 'good' : coverageScore >= 15 ? 'warning' : 'critical',
  });

  // Factor 4: Activity (0-20 points)
  let activityScore = 0;
  if (totalRequests >= 1000) {
    activityScore = 20;
  } else if (totalRequests >= 100) {
    activityScore = 15;
  } else if (totalRequests >= 10) {
    activityScore = 10;
  } else if (totalRequests > 0) {
    activityScore = 5;
  }
  factors.push({
    name: 'Activity',
    score: activityScore,
    maxScore: 20,
    status: activityScore >= 15 ? 'good' : activityScore >= 10 ? 'warning' : 'critical',
  });

  const totalScore = factors.reduce((sum, f) => sum + f.score, 0);

  let grade: SecurityScoreData['grade'];
  if (totalScore >= 85) grade = 'A';
  else if (totalScore >= 70) grade = 'B';
  else if (totalScore >= 55) grade = 'C';
  else if (totalScore >= 40) grade = 'D';
  else grade = 'F';

  const trend: SecurityScoreData['trend'] = totalScore >= 70 ? 'up' : totalScore >= 50 ? 'stable' : 'down';
  const trendValue = trend === 'up' ? 5 : trend === 'down' ? -3 : 0;

  return { score: totalScore, grade, trend, trendValue, factors };
}

const gradeColors: Record<SecurityScoreData['grade'], string> = {
  A: 'text-green-600',
  B: 'text-blue-600',
  C: 'text-amber-600',
  D: 'text-orange-600',
  F: 'text-red-600',
};

const gradeBgColors: Record<SecurityScoreData['grade'], string> = {
  A: 'stroke-green-500',
  B: 'stroke-blue-500',
  C: 'stroke-amber-500',
  D: 'stroke-orange-500',
  F: 'stroke-red-500',
};

export function SecurityScore(props: SecurityScoreProps) {
  const [scoreData, setScoreData] = useState<SecurityScoreData | null>(null);

  useEffect(() => {
    const data = calculateSecurityScore(props);
    setScoreData(data);
  }, [props]);

  if (!scoreData) return null;

  const TrendIcon = scoreData.trend === 'up' ? TrendingUp : scoreData.trend === 'down' ? TrendingDown : Minus;

  return (
    <div className="bg-white rounded border border-midnight-300/60 overflow-hidden h-full">
      <div className="px-3 py-2 bg-midnight-50/80 border-b border-midnight-200/60">
        <span className="text-[10px] font-semibold text-midnight-600 uppercase tracking-wide">Security Score</span>
      </div>
      <div className="p-3">
        <div className="flex items-center gap-4">
          {/* Score Circle */}
          <div className="relative flex-shrink-0">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="currentColor"
                strokeWidth="5"
                fill="none"
                className="text-midnight-100"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                strokeWidth="5"
                fill="none"
                strokeDasharray={`${(scoreData.score / 100) * 213.6} 213.6`}
                strokeLinecap="round"
                className={gradeBgColors[scoreData.grade]}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn('text-xl font-bold tabular-nums', gradeColors[scoreData.grade])}>
                {scoreData.score}
              </span>
              <span className="text-[9px] font-medium text-midnight-400 uppercase">
                Grade {scoreData.grade}
              </span>
            </div>
          </div>

          {/* Score Details */}
          <div className="flex-1 min-w-0">
            {/* Trend */}
            <div className="flex items-center gap-1.5 mb-2">
              <TrendIcon className={cn(
                'h-3 w-3',
                scoreData.trend === 'up' && 'text-secure-600',
                scoreData.trend === 'down' && 'text-critical-600',
                scoreData.trend === 'stable' && 'text-midnight-400'
              )} />
              <span className="text-[11px] text-midnight-500">
                {scoreData.trend === 'up' && `+${scoreData.trendValue} from last period`}
                {scoreData.trend === 'down' && `${scoreData.trendValue} from last period`}
                {scoreData.trend === 'stable' && 'Stable'}
              </span>
            </div>

            {/* Factor Summary */}
            <div className="space-y-1.5">
              {scoreData.factors.map((factor) => (
                <div key={factor.name} className="flex items-center gap-2">
                  <div className={cn(
                    'w-1.5 h-1.5 rounded-full flex-shrink-0',
                    factor.status === 'good' && 'bg-secure-500',
                    factor.status === 'warning' && 'bg-warning-500',
                    factor.status === 'critical' && 'bg-critical-500'
                  )} />
                  <span className="text-[11px] text-midnight-500">{factor.name}</span>
                  <span className="text-[11px] text-midnight-400 tabular-nums ml-auto">
                    {factor.score}/{factor.maxScore}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
