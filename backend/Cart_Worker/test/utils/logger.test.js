// test/utils/logger.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { trace, context } from "@opentelemetry/api";
import { logger, logError, logWarn, logInfo } from "../../src/utils/logger.js";
import { createMockSpan } from "../setup.js";

describe("Logger Utils", () => {
  let mockSpan;
  let originalGetSpan;

  beforeEach(() => {
    mockSpan = createMockSpan();
    originalGetSpan = trace.getSpan;
    trace.getSpan = sinon.stub().returns(mockSpan);
  });

  afterEach(() => {
    trace.getSpan = originalGetSpan;
    sinon.restore();
  });

  describe("logger", () => {
    it("should log event with metadata", () => {
      logger("test.event", { key: "value" });

      expect(trace.getSpan).to.have.been.called;
      expect(mockSpan.setAttribute).to.have.been.called;
      expect(mockSpan.addEvent).to.have.been.called;
    });

    it("should redact sensitive data", () => {
      logger("test.event", {
        password: "secret",
        accessToken: "token",
        refreshToken: "refresh",
        safe: "data",
      });

      expect(mockSpan.setAttribute).to.have.been.called;
      // Check that sensitive fields are not in the log data
      const logCalls = mockSpan.setAttribute.getCalls();
      const logCall = logCalls.find((call) => call.args[0] === "log");
      if (logCall) {
        const logData = JSON.parse(logCall.args[1]);
        expect(logData.some((log) => log.password !== undefined)).to.be.false;
        expect(logData.some((log) => log.accessToken !== undefined)).to.be
          .false;
        expect(logData.some((log) => log.refreshToken !== undefined)).to.be
          .false;
        expect(logData.some((log) => log.safe === "data")).to.be.true;
      }
    });

    it("should handle missing span gracefully", () => {
      trace.getSpan = sinon.stub().returns(null);
      expect(() => logger("test.event", { key: "value" })).to.not.throw();
    });
  });

  describe("logError", () => {
    it("should log error with message", () => {
      const error = new Error("Test error");
      logError("Test message", error, { meta: "data" });

      expect(trace.getSpan).to.have.been.called;
      expect(mockSpan.recordException).to.have.been.calledWith(error);
      expect(mockSpan.setStatus).to.have.been.called;
    });

    it("should log error without error object", () => {
      logError("Test message", null, { meta: "data" });

      expect(trace.getSpan).to.have.been.called;
      expect(mockSpan.setStatus).to.have.been.called;
    });

    it("should handle missing span gracefully", () => {
      trace.getSpan = sinon.stub().returns(null);
      expect(() => logError("Test message", new Error("test"))).to.not.throw();
    });
  });

  describe("logWarn", () => {
    it("should log warning with metadata", () => {
      logWarn("Warning message", { meta: "data" });

      expect(trace.getSpan).to.have.been.called;
      expect(mockSpan.setAttribute).to.have.been.called;
    });

    it("should handle missing span gracefully", () => {
      trace.getSpan = sinon.stub().returns(null);
      expect(() => logWarn("Warning message")).to.not.throw();
    });
  });

  describe("logInfo", () => {
    it("should log info with metadata", () => {
      logInfo("Info message", { meta: "data" });

      expect(trace.getSpan).to.have.been.called;
      expect(mockSpan.setAttribute).to.have.been.called;
    });

    it("should handle missing span gracefully", () => {
      trace.getSpan = sinon.stub().returns(null);
      expect(() => logInfo("Info message")).to.not.throw();
    });
  });
});
