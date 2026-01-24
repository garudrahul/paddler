import { useCallback } from "react";

import { ChatTemplateSchema } from "../schemas/ChatTemplate";
import { useFetchJson } from "./useFetchJson";

const responseSchema = ChatTemplateSchema.nullable();

export function useChatTemplateOverride({
  agentId,
  fetchBaseAddr,
}: {
  agentId: string;
  fetchBaseAddr: string;
}) {
  const produceFetchPromise = useCallback(
    function (signal: AbortSignal) {
      return fetch(
        `${fetchBaseAddr}/api/v1/agent/${agentId}/chat_template_override`,
        {
          signal,
        },
      );
    },
    [agentId, fetchBaseAddr],
  );

  const result = useFetchJson({
    produceFetchPromise,
    responseSchema,
  });

  return result;
}
