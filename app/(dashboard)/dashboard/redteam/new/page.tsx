'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Target, Loader2, Shield, Zap, Clock, Plus, Save, X, Mic, Phone, Globe, Server, ChevronDown, Eye, EyeOff, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useRedteamStats } from '@/hooks/useRedteam';
import {
  type Platform,
  type PlatformInfo,
  getPlatforms,
  getPlatformFields,
  startScan,
  checkHealth,
} from '@/lib/services/redteam/client';

const platformIcons: Record<Platform, typeof Mic> = {
  ragaurd: Shield,
  elevenlabs: Mic,
  vapi: Phone,
  retell: Phone,
  bland: Phone,
  custom: Globe,
};

const profileOptions = [
  {
    id: 'strict' as const,
    name: 'Strict',
    description: 'Maximum attacks for thorough testing',
    attackMultiplier: 1.5,
  },
  {
    id: 'balanced' as const,
    name: 'Balanced',
    description: 'Standard attack coverage',
    attackMultiplier: 1.0,
    recommended: true,
  },
  {
    id: 'permissive' as const,
    name: 'Permissive',
    description: 'Fewer attacks, faster results',
    attackMultiplier: 0.5,
  },
];

const attackCounts = [10, 25, 50, 100, 200, 500];

export default function NewScanPage() {
  const router = useRouter();
  const { stats, loading: statsLoading } = useRedteamStats();

  // Platform state
  const [platforms, setPlatforms] = useState<PlatformInfo[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('elevenlabs');
  const [platformFields, setPlatformFields] = useState<ReturnType<typeof getPlatformFields>>({ fields: [] });

  // Form state
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [maxAttacks, setMaxAttacks] = useState(50);
  const [profile, setProfile] = useState<'strict' | 'balanced' | 'permissive'>('balanced');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serviceHealthy, setServiceHealthy] = useState<boolean | null>(null);

  // Load platforms on mount
  useEffect(() => {
    const loadPlatforms = async () => {
      const platformList = await getPlatforms();
      setPlatforms(platformList);
    };
    loadPlatforms();

    // Check service health
    const checkServiceHealth = async () => {
      const health = await checkHealth();
      setServiceHealthy(health.healthy);
    };
    checkServiceHealth();
  }, []);

  // Update platform fields when platform changes
  useEffect(() => {
    const fields = getPlatformFields(selectedPlatform);
    setPlatformFields(fields);
    // Reset form data when platform changes
    setFormData({});
    setError(null);
  }, [selectedPlatform]);

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    setError(null);
  };

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const validateForm = (): boolean => {
    // Check required fields
    for (const field of platformFields.fields) {
      if (field.required && !formData[field.name]?.trim()) {
        setError(`${field.label} is required`);
        return false;
      }
    }

    // Validate URL for custom platform
    if (selectedPlatform === 'custom' && formData.target_url) {
      try {
        new URL(formData.target_url);
      } catch {
        setError('Please enter a valid URL');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const scanRequest = {
        platform: selectedPlatform,
        max_attacks: maxAttacks,
        profile,
        ...formData,
      };

      const result = await startScan(scanRequest);

      if (result.scan_id) {
        // Small delay to let scan initialize
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Redirect to scan details page - use external scan_id for direct API access
        router.push(`/dashboard/redteam/${result.scan_id}`);
      }
    } catch (err) {
      console.error('Error starting scan:', err);
      setError(err instanceof Error ? err.message : 'Failed to start scan. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProfileInfo = profileOptions.find((p) => p.id === profile);
  const PlatformIcon = platformIcons[selectedPlatform] || Target;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/redteam"
          className="inline-flex items-center text-sm text-dash-text-muted hover:text-dash-text-primary mb-4 font-medium"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Red Team
        </Link>
        <h1 className="dash-page-title">New Security Scan</h1>
        <p className="dash-page-subtitle">
          Test your voice agent against prompt injection attacks
        </p>
      </div>

      {/* Service Health Banner */}
      {serviceHealthy === false && (
        <div className="dash-card border-dash-warning bg-dash-warning/10">
          <div className="dash-card-body flex items-center gap-3">
            <Server className="h-5 w-5 text-dash-warning" />
            <div>
              <div className="font-semibold text-dash-warning">Red Team Service Unavailable</div>
              <div className="text-sm text-dash-text-secondary">
                The scanning service is currently offline. Please try again later.
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Platform Selection */}
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Select Platform</span>
            </div>
            <div className="dash-card-body">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {platforms.map((platform) => {
                  const Icon = platformIcons[platform.id] || Target;
                  const isSelected = selectedPlatform === platform.id;
                  return (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={cn(
                        'p-4 text-left transition-colors border-2',
                        isSelected
                          ? 'border-dash-accent bg-dash-accent/10'
                          : 'border-dash-border bg-dash-bg-secondary hover:border-dash-border-hover'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'h-10 w-10 flex items-center justify-center border-2',
                            isSelected
                              ? 'bg-dash-accent/20 border-dash-accent/30'
                              : 'bg-dash-bg-tertiary border-dash-border'
                          )}
                        >
                          <Icon
                            className={cn(
                              'h-5 w-5',
                              isSelected ? 'text-dash-accent' : 'text-dash-text-muted'
                            )}
                          />
                        </div>
                        <div>
                          <div
                            className={cn(
                              'font-semibold text-sm',
                              isSelected ? 'text-dash-text-primary' : 'text-dash-text-secondary'
                            )}
                          >
                            {platform.name}
                          </div>
                          <div className="text-xs text-dash-text-muted truncate max-w-[120px]">
                            {platform.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Platform-Specific Fields */}
          {platformFields.fields.length > 0 && (
            <div className="dash-card">
              <div className="dash-card-header">
                <span className="dash-card-title flex items-center gap-2">
                  <PlatformIcon className="h-4 w-4 text-dash-accent" />
                  {platforms.find((p) => p.id === selectedPlatform)?.name} Configuration
                </span>
              </div>
              <div className="dash-card-body space-y-4">
                {platformFields.fields.map((field) => (
                  <div key={field.name}>
                    <label
                      htmlFor={field.name}
                      className="text-xs font-bold text-dash-text-secondary uppercase tracking-wider block mb-2"
                    >
                      {field.label} {field.required && '*'}
                    </label>
                    <div className="relative">
                      <input
                        id={field.name}
                        type={
                          field.type === 'password' && !showPasswords[field.name]
                            ? 'password'
                            : 'text'
                        }
                        placeholder={field.placeholder}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        className={cn('dash-input font-mono pr-10', error && 'border-dash-danger')}
                      />
                      {field.type === 'password' && (
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(field.name)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-dash-text-muted hover:text-dash-text-primary transition-colors"
                        >
                          {showPasswords[field.name] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                    {field.name === 'agent_id' && selectedPlatform === 'elevenlabs' && (
                      <p className="text-xs text-dash-text-muted mt-1">
                        Found in your ElevenLabs dashboard under Conversational AI → Agents
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attack Configuration */}
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Attack Configuration</span>
            </div>
            <div className="dash-card-body space-y-6">
              {/* Number of Attacks */}
              <div>
                <label className="text-xs font-bold text-dash-text-secondary uppercase tracking-wider block mb-3">
                  Number of Attacks
                </label>
                <div className="flex flex-wrap gap-2">
                  {attackCounts.map((count) => (
                    <button
                      key={count}
                      onClick={() => setMaxAttacks(count)}
                      className={cn(
                        'px-4 py-2 text-sm font-semibold border-2 transition-colors',
                        maxAttacks === count
                          ? 'border-dash-accent bg-dash-accent/10 text-dash-text-primary'
                          : 'border-dash-border bg-dash-bg-secondary text-dash-text-secondary hover:border-dash-border-hover'
                      )}
                    >
                      {count}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-dash-text-muted mt-2">
                  More attacks = more thorough testing but longer scan time
                </p>
              </div>

              {/* Profile */}
              <div>
                <label className="text-xs font-bold text-dash-text-secondary uppercase tracking-wider block mb-3">
                  Security Profile
                </label>
                <div className="grid gap-3">
                  {profileOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setProfile(option.id)}
                      className={cn(
                        'relative p-4 text-left transition-colors border-2',
                        profile === option.id
                          ? 'border-dash-accent bg-dash-accent/10'
                          : 'border-dash-border bg-dash-bg-secondary hover:border-dash-border-hover'
                      )}
                    >
                      {option.recommended && (
                        <span className="absolute top-2 right-2 dash-badge dash-badge-accent text-xs">
                          Recommended
                        </span>
                      )}
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'h-4 w-4 border-2 rounded-full flex items-center justify-center',
                            profile === option.id
                              ? 'border-dash-accent'
                              : 'border-dash-text-muted'
                          )}
                        >
                          {profile === option.id && (
                            <div className="h-2 w-2 rounded-full bg-dash-accent" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-dash-text-primary">{option.name}</div>
                          <div className="text-sm text-dash-text-muted">{option.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Summary & Start */}
        <div className="space-y-6">
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Scan Summary</span>
            </div>
            <div className="dash-card-body space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-dash-text-muted">Platform</span>
                <span className="font-semibold text-dash-text-primary flex items-center gap-2">
                  <PlatformIcon className="h-4 w-4 text-dash-accent" />
                  {platforms.find((p) => p.id === selectedPlatform)?.name || selectedPlatform}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-dash-text-muted">Attacks</span>
                <span className="font-semibold text-dash-text-primary tabular-nums">
                  {maxAttacks}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-dash-text-muted">Profile</span>
                <span className="font-semibold text-dash-text-primary capitalize">{profile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-dash-text-muted">Est. Duration</span>
                <span className="font-semibold text-dash-text-primary">
                  ~{Math.ceil(maxAttacks * 0.5)} min
                </span>
              </div>

              {error && (
                <div className="p-3 bg-dash-danger/10 border-2 border-dash-danger/30 text-dash-danger text-sm">
                  {error}
                </div>
              )}

              <button
                className="dash-btn dash-btn-primary w-full"
                onClick={handleSubmit}
                disabled={isSubmitting || serviceHealthy === false}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Starting Scan...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Start Scan
                  </>
                )}
              </button>

              {serviceHealthy === true && (
                <div className="flex items-center justify-center gap-2 text-xs text-dash-success">
                  <CheckCircle className="h-3 w-3" />
                  Service online
                </div>
              )}
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Usage This Month</span>
            </div>
            <div className="dash-card-body space-y-2">
              {statsLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-dash-text-muted" />
              ) : (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-dash-text-muted">Attacks Used</span>
                    <span className="text-dash-text-primary font-medium tabular-nums">
                      {stats.totalAttacks.toLocaleString()} / 10,000
                    </span>
                  </div>
                  <div className="w-full h-2 bg-dash-bg-tertiary">
                    <div
                      className="h-full bg-dash-accent transition-all"
                      style={{ width: `${Math.min((stats.totalAttacks / 10000) * 100, 100)}%` }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">How It Works</span>
            </div>
            <div className="dash-card-body">
              <ol className="space-y-3 text-sm text-dash-text-secondary">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-dash-accent/20 border-2 border-dash-accent/30 text-dash-accent flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <span>We connect to your voice agent platform</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-dash-accent/20 border-2 border-dash-accent/30 text-dash-accent flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <span>Send prompt injection attacks to test defenses</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-dash-accent/20 border-2 border-dash-accent/30 text-dash-accent flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <span>Report which attacks were blocked vs passed</span>
                </li>
              </ol>
            </div>
          </div>

          {/* Platform Help */}
          {selectedPlatform === 'elevenlabs' && (
            <div className="dash-card border-dash-accent/30">
              <div className="dash-card-header">
                <span className="dash-card-title text-dash-accent">ElevenLabs Setup</span>
              </div>
              <div className="dash-card-body text-sm text-dash-text-secondary space-y-2">
                <p>
                  <strong>Agent ID:</strong> Found in your ElevenLabs dashboard under Conversational
                  AI → Agents. Click on your agent to see the ID.
                </p>
                <p>
                  <strong>API Key:</strong> Go to Profile → API Keys to generate or copy your key.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
