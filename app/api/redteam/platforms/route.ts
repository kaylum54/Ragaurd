import { NextResponse } from 'next/server';

const REDTEAM_SERVICE_URL = process.env.RAGAURD_REDTEAM_URL || 'http://18.188.163.13:8000';
const REQUEST_TIMEOUT = 10000;

// Default platforms as fallback
const DEFAULT_PLATFORMS = [
  { id: 'ragaurd', name: 'Ragaurd Defense', description: 'Test Ragaurd defense stack directly' },
  { id: 'elevenlabs', name: 'ElevenLabs', description: 'ElevenLabs Conversational AI agents' },
  { id: 'vapi', name: 'Vapi', description: 'Vapi voice agents' },
  { id: 'retell', name: 'Retell AI', description: 'Retell AI voice agents' },
  { id: 'bland', name: 'Bland AI', description: 'Bland AI phone agents' },
  { id: 'custom', name: 'Custom', description: 'Custom HTTP endpoint' },
];

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(`${REDTEAM_SERVICE_URL}/v1/redteam/platforms`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Return default platforms as fallback
      return NextResponse.json({ platforms: DEFAULT_PLATFORMS });
    }

    const data = await response.json();
    return NextResponse.json({ platforms: data.platforms || DEFAULT_PLATFORMS });
  } catch (error) {
    console.error('Error fetching platforms:', error);
    // Return default platforms as fallback
    return NextResponse.json({ platforms: DEFAULT_PLATFORMS });
  }
}
