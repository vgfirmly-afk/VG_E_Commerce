// src/utils/tracing.js
// Correct resolveConfig for @microlabs/otel-cf-workers.
// Important: return `service: { name: ... }` (not `serviceName`).

export function resolveConfig(env = {}) {
  // env may be undefined in some init contexts; guard with default {}
  const SERVICE_NAME = env.SERVICE_NAME || 'Checkout_Worker_Service';
  const API_KEY = env.HONEYCOMB_API_KEY || env.HONEYCOMB_API_KEY_SECRET || '';
  const DATASET = env.HONEYCOMB_DATASET || 'workers-traces';

  // define sample rate (1 of 10 traces)
  const SAMPLE_RATE = 10;

  return {
    // exporter shape expected by the library
    exporter: {
      url: 'https://api.honeycomb.io/v1/traces',
      headers: {
        'x-honeycomb-team': API_KEY,
        'x-honeycomb-dataset': DATASET,
      },
    },

    // <-- **this** is the important part the library expects
    service: {
      name: SERVICE_NAME,
    },
    includeTraceContext: true,
    // add custom sampling + resource attributes
    sampling: {
      type: "probabilistic",
      probability: 0.1,
    },
  };
}

