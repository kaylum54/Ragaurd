'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Volume2,
  Shield,
  ShieldOff,
  Play,
  Square,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { VOICE_AGENT_ATTACK_PAYLOADS } from '@/lib/services/elevenlabs/client';

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface TranscriptEntry {
  role: 'user' | 'agent' | 'system';
  text: string;
  timestamp: Date;
  blocked?: boolean;
}

export default function VoiceTestPage() {
  const [agentId, setAgentId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [useProtection, setUseProtection] = useState(false);
  const [selectedAttack, setSelectedAttack] = useState<number | null>(null);
  const [playingAttack, setPlayingAttack] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const isMutedRef = useRef(true); // Ref to track muted state in callbacks
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  const addTranscript = useCallback((role: 'user' | 'agent' | 'system', text: string, blocked?: boolean) => {
    setTranscript((prev) => [
      ...prev,
      { role, text, timestamp: new Date(), blocked },
    ]);
  }, []);

  const connect = async () => {
    if (!agentId || !apiKey) {
      setError('Please enter Agent ID and API Key');
      return;
    }

    setConnecting(true);
    setError(null);

    try {
      // Get signed URL from our API
      console.log('[Voice] Requesting signed URL...');
      const response = await fetch('/api/elevenlabs/signed-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, apiKey }),
      });

      const data = await response.json();
      console.log('[Voice] Signed URL response:', response.status, data);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Not logged in. Please log in first.');
        }
        if (response.status === 403) {
          throw new Error('Admin access required. Log out and log back in after being set as admin.');
        }
        throw new Error(data.error || 'Failed to get signed URL');
      }

      if (!data.signedUrl) {
        throw new Error('No signed URL returned from server');
      }

      console.log('[Voice] Got signed URL:', data.signedUrl);
      console.log('[Voice] Connecting to WebSocket...');

      // Connect via WebSocket
      const ws = new WebSocket(data.signedUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        setConnecting(false);
        addTranscript('system', 'Connected to agent. Waiting for greeting...');
        // No init message needed - ElevenLabs will send greeting automatically
      };

      ws.onmessage = (event) => {
        try {
          // Handle binary audio data
          if (event.data instanceof Blob) {
            event.data.arrayBuffer().then((buffer) => {
              playAudioBuffer(buffer);
            });
            return;
          }

          const message = JSON.parse(event.data);
          console.log('[Voice] Message type:', message.type);

          switch (message.type) {
            case 'conversation_initiation_metadata':
              addTranscript('system', 'Agent ready. Click microphone to speak.');
              break;

            case 'user_transcript':
              addTranscript('user', message.user_transcript || message.text || '');
              break;

            case 'agent_response':
            case 'agent_response_correction':
              addTranscript('agent', message.agent_response || message.text || '');
              break;

            case 'audio':
              // Audio chunk is base64 encoded
              if (message.audio_chunk) {
                playAudioChunk(message.audio_chunk);
              } else if (message.audio) {
                playAudioChunk(message.audio);
              }
              break;

            case 'ping':
              // ElevenLabs expects pong with event_id from ping_event
              console.log('[Voice] Ping received:', message);
              try {
                const pongMsg = {
                  type: 'pong',
                  event_id: message.ping_event?.event_id,
                };
                console.log('[Voice] Sending pong:', pongMsg);
                ws.send(JSON.stringify(pongMsg));
              } catch (pongErr) {
                console.error('[Voice] Failed to send pong:', pongErr);
              }
              break;

            case 'interruption':
              // User interrupted agent
              break;

            case 'error':
              console.error('[Voice] Agent error:', message);
              setError(message.message || message.error || 'Agent error');
              break;

            default:
              console.log('[Voice] Unhandled message:', message);
          }
        } catch (e) {
          console.error('[Voice] Failed to parse message:', e, event.data);
        }
      };

      ws.onerror = (event) => {
        console.error('[Voice] WebSocket error:', event);
        setError('WebSocket connection failed. Check browser console for details.');
        setConnecting(false);
      };

      ws.onclose = (event) => {
        console.log('[Voice] WebSocket closed:', event.code, event.reason);
        setConnected(false);
        setIsMuted(true);
        if (event.code !== 1000) {
          addTranscript('system', `Disconnected unexpectedly (code: ${event.code})`);
        } else {
          addTranscript('system', 'Disconnected from agent.');
        }
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
      setConnecting(false);
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    stopMicrophone();
    setConnected(false);
  };

  const playAudioBuffer = async (arrayBuffer: ArrayBuffer) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      // Resume if suspended (browser autoplay policy)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer.slice(0));
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.start();
    } catch (e) {
      console.error('[Voice] Failed to play audio buffer:', e);
    }
  };

  const playAudioChunk = async (base64Audio: string) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      // Resume if suspended (browser autoplay policy)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Handle URL-safe base64 (replace - with + and _ with /)
      let normalizedBase64 = base64Audio.replace(/-/g, '+').replace(/_/g, '/');

      // Add padding if needed
      while (normalizedBase64.length % 4) {
        normalizedBase64 += '=';
      }

      const audioData = atob(normalizedBase64);
      const arrayBuffer = new ArrayBuffer(audioData.length);
      const view = new Uint8Array(arrayBuffer);
      for (let i = 0; i < audioData.length; i++) {
        view[i] = audioData.charCodeAt(i);
      }

      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.start();
    } catch (e) {
      console.error('[Voice] Failed to play audio chunk:', e);
    }
  };

  const startMicrophone = async () => {
    try {
      // Request 16kHz mono audio for ElevenLabs
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      mediaStreamRef.current = stream;

      // Create AudioContext at 16kHz if possible
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      }

      const source = audioContextRef.current.createMediaStreamSource(stream);
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      let audioSent = false;
      processor.onaudioprocess = (e) => {
        if (wsRef.current?.readyState === WebSocket.OPEN && !isMutedRef.current) {
          const inputData = e.inputBuffer.getChannelData(0);

          // Convert float32 to int16 PCM
          const pcmData = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            pcmData[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768));
          }

          // Convert to base64
          const uint8Array = new Uint8Array(pcmData.buffer);
          let binaryString = '';
          for (let j = 0; j < uint8Array.length; j++) {
            binaryString += String.fromCharCode(uint8Array[j]);
          }
          const base64Audio = btoa(binaryString);

          // Send audio chunk (no type field per ElevenLabs docs)
          wsRef.current.send(JSON.stringify({
            user_audio_chunk: base64Audio,
          }));

          if (!audioSent) {
            console.log('[Voice] First audio chunk sent, length:', base64Audio.length);
            audioSent = true;
          }
        }
      };

      source.connect(processor);
      processor.connect(audioContextRef.current.destination);
      isMutedRef.current = false;
      setIsMuted(false);
      console.log('[Voice] Microphone started, sample rate:', audioContextRef.current.sampleRate);
    } catch (err) {
      console.error('[Voice] Microphone error:', err);
      setError('Failed to access microphone: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const stopMicrophone = () => {
    isMutedRef.current = true;
    setIsMuted(true);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
  };

  // Protected speech recognition - transcribes voice and checks with RAGuard
  const startProtectedSpeechRecognition = () => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setError('Speech recognition not supported in this browser. Try Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    speechRecognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      let interim = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      setInterimTranscript(interim);

      if (finalTranscript.trim()) {
        setIsProcessingVoice(true);
        console.log('[Voice] Final transcript:', finalTranscript);

        try {
          // Check with RAGuard
          addTranscript('system', `Checking: "${finalTranscript.trim()}"`);

          const defenseResponse = await fetch('/api/dashboard/defense/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input: finalTranscript.trim(), profile: 'balanced' }),
          });

          const defenseData = await defenseResponse.json();

          if (!defenseData.allowed) {
            // Blocked by RAGuard
            addTranscript('user', finalTranscript.trim(), true);
            addTranscript('system', `BLOCKED by RAGuard (${defenseData.blocked_by})`, true);
          } else {
            // Allowed - send to agent
            addTranscript('user', finalTranscript.trim());
            addTranscript('system', 'Passed RAGuard, sending to agent...');

            // Send as text message to agent
            if (wsRef.current?.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({
                type: 'user_message',
                text: finalTranscript.trim(),
              }));
            }
          }
        } catch (err) {
          console.error('[Voice] RAGuard check failed:', err);
          addTranscript('system', 'Failed to check with RAGuard');
        }

        setIsProcessingVoice(false);
        setInterimTranscript('');
      }
    };

    recognition.onerror = (event) => {
      console.error('[Voice] Speech recognition error:', event);
      setError('Speech recognition error. Please try again.');
      stopProtectedSpeechRecognition();
    };

    recognition.onend = () => {
      // Restart if still supposed to be listening
      if (!isMutedRef.current && speechRecognitionRef.current) {
        try {
          recognition.start();
        } catch (e) {
          // Already started or other error
        }
      }
    };

    try {
      recognition.start();
      isMutedRef.current = false;
      setIsMuted(false);
      addTranscript('system', 'Listening with RAGuard protection enabled. Speak now...');
      console.log('[Voice] Protected speech recognition started');
    } catch (err) {
      console.error('[Voice] Failed to start speech recognition:', err);
      setError('Failed to start speech recognition');
    }
  };

  const stopProtectedSpeechRecognition = () => {
    isMutedRef.current = true;
    setIsMuted(true);
    setInterimTranscript('');
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.abort();
      speechRecognitionRef.current = null;
    }
  };

  const toggleMicrophone = () => {
    if (isMuted) {
      if (useProtection) {
        // Use speech recognition with RAGuard checking
        startProtectedSpeechRecognition();
      } else {
        // Direct audio streaming (unprotected)
        startMicrophone();
      }
    } else {
      if (useProtection) {
        stopProtectedSpeechRecognition();
      } else {
        stopMicrophone();
      }
    }
  };

  const playAttack = async (attackIndex: number) => {
    if (!connected || playingAttack) return;

    const attack = VOICE_AGENT_ATTACK_PAYLOADS[attackIndex];
    setSelectedAttack(attackIndex);
    setPlayingAttack(true);

    try {
      if (useProtection) {
        // Check with RAGuard first
        addTranscript('system', `Checking with RAGuard: "${attack}"`);

        const defenseResponse = await fetch('/api/dashboard/defense/test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: attack, profile: 'balanced' }),
        });

        const defenseData = await defenseResponse.json();

        if (!defenseData.allowed) {
          addTranscript('system', `BLOCKED by RAGuard (${defenseData.blocked_by})`, true);
          setPlayingAttack(false);
          return;
        }

        addTranscript('system', 'Passed RAGuard, sending to agent...');
      }

      // Send as user message (using contextual update for now)
      addTranscript('user', attack);

      // For a proper voice attack, we'd need TTS here
      // For now, send as text context
      wsRef.current?.send(JSON.stringify({
        type: 'contextual_update',
        text: `User said: ${attack}`,
      }));

      // Note: contextual_update doesn't trigger a response
      // For full voice testing, we'd need to use TTS + audio streaming
      addTranscript('system', 'Note: Text attacks sent via contextual update. For full voice simulation, use the automated test page.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Attack failed');
    }

    setPlayingAttack(false);
  };

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
        <h1 className="dash-page-title flex items-center gap-3">
          <Phone className="h-8 w-8 text-dash-accent" />
          Live Voice Testing
        </h1>
        <p className="dash-page-subtitle">
          Real-time voice conversation with your ElevenLabs agent
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Controls */}
        <div className="space-y-6">
          {/* Connection */}
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Agent Connection</span>
              <span className={cn(
                'dash-badge',
                connected ? 'dash-badge-success' : 'dash-badge-warning'
              )}>
                {connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="dash-card-body space-y-4">
              <div>
                <label className="text-xs font-bold text-dash-text-secondary uppercase tracking-wider block mb-2">
                  Agent ID
                </label>
                <input
                  type="text"
                  placeholder="agent_xxxxxxxxxxxx"
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  disabled={connected}
                  className="dash-input font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-dash-text-secondary uppercase tracking-wider block mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  placeholder="Your ElevenLabs API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  disabled={connected}
                  className="dash-input font-mono text-sm"
                />
              </div>

              {error && (
                <div className="p-3 bg-dash-danger/10 border-2 border-dash-danger/30 text-dash-danger text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={connected ? disconnect : connect}
                disabled={connecting}
                className={cn(
                  'dash-btn w-full',
                  connected ? 'dash-btn-danger' : 'dash-btn-primary'
                )}
              >
                {connecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : connected ? (
                  <>
                    <PhoneOff className="h-4 w-4" />
                    Disconnect
                  </>
                ) : (
                  <>
                    <Phone className="h-4 w-4" />
                    Connect
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Voice Controls */}
          {connected && (
            <div className="dash-card">
              <div className="dash-card-header">
                <span className="dash-card-title">Voice Controls</span>
                {useProtection && !isMuted && (
                  <span className="dash-badge dash-badge-success">Protected</span>
                )}
              </div>
              <div className="dash-card-body">
                <div className="flex justify-center">
                  <button
                    onClick={toggleMicrophone}
                    disabled={isProcessingVoice}
                    className={cn(
                      'h-20 w-20 rounded-full flex items-center justify-center transition-all',
                      isMuted
                        ? 'bg-dash-bg-secondary border-2 border-dash-border hover:border-dash-accent'
                        : useProtection
                          ? 'bg-dash-success animate-pulse'
                          : 'bg-dash-danger animate-pulse'
                    )}
                  >
                    {isProcessingVoice ? (
                      <Loader2 className="h-8 w-8 text-white animate-spin" />
                    ) : isMuted ? (
                      <MicOff className="h-8 w-8 text-dash-text-muted" />
                    ) : (
                      <Mic className="h-8 w-8 text-white" />
                    )}
                  </button>
                </div>
                <p className="text-center text-sm text-dash-text-muted mt-4">
                  {isProcessingVoice
                    ? 'Checking with RAGuard...'
                    : isMuted
                      ? 'Click to start speaking'
                      : useProtection
                        ? 'Listening (protected)... Click to stop'
                        : 'Speaking... Click to mute'}
                </p>

                {/* Show interim transcript when speaking with protection */}
                {!isMuted && useProtection && interimTranscript && (
                  <div className="mt-4 p-3 bg-dash-bg-tertiary border-2 border-dash-border text-sm">
                    <div className="text-xs text-dash-text-muted mb-1">Hearing:</div>
                    <p className="text-dash-text-secondary italic">{interimTranscript}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Protection Toggle */}
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">RAGuard Protection</span>
            </div>
            <div className="dash-card-body">
              <button
                onClick={() => setUseProtection(!useProtection)}
                className={cn(
                  'w-full flex items-center justify-between p-4 border-2 transition-colors',
                  useProtection
                    ? 'border-dash-success bg-dash-success/10'
                    : 'border-dash-border bg-dash-bg-secondary'
                )}
              >
                <div className="flex items-center gap-3">
                  {useProtection ? (
                    <Shield className="h-6 w-6 text-dash-success" />
                  ) : (
                    <ShieldOff className="h-6 w-6 text-dash-text-muted" />
                  )}
                  <div className="text-left">
                    <div className="font-bold text-dash-text-primary">
                      {useProtection ? 'Protected' : 'Unprotected'}
                    </div>
                    <div className="text-xs text-dash-text-muted">
                      {useProtection ? 'Attacks checked by RAGuard' : 'Direct to agent'}
                    </div>
                  </div>
                </div>
                <div className={cn(
                  'h-6 w-12 rounded-full transition-colors relative',
                  useProtection ? 'bg-dash-success' : 'bg-dash-bg-tertiary'
                )}>
                  <div className={cn(
                    'absolute top-1 h-4 w-4 rounded-full bg-white transition-transform',
                    useProtection ? 'translate-x-7' : 'translate-x-1'
                  )} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Middle: Transcript */}
        <div className="dash-card lg:col-span-1">
          <div className="dash-card-header">
            <span className="dash-card-title">Conversation</span>
            <Volume2 className="h-4 w-4 text-dash-text-muted" />
          </div>
          <div className="dash-card-body p-0">
            <div className="h-[500px] overflow-y-auto dash-scrollbar p-4 space-y-3">
              {transcript.length === 0 ? (
                <div className="text-center text-dash-text-muted py-8">
                  <Mic className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Connect to start a conversation</p>
                </div>
              ) : (
                transcript.map((entry, i) => (
                  <div
                    key={i}
                    className={cn(
                      'p-3 text-sm',
                      entry.role === 'user' && 'bg-dash-accent/10 border-l-2 border-dash-accent ml-8',
                      entry.role === 'agent' && 'bg-dash-bg-secondary border-l-2 border-dash-text-muted mr-8',
                      entry.role === 'system' && 'bg-dash-bg-tertiary border-l-2 border-dash-warning text-dash-text-muted italic',
                      entry.blocked && 'bg-dash-success/10 border-l-2 border-dash-success'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold uppercase">
                        {entry.role}
                      </span>
                      <span className="text-xs text-dash-text-muted">
                        {entry.timestamp.toLocaleTimeString()}
                      </span>
                      {entry.blocked && (
                        <span className="dash-badge dash-badge-success text-xs">BLOCKED</span>
                      )}
                    </div>
                    <p>{entry.text}</p>
                  </div>
                ))
              )}
              <div ref={transcriptEndRef} />
            </div>
          </div>
        </div>

        {/* Right: Attack Payloads */}
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">Attack Payloads</span>
            <span className="text-xs text-dash-text-muted">
              {VOICE_AGENT_ATTACK_PAYLOADS.length} attacks
            </span>
          </div>
          <div className="dash-card-body p-0">
            <div className="h-[500px] overflow-y-auto dash-scrollbar divide-y divide-dash-border">
              {VOICE_AGENT_ATTACK_PAYLOADS.map((attack, i) => (
                <button
                  key={i}
                  onClick={() => playAttack(i)}
                  disabled={!connected || playingAttack}
                  className={cn(
                    'w-full p-3 text-left hover:bg-dash-bg-hover transition-colors disabled:opacity-50',
                    selectedAttack === i && 'bg-dash-accent/10'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className="shrink-0">
                      {playingAttack && selectedAttack === i ? (
                        <Loader2 className="h-4 w-4 animate-spin text-dash-accent" />
                      ) : (
                        <Play className="h-4 w-4 text-dash-text-muted" />
                      )}
                    </div>
                    <p className="text-sm text-dash-text-secondary line-clamp-2">
                      {attack}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="dash-card">
        <div className="dash-card-body">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-5 w-5 text-dash-warning shrink-0 mt-0.5" />
            <div className="text-sm text-dash-text-secondary space-y-2">
              <p className="font-bold text-dash-text-primary">How Voice Testing Works</p>
              <div className="space-y-1">
                <p><span className="font-semibold text-dash-danger">Unprotected mode:</span> Audio streams directly to the agent (baseline/vulnerable testing)</p>
                <p><span className="font-semibold text-dash-success">Protected mode:</span> Your speech is transcribed locally, checked by RAGuard, and blocked if malicious</p>
              </div>
              <p className="text-dash-text-muted">
                For automated attack testing with full results analysis, use the <Link href="/dashboard/redteam/test" className="text-dash-accent hover:underline">Test Agent</Link> page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
