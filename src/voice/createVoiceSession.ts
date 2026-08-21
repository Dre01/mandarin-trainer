import { RealtimeAgent, RealtimeSession, tool } from '@openai/agents/realtime';
import { z } from 'zod';
import type { EvidenceRecord, SessionPayload } from '../domain/types';
import { buildVoiceInstructions } from '../session/buildVoiceInstructions';

const oneEvidenceSchema = z.object({
  targetType: z.enum(['lexeme', 'construction', 'chunk', 'contrast', 'function', 'pronunciation', 'closed_system']),
  targetId: z.string(),
  mode: z.enum(['acquire', 'drill', 'manipulate', 'simulate', 'converse', 'listen', 'test']),
  correct: z.boolean(),
  independent: z.boolean(),
  hintLevel: z.number().int().min(0).max(5),
  listeningLevel: z.number().int().min(1).max(3).optional(),
  contextId: z.string().optional(),
  novelContext: z.boolean().optional(),
  spontaneous: z.boolean().optional(),
  latency: z.enum(['immediate', 'slight', 'long']).optional(),
  pronunciation: z.enum(['blocked', 'unclear', 'acceptable', 'good']).optional(),
  note: z.string().max(240).optional(),
});

const evidenceBatchSchema = z.object({
  records: z.array(oneEvidenceSchema).min(1).max(10),
});

export interface VoiceController {
  session: RealtimeSession;
  mute(value: boolean): void;
  interrupt(): void;
  close(): void;
}

export async function createVoiceSession(
  payload: SessionPayload,
  onEvidence: (record: EvidenceRecord) => void,
): Promise<VoiceController> {
  const evidenceTool = tool({
    name: 'record_learning_evidence',
    description: 'Batch a few meaningful learner-performance observations. Record evidence only; never declare mastery.',
    parameters: evidenceBatchSchema,
    async execute({ records }) {
      const timestamp = new Date().toISOString();
      for (const record of records) {
        onEvidence({
          id: crypto.randomUUID(),
          sessionId: payload.id,
          timestamp,
          ...record,
        } as EvidenceRecord);
      }
      return `recorded ${records.length}`;
    },
  });

  const agent = new RealtimeAgent({
    name: payload.kind === 'calibration' ? 'Mandarin Baseline Calibrator' : 'Mandarin Control Trainer',
    instructions: buildVoiceInstructions(payload),
    tools: [evidenceTool],
  });

  const response = await fetch('/api/realtime-token', { method: 'POST' });
  if (!response.ok) throw new Error(await response.text());
  const tokenData = await response.json() as { value: string };
  if (!tokenData.value) throw new Error('Token endpoint did not return a client secret.');

  const session = new RealtimeSession(agent, {
    model: 'gpt-realtime-2.1',
    config: {
      audio: {
        input: {
          turnDetection: {
            type: 'semantic_vad',
            eagerness: 'low',
            createResponse: true,
            interruptResponse: true,
          },
        },
      },
    },
  });

  await session.connect({ apiKey: tokenData.value });

  return {
    session,
    mute(value) { session.mute(value); },
    interrupt() { session.interrupt(); },
    close() { session.close(); },
  };
}
