// test/index.test.js
// Note: Index.js imports Cloudflare Workers specific modules that can't be tested in Node.js
// The functionality is tested through router and handler tests
import { describe, it } from "mocha";
import { expect } from "chai";

describe("Index Handler", () => {
  it("should be tested through router and handler tests", () => {
    // Index.js is primarily wiring code that imports Cloudflare Workers modules
    // The actual functionality is tested in:
    // - test/routers/payment.test.js
    // - test/handlers/paymentHandlers.test.js
    // - test/handlers/webhookHandlers.test.js
    expect(true).to.be.true;
  });
});
