// test/utils/logger.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import {
  logger,
  logError,
  logWarn,
  logInfo,
  logDebug,
} from "../../src/utils/logger.js";
import { trace, context } from "@opentelemetry/api";
import { createMockSpan } from "../setup.js";

describe("Logger Utils", () => {
  let mockSpan;
  let originalGetSpan;

  beforeEach(() => {
    mockSpan = createMockSpan();
    originalGetSpan = trace.getSpan;
    sinon.stub(trace, "getSpan").returns(mockSpan);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("logger", () => {
    it("should log event with metadata", () => {
      logger("test.event", { userId: "123", action: "test" });

      expect(mockSpan.addEvent).to.have.been.called;
      const eventCall = mockSpan.addEvent.getCall(0);
      expect(eventCall.args[0]).to.equal("test.event");
    });

    it("should redact sensitive data", () => {
      logger("test.event", {
        email: "test@example.com",
        password: "secret",
        refreshToken: "token",
      });

      const eventCall = mockSpan.addEvent.getCall(0);
      const meta = eventCall.args[1];
      expect(meta.password).to.not.exist;
      expect(meta.refreshToken).to.not.exist;
      expect(meta.email).to.include("***");
    });

    it("should add log to span attribute", () => {
      logger("test.event", { data: "value" });

      expect(mockSpan.setAttribute).to.have.been.called;
      expect(mockSpan.setAttribute.getCall(0).args[0]).to.equal("log");
    });

    it("should work without active span", () => {
      trace.getSpan.restore();
      sinon.stub(trace, "getSpan").returns(null);

      // Should not throw
      expect(() => logger("test.event", {})).to.not.throw();
    });
  });

  describe("logError", () => {
    it("should log error with exception", () => {
      const error = new Error("Test error");
      logError("Error message", error, { context: "test" });

      expect(mockSpan.recordException).to.have.been.calledWith(error);
      expect(mockSpan.setStatus).to.have.been.called;
    });

    it("should log error without exception object", () => {
      logError("Error message", null, { context: "test" });

      expect(mockSpan.addEvent).to.have.been.called;
      expect(mockSpan.setStatus).to.have.been.called;
    });

    it("should set error status on span", () => {
      logError("Error message", null);

      const statusCall = mockSpan.setStatus.getCall(0);
      expect(statusCall.args[0].code).to.equal(2); // ERROR status
    });
  });

  describe("logWarn", () => {
    it("should log warning", () => {
      logWarn("Warning message", { context: "test" });

      expect(mockSpan.addEvent).to.have.been.called;
      const eventCall = mockSpan.addEvent.getCall(0);
      expect(eventCall.args[0]).to.equal("Warning message"); // logWarn uses message as event name
    });
  });

  describe("logInfo", () => {
    it("should log info message", () => {
      logInfo("Info message", { context: "test" });

      expect(mockSpan.addEvent).to.have.been.called;
      const eventCall = mockSpan.addEvent.getCall(0);
      expect(eventCall.args[0]).to.equal("Info message"); // logInfo uses message as event name
    });
  });

  describe("logDebug", () => {
    it("should not log when DEBUG not enabled", () => {
      const originalEnv = process.env.DEBUG;
      delete process.env.DEBUG;

      logDebug("Debug message", { context: "test" });

      expect(mockSpan.addEvent).to.not.have.been.called;

      if (originalEnv) process.env.DEBUG = originalEnv;
    });
  });
});
