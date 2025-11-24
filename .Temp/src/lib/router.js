// Simple client-side router
export function createRouter() {
  let currentRoute = "home";
  let listeners = [];

  function navigate(route) {
    currentRoute = route;
    window.history.pushState({ route }, "", `#${route}`);
    listeners.forEach((listener) => listener(currentRoute));
  }

  function getCurrentRoute() {
    const hash = window.location.hash.slice(1) || "home";
    return hash;
  }

  function init() {
    currentRoute = getCurrentRoute();
    window.addEventListener("popstate", () => {
      currentRoute = getCurrentRoute();
      listeners.forEach((listener) => listener(currentRoute));
    });
    window.addEventListener("hashchange", () => {
      currentRoute = getCurrentRoute();
      listeners.forEach((listener) => listener(currentRoute));
    });
  }

  function subscribe(listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }

  return {
    navigate,
    getCurrentRoute,
    init,
    subscribe,
  };
}

export const router = createRouter();
