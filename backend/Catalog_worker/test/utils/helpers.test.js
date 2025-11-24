// test/utils/helpers.test.js
import { describe, it } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import {
  generateSlug,
  generateUniqueSlug,
  generateSkuCode,
} from "../../src/utils/helpers.js";

describe("Helper Utils", () => {
  describe("generateSlug", () => {
    it("should generate a URL-friendly slug from text", () => {
      expect(generateSlug("Hello World")).to.equal("hello-world");
    });

    it("should handle empty string", () => {
      expect(generateSlug("")).to.equal("");
    });

    it("should handle null or undefined", () => {
      expect(generateSlug(null)).to.equal("");
      expect(generateSlug(undefined)).to.equal("");
    });

    it("should remove special characters", () => {
      expect(generateSlug("Test!@#$%^&*()Product")).to.equal("testproduct");
    });

    it("should replace multiple spaces with single hyphen", () => {
      expect(generateSlug("Test    Product   Name")).to.equal(
        "test-product-name",
      );
    });

    it("should trim hyphens from start and end", () => {
      expect(generateSlug("-Test Product-")).to.equal("test-product");
    });

    it("should replace multiple hyphens with single", () => {
      expect(generateSlug("Test---Product")).to.equal("test-product");
    });

    it("should convert to lowercase", () => {
      expect(generateSlug("UPPERCASE TEXT")).to.equal("uppercase-text");
    });
  });

  describe("generateUniqueSlug", () => {
    it("should return base slug if it does not exist", async () => {
      const slugExistsFn = sinon.stub().resolves(false);
      const result = await generateUniqueSlug("test-product", slugExistsFn);
      expect(result).to.equal("test-product");
      expect(slugExistsFn).to.have.been.calledOnce;
    });

    it("should append number if base slug exists", async () => {
      const slugExistsFn = sinon
        .stub()
        .onCall(0)
        .resolves(true) // Base slug exists
        .onCall(1)
        .resolves(false); // test-product-1 doesn't exist
      const result = await generateUniqueSlug("test-product", slugExistsFn);
      expect(result).to.equal("test-product-1");
      expect(slugExistsFn).to.have.been.calledTwice;
    });

    it("should increment number until unique slug found", async () => {
      const slugExistsFn = sinon
        .stub()
        .onCall(0)
        .resolves(true) // Base exists
        .onCall(1)
        .resolves(true) // -1 exists
        .onCall(2)
        .resolves(true) // -2 exists
        .onCall(3)
        .resolves(false); // -3 doesn't exist
      const result = await generateUniqueSlug("test-product", slugExistsFn);
      expect(result).to.equal("test-product-3");
    });

    it("should pass excludeProductId to slugExistsFn", async () => {
      const slugExistsFn = sinon.stub().resolves(false);
      await generateUniqueSlug("test-product", slugExistsFn, "product-123");
      expect(slugExistsFn).to.have.been.calledWith(
        "test-product",
        "product-123",
      );
    });

    it("should append random string if max attempts reached", async () => {
      const slugExistsFn = sinon.stub().resolves(true); // Always exists
      const result = await generateUniqueSlug("test-product", slugExistsFn);
      expect(result).to.match(/^test-product-[a-z0-9]+$/);
      expect(slugExistsFn.callCount).to.be.at.least(100);
    });

    it("should handle empty base slug", async () => {
      const slugExistsFn = sinon.stub();
      const result = await generateUniqueSlug("", slugExistsFn);
      expect(result).to.be.null;
      expect(slugExistsFn).to.not.have.been.called;
    });
  });

  describe("generateSkuCode", () => {
    it("should generate a SKU code with correct format", () => {
      const code = generateSkuCode();
      expect(code).to.match(/^SKU-[A-Z0-9]+-[A-Z0-9]+$/);
    });

    it("should generate unique SKU codes", () => {
      const code1 = generateSkuCode();
      const code2 = generateSkuCode();
      expect(code1).to.not.equal(code2);
    });

    it("should start with SKU- prefix", () => {
      const code = generateSkuCode();
      expect(code.startsWith("SKU-")).to.be.true;
    });

    it("should have three parts separated by hyphens", () => {
      const code = generateSkuCode();
      const parts = code.split("-");
      expect(parts).to.have.lengthOf(3);
      expect(parts[0]).to.equal("SKU");
    });
  });
});
