// test/utils/tracing.test.js
import { describe, it } from "mocha";
import { expect } from "chai";
import { resolveConfig } from "../../src/utils/tracing.js";
import { createMockEnv } from "../setup.js";

describe("Tracing Utils", () => {
  describe("resolveConfig", () => {
    it("should return config with default values", () => {
      const env = {};
      const config = resolveConfig(env);

      expect(config.service.name).to.equal("Payment_Worker_Service");
      expect(config.exporter).to.exist;
      expect(config.sampling).to.exist;
    });

    it("should use environment variables", () => {
      const env = createMockEnv({
        SERVICE_NAME: "Custom_Service",
        HONEYCOMB_API_KEY: "custom-key",
        HONEYCOMB_DATASET: "custom-dataset",
      });

      const config = resolveConfig(env);

      expect(config.service.name).to.equal("Custom_Service");
      expect(config.exporter.headers["x-honeycomb-team"]).to.equal("custom-key");
      expect(config.exporter.headers["x-honeycomb-dataset"]).to.equal("custom-dataset");
    });

    it("should handle undefined env", () => {
      const config = resolveConfig(undefined);

      expect(config).to.exist;
      expect(config.service.name).to.equal("Payment_Worker_Service");
    });
  });
});

