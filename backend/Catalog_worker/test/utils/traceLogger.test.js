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
  let consoleLogStub;
  let consoleErrorStub;
  let consoleWarnStub;

  beforeEach(() => {
    mockSpan = createMockSpan();
    sinon.stub(trace, "getSpan").returns(mockSpan);
    consoleLogStub = sinon.stub(console, "log");
    consoleErrorStub = sinon.stub(console, "error");
    consoleWarnStub = sinon.stub(console, "warn");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("traceLog", () => {
    it("should log message and add to span", () => {
      traceLog("Test message");
      expect(mockSpan.addEvent).to.have.been.called;
      expect(consoleLogStub).to.have.been.called;
    });

    it("should format multiple arguments", () => {
      traceLog("Message", { data: "value" }, 123);
      expect(mockSpan.addEvent).to.have.been.called;
    });

    it("should include trace ID in console output", () => {
      traceLog("Test");
      const consoleCall = consoleLogStub.getCall(0);
      expect(consoleCall.args[0]).to.include("[trace:");
    });
  });

  describe("traceError", () => {
    it("should log error and record exception", () => {
      const error = new Error("Test error");
      traceError(error);
      expect(mockSpan.recordException).to.have.been.calledWith(error);
      expect(mockSpan.setStatus).to.have.been.called;
      expect(consoleErrorStub).to.have.been.called;
    });

    it("should handle non-Error objects", () => {
      traceError("Error message");
      expect(mockSpan.setStatus).to.have.been.called;
      expect(consoleErrorStub).to.have.been.called;
    });

    it("should set error status on span", () => {
      traceError("Error");
      const statusCall = mockSpan.setStatus.getCall(0);
      expect(statusCall.args[0].code).to.equal(2); // ERROR
    });
  });

  describe("traceWarn", () => {
    it("should log warning and add to span", () => {
      traceWarn("Warning message");
      expect(mockSpan.addEvent).to.have.been.called;
      expect(consoleWarnStub).to.have.been.called;
    });
  });

  describe("traceInfo", () => {
    it("should log info and add to span", () => {
      traceInfo("Info message");
      expect(mockSpan.addEvent).to.have.been.called;
      expect(consoleLogStub).to.have.been.called;
    });
  });

  describe("without active span", () => {
    beforeEach(() => {
      trace.getSpan.restore();
      sinon.stub(trace, "getSpan").returns(null);
    });

    it("should handle traceLog without span", () => {
      expect(() => traceLog("Test")).to.not.throw();
      expect(consoleLogStub).to.have.been.called;
    });

    it("should handle traceError without span", () => {
      expect(() => traceError("Error")).to.not.throw();
      expect(consoleErrorStub).to.have.been.called;
    });
  });
});
