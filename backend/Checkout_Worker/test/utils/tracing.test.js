// test/utils/tracing.test.js
import { describe, it } from "mocha";
import { expect } from "chai";
import { resolveConfig } from "../../src/utils/tracing.js";

describe("Tracing Utils", () => {
  describe("resolveConfig", () => {
    it("should return config with default values", () => {
      const config = resolveConfig({});

      expect(config).to.have.property("service");
      expect(config.service.name).to.equal("Checkout_Worker_Service");
      expect(config).to.have.property("exporter");
      expect(config).to.have.property("sampling");
    });

    it("should use SERVICE_NAME from env", () => {
      const env = { SERVICE_NAME: "Custom_Service" };
      const config = resolveConfig(env);

      expect(config.service.name).to.equal("Custom_Service");
    });

    it("should use HONEYCOMB_API_KEY from env", () => {
      const env = { HONEYCOMB_API_KEY: "test-key" };
      const config = resolveConfig(env);

      expect(config.exporter.headers["x-honeycomb-team"]).to.equal("test-key");
    });

    it("should use HONEYCOMB_API_KEY_SECRET as fallback", () => {
      const env = { HONEYCOMB_API_KEY_SECRET: "secret-key" };
      const config = resolveConfig(env);

      expect(config.exporter.headers["x-honeycomb-team"]).to.equal(
        "secret-key",
      );
    });

    it("should use HONEYCOMB_DATASET from env", () => {
      const env = { HONEYCOMB_DATASET: "custom-dataset" };
      const config = resolveConfig(env);

      expect(config.exporter.headers["x-honeycomb-dataset"]).to.equal(
        "custom-dataset",
      );
    });

    it("should handle undefined env", () => {
      const config = resolveConfig(undefined);

      expect(config).to.have.property("service");
      expect(config.service.name).to.equal("Checkout_Worker_Service");
    });

    it("should have correct exporter URL", () => {
      const config = resolveConfig({});

      expect(config.exporter.url).to.equal(
        "https://api.honeycomb.io/v1/traces",
      );
    });

    it("should have sampling configuration", () => {
      const config = resolveConfig({});

      expect(config.sampling.type).to.equal("probabilistic");
      expect(config.sampling.probability).to.equal(0.1);
    });
  });
});
