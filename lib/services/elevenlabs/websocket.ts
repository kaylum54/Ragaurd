// ElevenLabs WebSocket Voice Client

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';
const ELEVENLABS_WS_URL = 'wss://api.elevenlabs.io/v1/convai/conversation';

export interface VoiceConversationConfig {
  agentId: string;
  apiKey: string;
  onTranscript?: (text: string, role: 'user' | 'agent') => void;
  onAudio?: (audioBase64: string) => void;
  onError?: (error: string) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
}

export interface ConversationMessage {
  role: 'user' | 'agent';
  text: string;
  timestamp: number;
}

/**
 * Get a signed WebSocket URL for private agent access
 */
export async function getSignedWebSocketUrl(
  agentId: string,
  apiKey: string
): Promise<{ success: boolean; signedUrl?: string; error?: string }> {
  try {
    const response = await fetch(
      `${ELEVENLABS_API_URL}/convai/conversation/get-signed-url?agent_id=${agentId}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': apiKey,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Failed to get signed URL: ${response.status} - ${errorText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      signedUrl: data.signed_url,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Convert text to speech using ElevenLabs TTS
 * Returns base64-encoded audio
 */
export async function textToSpeech(
  text: string,
  apiKey: string,
  voiceId: string = '21m00Tcm4TlvDq8ikWAM' // Default: Rachel voice
): Promise<{ success: boolean; audioBase64?: string; error?: string }> {
  try {
    const response = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `TTS failed: ${response.status} - ${errorText}`,
      };
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    return {
      success: true,
      audioBase64: base64Audio,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Voice conversation session manager
 * Handles WebSocket connection and message flow
 */
export class VoiceConversationSession {
  private ws: WebSocket | null = null;
  private config: VoiceConversationConfig;
  private transcript: ConversationMessage[] = [];
  private isConnected = false;
  private pingInterval: NodeJS.Timeout | null = null;

  constructor(config: VoiceConversationConfig) {
    this.config = config;
  }

  async connect(): Promise<boolean> {
    try {
      // Get signed URL for authentication
      const urlResult = await getSignedWebSocketUrl(
        this.config.agentId,
        this.config.apiKey
      );

      if (!urlResult.success || !urlResult.signedUrl) {
        this.config.onError?.(urlResult.error || 'Failed to get signed URL');
        return false;
      }

      return new Promise((resolve) => {
        this.ws = new WebSocket(urlResult.signedUrl!);

        this.ws.onopen = () => {
          this.isConnected = true;
          this.config.onConnected?.();

          // Send initialization
          this.ws?.send(
            JSON.stringify({
              type: 'conversation_initiation_client_data',
            })
          );

          resolve(true);
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onerror = (error) => {
          this.config.onError?.(`WebSocket error: ${error}`);
          resolve(false);
        };

        this.ws.onclose = () => {
          this.isConnected = false;
          this.config.onDisconnected?.();
          if (this.pingInterval) {
            clearInterval(this.pingInterval);
          }
        };
      });
    } catch (error) {
      this.config.onError?.(
        error instanceof Error ? error.message : 'Connection failed'
      );
      return false;
    }
  }

  private handleMessage(data: string) {
    try {
      const message = JSON.parse(data);

      switch (message.type) {
        case 'user_transcript':
          this.transcript.push({
            role: 'user',
            text: message.text || message.user_transcript,
            timestamp: Date.now(),
          });
          this.config.onTranscript?.(message.text || message.user_transcript, 'user');
          break;

        case 'agent_response':
          this.transcript.push({
            role: 'agent',
            text: message.text || message.agent_response,
            timestamp: Date.now(),
          });
          this.config.onTranscript?.(message.text || message.agent_response, 'agent');
          break;

        case 'audio':
          this.config.onAudio?.(message.audio || message.audio_chunk);
          break;

        case 'ping':
          // Respond with pong
          this.ws?.send(
            JSON.stringify({
              type: 'pong',
              event_id: message.event_id,
            })
          );
          break;

        case 'error':
          this.config.onError?.(message.message || 'Unknown error from agent');
          break;
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  /**
   * Send audio chunk to the agent
   */
  sendAudio(audioBase64: string) {
    if (!this.isConnected || !this.ws) {
      this.config.onError?.('Not connected');
      return;
    }

    this.ws.send(
      JSON.stringify({
        user_audio_chunk: audioBase64,
      })
    );
  }

  /**
   * Send a text message as contextual update
   * Note: This doesn't trigger a voice response, just adds context
   */
  sendContextualUpdate(text: string) {
    if (!this.isConnected || !this.ws) {
      this.config.onError?.('Not connected');
      return;
    }

    this.ws.send(
      JSON.stringify({
        type: 'contextual_update',
        text,
      })
    );
  }

  /**
   * Get the full transcript
   */
  getTranscript(): ConversationMessage[] {
    return [...this.transcript];
  }

  /**
   * Check if connected
   */
  isActive(): boolean {
    return this.isConnected;
  }

  /**
   * Disconnect the session
   */
  disconnect() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }
}

/**
 * Run a voice-based attack test
 * Converts attack text to speech, sends to agent, and analyzes response
 */
export async function runVoiceAttackTest(
  agentId: string,
  apiKey: string,
  attackPayload: string,
  timeoutMs: number = 30000
): Promise<{
  success: boolean;
  userTranscript: string | null;
  agentResponse: string | null;
  latencyMs: number;
  error?: string;
}> {
  const startTime = Date.now();

  try {
    // Step 1: Convert attack text to speech
    const ttsResult = await textToSpeech(attackPayload, apiKey);
    if (!ttsResult.success || !ttsResult.audioBase64) {
      return {
        success: false,
        userTranscript: null,
        agentResponse: null,
        latencyMs: Date.now() - startTime,
        error: ttsResult.error || 'TTS failed',
      };
    }

    // Step 2: Connect to agent via WebSocket
    let agentResponse: string | null = null;
    let userTranscript: string | null = null;
    let responseReceived = false;

    const session = new VoiceConversationSession({
      agentId,
      apiKey,
      onTranscript: (text, role) => {
        if (role === 'agent') {
          agentResponse = text;
          responseReceived = true;
        } else {
          userTranscript = text;
        }
      },
      onError: (error) => {
        console.error('Voice session error:', error);
      },
    });

    const connected = await session.connect();
    if (!connected) {
      return {
        success: false,
        userTranscript: null,
        agentResponse: null,
        latencyMs: Date.now() - startTime,
        error: 'Failed to connect to agent',
      };
    }

    // Step 3: Send audio
    session.sendAudio(ttsResult.audioBase64);

    // Step 4: Wait for response
    await new Promise<void>((resolve) => {
      const checkInterval = setInterval(() => {
        if (responseReceived || Date.now() - startTime > timeoutMs) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });

    session.disconnect();

    return {
      success: responseReceived,
      userTranscript,
      agentResponse,
      latencyMs: Date.now() - startTime,
      error: responseReceived ? undefined : 'Timeout waiting for response',
    };
  } catch (error) {
    return {
      success: false,
      userTranscript: null,
      agentResponse: null,
      latencyMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
