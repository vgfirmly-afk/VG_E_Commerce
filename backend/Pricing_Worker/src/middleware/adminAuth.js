// middleware/adminAuth.js
// Middleware for admin authentication
// Only allows service binding for initial price creation (POST /prices/:sku_id)
// All other admin endpoints require JWT token verification

import { logError, logWarn } from "../utils/logger.js";
import { verifyJWT } from "../utils/jwt.js";

/**
 * Require admin authentication via JWT token
 * This is used for all admin endpoints EXCEPT initial price creation
 */
export async function requireAdmin(request, env) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        ok: false,
        error: "authentication_error",
        message:
          "Missing or invalid Authorization header. Bearer token required.",
        status: 401,
      };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return {
        ok: false,
        error: "authentication_error",
        message: "Missing authentication token",
        status: 401,
      };
    }

    // Verify JWT token
    if (!env.JWT_PUBLIC_KEY) {
      logError("requireAdmin: JWT_PUBLIC_KEY not configured");
      return {
        ok: false,
        error: "authentication_error",
        message: "JWT verification not configured",
        status: 401,
      };
    }

    const payload = await verifyJWT(token, env);
    if (!payload) {
      return {
        ok: false,
        error: "authentication_error",
        message: "Invalid or expired token",
        status: 401,
      };
    }

    // Check if user has admin role (adjust based on your role system)
    const role = payload.role || payload.roles;
    if (role !== "admin" && role !== "ADMIN") {
      logWarn("requireAdmin: User does not have admin role", {
        userId: payload.sub,
        role,
      });
      return {
        ok: false,
        error: "authorization_error",
        message: "Admin role required",
        status: 403,
      };
    }

    return {
      ok: true,
      user: {
        userId: payload.sub || payload.userId || payload.id,
        role: role,
        email: payload.email,
        payload: payload,
      },
    };
  } catch (err) {
    logError("requireAdmin: Error", err);
    return {
      ok: false,
      error: "authentication_error",
      message: "Authentication failed",
      status: 401,
    };
  }
}

/**
 * Require service binding OR admin JWT for initial price creation
 * This allows Catalog Worker to create prices via service binding
 * OR allows admin to manually initialize prices via JWT
 */
export async function requireServiceOrAdmin(request, env) {
  try {
    // Check if this is a Service Binding request (internal, secure, no auth needed)
    const sourceHeader = request.headers.get("X-Source");
    if (sourceHeader === "catalog-worker-service-binding") {
      // Service bindings are internal and secure - trust them automatically
      return {
        ok: true,
        user: {
          userId: "catalog_worker_service",
          role: "service",
          source: "service_binding",
        },
      };
    }

    // For non-service-binding requests, require admin JWT
    return await requireAdmin(request, env);
  } catch (err) {
    logError("requireServiceOrAdmin: Error", err);
    return {
      ok: false,
      error: "authentication_error",
      message: "Authentication failed",
      status: 401,
    };
  }
}
