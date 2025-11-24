// test/utils/tracing.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import { resolveConfig } from "../../src/utils/tracing.js";

describe("Tracing Utils", () => {
  describe("resolveConfig", () => {
    it("should return config with default values", () => {
      const config = resolveConfig();

      expect(config).to.exist;
      expect(config.service.name).to.equal("Auth_Worker_Service");
      expect(config.exporter.url).to.equal(
        "https://api.honeycomb.io/v1/traces",
      );
      expect(config.sampling.probability).to.equal(0.1);
    });

    it("should use env SERVICE_NAME if provided", () => {
      const env = { SERVICE_NAME: "CustomService" };
      const config = resolveConfig(env);

      expect(config.service.name).to.equal("CustomService");
    });

    it("should use env HONEYCOMB_API_KEY if provided", () => {
      const env = { HONEYCOMB_API_KEY: "test-api-key" };
      const config = resolveConfig(env);

      expect(config.exporter.headers["x-honeycomb-team"]).to.equal(
        "test-api-key",
      );
    });

    it("should use env HONEYCOMB_API_KEY_SECRET if HONEYCOMB_API_KEY not provided", () => {
      const env = { HONEYCOMB_API_KEY_SECRET: "test-secret-key" };
      const config = resolveConfig(env);

      expect(config.exporter.headers["x-honeycomb-team"]).to.equal(
        "test-secret-key",
      );
    });

    it("should use env HONEYCOMB_DATASET if provided", () => {
      const env = { HONEYCOMB_DATASET: "custom-dataset" };
      const config = resolveConfig(env);

      expect(config.exporter.headers["x-honeycomb-dataset"]).to.equal(
        "custom-dataset",
      );
    });

    it("should use default dataset if not provided", () => {
      const config = resolveConfig({});

      expect(config.exporter.headers["x-honeycomb-dataset"]).to.equal(
        "workers-traces",
      );
    });

    it("should handle undefined env", () => {
      const config = resolveConfig(undefined);

      expect(config).to.exist;
      expect(config.service.name).to.equal("Auth_Worker_Service");
    });
  });
});
