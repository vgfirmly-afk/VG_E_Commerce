// test/utils/tracing.test.js
import { describe, it } from "mocha";
import { resolveConfig } from "../../src/utils/tracing.js";

describe("Tracing Utils", () => {
  describe("resolveConfig", () => {
    it("should return config with default values when env is empty", () => {
      const config = resolveConfig({});

      expect(config).to.have.property("service");
      expect(config.service).to.have.property("name");
      expect(config.service.name).to.equal("Fulfillment_Worker_Service");
      expect(config).to.have.property("exporter");
      expect(config.exporter).to.have.property("url");
      expect(config.exporter.url).to.equal(
        "https://api.honeycomb.io/v1/traces",
      );
    });

    it("should use SERVICE_NAME from env", () => {
      const env = {
        SERVICE_NAME: "Custom_Service_Name",
      };

      const config = resolveConfig(env);

      expect(config.service.name).to.equal("Custom_Service_Name");
    });

    it("should use HONEYCOMB_API_KEY from env", () => {
      const env = {
        HONEYCOMB_API_KEY: "test-api-key-123",
      };

      const config = resolveConfig(env);

      expect(config.exporter.headers["x-honeycomb-team"]).to.equal(
        "test-api-key-123",
      );
    });

    it("should use HONEYCOMB_API_KEY_SECRET if HONEYCOMB_API_KEY not present", () => {
      const env = {
        HONEYCOMB_API_KEY_SECRET: "secret-api-key",
      };

      const config = resolveConfig(env);

      expect(config.exporter.headers["x-honeycomb-team"]).to.equal(
        "secret-api-key",
      );
    });

    it("should use HONEYCOMB_DATASET from env", () => {
      const env = {
        HONEYCOMB_DATASET: "custom-dataset",
      };

      const config = resolveConfig(env);

      expect(config.exporter.headers["x-honeycomb-dataset"]).to.equal(
        "custom-dataset",
      );
    });

    it("should default to workers-traces dataset", () => {
      const config = resolveConfig({});

      expect(config.exporter.headers["x-honeycomb-dataset"]).to.equal(
        "workers-traces",
      );
    });

    it("should include sampling configuration", () => {
      const config = resolveConfig({});

      expect(config).to.have.property("sampling");
      expect(config.sampling).to.have.property("type", "probabilistic");
      expect(config.sampling).to.have.property("probability", 0.1);
    });

    it("should include includeTraceContext", () => {
      const config = resolveConfig({});

      expect(config.includeTraceContext).to.be.true;
    });

    it("should handle undefined env", () => {
      const config = resolveConfig();

      expect(config).to.exist;
      expect(config.service.name).to.equal("Fulfillment_Worker_Service");
    });

    it("should prefer HONEYCOMB_API_KEY over HONEYCOMB_API_KEY_SECRET", () => {
      const env = {
        HONEYCOMB_API_KEY: "primary-key",
        HONEYCOMB_API_KEY_SECRET: "secret-key",
      };

      const config = resolveConfig(env);

      expect(config.exporter.headers["x-honeycomb-team"]).to.equal(
        "primary-key",
      );
    });
  });
});
