// src/utils/tracing.js
// Correct resolveConfig for @microlabs/otel-cf-workers.
// Important: return `service: { name: ... }` (not `serviceName`).

export function resolveConfig(env = {}) {
  // env may be undefined in some init contexts; guard with default {}
  const SERVICE_NAME = env.SERVICE_NAME || 'Auth_Worker_Service';
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
    // optional: sane defaults for library (you can add more)
    // sampling: { /* ... */ },
    // resourceAttributes: { env: env.ENVIRONMENT || 'dev' },
  };
}



// // src/tracing.js
// import { ResolveConfigFn } from '@microlabs/otel-cf-workers';

// /**
//  * Resolve config for the otel-cf-workers instrument() wrapper.
//  * env will be the Worker environment (so secrets/vars defined in wrangler)
//  */
// export const resolveConfig = (env) => ({
//   serviceName: env.SERVICE_NAME ?? 'cloudflare-worker-microservice',
//   exporter: {
//     // Honeycomb supports OTLP over HTTP; this library accepts `url` + `headers`.
//     url: 'https://api.honeycomb.io:443/v1/traces',
//     headers: {
//       // x-honeycomb-team is the Honeycomb API key header
//       'x-honeycomb-team': env.HONEYCOMB_API_KEY,
//       // optionally set dataset
//       'x-honeycomb-dataset': env.HONEYCOMB_DATASET || 'workers-traces',
//     },
//     // optional: additional exporter options the library might accept
//   },
// });
