// test/handlers/cartHandlers.test.js
import { describe, it, beforeEach } from "mocha";
import * as cartHandlers from "../../src/handlers/cartHandlers.js";
import { createMockRequest, createMockEnv } from "../setup.js";

describe("Cart Handlers", () => {
  let env;
  let mockDb;

  beforeEach(() => {
    env = createMockEnv();
    mockDb = env.CART_DB;
  });

  describe("getCart", () => {
    it("should return cart for user", async () => {
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

      const response = await cartHandlers.getCart(request, env);
      const body = await response.json();

      expect(response.status).to.equal(200);
      expect(body.cart_id).to.equal("cart-123");
    });

    it("should return cart for session", async () => {
      const cart = {
        cart_id: "cart-123",
        session_id: "session-123",
        status: "active",
        currency: "USD",
      };
      const items = [];

      // When sessionId is provided but no userId, it skips the first check
      // First call: check for session cart (returns cart)
      const bindStub1 = sinon.stub().returns({
        first: sinon.stub().resolves(cart),
      });
      // Second call: getCartItems
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
          "X-Session-Id": "session-123",
        },
      );

      const response = await cartHandlers.getCart(request, env);
      const body = await response.json();

      expect(response.status).to.equal(200);
      expect(body.cart_id).to.equal("cart-123");
    });

    it("should return 400 if neither user nor session ID provided", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/cart",
      );

      const response = await cartHandlers.getCart(request, env);
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should handle service errors", async () => {
      mockDb.prepare.throws(new Error("Service error"));
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/cart",
        null,
        {
          "X-User-Id": "user-123",
        },
      );

      const response = await cartHandlers.getCart(request, env);
      const body = await response.json();

      expect(response.status).to.equal(500);
      expect(body.error).to.equal("internal_error");
    });
  });

  describe("getCartById", () => {
    it("should return cart by ID", async () => {
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
      request.params = { cart_id: "cart-123" };

      const response = await cartHandlers.getCartById(request, env);
      const body = await response.json();

      expect(response.status).to.equal(200);
      expect(body.cart_id).to.equal("cart-123");
    });

    it("should return 404 if cart not found", async () => {
      const bindStub = sinon.stub().returns({
        first: sinon.stub().resolves(null),
      });
      mockDb.prepare.returns({ bind: bindStub });

      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/cart/cart-123",
      );
      request.params = { cart_id: "cart-123" };

      const response = await cartHandlers.getCartById(request, env);
      const body = await response.json();

      expect(response.status).to.equal(404);
      expect(body.error).to.equal("not_found");
    });

    it("should return 400 for invalid cart ID", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/cart/",
      );
      request.params = { cart_id: "" };

      const response = await cartHandlers.getCartById(request, env);
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });
  });

  describe("addItem", () => {
    it("should add item to cart", async () => {
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
      );
      request.params = { cart_id: "cart-123" };
      request.validatedBody = { sku_id: "sku-123", quantity: 2 };

      const response = await cartHandlers.addItem(request, env);
      const body = await response.json();

      expect(response.status).to.equal(201);
      expect(body.item_id).to.equal("item-123");
    });

    it("should return 400 if sku_id missing", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/cart/cart-123/items",
      );
      request.params = { cart_id: "cart-123" };
      request.validatedBody = { quantity: 2 };

      const response = await cartHandlers.addItem(request, env);
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should return 400 for invalid cart ID", async () => {
      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/cart//items",
      );
      request.params = { cart_id: "" };
      request.validatedBody = { sku_id: "sku-123", quantity: 2 };

      const response = await cartHandlers.addItem(request, env);
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.error).to.equal("validation_error");
    });

    it("should return 400 for stock errors", async () => {
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ available_quantity: 1 }), {
          status: 200,
        }),
      );

      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/cart/cart-123/items",
      );
      request.params = { cart_id: "cart-123" };
      request.validatedBody = { sku_id: "sku-123", quantity: 5 };

      const response = await cartHandlers.addItem(request, env);

      expect(response.status).to.equal(400);
    });

    it("should return 400 for stock error message", async () => {
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ available_quantity: 1 }), {
          status: 200,
        }),
      );

      const request = createMockRequest(
        "POST",
        "https://example.com/api/v1/cart/cart-123/items",
      );
      request.params = { cart_id: "cart-123" };
      request.validatedBody = { sku_id: "sku-123", quantity: 5 };

      const response = await cartHandlers.addItem(request, env);
      const body = await response.json();

      expect(response.status).to.equal(400);
      expect(body.message).to.include("stock");
    });

    it("should return 400 for stock error in updateQuantity", async () => {
      const item = {
        item_id: "item-123",
        cart_id: "cart-123",
        sku_id: "sku-123",
        quantity: 2,
      };

      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ available_quantity: 1 }), {
          status: 200,
        }),
      );

      const bindStub = sinon.stub().returns({
        first: sinon.stub().resolves(item),
      });
      mockDb.prepare.returns({ bind: bindStub });

      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/cart/cart-123/items/item-123",
      );
      request.params = { cart_id: "cart-123", item_id: "item-123" };
      request.validatedBody = { quantity: 10 };

      const response = await cartHandlers.updateQuantity(request, env);

      expect(response.status).to.equal(400);
    });
  });

  describe("updateQuantity", () => {
    it("should update item quantity", async () => {
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
      );
      request.params = { cart_id: "cart-123", item_id: "item-123" };
      request.validatedBody = { quantity: 5 };

      const response = await cartHandlers.updateQuantity(request, env);
      const body = await response.json();

      expect(response.status).to.equal(200);
      expect(body.quantity).to.equal(5);
    });

    it("should handle item removal (quantity 0)", async () => {
      const item = {
        item_id: "item-123",
        cart_id: "cart-123",
        sku_id: "sku-123",
        quantity: 2,
      };

      // First call: getCartItem (from service.updateQuantity)
      const bindStub1 = sinon.stub().returns({
        first: sinon.stub().resolves(item),
      });
      // Second call: getCartItem (from db.updateItemQuantity)
      const bindStub2 = sinon.stub().returns({
        first: sinon.stub().resolves(item),
      });
      // Third call: DELETE cart_items (quantity becomes 0)
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

      mockDb.prepare.onFirstCall().returns({ bind: bindStub1 });
      mockDb.prepare.onSecondCall().returns({ bind: bindStub2 });
      mockDb.prepare.onThirdCall().returns({ bind: bindStub3 });
      mockDb.prepare.onCall(3).returns({ bind: bindStub4 });
      mockDb.prepare.onCall(4).returns({ bind: bindStub5 });

      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/cart/cart-123/items/item-123",
      );
      request.params = { cart_id: "cart-123", item_id: "item-123" };
      request.validatedBody = { quantity: 0 };

      const response = await cartHandlers.updateQuantity(request, env);
      const body = await response.json();

      expect(response.status).to.equal(200);
      expect(body.message).to.include("Item removed");
    });

    it("should return 400 for invalid cart ID", async () => {
      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/cart//items/item-123",
      );
      request.params = { cart_id: "", item_id: "item-123" };
      request.validatedBody = { quantity: 5 };

      const response = await cartHandlers.updateQuantity(request, env);

      expect(response.status).to.equal(400);
    });

    it("should return 400 for invalid item ID", async () => {
      const request = createMockRequest(
        "PUT",
        "https://example.com/api/v1/cart/cart-123/items/",
      );
      request.params = { cart_id: "cart-123", item_id: "" };
      request.validatedBody = { quantity: 5 };

      const response = await cartHandlers.updateQuantity(request, env);

      expect(response.status).to.equal(400);
    });
  });

  describe("removeItem", () => {
    it("should remove item from cart", async () => {
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
      request.params = { cart_id: "cart-123", item_id: "item-123" };

      const response = await cartHandlers.removeItem(request, env);
      const body = await response.json();

      expect(response.status).to.equal(200);
      expect(body.message).to.include("Item removed");
    });

    it("should return 400 for invalid cart ID", async () => {
      const request = createMockRequest(
        "DELETE",
        "https://example.com/api/v1/cart//items/item-123",
      );
      request.params = { cart_id: "", item_id: "item-123" };

      const response = await cartHandlers.removeItem(request, env);

      expect(response.status).to.equal(400);
    });
  });

  describe("clearCart", () => {
    it("should clear cart", async () => {
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
      request.params = { cart_id: "cart-123" };

      const response = await cartHandlers.clearCart(request, env);
      const body = await response.json();

      expect(response.status).to.equal(200);
      expect(body.message).to.include("Cart cleared");
    });

    it("should return 400 for invalid cart ID", async () => {
      const request = createMockRequest(
        "DELETE",
        "https://example.com/api/v1/cart/",
      );
      request.params = { cart_id: "" };

      const response = await cartHandlers.clearCart(request, env);

      expect(response.status).to.equal(400);
    });
  });

  describe("getTotal", () => {
    it("should calculate cart total", async () => {
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
      request.params = { cart_id: "cart-123" };

      const response = await cartHandlers.getTotal(request, env);
      const body = await response.json();

      expect(response.status).to.equal(200);
      expect(body.subtotal).to.be.closeTo(27.48, 0.01);
    });

    it("should return 400 for invalid cart ID", async () => {
      const request = createMockRequest(
        "GET",
        "https://example.com/api/v1/cart//total",
      );
      request.params = { cart_id: "" };

      const response = await cartHandlers.getTotal(request, env);

      expect(response.status).to.equal(400);
    });
  });
});
