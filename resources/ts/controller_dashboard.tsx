import React from "react";
import { createRoot } from "react-dom/client";

import { Home } from "./components/Home";
import { PaddlerConfigurationContext } from "./contexts/PaddlerConfigurationContext";

class RootNode {
  constructor(private rootNodeElement: HTMLElement) {}

  getIntFromDataset(key: string): number {
    return parseInt(this.getStringFromDataset(key), 10);
  }

  getStringFromDataset(key: string): string {
    const value = this.rootNodeElement.dataset[key];

    if (value === undefined) {
      throw new Error(`Missing dataset key: ${key}`);
    }

    return value;
  }
}

/**
 * Resolve FETCH base address (streams + GET endpoints).
 * - Asked ONCE per tab
 * - Different tabs can use different backends
 * - Reloading the same tab does NOT ask again
 */
function resolveFetchBaseAddr(rootNode: RootNode): string {
  const STORAGE_KEY = "PADDLER_FETCH_BASE_ADDR";

  // 1️⃣ Per-tab stored value
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored) {
    return stored;
  }

  // 2️⃣ Suggest managementAddr as default (user may change port / protocol)
  const defaultValue = rootNode.getStringFromDataset("managementAddr");

  // 3️⃣ Ask user
  const input = window.prompt(
    "Enter FETCH endpoint for streams & metadata\n\n" +
      "Examples:\n" +
      "  medai.nomineelife.com:9070\n" +
      "  https://medai.nomineelife.com:9070",
    defaultValue,
  );

  if (!input) {
    throw new Error("Fetch endpoint is required to load the admin panel");
  }

  // 4️⃣ Normalize protocol
  const normalized =
    input.startsWith("http://") || input.startsWith("https://")
      ? input
      : `https://${input}`;

  // 5️⃣ Store per tab
  sessionStorage.setItem(STORAGE_KEY, normalized);

  return normalized;
}

const rootNodeElement = document.getElementById("paddler-dashboard");

if (!rootNodeElement) {
  throw new Error("Root node not found");
}

const rootNode = new RootNode(rootNodeElement);

// 🔒 Control-plane address (balancer, agents) — DO NOT TOUCH
const managementAddr = rootNode.getStringFromDataset("managementAddr");

// 🔓 Data-plane address (streams + fetches) — USER-DEFINED PER TAB
const fetchBaseAddr = resolveFetchBaseAddr(rootNode);

const root = createRoot(rootNodeElement);

root.render(
  <PaddlerConfigurationContext.Provider
    value={{
      bufferedRequestTimeoutMillis: rootNode.getIntFromDataset(
        "bufferedRequestTimeoutMillis",
      ),
      compatOpenAIAddr: rootNode.getStringFromDataset("compatOpenaiAddr"),
      inferenceAddr: rootNode.getStringFromDataset("inferenceAddr"),

      managementAddr, // ✅ fixed (balancer / agents)
      fetchBaseAddr,  // ✅ dynamic (streams / GETs)

      maxBufferedRequests: rootNode.getIntFromDataset("maxBufferedRequests"),
      statsdAddr: rootNode.getStringFromDataset("statsdAddr"),
      statsdPrefix: rootNode.getStringFromDataset("statsdPrefix"),
      statsdReportingIntervalMillis: rootNode.getIntFromDataset(
        "statsdReportingIntervalMillis",
      ),
    }}
  >
    <Home />
  </PaddlerConfigurationContext.Provider>,
);
