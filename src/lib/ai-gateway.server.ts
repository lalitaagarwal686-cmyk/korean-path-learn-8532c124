import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

/** Server-only helper that connects the AI SDK to the Lovable AI Gateway. */
export function createLovableAiGatewayProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "lovable-ai-gateway",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: { "Lovable-API-Key": apiKey },
  });
}

export const TUTOR_MODEL = "google/gemini-3.6-flash";
