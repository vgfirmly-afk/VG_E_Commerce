// src/middleware/logger.js
import { trace, context } from "@opentelemetry/api";

/**
 * withLogger(handler) -> returns a fetch-style handler
 * Usage: export default withLogger(async (request, env, ctx) => router.handle(request, env, ctx));
 */
export default function withLogger(handler) {
  return async function (request, env, ctx) {
    // active span is available once the otel wrapper has created the request span
    const span = trace.getSpan(context.active());
    const traceId = span ? span.spanContext().traceId : "none";
    const spanId = span ? span.spanContext().spanId : "none";

    // ---- ADD THIS BLOCK: inject Cloudflare Ray ID into the span ----
    if (span) {
      const rayId = request.headers.get("cf-ray");
      const colo = request.cf?.colo;

      if (rayId) span.setAttribute("cfray", rayId);
      if (colo) span.setAttribute("colo", colo);
    }

    // log incoming request (structured) - add to span as event
    if (span) {
      span.addEvent("request.start", {
        method: request.method,
        url: request.url,
        timestamp: Date.now(),
      });
    }
    console.log(
      "[Logger]",
      JSON.stringify({
        ts: new Date().toISOString(),
        msg: `${request.method} ${request.url}`,
        trace_id: traceId,
        span_id: spanId,
      }),
    );

    // call the real handler
    let res;
    try {
      res = await handler(request, env, ctx);
    } catch (err) {
      console.error("[Logger] Handler error:", err);
      res = new Response(
        JSON.stringify({
          error: "internal_error",
          message: err?.message ?? String(err),
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    // ensure response is a Response object and set trace header
    try {
      if (res && res instanceof Response) {
        // Clone response to modify headers (Response headers are immutable)
        const newHeaders = new Headers(res.headers);
        newHeaders.set("x-trace-id", traceId);
        newHeaders.set("x-span-id", spanId);

        // Add response event to span
        if (span) {
          span.addEvent("response.end", {
            status: res.status,
            timestamp: Date.now(),
          });
        }

        // Return new response with trace headers
        return new Response(res.body, {
          status: res.status,
          statusText: res.statusText,
          headers: newHeaders,
        });
      } else {
        console.error("[Logger] Handler did not return a Response:", res);
        return new Response(
          JSON.stringify({
            error: "internal_error",
            message: "Handler did not return a valid response",
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              "x-trace-id": traceId,
              "x-span-id": spanId,
            },
          },
        );
      }
    } catch (e) {
      // never crash logging
      console.error("[Logger] Failed to set trace headers:", e);
      // Return the original response if we can't add headers
      return (
        res ||
        new Response(
          JSON.stringify({
            error: "internal_error",
            message: "Failed to process response",
          }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        )
      );
    }
  };
}

// // src/middleware/logger.js
// import { trace, context } from '@opentelemetry/api';

// // If you use a small middleware stack in index.js/router, mount this middleware first.
// export default async function requestLogger(request, env, ctx, next) {
//   // context.active() inside the request lifecycle contains the active span
//   const span = trace.getSpan(context.active());
//   const traceId = span ? span.spanContext().traceId : 'none';

//   // structured log — replace with your structured logger if you have one
//   console.log(JSON.stringify({
//     ts: new Date().toISOString(),
//     msg: `${request.method} ${request.url}`,
//     trace_id: traceId
//   }));

//   // attach trace id to response header for easier correlation
//   const res = await next(); // call downstream handler
//   res.headers.set('x-trace-id', traceId);
//   return res;
// }
