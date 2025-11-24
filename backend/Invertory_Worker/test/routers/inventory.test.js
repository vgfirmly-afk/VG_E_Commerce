// test/routers/inventory.test.js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import router from "../../src/routers/inventory.js";
import { createMockRequest, createMockEnv, createTestJWT } from "../setup.js";
import * as adminAuth from "../../src/middleware/adminAuth.js";

describe("Inventory Router", () => {
  let env;

  beforeEach(() => {
    env = createMockEnv();
    sinon.restore();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("Health Check", () => {
    it("should return health check response", async () => {
      const request = createMockRequest("GET", "https://example.com/_/health");
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(200);
      const data = await response.json();
      expect(data.ok).to.be.true;
    });
  });

  describe("GET /api/v1/stock/:sku_id", () => {
    it("should get stock for SKU", async () => {
      const mockStock = { sku_id: "sku-1", quantity: 100, available_quantity: 90 };
      const mockDb = env.INVENTORY_DB;
      mockDb.prepare().bind().first.resolves(mockStock);

      const request = createMockRequest("GET", "https://example.com/api/v1/stock/sku-1", null, {}, { sku_id: "sku-1" });
      request.env = env; // Set request.env for the router
      // itty-router will set request.params when it matches the route
      const response = await router.handle(request, env, {});
      
      // If router didn't match, it returns undefined, so we need to check
      if (!response) {
        throw new Error("Router did not match route");
      }

      expect(response.status).to.equal(200);
      const data = await response.json();
      expect(data.sku_id).to.equal("sku-1");
    });
  });

  describe("GET /api/v1/stock/product/:product_id", () => {
    it("should get all stocks for a product", async () => {
      const mockStocks = [{ sku_id: "sku-1", product_id: "prod-1", quantity: 100 }];
      const mockDb = env.INVENTORY_DB;
      mockDb.prepare().bind().all.resolves({ results: mockStocks });

      const request = createMockRequest("GET", "https://example.com/api/v1/stock/product/prod-1", null, {}, { product_id: "prod-1" });
      request.env = env;
      const response = await router.handle(request, env, {});

      expect(response).to.exist;
      expect(response.status).to.equal(200);
    });
  });

  describe("GET /api/v1/stock/:sku_id/history", () => {
    it("should get stock history", async () => {
      const mockHistory = [{ history_id: "hist-1", sku_id: "sku-1" }];
      const mockCount = { total: 1 };
      const mockDb = env.INVENTORY_DB;
      const historyStub = mockDb.prepare().bind();
      historyStub.all.onFirstCall().resolves({ results: mockHistory });
      historyStub.first.onFirstCall().resolves(mockCount);

      const request = createMockRequest("GET", "https://example.com/api/v1/stock/sku-1/history", null, {}, { sku_id: "sku-1" });
      request.env = env;
      const response = await router.handle(request, env, {});

      expect(response).to.exist;
      expect(response.status).to.equal(200);
    });
  });

  describe("POST /api/v1/check-stock", () => {
    it.skip("should check stock availability", async () => {
      const mockStocks = [{ sku_id: "sku-1", available_quantity: 90, quantity: 100, reserved_quantity: 10, status: "active" }];
      const mockDb = env.INVENTORY_DB;
      mockDb.prepare().bind().all.resolves({ results: mockStocks });

      const body = { sku_ids: ["sku-1"] };
      const request = createMockRequest("POST", "https://example.com/api/v1/check-stock", body, {
        "Content-Type": "application/json",
      });
      request.env = env; // Set request.env for the router
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(200);
    });

    it("should return 400 for invalid Content-Type", async () => {
      const request = createMockRequest("POST", "https://example.com/api/v1/check-stock", null, {
        "Content-Type": "text/plain",
      });
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(400);
    });

    it("should return 400 for invalid JSON in check-stock", async () => {
      const request = createMockRequest("POST", "https://example.com/api/v1/check-stock", null);
      request.json = async () => {
        throw new Error("Invalid JSON");
      };

      const response = await router.handle(request, env, {});
      expect(response.status).to.equal(400);
    });

    it.skip("should return 400 for invalid request data in check-stock", async () => {
      const body = { sku_ids: "not-an-array" };
      const request = createMockRequest("POST", "https://example.com/api/v1/check-stock", body, {
        "Content-Type": "application/json",
      });
      request.env = env;
      const response = await router.handle(request, env, {});

      expect(response).to.exist;
      expect(response.status).to.equal(400);
      const data = await response.json();
      expect(data.error).to.equal("validation_error");
      expect(data.details).to.be.an("array");
    });

    it.skip("should handle errors in check-stock handler", async () => {
      const mockDb = env.INVENTORY_DB;
      mockDb.prepare().bind().all.rejects(new Error("Database error"));

      const body = { sku_ids: ["sku-1"] };
      const request = createMockRequest("POST", "https://example.com/api/v1/check-stock", body);
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(500);
    });
  });

  describe("POST /api/v1/stock/:sku_id", () => {
    it.skip("should initialize stock with service binding", async () => {
      const mockStock = { sku_id: "sku-1", quantity: 100 };
      sinon.replace(adminAuth, "requireServiceOrAdmin", sinon.fake.resolves({
        ok: true,
        user: { userId: "catalog_worker_service", role: "service" },
      }));
      // Mock database for stock initialization
      const mockDb = env.INVENTORY_DB;
      mockDb.prepare().bind().first.onFirstCall().resolves(null); // Stock doesn't exist
      mockDb.prepare().bind().first.onSecondCall().resolves(mockStock); // After creation
      mockDb.batch.resolves([]);

      const body = { product_id: "prod-1", sku_code: "SKU001", quantity: 100 };
      const request = createMockRequest("POST", "https://example.com/api/v1/stock/sku-1", body, {
        "X-Source": "catalog-worker-service-binding",
      }, { sku_id: "sku-1" });
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(201);
    });

    it.skip("should initialize stock with admin JWT", async () => {
      const mockStock = { sku_id: "sku-1", quantity: 100 };
      sinon.replace(adminAuth, "requireServiceOrAdmin", sinon.fake.resolves({
        ok: true,
        user: { userId: "admin-1", role: "admin" },
      }));
      // Mock database for stock initialization
      const mockDb = env.INVENTORY_DB;
      mockDb.prepare().bind().first.onFirstCall().resolves(null); // Stock doesn't exist
      mockDb.prepare().bind().first.onSecondCall().resolves(mockStock); // After creation
      mockDb.batch.resolves([]);

      const token = createTestJWT({ role: "admin" });
      const body = { product_id: "prod-1", sku_code: "SKU001", quantity: 100 };
      const request = createMockRequest("POST", "https://example.com/api/v1/stock/sku-1", body, {
        Authorization: `Bearer ${token}`,
      }, { sku_id: "sku-1" });
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(201);
    });

    it.skip("should return 401 for unauthorized request", async () => {
      sinon.replace(adminAuth, "requireServiceOrAdmin", sinon.fake.resolves({
        ok: false,
        error: "unauthorized",
        message: "Unauthorized",
        status: 401,
      }));

      const request = createMockRequest("POST", "https://example.com/api/v1/stock/sku-1", {}, {}, { sku_id: "sku-1" });
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(401);
    });

    it.skip("should handle JSON parse errors in initializeStock", async () => {
      sinon.replace(adminAuth, "requireServiceOrAdmin", sinon.fake.resolves({
        ok: true,
        user: { userId: "admin-1", role: "admin" },
      }));

      const request = createMockRequest("POST", "https://example.com/api/v1/stock/sku-1", null, {}, { sku_id: "sku-1" });
      request.json = async () => {
        throw new Error("Invalid JSON");
      };

      const response = await router.handle(request, env, {});
      expect(response.status).to.equal(500);
    });
  });

  describe("PUT /api/v1/stock/:sku_id", () => {
    it.skip("should update stock with admin JWT", async () => {
      const mockStock = { sku_id: "sku-1", quantity: 150 };
      sinon.replace(adminAuth, "requireAdmin", sinon.fake.resolves({
        ok: true,
        user: { userId: "admin-1", role: "admin" },
      }));
      // Mock database for stock update
      const mockDb = env.INVENTORY_DB;
      const existingStock = { sku_id: "sku-1", quantity: 100, reserved_quantity: 10, product_id: "prod-1", sku_code: "SKU001" };
      mockDb.prepare().bind().first.onFirstCall().resolves(existingStock);
      mockDb.prepare().bind().first.onSecondCall().resolves(mockStock);
      mockDb.batch.resolves([]);

      const token = createTestJWT({ role: "admin" });
      const body = { quantity: 150 };
      const request = createMockRequest("PUT", "https://example.com/api/v1/stock/sku-1", body, {
        Authorization: `Bearer ${token}`,
      }, { sku_id: "sku-1" });
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(200);
    });

    it.skip("should return 401 for unauthorized request", async () => {
      sinon.replace(adminAuth, "requireAdmin", sinon.fake.resolves({
        ok: false,
        error: "unauthorized",
        status: 401,
      }));

      const request = createMockRequest("PUT", "https://example.com/api/v1/stock/sku-1", {}, {}, { sku_id: "sku-1" });
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(401);
    });

    it.skip("should handle JSON parse errors in updateStock", async () => {
      sinon.replace(adminAuth, "requireAdmin", sinon.fake.resolves({
        ok: true,
        user: { userId: "admin-1", role: "admin" },
      }));

      const request = createMockRequest("PUT", "https://example.com/api/v1/stock/sku-1", null, {}, { sku_id: "sku-1" });
      request.json = async () => {
        throw new Error("Invalid JSON");
      };

      const response = await router.handle(request, env, {});
      expect(response.status).to.equal(500);
    });
  });

  describe("POST /api/v1/stock/:sku_id/adjust", () => {
    it.skip("should adjust stock with admin JWT", async () => {
      const mockStock = { sku_id: "sku-1", quantity: 150 };
      sinon.replace(adminAuth, "requireAdmin", sinon.fake.resolves({
        ok: true,
        user: { userId: "admin-1", role: "admin" },
      }));
      // Mock database for stock adjustment
      const mockDb = env.INVENTORY_DB;
      const existingStock = { sku_id: "sku-1", quantity: 100, reserved_quantity: 10, product_id: "prod-1", sku_code: "SKU001", status: "active" };
      mockDb.prepare().bind().first.onFirstCall().resolves(existingStock);
      mockDb.prepare().bind().first.onSecondCall().resolves(mockStock);
      mockDb.batch.resolves([]);

      const token = createTestJWT({ role: "admin" });
      const body = { quantity: 50 };
      const request = createMockRequest("POST", "https://example.com/api/v1/stock/sku-1/adjust", body, {
        Authorization: `Bearer ${token}`,
      }, { sku_id: "sku-1" });
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(200);
    });

    it.skip("should handle JSON parse errors in adjustStock", async () => {
      sinon.replace(adminAuth, "requireAdmin", sinon.fake.resolves({
        ok: true,
        user: { userId: "admin-1", role: "admin" },
      }));

      const request = createMockRequest("POST", "https://example.com/api/v1/stock/sku-1/adjust", null, {}, { sku_id: "sku-1" });
      request.json = async () => {
        throw new Error("Invalid JSON");
      };

      const response = await router.handle(request, env, {});
      expect(response.status).to.equal(500);
    });
  });

  describe("POST /api/v1/stock/:sku_id/reserve", () => {
    it.skip("should reserve stock", async () => {
      const mockStock = { sku_id: "sku-1", reserved_quantity: 20 };
      // Mock database for stock reservation
      const mockDb = env.INVENTORY_DB;
      const existingStock = { sku_id: "sku-1", quantity: 100, reserved_quantity: 10, available_quantity: 90, product_id: "prod-1", sku_code: "SKU001" };
      mockDb.prepare().bind().first.onFirstCall().resolves(existingStock);
      mockDb.prepare().bind().first.onSecondCall().resolves(mockStock);
      mockDb.batch.resolves([]);

      const body = { quantity: 10, reservation_id: "reservation-1" };
      const request = createMockRequest("POST", "https://example.com/api/v1/stock/sku-1/reserve", body, {
        "X-User-Id": "user-1",
      }, { sku_id: "sku-1" });
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(200);
    });

    it("should handle JSON parse errors in reserveStock", async () => {
      const request = createMockRequest("POST", "https://example.com/api/v1/stock/sku-1/reserve", null, {
        "X-User-Id": "user-1",
      }, { sku_id: "sku-1" });
      request.json = async () => {
        throw new Error("Invalid JSON");
      };

      const response = await router.handle(request, env, {});
      expect(response.status).to.equal(500);
    });

    it.skip("should handle insufficient stock error in reserveStock", async () => {
      const mockDb = env.INVENTORY_DB;
      const existingStock = { sku_id: "sku-1", quantity: 10, reserved_quantity: 5, available_quantity: 5, product_id: "prod-1", sku_code: "SKU001" };
      mockDb.prepare().bind().first.onFirstCall().resolves(existingStock);
      mockDb.batch.resolves([]);
      // Second call to verify reservation failed
      mockDb.prepare().bind().first.onSecondCall().resolves(existingStock);

      const body = { quantity: 10, reservation_id: "reservation-1" };
      const request = createMockRequest("POST", "https://example.com/api/v1/stock/sku-1/reserve", body, {
        "X-User-Id": "user-1",
      }, { sku_id: "sku-1" });
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(400);
    });
  });

  describe("POST /api/v1/stock/:sku_id/release", () => {
    it.skip("should release stock", async () => {
      const mockStock = { sku_id: "sku-1", reserved_quantity: 10 };
      // Mock database for stock release
      const mockDb = env.INVENTORY_DB;
      const reservation = { reservation_id: "reservation-1", sku_id: "sku-1", quantity: 10, status: "active" };
      const existingStock = { sku_id: "sku-1", quantity: 100, reserved_quantity: 20, available_quantity: 80, product_id: "prod-1", sku_code: "SKU001" };
      const reservationStub = mockDb.prepare().bind();
      reservationStub.first.onFirstCall().resolves(reservation);
      mockDb.prepare().bind().first.onSecondCall().resolves(existingStock);
      mockDb.prepare().bind().first.onThirdCall().resolves(mockStock);
      mockDb.batch.resolves([]);

      const body = { reservation_id: "reservation-1" };
      const request = createMockRequest("POST", "https://example.com/api/v1/stock/sku-1/release", body, {
        "X-User-Id": "user-1",
      }, { sku_id: "sku-1" });
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(200);
    });

    it("should handle JSON parse errors in releaseStock", async () => {
      const request = createMockRequest("POST", "https://example.com/api/v1/stock/sku-1/release", null, {
        "X-User-Id": "user-1",
      }, { sku_id: "sku-1" });
      request.json = async () => {
        throw new Error("Invalid JSON");
      };

      const response = await router.handle(request, env, {});
      expect(response.status).to.equal(500);
    });
  });

  describe("POST /api/v1/webhooks/payment-status", () => {
    it.skip("should handle payment status webhook", async () => {
      const mockResponse = { success: true, message: "Stock deducted" };
      // Mock database for webhook handler
      const mockDb = env.INVENTORY_DB;
      const existingStock = { sku_id: "sku-1", quantity: 100, reserved_quantity: 10, available_quantity: 90, product_id: "prod-1", sku_code: "SKU001", status: "active" };
      const adjustedStock = { ...existingStock, quantity: 90, available_quantity: 80 };
      mockDb.prepare().bind().first.onFirstCall().resolves(existingStock);
      mockDb.prepare().bind().first.onSecondCall().resolves(adjustedStock);
      mockDb.batch.resolves([]);

      const body = {
        payment_status: "captured",
        order_items: [{ sku_id: "sku-1", quantity: 10 }],
      };
      const request = createMockRequest("POST", "https://example.com/api/v1/webhooks/payment-status", body);
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(200);
    });

    it("should handle payment status not captured", async () => {
      const body = {
        payment_status: "pending",
        order_items: [{ sku_id: "sku-1", quantity: 10 }],
      };
      const request = createMockRequest("POST", "https://example.com/api/v1/webhooks/payment-status", body);
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(200);
      const data = await response.json();
      expect(data.message).to.include("no stock deduction");
    });

    it.skip("should handle webhook import errors", async () => {
      // This tests the error handling in the router when webhook handler import fails
      const body = {
        payment_status: "captured",
        order_items: [{ sku_id: "sku-1", quantity: 10 }],
      };
      const request = createMockRequest("POST", "https://example.com/api/v1/webhooks/payment-status", body);
      
      // Mock the dynamic import to fail
      const originalImport = global.import;
      global.import = async () => {
        throw new Error("Import failed");
      };

      try {
        const response = await router.handle(request, env, {});
        expect(response.status).to.equal(500);
      } finally {
        global.import = originalImport;
      }
    });
  });

  describe("POST /api/v1/stock/check (legacy endpoint)", () => {
    it("should return 301 redirect message", async () => {
      const body = { sku_ids: ["sku-1"] };
      const request = createMockRequest("POST", "https://example.com/api/v1/stock/check", body);
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(301);
      const data = await response.json();
      expect(data.error).to.equal("endpoint_moved");
    });
  });

  describe("POST /api/v1/stock/:sku_id with check as sku_id", () => {
    it.skip("should return 404 when sku_id is 'check'", async () => {
      const body = { product_id: "prod-1", quantity: 100 };
      const request = createMockRequest("POST", "https://example.com/api/v1/stock/check", body, {
        "X-Source": "catalog-worker-service-binding",
      }, { sku_id: "check" });
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(404);
      const data = await response.json();
      expect(data.error).to.equal("not_found");
    });
  });

  describe("404 Handler", () => {
    it("should return 404 for unknown routes", async () => {
      const request = createMockRequest("GET", "https://example.com/api/v1/unknown-route");
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(404);
      const data = await response.json();
      expect(data.error).to.equal("not_found");
    });
  });

  describe("Error Handling", () => {
    it.skip("should handle handler errors gracefully", async () => {
      const mockDb = env.INVENTORY_DB;
      mockDb.prepare().bind().first.rejects(new Error("Database error"));

      const request = createMockRequest("GET", "https://example.com/api/v1/stock/sku-1", null, {}, { sku_id: "sku-1" });
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(500);
      const data = await response.json();
      expect(data.error).to.equal("internal_error");
    });

    it.skip("should handle router errors in POST /api/v1/stock/:sku_id", async () => {
      sinon.replace(adminAuth, "requireServiceOrAdmin", sinon.fake.rejects(new Error("Auth error")));

      const body = { product_id: "prod-1", quantity: 100 };
      const request = createMockRequest("POST", "https://example.com/api/v1/stock/sku-1", body, {}, { sku_id: "sku-1" });
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(500);
    });

    it.skip("should handle router errors in PUT /api/v1/stock/:sku_id", async () => {
      sinon.replace(adminAuth, "requireAdmin", sinon.fake.rejects(new Error("Auth error")));

      const body = { quantity: 150 };
      const request = createMockRequest("PUT", "https://example.com/api/v1/stock/sku-1", body, {}, { sku_id: "sku-1" });
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(500);
    });

    it.skip("should handle router errors in POST /api/v1/stock/:sku_id/adjust", async () => {
      sinon.replace(adminAuth, "requireAdmin", sinon.fake.rejects(new Error("Auth error")));

      const body = { quantity: 50 };
      const request = createMockRequest("POST", "https://example.com/api/v1/stock/sku-1/adjust", body, {}, { sku_id: "sku-1" });
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(500);
    });

    it("should handle router errors in POST /api/v1/stock/:sku_id/reserve", async () => {
      const mockDb = env.INVENTORY_DB;
      mockDb.prepare().bind().first.rejects(new Error("Database error"));

      const body = { quantity: 10, reservation_id: "reservation-1" };
      const request = createMockRequest("POST", "https://example.com/api/v1/stock/sku-1/reserve", body, {
        "X-User-Id": "user-1",
      }, { sku_id: "sku-1" });
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(500);
    });

    it("should handle router errors in POST /api/v1/stock/:sku_id/release", async () => {
      const mockDb = env.INVENTORY_DB;
      const reservationStub = mockDb.prepare().bind();
      reservationStub.first.rejects(new Error("Database error"));

      const body = { reservation_id: "reservation-1" };
      const request = createMockRequest("POST", "https://example.com/api/v1/stock/sku-1/release", body, {
        "X-User-Id": "user-1",
      }, { sku_id: "sku-1" });
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(500);
    });

    it.skip("should handle router errors in POST /api/v1/webhooks/payment-status", async () => {
      const body = {
        payment_status: "captured",
        order_items: [{ sku_id: "sku-1", quantity: 10 }],
      };
      const request = createMockRequest("POST", "https://example.com/api/v1/webhooks/payment-status", body);
      request.json = async () => {
        throw new Error("JSON parse error");
      };

      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(500);
    });

    it.skip("should handle router errors in GET /api/v1/stock/product/:product_id", async () => {
      const mockDb = env.INVENTORY_DB;
      mockDb.prepare().bind().all.rejects(new Error("Database error"));

      const request = createMockRequest("GET", "https://example.com/api/v1/stock/product/prod-1", null, {}, { product_id: "prod-1" });
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(500);
    });

    it.skip("should handle router errors in GET /api/v1/stock/:sku_id/history", async () => {
      const mockDb = env.INVENTORY_DB;
      mockDb.prepare().bind().all.rejects(new Error("Database error"));

      const request = createMockRequest("GET", "https://example.com/api/v1/stock/sku-1/history", null, {}, { sku_id: "sku-1" });
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(500);
    });

    it.skip("should handle router errors in POST /api/v1/check-stock", async () => {
      const mockDb = env.INVENTORY_DB;
      mockDb.prepare().bind().all.rejects(new Error("Database error"));

      const body = { sku_ids: ["sku-1"] };
      const request = createMockRequest("POST", "https://example.com/api/v1/check-stock", body);
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(500);
    });

    it("should handle validation errors in check-stock", async () => {
      const body = { sku_ids: [] }; // Empty array should fail validation
      const request = createMockRequest("POST", "https://example.com/api/v1/check-stock", body);
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(400);
      const data = await response.json();
      expect(data.error).to.equal("validation_error");
    });

    it.skip("should handle router returning invalid response", async () => {
      // This tests the safeRouter wrapper that ensures valid Response
      // We can't easily test this without modifying the router, but we can test error paths
      const mockDb = env.INVENTORY_DB;
      mockDb.prepare().bind().first.rejects(new Error("Database error"));

      const request = createMockRequest("GET", "https://example.com/api/v1/stock/sku-1", null, {}, { sku_id: "sku-1" });
      const response = await router.handle(request, env, {});

      // Router should handle errors and return valid Response
      expect(response).to.be.instanceOf(Response);
      expect(response.status).to.equal(500);
    });

    it("should handle missing reservation_id in releaseStock", async () => {
      const body = {};
      const request = createMockRequest("POST", "https://example.com/api/v1/stock/sku-1/release", body, {
        "X-User-Id": "user-1",
      }, { sku_id: "sku-1" });
      const response = await router.handle(request, env, {});

      expect(response.status).to.equal(400);
    });
  });

  describe("Router wrapper safety", () => {
    it("should always return a Response object", async () => {
      const request = createMockRequest("GET", "https://example.com/api/v1/unknown-route");
      const response = await router.handle(request, env, {});

      expect(response).to.be.instanceOf(Response);
      expect(response.status).to.be.a("number");
    });
  });
});

