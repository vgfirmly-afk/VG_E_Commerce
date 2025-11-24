// utils/logger.js
import { trace, context } from "@opentelemetry/api";

// Store logs array per span (using WeakMap to avoid memory leaks)
const spanLogs = new WeakMap();

/**
 * Helper to add log to span as attribute (appears as log field in Honeycomb)
 * Accumulates all logs in an array so all logs appear in the trace
 */
function addLogToSpan(span, logData) {
  if (!span) return;

  // Get or create logs array for this span
  let logs = spanLogs.get(span);
  if (!logs) {
    logs = [];
    spanLogs.set(span, logs);
  }

  // Add new log to array
  logs.push(logData);

  // Store all logs as JSON array in span attribute
  // This will appear as a "log" field in Honeycomb traces with all logs
  const logsJson = JSON.stringify(logs);
  span.setAttribute("log", logsJson);

  // Also add the latest log's individual fields for better querying
  if (logData.level) span.setAttribute("log.level", logData.level);
  if (logData.message) span.setAttribute("log.message", logData.message);
  if (logData.event) span.setAttribute("log.event", logData.event);

  // Add as event as well for timeline view
  span.addEvent(logData.event || logData.message || "log", {
    ...logData,
    timestamp: Date.now(),
  });
}

/**
 * Trace-aware logger that attaches logs to OpenTelemetry spans
 * Logs are added as attributes to the active span so they appear as fields in traces
 */
export function logger(event, meta = {}) {
  // Get active span from OpenTelemetry context
  const span = trace.getSpan(context.active());

  // Redact sensitive data
  const safeMeta = { ...meta };
  delete safeMeta.password;
  delete safeMeta.accessToken;
  delete safeMeta.refreshToken;

  const logData = {
    ts: new Date().toISOString(),
    event,
    level: "info",
    ...safeMeta,
  };

  // Add log to span as attribute (appears as log field in trace)
  addLogToSpan(span, logData);

  // Also output to console with trace context
  console.log("[utils/logger]", JSON.stringify(logData));
}

/**
 * Trace-aware error logger
 */
export function logError(message, error = null, meta = {}) {
  const span = trace.getSpan(context.active());

  const errorData = {
    ts: new Date().toISOString(),
    level: "error",
    message,
    error: error
      ? {
          message: error.message,
          stack: error.stack,
          name: error.name,
        }
      : null,
    ...meta,
  };

  // Add log to span as attribute
  addLogToSpan(span, errorData);

  // Record exception in span
  if (span && error) {
    span.recordException(error);
    span.setStatus({ code: 2, message: message }); // ERROR status
  } else if (span) {
    span.setStatus({ code: 2, message: message });
  }

  // console.error(JSON.stringify(errorData));
}

/**
 * Trace-aware warning logger
 */
export function logWarn(message, meta = {}) {
  const span = trace.getSpan(context.active());
  const traceId = span ? span.spanContext().traceId : "none";
  const spanId = span ? span.spanContext().spanId : "none";

  const warnData = {
    ts: new Date().toISOString(),
    level: "warn",
    message,
    ...meta,
    trace_id: traceId,
    span_id: spanId,
  };

  // Add log to span as attribute
  addLogToSpan(span, warnData);

  // console.warn(JSON.stringify(warnData));
}

/**
 * Trace-aware info logger
 */
export function logInfo(message, meta = {}) {
  const span = trace.getSpan(context.active());
  const traceId = span ? span.spanContext().traceId : "none";
  const spanId = span ? span.spanContext().spanId : "none";

  const infoData = {
    ts: new Date().toISOString(),
    level: "info",
    message,
    ...meta,
    trace_id: traceId,
    span_id: spanId,
  };

  // Add log to span as attribute
  addLogToSpan(span, infoData);

  // console.log(JSON.stringify(infoData));
}
