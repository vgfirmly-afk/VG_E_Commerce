// test/services/cartService.test.js
import { describe, it, beforeEach } from "mocha";
import * as cartService from "../../src/services/cartService.js";
import { createMockEnv } from "../setup.js";

describe("Cart Service", () => {
  let env;
  let mockDb;

  beforeEach(() => {
    env = createMockEnv();
    mockDb = env.CART_DB;
  });

  describe("getCart", () => {
    it("should get or create cart and return with items", async () => {
      const cart = {
        cart_id: "cart-123",
        user_id: "user-123",
        status: "active",
        currency: "USD",
      };
      const items = [
        { item_id: "item-1", sku_id: "sku-1", quantity: 2, currency: "USD" },
      ];

      const bindStub1 = sinon.stub().returns({
        first: sinon.stub().resolves(cart),
      });
      const bindStub2 = sinon.stub().returns({
        all: sinon.stub().resolves({ results: items }),
      });

      mockDb.prepare.onFirstCall().returns({ bind: bindStub1 });
      mockDb.prepare.onSecondCall().returns({ bind: bindStub2 });

      const result = await cartService.getCart("user-123", null, env);

      expect(result.cart_id).to.equal("cart-123");
      expect(result.items).to.deep.equal(items);
      expect(result.item_count).to.equal(1);
    });

    it("should throw error if cart creation fails", async () => {
      const bindStub = sinon.stub().returns({
        first: sinon.stub().resolves(null),
      });
      mockDb.prepare.onFirstCall().returns({ bind: bindStub });
      mockDb.prepare.onSecondCall().throws(new Error("DB Error"));

      try {
        await cartService.getCart("user-123", null, env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("DB Error");
      }
    });
  });

  describe("getCartByIdService", () => {
    it("should return cart with items", async () => {
      const cart = {
        cart_id: "cart-123",
        user_id: "user-123",
        status: "active",
        currency: "USD",
      };
      const items = [
        { item_id: "item-1", sku_id: "sku-1", quantity: 2, currency: "USD" },
      ];

      const bindStub1 = sinon.stub().returns({
        first: sinon.stub().resolves(cart),
      });
      const bindStub2 = sinon.stub().returns({
        all: sinon.stub().resolves({ results: items }),
      });

      mockDb.prepare.onFirstCall().returns({ bind: bindStub1 });
      mockDb.prepare.onSecondCall().returns({ bind: bindStub2 });

      const result = await cartService.getCartByIdService("cart-123", env);

      expect(result.cart_id).to.equal("cart-123");
      expect(result.items).to.deep.equal(items);
    });

    it("should return null if cart not found", async () => {
      const bindStub = sinon.stub().returns({
        first: sinon.stub().resolves(null),
      });
      mockDb.prepare.returns({ bind: bindStub });

      const result = await cartService.getCartByIdService("cart-123", env);

      expect(result).to.be.null;
    });
  });

  describe("addItem", () => {
    it("should add item after stock check", async () => {
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

      const result = await cartService.addItem("cart-123", "sku-123", 2, env);

      expect(result).to.deep.equal(item);
    });

    it("should throw error if stock insufficient", async () => {
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ available_quantity: 1 }), {
          status: 200,
        }),
      );

      try {
        await cartService.addItem("cart-123", "sku-123", 5, env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("Insufficient stock");
      }
    });

    it("should throw error if inventory worker unavailable", async () => {
      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ error: "Not found" }), { status: 404 }),
      );

      try {
        await cartService.addItem("cart-123", "sku-123", 2, env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("Stock check failed");
      }
    });
  });

  describe("updateQuantity", () => {
    it("should update quantity with absolute value", async () => {
      const currentItem = {
        item_id: "item-123",
        sku_id: "sku-123",
        quantity: 2,
      };
      const updatedItem = { ...currentItem, quantity: 5 };

      // First call: getCartItem (from service.updateQuantity)
      const bindStub1 = sinon.stub().returns({
        first: sinon.stub().resolves(currentItem),
      });
      // Second call: getCartItem (from db.updateItemQuantity)
      const bindStub2 = sinon.stub().returns({
        first: sinon.stub().resolves(currentItem),
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

      const result = await cartService.updateQuantity("item-123", 5, null, env);

      expect(result.quantity).to.equal(5);
    });

    it("should update quantity with delta", async () => {
      const currentItem = {
        item_id: "item-123",
        sku_id: "sku-123",
        quantity: 2,
      };
      const updatedItem = { ...currentItem, quantity: 4 };

      // First call: getCartItem (from service.updateQuantity)
      const bindStub1 = sinon.stub().returns({
        first: sinon.stub().resolves(currentItem),
      });
      // Second call: getCartItem (from db.updateItemQuantity)
      const bindStub2 = sinon.stub().returns({
        first: sinon.stub().resolves(currentItem),
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

      const result = await cartService.updateQuantity("item-123", null, 2, env);

      expect(result.quantity).to.equal(4);
    });

    it("should check stock when increasing quantity", async () => {
      const currentItem = {
        item_id: "item-123",
        sku_id: "sku-123",
        quantity: 2,
      };

      env.INVENTORY_WORKER.fetch.resolves(
        new Response(JSON.stringify({ available_quantity: 1 }), {
          status: 200,
        }),
      );

      const bindStub = sinon.stub().returns({
        first: sinon.stub().resolves(currentItem),
      });
      mockDb.prepare.returns({ bind: bindStub });

      try {
        await cartService.updateQuantity("item-123", 5, null, env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("Insufficient stock");
      }
    });

    it("should throw error if item not found", async () => {
      const bindStub = sinon.stub().returns({
        first: sinon.stub().resolves(null),
      });
      mockDb.prepare.returns({ bind: bindStub });

      try {
        await cartService.updateQuantity("item-123", 5, null, env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("Cart item not found");
      }
    });

    it("should throw error if neither quantity nor delta provided", async () => {
      const currentItem = {
        item_id: "item-123",
        sku_id: "sku-123",
        quantity: 2,
      };

      const bindStub = sinon.stub().returns({
        first: sinon.stub().resolves(currentItem),
      });
      mockDb.prepare.returns({ bind: bindStub });

      try {
        await cartService.updateQuantity("item-123", null, null, env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("Either quantity or delta is required");
      }
    });

    it("should prevent negative quantity with delta", async () => {
      const currentItem = {
        item_id: "item-123",
        sku_id: "sku-123",
        quantity: 2,
      };

      // First call: getCartItem (from service.updateQuantity)
      const bindStub1 = sinon.stub().returns({
        first: sinon.stub().resolves(currentItem),
      });
      // Second call: getCartItem (from db.updateItemQuantity)
      const bindStub2 = sinon.stub().returns({
        first: sinon.stub().resolves(currentItem),
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

      const result = await cartService.updateQuantity(
        "item-123",
        null,
        -5,
        env,
      );

      expect(result).to.be.null; // Item removed when quantity becomes 0
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

      const result = await cartService.removeItem("item-123", env);

      expect(result).to.be.true;
    });
  });

  describe("clear", () => {
    it("should clear cart", async () => {
      const bindStub1 = sinon.stub().returns({
        run: sinon.stub().resolves({ success: true }),
      });
      const bindStub2 = sinon.stub().returns({
        run: sinon.stub().resolves({ success: true }),
      });

      mockDb.prepare.onFirstCall().returns({ bind: bindStub1 });
      mockDb.prepare.onSecondCall().returns({ bind: bindStub2 });

      const result = await cartService.clear("cart-123", env);

      expect(result).to.be.true;
    });
  });

  describe("calculateTotal", () => {
    it("should calculate cart total with prices", async () => {
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

      const result = await cartService.calculateTotal("cart-123", env);

      expect(result.cart_id).to.equal("cart-123");
      expect(result.subtotal).to.be.closeTo(27.48, 0.01); // (10.99 * 2) + (5.50 * 1)
      expect(result.items).to.have.length(2);
    });

    it("should handle missing pricing worker", async () => {
      const cart = {
        cart_id: "cart-123",
        currency: "USD",
        items: [{ item_id: "item-1", sku_id: "sku-1", quantity: 2 }],
      };

      const bindStub1 = sinon.stub().returns({
        first: sinon.stub().resolves(cart),
      });
      const bindStub2 = sinon.stub().returns({
        all: sinon.stub().resolves({ results: cart.items }),
      });

      mockDb.prepare.onFirstCall().returns({ bind: bindStub1 });
      mockDb.prepare.onSecondCall().returns({ bind: bindStub2 });

      env.PRICING_WORKER = null;

      const result = await cartService.calculateTotal("cart-123", env);

      expect(result.subtotal).to.equal(0);
    });

    it("should handle pricing worker error response", async () => {
      const cart = {
        cart_id: "cart-123",
        currency: "USD",
        items: [{ item_id: "item-1", sku_id: "sku-1", quantity: 2 }],
      };

      const bindStub1 = sinon.stub().returns({
        first: sinon.stub().resolves(cart),
      });
      const bindStub2 = sinon.stub().returns({
        all: sinon.stub().resolves({ results: cart.items }),
      });

      mockDb.prepare.onFirstCall().returns({ bind: bindStub1 });
      mockDb.prepare.onSecondCall().returns({ bind: bindStub2 });

      env.PRICING_WORKER.fetch.resolves(
        new Response(JSON.stringify({ error: "Not found" }), { status: 404 }),
      );

      const result = await cartService.calculateTotal("cart-123", env);

      expect(result.subtotal).to.equal(0);
    });

    it("should handle pricing worker exception", async () => {
      const cart = {
        cart_id: "cart-123",
        currency: "USD",
        items: [{ item_id: "item-1", sku_id: "sku-1", quantity: 2 }],
      };

      const bindStub1 = sinon.stub().returns({
        first: sinon.stub().resolves(cart),
      });
      const bindStub2 = sinon.stub().returns({
        all: sinon.stub().resolves({ results: cart.items }),
      });

      mockDb.prepare.onFirstCall().returns({ bind: bindStub1 });
      mockDb.prepare.onSecondCall().returns({ bind: bindStub2 });

      env.PRICING_WORKER.fetch.rejects(new Error("Network error"));

      const result = await cartService.calculateTotal("cart-123", env);

      expect(result.subtotal).to.equal(0);
    });

    it("should use price field if effective_price not available", async () => {
      const cart = {
        cart_id: "cart-123",
        currency: "USD",
        items: [{ item_id: "item-1", sku_id: "sku-1", quantity: 2 }],
      };

      const bindStub1 = sinon.stub().returns({
        first: sinon.stub().resolves(cart),
      });
      const bindStub2 = sinon.stub().returns({
        all: sinon.stub().resolves({ results: cart.items }),
      });

      mockDb.prepare.onFirstCall().returns({ bind: bindStub1 });
      mockDb.prepare.onSecondCall().returns({ bind: bindStub2 });

      env.PRICING_WORKER.fetch.resolves(
        new Response(JSON.stringify({ price: 15.99 }), { status: 200 }),
      );

      const result = await cartService.calculateTotal("cart-123", env);

      expect(result.subtotal).to.be.closeTo(31.98, 0.01);
    });

    it("should handle inventory worker unavailable", async () => {
      env.INVENTORY_WORKER = null;

      try {
        await cartService.addItem("cart-123", "sku-123", 2, env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("Inventory Worker not available");
      }
    });

    it("should handle inventory worker exception", async () => {
      env.INVENTORY_WORKER.fetch.rejects(new Error("Network error"));

      try {
        await cartService.addItem("cart-123", "sku-123", 2, env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("Stock check error");
      }
    });

    it("should throw error if cart not found", async () => {
      const bindStub = sinon.stub().returns({
        first: sinon.stub().resolves(null),
      });
      mockDb.prepare.returns({ bind: bindStub });

      try {
        await cartService.calculateTotal("cart-123", env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("Cart not found");
      }
    });
  });
});
