// utils/traceLogger.js
// Trace-aware console.log/error/warn replacements
// These functions automatically attach logs to OpenTelemetry traces

import { trace, context } from '@opentelemetry/api';

/**
 * Gets the current trace context
 */
function getTraceContext() {
  const span = trace.getSpan(context.active());
  if (!span) {
    return { traceId: 'none', spanId: 'none' };
  }
  const spanContext = span.spanContext();
  return {
    traceId: spanContext.traceId || 'none',
    spanId: spanContext.spanId || 'none',
  };
}

/**
 * Adds a log event to the active span
 */
function addLogToSpan(level, message, meta = {}) {
  const span = trace.getSpan(context.active());
  if (span) {
    span.addEvent(level, {
      message,
      ...meta,
      timestamp: Date.now(),
    });
  }
}

/**
 * Trace-aware console.log replacement
 */
export function traceLog(...args) {
  const { traceId, spanId } = getTraceContext();
  
  // Format the log message
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
  ).join(' ');

  // Add to span
  addLogToSpan('log', message);

  // Output to console with trace context
  console.log(`[trace:${traceId.substring(0, 16)}...]`, ...args);
}

/**
 * Trace-aware console.error replacement
 */
export function traceError(...args) {
  const { traceId, spanId } = getTraceContext();
  const span = trace.getSpan(context.active());
  
  // Format the error message
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
  ).join(' ');

  // Record exception if it's an Error object
  const errorObj = args.find(arg => arg instanceof Error);
  if (span && errorObj) {
    span.recordException(errorObj);
    span.setStatus({ code: 2, message: errorObj.message || message });
  } else if (span) {
    addLogToSpan('error', message);
    span.setStatus({ code: 2, message });
  }

  // Output to console with trace context
  console.error(`[trace:${traceId.substring(0, 16)}...]`, ...args);
}

/**
 * Trace-aware console.warn replacement
 */
export function traceWarn(...args) {
  const { traceId, spanId } = getTraceContext();
  
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
  ).join(' ');

  addLogToSpan('warn', message);

  console.warn(`[trace:${traceId.substring(0, 16)}...]`, ...args);
}

/**
 * Trace-aware console.info replacement
 */
export function traceInfo(...args) {
  const { traceId, spanId } = getTraceContext();
  
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
  ).join(' ');

  addLogToSpan('info', message);

  console.log(`[trace:${traceId.substring(0, 16)}...]`, ...args);
}

