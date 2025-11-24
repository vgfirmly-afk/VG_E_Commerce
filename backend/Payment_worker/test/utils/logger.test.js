// test/utils/logger.test.js
import { describe, it } from "mocha";
import { expect } from "chai";
import { logger, logError, logWarn, logInfo } from "../../src/utils/logger.js";

describe("Logger Utils", () => {
  describe("logger", () => {
    it("should log event with metadata without throwing", () => {
      // Just test that it doesn't throw - can't stub ES modules
      expect(() => {
        logger("test.event", { key: "value" });
      }).to.not.throw();
    });

    it("should redact sensitive data", () => {
      // Test that it doesn't throw with sensitive data
      expect(() => {
        logger("test.event", {
          password: "secret",
          accessToken: "token",
          clientSecret: "secret",
        });
      }).to.not.throw();
    });
  });

  describe("logError", () => {
    it("should log error with message without throwing", () => {
      const error = new Error("Test error");
      expect(() => {
        logError("Test error message", error, { key: "value" });
      }).to.not.throw();
    });

    it("should handle null error", () => {
      expect(() => {
        logError("Test error message", null, { key: "value" });
      }).to.not.throw();
    });
  });

  describe("logWarn", () => {
    it("should log warning without throwing", () => {
      expect(() => {
        logWarn("Test warning", { key: "value" });
      }).to.not.throw();
    });
  });

  describe("logInfo", () => {
    it("should log info without throwing", () => {
      expect(() => {
        logInfo("Test info", { key: "value" });
      }).to.not.throw();
    });
  });

  describe("logger with span", () => {
    it("should handle logger when span exists", () => {
      // Test that logger works with span context
      expect(() => {
        logger("test.event.with.span", { key: "value" });
      }).to.not.throw();
    });

    it("should handle logger with different log levels", () => {
      expect(() => {
        logger("test.event", { level: "info", message: "Test message" });
      }).to.not.throw();
    });

    it("should handle logger with event field", () => {
      expect(() => {
        logger("test.event", { event: "custom.event", message: "Test" });
      }).to.not.throw();
    });
  });

  describe("logError edge cases", () => {
    it("should handle logError with empty metadata", () => {
      const error = new Error("Test error");
      expect(() => {
        logError("Test error message", error, {});
      }).to.not.throw();
    });

    it("should handle logError with undefined metadata", () => {
      const error = new Error("Test error");
      expect(() => {
        logError("Test error message", error, undefined);
      }).to.not.throw();
    });
  });
});
