// test/db/db1.test.js
import { describe, it, beforeEach } from "mocha";
import {
  getOrCreateCart,
  getCartById,
  getCartItems,
  getCartItem,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
} from "../../src/db/db1.js";
import { createMockEnv } from "../setup.js";

describe("Cart DB Functions", () => {
  let env;
  let mockDb;

  beforeEach(() => {
    env = createMockEnv();
    mockDb = env.CART_DB;
  });

  describe("getOrCreateCart", () => {
    it("should return existing cart for user", async () => {
      const existingCart = {
        cart_id: "cart-123",
        user_id: "user-123",
        status: "active",
      };

      mockDb.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(existingCart),
        }),
      });

      const result = await getOrCreateCart("user-123", null, env);

      expect(result).to.deep.equal(existingCart);
    });

    it("should return existing cart for session", async () => {
      const existingCart = {
        cart_id: "cart-123",
        session_id: "session-123",
        status: "active",
      };

      // First call: check for user cart (returns null since no userId)
      // Second call: check for session cart (returns existing cart)
      const bindStub1 = sinon.stub().returns({
        first: sinon.stub().resolves(existingCart),
      });

      mockDb.prepare.onFirstCall().returns({ bind: bindStub1 });

      const result = await getOrCreateCart(null, "session-123", env);

      expect(result).to.deep.equal(existingCart);
    });

    it("should create new cart if none exists", async () => {
      const newCart = {
        cart_id: "cart-new",
        user_id: "user-123",
        status: "active",
      };

      const bindStub1 = sinon.stub().returns({
        first: sinon.stub().resolves(null),
      });
      const bindStub2 = sinon.stub().returns({
        run: sinon.stub().resolves({ success: true }),
      });
      const bindStub3 = sinon.stub().returns({
        first: sinon.stub().resolves(newCart),
      });

      mockDb.prepare.onFirstCall().returns({ bind: bindStub1 });
      mockDb.prepare.onSecondCall().returns({ bind: bindStub2 });
      mockDb.prepare.onThirdCall().returns({ bind: bindStub3 });

      const result = await getOrCreateCart("user-123", null, env);

      expect(result).to.deep.equal(newCart);
      expect(mockDb.prepare).to.have.been.calledThrice;
    });

    it("should throw error on database failure", async () => {
      mockDb.prepare.throws(new Error("DB Error"));

      try {
        await getOrCreateCart("user-123", null, env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("DB Error");
      }
    });
  });

  describe("getCartById", () => {
    it("should return cart by ID", async () => {
      const cart = {
        cart_id: "cart-123",
        user_id: "user-123",
      };

      mockDb.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(cart),
        }),
      });

      const result = await getCartById("cart-123", env);

      expect(result).to.deep.equal(cart);
    });

    it("should return null if cart not found", async () => {
      mockDb.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(null),
        }),
      });

      const result = await getCartById("cart-123", env);

      expect(result).to.be.null;
    });
  });

  describe("getCartItems", () => {
    it("should return cart items", async () => {
      const items = [
        { item_id: "item-1", sku_id: "sku-1", quantity: 2 },
        { item_id: "item-2", sku_id: "sku-2", quantity: 1 },
      ];

      mockDb.prepare.returns({
        bind: sinon.stub().returns({
          all: sinon.stub().resolves({ results: items }),
        }),
      });

      const result = await getCartItems("cart-123", env);

      expect(result).to.deep.equal(items);
    });

    it("should return empty array if no items", async () => {
      mockDb.prepare.returns({
        bind: sinon.stub().returns({
          all: sinon.stub().resolves({ results: [] }),
        }),
      });

      const result = await getCartItems("cart-123", env);

      expect(result).to.deep.equal([]);
    });
  });

  describe("getCartItem", () => {
    it("should return cart item by ID", async () => {
      const item = {
        item_id: "item-123",
        sku_id: "sku-123",
        quantity: 2,
      };

      mockDb.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(item),
        }),
      });

      const result = await getCartItem("item-123", env);

      expect(result).to.deep.equal(item);
    });

    it("should return null if item not found", async () => {
      mockDb.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(null),
        }),
      });

      const result = await getCartItem("item-123", env);

      expect(result).to.be.null;
    });
  });

  describe("addItemToCart", () => {
    it("should update quantity if item exists", async () => {
      const existingItem = {
        item_id: "item-123",
        cart_id: "cart-123",
        sku_id: "sku-123",
        quantity: 2,
      };

      const updatedItem = { ...existingItem, quantity: 4 };

      // First call: check if item exists (returns existingItem)
      const bindStub1 = sinon.stub().returns({
        first: sinon.stub().resolves(existingItem),
      });
      // Second call: UPDATE cart_items
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
      // Fifth call: getCartItem (to return updated item)
      const bindStub5 = sinon.stub().returns({
        first: sinon.stub().resolves(updatedItem),
      });

      mockDb.prepare.onFirstCall().returns({ bind: bindStub1 });
      mockDb.prepare.onSecondCall().returns({ bind: bindStub2 });
      mockDb.prepare.onThirdCall().returns({ bind: bindStub3 });
      mockDb.prepare.onCall(3).returns({ bind: bindStub4 });
      mockDb.prepare.onCall(4).returns({ bind: bindStub5 });

      const result = await addItemToCart("cart-123", "sku-123", 2, "USD", env);

      expect(result.quantity).to.equal(4);
    });

    it("should add new item if not exists", async () => {
      const newItem = {
        item_id: "item-new",
        cart_id: "cart-123",
        sku_id: "sku-123",
        quantity: 2,
      };

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
        first: sinon.stub().resolves(newItem),
      });

      mockDb.prepare.onFirstCall().returns({ bind: bindStub1 });
      mockDb.prepare.onSecondCall().returns({ bind: bindStub2 });
      mockDb.prepare.onThirdCall().returns({ bind: bindStub3 });
      mockDb.prepare.onCall(3).returns({ bind: bindStub4 });
      mockDb.prepare.onCall(4).returns({ bind: bindStub5 });

      const result = await addItemToCart("cart-123", "sku-123", 2, "USD", env);

      expect(result).to.deep.equal(newItem);
    });
  });

  describe("updateItemQuantity", () => {
    it("should update item quantity", async () => {
      const item = {
        item_id: "item-123",
        cart_id: "cart-123",
        sku_id: "sku-123",
        quantity: 2,
      };

      const updatedItem = { ...item, quantity: 5 };

      // First call: getCartItem
      const bindStub1 = sinon.stub().returns({
        first: sinon.stub().resolves(item),
      });
      // Second call: UPDATE cart_items
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
      // Fifth call: getCartItem (to return updated item)
      const bindStub5 = sinon.stub().returns({
        first: sinon.stub().resolves(updatedItem),
      });

      mockDb.prepare.onFirstCall().returns({ bind: bindStub1 });
      mockDb.prepare.onSecondCall().returns({ bind: bindStub2 });
      mockDb.prepare.onThirdCall().returns({ bind: bindStub3 });
      mockDb.prepare.onCall(3).returns({ bind: bindStub4 });
      mockDb.prepare.onCall(4).returns({ bind: bindStub5 });

      const result = await updateItemQuantity("item-123", 5, env);

      expect(result.quantity).to.equal(5);
    });

    it("should remove item if quantity is 0", async () => {
      const item = {
        item_id: "item-123",
        cart_id: "cart-123",
        sku_id: "sku-123",
        quantity: 2,
      };

      const prepareStub = sinon.stub();
      prepareStub.onFirstCall().returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(item),
        }),
      });
      prepareStub.onSecondCall().returns({
        bind: sinon.stub().returns({
          run: sinon.stub().resolves({ success: true }),
        }),
      });
      prepareStub.onThirdCall().returns({
        bind: sinon.stub().returns({
          run: sinon.stub().resolves({ success: true }),
        }),
      });
      mockDb.prepare = prepareStub;

      const result = await updateItemQuantity("item-123", 0, env);

      expect(result).to.be.null;
    });

    it("should throw error if item not found", async () => {
      mockDb.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(null),
        }),
      });

      try {
        await updateItemQuantity("item-123", 5, env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("Cart item not found");
      }
    });
  });

  describe("removeItemFromCart", () => {
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

      const result = await removeItemFromCart("item-123", env);

      expect(result).to.be.true;
    });

    it("should throw error if item not found", async () => {
      mockDb.prepare.returns({
        bind: sinon.stub().returns({
          first: sinon.stub().resolves(null),
        }),
      });

      try {
        await removeItemFromCart("item-123", env);
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("Cart item not found");
      }
    });
  });

  describe("clearCart", () => {
    it("should clear all items from cart", async () => {
      const bindStub1 = sinon.stub().returns({
        run: sinon.stub().resolves({ success: true }),
      });
      const bindStub2 = sinon.stub().returns({
        run: sinon.stub().resolves({ success: true }),
      });

      mockDb.prepare.onFirstCall().returns({ bind: bindStub1 });
      mockDb.prepare.onSecondCall().returns({ bind: bindStub2 });

      const result = await clearCart("cart-123", env);

      expect(result).to.be.true;
    });
  });
});
