// test/utils/logger.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import * as opentelemetry from "@opentelemetry/api";
import { logger, logError, logWarn, logInfo } from "../../src/utils/logger.js";

describe("Logger Utils", () => {
  let mockSpan;
  let getSpanStub;

  beforeEach(() => {
    mockSpan = {
      spanContext: sinon.stub().returns({
        traceId: "test-trace-id",
        spanId: "test-span-id",
      }),
      addEvent: sinon.stub(),
      setAttribute: sinon.stub(),
      recordException: sinon.stub(),
      setStatus: sinon.stub(),
    };

    getSpanStub = sinon.stub(opentelemetry.trace, "getSpan").returns(mockSpan);
    sinon.stub(opentelemetry.context, "active").returns({});
    sinon.stub(console, "log");
    sinon.stub(console, "error");
    sinon.stub(console, "warn");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("logger", () => {
    it("should log event with metadata", () => {
      logger("test.event", { key: "value" });

      expect(mockSpan.setAttribute).to.have.been.called;
      expect(mockSpan.addEvent).to.have.been.calledWith(
        "test.event",
        sinon.match.object,
      );
      expect(console.log).to.have.been.called;
    });

    it("should redact sensitive data", () => {
      logger("test.event", { password: "secret", key: "value" });

      const callArgs = mockSpan.addEvent.getCall(0).args[1];
      expect(callArgs.password).to.be.undefined;
      expect(callArgs.key).to.equal("value");
    });

    it("should work without active span", () => {
      getSpanStub.returns(null);

      logger("test.event", { key: "value" });

      expect(console.log).to.have.been.called;
    });
  });

  describe("logError", () => {
    it("should log error with metadata", () => {
      const error = new Error("Test error");
      logError("Error message", error, { key: "value" });

      expect(mockSpan.recordException).to.have.been.calledWith(error);
      expect(mockSpan.setStatus).to.have.been.called;
      expect(mockSpan.setAttribute).to.have.been.called;
    });

    it("should log error without error object", () => {
      logError("Error message", null, { key: "value" });

      expect(mockSpan.setStatus).to.have.been.called;
    });

    it("should work without active span", () => {
      getSpanStub.returns(null);

      logError("Error message", new Error("Test"), { key: "value" });

      // Should not throw
      expect(true).to.be.true;
    });
  });

  describe("logWarn", () => {
    it("should log warning with metadata", () => {
      logWarn("Warning message", { key: "value" });

      expect(mockSpan.setAttribute).to.have.been.called;
      expect(mockSpan.addEvent).to.have.been.called;
    });

    it("should work without active span", () => {
      getSpanStub.returns(null);

      logWarn("Warning message", { key: "value" });

      expect(true).to.be.true;
    });
  });

  describe("logInfo", () => {
    it("should log info with metadata", () => {
      logInfo("Info message", { key: "value" });

      expect(mockSpan.setAttribute).to.have.been.called;
      expect(mockSpan.addEvent).to.have.been.called;
    });

    it("should work without active span", () => {
      getSpanStub.returns(null);

      logInfo("Info message", { key: "value" });

      expect(true).to.be.true;
    });
  });
});
