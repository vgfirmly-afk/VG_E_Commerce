// test/utils/traceLogger.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import {
  traceLog,
  traceError,
  traceWarn,
  traceInfo,
} from "../../src/utils/traceLogger.js";
import { trace, context } from "@opentelemetry/api";
import { createMockSpan } from "../setup.js";

describe("Trace Logger Utils", () => {
  let mockSpan;

  beforeEach(() => {
    mockSpan = createMockSpan();
    sinon.stub(trace, "getSpan").returns(mockSpan);
    sinon.stub(console, "log");
    sinon.stub(console, "error");
    sinon.stub(console, "warn");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("traceLog", () => {
    it("should log with trace context", () => {
      traceLog("test message", { key: "value" });

      expect(console.log).to.have.been.called;
      expect(mockSpan.addEvent).to.have.been.calledWith(
        "log",
        sinon.match.object,
      );
    });

    it("should handle multiple arguments", () => {
      traceLog("message1", "message2", { data: "value" });

      expect(console.log).to.have.been.called;
    });
  });

  describe("traceError", () => {
    it("should log error with exception", () => {
      const error = new Error("test error");
      traceError("error message", error);

      expect(console.error).to.have.been.called;
      expect(mockSpan.recordException).to.have.been.calledWith(error);
      expect(mockSpan.setStatus).to.have.been.calledWith({
        code: 2,
        message: "test error",
      });
    });

    it("should log error without exception object", () => {
      traceError("error message", "string error");

      expect(console.error).to.have.been.called;
      expect(mockSpan.addEvent).to.have.been.calledWith(
        "error",
        sinon.match.object,
      );
      expect(mockSpan.setStatus).to.have.been.calledWith({
        code: 2,
        message: sinon.match.string,
      });
    });
  });

  describe("traceWarn", () => {
    it("should log warning with trace context", () => {
      traceWarn("warning message", { key: "value" });

      expect(console.warn).to.have.been.called;
      expect(mockSpan.addEvent).to.have.been.calledWith(
        "warn",
        sinon.match.object,
      );
    });
  });

  describe("traceInfo", () => {
    it("should log info with trace context", () => {
      traceInfo("info message", { key: "value" });

      expect(console.log).to.have.been.called;
      expect(mockSpan.addEvent).to.have.been.calledWith(
        "info",
        sinon.match.object,
      );
    });
  });

  describe("without active span", () => {
    it("should work without active span", () => {
      trace.getSpan.restore();
      sinon.stub(trace, "getSpan").returns(null);

      traceLog("test message");

      expect(console.log).to.have.been.called;
    });
  });
});
