import { useCallback } from "react";

import { BalancerDesiredStateSchema } from "../schemas/BalancerDesiredState";
import { useFetchJson } from "./useFetchJson";

export function useBalancerDesiredState({
  fetchBaseAddr,
}: {
  fetchBaseAddr: string;
}) {
  const produceFetchPromise = useCallback(
    function (signal: AbortSignal) {
      return fetch(`${fetchBaseAddr}/api/v1/balancer_desired_state`, {
        signal,
      });
    },
    [fetchBaseAddr],
  );

  const result = useFetchJson({
    produceFetchPromise,
    responseSchema: BalancerDesiredStateSchema,
  });

  return result;
}
