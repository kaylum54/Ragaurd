import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { hashApiKey } from '@/lib/utils/hash';

// Request validation schema
const defendRequestSchema = z.object({
  input: z.string().min(1, 'Input is required').max(10000, 'Input too long'),
  profile: z.enum(['strict', 'balanced', 'permissive']).default('balanced'),
});

// Mock defense response - In production, this would call the actual defense service
async function callDefenseService(input: string, profile: string) {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 100));

  // Simple mock detection logic
  const lowerInput = input.toLowerCase();
  const attacks = [
    { pattern: 'ignore', category: 'prompt_injection', layer: 'semantic_analysis' },
    { pattern: 'system prompt', category: 'data_exfiltration', layer: 'pattern_matching' },
    { pattern: 'jailbreak', category: 'jailbreak', layer: 'llm_guard' },
    { pattern: 'dan', category: 'jailbreak', layer: 'semantic_analysis' },
    { pattern: 'pretend', category: 'role_manipulation', layer: 'context_validation' },
    { pattern: 'instructions', category: 'prompt_injection', layer: 'embedding_similarity' },
  ];

  for (const attack of attacks) {
    if (lowerInput.includes(attack.pattern)) {
      return {
        allowed: false,
        blocked_by: attack.layer,
        threat_category: attack.category,
        confidence: 0.94 + Math.random() * 0.05,
        latency_ms: Math.floor(80 + Math.random() * 100),
        layers: [
          { name: 'pattern_matching', passed: attack.layer !== 'pattern_matching' },
          { name: 'semantic_analysis', passed: attack.layer !== 'semantic_analysis' },
          { name: 'embedding_similarity', passed: attack.layer !== 'embedding_similarity' },
          { name: 'llm_guard', passed: attack.layer !== 'llm_guard' },
          { name: 'context_validation', passed: attack.layer !== 'context_validation' },
          { name: 'output_filtering', passed: true },
        ],
      };
    }
  }

  return {
    allowed: true,
    latency_ms: Math.floor(80 + Math.random() * 100),
    layers: [
      { name: 'pattern_matching', passed: true },
      { name: 'semantic_analysis', passed: true },
      { name: 'embedding_similarity', passed: true },
      { name: 'llm_guard', passed: true },
      { name: 'context_validation', passed: true },
      { name: 'output_filtering', passed: true },
    ],
  };
}

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const apiKey = authHeader.replace('Bearer ', '');

    // Validate API key format
    if (!apiKey.startsWith('rg_live_') && !apiKey.startsWith('rg_test_')) {
      return NextResponse.json(
        { error: 'Invalid API key format' },
        { status: 401 }
      );
    }

    // In production, validate the API key against the database
    // const keyHash = hashApiKey(apiKey);
    // const validKey = await db.query('SELECT * FROM api_keys WHERE key_hash = $1', [keyHash]);

    // Parse and validate request body
    const body = await request.json();
    const validationResult = defendRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { input, profile } = validationResult.data;

    // Call defense service
    const result = await callDefenseService(input, profile);

    // Log the request (in production, save to database)
    // await logRequest(orgId, apiKeyId, result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Defense API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
}
