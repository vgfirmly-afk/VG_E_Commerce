// test/routers/cart.test.js
import { describe, it, beforeEach } from "mocha";
import router from "../../src/routers/cart.js";
import * as cartHandlers from "../../src/handlers/cartHandlers.js";
import { createMockRequest, createMockEnv } from "../setup.js";

describe("Cart Router", () => {
  let env;
  let mockDb;

  beforeEach(() => {
    env = createMockEnv();
    mockDb = env.CART_DB;
  });

  describe("Health Check", () => {
    it("should return 200 for health check", async () => {
      const request = createMockRequest("GET", "https://example.com/_/health");

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(200);
      expect(body.ok).to.be.true;
    });
  });

  describe("GET /api/v1/cart", () => {
    it("should route to getCart handler", async () => {
      const cart = {
        cart_id: "cart-123",
        user_id: "user-123",
        status: "active",
        currency: "USD",
      };
      const items = [];

      const bindStub1 = sinon.stub().returns({
        first: sinon.stub().resolves(cart),
      });
      const bindStub2 = sinon.stub().returns({
        all: sinon.stub().resolves({ results: items }),
      });

      mockDb.prepare.onFirstCall().returns({ bind: bindStub1 });
      mockDb.prepare.onSecondCall().returns({ bind: bindStub2 });

      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/cart",
        null,
        {
          "X-User-Id": "user-123",
        },
      );
      request.env = env;

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(200);
      expect(body.cart_id).to.equal("cart-123");
    });
  });

  describe("GET /api/v1/cart/:cart_id", () => {
    it("should route to getCartById handler", async () => {
      const cart = {
        cart_id: "cart-123",
        user_id: "user-123",
        status: "active",
        currency: "USD",
      };
      const items = [];

      const bindStub1 = sinon.stub().returns({
        first: sinon.stub().resolves(cart),
      });
      const bindStub2 = sinon.stub().returns({
        all: sinon.stub().resolves({ results: items }),
      });

      mockDb.prepare.onFirstCall().returns({ bind: bindStub1 });
      mockDb.prepare.onSecondCall().returns({ bind: bindStub2 });

      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/cart/cart-123",
      );
      request.env = env;

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(200);
      expect(body.cart_id).to.equal("cart-123");
    });
  });

  describe("POST /api/v1/cart/:cart_id/items", () => {
    it("should add item with valid body", async () => {
      const item = {
        item_id: "item-123",
        sku_id: "sku-123",
        quantity: 2,
      };

      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ available_quantity: 100 }), {
          status: 200,
        }),
      );

      // First call: check if item exists (returns null)
      const bindStub1 = sinon.stub().returns({
        first: sinon.stub().resolves(null),
      });
      // Second call: INSERT cart_items
      const bindStub2 = sinon.stub().returns({
        run: sinon.stub().resolves({ success: true }),
      });
      // Third call: UPDATE carts
      const bindStub3 = sinon.stub().returns({
        run: sinon.stub().resolves({ success: true }),
      });
      // Fourth call: INSERT cart_history
      const bindStub4 = sinon.stub().returns({
        run: sinon.stub().resolves({ success: true }),
      });
      // Fifth call: getCartItem (to return new item)
      const bindStub5 = sinon.stub().returns({
        first: sinon.stub().resolves(item),
      });

      mockDb.prepare.onFirstCall().returns({ bind: bindStub1 });
      mockDb.prepare.onSecondCall().returns({ bind: bindStub2 });
      mockDb.prepare.onThirdCall().returns({ bind: bindStub3 });
      mockDb.prepare.onCall(3).returns({ bind: bindStub4 });
      mockDb.prepare.onCall(4).returns({ bind: bindStub5 });

      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/cart/cart-123/items",
        {
          sku_id: "sku-123",
          quantity: 2,
        },
        {
          "Content-Type": "application/json",
        },
      );
      request.env = env;

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(201);
      expect(body.item_id).to.equal("item-123");
    });

    it("should return 400 for missing Content-Type", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/cart/cart-123/items",
        {
          sku_id: "sku-123",
          quantity: 2,
        },
      );
      request.headers.delete("Content-Type");

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should return 400 for invalid JSON", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/cart/cart-123/items",
      );
      request.clone = function () {
        return {
          text: async () => "{ invalid json }",
        };
      };

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should return 400 for empty body", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/cart/cart-123/items",
        {},
      );
      request.clone = function () {
        return {
          text: async () => "{}",
        };
      };

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should return 400 for invalid validation", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/cart/cart-123/items",
        {
          sku_id: "",
          quantity: -1,
        },
      );

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should detect unresolved Postman variables", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/cart/cart-123/items",
        {
          sku_id: "{{skuId}}",
          quantity: 2,
        },
      );
      request.env = env;
      request.clone = function () {
        return {
          text: async () => '{"sku_id":"{{skuId}}","quantity":2}',
        };
      };

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
      expect(body.message).to.include("unresolved variables");
    });

    it("should handle JSON parse error - unexpected end", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/cart/cart-123/items",
      );
      request.env = env;
      request.clone = function () {
        return {
          text: async () => '{"sku_id":"sku-123"',
        };
      };

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
      expect(body.message).to.include("JSON");
    });

    it("should handle JSON parse error - unexpected token", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/cart/cart-123/items",
      );
      request.env = env;
      request.clone = function () {
        return {
          text: async () => "{invalid json}",
        };
      };

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should handle router exception", async () => {
      // Set up DB to fail when handler tries to use it
      mockDb.prepare.throws(new Error("DB Error"));

      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/cart/cart-123/items",
        {
          sku_id: "sku-123",
          quantity: 2,
        },
        {
          "Content-Type": "application/json",
        },
      );
      request.env = env;

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(500);
      expect(body.error).to.equal("internal_error");
    });
  });

  describe("PUT /api/v1/cart/:cart_id/items/:item_id", () => {
    it("should update item with valid body", async () => {
      const item = {
        item_id: "item-123",
        cart_id: "cart-123",
        sku_id: "sku-123",
        quantity: 2,
      };
      const updatedItem = { ...item, quantity: 5 };

      // First call: getCartItem (from service.updateQuantity)
      const bindStub1 = sinon.stub().returns({
        first: sinon.stub().resolves(item),
      });
      // Second call: getCartItem (from db.updateItemQuantity)
      const bindStub2 = sinon.stub().returns({
        first: sinon.stub().resolves(item),
      });
      // Third call: UPDATE cart_items
      const bindStub3 = sinon.stub().returns({
        run: sinon.stub().resolves({ success: true }),
      });
      // Fourth call: UPDATE carts
      const bindStub4 = sinon.stub().returns({
        run: sinon.stub().resolves({ success: true }),
      });
      // Fifth call: INSERT cart_history
      const bindStub5 = sinon.stub().returns({
        run: sinon.stub().resolves({ success: true }),
      });
      // Sixth call: getCartItem (to return updated item from db.updateItemQuantity)
      const bindStub6 = sinon.stub().returns({
        first: sinon.stub().resolves(updatedItem),
      });

      mockDb.prepare.onFirstCall().returns({ bind: bindStub1 });
      mockDb.prepare.onSecondCall().returns({ bind: bindStub2 });
      mockDb.prepare.onThirdCall().returns({ bind: bindStub3 });
      mockDb.prepare.onCall(3).returns({ bind: bindStub4 });
      mockDb.prepare.onCall(4).returns({ bind: bindStub5 });
      mockDb.prepare.onCall(5).returns({ bind: bindStub6 });

      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/cart/cart-123/items/item-123",
        {
          quantity: 5,
        },
        {
          "Content-Type": "application/json",
        },
      );
      request.env = env;

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(200);
      expect(body.quantity).to.equal(5);
    });

    it("should return 400 for missing Content-Type", async () => {
      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/cart/cart-123/items/item-123",
        {
          quantity: 5,
        },
      );
      request.headers.delete("Content-Type");

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should detect unresolved Postman variables in PUT", async () => {
      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/cart/cart-123/items/item-123",
        {
          quantity: 5,
        },
        {
          "Content-Type": "application/json",
        },
      );
      request.env = env;
      request.clone = function () {
        return {
          text: async () => '{"quantity":"{{qty}}"}',
        };
      };

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
      expect(body.message).to.include("unresolved variables");
    });

    it("should handle JSON parse error in PUT", async () => {
      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/cart/cart-123/items/item-123",
      );
      request.env = env;
      request.clone = function () {
        return {
          text: async () => "{invalid}",
        };
      };

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });
  });

  describe("DELETE /api/v1/cart/:cart_id/items/:item_id", () => {
    it("should route to removeItem handler", async () => {
      const item = {
        item_id: "item-123",
        cart_id: "cart-123",
        sku_id: "sku-123",
        quantity: 2,
      };

      const bindStub1 = sinon.stub().returns({
        first: sinon.stub().resolves(item),
      });
      const bindStub2 = sinon.stub().returns({
        run: sinon.stub().resolves({ success: true }),
      });
      const bindStub3 = sinon.stub().returns({
        run: sinon.stub().resolves({ success: true }),
      });

      mockDb.prepare.onFirstCall().returns({ bind: bindStub1 });
      mockDb.prepare.onSecondCall().returns({ bind: bindStub2 });
      mockDb.prepare.onThirdCall().returns({ bind: bindStub3 });

      const request = createMockRequest(
        "DELETE",
        "https://example.com/api/v1/cart/cart-123/items/item-123",
      );
      request.env = env;

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(200);
      expect(body.message).to.include("Item removed");
    });
  });

  describe("DELETE /api/v1/cart/:cart_id", () => {
    it("should route to clearCart handler", async () => {
      const bindStub1 = sinon.stub().returns({
        run: sinon.stub().resolves({ success: true }),
      });
      const bindStub2 = sinon.stub().returns({
        run: sinon.stub().resolves({ success: true }),
      });

      mockDb.prepare.onFirstCall().returns({ bind: bindStub1 });
      mockDb.prepare.onSecondCall().returns({ bind: bindStub2 });

      const request = createMockRequest(
        "DELETE",
        "https://example.com/api/v1/cart/cart-123",
      );
      request.env = env;

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(200);
      expect(body.message).to.include("Cart cleared");
    });
  });

  describe("GET /api/v1/cart/:cart_id/total", () => {
    it("should route to getTotal handler", async () => {
      const cart = {
        cart_id: "cart-123",
        currency: "USD",
        items: [
          { item_id: "item-1", sku_id: "sku-1", quantity: 2 },
          { item_id: "item-2", sku_id: "sku-2", quantity: 1 },
        ],
      };

      const bindStub1 = sinon.stub().returns({
        first: sinon.stub().resolves(cart),
      });
      const bindStub2 = sinon.stub().returns({
        all: sinon.stub().resolves({ results: cart.items }),
      });

      mockDb.prepare.onFirstCall().returns({ bind: bindStub1 });
      mockDb.prepare.onSecondCall().returns({ bind: bindStub2 });

      env.PRICING_WORKER.fetch
        .onFirstCall()
        .resolves(
          new Response(JSON.stringify({ effective_price: 10.99 }), {
            status: 200,
          }),
        )
        .onSecondCall()
        .resolves(
          new Response(JSON.stringify({ effective_price: 5.5 }), {
            status: 200,
          }),
        );

      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/cart/cart-123/total",
      );
      request.env = env;

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(200);
      expect(body.subtotal).to.be.closeTo(27.48, 0.01);
    });
  });

  describe("404 Handler", () => {
    it("should return 404 for unknown route", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/unknown",
      );

      const response = await router.handle(request, env, {});
      const body = await response.json();

      expect(response.status).to.equal(404);
      expect(body.error).to.equal("not_found");
    });
  });
});
