// test/utils/tracing.test.js
import { describe, it } from "mocha";
import { expect } from "chai";
import { resolveConfig } from "../../src/utils/tracing.js";

describe("Tracing Utils", () => {
  describe("resolveConfig", () => {
    it("should return config with default service name", () => {
      const config = resolveConfig({});
      expect(config.service.name).to.equal("Catalog_Worker_Service");
    });

    it("should use custom service name from env", () => {
      const env = { SERVICE_NAME: "CustomService" };
      const config = resolveConfig(env);
      expect(config.service.name).to.equal("CustomService");
    });

    it("should include exporter configuration", () => {
      const config = resolveConfig({});
      expect(config.exporter).to.exist;
      expect(config.exporter.url).to.equal(
        "https://api.honeycomb.io/v1/traces",
      );
    });

    it("should use HONEYCOMB_API_KEY from env", () => {
      const env = { HONEYCOMB_API_KEY: "test-key" };
      const config = resolveConfig(env);
      expect(config.exporter.headers["x-honeycomb-team"]).to.equal("test-key");
    });

    it("should use HONEYCOMB_API_KEY_SECRET as fallback", () => {
      const env = { HONEYCOMB_API_KEY_SECRET: "test-secret" };
      const config = resolveConfig(env);
      expect(config.exporter.headers["x-honeycomb-team"]).to.equal(
        "test-secret",
      );
    });

    it("should use custom dataset from env", () => {
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

    it("should include sampling configuration", () => {
      const config = resolveConfig({});
      expect(config.sampling).to.exist;
      expect(config.sampling.type).to.equal("probabilistic");
      expect(config.sampling.probability).to.equal(0.1);
    });

    it("should include trace context", () => {
      const config = resolveConfig({});
      expect(config.includeTraceContext).to.be.true;
    });

    it("should handle undefined env gracefully", () => {
      const config = resolveConfig();
      expect(config).to.exist;
      expect(config.service.name).to.equal("Catalog_Worker_Service");
    });
  });
});
