// test/utils/logger.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import * as logger from "../../src/utils/logger.js";
import { trace, context } from "@opentelemetry/api";

describe("Logger Utils", () => {
  let mockSpan;

  beforeEach(() => {
    sinon.restore();
    mockSpan = {
      setAttribute: sinon.stub(),
      addEvent: sinon.stub(),
      recordException: sinon.stub(),
      setStatus: sinon.stub(),
      spanContext: sinon.stub().returns({
        traceId: "trace-123",
        spanId: "span-456",
      }),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("logger", () => {
    it("should log with span", () => {
      sinon.stub(trace, "getSpan").returns(mockSpan);
      sinon.stub(context, "active").returns({});

      logger.logger("test.event", { key: "value" });

      expect(mockSpan.setAttribute).to.have.been.called;
      expect(mockSpan.addEvent).to.have.been.called;
    });

    it("should log without span (span is null)", () => {
      sinon.stub(trace, "getSpan").returns(null);
      sinon.stub(context, "active").returns({});

      // Should not throw
      logger.logger("test.event", { key: "value" });
    });

    it("should redact sensitive data", () => {
      sinon.stub(trace, "getSpan").returns(mockSpan);
      sinon.stub(context, "active").returns({});

      logger.logger("test.event", {
        password: "secret",
        accessToken: "token",
        refreshToken: "refresh",
        safe: "data",
      });

      expect(mockSpan.setAttribute).to.have.been.called;
      const logData = JSON.parse(mockSpan.setAttribute.getCall(0).args[1]);
      expect(logData[0]).to.not.have.property("password");
      expect(logData[0]).to.not.have.property("accessToken");
      expect(logData[0]).to.not.have.property("refreshToken");
      expect(logData[0]).to.have.property("safe");
    });

    it("should handle logData with level field", () => {
      sinon.stub(trace, "getSpan").returns(mockSpan);
      sinon.stub(context, "active").returns({});

      logger.logger("test.event", { level: "info" });

      expect(mockSpan.setAttribute).to.have.been.calledWith(
        "log.level",
        "info",
      );
    });

    it("should handle logData with message field", () => {
      sinon.stub(trace, "getSpan").returns(mockSpan);
      sinon.stub(context, "active").returns({});

      logger.logger("test.event", { message: "test message" });

      expect(mockSpan.setAttribute).to.have.been.calledWith(
        "log.message",
        "test message",
      );
    });

    it("should handle logData with event field", () => {
      sinon.stub(trace, "getSpan").returns(mockSpan);
      sinon.stub(context, "active").returns({});

      logger.logger("test.event", { event: "custom.event" });

      expect(mockSpan.setAttribute).to.have.been.calledWith(
        "log.event",
        "custom.event",
      );
    });
  });

  describe("logError", () => {
    it("should log error with span and error object", () => {
      sinon.stub(trace, "getSpan").returns(mockSpan);
      sinon.stub(context, "active").returns({});

      const error = new Error("Test error");
      logger.logError("Error message", error, { meta: "data" });

      expect(mockSpan.setAttribute).to.have.been.called;
      expect(mockSpan.recordException).to.have.been.calledWith(error);
      expect(mockSpan.setStatus).to.have.been.calledWith({
        code: 2,
        message: "Error message",
      });
    });

    it("should log error with span but no error object", () => {
      sinon.stub(trace, "getSpan").returns(mockSpan);
      sinon.stub(context, "active").returns({});

      logger.logError("Error message", null, { meta: "data" });

      expect(mockSpan.setAttribute).to.have.been.called;
      expect(mockSpan.recordException).to.not.have.been.called;
      expect(mockSpan.setStatus).to.have.been.calledWith({
        code: 2,
        message: "Error message",
      });
    });

    it("should log error without span", () => {
      sinon.stub(trace, "getSpan").returns(null);
      sinon.stub(context, "active").returns({});

      const error = new Error("Test error");
      // Should not throw
      logger.logError("Error message", error, { meta: "data" });
    });
  });

  describe("logWarn", () => {
    it("should log warning with span", () => {
      sinon.stub(trace, "getSpan").returns(mockSpan);
      sinon.stub(context, "active").returns({});

      logger.logWarn("Warning message", { meta: "data" });

      expect(mockSpan.setAttribute).to.have.been.called;
      const logData = JSON.parse(mockSpan.setAttribute.getCall(0).args[1]);
      expect(logData[0]).to.have.property("trace_id", "trace-123");
      expect(logData[0]).to.have.property("span_id", "span-456");
    });

    it("should log warning without span", () => {
      sinon.stub(trace, "getSpan").returns(null);
      sinon.stub(context, "active").returns({});

      logger.logWarn("Warning message", { meta: "data" });

      // Should not throw, trace_id and span_id should be "none"
    });
  });

  describe("logInfo", () => {
    it("should log info with span", () => {
      sinon.stub(trace, "getSpan").returns(mockSpan);
      sinon.stub(context, "active").returns({});

      logger.logInfo("Info message", { meta: "data" });

      expect(mockSpan.setAttribute).to.have.been.called;
      const logData = JSON.parse(mockSpan.setAttribute.getCall(0).args[1]);
      expect(logData[0]).to.have.property("trace_id", "trace-123");
      expect(logData[0]).to.have.property("span_id", "span-456");
    });

    it("should log info without span", () => {
      sinon.stub(trace, "getSpan").returns(null);
      sinon.stub(context, "active").returns({});

      logger.logInfo("Info message", { meta: "data" });

      // Should not throw, trace_id and span_id should be "none"
    });
  });
});
