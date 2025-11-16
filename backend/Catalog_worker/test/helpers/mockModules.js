// test/helpers/mockModules.js
// Helper to create mockable versions of ES modules
// Since ES modules have read-only exports, we create proxy objects

export function createMockableModule(moduleExports) {
  const mockable = {};
  for (const [key, value] of Object.entries(moduleExports)) {
    Object.defineProperty(mockable, key, {
      get: () => value,
      set: (newValue) => {
        // Store mock in a separate map
        if (!mockable._mocks) mockable._mocks = new Map();
        mockable._mocks.set(key, newValue);
      },
      configurable: true,
      enumerable: true
    });
  }
  return mockable;
}

// Alternative: Use a proxy to intercept property access
export function createModuleProxy(moduleExports) {
  const mocks = new Map();
  return new Proxy(moduleExports, {
    get(target, prop) {
      if (mocks.has(prop)) {
        return mocks.get(prop);
      }
      return target[prop];
    },
    set(target, prop, value) {
      mocks.set(prop, value);
      return true;
    }
  });
}

