import { z } from "zod";

/**
 * Validated request body for POST /api/sessions.
 * Enforces the FR-2.* constraints from docs/02-requirements.md.
 */
export const createSessionSchema = z
  .object({
    scenarioId: z.string().uuid().optional(),
    customTopic: z.string().min(20).max(500).optional(),
    aiRole: z.string().min(1).max(100),
    difficulty: z.enum(["easy", "normal", "challenging"]),
    feedbackMode: z.enum(["natural", "coach"]),
  })
  .refine((v) => Boolean(v.scenarioId) !== Boolean(v.customTopic), {
    message: "Provide exactly one of scenarioId or customTopic",
    path: ["scenarioId"],
  });

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
