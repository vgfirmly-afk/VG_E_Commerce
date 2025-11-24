// test/utils/logger.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import * as logger from "../../src/utils/logger.js";
import { trace, context } from "@opentelemetry/api";
import { createMockSpan } from "../setup.js";

describe("Logger Utils", () => {
  let mockSpan;
  let traceStub;
  let contextStub;

  beforeEach(() => {
    mockSpan = createMockSpan();
    traceStub = sinon.stub(trace, "getSpan");
    contextStub = sinon.stub(context, "active");

    // Mock console methods
    sinon.stub(console, "log");
    sinon.stub(console, "warn");
    sinon.stub(console, "error");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("logger", () => {
    it("should log event with meta data", () => {
      traceStub.returns(mockSpan);
      contextStub.returns({});

      logger.logger("test.event", { key: "value" });

      expect(mockSpan.addEvent).to.have.been.called;
      expect(mockSpan.setAttribute).to.have.been.called;
      expect(console.log).to.have.been.called;
    });

    it("should redact sensitive data", () => {
      traceStub.returns(mockSpan);
      contextStub.returns({});

      logger.logger("test.event", {
        password: "secret",
        accessToken: "token",
        refreshToken: "refresh",
        safeField: "value",
      });

      const setAttributeCalls = mockSpan.setAttribute.getCalls();
      const logCall = setAttributeCalls.find((call) => call.args[0] === "log");
      expect(logCall).to.exist;

      const logData = JSON.parse(logCall.args[1]);
      // logData is an array of logs, check the first one
      const firstLog = Array.isArray(logData) ? logData[0] : logData;
      expect(firstLog).to.not.have.property("password");
      expect(firstLog).to.not.have.property("accessToken");
      expect(firstLog).to.not.have.property("refreshToken");
      expect(firstLog).to.have.property("safeField");
    });

    it("should work without active span", () => {
      traceStub.returns(null);
      contextStub.returns({});

      logger.logger("test.event", { key: "value" });

      expect(console.log).to.have.been.called;
    });
  });

  describe("logError", () => {
    it("should log error with span", () => {
      traceStub.returns(mockSpan);
      contextStub.returns({});

      const error = new Error("Test error");
      logger.logError("Error message", error, { meta: "data" });

      expect(mockSpan.recordException).to.have.been.calledWith(error);
      expect(mockSpan.setStatus).to.have.been.calledWith({
        code: 2,
        message: "Error message",
      });
      expect(mockSpan.setAttribute).to.have.been.called;
    });

    it("should log error without error object", () => {
      traceStub.returns(mockSpan);
      contextStub.returns({});

      logger.logError("Error message", null, { meta: "data" });

      expect(mockSpan.setStatus).to.have.been.calledWith({
        code: 2,
        message: "Error message",
      });
      expect(mockSpan.recordException).to.not.have.been.called;
    });

    it("should work without active span", () => {
      traceStub.returns(null);
      contextStub.returns({});

      const error = new Error("Test error");
      logger.logError("Error message", error);

      // Should not throw
      expect(true).to.be.true;
    });
  });

  describe("logWarn", () => {
    it("should log warning with span", () => {
      traceStub.returns(mockSpan);
      contextStub.returns({});

      logger.logWarn("Warning message", { meta: "data" });

      expect(mockSpan.addEvent).to.have.been.called;
      expect(mockSpan.setAttribute).to.have.been.called;
    });

    it("should include trace and span IDs", () => {
      traceStub.returns(mockSpan);
      contextStub.returns({});

      logger.logWarn("Warning message");

      expect(mockSpan.spanContext).to.have.been.called;
    });

    it("should work without active span", () => {
      traceStub.returns(null);
      contextStub.returns({});

      logger.logWarn("Warning message");

      // Should not throw
      expect(true).to.be.true;
    });
  });

  describe("logInfo", () => {
    it("should log info with span", () => {
      traceStub.returns(mockSpan);
      contextStub.returns({});

      logger.logInfo("Info message", { meta: "data" });

      expect(mockSpan.addEvent).to.have.been.called;
      expect(mockSpan.setAttribute).to.have.been.called;
    });

    it("should include trace and span IDs", () => {
      traceStub.returns(mockSpan);
      contextStub.returns({});

      logger.logInfo("Info message");

      expect(mockSpan.spanContext).to.have.been.called;
    });

    it("should work without active span", () => {
      traceStub.returns(null);
      contextStub.returns({});

      logger.logInfo("Info message");

      // Should not throw
      expect(true).to.be.true;
    });
  });
});
