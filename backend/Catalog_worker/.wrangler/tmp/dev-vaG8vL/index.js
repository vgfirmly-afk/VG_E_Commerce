var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
var init_utils = __esm({
  "../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/_internal/utils.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(createNotImplementedError, "createNotImplementedError");
    __name(notImplemented, "notImplemented");
    __name(notImplementedClass, "notImplementedClass");
  }
});

// ../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin, _performanceNow, nodeTiming, PerformanceEntry, PerformanceMark, PerformanceMeasure, PerformanceResourceTiming, PerformanceObserverEntryList, Performance, PerformanceObserver, performance2;
var init_performance = __esm({
  "../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
    _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
    nodeTiming = {
      name: "node",
      entryType: "node",
      startTime: 0,
      duration: 0,
      nodeStart: 0,
      v8Start: 0,
      bootstrapComplete: 0,
      environment: 0,
      loopStart: 0,
      loopExit: 0,
      idleTime: 0,
      uvMetricsInfo: {
        loopCount: 0,
        events: 0,
        eventsWaiting: 0
      },
      detail: void 0,
      toJSON() {
        return this;
      }
    };
    PerformanceEntry = class {
      static {
        __name(this, "PerformanceEntry");
      }
      __unenv__ = true;
      detail;
      entryType = "event";
      name;
      startTime;
      constructor(name, options) {
        this.name = name;
        this.startTime = options?.startTime || _performanceNow();
        this.detail = options?.detail;
      }
      get duration() {
        return _performanceNow() - this.startTime;
      }
      toJSON() {
        return {
          name: this.name,
          entryType: this.entryType,
          startTime: this.startTime,
          duration: this.duration,
          detail: this.detail
        };
      }
    };
    PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
      static {
        __name(this, "PerformanceMark");
      }
      entryType = "mark";
      constructor() {
        super(...arguments);
      }
      get duration() {
        return 0;
      }
    };
    PerformanceMeasure = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceMeasure");
      }
      entryType = "measure";
    };
    PerformanceResourceTiming = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceResourceTiming");
      }
      entryType = "resource";
      serverTiming = [];
      connectEnd = 0;
      connectStart = 0;
      decodedBodySize = 0;
      domainLookupEnd = 0;
      domainLookupStart = 0;
      encodedBodySize = 0;
      fetchStart = 0;
      initiatorType = "";
      name = "";
      nextHopProtocol = "";
      redirectEnd = 0;
      redirectStart = 0;
      requestStart = 0;
      responseEnd = 0;
      responseStart = 0;
      secureConnectionStart = 0;
      startTime = 0;
      transferSize = 0;
      workerStart = 0;
      responseStatus = 0;
    };
    PerformanceObserverEntryList = class {
      static {
        __name(this, "PerformanceObserverEntryList");
      }
      __unenv__ = true;
      getEntries() {
        return [];
      }
      getEntriesByName(_name, _type) {
        return [];
      }
      getEntriesByType(type) {
        return [];
      }
    };
    Performance = class {
      static {
        __name(this, "Performance");
      }
      __unenv__ = true;
      timeOrigin = _timeOrigin;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = void 0;
      timing = void 0;
      timerify(_fn, _options) {
        throw createNotImplementedError("Performance.timerify");
      }
      get nodeTiming() {
        return nodeTiming;
      }
      eventLoopUtilization() {
        return {};
      }
      markResourceTiming() {
        return new PerformanceResourceTiming("");
      }
      onresourcetimingbufferfull = null;
      now() {
        if (this.timeOrigin === _timeOrigin) {
          return _performanceNow();
        }
        return Date.now() - this.timeOrigin;
      }
      clearMarks(markName) {
        this._entries = markName ? this._entries.filter((e2) => e2.name !== markName) : this._entries.filter((e2) => e2.entryType !== "mark");
      }
      clearMeasures(measureName) {
        this._entries = measureName ? this._entries.filter((e2) => e2.name !== measureName) : this._entries.filter((e2) => e2.entryType !== "measure");
      }
      clearResourceTimings() {
        this._entries = this._entries.filter((e2) => e2.entryType !== "resource" || e2.entryType !== "navigation");
      }
      getEntries() {
        return this._entries;
      }
      getEntriesByName(name, type) {
        return this._entries.filter((e2) => e2.name === name && (!type || e2.entryType === type));
      }
      getEntriesByType(type) {
        return this._entries.filter((e2) => e2.entryType === type);
      }
      mark(name, options) {
        const entry = new PerformanceMark(name, options);
        this._entries.push(entry);
        return entry;
      }
      measure(measureName, startOrMeasureOptions, endMark) {
        let start;
        let end;
        if (typeof startOrMeasureOptions === "string") {
          start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
          end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
        } else {
          start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
        }
        const entry = new PerformanceMeasure(measureName, {
          startTime: start,
          detail: {
            start,
            end
          }
        });
        this._entries.push(entry);
        return entry;
      }
      setResourceTimingBufferSize(maxSize) {
        this._resourceTimingBufferSize = maxSize;
      }
      addEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.addEventListener");
      }
      removeEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw createNotImplementedError("Performance.dispatchEvent");
      }
      toJSON() {
        return this;
      }
    };
    PerformanceObserver = class {
      static {
        __name(this, "PerformanceObserver");
      }
      __unenv__ = true;
      static supportedEntryTypes = [];
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw createNotImplementedError("PerformanceObserver.disconnect");
      }
      observe(options) {
        throw createNotImplementedError("PerformanceObserver.observe");
      }
      bind(fn) {
        return fn;
      }
      runInAsyncScope(fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      asyncId() {
        return 0;
      }
      triggerAsyncId() {
        return 0;
      }
      emitDestroy() {
        return this;
      }
    };
    performance2 = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();
  }
});

// ../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/perf_hooks.mjs
var init_perf_hooks = __esm({
  "../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/perf_hooks.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_performance();
  }
});

// ../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
var init_performance2 = __esm({
  "../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs"() {
    init_perf_hooks();
    globalThis.performance = performance2;
    globalThis.Performance = Performance;
    globalThis.PerformanceEntry = PerformanceEntry;
    globalThis.PerformanceMark = PerformanceMark;
    globalThis.PerformanceMeasure = PerformanceMeasure;
    globalThis.PerformanceObserver = PerformanceObserver;
    globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
    globalThis.PerformanceResourceTiming = PerformanceResourceTiming;
  }
});

// ../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default;
var init_noop = __esm({
  "../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/mock/noop.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    noop_default = Object.assign(() => {
    }, { __unenv__: true });
  }
});

// ../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";
var _console, _ignoreErrors, _stderr, _stdout, log, info, trace, debug, table, error, warn, createTask, clear, count, countReset, dir, dirxml, group, groupEnd, groupCollapsed, profile, profileEnd, time, timeEnd, timeLog, timeStamp, Console, _times, _stdoutErrorHandler, _stderrErrorHandler;
var init_console = __esm({
  "../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/console.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_noop();
    init_utils();
    _console = globalThis.console;
    _ignoreErrors = true;
    _stderr = new Writable();
    _stdout = new Writable();
    log = _console?.log ?? noop_default;
    info = _console?.info ?? log;
    trace = _console?.trace ?? info;
    debug = _console?.debug ?? log;
    table = _console?.table ?? log;
    error = _console?.error ?? log;
    warn = _console?.warn ?? error;
    createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
    clear = _console?.clear ?? noop_default;
    count = _console?.count ?? noop_default;
    countReset = _console?.countReset ?? noop_default;
    dir = _console?.dir ?? noop_default;
    dirxml = _console?.dirxml ?? noop_default;
    group = _console?.group ?? noop_default;
    groupEnd = _console?.groupEnd ?? noop_default;
    groupCollapsed = _console?.groupCollapsed ?? noop_default;
    profile = _console?.profile ?? noop_default;
    profileEnd = _console?.profileEnd ?? noop_default;
    time = _console?.time ?? noop_default;
    timeEnd = _console?.timeEnd ?? noop_default;
    timeLog = _console?.timeLog ?? noop_default;
    timeStamp = _console?.timeStamp ?? noop_default;
    Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
    _times = /* @__PURE__ */ new Map();
    _stdoutErrorHandler = noop_default;
    _stderrErrorHandler = noop_default;
  }
});

// ../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole, assert, clear2, context, count2, countReset2, createTask2, debug2, dir2, dirxml2, error2, group2, groupCollapsed2, groupEnd2, info2, log2, profile2, profileEnd2, table2, time2, timeEnd2, timeLog2, timeStamp2, trace2, warn2, console_default;
var init_console2 = __esm({
  "../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_console();
    workerdConsole = globalThis["console"];
    ({
      assert,
      clear: clear2,
      context: (
        // @ts-expect-error undocumented public API
        context
      ),
      count: count2,
      countReset: countReset2,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask2
      ),
      debug: debug2,
      dir: dir2,
      dirxml: dirxml2,
      error: error2,
      group: group2,
      groupCollapsed: groupCollapsed2,
      groupEnd: groupEnd2,
      info: info2,
      log: log2,
      profile: profile2,
      profileEnd: profileEnd2,
      table: table2,
      time: time2,
      timeEnd: timeEnd2,
      timeLog: timeLog2,
      timeStamp: timeStamp2,
      trace: trace2,
      warn: warn2
    } = workerdConsole);
    Object.assign(workerdConsole, {
      Console,
      _ignoreErrors,
      _stderr,
      _stderrErrorHandler,
      _stdout,
      _stdoutErrorHandler,
      _times
    });
    console_default = workerdConsole;
  }
});

// ../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console = __esm({
  "../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console"() {
    init_console2();
    globalThis.console = console_default;
  }
});

// ../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime;
var init_hrtime = __esm({
  "../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
      const now = Date.now();
      const seconds = Math.trunc(now / 1e3);
      const nanos = now % 1e3 * 1e6;
      if (startTime) {
        let diffSeconds = seconds - startTime[0];
        let diffNanos = nanos - startTime[0];
        if (diffNanos < 0) {
          diffSeconds = diffSeconds - 1;
          diffNanos = 1e9 + diffNanos;
        }
        return [diffSeconds, diffNanos];
      }
      return [seconds, nanos];
    }, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
      return BigInt(Date.now() * 1e6);
    }, "bigint") });
  }
});

// ../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream;
var init_read_stream = __esm({
  "../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ReadStream = class {
      static {
        __name(this, "ReadStream");
      }
      fd;
      isRaw = false;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      setRawMode(mode) {
        this.isRaw = mode;
        return this;
      }
    };
  }
});

// ../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream;
var init_write_stream = __esm({
  "../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WriteStream = class {
      static {
        __name(this, "WriteStream");
      }
      fd;
      columns = 80;
      rows = 24;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      clearLine(dir3, callback) {
        callback && callback();
        return false;
      }
      clearScreenDown(callback) {
        callback && callback();
        return false;
      }
      cursorTo(x, y, callback) {
        callback && typeof callback === "function" && callback();
        return false;
      }
      moveCursor(dx, dy, callback) {
        callback && callback();
        return false;
      }
      getColorDepth(env2) {
        return 1;
      }
      hasColors(count3, env2) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      write(str, encoding, cb) {
        if (str instanceof Uint8Array) {
          str = new TextDecoder().decode(str);
        }
        try {
          console.log(str);
        } catch {
        }
        cb && typeof cb === "function" && cb();
        return false;
      }
    };
  }
});

// ../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/tty.mjs
var init_tty = __esm({
  "../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/tty.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_read_stream();
    init_write_stream();
  }
});

// ../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION;
var init_node_version = __esm({
  "../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    NODE_VERSION = "22.14.0";
  }
});

// ../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";
var Process;
var init_process = __esm({
  "../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    init_utils();
    init_node_version();
    Process = class _Process extends EventEmitter {
      static {
        __name(this, "Process");
      }
      env;
      hrtime;
      nextTick;
      constructor(impl) {
        super();
        this.env = impl.env;
        this.hrtime = impl.hrtime;
        this.nextTick = impl.nextTick;
        for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
          const value = this[prop];
          if (typeof value === "function") {
            this[prop] = value.bind(this);
          }
        }
      }
      // --- event emitter ---
      emitWarning(warning, type, code) {
        console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
      }
      emit(...args) {
        return super.emit(...args);
      }
      listeners(eventName) {
        return super.listeners(eventName);
      }
      // --- stdio (lazy initializers) ---
      #stdin;
      #stdout;
      #stderr;
      get stdin() {
        return this.#stdin ??= new ReadStream(0);
      }
      get stdout() {
        return this.#stdout ??= new WriteStream(1);
      }
      get stderr() {
        return this.#stderr ??= new WriteStream(2);
      }
      // --- cwd ---
      #cwd = "/";
      chdir(cwd2) {
        this.#cwd = cwd2;
      }
      cwd() {
        return this.#cwd;
      }
      // --- dummy props and getters ---
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return `v${NODE_VERSION}`;
      }
      get versions() {
        return { node: NODE_VERSION };
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      // --- noop methods ---
      ref() {
      }
      unref() {
      }
      // --- unimplemented methods ---
      umask() {
        throw createNotImplementedError("process.umask");
      }
      getBuiltinModule() {
        return void 0;
      }
      getActiveResourcesInfo() {
        throw createNotImplementedError("process.getActiveResourcesInfo");
      }
      exit() {
        throw createNotImplementedError("process.exit");
      }
      reallyExit() {
        throw createNotImplementedError("process.reallyExit");
      }
      kill() {
        throw createNotImplementedError("process.kill");
      }
      abort() {
        throw createNotImplementedError("process.abort");
      }
      dlopen() {
        throw createNotImplementedError("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw createNotImplementedError("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw createNotImplementedError("process.loadEnvFile");
      }
      disconnect() {
        throw createNotImplementedError("process.disconnect");
      }
      cpuUsage() {
        throw createNotImplementedError("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw createNotImplementedError("process.initgroups");
      }
      openStdin() {
        throw createNotImplementedError("process.openStdin");
      }
      assert() {
        throw createNotImplementedError("process.assert");
      }
      binding() {
        throw createNotImplementedError("process.binding");
      }
      // --- attached interfaces ---
      permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
      report = {
        directory: "",
        filename: "",
        signal: "SIGUSR2",
        compact: false,
        reportOnFatalError: false,
        reportOnSignal: false,
        reportOnUncaughtException: false,
        getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
        writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
      };
      finalization = {
        register: /* @__PURE__ */ notImplemented("process.finalization.register"),
        unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
        registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
      };
      memoryUsage = Object.assign(() => ({
        arrayBuffers: 0,
        rss: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0
      }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
      // --- undefined props ---
      mainModule = void 0;
      domain = void 0;
      // optional
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      // internals
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    };
  }
});

// ../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess, getBuiltinModule, workerdProcess, isWorkerdProcessV2, unenvProcess, exit, features, platform, env, hrtime3, nextTick, _channel, _disconnect, _events, _eventsCount, _handleQueue, _maxListeners, _pendingMessage, _send, assert2, disconnect, mainModule, _debugEnd, _debugProcess, _exiting, _fatalException, _getActiveHandles, _getActiveRequests, _kill, _linkedBinding, _preload_modules, _rawDebug, _startProfilerIdleNotifier, _stopProfilerIdleNotifier, _tickCallback, abort, addListener, allowedNodeEnvironmentFlags, arch, argv, argv0, availableMemory, binding, channel, chdir, config, connected, constrainedMemory, cpuUsage, cwd, debugPort, dlopen, domain, emit, emitWarning, eventNames, execArgv, execPath, exitCode, finalization, getActiveResourcesInfo, getegid, geteuid, getgid, getgroups, getMaxListeners, getuid, hasUncaughtExceptionCaptureCallback, initgroups, kill, listenerCount, listeners, loadEnvFile, memoryUsage, moduleLoadList, off, on, once, openStdin, permission, pid, ppid, prependListener, prependOnceListener, rawListeners, reallyExit, ref, release, removeAllListeners, removeListener, report, resourceUsage, send, setegid, seteuid, setgid, setgroups, setMaxListeners, setSourceMapsEnabled, setuid, setUncaughtExceptionCaptureCallback, sourceMapsEnabled, stderr, stdin, stdout, throwDeprecation, title, traceDeprecation, umask, unref, uptime, version, versions, _process, process_default;
var init_process2 = __esm({
  "../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_hrtime();
    init_process();
    globalProcess = globalThis["process"];
    getBuiltinModule = globalProcess.getBuiltinModule;
    workerdProcess = getBuiltinModule("node:process");
    isWorkerdProcessV2 = globalThis.Cloudflare.compatibilityFlags.enable_nodejs_process_v2;
    unenvProcess = new Process({
      env: globalProcess.env,
      // `hrtime` is only available from workerd process v2
      hrtime: isWorkerdProcessV2 ? workerdProcess.hrtime : hrtime,
      // `nextTick` is available from workerd process v1
      nextTick: workerdProcess.nextTick
    });
    ({ exit, features, platform } = workerdProcess);
    ({
      env: (
        // Always implemented by workerd
        env
      ),
      hrtime: (
        // Only implemented in workerd v2
        hrtime3
      ),
      nextTick: (
        // Always implemented by workerd
        nextTick
      )
    } = unenvProcess);
    ({
      _channel,
      _disconnect,
      _events,
      _eventsCount,
      _handleQueue,
      _maxListeners,
      _pendingMessage,
      _send,
      assert: assert2,
      disconnect,
      mainModule
    } = unenvProcess);
    ({
      _debugEnd: (
        // @ts-expect-error `_debugEnd` is missing typings
        _debugEnd
      ),
      _debugProcess: (
        // @ts-expect-error `_debugProcess` is missing typings
        _debugProcess
      ),
      _exiting: (
        // @ts-expect-error `_exiting` is missing typings
        _exiting
      ),
      _fatalException: (
        // @ts-expect-error `_fatalException` is missing typings
        _fatalException
      ),
      _getActiveHandles: (
        // @ts-expect-error `_getActiveHandles` is missing typings
        _getActiveHandles
      ),
      _getActiveRequests: (
        // @ts-expect-error `_getActiveRequests` is missing typings
        _getActiveRequests
      ),
      _kill: (
        // @ts-expect-error `_kill` is missing typings
        _kill
      ),
      _linkedBinding: (
        // @ts-expect-error `_linkedBinding` is missing typings
        _linkedBinding
      ),
      _preload_modules: (
        // @ts-expect-error `_preload_modules` is missing typings
        _preload_modules
      ),
      _rawDebug: (
        // @ts-expect-error `_rawDebug` is missing typings
        _rawDebug
      ),
      _startProfilerIdleNotifier: (
        // @ts-expect-error `_startProfilerIdleNotifier` is missing typings
        _startProfilerIdleNotifier
      ),
      _stopProfilerIdleNotifier: (
        // @ts-expect-error `_stopProfilerIdleNotifier` is missing typings
        _stopProfilerIdleNotifier
      ),
      _tickCallback: (
        // @ts-expect-error `_tickCallback` is missing typings
        _tickCallback
      ),
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      arch,
      argv,
      argv0,
      availableMemory,
      binding: (
        // @ts-expect-error `binding` is missing typings
        binding
      ),
      channel,
      chdir,
      config,
      connected,
      constrainedMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      domain: (
        // @ts-expect-error `domain` is missing typings
        domain
      ),
      emit,
      emitWarning,
      eventNames,
      execArgv,
      execPath,
      exitCode,
      finalization,
      getActiveResourcesInfo,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getMaxListeners,
      getuid,
      hasUncaughtExceptionCaptureCallback,
      initgroups: (
        // @ts-expect-error `initgroups` is missing typings
        initgroups
      ),
      kill,
      listenerCount,
      listeners,
      loadEnvFile,
      memoryUsage,
      moduleLoadList: (
        // @ts-expect-error `moduleLoadList` is missing typings
        moduleLoadList
      ),
      off,
      on,
      once,
      openStdin: (
        // @ts-expect-error `openStdin` is missing typings
        openStdin
      ),
      permission,
      pid,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      reallyExit: (
        // @ts-expect-error `reallyExit` is missing typings
        reallyExit
      ),
      ref,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      send,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setMaxListeners,
      setSourceMapsEnabled,
      setuid,
      setUncaughtExceptionCaptureCallback,
      sourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      throwDeprecation,
      title,
      traceDeprecation,
      umask,
      unref,
      uptime,
      version,
      versions
    } = isWorkerdProcessV2 ? workerdProcess : unenvProcess);
    _process = {
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exit,
      finalization,
      features,
      getBuiltinModule,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      nextTick,
      on,
      off,
      once,
      pid,
      platform,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      // @ts-expect-error old API
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    };
    process_default = _process;
  }
});

// ../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process = __esm({
  "../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process"() {
    init_process2();
    globalThis.process = process_default;
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
  }
});

// ../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// node_modules/@opentelemetry/api/build/src/platform/browser/globalThis.js
var require_globalThis = __commonJS({
  "node_modules/@opentelemetry/api/build/src/platform/browser/globalThis.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._globalThis = void 0;
    exports._globalThis = typeof globalThis === "object" ? globalThis : typeof self === "object" ? self : typeof window === "object" ? window : typeof global === "object" ? global : {};
  }
});

// node_modules/@opentelemetry/api/build/src/platform/browser/index.js
var require_browser = __commonJS({
  "node_modules/@opentelemetry/api/build/src/platform/browser/index.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: /* @__PURE__ */ __name(function() {
        return m[k];
      }, "get") });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_globalThis(), exports);
  }
});

// node_modules/@opentelemetry/api/build/src/version.js
var require_version = __commonJS({
  "node_modules/@opentelemetry/api/build/src/version.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VERSION = void 0;
    exports.VERSION = "1.9.0";
  }
});

// node_modules/@opentelemetry/api/build/src/internal/semver.js
var require_semver = __commonJS({
  "node_modules/@opentelemetry/api/build/src/internal/semver.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isCompatible = exports._makeCompatibilityCheck = void 0;
    var version_1 = require_version();
    var re = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
    function _makeCompatibilityCheck(ownVersion) {
      const acceptedVersions = /* @__PURE__ */ new Set([ownVersion]);
      const rejectedVersions = /* @__PURE__ */ new Set();
      const myVersionMatch = ownVersion.match(re);
      if (!myVersionMatch) {
        return () => false;
      }
      const ownVersionParsed = {
        major: +myVersionMatch[1],
        minor: +myVersionMatch[2],
        patch: +myVersionMatch[3],
        prerelease: myVersionMatch[4]
      };
      if (ownVersionParsed.prerelease != null) {
        return /* @__PURE__ */ __name(function isExactmatch(globalVersion) {
          return globalVersion === ownVersion;
        }, "isExactmatch");
      }
      function _reject(v) {
        rejectedVersions.add(v);
        return false;
      }
      __name(_reject, "_reject");
      function _accept(v) {
        acceptedVersions.add(v);
        return true;
      }
      __name(_accept, "_accept");
      return /* @__PURE__ */ __name(function isCompatible(globalVersion) {
        if (acceptedVersions.has(globalVersion)) {
          return true;
        }
        if (rejectedVersions.has(globalVersion)) {
          return false;
        }
        const globalVersionMatch = globalVersion.match(re);
        if (!globalVersionMatch) {
          return _reject(globalVersion);
        }
        const globalVersionParsed = {
          major: +globalVersionMatch[1],
          minor: +globalVersionMatch[2],
          patch: +globalVersionMatch[3],
          prerelease: globalVersionMatch[4]
        };
        if (globalVersionParsed.prerelease != null) {
          return _reject(globalVersion);
        }
        if (ownVersionParsed.major !== globalVersionParsed.major) {
          return _reject(globalVersion);
        }
        if (ownVersionParsed.major === 0) {
          if (ownVersionParsed.minor === globalVersionParsed.minor && ownVersionParsed.patch <= globalVersionParsed.patch) {
            return _accept(globalVersion);
          }
          return _reject(globalVersion);
        }
        if (ownVersionParsed.minor <= globalVersionParsed.minor) {
          return _accept(globalVersion);
        }
        return _reject(globalVersion);
      }, "isCompatible");
    }
    __name(_makeCompatibilityCheck, "_makeCompatibilityCheck");
    exports._makeCompatibilityCheck = _makeCompatibilityCheck;
    exports.isCompatible = _makeCompatibilityCheck(version_1.VERSION);
  }
});

// node_modules/@opentelemetry/api/build/src/internal/global-utils.js
var require_global_utils = __commonJS({
  "node_modules/@opentelemetry/api/build/src/internal/global-utils.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.unregisterGlobal = exports.getGlobal = exports.registerGlobal = void 0;
    var platform_1 = require_browser();
    var version_1 = require_version();
    var semver_1 = require_semver();
    var major = version_1.VERSION.split(".")[0];
    var GLOBAL_OPENTELEMETRY_API_KEY = Symbol.for(`opentelemetry.js.api.${major}`);
    var _global = platform_1._globalThis;
    function registerGlobal(type, instance, diag4, allowOverride = false) {
      var _a;
      const api = _global[GLOBAL_OPENTELEMETRY_API_KEY] = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) !== null && _a !== void 0 ? _a : {
        version: version_1.VERSION
      };
      if (!allowOverride && api[type]) {
        const err = new Error(`@opentelemetry/api: Attempted duplicate registration of API: ${type}`);
        diag4.error(err.stack || err.message);
        return false;
      }
      if (api.version !== version_1.VERSION) {
        const err = new Error(`@opentelemetry/api: Registration of version v${api.version} for ${type} does not match previously registered API v${version_1.VERSION}`);
        diag4.error(err.stack || err.message);
        return false;
      }
      api[type] = instance;
      diag4.debug(`@opentelemetry/api: Registered a global for ${type} v${version_1.VERSION}.`);
      return true;
    }
    __name(registerGlobal, "registerGlobal");
    exports.registerGlobal = registerGlobal;
    function getGlobal(type) {
      var _a, _b;
      const globalVersion = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _a === void 0 ? void 0 : _a.version;
      if (!globalVersion || !(0, semver_1.isCompatible)(globalVersion)) {
        return;
      }
      return (_b = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _b === void 0 ? void 0 : _b[type];
    }
    __name(getGlobal, "getGlobal");
    exports.getGlobal = getGlobal;
    function unregisterGlobal(type, diag4) {
      diag4.debug(`@opentelemetry/api: Unregistering a global for ${type} v${version_1.VERSION}.`);
      const api = _global[GLOBAL_OPENTELEMETRY_API_KEY];
      if (api) {
        delete api[type];
      }
    }
    __name(unregisterGlobal, "unregisterGlobal");
    exports.unregisterGlobal = unregisterGlobal;
  }
});

// node_modules/@opentelemetry/api/build/src/diag/ComponentLogger.js
var require_ComponentLogger = __commonJS({
  "node_modules/@opentelemetry/api/build/src/diag/ComponentLogger.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DiagComponentLogger = void 0;
    var global_utils_1 = require_global_utils();
    var DiagComponentLogger = class {
      static {
        __name(this, "DiagComponentLogger");
      }
      constructor(props) {
        this._namespace = props.namespace || "DiagComponentLogger";
      }
      debug(...args) {
        return logProxy("debug", this._namespace, args);
      }
      error(...args) {
        return logProxy("error", this._namespace, args);
      }
      info(...args) {
        return logProxy("info", this._namespace, args);
      }
      warn(...args) {
        return logProxy("warn", this._namespace, args);
      }
      verbose(...args) {
        return logProxy("verbose", this._namespace, args);
      }
    };
    exports.DiagComponentLogger = DiagComponentLogger;
    function logProxy(funcName, namespace, args) {
      const logger2 = (0, global_utils_1.getGlobal)("diag");
      if (!logger2) {
        return;
      }
      args.unshift(namespace);
      return logger2[funcName](...args);
    }
    __name(logProxy, "logProxy");
  }
});

// node_modules/@opentelemetry/api/build/src/diag/types.js
var require_types = __commonJS({
  "node_modules/@opentelemetry/api/build/src/diag/types.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DiagLogLevel = void 0;
    var DiagLogLevel;
    (function(DiagLogLevel2) {
      DiagLogLevel2[DiagLogLevel2["NONE"] = 0] = "NONE";
      DiagLogLevel2[DiagLogLevel2["ERROR"] = 30] = "ERROR";
      DiagLogLevel2[DiagLogLevel2["WARN"] = 50] = "WARN";
      DiagLogLevel2[DiagLogLevel2["INFO"] = 60] = "INFO";
      DiagLogLevel2[DiagLogLevel2["DEBUG"] = 70] = "DEBUG";
      DiagLogLevel2[DiagLogLevel2["VERBOSE"] = 80] = "VERBOSE";
      DiagLogLevel2[DiagLogLevel2["ALL"] = 9999] = "ALL";
    })(DiagLogLevel = exports.DiagLogLevel || (exports.DiagLogLevel = {}));
  }
});

// node_modules/@opentelemetry/api/build/src/diag/internal/logLevelLogger.js
var require_logLevelLogger = __commonJS({
  "node_modules/@opentelemetry/api/build/src/diag/internal/logLevelLogger.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createLogLevelDiagLogger = void 0;
    var types_1 = require_types();
    function createLogLevelDiagLogger(maxLevel, logger2) {
      if (maxLevel < types_1.DiagLogLevel.NONE) {
        maxLevel = types_1.DiagLogLevel.NONE;
      } else if (maxLevel > types_1.DiagLogLevel.ALL) {
        maxLevel = types_1.DiagLogLevel.ALL;
      }
      logger2 = logger2 || {};
      function _filterFunc(funcName, theLevel) {
        const theFunc = logger2[funcName];
        if (typeof theFunc === "function" && maxLevel >= theLevel) {
          return theFunc.bind(logger2);
        }
        return function() {
        };
      }
      __name(_filterFunc, "_filterFunc");
      return {
        error: _filterFunc("error", types_1.DiagLogLevel.ERROR),
        warn: _filterFunc("warn", types_1.DiagLogLevel.WARN),
        info: _filterFunc("info", types_1.DiagLogLevel.INFO),
        debug: _filterFunc("debug", types_1.DiagLogLevel.DEBUG),
        verbose: _filterFunc("verbose", types_1.DiagLogLevel.VERBOSE)
      };
    }
    __name(createLogLevelDiagLogger, "createLogLevelDiagLogger");
    exports.createLogLevelDiagLogger = createLogLevelDiagLogger;
  }
});

// node_modules/@opentelemetry/api/build/src/api/diag.js
var require_diag = __commonJS({
  "node_modules/@opentelemetry/api/build/src/api/diag.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DiagAPI = void 0;
    var ComponentLogger_1 = require_ComponentLogger();
    var logLevelLogger_1 = require_logLevelLogger();
    var types_1 = require_types();
    var global_utils_1 = require_global_utils();
    var API_NAME = "diag";
    var DiagAPI = class _DiagAPI {
      static {
        __name(this, "DiagAPI");
      }
      /**
       * Private internal constructor
       * @private
       */
      constructor() {
        function _logProxy(funcName) {
          return function(...args) {
            const logger2 = (0, global_utils_1.getGlobal)("diag");
            if (!logger2)
              return;
            return logger2[funcName](...args);
          };
        }
        __name(_logProxy, "_logProxy");
        const self2 = this;
        const setLogger = /* @__PURE__ */ __name((logger2, optionsOrLogLevel = { logLevel: types_1.DiagLogLevel.INFO }) => {
          var _a, _b, _c;
          if (logger2 === self2) {
            const err = new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
            self2.error((_a = err.stack) !== null && _a !== void 0 ? _a : err.message);
            return false;
          }
          if (typeof optionsOrLogLevel === "number") {
            optionsOrLogLevel = {
              logLevel: optionsOrLogLevel
            };
          }
          const oldLogger = (0, global_utils_1.getGlobal)("diag");
          const newLogger = (0, logLevelLogger_1.createLogLevelDiagLogger)((_b = optionsOrLogLevel.logLevel) !== null && _b !== void 0 ? _b : types_1.DiagLogLevel.INFO, logger2);
          if (oldLogger && !optionsOrLogLevel.suppressOverrideMessage) {
            const stack = (_c = new Error().stack) !== null && _c !== void 0 ? _c : "<failed to generate stacktrace>";
            oldLogger.warn(`Current logger will be overwritten from ${stack}`);
            newLogger.warn(`Current logger will overwrite one already registered from ${stack}`);
          }
          return (0, global_utils_1.registerGlobal)("diag", newLogger, self2, true);
        }, "setLogger");
        self2.setLogger = setLogger;
        self2.disable = () => {
          (0, global_utils_1.unregisterGlobal)(API_NAME, self2);
        };
        self2.createComponentLogger = (options) => {
          return new ComponentLogger_1.DiagComponentLogger(options);
        };
        self2.verbose = _logProxy("verbose");
        self2.debug = _logProxy("debug");
        self2.info = _logProxy("info");
        self2.warn = _logProxy("warn");
        self2.error = _logProxy("error");
      }
      /** Get the singleton instance of the DiagAPI API */
      static instance() {
        if (!this._instance) {
          this._instance = new _DiagAPI();
        }
        return this._instance;
      }
    };
    exports.DiagAPI = DiagAPI;
  }
});

// node_modules/@opentelemetry/api/build/src/baggage/internal/baggage-impl.js
var require_baggage_impl = __commonJS({
  "node_modules/@opentelemetry/api/build/src/baggage/internal/baggage-impl.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaggageImpl = void 0;
    var BaggageImpl = class _BaggageImpl {
      static {
        __name(this, "BaggageImpl");
      }
      constructor(entries) {
        this._entries = entries ? new Map(entries) : /* @__PURE__ */ new Map();
      }
      getEntry(key) {
        const entry = this._entries.get(key);
        if (!entry) {
          return void 0;
        }
        return Object.assign({}, entry);
      }
      getAllEntries() {
        return Array.from(this._entries.entries()).map(([k, v]) => [k, v]);
      }
      setEntry(key, entry) {
        const newBaggage = new _BaggageImpl(this._entries);
        newBaggage._entries.set(key, entry);
        return newBaggage;
      }
      removeEntry(key) {
        const newBaggage = new _BaggageImpl(this._entries);
        newBaggage._entries.delete(key);
        return newBaggage;
      }
      removeEntries(...keys) {
        const newBaggage = new _BaggageImpl(this._entries);
        for (const key of keys) {
          newBaggage._entries.delete(key);
        }
        return newBaggage;
      }
      clear() {
        return new _BaggageImpl();
      }
    };
    exports.BaggageImpl = BaggageImpl;
  }
});

// node_modules/@opentelemetry/api/build/src/baggage/internal/symbol.js
var require_symbol = __commonJS({
  "node_modules/@opentelemetry/api/build/src/baggage/internal/symbol.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.baggageEntryMetadataSymbol = void 0;
    exports.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata");
  }
});

// node_modules/@opentelemetry/api/build/src/baggage/utils.js
var require_utils = __commonJS({
  "node_modules/@opentelemetry/api/build/src/baggage/utils.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.baggageEntryMetadataFromString = exports.createBaggage = void 0;
    var diag_1 = require_diag();
    var baggage_impl_1 = require_baggage_impl();
    var symbol_1 = require_symbol();
    var diag4 = diag_1.DiagAPI.instance();
    function createBaggage(entries = {}) {
      return new baggage_impl_1.BaggageImpl(new Map(Object.entries(entries)));
    }
    __name(createBaggage, "createBaggage");
    exports.createBaggage = createBaggage;
    function baggageEntryMetadataFromString(str) {
      if (typeof str !== "string") {
        diag4.error(`Cannot create baggage metadata from unknown type: ${typeof str}`);
        str = "";
      }
      return {
        __TYPE__: symbol_1.baggageEntryMetadataSymbol,
        toString() {
          return str;
        }
      };
    }
    __name(baggageEntryMetadataFromString, "baggageEntryMetadataFromString");
    exports.baggageEntryMetadataFromString = baggageEntryMetadataFromString;
  }
});

// node_modules/@opentelemetry/api/build/src/context/context.js
var require_context = __commonJS({
  "node_modules/@opentelemetry/api/build/src/context/context.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ROOT_CONTEXT = exports.createContextKey = void 0;
    function createContextKey2(description) {
      return Symbol.for(description);
    }
    __name(createContextKey2, "createContextKey");
    exports.createContextKey = createContextKey2;
    var BaseContext = class _BaseContext {
      static {
        __name(this, "BaseContext");
      }
      /**
       * Construct a new context which inherits values from an optional parent context.
       *
       * @param parentContext a context from which to inherit values
       */
      constructor(parentContext) {
        const self2 = this;
        self2._currentContext = parentContext ? new Map(parentContext) : /* @__PURE__ */ new Map();
        self2.getValue = (key) => self2._currentContext.get(key);
        self2.setValue = (key, value) => {
          const context5 = new _BaseContext(self2._currentContext);
          context5._currentContext.set(key, value);
          return context5;
        };
        self2.deleteValue = (key) => {
          const context5 = new _BaseContext(self2._currentContext);
          context5._currentContext.delete(key);
          return context5;
        };
      }
    };
    exports.ROOT_CONTEXT = new BaseContext();
  }
});

// node_modules/@opentelemetry/api/build/src/diag/consoleLogger.js
var require_consoleLogger = __commonJS({
  "node_modules/@opentelemetry/api/build/src/diag/consoleLogger.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DiagConsoleLogger = void 0;
    var consoleMap = [
      { n: "error", c: "error" },
      { n: "warn", c: "warn" },
      { n: "info", c: "info" },
      { n: "debug", c: "debug" },
      { n: "verbose", c: "trace" }
    ];
    var DiagConsoleLogger = class {
      static {
        __name(this, "DiagConsoleLogger");
      }
      constructor() {
        function _consoleFunc(funcName) {
          return function(...args) {
            if (console) {
              let theFunc = console[funcName];
              if (typeof theFunc !== "function") {
                theFunc = console.log;
              }
              if (typeof theFunc === "function") {
                return theFunc.apply(console, args);
              }
            }
          };
        }
        __name(_consoleFunc, "_consoleFunc");
        for (let i = 0; i < consoleMap.length; i++) {
          this[consoleMap[i].n] = _consoleFunc(consoleMap[i].c);
        }
      }
    };
    exports.DiagConsoleLogger = DiagConsoleLogger;
  }
});

// node_modules/@opentelemetry/api/build/src/metrics/NoopMeter.js
var require_NoopMeter = __commonJS({
  "node_modules/@opentelemetry/api/build/src/metrics/NoopMeter.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createNoopMeter = exports.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = exports.NOOP_OBSERVABLE_GAUGE_METRIC = exports.NOOP_OBSERVABLE_COUNTER_METRIC = exports.NOOP_UP_DOWN_COUNTER_METRIC = exports.NOOP_HISTOGRAM_METRIC = exports.NOOP_GAUGE_METRIC = exports.NOOP_COUNTER_METRIC = exports.NOOP_METER = exports.NoopObservableUpDownCounterMetric = exports.NoopObservableGaugeMetric = exports.NoopObservableCounterMetric = exports.NoopObservableMetric = exports.NoopHistogramMetric = exports.NoopGaugeMetric = exports.NoopUpDownCounterMetric = exports.NoopCounterMetric = exports.NoopMetric = exports.NoopMeter = void 0;
    var NoopMeter = class {
      static {
        __name(this, "NoopMeter");
      }
      constructor() {
      }
      /**
       * @see {@link Meter.createGauge}
       */
      createGauge(_name, _options) {
        return exports.NOOP_GAUGE_METRIC;
      }
      /**
       * @see {@link Meter.createHistogram}
       */
      createHistogram(_name, _options) {
        return exports.NOOP_HISTOGRAM_METRIC;
      }
      /**
       * @see {@link Meter.createCounter}
       */
      createCounter(_name, _options) {
        return exports.NOOP_COUNTER_METRIC;
      }
      /**
       * @see {@link Meter.createUpDownCounter}
       */
      createUpDownCounter(_name, _options) {
        return exports.NOOP_UP_DOWN_COUNTER_METRIC;
      }
      /**
       * @see {@link Meter.createObservableGauge}
       */
      createObservableGauge(_name, _options) {
        return exports.NOOP_OBSERVABLE_GAUGE_METRIC;
      }
      /**
       * @see {@link Meter.createObservableCounter}
       */
      createObservableCounter(_name, _options) {
        return exports.NOOP_OBSERVABLE_COUNTER_METRIC;
      }
      /**
       * @see {@link Meter.createObservableUpDownCounter}
       */
      createObservableUpDownCounter(_name, _options) {
        return exports.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
      }
      /**
       * @see {@link Meter.addBatchObservableCallback}
       */
      addBatchObservableCallback(_callback, _observables) {
      }
      /**
       * @see {@link Meter.removeBatchObservableCallback}
       */
      removeBatchObservableCallback(_callback) {
      }
    };
    exports.NoopMeter = NoopMeter;
    var NoopMetric = class {
      static {
        __name(this, "NoopMetric");
      }
    };
    exports.NoopMetric = NoopMetric;
    var NoopCounterMetric = class extends NoopMetric {
      static {
        __name(this, "NoopCounterMetric");
      }
      add(_value, _attributes) {
      }
    };
    exports.NoopCounterMetric = NoopCounterMetric;
    var NoopUpDownCounterMetric = class extends NoopMetric {
      static {
        __name(this, "NoopUpDownCounterMetric");
      }
      add(_value, _attributes) {
      }
    };
    exports.NoopUpDownCounterMetric = NoopUpDownCounterMetric;
    var NoopGaugeMetric = class extends NoopMetric {
      static {
        __name(this, "NoopGaugeMetric");
      }
      record(_value, _attributes) {
      }
    };
    exports.NoopGaugeMetric = NoopGaugeMetric;
    var NoopHistogramMetric = class extends NoopMetric {
      static {
        __name(this, "NoopHistogramMetric");
      }
      record(_value, _attributes) {
      }
    };
    exports.NoopHistogramMetric = NoopHistogramMetric;
    var NoopObservableMetric = class {
      static {
        __name(this, "NoopObservableMetric");
      }
      addCallback(_callback) {
      }
      removeCallback(_callback) {
      }
    };
    exports.NoopObservableMetric = NoopObservableMetric;
    var NoopObservableCounterMetric = class extends NoopObservableMetric {
      static {
        __name(this, "NoopObservableCounterMetric");
      }
    };
    exports.NoopObservableCounterMetric = NoopObservableCounterMetric;
    var NoopObservableGaugeMetric = class extends NoopObservableMetric {
      static {
        __name(this, "NoopObservableGaugeMetric");
      }
    };
    exports.NoopObservableGaugeMetric = NoopObservableGaugeMetric;
    var NoopObservableUpDownCounterMetric = class extends NoopObservableMetric {
      static {
        __name(this, "NoopObservableUpDownCounterMetric");
      }
    };
    exports.NoopObservableUpDownCounterMetric = NoopObservableUpDownCounterMetric;
    exports.NOOP_METER = new NoopMeter();
    exports.NOOP_COUNTER_METRIC = new NoopCounterMetric();
    exports.NOOP_GAUGE_METRIC = new NoopGaugeMetric();
    exports.NOOP_HISTOGRAM_METRIC = new NoopHistogramMetric();
    exports.NOOP_UP_DOWN_COUNTER_METRIC = new NoopUpDownCounterMetric();
    exports.NOOP_OBSERVABLE_COUNTER_METRIC = new NoopObservableCounterMetric();
    exports.NOOP_OBSERVABLE_GAUGE_METRIC = new NoopObservableGaugeMetric();
    exports.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new NoopObservableUpDownCounterMetric();
    function createNoopMeter() {
      return exports.NOOP_METER;
    }
    __name(createNoopMeter, "createNoopMeter");
    exports.createNoopMeter = createNoopMeter;
  }
});

// node_modules/@opentelemetry/api/build/src/metrics/Metric.js
var require_Metric = __commonJS({
  "node_modules/@opentelemetry/api/build/src/metrics/Metric.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ValueType = void 0;
    var ValueType;
    (function(ValueType2) {
      ValueType2[ValueType2["INT"] = 0] = "INT";
      ValueType2[ValueType2["DOUBLE"] = 1] = "DOUBLE";
    })(ValueType = exports.ValueType || (exports.ValueType = {}));
  }
});

// node_modules/@opentelemetry/api/build/src/propagation/TextMapPropagator.js
var require_TextMapPropagator = __commonJS({
  "node_modules/@opentelemetry/api/build/src/propagation/TextMapPropagator.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultTextMapSetter = exports.defaultTextMapGetter = void 0;
    exports.defaultTextMapGetter = {
      get(carrier, key) {
        if (carrier == null) {
          return void 0;
        }
        return carrier[key];
      },
      keys(carrier) {
        if (carrier == null) {
          return [];
        }
        return Object.keys(carrier);
      }
    };
    exports.defaultTextMapSetter = {
      set(carrier, key, value) {
        if (carrier == null) {
          return;
        }
        carrier[key] = value;
      }
    };
  }
});

// node_modules/@opentelemetry/api/build/src/context/NoopContextManager.js
var require_NoopContextManager = __commonJS({
  "node_modules/@opentelemetry/api/build/src/context/NoopContextManager.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NoopContextManager = void 0;
    var context_1 = require_context();
    var NoopContextManager = class {
      static {
        __name(this, "NoopContextManager");
      }
      active() {
        return context_1.ROOT_CONTEXT;
      }
      with(_context, fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      bind(_context, target) {
        return target;
      }
      enable() {
        return this;
      }
      disable() {
        return this;
      }
    };
    exports.NoopContextManager = NoopContextManager;
  }
});

// node_modules/@opentelemetry/api/build/src/api/context.js
var require_context2 = __commonJS({
  "node_modules/@opentelemetry/api/build/src/api/context.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ContextAPI = void 0;
    var NoopContextManager_1 = require_NoopContextManager();
    var global_utils_1 = require_global_utils();
    var diag_1 = require_diag();
    var API_NAME = "context";
    var NOOP_CONTEXT_MANAGER = new NoopContextManager_1.NoopContextManager();
    var ContextAPI = class _ContextAPI {
      static {
        __name(this, "ContextAPI");
      }
      /** Empty private constructor prevents end users from constructing a new instance of the API */
      constructor() {
      }
      /** Get the singleton instance of the Context API */
      static getInstance() {
        if (!this._instance) {
          this._instance = new _ContextAPI();
        }
        return this._instance;
      }
      /**
       * Set the current context manager.
       *
       * @returns true if the context manager was successfully registered, else false
       */
      setGlobalContextManager(contextManager) {
        return (0, global_utils_1.registerGlobal)(API_NAME, contextManager, diag_1.DiagAPI.instance());
      }
      /**
       * Get the currently active context
       */
      active() {
        return this._getContextManager().active();
      }
      /**
       * Execute a function with an active context
       *
       * @param context context to be active during function execution
       * @param fn function to execute in a context
       * @param thisArg optional receiver to be used for calling fn
       * @param args optional arguments forwarded to fn
       */
      with(context5, fn, thisArg, ...args) {
        return this._getContextManager().with(context5, fn, thisArg, ...args);
      }
      /**
       * Bind a context to a target function or event emitter
       *
       * @param context context to bind to the event emitter or function. Defaults to the currently active context
       * @param target function or event emitter to bind
       */
      bind(context5, target) {
        return this._getContextManager().bind(context5, target);
      }
      _getContextManager() {
        return (0, global_utils_1.getGlobal)(API_NAME) || NOOP_CONTEXT_MANAGER;
      }
      /** Disable and remove the global context manager */
      disable() {
        this._getContextManager().disable();
        (0, global_utils_1.unregisterGlobal)(API_NAME, diag_1.DiagAPI.instance());
      }
    };
    exports.ContextAPI = ContextAPI;
  }
});

// node_modules/@opentelemetry/api/build/src/trace/trace_flags.js
var require_trace_flags = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/trace_flags.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceFlags = void 0;
    var TraceFlags4;
    (function(TraceFlags5) {
      TraceFlags5[TraceFlags5["NONE"] = 0] = "NONE";
      TraceFlags5[TraceFlags5["SAMPLED"] = 1] = "SAMPLED";
    })(TraceFlags4 = exports.TraceFlags || (exports.TraceFlags = {}));
  }
});

// node_modules/@opentelemetry/api/build/src/trace/invalid-span-constants.js
var require_invalid_span_constants = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/invalid-span-constants.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.INVALID_SPAN_CONTEXT = exports.INVALID_TRACEID = exports.INVALID_SPANID = void 0;
    var trace_flags_1 = require_trace_flags();
    exports.INVALID_SPANID = "0000000000000000";
    exports.INVALID_TRACEID = "00000000000000000000000000000000";
    exports.INVALID_SPAN_CONTEXT = {
      traceId: exports.INVALID_TRACEID,
      spanId: exports.INVALID_SPANID,
      traceFlags: trace_flags_1.TraceFlags.NONE
    };
  }
});

// node_modules/@opentelemetry/api/build/src/trace/NonRecordingSpan.js
var require_NonRecordingSpan = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/NonRecordingSpan.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NonRecordingSpan = void 0;
    var invalid_span_constants_1 = require_invalid_span_constants();
    var NonRecordingSpan = class {
      static {
        __name(this, "NonRecordingSpan");
      }
      constructor(_spanContext = invalid_span_constants_1.INVALID_SPAN_CONTEXT) {
        this._spanContext = _spanContext;
      }
      // Returns a SpanContext.
      spanContext() {
        return this._spanContext;
      }
      // By default does nothing
      setAttribute(_key, _value) {
        return this;
      }
      // By default does nothing
      setAttributes(_attributes) {
        return this;
      }
      // By default does nothing
      addEvent(_name, _attributes) {
        return this;
      }
      addLink(_link) {
        return this;
      }
      addLinks(_links) {
        return this;
      }
      // By default does nothing
      setStatus(_status) {
        return this;
      }
      // By default does nothing
      updateName(_name) {
        return this;
      }
      // By default does nothing
      end(_endTime) {
      }
      // isRecording always returns false for NonRecordingSpan.
      isRecording() {
        return false;
      }
      // By default does nothing
      recordException(_exception, _time) {
      }
    };
    exports.NonRecordingSpan = NonRecordingSpan;
  }
});

// node_modules/@opentelemetry/api/build/src/trace/context-utils.js
var require_context_utils = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/context-utils.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSpanContext = exports.setSpanContext = exports.deleteSpan = exports.setSpan = exports.getActiveSpan = exports.getSpan = void 0;
    var context_1 = require_context();
    var NonRecordingSpan_1 = require_NonRecordingSpan();
    var context_2 = require_context2();
    var SPAN_KEY = (0, context_1.createContextKey)("OpenTelemetry Context Key SPAN");
    function getSpan(context5) {
      return context5.getValue(SPAN_KEY) || void 0;
    }
    __name(getSpan, "getSpan");
    exports.getSpan = getSpan;
    function getActiveSpan() {
      return getSpan(context_2.ContextAPI.getInstance().active());
    }
    __name(getActiveSpan, "getActiveSpan");
    exports.getActiveSpan = getActiveSpan;
    function setSpan(context5, span) {
      return context5.setValue(SPAN_KEY, span);
    }
    __name(setSpan, "setSpan");
    exports.setSpan = setSpan;
    function deleteSpan(context5) {
      return context5.deleteValue(SPAN_KEY);
    }
    __name(deleteSpan, "deleteSpan");
    exports.deleteSpan = deleteSpan;
    function setSpanContext(context5, spanContext) {
      return setSpan(context5, new NonRecordingSpan_1.NonRecordingSpan(spanContext));
    }
    __name(setSpanContext, "setSpanContext");
    exports.setSpanContext = setSpanContext;
    function getSpanContext(context5) {
      var _a;
      return (_a = getSpan(context5)) === null || _a === void 0 ? void 0 : _a.spanContext();
    }
    __name(getSpanContext, "getSpanContext");
    exports.getSpanContext = getSpanContext;
  }
});

// node_modules/@opentelemetry/api/build/src/trace/spancontext-utils.js
var require_spancontext_utils = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/spancontext-utils.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.wrapSpanContext = exports.isSpanContextValid = exports.isValidSpanId = exports.isValidTraceId = void 0;
    var invalid_span_constants_1 = require_invalid_span_constants();
    var NonRecordingSpan_1 = require_NonRecordingSpan();
    var VALID_TRACEID_REGEX = /^([0-9a-f]{32})$/i;
    var VALID_SPANID_REGEX = /^[0-9a-f]{16}$/i;
    function isValidTraceId2(traceId) {
      return VALID_TRACEID_REGEX.test(traceId) && traceId !== invalid_span_constants_1.INVALID_TRACEID;
    }
    __name(isValidTraceId2, "isValidTraceId");
    exports.isValidTraceId = isValidTraceId2;
    function isValidSpanId(spanId) {
      return VALID_SPANID_REGEX.test(spanId) && spanId !== invalid_span_constants_1.INVALID_SPANID;
    }
    __name(isValidSpanId, "isValidSpanId");
    exports.isValidSpanId = isValidSpanId;
    function isSpanContextValid3(spanContext) {
      return isValidTraceId2(spanContext.traceId) && isValidSpanId(spanContext.spanId);
    }
    __name(isSpanContextValid3, "isSpanContextValid");
    exports.isSpanContextValid = isSpanContextValid3;
    function wrapSpanContext(spanContext) {
      return new NonRecordingSpan_1.NonRecordingSpan(spanContext);
    }
    __name(wrapSpanContext, "wrapSpanContext");
    exports.wrapSpanContext = wrapSpanContext;
  }
});

// node_modules/@opentelemetry/api/build/src/trace/NoopTracer.js
var require_NoopTracer = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/NoopTracer.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NoopTracer = void 0;
    var context_1 = require_context2();
    var context_utils_1 = require_context_utils();
    var NonRecordingSpan_1 = require_NonRecordingSpan();
    var spancontext_utils_1 = require_spancontext_utils();
    var contextApi = context_1.ContextAPI.getInstance();
    var NoopTracer = class {
      static {
        __name(this, "NoopTracer");
      }
      // startSpan starts a noop span.
      startSpan(name, options, context5 = contextApi.active()) {
        const root = Boolean(options === null || options === void 0 ? void 0 : options.root);
        if (root) {
          return new NonRecordingSpan_1.NonRecordingSpan();
        }
        const parentFromContext = context5 && (0, context_utils_1.getSpanContext)(context5);
        if (isSpanContext(parentFromContext) && (0, spancontext_utils_1.isSpanContextValid)(parentFromContext)) {
          return new NonRecordingSpan_1.NonRecordingSpan(parentFromContext);
        } else {
          return new NonRecordingSpan_1.NonRecordingSpan();
        }
      }
      startActiveSpan(name, arg2, arg3, arg4) {
        let opts;
        let ctx;
        let fn;
        if (arguments.length < 2) {
          return;
        } else if (arguments.length === 2) {
          fn = arg2;
        } else if (arguments.length === 3) {
          opts = arg2;
          fn = arg3;
        } else {
          opts = arg2;
          ctx = arg3;
          fn = arg4;
        }
        const parentContext = ctx !== null && ctx !== void 0 ? ctx : contextApi.active();
        const span = this.startSpan(name, opts, parentContext);
        const contextWithSpanSet = (0, context_utils_1.setSpan)(parentContext, span);
        return contextApi.with(contextWithSpanSet, fn, void 0, span);
      }
    };
    exports.NoopTracer = NoopTracer;
    function isSpanContext(spanContext) {
      return typeof spanContext === "object" && typeof spanContext["spanId"] === "string" && typeof spanContext["traceId"] === "string" && typeof spanContext["traceFlags"] === "number";
    }
    __name(isSpanContext, "isSpanContext");
  }
});

// node_modules/@opentelemetry/api/build/src/trace/ProxyTracer.js
var require_ProxyTracer = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/ProxyTracer.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProxyTracer = void 0;
    var NoopTracer_1 = require_NoopTracer();
    var NOOP_TRACER = new NoopTracer_1.NoopTracer();
    var ProxyTracer = class {
      static {
        __name(this, "ProxyTracer");
      }
      constructor(_provider, name, version2, options) {
        this._provider = _provider;
        this.name = name;
        this.version = version2;
        this.options = options;
      }
      startSpan(name, options, context5) {
        return this._getTracer().startSpan(name, options, context5);
      }
      startActiveSpan(_name, _options, _context, _fn) {
        const tracer2 = this._getTracer();
        return Reflect.apply(tracer2.startActiveSpan, tracer2, arguments);
      }
      /**
       * Try to get a tracer from the proxy tracer provider.
       * If the proxy tracer provider has no delegate, return a noop tracer.
       */
      _getTracer() {
        if (this._delegate) {
          return this._delegate;
        }
        const tracer2 = this._provider.getDelegateTracer(this.name, this.version, this.options);
        if (!tracer2) {
          return NOOP_TRACER;
        }
        this._delegate = tracer2;
        return this._delegate;
      }
    };
    exports.ProxyTracer = ProxyTracer;
  }
});

// node_modules/@opentelemetry/api/build/src/trace/NoopTracerProvider.js
var require_NoopTracerProvider = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/NoopTracerProvider.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NoopTracerProvider = void 0;
    var NoopTracer_1 = require_NoopTracer();
    var NoopTracerProvider = class {
      static {
        __name(this, "NoopTracerProvider");
      }
      getTracer(_name, _version, _options) {
        return new NoopTracer_1.NoopTracer();
      }
    };
    exports.NoopTracerProvider = NoopTracerProvider;
  }
});

// node_modules/@opentelemetry/api/build/src/trace/ProxyTracerProvider.js
var require_ProxyTracerProvider = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/ProxyTracerProvider.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProxyTracerProvider = void 0;
    var ProxyTracer_1 = require_ProxyTracer();
    var NoopTracerProvider_1 = require_NoopTracerProvider();
    var NOOP_TRACER_PROVIDER = new NoopTracerProvider_1.NoopTracerProvider();
    var ProxyTracerProvider = class {
      static {
        __name(this, "ProxyTracerProvider");
      }
      /**
       * Get a {@link ProxyTracer}
       */
      getTracer(name, version2, options) {
        var _a;
        return (_a = this.getDelegateTracer(name, version2, options)) !== null && _a !== void 0 ? _a : new ProxyTracer_1.ProxyTracer(this, name, version2, options);
      }
      getDelegate() {
        var _a;
        return (_a = this._delegate) !== null && _a !== void 0 ? _a : NOOP_TRACER_PROVIDER;
      }
      /**
       * Set the delegate tracer provider
       */
      setDelegate(delegate) {
        this._delegate = delegate;
      }
      getDelegateTracer(name, version2, options) {
        var _a;
        return (_a = this._delegate) === null || _a === void 0 ? void 0 : _a.getTracer(name, version2, options);
      }
    };
    exports.ProxyTracerProvider = ProxyTracerProvider;
  }
});

// node_modules/@opentelemetry/api/build/src/trace/SamplingResult.js
var require_SamplingResult = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/SamplingResult.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SamplingDecision = void 0;
    var SamplingDecision2;
    (function(SamplingDecision3) {
      SamplingDecision3[SamplingDecision3["NOT_RECORD"] = 0] = "NOT_RECORD";
      SamplingDecision3[SamplingDecision3["RECORD"] = 1] = "RECORD";
      SamplingDecision3[SamplingDecision3["RECORD_AND_SAMPLED"] = 2] = "RECORD_AND_SAMPLED";
    })(SamplingDecision2 = exports.SamplingDecision || (exports.SamplingDecision = {}));
  }
});

// node_modules/@opentelemetry/api/build/src/trace/span_kind.js
var require_span_kind = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/span_kind.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SpanKind = void 0;
    var SpanKind9;
    (function(SpanKind10) {
      SpanKind10[SpanKind10["INTERNAL"] = 0] = "INTERNAL";
      SpanKind10[SpanKind10["SERVER"] = 1] = "SERVER";
      SpanKind10[SpanKind10["CLIENT"] = 2] = "CLIENT";
      SpanKind10[SpanKind10["PRODUCER"] = 3] = "PRODUCER";
      SpanKind10[SpanKind10["CONSUMER"] = 4] = "CONSUMER";
    })(SpanKind9 = exports.SpanKind || (exports.SpanKind = {}));
  }
});

// node_modules/@opentelemetry/api/build/src/trace/status.js
var require_status = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/status.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SpanStatusCode = void 0;
    var SpanStatusCode5;
    (function(SpanStatusCode7) {
      SpanStatusCode7[SpanStatusCode7["UNSET"] = 0] = "UNSET";
      SpanStatusCode7[SpanStatusCode7["OK"] = 1] = "OK";
      SpanStatusCode7[SpanStatusCode7["ERROR"] = 2] = "ERROR";
    })(SpanStatusCode5 = exports.SpanStatusCode || (exports.SpanStatusCode = {}));
  }
});

// node_modules/@opentelemetry/api/build/src/trace/internal/tracestate-validators.js
var require_tracestate_validators = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/internal/tracestate-validators.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateValue = exports.validateKey = void 0;
    var VALID_KEY_CHAR_RANGE2 = "[_0-9a-z-*/]";
    var VALID_KEY2 = `[a-z]${VALID_KEY_CHAR_RANGE2}{0,255}`;
    var VALID_VENDOR_KEY2 = `[a-z0-9]${VALID_KEY_CHAR_RANGE2}{0,240}@[a-z]${VALID_KEY_CHAR_RANGE2}{0,13}`;
    var VALID_KEY_REGEX2 = new RegExp(`^(?:${VALID_KEY2}|${VALID_VENDOR_KEY2})$`);
    var VALID_VALUE_BASE_REGEX2 = /^[ -~]{0,255}[!-~]$/;
    var INVALID_VALUE_COMMA_EQUAL_REGEX2 = /,|=/;
    function validateKey2(key) {
      return VALID_KEY_REGEX2.test(key);
    }
    __name(validateKey2, "validateKey");
    exports.validateKey = validateKey2;
    function validateValue2(value) {
      return VALID_VALUE_BASE_REGEX2.test(value) && !INVALID_VALUE_COMMA_EQUAL_REGEX2.test(value);
    }
    __name(validateValue2, "validateValue");
    exports.validateValue = validateValue2;
  }
});

// node_modules/@opentelemetry/api/build/src/trace/internal/tracestate-impl.js
var require_tracestate_impl = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/internal/tracestate-impl.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceStateImpl = void 0;
    var tracestate_validators_1 = require_tracestate_validators();
    var MAX_TRACE_STATE_ITEMS2 = 32;
    var MAX_TRACE_STATE_LEN2 = 512;
    var LIST_MEMBERS_SEPARATOR2 = ",";
    var LIST_MEMBER_KEY_VALUE_SPLITTER2 = "=";
    var TraceStateImpl = class _TraceStateImpl {
      static {
        __name(this, "TraceStateImpl");
      }
      constructor(rawTraceState) {
        this._internalState = /* @__PURE__ */ new Map();
        if (rawTraceState)
          this._parse(rawTraceState);
      }
      set(key, value) {
        const traceState = this._clone();
        if (traceState._internalState.has(key)) {
          traceState._internalState.delete(key);
        }
        traceState._internalState.set(key, value);
        return traceState;
      }
      unset(key) {
        const traceState = this._clone();
        traceState._internalState.delete(key);
        return traceState;
      }
      get(key) {
        return this._internalState.get(key);
      }
      serialize() {
        return this._keys().reduce((agg, key) => {
          agg.push(key + LIST_MEMBER_KEY_VALUE_SPLITTER2 + this.get(key));
          return agg;
        }, []).join(LIST_MEMBERS_SEPARATOR2);
      }
      _parse(rawTraceState) {
        if (rawTraceState.length > MAX_TRACE_STATE_LEN2)
          return;
        this._internalState = rawTraceState.split(LIST_MEMBERS_SEPARATOR2).reverse().reduce((agg, part) => {
          const listMember = part.trim();
          const i = listMember.indexOf(LIST_MEMBER_KEY_VALUE_SPLITTER2);
          if (i !== -1) {
            const key = listMember.slice(0, i);
            const value = listMember.slice(i + 1, part.length);
            if ((0, tracestate_validators_1.validateKey)(key) && (0, tracestate_validators_1.validateValue)(value)) {
              agg.set(key, value);
            } else {
            }
          }
          return agg;
        }, /* @__PURE__ */ new Map());
        if (this._internalState.size > MAX_TRACE_STATE_ITEMS2) {
          this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, MAX_TRACE_STATE_ITEMS2));
        }
      }
      _keys() {
        return Array.from(this._internalState.keys()).reverse();
      }
      _clone() {
        const traceState = new _TraceStateImpl();
        traceState._internalState = new Map(this._internalState);
        return traceState;
      }
    };
    exports.TraceStateImpl = TraceStateImpl;
  }
});

// node_modules/@opentelemetry/api/build/src/trace/internal/utils.js
var require_utils2 = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/internal/utils.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createTraceState = void 0;
    var tracestate_impl_1 = require_tracestate_impl();
    function createTraceState(rawTraceState) {
      return new tracestate_impl_1.TraceStateImpl(rawTraceState);
    }
    __name(createTraceState, "createTraceState");
    exports.createTraceState = createTraceState;
  }
});

// node_modules/@opentelemetry/api/build/src/context-api.js
var require_context_api = __commonJS({
  "node_modules/@opentelemetry/api/build/src/context-api.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.context = void 0;
    var context_1 = require_context2();
    exports.context = context_1.ContextAPI.getInstance();
  }
});

// node_modules/@opentelemetry/api/build/src/diag-api.js
var require_diag_api = __commonJS({
  "node_modules/@opentelemetry/api/build/src/diag-api.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.diag = void 0;
    var diag_1 = require_diag();
    exports.diag = diag_1.DiagAPI.instance();
  }
});

// node_modules/@opentelemetry/api/build/src/metrics/NoopMeterProvider.js
var require_NoopMeterProvider = __commonJS({
  "node_modules/@opentelemetry/api/build/src/metrics/NoopMeterProvider.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NOOP_METER_PROVIDER = exports.NoopMeterProvider = void 0;
    var NoopMeter_1 = require_NoopMeter();
    var NoopMeterProvider = class {
      static {
        __name(this, "NoopMeterProvider");
      }
      getMeter(_name, _version, _options) {
        return NoopMeter_1.NOOP_METER;
      }
    };
    exports.NoopMeterProvider = NoopMeterProvider;
    exports.NOOP_METER_PROVIDER = new NoopMeterProvider();
  }
});

// node_modules/@opentelemetry/api/build/src/api/metrics.js
var require_metrics = __commonJS({
  "node_modules/@opentelemetry/api/build/src/api/metrics.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MetricsAPI = void 0;
    var NoopMeterProvider_1 = require_NoopMeterProvider();
    var global_utils_1 = require_global_utils();
    var diag_1 = require_diag();
    var API_NAME = "metrics";
    var MetricsAPI = class _MetricsAPI {
      static {
        __name(this, "MetricsAPI");
      }
      /** Empty private constructor prevents end users from constructing a new instance of the API */
      constructor() {
      }
      /** Get the singleton instance of the Metrics API */
      static getInstance() {
        if (!this._instance) {
          this._instance = new _MetricsAPI();
        }
        return this._instance;
      }
      /**
       * Set the current global meter provider.
       * Returns true if the meter provider was successfully registered, else false.
       */
      setGlobalMeterProvider(provider) {
        return (0, global_utils_1.registerGlobal)(API_NAME, provider, diag_1.DiagAPI.instance());
      }
      /**
       * Returns the global meter provider.
       */
      getMeterProvider() {
        return (0, global_utils_1.getGlobal)(API_NAME) || NoopMeterProvider_1.NOOP_METER_PROVIDER;
      }
      /**
       * Returns a meter from the global meter provider.
       */
      getMeter(name, version2, options) {
        return this.getMeterProvider().getMeter(name, version2, options);
      }
      /** Remove the global meter provider */
      disable() {
        (0, global_utils_1.unregisterGlobal)(API_NAME, diag_1.DiagAPI.instance());
      }
    };
    exports.MetricsAPI = MetricsAPI;
  }
});

// node_modules/@opentelemetry/api/build/src/metrics-api.js
var require_metrics_api = __commonJS({
  "node_modules/@opentelemetry/api/build/src/metrics-api.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.metrics = void 0;
    var metrics_1 = require_metrics();
    exports.metrics = metrics_1.MetricsAPI.getInstance();
  }
});

// node_modules/@opentelemetry/api/build/src/propagation/NoopTextMapPropagator.js
var require_NoopTextMapPropagator = __commonJS({
  "node_modules/@opentelemetry/api/build/src/propagation/NoopTextMapPropagator.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NoopTextMapPropagator = void 0;
    var NoopTextMapPropagator = class {
      static {
        __name(this, "NoopTextMapPropagator");
      }
      /** Noop inject function does nothing */
      inject(_context, _carrier) {
      }
      /** Noop extract function does nothing and returns the input context */
      extract(context5, _carrier) {
        return context5;
      }
      fields() {
        return [];
      }
    };
    exports.NoopTextMapPropagator = NoopTextMapPropagator;
  }
});

// node_modules/@opentelemetry/api/build/src/baggage/context-helpers.js
var require_context_helpers = __commonJS({
  "node_modules/@opentelemetry/api/build/src/baggage/context-helpers.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.deleteBaggage = exports.setBaggage = exports.getActiveBaggage = exports.getBaggage = void 0;
    var context_1 = require_context2();
    var context_2 = require_context();
    var BAGGAGE_KEY = (0, context_2.createContextKey)("OpenTelemetry Baggage Key");
    function getBaggage(context5) {
      return context5.getValue(BAGGAGE_KEY) || void 0;
    }
    __name(getBaggage, "getBaggage");
    exports.getBaggage = getBaggage;
    function getActiveBaggage() {
      return getBaggage(context_1.ContextAPI.getInstance().active());
    }
    __name(getActiveBaggage, "getActiveBaggage");
    exports.getActiveBaggage = getActiveBaggage;
    function setBaggage(context5, baggage) {
      return context5.setValue(BAGGAGE_KEY, baggage);
    }
    __name(setBaggage, "setBaggage");
    exports.setBaggage = setBaggage;
    function deleteBaggage(context5) {
      return context5.deleteValue(BAGGAGE_KEY);
    }
    __name(deleteBaggage, "deleteBaggage");
    exports.deleteBaggage = deleteBaggage;
  }
});

// node_modules/@opentelemetry/api/build/src/api/propagation.js
var require_propagation = __commonJS({
  "node_modules/@opentelemetry/api/build/src/api/propagation.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PropagationAPI = void 0;
    var global_utils_1 = require_global_utils();
    var NoopTextMapPropagator_1 = require_NoopTextMapPropagator();
    var TextMapPropagator_1 = require_TextMapPropagator();
    var context_helpers_1 = require_context_helpers();
    var utils_1 = require_utils();
    var diag_1 = require_diag();
    var API_NAME = "propagation";
    var NOOP_TEXT_MAP_PROPAGATOR = new NoopTextMapPropagator_1.NoopTextMapPropagator();
    var PropagationAPI = class _PropagationAPI {
      static {
        __name(this, "PropagationAPI");
      }
      /** Empty private constructor prevents end users from constructing a new instance of the API */
      constructor() {
        this.createBaggage = utils_1.createBaggage;
        this.getBaggage = context_helpers_1.getBaggage;
        this.getActiveBaggage = context_helpers_1.getActiveBaggage;
        this.setBaggage = context_helpers_1.setBaggage;
        this.deleteBaggage = context_helpers_1.deleteBaggage;
      }
      /** Get the singleton instance of the Propagator API */
      static getInstance() {
        if (!this._instance) {
          this._instance = new _PropagationAPI();
        }
        return this._instance;
      }
      /**
       * Set the current propagator.
       *
       * @returns true if the propagator was successfully registered, else false
       */
      setGlobalPropagator(propagator) {
        return (0, global_utils_1.registerGlobal)(API_NAME, propagator, diag_1.DiagAPI.instance());
      }
      /**
       * Inject context into a carrier to be propagated inter-process
       *
       * @param context Context carrying tracing data to inject
       * @param carrier carrier to inject context into
       * @param setter Function used to set values on the carrier
       */
      inject(context5, carrier, setter = TextMapPropagator_1.defaultTextMapSetter) {
        return this._getGlobalPropagator().inject(context5, carrier, setter);
      }
      /**
       * Extract context from a carrier
       *
       * @param context Context which the newly created context will inherit from
       * @param carrier Carrier to extract context from
       * @param getter Function used to extract keys from a carrier
       */
      extract(context5, carrier, getter = TextMapPropagator_1.defaultTextMapGetter) {
        return this._getGlobalPropagator().extract(context5, carrier, getter);
      }
      /**
       * Return a list of all fields which may be used by the propagator.
       */
      fields() {
        return this._getGlobalPropagator().fields();
      }
      /** Remove the global propagator */
      disable() {
        (0, global_utils_1.unregisterGlobal)(API_NAME, diag_1.DiagAPI.instance());
      }
      _getGlobalPropagator() {
        return (0, global_utils_1.getGlobal)(API_NAME) || NOOP_TEXT_MAP_PROPAGATOR;
      }
    };
    exports.PropagationAPI = PropagationAPI;
  }
});

// node_modules/@opentelemetry/api/build/src/propagation-api.js
var require_propagation_api = __commonJS({
  "node_modules/@opentelemetry/api/build/src/propagation-api.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.propagation = void 0;
    var propagation_1 = require_propagation();
    exports.propagation = propagation_1.PropagationAPI.getInstance();
  }
});

// node_modules/@opentelemetry/api/build/src/api/trace.js
var require_trace = __commonJS({
  "node_modules/@opentelemetry/api/build/src/api/trace.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceAPI = void 0;
    var global_utils_1 = require_global_utils();
    var ProxyTracerProvider_1 = require_ProxyTracerProvider();
    var spancontext_utils_1 = require_spancontext_utils();
    var context_utils_1 = require_context_utils();
    var diag_1 = require_diag();
    var API_NAME = "trace";
    var TraceAPI = class _TraceAPI {
      static {
        __name(this, "TraceAPI");
      }
      /** Empty private constructor prevents end users from constructing a new instance of the API */
      constructor() {
        this._proxyTracerProvider = new ProxyTracerProvider_1.ProxyTracerProvider();
        this.wrapSpanContext = spancontext_utils_1.wrapSpanContext;
        this.isSpanContextValid = spancontext_utils_1.isSpanContextValid;
        this.deleteSpan = context_utils_1.deleteSpan;
        this.getSpan = context_utils_1.getSpan;
        this.getActiveSpan = context_utils_1.getActiveSpan;
        this.getSpanContext = context_utils_1.getSpanContext;
        this.setSpan = context_utils_1.setSpan;
        this.setSpanContext = context_utils_1.setSpanContext;
      }
      /** Get the singleton instance of the Trace API */
      static getInstance() {
        if (!this._instance) {
          this._instance = new _TraceAPI();
        }
        return this._instance;
      }
      /**
       * Set the current global tracer.
       *
       * @returns true if the tracer provider was successfully registered, else false
       */
      setGlobalTracerProvider(provider) {
        const success = (0, global_utils_1.registerGlobal)(API_NAME, this._proxyTracerProvider, diag_1.DiagAPI.instance());
        if (success) {
          this._proxyTracerProvider.setDelegate(provider);
        }
        return success;
      }
      /**
       * Returns the global tracer provider.
       */
      getTracerProvider() {
        return (0, global_utils_1.getGlobal)(API_NAME) || this._proxyTracerProvider;
      }
      /**
       * Returns a tracer from the global tracer provider.
       */
      getTracer(name, version2) {
        return this.getTracerProvider().getTracer(name, version2);
      }
      /** Remove the global tracer provider */
      disable() {
        (0, global_utils_1.unregisterGlobal)(API_NAME, diag_1.DiagAPI.instance());
        this._proxyTracerProvider = new ProxyTracerProvider_1.ProxyTracerProvider();
      }
    };
    exports.TraceAPI = TraceAPI;
  }
});

// node_modules/@opentelemetry/api/build/src/trace-api.js
var require_trace_api = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace-api.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.trace = void 0;
    var trace_1 = require_trace();
    exports.trace = trace_1.TraceAPI.getInstance();
  }
});

// node_modules/@opentelemetry/api/build/src/index.js
var require_src = __commonJS({
  "node_modules/@opentelemetry/api/build/src/index.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.trace = exports.propagation = exports.metrics = exports.diag = exports.context = exports.INVALID_SPAN_CONTEXT = exports.INVALID_TRACEID = exports.INVALID_SPANID = exports.isValidSpanId = exports.isValidTraceId = exports.isSpanContextValid = exports.createTraceState = exports.TraceFlags = exports.SpanStatusCode = exports.SpanKind = exports.SamplingDecision = exports.ProxyTracerProvider = exports.ProxyTracer = exports.defaultTextMapSetter = exports.defaultTextMapGetter = exports.ValueType = exports.createNoopMeter = exports.DiagLogLevel = exports.DiagConsoleLogger = exports.ROOT_CONTEXT = exports.createContextKey = exports.baggageEntryMetadataFromString = void 0;
    var utils_1 = require_utils();
    Object.defineProperty(exports, "baggageEntryMetadataFromString", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return utils_1.baggageEntryMetadataFromString;
    }, "get") });
    var context_1 = require_context();
    Object.defineProperty(exports, "createContextKey", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return context_1.createContextKey;
    }, "get") });
    Object.defineProperty(exports, "ROOT_CONTEXT", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return context_1.ROOT_CONTEXT;
    }, "get") });
    var consoleLogger_1 = require_consoleLogger();
    Object.defineProperty(exports, "DiagConsoleLogger", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return consoleLogger_1.DiagConsoleLogger;
    }, "get") });
    var types_1 = require_types();
    Object.defineProperty(exports, "DiagLogLevel", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return types_1.DiagLogLevel;
    }, "get") });
    var NoopMeter_1 = require_NoopMeter();
    Object.defineProperty(exports, "createNoopMeter", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return NoopMeter_1.createNoopMeter;
    }, "get") });
    var Metric_1 = require_Metric();
    Object.defineProperty(exports, "ValueType", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return Metric_1.ValueType;
    }, "get") });
    var TextMapPropagator_1 = require_TextMapPropagator();
    Object.defineProperty(exports, "defaultTextMapGetter", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return TextMapPropagator_1.defaultTextMapGetter;
    }, "get") });
    Object.defineProperty(exports, "defaultTextMapSetter", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return TextMapPropagator_1.defaultTextMapSetter;
    }, "get") });
    var ProxyTracer_1 = require_ProxyTracer();
    Object.defineProperty(exports, "ProxyTracer", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return ProxyTracer_1.ProxyTracer;
    }, "get") });
    var ProxyTracerProvider_1 = require_ProxyTracerProvider();
    Object.defineProperty(exports, "ProxyTracerProvider", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return ProxyTracerProvider_1.ProxyTracerProvider;
    }, "get") });
    var SamplingResult_1 = require_SamplingResult();
    Object.defineProperty(exports, "SamplingDecision", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return SamplingResult_1.SamplingDecision;
    }, "get") });
    var span_kind_1 = require_span_kind();
    Object.defineProperty(exports, "SpanKind", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return span_kind_1.SpanKind;
    }, "get") });
    var status_1 = require_status();
    Object.defineProperty(exports, "SpanStatusCode", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return status_1.SpanStatusCode;
    }, "get") });
    var trace_flags_1 = require_trace_flags();
    Object.defineProperty(exports, "TraceFlags", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return trace_flags_1.TraceFlags;
    }, "get") });
    var utils_2 = require_utils2();
    Object.defineProperty(exports, "createTraceState", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return utils_2.createTraceState;
    }, "get") });
    var spancontext_utils_1 = require_spancontext_utils();
    Object.defineProperty(exports, "isSpanContextValid", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return spancontext_utils_1.isSpanContextValid;
    }, "get") });
    Object.defineProperty(exports, "isValidTraceId", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return spancontext_utils_1.isValidTraceId;
    }, "get") });
    Object.defineProperty(exports, "isValidSpanId", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return spancontext_utils_1.isValidSpanId;
    }, "get") });
    var invalid_span_constants_1 = require_invalid_span_constants();
    Object.defineProperty(exports, "INVALID_SPANID", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return invalid_span_constants_1.INVALID_SPANID;
    }, "get") });
    Object.defineProperty(exports, "INVALID_TRACEID", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return invalid_span_constants_1.INVALID_TRACEID;
    }, "get") });
    Object.defineProperty(exports, "INVALID_SPAN_CONTEXT", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return invalid_span_constants_1.INVALID_SPAN_CONTEXT;
    }, "get") });
    var context_api_1 = require_context_api();
    Object.defineProperty(exports, "context", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return context_api_1.context;
    }, "get") });
    var diag_api_1 = require_diag_api();
    Object.defineProperty(exports, "diag", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return diag_api_1.diag;
    }, "get") });
    var metrics_api_1 = require_metrics_api();
    Object.defineProperty(exports, "metrics", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return metrics_api_1.metrics;
    }, "get") });
    var propagation_api_1 = require_propagation_api();
    Object.defineProperty(exports, "propagation", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return propagation_api_1.propagation;
    }, "get") });
    var trace_api_1 = require_trace_api();
    Object.defineProperty(exports, "trace", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return trace_api_1.trace;
    }, "get") });
    exports.default = {
      context: context_api_1.context,
      diag: diag_api_1.diag,
      metrics: metrics_api_1.metrics,
      propagation: propagation_api_1.propagation,
      trace: trace_api_1.trace
    };
  }
});

// node_modules/@opentelemetry/semantic-conventions/build/src/internal/utils.js
var require_utils3 = __commonJS({
  "node_modules/@opentelemetry/semantic-conventions/build/src/internal/utils.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createConstMap = void 0;
    // @__NO_SIDE_EFFECTS__
    function createConstMap(values) {
      let res = {};
      const len = values.length;
      for (let lp = 0; lp < len; lp++) {
        const val = values[lp];
        if (val) {
          res[String(val).toUpperCase().replace(/[-.]/g, "_")] = val;
        }
      }
      return res;
    }
    __name(createConstMap, "createConstMap");
    exports.createConstMap = createConstMap;
  }
});

// node_modules/@opentelemetry/semantic-conventions/build/src/trace/SemanticAttributes.js
var require_SemanticAttributes = __commonJS({
  "node_modules/@opentelemetry/semantic-conventions/build/src/trace/SemanticAttributes.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SEMATTRS_NET_HOST_CARRIER_ICC = exports.SEMATTRS_NET_HOST_CARRIER_MNC = exports.SEMATTRS_NET_HOST_CARRIER_MCC = exports.SEMATTRS_NET_HOST_CARRIER_NAME = exports.SEMATTRS_NET_HOST_CONNECTION_SUBTYPE = exports.SEMATTRS_NET_HOST_CONNECTION_TYPE = exports.SEMATTRS_NET_HOST_NAME = exports.SEMATTRS_NET_HOST_PORT = exports.SEMATTRS_NET_HOST_IP = exports.SEMATTRS_NET_PEER_NAME = exports.SEMATTRS_NET_PEER_PORT = exports.SEMATTRS_NET_PEER_IP = exports.SEMATTRS_NET_TRANSPORT = exports.SEMATTRS_FAAS_INVOKED_REGION = exports.SEMATTRS_FAAS_INVOKED_PROVIDER = exports.SEMATTRS_FAAS_INVOKED_NAME = exports.SEMATTRS_FAAS_COLDSTART = exports.SEMATTRS_FAAS_CRON = exports.SEMATTRS_FAAS_TIME = exports.SEMATTRS_FAAS_DOCUMENT_NAME = exports.SEMATTRS_FAAS_DOCUMENT_TIME = exports.SEMATTRS_FAAS_DOCUMENT_OPERATION = exports.SEMATTRS_FAAS_DOCUMENT_COLLECTION = exports.SEMATTRS_FAAS_EXECUTION = exports.SEMATTRS_FAAS_TRIGGER = exports.SEMATTRS_EXCEPTION_ESCAPED = exports.SEMATTRS_EXCEPTION_STACKTRACE = exports.SEMATTRS_EXCEPTION_MESSAGE = exports.SEMATTRS_EXCEPTION_TYPE = exports.SEMATTRS_DB_SQL_TABLE = exports.SEMATTRS_DB_MONGODB_COLLECTION = exports.SEMATTRS_DB_REDIS_DATABASE_INDEX = exports.SEMATTRS_DB_HBASE_NAMESPACE = exports.SEMATTRS_DB_CASSANDRA_COORDINATOR_DC = exports.SEMATTRS_DB_CASSANDRA_COORDINATOR_ID = exports.SEMATTRS_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = exports.SEMATTRS_DB_CASSANDRA_IDEMPOTENCE = exports.SEMATTRS_DB_CASSANDRA_TABLE = exports.SEMATTRS_DB_CASSANDRA_CONSISTENCY_LEVEL = exports.SEMATTRS_DB_CASSANDRA_PAGE_SIZE = exports.SEMATTRS_DB_CASSANDRA_KEYSPACE = exports.SEMATTRS_DB_MSSQL_INSTANCE_NAME = exports.SEMATTRS_DB_OPERATION = exports.SEMATTRS_DB_STATEMENT = exports.SEMATTRS_DB_NAME = exports.SEMATTRS_DB_JDBC_DRIVER_CLASSNAME = exports.SEMATTRS_DB_USER = exports.SEMATTRS_DB_CONNECTION_STRING = exports.SEMATTRS_DB_SYSTEM = exports.SEMATTRS_AWS_LAMBDA_INVOKED_ARN = void 0;
    exports.SEMATTRS_MESSAGING_DESTINATION_KIND = exports.SEMATTRS_MESSAGING_DESTINATION = exports.SEMATTRS_MESSAGING_SYSTEM = exports.SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = exports.SEMATTRS_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = exports.SEMATTRS_AWS_DYNAMODB_SCANNED_COUNT = exports.SEMATTRS_AWS_DYNAMODB_COUNT = exports.SEMATTRS_AWS_DYNAMODB_TOTAL_SEGMENTS = exports.SEMATTRS_AWS_DYNAMODB_SEGMENT = exports.SEMATTRS_AWS_DYNAMODB_SCAN_FORWARD = exports.SEMATTRS_AWS_DYNAMODB_TABLE_COUNT = exports.SEMATTRS_AWS_DYNAMODB_EXCLUSIVE_START_TABLE = exports.SEMATTRS_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = exports.SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = exports.SEMATTRS_AWS_DYNAMODB_SELECT = exports.SEMATTRS_AWS_DYNAMODB_INDEX_NAME = exports.SEMATTRS_AWS_DYNAMODB_ATTRIBUTES_TO_GET = exports.SEMATTRS_AWS_DYNAMODB_LIMIT = exports.SEMATTRS_AWS_DYNAMODB_PROJECTION = exports.SEMATTRS_AWS_DYNAMODB_CONSISTENT_READ = exports.SEMATTRS_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = exports.SEMATTRS_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = exports.SEMATTRS_AWS_DYNAMODB_ITEM_COLLECTION_METRICS = exports.SEMATTRS_AWS_DYNAMODB_CONSUMED_CAPACITY = exports.SEMATTRS_AWS_DYNAMODB_TABLE_NAMES = exports.SEMATTRS_HTTP_CLIENT_IP = exports.SEMATTRS_HTTP_ROUTE = exports.SEMATTRS_HTTP_SERVER_NAME = exports.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = exports.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH = exports.SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = exports.SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH = exports.SEMATTRS_HTTP_USER_AGENT = exports.SEMATTRS_HTTP_FLAVOR = exports.SEMATTRS_HTTP_STATUS_CODE = exports.SEMATTRS_HTTP_SCHEME = exports.SEMATTRS_HTTP_HOST = exports.SEMATTRS_HTTP_TARGET = exports.SEMATTRS_HTTP_URL = exports.SEMATTRS_HTTP_METHOD = exports.SEMATTRS_CODE_LINENO = exports.SEMATTRS_CODE_FILEPATH = exports.SEMATTRS_CODE_NAMESPACE = exports.SEMATTRS_CODE_FUNCTION = exports.SEMATTRS_THREAD_NAME = exports.SEMATTRS_THREAD_ID = exports.SEMATTRS_ENDUSER_SCOPE = exports.SEMATTRS_ENDUSER_ROLE = exports.SEMATTRS_ENDUSER_ID = exports.SEMATTRS_PEER_SERVICE = void 0;
    exports.DBSYSTEMVALUES_FILEMAKER = exports.DBSYSTEMVALUES_DERBY = exports.DBSYSTEMVALUES_FIREBIRD = exports.DBSYSTEMVALUES_ADABAS = exports.DBSYSTEMVALUES_CACHE = exports.DBSYSTEMVALUES_EDB = exports.DBSYSTEMVALUES_FIRSTSQL = exports.DBSYSTEMVALUES_INGRES = exports.DBSYSTEMVALUES_HANADB = exports.DBSYSTEMVALUES_MAXDB = exports.DBSYSTEMVALUES_PROGRESS = exports.DBSYSTEMVALUES_HSQLDB = exports.DBSYSTEMVALUES_CLOUDSCAPE = exports.DBSYSTEMVALUES_HIVE = exports.DBSYSTEMVALUES_REDSHIFT = exports.DBSYSTEMVALUES_POSTGRESQL = exports.DBSYSTEMVALUES_DB2 = exports.DBSYSTEMVALUES_ORACLE = exports.DBSYSTEMVALUES_MYSQL = exports.DBSYSTEMVALUES_MSSQL = exports.DBSYSTEMVALUES_OTHER_SQL = exports.SemanticAttributes = exports.SEMATTRS_MESSAGE_UNCOMPRESSED_SIZE = exports.SEMATTRS_MESSAGE_COMPRESSED_SIZE = exports.SEMATTRS_MESSAGE_ID = exports.SEMATTRS_MESSAGE_TYPE = exports.SEMATTRS_RPC_JSONRPC_ERROR_MESSAGE = exports.SEMATTRS_RPC_JSONRPC_ERROR_CODE = exports.SEMATTRS_RPC_JSONRPC_REQUEST_ID = exports.SEMATTRS_RPC_JSONRPC_VERSION = exports.SEMATTRS_RPC_GRPC_STATUS_CODE = exports.SEMATTRS_RPC_METHOD = exports.SEMATTRS_RPC_SERVICE = exports.SEMATTRS_RPC_SYSTEM = exports.SEMATTRS_MESSAGING_KAFKA_TOMBSTONE = exports.SEMATTRS_MESSAGING_KAFKA_PARTITION = exports.SEMATTRS_MESSAGING_KAFKA_CLIENT_ID = exports.SEMATTRS_MESSAGING_KAFKA_CONSUMER_GROUP = exports.SEMATTRS_MESSAGING_KAFKA_MESSAGE_KEY = exports.SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY = exports.SEMATTRS_MESSAGING_CONSUMER_ID = exports.SEMATTRS_MESSAGING_OPERATION = exports.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES = exports.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES = exports.SEMATTRS_MESSAGING_CONVERSATION_ID = exports.SEMATTRS_MESSAGING_MESSAGE_ID = exports.SEMATTRS_MESSAGING_URL = exports.SEMATTRS_MESSAGING_PROTOCOL_VERSION = exports.SEMATTRS_MESSAGING_PROTOCOL = exports.SEMATTRS_MESSAGING_TEMP_DESTINATION = void 0;
    exports.FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD = exports.FaasDocumentOperationValues = exports.FAASDOCUMENTOPERATIONVALUES_DELETE = exports.FAASDOCUMENTOPERATIONVALUES_EDIT = exports.FAASDOCUMENTOPERATIONVALUES_INSERT = exports.FaasTriggerValues = exports.FAASTRIGGERVALUES_OTHER = exports.FAASTRIGGERVALUES_TIMER = exports.FAASTRIGGERVALUES_PUBSUB = exports.FAASTRIGGERVALUES_HTTP = exports.FAASTRIGGERVALUES_DATASOURCE = exports.DbCassandraConsistencyLevelValues = exports.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL = exports.DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL = exports.DBCASSANDRACONSISTENCYLEVELVALUES_ANY = exports.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE = exports.DBCASSANDRACONSISTENCYLEVELVALUES_THREE = exports.DBCASSANDRACONSISTENCYLEVELVALUES_TWO = exports.DBCASSANDRACONSISTENCYLEVELVALUES_ONE = exports.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM = exports.DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM = exports.DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM = exports.DBCASSANDRACONSISTENCYLEVELVALUES_ALL = exports.DbSystemValues = exports.DBSYSTEMVALUES_COCKROACHDB = exports.DBSYSTEMVALUES_MEMCACHED = exports.DBSYSTEMVALUES_ELASTICSEARCH = exports.DBSYSTEMVALUES_GEODE = exports.DBSYSTEMVALUES_NEO4J = exports.DBSYSTEMVALUES_DYNAMODB = exports.DBSYSTEMVALUES_COSMOSDB = exports.DBSYSTEMVALUES_COUCHDB = exports.DBSYSTEMVALUES_COUCHBASE = exports.DBSYSTEMVALUES_REDIS = exports.DBSYSTEMVALUES_MONGODB = exports.DBSYSTEMVALUES_HBASE = exports.DBSYSTEMVALUES_CASSANDRA = exports.DBSYSTEMVALUES_COLDFUSION = exports.DBSYSTEMVALUES_H2 = exports.DBSYSTEMVALUES_VERTICA = exports.DBSYSTEMVALUES_TERADATA = exports.DBSYSTEMVALUES_SYBASE = exports.DBSYSTEMVALUES_SQLITE = exports.DBSYSTEMVALUES_POINTBASE = exports.DBSYSTEMVALUES_PERVASIVE = exports.DBSYSTEMVALUES_NETEZZA = exports.DBSYSTEMVALUES_MARIADB = exports.DBSYSTEMVALUES_INTERBASE = exports.DBSYSTEMVALUES_INSTANTDB = exports.DBSYSTEMVALUES_INFORMIX = void 0;
    exports.MESSAGINGOPERATIONVALUES_RECEIVE = exports.MessagingDestinationKindValues = exports.MESSAGINGDESTINATIONKINDVALUES_TOPIC = exports.MESSAGINGDESTINATIONKINDVALUES_QUEUE = exports.HttpFlavorValues = exports.HTTPFLAVORVALUES_QUIC = exports.HTTPFLAVORVALUES_SPDY = exports.HTTPFLAVORVALUES_HTTP_2_0 = exports.HTTPFLAVORVALUES_HTTP_1_1 = exports.HTTPFLAVORVALUES_HTTP_1_0 = exports.NetHostConnectionSubtypeValues = exports.NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA = exports.NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA = exports.NETHOSTCONNECTIONSUBTYPEVALUES_NR = exports.NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN = exports.NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA = exports.NETHOSTCONNECTIONSUBTYPEVALUES_GSM = exports.NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP = exports.NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD = exports.NETHOSTCONNECTIONSUBTYPEVALUES_LTE = exports.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B = exports.NETHOSTCONNECTIONSUBTYPEVALUES_IDEN = exports.NETHOSTCONNECTIONSUBTYPEVALUES_HSPA = exports.NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA = exports.NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA = exports.NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT = exports.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A = exports.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0 = exports.NETHOSTCONNECTIONSUBTYPEVALUES_CDMA = exports.NETHOSTCONNECTIONSUBTYPEVALUES_UMTS = exports.NETHOSTCONNECTIONSUBTYPEVALUES_EDGE = exports.NETHOSTCONNECTIONSUBTYPEVALUES_GPRS = exports.NetHostConnectionTypeValues = exports.NETHOSTCONNECTIONTYPEVALUES_UNKNOWN = exports.NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE = exports.NETHOSTCONNECTIONTYPEVALUES_CELL = exports.NETHOSTCONNECTIONTYPEVALUES_WIRED = exports.NETHOSTCONNECTIONTYPEVALUES_WIFI = exports.NetTransportValues = exports.NETTRANSPORTVALUES_OTHER = exports.NETTRANSPORTVALUES_INPROC = exports.NETTRANSPORTVALUES_PIPE = exports.NETTRANSPORTVALUES_UNIX = exports.NETTRANSPORTVALUES_IP = exports.NETTRANSPORTVALUES_IP_UDP = exports.NETTRANSPORTVALUES_IP_TCP = exports.FaasInvokedProviderValues = exports.FAASINVOKEDPROVIDERVALUES_GCP = exports.FAASINVOKEDPROVIDERVALUES_AZURE = exports.FAASINVOKEDPROVIDERVALUES_AWS = void 0;
    exports.MessageTypeValues = exports.MESSAGETYPEVALUES_RECEIVED = exports.MESSAGETYPEVALUES_SENT = exports.RpcGrpcStatusCodeValues = exports.RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED = exports.RPCGRPCSTATUSCODEVALUES_DATA_LOSS = exports.RPCGRPCSTATUSCODEVALUES_UNAVAILABLE = exports.RPCGRPCSTATUSCODEVALUES_INTERNAL = exports.RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED = exports.RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE = exports.RPCGRPCSTATUSCODEVALUES_ABORTED = exports.RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION = exports.RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED = exports.RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED = exports.RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS = exports.RPCGRPCSTATUSCODEVALUES_NOT_FOUND = exports.RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED = exports.RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT = exports.RPCGRPCSTATUSCODEVALUES_UNKNOWN = exports.RPCGRPCSTATUSCODEVALUES_CANCELLED = exports.RPCGRPCSTATUSCODEVALUES_OK = exports.MessagingOperationValues = exports.MESSAGINGOPERATIONVALUES_PROCESS = void 0;
    var utils_1 = require_utils3();
    var TMP_AWS_LAMBDA_INVOKED_ARN = "aws.lambda.invoked_arn";
    var TMP_DB_SYSTEM = "db.system";
    var TMP_DB_CONNECTION_STRING = "db.connection_string";
    var TMP_DB_USER = "db.user";
    var TMP_DB_JDBC_DRIVER_CLASSNAME = "db.jdbc.driver_classname";
    var TMP_DB_NAME = "db.name";
    var TMP_DB_STATEMENT = "db.statement";
    var TMP_DB_OPERATION = "db.operation";
    var TMP_DB_MSSQL_INSTANCE_NAME = "db.mssql.instance_name";
    var TMP_DB_CASSANDRA_KEYSPACE = "db.cassandra.keyspace";
    var TMP_DB_CASSANDRA_PAGE_SIZE = "db.cassandra.page_size";
    var TMP_DB_CASSANDRA_CONSISTENCY_LEVEL = "db.cassandra.consistency_level";
    var TMP_DB_CASSANDRA_TABLE = "db.cassandra.table";
    var TMP_DB_CASSANDRA_IDEMPOTENCE = "db.cassandra.idempotence";
    var TMP_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = "db.cassandra.speculative_execution_count";
    var TMP_DB_CASSANDRA_COORDINATOR_ID = "db.cassandra.coordinator.id";
    var TMP_DB_CASSANDRA_COORDINATOR_DC = "db.cassandra.coordinator.dc";
    var TMP_DB_HBASE_NAMESPACE = "db.hbase.namespace";
    var TMP_DB_REDIS_DATABASE_INDEX = "db.redis.database_index";
    var TMP_DB_MONGODB_COLLECTION = "db.mongodb.collection";
    var TMP_DB_SQL_TABLE = "db.sql.table";
    var TMP_EXCEPTION_TYPE = "exception.type";
    var TMP_EXCEPTION_MESSAGE = "exception.message";
    var TMP_EXCEPTION_STACKTRACE = "exception.stacktrace";
    var TMP_EXCEPTION_ESCAPED = "exception.escaped";
    var TMP_FAAS_TRIGGER = "faas.trigger";
    var TMP_FAAS_EXECUTION = "faas.execution";
    var TMP_FAAS_DOCUMENT_COLLECTION = "faas.document.collection";
    var TMP_FAAS_DOCUMENT_OPERATION = "faas.document.operation";
    var TMP_FAAS_DOCUMENT_TIME = "faas.document.time";
    var TMP_FAAS_DOCUMENT_NAME = "faas.document.name";
    var TMP_FAAS_TIME = "faas.time";
    var TMP_FAAS_CRON = "faas.cron";
    var TMP_FAAS_COLDSTART = "faas.coldstart";
    var TMP_FAAS_INVOKED_NAME = "faas.invoked_name";
    var TMP_FAAS_INVOKED_PROVIDER = "faas.invoked_provider";
    var TMP_FAAS_INVOKED_REGION = "faas.invoked_region";
    var TMP_NET_TRANSPORT = "net.transport";
    var TMP_NET_PEER_IP = "net.peer.ip";
    var TMP_NET_PEER_PORT = "net.peer.port";
    var TMP_NET_PEER_NAME = "net.peer.name";
    var TMP_NET_HOST_IP = "net.host.ip";
    var TMP_NET_HOST_PORT = "net.host.port";
    var TMP_NET_HOST_NAME = "net.host.name";
    var TMP_NET_HOST_CONNECTION_TYPE = "net.host.connection.type";
    var TMP_NET_HOST_CONNECTION_SUBTYPE = "net.host.connection.subtype";
    var TMP_NET_HOST_CARRIER_NAME = "net.host.carrier.name";
    var TMP_NET_HOST_CARRIER_MCC = "net.host.carrier.mcc";
    var TMP_NET_HOST_CARRIER_MNC = "net.host.carrier.mnc";
    var TMP_NET_HOST_CARRIER_ICC = "net.host.carrier.icc";
    var TMP_PEER_SERVICE = "peer.service";
    var TMP_ENDUSER_ID = "enduser.id";
    var TMP_ENDUSER_ROLE = "enduser.role";
    var TMP_ENDUSER_SCOPE = "enduser.scope";
    var TMP_THREAD_ID = "thread.id";
    var TMP_THREAD_NAME = "thread.name";
    var TMP_CODE_FUNCTION = "code.function";
    var TMP_CODE_NAMESPACE = "code.namespace";
    var TMP_CODE_FILEPATH = "code.filepath";
    var TMP_CODE_LINENO = "code.lineno";
    var TMP_HTTP_METHOD = "http.method";
    var TMP_HTTP_URL = "http.url";
    var TMP_HTTP_TARGET = "http.target";
    var TMP_HTTP_HOST = "http.host";
    var TMP_HTTP_SCHEME = "http.scheme";
    var TMP_HTTP_STATUS_CODE = "http.status_code";
    var TMP_HTTP_FLAVOR = "http.flavor";
    var TMP_HTTP_USER_AGENT = "http.user_agent";
    var TMP_HTTP_REQUEST_CONTENT_LENGTH = "http.request_content_length";
    var TMP_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = "http.request_content_length_uncompressed";
    var TMP_HTTP_RESPONSE_CONTENT_LENGTH = "http.response_content_length";
    var TMP_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = "http.response_content_length_uncompressed";
    var TMP_HTTP_SERVER_NAME = "http.server_name";
    var TMP_HTTP_ROUTE = "http.route";
    var TMP_HTTP_CLIENT_IP = "http.client_ip";
    var TMP_AWS_DYNAMODB_TABLE_NAMES = "aws.dynamodb.table_names";
    var TMP_AWS_DYNAMODB_CONSUMED_CAPACITY = "aws.dynamodb.consumed_capacity";
    var TMP_AWS_DYNAMODB_ITEM_COLLECTION_METRICS = "aws.dynamodb.item_collection_metrics";
    var TMP_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = "aws.dynamodb.provisioned_read_capacity";
    var TMP_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = "aws.dynamodb.provisioned_write_capacity";
    var TMP_AWS_DYNAMODB_CONSISTENT_READ = "aws.dynamodb.consistent_read";
    var TMP_AWS_DYNAMODB_PROJECTION = "aws.dynamodb.projection";
    var TMP_AWS_DYNAMODB_LIMIT = "aws.dynamodb.limit";
    var TMP_AWS_DYNAMODB_ATTRIBUTES_TO_GET = "aws.dynamodb.attributes_to_get";
    var TMP_AWS_DYNAMODB_INDEX_NAME = "aws.dynamodb.index_name";
    var TMP_AWS_DYNAMODB_SELECT = "aws.dynamodb.select";
    var TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = "aws.dynamodb.global_secondary_indexes";
    var TMP_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = "aws.dynamodb.local_secondary_indexes";
    var TMP_AWS_DYNAMODB_EXCLUSIVE_START_TABLE = "aws.dynamodb.exclusive_start_table";
    var TMP_AWS_DYNAMODB_TABLE_COUNT = "aws.dynamodb.table_count";
    var TMP_AWS_DYNAMODB_SCAN_FORWARD = "aws.dynamodb.scan_forward";
    var TMP_AWS_DYNAMODB_SEGMENT = "aws.dynamodb.segment";
    var TMP_AWS_DYNAMODB_TOTAL_SEGMENTS = "aws.dynamodb.total_segments";
    var TMP_AWS_DYNAMODB_COUNT = "aws.dynamodb.count";
    var TMP_AWS_DYNAMODB_SCANNED_COUNT = "aws.dynamodb.scanned_count";
    var TMP_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = "aws.dynamodb.attribute_definitions";
    var TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = "aws.dynamodb.global_secondary_index_updates";
    var TMP_MESSAGING_SYSTEM = "messaging.system";
    var TMP_MESSAGING_DESTINATION = "messaging.destination";
    var TMP_MESSAGING_DESTINATION_KIND = "messaging.destination_kind";
    var TMP_MESSAGING_TEMP_DESTINATION = "messaging.temp_destination";
    var TMP_MESSAGING_PROTOCOL = "messaging.protocol";
    var TMP_MESSAGING_PROTOCOL_VERSION = "messaging.protocol_version";
    var TMP_MESSAGING_URL = "messaging.url";
    var TMP_MESSAGING_MESSAGE_ID = "messaging.message_id";
    var TMP_MESSAGING_CONVERSATION_ID = "messaging.conversation_id";
    var TMP_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES = "messaging.message_payload_size_bytes";
    var TMP_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES = "messaging.message_payload_compressed_size_bytes";
    var TMP_MESSAGING_OPERATION = "messaging.operation";
    var TMP_MESSAGING_CONSUMER_ID = "messaging.consumer_id";
    var TMP_MESSAGING_RABBITMQ_ROUTING_KEY = "messaging.rabbitmq.routing_key";
    var TMP_MESSAGING_KAFKA_MESSAGE_KEY = "messaging.kafka.message_key";
    var TMP_MESSAGING_KAFKA_CONSUMER_GROUP = "messaging.kafka.consumer_group";
    var TMP_MESSAGING_KAFKA_CLIENT_ID = "messaging.kafka.client_id";
    var TMP_MESSAGING_KAFKA_PARTITION = "messaging.kafka.partition";
    var TMP_MESSAGING_KAFKA_TOMBSTONE = "messaging.kafka.tombstone";
    var TMP_RPC_SYSTEM = "rpc.system";
    var TMP_RPC_SERVICE = "rpc.service";
    var TMP_RPC_METHOD = "rpc.method";
    var TMP_RPC_GRPC_STATUS_CODE = "rpc.grpc.status_code";
    var TMP_RPC_JSONRPC_VERSION = "rpc.jsonrpc.version";
    var TMP_RPC_JSONRPC_REQUEST_ID = "rpc.jsonrpc.request_id";
    var TMP_RPC_JSONRPC_ERROR_CODE = "rpc.jsonrpc.error_code";
    var TMP_RPC_JSONRPC_ERROR_MESSAGE = "rpc.jsonrpc.error_message";
    var TMP_MESSAGE_TYPE = "message.type";
    var TMP_MESSAGE_ID = "message.id";
    var TMP_MESSAGE_COMPRESSED_SIZE = "message.compressed_size";
    var TMP_MESSAGE_UNCOMPRESSED_SIZE = "message.uncompressed_size";
    exports.SEMATTRS_AWS_LAMBDA_INVOKED_ARN = TMP_AWS_LAMBDA_INVOKED_ARN;
    exports.SEMATTRS_DB_SYSTEM = TMP_DB_SYSTEM;
    exports.SEMATTRS_DB_CONNECTION_STRING = TMP_DB_CONNECTION_STRING;
    exports.SEMATTRS_DB_USER = TMP_DB_USER;
    exports.SEMATTRS_DB_JDBC_DRIVER_CLASSNAME = TMP_DB_JDBC_DRIVER_CLASSNAME;
    exports.SEMATTRS_DB_NAME = TMP_DB_NAME;
    exports.SEMATTRS_DB_STATEMENT = TMP_DB_STATEMENT;
    exports.SEMATTRS_DB_OPERATION = TMP_DB_OPERATION;
    exports.SEMATTRS_DB_MSSQL_INSTANCE_NAME = TMP_DB_MSSQL_INSTANCE_NAME;
    exports.SEMATTRS_DB_CASSANDRA_KEYSPACE = TMP_DB_CASSANDRA_KEYSPACE;
    exports.SEMATTRS_DB_CASSANDRA_PAGE_SIZE = TMP_DB_CASSANDRA_PAGE_SIZE;
    exports.SEMATTRS_DB_CASSANDRA_CONSISTENCY_LEVEL = TMP_DB_CASSANDRA_CONSISTENCY_LEVEL;
    exports.SEMATTRS_DB_CASSANDRA_TABLE = TMP_DB_CASSANDRA_TABLE;
    exports.SEMATTRS_DB_CASSANDRA_IDEMPOTENCE = TMP_DB_CASSANDRA_IDEMPOTENCE;
    exports.SEMATTRS_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = TMP_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT;
    exports.SEMATTRS_DB_CASSANDRA_COORDINATOR_ID = TMP_DB_CASSANDRA_COORDINATOR_ID;
    exports.SEMATTRS_DB_CASSANDRA_COORDINATOR_DC = TMP_DB_CASSANDRA_COORDINATOR_DC;
    exports.SEMATTRS_DB_HBASE_NAMESPACE = TMP_DB_HBASE_NAMESPACE;
    exports.SEMATTRS_DB_REDIS_DATABASE_INDEX = TMP_DB_REDIS_DATABASE_INDEX;
    exports.SEMATTRS_DB_MONGODB_COLLECTION = TMP_DB_MONGODB_COLLECTION;
    exports.SEMATTRS_DB_SQL_TABLE = TMP_DB_SQL_TABLE;
    exports.SEMATTRS_EXCEPTION_TYPE = TMP_EXCEPTION_TYPE;
    exports.SEMATTRS_EXCEPTION_MESSAGE = TMP_EXCEPTION_MESSAGE;
    exports.SEMATTRS_EXCEPTION_STACKTRACE = TMP_EXCEPTION_STACKTRACE;
    exports.SEMATTRS_EXCEPTION_ESCAPED = TMP_EXCEPTION_ESCAPED;
    exports.SEMATTRS_FAAS_TRIGGER = TMP_FAAS_TRIGGER;
    exports.SEMATTRS_FAAS_EXECUTION = TMP_FAAS_EXECUTION;
    exports.SEMATTRS_FAAS_DOCUMENT_COLLECTION = TMP_FAAS_DOCUMENT_COLLECTION;
    exports.SEMATTRS_FAAS_DOCUMENT_OPERATION = TMP_FAAS_DOCUMENT_OPERATION;
    exports.SEMATTRS_FAAS_DOCUMENT_TIME = TMP_FAAS_DOCUMENT_TIME;
    exports.SEMATTRS_FAAS_DOCUMENT_NAME = TMP_FAAS_DOCUMENT_NAME;
    exports.SEMATTRS_FAAS_TIME = TMP_FAAS_TIME;
    exports.SEMATTRS_FAAS_CRON = TMP_FAAS_CRON;
    exports.SEMATTRS_FAAS_COLDSTART = TMP_FAAS_COLDSTART;
    exports.SEMATTRS_FAAS_INVOKED_NAME = TMP_FAAS_INVOKED_NAME;
    exports.SEMATTRS_FAAS_INVOKED_PROVIDER = TMP_FAAS_INVOKED_PROVIDER;
    exports.SEMATTRS_FAAS_INVOKED_REGION = TMP_FAAS_INVOKED_REGION;
    exports.SEMATTRS_NET_TRANSPORT = TMP_NET_TRANSPORT;
    exports.SEMATTRS_NET_PEER_IP = TMP_NET_PEER_IP;
    exports.SEMATTRS_NET_PEER_PORT = TMP_NET_PEER_PORT;
    exports.SEMATTRS_NET_PEER_NAME = TMP_NET_PEER_NAME;
    exports.SEMATTRS_NET_HOST_IP = TMP_NET_HOST_IP;
    exports.SEMATTRS_NET_HOST_PORT = TMP_NET_HOST_PORT;
    exports.SEMATTRS_NET_HOST_NAME = TMP_NET_HOST_NAME;
    exports.SEMATTRS_NET_HOST_CONNECTION_TYPE = TMP_NET_HOST_CONNECTION_TYPE;
    exports.SEMATTRS_NET_HOST_CONNECTION_SUBTYPE = TMP_NET_HOST_CONNECTION_SUBTYPE;
    exports.SEMATTRS_NET_HOST_CARRIER_NAME = TMP_NET_HOST_CARRIER_NAME;
    exports.SEMATTRS_NET_HOST_CARRIER_MCC = TMP_NET_HOST_CARRIER_MCC;
    exports.SEMATTRS_NET_HOST_CARRIER_MNC = TMP_NET_HOST_CARRIER_MNC;
    exports.SEMATTRS_NET_HOST_CARRIER_ICC = TMP_NET_HOST_CARRIER_ICC;
    exports.SEMATTRS_PEER_SERVICE = TMP_PEER_SERVICE;
    exports.SEMATTRS_ENDUSER_ID = TMP_ENDUSER_ID;
    exports.SEMATTRS_ENDUSER_ROLE = TMP_ENDUSER_ROLE;
    exports.SEMATTRS_ENDUSER_SCOPE = TMP_ENDUSER_SCOPE;
    exports.SEMATTRS_THREAD_ID = TMP_THREAD_ID;
    exports.SEMATTRS_THREAD_NAME = TMP_THREAD_NAME;
    exports.SEMATTRS_CODE_FUNCTION = TMP_CODE_FUNCTION;
    exports.SEMATTRS_CODE_NAMESPACE = TMP_CODE_NAMESPACE;
    exports.SEMATTRS_CODE_FILEPATH = TMP_CODE_FILEPATH;
    exports.SEMATTRS_CODE_LINENO = TMP_CODE_LINENO;
    exports.SEMATTRS_HTTP_METHOD = TMP_HTTP_METHOD;
    exports.SEMATTRS_HTTP_URL = TMP_HTTP_URL;
    exports.SEMATTRS_HTTP_TARGET = TMP_HTTP_TARGET;
    exports.SEMATTRS_HTTP_HOST = TMP_HTTP_HOST;
    exports.SEMATTRS_HTTP_SCHEME = TMP_HTTP_SCHEME;
    exports.SEMATTRS_HTTP_STATUS_CODE = TMP_HTTP_STATUS_CODE;
    exports.SEMATTRS_HTTP_FLAVOR = TMP_HTTP_FLAVOR;
    exports.SEMATTRS_HTTP_USER_AGENT = TMP_HTTP_USER_AGENT;
    exports.SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH = TMP_HTTP_REQUEST_CONTENT_LENGTH;
    exports.SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = TMP_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED;
    exports.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH = TMP_HTTP_RESPONSE_CONTENT_LENGTH;
    exports.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = TMP_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED;
    exports.SEMATTRS_HTTP_SERVER_NAME = TMP_HTTP_SERVER_NAME;
    exports.SEMATTRS_HTTP_ROUTE = TMP_HTTP_ROUTE;
    exports.SEMATTRS_HTTP_CLIENT_IP = TMP_HTTP_CLIENT_IP;
    exports.SEMATTRS_AWS_DYNAMODB_TABLE_NAMES = TMP_AWS_DYNAMODB_TABLE_NAMES;
    exports.SEMATTRS_AWS_DYNAMODB_CONSUMED_CAPACITY = TMP_AWS_DYNAMODB_CONSUMED_CAPACITY;
    exports.SEMATTRS_AWS_DYNAMODB_ITEM_COLLECTION_METRICS = TMP_AWS_DYNAMODB_ITEM_COLLECTION_METRICS;
    exports.SEMATTRS_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = TMP_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY;
    exports.SEMATTRS_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = TMP_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY;
    exports.SEMATTRS_AWS_DYNAMODB_CONSISTENT_READ = TMP_AWS_DYNAMODB_CONSISTENT_READ;
    exports.SEMATTRS_AWS_DYNAMODB_PROJECTION = TMP_AWS_DYNAMODB_PROJECTION;
    exports.SEMATTRS_AWS_DYNAMODB_LIMIT = TMP_AWS_DYNAMODB_LIMIT;
    exports.SEMATTRS_AWS_DYNAMODB_ATTRIBUTES_TO_GET = TMP_AWS_DYNAMODB_ATTRIBUTES_TO_GET;
    exports.SEMATTRS_AWS_DYNAMODB_INDEX_NAME = TMP_AWS_DYNAMODB_INDEX_NAME;
    exports.SEMATTRS_AWS_DYNAMODB_SELECT = TMP_AWS_DYNAMODB_SELECT;
    exports.SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES;
    exports.SEMATTRS_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = TMP_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES;
    exports.SEMATTRS_AWS_DYNAMODB_EXCLUSIVE_START_TABLE = TMP_AWS_DYNAMODB_EXCLUSIVE_START_TABLE;
    exports.SEMATTRS_AWS_DYNAMODB_TABLE_COUNT = TMP_AWS_DYNAMODB_TABLE_COUNT;
    exports.SEMATTRS_AWS_DYNAMODB_SCAN_FORWARD = TMP_AWS_DYNAMODB_SCAN_FORWARD;
    exports.SEMATTRS_AWS_DYNAMODB_SEGMENT = TMP_AWS_DYNAMODB_SEGMENT;
    exports.SEMATTRS_AWS_DYNAMODB_TOTAL_SEGMENTS = TMP_AWS_DYNAMODB_TOTAL_SEGMENTS;
    exports.SEMATTRS_AWS_DYNAMODB_COUNT = TMP_AWS_DYNAMODB_COUNT;
    exports.SEMATTRS_AWS_DYNAMODB_SCANNED_COUNT = TMP_AWS_DYNAMODB_SCANNED_COUNT;
    exports.SEMATTRS_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = TMP_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS;
    exports.SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES;
    exports.SEMATTRS_MESSAGING_SYSTEM = TMP_MESSAGING_SYSTEM;
    exports.SEMATTRS_MESSAGING_DESTINATION = TMP_MESSAGING_DESTINATION;
    exports.SEMATTRS_MESSAGING_DESTINATION_KIND = TMP_MESSAGING_DESTINATION_KIND;
    exports.SEMATTRS_MESSAGING_TEMP_DESTINATION = TMP_MESSAGING_TEMP_DESTINATION;
    exports.SEMATTRS_MESSAGING_PROTOCOL = TMP_MESSAGING_PROTOCOL;
    exports.SEMATTRS_MESSAGING_PROTOCOL_VERSION = TMP_MESSAGING_PROTOCOL_VERSION;
    exports.SEMATTRS_MESSAGING_URL = TMP_MESSAGING_URL;
    exports.SEMATTRS_MESSAGING_MESSAGE_ID = TMP_MESSAGING_MESSAGE_ID;
    exports.SEMATTRS_MESSAGING_CONVERSATION_ID = TMP_MESSAGING_CONVERSATION_ID;
    exports.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES = TMP_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES;
    exports.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES = TMP_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES;
    exports.SEMATTRS_MESSAGING_OPERATION = TMP_MESSAGING_OPERATION;
    exports.SEMATTRS_MESSAGING_CONSUMER_ID = TMP_MESSAGING_CONSUMER_ID;
    exports.SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY = TMP_MESSAGING_RABBITMQ_ROUTING_KEY;
    exports.SEMATTRS_MESSAGING_KAFKA_MESSAGE_KEY = TMP_MESSAGING_KAFKA_MESSAGE_KEY;
    exports.SEMATTRS_MESSAGING_KAFKA_CONSUMER_GROUP = TMP_MESSAGING_KAFKA_CONSUMER_GROUP;
    exports.SEMATTRS_MESSAGING_KAFKA_CLIENT_ID = TMP_MESSAGING_KAFKA_CLIENT_ID;
    exports.SEMATTRS_MESSAGING_KAFKA_PARTITION = TMP_MESSAGING_KAFKA_PARTITION;
    exports.SEMATTRS_MESSAGING_KAFKA_TOMBSTONE = TMP_MESSAGING_KAFKA_TOMBSTONE;
    exports.SEMATTRS_RPC_SYSTEM = TMP_RPC_SYSTEM;
    exports.SEMATTRS_RPC_SERVICE = TMP_RPC_SERVICE;
    exports.SEMATTRS_RPC_METHOD = TMP_RPC_METHOD;
    exports.SEMATTRS_RPC_GRPC_STATUS_CODE = TMP_RPC_GRPC_STATUS_CODE;
    exports.SEMATTRS_RPC_JSONRPC_VERSION = TMP_RPC_JSONRPC_VERSION;
    exports.SEMATTRS_RPC_JSONRPC_REQUEST_ID = TMP_RPC_JSONRPC_REQUEST_ID;
    exports.SEMATTRS_RPC_JSONRPC_ERROR_CODE = TMP_RPC_JSONRPC_ERROR_CODE;
    exports.SEMATTRS_RPC_JSONRPC_ERROR_MESSAGE = TMP_RPC_JSONRPC_ERROR_MESSAGE;
    exports.SEMATTRS_MESSAGE_TYPE = TMP_MESSAGE_TYPE;
    exports.SEMATTRS_MESSAGE_ID = TMP_MESSAGE_ID;
    exports.SEMATTRS_MESSAGE_COMPRESSED_SIZE = TMP_MESSAGE_COMPRESSED_SIZE;
    exports.SEMATTRS_MESSAGE_UNCOMPRESSED_SIZE = TMP_MESSAGE_UNCOMPRESSED_SIZE;
    exports.SemanticAttributes = /* @__PURE__ */ (0, utils_1.createConstMap)([
      TMP_AWS_LAMBDA_INVOKED_ARN,
      TMP_DB_SYSTEM,
      TMP_DB_CONNECTION_STRING,
      TMP_DB_USER,
      TMP_DB_JDBC_DRIVER_CLASSNAME,
      TMP_DB_NAME,
      TMP_DB_STATEMENT,
      TMP_DB_OPERATION,
      TMP_DB_MSSQL_INSTANCE_NAME,
      TMP_DB_CASSANDRA_KEYSPACE,
      TMP_DB_CASSANDRA_PAGE_SIZE,
      TMP_DB_CASSANDRA_CONSISTENCY_LEVEL,
      TMP_DB_CASSANDRA_TABLE,
      TMP_DB_CASSANDRA_IDEMPOTENCE,
      TMP_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT,
      TMP_DB_CASSANDRA_COORDINATOR_ID,
      TMP_DB_CASSANDRA_COORDINATOR_DC,
      TMP_DB_HBASE_NAMESPACE,
      TMP_DB_REDIS_DATABASE_INDEX,
      TMP_DB_MONGODB_COLLECTION,
      TMP_DB_SQL_TABLE,
      TMP_EXCEPTION_TYPE,
      TMP_EXCEPTION_MESSAGE,
      TMP_EXCEPTION_STACKTRACE,
      TMP_EXCEPTION_ESCAPED,
      TMP_FAAS_TRIGGER,
      TMP_FAAS_EXECUTION,
      TMP_FAAS_DOCUMENT_COLLECTION,
      TMP_FAAS_DOCUMENT_OPERATION,
      TMP_FAAS_DOCUMENT_TIME,
      TMP_FAAS_DOCUMENT_NAME,
      TMP_FAAS_TIME,
      TMP_FAAS_CRON,
      TMP_FAAS_COLDSTART,
      TMP_FAAS_INVOKED_NAME,
      TMP_FAAS_INVOKED_PROVIDER,
      TMP_FAAS_INVOKED_REGION,
      TMP_NET_TRANSPORT,
      TMP_NET_PEER_IP,
      TMP_NET_PEER_PORT,
      TMP_NET_PEER_NAME,
      TMP_NET_HOST_IP,
      TMP_NET_HOST_PORT,
      TMP_NET_HOST_NAME,
      TMP_NET_HOST_CONNECTION_TYPE,
      TMP_NET_HOST_CONNECTION_SUBTYPE,
      TMP_NET_HOST_CARRIER_NAME,
      TMP_NET_HOST_CARRIER_MCC,
      TMP_NET_HOST_CARRIER_MNC,
      TMP_NET_HOST_CARRIER_ICC,
      TMP_PEER_SERVICE,
      TMP_ENDUSER_ID,
      TMP_ENDUSER_ROLE,
      TMP_ENDUSER_SCOPE,
      TMP_THREAD_ID,
      TMP_THREAD_NAME,
      TMP_CODE_FUNCTION,
      TMP_CODE_NAMESPACE,
      TMP_CODE_FILEPATH,
      TMP_CODE_LINENO,
      TMP_HTTP_METHOD,
      TMP_HTTP_URL,
      TMP_HTTP_TARGET,
      TMP_HTTP_HOST,
      TMP_HTTP_SCHEME,
      TMP_HTTP_STATUS_CODE,
      TMP_HTTP_FLAVOR,
      TMP_HTTP_USER_AGENT,
      TMP_HTTP_REQUEST_CONTENT_LENGTH,
      TMP_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED,
      TMP_HTTP_RESPONSE_CONTENT_LENGTH,
      TMP_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED,
      TMP_HTTP_SERVER_NAME,
      TMP_HTTP_ROUTE,
      TMP_HTTP_CLIENT_IP,
      TMP_AWS_DYNAMODB_TABLE_NAMES,
      TMP_AWS_DYNAMODB_CONSUMED_CAPACITY,
      TMP_AWS_DYNAMODB_ITEM_COLLECTION_METRICS,
      TMP_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY,
      TMP_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY,
      TMP_AWS_DYNAMODB_CONSISTENT_READ,
      TMP_AWS_DYNAMODB_PROJECTION,
      TMP_AWS_DYNAMODB_LIMIT,
      TMP_AWS_DYNAMODB_ATTRIBUTES_TO_GET,
      TMP_AWS_DYNAMODB_INDEX_NAME,
      TMP_AWS_DYNAMODB_SELECT,
      TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES,
      TMP_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES,
      TMP_AWS_DYNAMODB_EXCLUSIVE_START_TABLE,
      TMP_AWS_DYNAMODB_TABLE_COUNT,
      TMP_AWS_DYNAMODB_SCAN_FORWARD,
      TMP_AWS_DYNAMODB_SEGMENT,
      TMP_AWS_DYNAMODB_TOTAL_SEGMENTS,
      TMP_AWS_DYNAMODB_COUNT,
      TMP_AWS_DYNAMODB_SCANNED_COUNT,
      TMP_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS,
      TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES,
      TMP_MESSAGING_SYSTEM,
      TMP_MESSAGING_DESTINATION,
      TMP_MESSAGING_DESTINATION_KIND,
      TMP_MESSAGING_TEMP_DESTINATION,
      TMP_MESSAGING_PROTOCOL,
      TMP_MESSAGING_PROTOCOL_VERSION,
      TMP_MESSAGING_URL,
      TMP_MESSAGING_MESSAGE_ID,
      TMP_MESSAGING_CONVERSATION_ID,
      TMP_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES,
      TMP_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES,
      TMP_MESSAGING_OPERATION,
      TMP_MESSAGING_CONSUMER_ID,
      TMP_MESSAGING_RABBITMQ_ROUTING_KEY,
      TMP_MESSAGING_KAFKA_MESSAGE_KEY,
      TMP_MESSAGING_KAFKA_CONSUMER_GROUP,
      TMP_MESSAGING_KAFKA_CLIENT_ID,
      TMP_MESSAGING_KAFKA_PARTITION,
      TMP_MESSAGING_KAFKA_TOMBSTONE,
      TMP_RPC_SYSTEM,
      TMP_RPC_SERVICE,
      TMP_RPC_METHOD,
      TMP_RPC_GRPC_STATUS_CODE,
      TMP_RPC_JSONRPC_VERSION,
      TMP_RPC_JSONRPC_REQUEST_ID,
      TMP_RPC_JSONRPC_ERROR_CODE,
      TMP_RPC_JSONRPC_ERROR_MESSAGE,
      TMP_MESSAGE_TYPE,
      TMP_MESSAGE_ID,
      TMP_MESSAGE_COMPRESSED_SIZE,
      TMP_MESSAGE_UNCOMPRESSED_SIZE
    ]);
    var TMP_DBSYSTEMVALUES_OTHER_SQL = "other_sql";
    var TMP_DBSYSTEMVALUES_MSSQL = "mssql";
    var TMP_DBSYSTEMVALUES_MYSQL = "mysql";
    var TMP_DBSYSTEMVALUES_ORACLE = "oracle";
    var TMP_DBSYSTEMVALUES_DB2 = "db2";
    var TMP_DBSYSTEMVALUES_POSTGRESQL = "postgresql";
    var TMP_DBSYSTEMVALUES_REDSHIFT = "redshift";
    var TMP_DBSYSTEMVALUES_HIVE = "hive";
    var TMP_DBSYSTEMVALUES_CLOUDSCAPE = "cloudscape";
    var TMP_DBSYSTEMVALUES_HSQLDB = "hsqldb";
    var TMP_DBSYSTEMVALUES_PROGRESS = "progress";
    var TMP_DBSYSTEMVALUES_MAXDB = "maxdb";
    var TMP_DBSYSTEMVALUES_HANADB = "hanadb";
    var TMP_DBSYSTEMVALUES_INGRES = "ingres";
    var TMP_DBSYSTEMVALUES_FIRSTSQL = "firstsql";
    var TMP_DBSYSTEMVALUES_EDB = "edb";
    var TMP_DBSYSTEMVALUES_CACHE = "cache";
    var TMP_DBSYSTEMVALUES_ADABAS = "adabas";
    var TMP_DBSYSTEMVALUES_FIREBIRD = "firebird";
    var TMP_DBSYSTEMVALUES_DERBY = "derby";
    var TMP_DBSYSTEMVALUES_FILEMAKER = "filemaker";
    var TMP_DBSYSTEMVALUES_INFORMIX = "informix";
    var TMP_DBSYSTEMVALUES_INSTANTDB = "instantdb";
    var TMP_DBSYSTEMVALUES_INTERBASE = "interbase";
    var TMP_DBSYSTEMVALUES_MARIADB = "mariadb";
    var TMP_DBSYSTEMVALUES_NETEZZA = "netezza";
    var TMP_DBSYSTEMVALUES_PERVASIVE = "pervasive";
    var TMP_DBSYSTEMVALUES_POINTBASE = "pointbase";
    var TMP_DBSYSTEMVALUES_SQLITE = "sqlite";
    var TMP_DBSYSTEMVALUES_SYBASE = "sybase";
    var TMP_DBSYSTEMVALUES_TERADATA = "teradata";
    var TMP_DBSYSTEMVALUES_VERTICA = "vertica";
    var TMP_DBSYSTEMVALUES_H2 = "h2";
    var TMP_DBSYSTEMVALUES_COLDFUSION = "coldfusion";
    var TMP_DBSYSTEMVALUES_CASSANDRA = "cassandra";
    var TMP_DBSYSTEMVALUES_HBASE = "hbase";
    var TMP_DBSYSTEMVALUES_MONGODB = "mongodb";
    var TMP_DBSYSTEMVALUES_REDIS = "redis";
    var TMP_DBSYSTEMVALUES_COUCHBASE = "couchbase";
    var TMP_DBSYSTEMVALUES_COUCHDB = "couchdb";
    var TMP_DBSYSTEMVALUES_COSMOSDB = "cosmosdb";
    var TMP_DBSYSTEMVALUES_DYNAMODB = "dynamodb";
    var TMP_DBSYSTEMVALUES_NEO4J = "neo4j";
    var TMP_DBSYSTEMVALUES_GEODE = "geode";
    var TMP_DBSYSTEMVALUES_ELASTICSEARCH = "elasticsearch";
    var TMP_DBSYSTEMVALUES_MEMCACHED = "memcached";
    var TMP_DBSYSTEMVALUES_COCKROACHDB = "cockroachdb";
    exports.DBSYSTEMVALUES_OTHER_SQL = TMP_DBSYSTEMVALUES_OTHER_SQL;
    exports.DBSYSTEMVALUES_MSSQL = TMP_DBSYSTEMVALUES_MSSQL;
    exports.DBSYSTEMVALUES_MYSQL = TMP_DBSYSTEMVALUES_MYSQL;
    exports.DBSYSTEMVALUES_ORACLE = TMP_DBSYSTEMVALUES_ORACLE;
    exports.DBSYSTEMVALUES_DB2 = TMP_DBSYSTEMVALUES_DB2;
    exports.DBSYSTEMVALUES_POSTGRESQL = TMP_DBSYSTEMVALUES_POSTGRESQL;
    exports.DBSYSTEMVALUES_REDSHIFT = TMP_DBSYSTEMVALUES_REDSHIFT;
    exports.DBSYSTEMVALUES_HIVE = TMP_DBSYSTEMVALUES_HIVE;
    exports.DBSYSTEMVALUES_CLOUDSCAPE = TMP_DBSYSTEMVALUES_CLOUDSCAPE;
    exports.DBSYSTEMVALUES_HSQLDB = TMP_DBSYSTEMVALUES_HSQLDB;
    exports.DBSYSTEMVALUES_PROGRESS = TMP_DBSYSTEMVALUES_PROGRESS;
    exports.DBSYSTEMVALUES_MAXDB = TMP_DBSYSTEMVALUES_MAXDB;
    exports.DBSYSTEMVALUES_HANADB = TMP_DBSYSTEMVALUES_HANADB;
    exports.DBSYSTEMVALUES_INGRES = TMP_DBSYSTEMVALUES_INGRES;
    exports.DBSYSTEMVALUES_FIRSTSQL = TMP_DBSYSTEMVALUES_FIRSTSQL;
    exports.DBSYSTEMVALUES_EDB = TMP_DBSYSTEMVALUES_EDB;
    exports.DBSYSTEMVALUES_CACHE = TMP_DBSYSTEMVALUES_CACHE;
    exports.DBSYSTEMVALUES_ADABAS = TMP_DBSYSTEMVALUES_ADABAS;
    exports.DBSYSTEMVALUES_FIREBIRD = TMP_DBSYSTEMVALUES_FIREBIRD;
    exports.DBSYSTEMVALUES_DERBY = TMP_DBSYSTEMVALUES_DERBY;
    exports.DBSYSTEMVALUES_FILEMAKER = TMP_DBSYSTEMVALUES_FILEMAKER;
    exports.DBSYSTEMVALUES_INFORMIX = TMP_DBSYSTEMVALUES_INFORMIX;
    exports.DBSYSTEMVALUES_INSTANTDB = TMP_DBSYSTEMVALUES_INSTANTDB;
    exports.DBSYSTEMVALUES_INTERBASE = TMP_DBSYSTEMVALUES_INTERBASE;
    exports.DBSYSTEMVALUES_MARIADB = TMP_DBSYSTEMVALUES_MARIADB;
    exports.DBSYSTEMVALUES_NETEZZA = TMP_DBSYSTEMVALUES_NETEZZA;
    exports.DBSYSTEMVALUES_PERVASIVE = TMP_DBSYSTEMVALUES_PERVASIVE;
    exports.DBSYSTEMVALUES_POINTBASE = TMP_DBSYSTEMVALUES_POINTBASE;
    exports.DBSYSTEMVALUES_SQLITE = TMP_DBSYSTEMVALUES_SQLITE;
    exports.DBSYSTEMVALUES_SYBASE = TMP_DBSYSTEMVALUES_SYBASE;
    exports.DBSYSTEMVALUES_TERADATA = TMP_DBSYSTEMVALUES_TERADATA;
    exports.DBSYSTEMVALUES_VERTICA = TMP_DBSYSTEMVALUES_VERTICA;
    exports.DBSYSTEMVALUES_H2 = TMP_DBSYSTEMVALUES_H2;
    exports.DBSYSTEMVALUES_COLDFUSION = TMP_DBSYSTEMVALUES_COLDFUSION;
    exports.DBSYSTEMVALUES_CASSANDRA = TMP_DBSYSTEMVALUES_CASSANDRA;
    exports.DBSYSTEMVALUES_HBASE = TMP_DBSYSTEMVALUES_HBASE;
    exports.DBSYSTEMVALUES_MONGODB = TMP_DBSYSTEMVALUES_MONGODB;
    exports.DBSYSTEMVALUES_REDIS = TMP_DBSYSTEMVALUES_REDIS;
    exports.DBSYSTEMVALUES_COUCHBASE = TMP_DBSYSTEMVALUES_COUCHBASE;
    exports.DBSYSTEMVALUES_COUCHDB = TMP_DBSYSTEMVALUES_COUCHDB;
    exports.DBSYSTEMVALUES_COSMOSDB = TMP_DBSYSTEMVALUES_COSMOSDB;
    exports.DBSYSTEMVALUES_DYNAMODB = TMP_DBSYSTEMVALUES_DYNAMODB;
    exports.DBSYSTEMVALUES_NEO4J = TMP_DBSYSTEMVALUES_NEO4J;
    exports.DBSYSTEMVALUES_GEODE = TMP_DBSYSTEMVALUES_GEODE;
    exports.DBSYSTEMVALUES_ELASTICSEARCH = TMP_DBSYSTEMVALUES_ELASTICSEARCH;
    exports.DBSYSTEMVALUES_MEMCACHED = TMP_DBSYSTEMVALUES_MEMCACHED;
    exports.DBSYSTEMVALUES_COCKROACHDB = TMP_DBSYSTEMVALUES_COCKROACHDB;
    exports.DbSystemValues = /* @__PURE__ */ (0, utils_1.createConstMap)([
      TMP_DBSYSTEMVALUES_OTHER_SQL,
      TMP_DBSYSTEMVALUES_MSSQL,
      TMP_DBSYSTEMVALUES_MYSQL,
      TMP_DBSYSTEMVALUES_ORACLE,
      TMP_DBSYSTEMVALUES_DB2,
      TMP_DBSYSTEMVALUES_POSTGRESQL,
      TMP_DBSYSTEMVALUES_REDSHIFT,
      TMP_DBSYSTEMVALUES_HIVE,
      TMP_DBSYSTEMVALUES_CLOUDSCAPE,
      TMP_DBSYSTEMVALUES_HSQLDB,
      TMP_DBSYSTEMVALUES_PROGRESS,
      TMP_DBSYSTEMVALUES_MAXDB,
      TMP_DBSYSTEMVALUES_HANADB,
      TMP_DBSYSTEMVALUES_INGRES,
      TMP_DBSYSTEMVALUES_FIRSTSQL,
      TMP_DBSYSTEMVALUES_EDB,
      TMP_DBSYSTEMVALUES_CACHE,
      TMP_DBSYSTEMVALUES_ADABAS,
      TMP_DBSYSTEMVALUES_FIREBIRD,
      TMP_DBSYSTEMVALUES_DERBY,
      TMP_DBSYSTEMVALUES_FILEMAKER,
      TMP_DBSYSTEMVALUES_INFORMIX,
      TMP_DBSYSTEMVALUES_INSTANTDB,
      TMP_DBSYSTEMVALUES_INTERBASE,
      TMP_DBSYSTEMVALUES_MARIADB,
      TMP_DBSYSTEMVALUES_NETEZZA,
      TMP_DBSYSTEMVALUES_PERVASIVE,
      TMP_DBSYSTEMVALUES_POINTBASE,
      TMP_DBSYSTEMVALUES_SQLITE,
      TMP_DBSYSTEMVALUES_SYBASE,
      TMP_DBSYSTEMVALUES_TERADATA,
      TMP_DBSYSTEMVALUES_VERTICA,
      TMP_DBSYSTEMVALUES_H2,
      TMP_DBSYSTEMVALUES_COLDFUSION,
      TMP_DBSYSTEMVALUES_CASSANDRA,
      TMP_DBSYSTEMVALUES_HBASE,
      TMP_DBSYSTEMVALUES_MONGODB,
      TMP_DBSYSTEMVALUES_REDIS,
      TMP_DBSYSTEMVALUES_COUCHBASE,
      TMP_DBSYSTEMVALUES_COUCHDB,
      TMP_DBSYSTEMVALUES_COSMOSDB,
      TMP_DBSYSTEMVALUES_DYNAMODB,
      TMP_DBSYSTEMVALUES_NEO4J,
      TMP_DBSYSTEMVALUES_GEODE,
      TMP_DBSYSTEMVALUES_ELASTICSEARCH,
      TMP_DBSYSTEMVALUES_MEMCACHED,
      TMP_DBSYSTEMVALUES_COCKROACHDB
    ]);
    var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ALL = "all";
    var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM = "each_quorum";
    var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM = "quorum";
    var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM = "local_quorum";
    var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ONE = "one";
    var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_TWO = "two";
    var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_THREE = "three";
    var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE = "local_one";
    var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ANY = "any";
    var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL = "serial";
    var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL = "local_serial";
    exports.DBCASSANDRACONSISTENCYLEVELVALUES_ALL = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ALL;
    exports.DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM;
    exports.DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM;
    exports.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM;
    exports.DBCASSANDRACONSISTENCYLEVELVALUES_ONE = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ONE;
    exports.DBCASSANDRACONSISTENCYLEVELVALUES_TWO = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_TWO;
    exports.DBCASSANDRACONSISTENCYLEVELVALUES_THREE = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_THREE;
    exports.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE;
    exports.DBCASSANDRACONSISTENCYLEVELVALUES_ANY = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ANY;
    exports.DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL;
    exports.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL;
    exports.DbCassandraConsistencyLevelValues = /* @__PURE__ */ (0, utils_1.createConstMap)([
      TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ALL,
      TMP_DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM,
      TMP_DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM,
      TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM,
      TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ONE,
      TMP_DBCASSANDRACONSISTENCYLEVELVALUES_TWO,
      TMP_DBCASSANDRACONSISTENCYLEVELVALUES_THREE,
      TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE,
      TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ANY,
      TMP_DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL,
      TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL
    ]);
    var TMP_FAASTRIGGERVALUES_DATASOURCE = "datasource";
    var TMP_FAASTRIGGERVALUES_HTTP = "http";
    var TMP_FAASTRIGGERVALUES_PUBSUB = "pubsub";
    var TMP_FAASTRIGGERVALUES_TIMER = "timer";
    var TMP_FAASTRIGGERVALUES_OTHER = "other";
    exports.FAASTRIGGERVALUES_DATASOURCE = TMP_FAASTRIGGERVALUES_DATASOURCE;
    exports.FAASTRIGGERVALUES_HTTP = TMP_FAASTRIGGERVALUES_HTTP;
    exports.FAASTRIGGERVALUES_PUBSUB = TMP_FAASTRIGGERVALUES_PUBSUB;
    exports.FAASTRIGGERVALUES_TIMER = TMP_FAASTRIGGERVALUES_TIMER;
    exports.FAASTRIGGERVALUES_OTHER = TMP_FAASTRIGGERVALUES_OTHER;
    exports.FaasTriggerValues = /* @__PURE__ */ (0, utils_1.createConstMap)([
      TMP_FAASTRIGGERVALUES_DATASOURCE,
      TMP_FAASTRIGGERVALUES_HTTP,
      TMP_FAASTRIGGERVALUES_PUBSUB,
      TMP_FAASTRIGGERVALUES_TIMER,
      TMP_FAASTRIGGERVALUES_OTHER
    ]);
    var TMP_FAASDOCUMENTOPERATIONVALUES_INSERT = "insert";
    var TMP_FAASDOCUMENTOPERATIONVALUES_EDIT = "edit";
    var TMP_FAASDOCUMENTOPERATIONVALUES_DELETE = "delete";
    exports.FAASDOCUMENTOPERATIONVALUES_INSERT = TMP_FAASDOCUMENTOPERATIONVALUES_INSERT;
    exports.FAASDOCUMENTOPERATIONVALUES_EDIT = TMP_FAASDOCUMENTOPERATIONVALUES_EDIT;
    exports.FAASDOCUMENTOPERATIONVALUES_DELETE = TMP_FAASDOCUMENTOPERATIONVALUES_DELETE;
    exports.FaasDocumentOperationValues = /* @__PURE__ */ (0, utils_1.createConstMap)([
      TMP_FAASDOCUMENTOPERATIONVALUES_INSERT,
      TMP_FAASDOCUMENTOPERATIONVALUES_EDIT,
      TMP_FAASDOCUMENTOPERATIONVALUES_DELETE
    ]);
    var TMP_FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD = "alibaba_cloud";
    var TMP_FAASINVOKEDPROVIDERVALUES_AWS = "aws";
    var TMP_FAASINVOKEDPROVIDERVALUES_AZURE = "azure";
    var TMP_FAASINVOKEDPROVIDERVALUES_GCP = "gcp";
    exports.FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD = TMP_FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD;
    exports.FAASINVOKEDPROVIDERVALUES_AWS = TMP_FAASINVOKEDPROVIDERVALUES_AWS;
    exports.FAASINVOKEDPROVIDERVALUES_AZURE = TMP_FAASINVOKEDPROVIDERVALUES_AZURE;
    exports.FAASINVOKEDPROVIDERVALUES_GCP = TMP_FAASINVOKEDPROVIDERVALUES_GCP;
    exports.FaasInvokedProviderValues = /* @__PURE__ */ (0, utils_1.createConstMap)([
      TMP_FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD,
      TMP_FAASINVOKEDPROVIDERVALUES_AWS,
      TMP_FAASINVOKEDPROVIDERVALUES_AZURE,
      TMP_FAASINVOKEDPROVIDERVALUES_GCP
    ]);
    var TMP_NETTRANSPORTVALUES_IP_TCP = "ip_tcp";
    var TMP_NETTRANSPORTVALUES_IP_UDP = "ip_udp";
    var TMP_NETTRANSPORTVALUES_IP = "ip";
    var TMP_NETTRANSPORTVALUES_UNIX = "unix";
    var TMP_NETTRANSPORTVALUES_PIPE = "pipe";
    var TMP_NETTRANSPORTVALUES_INPROC = "inproc";
    var TMP_NETTRANSPORTVALUES_OTHER = "other";
    exports.NETTRANSPORTVALUES_IP_TCP = TMP_NETTRANSPORTVALUES_IP_TCP;
    exports.NETTRANSPORTVALUES_IP_UDP = TMP_NETTRANSPORTVALUES_IP_UDP;
    exports.NETTRANSPORTVALUES_IP = TMP_NETTRANSPORTVALUES_IP;
    exports.NETTRANSPORTVALUES_UNIX = TMP_NETTRANSPORTVALUES_UNIX;
    exports.NETTRANSPORTVALUES_PIPE = TMP_NETTRANSPORTVALUES_PIPE;
    exports.NETTRANSPORTVALUES_INPROC = TMP_NETTRANSPORTVALUES_INPROC;
    exports.NETTRANSPORTVALUES_OTHER = TMP_NETTRANSPORTVALUES_OTHER;
    exports.NetTransportValues = /* @__PURE__ */ (0, utils_1.createConstMap)([
      TMP_NETTRANSPORTVALUES_IP_TCP,
      TMP_NETTRANSPORTVALUES_IP_UDP,
      TMP_NETTRANSPORTVALUES_IP,
      TMP_NETTRANSPORTVALUES_UNIX,
      TMP_NETTRANSPORTVALUES_PIPE,
      TMP_NETTRANSPORTVALUES_INPROC,
      TMP_NETTRANSPORTVALUES_OTHER
    ]);
    var TMP_NETHOSTCONNECTIONTYPEVALUES_WIFI = "wifi";
    var TMP_NETHOSTCONNECTIONTYPEVALUES_WIRED = "wired";
    var TMP_NETHOSTCONNECTIONTYPEVALUES_CELL = "cell";
    var TMP_NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE = "unavailable";
    var TMP_NETHOSTCONNECTIONTYPEVALUES_UNKNOWN = "unknown";
    exports.NETHOSTCONNECTIONTYPEVALUES_WIFI = TMP_NETHOSTCONNECTIONTYPEVALUES_WIFI;
    exports.NETHOSTCONNECTIONTYPEVALUES_WIRED = TMP_NETHOSTCONNECTIONTYPEVALUES_WIRED;
    exports.NETHOSTCONNECTIONTYPEVALUES_CELL = TMP_NETHOSTCONNECTIONTYPEVALUES_CELL;
    exports.NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE = TMP_NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE;
    exports.NETHOSTCONNECTIONTYPEVALUES_UNKNOWN = TMP_NETHOSTCONNECTIONTYPEVALUES_UNKNOWN;
    exports.NetHostConnectionTypeValues = /* @__PURE__ */ (0, utils_1.createConstMap)([
      TMP_NETHOSTCONNECTIONTYPEVALUES_WIFI,
      TMP_NETHOSTCONNECTIONTYPEVALUES_WIRED,
      TMP_NETHOSTCONNECTIONTYPEVALUES_CELL,
      TMP_NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE,
      TMP_NETHOSTCONNECTIONTYPEVALUES_UNKNOWN
    ]);
    var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GPRS = "gprs";
    var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EDGE = "edge";
    var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_UMTS = "umts";
    var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA = "cdma";
    var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0 = "evdo_0";
    var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A = "evdo_a";
    var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT = "cdma2000_1xrtt";
    var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA = "hsdpa";
    var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA = "hsupa";
    var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPA = "hspa";
    var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IDEN = "iden";
    var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B = "evdo_b";
    var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE = "lte";
    var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD = "ehrpd";
    var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP = "hspap";
    var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GSM = "gsm";
    var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA = "td_scdma";
    var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN = "iwlan";
    var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NR = "nr";
    var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA = "nrnsa";
    var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA = "lte_ca";
    exports.NETHOSTCONNECTIONSUBTYPEVALUES_GPRS = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GPRS;
    exports.NETHOSTCONNECTIONSUBTYPEVALUES_EDGE = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EDGE;
    exports.NETHOSTCONNECTIONSUBTYPEVALUES_UMTS = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_UMTS;
    exports.NETHOSTCONNECTIONSUBTYPEVALUES_CDMA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA;
    exports.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0 = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0;
    exports.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A;
    exports.NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT;
    exports.NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA;
    exports.NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA;
    exports.NETHOSTCONNECTIONSUBTYPEVALUES_HSPA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPA;
    exports.NETHOSTCONNECTIONSUBTYPEVALUES_IDEN = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IDEN;
    exports.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B;
    exports.NETHOSTCONNECTIONSUBTYPEVALUES_LTE = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE;
    exports.NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD;
    exports.NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP;
    exports.NETHOSTCONNECTIONSUBTYPEVALUES_GSM = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GSM;
    exports.NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA;
    exports.NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN;
    exports.NETHOSTCONNECTIONSUBTYPEVALUES_NR = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NR;
    exports.NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA;
    exports.NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA;
    exports.NetHostConnectionSubtypeValues = /* @__PURE__ */ (0, utils_1.createConstMap)([
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GPRS,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EDGE,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_UMTS,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPA,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IDEN,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GSM,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NR,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA
    ]);
    var TMP_HTTPFLAVORVALUES_HTTP_1_0 = "1.0";
    var TMP_HTTPFLAVORVALUES_HTTP_1_1 = "1.1";
    var TMP_HTTPFLAVORVALUES_HTTP_2_0 = "2.0";
    var TMP_HTTPFLAVORVALUES_SPDY = "SPDY";
    var TMP_HTTPFLAVORVALUES_QUIC = "QUIC";
    exports.HTTPFLAVORVALUES_HTTP_1_0 = TMP_HTTPFLAVORVALUES_HTTP_1_0;
    exports.HTTPFLAVORVALUES_HTTP_1_1 = TMP_HTTPFLAVORVALUES_HTTP_1_1;
    exports.HTTPFLAVORVALUES_HTTP_2_0 = TMP_HTTPFLAVORVALUES_HTTP_2_0;
    exports.HTTPFLAVORVALUES_SPDY = TMP_HTTPFLAVORVALUES_SPDY;
    exports.HTTPFLAVORVALUES_QUIC = TMP_HTTPFLAVORVALUES_QUIC;
    exports.HttpFlavorValues = {
      HTTP_1_0: TMP_HTTPFLAVORVALUES_HTTP_1_0,
      HTTP_1_1: TMP_HTTPFLAVORVALUES_HTTP_1_1,
      HTTP_2_0: TMP_HTTPFLAVORVALUES_HTTP_2_0,
      SPDY: TMP_HTTPFLAVORVALUES_SPDY,
      QUIC: TMP_HTTPFLAVORVALUES_QUIC
    };
    var TMP_MESSAGINGDESTINATIONKINDVALUES_QUEUE = "queue";
    var TMP_MESSAGINGDESTINATIONKINDVALUES_TOPIC = "topic";
    exports.MESSAGINGDESTINATIONKINDVALUES_QUEUE = TMP_MESSAGINGDESTINATIONKINDVALUES_QUEUE;
    exports.MESSAGINGDESTINATIONKINDVALUES_TOPIC = TMP_MESSAGINGDESTINATIONKINDVALUES_TOPIC;
    exports.MessagingDestinationKindValues = /* @__PURE__ */ (0, utils_1.createConstMap)([
      TMP_MESSAGINGDESTINATIONKINDVALUES_QUEUE,
      TMP_MESSAGINGDESTINATIONKINDVALUES_TOPIC
    ]);
    var TMP_MESSAGINGOPERATIONVALUES_RECEIVE = "receive";
    var TMP_MESSAGINGOPERATIONVALUES_PROCESS = "process";
    exports.MESSAGINGOPERATIONVALUES_RECEIVE = TMP_MESSAGINGOPERATIONVALUES_RECEIVE;
    exports.MESSAGINGOPERATIONVALUES_PROCESS = TMP_MESSAGINGOPERATIONVALUES_PROCESS;
    exports.MessagingOperationValues = /* @__PURE__ */ (0, utils_1.createConstMap)([
      TMP_MESSAGINGOPERATIONVALUES_RECEIVE,
      TMP_MESSAGINGOPERATIONVALUES_PROCESS
    ]);
    var TMP_RPCGRPCSTATUSCODEVALUES_OK = 0;
    var TMP_RPCGRPCSTATUSCODEVALUES_CANCELLED = 1;
    var TMP_RPCGRPCSTATUSCODEVALUES_UNKNOWN = 2;
    var TMP_RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT = 3;
    var TMP_RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED = 4;
    var TMP_RPCGRPCSTATUSCODEVALUES_NOT_FOUND = 5;
    var TMP_RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS = 6;
    var TMP_RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED = 7;
    var TMP_RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED = 8;
    var TMP_RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION = 9;
    var TMP_RPCGRPCSTATUSCODEVALUES_ABORTED = 10;
    var TMP_RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE = 11;
    var TMP_RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED = 12;
    var TMP_RPCGRPCSTATUSCODEVALUES_INTERNAL = 13;
    var TMP_RPCGRPCSTATUSCODEVALUES_UNAVAILABLE = 14;
    var TMP_RPCGRPCSTATUSCODEVALUES_DATA_LOSS = 15;
    var TMP_RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED = 16;
    exports.RPCGRPCSTATUSCODEVALUES_OK = TMP_RPCGRPCSTATUSCODEVALUES_OK;
    exports.RPCGRPCSTATUSCODEVALUES_CANCELLED = TMP_RPCGRPCSTATUSCODEVALUES_CANCELLED;
    exports.RPCGRPCSTATUSCODEVALUES_UNKNOWN = TMP_RPCGRPCSTATUSCODEVALUES_UNKNOWN;
    exports.RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT = TMP_RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT;
    exports.RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED = TMP_RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED;
    exports.RPCGRPCSTATUSCODEVALUES_NOT_FOUND = TMP_RPCGRPCSTATUSCODEVALUES_NOT_FOUND;
    exports.RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS = TMP_RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS;
    exports.RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED = TMP_RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED;
    exports.RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED = TMP_RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED;
    exports.RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION = TMP_RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION;
    exports.RPCGRPCSTATUSCODEVALUES_ABORTED = TMP_RPCGRPCSTATUSCODEVALUES_ABORTED;
    exports.RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE = TMP_RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE;
    exports.RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED = TMP_RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED;
    exports.RPCGRPCSTATUSCODEVALUES_INTERNAL = TMP_RPCGRPCSTATUSCODEVALUES_INTERNAL;
    exports.RPCGRPCSTATUSCODEVALUES_UNAVAILABLE = TMP_RPCGRPCSTATUSCODEVALUES_UNAVAILABLE;
    exports.RPCGRPCSTATUSCODEVALUES_DATA_LOSS = TMP_RPCGRPCSTATUSCODEVALUES_DATA_LOSS;
    exports.RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED = TMP_RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED;
    exports.RpcGrpcStatusCodeValues = {
      OK: TMP_RPCGRPCSTATUSCODEVALUES_OK,
      CANCELLED: TMP_RPCGRPCSTATUSCODEVALUES_CANCELLED,
      UNKNOWN: TMP_RPCGRPCSTATUSCODEVALUES_UNKNOWN,
      INVALID_ARGUMENT: TMP_RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT,
      DEADLINE_EXCEEDED: TMP_RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED,
      NOT_FOUND: TMP_RPCGRPCSTATUSCODEVALUES_NOT_FOUND,
      ALREADY_EXISTS: TMP_RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS,
      PERMISSION_DENIED: TMP_RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED,
      RESOURCE_EXHAUSTED: TMP_RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED,
      FAILED_PRECONDITION: TMP_RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION,
      ABORTED: TMP_RPCGRPCSTATUSCODEVALUES_ABORTED,
      OUT_OF_RANGE: TMP_RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE,
      UNIMPLEMENTED: TMP_RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED,
      INTERNAL: TMP_RPCGRPCSTATUSCODEVALUES_INTERNAL,
      UNAVAILABLE: TMP_RPCGRPCSTATUSCODEVALUES_UNAVAILABLE,
      DATA_LOSS: TMP_RPCGRPCSTATUSCODEVALUES_DATA_LOSS,
      UNAUTHENTICATED: TMP_RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED
    };
    var TMP_MESSAGETYPEVALUES_SENT = "SENT";
    var TMP_MESSAGETYPEVALUES_RECEIVED = "RECEIVED";
    exports.MESSAGETYPEVALUES_SENT = TMP_MESSAGETYPEVALUES_SENT;
    exports.MESSAGETYPEVALUES_RECEIVED = TMP_MESSAGETYPEVALUES_RECEIVED;
    exports.MessageTypeValues = /* @__PURE__ */ (0, utils_1.createConstMap)([
      TMP_MESSAGETYPEVALUES_SENT,
      TMP_MESSAGETYPEVALUES_RECEIVED
    ]);
  }
});

// node_modules/@opentelemetry/semantic-conventions/build/src/trace/index.js
var require_trace2 = __commonJS({
  "node_modules/@opentelemetry/semantic-conventions/build/src/trace/index.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: /* @__PURE__ */ __name(function() {
          return m[k];
        }, "get") };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_SemanticAttributes(), exports);
  }
});

// node_modules/@opentelemetry/semantic-conventions/build/src/resource/SemanticResourceAttributes.js
var require_SemanticResourceAttributes = __commonJS({
  "node_modules/@opentelemetry/semantic-conventions/build/src/resource/SemanticResourceAttributes.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SEMRESATTRS_K8S_STATEFULSET_NAME = exports.SEMRESATTRS_K8S_STATEFULSET_UID = exports.SEMRESATTRS_K8S_DEPLOYMENT_NAME = exports.SEMRESATTRS_K8S_DEPLOYMENT_UID = exports.SEMRESATTRS_K8S_REPLICASET_NAME = exports.SEMRESATTRS_K8S_REPLICASET_UID = exports.SEMRESATTRS_K8S_CONTAINER_NAME = exports.SEMRESATTRS_K8S_POD_NAME = exports.SEMRESATTRS_K8S_POD_UID = exports.SEMRESATTRS_K8S_NAMESPACE_NAME = exports.SEMRESATTRS_K8S_NODE_UID = exports.SEMRESATTRS_K8S_NODE_NAME = exports.SEMRESATTRS_K8S_CLUSTER_NAME = exports.SEMRESATTRS_HOST_IMAGE_VERSION = exports.SEMRESATTRS_HOST_IMAGE_ID = exports.SEMRESATTRS_HOST_IMAGE_NAME = exports.SEMRESATTRS_HOST_ARCH = exports.SEMRESATTRS_HOST_TYPE = exports.SEMRESATTRS_HOST_NAME = exports.SEMRESATTRS_HOST_ID = exports.SEMRESATTRS_FAAS_MAX_MEMORY = exports.SEMRESATTRS_FAAS_INSTANCE = exports.SEMRESATTRS_FAAS_VERSION = exports.SEMRESATTRS_FAAS_ID = exports.SEMRESATTRS_FAAS_NAME = exports.SEMRESATTRS_DEVICE_MODEL_NAME = exports.SEMRESATTRS_DEVICE_MODEL_IDENTIFIER = exports.SEMRESATTRS_DEVICE_ID = exports.SEMRESATTRS_DEPLOYMENT_ENVIRONMENT = exports.SEMRESATTRS_CONTAINER_IMAGE_TAG = exports.SEMRESATTRS_CONTAINER_IMAGE_NAME = exports.SEMRESATTRS_CONTAINER_RUNTIME = exports.SEMRESATTRS_CONTAINER_ID = exports.SEMRESATTRS_CONTAINER_NAME = exports.SEMRESATTRS_AWS_LOG_STREAM_ARNS = exports.SEMRESATTRS_AWS_LOG_STREAM_NAMES = exports.SEMRESATTRS_AWS_LOG_GROUP_ARNS = exports.SEMRESATTRS_AWS_LOG_GROUP_NAMES = exports.SEMRESATTRS_AWS_EKS_CLUSTER_ARN = exports.SEMRESATTRS_AWS_ECS_TASK_REVISION = exports.SEMRESATTRS_AWS_ECS_TASK_FAMILY = exports.SEMRESATTRS_AWS_ECS_TASK_ARN = exports.SEMRESATTRS_AWS_ECS_LAUNCHTYPE = exports.SEMRESATTRS_AWS_ECS_CLUSTER_ARN = exports.SEMRESATTRS_AWS_ECS_CONTAINER_ARN = exports.SEMRESATTRS_CLOUD_PLATFORM = exports.SEMRESATTRS_CLOUD_AVAILABILITY_ZONE = exports.SEMRESATTRS_CLOUD_REGION = exports.SEMRESATTRS_CLOUD_ACCOUNT_ID = exports.SEMRESATTRS_CLOUD_PROVIDER = void 0;
    exports.CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE = exports.CLOUDPLATFORMVALUES_AZURE_APP_SERVICE = exports.CLOUDPLATFORMVALUES_AZURE_FUNCTIONS = exports.CLOUDPLATFORMVALUES_AZURE_AKS = exports.CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES = exports.CLOUDPLATFORMVALUES_AZURE_VM = exports.CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK = exports.CLOUDPLATFORMVALUES_AWS_LAMBDA = exports.CLOUDPLATFORMVALUES_AWS_EKS = exports.CLOUDPLATFORMVALUES_AWS_ECS = exports.CLOUDPLATFORMVALUES_AWS_EC2 = exports.CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC = exports.CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS = exports.CloudProviderValues = exports.CLOUDPROVIDERVALUES_GCP = exports.CLOUDPROVIDERVALUES_AZURE = exports.CLOUDPROVIDERVALUES_AWS = exports.CLOUDPROVIDERVALUES_ALIBABA_CLOUD = exports.SemanticResourceAttributes = exports.SEMRESATTRS_WEBENGINE_DESCRIPTION = exports.SEMRESATTRS_WEBENGINE_VERSION = exports.SEMRESATTRS_WEBENGINE_NAME = exports.SEMRESATTRS_TELEMETRY_AUTO_VERSION = exports.SEMRESATTRS_TELEMETRY_SDK_VERSION = exports.SEMRESATTRS_TELEMETRY_SDK_LANGUAGE = exports.SEMRESATTRS_TELEMETRY_SDK_NAME = exports.SEMRESATTRS_SERVICE_VERSION = exports.SEMRESATTRS_SERVICE_INSTANCE_ID = exports.SEMRESATTRS_SERVICE_NAMESPACE = exports.SEMRESATTRS_SERVICE_NAME = exports.SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION = exports.SEMRESATTRS_PROCESS_RUNTIME_VERSION = exports.SEMRESATTRS_PROCESS_RUNTIME_NAME = exports.SEMRESATTRS_PROCESS_OWNER = exports.SEMRESATTRS_PROCESS_COMMAND_ARGS = exports.SEMRESATTRS_PROCESS_COMMAND_LINE = exports.SEMRESATTRS_PROCESS_COMMAND = exports.SEMRESATTRS_PROCESS_EXECUTABLE_PATH = exports.SEMRESATTRS_PROCESS_EXECUTABLE_NAME = exports.SEMRESATTRS_PROCESS_PID = exports.SEMRESATTRS_OS_VERSION = exports.SEMRESATTRS_OS_NAME = exports.SEMRESATTRS_OS_DESCRIPTION = exports.SEMRESATTRS_OS_TYPE = exports.SEMRESATTRS_K8S_CRONJOB_NAME = exports.SEMRESATTRS_K8S_CRONJOB_UID = exports.SEMRESATTRS_K8S_JOB_NAME = exports.SEMRESATTRS_K8S_JOB_UID = exports.SEMRESATTRS_K8S_DAEMONSET_NAME = exports.SEMRESATTRS_K8S_DAEMONSET_UID = void 0;
    exports.TelemetrySdkLanguageValues = exports.TELEMETRYSDKLANGUAGEVALUES_WEBJS = exports.TELEMETRYSDKLANGUAGEVALUES_RUBY = exports.TELEMETRYSDKLANGUAGEVALUES_PYTHON = exports.TELEMETRYSDKLANGUAGEVALUES_PHP = exports.TELEMETRYSDKLANGUAGEVALUES_NODEJS = exports.TELEMETRYSDKLANGUAGEVALUES_JAVA = exports.TELEMETRYSDKLANGUAGEVALUES_GO = exports.TELEMETRYSDKLANGUAGEVALUES_ERLANG = exports.TELEMETRYSDKLANGUAGEVALUES_DOTNET = exports.TELEMETRYSDKLANGUAGEVALUES_CPP = exports.OsTypeValues = exports.OSTYPEVALUES_Z_OS = exports.OSTYPEVALUES_SOLARIS = exports.OSTYPEVALUES_AIX = exports.OSTYPEVALUES_HPUX = exports.OSTYPEVALUES_DRAGONFLYBSD = exports.OSTYPEVALUES_OPENBSD = exports.OSTYPEVALUES_NETBSD = exports.OSTYPEVALUES_FREEBSD = exports.OSTYPEVALUES_DARWIN = exports.OSTYPEVALUES_LINUX = exports.OSTYPEVALUES_WINDOWS = exports.HostArchValues = exports.HOSTARCHVALUES_X86 = exports.HOSTARCHVALUES_PPC64 = exports.HOSTARCHVALUES_PPC32 = exports.HOSTARCHVALUES_IA64 = exports.HOSTARCHVALUES_ARM64 = exports.HOSTARCHVALUES_ARM32 = exports.HOSTARCHVALUES_AMD64 = exports.AwsEcsLaunchtypeValues = exports.AWSECSLAUNCHTYPEVALUES_FARGATE = exports.AWSECSLAUNCHTYPEVALUES_EC2 = exports.CloudPlatformValues = exports.CLOUDPLATFORMVALUES_GCP_APP_ENGINE = exports.CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS = exports.CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE = exports.CLOUDPLATFORMVALUES_GCP_CLOUD_RUN = void 0;
    var utils_1 = require_utils3();
    var TMP_CLOUD_PROVIDER = "cloud.provider";
    var TMP_CLOUD_ACCOUNT_ID = "cloud.account.id";
    var TMP_CLOUD_REGION = "cloud.region";
    var TMP_CLOUD_AVAILABILITY_ZONE = "cloud.availability_zone";
    var TMP_CLOUD_PLATFORM = "cloud.platform";
    var TMP_AWS_ECS_CONTAINER_ARN = "aws.ecs.container.arn";
    var TMP_AWS_ECS_CLUSTER_ARN = "aws.ecs.cluster.arn";
    var TMP_AWS_ECS_LAUNCHTYPE = "aws.ecs.launchtype";
    var TMP_AWS_ECS_TASK_ARN = "aws.ecs.task.arn";
    var TMP_AWS_ECS_TASK_FAMILY = "aws.ecs.task.family";
    var TMP_AWS_ECS_TASK_REVISION = "aws.ecs.task.revision";
    var TMP_AWS_EKS_CLUSTER_ARN = "aws.eks.cluster.arn";
    var TMP_AWS_LOG_GROUP_NAMES = "aws.log.group.names";
    var TMP_AWS_LOG_GROUP_ARNS = "aws.log.group.arns";
    var TMP_AWS_LOG_STREAM_NAMES = "aws.log.stream.names";
    var TMP_AWS_LOG_STREAM_ARNS = "aws.log.stream.arns";
    var TMP_CONTAINER_NAME = "container.name";
    var TMP_CONTAINER_ID = "container.id";
    var TMP_CONTAINER_RUNTIME = "container.runtime";
    var TMP_CONTAINER_IMAGE_NAME = "container.image.name";
    var TMP_CONTAINER_IMAGE_TAG = "container.image.tag";
    var TMP_DEPLOYMENT_ENVIRONMENT = "deployment.environment";
    var TMP_DEVICE_ID = "device.id";
    var TMP_DEVICE_MODEL_IDENTIFIER = "device.model.identifier";
    var TMP_DEVICE_MODEL_NAME = "device.model.name";
    var TMP_FAAS_NAME = "faas.name";
    var TMP_FAAS_ID = "faas.id";
    var TMP_FAAS_VERSION = "faas.version";
    var TMP_FAAS_INSTANCE = "faas.instance";
    var TMP_FAAS_MAX_MEMORY = "faas.max_memory";
    var TMP_HOST_ID = "host.id";
    var TMP_HOST_NAME = "host.name";
    var TMP_HOST_TYPE = "host.type";
    var TMP_HOST_ARCH = "host.arch";
    var TMP_HOST_IMAGE_NAME = "host.image.name";
    var TMP_HOST_IMAGE_ID = "host.image.id";
    var TMP_HOST_IMAGE_VERSION = "host.image.version";
    var TMP_K8S_CLUSTER_NAME = "k8s.cluster.name";
    var TMP_K8S_NODE_NAME = "k8s.node.name";
    var TMP_K8S_NODE_UID = "k8s.node.uid";
    var TMP_K8S_NAMESPACE_NAME = "k8s.namespace.name";
    var TMP_K8S_POD_UID = "k8s.pod.uid";
    var TMP_K8S_POD_NAME = "k8s.pod.name";
    var TMP_K8S_CONTAINER_NAME = "k8s.container.name";
    var TMP_K8S_REPLICASET_UID = "k8s.replicaset.uid";
    var TMP_K8S_REPLICASET_NAME = "k8s.replicaset.name";
    var TMP_K8S_DEPLOYMENT_UID = "k8s.deployment.uid";
    var TMP_K8S_DEPLOYMENT_NAME = "k8s.deployment.name";
    var TMP_K8S_STATEFULSET_UID = "k8s.statefulset.uid";
    var TMP_K8S_STATEFULSET_NAME = "k8s.statefulset.name";
    var TMP_K8S_DAEMONSET_UID = "k8s.daemonset.uid";
    var TMP_K8S_DAEMONSET_NAME = "k8s.daemonset.name";
    var TMP_K8S_JOB_UID = "k8s.job.uid";
    var TMP_K8S_JOB_NAME = "k8s.job.name";
    var TMP_K8S_CRONJOB_UID = "k8s.cronjob.uid";
    var TMP_K8S_CRONJOB_NAME = "k8s.cronjob.name";
    var TMP_OS_TYPE = "os.type";
    var TMP_OS_DESCRIPTION = "os.description";
    var TMP_OS_NAME = "os.name";
    var TMP_OS_VERSION = "os.version";
    var TMP_PROCESS_PID = "process.pid";
    var TMP_PROCESS_EXECUTABLE_NAME = "process.executable.name";
    var TMP_PROCESS_EXECUTABLE_PATH = "process.executable.path";
    var TMP_PROCESS_COMMAND = "process.command";
    var TMP_PROCESS_COMMAND_LINE = "process.command_line";
    var TMP_PROCESS_COMMAND_ARGS = "process.command_args";
    var TMP_PROCESS_OWNER = "process.owner";
    var TMP_PROCESS_RUNTIME_NAME = "process.runtime.name";
    var TMP_PROCESS_RUNTIME_VERSION = "process.runtime.version";
    var TMP_PROCESS_RUNTIME_DESCRIPTION = "process.runtime.description";
    var TMP_SERVICE_NAME = "service.name";
    var TMP_SERVICE_NAMESPACE = "service.namespace";
    var TMP_SERVICE_INSTANCE_ID = "service.instance.id";
    var TMP_SERVICE_VERSION = "service.version";
    var TMP_TELEMETRY_SDK_NAME = "telemetry.sdk.name";
    var TMP_TELEMETRY_SDK_LANGUAGE = "telemetry.sdk.language";
    var TMP_TELEMETRY_SDK_VERSION = "telemetry.sdk.version";
    var TMP_TELEMETRY_AUTO_VERSION = "telemetry.auto.version";
    var TMP_WEBENGINE_NAME = "webengine.name";
    var TMP_WEBENGINE_VERSION = "webengine.version";
    var TMP_WEBENGINE_DESCRIPTION = "webengine.description";
    exports.SEMRESATTRS_CLOUD_PROVIDER = TMP_CLOUD_PROVIDER;
    exports.SEMRESATTRS_CLOUD_ACCOUNT_ID = TMP_CLOUD_ACCOUNT_ID;
    exports.SEMRESATTRS_CLOUD_REGION = TMP_CLOUD_REGION;
    exports.SEMRESATTRS_CLOUD_AVAILABILITY_ZONE = TMP_CLOUD_AVAILABILITY_ZONE;
    exports.SEMRESATTRS_CLOUD_PLATFORM = TMP_CLOUD_PLATFORM;
    exports.SEMRESATTRS_AWS_ECS_CONTAINER_ARN = TMP_AWS_ECS_CONTAINER_ARN;
    exports.SEMRESATTRS_AWS_ECS_CLUSTER_ARN = TMP_AWS_ECS_CLUSTER_ARN;
    exports.SEMRESATTRS_AWS_ECS_LAUNCHTYPE = TMP_AWS_ECS_LAUNCHTYPE;
    exports.SEMRESATTRS_AWS_ECS_TASK_ARN = TMP_AWS_ECS_TASK_ARN;
    exports.SEMRESATTRS_AWS_ECS_TASK_FAMILY = TMP_AWS_ECS_TASK_FAMILY;
    exports.SEMRESATTRS_AWS_ECS_TASK_REVISION = TMP_AWS_ECS_TASK_REVISION;
    exports.SEMRESATTRS_AWS_EKS_CLUSTER_ARN = TMP_AWS_EKS_CLUSTER_ARN;
    exports.SEMRESATTRS_AWS_LOG_GROUP_NAMES = TMP_AWS_LOG_GROUP_NAMES;
    exports.SEMRESATTRS_AWS_LOG_GROUP_ARNS = TMP_AWS_LOG_GROUP_ARNS;
    exports.SEMRESATTRS_AWS_LOG_STREAM_NAMES = TMP_AWS_LOG_STREAM_NAMES;
    exports.SEMRESATTRS_AWS_LOG_STREAM_ARNS = TMP_AWS_LOG_STREAM_ARNS;
    exports.SEMRESATTRS_CONTAINER_NAME = TMP_CONTAINER_NAME;
    exports.SEMRESATTRS_CONTAINER_ID = TMP_CONTAINER_ID;
    exports.SEMRESATTRS_CONTAINER_RUNTIME = TMP_CONTAINER_RUNTIME;
    exports.SEMRESATTRS_CONTAINER_IMAGE_NAME = TMP_CONTAINER_IMAGE_NAME;
    exports.SEMRESATTRS_CONTAINER_IMAGE_TAG = TMP_CONTAINER_IMAGE_TAG;
    exports.SEMRESATTRS_DEPLOYMENT_ENVIRONMENT = TMP_DEPLOYMENT_ENVIRONMENT;
    exports.SEMRESATTRS_DEVICE_ID = TMP_DEVICE_ID;
    exports.SEMRESATTRS_DEVICE_MODEL_IDENTIFIER = TMP_DEVICE_MODEL_IDENTIFIER;
    exports.SEMRESATTRS_DEVICE_MODEL_NAME = TMP_DEVICE_MODEL_NAME;
    exports.SEMRESATTRS_FAAS_NAME = TMP_FAAS_NAME;
    exports.SEMRESATTRS_FAAS_ID = TMP_FAAS_ID;
    exports.SEMRESATTRS_FAAS_VERSION = TMP_FAAS_VERSION;
    exports.SEMRESATTRS_FAAS_INSTANCE = TMP_FAAS_INSTANCE;
    exports.SEMRESATTRS_FAAS_MAX_MEMORY = TMP_FAAS_MAX_MEMORY;
    exports.SEMRESATTRS_HOST_ID = TMP_HOST_ID;
    exports.SEMRESATTRS_HOST_NAME = TMP_HOST_NAME;
    exports.SEMRESATTRS_HOST_TYPE = TMP_HOST_TYPE;
    exports.SEMRESATTRS_HOST_ARCH = TMP_HOST_ARCH;
    exports.SEMRESATTRS_HOST_IMAGE_NAME = TMP_HOST_IMAGE_NAME;
    exports.SEMRESATTRS_HOST_IMAGE_ID = TMP_HOST_IMAGE_ID;
    exports.SEMRESATTRS_HOST_IMAGE_VERSION = TMP_HOST_IMAGE_VERSION;
    exports.SEMRESATTRS_K8S_CLUSTER_NAME = TMP_K8S_CLUSTER_NAME;
    exports.SEMRESATTRS_K8S_NODE_NAME = TMP_K8S_NODE_NAME;
    exports.SEMRESATTRS_K8S_NODE_UID = TMP_K8S_NODE_UID;
    exports.SEMRESATTRS_K8S_NAMESPACE_NAME = TMP_K8S_NAMESPACE_NAME;
    exports.SEMRESATTRS_K8S_POD_UID = TMP_K8S_POD_UID;
    exports.SEMRESATTRS_K8S_POD_NAME = TMP_K8S_POD_NAME;
    exports.SEMRESATTRS_K8S_CONTAINER_NAME = TMP_K8S_CONTAINER_NAME;
    exports.SEMRESATTRS_K8S_REPLICASET_UID = TMP_K8S_REPLICASET_UID;
    exports.SEMRESATTRS_K8S_REPLICASET_NAME = TMP_K8S_REPLICASET_NAME;
    exports.SEMRESATTRS_K8S_DEPLOYMENT_UID = TMP_K8S_DEPLOYMENT_UID;
    exports.SEMRESATTRS_K8S_DEPLOYMENT_NAME = TMP_K8S_DEPLOYMENT_NAME;
    exports.SEMRESATTRS_K8S_STATEFULSET_UID = TMP_K8S_STATEFULSET_UID;
    exports.SEMRESATTRS_K8S_STATEFULSET_NAME = TMP_K8S_STATEFULSET_NAME;
    exports.SEMRESATTRS_K8S_DAEMONSET_UID = TMP_K8S_DAEMONSET_UID;
    exports.SEMRESATTRS_K8S_DAEMONSET_NAME = TMP_K8S_DAEMONSET_NAME;
    exports.SEMRESATTRS_K8S_JOB_UID = TMP_K8S_JOB_UID;
    exports.SEMRESATTRS_K8S_JOB_NAME = TMP_K8S_JOB_NAME;
    exports.SEMRESATTRS_K8S_CRONJOB_UID = TMP_K8S_CRONJOB_UID;
    exports.SEMRESATTRS_K8S_CRONJOB_NAME = TMP_K8S_CRONJOB_NAME;
    exports.SEMRESATTRS_OS_TYPE = TMP_OS_TYPE;
    exports.SEMRESATTRS_OS_DESCRIPTION = TMP_OS_DESCRIPTION;
    exports.SEMRESATTRS_OS_NAME = TMP_OS_NAME;
    exports.SEMRESATTRS_OS_VERSION = TMP_OS_VERSION;
    exports.SEMRESATTRS_PROCESS_PID = TMP_PROCESS_PID;
    exports.SEMRESATTRS_PROCESS_EXECUTABLE_NAME = TMP_PROCESS_EXECUTABLE_NAME;
    exports.SEMRESATTRS_PROCESS_EXECUTABLE_PATH = TMP_PROCESS_EXECUTABLE_PATH;
    exports.SEMRESATTRS_PROCESS_COMMAND = TMP_PROCESS_COMMAND;
    exports.SEMRESATTRS_PROCESS_COMMAND_LINE = TMP_PROCESS_COMMAND_LINE;
    exports.SEMRESATTRS_PROCESS_COMMAND_ARGS = TMP_PROCESS_COMMAND_ARGS;
    exports.SEMRESATTRS_PROCESS_OWNER = TMP_PROCESS_OWNER;
    exports.SEMRESATTRS_PROCESS_RUNTIME_NAME = TMP_PROCESS_RUNTIME_NAME;
    exports.SEMRESATTRS_PROCESS_RUNTIME_VERSION = TMP_PROCESS_RUNTIME_VERSION;
    exports.SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION = TMP_PROCESS_RUNTIME_DESCRIPTION;
    exports.SEMRESATTRS_SERVICE_NAME = TMP_SERVICE_NAME;
    exports.SEMRESATTRS_SERVICE_NAMESPACE = TMP_SERVICE_NAMESPACE;
    exports.SEMRESATTRS_SERVICE_INSTANCE_ID = TMP_SERVICE_INSTANCE_ID;
    exports.SEMRESATTRS_SERVICE_VERSION = TMP_SERVICE_VERSION;
    exports.SEMRESATTRS_TELEMETRY_SDK_NAME = TMP_TELEMETRY_SDK_NAME;
    exports.SEMRESATTRS_TELEMETRY_SDK_LANGUAGE = TMP_TELEMETRY_SDK_LANGUAGE;
    exports.SEMRESATTRS_TELEMETRY_SDK_VERSION = TMP_TELEMETRY_SDK_VERSION;
    exports.SEMRESATTRS_TELEMETRY_AUTO_VERSION = TMP_TELEMETRY_AUTO_VERSION;
    exports.SEMRESATTRS_WEBENGINE_NAME = TMP_WEBENGINE_NAME;
    exports.SEMRESATTRS_WEBENGINE_VERSION = TMP_WEBENGINE_VERSION;
    exports.SEMRESATTRS_WEBENGINE_DESCRIPTION = TMP_WEBENGINE_DESCRIPTION;
    exports.SemanticResourceAttributes = /* @__PURE__ */ (0, utils_1.createConstMap)([
      TMP_CLOUD_PROVIDER,
      TMP_CLOUD_ACCOUNT_ID,
      TMP_CLOUD_REGION,
      TMP_CLOUD_AVAILABILITY_ZONE,
      TMP_CLOUD_PLATFORM,
      TMP_AWS_ECS_CONTAINER_ARN,
      TMP_AWS_ECS_CLUSTER_ARN,
      TMP_AWS_ECS_LAUNCHTYPE,
      TMP_AWS_ECS_TASK_ARN,
      TMP_AWS_ECS_TASK_FAMILY,
      TMP_AWS_ECS_TASK_REVISION,
      TMP_AWS_EKS_CLUSTER_ARN,
      TMP_AWS_LOG_GROUP_NAMES,
      TMP_AWS_LOG_GROUP_ARNS,
      TMP_AWS_LOG_STREAM_NAMES,
      TMP_AWS_LOG_STREAM_ARNS,
      TMP_CONTAINER_NAME,
      TMP_CONTAINER_ID,
      TMP_CONTAINER_RUNTIME,
      TMP_CONTAINER_IMAGE_NAME,
      TMP_CONTAINER_IMAGE_TAG,
      TMP_DEPLOYMENT_ENVIRONMENT,
      TMP_DEVICE_ID,
      TMP_DEVICE_MODEL_IDENTIFIER,
      TMP_DEVICE_MODEL_NAME,
      TMP_FAAS_NAME,
      TMP_FAAS_ID,
      TMP_FAAS_VERSION,
      TMP_FAAS_INSTANCE,
      TMP_FAAS_MAX_MEMORY,
      TMP_HOST_ID,
      TMP_HOST_NAME,
      TMP_HOST_TYPE,
      TMP_HOST_ARCH,
      TMP_HOST_IMAGE_NAME,
      TMP_HOST_IMAGE_ID,
      TMP_HOST_IMAGE_VERSION,
      TMP_K8S_CLUSTER_NAME,
      TMP_K8S_NODE_NAME,
      TMP_K8S_NODE_UID,
      TMP_K8S_NAMESPACE_NAME,
      TMP_K8S_POD_UID,
      TMP_K8S_POD_NAME,
      TMP_K8S_CONTAINER_NAME,
      TMP_K8S_REPLICASET_UID,
      TMP_K8S_REPLICASET_NAME,
      TMP_K8S_DEPLOYMENT_UID,
      TMP_K8S_DEPLOYMENT_NAME,
      TMP_K8S_STATEFULSET_UID,
      TMP_K8S_STATEFULSET_NAME,
      TMP_K8S_DAEMONSET_UID,
      TMP_K8S_DAEMONSET_NAME,
      TMP_K8S_JOB_UID,
      TMP_K8S_JOB_NAME,
      TMP_K8S_CRONJOB_UID,
      TMP_K8S_CRONJOB_NAME,
      TMP_OS_TYPE,
      TMP_OS_DESCRIPTION,
      TMP_OS_NAME,
      TMP_OS_VERSION,
      TMP_PROCESS_PID,
      TMP_PROCESS_EXECUTABLE_NAME,
      TMP_PROCESS_EXECUTABLE_PATH,
      TMP_PROCESS_COMMAND,
      TMP_PROCESS_COMMAND_LINE,
      TMP_PROCESS_COMMAND_ARGS,
      TMP_PROCESS_OWNER,
      TMP_PROCESS_RUNTIME_NAME,
      TMP_PROCESS_RUNTIME_VERSION,
      TMP_PROCESS_RUNTIME_DESCRIPTION,
      TMP_SERVICE_NAME,
      TMP_SERVICE_NAMESPACE,
      TMP_SERVICE_INSTANCE_ID,
      TMP_SERVICE_VERSION,
      TMP_TELEMETRY_SDK_NAME,
      TMP_TELEMETRY_SDK_LANGUAGE,
      TMP_TELEMETRY_SDK_VERSION,
      TMP_TELEMETRY_AUTO_VERSION,
      TMP_WEBENGINE_NAME,
      TMP_WEBENGINE_VERSION,
      TMP_WEBENGINE_DESCRIPTION
    ]);
    var TMP_CLOUDPROVIDERVALUES_ALIBABA_CLOUD = "alibaba_cloud";
    var TMP_CLOUDPROVIDERVALUES_AWS = "aws";
    var TMP_CLOUDPROVIDERVALUES_AZURE = "azure";
    var TMP_CLOUDPROVIDERVALUES_GCP = "gcp";
    exports.CLOUDPROVIDERVALUES_ALIBABA_CLOUD = TMP_CLOUDPROVIDERVALUES_ALIBABA_CLOUD;
    exports.CLOUDPROVIDERVALUES_AWS = TMP_CLOUDPROVIDERVALUES_AWS;
    exports.CLOUDPROVIDERVALUES_AZURE = TMP_CLOUDPROVIDERVALUES_AZURE;
    exports.CLOUDPROVIDERVALUES_GCP = TMP_CLOUDPROVIDERVALUES_GCP;
    exports.CloudProviderValues = /* @__PURE__ */ (0, utils_1.createConstMap)([
      TMP_CLOUDPROVIDERVALUES_ALIBABA_CLOUD,
      TMP_CLOUDPROVIDERVALUES_AWS,
      TMP_CLOUDPROVIDERVALUES_AZURE,
      TMP_CLOUDPROVIDERVALUES_GCP
    ]);
    var TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS = "alibaba_cloud_ecs";
    var TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC = "alibaba_cloud_fc";
    var TMP_CLOUDPLATFORMVALUES_AWS_EC2 = "aws_ec2";
    var TMP_CLOUDPLATFORMVALUES_AWS_ECS = "aws_ecs";
    var TMP_CLOUDPLATFORMVALUES_AWS_EKS = "aws_eks";
    var TMP_CLOUDPLATFORMVALUES_AWS_LAMBDA = "aws_lambda";
    var TMP_CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK = "aws_elastic_beanstalk";
    var TMP_CLOUDPLATFORMVALUES_AZURE_VM = "azure_vm";
    var TMP_CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES = "azure_container_instances";
    var TMP_CLOUDPLATFORMVALUES_AZURE_AKS = "azure_aks";
    var TMP_CLOUDPLATFORMVALUES_AZURE_FUNCTIONS = "azure_functions";
    var TMP_CLOUDPLATFORMVALUES_AZURE_APP_SERVICE = "azure_app_service";
    var TMP_CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE = "gcp_compute_engine";
    var TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_RUN = "gcp_cloud_run";
    var TMP_CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE = "gcp_kubernetes_engine";
    var TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS = "gcp_cloud_functions";
    var TMP_CLOUDPLATFORMVALUES_GCP_APP_ENGINE = "gcp_app_engine";
    exports.CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS = TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS;
    exports.CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC = TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC;
    exports.CLOUDPLATFORMVALUES_AWS_EC2 = TMP_CLOUDPLATFORMVALUES_AWS_EC2;
    exports.CLOUDPLATFORMVALUES_AWS_ECS = TMP_CLOUDPLATFORMVALUES_AWS_ECS;
    exports.CLOUDPLATFORMVALUES_AWS_EKS = TMP_CLOUDPLATFORMVALUES_AWS_EKS;
    exports.CLOUDPLATFORMVALUES_AWS_LAMBDA = TMP_CLOUDPLATFORMVALUES_AWS_LAMBDA;
    exports.CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK = TMP_CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK;
    exports.CLOUDPLATFORMVALUES_AZURE_VM = TMP_CLOUDPLATFORMVALUES_AZURE_VM;
    exports.CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES = TMP_CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES;
    exports.CLOUDPLATFORMVALUES_AZURE_AKS = TMP_CLOUDPLATFORMVALUES_AZURE_AKS;
    exports.CLOUDPLATFORMVALUES_AZURE_FUNCTIONS = TMP_CLOUDPLATFORMVALUES_AZURE_FUNCTIONS;
    exports.CLOUDPLATFORMVALUES_AZURE_APP_SERVICE = TMP_CLOUDPLATFORMVALUES_AZURE_APP_SERVICE;
    exports.CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE = TMP_CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE;
    exports.CLOUDPLATFORMVALUES_GCP_CLOUD_RUN = TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_RUN;
    exports.CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE = TMP_CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE;
    exports.CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS = TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS;
    exports.CLOUDPLATFORMVALUES_GCP_APP_ENGINE = TMP_CLOUDPLATFORMVALUES_GCP_APP_ENGINE;
    exports.CloudPlatformValues = /* @__PURE__ */ (0, utils_1.createConstMap)([
      TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS,
      TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC,
      TMP_CLOUDPLATFORMVALUES_AWS_EC2,
      TMP_CLOUDPLATFORMVALUES_AWS_ECS,
      TMP_CLOUDPLATFORMVALUES_AWS_EKS,
      TMP_CLOUDPLATFORMVALUES_AWS_LAMBDA,
      TMP_CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK,
      TMP_CLOUDPLATFORMVALUES_AZURE_VM,
      TMP_CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES,
      TMP_CLOUDPLATFORMVALUES_AZURE_AKS,
      TMP_CLOUDPLATFORMVALUES_AZURE_FUNCTIONS,
      TMP_CLOUDPLATFORMVALUES_AZURE_APP_SERVICE,
      TMP_CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE,
      TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_RUN,
      TMP_CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE,
      TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS,
      TMP_CLOUDPLATFORMVALUES_GCP_APP_ENGINE
    ]);
    var TMP_AWSECSLAUNCHTYPEVALUES_EC2 = "ec2";
    var TMP_AWSECSLAUNCHTYPEVALUES_FARGATE = "fargate";
    exports.AWSECSLAUNCHTYPEVALUES_EC2 = TMP_AWSECSLAUNCHTYPEVALUES_EC2;
    exports.AWSECSLAUNCHTYPEVALUES_FARGATE = TMP_AWSECSLAUNCHTYPEVALUES_FARGATE;
    exports.AwsEcsLaunchtypeValues = /* @__PURE__ */ (0, utils_1.createConstMap)([
      TMP_AWSECSLAUNCHTYPEVALUES_EC2,
      TMP_AWSECSLAUNCHTYPEVALUES_FARGATE
    ]);
    var TMP_HOSTARCHVALUES_AMD64 = "amd64";
    var TMP_HOSTARCHVALUES_ARM32 = "arm32";
    var TMP_HOSTARCHVALUES_ARM64 = "arm64";
    var TMP_HOSTARCHVALUES_IA64 = "ia64";
    var TMP_HOSTARCHVALUES_PPC32 = "ppc32";
    var TMP_HOSTARCHVALUES_PPC64 = "ppc64";
    var TMP_HOSTARCHVALUES_X86 = "x86";
    exports.HOSTARCHVALUES_AMD64 = TMP_HOSTARCHVALUES_AMD64;
    exports.HOSTARCHVALUES_ARM32 = TMP_HOSTARCHVALUES_ARM32;
    exports.HOSTARCHVALUES_ARM64 = TMP_HOSTARCHVALUES_ARM64;
    exports.HOSTARCHVALUES_IA64 = TMP_HOSTARCHVALUES_IA64;
    exports.HOSTARCHVALUES_PPC32 = TMP_HOSTARCHVALUES_PPC32;
    exports.HOSTARCHVALUES_PPC64 = TMP_HOSTARCHVALUES_PPC64;
    exports.HOSTARCHVALUES_X86 = TMP_HOSTARCHVALUES_X86;
    exports.HostArchValues = /* @__PURE__ */ (0, utils_1.createConstMap)([
      TMP_HOSTARCHVALUES_AMD64,
      TMP_HOSTARCHVALUES_ARM32,
      TMP_HOSTARCHVALUES_ARM64,
      TMP_HOSTARCHVALUES_IA64,
      TMP_HOSTARCHVALUES_PPC32,
      TMP_HOSTARCHVALUES_PPC64,
      TMP_HOSTARCHVALUES_X86
    ]);
    var TMP_OSTYPEVALUES_WINDOWS = "windows";
    var TMP_OSTYPEVALUES_LINUX = "linux";
    var TMP_OSTYPEVALUES_DARWIN = "darwin";
    var TMP_OSTYPEVALUES_FREEBSD = "freebsd";
    var TMP_OSTYPEVALUES_NETBSD = "netbsd";
    var TMP_OSTYPEVALUES_OPENBSD = "openbsd";
    var TMP_OSTYPEVALUES_DRAGONFLYBSD = "dragonflybsd";
    var TMP_OSTYPEVALUES_HPUX = "hpux";
    var TMP_OSTYPEVALUES_AIX = "aix";
    var TMP_OSTYPEVALUES_SOLARIS = "solaris";
    var TMP_OSTYPEVALUES_Z_OS = "z_os";
    exports.OSTYPEVALUES_WINDOWS = TMP_OSTYPEVALUES_WINDOWS;
    exports.OSTYPEVALUES_LINUX = TMP_OSTYPEVALUES_LINUX;
    exports.OSTYPEVALUES_DARWIN = TMP_OSTYPEVALUES_DARWIN;
    exports.OSTYPEVALUES_FREEBSD = TMP_OSTYPEVALUES_FREEBSD;
    exports.OSTYPEVALUES_NETBSD = TMP_OSTYPEVALUES_NETBSD;
    exports.OSTYPEVALUES_OPENBSD = TMP_OSTYPEVALUES_OPENBSD;
    exports.OSTYPEVALUES_DRAGONFLYBSD = TMP_OSTYPEVALUES_DRAGONFLYBSD;
    exports.OSTYPEVALUES_HPUX = TMP_OSTYPEVALUES_HPUX;
    exports.OSTYPEVALUES_AIX = TMP_OSTYPEVALUES_AIX;
    exports.OSTYPEVALUES_SOLARIS = TMP_OSTYPEVALUES_SOLARIS;
    exports.OSTYPEVALUES_Z_OS = TMP_OSTYPEVALUES_Z_OS;
    exports.OsTypeValues = /* @__PURE__ */ (0, utils_1.createConstMap)([
      TMP_OSTYPEVALUES_WINDOWS,
      TMP_OSTYPEVALUES_LINUX,
      TMP_OSTYPEVALUES_DARWIN,
      TMP_OSTYPEVALUES_FREEBSD,
      TMP_OSTYPEVALUES_NETBSD,
      TMP_OSTYPEVALUES_OPENBSD,
      TMP_OSTYPEVALUES_DRAGONFLYBSD,
      TMP_OSTYPEVALUES_HPUX,
      TMP_OSTYPEVALUES_AIX,
      TMP_OSTYPEVALUES_SOLARIS,
      TMP_OSTYPEVALUES_Z_OS
    ]);
    var TMP_TELEMETRYSDKLANGUAGEVALUES_CPP = "cpp";
    var TMP_TELEMETRYSDKLANGUAGEVALUES_DOTNET = "dotnet";
    var TMP_TELEMETRYSDKLANGUAGEVALUES_ERLANG = "erlang";
    var TMP_TELEMETRYSDKLANGUAGEVALUES_GO = "go";
    var TMP_TELEMETRYSDKLANGUAGEVALUES_JAVA = "java";
    var TMP_TELEMETRYSDKLANGUAGEVALUES_NODEJS = "nodejs";
    var TMP_TELEMETRYSDKLANGUAGEVALUES_PHP = "php";
    var TMP_TELEMETRYSDKLANGUAGEVALUES_PYTHON = "python";
    var TMP_TELEMETRYSDKLANGUAGEVALUES_RUBY = "ruby";
    var TMP_TELEMETRYSDKLANGUAGEVALUES_WEBJS = "webjs";
    exports.TELEMETRYSDKLANGUAGEVALUES_CPP = TMP_TELEMETRYSDKLANGUAGEVALUES_CPP;
    exports.TELEMETRYSDKLANGUAGEVALUES_DOTNET = TMP_TELEMETRYSDKLANGUAGEVALUES_DOTNET;
    exports.TELEMETRYSDKLANGUAGEVALUES_ERLANG = TMP_TELEMETRYSDKLANGUAGEVALUES_ERLANG;
    exports.TELEMETRYSDKLANGUAGEVALUES_GO = TMP_TELEMETRYSDKLANGUAGEVALUES_GO;
    exports.TELEMETRYSDKLANGUAGEVALUES_JAVA = TMP_TELEMETRYSDKLANGUAGEVALUES_JAVA;
    exports.TELEMETRYSDKLANGUAGEVALUES_NODEJS = TMP_TELEMETRYSDKLANGUAGEVALUES_NODEJS;
    exports.TELEMETRYSDKLANGUAGEVALUES_PHP = TMP_TELEMETRYSDKLANGUAGEVALUES_PHP;
    exports.TELEMETRYSDKLANGUAGEVALUES_PYTHON = TMP_TELEMETRYSDKLANGUAGEVALUES_PYTHON;
    exports.TELEMETRYSDKLANGUAGEVALUES_RUBY = TMP_TELEMETRYSDKLANGUAGEVALUES_RUBY;
    exports.TELEMETRYSDKLANGUAGEVALUES_WEBJS = TMP_TELEMETRYSDKLANGUAGEVALUES_WEBJS;
    exports.TelemetrySdkLanguageValues = /* @__PURE__ */ (0, utils_1.createConstMap)([
      TMP_TELEMETRYSDKLANGUAGEVALUES_CPP,
      TMP_TELEMETRYSDKLANGUAGEVALUES_DOTNET,
      TMP_TELEMETRYSDKLANGUAGEVALUES_ERLANG,
      TMP_TELEMETRYSDKLANGUAGEVALUES_GO,
      TMP_TELEMETRYSDKLANGUAGEVALUES_JAVA,
      TMP_TELEMETRYSDKLANGUAGEVALUES_NODEJS,
      TMP_TELEMETRYSDKLANGUAGEVALUES_PHP,
      TMP_TELEMETRYSDKLANGUAGEVALUES_PYTHON,
      TMP_TELEMETRYSDKLANGUAGEVALUES_RUBY,
      TMP_TELEMETRYSDKLANGUAGEVALUES_WEBJS
    ]);
  }
});

// node_modules/@opentelemetry/semantic-conventions/build/src/resource/index.js
var require_resource = __commonJS({
  "node_modules/@opentelemetry/semantic-conventions/build/src/resource/index.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: /* @__PURE__ */ __name(function() {
          return m[k];
        }, "get") };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_SemanticResourceAttributes(), exports);
  }
});

// node_modules/@opentelemetry/semantic-conventions/build/src/stable_attributes.js
var require_stable_attributes = __commonJS({
  "node_modules/@opentelemetry/semantic-conventions/build/src/stable_attributes.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ATTR_EXCEPTION_TYPE = exports.ATTR_EXCEPTION_STACKTRACE = exports.ATTR_EXCEPTION_MESSAGE = exports.ATTR_EXCEPTION_ESCAPED = exports.ERROR_TYPE_VALUE_OTHER = exports.ATTR_ERROR_TYPE = exports.DOTNET_GC_HEAP_GENERATION_VALUE_POH = exports.DOTNET_GC_HEAP_GENERATION_VALUE_LOH = exports.DOTNET_GC_HEAP_GENERATION_VALUE_GEN2 = exports.DOTNET_GC_HEAP_GENERATION_VALUE_GEN1 = exports.DOTNET_GC_HEAP_GENERATION_VALUE_GEN0 = exports.ATTR_DOTNET_GC_HEAP_GENERATION = exports.DB_SYSTEM_NAME_VALUE_POSTGRESQL = exports.DB_SYSTEM_NAME_VALUE_MYSQL = exports.DB_SYSTEM_NAME_VALUE_MICROSOFT_SQL_SERVER = exports.DB_SYSTEM_NAME_VALUE_MARIADB = exports.ATTR_DB_SYSTEM_NAME = exports.ATTR_DB_STORED_PROCEDURE_NAME = exports.ATTR_DB_RESPONSE_STATUS_CODE = exports.ATTR_DB_QUERY_TEXT = exports.ATTR_DB_QUERY_SUMMARY = exports.ATTR_DB_OPERATION_NAME = exports.ATTR_DB_OPERATION_BATCH_SIZE = exports.ATTR_DB_NAMESPACE = exports.ATTR_DB_COLLECTION_NAME = exports.ATTR_CODE_STACKTRACE = exports.ATTR_CODE_LINE_NUMBER = exports.ATTR_CODE_FUNCTION_NAME = exports.ATTR_CODE_FILE_PATH = exports.ATTR_CODE_COLUMN_NUMBER = exports.ATTR_CLIENT_PORT = exports.ATTR_CLIENT_ADDRESS = exports.ATTR_ASPNETCORE_USER_IS_AUTHENTICATED = exports.ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_SUCCESS = exports.ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_FAILURE = exports.ATTR_ASPNETCORE_ROUTING_MATCH_STATUS = exports.ATTR_ASPNETCORE_ROUTING_IS_FALLBACK = exports.ATTR_ASPNETCORE_REQUEST_IS_UNHANDLED = exports.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_REQUEST_CANCELED = exports.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_GLOBAL_LIMITER = exports.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ENDPOINT_LIMITER = exports.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ACQUIRED = exports.ATTR_ASPNETCORE_RATE_LIMITING_RESULT = exports.ATTR_ASPNETCORE_RATE_LIMITING_POLICY = exports.ATTR_ASPNETCORE_DIAGNOSTICS_HANDLER_TYPE = exports.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_UNHANDLED = exports.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_SKIPPED = exports.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_HANDLED = exports.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_ABORTED = exports.ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT = void 0;
    exports.OTEL_STATUS_CODE_VALUE_ERROR = exports.ATTR_OTEL_STATUS_CODE = exports.ATTR_OTEL_SCOPE_VERSION = exports.ATTR_OTEL_SCOPE_NAME = exports.NETWORK_TYPE_VALUE_IPV6 = exports.NETWORK_TYPE_VALUE_IPV4 = exports.ATTR_NETWORK_TYPE = exports.NETWORK_TRANSPORT_VALUE_UNIX = exports.NETWORK_TRANSPORT_VALUE_UDP = exports.NETWORK_TRANSPORT_VALUE_TCP = exports.NETWORK_TRANSPORT_VALUE_QUIC = exports.NETWORK_TRANSPORT_VALUE_PIPE = exports.ATTR_NETWORK_TRANSPORT = exports.ATTR_NETWORK_PROTOCOL_VERSION = exports.ATTR_NETWORK_PROTOCOL_NAME = exports.ATTR_NETWORK_PEER_PORT = exports.ATTR_NETWORK_PEER_ADDRESS = exports.ATTR_NETWORK_LOCAL_PORT = exports.ATTR_NETWORK_LOCAL_ADDRESS = exports.JVM_THREAD_STATE_VALUE_WAITING = exports.JVM_THREAD_STATE_VALUE_TIMED_WAITING = exports.JVM_THREAD_STATE_VALUE_TERMINATED = exports.JVM_THREAD_STATE_VALUE_RUNNABLE = exports.JVM_THREAD_STATE_VALUE_NEW = exports.JVM_THREAD_STATE_VALUE_BLOCKED = exports.ATTR_JVM_THREAD_STATE = exports.ATTR_JVM_THREAD_DAEMON = exports.JVM_MEMORY_TYPE_VALUE_NON_HEAP = exports.JVM_MEMORY_TYPE_VALUE_HEAP = exports.ATTR_JVM_MEMORY_TYPE = exports.ATTR_JVM_MEMORY_POOL_NAME = exports.ATTR_JVM_GC_NAME = exports.ATTR_JVM_GC_ACTION = exports.ATTR_HTTP_ROUTE = exports.ATTR_HTTP_RESPONSE_STATUS_CODE = exports.ATTR_HTTP_RESPONSE_HEADER = exports.ATTR_HTTP_REQUEST_RESEND_COUNT = exports.ATTR_HTTP_REQUEST_METHOD_ORIGINAL = exports.HTTP_REQUEST_METHOD_VALUE_TRACE = exports.HTTP_REQUEST_METHOD_VALUE_PUT = exports.HTTP_REQUEST_METHOD_VALUE_POST = exports.HTTP_REQUEST_METHOD_VALUE_PATCH = exports.HTTP_REQUEST_METHOD_VALUE_OPTIONS = exports.HTTP_REQUEST_METHOD_VALUE_HEAD = exports.HTTP_REQUEST_METHOD_VALUE_GET = exports.HTTP_REQUEST_METHOD_VALUE_DELETE = exports.HTTP_REQUEST_METHOD_VALUE_CONNECT = exports.HTTP_REQUEST_METHOD_VALUE_OTHER = exports.ATTR_HTTP_REQUEST_METHOD = exports.ATTR_HTTP_REQUEST_HEADER = void 0;
    exports.ATTR_USER_AGENT_ORIGINAL = exports.ATTR_URL_SCHEME = exports.ATTR_URL_QUERY = exports.ATTR_URL_PATH = exports.ATTR_URL_FULL = exports.ATTR_URL_FRAGMENT = exports.ATTR_TELEMETRY_SDK_VERSION = exports.ATTR_TELEMETRY_SDK_NAME = exports.TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS = exports.TELEMETRY_SDK_LANGUAGE_VALUE_SWIFT = exports.TELEMETRY_SDK_LANGUAGE_VALUE_RUST = exports.TELEMETRY_SDK_LANGUAGE_VALUE_RUBY = exports.TELEMETRY_SDK_LANGUAGE_VALUE_PYTHON = exports.TELEMETRY_SDK_LANGUAGE_VALUE_PHP = exports.TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS = exports.TELEMETRY_SDK_LANGUAGE_VALUE_JAVA = exports.TELEMETRY_SDK_LANGUAGE_VALUE_GO = exports.TELEMETRY_SDK_LANGUAGE_VALUE_ERLANG = exports.TELEMETRY_SDK_LANGUAGE_VALUE_DOTNET = exports.TELEMETRY_SDK_LANGUAGE_VALUE_CPP = exports.ATTR_TELEMETRY_SDK_LANGUAGE = exports.SIGNALR_TRANSPORT_VALUE_WEB_SOCKETS = exports.SIGNALR_TRANSPORT_VALUE_SERVER_SENT_EVENTS = exports.SIGNALR_TRANSPORT_VALUE_LONG_POLLING = exports.ATTR_SIGNALR_TRANSPORT = exports.SIGNALR_CONNECTION_STATUS_VALUE_TIMEOUT = exports.SIGNALR_CONNECTION_STATUS_VALUE_NORMAL_CLOSURE = exports.SIGNALR_CONNECTION_STATUS_VALUE_APP_SHUTDOWN = exports.ATTR_SIGNALR_CONNECTION_STATUS = exports.ATTR_SERVICE_VERSION = exports.ATTR_SERVICE_NAME = exports.ATTR_SERVER_PORT = exports.ATTR_SERVER_ADDRESS = exports.ATTR_OTEL_STATUS_DESCRIPTION = exports.OTEL_STATUS_CODE_VALUE_OK = void 0;
    exports.ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT = "aspnetcore.diagnostics.exception.result";
    exports.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_ABORTED = "aborted";
    exports.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_HANDLED = "handled";
    exports.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_SKIPPED = "skipped";
    exports.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_UNHANDLED = "unhandled";
    exports.ATTR_ASPNETCORE_DIAGNOSTICS_HANDLER_TYPE = "aspnetcore.diagnostics.handler.type";
    exports.ATTR_ASPNETCORE_RATE_LIMITING_POLICY = "aspnetcore.rate_limiting.policy";
    exports.ATTR_ASPNETCORE_RATE_LIMITING_RESULT = "aspnetcore.rate_limiting.result";
    exports.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ACQUIRED = "acquired";
    exports.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ENDPOINT_LIMITER = "endpoint_limiter";
    exports.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_GLOBAL_LIMITER = "global_limiter";
    exports.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_REQUEST_CANCELED = "request_canceled";
    exports.ATTR_ASPNETCORE_REQUEST_IS_UNHANDLED = "aspnetcore.request.is_unhandled";
    exports.ATTR_ASPNETCORE_ROUTING_IS_FALLBACK = "aspnetcore.routing.is_fallback";
    exports.ATTR_ASPNETCORE_ROUTING_MATCH_STATUS = "aspnetcore.routing.match_status";
    exports.ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_FAILURE = "failure";
    exports.ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_SUCCESS = "success";
    exports.ATTR_ASPNETCORE_USER_IS_AUTHENTICATED = "aspnetcore.user.is_authenticated";
    exports.ATTR_CLIENT_ADDRESS = "client.address";
    exports.ATTR_CLIENT_PORT = "client.port";
    exports.ATTR_CODE_COLUMN_NUMBER = "code.column.number";
    exports.ATTR_CODE_FILE_PATH = "code.file.path";
    exports.ATTR_CODE_FUNCTION_NAME = "code.function.name";
    exports.ATTR_CODE_LINE_NUMBER = "code.line.number";
    exports.ATTR_CODE_STACKTRACE = "code.stacktrace";
    exports.ATTR_DB_COLLECTION_NAME = "db.collection.name";
    exports.ATTR_DB_NAMESPACE = "db.namespace";
    exports.ATTR_DB_OPERATION_BATCH_SIZE = "db.operation.batch.size";
    exports.ATTR_DB_OPERATION_NAME = "db.operation.name";
    exports.ATTR_DB_QUERY_SUMMARY = "db.query.summary";
    exports.ATTR_DB_QUERY_TEXT = "db.query.text";
    exports.ATTR_DB_RESPONSE_STATUS_CODE = "db.response.status_code";
    exports.ATTR_DB_STORED_PROCEDURE_NAME = "db.stored_procedure.name";
    exports.ATTR_DB_SYSTEM_NAME = "db.system.name";
    exports.DB_SYSTEM_NAME_VALUE_MARIADB = "mariadb";
    exports.DB_SYSTEM_NAME_VALUE_MICROSOFT_SQL_SERVER = "microsoft.sql_server";
    exports.DB_SYSTEM_NAME_VALUE_MYSQL = "mysql";
    exports.DB_SYSTEM_NAME_VALUE_POSTGRESQL = "postgresql";
    exports.ATTR_DOTNET_GC_HEAP_GENERATION = "dotnet.gc.heap.generation";
    exports.DOTNET_GC_HEAP_GENERATION_VALUE_GEN0 = "gen0";
    exports.DOTNET_GC_HEAP_GENERATION_VALUE_GEN1 = "gen1";
    exports.DOTNET_GC_HEAP_GENERATION_VALUE_GEN2 = "gen2";
    exports.DOTNET_GC_HEAP_GENERATION_VALUE_LOH = "loh";
    exports.DOTNET_GC_HEAP_GENERATION_VALUE_POH = "poh";
    exports.ATTR_ERROR_TYPE = "error.type";
    exports.ERROR_TYPE_VALUE_OTHER = "_OTHER";
    exports.ATTR_EXCEPTION_ESCAPED = "exception.escaped";
    exports.ATTR_EXCEPTION_MESSAGE = "exception.message";
    exports.ATTR_EXCEPTION_STACKTRACE = "exception.stacktrace";
    exports.ATTR_EXCEPTION_TYPE = "exception.type";
    var ATTR_HTTP_REQUEST_HEADER = /* @__PURE__ */ __name((key) => `http.request.header.${key}`, "ATTR_HTTP_REQUEST_HEADER");
    exports.ATTR_HTTP_REQUEST_HEADER = ATTR_HTTP_REQUEST_HEADER;
    exports.ATTR_HTTP_REQUEST_METHOD = "http.request.method";
    exports.HTTP_REQUEST_METHOD_VALUE_OTHER = "_OTHER";
    exports.HTTP_REQUEST_METHOD_VALUE_CONNECT = "CONNECT";
    exports.HTTP_REQUEST_METHOD_VALUE_DELETE = "DELETE";
    exports.HTTP_REQUEST_METHOD_VALUE_GET = "GET";
    exports.HTTP_REQUEST_METHOD_VALUE_HEAD = "HEAD";
    exports.HTTP_REQUEST_METHOD_VALUE_OPTIONS = "OPTIONS";
    exports.HTTP_REQUEST_METHOD_VALUE_PATCH = "PATCH";
    exports.HTTP_REQUEST_METHOD_VALUE_POST = "POST";
    exports.HTTP_REQUEST_METHOD_VALUE_PUT = "PUT";
    exports.HTTP_REQUEST_METHOD_VALUE_TRACE = "TRACE";
    exports.ATTR_HTTP_REQUEST_METHOD_ORIGINAL = "http.request.method_original";
    exports.ATTR_HTTP_REQUEST_RESEND_COUNT = "http.request.resend_count";
    var ATTR_HTTP_RESPONSE_HEADER = /* @__PURE__ */ __name((key) => `http.response.header.${key}`, "ATTR_HTTP_RESPONSE_HEADER");
    exports.ATTR_HTTP_RESPONSE_HEADER = ATTR_HTTP_RESPONSE_HEADER;
    exports.ATTR_HTTP_RESPONSE_STATUS_CODE = "http.response.status_code";
    exports.ATTR_HTTP_ROUTE = "http.route";
    exports.ATTR_JVM_GC_ACTION = "jvm.gc.action";
    exports.ATTR_JVM_GC_NAME = "jvm.gc.name";
    exports.ATTR_JVM_MEMORY_POOL_NAME = "jvm.memory.pool.name";
    exports.ATTR_JVM_MEMORY_TYPE = "jvm.memory.type";
    exports.JVM_MEMORY_TYPE_VALUE_HEAP = "heap";
    exports.JVM_MEMORY_TYPE_VALUE_NON_HEAP = "non_heap";
    exports.ATTR_JVM_THREAD_DAEMON = "jvm.thread.daemon";
    exports.ATTR_JVM_THREAD_STATE = "jvm.thread.state";
    exports.JVM_THREAD_STATE_VALUE_BLOCKED = "blocked";
    exports.JVM_THREAD_STATE_VALUE_NEW = "new";
    exports.JVM_THREAD_STATE_VALUE_RUNNABLE = "runnable";
    exports.JVM_THREAD_STATE_VALUE_TERMINATED = "terminated";
    exports.JVM_THREAD_STATE_VALUE_TIMED_WAITING = "timed_waiting";
    exports.JVM_THREAD_STATE_VALUE_WAITING = "waiting";
    exports.ATTR_NETWORK_LOCAL_ADDRESS = "network.local.address";
    exports.ATTR_NETWORK_LOCAL_PORT = "network.local.port";
    exports.ATTR_NETWORK_PEER_ADDRESS = "network.peer.address";
    exports.ATTR_NETWORK_PEER_PORT = "network.peer.port";
    exports.ATTR_NETWORK_PROTOCOL_NAME = "network.protocol.name";
    exports.ATTR_NETWORK_PROTOCOL_VERSION = "network.protocol.version";
    exports.ATTR_NETWORK_TRANSPORT = "network.transport";
    exports.NETWORK_TRANSPORT_VALUE_PIPE = "pipe";
    exports.NETWORK_TRANSPORT_VALUE_QUIC = "quic";
    exports.NETWORK_TRANSPORT_VALUE_TCP = "tcp";
    exports.NETWORK_TRANSPORT_VALUE_UDP = "udp";
    exports.NETWORK_TRANSPORT_VALUE_UNIX = "unix";
    exports.ATTR_NETWORK_TYPE = "network.type";
    exports.NETWORK_TYPE_VALUE_IPV4 = "ipv4";
    exports.NETWORK_TYPE_VALUE_IPV6 = "ipv6";
    exports.ATTR_OTEL_SCOPE_NAME = "otel.scope.name";
    exports.ATTR_OTEL_SCOPE_VERSION = "otel.scope.version";
    exports.ATTR_OTEL_STATUS_CODE = "otel.status_code";
    exports.OTEL_STATUS_CODE_VALUE_ERROR = "ERROR";
    exports.OTEL_STATUS_CODE_VALUE_OK = "OK";
    exports.ATTR_OTEL_STATUS_DESCRIPTION = "otel.status_description";
    exports.ATTR_SERVER_ADDRESS = "server.address";
    exports.ATTR_SERVER_PORT = "server.port";
    exports.ATTR_SERVICE_NAME = "service.name";
    exports.ATTR_SERVICE_VERSION = "service.version";
    exports.ATTR_SIGNALR_CONNECTION_STATUS = "signalr.connection.status";
    exports.SIGNALR_CONNECTION_STATUS_VALUE_APP_SHUTDOWN = "app_shutdown";
    exports.SIGNALR_CONNECTION_STATUS_VALUE_NORMAL_CLOSURE = "normal_closure";
    exports.SIGNALR_CONNECTION_STATUS_VALUE_TIMEOUT = "timeout";
    exports.ATTR_SIGNALR_TRANSPORT = "signalr.transport";
    exports.SIGNALR_TRANSPORT_VALUE_LONG_POLLING = "long_polling";
    exports.SIGNALR_TRANSPORT_VALUE_SERVER_SENT_EVENTS = "server_sent_events";
    exports.SIGNALR_TRANSPORT_VALUE_WEB_SOCKETS = "web_sockets";
    exports.ATTR_TELEMETRY_SDK_LANGUAGE = "telemetry.sdk.language";
    exports.TELEMETRY_SDK_LANGUAGE_VALUE_CPP = "cpp";
    exports.TELEMETRY_SDK_LANGUAGE_VALUE_DOTNET = "dotnet";
    exports.TELEMETRY_SDK_LANGUAGE_VALUE_ERLANG = "erlang";
    exports.TELEMETRY_SDK_LANGUAGE_VALUE_GO = "go";
    exports.TELEMETRY_SDK_LANGUAGE_VALUE_JAVA = "java";
    exports.TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS = "nodejs";
    exports.TELEMETRY_SDK_LANGUAGE_VALUE_PHP = "php";
    exports.TELEMETRY_SDK_LANGUAGE_VALUE_PYTHON = "python";
    exports.TELEMETRY_SDK_LANGUAGE_VALUE_RUBY = "ruby";
    exports.TELEMETRY_SDK_LANGUAGE_VALUE_RUST = "rust";
    exports.TELEMETRY_SDK_LANGUAGE_VALUE_SWIFT = "swift";
    exports.TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS = "webjs";
    exports.ATTR_TELEMETRY_SDK_NAME = "telemetry.sdk.name";
    exports.ATTR_TELEMETRY_SDK_VERSION = "telemetry.sdk.version";
    exports.ATTR_URL_FRAGMENT = "url.fragment";
    exports.ATTR_URL_FULL = "url.full";
    exports.ATTR_URL_PATH = "url.path";
    exports.ATTR_URL_QUERY = "url.query";
    exports.ATTR_URL_SCHEME = "url.scheme";
    exports.ATTR_USER_AGENT_ORIGINAL = "user_agent.original";
  }
});

// node_modules/@opentelemetry/semantic-conventions/build/src/stable_metrics.js
var require_stable_metrics = __commonJS({
  "node_modules/@opentelemetry/semantic-conventions/build/src/stable_metrics.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.METRIC_SIGNALR_SERVER_ACTIVE_CONNECTIONS = exports.METRIC_KESTREL_UPGRADED_CONNECTIONS = exports.METRIC_KESTREL_TLS_HANDSHAKE_DURATION = exports.METRIC_KESTREL_REJECTED_CONNECTIONS = exports.METRIC_KESTREL_QUEUED_REQUESTS = exports.METRIC_KESTREL_QUEUED_CONNECTIONS = exports.METRIC_KESTREL_CONNECTION_DURATION = exports.METRIC_KESTREL_ACTIVE_TLS_HANDSHAKES = exports.METRIC_KESTREL_ACTIVE_CONNECTIONS = exports.METRIC_JVM_THREAD_COUNT = exports.METRIC_JVM_MEMORY_USED_AFTER_LAST_GC = exports.METRIC_JVM_MEMORY_USED = exports.METRIC_JVM_MEMORY_LIMIT = exports.METRIC_JVM_MEMORY_COMMITTED = exports.METRIC_JVM_GC_DURATION = exports.METRIC_JVM_CPU_TIME = exports.METRIC_JVM_CPU_RECENT_UTILIZATION = exports.METRIC_JVM_CPU_COUNT = exports.METRIC_JVM_CLASS_UNLOADED = exports.METRIC_JVM_CLASS_LOADED = exports.METRIC_JVM_CLASS_COUNT = exports.METRIC_HTTP_SERVER_REQUEST_DURATION = exports.METRIC_HTTP_CLIENT_REQUEST_DURATION = exports.METRIC_DOTNET_TIMER_COUNT = exports.METRIC_DOTNET_THREAD_POOL_WORK_ITEM_COUNT = exports.METRIC_DOTNET_THREAD_POOL_THREAD_COUNT = exports.METRIC_DOTNET_THREAD_POOL_QUEUE_LENGTH = exports.METRIC_DOTNET_PROCESS_MEMORY_WORKING_SET = exports.METRIC_DOTNET_PROCESS_CPU_TIME = exports.METRIC_DOTNET_PROCESS_CPU_COUNT = exports.METRIC_DOTNET_MONITOR_LOCK_CONTENTIONS = exports.METRIC_DOTNET_JIT_COMPILED_METHODS = exports.METRIC_DOTNET_JIT_COMPILED_IL_SIZE = exports.METRIC_DOTNET_JIT_COMPILATION_TIME = exports.METRIC_DOTNET_GC_PAUSE_TIME = exports.METRIC_DOTNET_GC_LAST_COLLECTION_MEMORY_COMMITTED_SIZE = exports.METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_SIZE = exports.METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_FRAGMENTATION_SIZE = exports.METRIC_DOTNET_GC_HEAP_TOTAL_ALLOCATED = exports.METRIC_DOTNET_GC_COLLECTIONS = exports.METRIC_DOTNET_EXCEPTIONS = exports.METRIC_DOTNET_ASSEMBLY_COUNT = exports.METRIC_DB_CLIENT_OPERATION_DURATION = exports.METRIC_ASPNETCORE_ROUTING_MATCH_ATTEMPTS = exports.METRIC_ASPNETCORE_RATE_LIMITING_REQUESTS = exports.METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_LEASE_DURATION = exports.METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_TIME_IN_QUEUE = exports.METRIC_ASPNETCORE_RATE_LIMITING_QUEUED_REQUESTS = exports.METRIC_ASPNETCORE_RATE_LIMITING_ACTIVE_REQUEST_LEASES = exports.METRIC_ASPNETCORE_DIAGNOSTICS_EXCEPTIONS = void 0;
    exports.METRIC_SIGNALR_SERVER_CONNECTION_DURATION = void 0;
    exports.METRIC_ASPNETCORE_DIAGNOSTICS_EXCEPTIONS = "aspnetcore.diagnostics.exceptions";
    exports.METRIC_ASPNETCORE_RATE_LIMITING_ACTIVE_REQUEST_LEASES = "aspnetcore.rate_limiting.active_request_leases";
    exports.METRIC_ASPNETCORE_RATE_LIMITING_QUEUED_REQUESTS = "aspnetcore.rate_limiting.queued_requests";
    exports.METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_TIME_IN_QUEUE = "aspnetcore.rate_limiting.request.time_in_queue";
    exports.METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_LEASE_DURATION = "aspnetcore.rate_limiting.request_lease.duration";
    exports.METRIC_ASPNETCORE_RATE_LIMITING_REQUESTS = "aspnetcore.rate_limiting.requests";
    exports.METRIC_ASPNETCORE_ROUTING_MATCH_ATTEMPTS = "aspnetcore.routing.match_attempts";
    exports.METRIC_DB_CLIENT_OPERATION_DURATION = "db.client.operation.duration";
    exports.METRIC_DOTNET_ASSEMBLY_COUNT = "dotnet.assembly.count";
    exports.METRIC_DOTNET_EXCEPTIONS = "dotnet.exceptions";
    exports.METRIC_DOTNET_GC_COLLECTIONS = "dotnet.gc.collections";
    exports.METRIC_DOTNET_GC_HEAP_TOTAL_ALLOCATED = "dotnet.gc.heap.total_allocated";
    exports.METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_FRAGMENTATION_SIZE = "dotnet.gc.last_collection.heap.fragmentation.size";
    exports.METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_SIZE = "dotnet.gc.last_collection.heap.size";
    exports.METRIC_DOTNET_GC_LAST_COLLECTION_MEMORY_COMMITTED_SIZE = "dotnet.gc.last_collection.memory.committed_size";
    exports.METRIC_DOTNET_GC_PAUSE_TIME = "dotnet.gc.pause.time";
    exports.METRIC_DOTNET_JIT_COMPILATION_TIME = "dotnet.jit.compilation.time";
    exports.METRIC_DOTNET_JIT_COMPILED_IL_SIZE = "dotnet.jit.compiled_il.size";
    exports.METRIC_DOTNET_JIT_COMPILED_METHODS = "dotnet.jit.compiled_methods";
    exports.METRIC_DOTNET_MONITOR_LOCK_CONTENTIONS = "dotnet.monitor.lock_contentions";
    exports.METRIC_DOTNET_PROCESS_CPU_COUNT = "dotnet.process.cpu.count";
    exports.METRIC_DOTNET_PROCESS_CPU_TIME = "dotnet.process.cpu.time";
    exports.METRIC_DOTNET_PROCESS_MEMORY_WORKING_SET = "dotnet.process.memory.working_set";
    exports.METRIC_DOTNET_THREAD_POOL_QUEUE_LENGTH = "dotnet.thread_pool.queue.length";
    exports.METRIC_DOTNET_THREAD_POOL_THREAD_COUNT = "dotnet.thread_pool.thread.count";
    exports.METRIC_DOTNET_THREAD_POOL_WORK_ITEM_COUNT = "dotnet.thread_pool.work_item.count";
    exports.METRIC_DOTNET_TIMER_COUNT = "dotnet.timer.count";
    exports.METRIC_HTTP_CLIENT_REQUEST_DURATION = "http.client.request.duration";
    exports.METRIC_HTTP_SERVER_REQUEST_DURATION = "http.server.request.duration";
    exports.METRIC_JVM_CLASS_COUNT = "jvm.class.count";
    exports.METRIC_JVM_CLASS_LOADED = "jvm.class.loaded";
    exports.METRIC_JVM_CLASS_UNLOADED = "jvm.class.unloaded";
    exports.METRIC_JVM_CPU_COUNT = "jvm.cpu.count";
    exports.METRIC_JVM_CPU_RECENT_UTILIZATION = "jvm.cpu.recent_utilization";
    exports.METRIC_JVM_CPU_TIME = "jvm.cpu.time";
    exports.METRIC_JVM_GC_DURATION = "jvm.gc.duration";
    exports.METRIC_JVM_MEMORY_COMMITTED = "jvm.memory.committed";
    exports.METRIC_JVM_MEMORY_LIMIT = "jvm.memory.limit";
    exports.METRIC_JVM_MEMORY_USED = "jvm.memory.used";
    exports.METRIC_JVM_MEMORY_USED_AFTER_LAST_GC = "jvm.memory.used_after_last_gc";
    exports.METRIC_JVM_THREAD_COUNT = "jvm.thread.count";
    exports.METRIC_KESTREL_ACTIVE_CONNECTIONS = "kestrel.active_connections";
    exports.METRIC_KESTREL_ACTIVE_TLS_HANDSHAKES = "kestrel.active_tls_handshakes";
    exports.METRIC_KESTREL_CONNECTION_DURATION = "kestrel.connection.duration";
    exports.METRIC_KESTREL_QUEUED_CONNECTIONS = "kestrel.queued_connections";
    exports.METRIC_KESTREL_QUEUED_REQUESTS = "kestrel.queued_requests";
    exports.METRIC_KESTREL_REJECTED_CONNECTIONS = "kestrel.rejected_connections";
    exports.METRIC_KESTREL_TLS_HANDSHAKE_DURATION = "kestrel.tls_handshake.duration";
    exports.METRIC_KESTREL_UPGRADED_CONNECTIONS = "kestrel.upgraded_connections";
    exports.METRIC_SIGNALR_SERVER_ACTIVE_CONNECTIONS = "signalr.server.active_connections";
    exports.METRIC_SIGNALR_SERVER_CONNECTION_DURATION = "signalr.server.connection.duration";
  }
});

// node_modules/@opentelemetry/semantic-conventions/build/src/stable_events.js
var require_stable_events = __commonJS({
  "node_modules/@opentelemetry/semantic-conventions/build/src/stable_events.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EVENT_EXCEPTION = void 0;
    exports.EVENT_EXCEPTION = "exception";
  }
});

// node_modules/@opentelemetry/semantic-conventions/build/src/index.js
var require_src2 = __commonJS({
  "node_modules/@opentelemetry/semantic-conventions/build/src/index.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: /* @__PURE__ */ __name(function() {
          return m[k];
        }, "get") };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_trace2(), exports);
    __exportStar(require_resource(), exports);
    __exportStar(require_stable_attributes(), exports);
    __exportStar(require_stable_metrics(), exports);
    __exportStar(require_stable_events(), exports);
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/build/src/OTLPExporterBase.js
var require_OTLPExporterBase = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/build/src/OTLPExporterBase.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OTLPExporterBase = void 0;
    var OTLPExporterBase = class {
      static {
        __name(this, "OTLPExporterBase");
      }
      _delegate;
      constructor(_delegate) {
        this._delegate = _delegate;
      }
      /**
       * Export items.
       * @param items
       * @param resultCallback
       */
      export(items, resultCallback) {
        this._delegate.export(items, resultCallback);
      }
      forceFlush() {
        return this._delegate.forceFlush();
      }
      shutdown() {
        return this._delegate.shutdown();
      }
    };
    exports.OTLPExporterBase = OTLPExporterBase;
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/build/src/types.js
var require_types2 = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/build/src/types.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OTLPExporterError = void 0;
    var OTLPExporterError2 = class extends Error {
      static {
        __name(this, "OTLPExporterError");
      }
      code;
      name = "OTLPExporterError";
      data;
      constructor(message, code, data) {
        super(message);
        this.data = data;
        this.code = code;
      }
    };
    exports.OTLPExporterError = OTLPExporterError2;
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/build/src/configuration/shared-configuration.js
var require_shared_configuration = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/build/src/configuration/shared-configuration.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSharedConfigurationDefaults = exports.mergeOtlpSharedConfigurationWithDefaults = exports.wrapStaticHeadersInFunction = exports.validateTimeoutMillis = void 0;
    function validateTimeoutMillis(timeoutMillis) {
      if (Number.isFinite(timeoutMillis) && timeoutMillis > 0) {
        return timeoutMillis;
      }
      throw new Error(`Configuration: timeoutMillis is invalid, expected number greater than 0 (actual: '${timeoutMillis}')`);
    }
    __name(validateTimeoutMillis, "validateTimeoutMillis");
    exports.validateTimeoutMillis = validateTimeoutMillis;
    function wrapStaticHeadersInFunction(headers) {
      if (headers == null) {
        return void 0;
      }
      return () => headers;
    }
    __name(wrapStaticHeadersInFunction, "wrapStaticHeadersInFunction");
    exports.wrapStaticHeadersInFunction = wrapStaticHeadersInFunction;
    function mergeOtlpSharedConfigurationWithDefaults(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration) {
      return {
        timeoutMillis: validateTimeoutMillis(userProvidedConfiguration.timeoutMillis ?? fallbackConfiguration.timeoutMillis ?? defaultConfiguration.timeoutMillis),
        concurrencyLimit: userProvidedConfiguration.concurrencyLimit ?? fallbackConfiguration.concurrencyLimit ?? defaultConfiguration.concurrencyLimit,
        compression: userProvidedConfiguration.compression ?? fallbackConfiguration.compression ?? defaultConfiguration.compression
      };
    }
    __name(mergeOtlpSharedConfigurationWithDefaults, "mergeOtlpSharedConfigurationWithDefaults");
    exports.mergeOtlpSharedConfigurationWithDefaults = mergeOtlpSharedConfigurationWithDefaults;
    function getSharedConfigurationDefaults() {
      return {
        timeoutMillis: 1e4,
        concurrencyLimit: 30,
        compression: "none"
      };
    }
    __name(getSharedConfigurationDefaults, "getSharedConfigurationDefaults");
    exports.getSharedConfigurationDefaults = getSharedConfigurationDefaults;
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/build/src/configuration/legacy-node-configuration.js
var require_legacy_node_configuration = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/build/src/configuration/legacy-node-configuration.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CompressionAlgorithm = void 0;
    var CompressionAlgorithm;
    (function(CompressionAlgorithm2) {
      CompressionAlgorithm2["NONE"] = "none";
      CompressionAlgorithm2["GZIP"] = "gzip";
    })(CompressionAlgorithm = exports.CompressionAlgorithm || (exports.CompressionAlgorithm = {}));
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/build/src/bounded-queue-export-promise-handler.js
var require_bounded_queue_export_promise_handler = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/build/src/bounded-queue-export-promise-handler.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createBoundedQueueExportPromiseHandler = void 0;
    var BoundedQueueExportPromiseHandler = class {
      static {
        __name(this, "BoundedQueueExportPromiseHandler");
      }
      _concurrencyLimit;
      _sendingPromises = [];
      /**
       * @param concurrencyLimit maximum promises allowed in a queue at the same time.
       */
      constructor(concurrencyLimit) {
        this._concurrencyLimit = concurrencyLimit;
      }
      pushPromise(promise) {
        if (this.hasReachedLimit()) {
          throw new Error("Concurrency Limit reached");
        }
        this._sendingPromises.push(promise);
        const popPromise = /* @__PURE__ */ __name(() => {
          const index = this._sendingPromises.indexOf(promise);
          this._sendingPromises.splice(index, 1);
        }, "popPromise");
        promise.then(popPromise, popPromise);
      }
      hasReachedLimit() {
        return this._sendingPromises.length >= this._concurrencyLimit;
      }
      async awaitAll() {
        await Promise.all(this._sendingPromises);
      }
    };
    function createBoundedQueueExportPromiseHandler(options) {
      return new BoundedQueueExportPromiseHandler(options.concurrencyLimit);
    }
    __name(createBoundedQueueExportPromiseHandler, "createBoundedQueueExportPromiseHandler");
    exports.createBoundedQueueExportPromiseHandler = createBoundedQueueExportPromiseHandler;
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/trace/suppress-tracing.js
var require_suppress_tracing = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/trace/suppress-tracing.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isTracingSuppressed = exports.unsuppressTracing = exports.suppressTracing = void 0;
    var api_1 = require_src();
    var SUPPRESS_TRACING_KEY2 = (0, api_1.createContextKey)("OpenTelemetry SDK Context Key SUPPRESS_TRACING");
    function suppressTracing(context5) {
      return context5.setValue(SUPPRESS_TRACING_KEY2, true);
    }
    __name(suppressTracing, "suppressTracing");
    exports.suppressTracing = suppressTracing;
    function unsuppressTracing(context5) {
      return context5.deleteValue(SUPPRESS_TRACING_KEY2);
    }
    __name(unsuppressTracing, "unsuppressTracing");
    exports.unsuppressTracing = unsuppressTracing;
    function isTracingSuppressed2(context5) {
      return context5.getValue(SUPPRESS_TRACING_KEY2) === true;
    }
    __name(isTracingSuppressed2, "isTracingSuppressed");
    exports.isTracingSuppressed = isTracingSuppressed2;
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/baggage/constants.js
var require_constants = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/baggage/constants.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BAGGAGE_MAX_TOTAL_LENGTH = exports.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS = exports.BAGGAGE_MAX_NAME_VALUE_PAIRS = exports.BAGGAGE_HEADER = exports.BAGGAGE_ITEMS_SEPARATOR = exports.BAGGAGE_PROPERTIES_SEPARATOR = exports.BAGGAGE_KEY_PAIR_SEPARATOR = void 0;
    exports.BAGGAGE_KEY_PAIR_SEPARATOR = "=";
    exports.BAGGAGE_PROPERTIES_SEPARATOR = ";";
    exports.BAGGAGE_ITEMS_SEPARATOR = ",";
    exports.BAGGAGE_HEADER = "baggage";
    exports.BAGGAGE_MAX_NAME_VALUE_PAIRS = 180;
    exports.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS = 4096;
    exports.BAGGAGE_MAX_TOTAL_LENGTH = 8192;
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/baggage/utils.js
var require_utils4 = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/baggage/utils.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseKeyPairsIntoRecord = exports.parsePairKeyValue = exports.getKeyPairs = exports.serializeKeyPairs = void 0;
    var api_1 = require_src();
    var constants_1 = require_constants();
    function serializeKeyPairs(keyPairs) {
      return keyPairs.reduce((hValue, current) => {
        const value = `${hValue}${hValue !== "" ? constants_1.BAGGAGE_ITEMS_SEPARATOR : ""}${current}`;
        return value.length > constants_1.BAGGAGE_MAX_TOTAL_LENGTH ? hValue : value;
      }, "");
    }
    __name(serializeKeyPairs, "serializeKeyPairs");
    exports.serializeKeyPairs = serializeKeyPairs;
    function getKeyPairs(baggage) {
      return baggage.getAllEntries().map(([key, value]) => {
        let entry = `${encodeURIComponent(key)}=${encodeURIComponent(value.value)}`;
        if (value.metadata !== void 0) {
          entry += constants_1.BAGGAGE_PROPERTIES_SEPARATOR + value.metadata.toString();
        }
        return entry;
      });
    }
    __name(getKeyPairs, "getKeyPairs");
    exports.getKeyPairs = getKeyPairs;
    function parsePairKeyValue(entry) {
      const valueProps = entry.split(constants_1.BAGGAGE_PROPERTIES_SEPARATOR);
      if (valueProps.length <= 0)
        return;
      const keyPairPart = valueProps.shift();
      if (!keyPairPart)
        return;
      const separatorIndex = keyPairPart.indexOf(constants_1.BAGGAGE_KEY_PAIR_SEPARATOR);
      if (separatorIndex <= 0)
        return;
      const key = decodeURIComponent(keyPairPart.substring(0, separatorIndex).trim());
      const value = decodeURIComponent(keyPairPart.substring(separatorIndex + 1).trim());
      let metadata;
      if (valueProps.length > 0) {
        metadata = (0, api_1.baggageEntryMetadataFromString)(valueProps.join(constants_1.BAGGAGE_PROPERTIES_SEPARATOR));
      }
      return { key, value, metadata };
    }
    __name(parsePairKeyValue, "parsePairKeyValue");
    exports.parsePairKeyValue = parsePairKeyValue;
    function parseKeyPairsIntoRecord(value) {
      if (typeof value !== "string" || value.length === 0)
        return {};
      return value.split(constants_1.BAGGAGE_ITEMS_SEPARATOR).map((entry) => {
        return parsePairKeyValue(entry);
      }).filter((keyPair) => keyPair !== void 0 && keyPair.value.length > 0).reduce((headers, keyPair) => {
        headers[keyPair.key] = keyPair.value;
        return headers;
      }, {});
    }
    __name(parseKeyPairsIntoRecord, "parseKeyPairsIntoRecord");
    exports.parseKeyPairsIntoRecord = parseKeyPairsIntoRecord;
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/baggage/propagation/W3CBaggagePropagator.js
var require_W3CBaggagePropagator = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/baggage/propagation/W3CBaggagePropagator.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.W3CBaggagePropagator = void 0;
    var api_1 = require_src();
    var suppress_tracing_1 = require_suppress_tracing();
    var constants_1 = require_constants();
    var utils_1 = require_utils4();
    var W3CBaggagePropagator = class {
      static {
        __name(this, "W3CBaggagePropagator");
      }
      inject(context5, carrier, setter) {
        const baggage = api_1.propagation.getBaggage(context5);
        if (!baggage || (0, suppress_tracing_1.isTracingSuppressed)(context5))
          return;
        const keyPairs = (0, utils_1.getKeyPairs)(baggage).filter((pair) => {
          return pair.length <= constants_1.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS;
        }).slice(0, constants_1.BAGGAGE_MAX_NAME_VALUE_PAIRS);
        const headerValue = (0, utils_1.serializeKeyPairs)(keyPairs);
        if (headerValue.length > 0) {
          setter.set(carrier, constants_1.BAGGAGE_HEADER, headerValue);
        }
      }
      extract(context5, carrier, getter) {
        const headerValue = getter.get(carrier, constants_1.BAGGAGE_HEADER);
        const baggageString = Array.isArray(headerValue) ? headerValue.join(constants_1.BAGGAGE_ITEMS_SEPARATOR) : headerValue;
        if (!baggageString)
          return context5;
        const baggage = {};
        if (baggageString.length === 0) {
          return context5;
        }
        const pairs = baggageString.split(constants_1.BAGGAGE_ITEMS_SEPARATOR);
        pairs.forEach((entry) => {
          const keyPair = (0, utils_1.parsePairKeyValue)(entry);
          if (keyPair) {
            const baggageEntry = { value: keyPair.value };
            if (keyPair.metadata) {
              baggageEntry.metadata = keyPair.metadata;
            }
            baggage[keyPair.key] = baggageEntry;
          }
        });
        if (Object.entries(baggage).length === 0) {
          return context5;
        }
        return api_1.propagation.setBaggage(context5, api_1.propagation.createBaggage(baggage));
      }
      fields() {
        return [constants_1.BAGGAGE_HEADER];
      }
    };
    exports.W3CBaggagePropagator = W3CBaggagePropagator;
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/common/anchored-clock.js
var require_anchored_clock = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/common/anchored-clock.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AnchoredClock = void 0;
    var AnchoredClock = class {
      static {
        __name(this, "AnchoredClock");
      }
      _monotonicClock;
      _epochMillis;
      _performanceMillis;
      /**
       * Create a new AnchoredClock anchored to the current time returned by systemClock.
       *
       * @param systemClock should be a clock that returns the number of milliseconds since January 1 1970 such as Date
       * @param monotonicClock should be a clock that counts milliseconds monotonically such as window.performance or perf_hooks.performance
       */
      constructor(systemClock, monotonicClock) {
        this._monotonicClock = monotonicClock;
        this._epochMillis = systemClock.now();
        this._performanceMillis = monotonicClock.now();
      }
      /**
       * Returns the current time by adding the number of milliseconds since the
       * AnchoredClock was created to the creation epoch time
       */
      now() {
        const delta = this._monotonicClock.now() - this._performanceMillis;
        return this._epochMillis + delta;
      }
    };
    exports.AnchoredClock = AnchoredClock;
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/common/attributes.js
var require_attributes = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/common/attributes.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isAttributeValue = exports.isAttributeKey = exports.sanitizeAttributes = void 0;
    var api_1 = require_src();
    function sanitizeAttributes2(attributes) {
      const out = {};
      if (typeof attributes !== "object" || attributes == null) {
        return out;
      }
      for (const [key, val] of Object.entries(attributes)) {
        if (!isAttributeKey3(key)) {
          api_1.diag.warn(`Invalid attribute key: ${key}`);
          continue;
        }
        if (!isAttributeValue2(val)) {
          api_1.diag.warn(`Invalid attribute value set for key: ${key}`);
          continue;
        }
        if (Array.isArray(val)) {
          out[key] = val.slice();
        } else {
          out[key] = val;
        }
      }
      return out;
    }
    __name(sanitizeAttributes2, "sanitizeAttributes");
    exports.sanitizeAttributes = sanitizeAttributes2;
    function isAttributeKey3(key) {
      return typeof key === "string" && key.length > 0;
    }
    __name(isAttributeKey3, "isAttributeKey");
    exports.isAttributeKey = isAttributeKey3;
    function isAttributeValue2(val) {
      if (val == null) {
        return true;
      }
      if (Array.isArray(val)) {
        return isHomogeneousAttributeValueArray2(val);
      }
      return isValidPrimitiveAttributeValue(val);
    }
    __name(isAttributeValue2, "isAttributeValue");
    exports.isAttributeValue = isAttributeValue2;
    function isHomogeneousAttributeValueArray2(arr) {
      let type;
      for (const element of arr) {
        if (element == null)
          continue;
        if (!type) {
          if (isValidPrimitiveAttributeValue(element)) {
            type = typeof element;
            continue;
          }
          return false;
        }
        if (typeof element === type) {
          continue;
        }
        return false;
      }
      return true;
    }
    __name(isHomogeneousAttributeValueArray2, "isHomogeneousAttributeValueArray");
    function isValidPrimitiveAttributeValue(val) {
      switch (typeof val) {
        case "number":
        case "boolean":
        case "string":
          return true;
      }
      return false;
    }
    __name(isValidPrimitiveAttributeValue, "isValidPrimitiveAttributeValue");
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/common/logging-error-handler.js
var require_logging_error_handler = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/common/logging-error-handler.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.loggingErrorHandler = void 0;
    var api_1 = require_src();
    function loggingErrorHandler2() {
      return (ex) => {
        api_1.diag.error(stringifyException2(ex));
      };
    }
    __name(loggingErrorHandler2, "loggingErrorHandler");
    exports.loggingErrorHandler = loggingErrorHandler2;
    function stringifyException2(ex) {
      if (typeof ex === "string") {
        return ex;
      } else {
        return JSON.stringify(flattenException2(ex));
      }
    }
    __name(stringifyException2, "stringifyException");
    function flattenException2(ex) {
      const result = {};
      let current = ex;
      while (current !== null) {
        Object.getOwnPropertyNames(current).forEach((propertyName) => {
          if (result[propertyName])
            return;
          const value = current[propertyName];
          if (value) {
            result[propertyName] = String(value);
          }
        });
        current = Object.getPrototypeOf(current);
      }
      return result;
    }
    __name(flattenException2, "flattenException");
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/common/global-error-handler.js
var require_global_error_handler = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/common/global-error-handler.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.globalErrorHandler = exports.setGlobalErrorHandler = void 0;
    var logging_error_handler_1 = require_logging_error_handler();
    var delegateHandler2 = (0, logging_error_handler_1.loggingErrorHandler)();
    function setGlobalErrorHandler2(handler) {
      delegateHandler2 = handler;
    }
    __name(setGlobalErrorHandler2, "setGlobalErrorHandler");
    exports.setGlobalErrorHandler = setGlobalErrorHandler2;
    function globalErrorHandler2(ex) {
      try {
        delegateHandler2(ex);
      } catch {
      }
    }
    __name(globalErrorHandler2, "globalErrorHandler");
    exports.globalErrorHandler = globalErrorHandler2;
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/platform/browser/environment.js
var require_environment = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/platform/browser/environment.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getStringListFromEnv = exports.getNumberFromEnv = exports.getBooleanFromEnv = exports.getStringFromEnv = void 0;
    function getStringFromEnv(_) {
      return void 0;
    }
    __name(getStringFromEnv, "getStringFromEnv");
    exports.getStringFromEnv = getStringFromEnv;
    function getBooleanFromEnv(_) {
      return void 0;
    }
    __name(getBooleanFromEnv, "getBooleanFromEnv");
    exports.getBooleanFromEnv = getBooleanFromEnv;
    function getNumberFromEnv(_) {
      return void 0;
    }
    __name(getNumberFromEnv, "getNumberFromEnv");
    exports.getNumberFromEnv = getNumberFromEnv;
    function getStringListFromEnv(_) {
      return void 0;
    }
    __name(getStringListFromEnv, "getStringListFromEnv");
    exports.getStringListFromEnv = getStringListFromEnv;
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/platform/browser/globalThis.js
var require_globalThis2 = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/platform/browser/globalThis.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._globalThis = void 0;
    exports._globalThis = typeof globalThis === "object" ? globalThis : typeof self === "object" ? self : typeof window === "object" ? window : typeof global === "object" ? global : {};
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/platform/browser/performance.js
var require_performance = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/platform/browser/performance.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.otperformance = void 0;
    exports.otperformance = performance;
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/version.js
var require_version2 = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/version.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VERSION = void 0;
    exports.VERSION = "2.0.0";
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/platform/browser/sdk-info.js
var require_sdk_info = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/platform/browser/sdk-info.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SDK_INFO = void 0;
    var version_1 = require_version2();
    var semantic_conventions_1 = require_src2();
    exports.SDK_INFO = {
      [semantic_conventions_1.SEMRESATTRS_TELEMETRY_SDK_NAME]: "opentelemetry",
      [semantic_conventions_1.SEMRESATTRS_PROCESS_RUNTIME_NAME]: "browser",
      [semantic_conventions_1.SEMRESATTRS_TELEMETRY_SDK_LANGUAGE]: semantic_conventions_1.TELEMETRYSDKLANGUAGEVALUES_WEBJS,
      [semantic_conventions_1.SEMRESATTRS_TELEMETRY_SDK_VERSION]: version_1.VERSION
    };
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/platform/browser/timer-util.js
var require_timer_util = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/platform/browser/timer-util.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.unrefTimer = void 0;
    function unrefTimer(_timer) {
    }
    __name(unrefTimer, "unrefTimer");
    exports.unrefTimer = unrefTimer;
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/platform/browser/index.js
var require_browser2 = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/platform/browser/index.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.unrefTimer = exports.SDK_INFO = exports.otperformance = exports._globalThis = exports.getStringListFromEnv = exports.getNumberFromEnv = exports.getBooleanFromEnv = exports.getStringFromEnv = void 0;
    var environment_1 = require_environment();
    Object.defineProperty(exports, "getStringFromEnv", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return environment_1.getStringFromEnv;
    }, "get") });
    Object.defineProperty(exports, "getBooleanFromEnv", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return environment_1.getBooleanFromEnv;
    }, "get") });
    Object.defineProperty(exports, "getNumberFromEnv", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return environment_1.getNumberFromEnv;
    }, "get") });
    Object.defineProperty(exports, "getStringListFromEnv", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return environment_1.getStringListFromEnv;
    }, "get") });
    var globalThis_1 = require_globalThis2();
    Object.defineProperty(exports, "_globalThis", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return globalThis_1._globalThis;
    }, "get") });
    var performance_1 = require_performance();
    Object.defineProperty(exports, "otperformance", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return performance_1.otperformance;
    }, "get") });
    var sdk_info_1 = require_sdk_info();
    Object.defineProperty(exports, "SDK_INFO", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return sdk_info_1.SDK_INFO;
    }, "get") });
    var timer_util_1 = require_timer_util();
    Object.defineProperty(exports, "unrefTimer", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return timer_util_1.unrefTimer;
    }, "get") });
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/common/time.js
var require_time = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/common/time.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.addHrTimes = exports.isTimeInput = exports.isTimeInputHrTime = exports.hrTimeToMicroseconds = exports.hrTimeToMilliseconds = exports.hrTimeToNanoseconds = exports.hrTimeToTimeStamp = exports.hrTimeDuration = exports.timeInputToHrTime = exports.hrTime = exports.getTimeOrigin = exports.millisToHrTime = void 0;
    var platform_1 = require_browser2();
    var NANOSECOND_DIGITS3 = 9;
    var NANOSECOND_DIGITS_IN_MILLIS3 = 6;
    var MILLISECONDS_TO_NANOSECONDS3 = Math.pow(10, NANOSECOND_DIGITS_IN_MILLIS3);
    var SECOND_TO_NANOSECONDS3 = Math.pow(10, NANOSECOND_DIGITS3);
    function millisToHrTime3(epochMillis) {
      const epochSeconds = epochMillis / 1e3;
      const seconds = Math.trunc(epochSeconds);
      const nanos = Math.round(epochMillis % 1e3 * MILLISECONDS_TO_NANOSECONDS3);
      return [seconds, nanos];
    }
    __name(millisToHrTime3, "millisToHrTime");
    exports.millisToHrTime = millisToHrTime3;
    function getTimeOrigin3() {
      let timeOrigin = platform_1.otperformance.timeOrigin;
      if (typeof timeOrigin !== "number") {
        const perf = platform_1.otperformance;
        timeOrigin = perf.timing && perf.timing.fetchStart;
      }
      return timeOrigin;
    }
    __name(getTimeOrigin3, "getTimeOrigin");
    exports.getTimeOrigin = getTimeOrigin3;
    function hrTime3(performanceNow) {
      const timeOrigin = millisToHrTime3(getTimeOrigin3());
      const now = millisToHrTime3(typeof performanceNow === "number" ? performanceNow : platform_1.otperformance.now());
      return addHrTimes3(timeOrigin, now);
    }
    __name(hrTime3, "hrTime");
    exports.hrTime = hrTime3;
    function timeInputToHrTime3(time3) {
      if (isTimeInputHrTime3(time3)) {
        return time3;
      } else if (typeof time3 === "number") {
        if (time3 < getTimeOrigin3()) {
          return hrTime3(time3);
        } else {
          return millisToHrTime3(time3);
        }
      } else if (time3 instanceof Date) {
        return millisToHrTime3(time3.getTime());
      } else {
        throw TypeError("Invalid input type");
      }
    }
    __name(timeInputToHrTime3, "timeInputToHrTime");
    exports.timeInputToHrTime = timeInputToHrTime3;
    function hrTimeDuration3(startTime, endTime) {
      let seconds = endTime[0] - startTime[0];
      let nanos = endTime[1] - startTime[1];
      if (nanos < 0) {
        seconds -= 1;
        nanos += SECOND_TO_NANOSECONDS3;
      }
      return [seconds, nanos];
    }
    __name(hrTimeDuration3, "hrTimeDuration");
    exports.hrTimeDuration = hrTimeDuration3;
    function hrTimeToTimeStamp3(time3) {
      const precision = NANOSECOND_DIGITS3;
      const tmp = `${"0".repeat(precision)}${time3[1]}Z`;
      const nanoString = tmp.substring(tmp.length - precision - 1);
      const date = new Date(time3[0] * 1e3).toISOString();
      return date.replace("000Z", nanoString);
    }
    __name(hrTimeToTimeStamp3, "hrTimeToTimeStamp");
    exports.hrTimeToTimeStamp = hrTimeToTimeStamp3;
    function hrTimeToNanoseconds3(time3) {
      return time3[0] * SECOND_TO_NANOSECONDS3 + time3[1];
    }
    __name(hrTimeToNanoseconds3, "hrTimeToNanoseconds");
    exports.hrTimeToNanoseconds = hrTimeToNanoseconds3;
    function hrTimeToMilliseconds3(time3) {
      return time3[0] * 1e3 + time3[1] / 1e6;
    }
    __name(hrTimeToMilliseconds3, "hrTimeToMilliseconds");
    exports.hrTimeToMilliseconds = hrTimeToMilliseconds3;
    function hrTimeToMicroseconds3(time3) {
      return time3[0] * 1e6 + time3[1] / 1e3;
    }
    __name(hrTimeToMicroseconds3, "hrTimeToMicroseconds");
    exports.hrTimeToMicroseconds = hrTimeToMicroseconds3;
    function isTimeInputHrTime3(value) {
      return Array.isArray(value) && value.length === 2 && typeof value[0] === "number" && typeof value[1] === "number";
    }
    __name(isTimeInputHrTime3, "isTimeInputHrTime");
    exports.isTimeInputHrTime = isTimeInputHrTime3;
    function isTimeInput3(value) {
      return isTimeInputHrTime3(value) || typeof value === "number" || value instanceof Date;
    }
    __name(isTimeInput3, "isTimeInput");
    exports.isTimeInput = isTimeInput3;
    function addHrTimes3(time1, time22) {
      const out = [time1[0] + time22[0], time1[1] + time22[1]];
      if (out[1] >= SECOND_TO_NANOSECONDS3) {
        out[1] -= SECOND_TO_NANOSECONDS3;
        out[0] += 1;
      }
      return out;
    }
    __name(addHrTimes3, "addHrTimes");
    exports.addHrTimes = addHrTimes3;
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/ExportResult.js
var require_ExportResult = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/ExportResult.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ExportResultCode = void 0;
    var ExportResultCode2;
    (function(ExportResultCode3) {
      ExportResultCode3[ExportResultCode3["SUCCESS"] = 0] = "SUCCESS";
      ExportResultCode3[ExportResultCode3["FAILED"] = 1] = "FAILED";
    })(ExportResultCode2 = exports.ExportResultCode || (exports.ExportResultCode = {}));
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/propagation/composite.js
var require_composite = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/propagation/composite.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CompositePropagator = void 0;
    var api_1 = require_src();
    var CompositePropagator = class {
      static {
        __name(this, "CompositePropagator");
      }
      _propagators;
      _fields;
      /**
       * Construct a composite propagator from a list of propagators.
       *
       * @param [config] Configuration object for composite propagator
       */
      constructor(config2 = {}) {
        this._propagators = config2.propagators ?? [];
        this._fields = Array.from(new Set(this._propagators.map((p) => typeof p.fields === "function" ? p.fields() : []).reduce((x, y) => x.concat(y), [])));
      }
      /**
       * Run each of the configured propagators with the given context and carrier.
       * Propagators are run in the order they are configured, so if multiple
       * propagators write the same carrier key, the propagator later in the list
       * will "win".
       *
       * @param context Context to inject
       * @param carrier Carrier into which context will be injected
       */
      inject(context5, carrier, setter) {
        for (const propagator of this._propagators) {
          try {
            propagator.inject(context5, carrier, setter);
          } catch (err) {
            api_1.diag.warn(`Failed to inject with ${propagator.constructor.name}. Err: ${err.message}`);
          }
        }
      }
      /**
       * Run each of the configured propagators with the given context and carrier.
       * Propagators are run in the order they are configured, so if multiple
       * propagators write the same context key, the propagator later in the list
       * will "win".
       *
       * @param context Context to add values to
       * @param carrier Carrier from which to extract context
       */
      extract(context5, carrier, getter) {
        return this._propagators.reduce((ctx, propagator) => {
          try {
            return propagator.extract(ctx, carrier, getter);
          } catch (err) {
            api_1.diag.warn(`Failed to extract with ${propagator.constructor.name}. Err: ${err.message}`);
          }
          return ctx;
        }, context5);
      }
      fields() {
        return this._fields.slice();
      }
    };
    exports.CompositePropagator = CompositePropagator;
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/internal/validators.js
var require_validators = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/internal/validators.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateValue = exports.validateKey = void 0;
    var VALID_KEY_CHAR_RANGE2 = "[_0-9a-z-*/]";
    var VALID_KEY2 = `[a-z]${VALID_KEY_CHAR_RANGE2}{0,255}`;
    var VALID_VENDOR_KEY2 = `[a-z0-9]${VALID_KEY_CHAR_RANGE2}{0,240}@[a-z]${VALID_KEY_CHAR_RANGE2}{0,13}`;
    var VALID_KEY_REGEX2 = new RegExp(`^(?:${VALID_KEY2}|${VALID_VENDOR_KEY2})$`);
    var VALID_VALUE_BASE_REGEX2 = /^[ -~]{0,255}[!-~]$/;
    var INVALID_VALUE_COMMA_EQUAL_REGEX2 = /,|=/;
    function validateKey2(key) {
      return VALID_KEY_REGEX2.test(key);
    }
    __name(validateKey2, "validateKey");
    exports.validateKey = validateKey2;
    function validateValue2(value) {
      return VALID_VALUE_BASE_REGEX2.test(value) && !INVALID_VALUE_COMMA_EQUAL_REGEX2.test(value);
    }
    __name(validateValue2, "validateValue");
    exports.validateValue = validateValue2;
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/trace/TraceState.js
var require_TraceState = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/trace/TraceState.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceState = void 0;
    var validators_1 = require_validators();
    var MAX_TRACE_STATE_ITEMS2 = 32;
    var MAX_TRACE_STATE_LEN2 = 512;
    var LIST_MEMBERS_SEPARATOR2 = ",";
    var LIST_MEMBER_KEY_VALUE_SPLITTER2 = "=";
    var TraceState3 = class _TraceState {
      static {
        __name(this, "TraceState");
      }
      _internalState = /* @__PURE__ */ new Map();
      constructor(rawTraceState) {
        if (rawTraceState)
          this._parse(rawTraceState);
      }
      set(key, value) {
        const traceState = this._clone();
        if (traceState._internalState.has(key)) {
          traceState._internalState.delete(key);
        }
        traceState._internalState.set(key, value);
        return traceState;
      }
      unset(key) {
        const traceState = this._clone();
        traceState._internalState.delete(key);
        return traceState;
      }
      get(key) {
        return this._internalState.get(key);
      }
      serialize() {
        return this._keys().reduce((agg, key) => {
          agg.push(key + LIST_MEMBER_KEY_VALUE_SPLITTER2 + this.get(key));
          return agg;
        }, []).join(LIST_MEMBERS_SEPARATOR2);
      }
      _parse(rawTraceState) {
        if (rawTraceState.length > MAX_TRACE_STATE_LEN2)
          return;
        this._internalState = rawTraceState.split(LIST_MEMBERS_SEPARATOR2).reverse().reduce((agg, part) => {
          const listMember = part.trim();
          const i = listMember.indexOf(LIST_MEMBER_KEY_VALUE_SPLITTER2);
          if (i !== -1) {
            const key = listMember.slice(0, i);
            const value = listMember.slice(i + 1, part.length);
            if ((0, validators_1.validateKey)(key) && (0, validators_1.validateValue)(value)) {
              agg.set(key, value);
            } else {
            }
          }
          return agg;
        }, /* @__PURE__ */ new Map());
        if (this._internalState.size > MAX_TRACE_STATE_ITEMS2) {
          this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, MAX_TRACE_STATE_ITEMS2));
        }
      }
      _keys() {
        return Array.from(this._internalState.keys()).reverse();
      }
      _clone() {
        const traceState = new _TraceState();
        traceState._internalState = new Map(this._internalState);
        return traceState;
      }
    };
    exports.TraceState = TraceState3;
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/trace/W3CTraceContextPropagator.js
var require_W3CTraceContextPropagator = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/trace/W3CTraceContextPropagator.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.W3CTraceContextPropagator = exports.parseTraceParent = exports.TRACE_STATE_HEADER = exports.TRACE_PARENT_HEADER = void 0;
    var api_1 = require_src();
    var suppress_tracing_1 = require_suppress_tracing();
    var TraceState_1 = require_TraceState();
    exports.TRACE_PARENT_HEADER = "traceparent";
    exports.TRACE_STATE_HEADER = "tracestate";
    var VERSION2 = "00";
    var VERSION_PART2 = "(?!ff)[\\da-f]{2}";
    var TRACE_ID_PART2 = "(?![0]{32})[\\da-f]{32}";
    var PARENT_ID_PART2 = "(?![0]{16})[\\da-f]{16}";
    var FLAGS_PART2 = "[\\da-f]{2}";
    var TRACE_PARENT_REGEX2 = new RegExp(`^\\s?(${VERSION_PART2})-(${TRACE_ID_PART2})-(${PARENT_ID_PART2})-(${FLAGS_PART2})(-.*)?\\s?$`);
    function parseTraceParent2(traceParent) {
      const match = TRACE_PARENT_REGEX2.exec(traceParent);
      if (!match)
        return null;
      if (match[1] === "00" && match[5])
        return null;
      return {
        traceId: match[2],
        spanId: match[3],
        traceFlags: parseInt(match[4], 16)
      };
    }
    __name(parseTraceParent2, "parseTraceParent");
    exports.parseTraceParent = parseTraceParent2;
    var W3CTraceContextPropagator2 = class {
      static {
        __name(this, "W3CTraceContextPropagator");
      }
      inject(context5, carrier, setter) {
        const spanContext = api_1.trace.getSpanContext(context5);
        if (!spanContext || (0, suppress_tracing_1.isTracingSuppressed)(context5) || !(0, api_1.isSpanContextValid)(spanContext))
          return;
        const traceParent = `${VERSION2}-${spanContext.traceId}-${spanContext.spanId}-0${Number(spanContext.traceFlags || api_1.TraceFlags.NONE).toString(16)}`;
        setter.set(carrier, exports.TRACE_PARENT_HEADER, traceParent);
        if (spanContext.traceState) {
          setter.set(carrier, exports.TRACE_STATE_HEADER, spanContext.traceState.serialize());
        }
      }
      extract(context5, carrier, getter) {
        const traceParentHeader = getter.get(carrier, exports.TRACE_PARENT_HEADER);
        if (!traceParentHeader)
          return context5;
        const traceParent = Array.isArray(traceParentHeader) ? traceParentHeader[0] : traceParentHeader;
        if (typeof traceParent !== "string")
          return context5;
        const spanContext = parseTraceParent2(traceParent);
        if (!spanContext)
          return context5;
        spanContext.isRemote = true;
        const traceStateHeader = getter.get(carrier, exports.TRACE_STATE_HEADER);
        if (traceStateHeader) {
          const state = Array.isArray(traceStateHeader) ? traceStateHeader.join(",") : traceStateHeader;
          spanContext.traceState = new TraceState_1.TraceState(typeof state === "string" ? state : void 0);
        }
        return api_1.trace.setSpanContext(context5, spanContext);
      }
      fields() {
        return [exports.TRACE_PARENT_HEADER, exports.TRACE_STATE_HEADER];
      }
    };
    exports.W3CTraceContextPropagator = W3CTraceContextPropagator2;
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/trace/rpc-metadata.js
var require_rpc_metadata = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/trace/rpc-metadata.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRPCMetadata = exports.deleteRPCMetadata = exports.setRPCMetadata = exports.RPCType = void 0;
    var api_1 = require_src();
    var RPC_METADATA_KEY = (0, api_1.createContextKey)("OpenTelemetry SDK Context Key RPC_METADATA");
    var RPCType;
    (function(RPCType2) {
      RPCType2["HTTP"] = "http";
    })(RPCType = exports.RPCType || (exports.RPCType = {}));
    function setRPCMetadata(context5, meta) {
      return context5.setValue(RPC_METADATA_KEY, meta);
    }
    __name(setRPCMetadata, "setRPCMetadata");
    exports.setRPCMetadata = setRPCMetadata;
    function deleteRPCMetadata(context5) {
      return context5.deleteValue(RPC_METADATA_KEY);
    }
    __name(deleteRPCMetadata, "deleteRPCMetadata");
    exports.deleteRPCMetadata = deleteRPCMetadata;
    function getRPCMetadata(context5) {
      return context5.getValue(RPC_METADATA_KEY);
    }
    __name(getRPCMetadata, "getRPCMetadata");
    exports.getRPCMetadata = getRPCMetadata;
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/utils/lodash.merge.js
var require_lodash_merge = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/utils/lodash.merge.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isPlainObject = void 0;
    var objectTag = "[object Object]";
    var nullTag = "[object Null]";
    var undefinedTag = "[object Undefined]";
    var funcProto = Function.prototype;
    var funcToString = funcProto.toString;
    var objectCtorString = funcToString.call(Object);
    var getPrototypeOf = Object.getPrototypeOf;
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var symToStringTag = Symbol ? Symbol.toStringTag : void 0;
    var nativeObjectToString = objectProto.toString;
    function isPlainObject(value) {
      if (!isObjectLike(value) || baseGetTag(value) !== objectTag) {
        return false;
      }
      const proto = getPrototypeOf(value);
      if (proto === null) {
        return true;
      }
      const Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
      return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) === objectCtorString;
    }
    __name(isPlainObject, "isPlainObject");
    exports.isPlainObject = isPlainObject;
    function isObjectLike(value) {
      return value != null && typeof value == "object";
    }
    __name(isObjectLike, "isObjectLike");
    function baseGetTag(value) {
      if (value == null) {
        return value === void 0 ? undefinedTag : nullTag;
      }
      return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
    }
    __name(baseGetTag, "baseGetTag");
    function getRawTag(value) {
      const isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
      let unmasked = false;
      try {
        value[symToStringTag] = void 0;
        unmasked = true;
      } catch (e2) {
      }
      const result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }
    __name(getRawTag, "getRawTag");
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }
    __name(objectToString, "objectToString");
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/utils/merge.js
var require_merge = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/utils/merge.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.merge = void 0;
    var lodash_merge_1 = require_lodash_merge();
    var MAX_LEVEL = 20;
    function merge(...args) {
      let result = args.shift();
      const objects = /* @__PURE__ */ new WeakMap();
      while (args.length > 0) {
        result = mergeTwoObjects(result, args.shift(), 0, objects);
      }
      return result;
    }
    __name(merge, "merge");
    exports.merge = merge;
    function takeValue(value) {
      if (isArray(value)) {
        return value.slice();
      }
      return value;
    }
    __name(takeValue, "takeValue");
    function mergeTwoObjects(one, two, level = 0, objects) {
      let result;
      if (level > MAX_LEVEL) {
        return void 0;
      }
      level++;
      if (isPrimitive(one) || isPrimitive(two) || isFunction(two)) {
        result = takeValue(two);
      } else if (isArray(one)) {
        result = one.slice();
        if (isArray(two)) {
          for (let i = 0, j = two.length; i < j; i++) {
            result.push(takeValue(two[i]));
          }
        } else if (isObject(two)) {
          const keys = Object.keys(two);
          for (let i = 0, j = keys.length; i < j; i++) {
            const key = keys[i];
            result[key] = takeValue(two[key]);
          }
        }
      } else if (isObject(one)) {
        if (isObject(two)) {
          if (!shouldMerge(one, two)) {
            return two;
          }
          result = Object.assign({}, one);
          const keys = Object.keys(two);
          for (let i = 0, j = keys.length; i < j; i++) {
            const key = keys[i];
            const twoValue = two[key];
            if (isPrimitive(twoValue)) {
              if (typeof twoValue === "undefined") {
                delete result[key];
              } else {
                result[key] = twoValue;
              }
            } else {
              const obj1 = result[key];
              const obj2 = twoValue;
              if (wasObjectReferenced(one, key, objects) || wasObjectReferenced(two, key, objects)) {
                delete result[key];
              } else {
                if (isObject(obj1) && isObject(obj2)) {
                  const arr1 = objects.get(obj1) || [];
                  const arr2 = objects.get(obj2) || [];
                  arr1.push({ obj: one, key });
                  arr2.push({ obj: two, key });
                  objects.set(obj1, arr1);
                  objects.set(obj2, arr2);
                }
                result[key] = mergeTwoObjects(result[key], twoValue, level, objects);
              }
            }
          }
        } else {
          result = two;
        }
      }
      return result;
    }
    __name(mergeTwoObjects, "mergeTwoObjects");
    function wasObjectReferenced(obj, key, objects) {
      const arr = objects.get(obj[key]) || [];
      for (let i = 0, j = arr.length; i < j; i++) {
        const info3 = arr[i];
        if (info3.key === key && info3.obj === obj) {
          return true;
        }
      }
      return false;
    }
    __name(wasObjectReferenced, "wasObjectReferenced");
    function isArray(value) {
      return Array.isArray(value);
    }
    __name(isArray, "isArray");
    function isFunction(value) {
      return typeof value === "function";
    }
    __name(isFunction, "isFunction");
    function isObject(value) {
      return !isPrimitive(value) && !isArray(value) && !isFunction(value) && typeof value === "object";
    }
    __name(isObject, "isObject");
    function isPrimitive(value) {
      return typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "undefined" || value instanceof Date || value instanceof RegExp || value === null;
    }
    __name(isPrimitive, "isPrimitive");
    function shouldMerge(one, two) {
      if (!(0, lodash_merge_1.isPlainObject)(one) || !(0, lodash_merge_1.isPlainObject)(two)) {
        return false;
      }
      return true;
    }
    __name(shouldMerge, "shouldMerge");
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/utils/timeout.js
var require_timeout = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/utils/timeout.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.callWithTimeout = exports.TimeoutError = void 0;
    var TimeoutError = class _TimeoutError extends Error {
      static {
        __name(this, "TimeoutError");
      }
      constructor(message) {
        super(message);
        Object.setPrototypeOf(this, _TimeoutError.prototype);
      }
    };
    exports.TimeoutError = TimeoutError;
    function callWithTimeout(promise, timeout) {
      let timeoutHandle;
      const timeoutPromise = new Promise(/* @__PURE__ */ __name(function timeoutFunction(_resolve, reject) {
        timeoutHandle = setTimeout(/* @__PURE__ */ __name(function timeoutHandler() {
          reject(new TimeoutError("Operation timed out."));
        }, "timeoutHandler"), timeout);
      }, "timeoutFunction"));
      return Promise.race([promise, timeoutPromise]).then((result) => {
        clearTimeout(timeoutHandle);
        return result;
      }, (reason) => {
        clearTimeout(timeoutHandle);
        throw reason;
      });
    }
    __name(callWithTimeout, "callWithTimeout");
    exports.callWithTimeout = callWithTimeout;
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/utils/url.js
var require_url = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/utils/url.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isUrlIgnored = exports.urlMatches = void 0;
    function urlMatches(url, urlToMatch) {
      if (typeof urlToMatch === "string") {
        return url === urlToMatch;
      } else {
        return !!url.match(urlToMatch);
      }
    }
    __name(urlMatches, "urlMatches");
    exports.urlMatches = urlMatches;
    function isUrlIgnored(url, ignoredUrls) {
      if (!ignoredUrls) {
        return false;
      }
      for (const ignoreUrl of ignoredUrls) {
        if (urlMatches(url, ignoreUrl)) {
          return true;
        }
      }
      return false;
    }
    __name(isUrlIgnored, "isUrlIgnored");
    exports.isUrlIgnored = isUrlIgnored;
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/utils/promise.js
var require_promise = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/utils/promise.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Deferred = void 0;
    var Deferred = class {
      static {
        __name(this, "Deferred");
      }
      _promise;
      _resolve;
      _reject;
      constructor() {
        this._promise = new Promise((resolve, reject) => {
          this._resolve = resolve;
          this._reject = reject;
        });
      }
      get promise() {
        return this._promise;
      }
      resolve(val) {
        this._resolve(val);
      }
      reject(err) {
        this._reject(err);
      }
    };
    exports.Deferred = Deferred;
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/utils/callback.js
var require_callback = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/utils/callback.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BindOnceFuture = void 0;
    var promise_1 = require_promise();
    var BindOnceFuture = class {
      static {
        __name(this, "BindOnceFuture");
      }
      _callback;
      _that;
      _isCalled = false;
      _deferred = new promise_1.Deferred();
      constructor(_callback, _that) {
        this._callback = _callback;
        this._that = _that;
      }
      get isCalled() {
        return this._isCalled;
      }
      get promise() {
        return this._deferred.promise;
      }
      call(...args) {
        if (!this._isCalled) {
          this._isCalled = true;
          try {
            Promise.resolve(this._callback.call(this._that, ...args)).then((val) => this._deferred.resolve(val), (err) => this._deferred.reject(err));
          } catch (err) {
            this._deferred.reject(err);
          }
        }
        return this._deferred.promise;
      }
    };
    exports.BindOnceFuture = BindOnceFuture;
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/utils/configuration.js
var require_configuration = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/utils/configuration.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.diagLogLevelFromString = void 0;
    var api_1 = require_src();
    var logLevelMap = {
      ALL: api_1.DiagLogLevel.ALL,
      VERBOSE: api_1.DiagLogLevel.VERBOSE,
      DEBUG: api_1.DiagLogLevel.DEBUG,
      INFO: api_1.DiagLogLevel.INFO,
      WARN: api_1.DiagLogLevel.WARN,
      ERROR: api_1.DiagLogLevel.ERROR,
      NONE: api_1.DiagLogLevel.NONE
    };
    function diagLogLevelFromString(value) {
      if (value == null) {
        return void 0;
      }
      const resolvedLogLevel = logLevelMap[value.toUpperCase()];
      if (resolvedLogLevel == null) {
        api_1.diag.warn(`Unknown log level "${value}", expected one of ${Object.keys(logLevelMap)}, using default`);
        return api_1.DiagLogLevel.INFO;
      }
      return resolvedLogLevel;
    }
    __name(diagLogLevelFromString, "diagLogLevelFromString");
    exports.diagLogLevelFromString = diagLogLevelFromString;
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/internal/exporter.js
var require_exporter = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/internal/exporter.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._export = void 0;
    var api_1 = require_src();
    var suppress_tracing_1 = require_suppress_tracing();
    function _export(exporter, arg) {
      return new Promise((resolve) => {
        api_1.context.with((0, suppress_tracing_1.suppressTracing)(api_1.context.active()), () => {
          exporter.export(arg, (result) => {
            resolve(result);
          });
        });
      });
    }
    __name(_export, "_export");
    exports._export = _export;
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/index.js
var require_src3 = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/src/index.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.internal = exports.diagLogLevelFromString = exports.BindOnceFuture = exports.urlMatches = exports.isUrlIgnored = exports.callWithTimeout = exports.TimeoutError = exports.merge = exports.TraceState = exports.unsuppressTracing = exports.suppressTracing = exports.isTracingSuppressed = exports.setRPCMetadata = exports.getRPCMetadata = exports.deleteRPCMetadata = exports.RPCType = exports.parseTraceParent = exports.W3CTraceContextPropagator = exports.TRACE_STATE_HEADER = exports.TRACE_PARENT_HEADER = exports.CompositePropagator = exports.unrefTimer = exports.otperformance = exports.getStringListFromEnv = exports.getNumberFromEnv = exports.getBooleanFromEnv = exports.getStringFromEnv = exports._globalThis = exports.SDK_INFO = exports.parseKeyPairsIntoRecord = exports.ExportResultCode = exports.timeInputToHrTime = exports.millisToHrTime = exports.isTimeInputHrTime = exports.isTimeInput = exports.hrTimeToTimeStamp = exports.hrTimeToNanoseconds = exports.hrTimeToMilliseconds = exports.hrTimeToMicroseconds = exports.hrTimeDuration = exports.hrTime = exports.getTimeOrigin = exports.addHrTimes = exports.loggingErrorHandler = exports.setGlobalErrorHandler = exports.globalErrorHandler = exports.sanitizeAttributes = exports.isAttributeValue = exports.AnchoredClock = exports.W3CBaggagePropagator = void 0;
    var W3CBaggagePropagator_1 = require_W3CBaggagePropagator();
    Object.defineProperty(exports, "W3CBaggagePropagator", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return W3CBaggagePropagator_1.W3CBaggagePropagator;
    }, "get") });
    var anchored_clock_1 = require_anchored_clock();
    Object.defineProperty(exports, "AnchoredClock", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return anchored_clock_1.AnchoredClock;
    }, "get") });
    var attributes_1 = require_attributes();
    Object.defineProperty(exports, "isAttributeValue", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return attributes_1.isAttributeValue;
    }, "get") });
    Object.defineProperty(exports, "sanitizeAttributes", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return attributes_1.sanitizeAttributes;
    }, "get") });
    var global_error_handler_1 = require_global_error_handler();
    Object.defineProperty(exports, "globalErrorHandler", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return global_error_handler_1.globalErrorHandler;
    }, "get") });
    Object.defineProperty(exports, "setGlobalErrorHandler", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return global_error_handler_1.setGlobalErrorHandler;
    }, "get") });
    var logging_error_handler_1 = require_logging_error_handler();
    Object.defineProperty(exports, "loggingErrorHandler", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return logging_error_handler_1.loggingErrorHandler;
    }, "get") });
    var time_1 = require_time();
    Object.defineProperty(exports, "addHrTimes", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return time_1.addHrTimes;
    }, "get") });
    Object.defineProperty(exports, "getTimeOrigin", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return time_1.getTimeOrigin;
    }, "get") });
    Object.defineProperty(exports, "hrTime", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return time_1.hrTime;
    }, "get") });
    Object.defineProperty(exports, "hrTimeDuration", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return time_1.hrTimeDuration;
    }, "get") });
    Object.defineProperty(exports, "hrTimeToMicroseconds", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return time_1.hrTimeToMicroseconds;
    }, "get") });
    Object.defineProperty(exports, "hrTimeToMilliseconds", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return time_1.hrTimeToMilliseconds;
    }, "get") });
    Object.defineProperty(exports, "hrTimeToNanoseconds", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return time_1.hrTimeToNanoseconds;
    }, "get") });
    Object.defineProperty(exports, "hrTimeToTimeStamp", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return time_1.hrTimeToTimeStamp;
    }, "get") });
    Object.defineProperty(exports, "isTimeInput", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return time_1.isTimeInput;
    }, "get") });
    Object.defineProperty(exports, "isTimeInputHrTime", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return time_1.isTimeInputHrTime;
    }, "get") });
    Object.defineProperty(exports, "millisToHrTime", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return time_1.millisToHrTime;
    }, "get") });
    Object.defineProperty(exports, "timeInputToHrTime", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return time_1.timeInputToHrTime;
    }, "get") });
    var ExportResult_1 = require_ExportResult();
    Object.defineProperty(exports, "ExportResultCode", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return ExportResult_1.ExportResultCode;
    }, "get") });
    var utils_1 = require_utils4();
    Object.defineProperty(exports, "parseKeyPairsIntoRecord", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return utils_1.parseKeyPairsIntoRecord;
    }, "get") });
    var platform_1 = require_browser2();
    Object.defineProperty(exports, "SDK_INFO", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return platform_1.SDK_INFO;
    }, "get") });
    Object.defineProperty(exports, "_globalThis", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return platform_1._globalThis;
    }, "get") });
    Object.defineProperty(exports, "getStringFromEnv", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return platform_1.getStringFromEnv;
    }, "get") });
    Object.defineProperty(exports, "getBooleanFromEnv", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return platform_1.getBooleanFromEnv;
    }, "get") });
    Object.defineProperty(exports, "getNumberFromEnv", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return platform_1.getNumberFromEnv;
    }, "get") });
    Object.defineProperty(exports, "getStringListFromEnv", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return platform_1.getStringListFromEnv;
    }, "get") });
    Object.defineProperty(exports, "otperformance", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return platform_1.otperformance;
    }, "get") });
    Object.defineProperty(exports, "unrefTimer", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return platform_1.unrefTimer;
    }, "get") });
    var composite_1 = require_composite();
    Object.defineProperty(exports, "CompositePropagator", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return composite_1.CompositePropagator;
    }, "get") });
    var W3CTraceContextPropagator_1 = require_W3CTraceContextPropagator();
    Object.defineProperty(exports, "TRACE_PARENT_HEADER", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return W3CTraceContextPropagator_1.TRACE_PARENT_HEADER;
    }, "get") });
    Object.defineProperty(exports, "TRACE_STATE_HEADER", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return W3CTraceContextPropagator_1.TRACE_STATE_HEADER;
    }, "get") });
    Object.defineProperty(exports, "W3CTraceContextPropagator", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return W3CTraceContextPropagator_1.W3CTraceContextPropagator;
    }, "get") });
    Object.defineProperty(exports, "parseTraceParent", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return W3CTraceContextPropagator_1.parseTraceParent;
    }, "get") });
    var rpc_metadata_1 = require_rpc_metadata();
    Object.defineProperty(exports, "RPCType", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return rpc_metadata_1.RPCType;
    }, "get") });
    Object.defineProperty(exports, "deleteRPCMetadata", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return rpc_metadata_1.deleteRPCMetadata;
    }, "get") });
    Object.defineProperty(exports, "getRPCMetadata", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return rpc_metadata_1.getRPCMetadata;
    }, "get") });
    Object.defineProperty(exports, "setRPCMetadata", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return rpc_metadata_1.setRPCMetadata;
    }, "get") });
    var suppress_tracing_1 = require_suppress_tracing();
    Object.defineProperty(exports, "isTracingSuppressed", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return suppress_tracing_1.isTracingSuppressed;
    }, "get") });
    Object.defineProperty(exports, "suppressTracing", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return suppress_tracing_1.suppressTracing;
    }, "get") });
    Object.defineProperty(exports, "unsuppressTracing", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return suppress_tracing_1.unsuppressTracing;
    }, "get") });
    var TraceState_1 = require_TraceState();
    Object.defineProperty(exports, "TraceState", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return TraceState_1.TraceState;
    }, "get") });
    var merge_1 = require_merge();
    Object.defineProperty(exports, "merge", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return merge_1.merge;
    }, "get") });
    var timeout_1 = require_timeout();
    Object.defineProperty(exports, "TimeoutError", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return timeout_1.TimeoutError;
    }, "get") });
    Object.defineProperty(exports, "callWithTimeout", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return timeout_1.callWithTimeout;
    }, "get") });
    var url_1 = require_url();
    Object.defineProperty(exports, "isUrlIgnored", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return url_1.isUrlIgnored;
    }, "get") });
    Object.defineProperty(exports, "urlMatches", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return url_1.urlMatches;
    }, "get") });
    var callback_1 = require_callback();
    Object.defineProperty(exports, "BindOnceFuture", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return callback_1.BindOnceFuture;
    }, "get") });
    var configuration_1 = require_configuration();
    Object.defineProperty(exports, "diagLogLevelFromString", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return configuration_1.diagLogLevelFromString;
    }, "get") });
    var exporter_1 = require_exporter();
    exports.internal = {
      _export: exporter_1._export
    };
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/build/src/logging-response-handler.js
var require_logging_response_handler = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/build/src/logging-response-handler.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createLoggingPartialSuccessResponseHandler = void 0;
    var api_1 = require_src();
    function isPartialSuccessResponse(response) {
      return Object.prototype.hasOwnProperty.call(response, "partialSuccess");
    }
    __name(isPartialSuccessResponse, "isPartialSuccessResponse");
    function createLoggingPartialSuccessResponseHandler() {
      return {
        handleResponse(response) {
          if (response == null || !isPartialSuccessResponse(response) || response.partialSuccess == null || Object.keys(response.partialSuccess).length === 0) {
            return;
          }
          api_1.diag.warn("Received Partial Success response:", JSON.stringify(response.partialSuccess));
        }
      };
    }
    __name(createLoggingPartialSuccessResponseHandler, "createLoggingPartialSuccessResponseHandler");
    exports.createLoggingPartialSuccessResponseHandler = createLoggingPartialSuccessResponseHandler;
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/build/src/otlp-export-delegate.js
var require_otlp_export_delegate = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/build/src/otlp-export-delegate.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createOtlpExportDelegate = void 0;
    var core_1 = require_src3();
    var types_1 = require_types2();
    var logging_response_handler_1 = require_logging_response_handler();
    var api_1 = require_src();
    var OTLPExportDelegate = class {
      static {
        __name(this, "OTLPExportDelegate");
      }
      _transport;
      _serializer;
      _responseHandler;
      _promiseQueue;
      _timeout;
      _diagLogger;
      constructor(_transport, _serializer, _responseHandler, _promiseQueue, _timeout) {
        this._transport = _transport;
        this._serializer = _serializer;
        this._responseHandler = _responseHandler;
        this._promiseQueue = _promiseQueue;
        this._timeout = _timeout;
        this._diagLogger = api_1.diag.createComponentLogger({
          namespace: "OTLPExportDelegate"
        });
      }
      export(internalRepresentation, resultCallback) {
        this._diagLogger.debug("items to be sent", internalRepresentation);
        if (this._promiseQueue.hasReachedLimit()) {
          resultCallback({
            code: core_1.ExportResultCode.FAILED,
            error: new Error("Concurrent export limit reached")
          });
          return;
        }
        const serializedRequest = this._serializer.serializeRequest(internalRepresentation);
        if (serializedRequest == null) {
          resultCallback({
            code: core_1.ExportResultCode.FAILED,
            error: new Error("Nothing to send")
          });
          return;
        }
        this._promiseQueue.pushPromise(this._transport.send(serializedRequest, this._timeout).then((response) => {
          if (response.status === "success") {
            if (response.data != null) {
              try {
                this._responseHandler.handleResponse(this._serializer.deserializeResponse(response.data));
              } catch (e2) {
                this._diagLogger.warn("Export succeeded but could not deserialize response - is the response specification compliant?", e2, response.data);
              }
            }
            resultCallback({
              code: core_1.ExportResultCode.SUCCESS
            });
            return;
          } else if (response.status === "failure" && response.error) {
            resultCallback({
              code: core_1.ExportResultCode.FAILED,
              error: response.error
            });
            return;
          } else if (response.status === "retryable") {
            resultCallback({
              code: core_1.ExportResultCode.FAILED,
              error: new types_1.OTLPExporterError("Export failed with retryable status")
            });
          } else {
            resultCallback({
              code: core_1.ExportResultCode.FAILED,
              error: new types_1.OTLPExporterError("Export failed with unknown error")
            });
          }
        }, (reason) => resultCallback({
          code: core_1.ExportResultCode.FAILED,
          error: reason
        })));
      }
      forceFlush() {
        return this._promiseQueue.awaitAll();
      }
      async shutdown() {
        this._diagLogger.debug("shutdown started");
        await this.forceFlush();
        this._transport.shutdown();
      }
    };
    function createOtlpExportDelegate(components, settings) {
      return new OTLPExportDelegate(components.transport, components.serializer, (0, logging_response_handler_1.createLoggingPartialSuccessResponseHandler)(), components.promiseHandler, settings.timeout);
    }
    __name(createOtlpExportDelegate, "createOtlpExportDelegate");
    exports.createOtlpExportDelegate = createOtlpExportDelegate;
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/build/src/otlp-network-export-delegate.js
var require_otlp_network_export_delegate = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/build/src/otlp-network-export-delegate.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createOtlpNetworkExportDelegate = void 0;
    var bounded_queue_export_promise_handler_1 = require_bounded_queue_export_promise_handler();
    var otlp_export_delegate_1 = require_otlp_export_delegate();
    function createOtlpNetworkExportDelegate(options, serializer, transport) {
      return (0, otlp_export_delegate_1.createOtlpExportDelegate)({
        transport,
        serializer,
        promiseHandler: (0, bounded_queue_export_promise_handler_1.createBoundedQueueExportPromiseHandler)(options)
      }, { timeout: options.timeoutMillis });
    }
    __name(createOtlpNetworkExportDelegate, "createOtlpNetworkExportDelegate");
    exports.createOtlpNetworkExportDelegate = createOtlpNetworkExportDelegate;
  }
});

// node_modules/@opentelemetry/otlp-exporter-base/build/src/index.js
var require_src4 = __commonJS({
  "node_modules/@opentelemetry/otlp-exporter-base/build/src/index.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createOtlpNetworkExportDelegate = exports.CompressionAlgorithm = exports.getSharedConfigurationDefaults = exports.mergeOtlpSharedConfigurationWithDefaults = exports.OTLPExporterError = exports.OTLPExporterBase = void 0;
    var OTLPExporterBase_1 = require_OTLPExporterBase();
    Object.defineProperty(exports, "OTLPExporterBase", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return OTLPExporterBase_1.OTLPExporterBase;
    }, "get") });
    var types_1 = require_types2();
    Object.defineProperty(exports, "OTLPExporterError", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return types_1.OTLPExporterError;
    }, "get") });
    var shared_configuration_1 = require_shared_configuration();
    Object.defineProperty(exports, "mergeOtlpSharedConfigurationWithDefaults", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return shared_configuration_1.mergeOtlpSharedConfigurationWithDefaults;
    }, "get") });
    Object.defineProperty(exports, "getSharedConfigurationDefaults", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return shared_configuration_1.getSharedConfigurationDefaults;
    }, "get") });
    var legacy_node_configuration_1 = require_legacy_node_configuration();
    Object.defineProperty(exports, "CompressionAlgorithm", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return legacy_node_configuration_1.CompressionAlgorithm;
    }, "get") });
    var otlp_network_export_delegate_1 = require_otlp_network_export_delegate();
    Object.defineProperty(exports, "createOtlpNetworkExportDelegate", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return otlp_network_export_delegate_1.createOtlpNetworkExportDelegate;
    }, "get") });
  }
});

// node_modules/@opentelemetry/semantic-conventions/build/src/experimental_attributes.js
var require_experimental_attributes = __commonJS({
  "node_modules/@opentelemetry/semantic-conventions/build/src/experimental_attributes.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ASPNETCORE_IDENTITY_SIGN_IN_RESULT_VALUE_NOT_ALLOWED = exports.ASPNETCORE_IDENTITY_SIGN_IN_RESULT_VALUE_LOCKED_OUT = exports.ASPNETCORE_IDENTITY_SIGN_IN_RESULT_VALUE_FAILURE = exports.ATTR_ASPNETCORE_IDENTITY_SIGN_IN_RESULT = exports.ASPNETCORE_IDENTITY_RESULT_VALUE_SUCCESS = exports.ASPNETCORE_IDENTITY_RESULT_VALUE_FAILURE = exports.ATTR_ASPNETCORE_IDENTITY_RESULT = exports.ASPNETCORE_IDENTITY_PASSWORD_CHECK_RESULT_VALUE_USER_MISSING = exports.ASPNETCORE_IDENTITY_PASSWORD_CHECK_RESULT_VALUE_SUCCESS_REHASH_NEEDED = exports.ASPNETCORE_IDENTITY_PASSWORD_CHECK_RESULT_VALUE_SUCCESS = exports.ASPNETCORE_IDENTITY_PASSWORD_CHECK_RESULT_VALUE_PASSWORD_MISSING = exports.ASPNETCORE_IDENTITY_PASSWORD_CHECK_RESULT_VALUE_FAILURE = exports.ATTR_ASPNETCORE_IDENTITY_PASSWORD_CHECK_RESULT = exports.ATTR_ASPNETCORE_IDENTITY_ERROR_CODE = exports.ASPNETCORE_AUTHORIZATION_RESULT_VALUE_SUCCESS = exports.ASPNETCORE_AUTHORIZATION_RESULT_VALUE_FAILURE = exports.ATTR_ASPNETCORE_AUTHORIZATION_RESULT = exports.ATTR_ASPNETCORE_AUTHORIZATION_POLICY = exports.ATTR_ASPNETCORE_AUTHENTICATION_SCHEME = exports.ASPNETCORE_AUTHENTICATION_RESULT_VALUE_SUCCESS = exports.ASPNETCORE_AUTHENTICATION_RESULT_VALUE_NONE = exports.ASPNETCORE_AUTHENTICATION_RESULT_VALUE_FAILURE = exports.ATTR_ASPNETCORE_AUTHENTICATION_RESULT = exports.ATTR_ARTIFACT_VERSION = exports.ATTR_ARTIFACT_PURL = exports.ATTR_ARTIFACT_HASH = exports.ATTR_ARTIFACT_FILENAME = exports.ATTR_ARTIFACT_ATTESTATION_ID = exports.ATTR_ARTIFACT_ATTESTATION_HASH = exports.ATTR_ARTIFACT_ATTESTATION_FILENAME = exports.ATTR_APP_WIDGET_NAME = exports.ATTR_APP_WIDGET_ID = exports.ATTR_APP_SCREEN_NAME = exports.ATTR_APP_SCREEN_ID = exports.ATTR_APP_SCREEN_COORDINATE_Y = exports.ATTR_APP_SCREEN_COORDINATE_X = exports.ATTR_APP_JANK_THRESHOLD = exports.ATTR_APP_JANK_PERIOD = exports.ATTR_APP_JANK_FRAME_COUNT = exports.ATTR_APP_INSTALLATION_ID = exports.ATTR_APP_BUILD_ID = exports.ANDROID_STATE_VALUE_FOREGROUND = exports.ANDROID_STATE_VALUE_CREATED = exports.ANDROID_STATE_VALUE_BACKGROUND = exports.ATTR_ANDROID_STATE = exports.ATTR_ANDROID_OS_API_LEVEL = exports.ANDROID_APP_STATE_VALUE_FOREGROUND = exports.ANDROID_APP_STATE_VALUE_CREATED = exports.ANDROID_APP_STATE_VALUE_BACKGROUND = exports.ATTR_ANDROID_APP_STATE = void 0;
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_SET_PHONE_NUMBER = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_SET_PASSKEY = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_SET_LOCKOUT_END_DATE = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_SET_LOCKOUT_ENABLED = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_SET_EMAIL = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_SET_AUTHENTICATION_TOKEN = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_SECURITY_STAMP = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_RESET_PASSWORD = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_RESET_AUTHENTICATOR_KEY = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_RESET_ACCESS_FAILED_COUNT = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_REPLACE_CLAIM = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_REMOVE_PASSWORD = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_REMOVE_PASSKEY = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_REMOVE_LOGIN = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_REMOVE_FROM_ROLES = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_REMOVE_CLAIMS = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_REMOVE_AUTHENTICATION_TOKEN = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_REDEEM_TWO_FACTOR_RECOVERY_CODE = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_PASSWORD_REHASH = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_GENERATE_NEW_TWO_FACTOR_RECOVERY_CODES = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_CONFIRM_EMAIL = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_CHANGE_PHONE_NUMBER = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_CHANGE_PASSWORD = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_CHANGE_EMAIL = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_ADD_TO_ROLES = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_ADD_PASSWORD = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_ADD_LOGIN = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_ADD_CLAIMS = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_ACCESS_FAILED = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_OTHER = exports.ATTR_ASPNETCORE_IDENTITY_USER_UPDATE_TYPE = exports.ASPNETCORE_IDENTITY_TOKEN_VERIFIED_VALUE_SUCCESS = exports.ASPNETCORE_IDENTITY_TOKEN_VERIFIED_VALUE_FAILURE = exports.ATTR_ASPNETCORE_IDENTITY_TOKEN_VERIFIED = exports.ASPNETCORE_IDENTITY_TOKEN_PURPOSE_VALUE_TWO_FACTOR = exports.ASPNETCORE_IDENTITY_TOKEN_PURPOSE_VALUE_RESET_PASSWORD = exports.ASPNETCORE_IDENTITY_TOKEN_PURPOSE_VALUE_EMAIL_CONFIRMATION = exports.ASPNETCORE_IDENTITY_TOKEN_PURPOSE_VALUE_CHANGE_PHONE_NUMBER = exports.ASPNETCORE_IDENTITY_TOKEN_PURPOSE_VALUE_CHANGE_EMAIL = exports.ASPNETCORE_IDENTITY_TOKEN_PURPOSE_VALUE_OTHER = exports.ATTR_ASPNETCORE_IDENTITY_TOKEN_PURPOSE = exports.ASPNETCORE_IDENTITY_SIGN_IN_TYPE_VALUE_TWO_FACTOR_RECOVERY_CODE = exports.ASPNETCORE_IDENTITY_SIGN_IN_TYPE_VALUE_TWO_FACTOR_AUTHENTICATOR = exports.ASPNETCORE_IDENTITY_SIGN_IN_TYPE_VALUE_TWO_FACTOR = exports.ASPNETCORE_IDENTITY_SIGN_IN_TYPE_VALUE_PASSWORD = exports.ASPNETCORE_IDENTITY_SIGN_IN_TYPE_VALUE_PASSKEY = exports.ASPNETCORE_IDENTITY_SIGN_IN_TYPE_VALUE_EXTERNAL = exports.ATTR_ASPNETCORE_IDENTITY_SIGN_IN_TYPE = exports.ASPNETCORE_IDENTITY_SIGN_IN_RESULT_VALUE_SUCCESS = exports.ASPNETCORE_IDENTITY_SIGN_IN_RESULT_VALUE_REQUIRES_TWO_FACTOR = void 0;
    exports.ATTR_AWS_S3_BUCKET = exports.ATTR_AWS_REQUEST_ID = exports.ATTR_AWS_LOG_STREAM_NAMES = exports.ATTR_AWS_LOG_STREAM_ARNS = exports.ATTR_AWS_LOG_GROUP_NAMES = exports.ATTR_AWS_LOG_GROUP_ARNS = exports.ATTR_AWS_LAMBDA_RESOURCE_MAPPING_ID = exports.ATTR_AWS_LAMBDA_INVOKED_ARN = exports.ATTR_AWS_KINESIS_STREAM_NAME = exports.ATTR_AWS_EXTENDED_REQUEST_ID = exports.ATTR_AWS_EKS_CLUSTER_ARN = exports.ATTR_AWS_ECS_TASK_REVISION = exports.ATTR_AWS_ECS_TASK_ID = exports.ATTR_AWS_ECS_TASK_FAMILY = exports.ATTR_AWS_ECS_TASK_ARN = exports.AWS_ECS_LAUNCHTYPE_VALUE_FARGATE = exports.AWS_ECS_LAUNCHTYPE_VALUE_EC2 = exports.ATTR_AWS_ECS_LAUNCHTYPE = exports.ATTR_AWS_ECS_CONTAINER_ARN = exports.ATTR_AWS_ECS_CLUSTER_ARN = exports.ATTR_AWS_DYNAMODB_TOTAL_SEGMENTS = exports.ATTR_AWS_DYNAMODB_TABLE_NAMES = exports.ATTR_AWS_DYNAMODB_TABLE_COUNT = exports.ATTR_AWS_DYNAMODB_SELECT = exports.ATTR_AWS_DYNAMODB_SEGMENT = exports.ATTR_AWS_DYNAMODB_SCANNED_COUNT = exports.ATTR_AWS_DYNAMODB_SCAN_FORWARD = exports.ATTR_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = exports.ATTR_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = exports.ATTR_AWS_DYNAMODB_PROJECTION = exports.ATTR_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = exports.ATTR_AWS_DYNAMODB_LIMIT = exports.ATTR_AWS_DYNAMODB_ITEM_COLLECTION_METRICS = exports.ATTR_AWS_DYNAMODB_INDEX_NAME = exports.ATTR_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = exports.ATTR_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = exports.ATTR_AWS_DYNAMODB_EXCLUSIVE_START_TABLE = exports.ATTR_AWS_DYNAMODB_COUNT = exports.ATTR_AWS_DYNAMODB_CONSUMED_CAPACITY = exports.ATTR_AWS_DYNAMODB_CONSISTENT_READ = exports.ATTR_AWS_DYNAMODB_ATTRIBUTES_TO_GET = exports.ATTR_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = exports.ATTR_AWS_BEDROCK_KNOWLEDGE_BASE_ID = exports.ATTR_AWS_BEDROCK_GUARDRAIL_ID = exports.ATTR_ASPNETCORE_SIGN_IN_IS_PERSISTENT = exports.ATTR_ASPNETCORE_MEMORY_POOL_OWNER = exports.ATTR_ASPNETCORE_IDENTITY_USER_TYPE = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_USER_NAME = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_UPDATE = exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_SET_TWO_FACTOR_ENABLED = void 0;
    exports.ATTR_CICD_PIPELINE_ACTION_NAME = exports.ATTR_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = exports.ATTR_CASSANDRA_QUERY_IDEMPOTENT = exports.ATTR_CASSANDRA_PAGE_SIZE = exports.ATTR_CASSANDRA_COORDINATOR_ID = exports.ATTR_CASSANDRA_COORDINATOR_DC = exports.CASSANDRA_CONSISTENCY_LEVEL_VALUE_TWO = exports.CASSANDRA_CONSISTENCY_LEVEL_VALUE_THREE = exports.CASSANDRA_CONSISTENCY_LEVEL_VALUE_SERIAL = exports.CASSANDRA_CONSISTENCY_LEVEL_VALUE_QUORUM = exports.CASSANDRA_CONSISTENCY_LEVEL_VALUE_ONE = exports.CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_SERIAL = exports.CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_QUORUM = exports.CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_ONE = exports.CASSANDRA_CONSISTENCY_LEVEL_VALUE_EACH_QUORUM = exports.CASSANDRA_CONSISTENCY_LEVEL_VALUE_ANY = exports.CASSANDRA_CONSISTENCY_LEVEL_VALUE_ALL = exports.ATTR_CASSANDRA_CONSISTENCY_LEVEL = exports.ATTR_BROWSER_PLATFORM = exports.ATTR_BROWSER_MOBILE = exports.ATTR_BROWSER_LANGUAGE = exports.ATTR_BROWSER_BRANDS = exports.ATTR_AZURE_SERVICE_REQUEST_ID = exports.ATTR_AZURE_RESOURCE_PROVIDER_NAMESPACE = exports.ATTR_AZURE_COSMOSDB_RESPONSE_SUB_STATUS_CODE = exports.ATTR_AZURE_COSMOSDB_REQUEST_BODY_SIZE = exports.ATTR_AZURE_COSMOSDB_OPERATION_REQUEST_CHARGE = exports.ATTR_AZURE_COSMOSDB_OPERATION_CONTACTED_REGIONS = exports.AZURE_COSMOSDB_CONSISTENCY_LEVEL_VALUE_STRONG = exports.AZURE_COSMOSDB_CONSISTENCY_LEVEL_VALUE_SESSION = exports.AZURE_COSMOSDB_CONSISTENCY_LEVEL_VALUE_EVENTUAL = exports.AZURE_COSMOSDB_CONSISTENCY_LEVEL_VALUE_CONSISTENT_PREFIX = exports.AZURE_COSMOSDB_CONSISTENCY_LEVEL_VALUE_BOUNDED_STALENESS = exports.ATTR_AZURE_COSMOSDB_CONSISTENCY_LEVEL = exports.AZURE_COSMOSDB_CONNECTION_MODE_VALUE_GATEWAY = exports.AZURE_COSMOSDB_CONNECTION_MODE_VALUE_DIRECT = exports.ATTR_AZURE_COSMOSDB_CONNECTION_MODE = exports.ATTR_AZURE_CLIENT_ID = exports.ATTR_AZ_SERVICE_REQUEST_ID = exports.ATTR_AZ_NAMESPACE = exports.ATTR_AWS_STEP_FUNCTIONS_STATE_MACHINE_ARN = exports.ATTR_AWS_STEP_FUNCTIONS_ACTIVITY_ARN = exports.ATTR_AWS_SQS_QUEUE_URL = exports.ATTR_AWS_SNS_TOPIC_ARN = exports.ATTR_AWS_SECRETSMANAGER_SECRET_ARN = exports.ATTR_AWS_S3_UPLOAD_ID = exports.ATTR_AWS_S3_PART_NUMBER = exports.ATTR_AWS_S3_KEY = exports.ATTR_AWS_S3_DELETE = exports.ATTR_AWS_S3_COPY_SOURCE = void 0;
    exports.CLOUD_PLATFORM_VALUE_AWS_ELASTIC_BEANSTALK = exports.CLOUD_PLATFORM_VALUE_AWS_EKS = exports.CLOUD_PLATFORM_VALUE_AWS_ECS = exports.CLOUD_PLATFORM_VALUE_AWS_EC2 = exports.CLOUD_PLATFORM_VALUE_AWS_APP_RUNNER = exports.CLOUD_PLATFORM_VALUE_ALIBABA_CLOUD_OPENSHIFT = exports.CLOUD_PLATFORM_VALUE_ALIBABA_CLOUD_FC = exports.CLOUD_PLATFORM_VALUE_ALIBABA_CLOUD_ECS = exports.ATTR_CLOUD_PLATFORM = exports.ATTR_CLOUD_AVAILABILITY_ZONE = exports.ATTR_CLOUD_ACCOUNT_ID = exports.ATTR_CICD_WORKER_URL_FULL = exports.CICD_WORKER_STATE_VALUE_OFFLINE = exports.CICD_WORKER_STATE_VALUE_BUSY = exports.CICD_WORKER_STATE_VALUE_AVAILABLE = exports.ATTR_CICD_WORKER_STATE = exports.ATTR_CICD_WORKER_NAME = exports.ATTR_CICD_WORKER_ID = exports.ATTR_CICD_SYSTEM_COMPONENT = exports.CICD_PIPELINE_TASK_TYPE_VALUE_TEST = exports.CICD_PIPELINE_TASK_TYPE_VALUE_DEPLOY = exports.CICD_PIPELINE_TASK_TYPE_VALUE_BUILD = exports.ATTR_CICD_PIPELINE_TASK_TYPE = exports.ATTR_CICD_PIPELINE_TASK_RUN_URL_FULL = exports.CICD_PIPELINE_TASK_RUN_RESULT_VALUE_TIMEOUT = exports.CICD_PIPELINE_TASK_RUN_RESULT_VALUE_SUCCESS = exports.CICD_PIPELINE_TASK_RUN_RESULT_VALUE_SKIP = exports.CICD_PIPELINE_TASK_RUN_RESULT_VALUE_FAILURE = exports.CICD_PIPELINE_TASK_RUN_RESULT_VALUE_ERROR = exports.CICD_PIPELINE_TASK_RUN_RESULT_VALUE_CANCELLATION = exports.ATTR_CICD_PIPELINE_TASK_RUN_RESULT = exports.ATTR_CICD_PIPELINE_TASK_RUN_ID = exports.ATTR_CICD_PIPELINE_TASK_NAME = exports.ATTR_CICD_PIPELINE_RUN_URL_FULL = exports.CICD_PIPELINE_RUN_STATE_VALUE_PENDING = exports.CICD_PIPELINE_RUN_STATE_VALUE_FINALIZING = exports.CICD_PIPELINE_RUN_STATE_VALUE_EXECUTING = exports.ATTR_CICD_PIPELINE_RUN_STATE = exports.ATTR_CICD_PIPELINE_RUN_ID = exports.CICD_PIPELINE_RESULT_VALUE_TIMEOUT = exports.CICD_PIPELINE_RESULT_VALUE_SUCCESS = exports.CICD_PIPELINE_RESULT_VALUE_SKIP = exports.CICD_PIPELINE_RESULT_VALUE_FAILURE = exports.CICD_PIPELINE_RESULT_VALUE_ERROR = exports.CICD_PIPELINE_RESULT_VALUE_CANCELLATION = exports.ATTR_CICD_PIPELINE_RESULT = exports.ATTR_CICD_PIPELINE_NAME = exports.CICD_PIPELINE_ACTION_NAME_VALUE_SYNC = exports.CICD_PIPELINE_ACTION_NAME_VALUE_RUN = exports.CICD_PIPELINE_ACTION_NAME_VALUE_BUILD = void 0;
    exports.ATTR_CODE_COLUMN = exports.ATTR_CLOUDFOUNDRY_SYSTEM_INSTANCE_ID = exports.ATTR_CLOUDFOUNDRY_SYSTEM_ID = exports.ATTR_CLOUDFOUNDRY_SPACE_NAME = exports.ATTR_CLOUDFOUNDRY_SPACE_ID = exports.ATTR_CLOUDFOUNDRY_PROCESS_TYPE = exports.ATTR_CLOUDFOUNDRY_PROCESS_ID = exports.ATTR_CLOUDFOUNDRY_ORG_NAME = exports.ATTR_CLOUDFOUNDRY_ORG_ID = exports.ATTR_CLOUDFOUNDRY_APP_NAME = exports.ATTR_CLOUDFOUNDRY_APP_INSTANCE_ID = exports.ATTR_CLOUDFOUNDRY_APP_ID = exports.ATTR_CLOUDEVENTS_EVENT_TYPE = exports.ATTR_CLOUDEVENTS_EVENT_SUBJECT = exports.ATTR_CLOUDEVENTS_EVENT_SPEC_VERSION = exports.ATTR_CLOUDEVENTS_EVENT_SOURCE = exports.ATTR_CLOUDEVENTS_EVENT_ID = exports.ATTR_CLOUD_RESOURCE_ID = exports.ATTR_CLOUD_REGION = exports.CLOUD_PROVIDER_VALUE_TENCENT_CLOUD = exports.CLOUD_PROVIDER_VALUE_ORACLE_CLOUD = exports.CLOUD_PROVIDER_VALUE_IBM_CLOUD = exports.CLOUD_PROVIDER_VALUE_HEROKU = exports.CLOUD_PROVIDER_VALUE_GCP = exports.CLOUD_PROVIDER_VALUE_AZURE = exports.CLOUD_PROVIDER_VALUE_AWS = exports.CLOUD_PROVIDER_VALUE_ALIBABA_CLOUD = exports.ATTR_CLOUD_PROVIDER = exports.CLOUD_PLATFORM_VALUE_TENCENT_CLOUD_SCF = exports.CLOUD_PLATFORM_VALUE_TENCENT_CLOUD_EKS = exports.CLOUD_PLATFORM_VALUE_TENCENT_CLOUD_CVM = exports.CLOUD_PLATFORM_VALUE_ORACLE_CLOUD_OKE = exports.CLOUD_PLATFORM_VALUE_ORACLE_CLOUD_COMPUTE = exports.CLOUD_PLATFORM_VALUE_IBM_CLOUD_OPENSHIFT = exports.CLOUD_PLATFORM_VALUE_GCP_OPENSHIFT = exports.CLOUD_PLATFORM_VALUE_GCP_KUBERNETES_ENGINE = exports.CLOUD_PLATFORM_VALUE_GCP_COMPUTE_ENGINE = exports.CLOUD_PLATFORM_VALUE_GCP_CLOUD_RUN = exports.CLOUD_PLATFORM_VALUE_GCP_CLOUD_FUNCTIONS = exports.CLOUD_PLATFORM_VALUE_GCP_BARE_METAL_SOLUTION = exports.CLOUD_PLATFORM_VALUE_GCP_APP_ENGINE = exports.CLOUD_PLATFORM_VALUE_AZURE_VM = exports.CLOUD_PLATFORM_VALUE_AZURE_OPENSHIFT = exports.CLOUD_PLATFORM_VALUE_AZURE_FUNCTIONS = exports.CLOUD_PLATFORM_VALUE_AZURE_CONTAINER_INSTANCES = exports.CLOUD_PLATFORM_VALUE_AZURE_CONTAINER_APPS = exports.CLOUD_PLATFORM_VALUE_AZURE_APP_SERVICE = exports.CLOUD_PLATFORM_VALUE_AZURE_AKS = exports.CLOUD_PLATFORM_VALUE_AWS_OPENSHIFT = exports.CLOUD_PLATFORM_VALUE_AWS_LAMBDA = void 0;
    exports.DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_THREE = exports.DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_SERIAL = exports.DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_QUORUM = exports.DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_ONE = exports.DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_SERIAL = exports.DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_QUORUM = exports.DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_ONE = exports.DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_EACH_QUORUM = exports.DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_ANY = exports.DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_ALL = exports.ATTR_DB_CASSANDRA_CONSISTENCY_LEVEL = exports.CPYTHON_GC_GENERATION_VALUE_GENERATION_2 = exports.CPYTHON_GC_GENERATION_VALUE_GENERATION_1 = exports.CPYTHON_GC_GENERATION_VALUE_GENERATION_0 = exports.ATTR_CPYTHON_GC_GENERATION = exports.CPU_MODE_VALUE_USER = exports.CPU_MODE_VALUE_SYSTEM = exports.CPU_MODE_VALUE_STEAL = exports.CPU_MODE_VALUE_NICE = exports.CPU_MODE_VALUE_KERNEL = exports.CPU_MODE_VALUE_IOWAIT = exports.CPU_MODE_VALUE_INTERRUPT = exports.CPU_MODE_VALUE_IDLE = exports.ATTR_CPU_MODE = exports.ATTR_CPU_LOGICAL_NUMBER = exports.ATTR_CONTAINER_RUNTIME_VERSION = exports.ATTR_CONTAINER_RUNTIME_NAME = exports.ATTR_CONTAINER_RUNTIME_DESCRIPTION = exports.ATTR_CONTAINER_RUNTIME = exports.ATTR_CONTAINER_NAME = exports.ATTR_CONTAINER_LABELS = exports.ATTR_CONTAINER_LABEL = exports.ATTR_CONTAINER_IMAGE_TAGS = exports.ATTR_CONTAINER_IMAGE_REPO_DIGESTS = exports.ATTR_CONTAINER_IMAGE_NAME = exports.ATTR_CONTAINER_IMAGE_ID = exports.ATTR_CONTAINER_ID = exports.ATTR_CONTAINER_CSI_VOLUME_ID = exports.ATTR_CONTAINER_CSI_PLUGIN_NAME = exports.CONTAINER_CPU_STATE_VALUE_USER = exports.CONTAINER_CPU_STATE_VALUE_SYSTEM = exports.CONTAINER_CPU_STATE_VALUE_KERNEL = exports.ATTR_CONTAINER_CPU_STATE = exports.ATTR_CONTAINER_COMMAND_LINE = exports.ATTR_CONTAINER_COMMAND_ARGS = exports.ATTR_CONTAINER_COMMAND = exports.ATTR_CODE_NAMESPACE = exports.ATTR_CODE_LINENO = exports.ATTR_CODE_FUNCTION = exports.ATTR_CODE_FILEPATH = void 0;
    exports.ATTR_DB_ELASTICSEARCH_NODE_NAME = exports.ATTR_DB_ELASTICSEARCH_CLUSTER_NAME = exports.ATTR_DB_COSMOSDB_SUB_STATUS_CODE = exports.ATTR_DB_COSMOSDB_STATUS_CODE = exports.ATTR_DB_COSMOSDB_REQUEST_CONTENT_LENGTH = exports.ATTR_DB_COSMOSDB_REQUEST_CHARGE = exports.ATTR_DB_COSMOSDB_REGIONS_CONTACTED = exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_UPSERT = exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_REPLACE = exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_READ_FEED = exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_READ = exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_QUERY_PLAN = exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_QUERY = exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_PATCH = exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_INVALID = exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_HEAD_FEED = exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_HEAD = exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_EXECUTE_JAVASCRIPT = exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_EXECUTE = exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_DELETE = exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_CREATE = exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_BATCH = exports.ATTR_DB_COSMOSDB_OPERATION_TYPE = exports.ATTR_DB_COSMOSDB_CONTAINER = exports.DB_COSMOSDB_CONSISTENCY_LEVEL_VALUE_STRONG = exports.DB_COSMOSDB_CONSISTENCY_LEVEL_VALUE_SESSION = exports.DB_COSMOSDB_CONSISTENCY_LEVEL_VALUE_EVENTUAL = exports.DB_COSMOSDB_CONSISTENCY_LEVEL_VALUE_CONSISTENT_PREFIX = exports.DB_COSMOSDB_CONSISTENCY_LEVEL_VALUE_BOUNDED_STALENESS = exports.ATTR_DB_COSMOSDB_CONSISTENCY_LEVEL = exports.DB_COSMOSDB_CONNECTION_MODE_VALUE_GATEWAY = exports.DB_COSMOSDB_CONNECTION_MODE_VALUE_DIRECT = exports.ATTR_DB_COSMOSDB_CONNECTION_MODE = exports.ATTR_DB_COSMOSDB_CLIENT_ID = exports.ATTR_DB_CONNECTION_STRING = exports.DB_CLIENT_CONNECTIONS_STATE_VALUE_USED = exports.DB_CLIENT_CONNECTIONS_STATE_VALUE_IDLE = exports.ATTR_DB_CLIENT_CONNECTIONS_STATE = exports.ATTR_DB_CLIENT_CONNECTIONS_POOL_NAME = exports.DB_CLIENT_CONNECTION_STATE_VALUE_USED = exports.DB_CLIENT_CONNECTION_STATE_VALUE_IDLE = exports.ATTR_DB_CLIENT_CONNECTION_STATE = exports.ATTR_DB_CLIENT_CONNECTION_POOL_NAME = exports.ATTR_DB_CASSANDRA_TABLE = exports.ATTR_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = exports.ATTR_DB_CASSANDRA_PAGE_SIZE = exports.ATTR_DB_CASSANDRA_IDEMPOTENCE = exports.ATTR_DB_CASSANDRA_COORDINATOR_ID = exports.ATTR_DB_CASSANDRA_COORDINATOR_DC = exports.DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_TWO = void 0;
    exports.DB_SYSTEM_VALUE_MSSQLCOMPACT = exports.DB_SYSTEM_VALUE_MSSQL = exports.DB_SYSTEM_VALUE_MONGODB = exports.DB_SYSTEM_VALUE_MEMCACHED = exports.DB_SYSTEM_VALUE_MAXDB = exports.DB_SYSTEM_VALUE_MARIADB = exports.DB_SYSTEM_VALUE_INTERSYSTEMS_CACHE = exports.DB_SYSTEM_VALUE_INTERBASE = exports.DB_SYSTEM_VALUE_INSTANTDB = exports.DB_SYSTEM_VALUE_INGRES = exports.DB_SYSTEM_VALUE_INFORMIX = exports.DB_SYSTEM_VALUE_INFLUXDB = exports.DB_SYSTEM_VALUE_HSQLDB = exports.DB_SYSTEM_VALUE_HIVE = exports.DB_SYSTEM_VALUE_HBASE = exports.DB_SYSTEM_VALUE_HANADB = exports.DB_SYSTEM_VALUE_H2 = exports.DB_SYSTEM_VALUE_GEODE = exports.DB_SYSTEM_VALUE_FIRSTSQL = exports.DB_SYSTEM_VALUE_FIREBIRD = exports.DB_SYSTEM_VALUE_FILEMAKER = exports.DB_SYSTEM_VALUE_ELASTICSEARCH = exports.DB_SYSTEM_VALUE_EDB = exports.DB_SYSTEM_VALUE_DYNAMODB = exports.DB_SYSTEM_VALUE_DERBY = exports.DB_SYSTEM_VALUE_DB2 = exports.DB_SYSTEM_VALUE_COUCHDB = exports.DB_SYSTEM_VALUE_COUCHBASE = exports.DB_SYSTEM_VALUE_COSMOSDB = exports.DB_SYSTEM_VALUE_COLDFUSION = exports.DB_SYSTEM_VALUE_COCKROACHDB = exports.DB_SYSTEM_VALUE_CLOUDSCAPE = exports.DB_SYSTEM_VALUE_CLICKHOUSE = exports.DB_SYSTEM_VALUE_CASSANDRA = exports.DB_SYSTEM_VALUE_CACHE = exports.DB_SYSTEM_VALUE_ADABAS = exports.ATTR_DB_SYSTEM = exports.ATTR_DB_STATEMENT = exports.ATTR_DB_SQL_TABLE = exports.ATTR_DB_RESPONSE_RETURNED_ROWS = exports.ATTR_DB_REDIS_DATABASE_INDEX = exports.ATTR_DB_QUERY_PARAMETER = exports.ATTR_DB_OPERATION_PARAMETER = exports.ATTR_DB_OPERATION = exports.ATTR_DB_NAME = exports.ATTR_DB_MSSQL_INSTANCE_NAME = exports.ATTR_DB_MONGODB_COLLECTION = exports.ATTR_DB_JDBC_DRIVER_CLASSNAME = exports.ATTR_DB_INSTANCE_ID = exports.ATTR_DB_ELASTICSEARCH_PATH_PARTS = void 0;
    exports.DB_SYSTEM_NAME_VALUE_SAP_HANA = exports.DB_SYSTEM_NAME_VALUE_REDIS = exports.DB_SYSTEM_NAME_VALUE_OTHER_SQL = exports.DB_SYSTEM_NAME_VALUE_ORACLE_DB = exports.DB_SYSTEM_NAME_VALUE_OPENSEARCH = exports.DB_SYSTEM_NAME_VALUE_NEO4J = exports.DB_SYSTEM_NAME_VALUE_MONGODB = exports.DB_SYSTEM_NAME_VALUE_MEMCACHED = exports.DB_SYSTEM_NAME_VALUE_INTERSYSTEMS_CACHE = exports.DB_SYSTEM_NAME_VALUE_INSTANTDB = exports.DB_SYSTEM_NAME_VALUE_INFLUXDB = exports.DB_SYSTEM_NAME_VALUE_IBM_NETEZZA = exports.DB_SYSTEM_NAME_VALUE_IBM_INFORMIX = exports.DB_SYSTEM_NAME_VALUE_IBM_DB2 = exports.DB_SYSTEM_NAME_VALUE_HSQLDB = exports.DB_SYSTEM_NAME_VALUE_HIVE = exports.DB_SYSTEM_NAME_VALUE_HBASE = exports.DB_SYSTEM_NAME_VALUE_H2DATABASE = exports.DB_SYSTEM_NAME_VALUE_GEODE = exports.DB_SYSTEM_NAME_VALUE_GCP_SPANNER = exports.DB_SYSTEM_NAME_VALUE_FIREBIRDSQL = exports.DB_SYSTEM_NAME_VALUE_ELASTICSEARCH = exports.DB_SYSTEM_NAME_VALUE_DERBY = exports.DB_SYSTEM_NAME_VALUE_COUCHDB = exports.DB_SYSTEM_NAME_VALUE_COUCHBASE = exports.DB_SYSTEM_NAME_VALUE_COCKROACHDB = exports.DB_SYSTEM_NAME_VALUE_CLICKHOUSE = exports.DB_SYSTEM_NAME_VALUE_CASSANDRA = exports.DB_SYSTEM_NAME_VALUE_AZURE_COSMOSDB = exports.DB_SYSTEM_NAME_VALUE_AWS_REDSHIFT = exports.DB_SYSTEM_NAME_VALUE_AWS_DYNAMODB = exports.DB_SYSTEM_NAME_VALUE_ACTIAN_INGRES = exports.DB_SYSTEM_VALUE_VERTICA = exports.DB_SYSTEM_VALUE_TRINO = exports.DB_SYSTEM_VALUE_TERADATA = exports.DB_SYSTEM_VALUE_SYBASE = exports.DB_SYSTEM_VALUE_SQLITE = exports.DB_SYSTEM_VALUE_SPANNER = exports.DB_SYSTEM_VALUE_REDSHIFT = exports.DB_SYSTEM_VALUE_REDIS = exports.DB_SYSTEM_VALUE_PROGRESS = exports.DB_SYSTEM_VALUE_POSTGRESQL = exports.DB_SYSTEM_VALUE_POINTBASE = exports.DB_SYSTEM_VALUE_PERVASIVE = exports.DB_SYSTEM_VALUE_OTHER_SQL = exports.DB_SYSTEM_VALUE_ORACLE = exports.DB_SYSTEM_VALUE_OPENSEARCH = exports.DB_SYSTEM_VALUE_NETEZZA = exports.DB_SYSTEM_VALUE_NEO4J = exports.DB_SYSTEM_VALUE_MYSQL = void 0;
    exports.ATTR_FAAS_INVOKED_REGION = exports.FAAS_INVOKED_PROVIDER_VALUE_TENCENT_CLOUD = exports.FAAS_INVOKED_PROVIDER_VALUE_GCP = exports.FAAS_INVOKED_PROVIDER_VALUE_AZURE = exports.FAAS_INVOKED_PROVIDER_VALUE_AWS = exports.FAAS_INVOKED_PROVIDER_VALUE_ALIBABA_CLOUD = exports.ATTR_FAAS_INVOKED_PROVIDER = exports.ATTR_FAAS_INVOKED_NAME = exports.ATTR_FAAS_INVOCATION_ID = exports.ATTR_FAAS_INSTANCE = exports.ATTR_FAAS_DOCUMENT_TIME = exports.FAAS_DOCUMENT_OPERATION_VALUE_INSERT = exports.FAAS_DOCUMENT_OPERATION_VALUE_EDIT = exports.FAAS_DOCUMENT_OPERATION_VALUE_DELETE = exports.ATTR_FAAS_DOCUMENT_OPERATION = exports.ATTR_FAAS_DOCUMENT_NAME = exports.ATTR_FAAS_DOCUMENT_COLLECTION = exports.ATTR_FAAS_CRON = exports.ATTR_FAAS_COLDSTART = exports.ATTR_EVENT_NAME = exports.ATTR_ERROR_MESSAGE = exports.ATTR_ENDUSER_SCOPE = exports.ATTR_ENDUSER_ROLE = exports.ATTR_ENDUSER_PSEUDO_ID = exports.ATTR_ENDUSER_ID = exports.ATTR_ELASTICSEARCH_NODE_NAME = exports.ATTR_DNS_QUESTION_NAME = exports.ATTR_DNS_ANSWERS = exports.DISK_IO_DIRECTION_VALUE_WRITE = exports.DISK_IO_DIRECTION_VALUE_READ = exports.ATTR_DISK_IO_DIRECTION = exports.ATTR_DEVICE_MODEL_NAME = exports.ATTR_DEVICE_MODEL_IDENTIFIER = exports.ATTR_DEVICE_MANUFACTURER = exports.ATTR_DEVICE_ID = exports.ATTR_DESTINATION_PORT = exports.ATTR_DESTINATION_ADDRESS = exports.DEPLOYMENT_STATUS_VALUE_SUCCEEDED = exports.DEPLOYMENT_STATUS_VALUE_FAILED = exports.ATTR_DEPLOYMENT_STATUS = exports.ATTR_DEPLOYMENT_NAME = exports.ATTR_DEPLOYMENT_ID = exports.ATTR_DEPLOYMENT_ENVIRONMENT_NAME = exports.ATTR_DEPLOYMENT_ENVIRONMENT = exports.ATTR_DB_USER = exports.DB_SYSTEM_NAME_VALUE_TRINO = exports.DB_SYSTEM_NAME_VALUE_TERADATA = exports.DB_SYSTEM_NAME_VALUE_SQLITE = exports.DB_SYSTEM_NAME_VALUE_SOFTWAREAG_ADABAS = exports.DB_SYSTEM_NAME_VALUE_SAP_MAXDB = void 0;
    exports.ATTR_FILE_MODE = exports.ATTR_FILE_INODE = exports.ATTR_FILE_GROUP_NAME = exports.ATTR_FILE_GROUP_ID = exports.ATTR_FILE_FORK_NAME = exports.ATTR_FILE_EXTENSION = exports.ATTR_FILE_DIRECTORY = exports.ATTR_FILE_CREATED = exports.ATTR_FILE_CHANGED = exports.ATTR_FILE_ATTRIBUTES = exports.ATTR_FILE_ACCESSED = exports.ATTR_FEATURE_FLAG_VERSION = exports.ATTR_FEATURE_FLAG_VARIANT = exports.ATTR_FEATURE_FLAG_SET_ID = exports.ATTR_FEATURE_FLAG_RESULT_VARIANT = exports.ATTR_FEATURE_FLAG_RESULT_VALUE = exports.FEATURE_FLAG_RESULT_REASON_VALUE_UNKNOWN = exports.FEATURE_FLAG_RESULT_REASON_VALUE_TARGETING_MATCH = exports.FEATURE_FLAG_RESULT_REASON_VALUE_STATIC = exports.FEATURE_FLAG_RESULT_REASON_VALUE_STALE = exports.FEATURE_FLAG_RESULT_REASON_VALUE_SPLIT = exports.FEATURE_FLAG_RESULT_REASON_VALUE_ERROR = exports.FEATURE_FLAG_RESULT_REASON_VALUE_DISABLED = exports.FEATURE_FLAG_RESULT_REASON_VALUE_DEFAULT = exports.FEATURE_FLAG_RESULT_REASON_VALUE_CACHED = exports.ATTR_FEATURE_FLAG_RESULT_REASON = exports.ATTR_FEATURE_FLAG_PROVIDER_NAME = exports.ATTR_FEATURE_FLAG_KEY = exports.FEATURE_FLAG_EVALUATION_REASON_VALUE_UNKNOWN = exports.FEATURE_FLAG_EVALUATION_REASON_VALUE_TARGETING_MATCH = exports.FEATURE_FLAG_EVALUATION_REASON_VALUE_STATIC = exports.FEATURE_FLAG_EVALUATION_REASON_VALUE_STALE = exports.FEATURE_FLAG_EVALUATION_REASON_VALUE_SPLIT = exports.FEATURE_FLAG_EVALUATION_REASON_VALUE_ERROR = exports.FEATURE_FLAG_EVALUATION_REASON_VALUE_DISABLED = exports.FEATURE_FLAG_EVALUATION_REASON_VALUE_DEFAULT = exports.FEATURE_FLAG_EVALUATION_REASON_VALUE_CACHED = exports.ATTR_FEATURE_FLAG_EVALUATION_REASON = exports.ATTR_FEATURE_FLAG_EVALUATION_ERROR_MESSAGE = exports.ATTR_FEATURE_FLAG_CONTEXT_ID = exports.ATTR_FAAS_VERSION = exports.FAAS_TRIGGER_VALUE_TIMER = exports.FAAS_TRIGGER_VALUE_PUBSUB = exports.FAAS_TRIGGER_VALUE_OTHER = exports.FAAS_TRIGGER_VALUE_HTTP = exports.FAAS_TRIGGER_VALUE_DATASOURCE = exports.ATTR_FAAS_TRIGGER = exports.ATTR_FAAS_TIME = exports.ATTR_FAAS_NAME = exports.ATTR_FAAS_MAX_MEMORY = void 0;
    exports.GCP_APPHUB_DESTINATION_WORKLOAD_CRITICALITY_TYPE_VALUE_MEDIUM = exports.GCP_APPHUB_DESTINATION_WORKLOAD_CRITICALITY_TYPE_VALUE_LOW = exports.GCP_APPHUB_DESTINATION_WORKLOAD_CRITICALITY_TYPE_VALUE_HIGH = exports.ATTR_GCP_APPHUB_DESTINATION_WORKLOAD_CRITICALITY_TYPE = exports.ATTR_GCP_APPHUB_DESTINATION_SERVICE_ID = exports.GCP_APPHUB_DESTINATION_SERVICE_ENVIRONMENT_TYPE_VALUE_TEST = exports.GCP_APPHUB_DESTINATION_SERVICE_ENVIRONMENT_TYPE_VALUE_STAGING = exports.GCP_APPHUB_DESTINATION_SERVICE_ENVIRONMENT_TYPE_VALUE_PRODUCTION = exports.GCP_APPHUB_DESTINATION_SERVICE_ENVIRONMENT_TYPE_VALUE_DEVELOPMENT = exports.ATTR_GCP_APPHUB_DESTINATION_SERVICE_ENVIRONMENT_TYPE = exports.GCP_APPHUB_DESTINATION_SERVICE_CRITICALITY_TYPE_VALUE_MISSION_CRITICAL = exports.GCP_APPHUB_DESTINATION_SERVICE_CRITICALITY_TYPE_VALUE_MEDIUM = exports.GCP_APPHUB_DESTINATION_SERVICE_CRITICALITY_TYPE_VALUE_LOW = exports.GCP_APPHUB_DESTINATION_SERVICE_CRITICALITY_TYPE_VALUE_HIGH = exports.ATTR_GCP_APPHUB_DESTINATION_SERVICE_CRITICALITY_TYPE = exports.ATTR_GCP_APPHUB_DESTINATION_APPLICATION_LOCATION = exports.ATTR_GCP_APPHUB_DESTINATION_APPLICATION_ID = exports.ATTR_GCP_APPHUB_DESTINATION_APPLICATION_CONTAINER = exports.ATTR_GCP_APPHUB_WORKLOAD_ID = exports.GCP_APPHUB_WORKLOAD_ENVIRONMENT_TYPE_VALUE_TEST = exports.GCP_APPHUB_WORKLOAD_ENVIRONMENT_TYPE_VALUE_STAGING = exports.GCP_APPHUB_WORKLOAD_ENVIRONMENT_TYPE_VALUE_PRODUCTION = exports.GCP_APPHUB_WORKLOAD_ENVIRONMENT_TYPE_VALUE_DEVELOPMENT = exports.ATTR_GCP_APPHUB_WORKLOAD_ENVIRONMENT_TYPE = exports.GCP_APPHUB_WORKLOAD_CRITICALITY_TYPE_VALUE_MISSION_CRITICAL = exports.GCP_APPHUB_WORKLOAD_CRITICALITY_TYPE_VALUE_MEDIUM = exports.GCP_APPHUB_WORKLOAD_CRITICALITY_TYPE_VALUE_LOW = exports.GCP_APPHUB_WORKLOAD_CRITICALITY_TYPE_VALUE_HIGH = exports.ATTR_GCP_APPHUB_WORKLOAD_CRITICALITY_TYPE = exports.ATTR_GCP_APPHUB_SERVICE_ID = exports.GCP_APPHUB_SERVICE_ENVIRONMENT_TYPE_VALUE_TEST = exports.GCP_APPHUB_SERVICE_ENVIRONMENT_TYPE_VALUE_STAGING = exports.GCP_APPHUB_SERVICE_ENVIRONMENT_TYPE_VALUE_PRODUCTION = exports.GCP_APPHUB_SERVICE_ENVIRONMENT_TYPE_VALUE_DEVELOPMENT = exports.ATTR_GCP_APPHUB_SERVICE_ENVIRONMENT_TYPE = exports.GCP_APPHUB_SERVICE_CRITICALITY_TYPE_VALUE_MISSION_CRITICAL = exports.GCP_APPHUB_SERVICE_CRITICALITY_TYPE_VALUE_MEDIUM = exports.GCP_APPHUB_SERVICE_CRITICALITY_TYPE_VALUE_LOW = exports.GCP_APPHUB_SERVICE_CRITICALITY_TYPE_VALUE_HIGH = exports.ATTR_GCP_APPHUB_SERVICE_CRITICALITY_TYPE = exports.ATTR_GCP_APPHUB_APPLICATION_LOCATION = exports.ATTR_GCP_APPHUB_APPLICATION_ID = exports.ATTR_GCP_APPHUB_APPLICATION_CONTAINER = exports.ATTR_FILE_SYMBOLIC_LINK_TARGET_PATH = exports.ATTR_FILE_SIZE = exports.ATTR_FILE_PATH = exports.ATTR_FILE_OWNER_NAME = exports.ATTR_FILE_OWNER_ID = exports.ATTR_FILE_NAME = exports.ATTR_FILE_MODIFIED = void 0;
    exports.ATTR_GEN_AI_PROVIDER_NAME = exports.ATTR_GEN_AI_PROMPT = exports.GEN_AI_OUTPUT_TYPE_VALUE_TEXT = exports.GEN_AI_OUTPUT_TYPE_VALUE_SPEECH = exports.GEN_AI_OUTPUT_TYPE_VALUE_JSON = exports.GEN_AI_OUTPUT_TYPE_VALUE_IMAGE = exports.ATTR_GEN_AI_OUTPUT_TYPE = exports.ATTR_GEN_AI_OUTPUT_MESSAGES = exports.GEN_AI_OPERATION_NAME_VALUE_TEXT_COMPLETION = exports.GEN_AI_OPERATION_NAME_VALUE_INVOKE_AGENT = exports.GEN_AI_OPERATION_NAME_VALUE_GENERATE_CONTENT = exports.GEN_AI_OPERATION_NAME_VALUE_EXECUTE_TOOL = exports.GEN_AI_OPERATION_NAME_VALUE_EMBEDDINGS = exports.GEN_AI_OPERATION_NAME_VALUE_CREATE_AGENT = exports.GEN_AI_OPERATION_NAME_VALUE_CHAT = exports.ATTR_GEN_AI_OPERATION_NAME = exports.ATTR_GEN_AI_OPENAI_RESPONSE_SYSTEM_FINGERPRINT = exports.ATTR_GEN_AI_OPENAI_RESPONSE_SERVICE_TIER = exports.GEN_AI_OPENAI_REQUEST_SERVICE_TIER_VALUE_DEFAULT = exports.GEN_AI_OPENAI_REQUEST_SERVICE_TIER_VALUE_AUTO = exports.ATTR_GEN_AI_OPENAI_REQUEST_SERVICE_TIER = exports.ATTR_GEN_AI_OPENAI_REQUEST_SEED = exports.GEN_AI_OPENAI_REQUEST_RESPONSE_FORMAT_VALUE_TEXT = exports.GEN_AI_OPENAI_REQUEST_RESPONSE_FORMAT_VALUE_JSON_SCHEMA = exports.GEN_AI_OPENAI_REQUEST_RESPONSE_FORMAT_VALUE_JSON_OBJECT = exports.ATTR_GEN_AI_OPENAI_REQUEST_RESPONSE_FORMAT = exports.ATTR_GEN_AI_INPUT_MESSAGES = exports.ATTR_GEN_AI_EVALUATION_SCORE_VALUE = exports.ATTR_GEN_AI_EVALUATION_SCORE_LABEL = exports.ATTR_GEN_AI_EVALUATION_NAME = exports.ATTR_GEN_AI_EVALUATION_EXPLANATION = exports.ATTR_GEN_AI_EMBEDDINGS_DIMENSION_COUNT = exports.ATTR_GEN_AI_DATA_SOURCE_ID = exports.ATTR_GEN_AI_CONVERSATION_ID = exports.ATTR_GEN_AI_COMPLETION = exports.ATTR_GEN_AI_AGENT_NAME = exports.ATTR_GEN_AI_AGENT_ID = exports.ATTR_GEN_AI_AGENT_DESCRIPTION = exports.ATTR_GCP_GCE_INSTANCE_NAME = exports.ATTR_GCP_GCE_INSTANCE_HOSTNAME = exports.ATTR_GCP_CLOUD_RUN_JOB_TASK_INDEX = exports.ATTR_GCP_CLOUD_RUN_JOB_EXECUTION = exports.ATTR_GCP_CLIENT_SERVICE = exports.ATTR_GCP_APPHUB_DESTINATION_WORKLOAD_ID = exports.GCP_APPHUB_DESTINATION_WORKLOAD_ENVIRONMENT_TYPE_VALUE_TEST = exports.GCP_APPHUB_DESTINATION_WORKLOAD_ENVIRONMENT_TYPE_VALUE_STAGING = exports.GCP_APPHUB_DESTINATION_WORKLOAD_ENVIRONMENT_TYPE_VALUE_PRODUCTION = exports.GCP_APPHUB_DESTINATION_WORKLOAD_ENVIRONMENT_TYPE_VALUE_DEVELOPMENT = exports.ATTR_GCP_APPHUB_DESTINATION_WORKLOAD_ENVIRONMENT_TYPE = exports.GCP_APPHUB_DESTINATION_WORKLOAD_CRITICALITY_TYPE_VALUE_MISSION_CRITICAL = void 0;
    exports.ATTR_GEN_AI_SYSTEM_INSTRUCTIONS = exports.GEN_AI_SYSTEM_VALUE_XAI = exports.GEN_AI_SYSTEM_VALUE_VERTEX_AI = exports.GEN_AI_SYSTEM_VALUE_PERPLEXITY = exports.GEN_AI_SYSTEM_VALUE_OPENAI = exports.GEN_AI_SYSTEM_VALUE_MISTRAL_AI = exports.GEN_AI_SYSTEM_VALUE_IBM_WATSONX_AI = exports.GEN_AI_SYSTEM_VALUE_GROQ = exports.GEN_AI_SYSTEM_VALUE_GEMINI = exports.GEN_AI_SYSTEM_VALUE_GCP_VERTEX_AI = exports.GEN_AI_SYSTEM_VALUE_GCP_GEN_AI = exports.GEN_AI_SYSTEM_VALUE_GCP_GEMINI = exports.GEN_AI_SYSTEM_VALUE_DEEPSEEK = exports.GEN_AI_SYSTEM_VALUE_COHERE = exports.GEN_AI_SYSTEM_VALUE_AZURE_AI_OPENAI = exports.GEN_AI_SYSTEM_VALUE_AZURE_AI_INFERENCE = exports.GEN_AI_SYSTEM_VALUE_AZ_AI_OPENAI = exports.GEN_AI_SYSTEM_VALUE_AZ_AI_INFERENCE = exports.GEN_AI_SYSTEM_VALUE_AWS_BEDROCK = exports.GEN_AI_SYSTEM_VALUE_ANTHROPIC = exports.ATTR_GEN_AI_SYSTEM = exports.ATTR_GEN_AI_RESPONSE_MODEL = exports.ATTR_GEN_AI_RESPONSE_ID = exports.ATTR_GEN_AI_RESPONSE_FINISH_REASONS = exports.ATTR_GEN_AI_REQUEST_TOP_P = exports.ATTR_GEN_AI_REQUEST_TOP_K = exports.ATTR_GEN_AI_REQUEST_TEMPERATURE = exports.ATTR_GEN_AI_REQUEST_STOP_SEQUENCES = exports.ATTR_GEN_AI_REQUEST_SEED = exports.ATTR_GEN_AI_REQUEST_PRESENCE_PENALTY = exports.ATTR_GEN_AI_REQUEST_MODEL = exports.ATTR_GEN_AI_REQUEST_MAX_TOKENS = exports.ATTR_GEN_AI_REQUEST_FREQUENCY_PENALTY = exports.ATTR_GEN_AI_REQUEST_ENCODING_FORMATS = exports.ATTR_GEN_AI_REQUEST_CHOICE_COUNT = exports.GEN_AI_PROVIDER_NAME_VALUE_X_AI = exports.GEN_AI_PROVIDER_NAME_VALUE_PERPLEXITY = exports.GEN_AI_PROVIDER_NAME_VALUE_OPENAI = exports.GEN_AI_PROVIDER_NAME_VALUE_MISTRAL_AI = exports.GEN_AI_PROVIDER_NAME_VALUE_IBM_WATSONX_AI = exports.GEN_AI_PROVIDER_NAME_VALUE_GROQ = exports.GEN_AI_PROVIDER_NAME_VALUE_GCP_VERTEX_AI = exports.GEN_AI_PROVIDER_NAME_VALUE_GCP_GEN_AI = exports.GEN_AI_PROVIDER_NAME_VALUE_GCP_GEMINI = exports.GEN_AI_PROVIDER_NAME_VALUE_DEEPSEEK = exports.GEN_AI_PROVIDER_NAME_VALUE_COHERE = exports.GEN_AI_PROVIDER_NAME_VALUE_AZURE_AI_OPENAI = exports.GEN_AI_PROVIDER_NAME_VALUE_AZURE_AI_INFERENCE = exports.GEN_AI_PROVIDER_NAME_VALUE_AWS_BEDROCK = exports.GEN_AI_PROVIDER_NAME_VALUE_ANTHROPIC = void 0;
    exports.HOST_ARCH_VALUE_X86 = exports.HOST_ARCH_VALUE_S390X = exports.HOST_ARCH_VALUE_PPC64 = exports.HOST_ARCH_VALUE_PPC32 = exports.HOST_ARCH_VALUE_IA64 = exports.HOST_ARCH_VALUE_ARM64 = exports.HOST_ARCH_VALUE_ARM32 = exports.HOST_ARCH_VALUE_AMD64 = exports.ATTR_HOST_ARCH = exports.ATTR_HEROKU_RELEASE_CREATION_TIMESTAMP = exports.ATTR_HEROKU_RELEASE_COMMIT = exports.ATTR_HEROKU_APP_ID = exports.GRAPHQL_OPERATION_TYPE_VALUE_SUBSCRIPTION = exports.GRAPHQL_OPERATION_TYPE_VALUE_QUERY = exports.GRAPHQL_OPERATION_TYPE_VALUE_MUTATION = exports.ATTR_GRAPHQL_OPERATION_TYPE = exports.ATTR_GRAPHQL_OPERATION_NAME = exports.ATTR_GRAPHQL_DOCUMENT = exports.GO_MEMORY_TYPE_VALUE_STACK = exports.GO_MEMORY_TYPE_VALUE_OTHER = exports.ATTR_GO_MEMORY_TYPE = exports.ATTR_GEO_REGION_ISO_CODE = exports.ATTR_GEO_POSTAL_CODE = exports.ATTR_GEO_LOCATION_LON = exports.ATTR_GEO_LOCATION_LAT = exports.ATTR_GEO_LOCALITY_NAME = exports.ATTR_GEO_COUNTRY_ISO_CODE = exports.GEO_CONTINENT_CODE_VALUE_SA = exports.GEO_CONTINENT_CODE_VALUE_OC = exports.GEO_CONTINENT_CODE_VALUE_NA = exports.GEO_CONTINENT_CODE_VALUE_EU = exports.GEO_CONTINENT_CODE_VALUE_AS = exports.GEO_CONTINENT_CODE_VALUE_AN = exports.GEO_CONTINENT_CODE_VALUE_AF = exports.ATTR_GEO_CONTINENT_CODE = exports.ATTR_GEN_AI_USAGE_PROMPT_TOKENS = exports.ATTR_GEN_AI_USAGE_OUTPUT_TOKENS = exports.ATTR_GEN_AI_USAGE_INPUT_TOKENS = exports.ATTR_GEN_AI_USAGE_COMPLETION_TOKENS = exports.ATTR_GEN_AI_TOOL_TYPE = exports.ATTR_GEN_AI_TOOL_NAME = exports.ATTR_GEN_AI_TOOL_DESCRIPTION = exports.ATTR_GEN_AI_TOOL_DEFINITIONS = exports.ATTR_GEN_AI_TOOL_CALL_RESULT = exports.ATTR_GEN_AI_TOOL_CALL_ID = exports.ATTR_GEN_AI_TOOL_CALL_ARGUMENTS = exports.GEN_AI_TOKEN_TYPE_VALUE_OUTPUT = exports.GEN_AI_TOKEN_TYPE_VALUE_COMPLETION = exports.GEN_AI_TOKEN_TYPE_VALUE_INPUT = exports.ATTR_GEN_AI_TOKEN_TYPE = void 0;
    exports.ATTR_HW_ENCLOSURE_TYPE = exports.ATTR_HW_DRIVER_VERSION = exports.ATTR_HW_BIOS_VERSION = exports.HW_BATTERY_STATE_VALUE_DISCHARGING = exports.HW_BATTERY_STATE_VALUE_CHARGING = exports.ATTR_HW_BATTERY_STATE = exports.ATTR_HW_BATTERY_CHEMISTRY = exports.ATTR_HW_BATTERY_CAPACITY = exports.ATTR_HTTP_USER_AGENT = exports.ATTR_HTTP_URL = exports.ATTR_HTTP_TARGET = exports.ATTR_HTTP_STATUS_CODE = exports.ATTR_HTTP_SERVER_NAME = exports.ATTR_HTTP_SCHEME = exports.ATTR_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = exports.ATTR_HTTP_RESPONSE_CONTENT_LENGTH = exports.ATTR_HTTP_RESPONSE_SIZE = exports.ATTR_HTTP_RESPONSE_BODY_SIZE = exports.ATTR_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = exports.ATTR_HTTP_REQUEST_CONTENT_LENGTH = exports.ATTR_HTTP_REQUEST_SIZE = exports.HTTP_REQUEST_METHOD_VALUE_QUERY = exports.ATTR_HTTP_REQUEST_BODY_SIZE = exports.ATTR_HTTP_METHOD = exports.ATTR_HTTP_HOST = exports.HTTP_FLAVOR_VALUE_SPDY = exports.HTTP_FLAVOR_VALUE_QUIC = exports.HTTP_FLAVOR_VALUE_HTTP_3_0 = exports.HTTP_FLAVOR_VALUE_HTTP_2_0 = exports.HTTP_FLAVOR_VALUE_HTTP_1_1 = exports.HTTP_FLAVOR_VALUE_HTTP_1_0 = exports.ATTR_HTTP_FLAVOR = exports.HTTP_CONNECTION_STATE_VALUE_IDLE = exports.HTTP_CONNECTION_STATE_VALUE_ACTIVE = exports.ATTR_HTTP_CONNECTION_STATE = exports.ATTR_HTTP_CLIENT_IP = exports.ATTR_HOST_TYPE = exports.ATTR_HOST_NAME = exports.ATTR_HOST_MAC = exports.ATTR_HOST_IP = exports.ATTR_HOST_IMAGE_VERSION = exports.ATTR_HOST_IMAGE_NAME = exports.ATTR_HOST_IMAGE_ID = exports.ATTR_HOST_ID = exports.ATTR_HOST_CPU_VENDOR_ID = exports.ATTR_HOST_CPU_STEPPING = exports.ATTR_HOST_CPU_MODEL_NAME = exports.ATTR_HOST_CPU_MODEL_ID = exports.ATTR_HOST_CPU_FAMILY = exports.ATTR_HOST_CPU_CACHE_L2_SIZE = void 0;
    exports.HW_TYPE_VALUE_LOGICAL_DISK = exports.HW_TYPE_VALUE_GPU = exports.HW_TYPE_VALUE_FAN = exports.HW_TYPE_VALUE_ENCLOSURE = exports.HW_TYPE_VALUE_DISK_CONTROLLER = exports.HW_TYPE_VALUE_CPU = exports.HW_TYPE_VALUE_BATTERY = exports.ATTR_HW_TYPE = exports.HW_TAPE_DRIVE_OPERATION_TYPE_VALUE_UNMOUNT = exports.HW_TAPE_DRIVE_OPERATION_TYPE_VALUE_MOUNT = exports.HW_TAPE_DRIVE_OPERATION_TYPE_VALUE_CLEAN = exports.ATTR_HW_TAPE_DRIVE_OPERATION_TYPE = exports.HW_STATE_VALUE_PREDICTED_FAILURE = exports.HW_STATE_VALUE_OK = exports.HW_STATE_VALUE_NEEDS_CLEANING = exports.HW_STATE_VALUE_FAILED = exports.HW_STATE_VALUE_DEGRADED = exports.ATTR_HW_STATE = exports.ATTR_HW_SERIAL_NUMBER = exports.ATTR_HW_SENSOR_LOCATION = exports.ATTR_HW_PHYSICAL_DISK_TYPE = exports.HW_PHYSICAL_DISK_STATE_VALUE_REMAINING = exports.ATTR_HW_PHYSICAL_DISK_STATE = exports.ATTR_HW_PHYSICAL_DISK_SMART_ATTRIBUTE = exports.ATTR_HW_PARENT = exports.ATTR_HW_NETWORK_PHYSICAL_ADDRESS = exports.ATTR_HW_NETWORK_LOGICAL_ADDRESSES = exports.ATTR_HW_NAME = exports.ATTR_HW_MODEL = exports.ATTR_HW_MEMORY_TYPE = exports.HW_LOGICAL_DISK_STATE_VALUE_USED = exports.HW_LOGICAL_DISK_STATE_VALUE_FREE = exports.ATTR_HW_LOGICAL_DISK_STATE = exports.ATTR_HW_LOGICAL_DISK_RAID_LEVEL = exports.HW_LIMIT_TYPE_VALUE_TURBO = exports.HW_LIMIT_TYPE_VALUE_THROTTLED = exports.HW_LIMIT_TYPE_VALUE_MAX = exports.HW_LIMIT_TYPE_VALUE_LOW_DEGRADED = exports.HW_LIMIT_TYPE_VALUE_LOW_CRITICAL = exports.HW_LIMIT_TYPE_VALUE_HIGH_DEGRADED = exports.HW_LIMIT_TYPE_VALUE_HIGH_CRITICAL = exports.HW_LIMIT_TYPE_VALUE_DEGRADED = exports.HW_LIMIT_TYPE_VALUE_CRITICAL = exports.ATTR_HW_LIMIT_TYPE = exports.ATTR_HW_ID = exports.HW_GPU_TASK_VALUE_GENERAL = exports.HW_GPU_TASK_VALUE_ENCODER = exports.HW_GPU_TASK_VALUE_DECODER = exports.ATTR_HW_GPU_TASK = exports.ATTR_HW_FIRMWARE_VERSION = void 0;
    exports.ATTR_K8S_DEPLOYMENT_ANNOTATION = exports.ATTR_K8S_DAEMONSET_UID = exports.ATTR_K8S_DAEMONSET_NAME = exports.ATTR_K8S_DAEMONSET_LABEL = exports.ATTR_K8S_DAEMONSET_ANNOTATION = exports.ATTR_K8S_CRONJOB_UID = exports.ATTR_K8S_CRONJOB_NAME = exports.ATTR_K8S_CRONJOB_LABEL = exports.ATTR_K8S_CRONJOB_ANNOTATION = exports.K8S_CONTAINER_STATUS_STATE_VALUE_WAITING = exports.K8S_CONTAINER_STATUS_STATE_VALUE_TERMINATED = exports.K8S_CONTAINER_STATUS_STATE_VALUE_RUNNING = exports.ATTR_K8S_CONTAINER_STATUS_STATE = exports.K8S_CONTAINER_STATUS_REASON_VALUE_OOM_KILLED = exports.K8S_CONTAINER_STATUS_REASON_VALUE_IMAGE_PULL_BACK_OFF = exports.K8S_CONTAINER_STATUS_REASON_VALUE_ERROR = exports.K8S_CONTAINER_STATUS_REASON_VALUE_ERR_IMAGE_PULL = exports.K8S_CONTAINER_STATUS_REASON_VALUE_CREATE_CONTAINER_CONFIG_ERROR = exports.K8S_CONTAINER_STATUS_REASON_VALUE_CRASH_LOOP_BACK_OFF = exports.K8S_CONTAINER_STATUS_REASON_VALUE_CONTAINER_CREATING = exports.K8S_CONTAINER_STATUS_REASON_VALUE_CONTAINER_CANNOT_RUN = exports.K8S_CONTAINER_STATUS_REASON_VALUE_COMPLETED = exports.ATTR_K8S_CONTAINER_STATUS_REASON = exports.ATTR_K8S_CONTAINER_STATUS_LAST_TERMINATED_REASON = exports.ATTR_K8S_CONTAINER_RESTART_COUNT = exports.ATTR_K8S_CONTAINER_NAME = exports.ATTR_K8S_CLUSTER_UID = exports.ATTR_K8S_CLUSTER_NAME = exports.ATTR_JVM_GC_CAUSE = exports.ATTR_JVM_BUFFER_POOL_NAME = exports.IOS_STATE_VALUE_TERMINATE = exports.IOS_STATE_VALUE_INACTIVE = exports.IOS_STATE_VALUE_FOREGROUND = exports.IOS_STATE_VALUE_BACKGROUND = exports.IOS_STATE_VALUE_ACTIVE = exports.ATTR_IOS_STATE = exports.IOS_APP_STATE_VALUE_TERMINATE = exports.IOS_APP_STATE_VALUE_INACTIVE = exports.IOS_APP_STATE_VALUE_FOREGROUND = exports.IOS_APP_STATE_VALUE_BACKGROUND = exports.IOS_APP_STATE_VALUE_ACTIVE = exports.ATTR_IOS_APP_STATE = exports.ATTR_HW_VENDOR = exports.HW_TYPE_VALUE_VOLTAGE = exports.HW_TYPE_VALUE_TEMPERATURE = exports.HW_TYPE_VALUE_TAPE_DRIVE = exports.HW_TYPE_VALUE_POWER_SUPPLY = exports.HW_TYPE_VALUE_PHYSICAL_DISK = exports.HW_TYPE_VALUE_NETWORK = exports.HW_TYPE_VALUE_MEMORY = void 0;
    exports.K8S_POD_STATUS_REASON_VALUE_UNEXPECTED_ADMISSION_ERROR = exports.K8S_POD_STATUS_REASON_VALUE_SHUTDOWN = exports.K8S_POD_STATUS_REASON_VALUE_NODE_LOST = exports.K8S_POD_STATUS_REASON_VALUE_NODE_AFFINITY = exports.K8S_POD_STATUS_REASON_VALUE_EVICTED = exports.ATTR_K8S_POD_STATUS_REASON = exports.K8S_POD_STATUS_PHASE_VALUE_UNKNOWN = exports.K8S_POD_STATUS_PHASE_VALUE_SUCCEEDED = exports.K8S_POD_STATUS_PHASE_VALUE_RUNNING = exports.K8S_POD_STATUS_PHASE_VALUE_PENDING = exports.K8S_POD_STATUS_PHASE_VALUE_FAILED = exports.ATTR_K8S_POD_STATUS_PHASE = exports.ATTR_K8S_POD_NAME = exports.ATTR_K8S_POD_LABELS = exports.ATTR_K8S_POD_LABEL = exports.ATTR_K8S_POD_ANNOTATION = exports.ATTR_K8S_NODE_UID = exports.ATTR_K8S_NODE_NAME = exports.ATTR_K8S_NODE_LABEL = exports.K8S_NODE_CONDITION_TYPE_VALUE_READY = exports.K8S_NODE_CONDITION_TYPE_VALUE_PID_PRESSURE = exports.K8S_NODE_CONDITION_TYPE_VALUE_NETWORK_UNAVAILABLE = exports.K8S_NODE_CONDITION_TYPE_VALUE_MEMORY_PRESSURE = exports.K8S_NODE_CONDITION_TYPE_VALUE_DISK_PRESSURE = exports.ATTR_K8S_NODE_CONDITION_TYPE = exports.K8S_NODE_CONDITION_STATUS_VALUE_CONDITION_UNKNOWN = exports.K8S_NODE_CONDITION_STATUS_VALUE_CONDITION_TRUE = exports.K8S_NODE_CONDITION_STATUS_VALUE_CONDITION_FALSE = exports.ATTR_K8S_NODE_CONDITION_STATUS = exports.ATTR_K8S_NODE_ANNOTATION = exports.K8S_NAMESPACE_PHASE_VALUE_TERMINATING = exports.K8S_NAMESPACE_PHASE_VALUE_ACTIVE = exports.ATTR_K8S_NAMESPACE_PHASE = exports.ATTR_K8S_NAMESPACE_NAME = exports.ATTR_K8S_NAMESPACE_LABEL = exports.ATTR_K8S_NAMESPACE_ANNOTATION = exports.ATTR_K8S_JOB_UID = exports.ATTR_K8S_JOB_NAME = exports.ATTR_K8S_JOB_LABEL = exports.ATTR_K8S_JOB_ANNOTATION = exports.ATTR_K8S_HUGEPAGE_SIZE = exports.ATTR_K8S_HPA_UID = exports.ATTR_K8S_HPA_SCALETARGETREF_NAME = exports.ATTR_K8S_HPA_SCALETARGETREF_KIND = exports.ATTR_K8S_HPA_SCALETARGETREF_API_VERSION = exports.ATTR_K8S_HPA_NAME = exports.ATTR_K8S_HPA_METRIC_TYPE = exports.ATTR_K8S_DEPLOYMENT_UID = exports.ATTR_K8S_DEPLOYMENT_NAME = exports.ATTR_K8S_DEPLOYMENT_LABEL = void 0;
    exports.ATTR_MESSAGING_DESTINATION_TEMPLATE = exports.ATTR_MESSAGING_DESTINATION_SUBSCRIPTION_NAME = exports.ATTR_MESSAGING_DESTINATION_PARTITION_ID = exports.ATTR_MESSAGING_DESTINATION_NAME = exports.ATTR_MESSAGING_DESTINATION_ANONYMOUS = exports.ATTR_MESSAGING_CONSUMER_GROUP_NAME = exports.ATTR_MESSAGING_CLIENT_ID = exports.ATTR_MESSAGING_BATCH_MESSAGE_COUNT = exports.ATTR_MESSAGE_UNCOMPRESSED_SIZE = exports.MESSAGE_TYPE_VALUE_SENT = exports.MESSAGE_TYPE_VALUE_RECEIVED = exports.ATTR_MESSAGE_TYPE = exports.ATTR_MESSAGE_ID = exports.ATTR_MESSAGE_COMPRESSED_SIZE = exports.ATTR_MAINFRAME_LPAR_NAME = exports.ATTR_LOG_RECORD_UID = exports.ATTR_LOG_RECORD_ORIGINAL = exports.LOG_IOSTREAM_VALUE_STDOUT = exports.LOG_IOSTREAM_VALUE_STDERR = exports.ATTR_LOG_IOSTREAM = exports.ATTR_LOG_FILE_PATH_RESOLVED = exports.ATTR_LOG_FILE_PATH = exports.ATTR_LOG_FILE_NAME_RESOLVED = exports.ATTR_LOG_FILE_NAME = exports.LINUX_MEMORY_SLAB_STATE_VALUE_UNRECLAIMABLE = exports.LINUX_MEMORY_SLAB_STATE_VALUE_RECLAIMABLE = exports.ATTR_LINUX_MEMORY_SLAB_STATE = exports.K8S_VOLUME_TYPE_VALUE_SECRET = exports.K8S_VOLUME_TYPE_VALUE_PERSISTENT_VOLUME_CLAIM = exports.K8S_VOLUME_TYPE_VALUE_LOCAL = exports.K8S_VOLUME_TYPE_VALUE_EMPTY_DIR = exports.K8S_VOLUME_TYPE_VALUE_DOWNWARD_API = exports.K8S_VOLUME_TYPE_VALUE_CONFIG_MAP = exports.ATTR_K8S_VOLUME_TYPE = exports.ATTR_K8S_VOLUME_NAME = exports.ATTR_K8S_STORAGECLASS_NAME = exports.ATTR_K8S_STATEFULSET_UID = exports.ATTR_K8S_STATEFULSET_NAME = exports.ATTR_K8S_STATEFULSET_LABEL = exports.ATTR_K8S_STATEFULSET_ANNOTATION = exports.ATTR_K8S_RESOURCEQUOTA_UID = exports.ATTR_K8S_RESOURCEQUOTA_RESOURCE_NAME = exports.ATTR_K8S_RESOURCEQUOTA_NAME = exports.ATTR_K8S_REPLICATIONCONTROLLER_UID = exports.ATTR_K8S_REPLICATIONCONTROLLER_NAME = exports.ATTR_K8S_REPLICASET_UID = exports.ATTR_K8S_REPLICASET_NAME = exports.ATTR_K8S_REPLICASET_LABEL = exports.ATTR_K8S_REPLICASET_ANNOTATION = exports.ATTR_K8S_POD_UID = void 0;
    exports.MESSAGING_SERVICEBUS_DISPOSITION_STATUS_VALUE_COMPLETE = exports.MESSAGING_SERVICEBUS_DISPOSITION_STATUS_VALUE_ABANDON = exports.ATTR_MESSAGING_SERVICEBUS_DISPOSITION_STATUS = exports.ATTR_MESSAGING_SERVICEBUS_DESTINATION_SUBSCRIPTION_NAME = exports.ATTR_MESSAGING_ROCKETMQ_NAMESPACE = exports.MESSAGING_ROCKETMQ_MESSAGE_TYPE_VALUE_TRANSACTION = exports.MESSAGING_ROCKETMQ_MESSAGE_TYPE_VALUE_NORMAL = exports.MESSAGING_ROCKETMQ_MESSAGE_TYPE_VALUE_FIFO = exports.MESSAGING_ROCKETMQ_MESSAGE_TYPE_VALUE_DELAY = exports.ATTR_MESSAGING_ROCKETMQ_MESSAGE_TYPE = exports.ATTR_MESSAGING_ROCKETMQ_MESSAGE_TAG = exports.ATTR_MESSAGING_ROCKETMQ_MESSAGE_KEYS = exports.ATTR_MESSAGING_ROCKETMQ_MESSAGE_GROUP = exports.ATTR_MESSAGING_ROCKETMQ_MESSAGE_DELIVERY_TIMESTAMP = exports.ATTR_MESSAGING_ROCKETMQ_MESSAGE_DELAY_TIME_LEVEL = exports.MESSAGING_ROCKETMQ_CONSUMPTION_MODEL_VALUE_CLUSTERING = exports.MESSAGING_ROCKETMQ_CONSUMPTION_MODEL_VALUE_BROADCASTING = exports.ATTR_MESSAGING_ROCKETMQ_CONSUMPTION_MODEL = exports.ATTR_MESSAGING_ROCKETMQ_CLIENT_GROUP = exports.ATTR_MESSAGING_RABBITMQ_MESSAGE_DELIVERY_TAG = exports.ATTR_MESSAGING_RABBITMQ_DESTINATION_ROUTING_KEY = exports.MESSAGING_OPERATION_TYPE_VALUE_SETTLE = exports.MESSAGING_OPERATION_TYPE_VALUE_SEND = exports.MESSAGING_OPERATION_TYPE_VALUE_RECEIVE = exports.MESSAGING_OPERATION_TYPE_VALUE_PUBLISH = exports.MESSAGING_OPERATION_TYPE_VALUE_PROCESS = exports.MESSAGING_OPERATION_TYPE_VALUE_DELIVER = exports.MESSAGING_OPERATION_TYPE_VALUE_CREATE = exports.ATTR_MESSAGING_OPERATION_TYPE = exports.ATTR_MESSAGING_OPERATION_NAME = exports.ATTR_MESSAGING_OPERATION = exports.ATTR_MESSAGING_MESSAGE_ID = exports.ATTR_MESSAGING_MESSAGE_ENVELOPE_SIZE = exports.ATTR_MESSAGING_MESSAGE_CONVERSATION_ID = exports.ATTR_MESSAGING_MESSAGE_BODY_SIZE = exports.ATTR_MESSAGING_KAFKA_OFFSET = exports.ATTR_MESSAGING_KAFKA_MESSAGE_TOMBSTONE = exports.ATTR_MESSAGING_KAFKA_MESSAGE_OFFSET = exports.ATTR_MESSAGING_KAFKA_MESSAGE_KEY = exports.ATTR_MESSAGING_KAFKA_DESTINATION_PARTITION = exports.ATTR_MESSAGING_KAFKA_CONSUMER_GROUP = exports.ATTR_MESSAGING_GCP_PUBSUB_MESSAGE_ORDERING_KEY = exports.ATTR_MESSAGING_GCP_PUBSUB_MESSAGE_DELIVERY_ATTEMPT = exports.ATTR_MESSAGING_GCP_PUBSUB_MESSAGE_ACK_ID = exports.ATTR_MESSAGING_GCP_PUBSUB_MESSAGE_ACK_DEADLINE = exports.ATTR_MESSAGING_EVENTHUBS_MESSAGE_ENQUEUED_TIME = exports.ATTR_MESSAGING_EVENTHUBS_CONSUMER_GROUP = exports.ATTR_MESSAGING_DESTINATION_PUBLISH_NAME = exports.ATTR_MESSAGING_DESTINATION_PUBLISH_ANONYMOUS = exports.ATTR_MESSAGING_DESTINATION_TEMPORARY = void 0;
    exports.NETWORK_CONNECTION_STATE_VALUE_FIN_WAIT_1 = exports.NETWORK_CONNECTION_STATE_VALUE_ESTABLISHED = exports.NETWORK_CONNECTION_STATE_VALUE_CLOSING = exports.NETWORK_CONNECTION_STATE_VALUE_CLOSED = exports.NETWORK_CONNECTION_STATE_VALUE_CLOSE_WAIT = exports.ATTR_NETWORK_CONNECTION_STATE = exports.ATTR_NETWORK_CARRIER_NAME = exports.ATTR_NETWORK_CARRIER_MNC = exports.ATTR_NETWORK_CARRIER_MCC = exports.ATTR_NETWORK_CARRIER_ICC = exports.NET_TRANSPORT_VALUE_PIPE = exports.NET_TRANSPORT_VALUE_OTHER = exports.NET_TRANSPORT_VALUE_IP_UDP = exports.NET_TRANSPORT_VALUE_IP_TCP = exports.NET_TRANSPORT_VALUE_INPROC = exports.ATTR_NET_TRANSPORT = exports.ATTR_NET_SOCK_PEER_PORT = exports.ATTR_NET_SOCK_PEER_NAME = exports.ATTR_NET_SOCK_PEER_ADDR = exports.ATTR_NET_SOCK_HOST_PORT = exports.ATTR_NET_SOCK_HOST_ADDR = exports.NET_SOCK_FAMILY_VALUE_UNIX = exports.NET_SOCK_FAMILY_VALUE_INET6 = exports.NET_SOCK_FAMILY_VALUE_INET = exports.ATTR_NET_SOCK_FAMILY = exports.ATTR_NET_PROTOCOL_VERSION = exports.ATTR_NET_PROTOCOL_NAME = exports.ATTR_NET_PEER_PORT = exports.ATTR_NET_PEER_NAME = exports.ATTR_NET_PEER_IP = exports.ATTR_NET_HOST_PORT = exports.ATTR_NET_HOST_NAME = exports.ATTR_NET_HOST_IP = exports.MESSAGING_SYSTEM_VALUE_SERVICEBUS = exports.MESSAGING_SYSTEM_VALUE_ROCKETMQ = exports.MESSAGING_SYSTEM_VALUE_RABBITMQ = exports.MESSAGING_SYSTEM_VALUE_PULSAR = exports.MESSAGING_SYSTEM_VALUE_KAFKA = exports.MESSAGING_SYSTEM_VALUE_JMS = exports.MESSAGING_SYSTEM_VALUE_GCP_PUBSUB = exports.MESSAGING_SYSTEM_VALUE_EVENTHUBS = exports.MESSAGING_SYSTEM_VALUE_EVENTGRID = exports.MESSAGING_SYSTEM_VALUE_AWS_SQS = exports.MESSAGING_SYSTEM_VALUE_AWS_SNS = exports.MESSAGING_SYSTEM_VALUE_ACTIVEMQ = exports.ATTR_MESSAGING_SYSTEM = exports.ATTR_MESSAGING_SERVICEBUS_MESSAGE_ENQUEUED_TIME = exports.ATTR_MESSAGING_SERVICEBUS_MESSAGE_DELIVERY_COUNT = exports.MESSAGING_SERVICEBUS_DISPOSITION_STATUS_VALUE_DEFER = exports.MESSAGING_SERVICEBUS_DISPOSITION_STATUS_VALUE_DEAD_LETTER = void 0;
    exports.OPENAI_REQUEST_SERVICE_TIER_VALUE_AUTO = exports.ATTR_OPENAI_REQUEST_SERVICE_TIER = exports.ATTR_ONC_RPC_VERSION = exports.ATTR_ONC_RPC_PROGRAM_NAME = exports.ATTR_ONC_RPC_PROCEDURE_NUMBER = exports.ATTR_ONC_RPC_PROCEDURE_NAME = exports.ATTR_OCI_MANIFEST_DIGEST = exports.NODEJS_EVENTLOOP_STATE_VALUE_IDLE = exports.NODEJS_EVENTLOOP_STATE_VALUE_ACTIVE = exports.ATTR_NODEJS_EVENTLOOP_STATE = exports.ATTR_NFS_SERVER_REPCACHE_STATUS = exports.ATTR_NFS_OPERATION_NAME = exports.NETWORK_IO_DIRECTION_VALUE_TRANSMIT = exports.NETWORK_IO_DIRECTION_VALUE_RECEIVE = exports.ATTR_NETWORK_IO_DIRECTION = exports.ATTR_NETWORK_INTERFACE_NAME = exports.NETWORK_CONNECTION_TYPE_VALUE_WIRED = exports.NETWORK_CONNECTION_TYPE_VALUE_WIFI = exports.NETWORK_CONNECTION_TYPE_VALUE_UNKNOWN = exports.NETWORK_CONNECTION_TYPE_VALUE_UNAVAILABLE = exports.NETWORK_CONNECTION_TYPE_VALUE_CELL = exports.ATTR_NETWORK_CONNECTION_TYPE = exports.NETWORK_CONNECTION_SUBTYPE_VALUE_UMTS = exports.NETWORK_CONNECTION_SUBTYPE_VALUE_TD_SCDMA = exports.NETWORK_CONNECTION_SUBTYPE_VALUE_NRNSA = exports.NETWORK_CONNECTION_SUBTYPE_VALUE_NR = exports.NETWORK_CONNECTION_SUBTYPE_VALUE_LTE_CA = exports.NETWORK_CONNECTION_SUBTYPE_VALUE_LTE = exports.NETWORK_CONNECTION_SUBTYPE_VALUE_IWLAN = exports.NETWORK_CONNECTION_SUBTYPE_VALUE_IDEN = exports.NETWORK_CONNECTION_SUBTYPE_VALUE_HSUPA = exports.NETWORK_CONNECTION_SUBTYPE_VALUE_HSPAP = exports.NETWORK_CONNECTION_SUBTYPE_VALUE_HSPA = exports.NETWORK_CONNECTION_SUBTYPE_VALUE_HSDPA = exports.NETWORK_CONNECTION_SUBTYPE_VALUE_GSM = exports.NETWORK_CONNECTION_SUBTYPE_VALUE_GPRS = exports.NETWORK_CONNECTION_SUBTYPE_VALUE_EVDO_B = exports.NETWORK_CONNECTION_SUBTYPE_VALUE_EVDO_A = exports.NETWORK_CONNECTION_SUBTYPE_VALUE_EVDO_0 = exports.NETWORK_CONNECTION_SUBTYPE_VALUE_EHRPD = exports.NETWORK_CONNECTION_SUBTYPE_VALUE_EDGE = exports.NETWORK_CONNECTION_SUBTYPE_VALUE_CDMA2000_1XRTT = exports.NETWORK_CONNECTION_SUBTYPE_VALUE_CDMA = exports.ATTR_NETWORK_CONNECTION_SUBTYPE = exports.NETWORK_CONNECTION_STATE_VALUE_TIME_WAIT = exports.NETWORK_CONNECTION_STATE_VALUE_SYN_SENT = exports.NETWORK_CONNECTION_STATE_VALUE_SYN_RECEIVED = exports.NETWORK_CONNECTION_STATE_VALUE_LISTEN = exports.NETWORK_CONNECTION_STATE_VALUE_LAST_ACK = exports.NETWORK_CONNECTION_STATE_VALUE_FIN_WAIT_2 = void 0;
    exports.OTEL_SPAN_PARENT_ORIGIN_VALUE_REMOTE = exports.OTEL_SPAN_PARENT_ORIGIN_VALUE_NONE = exports.OTEL_SPAN_PARENT_ORIGIN_VALUE_LOCAL = exports.ATTR_OTEL_SPAN_PARENT_ORIGIN = exports.ATTR_OTEL_SCOPE_SCHEMA_URL = exports.ATTR_OTEL_LIBRARY_VERSION = exports.ATTR_OTEL_LIBRARY_NAME = exports.OTEL_COMPONENT_TYPE_VALUE_ZIPKIN_HTTP_SPAN_EXPORTER = exports.OTEL_COMPONENT_TYPE_VALUE_SIMPLE_SPAN_PROCESSOR = exports.OTEL_COMPONENT_TYPE_VALUE_SIMPLE_LOG_PROCESSOR = exports.OTEL_COMPONENT_TYPE_VALUE_PROMETHEUS_HTTP_TEXT_METRIC_EXPORTER = exports.OTEL_COMPONENT_TYPE_VALUE_PERIODIC_METRIC_READER = exports.OTEL_COMPONENT_TYPE_VALUE_OTLP_HTTP_SPAN_EXPORTER = exports.OTEL_COMPONENT_TYPE_VALUE_OTLP_HTTP_METRIC_EXPORTER = exports.OTEL_COMPONENT_TYPE_VALUE_OTLP_HTTP_LOG_EXPORTER = exports.OTEL_COMPONENT_TYPE_VALUE_OTLP_HTTP_JSON_SPAN_EXPORTER = exports.OTEL_COMPONENT_TYPE_VALUE_OTLP_HTTP_JSON_METRIC_EXPORTER = exports.OTEL_COMPONENT_TYPE_VALUE_OTLP_HTTP_JSON_LOG_EXPORTER = exports.OTEL_COMPONENT_TYPE_VALUE_OTLP_GRPC_SPAN_EXPORTER = exports.OTEL_COMPONENT_TYPE_VALUE_OTLP_GRPC_METRIC_EXPORTER = exports.OTEL_COMPONENT_TYPE_VALUE_OTLP_GRPC_LOG_EXPORTER = exports.OTEL_COMPONENT_TYPE_VALUE_BATCHING_SPAN_PROCESSOR = exports.OTEL_COMPONENT_TYPE_VALUE_BATCHING_LOG_PROCESSOR = exports.ATTR_OTEL_COMPONENT_TYPE = exports.ATTR_OTEL_COMPONENT_NAME = exports.ATTR_OS_VERSION = exports.OS_TYPE_VALUE_ZOS = exports.OS_TYPE_VALUE_Z_OS = exports.OS_TYPE_VALUE_WINDOWS = exports.OS_TYPE_VALUE_SOLARIS = exports.OS_TYPE_VALUE_OPENBSD = exports.OS_TYPE_VALUE_NETBSD = exports.OS_TYPE_VALUE_LINUX = exports.OS_TYPE_VALUE_HPUX = exports.OS_TYPE_VALUE_FREEBSD = exports.OS_TYPE_VALUE_DRAGONFLYBSD = exports.OS_TYPE_VALUE_DARWIN = exports.OS_TYPE_VALUE_AIX = exports.ATTR_OS_TYPE = exports.ATTR_OS_NAME = exports.ATTR_OS_DESCRIPTION = exports.ATTR_OS_BUILD_ID = exports.OPENTRACING_REF_TYPE_VALUE_FOLLOWS_FROM = exports.OPENTRACING_REF_TYPE_VALUE_CHILD_OF = exports.ATTR_OPENTRACING_REF_TYPE = exports.ATTR_OPENSHIFT_CLUSTERQUOTA_UID = exports.ATTR_OPENSHIFT_CLUSTERQUOTA_NAME = exports.ATTR_OPENAI_RESPONSE_SYSTEM_FINGERPRINT = exports.ATTR_OPENAI_RESPONSE_SERVICE_TIER = exports.OPENAI_REQUEST_SERVICE_TIER_VALUE_DEFAULT = void 0;
    exports.ATTR_PROCESS_SESSION_LEADER_PID = exports.ATTR_PROCESS_SAVED_USER_NAME = exports.ATTR_PROCESS_SAVED_USER_ID = exports.ATTR_PROCESS_RUNTIME_VERSION = exports.ATTR_PROCESS_RUNTIME_NAME = exports.ATTR_PROCESS_RUNTIME_DESCRIPTION = exports.ATTR_PROCESS_REAL_USER_NAME = exports.ATTR_PROCESS_REAL_USER_ID = exports.ATTR_PROCESS_PID = exports.ATTR_PROCESS_PARENT_PID = exports.PROCESS_PAGING_FAULT_TYPE_VALUE_MINOR = exports.PROCESS_PAGING_FAULT_TYPE_VALUE_MAJOR = exports.ATTR_PROCESS_PAGING_FAULT_TYPE = exports.ATTR_PROCESS_OWNER = exports.ATTR_PROCESS_LINUX_CGROUP = exports.ATTR_PROCESS_INTERACTIVE = exports.ATTR_PROCESS_GROUP_LEADER_PID = exports.ATTR_PROCESS_EXIT_TIME = exports.ATTR_PROCESS_EXIT_CODE = exports.ATTR_PROCESS_EXECUTABLE_PATH = exports.ATTR_PROCESS_EXECUTABLE_NAME = exports.ATTR_PROCESS_EXECUTABLE_BUILD_ID_PROFILING = exports.ATTR_PROCESS_EXECUTABLE_BUILD_ID_HTLHASH = exports.ATTR_PROCESS_EXECUTABLE_BUILD_ID_GO = exports.ATTR_PROCESS_EXECUTABLE_BUILD_ID_GNU = exports.ATTR_PROCESS_ENVIRONMENT_VARIABLE = exports.ATTR_PROCESS_CREATION_TIME = exports.PROCESS_CPU_STATE_VALUE_WAIT = exports.PROCESS_CPU_STATE_VALUE_USER = exports.PROCESS_CPU_STATE_VALUE_SYSTEM = exports.ATTR_PROCESS_CPU_STATE = exports.PROCESS_CONTEXT_SWITCH_TYPE_VALUE_VOLUNTARY = exports.PROCESS_CONTEXT_SWITCH_TYPE_VALUE_INVOLUNTARY = exports.ATTR_PROCESS_CONTEXT_SWITCH_TYPE = exports.ATTR_PROCESS_COMMAND_LINE = exports.ATTR_PROCESS_COMMAND_ARGS = exports.ATTR_PROCESS_COMMAND = exports.ATTR_PROCESS_ARGS_COUNT = exports.ATTR_PPROF_PROFILE_COMMENT = exports.ATTR_PPROF_MAPPING_HAS_LINE_NUMBERS = exports.ATTR_PPROF_MAPPING_HAS_INLINE_FRAMES = exports.ATTR_PPROF_MAPPING_HAS_FUNCTIONS = exports.ATTR_PPROF_MAPPING_HAS_FILENAMES = exports.ATTR_PPROF_LOCATION_IS_FOLDED = exports.ATTR_POOL_NAME = exports.ATTR_PEER_SERVICE = exports.OTEL_SPAN_SAMPLING_RESULT_VALUE_RECORD_ONLY = exports.OTEL_SPAN_SAMPLING_RESULT_VALUE_RECORD_AND_SAMPLE = exports.OTEL_SPAN_SAMPLING_RESULT_VALUE_DROP = exports.ATTR_OTEL_SPAN_SAMPLING_RESULT = void 0;
    exports.RPC_GRPC_STATUS_CODE_VALUE_DEADLINE_EXCEEDED = exports.RPC_GRPC_STATUS_CODE_VALUE_INVALID_ARGUMENT = exports.RPC_GRPC_STATUS_CODE_VALUE_UNKNOWN = exports.RPC_GRPC_STATUS_CODE_VALUE_CANCELLED = exports.RPC_GRPC_STATUS_CODE_VALUE_OK = exports.ATTR_RPC_GRPC_STATUS_CODE = exports.ATTR_RPC_GRPC_RESPONSE_METADATA = exports.ATTR_RPC_GRPC_REQUEST_METADATA = exports.ATTR_RPC_CONNECT_RPC_RESPONSE_METADATA = exports.ATTR_RPC_CONNECT_RPC_REQUEST_METADATA = exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_UNKNOWN = exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_UNIMPLEMENTED = exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_UNAVAILABLE = exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_UNAUTHENTICATED = exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_RESOURCE_EXHAUSTED = exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_PERMISSION_DENIED = exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_OUT_OF_RANGE = exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_NOT_FOUND = exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_INVALID_ARGUMENT = exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_INTERNAL = exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_FAILED_PRECONDITION = exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_DEADLINE_EXCEEDED = exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_DATA_LOSS = exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_CANCELLED = exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_ALREADY_EXISTS = exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_ABORTED = exports.ATTR_RPC_CONNECT_RPC_ERROR_CODE = exports.PROFILE_FRAME_TYPE_VALUE_V8JS = exports.PROFILE_FRAME_TYPE_VALUE_RUST = exports.PROFILE_FRAME_TYPE_VALUE_RUBY = exports.PROFILE_FRAME_TYPE_VALUE_PHP = exports.PROFILE_FRAME_TYPE_VALUE_PERL = exports.PROFILE_FRAME_TYPE_VALUE_NATIVE = exports.PROFILE_FRAME_TYPE_VALUE_KERNEL = exports.PROFILE_FRAME_TYPE_VALUE_JVM = exports.PROFILE_FRAME_TYPE_VALUE_GO = exports.PROFILE_FRAME_TYPE_VALUE_DOTNET = exports.PROFILE_FRAME_TYPE_VALUE_CPYTHON = exports.PROFILE_FRAME_TYPE_VALUE_BEAM = exports.ATTR_PROFILE_FRAME_TYPE = exports.ATTR_PROCESS_WORKING_DIRECTORY = exports.ATTR_PROCESS_VPID = exports.ATTR_PROCESS_USER_NAME = exports.ATTR_PROCESS_USER_ID = exports.ATTR_PROCESS_TITLE = exports.PROCESS_STATE_VALUE_STOPPED = exports.PROCESS_STATE_VALUE_SLEEPING = exports.PROCESS_STATE_VALUE_RUNNING = exports.PROCESS_STATE_VALUE_DEFUNCT = exports.ATTR_PROCESS_STATE = void 0;
    exports.ATTR_SYSTEM_CPU_LOGICAL_NUMBER = exports.STATE_VALUE_USED = exports.STATE_VALUE_IDLE = exports.ATTR_STATE = exports.ATTR_SOURCE_PORT = exports.ATTR_SOURCE_ADDRESS = exports.ATTR_SESSION_PREVIOUS_ID = exports.ATTR_SESSION_ID = exports.ATTR_SERVICE_NAMESPACE = exports.ATTR_SERVICE_INSTANCE_ID = exports.ATTR_SECURITY_RULE_VERSION = exports.ATTR_SECURITY_RULE_UUID = exports.ATTR_SECURITY_RULE_RULESET_NAME = exports.ATTR_SECURITY_RULE_REFERENCE = exports.ATTR_SECURITY_RULE_NAME = exports.ATTR_SECURITY_RULE_LICENSE = exports.ATTR_SECURITY_RULE_DESCRIPTION = exports.ATTR_SECURITY_RULE_CATEGORY = exports.RPC_SYSTEM_VALUE_ONC_RPC = exports.RPC_SYSTEM_VALUE_JSONRPC = exports.RPC_SYSTEM_VALUE_JAVA_RMI = exports.RPC_SYSTEM_VALUE_GRPC = exports.RPC_SYSTEM_VALUE_DOTNET_WCF = exports.RPC_SYSTEM_VALUE_CONNECT_RPC = exports.RPC_SYSTEM_VALUE_APACHE_DUBBO = exports.ATTR_RPC_SYSTEM = exports.ATTR_RPC_SERVICE = exports.ATTR_RPC_METHOD = exports.ATTR_RPC_MESSAGE_UNCOMPRESSED_SIZE = exports.RPC_MESSAGE_TYPE_VALUE_SENT = exports.RPC_MESSAGE_TYPE_VALUE_RECEIVED = exports.ATTR_RPC_MESSAGE_TYPE = exports.ATTR_RPC_MESSAGE_ID = exports.ATTR_RPC_MESSAGE_COMPRESSED_SIZE = exports.ATTR_RPC_JSONRPC_VERSION = exports.ATTR_RPC_JSONRPC_REQUEST_ID = exports.ATTR_RPC_JSONRPC_ERROR_MESSAGE = exports.ATTR_RPC_JSONRPC_ERROR_CODE = exports.RPC_GRPC_STATUS_CODE_VALUE_UNAUTHENTICATED = exports.RPC_GRPC_STATUS_CODE_VALUE_DATA_LOSS = exports.RPC_GRPC_STATUS_CODE_VALUE_UNAVAILABLE = exports.RPC_GRPC_STATUS_CODE_VALUE_INTERNAL = exports.RPC_GRPC_STATUS_CODE_VALUE_UNIMPLEMENTED = exports.RPC_GRPC_STATUS_CODE_VALUE_OUT_OF_RANGE = exports.RPC_GRPC_STATUS_CODE_VALUE_ABORTED = exports.RPC_GRPC_STATUS_CODE_VALUE_FAILED_PRECONDITION = exports.RPC_GRPC_STATUS_CODE_VALUE_RESOURCE_EXHAUSTED = exports.RPC_GRPC_STATUS_CODE_VALUE_PERMISSION_DENIED = exports.RPC_GRPC_STATUS_CODE_VALUE_ALREADY_EXISTS = exports.RPC_GRPC_STATUS_CODE_VALUE_NOT_FOUND = void 0;
    exports.SYSTEM_PAGING_STATE_VALUE_USED = exports.SYSTEM_PAGING_STATE_VALUE_FREE = exports.ATTR_SYSTEM_PAGING_STATE = exports.SYSTEM_PAGING_FAULT_TYPE_VALUE_MINOR = exports.SYSTEM_PAGING_FAULT_TYPE_VALUE_MAJOR = exports.ATTR_SYSTEM_PAGING_FAULT_TYPE = exports.SYSTEM_PAGING_DIRECTION_VALUE_OUT = exports.SYSTEM_PAGING_DIRECTION_VALUE_IN = exports.ATTR_SYSTEM_PAGING_DIRECTION = exports.SYSTEM_NETWORK_STATE_VALUE_TIME_WAIT = exports.SYSTEM_NETWORK_STATE_VALUE_SYN_SENT = exports.SYSTEM_NETWORK_STATE_VALUE_SYN_RECV = exports.SYSTEM_NETWORK_STATE_VALUE_LISTEN = exports.SYSTEM_NETWORK_STATE_VALUE_LAST_ACK = exports.SYSTEM_NETWORK_STATE_VALUE_FIN_WAIT_2 = exports.SYSTEM_NETWORK_STATE_VALUE_FIN_WAIT_1 = exports.SYSTEM_NETWORK_STATE_VALUE_ESTABLISHED = exports.SYSTEM_NETWORK_STATE_VALUE_DELETE = exports.SYSTEM_NETWORK_STATE_VALUE_CLOSING = exports.SYSTEM_NETWORK_STATE_VALUE_CLOSE_WAIT = exports.SYSTEM_NETWORK_STATE_VALUE_CLOSE = exports.ATTR_SYSTEM_NETWORK_STATE = exports.SYSTEM_MEMORY_STATE_VALUE_USED = exports.SYSTEM_MEMORY_STATE_VALUE_SHARED = exports.SYSTEM_MEMORY_STATE_VALUE_FREE = exports.SYSTEM_MEMORY_STATE_VALUE_CACHED = exports.SYSTEM_MEMORY_STATE_VALUE_BUFFERS = exports.ATTR_SYSTEM_MEMORY_STATE = exports.SYSTEM_FILESYSTEM_TYPE_VALUE_REFS = exports.SYSTEM_FILESYSTEM_TYPE_VALUE_NTFS = exports.SYSTEM_FILESYSTEM_TYPE_VALUE_HFSPLUS = exports.SYSTEM_FILESYSTEM_TYPE_VALUE_FAT32 = exports.SYSTEM_FILESYSTEM_TYPE_VALUE_EXT4 = exports.SYSTEM_FILESYSTEM_TYPE_VALUE_EXFAT = exports.ATTR_SYSTEM_FILESYSTEM_TYPE = exports.SYSTEM_FILESYSTEM_STATE_VALUE_USED = exports.SYSTEM_FILESYSTEM_STATE_VALUE_RESERVED = exports.SYSTEM_FILESYSTEM_STATE_VALUE_FREE = exports.ATTR_SYSTEM_FILESYSTEM_STATE = exports.ATTR_SYSTEM_FILESYSTEM_MOUNTPOINT = exports.ATTR_SYSTEM_FILESYSTEM_MODE = exports.ATTR_SYSTEM_DEVICE = exports.SYSTEM_CPU_STATE_VALUE_USER = exports.SYSTEM_CPU_STATE_VALUE_SYSTEM = exports.SYSTEM_CPU_STATE_VALUE_STEAL = exports.SYSTEM_CPU_STATE_VALUE_NICE = exports.SYSTEM_CPU_STATE_VALUE_IOWAIT = exports.SYSTEM_CPU_STATE_VALUE_INTERRUPT = exports.SYSTEM_CPU_STATE_VALUE_IDLE = exports.ATTR_SYSTEM_CPU_STATE = void 0;
    exports.ATTR_TLS_RESUMED = exports.ATTR_TLS_PROTOCOL_VERSION = exports.TLS_PROTOCOL_NAME_VALUE_TLS = exports.TLS_PROTOCOL_NAME_VALUE_SSL = exports.ATTR_TLS_PROTOCOL_NAME = exports.ATTR_TLS_NEXT_PROTOCOL = exports.ATTR_TLS_ESTABLISHED = exports.ATTR_TLS_CURVE = exports.ATTR_TLS_CLIENT_SUPPORTED_CIPHERS = exports.ATTR_TLS_CLIENT_SUBJECT = exports.ATTR_TLS_CLIENT_SERVER_NAME = exports.ATTR_TLS_CLIENT_NOT_BEFORE = exports.ATTR_TLS_CLIENT_NOT_AFTER = exports.ATTR_TLS_CLIENT_JA3 = exports.ATTR_TLS_CLIENT_ISSUER = exports.ATTR_TLS_CLIENT_HASH_SHA256 = exports.ATTR_TLS_CLIENT_HASH_SHA1 = exports.ATTR_TLS_CLIENT_HASH_MD5 = exports.ATTR_TLS_CLIENT_CERTIFICATE_CHAIN = exports.ATTR_TLS_CLIENT_CERTIFICATE = exports.ATTR_TLS_CIPHER = exports.ATTR_THREAD_NAME = exports.ATTR_THREAD_ID = exports.TEST_SUITE_RUN_STATUS_VALUE_TIMED_OUT = exports.TEST_SUITE_RUN_STATUS_VALUE_SUCCESS = exports.TEST_SUITE_RUN_STATUS_VALUE_SKIPPED = exports.TEST_SUITE_RUN_STATUS_VALUE_IN_PROGRESS = exports.TEST_SUITE_RUN_STATUS_VALUE_FAILURE = exports.TEST_SUITE_RUN_STATUS_VALUE_ABORTED = exports.ATTR_TEST_SUITE_RUN_STATUS = exports.ATTR_TEST_SUITE_NAME = exports.TEST_CASE_RESULT_STATUS_VALUE_PASS = exports.TEST_CASE_RESULT_STATUS_VALUE_FAIL = exports.ATTR_TEST_CASE_RESULT_STATUS = exports.ATTR_TEST_CASE_NAME = exports.ATTR_TELEMETRY_DISTRO_VERSION = exports.ATTR_TELEMETRY_DISTRO_NAME = exports.SYSTEM_PROCESSES_STATUS_VALUE_STOPPED = exports.SYSTEM_PROCESSES_STATUS_VALUE_SLEEPING = exports.SYSTEM_PROCESSES_STATUS_VALUE_RUNNING = exports.SYSTEM_PROCESSES_STATUS_VALUE_DEFUNCT = exports.ATTR_SYSTEM_PROCESSES_STATUS = exports.SYSTEM_PROCESS_STATUS_VALUE_STOPPED = exports.SYSTEM_PROCESS_STATUS_VALUE_SLEEPING = exports.SYSTEM_PROCESS_STATUS_VALUE_RUNNING = exports.SYSTEM_PROCESS_STATUS_VALUE_DEFUNCT = exports.ATTR_SYSTEM_PROCESS_STATUS = exports.SYSTEM_PAGING_TYPE_VALUE_MINOR = exports.SYSTEM_PAGING_TYPE_VALUE_MAJOR = exports.ATTR_SYSTEM_PAGING_TYPE = void 0;
    exports.ATTR_VCS_LINE_CHANGE_TYPE = exports.ATTR_VCS_CHANGE_TITLE = exports.VCS_CHANGE_STATE_VALUE_WIP = exports.VCS_CHANGE_STATE_VALUE_OPEN = exports.VCS_CHANGE_STATE_VALUE_MERGED = exports.VCS_CHANGE_STATE_VALUE_CLOSED = exports.ATTR_VCS_CHANGE_STATE = exports.ATTR_VCS_CHANGE_ID = exports.V8JS_HEAP_SPACE_NAME_VALUE_OLD_SPACE = exports.V8JS_HEAP_SPACE_NAME_VALUE_NEW_SPACE = exports.V8JS_HEAP_SPACE_NAME_VALUE_MAP_SPACE = exports.V8JS_HEAP_SPACE_NAME_VALUE_LARGE_OBJECT_SPACE = exports.V8JS_HEAP_SPACE_NAME_VALUE_CODE_SPACE = exports.ATTR_V8JS_HEAP_SPACE_NAME = exports.V8JS_GC_TYPE_VALUE_WEAKCB = exports.V8JS_GC_TYPE_VALUE_MINOR = exports.V8JS_GC_TYPE_VALUE_MAJOR = exports.V8JS_GC_TYPE_VALUE_INCREMENTAL = exports.ATTR_V8JS_GC_TYPE = exports.ATTR_USER_AGENT_VERSION = exports.USER_AGENT_SYNTHETIC_TYPE_VALUE_TEST = exports.USER_AGENT_SYNTHETIC_TYPE_VALUE_BOT = exports.ATTR_USER_AGENT_SYNTHETIC_TYPE = exports.ATTR_USER_AGENT_OS_VERSION = exports.ATTR_USER_AGENT_OS_NAME = exports.ATTR_USER_AGENT_NAME = exports.ATTR_USER_ROLES = exports.ATTR_USER_NAME = exports.ATTR_USER_ID = exports.ATTR_USER_HASH = exports.ATTR_USER_FULL_NAME = exports.ATTR_USER_EMAIL = exports.ATTR_URL_TOP_LEVEL_DOMAIN = exports.ATTR_URL_TEMPLATE = exports.ATTR_URL_SUBDOMAIN = exports.ATTR_URL_REGISTERED_DOMAIN = exports.ATTR_URL_PORT = exports.ATTR_URL_ORIGINAL = exports.ATTR_URL_EXTENSION = exports.ATTR_URL_DOMAIN = exports.ATTR_TLS_SERVER_SUBJECT = exports.ATTR_TLS_SERVER_NOT_BEFORE = exports.ATTR_TLS_SERVER_NOT_AFTER = exports.ATTR_TLS_SERVER_JA3S = exports.ATTR_TLS_SERVER_ISSUER = exports.ATTR_TLS_SERVER_HASH_SHA256 = exports.ATTR_TLS_SERVER_HASH_SHA1 = exports.ATTR_TLS_SERVER_HASH_MD5 = exports.ATTR_TLS_SERVER_CERTIFICATE_CHAIN = exports.ATTR_TLS_SERVER_CERTIFICATE = void 0;
    exports.ATTR_ZOS_SYSPLEX_NAME = exports.ATTR_ZOS_SMF_ID = exports.ATTR_WEBENGINE_VERSION = exports.ATTR_WEBENGINE_NAME = exports.ATTR_WEBENGINE_DESCRIPTION = exports.VCS_REVISION_DELTA_DIRECTION_VALUE_BEHIND = exports.VCS_REVISION_DELTA_DIRECTION_VALUE_AHEAD = exports.ATTR_VCS_REVISION_DELTA_DIRECTION = exports.ATTR_VCS_REPOSITORY_URL_FULL = exports.VCS_REPOSITORY_REF_TYPE_VALUE_TAG = exports.VCS_REPOSITORY_REF_TYPE_VALUE_BRANCH = exports.ATTR_VCS_REPOSITORY_REF_TYPE = exports.ATTR_VCS_REPOSITORY_REF_REVISION = exports.ATTR_VCS_REPOSITORY_REF_NAME = exports.ATTR_VCS_REPOSITORY_NAME = exports.ATTR_VCS_REPOSITORY_CHANGE_TITLE = exports.ATTR_VCS_REPOSITORY_CHANGE_ID = exports.VCS_REF_TYPE_VALUE_TAG = exports.VCS_REF_TYPE_VALUE_BRANCH = exports.ATTR_VCS_REF_TYPE = exports.VCS_REF_HEAD_TYPE_VALUE_TAG = exports.VCS_REF_HEAD_TYPE_VALUE_BRANCH = exports.ATTR_VCS_REF_HEAD_TYPE = exports.ATTR_VCS_REF_HEAD_REVISION = exports.ATTR_VCS_REF_HEAD_NAME = exports.VCS_REF_BASE_TYPE_VALUE_TAG = exports.VCS_REF_BASE_TYPE_VALUE_BRANCH = exports.ATTR_VCS_REF_BASE_TYPE = exports.ATTR_VCS_REF_BASE_REVISION = exports.ATTR_VCS_REF_BASE_NAME = exports.VCS_PROVIDER_NAME_VALUE_GITTEA = exports.VCS_PROVIDER_NAME_VALUE_GITLAB = exports.VCS_PROVIDER_NAME_VALUE_GITHUB = exports.VCS_PROVIDER_NAME_VALUE_GITEA = exports.VCS_PROVIDER_NAME_VALUE_BITBUCKET = exports.ATTR_VCS_PROVIDER_NAME = exports.ATTR_VCS_OWNER_NAME = exports.VCS_LINE_CHANGE_TYPE_VALUE_REMOVED = exports.VCS_LINE_CHANGE_TYPE_VALUE_ADDED = void 0;
    exports.ATTR_ANDROID_APP_STATE = "android.app.state";
    exports.ANDROID_APP_STATE_VALUE_BACKGROUND = "background";
    exports.ANDROID_APP_STATE_VALUE_CREATED = "created";
    exports.ANDROID_APP_STATE_VALUE_FOREGROUND = "foreground";
    exports.ATTR_ANDROID_OS_API_LEVEL = "android.os.api_level";
    exports.ATTR_ANDROID_STATE = "android.state";
    exports.ANDROID_STATE_VALUE_BACKGROUND = "background";
    exports.ANDROID_STATE_VALUE_CREATED = "created";
    exports.ANDROID_STATE_VALUE_FOREGROUND = "foreground";
    exports.ATTR_APP_BUILD_ID = "app.build_id";
    exports.ATTR_APP_INSTALLATION_ID = "app.installation.id";
    exports.ATTR_APP_JANK_FRAME_COUNT = "app.jank.frame_count";
    exports.ATTR_APP_JANK_PERIOD = "app.jank.period";
    exports.ATTR_APP_JANK_THRESHOLD = "app.jank.threshold";
    exports.ATTR_APP_SCREEN_COORDINATE_X = "app.screen.coordinate.x";
    exports.ATTR_APP_SCREEN_COORDINATE_Y = "app.screen.coordinate.y";
    exports.ATTR_APP_SCREEN_ID = "app.screen.id";
    exports.ATTR_APP_SCREEN_NAME = "app.screen.name";
    exports.ATTR_APP_WIDGET_ID = "app.widget.id";
    exports.ATTR_APP_WIDGET_NAME = "app.widget.name";
    exports.ATTR_ARTIFACT_ATTESTATION_FILENAME = "artifact.attestation.filename";
    exports.ATTR_ARTIFACT_ATTESTATION_HASH = "artifact.attestation.hash";
    exports.ATTR_ARTIFACT_ATTESTATION_ID = "artifact.attestation.id";
    exports.ATTR_ARTIFACT_FILENAME = "artifact.filename";
    exports.ATTR_ARTIFACT_HASH = "artifact.hash";
    exports.ATTR_ARTIFACT_PURL = "artifact.purl";
    exports.ATTR_ARTIFACT_VERSION = "artifact.version";
    exports.ATTR_ASPNETCORE_AUTHENTICATION_RESULT = "aspnetcore.authentication.result";
    exports.ASPNETCORE_AUTHENTICATION_RESULT_VALUE_FAILURE = "failure";
    exports.ASPNETCORE_AUTHENTICATION_RESULT_VALUE_NONE = "none";
    exports.ASPNETCORE_AUTHENTICATION_RESULT_VALUE_SUCCESS = "success";
    exports.ATTR_ASPNETCORE_AUTHENTICATION_SCHEME = "aspnetcore.authentication.scheme";
    exports.ATTR_ASPNETCORE_AUTHORIZATION_POLICY = "aspnetcore.authorization.policy";
    exports.ATTR_ASPNETCORE_AUTHORIZATION_RESULT = "aspnetcore.authorization.result";
    exports.ASPNETCORE_AUTHORIZATION_RESULT_VALUE_FAILURE = "failure";
    exports.ASPNETCORE_AUTHORIZATION_RESULT_VALUE_SUCCESS = "success";
    exports.ATTR_ASPNETCORE_IDENTITY_ERROR_CODE = "aspnetcore.identity.error_code";
    exports.ATTR_ASPNETCORE_IDENTITY_PASSWORD_CHECK_RESULT = "aspnetcore.identity.password_check_result";
    exports.ASPNETCORE_IDENTITY_PASSWORD_CHECK_RESULT_VALUE_FAILURE = "failure";
    exports.ASPNETCORE_IDENTITY_PASSWORD_CHECK_RESULT_VALUE_PASSWORD_MISSING = "password_missing";
    exports.ASPNETCORE_IDENTITY_PASSWORD_CHECK_RESULT_VALUE_SUCCESS = "success";
    exports.ASPNETCORE_IDENTITY_PASSWORD_CHECK_RESULT_VALUE_SUCCESS_REHASH_NEEDED = "success_rehash_needed";
    exports.ASPNETCORE_IDENTITY_PASSWORD_CHECK_RESULT_VALUE_USER_MISSING = "user_missing";
    exports.ATTR_ASPNETCORE_IDENTITY_RESULT = "aspnetcore.identity.result";
    exports.ASPNETCORE_IDENTITY_RESULT_VALUE_FAILURE = "failure";
    exports.ASPNETCORE_IDENTITY_RESULT_VALUE_SUCCESS = "success";
    exports.ATTR_ASPNETCORE_IDENTITY_SIGN_IN_RESULT = "aspnetcore.identity.sign_in.result";
    exports.ASPNETCORE_IDENTITY_SIGN_IN_RESULT_VALUE_FAILURE = "failure";
    exports.ASPNETCORE_IDENTITY_SIGN_IN_RESULT_VALUE_LOCKED_OUT = "locked_out";
    exports.ASPNETCORE_IDENTITY_SIGN_IN_RESULT_VALUE_NOT_ALLOWED = "not_allowed";
    exports.ASPNETCORE_IDENTITY_SIGN_IN_RESULT_VALUE_REQUIRES_TWO_FACTOR = "requires_two_factor";
    exports.ASPNETCORE_IDENTITY_SIGN_IN_RESULT_VALUE_SUCCESS = "success";
    exports.ATTR_ASPNETCORE_IDENTITY_SIGN_IN_TYPE = "aspnetcore.identity.sign_in.type";
    exports.ASPNETCORE_IDENTITY_SIGN_IN_TYPE_VALUE_EXTERNAL = "external";
    exports.ASPNETCORE_IDENTITY_SIGN_IN_TYPE_VALUE_PASSKEY = "passkey";
    exports.ASPNETCORE_IDENTITY_SIGN_IN_TYPE_VALUE_PASSWORD = "password";
    exports.ASPNETCORE_IDENTITY_SIGN_IN_TYPE_VALUE_TWO_FACTOR = "two_factor";
    exports.ASPNETCORE_IDENTITY_SIGN_IN_TYPE_VALUE_TWO_FACTOR_AUTHENTICATOR = "two_factor_authenticator";
    exports.ASPNETCORE_IDENTITY_SIGN_IN_TYPE_VALUE_TWO_FACTOR_RECOVERY_CODE = "two_factor_recovery_code";
    exports.ATTR_ASPNETCORE_IDENTITY_TOKEN_PURPOSE = "aspnetcore.identity.token_purpose";
    exports.ASPNETCORE_IDENTITY_TOKEN_PURPOSE_VALUE_OTHER = "_OTHER";
    exports.ASPNETCORE_IDENTITY_TOKEN_PURPOSE_VALUE_CHANGE_EMAIL = "change_email";
    exports.ASPNETCORE_IDENTITY_TOKEN_PURPOSE_VALUE_CHANGE_PHONE_NUMBER = "change_phone_number";
    exports.ASPNETCORE_IDENTITY_TOKEN_PURPOSE_VALUE_EMAIL_CONFIRMATION = "email_confirmation";
    exports.ASPNETCORE_IDENTITY_TOKEN_PURPOSE_VALUE_RESET_PASSWORD = "reset_password";
    exports.ASPNETCORE_IDENTITY_TOKEN_PURPOSE_VALUE_TWO_FACTOR = "two_factor";
    exports.ATTR_ASPNETCORE_IDENTITY_TOKEN_VERIFIED = "aspnetcore.identity.token_verified";
    exports.ASPNETCORE_IDENTITY_TOKEN_VERIFIED_VALUE_FAILURE = "failure";
    exports.ASPNETCORE_IDENTITY_TOKEN_VERIFIED_VALUE_SUCCESS = "success";
    exports.ATTR_ASPNETCORE_IDENTITY_USER_UPDATE_TYPE = "aspnetcore.identity.user.update_type";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_OTHER = "_OTHER";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_ACCESS_FAILED = "access_failed";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_ADD_CLAIMS = "add_claims";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_ADD_LOGIN = "add_login";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_ADD_PASSWORD = "add_password";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_ADD_TO_ROLES = "add_to_roles";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_CHANGE_EMAIL = "change_email";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_CHANGE_PASSWORD = "change_password";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_CHANGE_PHONE_NUMBER = "change_phone_number";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_CONFIRM_EMAIL = "confirm_email";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_GENERATE_NEW_TWO_FACTOR_RECOVERY_CODES = "generate_new_two_factor_recovery_codes";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_PASSWORD_REHASH = "password_rehash";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_REDEEM_TWO_FACTOR_RECOVERY_CODE = "redeem_two_factor_recovery_code";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_REMOVE_AUTHENTICATION_TOKEN = "remove_authentication_token";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_REMOVE_CLAIMS = "remove_claims";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_REMOVE_FROM_ROLES = "remove_from_roles";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_REMOVE_LOGIN = "remove_login";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_REMOVE_PASSKEY = "remove_passkey";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_REMOVE_PASSWORD = "remove_password";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_REPLACE_CLAIM = "replace_claim";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_RESET_ACCESS_FAILED_COUNT = "reset_access_failed_count";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_RESET_AUTHENTICATOR_KEY = "reset_authenticator_key";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_RESET_PASSWORD = "reset_password";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_SECURITY_STAMP = "security_stamp";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_SET_AUTHENTICATION_TOKEN = "set_authentication_token";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_SET_EMAIL = "set_email";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_SET_LOCKOUT_ENABLED = "set_lockout_enabled";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_SET_LOCKOUT_END_DATE = "set_lockout_end_date";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_SET_PASSKEY = "set_passkey";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_SET_PHONE_NUMBER = "set_phone_number";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_SET_TWO_FACTOR_ENABLED = "set_two_factor_enabled";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_UPDATE = "update";
    exports.ASPNETCORE_IDENTITY_USER_UPDATE_TYPE_VALUE_USER_NAME = "user_name";
    exports.ATTR_ASPNETCORE_IDENTITY_USER_TYPE = "aspnetcore.identity.user_type";
    exports.ATTR_ASPNETCORE_MEMORY_POOL_OWNER = "aspnetcore.memory_pool.owner";
    exports.ATTR_ASPNETCORE_SIGN_IN_IS_PERSISTENT = "aspnetcore.sign_in.is_persistent";
    exports.ATTR_AWS_BEDROCK_GUARDRAIL_ID = "aws.bedrock.guardrail.id";
    exports.ATTR_AWS_BEDROCK_KNOWLEDGE_BASE_ID = "aws.bedrock.knowledge_base.id";
    exports.ATTR_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = "aws.dynamodb.attribute_definitions";
    exports.ATTR_AWS_DYNAMODB_ATTRIBUTES_TO_GET = "aws.dynamodb.attributes_to_get";
    exports.ATTR_AWS_DYNAMODB_CONSISTENT_READ = "aws.dynamodb.consistent_read";
    exports.ATTR_AWS_DYNAMODB_CONSUMED_CAPACITY = "aws.dynamodb.consumed_capacity";
    exports.ATTR_AWS_DYNAMODB_COUNT = "aws.dynamodb.count";
    exports.ATTR_AWS_DYNAMODB_EXCLUSIVE_START_TABLE = "aws.dynamodb.exclusive_start_table";
    exports.ATTR_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = "aws.dynamodb.global_secondary_index_updates";
    exports.ATTR_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = "aws.dynamodb.global_secondary_indexes";
    exports.ATTR_AWS_DYNAMODB_INDEX_NAME = "aws.dynamodb.index_name";
    exports.ATTR_AWS_DYNAMODB_ITEM_COLLECTION_METRICS = "aws.dynamodb.item_collection_metrics";
    exports.ATTR_AWS_DYNAMODB_LIMIT = "aws.dynamodb.limit";
    exports.ATTR_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = "aws.dynamodb.local_secondary_indexes";
    exports.ATTR_AWS_DYNAMODB_PROJECTION = "aws.dynamodb.projection";
    exports.ATTR_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = "aws.dynamodb.provisioned_read_capacity";
    exports.ATTR_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = "aws.dynamodb.provisioned_write_capacity";
    exports.ATTR_AWS_DYNAMODB_SCAN_FORWARD = "aws.dynamodb.scan_forward";
    exports.ATTR_AWS_DYNAMODB_SCANNED_COUNT = "aws.dynamodb.scanned_count";
    exports.ATTR_AWS_DYNAMODB_SEGMENT = "aws.dynamodb.segment";
    exports.ATTR_AWS_DYNAMODB_SELECT = "aws.dynamodb.select";
    exports.ATTR_AWS_DYNAMODB_TABLE_COUNT = "aws.dynamodb.table_count";
    exports.ATTR_AWS_DYNAMODB_TABLE_NAMES = "aws.dynamodb.table_names";
    exports.ATTR_AWS_DYNAMODB_TOTAL_SEGMENTS = "aws.dynamodb.total_segments";
    exports.ATTR_AWS_ECS_CLUSTER_ARN = "aws.ecs.cluster.arn";
    exports.ATTR_AWS_ECS_CONTAINER_ARN = "aws.ecs.container.arn";
    exports.ATTR_AWS_ECS_LAUNCHTYPE = "aws.ecs.launchtype";
    exports.AWS_ECS_LAUNCHTYPE_VALUE_EC2 = "ec2";
    exports.AWS_ECS_LAUNCHTYPE_VALUE_FARGATE = "fargate";
    exports.ATTR_AWS_ECS_TASK_ARN = "aws.ecs.task.arn";
    exports.ATTR_AWS_ECS_TASK_FAMILY = "aws.ecs.task.family";
    exports.ATTR_AWS_ECS_TASK_ID = "aws.ecs.task.id";
    exports.ATTR_AWS_ECS_TASK_REVISION = "aws.ecs.task.revision";
    exports.ATTR_AWS_EKS_CLUSTER_ARN = "aws.eks.cluster.arn";
    exports.ATTR_AWS_EXTENDED_REQUEST_ID = "aws.extended_request_id";
    exports.ATTR_AWS_KINESIS_STREAM_NAME = "aws.kinesis.stream_name";
    exports.ATTR_AWS_LAMBDA_INVOKED_ARN = "aws.lambda.invoked_arn";
    exports.ATTR_AWS_LAMBDA_RESOURCE_MAPPING_ID = "aws.lambda.resource_mapping.id";
    exports.ATTR_AWS_LOG_GROUP_ARNS = "aws.log.group.arns";
    exports.ATTR_AWS_LOG_GROUP_NAMES = "aws.log.group.names";
    exports.ATTR_AWS_LOG_STREAM_ARNS = "aws.log.stream.arns";
    exports.ATTR_AWS_LOG_STREAM_NAMES = "aws.log.stream.names";
    exports.ATTR_AWS_REQUEST_ID = "aws.request_id";
    exports.ATTR_AWS_S3_BUCKET = "aws.s3.bucket";
    exports.ATTR_AWS_S3_COPY_SOURCE = "aws.s3.copy_source";
    exports.ATTR_AWS_S3_DELETE = "aws.s3.delete";
    exports.ATTR_AWS_S3_KEY = "aws.s3.key";
    exports.ATTR_AWS_S3_PART_NUMBER = "aws.s3.part_number";
    exports.ATTR_AWS_S3_UPLOAD_ID = "aws.s3.upload_id";
    exports.ATTR_AWS_SECRETSMANAGER_SECRET_ARN = "aws.secretsmanager.secret.arn";
    exports.ATTR_AWS_SNS_TOPIC_ARN = "aws.sns.topic.arn";
    exports.ATTR_AWS_SQS_QUEUE_URL = "aws.sqs.queue.url";
    exports.ATTR_AWS_STEP_FUNCTIONS_ACTIVITY_ARN = "aws.step_functions.activity.arn";
    exports.ATTR_AWS_STEP_FUNCTIONS_STATE_MACHINE_ARN = "aws.step_functions.state_machine.arn";
    exports.ATTR_AZ_NAMESPACE = "az.namespace";
    exports.ATTR_AZ_SERVICE_REQUEST_ID = "az.service_request_id";
    exports.ATTR_AZURE_CLIENT_ID = "azure.client.id";
    exports.ATTR_AZURE_COSMOSDB_CONNECTION_MODE = "azure.cosmosdb.connection.mode";
    exports.AZURE_COSMOSDB_CONNECTION_MODE_VALUE_DIRECT = "direct";
    exports.AZURE_COSMOSDB_CONNECTION_MODE_VALUE_GATEWAY = "gateway";
    exports.ATTR_AZURE_COSMOSDB_CONSISTENCY_LEVEL = "azure.cosmosdb.consistency.level";
    exports.AZURE_COSMOSDB_CONSISTENCY_LEVEL_VALUE_BOUNDED_STALENESS = "BoundedStaleness";
    exports.AZURE_COSMOSDB_CONSISTENCY_LEVEL_VALUE_CONSISTENT_PREFIX = "ConsistentPrefix";
    exports.AZURE_COSMOSDB_CONSISTENCY_LEVEL_VALUE_EVENTUAL = "Eventual";
    exports.AZURE_COSMOSDB_CONSISTENCY_LEVEL_VALUE_SESSION = "Session";
    exports.AZURE_COSMOSDB_CONSISTENCY_LEVEL_VALUE_STRONG = "Strong";
    exports.ATTR_AZURE_COSMOSDB_OPERATION_CONTACTED_REGIONS = "azure.cosmosdb.operation.contacted_regions";
    exports.ATTR_AZURE_COSMOSDB_OPERATION_REQUEST_CHARGE = "azure.cosmosdb.operation.request_charge";
    exports.ATTR_AZURE_COSMOSDB_REQUEST_BODY_SIZE = "azure.cosmosdb.request.body.size";
    exports.ATTR_AZURE_COSMOSDB_RESPONSE_SUB_STATUS_CODE = "azure.cosmosdb.response.sub_status_code";
    exports.ATTR_AZURE_RESOURCE_PROVIDER_NAMESPACE = "azure.resource_provider.namespace";
    exports.ATTR_AZURE_SERVICE_REQUEST_ID = "azure.service.request.id";
    exports.ATTR_BROWSER_BRANDS = "browser.brands";
    exports.ATTR_BROWSER_LANGUAGE = "browser.language";
    exports.ATTR_BROWSER_MOBILE = "browser.mobile";
    exports.ATTR_BROWSER_PLATFORM = "browser.platform";
    exports.ATTR_CASSANDRA_CONSISTENCY_LEVEL = "cassandra.consistency.level";
    exports.CASSANDRA_CONSISTENCY_LEVEL_VALUE_ALL = "all";
    exports.CASSANDRA_CONSISTENCY_LEVEL_VALUE_ANY = "any";
    exports.CASSANDRA_CONSISTENCY_LEVEL_VALUE_EACH_QUORUM = "each_quorum";
    exports.CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_ONE = "local_one";
    exports.CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_QUORUM = "local_quorum";
    exports.CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_SERIAL = "local_serial";
    exports.CASSANDRA_CONSISTENCY_LEVEL_VALUE_ONE = "one";
    exports.CASSANDRA_CONSISTENCY_LEVEL_VALUE_QUORUM = "quorum";
    exports.CASSANDRA_CONSISTENCY_LEVEL_VALUE_SERIAL = "serial";
    exports.CASSANDRA_CONSISTENCY_LEVEL_VALUE_THREE = "three";
    exports.CASSANDRA_CONSISTENCY_LEVEL_VALUE_TWO = "two";
    exports.ATTR_CASSANDRA_COORDINATOR_DC = "cassandra.coordinator.dc";
    exports.ATTR_CASSANDRA_COORDINATOR_ID = "cassandra.coordinator.id";
    exports.ATTR_CASSANDRA_PAGE_SIZE = "cassandra.page.size";
    exports.ATTR_CASSANDRA_QUERY_IDEMPOTENT = "cassandra.query.idempotent";
    exports.ATTR_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = "cassandra.speculative_execution.count";
    exports.ATTR_CICD_PIPELINE_ACTION_NAME = "cicd.pipeline.action.name";
    exports.CICD_PIPELINE_ACTION_NAME_VALUE_BUILD = "BUILD";
    exports.CICD_PIPELINE_ACTION_NAME_VALUE_RUN = "RUN";
    exports.CICD_PIPELINE_ACTION_NAME_VALUE_SYNC = "SYNC";
    exports.ATTR_CICD_PIPELINE_NAME = "cicd.pipeline.name";
    exports.ATTR_CICD_PIPELINE_RESULT = "cicd.pipeline.result";
    exports.CICD_PIPELINE_RESULT_VALUE_CANCELLATION = "cancellation";
    exports.CICD_PIPELINE_RESULT_VALUE_ERROR = "error";
    exports.CICD_PIPELINE_RESULT_VALUE_FAILURE = "failure";
    exports.CICD_PIPELINE_RESULT_VALUE_SKIP = "skip";
    exports.CICD_PIPELINE_RESULT_VALUE_SUCCESS = "success";
    exports.CICD_PIPELINE_RESULT_VALUE_TIMEOUT = "timeout";
    exports.ATTR_CICD_PIPELINE_RUN_ID = "cicd.pipeline.run.id";
    exports.ATTR_CICD_PIPELINE_RUN_STATE = "cicd.pipeline.run.state";
    exports.CICD_PIPELINE_RUN_STATE_VALUE_EXECUTING = "executing";
    exports.CICD_PIPELINE_RUN_STATE_VALUE_FINALIZING = "finalizing";
    exports.CICD_PIPELINE_RUN_STATE_VALUE_PENDING = "pending";
    exports.ATTR_CICD_PIPELINE_RUN_URL_FULL = "cicd.pipeline.run.url.full";
    exports.ATTR_CICD_PIPELINE_TASK_NAME = "cicd.pipeline.task.name";
    exports.ATTR_CICD_PIPELINE_TASK_RUN_ID = "cicd.pipeline.task.run.id";
    exports.ATTR_CICD_PIPELINE_TASK_RUN_RESULT = "cicd.pipeline.task.run.result";
    exports.CICD_PIPELINE_TASK_RUN_RESULT_VALUE_CANCELLATION = "cancellation";
    exports.CICD_PIPELINE_TASK_RUN_RESULT_VALUE_ERROR = "error";
    exports.CICD_PIPELINE_TASK_RUN_RESULT_VALUE_FAILURE = "failure";
    exports.CICD_PIPELINE_TASK_RUN_RESULT_VALUE_SKIP = "skip";
    exports.CICD_PIPELINE_TASK_RUN_RESULT_VALUE_SUCCESS = "success";
    exports.CICD_PIPELINE_TASK_RUN_RESULT_VALUE_TIMEOUT = "timeout";
    exports.ATTR_CICD_PIPELINE_TASK_RUN_URL_FULL = "cicd.pipeline.task.run.url.full";
    exports.ATTR_CICD_PIPELINE_TASK_TYPE = "cicd.pipeline.task.type";
    exports.CICD_PIPELINE_TASK_TYPE_VALUE_BUILD = "build";
    exports.CICD_PIPELINE_TASK_TYPE_VALUE_DEPLOY = "deploy";
    exports.CICD_PIPELINE_TASK_TYPE_VALUE_TEST = "test";
    exports.ATTR_CICD_SYSTEM_COMPONENT = "cicd.system.component";
    exports.ATTR_CICD_WORKER_ID = "cicd.worker.id";
    exports.ATTR_CICD_WORKER_NAME = "cicd.worker.name";
    exports.ATTR_CICD_WORKER_STATE = "cicd.worker.state";
    exports.CICD_WORKER_STATE_VALUE_AVAILABLE = "available";
    exports.CICD_WORKER_STATE_VALUE_BUSY = "busy";
    exports.CICD_WORKER_STATE_VALUE_OFFLINE = "offline";
    exports.ATTR_CICD_WORKER_URL_FULL = "cicd.worker.url.full";
    exports.ATTR_CLOUD_ACCOUNT_ID = "cloud.account.id";
    exports.ATTR_CLOUD_AVAILABILITY_ZONE = "cloud.availability_zone";
    exports.ATTR_CLOUD_PLATFORM = "cloud.platform";
    exports.CLOUD_PLATFORM_VALUE_ALIBABA_CLOUD_ECS = "alibaba_cloud_ecs";
    exports.CLOUD_PLATFORM_VALUE_ALIBABA_CLOUD_FC = "alibaba_cloud_fc";
    exports.CLOUD_PLATFORM_VALUE_ALIBABA_CLOUD_OPENSHIFT = "alibaba_cloud_openshift";
    exports.CLOUD_PLATFORM_VALUE_AWS_APP_RUNNER = "aws_app_runner";
    exports.CLOUD_PLATFORM_VALUE_AWS_EC2 = "aws_ec2";
    exports.CLOUD_PLATFORM_VALUE_AWS_ECS = "aws_ecs";
    exports.CLOUD_PLATFORM_VALUE_AWS_EKS = "aws_eks";
    exports.CLOUD_PLATFORM_VALUE_AWS_ELASTIC_BEANSTALK = "aws_elastic_beanstalk";
    exports.CLOUD_PLATFORM_VALUE_AWS_LAMBDA = "aws_lambda";
    exports.CLOUD_PLATFORM_VALUE_AWS_OPENSHIFT = "aws_openshift";
    exports.CLOUD_PLATFORM_VALUE_AZURE_AKS = "azure.aks";
    exports.CLOUD_PLATFORM_VALUE_AZURE_APP_SERVICE = "azure.app_service";
    exports.CLOUD_PLATFORM_VALUE_AZURE_CONTAINER_APPS = "azure.container_apps";
    exports.CLOUD_PLATFORM_VALUE_AZURE_CONTAINER_INSTANCES = "azure.container_instances";
    exports.CLOUD_PLATFORM_VALUE_AZURE_FUNCTIONS = "azure.functions";
    exports.CLOUD_PLATFORM_VALUE_AZURE_OPENSHIFT = "azure.openshift";
    exports.CLOUD_PLATFORM_VALUE_AZURE_VM = "azure.vm";
    exports.CLOUD_PLATFORM_VALUE_GCP_APP_ENGINE = "gcp_app_engine";
    exports.CLOUD_PLATFORM_VALUE_GCP_BARE_METAL_SOLUTION = "gcp_bare_metal_solution";
    exports.CLOUD_PLATFORM_VALUE_GCP_CLOUD_FUNCTIONS = "gcp_cloud_functions";
    exports.CLOUD_PLATFORM_VALUE_GCP_CLOUD_RUN = "gcp_cloud_run";
    exports.CLOUD_PLATFORM_VALUE_GCP_COMPUTE_ENGINE = "gcp_compute_engine";
    exports.CLOUD_PLATFORM_VALUE_GCP_KUBERNETES_ENGINE = "gcp_kubernetes_engine";
    exports.CLOUD_PLATFORM_VALUE_GCP_OPENSHIFT = "gcp_openshift";
    exports.CLOUD_PLATFORM_VALUE_IBM_CLOUD_OPENSHIFT = "ibm_cloud_openshift";
    exports.CLOUD_PLATFORM_VALUE_ORACLE_CLOUD_COMPUTE = "oracle_cloud_compute";
    exports.CLOUD_PLATFORM_VALUE_ORACLE_CLOUD_OKE = "oracle_cloud_oke";
    exports.CLOUD_PLATFORM_VALUE_TENCENT_CLOUD_CVM = "tencent_cloud_cvm";
    exports.CLOUD_PLATFORM_VALUE_TENCENT_CLOUD_EKS = "tencent_cloud_eks";
    exports.CLOUD_PLATFORM_VALUE_TENCENT_CLOUD_SCF = "tencent_cloud_scf";
    exports.ATTR_CLOUD_PROVIDER = "cloud.provider";
    exports.CLOUD_PROVIDER_VALUE_ALIBABA_CLOUD = "alibaba_cloud";
    exports.CLOUD_PROVIDER_VALUE_AWS = "aws";
    exports.CLOUD_PROVIDER_VALUE_AZURE = "azure";
    exports.CLOUD_PROVIDER_VALUE_GCP = "gcp";
    exports.CLOUD_PROVIDER_VALUE_HEROKU = "heroku";
    exports.CLOUD_PROVIDER_VALUE_IBM_CLOUD = "ibm_cloud";
    exports.CLOUD_PROVIDER_VALUE_ORACLE_CLOUD = "oracle_cloud";
    exports.CLOUD_PROVIDER_VALUE_TENCENT_CLOUD = "tencent_cloud";
    exports.ATTR_CLOUD_REGION = "cloud.region";
    exports.ATTR_CLOUD_RESOURCE_ID = "cloud.resource_id";
    exports.ATTR_CLOUDEVENTS_EVENT_ID = "cloudevents.event_id";
    exports.ATTR_CLOUDEVENTS_EVENT_SOURCE = "cloudevents.event_source";
    exports.ATTR_CLOUDEVENTS_EVENT_SPEC_VERSION = "cloudevents.event_spec_version";
    exports.ATTR_CLOUDEVENTS_EVENT_SUBJECT = "cloudevents.event_subject";
    exports.ATTR_CLOUDEVENTS_EVENT_TYPE = "cloudevents.event_type";
    exports.ATTR_CLOUDFOUNDRY_APP_ID = "cloudfoundry.app.id";
    exports.ATTR_CLOUDFOUNDRY_APP_INSTANCE_ID = "cloudfoundry.app.instance.id";
    exports.ATTR_CLOUDFOUNDRY_APP_NAME = "cloudfoundry.app.name";
    exports.ATTR_CLOUDFOUNDRY_ORG_ID = "cloudfoundry.org.id";
    exports.ATTR_CLOUDFOUNDRY_ORG_NAME = "cloudfoundry.org.name";
    exports.ATTR_CLOUDFOUNDRY_PROCESS_ID = "cloudfoundry.process.id";
    exports.ATTR_CLOUDFOUNDRY_PROCESS_TYPE = "cloudfoundry.process.type";
    exports.ATTR_CLOUDFOUNDRY_SPACE_ID = "cloudfoundry.space.id";
    exports.ATTR_CLOUDFOUNDRY_SPACE_NAME = "cloudfoundry.space.name";
    exports.ATTR_CLOUDFOUNDRY_SYSTEM_ID = "cloudfoundry.system.id";
    exports.ATTR_CLOUDFOUNDRY_SYSTEM_INSTANCE_ID = "cloudfoundry.system.instance.id";
    exports.ATTR_CODE_COLUMN = "code.column";
    exports.ATTR_CODE_FILEPATH = "code.filepath";
    exports.ATTR_CODE_FUNCTION = "code.function";
    exports.ATTR_CODE_LINENO = "code.lineno";
    exports.ATTR_CODE_NAMESPACE = "code.namespace";
    exports.ATTR_CONTAINER_COMMAND = "container.command";
    exports.ATTR_CONTAINER_COMMAND_ARGS = "container.command_args";
    exports.ATTR_CONTAINER_COMMAND_LINE = "container.command_line";
    exports.ATTR_CONTAINER_CPU_STATE = "container.cpu.state";
    exports.CONTAINER_CPU_STATE_VALUE_KERNEL = "kernel";
    exports.CONTAINER_CPU_STATE_VALUE_SYSTEM = "system";
    exports.CONTAINER_CPU_STATE_VALUE_USER = "user";
    exports.ATTR_CONTAINER_CSI_PLUGIN_NAME = "container.csi.plugin.name";
    exports.ATTR_CONTAINER_CSI_VOLUME_ID = "container.csi.volume.id";
    exports.ATTR_CONTAINER_ID = "container.id";
    exports.ATTR_CONTAINER_IMAGE_ID = "container.image.id";
    exports.ATTR_CONTAINER_IMAGE_NAME = "container.image.name";
    exports.ATTR_CONTAINER_IMAGE_REPO_DIGESTS = "container.image.repo_digests";
    exports.ATTR_CONTAINER_IMAGE_TAGS = "container.image.tags";
    var ATTR_CONTAINER_LABEL = /* @__PURE__ */ __name((key) => `container.label.${key}`, "ATTR_CONTAINER_LABEL");
    exports.ATTR_CONTAINER_LABEL = ATTR_CONTAINER_LABEL;
    var ATTR_CONTAINER_LABELS = /* @__PURE__ */ __name((key) => `container.labels.${key}`, "ATTR_CONTAINER_LABELS");
    exports.ATTR_CONTAINER_LABELS = ATTR_CONTAINER_LABELS;
    exports.ATTR_CONTAINER_NAME = "container.name";
    exports.ATTR_CONTAINER_RUNTIME = "container.runtime";
    exports.ATTR_CONTAINER_RUNTIME_DESCRIPTION = "container.runtime.description";
    exports.ATTR_CONTAINER_RUNTIME_NAME = "container.runtime.name";
    exports.ATTR_CONTAINER_RUNTIME_VERSION = "container.runtime.version";
    exports.ATTR_CPU_LOGICAL_NUMBER = "cpu.logical_number";
    exports.ATTR_CPU_MODE = "cpu.mode";
    exports.CPU_MODE_VALUE_IDLE = "idle";
    exports.CPU_MODE_VALUE_INTERRUPT = "interrupt";
    exports.CPU_MODE_VALUE_IOWAIT = "iowait";
    exports.CPU_MODE_VALUE_KERNEL = "kernel";
    exports.CPU_MODE_VALUE_NICE = "nice";
    exports.CPU_MODE_VALUE_STEAL = "steal";
    exports.CPU_MODE_VALUE_SYSTEM = "system";
    exports.CPU_MODE_VALUE_USER = "user";
    exports.ATTR_CPYTHON_GC_GENERATION = "cpython.gc.generation";
    exports.CPYTHON_GC_GENERATION_VALUE_GENERATION_0 = 0;
    exports.CPYTHON_GC_GENERATION_VALUE_GENERATION_1 = 1;
    exports.CPYTHON_GC_GENERATION_VALUE_GENERATION_2 = 2;
    exports.ATTR_DB_CASSANDRA_CONSISTENCY_LEVEL = "db.cassandra.consistency_level";
    exports.DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_ALL = "all";
    exports.DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_ANY = "any";
    exports.DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_EACH_QUORUM = "each_quorum";
    exports.DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_ONE = "local_one";
    exports.DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_QUORUM = "local_quorum";
    exports.DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_SERIAL = "local_serial";
    exports.DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_ONE = "one";
    exports.DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_QUORUM = "quorum";
    exports.DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_SERIAL = "serial";
    exports.DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_THREE = "three";
    exports.DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_TWO = "two";
    exports.ATTR_DB_CASSANDRA_COORDINATOR_DC = "db.cassandra.coordinator.dc";
    exports.ATTR_DB_CASSANDRA_COORDINATOR_ID = "db.cassandra.coordinator.id";
    exports.ATTR_DB_CASSANDRA_IDEMPOTENCE = "db.cassandra.idempotence";
    exports.ATTR_DB_CASSANDRA_PAGE_SIZE = "db.cassandra.page_size";
    exports.ATTR_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = "db.cassandra.speculative_execution_count";
    exports.ATTR_DB_CASSANDRA_TABLE = "db.cassandra.table";
    exports.ATTR_DB_CLIENT_CONNECTION_POOL_NAME = "db.client.connection.pool.name";
    exports.ATTR_DB_CLIENT_CONNECTION_STATE = "db.client.connection.state";
    exports.DB_CLIENT_CONNECTION_STATE_VALUE_IDLE = "idle";
    exports.DB_CLIENT_CONNECTION_STATE_VALUE_USED = "used";
    exports.ATTR_DB_CLIENT_CONNECTIONS_POOL_NAME = "db.client.connections.pool.name";
    exports.ATTR_DB_CLIENT_CONNECTIONS_STATE = "db.client.connections.state";
    exports.DB_CLIENT_CONNECTIONS_STATE_VALUE_IDLE = "idle";
    exports.DB_CLIENT_CONNECTIONS_STATE_VALUE_USED = "used";
    exports.ATTR_DB_CONNECTION_STRING = "db.connection_string";
    exports.ATTR_DB_COSMOSDB_CLIENT_ID = "db.cosmosdb.client_id";
    exports.ATTR_DB_COSMOSDB_CONNECTION_MODE = "db.cosmosdb.connection_mode";
    exports.DB_COSMOSDB_CONNECTION_MODE_VALUE_DIRECT = "direct";
    exports.DB_COSMOSDB_CONNECTION_MODE_VALUE_GATEWAY = "gateway";
    exports.ATTR_DB_COSMOSDB_CONSISTENCY_LEVEL = "db.cosmosdb.consistency_level";
    exports.DB_COSMOSDB_CONSISTENCY_LEVEL_VALUE_BOUNDED_STALENESS = "BoundedStaleness";
    exports.DB_COSMOSDB_CONSISTENCY_LEVEL_VALUE_CONSISTENT_PREFIX = "ConsistentPrefix";
    exports.DB_COSMOSDB_CONSISTENCY_LEVEL_VALUE_EVENTUAL = "Eventual";
    exports.DB_COSMOSDB_CONSISTENCY_LEVEL_VALUE_SESSION = "Session";
    exports.DB_COSMOSDB_CONSISTENCY_LEVEL_VALUE_STRONG = "Strong";
    exports.ATTR_DB_COSMOSDB_CONTAINER = "db.cosmosdb.container";
    exports.ATTR_DB_COSMOSDB_OPERATION_TYPE = "db.cosmosdb.operation_type";
    exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_BATCH = "batch";
    exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_CREATE = "create";
    exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_DELETE = "delete";
    exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_EXECUTE = "execute";
    exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_EXECUTE_JAVASCRIPT = "execute_javascript";
    exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_HEAD = "head";
    exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_HEAD_FEED = "head_feed";
    exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_INVALID = "invalid";
    exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_PATCH = "patch";
    exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_QUERY = "query";
    exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_QUERY_PLAN = "query_plan";
    exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_READ = "read";
    exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_READ_FEED = "read_feed";
    exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_REPLACE = "replace";
    exports.DB_COSMOSDB_OPERATION_TYPE_VALUE_UPSERT = "upsert";
    exports.ATTR_DB_COSMOSDB_REGIONS_CONTACTED = "db.cosmosdb.regions_contacted";
    exports.ATTR_DB_COSMOSDB_REQUEST_CHARGE = "db.cosmosdb.request_charge";
    exports.ATTR_DB_COSMOSDB_REQUEST_CONTENT_LENGTH = "db.cosmosdb.request_content_length";
    exports.ATTR_DB_COSMOSDB_STATUS_CODE = "db.cosmosdb.status_code";
    exports.ATTR_DB_COSMOSDB_SUB_STATUS_CODE = "db.cosmosdb.sub_status_code";
    exports.ATTR_DB_ELASTICSEARCH_CLUSTER_NAME = "db.elasticsearch.cluster.name";
    exports.ATTR_DB_ELASTICSEARCH_NODE_NAME = "db.elasticsearch.node.name";
    var ATTR_DB_ELASTICSEARCH_PATH_PARTS = /* @__PURE__ */ __name((key) => `db.elasticsearch.path_parts.${key}`, "ATTR_DB_ELASTICSEARCH_PATH_PARTS");
    exports.ATTR_DB_ELASTICSEARCH_PATH_PARTS = ATTR_DB_ELASTICSEARCH_PATH_PARTS;
    exports.ATTR_DB_INSTANCE_ID = "db.instance.id";
    exports.ATTR_DB_JDBC_DRIVER_CLASSNAME = "db.jdbc.driver_classname";
    exports.ATTR_DB_MONGODB_COLLECTION = "db.mongodb.collection";
    exports.ATTR_DB_MSSQL_INSTANCE_NAME = "db.mssql.instance_name";
    exports.ATTR_DB_NAME = "db.name";
    exports.ATTR_DB_OPERATION = "db.operation";
    var ATTR_DB_OPERATION_PARAMETER = /* @__PURE__ */ __name((key) => `db.operation.parameter.${key}`, "ATTR_DB_OPERATION_PARAMETER");
    exports.ATTR_DB_OPERATION_PARAMETER = ATTR_DB_OPERATION_PARAMETER;
    var ATTR_DB_QUERY_PARAMETER = /* @__PURE__ */ __name((key) => `db.query.parameter.${key}`, "ATTR_DB_QUERY_PARAMETER");
    exports.ATTR_DB_QUERY_PARAMETER = ATTR_DB_QUERY_PARAMETER;
    exports.ATTR_DB_REDIS_DATABASE_INDEX = "db.redis.database_index";
    exports.ATTR_DB_RESPONSE_RETURNED_ROWS = "db.response.returned_rows";
    exports.ATTR_DB_SQL_TABLE = "db.sql.table";
    exports.ATTR_DB_STATEMENT = "db.statement";
    exports.ATTR_DB_SYSTEM = "db.system";
    exports.DB_SYSTEM_VALUE_ADABAS = "adabas";
    exports.DB_SYSTEM_VALUE_CACHE = "cache";
    exports.DB_SYSTEM_VALUE_CASSANDRA = "cassandra";
    exports.DB_SYSTEM_VALUE_CLICKHOUSE = "clickhouse";
    exports.DB_SYSTEM_VALUE_CLOUDSCAPE = "cloudscape";
    exports.DB_SYSTEM_VALUE_COCKROACHDB = "cockroachdb";
    exports.DB_SYSTEM_VALUE_COLDFUSION = "coldfusion";
    exports.DB_SYSTEM_VALUE_COSMOSDB = "cosmosdb";
    exports.DB_SYSTEM_VALUE_COUCHBASE = "couchbase";
    exports.DB_SYSTEM_VALUE_COUCHDB = "couchdb";
    exports.DB_SYSTEM_VALUE_DB2 = "db2";
    exports.DB_SYSTEM_VALUE_DERBY = "derby";
    exports.DB_SYSTEM_VALUE_DYNAMODB = "dynamodb";
    exports.DB_SYSTEM_VALUE_EDB = "edb";
    exports.DB_SYSTEM_VALUE_ELASTICSEARCH = "elasticsearch";
    exports.DB_SYSTEM_VALUE_FILEMAKER = "filemaker";
    exports.DB_SYSTEM_VALUE_FIREBIRD = "firebird";
    exports.DB_SYSTEM_VALUE_FIRSTSQL = "firstsql";
    exports.DB_SYSTEM_VALUE_GEODE = "geode";
    exports.DB_SYSTEM_VALUE_H2 = "h2";
    exports.DB_SYSTEM_VALUE_HANADB = "hanadb";
    exports.DB_SYSTEM_VALUE_HBASE = "hbase";
    exports.DB_SYSTEM_VALUE_HIVE = "hive";
    exports.DB_SYSTEM_VALUE_HSQLDB = "hsqldb";
    exports.DB_SYSTEM_VALUE_INFLUXDB = "influxdb";
    exports.DB_SYSTEM_VALUE_INFORMIX = "informix";
    exports.DB_SYSTEM_VALUE_INGRES = "ingres";
    exports.DB_SYSTEM_VALUE_INSTANTDB = "instantdb";
    exports.DB_SYSTEM_VALUE_INTERBASE = "interbase";
    exports.DB_SYSTEM_VALUE_INTERSYSTEMS_CACHE = "intersystems_cache";
    exports.DB_SYSTEM_VALUE_MARIADB = "mariadb";
    exports.DB_SYSTEM_VALUE_MAXDB = "maxdb";
    exports.DB_SYSTEM_VALUE_MEMCACHED = "memcached";
    exports.DB_SYSTEM_VALUE_MONGODB = "mongodb";
    exports.DB_SYSTEM_VALUE_MSSQL = "mssql";
    exports.DB_SYSTEM_VALUE_MSSQLCOMPACT = "mssqlcompact";
    exports.DB_SYSTEM_VALUE_MYSQL = "mysql";
    exports.DB_SYSTEM_VALUE_NEO4J = "neo4j";
    exports.DB_SYSTEM_VALUE_NETEZZA = "netezza";
    exports.DB_SYSTEM_VALUE_OPENSEARCH = "opensearch";
    exports.DB_SYSTEM_VALUE_ORACLE = "oracle";
    exports.DB_SYSTEM_VALUE_OTHER_SQL = "other_sql";
    exports.DB_SYSTEM_VALUE_PERVASIVE = "pervasive";
    exports.DB_SYSTEM_VALUE_POINTBASE = "pointbase";
    exports.DB_SYSTEM_VALUE_POSTGRESQL = "postgresql";
    exports.DB_SYSTEM_VALUE_PROGRESS = "progress";
    exports.DB_SYSTEM_VALUE_REDIS = "redis";
    exports.DB_SYSTEM_VALUE_REDSHIFT = "redshift";
    exports.DB_SYSTEM_VALUE_SPANNER = "spanner";
    exports.DB_SYSTEM_VALUE_SQLITE = "sqlite";
    exports.DB_SYSTEM_VALUE_SYBASE = "sybase";
    exports.DB_SYSTEM_VALUE_TERADATA = "teradata";
    exports.DB_SYSTEM_VALUE_TRINO = "trino";
    exports.DB_SYSTEM_VALUE_VERTICA = "vertica";
    exports.DB_SYSTEM_NAME_VALUE_ACTIAN_INGRES = "actian.ingres";
    exports.DB_SYSTEM_NAME_VALUE_AWS_DYNAMODB = "aws.dynamodb";
    exports.DB_SYSTEM_NAME_VALUE_AWS_REDSHIFT = "aws.redshift";
    exports.DB_SYSTEM_NAME_VALUE_AZURE_COSMOSDB = "azure.cosmosdb";
    exports.DB_SYSTEM_NAME_VALUE_CASSANDRA = "cassandra";
    exports.DB_SYSTEM_NAME_VALUE_CLICKHOUSE = "clickhouse";
    exports.DB_SYSTEM_NAME_VALUE_COCKROACHDB = "cockroachdb";
    exports.DB_SYSTEM_NAME_VALUE_COUCHBASE = "couchbase";
    exports.DB_SYSTEM_NAME_VALUE_COUCHDB = "couchdb";
    exports.DB_SYSTEM_NAME_VALUE_DERBY = "derby";
    exports.DB_SYSTEM_NAME_VALUE_ELASTICSEARCH = "elasticsearch";
    exports.DB_SYSTEM_NAME_VALUE_FIREBIRDSQL = "firebirdsql";
    exports.DB_SYSTEM_NAME_VALUE_GCP_SPANNER = "gcp.spanner";
    exports.DB_SYSTEM_NAME_VALUE_GEODE = "geode";
    exports.DB_SYSTEM_NAME_VALUE_H2DATABASE = "h2database";
    exports.DB_SYSTEM_NAME_VALUE_HBASE = "hbase";
    exports.DB_SYSTEM_NAME_VALUE_HIVE = "hive";
    exports.DB_SYSTEM_NAME_VALUE_HSQLDB = "hsqldb";
    exports.DB_SYSTEM_NAME_VALUE_IBM_DB2 = "ibm.db2";
    exports.DB_SYSTEM_NAME_VALUE_IBM_INFORMIX = "ibm.informix";
    exports.DB_SYSTEM_NAME_VALUE_IBM_NETEZZA = "ibm.netezza";
    exports.DB_SYSTEM_NAME_VALUE_INFLUXDB = "influxdb";
    exports.DB_SYSTEM_NAME_VALUE_INSTANTDB = "instantdb";
    exports.DB_SYSTEM_NAME_VALUE_INTERSYSTEMS_CACHE = "intersystems.cache";
    exports.DB_SYSTEM_NAME_VALUE_MEMCACHED = "memcached";
    exports.DB_SYSTEM_NAME_VALUE_MONGODB = "mongodb";
    exports.DB_SYSTEM_NAME_VALUE_NEO4J = "neo4j";
    exports.DB_SYSTEM_NAME_VALUE_OPENSEARCH = "opensearch";
    exports.DB_SYSTEM_NAME_VALUE_ORACLE_DB = "oracle.db";
    exports.DB_SYSTEM_NAME_VALUE_OTHER_SQL = "other_sql";
    exports.DB_SYSTEM_NAME_VALUE_REDIS = "redis";
    exports.DB_SYSTEM_NAME_VALUE_SAP_HANA = "sap.hana";
    exports.DB_SYSTEM_NAME_VALUE_SAP_MAXDB = "sap.maxdb";
    exports.DB_SYSTEM_NAME_VALUE_SOFTWAREAG_ADABAS = "softwareag.adabas";
    exports.DB_SYSTEM_NAME_VALUE_SQLITE = "sqlite";
    exports.DB_SYSTEM_NAME_VALUE_TERADATA = "teradata";
    exports.DB_SYSTEM_NAME_VALUE_TRINO = "trino";
    exports.ATTR_DB_USER = "db.user";
    exports.ATTR_DEPLOYMENT_ENVIRONMENT = "deployment.environment";
    exports.ATTR_DEPLOYMENT_ENVIRONMENT_NAME = "deployment.environment.name";
    exports.ATTR_DEPLOYMENT_ID = "deployment.id";
    exports.ATTR_DEPLOYMENT_NAME = "deployment.name";
    exports.ATTR_DEPLOYMENT_STATUS = "deployment.status";
    exports.DEPLOYMENT_STATUS_VALUE_FAILED = "failed";
    exports.DEPLOYMENT_STATUS_VALUE_SUCCEEDED = "succeeded";
    exports.ATTR_DESTINATION_ADDRESS = "destination.address";
    exports.ATTR_DESTINATION_PORT = "destination.port";
    exports.ATTR_DEVICE_ID = "device.id";
    exports.ATTR_DEVICE_MANUFACTURER = "device.manufacturer";
    exports.ATTR_DEVICE_MODEL_IDENTIFIER = "device.model.identifier";
    exports.ATTR_DEVICE_MODEL_NAME = "device.model.name";
    exports.ATTR_DISK_IO_DIRECTION = "disk.io.direction";
    exports.DISK_IO_DIRECTION_VALUE_READ = "read";
    exports.DISK_IO_DIRECTION_VALUE_WRITE = "write";
    exports.ATTR_DNS_ANSWERS = "dns.answers";
    exports.ATTR_DNS_QUESTION_NAME = "dns.question.name";
    exports.ATTR_ELASTICSEARCH_NODE_NAME = "elasticsearch.node.name";
    exports.ATTR_ENDUSER_ID = "enduser.id";
    exports.ATTR_ENDUSER_PSEUDO_ID = "enduser.pseudo.id";
    exports.ATTR_ENDUSER_ROLE = "enduser.role";
    exports.ATTR_ENDUSER_SCOPE = "enduser.scope";
    exports.ATTR_ERROR_MESSAGE = "error.message";
    exports.ATTR_EVENT_NAME = "event.name";
    exports.ATTR_FAAS_COLDSTART = "faas.coldstart";
    exports.ATTR_FAAS_CRON = "faas.cron";
    exports.ATTR_FAAS_DOCUMENT_COLLECTION = "faas.document.collection";
    exports.ATTR_FAAS_DOCUMENT_NAME = "faas.document.name";
    exports.ATTR_FAAS_DOCUMENT_OPERATION = "faas.document.operation";
    exports.FAAS_DOCUMENT_OPERATION_VALUE_DELETE = "delete";
    exports.FAAS_DOCUMENT_OPERATION_VALUE_EDIT = "edit";
    exports.FAAS_DOCUMENT_OPERATION_VALUE_INSERT = "insert";
    exports.ATTR_FAAS_DOCUMENT_TIME = "faas.document.time";
    exports.ATTR_FAAS_INSTANCE = "faas.instance";
    exports.ATTR_FAAS_INVOCATION_ID = "faas.invocation_id";
    exports.ATTR_FAAS_INVOKED_NAME = "faas.invoked_name";
    exports.ATTR_FAAS_INVOKED_PROVIDER = "faas.invoked_provider";
    exports.FAAS_INVOKED_PROVIDER_VALUE_ALIBABA_CLOUD = "alibaba_cloud";
    exports.FAAS_INVOKED_PROVIDER_VALUE_AWS = "aws";
    exports.FAAS_INVOKED_PROVIDER_VALUE_AZURE = "azure";
    exports.FAAS_INVOKED_PROVIDER_VALUE_GCP = "gcp";
    exports.FAAS_INVOKED_PROVIDER_VALUE_TENCENT_CLOUD = "tencent_cloud";
    exports.ATTR_FAAS_INVOKED_REGION = "faas.invoked_region";
    exports.ATTR_FAAS_MAX_MEMORY = "faas.max_memory";
    exports.ATTR_FAAS_NAME = "faas.name";
    exports.ATTR_FAAS_TIME = "faas.time";
    exports.ATTR_FAAS_TRIGGER = "faas.trigger";
    exports.FAAS_TRIGGER_VALUE_DATASOURCE = "datasource";
    exports.FAAS_TRIGGER_VALUE_HTTP = "http";
    exports.FAAS_TRIGGER_VALUE_OTHER = "other";
    exports.FAAS_TRIGGER_VALUE_PUBSUB = "pubsub";
    exports.FAAS_TRIGGER_VALUE_TIMER = "timer";
    exports.ATTR_FAAS_VERSION = "faas.version";
    exports.ATTR_FEATURE_FLAG_CONTEXT_ID = "feature_flag.context.id";
    exports.ATTR_FEATURE_FLAG_EVALUATION_ERROR_MESSAGE = "feature_flag.evaluation.error.message";
    exports.ATTR_FEATURE_FLAG_EVALUATION_REASON = "feature_flag.evaluation.reason";
    exports.FEATURE_FLAG_EVALUATION_REASON_VALUE_CACHED = "cached";
    exports.FEATURE_FLAG_EVALUATION_REASON_VALUE_DEFAULT = "default";
    exports.FEATURE_FLAG_EVALUATION_REASON_VALUE_DISABLED = "disabled";
    exports.FEATURE_FLAG_EVALUATION_REASON_VALUE_ERROR = "error";
    exports.FEATURE_FLAG_EVALUATION_REASON_VALUE_SPLIT = "split";
    exports.FEATURE_FLAG_EVALUATION_REASON_VALUE_STALE = "stale";
    exports.FEATURE_FLAG_EVALUATION_REASON_VALUE_STATIC = "static";
    exports.FEATURE_FLAG_EVALUATION_REASON_VALUE_TARGETING_MATCH = "targeting_match";
    exports.FEATURE_FLAG_EVALUATION_REASON_VALUE_UNKNOWN = "unknown";
    exports.ATTR_FEATURE_FLAG_KEY = "feature_flag.key";
    exports.ATTR_FEATURE_FLAG_PROVIDER_NAME = "feature_flag.provider.name";
    exports.ATTR_FEATURE_FLAG_RESULT_REASON = "feature_flag.result.reason";
    exports.FEATURE_FLAG_RESULT_REASON_VALUE_CACHED = "cached";
    exports.FEATURE_FLAG_RESULT_REASON_VALUE_DEFAULT = "default";
    exports.FEATURE_FLAG_RESULT_REASON_VALUE_DISABLED = "disabled";
    exports.FEATURE_FLAG_RESULT_REASON_VALUE_ERROR = "error";
    exports.FEATURE_FLAG_RESULT_REASON_VALUE_SPLIT = "split";
    exports.FEATURE_FLAG_RESULT_REASON_VALUE_STALE = "stale";
    exports.FEATURE_FLAG_RESULT_REASON_VALUE_STATIC = "static";
    exports.FEATURE_FLAG_RESULT_REASON_VALUE_TARGETING_MATCH = "targeting_match";
    exports.FEATURE_FLAG_RESULT_REASON_VALUE_UNKNOWN = "unknown";
    exports.ATTR_FEATURE_FLAG_RESULT_VALUE = "feature_flag.result.value";
    exports.ATTR_FEATURE_FLAG_RESULT_VARIANT = "feature_flag.result.variant";
    exports.ATTR_FEATURE_FLAG_SET_ID = "feature_flag.set.id";
    exports.ATTR_FEATURE_FLAG_VARIANT = "feature_flag.variant";
    exports.ATTR_FEATURE_FLAG_VERSION = "feature_flag.version";
    exports.ATTR_FILE_ACCESSED = "file.accessed";
    exports.ATTR_FILE_ATTRIBUTES = "file.attributes";
    exports.ATTR_FILE_CHANGED = "file.changed";
    exports.ATTR_FILE_CREATED = "file.created";
    exports.ATTR_FILE_DIRECTORY = "file.directory";
    exports.ATTR_FILE_EXTENSION = "file.extension";
    exports.ATTR_FILE_FORK_NAME = "file.fork_name";
    exports.ATTR_FILE_GROUP_ID = "file.group.id";
    exports.ATTR_FILE_GROUP_NAME = "file.group.name";
    exports.ATTR_FILE_INODE = "file.inode";
    exports.ATTR_FILE_MODE = "file.mode";
    exports.ATTR_FILE_MODIFIED = "file.modified";
    exports.ATTR_FILE_NAME = "file.name";
    exports.ATTR_FILE_OWNER_ID = "file.owner.id";
    exports.ATTR_FILE_OWNER_NAME = "file.owner.name";
    exports.ATTR_FILE_PATH = "file.path";
    exports.ATTR_FILE_SIZE = "file.size";
    exports.ATTR_FILE_SYMBOLIC_LINK_TARGET_PATH = "file.symbolic_link.target_path";
    exports.ATTR_GCP_APPHUB_APPLICATION_CONTAINER = "gcp.apphub.application.container";
    exports.ATTR_GCP_APPHUB_APPLICATION_ID = "gcp.apphub.application.id";
    exports.ATTR_GCP_APPHUB_APPLICATION_LOCATION = "gcp.apphub.application.location";
    exports.ATTR_GCP_APPHUB_SERVICE_CRITICALITY_TYPE = "gcp.apphub.service.criticality_type";
    exports.GCP_APPHUB_SERVICE_CRITICALITY_TYPE_VALUE_HIGH = "HIGH";
    exports.GCP_APPHUB_SERVICE_CRITICALITY_TYPE_VALUE_LOW = "LOW";
    exports.GCP_APPHUB_SERVICE_CRITICALITY_TYPE_VALUE_MEDIUM = "MEDIUM";
    exports.GCP_APPHUB_SERVICE_CRITICALITY_TYPE_VALUE_MISSION_CRITICAL = "MISSION_CRITICAL";
    exports.ATTR_GCP_APPHUB_SERVICE_ENVIRONMENT_TYPE = "gcp.apphub.service.environment_type";
    exports.GCP_APPHUB_SERVICE_ENVIRONMENT_TYPE_VALUE_DEVELOPMENT = "DEVELOPMENT";
    exports.GCP_APPHUB_SERVICE_ENVIRONMENT_TYPE_VALUE_PRODUCTION = "PRODUCTION";
    exports.GCP_APPHUB_SERVICE_ENVIRONMENT_TYPE_VALUE_STAGING = "STAGING";
    exports.GCP_APPHUB_SERVICE_ENVIRONMENT_TYPE_VALUE_TEST = "TEST";
    exports.ATTR_GCP_APPHUB_SERVICE_ID = "gcp.apphub.service.id";
    exports.ATTR_GCP_APPHUB_WORKLOAD_CRITICALITY_TYPE = "gcp.apphub.workload.criticality_type";
    exports.GCP_APPHUB_WORKLOAD_CRITICALITY_TYPE_VALUE_HIGH = "HIGH";
    exports.GCP_APPHUB_WORKLOAD_CRITICALITY_TYPE_VALUE_LOW = "LOW";
    exports.GCP_APPHUB_WORKLOAD_CRITICALITY_TYPE_VALUE_MEDIUM = "MEDIUM";
    exports.GCP_APPHUB_WORKLOAD_CRITICALITY_TYPE_VALUE_MISSION_CRITICAL = "MISSION_CRITICAL";
    exports.ATTR_GCP_APPHUB_WORKLOAD_ENVIRONMENT_TYPE = "gcp.apphub.workload.environment_type";
    exports.GCP_APPHUB_WORKLOAD_ENVIRONMENT_TYPE_VALUE_DEVELOPMENT = "DEVELOPMENT";
    exports.GCP_APPHUB_WORKLOAD_ENVIRONMENT_TYPE_VALUE_PRODUCTION = "PRODUCTION";
    exports.GCP_APPHUB_WORKLOAD_ENVIRONMENT_TYPE_VALUE_STAGING = "STAGING";
    exports.GCP_APPHUB_WORKLOAD_ENVIRONMENT_TYPE_VALUE_TEST = "TEST";
    exports.ATTR_GCP_APPHUB_WORKLOAD_ID = "gcp.apphub.workload.id";
    exports.ATTR_GCP_APPHUB_DESTINATION_APPLICATION_CONTAINER = "gcp.apphub_destination.application.container";
    exports.ATTR_GCP_APPHUB_DESTINATION_APPLICATION_ID = "gcp.apphub_destination.application.id";
    exports.ATTR_GCP_APPHUB_DESTINATION_APPLICATION_LOCATION = "gcp.apphub_destination.application.location";
    exports.ATTR_GCP_APPHUB_DESTINATION_SERVICE_CRITICALITY_TYPE = "gcp.apphub_destination.service.criticality_type";
    exports.GCP_APPHUB_DESTINATION_SERVICE_CRITICALITY_TYPE_VALUE_HIGH = "HIGH";
    exports.GCP_APPHUB_DESTINATION_SERVICE_CRITICALITY_TYPE_VALUE_LOW = "LOW";
    exports.GCP_APPHUB_DESTINATION_SERVICE_CRITICALITY_TYPE_VALUE_MEDIUM = "MEDIUM";
    exports.GCP_APPHUB_DESTINATION_SERVICE_CRITICALITY_TYPE_VALUE_MISSION_CRITICAL = "MISSION_CRITICAL";
    exports.ATTR_GCP_APPHUB_DESTINATION_SERVICE_ENVIRONMENT_TYPE = "gcp.apphub_destination.service.environment_type";
    exports.GCP_APPHUB_DESTINATION_SERVICE_ENVIRONMENT_TYPE_VALUE_DEVELOPMENT = "DEVELOPMENT";
    exports.GCP_APPHUB_DESTINATION_SERVICE_ENVIRONMENT_TYPE_VALUE_PRODUCTION = "PRODUCTION";
    exports.GCP_APPHUB_DESTINATION_SERVICE_ENVIRONMENT_TYPE_VALUE_STAGING = "STAGING";
    exports.GCP_APPHUB_DESTINATION_SERVICE_ENVIRONMENT_TYPE_VALUE_TEST = "TEST";
    exports.ATTR_GCP_APPHUB_DESTINATION_SERVICE_ID = "gcp.apphub_destination.service.id";
    exports.ATTR_GCP_APPHUB_DESTINATION_WORKLOAD_CRITICALITY_TYPE = "gcp.apphub_destination.workload.criticality_type";
    exports.GCP_APPHUB_DESTINATION_WORKLOAD_CRITICALITY_TYPE_VALUE_HIGH = "HIGH";
    exports.GCP_APPHUB_DESTINATION_WORKLOAD_CRITICALITY_TYPE_VALUE_LOW = "LOW";
    exports.GCP_APPHUB_DESTINATION_WORKLOAD_CRITICALITY_TYPE_VALUE_MEDIUM = "MEDIUM";
    exports.GCP_APPHUB_DESTINATION_WORKLOAD_CRITICALITY_TYPE_VALUE_MISSION_CRITICAL = "MISSION_CRITICAL";
    exports.ATTR_GCP_APPHUB_DESTINATION_WORKLOAD_ENVIRONMENT_TYPE = "gcp.apphub_destination.workload.environment_type";
    exports.GCP_APPHUB_DESTINATION_WORKLOAD_ENVIRONMENT_TYPE_VALUE_DEVELOPMENT = "DEVELOPMENT";
    exports.GCP_APPHUB_DESTINATION_WORKLOAD_ENVIRONMENT_TYPE_VALUE_PRODUCTION = "PRODUCTION";
    exports.GCP_APPHUB_DESTINATION_WORKLOAD_ENVIRONMENT_TYPE_VALUE_STAGING = "STAGING";
    exports.GCP_APPHUB_DESTINATION_WORKLOAD_ENVIRONMENT_TYPE_VALUE_TEST = "TEST";
    exports.ATTR_GCP_APPHUB_DESTINATION_WORKLOAD_ID = "gcp.apphub_destination.workload.id";
    exports.ATTR_GCP_CLIENT_SERVICE = "gcp.client.service";
    exports.ATTR_GCP_CLOUD_RUN_JOB_EXECUTION = "gcp.cloud_run.job.execution";
    exports.ATTR_GCP_CLOUD_RUN_JOB_TASK_INDEX = "gcp.cloud_run.job.task_index";
    exports.ATTR_GCP_GCE_INSTANCE_HOSTNAME = "gcp.gce.instance.hostname";
    exports.ATTR_GCP_GCE_INSTANCE_NAME = "gcp.gce.instance.name";
    exports.ATTR_GEN_AI_AGENT_DESCRIPTION = "gen_ai.agent.description";
    exports.ATTR_GEN_AI_AGENT_ID = "gen_ai.agent.id";
    exports.ATTR_GEN_AI_AGENT_NAME = "gen_ai.agent.name";
    exports.ATTR_GEN_AI_COMPLETION = "gen_ai.completion";
    exports.ATTR_GEN_AI_CONVERSATION_ID = "gen_ai.conversation.id";
    exports.ATTR_GEN_AI_DATA_SOURCE_ID = "gen_ai.data_source.id";
    exports.ATTR_GEN_AI_EMBEDDINGS_DIMENSION_COUNT = "gen_ai.embeddings.dimension.count";
    exports.ATTR_GEN_AI_EVALUATION_EXPLANATION = "gen_ai.evaluation.explanation";
    exports.ATTR_GEN_AI_EVALUATION_NAME = "gen_ai.evaluation.name";
    exports.ATTR_GEN_AI_EVALUATION_SCORE_LABEL = "gen_ai.evaluation.score.label";
    exports.ATTR_GEN_AI_EVALUATION_SCORE_VALUE = "gen_ai.evaluation.score.value";
    exports.ATTR_GEN_AI_INPUT_MESSAGES = "gen_ai.input.messages";
    exports.ATTR_GEN_AI_OPENAI_REQUEST_RESPONSE_FORMAT = "gen_ai.openai.request.response_format";
    exports.GEN_AI_OPENAI_REQUEST_RESPONSE_FORMAT_VALUE_JSON_OBJECT = "json_object";
    exports.GEN_AI_OPENAI_REQUEST_RESPONSE_FORMAT_VALUE_JSON_SCHEMA = "json_schema";
    exports.GEN_AI_OPENAI_REQUEST_RESPONSE_FORMAT_VALUE_TEXT = "text";
    exports.ATTR_GEN_AI_OPENAI_REQUEST_SEED = "gen_ai.openai.request.seed";
    exports.ATTR_GEN_AI_OPENAI_REQUEST_SERVICE_TIER = "gen_ai.openai.request.service_tier";
    exports.GEN_AI_OPENAI_REQUEST_SERVICE_TIER_VALUE_AUTO = "auto";
    exports.GEN_AI_OPENAI_REQUEST_SERVICE_TIER_VALUE_DEFAULT = "default";
    exports.ATTR_GEN_AI_OPENAI_RESPONSE_SERVICE_TIER = "gen_ai.openai.response.service_tier";
    exports.ATTR_GEN_AI_OPENAI_RESPONSE_SYSTEM_FINGERPRINT = "gen_ai.openai.response.system_fingerprint";
    exports.ATTR_GEN_AI_OPERATION_NAME = "gen_ai.operation.name";
    exports.GEN_AI_OPERATION_NAME_VALUE_CHAT = "chat";
    exports.GEN_AI_OPERATION_NAME_VALUE_CREATE_AGENT = "create_agent";
    exports.GEN_AI_OPERATION_NAME_VALUE_EMBEDDINGS = "embeddings";
    exports.GEN_AI_OPERATION_NAME_VALUE_EXECUTE_TOOL = "execute_tool";
    exports.GEN_AI_OPERATION_NAME_VALUE_GENERATE_CONTENT = "generate_content";
    exports.GEN_AI_OPERATION_NAME_VALUE_INVOKE_AGENT = "invoke_agent";
    exports.GEN_AI_OPERATION_NAME_VALUE_TEXT_COMPLETION = "text_completion";
    exports.ATTR_GEN_AI_OUTPUT_MESSAGES = "gen_ai.output.messages";
    exports.ATTR_GEN_AI_OUTPUT_TYPE = "gen_ai.output.type";
    exports.GEN_AI_OUTPUT_TYPE_VALUE_IMAGE = "image";
    exports.GEN_AI_OUTPUT_TYPE_VALUE_JSON = "json";
    exports.GEN_AI_OUTPUT_TYPE_VALUE_SPEECH = "speech";
    exports.GEN_AI_OUTPUT_TYPE_VALUE_TEXT = "text";
    exports.ATTR_GEN_AI_PROMPT = "gen_ai.prompt";
    exports.ATTR_GEN_AI_PROVIDER_NAME = "gen_ai.provider.name";
    exports.GEN_AI_PROVIDER_NAME_VALUE_ANTHROPIC = "anthropic";
    exports.GEN_AI_PROVIDER_NAME_VALUE_AWS_BEDROCK = "aws.bedrock";
    exports.GEN_AI_PROVIDER_NAME_VALUE_AZURE_AI_INFERENCE = "azure.ai.inference";
    exports.GEN_AI_PROVIDER_NAME_VALUE_AZURE_AI_OPENAI = "azure.ai.openai";
    exports.GEN_AI_PROVIDER_NAME_VALUE_COHERE = "cohere";
    exports.GEN_AI_PROVIDER_NAME_VALUE_DEEPSEEK = "deepseek";
    exports.GEN_AI_PROVIDER_NAME_VALUE_GCP_GEMINI = "gcp.gemini";
    exports.GEN_AI_PROVIDER_NAME_VALUE_GCP_GEN_AI = "gcp.gen_ai";
    exports.GEN_AI_PROVIDER_NAME_VALUE_GCP_VERTEX_AI = "gcp.vertex_ai";
    exports.GEN_AI_PROVIDER_NAME_VALUE_GROQ = "groq";
    exports.GEN_AI_PROVIDER_NAME_VALUE_IBM_WATSONX_AI = "ibm.watsonx.ai";
    exports.GEN_AI_PROVIDER_NAME_VALUE_MISTRAL_AI = "mistral_ai";
    exports.GEN_AI_PROVIDER_NAME_VALUE_OPENAI = "openai";
    exports.GEN_AI_PROVIDER_NAME_VALUE_PERPLEXITY = "perplexity";
    exports.GEN_AI_PROVIDER_NAME_VALUE_X_AI = "x_ai";
    exports.ATTR_GEN_AI_REQUEST_CHOICE_COUNT = "gen_ai.request.choice.count";
    exports.ATTR_GEN_AI_REQUEST_ENCODING_FORMATS = "gen_ai.request.encoding_formats";
    exports.ATTR_GEN_AI_REQUEST_FREQUENCY_PENALTY = "gen_ai.request.frequency_penalty";
    exports.ATTR_GEN_AI_REQUEST_MAX_TOKENS = "gen_ai.request.max_tokens";
    exports.ATTR_GEN_AI_REQUEST_MODEL = "gen_ai.request.model";
    exports.ATTR_GEN_AI_REQUEST_PRESENCE_PENALTY = "gen_ai.request.presence_penalty";
    exports.ATTR_GEN_AI_REQUEST_SEED = "gen_ai.request.seed";
    exports.ATTR_GEN_AI_REQUEST_STOP_SEQUENCES = "gen_ai.request.stop_sequences";
    exports.ATTR_GEN_AI_REQUEST_TEMPERATURE = "gen_ai.request.temperature";
    exports.ATTR_GEN_AI_REQUEST_TOP_K = "gen_ai.request.top_k";
    exports.ATTR_GEN_AI_REQUEST_TOP_P = "gen_ai.request.top_p";
    exports.ATTR_GEN_AI_RESPONSE_FINISH_REASONS = "gen_ai.response.finish_reasons";
    exports.ATTR_GEN_AI_RESPONSE_ID = "gen_ai.response.id";
    exports.ATTR_GEN_AI_RESPONSE_MODEL = "gen_ai.response.model";
    exports.ATTR_GEN_AI_SYSTEM = "gen_ai.system";
    exports.GEN_AI_SYSTEM_VALUE_ANTHROPIC = "anthropic";
    exports.GEN_AI_SYSTEM_VALUE_AWS_BEDROCK = "aws.bedrock";
    exports.GEN_AI_SYSTEM_VALUE_AZ_AI_INFERENCE = "az.ai.inference";
    exports.GEN_AI_SYSTEM_VALUE_AZ_AI_OPENAI = "az.ai.openai";
    exports.GEN_AI_SYSTEM_VALUE_AZURE_AI_INFERENCE = "azure.ai.inference";
    exports.GEN_AI_SYSTEM_VALUE_AZURE_AI_OPENAI = "azure.ai.openai";
    exports.GEN_AI_SYSTEM_VALUE_COHERE = "cohere";
    exports.GEN_AI_SYSTEM_VALUE_DEEPSEEK = "deepseek";
    exports.GEN_AI_SYSTEM_VALUE_GCP_GEMINI = "gcp.gemini";
    exports.GEN_AI_SYSTEM_VALUE_GCP_GEN_AI = "gcp.gen_ai";
    exports.GEN_AI_SYSTEM_VALUE_GCP_VERTEX_AI = "gcp.vertex_ai";
    exports.GEN_AI_SYSTEM_VALUE_GEMINI = "gemini";
    exports.GEN_AI_SYSTEM_VALUE_GROQ = "groq";
    exports.GEN_AI_SYSTEM_VALUE_IBM_WATSONX_AI = "ibm.watsonx.ai";
    exports.GEN_AI_SYSTEM_VALUE_MISTRAL_AI = "mistral_ai";
    exports.GEN_AI_SYSTEM_VALUE_OPENAI = "openai";
    exports.GEN_AI_SYSTEM_VALUE_PERPLEXITY = "perplexity";
    exports.GEN_AI_SYSTEM_VALUE_VERTEX_AI = "vertex_ai";
    exports.GEN_AI_SYSTEM_VALUE_XAI = "xai";
    exports.ATTR_GEN_AI_SYSTEM_INSTRUCTIONS = "gen_ai.system_instructions";
    exports.ATTR_GEN_AI_TOKEN_TYPE = "gen_ai.token.type";
    exports.GEN_AI_TOKEN_TYPE_VALUE_INPUT = "input";
    exports.GEN_AI_TOKEN_TYPE_VALUE_COMPLETION = "output";
    exports.GEN_AI_TOKEN_TYPE_VALUE_OUTPUT = "output";
    exports.ATTR_GEN_AI_TOOL_CALL_ARGUMENTS = "gen_ai.tool.call.arguments";
    exports.ATTR_GEN_AI_TOOL_CALL_ID = "gen_ai.tool.call.id";
    exports.ATTR_GEN_AI_TOOL_CALL_RESULT = "gen_ai.tool.call.result";
    exports.ATTR_GEN_AI_TOOL_DEFINITIONS = "gen_ai.tool.definitions";
    exports.ATTR_GEN_AI_TOOL_DESCRIPTION = "gen_ai.tool.description";
    exports.ATTR_GEN_AI_TOOL_NAME = "gen_ai.tool.name";
    exports.ATTR_GEN_AI_TOOL_TYPE = "gen_ai.tool.type";
    exports.ATTR_GEN_AI_USAGE_COMPLETION_TOKENS = "gen_ai.usage.completion_tokens";
    exports.ATTR_GEN_AI_USAGE_INPUT_TOKENS = "gen_ai.usage.input_tokens";
    exports.ATTR_GEN_AI_USAGE_OUTPUT_TOKENS = "gen_ai.usage.output_tokens";
    exports.ATTR_GEN_AI_USAGE_PROMPT_TOKENS = "gen_ai.usage.prompt_tokens";
    exports.ATTR_GEO_CONTINENT_CODE = "geo.continent.code";
    exports.GEO_CONTINENT_CODE_VALUE_AF = "AF";
    exports.GEO_CONTINENT_CODE_VALUE_AN = "AN";
    exports.GEO_CONTINENT_CODE_VALUE_AS = "AS";
    exports.GEO_CONTINENT_CODE_VALUE_EU = "EU";
    exports.GEO_CONTINENT_CODE_VALUE_NA = "NA";
    exports.GEO_CONTINENT_CODE_VALUE_OC = "OC";
    exports.GEO_CONTINENT_CODE_VALUE_SA = "SA";
    exports.ATTR_GEO_COUNTRY_ISO_CODE = "geo.country.iso_code";
    exports.ATTR_GEO_LOCALITY_NAME = "geo.locality.name";
    exports.ATTR_GEO_LOCATION_LAT = "geo.location.lat";
    exports.ATTR_GEO_LOCATION_LON = "geo.location.lon";
    exports.ATTR_GEO_POSTAL_CODE = "geo.postal_code";
    exports.ATTR_GEO_REGION_ISO_CODE = "geo.region.iso_code";
    exports.ATTR_GO_MEMORY_TYPE = "go.memory.type";
    exports.GO_MEMORY_TYPE_VALUE_OTHER = "other";
    exports.GO_MEMORY_TYPE_VALUE_STACK = "stack";
    exports.ATTR_GRAPHQL_DOCUMENT = "graphql.document";
    exports.ATTR_GRAPHQL_OPERATION_NAME = "graphql.operation.name";
    exports.ATTR_GRAPHQL_OPERATION_TYPE = "graphql.operation.type";
    exports.GRAPHQL_OPERATION_TYPE_VALUE_MUTATION = "mutation";
    exports.GRAPHQL_OPERATION_TYPE_VALUE_QUERY = "query";
    exports.GRAPHQL_OPERATION_TYPE_VALUE_SUBSCRIPTION = "subscription";
    exports.ATTR_HEROKU_APP_ID = "heroku.app.id";
    exports.ATTR_HEROKU_RELEASE_COMMIT = "heroku.release.commit";
    exports.ATTR_HEROKU_RELEASE_CREATION_TIMESTAMP = "heroku.release.creation_timestamp";
    exports.ATTR_HOST_ARCH = "host.arch";
    exports.HOST_ARCH_VALUE_AMD64 = "amd64";
    exports.HOST_ARCH_VALUE_ARM32 = "arm32";
    exports.HOST_ARCH_VALUE_ARM64 = "arm64";
    exports.HOST_ARCH_VALUE_IA64 = "ia64";
    exports.HOST_ARCH_VALUE_PPC32 = "ppc32";
    exports.HOST_ARCH_VALUE_PPC64 = "ppc64";
    exports.HOST_ARCH_VALUE_S390X = "s390x";
    exports.HOST_ARCH_VALUE_X86 = "x86";
    exports.ATTR_HOST_CPU_CACHE_L2_SIZE = "host.cpu.cache.l2.size";
    exports.ATTR_HOST_CPU_FAMILY = "host.cpu.family";
    exports.ATTR_HOST_CPU_MODEL_ID = "host.cpu.model.id";
    exports.ATTR_HOST_CPU_MODEL_NAME = "host.cpu.model.name";
    exports.ATTR_HOST_CPU_STEPPING = "host.cpu.stepping";
    exports.ATTR_HOST_CPU_VENDOR_ID = "host.cpu.vendor.id";
    exports.ATTR_HOST_ID = "host.id";
    exports.ATTR_HOST_IMAGE_ID = "host.image.id";
    exports.ATTR_HOST_IMAGE_NAME = "host.image.name";
    exports.ATTR_HOST_IMAGE_VERSION = "host.image.version";
    exports.ATTR_HOST_IP = "host.ip";
    exports.ATTR_HOST_MAC = "host.mac";
    exports.ATTR_HOST_NAME = "host.name";
    exports.ATTR_HOST_TYPE = "host.type";
    exports.ATTR_HTTP_CLIENT_IP = "http.client_ip";
    exports.ATTR_HTTP_CONNECTION_STATE = "http.connection.state";
    exports.HTTP_CONNECTION_STATE_VALUE_ACTIVE = "active";
    exports.HTTP_CONNECTION_STATE_VALUE_IDLE = "idle";
    exports.ATTR_HTTP_FLAVOR = "http.flavor";
    exports.HTTP_FLAVOR_VALUE_HTTP_1_0 = "1.0";
    exports.HTTP_FLAVOR_VALUE_HTTP_1_1 = "1.1";
    exports.HTTP_FLAVOR_VALUE_HTTP_2_0 = "2.0";
    exports.HTTP_FLAVOR_VALUE_HTTP_3_0 = "3.0";
    exports.HTTP_FLAVOR_VALUE_QUIC = "QUIC";
    exports.HTTP_FLAVOR_VALUE_SPDY = "SPDY";
    exports.ATTR_HTTP_HOST = "http.host";
    exports.ATTR_HTTP_METHOD = "http.method";
    exports.ATTR_HTTP_REQUEST_BODY_SIZE = "http.request.body.size";
    exports.HTTP_REQUEST_METHOD_VALUE_QUERY = "QUERY";
    exports.ATTR_HTTP_REQUEST_SIZE = "http.request.size";
    exports.ATTR_HTTP_REQUEST_CONTENT_LENGTH = "http.request_content_length";
    exports.ATTR_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = "http.request_content_length_uncompressed";
    exports.ATTR_HTTP_RESPONSE_BODY_SIZE = "http.response.body.size";
    exports.ATTR_HTTP_RESPONSE_SIZE = "http.response.size";
    exports.ATTR_HTTP_RESPONSE_CONTENT_LENGTH = "http.response_content_length";
    exports.ATTR_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = "http.response_content_length_uncompressed";
    exports.ATTR_HTTP_SCHEME = "http.scheme";
    exports.ATTR_HTTP_SERVER_NAME = "http.server_name";
    exports.ATTR_HTTP_STATUS_CODE = "http.status_code";
    exports.ATTR_HTTP_TARGET = "http.target";
    exports.ATTR_HTTP_URL = "http.url";
    exports.ATTR_HTTP_USER_AGENT = "http.user_agent";
    exports.ATTR_HW_BATTERY_CAPACITY = "hw.battery.capacity";
    exports.ATTR_HW_BATTERY_CHEMISTRY = "hw.battery.chemistry";
    exports.ATTR_HW_BATTERY_STATE = "hw.battery.state";
    exports.HW_BATTERY_STATE_VALUE_CHARGING = "charging";
    exports.HW_BATTERY_STATE_VALUE_DISCHARGING = "discharging";
    exports.ATTR_HW_BIOS_VERSION = "hw.bios_version";
    exports.ATTR_HW_DRIVER_VERSION = "hw.driver_version";
    exports.ATTR_HW_ENCLOSURE_TYPE = "hw.enclosure.type";
    exports.ATTR_HW_FIRMWARE_VERSION = "hw.firmware_version";
    exports.ATTR_HW_GPU_TASK = "hw.gpu.task";
    exports.HW_GPU_TASK_VALUE_DECODER = "decoder";
    exports.HW_GPU_TASK_VALUE_ENCODER = "encoder";
    exports.HW_GPU_TASK_VALUE_GENERAL = "general";
    exports.ATTR_HW_ID = "hw.id";
    exports.ATTR_HW_LIMIT_TYPE = "hw.limit_type";
    exports.HW_LIMIT_TYPE_VALUE_CRITICAL = "critical";
    exports.HW_LIMIT_TYPE_VALUE_DEGRADED = "degraded";
    exports.HW_LIMIT_TYPE_VALUE_HIGH_CRITICAL = "high.critical";
    exports.HW_LIMIT_TYPE_VALUE_HIGH_DEGRADED = "high.degraded";
    exports.HW_LIMIT_TYPE_VALUE_LOW_CRITICAL = "low.critical";
    exports.HW_LIMIT_TYPE_VALUE_LOW_DEGRADED = "low.degraded";
    exports.HW_LIMIT_TYPE_VALUE_MAX = "max";
    exports.HW_LIMIT_TYPE_VALUE_THROTTLED = "throttled";
    exports.HW_LIMIT_TYPE_VALUE_TURBO = "turbo";
    exports.ATTR_HW_LOGICAL_DISK_RAID_LEVEL = "hw.logical_disk.raid_level";
    exports.ATTR_HW_LOGICAL_DISK_STATE = "hw.logical_disk.state";
    exports.HW_LOGICAL_DISK_STATE_VALUE_FREE = "free";
    exports.HW_LOGICAL_DISK_STATE_VALUE_USED = "used";
    exports.ATTR_HW_MEMORY_TYPE = "hw.memory.type";
    exports.ATTR_HW_MODEL = "hw.model";
    exports.ATTR_HW_NAME = "hw.name";
    exports.ATTR_HW_NETWORK_LOGICAL_ADDRESSES = "hw.network.logical_addresses";
    exports.ATTR_HW_NETWORK_PHYSICAL_ADDRESS = "hw.network.physical_address";
    exports.ATTR_HW_PARENT = "hw.parent";
    exports.ATTR_HW_PHYSICAL_DISK_SMART_ATTRIBUTE = "hw.physical_disk.smart_attribute";
    exports.ATTR_HW_PHYSICAL_DISK_STATE = "hw.physical_disk.state";
    exports.HW_PHYSICAL_DISK_STATE_VALUE_REMAINING = "remaining";
    exports.ATTR_HW_PHYSICAL_DISK_TYPE = "hw.physical_disk.type";
    exports.ATTR_HW_SENSOR_LOCATION = "hw.sensor_location";
    exports.ATTR_HW_SERIAL_NUMBER = "hw.serial_number";
    exports.ATTR_HW_STATE = "hw.state";
    exports.HW_STATE_VALUE_DEGRADED = "degraded";
    exports.HW_STATE_VALUE_FAILED = "failed";
    exports.HW_STATE_VALUE_NEEDS_CLEANING = "needs_cleaning";
    exports.HW_STATE_VALUE_OK = "ok";
    exports.HW_STATE_VALUE_PREDICTED_FAILURE = "predicted_failure";
    exports.ATTR_HW_TAPE_DRIVE_OPERATION_TYPE = "hw.tape_drive.operation_type";
    exports.HW_TAPE_DRIVE_OPERATION_TYPE_VALUE_CLEAN = "clean";
    exports.HW_TAPE_DRIVE_OPERATION_TYPE_VALUE_MOUNT = "mount";
    exports.HW_TAPE_DRIVE_OPERATION_TYPE_VALUE_UNMOUNT = "unmount";
    exports.ATTR_HW_TYPE = "hw.type";
    exports.HW_TYPE_VALUE_BATTERY = "battery";
    exports.HW_TYPE_VALUE_CPU = "cpu";
    exports.HW_TYPE_VALUE_DISK_CONTROLLER = "disk_controller";
    exports.HW_TYPE_VALUE_ENCLOSURE = "enclosure";
    exports.HW_TYPE_VALUE_FAN = "fan";
    exports.HW_TYPE_VALUE_GPU = "gpu";
    exports.HW_TYPE_VALUE_LOGICAL_DISK = "logical_disk";
    exports.HW_TYPE_VALUE_MEMORY = "memory";
    exports.HW_TYPE_VALUE_NETWORK = "network";
    exports.HW_TYPE_VALUE_PHYSICAL_DISK = "physical_disk";
    exports.HW_TYPE_VALUE_POWER_SUPPLY = "power_supply";
    exports.HW_TYPE_VALUE_TAPE_DRIVE = "tape_drive";
    exports.HW_TYPE_VALUE_TEMPERATURE = "temperature";
    exports.HW_TYPE_VALUE_VOLTAGE = "voltage";
    exports.ATTR_HW_VENDOR = "hw.vendor";
    exports.ATTR_IOS_APP_STATE = "ios.app.state";
    exports.IOS_APP_STATE_VALUE_ACTIVE = "active";
    exports.IOS_APP_STATE_VALUE_BACKGROUND = "background";
    exports.IOS_APP_STATE_VALUE_FOREGROUND = "foreground";
    exports.IOS_APP_STATE_VALUE_INACTIVE = "inactive";
    exports.IOS_APP_STATE_VALUE_TERMINATE = "terminate";
    exports.ATTR_IOS_STATE = "ios.state";
    exports.IOS_STATE_VALUE_ACTIVE = "active";
    exports.IOS_STATE_VALUE_BACKGROUND = "background";
    exports.IOS_STATE_VALUE_FOREGROUND = "foreground";
    exports.IOS_STATE_VALUE_INACTIVE = "inactive";
    exports.IOS_STATE_VALUE_TERMINATE = "terminate";
    exports.ATTR_JVM_BUFFER_POOL_NAME = "jvm.buffer.pool.name";
    exports.ATTR_JVM_GC_CAUSE = "jvm.gc.cause";
    exports.ATTR_K8S_CLUSTER_NAME = "k8s.cluster.name";
    exports.ATTR_K8S_CLUSTER_UID = "k8s.cluster.uid";
    exports.ATTR_K8S_CONTAINER_NAME = "k8s.container.name";
    exports.ATTR_K8S_CONTAINER_RESTART_COUNT = "k8s.container.restart_count";
    exports.ATTR_K8S_CONTAINER_STATUS_LAST_TERMINATED_REASON = "k8s.container.status.last_terminated_reason";
    exports.ATTR_K8S_CONTAINER_STATUS_REASON = "k8s.container.status.reason";
    exports.K8S_CONTAINER_STATUS_REASON_VALUE_COMPLETED = "Completed";
    exports.K8S_CONTAINER_STATUS_REASON_VALUE_CONTAINER_CANNOT_RUN = "ContainerCannotRun";
    exports.K8S_CONTAINER_STATUS_REASON_VALUE_CONTAINER_CREATING = "ContainerCreating";
    exports.K8S_CONTAINER_STATUS_REASON_VALUE_CRASH_LOOP_BACK_OFF = "CrashLoopBackOff";
    exports.K8S_CONTAINER_STATUS_REASON_VALUE_CREATE_CONTAINER_CONFIG_ERROR = "CreateContainerConfigError";
    exports.K8S_CONTAINER_STATUS_REASON_VALUE_ERR_IMAGE_PULL = "ErrImagePull";
    exports.K8S_CONTAINER_STATUS_REASON_VALUE_ERROR = "Error";
    exports.K8S_CONTAINER_STATUS_REASON_VALUE_IMAGE_PULL_BACK_OFF = "ImagePullBackOff";
    exports.K8S_CONTAINER_STATUS_REASON_VALUE_OOM_KILLED = "OOMKilled";
    exports.ATTR_K8S_CONTAINER_STATUS_STATE = "k8s.container.status.state";
    exports.K8S_CONTAINER_STATUS_STATE_VALUE_RUNNING = "running";
    exports.K8S_CONTAINER_STATUS_STATE_VALUE_TERMINATED = "terminated";
    exports.K8S_CONTAINER_STATUS_STATE_VALUE_WAITING = "waiting";
    var ATTR_K8S_CRONJOB_ANNOTATION = /* @__PURE__ */ __name((key) => `k8s.cronjob.annotation.${key}`, "ATTR_K8S_CRONJOB_ANNOTATION");
    exports.ATTR_K8S_CRONJOB_ANNOTATION = ATTR_K8S_CRONJOB_ANNOTATION;
    var ATTR_K8S_CRONJOB_LABEL = /* @__PURE__ */ __name((key) => `k8s.cronjob.label.${key}`, "ATTR_K8S_CRONJOB_LABEL");
    exports.ATTR_K8S_CRONJOB_LABEL = ATTR_K8S_CRONJOB_LABEL;
    exports.ATTR_K8S_CRONJOB_NAME = "k8s.cronjob.name";
    exports.ATTR_K8S_CRONJOB_UID = "k8s.cronjob.uid";
    var ATTR_K8S_DAEMONSET_ANNOTATION = /* @__PURE__ */ __name((key) => `k8s.daemonset.annotation.${key}`, "ATTR_K8S_DAEMONSET_ANNOTATION");
    exports.ATTR_K8S_DAEMONSET_ANNOTATION = ATTR_K8S_DAEMONSET_ANNOTATION;
    var ATTR_K8S_DAEMONSET_LABEL = /* @__PURE__ */ __name((key) => `k8s.daemonset.label.${key}`, "ATTR_K8S_DAEMONSET_LABEL");
    exports.ATTR_K8S_DAEMONSET_LABEL = ATTR_K8S_DAEMONSET_LABEL;
    exports.ATTR_K8S_DAEMONSET_NAME = "k8s.daemonset.name";
    exports.ATTR_K8S_DAEMONSET_UID = "k8s.daemonset.uid";
    var ATTR_K8S_DEPLOYMENT_ANNOTATION = /* @__PURE__ */ __name((key) => `k8s.deployment.annotation.${key}`, "ATTR_K8S_DEPLOYMENT_ANNOTATION");
    exports.ATTR_K8S_DEPLOYMENT_ANNOTATION = ATTR_K8S_DEPLOYMENT_ANNOTATION;
    var ATTR_K8S_DEPLOYMENT_LABEL = /* @__PURE__ */ __name((key) => `k8s.deployment.label.${key}`, "ATTR_K8S_DEPLOYMENT_LABEL");
    exports.ATTR_K8S_DEPLOYMENT_LABEL = ATTR_K8S_DEPLOYMENT_LABEL;
    exports.ATTR_K8S_DEPLOYMENT_NAME = "k8s.deployment.name";
    exports.ATTR_K8S_DEPLOYMENT_UID = "k8s.deployment.uid";
    exports.ATTR_K8S_HPA_METRIC_TYPE = "k8s.hpa.metric.type";
    exports.ATTR_K8S_HPA_NAME = "k8s.hpa.name";
    exports.ATTR_K8S_HPA_SCALETARGETREF_API_VERSION = "k8s.hpa.scaletargetref.api_version";
    exports.ATTR_K8S_HPA_SCALETARGETREF_KIND = "k8s.hpa.scaletargetref.kind";
    exports.ATTR_K8S_HPA_SCALETARGETREF_NAME = "k8s.hpa.scaletargetref.name";
    exports.ATTR_K8S_HPA_UID = "k8s.hpa.uid";
    exports.ATTR_K8S_HUGEPAGE_SIZE = "k8s.hugepage.size";
    var ATTR_K8S_JOB_ANNOTATION = /* @__PURE__ */ __name((key) => `k8s.job.annotation.${key}`, "ATTR_K8S_JOB_ANNOTATION");
    exports.ATTR_K8S_JOB_ANNOTATION = ATTR_K8S_JOB_ANNOTATION;
    var ATTR_K8S_JOB_LABEL = /* @__PURE__ */ __name((key) => `k8s.job.label.${key}`, "ATTR_K8S_JOB_LABEL");
    exports.ATTR_K8S_JOB_LABEL = ATTR_K8S_JOB_LABEL;
    exports.ATTR_K8S_JOB_NAME = "k8s.job.name";
    exports.ATTR_K8S_JOB_UID = "k8s.job.uid";
    var ATTR_K8S_NAMESPACE_ANNOTATION = /* @__PURE__ */ __name((key) => `k8s.namespace.annotation.${key}`, "ATTR_K8S_NAMESPACE_ANNOTATION");
    exports.ATTR_K8S_NAMESPACE_ANNOTATION = ATTR_K8S_NAMESPACE_ANNOTATION;
    var ATTR_K8S_NAMESPACE_LABEL = /* @__PURE__ */ __name((key) => `k8s.namespace.label.${key}`, "ATTR_K8S_NAMESPACE_LABEL");
    exports.ATTR_K8S_NAMESPACE_LABEL = ATTR_K8S_NAMESPACE_LABEL;
    exports.ATTR_K8S_NAMESPACE_NAME = "k8s.namespace.name";
    exports.ATTR_K8S_NAMESPACE_PHASE = "k8s.namespace.phase";
    exports.K8S_NAMESPACE_PHASE_VALUE_ACTIVE = "active";
    exports.K8S_NAMESPACE_PHASE_VALUE_TERMINATING = "terminating";
    var ATTR_K8S_NODE_ANNOTATION = /* @__PURE__ */ __name((key) => `k8s.node.annotation.${key}`, "ATTR_K8S_NODE_ANNOTATION");
    exports.ATTR_K8S_NODE_ANNOTATION = ATTR_K8S_NODE_ANNOTATION;
    exports.ATTR_K8S_NODE_CONDITION_STATUS = "k8s.node.condition.status";
    exports.K8S_NODE_CONDITION_STATUS_VALUE_CONDITION_FALSE = "false";
    exports.K8S_NODE_CONDITION_STATUS_VALUE_CONDITION_TRUE = "true";
    exports.K8S_NODE_CONDITION_STATUS_VALUE_CONDITION_UNKNOWN = "unknown";
    exports.ATTR_K8S_NODE_CONDITION_TYPE = "k8s.node.condition.type";
    exports.K8S_NODE_CONDITION_TYPE_VALUE_DISK_PRESSURE = "DiskPressure";
    exports.K8S_NODE_CONDITION_TYPE_VALUE_MEMORY_PRESSURE = "MemoryPressure";
    exports.K8S_NODE_CONDITION_TYPE_VALUE_NETWORK_UNAVAILABLE = "NetworkUnavailable";
    exports.K8S_NODE_CONDITION_TYPE_VALUE_PID_PRESSURE = "PIDPressure";
    exports.K8S_NODE_CONDITION_TYPE_VALUE_READY = "Ready";
    var ATTR_K8S_NODE_LABEL = /* @__PURE__ */ __name((key) => `k8s.node.label.${key}`, "ATTR_K8S_NODE_LABEL");
    exports.ATTR_K8S_NODE_LABEL = ATTR_K8S_NODE_LABEL;
    exports.ATTR_K8S_NODE_NAME = "k8s.node.name";
    exports.ATTR_K8S_NODE_UID = "k8s.node.uid";
    var ATTR_K8S_POD_ANNOTATION = /* @__PURE__ */ __name((key) => `k8s.pod.annotation.${key}`, "ATTR_K8S_POD_ANNOTATION");
    exports.ATTR_K8S_POD_ANNOTATION = ATTR_K8S_POD_ANNOTATION;
    var ATTR_K8S_POD_LABEL = /* @__PURE__ */ __name((key) => `k8s.pod.label.${key}`, "ATTR_K8S_POD_LABEL");
    exports.ATTR_K8S_POD_LABEL = ATTR_K8S_POD_LABEL;
    var ATTR_K8S_POD_LABELS = /* @__PURE__ */ __name((key) => `k8s.pod.labels.${key}`, "ATTR_K8S_POD_LABELS");
    exports.ATTR_K8S_POD_LABELS = ATTR_K8S_POD_LABELS;
    exports.ATTR_K8S_POD_NAME = "k8s.pod.name";
    exports.ATTR_K8S_POD_STATUS_PHASE = "k8s.pod.status.phase";
    exports.K8S_POD_STATUS_PHASE_VALUE_FAILED = "Failed";
    exports.K8S_POD_STATUS_PHASE_VALUE_PENDING = "Pending";
    exports.K8S_POD_STATUS_PHASE_VALUE_RUNNING = "Running";
    exports.K8S_POD_STATUS_PHASE_VALUE_SUCCEEDED = "Succeeded";
    exports.K8S_POD_STATUS_PHASE_VALUE_UNKNOWN = "Unknown";
    exports.ATTR_K8S_POD_STATUS_REASON = "k8s.pod.status.reason";
    exports.K8S_POD_STATUS_REASON_VALUE_EVICTED = "Evicted";
    exports.K8S_POD_STATUS_REASON_VALUE_NODE_AFFINITY = "NodeAffinity";
    exports.K8S_POD_STATUS_REASON_VALUE_NODE_LOST = "NodeLost";
    exports.K8S_POD_STATUS_REASON_VALUE_SHUTDOWN = "Shutdown";
    exports.K8S_POD_STATUS_REASON_VALUE_UNEXPECTED_ADMISSION_ERROR = "UnexpectedAdmissionError";
    exports.ATTR_K8S_POD_UID = "k8s.pod.uid";
    var ATTR_K8S_REPLICASET_ANNOTATION = /* @__PURE__ */ __name((key) => `k8s.replicaset.annotation.${key}`, "ATTR_K8S_REPLICASET_ANNOTATION");
    exports.ATTR_K8S_REPLICASET_ANNOTATION = ATTR_K8S_REPLICASET_ANNOTATION;
    var ATTR_K8S_REPLICASET_LABEL = /* @__PURE__ */ __name((key) => `k8s.replicaset.label.${key}`, "ATTR_K8S_REPLICASET_LABEL");
    exports.ATTR_K8S_REPLICASET_LABEL = ATTR_K8S_REPLICASET_LABEL;
    exports.ATTR_K8S_REPLICASET_NAME = "k8s.replicaset.name";
    exports.ATTR_K8S_REPLICASET_UID = "k8s.replicaset.uid";
    exports.ATTR_K8S_REPLICATIONCONTROLLER_NAME = "k8s.replicationcontroller.name";
    exports.ATTR_K8S_REPLICATIONCONTROLLER_UID = "k8s.replicationcontroller.uid";
    exports.ATTR_K8S_RESOURCEQUOTA_NAME = "k8s.resourcequota.name";
    exports.ATTR_K8S_RESOURCEQUOTA_RESOURCE_NAME = "k8s.resourcequota.resource_name";
    exports.ATTR_K8S_RESOURCEQUOTA_UID = "k8s.resourcequota.uid";
    var ATTR_K8S_STATEFULSET_ANNOTATION = /* @__PURE__ */ __name((key) => `k8s.statefulset.annotation.${key}`, "ATTR_K8S_STATEFULSET_ANNOTATION");
    exports.ATTR_K8S_STATEFULSET_ANNOTATION = ATTR_K8S_STATEFULSET_ANNOTATION;
    var ATTR_K8S_STATEFULSET_LABEL = /* @__PURE__ */ __name((key) => `k8s.statefulset.label.${key}`, "ATTR_K8S_STATEFULSET_LABEL");
    exports.ATTR_K8S_STATEFULSET_LABEL = ATTR_K8S_STATEFULSET_LABEL;
    exports.ATTR_K8S_STATEFULSET_NAME = "k8s.statefulset.name";
    exports.ATTR_K8S_STATEFULSET_UID = "k8s.statefulset.uid";
    exports.ATTR_K8S_STORAGECLASS_NAME = "k8s.storageclass.name";
    exports.ATTR_K8S_VOLUME_NAME = "k8s.volume.name";
    exports.ATTR_K8S_VOLUME_TYPE = "k8s.volume.type";
    exports.K8S_VOLUME_TYPE_VALUE_CONFIG_MAP = "configMap";
    exports.K8S_VOLUME_TYPE_VALUE_DOWNWARD_API = "downwardAPI";
    exports.K8S_VOLUME_TYPE_VALUE_EMPTY_DIR = "emptyDir";
    exports.K8S_VOLUME_TYPE_VALUE_LOCAL = "local";
    exports.K8S_VOLUME_TYPE_VALUE_PERSISTENT_VOLUME_CLAIM = "persistentVolumeClaim";
    exports.K8S_VOLUME_TYPE_VALUE_SECRET = "secret";
    exports.ATTR_LINUX_MEMORY_SLAB_STATE = "linux.memory.slab.state";
    exports.LINUX_MEMORY_SLAB_STATE_VALUE_RECLAIMABLE = "reclaimable";
    exports.LINUX_MEMORY_SLAB_STATE_VALUE_UNRECLAIMABLE = "unreclaimable";
    exports.ATTR_LOG_FILE_NAME = "log.file.name";
    exports.ATTR_LOG_FILE_NAME_RESOLVED = "log.file.name_resolved";
    exports.ATTR_LOG_FILE_PATH = "log.file.path";
    exports.ATTR_LOG_FILE_PATH_RESOLVED = "log.file.path_resolved";
    exports.ATTR_LOG_IOSTREAM = "log.iostream";
    exports.LOG_IOSTREAM_VALUE_STDERR = "stderr";
    exports.LOG_IOSTREAM_VALUE_STDOUT = "stdout";
    exports.ATTR_LOG_RECORD_ORIGINAL = "log.record.original";
    exports.ATTR_LOG_RECORD_UID = "log.record.uid";
    exports.ATTR_MAINFRAME_LPAR_NAME = "mainframe.lpar.name";
    exports.ATTR_MESSAGE_COMPRESSED_SIZE = "message.compressed_size";
    exports.ATTR_MESSAGE_ID = "message.id";
    exports.ATTR_MESSAGE_TYPE = "message.type";
    exports.MESSAGE_TYPE_VALUE_RECEIVED = "RECEIVED";
    exports.MESSAGE_TYPE_VALUE_SENT = "SENT";
    exports.ATTR_MESSAGE_UNCOMPRESSED_SIZE = "message.uncompressed_size";
    exports.ATTR_MESSAGING_BATCH_MESSAGE_COUNT = "messaging.batch.message_count";
    exports.ATTR_MESSAGING_CLIENT_ID = "messaging.client.id";
    exports.ATTR_MESSAGING_CONSUMER_GROUP_NAME = "messaging.consumer.group.name";
    exports.ATTR_MESSAGING_DESTINATION_ANONYMOUS = "messaging.destination.anonymous";
    exports.ATTR_MESSAGING_DESTINATION_NAME = "messaging.destination.name";
    exports.ATTR_MESSAGING_DESTINATION_PARTITION_ID = "messaging.destination.partition.id";
    exports.ATTR_MESSAGING_DESTINATION_SUBSCRIPTION_NAME = "messaging.destination.subscription.name";
    exports.ATTR_MESSAGING_DESTINATION_TEMPLATE = "messaging.destination.template";
    exports.ATTR_MESSAGING_DESTINATION_TEMPORARY = "messaging.destination.temporary";
    exports.ATTR_MESSAGING_DESTINATION_PUBLISH_ANONYMOUS = "messaging.destination_publish.anonymous";
    exports.ATTR_MESSAGING_DESTINATION_PUBLISH_NAME = "messaging.destination_publish.name";
    exports.ATTR_MESSAGING_EVENTHUBS_CONSUMER_GROUP = "messaging.eventhubs.consumer.group";
    exports.ATTR_MESSAGING_EVENTHUBS_MESSAGE_ENQUEUED_TIME = "messaging.eventhubs.message.enqueued_time";
    exports.ATTR_MESSAGING_GCP_PUBSUB_MESSAGE_ACK_DEADLINE = "messaging.gcp_pubsub.message.ack_deadline";
    exports.ATTR_MESSAGING_GCP_PUBSUB_MESSAGE_ACK_ID = "messaging.gcp_pubsub.message.ack_id";
    exports.ATTR_MESSAGING_GCP_PUBSUB_MESSAGE_DELIVERY_ATTEMPT = "messaging.gcp_pubsub.message.delivery_attempt";
    exports.ATTR_MESSAGING_GCP_PUBSUB_MESSAGE_ORDERING_KEY = "messaging.gcp_pubsub.message.ordering_key";
    exports.ATTR_MESSAGING_KAFKA_CONSUMER_GROUP = "messaging.kafka.consumer.group";
    exports.ATTR_MESSAGING_KAFKA_DESTINATION_PARTITION = "messaging.kafka.destination.partition";
    exports.ATTR_MESSAGING_KAFKA_MESSAGE_KEY = "messaging.kafka.message.key";
    exports.ATTR_MESSAGING_KAFKA_MESSAGE_OFFSET = "messaging.kafka.message.offset";
    exports.ATTR_MESSAGING_KAFKA_MESSAGE_TOMBSTONE = "messaging.kafka.message.tombstone";
    exports.ATTR_MESSAGING_KAFKA_OFFSET = "messaging.kafka.offset";
    exports.ATTR_MESSAGING_MESSAGE_BODY_SIZE = "messaging.message.body.size";
    exports.ATTR_MESSAGING_MESSAGE_CONVERSATION_ID = "messaging.message.conversation_id";
    exports.ATTR_MESSAGING_MESSAGE_ENVELOPE_SIZE = "messaging.message.envelope.size";
    exports.ATTR_MESSAGING_MESSAGE_ID = "messaging.message.id";
    exports.ATTR_MESSAGING_OPERATION = "messaging.operation";
    exports.ATTR_MESSAGING_OPERATION_NAME = "messaging.operation.name";
    exports.ATTR_MESSAGING_OPERATION_TYPE = "messaging.operation.type";
    exports.MESSAGING_OPERATION_TYPE_VALUE_CREATE = "create";
    exports.MESSAGING_OPERATION_TYPE_VALUE_DELIVER = "deliver";
    exports.MESSAGING_OPERATION_TYPE_VALUE_PROCESS = "process";
    exports.MESSAGING_OPERATION_TYPE_VALUE_PUBLISH = "publish";
    exports.MESSAGING_OPERATION_TYPE_VALUE_RECEIVE = "receive";
    exports.MESSAGING_OPERATION_TYPE_VALUE_SEND = "send";
    exports.MESSAGING_OPERATION_TYPE_VALUE_SETTLE = "settle";
    exports.ATTR_MESSAGING_RABBITMQ_DESTINATION_ROUTING_KEY = "messaging.rabbitmq.destination.routing_key";
    exports.ATTR_MESSAGING_RABBITMQ_MESSAGE_DELIVERY_TAG = "messaging.rabbitmq.message.delivery_tag";
    exports.ATTR_MESSAGING_ROCKETMQ_CLIENT_GROUP = "messaging.rocketmq.client_group";
    exports.ATTR_MESSAGING_ROCKETMQ_CONSUMPTION_MODEL = "messaging.rocketmq.consumption_model";
    exports.MESSAGING_ROCKETMQ_CONSUMPTION_MODEL_VALUE_BROADCASTING = "broadcasting";
    exports.MESSAGING_ROCKETMQ_CONSUMPTION_MODEL_VALUE_CLUSTERING = "clustering";
    exports.ATTR_MESSAGING_ROCKETMQ_MESSAGE_DELAY_TIME_LEVEL = "messaging.rocketmq.message.delay_time_level";
    exports.ATTR_MESSAGING_ROCKETMQ_MESSAGE_DELIVERY_TIMESTAMP = "messaging.rocketmq.message.delivery_timestamp";
    exports.ATTR_MESSAGING_ROCKETMQ_MESSAGE_GROUP = "messaging.rocketmq.message.group";
    exports.ATTR_MESSAGING_ROCKETMQ_MESSAGE_KEYS = "messaging.rocketmq.message.keys";
    exports.ATTR_MESSAGING_ROCKETMQ_MESSAGE_TAG = "messaging.rocketmq.message.tag";
    exports.ATTR_MESSAGING_ROCKETMQ_MESSAGE_TYPE = "messaging.rocketmq.message.type";
    exports.MESSAGING_ROCKETMQ_MESSAGE_TYPE_VALUE_DELAY = "delay";
    exports.MESSAGING_ROCKETMQ_MESSAGE_TYPE_VALUE_FIFO = "fifo";
    exports.MESSAGING_ROCKETMQ_MESSAGE_TYPE_VALUE_NORMAL = "normal";
    exports.MESSAGING_ROCKETMQ_MESSAGE_TYPE_VALUE_TRANSACTION = "transaction";
    exports.ATTR_MESSAGING_ROCKETMQ_NAMESPACE = "messaging.rocketmq.namespace";
    exports.ATTR_MESSAGING_SERVICEBUS_DESTINATION_SUBSCRIPTION_NAME = "messaging.servicebus.destination.subscription_name";
    exports.ATTR_MESSAGING_SERVICEBUS_DISPOSITION_STATUS = "messaging.servicebus.disposition_status";
    exports.MESSAGING_SERVICEBUS_DISPOSITION_STATUS_VALUE_ABANDON = "abandon";
    exports.MESSAGING_SERVICEBUS_DISPOSITION_STATUS_VALUE_COMPLETE = "complete";
    exports.MESSAGING_SERVICEBUS_DISPOSITION_STATUS_VALUE_DEAD_LETTER = "dead_letter";
    exports.MESSAGING_SERVICEBUS_DISPOSITION_STATUS_VALUE_DEFER = "defer";
    exports.ATTR_MESSAGING_SERVICEBUS_MESSAGE_DELIVERY_COUNT = "messaging.servicebus.message.delivery_count";
    exports.ATTR_MESSAGING_SERVICEBUS_MESSAGE_ENQUEUED_TIME = "messaging.servicebus.message.enqueued_time";
    exports.ATTR_MESSAGING_SYSTEM = "messaging.system";
    exports.MESSAGING_SYSTEM_VALUE_ACTIVEMQ = "activemq";
    exports.MESSAGING_SYSTEM_VALUE_AWS_SNS = "aws.sns";
    exports.MESSAGING_SYSTEM_VALUE_AWS_SQS = "aws_sqs";
    exports.MESSAGING_SYSTEM_VALUE_EVENTGRID = "eventgrid";
    exports.MESSAGING_SYSTEM_VALUE_EVENTHUBS = "eventhubs";
    exports.MESSAGING_SYSTEM_VALUE_GCP_PUBSUB = "gcp_pubsub";
    exports.MESSAGING_SYSTEM_VALUE_JMS = "jms";
    exports.MESSAGING_SYSTEM_VALUE_KAFKA = "kafka";
    exports.MESSAGING_SYSTEM_VALUE_PULSAR = "pulsar";
    exports.MESSAGING_SYSTEM_VALUE_RABBITMQ = "rabbitmq";
    exports.MESSAGING_SYSTEM_VALUE_ROCKETMQ = "rocketmq";
    exports.MESSAGING_SYSTEM_VALUE_SERVICEBUS = "servicebus";
    exports.ATTR_NET_HOST_IP = "net.host.ip";
    exports.ATTR_NET_HOST_NAME = "net.host.name";
    exports.ATTR_NET_HOST_PORT = "net.host.port";
    exports.ATTR_NET_PEER_IP = "net.peer.ip";
    exports.ATTR_NET_PEER_NAME = "net.peer.name";
    exports.ATTR_NET_PEER_PORT = "net.peer.port";
    exports.ATTR_NET_PROTOCOL_NAME = "net.protocol.name";
    exports.ATTR_NET_PROTOCOL_VERSION = "net.protocol.version";
    exports.ATTR_NET_SOCK_FAMILY = "net.sock.family";
    exports.NET_SOCK_FAMILY_VALUE_INET = "inet";
    exports.NET_SOCK_FAMILY_VALUE_INET6 = "inet6";
    exports.NET_SOCK_FAMILY_VALUE_UNIX = "unix";
    exports.ATTR_NET_SOCK_HOST_ADDR = "net.sock.host.addr";
    exports.ATTR_NET_SOCK_HOST_PORT = "net.sock.host.port";
    exports.ATTR_NET_SOCK_PEER_ADDR = "net.sock.peer.addr";
    exports.ATTR_NET_SOCK_PEER_NAME = "net.sock.peer.name";
    exports.ATTR_NET_SOCK_PEER_PORT = "net.sock.peer.port";
    exports.ATTR_NET_TRANSPORT = "net.transport";
    exports.NET_TRANSPORT_VALUE_INPROC = "inproc";
    exports.NET_TRANSPORT_VALUE_IP_TCP = "ip_tcp";
    exports.NET_TRANSPORT_VALUE_IP_UDP = "ip_udp";
    exports.NET_TRANSPORT_VALUE_OTHER = "other";
    exports.NET_TRANSPORT_VALUE_PIPE = "pipe";
    exports.ATTR_NETWORK_CARRIER_ICC = "network.carrier.icc";
    exports.ATTR_NETWORK_CARRIER_MCC = "network.carrier.mcc";
    exports.ATTR_NETWORK_CARRIER_MNC = "network.carrier.mnc";
    exports.ATTR_NETWORK_CARRIER_NAME = "network.carrier.name";
    exports.ATTR_NETWORK_CONNECTION_STATE = "network.connection.state";
    exports.NETWORK_CONNECTION_STATE_VALUE_CLOSE_WAIT = "close_wait";
    exports.NETWORK_CONNECTION_STATE_VALUE_CLOSED = "closed";
    exports.NETWORK_CONNECTION_STATE_VALUE_CLOSING = "closing";
    exports.NETWORK_CONNECTION_STATE_VALUE_ESTABLISHED = "established";
    exports.NETWORK_CONNECTION_STATE_VALUE_FIN_WAIT_1 = "fin_wait_1";
    exports.NETWORK_CONNECTION_STATE_VALUE_FIN_WAIT_2 = "fin_wait_2";
    exports.NETWORK_CONNECTION_STATE_VALUE_LAST_ACK = "last_ack";
    exports.NETWORK_CONNECTION_STATE_VALUE_LISTEN = "listen";
    exports.NETWORK_CONNECTION_STATE_VALUE_SYN_RECEIVED = "syn_received";
    exports.NETWORK_CONNECTION_STATE_VALUE_SYN_SENT = "syn_sent";
    exports.NETWORK_CONNECTION_STATE_VALUE_TIME_WAIT = "time_wait";
    exports.ATTR_NETWORK_CONNECTION_SUBTYPE = "network.connection.subtype";
    exports.NETWORK_CONNECTION_SUBTYPE_VALUE_CDMA = "cdma";
    exports.NETWORK_CONNECTION_SUBTYPE_VALUE_CDMA2000_1XRTT = "cdma2000_1xrtt";
    exports.NETWORK_CONNECTION_SUBTYPE_VALUE_EDGE = "edge";
    exports.NETWORK_CONNECTION_SUBTYPE_VALUE_EHRPD = "ehrpd";
    exports.NETWORK_CONNECTION_SUBTYPE_VALUE_EVDO_0 = "evdo_0";
    exports.NETWORK_CONNECTION_SUBTYPE_VALUE_EVDO_A = "evdo_a";
    exports.NETWORK_CONNECTION_SUBTYPE_VALUE_EVDO_B = "evdo_b";
    exports.NETWORK_CONNECTION_SUBTYPE_VALUE_GPRS = "gprs";
    exports.NETWORK_CONNECTION_SUBTYPE_VALUE_GSM = "gsm";
    exports.NETWORK_CONNECTION_SUBTYPE_VALUE_HSDPA = "hsdpa";
    exports.NETWORK_CONNECTION_SUBTYPE_VALUE_HSPA = "hspa";
    exports.NETWORK_CONNECTION_SUBTYPE_VALUE_HSPAP = "hspap";
    exports.NETWORK_CONNECTION_SUBTYPE_VALUE_HSUPA = "hsupa";
    exports.NETWORK_CONNECTION_SUBTYPE_VALUE_IDEN = "iden";
    exports.NETWORK_CONNECTION_SUBTYPE_VALUE_IWLAN = "iwlan";
    exports.NETWORK_CONNECTION_SUBTYPE_VALUE_LTE = "lte";
    exports.NETWORK_CONNECTION_SUBTYPE_VALUE_LTE_CA = "lte_ca";
    exports.NETWORK_CONNECTION_SUBTYPE_VALUE_NR = "nr";
    exports.NETWORK_CONNECTION_SUBTYPE_VALUE_NRNSA = "nrnsa";
    exports.NETWORK_CONNECTION_SUBTYPE_VALUE_TD_SCDMA = "td_scdma";
    exports.NETWORK_CONNECTION_SUBTYPE_VALUE_UMTS = "umts";
    exports.ATTR_NETWORK_CONNECTION_TYPE = "network.connection.type";
    exports.NETWORK_CONNECTION_TYPE_VALUE_CELL = "cell";
    exports.NETWORK_CONNECTION_TYPE_VALUE_UNAVAILABLE = "unavailable";
    exports.NETWORK_CONNECTION_TYPE_VALUE_UNKNOWN = "unknown";
    exports.NETWORK_CONNECTION_TYPE_VALUE_WIFI = "wifi";
    exports.NETWORK_CONNECTION_TYPE_VALUE_WIRED = "wired";
    exports.ATTR_NETWORK_INTERFACE_NAME = "network.interface.name";
    exports.ATTR_NETWORK_IO_DIRECTION = "network.io.direction";
    exports.NETWORK_IO_DIRECTION_VALUE_RECEIVE = "receive";
    exports.NETWORK_IO_DIRECTION_VALUE_TRANSMIT = "transmit";
    exports.ATTR_NFS_OPERATION_NAME = "nfs.operation.name";
    exports.ATTR_NFS_SERVER_REPCACHE_STATUS = "nfs.server.repcache.status";
    exports.ATTR_NODEJS_EVENTLOOP_STATE = "nodejs.eventloop.state";
    exports.NODEJS_EVENTLOOP_STATE_VALUE_ACTIVE = "active";
    exports.NODEJS_EVENTLOOP_STATE_VALUE_IDLE = "idle";
    exports.ATTR_OCI_MANIFEST_DIGEST = "oci.manifest.digest";
    exports.ATTR_ONC_RPC_PROCEDURE_NAME = "onc_rpc.procedure.name";
    exports.ATTR_ONC_RPC_PROCEDURE_NUMBER = "onc_rpc.procedure.number";
    exports.ATTR_ONC_RPC_PROGRAM_NAME = "onc_rpc.program.name";
    exports.ATTR_ONC_RPC_VERSION = "onc_rpc.version";
    exports.ATTR_OPENAI_REQUEST_SERVICE_TIER = "openai.request.service_tier";
    exports.OPENAI_REQUEST_SERVICE_TIER_VALUE_AUTO = "auto";
    exports.OPENAI_REQUEST_SERVICE_TIER_VALUE_DEFAULT = "default";
    exports.ATTR_OPENAI_RESPONSE_SERVICE_TIER = "openai.response.service_tier";
    exports.ATTR_OPENAI_RESPONSE_SYSTEM_FINGERPRINT = "openai.response.system_fingerprint";
    exports.ATTR_OPENSHIFT_CLUSTERQUOTA_NAME = "openshift.clusterquota.name";
    exports.ATTR_OPENSHIFT_CLUSTERQUOTA_UID = "openshift.clusterquota.uid";
    exports.ATTR_OPENTRACING_REF_TYPE = "opentracing.ref_type";
    exports.OPENTRACING_REF_TYPE_VALUE_CHILD_OF = "child_of";
    exports.OPENTRACING_REF_TYPE_VALUE_FOLLOWS_FROM = "follows_from";
    exports.ATTR_OS_BUILD_ID = "os.build_id";
    exports.ATTR_OS_DESCRIPTION = "os.description";
    exports.ATTR_OS_NAME = "os.name";
    exports.ATTR_OS_TYPE = "os.type";
    exports.OS_TYPE_VALUE_AIX = "aix";
    exports.OS_TYPE_VALUE_DARWIN = "darwin";
    exports.OS_TYPE_VALUE_DRAGONFLYBSD = "dragonflybsd";
    exports.OS_TYPE_VALUE_FREEBSD = "freebsd";
    exports.OS_TYPE_VALUE_HPUX = "hpux";
    exports.OS_TYPE_VALUE_LINUX = "linux";
    exports.OS_TYPE_VALUE_NETBSD = "netbsd";
    exports.OS_TYPE_VALUE_OPENBSD = "openbsd";
    exports.OS_TYPE_VALUE_SOLARIS = "solaris";
    exports.OS_TYPE_VALUE_WINDOWS = "windows";
    exports.OS_TYPE_VALUE_Z_OS = "z_os";
    exports.OS_TYPE_VALUE_ZOS = "zos";
    exports.ATTR_OS_VERSION = "os.version";
    exports.ATTR_OTEL_COMPONENT_NAME = "otel.component.name";
    exports.ATTR_OTEL_COMPONENT_TYPE = "otel.component.type";
    exports.OTEL_COMPONENT_TYPE_VALUE_BATCHING_LOG_PROCESSOR = "batching_log_processor";
    exports.OTEL_COMPONENT_TYPE_VALUE_BATCHING_SPAN_PROCESSOR = "batching_span_processor";
    exports.OTEL_COMPONENT_TYPE_VALUE_OTLP_GRPC_LOG_EXPORTER = "otlp_grpc_log_exporter";
    exports.OTEL_COMPONENT_TYPE_VALUE_OTLP_GRPC_METRIC_EXPORTER = "otlp_grpc_metric_exporter";
    exports.OTEL_COMPONENT_TYPE_VALUE_OTLP_GRPC_SPAN_EXPORTER = "otlp_grpc_span_exporter";
    exports.OTEL_COMPONENT_TYPE_VALUE_OTLP_HTTP_JSON_LOG_EXPORTER = "otlp_http_json_log_exporter";
    exports.OTEL_COMPONENT_TYPE_VALUE_OTLP_HTTP_JSON_METRIC_EXPORTER = "otlp_http_json_metric_exporter";
    exports.OTEL_COMPONENT_TYPE_VALUE_OTLP_HTTP_JSON_SPAN_EXPORTER = "otlp_http_json_span_exporter";
    exports.OTEL_COMPONENT_TYPE_VALUE_OTLP_HTTP_LOG_EXPORTER = "otlp_http_log_exporter";
    exports.OTEL_COMPONENT_TYPE_VALUE_OTLP_HTTP_METRIC_EXPORTER = "otlp_http_metric_exporter";
    exports.OTEL_COMPONENT_TYPE_VALUE_OTLP_HTTP_SPAN_EXPORTER = "otlp_http_span_exporter";
    exports.OTEL_COMPONENT_TYPE_VALUE_PERIODIC_METRIC_READER = "periodic_metric_reader";
    exports.OTEL_COMPONENT_TYPE_VALUE_PROMETHEUS_HTTP_TEXT_METRIC_EXPORTER = "prometheus_http_text_metric_exporter";
    exports.OTEL_COMPONENT_TYPE_VALUE_SIMPLE_LOG_PROCESSOR = "simple_log_processor";
    exports.OTEL_COMPONENT_TYPE_VALUE_SIMPLE_SPAN_PROCESSOR = "simple_span_processor";
    exports.OTEL_COMPONENT_TYPE_VALUE_ZIPKIN_HTTP_SPAN_EXPORTER = "zipkin_http_span_exporter";
    exports.ATTR_OTEL_LIBRARY_NAME = "otel.library.name";
    exports.ATTR_OTEL_LIBRARY_VERSION = "otel.library.version";
    exports.ATTR_OTEL_SCOPE_SCHEMA_URL = "otel.scope.schema_url";
    exports.ATTR_OTEL_SPAN_PARENT_ORIGIN = "otel.span.parent.origin";
    exports.OTEL_SPAN_PARENT_ORIGIN_VALUE_LOCAL = "local";
    exports.OTEL_SPAN_PARENT_ORIGIN_VALUE_NONE = "none";
    exports.OTEL_SPAN_PARENT_ORIGIN_VALUE_REMOTE = "remote";
    exports.ATTR_OTEL_SPAN_SAMPLING_RESULT = "otel.span.sampling_result";
    exports.OTEL_SPAN_SAMPLING_RESULT_VALUE_DROP = "DROP";
    exports.OTEL_SPAN_SAMPLING_RESULT_VALUE_RECORD_AND_SAMPLE = "RECORD_AND_SAMPLE";
    exports.OTEL_SPAN_SAMPLING_RESULT_VALUE_RECORD_ONLY = "RECORD_ONLY";
    exports.ATTR_PEER_SERVICE = "peer.service";
    exports.ATTR_POOL_NAME = "pool.name";
    exports.ATTR_PPROF_LOCATION_IS_FOLDED = "pprof.location.is_folded";
    exports.ATTR_PPROF_MAPPING_HAS_FILENAMES = "pprof.mapping.has_filenames";
    exports.ATTR_PPROF_MAPPING_HAS_FUNCTIONS = "pprof.mapping.has_functions";
    exports.ATTR_PPROF_MAPPING_HAS_INLINE_FRAMES = "pprof.mapping.has_inline_frames";
    exports.ATTR_PPROF_MAPPING_HAS_LINE_NUMBERS = "pprof.mapping.has_line_numbers";
    exports.ATTR_PPROF_PROFILE_COMMENT = "pprof.profile.comment";
    exports.ATTR_PROCESS_ARGS_COUNT = "process.args_count";
    exports.ATTR_PROCESS_COMMAND = "process.command";
    exports.ATTR_PROCESS_COMMAND_ARGS = "process.command_args";
    exports.ATTR_PROCESS_COMMAND_LINE = "process.command_line";
    exports.ATTR_PROCESS_CONTEXT_SWITCH_TYPE = "process.context_switch.type";
    exports.PROCESS_CONTEXT_SWITCH_TYPE_VALUE_INVOLUNTARY = "involuntary";
    exports.PROCESS_CONTEXT_SWITCH_TYPE_VALUE_VOLUNTARY = "voluntary";
    exports.ATTR_PROCESS_CPU_STATE = "process.cpu.state";
    exports.PROCESS_CPU_STATE_VALUE_SYSTEM = "system";
    exports.PROCESS_CPU_STATE_VALUE_USER = "user";
    exports.PROCESS_CPU_STATE_VALUE_WAIT = "wait";
    exports.ATTR_PROCESS_CREATION_TIME = "process.creation.time";
    var ATTR_PROCESS_ENVIRONMENT_VARIABLE = /* @__PURE__ */ __name((key) => `process.environment_variable.${key}`, "ATTR_PROCESS_ENVIRONMENT_VARIABLE");
    exports.ATTR_PROCESS_ENVIRONMENT_VARIABLE = ATTR_PROCESS_ENVIRONMENT_VARIABLE;
    exports.ATTR_PROCESS_EXECUTABLE_BUILD_ID_GNU = "process.executable.build_id.gnu";
    exports.ATTR_PROCESS_EXECUTABLE_BUILD_ID_GO = "process.executable.build_id.go";
    exports.ATTR_PROCESS_EXECUTABLE_BUILD_ID_HTLHASH = "process.executable.build_id.htlhash";
    exports.ATTR_PROCESS_EXECUTABLE_BUILD_ID_PROFILING = "process.executable.build_id.profiling";
    exports.ATTR_PROCESS_EXECUTABLE_NAME = "process.executable.name";
    exports.ATTR_PROCESS_EXECUTABLE_PATH = "process.executable.path";
    exports.ATTR_PROCESS_EXIT_CODE = "process.exit.code";
    exports.ATTR_PROCESS_EXIT_TIME = "process.exit.time";
    exports.ATTR_PROCESS_GROUP_LEADER_PID = "process.group_leader.pid";
    exports.ATTR_PROCESS_INTERACTIVE = "process.interactive";
    exports.ATTR_PROCESS_LINUX_CGROUP = "process.linux.cgroup";
    exports.ATTR_PROCESS_OWNER = "process.owner";
    exports.ATTR_PROCESS_PAGING_FAULT_TYPE = "process.paging.fault_type";
    exports.PROCESS_PAGING_FAULT_TYPE_VALUE_MAJOR = "major";
    exports.PROCESS_PAGING_FAULT_TYPE_VALUE_MINOR = "minor";
    exports.ATTR_PROCESS_PARENT_PID = "process.parent_pid";
    exports.ATTR_PROCESS_PID = "process.pid";
    exports.ATTR_PROCESS_REAL_USER_ID = "process.real_user.id";
    exports.ATTR_PROCESS_REAL_USER_NAME = "process.real_user.name";
    exports.ATTR_PROCESS_RUNTIME_DESCRIPTION = "process.runtime.description";
    exports.ATTR_PROCESS_RUNTIME_NAME = "process.runtime.name";
    exports.ATTR_PROCESS_RUNTIME_VERSION = "process.runtime.version";
    exports.ATTR_PROCESS_SAVED_USER_ID = "process.saved_user.id";
    exports.ATTR_PROCESS_SAVED_USER_NAME = "process.saved_user.name";
    exports.ATTR_PROCESS_SESSION_LEADER_PID = "process.session_leader.pid";
    exports.ATTR_PROCESS_STATE = "process.state";
    exports.PROCESS_STATE_VALUE_DEFUNCT = "defunct";
    exports.PROCESS_STATE_VALUE_RUNNING = "running";
    exports.PROCESS_STATE_VALUE_SLEEPING = "sleeping";
    exports.PROCESS_STATE_VALUE_STOPPED = "stopped";
    exports.ATTR_PROCESS_TITLE = "process.title";
    exports.ATTR_PROCESS_USER_ID = "process.user.id";
    exports.ATTR_PROCESS_USER_NAME = "process.user.name";
    exports.ATTR_PROCESS_VPID = "process.vpid";
    exports.ATTR_PROCESS_WORKING_DIRECTORY = "process.working_directory";
    exports.ATTR_PROFILE_FRAME_TYPE = "profile.frame.type";
    exports.PROFILE_FRAME_TYPE_VALUE_BEAM = "beam";
    exports.PROFILE_FRAME_TYPE_VALUE_CPYTHON = "cpython";
    exports.PROFILE_FRAME_TYPE_VALUE_DOTNET = "dotnet";
    exports.PROFILE_FRAME_TYPE_VALUE_GO = "go";
    exports.PROFILE_FRAME_TYPE_VALUE_JVM = "jvm";
    exports.PROFILE_FRAME_TYPE_VALUE_KERNEL = "kernel";
    exports.PROFILE_FRAME_TYPE_VALUE_NATIVE = "native";
    exports.PROFILE_FRAME_TYPE_VALUE_PERL = "perl";
    exports.PROFILE_FRAME_TYPE_VALUE_PHP = "php";
    exports.PROFILE_FRAME_TYPE_VALUE_RUBY = "ruby";
    exports.PROFILE_FRAME_TYPE_VALUE_RUST = "rust";
    exports.PROFILE_FRAME_TYPE_VALUE_V8JS = "v8js";
    exports.ATTR_RPC_CONNECT_RPC_ERROR_CODE = "rpc.connect_rpc.error_code";
    exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_ABORTED = "aborted";
    exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_ALREADY_EXISTS = "already_exists";
    exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_CANCELLED = "cancelled";
    exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_DATA_LOSS = "data_loss";
    exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_DEADLINE_EXCEEDED = "deadline_exceeded";
    exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_FAILED_PRECONDITION = "failed_precondition";
    exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_INTERNAL = "internal";
    exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_INVALID_ARGUMENT = "invalid_argument";
    exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_NOT_FOUND = "not_found";
    exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_OUT_OF_RANGE = "out_of_range";
    exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_PERMISSION_DENIED = "permission_denied";
    exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_RESOURCE_EXHAUSTED = "resource_exhausted";
    exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_UNAUTHENTICATED = "unauthenticated";
    exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_UNAVAILABLE = "unavailable";
    exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_UNIMPLEMENTED = "unimplemented";
    exports.RPC_CONNECT_RPC_ERROR_CODE_VALUE_UNKNOWN = "unknown";
    var ATTR_RPC_CONNECT_RPC_REQUEST_METADATA = /* @__PURE__ */ __name((key) => `rpc.connect_rpc.request.metadata.${key}`, "ATTR_RPC_CONNECT_RPC_REQUEST_METADATA");
    exports.ATTR_RPC_CONNECT_RPC_REQUEST_METADATA = ATTR_RPC_CONNECT_RPC_REQUEST_METADATA;
    var ATTR_RPC_CONNECT_RPC_RESPONSE_METADATA = /* @__PURE__ */ __name((key) => `rpc.connect_rpc.response.metadata.${key}`, "ATTR_RPC_CONNECT_RPC_RESPONSE_METADATA");
    exports.ATTR_RPC_CONNECT_RPC_RESPONSE_METADATA = ATTR_RPC_CONNECT_RPC_RESPONSE_METADATA;
    var ATTR_RPC_GRPC_REQUEST_METADATA = /* @__PURE__ */ __name((key) => `rpc.grpc.request.metadata.${key}`, "ATTR_RPC_GRPC_REQUEST_METADATA");
    exports.ATTR_RPC_GRPC_REQUEST_METADATA = ATTR_RPC_GRPC_REQUEST_METADATA;
    var ATTR_RPC_GRPC_RESPONSE_METADATA = /* @__PURE__ */ __name((key) => `rpc.grpc.response.metadata.${key}`, "ATTR_RPC_GRPC_RESPONSE_METADATA");
    exports.ATTR_RPC_GRPC_RESPONSE_METADATA = ATTR_RPC_GRPC_RESPONSE_METADATA;
    exports.ATTR_RPC_GRPC_STATUS_CODE = "rpc.grpc.status_code";
    exports.RPC_GRPC_STATUS_CODE_VALUE_OK = 0;
    exports.RPC_GRPC_STATUS_CODE_VALUE_CANCELLED = 1;
    exports.RPC_GRPC_STATUS_CODE_VALUE_UNKNOWN = 2;
    exports.RPC_GRPC_STATUS_CODE_VALUE_INVALID_ARGUMENT = 3;
    exports.RPC_GRPC_STATUS_CODE_VALUE_DEADLINE_EXCEEDED = 4;
    exports.RPC_GRPC_STATUS_CODE_VALUE_NOT_FOUND = 5;
    exports.RPC_GRPC_STATUS_CODE_VALUE_ALREADY_EXISTS = 6;
    exports.RPC_GRPC_STATUS_CODE_VALUE_PERMISSION_DENIED = 7;
    exports.RPC_GRPC_STATUS_CODE_VALUE_RESOURCE_EXHAUSTED = 8;
    exports.RPC_GRPC_STATUS_CODE_VALUE_FAILED_PRECONDITION = 9;
    exports.RPC_GRPC_STATUS_CODE_VALUE_ABORTED = 10;
    exports.RPC_GRPC_STATUS_CODE_VALUE_OUT_OF_RANGE = 11;
    exports.RPC_GRPC_STATUS_CODE_VALUE_UNIMPLEMENTED = 12;
    exports.RPC_GRPC_STATUS_CODE_VALUE_INTERNAL = 13;
    exports.RPC_GRPC_STATUS_CODE_VALUE_UNAVAILABLE = 14;
    exports.RPC_GRPC_STATUS_CODE_VALUE_DATA_LOSS = 15;
    exports.RPC_GRPC_STATUS_CODE_VALUE_UNAUTHENTICATED = 16;
    exports.ATTR_RPC_JSONRPC_ERROR_CODE = "rpc.jsonrpc.error_code";
    exports.ATTR_RPC_JSONRPC_ERROR_MESSAGE = "rpc.jsonrpc.error_message";
    exports.ATTR_RPC_JSONRPC_REQUEST_ID = "rpc.jsonrpc.request_id";
    exports.ATTR_RPC_JSONRPC_VERSION = "rpc.jsonrpc.version";
    exports.ATTR_RPC_MESSAGE_COMPRESSED_SIZE = "rpc.message.compressed_size";
    exports.ATTR_RPC_MESSAGE_ID = "rpc.message.id";
    exports.ATTR_RPC_MESSAGE_TYPE = "rpc.message.type";
    exports.RPC_MESSAGE_TYPE_VALUE_RECEIVED = "RECEIVED";
    exports.RPC_MESSAGE_TYPE_VALUE_SENT = "SENT";
    exports.ATTR_RPC_MESSAGE_UNCOMPRESSED_SIZE = "rpc.message.uncompressed_size";
    exports.ATTR_RPC_METHOD = "rpc.method";
    exports.ATTR_RPC_SERVICE = "rpc.service";
    exports.ATTR_RPC_SYSTEM = "rpc.system";
    exports.RPC_SYSTEM_VALUE_APACHE_DUBBO = "apache_dubbo";
    exports.RPC_SYSTEM_VALUE_CONNECT_RPC = "connect_rpc";
    exports.RPC_SYSTEM_VALUE_DOTNET_WCF = "dotnet_wcf";
    exports.RPC_SYSTEM_VALUE_GRPC = "grpc";
    exports.RPC_SYSTEM_VALUE_JAVA_RMI = "java_rmi";
    exports.RPC_SYSTEM_VALUE_JSONRPC = "jsonrpc";
    exports.RPC_SYSTEM_VALUE_ONC_RPC = "onc_rpc";
    exports.ATTR_SECURITY_RULE_CATEGORY = "security_rule.category";
    exports.ATTR_SECURITY_RULE_DESCRIPTION = "security_rule.description";
    exports.ATTR_SECURITY_RULE_LICENSE = "security_rule.license";
    exports.ATTR_SECURITY_RULE_NAME = "security_rule.name";
    exports.ATTR_SECURITY_RULE_REFERENCE = "security_rule.reference";
    exports.ATTR_SECURITY_RULE_RULESET_NAME = "security_rule.ruleset.name";
    exports.ATTR_SECURITY_RULE_UUID = "security_rule.uuid";
    exports.ATTR_SECURITY_RULE_VERSION = "security_rule.version";
    exports.ATTR_SERVICE_INSTANCE_ID = "service.instance.id";
    exports.ATTR_SERVICE_NAMESPACE = "service.namespace";
    exports.ATTR_SESSION_ID = "session.id";
    exports.ATTR_SESSION_PREVIOUS_ID = "session.previous_id";
    exports.ATTR_SOURCE_ADDRESS = "source.address";
    exports.ATTR_SOURCE_PORT = "source.port";
    exports.ATTR_STATE = "state";
    exports.STATE_VALUE_IDLE = "idle";
    exports.STATE_VALUE_USED = "used";
    exports.ATTR_SYSTEM_CPU_LOGICAL_NUMBER = "system.cpu.logical_number";
    exports.ATTR_SYSTEM_CPU_STATE = "system.cpu.state";
    exports.SYSTEM_CPU_STATE_VALUE_IDLE = "idle";
    exports.SYSTEM_CPU_STATE_VALUE_INTERRUPT = "interrupt";
    exports.SYSTEM_CPU_STATE_VALUE_IOWAIT = "iowait";
    exports.SYSTEM_CPU_STATE_VALUE_NICE = "nice";
    exports.SYSTEM_CPU_STATE_VALUE_STEAL = "steal";
    exports.SYSTEM_CPU_STATE_VALUE_SYSTEM = "system";
    exports.SYSTEM_CPU_STATE_VALUE_USER = "user";
    exports.ATTR_SYSTEM_DEVICE = "system.device";
    exports.ATTR_SYSTEM_FILESYSTEM_MODE = "system.filesystem.mode";
    exports.ATTR_SYSTEM_FILESYSTEM_MOUNTPOINT = "system.filesystem.mountpoint";
    exports.ATTR_SYSTEM_FILESYSTEM_STATE = "system.filesystem.state";
    exports.SYSTEM_FILESYSTEM_STATE_VALUE_FREE = "free";
    exports.SYSTEM_FILESYSTEM_STATE_VALUE_RESERVED = "reserved";
    exports.SYSTEM_FILESYSTEM_STATE_VALUE_USED = "used";
    exports.ATTR_SYSTEM_FILESYSTEM_TYPE = "system.filesystem.type";
    exports.SYSTEM_FILESYSTEM_TYPE_VALUE_EXFAT = "exfat";
    exports.SYSTEM_FILESYSTEM_TYPE_VALUE_EXT4 = "ext4";
    exports.SYSTEM_FILESYSTEM_TYPE_VALUE_FAT32 = "fat32";
    exports.SYSTEM_FILESYSTEM_TYPE_VALUE_HFSPLUS = "hfsplus";
    exports.SYSTEM_FILESYSTEM_TYPE_VALUE_NTFS = "ntfs";
    exports.SYSTEM_FILESYSTEM_TYPE_VALUE_REFS = "refs";
    exports.ATTR_SYSTEM_MEMORY_STATE = "system.memory.state";
    exports.SYSTEM_MEMORY_STATE_VALUE_BUFFERS = "buffers";
    exports.SYSTEM_MEMORY_STATE_VALUE_CACHED = "cached";
    exports.SYSTEM_MEMORY_STATE_VALUE_FREE = "free";
    exports.SYSTEM_MEMORY_STATE_VALUE_SHARED = "shared";
    exports.SYSTEM_MEMORY_STATE_VALUE_USED = "used";
    exports.ATTR_SYSTEM_NETWORK_STATE = "system.network.state";
    exports.SYSTEM_NETWORK_STATE_VALUE_CLOSE = "close";
    exports.SYSTEM_NETWORK_STATE_VALUE_CLOSE_WAIT = "close_wait";
    exports.SYSTEM_NETWORK_STATE_VALUE_CLOSING = "closing";
    exports.SYSTEM_NETWORK_STATE_VALUE_DELETE = "delete";
    exports.SYSTEM_NETWORK_STATE_VALUE_ESTABLISHED = "established";
    exports.SYSTEM_NETWORK_STATE_VALUE_FIN_WAIT_1 = "fin_wait_1";
    exports.SYSTEM_NETWORK_STATE_VALUE_FIN_WAIT_2 = "fin_wait_2";
    exports.SYSTEM_NETWORK_STATE_VALUE_LAST_ACK = "last_ack";
    exports.SYSTEM_NETWORK_STATE_VALUE_LISTEN = "listen";
    exports.SYSTEM_NETWORK_STATE_VALUE_SYN_RECV = "syn_recv";
    exports.SYSTEM_NETWORK_STATE_VALUE_SYN_SENT = "syn_sent";
    exports.SYSTEM_NETWORK_STATE_VALUE_TIME_WAIT = "time_wait";
    exports.ATTR_SYSTEM_PAGING_DIRECTION = "system.paging.direction";
    exports.SYSTEM_PAGING_DIRECTION_VALUE_IN = "in";
    exports.SYSTEM_PAGING_DIRECTION_VALUE_OUT = "out";
    exports.ATTR_SYSTEM_PAGING_FAULT_TYPE = "system.paging.fault.type";
    exports.SYSTEM_PAGING_FAULT_TYPE_VALUE_MAJOR = "major";
    exports.SYSTEM_PAGING_FAULT_TYPE_VALUE_MINOR = "minor";
    exports.ATTR_SYSTEM_PAGING_STATE = "system.paging.state";
    exports.SYSTEM_PAGING_STATE_VALUE_FREE = "free";
    exports.SYSTEM_PAGING_STATE_VALUE_USED = "used";
    exports.ATTR_SYSTEM_PAGING_TYPE = "system.paging.type";
    exports.SYSTEM_PAGING_TYPE_VALUE_MAJOR = "major";
    exports.SYSTEM_PAGING_TYPE_VALUE_MINOR = "minor";
    exports.ATTR_SYSTEM_PROCESS_STATUS = "system.process.status";
    exports.SYSTEM_PROCESS_STATUS_VALUE_DEFUNCT = "defunct";
    exports.SYSTEM_PROCESS_STATUS_VALUE_RUNNING = "running";
    exports.SYSTEM_PROCESS_STATUS_VALUE_SLEEPING = "sleeping";
    exports.SYSTEM_PROCESS_STATUS_VALUE_STOPPED = "stopped";
    exports.ATTR_SYSTEM_PROCESSES_STATUS = "system.processes.status";
    exports.SYSTEM_PROCESSES_STATUS_VALUE_DEFUNCT = "defunct";
    exports.SYSTEM_PROCESSES_STATUS_VALUE_RUNNING = "running";
    exports.SYSTEM_PROCESSES_STATUS_VALUE_SLEEPING = "sleeping";
    exports.SYSTEM_PROCESSES_STATUS_VALUE_STOPPED = "stopped";
    exports.ATTR_TELEMETRY_DISTRO_NAME = "telemetry.distro.name";
    exports.ATTR_TELEMETRY_DISTRO_VERSION = "telemetry.distro.version";
    exports.ATTR_TEST_CASE_NAME = "test.case.name";
    exports.ATTR_TEST_CASE_RESULT_STATUS = "test.case.result.status";
    exports.TEST_CASE_RESULT_STATUS_VALUE_FAIL = "fail";
    exports.TEST_CASE_RESULT_STATUS_VALUE_PASS = "pass";
    exports.ATTR_TEST_SUITE_NAME = "test.suite.name";
    exports.ATTR_TEST_SUITE_RUN_STATUS = "test.suite.run.status";
    exports.TEST_SUITE_RUN_STATUS_VALUE_ABORTED = "aborted";
    exports.TEST_SUITE_RUN_STATUS_VALUE_FAILURE = "failure";
    exports.TEST_SUITE_RUN_STATUS_VALUE_IN_PROGRESS = "in_progress";
    exports.TEST_SUITE_RUN_STATUS_VALUE_SKIPPED = "skipped";
    exports.TEST_SUITE_RUN_STATUS_VALUE_SUCCESS = "success";
    exports.TEST_SUITE_RUN_STATUS_VALUE_TIMED_OUT = "timed_out";
    exports.ATTR_THREAD_ID = "thread.id";
    exports.ATTR_THREAD_NAME = "thread.name";
    exports.ATTR_TLS_CIPHER = "tls.cipher";
    exports.ATTR_TLS_CLIENT_CERTIFICATE = "tls.client.certificate";
    exports.ATTR_TLS_CLIENT_CERTIFICATE_CHAIN = "tls.client.certificate_chain";
    exports.ATTR_TLS_CLIENT_HASH_MD5 = "tls.client.hash.md5";
    exports.ATTR_TLS_CLIENT_HASH_SHA1 = "tls.client.hash.sha1";
    exports.ATTR_TLS_CLIENT_HASH_SHA256 = "tls.client.hash.sha256";
    exports.ATTR_TLS_CLIENT_ISSUER = "tls.client.issuer";
    exports.ATTR_TLS_CLIENT_JA3 = "tls.client.ja3";
    exports.ATTR_TLS_CLIENT_NOT_AFTER = "tls.client.not_after";
    exports.ATTR_TLS_CLIENT_NOT_BEFORE = "tls.client.not_before";
    exports.ATTR_TLS_CLIENT_SERVER_NAME = "tls.client.server_name";
    exports.ATTR_TLS_CLIENT_SUBJECT = "tls.client.subject";
    exports.ATTR_TLS_CLIENT_SUPPORTED_CIPHERS = "tls.client.supported_ciphers";
    exports.ATTR_TLS_CURVE = "tls.curve";
    exports.ATTR_TLS_ESTABLISHED = "tls.established";
    exports.ATTR_TLS_NEXT_PROTOCOL = "tls.next_protocol";
    exports.ATTR_TLS_PROTOCOL_NAME = "tls.protocol.name";
    exports.TLS_PROTOCOL_NAME_VALUE_SSL = "ssl";
    exports.TLS_PROTOCOL_NAME_VALUE_TLS = "tls";
    exports.ATTR_TLS_PROTOCOL_VERSION = "tls.protocol.version";
    exports.ATTR_TLS_RESUMED = "tls.resumed";
    exports.ATTR_TLS_SERVER_CERTIFICATE = "tls.server.certificate";
    exports.ATTR_TLS_SERVER_CERTIFICATE_CHAIN = "tls.server.certificate_chain";
    exports.ATTR_TLS_SERVER_HASH_MD5 = "tls.server.hash.md5";
    exports.ATTR_TLS_SERVER_HASH_SHA1 = "tls.server.hash.sha1";
    exports.ATTR_TLS_SERVER_HASH_SHA256 = "tls.server.hash.sha256";
    exports.ATTR_TLS_SERVER_ISSUER = "tls.server.issuer";
    exports.ATTR_TLS_SERVER_JA3S = "tls.server.ja3s";
    exports.ATTR_TLS_SERVER_NOT_AFTER = "tls.server.not_after";
    exports.ATTR_TLS_SERVER_NOT_BEFORE = "tls.server.not_before";
    exports.ATTR_TLS_SERVER_SUBJECT = "tls.server.subject";
    exports.ATTR_URL_DOMAIN = "url.domain";
    exports.ATTR_URL_EXTENSION = "url.extension";
    exports.ATTR_URL_ORIGINAL = "url.original";
    exports.ATTR_URL_PORT = "url.port";
    exports.ATTR_URL_REGISTERED_DOMAIN = "url.registered_domain";
    exports.ATTR_URL_SUBDOMAIN = "url.subdomain";
    exports.ATTR_URL_TEMPLATE = "url.template";
    exports.ATTR_URL_TOP_LEVEL_DOMAIN = "url.top_level_domain";
    exports.ATTR_USER_EMAIL = "user.email";
    exports.ATTR_USER_FULL_NAME = "user.full_name";
    exports.ATTR_USER_HASH = "user.hash";
    exports.ATTR_USER_ID = "user.id";
    exports.ATTR_USER_NAME = "user.name";
    exports.ATTR_USER_ROLES = "user.roles";
    exports.ATTR_USER_AGENT_NAME = "user_agent.name";
    exports.ATTR_USER_AGENT_OS_NAME = "user_agent.os.name";
    exports.ATTR_USER_AGENT_OS_VERSION = "user_agent.os.version";
    exports.ATTR_USER_AGENT_SYNTHETIC_TYPE = "user_agent.synthetic.type";
    exports.USER_AGENT_SYNTHETIC_TYPE_VALUE_BOT = "bot";
    exports.USER_AGENT_SYNTHETIC_TYPE_VALUE_TEST = "test";
    exports.ATTR_USER_AGENT_VERSION = "user_agent.version";
    exports.ATTR_V8JS_GC_TYPE = "v8js.gc.type";
    exports.V8JS_GC_TYPE_VALUE_INCREMENTAL = "incremental";
    exports.V8JS_GC_TYPE_VALUE_MAJOR = "major";
    exports.V8JS_GC_TYPE_VALUE_MINOR = "minor";
    exports.V8JS_GC_TYPE_VALUE_WEAKCB = "weakcb";
    exports.ATTR_V8JS_HEAP_SPACE_NAME = "v8js.heap.space.name";
    exports.V8JS_HEAP_SPACE_NAME_VALUE_CODE_SPACE = "code_space";
    exports.V8JS_HEAP_SPACE_NAME_VALUE_LARGE_OBJECT_SPACE = "large_object_space";
    exports.V8JS_HEAP_SPACE_NAME_VALUE_MAP_SPACE = "map_space";
    exports.V8JS_HEAP_SPACE_NAME_VALUE_NEW_SPACE = "new_space";
    exports.V8JS_HEAP_SPACE_NAME_VALUE_OLD_SPACE = "old_space";
    exports.ATTR_VCS_CHANGE_ID = "vcs.change.id";
    exports.ATTR_VCS_CHANGE_STATE = "vcs.change.state";
    exports.VCS_CHANGE_STATE_VALUE_CLOSED = "closed";
    exports.VCS_CHANGE_STATE_VALUE_MERGED = "merged";
    exports.VCS_CHANGE_STATE_VALUE_OPEN = "open";
    exports.VCS_CHANGE_STATE_VALUE_WIP = "wip";
    exports.ATTR_VCS_CHANGE_TITLE = "vcs.change.title";
    exports.ATTR_VCS_LINE_CHANGE_TYPE = "vcs.line_change.type";
    exports.VCS_LINE_CHANGE_TYPE_VALUE_ADDED = "added";
    exports.VCS_LINE_CHANGE_TYPE_VALUE_REMOVED = "removed";
    exports.ATTR_VCS_OWNER_NAME = "vcs.owner.name";
    exports.ATTR_VCS_PROVIDER_NAME = "vcs.provider.name";
    exports.VCS_PROVIDER_NAME_VALUE_BITBUCKET = "bitbucket";
    exports.VCS_PROVIDER_NAME_VALUE_GITEA = "gitea";
    exports.VCS_PROVIDER_NAME_VALUE_GITHUB = "github";
    exports.VCS_PROVIDER_NAME_VALUE_GITLAB = "gitlab";
    exports.VCS_PROVIDER_NAME_VALUE_GITTEA = "gittea";
    exports.ATTR_VCS_REF_BASE_NAME = "vcs.ref.base.name";
    exports.ATTR_VCS_REF_BASE_REVISION = "vcs.ref.base.revision";
    exports.ATTR_VCS_REF_BASE_TYPE = "vcs.ref.base.type";
    exports.VCS_REF_BASE_TYPE_VALUE_BRANCH = "branch";
    exports.VCS_REF_BASE_TYPE_VALUE_TAG = "tag";
    exports.ATTR_VCS_REF_HEAD_NAME = "vcs.ref.head.name";
    exports.ATTR_VCS_REF_HEAD_REVISION = "vcs.ref.head.revision";
    exports.ATTR_VCS_REF_HEAD_TYPE = "vcs.ref.head.type";
    exports.VCS_REF_HEAD_TYPE_VALUE_BRANCH = "branch";
    exports.VCS_REF_HEAD_TYPE_VALUE_TAG = "tag";
    exports.ATTR_VCS_REF_TYPE = "vcs.ref.type";
    exports.VCS_REF_TYPE_VALUE_BRANCH = "branch";
    exports.VCS_REF_TYPE_VALUE_TAG = "tag";
    exports.ATTR_VCS_REPOSITORY_CHANGE_ID = "vcs.repository.change.id";
    exports.ATTR_VCS_REPOSITORY_CHANGE_TITLE = "vcs.repository.change.title";
    exports.ATTR_VCS_REPOSITORY_NAME = "vcs.repository.name";
    exports.ATTR_VCS_REPOSITORY_REF_NAME = "vcs.repository.ref.name";
    exports.ATTR_VCS_REPOSITORY_REF_REVISION = "vcs.repository.ref.revision";
    exports.ATTR_VCS_REPOSITORY_REF_TYPE = "vcs.repository.ref.type";
    exports.VCS_REPOSITORY_REF_TYPE_VALUE_BRANCH = "branch";
    exports.VCS_REPOSITORY_REF_TYPE_VALUE_TAG = "tag";
    exports.ATTR_VCS_REPOSITORY_URL_FULL = "vcs.repository.url.full";
    exports.ATTR_VCS_REVISION_DELTA_DIRECTION = "vcs.revision_delta.direction";
    exports.VCS_REVISION_DELTA_DIRECTION_VALUE_AHEAD = "ahead";
    exports.VCS_REVISION_DELTA_DIRECTION_VALUE_BEHIND = "behind";
    exports.ATTR_WEBENGINE_DESCRIPTION = "webengine.description";
    exports.ATTR_WEBENGINE_NAME = "webengine.name";
    exports.ATTR_WEBENGINE_VERSION = "webengine.version";
    exports.ATTR_ZOS_SMF_ID = "zos.smf.id";
    exports.ATTR_ZOS_SYSPLEX_NAME = "zos.sysplex.name";
  }
});

// node_modules/@opentelemetry/semantic-conventions/build/src/experimental_metrics.js
var require_experimental_metrics = __commonJS({
  "node_modules/@opentelemetry/semantic-conventions/build/src/experimental_metrics.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.METRIC_DB_CLIENT_CONNECTION_CREATE_TIME = exports.METRIC_DB_CLIENT_CONNECTION_COUNT = exports.METRIC_CPYTHON_GC_UNCOLLECTABLE_OBJECTS = exports.METRIC_CPYTHON_GC_COLLECTIONS = exports.METRIC_CPYTHON_GC_COLLECTED_OBJECTS = exports.METRIC_CPU_UTILIZATION = exports.METRIC_CPU_TIME = exports.METRIC_CPU_FREQUENCY = exports.METRIC_CONTAINER_UPTIME = exports.METRIC_CONTAINER_NETWORK_IO = exports.METRIC_CONTAINER_MEMORY_WORKING_SET = exports.METRIC_CONTAINER_MEMORY_USAGE = exports.METRIC_CONTAINER_MEMORY_RSS = exports.METRIC_CONTAINER_MEMORY_PAGING_FAULTS = exports.METRIC_CONTAINER_MEMORY_AVAILABLE = exports.METRIC_CONTAINER_FILESYSTEM_USAGE = exports.METRIC_CONTAINER_FILESYSTEM_CAPACITY = exports.METRIC_CONTAINER_FILESYSTEM_AVAILABLE = exports.METRIC_CONTAINER_DISK_IO = exports.METRIC_CONTAINER_CPU_USAGE = exports.METRIC_CONTAINER_CPU_TIME = exports.METRIC_CICD_WORKER_COUNT = exports.METRIC_CICD_SYSTEM_ERRORS = exports.METRIC_CICD_PIPELINE_RUN_ERRORS = exports.METRIC_CICD_PIPELINE_RUN_DURATION = exports.METRIC_CICD_PIPELINE_RUN_ACTIVE = exports.METRIC_AZURE_COSMOSDB_CLIENT_OPERATION_REQUEST_CHARGE = exports.METRIC_AZURE_COSMOSDB_CLIENT_ACTIVE_INSTANCE_COUNT = exports.METRIC_ASPNETCORE_MEMORY_POOL_RENTED = exports.METRIC_ASPNETCORE_MEMORY_POOL_POOLED = exports.METRIC_ASPNETCORE_MEMORY_POOL_EVICTED = exports.METRIC_ASPNETCORE_MEMORY_POOL_ALLOCATED = exports.METRIC_ASPNETCORE_IDENTITY_USER_VERIFY_TOKEN_ATTEMPTS = exports.METRIC_ASPNETCORE_IDENTITY_USER_UPDATE_DURATION = exports.METRIC_ASPNETCORE_IDENTITY_USER_GENERATED_TOKENS = exports.METRIC_ASPNETCORE_IDENTITY_USER_DELETE_DURATION = exports.METRIC_ASPNETCORE_IDENTITY_USER_CREATE_DURATION = exports.METRIC_ASPNETCORE_IDENTITY_USER_CHECK_PASSWORD_ATTEMPTS = exports.METRIC_ASPNETCORE_IDENTITY_SIGN_IN_TWO_FACTOR_CLIENTS_REMEMBERED = exports.METRIC_ASPNETCORE_IDENTITY_SIGN_IN_TWO_FACTOR_CLIENTS_FORGOTTEN = exports.METRIC_ASPNETCORE_IDENTITY_SIGN_IN_SIGN_OUTS = exports.METRIC_ASPNETCORE_IDENTITY_SIGN_IN_SIGN_INS = exports.METRIC_ASPNETCORE_IDENTITY_SIGN_IN_CHECK_PASSWORD_ATTEMPTS = exports.METRIC_ASPNETCORE_IDENTITY_SIGN_IN_AUTHENTICATE_DURATION = exports.METRIC_ASPNETCORE_AUTHORIZATION_ATTEMPTS = exports.METRIC_ASPNETCORE_AUTHENTICATION_SIGN_OUTS = exports.METRIC_ASPNETCORE_AUTHENTICATION_SIGN_INS = exports.METRIC_ASPNETCORE_AUTHENTICATION_FORBIDS = exports.METRIC_ASPNETCORE_AUTHENTICATION_CHALLENGES = exports.METRIC_ASPNETCORE_AUTHENTICATION_AUTHENTICATE_DURATION = void 0;
    exports.METRIC_HTTP_SERVER_REQUEST_BODY_SIZE = exports.METRIC_HTTP_SERVER_ACTIVE_REQUESTS = exports.METRIC_HTTP_CLIENT_RESPONSE_BODY_SIZE = exports.METRIC_HTTP_CLIENT_REQUEST_BODY_SIZE = exports.METRIC_HTTP_CLIENT_OPEN_CONNECTIONS = exports.METRIC_HTTP_CLIENT_CONNECTION_DURATION = exports.METRIC_HTTP_CLIENT_ACTIVE_REQUESTS = exports.METRIC_GO_SCHEDULE_DURATION = exports.METRIC_GO_PROCESSOR_LIMIT = exports.METRIC_GO_MEMORY_USED = exports.METRIC_GO_MEMORY_LIMIT = exports.METRIC_GO_MEMORY_GC_GOAL = exports.METRIC_GO_MEMORY_ALLOCATIONS = exports.METRIC_GO_MEMORY_ALLOCATED = exports.METRIC_GO_GOROUTINE_COUNT = exports.METRIC_GO_CONFIG_GOGC = exports.METRIC_GEN_AI_SERVER_TIME_TO_FIRST_TOKEN = exports.METRIC_GEN_AI_SERVER_TIME_PER_OUTPUT_TOKEN = exports.METRIC_GEN_AI_SERVER_REQUEST_DURATION = exports.METRIC_GEN_AI_CLIENT_TOKEN_USAGE = exports.METRIC_GEN_AI_CLIENT_OPERATION_DURATION = exports.METRIC_FAAS_TIMEOUTS = exports.METRIC_FAAS_NET_IO = exports.METRIC_FAAS_MEM_USAGE = exports.METRIC_FAAS_INVOKE_DURATION = exports.METRIC_FAAS_INVOCATIONS = exports.METRIC_FAAS_INIT_DURATION = exports.METRIC_FAAS_ERRORS = exports.METRIC_FAAS_CPU_USAGE = exports.METRIC_FAAS_COLDSTARTS = exports.METRIC_DNS_LOOKUP_DURATION = exports.METRIC_DB_CLIENT_RESPONSE_RETURNED_ROWS = exports.METRIC_DB_CLIENT_COSMOSDB_OPERATION_REQUEST_CHARGE = exports.METRIC_DB_CLIENT_COSMOSDB_ACTIVE_INSTANCE_COUNT = exports.METRIC_DB_CLIENT_CONNECTIONS_WAIT_TIME = exports.METRIC_DB_CLIENT_CONNECTIONS_USE_TIME = exports.METRIC_DB_CLIENT_CONNECTIONS_USAGE = exports.METRIC_DB_CLIENT_CONNECTIONS_TIMEOUTS = exports.METRIC_DB_CLIENT_CONNECTIONS_PENDING_REQUESTS = exports.METRIC_DB_CLIENT_CONNECTIONS_MAX = exports.METRIC_DB_CLIENT_CONNECTIONS_IDLE_MIN = exports.METRIC_DB_CLIENT_CONNECTIONS_IDLE_MAX = exports.METRIC_DB_CLIENT_CONNECTIONS_CREATE_TIME = exports.METRIC_DB_CLIENT_CONNECTION_WAIT_TIME = exports.METRIC_DB_CLIENT_CONNECTION_USE_TIME = exports.METRIC_DB_CLIENT_CONNECTION_TIMEOUTS = exports.METRIC_DB_CLIENT_CONNECTION_PENDING_REQUESTS = exports.METRIC_DB_CLIENT_CONNECTION_MAX = exports.METRIC_DB_CLIENT_CONNECTION_IDLE_MIN = exports.METRIC_DB_CLIENT_CONNECTION_IDLE_MAX = void 0;
    exports.METRIC_JVM_SYSTEM_CPU_LOAD_1M = exports.METRIC_JVM_MEMORY_INIT = exports.METRIC_JVM_FILE_DESCRIPTOR_COUNT = exports.METRIC_JVM_BUFFER_MEMORY_USED = exports.METRIC_JVM_BUFFER_MEMORY_USAGE = exports.METRIC_JVM_BUFFER_MEMORY_LIMIT = exports.METRIC_JVM_BUFFER_COUNT = exports.METRIC_HW_VOLTAGE_NOMINAL = exports.METRIC_HW_VOLTAGE_LIMIT = exports.METRIC_HW_VOLTAGE = exports.METRIC_HW_TEMPERATURE_LIMIT = exports.METRIC_HW_TEMPERATURE = exports.METRIC_HW_TAPE_DRIVE_OPERATIONS = exports.METRIC_HW_STATUS = exports.METRIC_HW_POWER_SUPPLY_UTILIZATION = exports.METRIC_HW_POWER_SUPPLY_USAGE = exports.METRIC_HW_POWER_SUPPLY_LIMIT = exports.METRIC_HW_POWER = exports.METRIC_HW_PHYSICAL_DISK_SMART = exports.METRIC_HW_PHYSICAL_DISK_SIZE = exports.METRIC_HW_PHYSICAL_DISK_ENDURANCE_UTILIZATION = exports.METRIC_HW_NETWORK_UP = exports.METRIC_HW_NETWORK_PACKETS = exports.METRIC_HW_NETWORK_IO = exports.METRIC_HW_NETWORK_BANDWIDTH_UTILIZATION = exports.METRIC_HW_NETWORK_BANDWIDTH_LIMIT = exports.METRIC_HW_MEMORY_SIZE = exports.METRIC_HW_LOGICAL_DISK_UTILIZATION = exports.METRIC_HW_LOGICAL_DISK_USAGE = exports.METRIC_HW_LOGICAL_DISK_LIMIT = exports.METRIC_HW_HOST_POWER = exports.METRIC_HW_HOST_HEATING_MARGIN = exports.METRIC_HW_HOST_ENERGY = exports.METRIC_HW_HOST_AMBIENT_TEMPERATURE = exports.METRIC_HW_GPU_UTILIZATION = exports.METRIC_HW_GPU_MEMORY_UTILIZATION = exports.METRIC_HW_GPU_MEMORY_USAGE = exports.METRIC_HW_GPU_MEMORY_LIMIT = exports.METRIC_HW_GPU_IO = exports.METRIC_HW_FAN_SPEED_RATIO = exports.METRIC_HW_FAN_SPEED_LIMIT = exports.METRIC_HW_FAN_SPEED = exports.METRIC_HW_ERRORS = exports.METRIC_HW_ENERGY = exports.METRIC_HW_CPU_SPEED_LIMIT = exports.METRIC_HW_CPU_SPEED = exports.METRIC_HW_BATTERY_TIME_LEFT = exports.METRIC_HW_BATTERY_CHARGE_LIMIT = exports.METRIC_HW_BATTERY_CHARGE = exports.METRIC_HTTP_SERVER_RESPONSE_BODY_SIZE = void 0;
    exports.METRIC_K8S_JOB_SUCCESSFUL_PODS = exports.METRIC_K8S_JOB_POD_SUCCESSFUL = exports.METRIC_K8S_JOB_POD_MAX_PARALLEL = exports.METRIC_K8S_JOB_POD_FAILED = exports.METRIC_K8S_JOB_POD_DESIRED_SUCCESSFUL = exports.METRIC_K8S_JOB_POD_ACTIVE = exports.METRIC_K8S_JOB_MAX_PARALLEL_PODS = exports.METRIC_K8S_JOB_FAILED_PODS = exports.METRIC_K8S_JOB_DESIRED_SUCCESSFUL_PODS = exports.METRIC_K8S_JOB_ACTIVE_PODS = exports.METRIC_K8S_HPA_POD_MIN = exports.METRIC_K8S_HPA_POD_MAX = exports.METRIC_K8S_HPA_POD_DESIRED = exports.METRIC_K8S_HPA_POD_CURRENT = exports.METRIC_K8S_HPA_MIN_PODS = exports.METRIC_K8S_HPA_METRIC_TARGET_CPU_VALUE = exports.METRIC_K8S_HPA_METRIC_TARGET_CPU_AVERAGE_VALUE = exports.METRIC_K8S_HPA_METRIC_TARGET_CPU_AVERAGE_UTILIZATION = exports.METRIC_K8S_HPA_MAX_PODS = exports.METRIC_K8S_HPA_DESIRED_PODS = exports.METRIC_K8S_HPA_CURRENT_PODS = exports.METRIC_K8S_DEPLOYMENT_POD_DESIRED = exports.METRIC_K8S_DEPLOYMENT_POD_AVAILABLE = exports.METRIC_K8S_DEPLOYMENT_DESIRED_PODS = exports.METRIC_K8S_DEPLOYMENT_AVAILABLE_PODS = exports.METRIC_K8S_DAEMONSET_READY_NODES = exports.METRIC_K8S_DAEMONSET_NODE_READY = exports.METRIC_K8S_DAEMONSET_NODE_MISSCHEDULED = exports.METRIC_K8S_DAEMONSET_NODE_DESIRED_SCHEDULED = exports.METRIC_K8S_DAEMONSET_NODE_CURRENT_SCHEDULED = exports.METRIC_K8S_DAEMONSET_MISSCHEDULED_NODES = exports.METRIC_K8S_DAEMONSET_DESIRED_SCHEDULED_NODES = exports.METRIC_K8S_DAEMONSET_CURRENT_SCHEDULED_NODES = exports.METRIC_K8S_CRONJOB_JOB_ACTIVE = exports.METRIC_K8S_CRONJOB_ACTIVE_JOBS = exports.METRIC_K8S_CONTAINER_STORAGE_REQUEST = exports.METRIC_K8S_CONTAINER_STORAGE_LIMIT = exports.METRIC_K8S_CONTAINER_STATUS_STATE = exports.METRIC_K8S_CONTAINER_STATUS_REASON = exports.METRIC_K8S_CONTAINER_RESTART_COUNT = exports.METRIC_K8S_CONTAINER_READY = exports.METRIC_K8S_CONTAINER_MEMORY_REQUEST = exports.METRIC_K8S_CONTAINER_MEMORY_LIMIT = exports.METRIC_K8S_CONTAINER_EPHEMERAL_STORAGE_REQUEST = exports.METRIC_K8S_CONTAINER_EPHEMERAL_STORAGE_LIMIT = exports.METRIC_K8S_CONTAINER_CPU_REQUEST_UTILIZATION = exports.METRIC_K8S_CONTAINER_CPU_REQUEST = exports.METRIC_K8S_CONTAINER_CPU_LIMIT_UTILIZATION = exports.METRIC_K8S_CONTAINER_CPU_LIMIT = exports.METRIC_JVM_SYSTEM_CPU_UTILIZATION = void 0;
    exports.METRIC_K8S_REPLICATION_CONTROLLER_DESIRED_PODS = exports.METRIC_K8S_REPLICATION_CONTROLLER_AVAILABLE_PODS = exports.METRIC_K8S_REPLICASET_POD_DESIRED = exports.METRIC_K8S_REPLICASET_POD_AVAILABLE = exports.METRIC_K8S_REPLICASET_DESIRED_PODS = exports.METRIC_K8S_REPLICASET_AVAILABLE_PODS = exports.METRIC_K8S_POD_VOLUME_USAGE = exports.METRIC_K8S_POD_VOLUME_INODE_USED = exports.METRIC_K8S_POD_VOLUME_INODE_FREE = exports.METRIC_K8S_POD_VOLUME_INODE_COUNT = exports.METRIC_K8S_POD_VOLUME_CAPACITY = exports.METRIC_K8S_POD_VOLUME_AVAILABLE = exports.METRIC_K8S_POD_UPTIME = exports.METRIC_K8S_POD_STATUS_REASON = exports.METRIC_K8S_POD_STATUS_PHASE = exports.METRIC_K8S_POD_NETWORK_IO = exports.METRIC_K8S_POD_NETWORK_ERRORS = exports.METRIC_K8S_POD_MEMORY_WORKING_SET = exports.METRIC_K8S_POD_MEMORY_USAGE = exports.METRIC_K8S_POD_MEMORY_RSS = exports.METRIC_K8S_POD_MEMORY_PAGING_FAULTS = exports.METRIC_K8S_POD_MEMORY_AVAILABLE = exports.METRIC_K8S_POD_FILESYSTEM_USAGE = exports.METRIC_K8S_POD_FILESYSTEM_CAPACITY = exports.METRIC_K8S_POD_FILESYSTEM_AVAILABLE = exports.METRIC_K8S_POD_CPU_USAGE = exports.METRIC_K8S_POD_CPU_TIME = exports.METRIC_K8S_NODE_UPTIME = exports.METRIC_K8S_NODE_POD_ALLOCATABLE = exports.METRIC_K8S_NODE_NETWORK_IO = exports.METRIC_K8S_NODE_NETWORK_ERRORS = exports.METRIC_K8S_NODE_MEMORY_WORKING_SET = exports.METRIC_K8S_NODE_MEMORY_USAGE = exports.METRIC_K8S_NODE_MEMORY_RSS = exports.METRIC_K8S_NODE_MEMORY_PAGING_FAULTS = exports.METRIC_K8S_NODE_MEMORY_AVAILABLE = exports.METRIC_K8S_NODE_MEMORY_ALLOCATABLE = exports.METRIC_K8S_NODE_FILESYSTEM_USAGE = exports.METRIC_K8S_NODE_FILESYSTEM_CAPACITY = exports.METRIC_K8S_NODE_FILESYSTEM_AVAILABLE = exports.METRIC_K8S_NODE_EPHEMERAL_STORAGE_ALLOCATABLE = exports.METRIC_K8S_NODE_CPU_USAGE = exports.METRIC_K8S_NODE_CPU_TIME = exports.METRIC_K8S_NODE_CPU_ALLOCATABLE = exports.METRIC_K8S_NODE_CONDITION_STATUS = exports.METRIC_K8S_NODE_ALLOCATABLE_PODS = exports.METRIC_K8S_NODE_ALLOCATABLE_MEMORY = exports.METRIC_K8S_NODE_ALLOCATABLE_EPHEMERAL_STORAGE = exports.METRIC_K8S_NODE_ALLOCATABLE_CPU = exports.METRIC_K8S_NAMESPACE_PHASE = void 0;
    exports.METRIC_NFS_SERVER_FH_STALE_COUNT = exports.METRIC_NFS_CLIENT_RPC_RETRANSMIT_COUNT = exports.METRIC_NFS_CLIENT_RPC_COUNT = exports.METRIC_NFS_CLIENT_RPC_AUTHREFRESH_COUNT = exports.METRIC_NFS_CLIENT_PROCEDURE_COUNT = exports.METRIC_NFS_CLIENT_OPERATION_COUNT = exports.METRIC_NFS_CLIENT_NET_TCP_CONNECTION_ACCEPTED = exports.METRIC_NFS_CLIENT_NET_COUNT = exports.METRIC_MESSAGING_RECEIVE_MESSAGES = exports.METRIC_MESSAGING_RECEIVE_DURATION = exports.METRIC_MESSAGING_PUBLISH_MESSAGES = exports.METRIC_MESSAGING_PUBLISH_DURATION = exports.METRIC_MESSAGING_PROCESS_MESSAGES = exports.METRIC_MESSAGING_PROCESS_DURATION = exports.METRIC_MESSAGING_CLIENT_SENT_MESSAGES = exports.METRIC_MESSAGING_CLIENT_PUBLISHED_MESSAGES = exports.METRIC_MESSAGING_CLIENT_OPERATION_DURATION = exports.METRIC_MESSAGING_CLIENT_CONSUMED_MESSAGES = exports.METRIC_K8S_STATEFULSET_UPDATED_PODS = exports.METRIC_K8S_STATEFULSET_READY_PODS = exports.METRIC_K8S_STATEFULSET_POD_UPDATED = exports.METRIC_K8S_STATEFULSET_POD_READY = exports.METRIC_K8S_STATEFULSET_POD_DESIRED = exports.METRIC_K8S_STATEFULSET_POD_CURRENT = exports.METRIC_K8S_STATEFULSET_DESIRED_PODS = exports.METRIC_K8S_STATEFULSET_CURRENT_PODS = exports.METRIC_K8S_RESOURCEQUOTA_STORAGE_REQUEST_USED = exports.METRIC_K8S_RESOURCEQUOTA_STORAGE_REQUEST_HARD = exports.METRIC_K8S_RESOURCEQUOTA_PERSISTENTVOLUMECLAIM_COUNT_USED = exports.METRIC_K8S_RESOURCEQUOTA_PERSISTENTVOLUMECLAIM_COUNT_HARD = exports.METRIC_K8S_RESOURCEQUOTA_OBJECT_COUNT_USED = exports.METRIC_K8S_RESOURCEQUOTA_OBJECT_COUNT_HARD = exports.METRIC_K8S_RESOURCEQUOTA_MEMORY_REQUEST_USED = exports.METRIC_K8S_RESOURCEQUOTA_MEMORY_REQUEST_HARD = exports.METRIC_K8S_RESOURCEQUOTA_MEMORY_LIMIT_USED = exports.METRIC_K8S_RESOURCEQUOTA_MEMORY_LIMIT_HARD = exports.METRIC_K8S_RESOURCEQUOTA_HUGEPAGE_COUNT_REQUEST_USED = exports.METRIC_K8S_RESOURCEQUOTA_HUGEPAGE_COUNT_REQUEST_HARD = exports.METRIC_K8S_RESOURCEQUOTA_EPHEMERAL_STORAGE_REQUEST_USED = exports.METRIC_K8S_RESOURCEQUOTA_EPHEMERAL_STORAGE_REQUEST_HARD = exports.METRIC_K8S_RESOURCEQUOTA_EPHEMERAL_STORAGE_LIMIT_USED = exports.METRIC_K8S_RESOURCEQUOTA_EPHEMERAL_STORAGE_LIMIT_HARD = exports.METRIC_K8S_RESOURCEQUOTA_CPU_REQUEST_USED = exports.METRIC_K8S_RESOURCEQUOTA_CPU_REQUEST_HARD = exports.METRIC_K8S_RESOURCEQUOTA_CPU_LIMIT_USED = exports.METRIC_K8S_RESOURCEQUOTA_CPU_LIMIT_HARD = exports.METRIC_K8S_REPLICATIONCONTROLLER_POD_DESIRED = exports.METRIC_K8S_REPLICATIONCONTROLLER_POD_AVAILABLE = exports.METRIC_K8S_REPLICATIONCONTROLLER_DESIRED_PODS = exports.METRIC_K8S_REPLICATIONCONTROLLER_AVAILABLE_PODS = void 0;
    exports.METRIC_OTEL_SDK_PROCESSOR_LOG_QUEUE_CAPACITY = exports.METRIC_OTEL_SDK_PROCESSOR_LOG_PROCESSED = exports.METRIC_OTEL_SDK_METRIC_READER_COLLECTION_DURATION = exports.METRIC_OTEL_SDK_LOG_CREATED = exports.METRIC_OTEL_SDK_EXPORTER_SPAN_INFLIGHT_COUNT = exports.METRIC_OTEL_SDK_EXPORTER_SPAN_INFLIGHT = exports.METRIC_OTEL_SDK_EXPORTER_SPAN_EXPORTED_COUNT = exports.METRIC_OTEL_SDK_EXPORTER_SPAN_EXPORTED = exports.METRIC_OTEL_SDK_EXPORTER_OPERATION_DURATION = exports.METRIC_OTEL_SDK_EXPORTER_METRIC_DATA_POINT_INFLIGHT = exports.METRIC_OTEL_SDK_EXPORTER_METRIC_DATA_POINT_EXPORTED = exports.METRIC_OTEL_SDK_EXPORTER_LOG_INFLIGHT = exports.METRIC_OTEL_SDK_EXPORTER_LOG_EXPORTED = exports.METRIC_OPENSHIFT_CLUSTERQUOTA_STORAGE_REQUEST_USED = exports.METRIC_OPENSHIFT_CLUSTERQUOTA_STORAGE_REQUEST_HARD = exports.METRIC_OPENSHIFT_CLUSTERQUOTA_PERSISTENTVOLUMECLAIM_COUNT_USED = exports.METRIC_OPENSHIFT_CLUSTERQUOTA_PERSISTENTVOLUMECLAIM_COUNT_HARD = exports.METRIC_OPENSHIFT_CLUSTERQUOTA_OBJECT_COUNT_USED = exports.METRIC_OPENSHIFT_CLUSTERQUOTA_OBJECT_COUNT_HARD = exports.METRIC_OPENSHIFT_CLUSTERQUOTA_MEMORY_REQUEST_USED = exports.METRIC_OPENSHIFT_CLUSTERQUOTA_MEMORY_REQUEST_HARD = exports.METRIC_OPENSHIFT_CLUSTERQUOTA_MEMORY_LIMIT_USED = exports.METRIC_OPENSHIFT_CLUSTERQUOTA_MEMORY_LIMIT_HARD = exports.METRIC_OPENSHIFT_CLUSTERQUOTA_HUGEPAGE_COUNT_REQUEST_USED = exports.METRIC_OPENSHIFT_CLUSTERQUOTA_HUGEPAGE_COUNT_REQUEST_HARD = exports.METRIC_OPENSHIFT_CLUSTERQUOTA_EPHEMERAL_STORAGE_REQUEST_USED = exports.METRIC_OPENSHIFT_CLUSTERQUOTA_EPHEMERAL_STORAGE_REQUEST_HARD = exports.METRIC_OPENSHIFT_CLUSTERQUOTA_EPHEMERAL_STORAGE_LIMIT_USED = exports.METRIC_OPENSHIFT_CLUSTERQUOTA_EPHEMERAL_STORAGE_LIMIT_HARD = exports.METRIC_OPENSHIFT_CLUSTERQUOTA_CPU_REQUEST_USED = exports.METRIC_OPENSHIFT_CLUSTERQUOTA_CPU_REQUEST_HARD = exports.METRIC_OPENSHIFT_CLUSTERQUOTA_CPU_LIMIT_USED = exports.METRIC_OPENSHIFT_CLUSTERQUOTA_CPU_LIMIT_HARD = exports.METRIC_NODEJS_EVENTLOOP_UTILIZATION = exports.METRIC_NODEJS_EVENTLOOP_TIME = exports.METRIC_NODEJS_EVENTLOOP_DELAY_STDDEV = exports.METRIC_NODEJS_EVENTLOOP_DELAY_P99 = exports.METRIC_NODEJS_EVENTLOOP_DELAY_P90 = exports.METRIC_NODEJS_EVENTLOOP_DELAY_P50 = exports.METRIC_NODEJS_EVENTLOOP_DELAY_MIN = exports.METRIC_NODEJS_EVENTLOOP_DELAY_MEAN = exports.METRIC_NODEJS_EVENTLOOP_DELAY_MAX = exports.METRIC_NFS_SERVER_THREAD_COUNT = exports.METRIC_NFS_SERVER_RPC_COUNT = exports.METRIC_NFS_SERVER_REPCACHE_REQUESTS = exports.METRIC_NFS_SERVER_PROCEDURE_COUNT = exports.METRIC_NFS_SERVER_OPERATION_COUNT = exports.METRIC_NFS_SERVER_NET_TCP_CONNECTION_ACCEPTED = exports.METRIC_NFS_SERVER_NET_COUNT = exports.METRIC_NFS_SERVER_IO = void 0;
    exports.METRIC_SYSTEM_MEMORY_USAGE = exports.METRIC_SYSTEM_MEMORY_SHARED = exports.METRIC_SYSTEM_MEMORY_LIMIT = exports.METRIC_SYSTEM_LINUX_MEMORY_SLAB_USAGE = exports.METRIC_SYSTEM_LINUX_MEMORY_AVAILABLE = exports.METRIC_SYSTEM_FILESYSTEM_UTILIZATION = exports.METRIC_SYSTEM_FILESYSTEM_USAGE = exports.METRIC_SYSTEM_FILESYSTEM_LIMIT = exports.METRIC_SYSTEM_DISK_OPERATIONS = exports.METRIC_SYSTEM_DISK_OPERATION_TIME = exports.METRIC_SYSTEM_DISK_MERGED = exports.METRIC_SYSTEM_DISK_LIMIT = exports.METRIC_SYSTEM_DISK_IO_TIME = exports.METRIC_SYSTEM_DISK_IO = exports.METRIC_SYSTEM_CPU_UTILIZATION = exports.METRIC_SYSTEM_CPU_TIME = exports.METRIC_SYSTEM_CPU_PHYSICAL_COUNT = exports.METRIC_SYSTEM_CPU_LOGICAL_COUNT = exports.METRIC_SYSTEM_CPU_FREQUENCY = exports.METRIC_RPC_SERVER_RESPONSES_PER_RPC = exports.METRIC_RPC_SERVER_RESPONSE_SIZE = exports.METRIC_RPC_SERVER_REQUESTS_PER_RPC = exports.METRIC_RPC_SERVER_REQUEST_SIZE = exports.METRIC_RPC_SERVER_DURATION = exports.METRIC_RPC_CLIENT_RESPONSES_PER_RPC = exports.METRIC_RPC_CLIENT_RESPONSE_SIZE = exports.METRIC_RPC_CLIENT_REQUESTS_PER_RPC = exports.METRIC_RPC_CLIENT_REQUEST_SIZE = exports.METRIC_RPC_CLIENT_DURATION = exports.METRIC_PROCESS_UPTIME = exports.METRIC_PROCESS_THREAD_COUNT = exports.METRIC_PROCESS_PAGING_FAULTS = exports.METRIC_PROCESS_OPEN_FILE_DESCRIPTOR_COUNT = exports.METRIC_PROCESS_NETWORK_IO = exports.METRIC_PROCESS_MEMORY_VIRTUAL = exports.METRIC_PROCESS_MEMORY_USAGE = exports.METRIC_PROCESS_DISK_IO = exports.METRIC_PROCESS_CPU_UTILIZATION = exports.METRIC_PROCESS_CPU_TIME = exports.METRIC_PROCESS_CONTEXT_SWITCHES = exports.METRIC_OTEL_SDK_SPAN_STARTED = exports.METRIC_OTEL_SDK_SPAN_LIVE_COUNT = exports.METRIC_OTEL_SDK_SPAN_LIVE = exports.METRIC_OTEL_SDK_SPAN_ENDED_COUNT = exports.METRIC_OTEL_SDK_SPAN_ENDED = exports.METRIC_OTEL_SDK_PROCESSOR_SPAN_QUEUE_SIZE = exports.METRIC_OTEL_SDK_PROCESSOR_SPAN_QUEUE_CAPACITY = exports.METRIC_OTEL_SDK_PROCESSOR_SPAN_PROCESSED_COUNT = exports.METRIC_OTEL_SDK_PROCESSOR_SPAN_PROCESSED = exports.METRIC_OTEL_SDK_PROCESSOR_LOG_QUEUE_SIZE = void 0;
    exports.METRIC_VCS_REPOSITORY_COUNT = exports.METRIC_VCS_REF_TIME = exports.METRIC_VCS_REF_REVISIONS_DELTA = exports.METRIC_VCS_REF_LINES_DELTA = exports.METRIC_VCS_REF_COUNT = exports.METRIC_VCS_CONTRIBUTOR_COUNT = exports.METRIC_VCS_CHANGE_TIME_TO_MERGE = exports.METRIC_VCS_CHANGE_TIME_TO_APPROVAL = exports.METRIC_VCS_CHANGE_DURATION = exports.METRIC_VCS_CHANGE_COUNT = exports.METRIC_V8JS_MEMORY_HEAP_USED = exports.METRIC_V8JS_MEMORY_HEAP_SPACE_PHYSICAL_SIZE = exports.METRIC_V8JS_MEMORY_HEAP_SPACE_AVAILABLE_SIZE = exports.METRIC_V8JS_MEMORY_HEAP_LIMIT = exports.METRIC_V8JS_HEAP_SPACE_PHYSICAL_SIZE = exports.METRIC_V8JS_HEAP_SPACE_AVAILABLE_SIZE = exports.METRIC_V8JS_GC_DURATION = exports.METRIC_SYSTEM_UPTIME = exports.METRIC_SYSTEM_PROCESS_CREATED = exports.METRIC_SYSTEM_PROCESS_COUNT = exports.METRIC_SYSTEM_PAGING_UTILIZATION = exports.METRIC_SYSTEM_PAGING_USAGE = exports.METRIC_SYSTEM_PAGING_OPERATIONS = exports.METRIC_SYSTEM_PAGING_FAULTS = exports.METRIC_SYSTEM_NETWORK_PACKETS = exports.METRIC_SYSTEM_NETWORK_PACKET_DROPPED = exports.METRIC_SYSTEM_NETWORK_PACKET_COUNT = exports.METRIC_SYSTEM_NETWORK_IO = exports.METRIC_SYSTEM_NETWORK_ERRORS = exports.METRIC_SYSTEM_NETWORK_DROPPED = exports.METRIC_SYSTEM_NETWORK_CONNECTIONS = exports.METRIC_SYSTEM_NETWORK_CONNECTION_COUNT = exports.METRIC_SYSTEM_MEMORY_UTILIZATION = void 0;
    exports.METRIC_ASPNETCORE_AUTHENTICATION_AUTHENTICATE_DURATION = "aspnetcore.authentication.authenticate.duration";
    exports.METRIC_ASPNETCORE_AUTHENTICATION_CHALLENGES = "aspnetcore.authentication.challenges";
    exports.METRIC_ASPNETCORE_AUTHENTICATION_FORBIDS = "aspnetcore.authentication.forbids";
    exports.METRIC_ASPNETCORE_AUTHENTICATION_SIGN_INS = "aspnetcore.authentication.sign_ins";
    exports.METRIC_ASPNETCORE_AUTHENTICATION_SIGN_OUTS = "aspnetcore.authentication.sign_outs";
    exports.METRIC_ASPNETCORE_AUTHORIZATION_ATTEMPTS = "aspnetcore.authorization.attempts";
    exports.METRIC_ASPNETCORE_IDENTITY_SIGN_IN_AUTHENTICATE_DURATION = "aspnetcore.identity.sign_in.authenticate.duration";
    exports.METRIC_ASPNETCORE_IDENTITY_SIGN_IN_CHECK_PASSWORD_ATTEMPTS = "aspnetcore.identity.sign_in.check_password_attempts";
    exports.METRIC_ASPNETCORE_IDENTITY_SIGN_IN_SIGN_INS = "aspnetcore.identity.sign_in.sign_ins";
    exports.METRIC_ASPNETCORE_IDENTITY_SIGN_IN_SIGN_OUTS = "aspnetcore.identity.sign_in.sign_outs";
    exports.METRIC_ASPNETCORE_IDENTITY_SIGN_IN_TWO_FACTOR_CLIENTS_FORGOTTEN = "aspnetcore.identity.sign_in.two_factor_clients_forgotten";
    exports.METRIC_ASPNETCORE_IDENTITY_SIGN_IN_TWO_FACTOR_CLIENTS_REMEMBERED = "aspnetcore.identity.sign_in.two_factor_clients_remembered";
    exports.METRIC_ASPNETCORE_IDENTITY_USER_CHECK_PASSWORD_ATTEMPTS = "aspnetcore.identity.user.check_password_attempts";
    exports.METRIC_ASPNETCORE_IDENTITY_USER_CREATE_DURATION = "aspnetcore.identity.user.create.duration";
    exports.METRIC_ASPNETCORE_IDENTITY_USER_DELETE_DURATION = "aspnetcore.identity.user.delete.duration";
    exports.METRIC_ASPNETCORE_IDENTITY_USER_GENERATED_TOKENS = "aspnetcore.identity.user.generated_tokens";
    exports.METRIC_ASPNETCORE_IDENTITY_USER_UPDATE_DURATION = "aspnetcore.identity.user.update.duration";
    exports.METRIC_ASPNETCORE_IDENTITY_USER_VERIFY_TOKEN_ATTEMPTS = "aspnetcore.identity.user.verify_token_attempts";
    exports.METRIC_ASPNETCORE_MEMORY_POOL_ALLOCATED = "aspnetcore.memory_pool.allocated";
    exports.METRIC_ASPNETCORE_MEMORY_POOL_EVICTED = "aspnetcore.memory_pool.evicted";
    exports.METRIC_ASPNETCORE_MEMORY_POOL_POOLED = "aspnetcore.memory_pool.pooled";
    exports.METRIC_ASPNETCORE_MEMORY_POOL_RENTED = "aspnetcore.memory_pool.rented";
    exports.METRIC_AZURE_COSMOSDB_CLIENT_ACTIVE_INSTANCE_COUNT = "azure.cosmosdb.client.active_instance.count";
    exports.METRIC_AZURE_COSMOSDB_CLIENT_OPERATION_REQUEST_CHARGE = "azure.cosmosdb.client.operation.request_charge";
    exports.METRIC_CICD_PIPELINE_RUN_ACTIVE = "cicd.pipeline.run.active";
    exports.METRIC_CICD_PIPELINE_RUN_DURATION = "cicd.pipeline.run.duration";
    exports.METRIC_CICD_PIPELINE_RUN_ERRORS = "cicd.pipeline.run.errors";
    exports.METRIC_CICD_SYSTEM_ERRORS = "cicd.system.errors";
    exports.METRIC_CICD_WORKER_COUNT = "cicd.worker.count";
    exports.METRIC_CONTAINER_CPU_TIME = "container.cpu.time";
    exports.METRIC_CONTAINER_CPU_USAGE = "container.cpu.usage";
    exports.METRIC_CONTAINER_DISK_IO = "container.disk.io";
    exports.METRIC_CONTAINER_FILESYSTEM_AVAILABLE = "container.filesystem.available";
    exports.METRIC_CONTAINER_FILESYSTEM_CAPACITY = "container.filesystem.capacity";
    exports.METRIC_CONTAINER_FILESYSTEM_USAGE = "container.filesystem.usage";
    exports.METRIC_CONTAINER_MEMORY_AVAILABLE = "container.memory.available";
    exports.METRIC_CONTAINER_MEMORY_PAGING_FAULTS = "container.memory.paging.faults";
    exports.METRIC_CONTAINER_MEMORY_RSS = "container.memory.rss";
    exports.METRIC_CONTAINER_MEMORY_USAGE = "container.memory.usage";
    exports.METRIC_CONTAINER_MEMORY_WORKING_SET = "container.memory.working_set";
    exports.METRIC_CONTAINER_NETWORK_IO = "container.network.io";
    exports.METRIC_CONTAINER_UPTIME = "container.uptime";
    exports.METRIC_CPU_FREQUENCY = "cpu.frequency";
    exports.METRIC_CPU_TIME = "cpu.time";
    exports.METRIC_CPU_UTILIZATION = "cpu.utilization";
    exports.METRIC_CPYTHON_GC_COLLECTED_OBJECTS = "cpython.gc.collected_objects";
    exports.METRIC_CPYTHON_GC_COLLECTIONS = "cpython.gc.collections";
    exports.METRIC_CPYTHON_GC_UNCOLLECTABLE_OBJECTS = "cpython.gc.uncollectable_objects";
    exports.METRIC_DB_CLIENT_CONNECTION_COUNT = "db.client.connection.count";
    exports.METRIC_DB_CLIENT_CONNECTION_CREATE_TIME = "db.client.connection.create_time";
    exports.METRIC_DB_CLIENT_CONNECTION_IDLE_MAX = "db.client.connection.idle.max";
    exports.METRIC_DB_CLIENT_CONNECTION_IDLE_MIN = "db.client.connection.idle.min";
    exports.METRIC_DB_CLIENT_CONNECTION_MAX = "db.client.connection.max";
    exports.METRIC_DB_CLIENT_CONNECTION_PENDING_REQUESTS = "db.client.connection.pending_requests";
    exports.METRIC_DB_CLIENT_CONNECTION_TIMEOUTS = "db.client.connection.timeouts";
    exports.METRIC_DB_CLIENT_CONNECTION_USE_TIME = "db.client.connection.use_time";
    exports.METRIC_DB_CLIENT_CONNECTION_WAIT_TIME = "db.client.connection.wait_time";
    exports.METRIC_DB_CLIENT_CONNECTIONS_CREATE_TIME = "db.client.connections.create_time";
    exports.METRIC_DB_CLIENT_CONNECTIONS_IDLE_MAX = "db.client.connections.idle.max";
    exports.METRIC_DB_CLIENT_CONNECTIONS_IDLE_MIN = "db.client.connections.idle.min";
    exports.METRIC_DB_CLIENT_CONNECTIONS_MAX = "db.client.connections.max";
    exports.METRIC_DB_CLIENT_CONNECTIONS_PENDING_REQUESTS = "db.client.connections.pending_requests";
    exports.METRIC_DB_CLIENT_CONNECTIONS_TIMEOUTS = "db.client.connections.timeouts";
    exports.METRIC_DB_CLIENT_CONNECTIONS_USAGE = "db.client.connections.usage";
    exports.METRIC_DB_CLIENT_CONNECTIONS_USE_TIME = "db.client.connections.use_time";
    exports.METRIC_DB_CLIENT_CONNECTIONS_WAIT_TIME = "db.client.connections.wait_time";
    exports.METRIC_DB_CLIENT_COSMOSDB_ACTIVE_INSTANCE_COUNT = "db.client.cosmosdb.active_instance.count";
    exports.METRIC_DB_CLIENT_COSMOSDB_OPERATION_REQUEST_CHARGE = "db.client.cosmosdb.operation.request_charge";
    exports.METRIC_DB_CLIENT_RESPONSE_RETURNED_ROWS = "db.client.response.returned_rows";
    exports.METRIC_DNS_LOOKUP_DURATION = "dns.lookup.duration";
    exports.METRIC_FAAS_COLDSTARTS = "faas.coldstarts";
    exports.METRIC_FAAS_CPU_USAGE = "faas.cpu_usage";
    exports.METRIC_FAAS_ERRORS = "faas.errors";
    exports.METRIC_FAAS_INIT_DURATION = "faas.init_duration";
    exports.METRIC_FAAS_INVOCATIONS = "faas.invocations";
    exports.METRIC_FAAS_INVOKE_DURATION = "faas.invoke_duration";
    exports.METRIC_FAAS_MEM_USAGE = "faas.mem_usage";
    exports.METRIC_FAAS_NET_IO = "faas.net_io";
    exports.METRIC_FAAS_TIMEOUTS = "faas.timeouts";
    exports.METRIC_GEN_AI_CLIENT_OPERATION_DURATION = "gen_ai.client.operation.duration";
    exports.METRIC_GEN_AI_CLIENT_TOKEN_USAGE = "gen_ai.client.token.usage";
    exports.METRIC_GEN_AI_SERVER_REQUEST_DURATION = "gen_ai.server.request.duration";
    exports.METRIC_GEN_AI_SERVER_TIME_PER_OUTPUT_TOKEN = "gen_ai.server.time_per_output_token";
    exports.METRIC_GEN_AI_SERVER_TIME_TO_FIRST_TOKEN = "gen_ai.server.time_to_first_token";
    exports.METRIC_GO_CONFIG_GOGC = "go.config.gogc";
    exports.METRIC_GO_GOROUTINE_COUNT = "go.goroutine.count";
    exports.METRIC_GO_MEMORY_ALLOCATED = "go.memory.allocated";
    exports.METRIC_GO_MEMORY_ALLOCATIONS = "go.memory.allocations";
    exports.METRIC_GO_MEMORY_GC_GOAL = "go.memory.gc.goal";
    exports.METRIC_GO_MEMORY_LIMIT = "go.memory.limit";
    exports.METRIC_GO_MEMORY_USED = "go.memory.used";
    exports.METRIC_GO_PROCESSOR_LIMIT = "go.processor.limit";
    exports.METRIC_GO_SCHEDULE_DURATION = "go.schedule.duration";
    exports.METRIC_HTTP_CLIENT_ACTIVE_REQUESTS = "http.client.active_requests";
    exports.METRIC_HTTP_CLIENT_CONNECTION_DURATION = "http.client.connection.duration";
    exports.METRIC_HTTP_CLIENT_OPEN_CONNECTIONS = "http.client.open_connections";
    exports.METRIC_HTTP_CLIENT_REQUEST_BODY_SIZE = "http.client.request.body.size";
    exports.METRIC_HTTP_CLIENT_RESPONSE_BODY_SIZE = "http.client.response.body.size";
    exports.METRIC_HTTP_SERVER_ACTIVE_REQUESTS = "http.server.active_requests";
    exports.METRIC_HTTP_SERVER_REQUEST_BODY_SIZE = "http.server.request.body.size";
    exports.METRIC_HTTP_SERVER_RESPONSE_BODY_SIZE = "http.server.response.body.size";
    exports.METRIC_HW_BATTERY_CHARGE = "hw.battery.charge";
    exports.METRIC_HW_BATTERY_CHARGE_LIMIT = "hw.battery.charge.limit";
    exports.METRIC_HW_BATTERY_TIME_LEFT = "hw.battery.time_left";
    exports.METRIC_HW_CPU_SPEED = "hw.cpu.speed";
    exports.METRIC_HW_CPU_SPEED_LIMIT = "hw.cpu.speed.limit";
    exports.METRIC_HW_ENERGY = "hw.energy";
    exports.METRIC_HW_ERRORS = "hw.errors";
    exports.METRIC_HW_FAN_SPEED = "hw.fan.speed";
    exports.METRIC_HW_FAN_SPEED_LIMIT = "hw.fan.speed.limit";
    exports.METRIC_HW_FAN_SPEED_RATIO = "hw.fan.speed_ratio";
    exports.METRIC_HW_GPU_IO = "hw.gpu.io";
    exports.METRIC_HW_GPU_MEMORY_LIMIT = "hw.gpu.memory.limit";
    exports.METRIC_HW_GPU_MEMORY_USAGE = "hw.gpu.memory.usage";
    exports.METRIC_HW_GPU_MEMORY_UTILIZATION = "hw.gpu.memory.utilization";
    exports.METRIC_HW_GPU_UTILIZATION = "hw.gpu.utilization";
    exports.METRIC_HW_HOST_AMBIENT_TEMPERATURE = "hw.host.ambient_temperature";
    exports.METRIC_HW_HOST_ENERGY = "hw.host.energy";
    exports.METRIC_HW_HOST_HEATING_MARGIN = "hw.host.heating_margin";
    exports.METRIC_HW_HOST_POWER = "hw.host.power";
    exports.METRIC_HW_LOGICAL_DISK_LIMIT = "hw.logical_disk.limit";
    exports.METRIC_HW_LOGICAL_DISK_USAGE = "hw.logical_disk.usage";
    exports.METRIC_HW_LOGICAL_DISK_UTILIZATION = "hw.logical_disk.utilization";
    exports.METRIC_HW_MEMORY_SIZE = "hw.memory.size";
    exports.METRIC_HW_NETWORK_BANDWIDTH_LIMIT = "hw.network.bandwidth.limit";
    exports.METRIC_HW_NETWORK_BANDWIDTH_UTILIZATION = "hw.network.bandwidth.utilization";
    exports.METRIC_HW_NETWORK_IO = "hw.network.io";
    exports.METRIC_HW_NETWORK_PACKETS = "hw.network.packets";
    exports.METRIC_HW_NETWORK_UP = "hw.network.up";
    exports.METRIC_HW_PHYSICAL_DISK_ENDURANCE_UTILIZATION = "hw.physical_disk.endurance_utilization";
    exports.METRIC_HW_PHYSICAL_DISK_SIZE = "hw.physical_disk.size";
    exports.METRIC_HW_PHYSICAL_DISK_SMART = "hw.physical_disk.smart";
    exports.METRIC_HW_POWER = "hw.power";
    exports.METRIC_HW_POWER_SUPPLY_LIMIT = "hw.power_supply.limit";
    exports.METRIC_HW_POWER_SUPPLY_USAGE = "hw.power_supply.usage";
    exports.METRIC_HW_POWER_SUPPLY_UTILIZATION = "hw.power_supply.utilization";
    exports.METRIC_HW_STATUS = "hw.status";
    exports.METRIC_HW_TAPE_DRIVE_OPERATIONS = "hw.tape_drive.operations";
    exports.METRIC_HW_TEMPERATURE = "hw.temperature";
    exports.METRIC_HW_TEMPERATURE_LIMIT = "hw.temperature.limit";
    exports.METRIC_HW_VOLTAGE = "hw.voltage";
    exports.METRIC_HW_VOLTAGE_LIMIT = "hw.voltage.limit";
    exports.METRIC_HW_VOLTAGE_NOMINAL = "hw.voltage.nominal";
    exports.METRIC_JVM_BUFFER_COUNT = "jvm.buffer.count";
    exports.METRIC_JVM_BUFFER_MEMORY_LIMIT = "jvm.buffer.memory.limit";
    exports.METRIC_JVM_BUFFER_MEMORY_USAGE = "jvm.buffer.memory.usage";
    exports.METRIC_JVM_BUFFER_MEMORY_USED = "jvm.buffer.memory.used";
    exports.METRIC_JVM_FILE_DESCRIPTOR_COUNT = "jvm.file_descriptor.count";
    exports.METRIC_JVM_MEMORY_INIT = "jvm.memory.init";
    exports.METRIC_JVM_SYSTEM_CPU_LOAD_1M = "jvm.system.cpu.load_1m";
    exports.METRIC_JVM_SYSTEM_CPU_UTILIZATION = "jvm.system.cpu.utilization";
    exports.METRIC_K8S_CONTAINER_CPU_LIMIT = "k8s.container.cpu.limit";
    exports.METRIC_K8S_CONTAINER_CPU_LIMIT_UTILIZATION = "k8s.container.cpu.limit_utilization";
    exports.METRIC_K8S_CONTAINER_CPU_REQUEST = "k8s.container.cpu.request";
    exports.METRIC_K8S_CONTAINER_CPU_REQUEST_UTILIZATION = "k8s.container.cpu.request_utilization";
    exports.METRIC_K8S_CONTAINER_EPHEMERAL_STORAGE_LIMIT = "k8s.container.ephemeral_storage.limit";
    exports.METRIC_K8S_CONTAINER_EPHEMERAL_STORAGE_REQUEST = "k8s.container.ephemeral_storage.request";
    exports.METRIC_K8S_CONTAINER_MEMORY_LIMIT = "k8s.container.memory.limit";
    exports.METRIC_K8S_CONTAINER_MEMORY_REQUEST = "k8s.container.memory.request";
    exports.METRIC_K8S_CONTAINER_READY = "k8s.container.ready";
    exports.METRIC_K8S_CONTAINER_RESTART_COUNT = "k8s.container.restart.count";
    exports.METRIC_K8S_CONTAINER_STATUS_REASON = "k8s.container.status.reason";
    exports.METRIC_K8S_CONTAINER_STATUS_STATE = "k8s.container.status.state";
    exports.METRIC_K8S_CONTAINER_STORAGE_LIMIT = "k8s.container.storage.limit";
    exports.METRIC_K8S_CONTAINER_STORAGE_REQUEST = "k8s.container.storage.request";
    exports.METRIC_K8S_CRONJOB_ACTIVE_JOBS = "k8s.cronjob.active_jobs";
    exports.METRIC_K8S_CRONJOB_JOB_ACTIVE = "k8s.cronjob.job.active";
    exports.METRIC_K8S_DAEMONSET_CURRENT_SCHEDULED_NODES = "k8s.daemonset.current_scheduled_nodes";
    exports.METRIC_K8S_DAEMONSET_DESIRED_SCHEDULED_NODES = "k8s.daemonset.desired_scheduled_nodes";
    exports.METRIC_K8S_DAEMONSET_MISSCHEDULED_NODES = "k8s.daemonset.misscheduled_nodes";
    exports.METRIC_K8S_DAEMONSET_NODE_CURRENT_SCHEDULED = "k8s.daemonset.node.current_scheduled";
    exports.METRIC_K8S_DAEMONSET_NODE_DESIRED_SCHEDULED = "k8s.daemonset.node.desired_scheduled";
    exports.METRIC_K8S_DAEMONSET_NODE_MISSCHEDULED = "k8s.daemonset.node.misscheduled";
    exports.METRIC_K8S_DAEMONSET_NODE_READY = "k8s.daemonset.node.ready";
    exports.METRIC_K8S_DAEMONSET_READY_NODES = "k8s.daemonset.ready_nodes";
    exports.METRIC_K8S_DEPLOYMENT_AVAILABLE_PODS = "k8s.deployment.available_pods";
    exports.METRIC_K8S_DEPLOYMENT_DESIRED_PODS = "k8s.deployment.desired_pods";
    exports.METRIC_K8S_DEPLOYMENT_POD_AVAILABLE = "k8s.deployment.pod.available";
    exports.METRIC_K8S_DEPLOYMENT_POD_DESIRED = "k8s.deployment.pod.desired";
    exports.METRIC_K8S_HPA_CURRENT_PODS = "k8s.hpa.current_pods";
    exports.METRIC_K8S_HPA_DESIRED_PODS = "k8s.hpa.desired_pods";
    exports.METRIC_K8S_HPA_MAX_PODS = "k8s.hpa.max_pods";
    exports.METRIC_K8S_HPA_METRIC_TARGET_CPU_AVERAGE_UTILIZATION = "k8s.hpa.metric.target.cpu.average_utilization";
    exports.METRIC_K8S_HPA_METRIC_TARGET_CPU_AVERAGE_VALUE = "k8s.hpa.metric.target.cpu.average_value";
    exports.METRIC_K8S_HPA_METRIC_TARGET_CPU_VALUE = "k8s.hpa.metric.target.cpu.value";
    exports.METRIC_K8S_HPA_MIN_PODS = "k8s.hpa.min_pods";
    exports.METRIC_K8S_HPA_POD_CURRENT = "k8s.hpa.pod.current";
    exports.METRIC_K8S_HPA_POD_DESIRED = "k8s.hpa.pod.desired";
    exports.METRIC_K8S_HPA_POD_MAX = "k8s.hpa.pod.max";
    exports.METRIC_K8S_HPA_POD_MIN = "k8s.hpa.pod.min";
    exports.METRIC_K8S_JOB_ACTIVE_PODS = "k8s.job.active_pods";
    exports.METRIC_K8S_JOB_DESIRED_SUCCESSFUL_PODS = "k8s.job.desired_successful_pods";
    exports.METRIC_K8S_JOB_FAILED_PODS = "k8s.job.failed_pods";
    exports.METRIC_K8S_JOB_MAX_PARALLEL_PODS = "k8s.job.max_parallel_pods";
    exports.METRIC_K8S_JOB_POD_ACTIVE = "k8s.job.pod.active";
    exports.METRIC_K8S_JOB_POD_DESIRED_SUCCESSFUL = "k8s.job.pod.desired_successful";
    exports.METRIC_K8S_JOB_POD_FAILED = "k8s.job.pod.failed";
    exports.METRIC_K8S_JOB_POD_MAX_PARALLEL = "k8s.job.pod.max_parallel";
    exports.METRIC_K8S_JOB_POD_SUCCESSFUL = "k8s.job.pod.successful";
    exports.METRIC_K8S_JOB_SUCCESSFUL_PODS = "k8s.job.successful_pods";
    exports.METRIC_K8S_NAMESPACE_PHASE = "k8s.namespace.phase";
    exports.METRIC_K8S_NODE_ALLOCATABLE_CPU = "k8s.node.allocatable.cpu";
    exports.METRIC_K8S_NODE_ALLOCATABLE_EPHEMERAL_STORAGE = "k8s.node.allocatable.ephemeral_storage";
    exports.METRIC_K8S_NODE_ALLOCATABLE_MEMORY = "k8s.node.allocatable.memory";
    exports.METRIC_K8S_NODE_ALLOCATABLE_PODS = "k8s.node.allocatable.pods";
    exports.METRIC_K8S_NODE_CONDITION_STATUS = "k8s.node.condition.status";
    exports.METRIC_K8S_NODE_CPU_ALLOCATABLE = "k8s.node.cpu.allocatable";
    exports.METRIC_K8S_NODE_CPU_TIME = "k8s.node.cpu.time";
    exports.METRIC_K8S_NODE_CPU_USAGE = "k8s.node.cpu.usage";
    exports.METRIC_K8S_NODE_EPHEMERAL_STORAGE_ALLOCATABLE = "k8s.node.ephemeral_storage.allocatable";
    exports.METRIC_K8S_NODE_FILESYSTEM_AVAILABLE = "k8s.node.filesystem.available";
    exports.METRIC_K8S_NODE_FILESYSTEM_CAPACITY = "k8s.node.filesystem.capacity";
    exports.METRIC_K8S_NODE_FILESYSTEM_USAGE = "k8s.node.filesystem.usage";
    exports.METRIC_K8S_NODE_MEMORY_ALLOCATABLE = "k8s.node.memory.allocatable";
    exports.METRIC_K8S_NODE_MEMORY_AVAILABLE = "k8s.node.memory.available";
    exports.METRIC_K8S_NODE_MEMORY_PAGING_FAULTS = "k8s.node.memory.paging.faults";
    exports.METRIC_K8S_NODE_MEMORY_RSS = "k8s.node.memory.rss";
    exports.METRIC_K8S_NODE_MEMORY_USAGE = "k8s.node.memory.usage";
    exports.METRIC_K8S_NODE_MEMORY_WORKING_SET = "k8s.node.memory.working_set";
    exports.METRIC_K8S_NODE_NETWORK_ERRORS = "k8s.node.network.errors";
    exports.METRIC_K8S_NODE_NETWORK_IO = "k8s.node.network.io";
    exports.METRIC_K8S_NODE_POD_ALLOCATABLE = "k8s.node.pod.allocatable";
    exports.METRIC_K8S_NODE_UPTIME = "k8s.node.uptime";
    exports.METRIC_K8S_POD_CPU_TIME = "k8s.pod.cpu.time";
    exports.METRIC_K8S_POD_CPU_USAGE = "k8s.pod.cpu.usage";
    exports.METRIC_K8S_POD_FILESYSTEM_AVAILABLE = "k8s.pod.filesystem.available";
    exports.METRIC_K8S_POD_FILESYSTEM_CAPACITY = "k8s.pod.filesystem.capacity";
    exports.METRIC_K8S_POD_FILESYSTEM_USAGE = "k8s.pod.filesystem.usage";
    exports.METRIC_K8S_POD_MEMORY_AVAILABLE = "k8s.pod.memory.available";
    exports.METRIC_K8S_POD_MEMORY_PAGING_FAULTS = "k8s.pod.memory.paging.faults";
    exports.METRIC_K8S_POD_MEMORY_RSS = "k8s.pod.memory.rss";
    exports.METRIC_K8S_POD_MEMORY_USAGE = "k8s.pod.memory.usage";
    exports.METRIC_K8S_POD_MEMORY_WORKING_SET = "k8s.pod.memory.working_set";
    exports.METRIC_K8S_POD_NETWORK_ERRORS = "k8s.pod.network.errors";
    exports.METRIC_K8S_POD_NETWORK_IO = "k8s.pod.network.io";
    exports.METRIC_K8S_POD_STATUS_PHASE = "k8s.pod.status.phase";
    exports.METRIC_K8S_POD_STATUS_REASON = "k8s.pod.status.reason";
    exports.METRIC_K8S_POD_UPTIME = "k8s.pod.uptime";
    exports.METRIC_K8S_POD_VOLUME_AVAILABLE = "k8s.pod.volume.available";
    exports.METRIC_K8S_POD_VOLUME_CAPACITY = "k8s.pod.volume.capacity";
    exports.METRIC_K8S_POD_VOLUME_INODE_COUNT = "k8s.pod.volume.inode.count";
    exports.METRIC_K8S_POD_VOLUME_INODE_FREE = "k8s.pod.volume.inode.free";
    exports.METRIC_K8S_POD_VOLUME_INODE_USED = "k8s.pod.volume.inode.used";
    exports.METRIC_K8S_POD_VOLUME_USAGE = "k8s.pod.volume.usage";
    exports.METRIC_K8S_REPLICASET_AVAILABLE_PODS = "k8s.replicaset.available_pods";
    exports.METRIC_K8S_REPLICASET_DESIRED_PODS = "k8s.replicaset.desired_pods";
    exports.METRIC_K8S_REPLICASET_POD_AVAILABLE = "k8s.replicaset.pod.available";
    exports.METRIC_K8S_REPLICASET_POD_DESIRED = "k8s.replicaset.pod.desired";
    exports.METRIC_K8S_REPLICATION_CONTROLLER_AVAILABLE_PODS = "k8s.replication_controller.available_pods";
    exports.METRIC_K8S_REPLICATION_CONTROLLER_DESIRED_PODS = "k8s.replication_controller.desired_pods";
    exports.METRIC_K8S_REPLICATIONCONTROLLER_AVAILABLE_PODS = "k8s.replicationcontroller.available_pods";
    exports.METRIC_K8S_REPLICATIONCONTROLLER_DESIRED_PODS = "k8s.replicationcontroller.desired_pods";
    exports.METRIC_K8S_REPLICATIONCONTROLLER_POD_AVAILABLE = "k8s.replicationcontroller.pod.available";
    exports.METRIC_K8S_REPLICATIONCONTROLLER_POD_DESIRED = "k8s.replicationcontroller.pod.desired";
    exports.METRIC_K8S_RESOURCEQUOTA_CPU_LIMIT_HARD = "k8s.resourcequota.cpu.limit.hard";
    exports.METRIC_K8S_RESOURCEQUOTA_CPU_LIMIT_USED = "k8s.resourcequota.cpu.limit.used";
    exports.METRIC_K8S_RESOURCEQUOTA_CPU_REQUEST_HARD = "k8s.resourcequota.cpu.request.hard";
    exports.METRIC_K8S_RESOURCEQUOTA_CPU_REQUEST_USED = "k8s.resourcequota.cpu.request.used";
    exports.METRIC_K8S_RESOURCEQUOTA_EPHEMERAL_STORAGE_LIMIT_HARD = "k8s.resourcequota.ephemeral_storage.limit.hard";
    exports.METRIC_K8S_RESOURCEQUOTA_EPHEMERAL_STORAGE_LIMIT_USED = "k8s.resourcequota.ephemeral_storage.limit.used";
    exports.METRIC_K8S_RESOURCEQUOTA_EPHEMERAL_STORAGE_REQUEST_HARD = "k8s.resourcequota.ephemeral_storage.request.hard";
    exports.METRIC_K8S_RESOURCEQUOTA_EPHEMERAL_STORAGE_REQUEST_USED = "k8s.resourcequota.ephemeral_storage.request.used";
    exports.METRIC_K8S_RESOURCEQUOTA_HUGEPAGE_COUNT_REQUEST_HARD = "k8s.resourcequota.hugepage_count.request.hard";
    exports.METRIC_K8S_RESOURCEQUOTA_HUGEPAGE_COUNT_REQUEST_USED = "k8s.resourcequota.hugepage_count.request.used";
    exports.METRIC_K8S_RESOURCEQUOTA_MEMORY_LIMIT_HARD = "k8s.resourcequota.memory.limit.hard";
    exports.METRIC_K8S_RESOURCEQUOTA_MEMORY_LIMIT_USED = "k8s.resourcequota.memory.limit.used";
    exports.METRIC_K8S_RESOURCEQUOTA_MEMORY_REQUEST_HARD = "k8s.resourcequota.memory.request.hard";
    exports.METRIC_K8S_RESOURCEQUOTA_MEMORY_REQUEST_USED = "k8s.resourcequota.memory.request.used";
    exports.METRIC_K8S_RESOURCEQUOTA_OBJECT_COUNT_HARD = "k8s.resourcequota.object_count.hard";
    exports.METRIC_K8S_RESOURCEQUOTA_OBJECT_COUNT_USED = "k8s.resourcequota.object_count.used";
    exports.METRIC_K8S_RESOURCEQUOTA_PERSISTENTVOLUMECLAIM_COUNT_HARD = "k8s.resourcequota.persistentvolumeclaim_count.hard";
    exports.METRIC_K8S_RESOURCEQUOTA_PERSISTENTVOLUMECLAIM_COUNT_USED = "k8s.resourcequota.persistentvolumeclaim_count.used";
    exports.METRIC_K8S_RESOURCEQUOTA_STORAGE_REQUEST_HARD = "k8s.resourcequota.storage.request.hard";
    exports.METRIC_K8S_RESOURCEQUOTA_STORAGE_REQUEST_USED = "k8s.resourcequota.storage.request.used";
    exports.METRIC_K8S_STATEFULSET_CURRENT_PODS = "k8s.statefulset.current_pods";
    exports.METRIC_K8S_STATEFULSET_DESIRED_PODS = "k8s.statefulset.desired_pods";
    exports.METRIC_K8S_STATEFULSET_POD_CURRENT = "k8s.statefulset.pod.current";
    exports.METRIC_K8S_STATEFULSET_POD_DESIRED = "k8s.statefulset.pod.desired";
    exports.METRIC_K8S_STATEFULSET_POD_READY = "k8s.statefulset.pod.ready";
    exports.METRIC_K8S_STATEFULSET_POD_UPDATED = "k8s.statefulset.pod.updated";
    exports.METRIC_K8S_STATEFULSET_READY_PODS = "k8s.statefulset.ready_pods";
    exports.METRIC_K8S_STATEFULSET_UPDATED_PODS = "k8s.statefulset.updated_pods";
    exports.METRIC_MESSAGING_CLIENT_CONSUMED_MESSAGES = "messaging.client.consumed.messages";
    exports.METRIC_MESSAGING_CLIENT_OPERATION_DURATION = "messaging.client.operation.duration";
    exports.METRIC_MESSAGING_CLIENT_PUBLISHED_MESSAGES = "messaging.client.published.messages";
    exports.METRIC_MESSAGING_CLIENT_SENT_MESSAGES = "messaging.client.sent.messages";
    exports.METRIC_MESSAGING_PROCESS_DURATION = "messaging.process.duration";
    exports.METRIC_MESSAGING_PROCESS_MESSAGES = "messaging.process.messages";
    exports.METRIC_MESSAGING_PUBLISH_DURATION = "messaging.publish.duration";
    exports.METRIC_MESSAGING_PUBLISH_MESSAGES = "messaging.publish.messages";
    exports.METRIC_MESSAGING_RECEIVE_DURATION = "messaging.receive.duration";
    exports.METRIC_MESSAGING_RECEIVE_MESSAGES = "messaging.receive.messages";
    exports.METRIC_NFS_CLIENT_NET_COUNT = "nfs.client.net.count";
    exports.METRIC_NFS_CLIENT_NET_TCP_CONNECTION_ACCEPTED = "nfs.client.net.tcp.connection.accepted";
    exports.METRIC_NFS_CLIENT_OPERATION_COUNT = "nfs.client.operation.count";
    exports.METRIC_NFS_CLIENT_PROCEDURE_COUNT = "nfs.client.procedure.count";
    exports.METRIC_NFS_CLIENT_RPC_AUTHREFRESH_COUNT = "nfs.client.rpc.authrefresh.count";
    exports.METRIC_NFS_CLIENT_RPC_COUNT = "nfs.client.rpc.count";
    exports.METRIC_NFS_CLIENT_RPC_RETRANSMIT_COUNT = "nfs.client.rpc.retransmit.count";
    exports.METRIC_NFS_SERVER_FH_STALE_COUNT = "nfs.server.fh.stale.count";
    exports.METRIC_NFS_SERVER_IO = "nfs.server.io";
    exports.METRIC_NFS_SERVER_NET_COUNT = "nfs.server.net.count";
    exports.METRIC_NFS_SERVER_NET_TCP_CONNECTION_ACCEPTED = "nfs.server.net.tcp.connection.accepted";
    exports.METRIC_NFS_SERVER_OPERATION_COUNT = "nfs.server.operation.count";
    exports.METRIC_NFS_SERVER_PROCEDURE_COUNT = "nfs.server.procedure.count";
    exports.METRIC_NFS_SERVER_REPCACHE_REQUESTS = "nfs.server.repcache.requests";
    exports.METRIC_NFS_SERVER_RPC_COUNT = "nfs.server.rpc.count";
    exports.METRIC_NFS_SERVER_THREAD_COUNT = "nfs.server.thread.count";
    exports.METRIC_NODEJS_EVENTLOOP_DELAY_MAX = "nodejs.eventloop.delay.max";
    exports.METRIC_NODEJS_EVENTLOOP_DELAY_MEAN = "nodejs.eventloop.delay.mean";
    exports.METRIC_NODEJS_EVENTLOOP_DELAY_MIN = "nodejs.eventloop.delay.min";
    exports.METRIC_NODEJS_EVENTLOOP_DELAY_P50 = "nodejs.eventloop.delay.p50";
    exports.METRIC_NODEJS_EVENTLOOP_DELAY_P90 = "nodejs.eventloop.delay.p90";
    exports.METRIC_NODEJS_EVENTLOOP_DELAY_P99 = "nodejs.eventloop.delay.p99";
    exports.METRIC_NODEJS_EVENTLOOP_DELAY_STDDEV = "nodejs.eventloop.delay.stddev";
    exports.METRIC_NODEJS_EVENTLOOP_TIME = "nodejs.eventloop.time";
    exports.METRIC_NODEJS_EVENTLOOP_UTILIZATION = "nodejs.eventloop.utilization";
    exports.METRIC_OPENSHIFT_CLUSTERQUOTA_CPU_LIMIT_HARD = "openshift.clusterquota.cpu.limit.hard";
    exports.METRIC_OPENSHIFT_CLUSTERQUOTA_CPU_LIMIT_USED = "openshift.clusterquota.cpu.limit.used";
    exports.METRIC_OPENSHIFT_CLUSTERQUOTA_CPU_REQUEST_HARD = "openshift.clusterquota.cpu.request.hard";
    exports.METRIC_OPENSHIFT_CLUSTERQUOTA_CPU_REQUEST_USED = "openshift.clusterquota.cpu.request.used";
    exports.METRIC_OPENSHIFT_CLUSTERQUOTA_EPHEMERAL_STORAGE_LIMIT_HARD = "openshift.clusterquota.ephemeral_storage.limit.hard";
    exports.METRIC_OPENSHIFT_CLUSTERQUOTA_EPHEMERAL_STORAGE_LIMIT_USED = "openshift.clusterquota.ephemeral_storage.limit.used";
    exports.METRIC_OPENSHIFT_CLUSTERQUOTA_EPHEMERAL_STORAGE_REQUEST_HARD = "openshift.clusterquota.ephemeral_storage.request.hard";
    exports.METRIC_OPENSHIFT_CLUSTERQUOTA_EPHEMERAL_STORAGE_REQUEST_USED = "openshift.clusterquota.ephemeral_storage.request.used";
    exports.METRIC_OPENSHIFT_CLUSTERQUOTA_HUGEPAGE_COUNT_REQUEST_HARD = "openshift.clusterquota.hugepage_count.request.hard";
    exports.METRIC_OPENSHIFT_CLUSTERQUOTA_HUGEPAGE_COUNT_REQUEST_USED = "openshift.clusterquota.hugepage_count.request.used";
    exports.METRIC_OPENSHIFT_CLUSTERQUOTA_MEMORY_LIMIT_HARD = "openshift.clusterquota.memory.limit.hard";
    exports.METRIC_OPENSHIFT_CLUSTERQUOTA_MEMORY_LIMIT_USED = "openshift.clusterquota.memory.limit.used";
    exports.METRIC_OPENSHIFT_CLUSTERQUOTA_MEMORY_REQUEST_HARD = "openshift.clusterquota.memory.request.hard";
    exports.METRIC_OPENSHIFT_CLUSTERQUOTA_MEMORY_REQUEST_USED = "openshift.clusterquota.memory.request.used";
    exports.METRIC_OPENSHIFT_CLUSTERQUOTA_OBJECT_COUNT_HARD = "openshift.clusterquota.object_count.hard";
    exports.METRIC_OPENSHIFT_CLUSTERQUOTA_OBJECT_COUNT_USED = "openshift.clusterquota.object_count.used";
    exports.METRIC_OPENSHIFT_CLUSTERQUOTA_PERSISTENTVOLUMECLAIM_COUNT_HARD = "openshift.clusterquota.persistentvolumeclaim_count.hard";
    exports.METRIC_OPENSHIFT_CLUSTERQUOTA_PERSISTENTVOLUMECLAIM_COUNT_USED = "openshift.clusterquota.persistentvolumeclaim_count.used";
    exports.METRIC_OPENSHIFT_CLUSTERQUOTA_STORAGE_REQUEST_HARD = "openshift.clusterquota.storage.request.hard";
    exports.METRIC_OPENSHIFT_CLUSTERQUOTA_STORAGE_REQUEST_USED = "openshift.clusterquota.storage.request.used";
    exports.METRIC_OTEL_SDK_EXPORTER_LOG_EXPORTED = "otel.sdk.exporter.log.exported";
    exports.METRIC_OTEL_SDK_EXPORTER_LOG_INFLIGHT = "otel.sdk.exporter.log.inflight";
    exports.METRIC_OTEL_SDK_EXPORTER_METRIC_DATA_POINT_EXPORTED = "otel.sdk.exporter.metric_data_point.exported";
    exports.METRIC_OTEL_SDK_EXPORTER_METRIC_DATA_POINT_INFLIGHT = "otel.sdk.exporter.metric_data_point.inflight";
    exports.METRIC_OTEL_SDK_EXPORTER_OPERATION_DURATION = "otel.sdk.exporter.operation.duration";
    exports.METRIC_OTEL_SDK_EXPORTER_SPAN_EXPORTED = "otel.sdk.exporter.span.exported";
    exports.METRIC_OTEL_SDK_EXPORTER_SPAN_EXPORTED_COUNT = "otel.sdk.exporter.span.exported.count";
    exports.METRIC_OTEL_SDK_EXPORTER_SPAN_INFLIGHT = "otel.sdk.exporter.span.inflight";
    exports.METRIC_OTEL_SDK_EXPORTER_SPAN_INFLIGHT_COUNT = "otel.sdk.exporter.span.inflight.count";
    exports.METRIC_OTEL_SDK_LOG_CREATED = "otel.sdk.log.created";
    exports.METRIC_OTEL_SDK_METRIC_READER_COLLECTION_DURATION = "otel.sdk.metric_reader.collection.duration";
    exports.METRIC_OTEL_SDK_PROCESSOR_LOG_PROCESSED = "otel.sdk.processor.log.processed";
    exports.METRIC_OTEL_SDK_PROCESSOR_LOG_QUEUE_CAPACITY = "otel.sdk.processor.log.queue.capacity";
    exports.METRIC_OTEL_SDK_PROCESSOR_LOG_QUEUE_SIZE = "otel.sdk.processor.log.queue.size";
    exports.METRIC_OTEL_SDK_PROCESSOR_SPAN_PROCESSED = "otel.sdk.processor.span.processed";
    exports.METRIC_OTEL_SDK_PROCESSOR_SPAN_PROCESSED_COUNT = "otel.sdk.processor.span.processed.count";
    exports.METRIC_OTEL_SDK_PROCESSOR_SPAN_QUEUE_CAPACITY = "otel.sdk.processor.span.queue.capacity";
    exports.METRIC_OTEL_SDK_PROCESSOR_SPAN_QUEUE_SIZE = "otel.sdk.processor.span.queue.size";
    exports.METRIC_OTEL_SDK_SPAN_ENDED = "otel.sdk.span.ended";
    exports.METRIC_OTEL_SDK_SPAN_ENDED_COUNT = "otel.sdk.span.ended.count";
    exports.METRIC_OTEL_SDK_SPAN_LIVE = "otel.sdk.span.live";
    exports.METRIC_OTEL_SDK_SPAN_LIVE_COUNT = "otel.sdk.span.live.count";
    exports.METRIC_OTEL_SDK_SPAN_STARTED = "otel.sdk.span.started";
    exports.METRIC_PROCESS_CONTEXT_SWITCHES = "process.context_switches";
    exports.METRIC_PROCESS_CPU_TIME = "process.cpu.time";
    exports.METRIC_PROCESS_CPU_UTILIZATION = "process.cpu.utilization";
    exports.METRIC_PROCESS_DISK_IO = "process.disk.io";
    exports.METRIC_PROCESS_MEMORY_USAGE = "process.memory.usage";
    exports.METRIC_PROCESS_MEMORY_VIRTUAL = "process.memory.virtual";
    exports.METRIC_PROCESS_NETWORK_IO = "process.network.io";
    exports.METRIC_PROCESS_OPEN_FILE_DESCRIPTOR_COUNT = "process.open_file_descriptor.count";
    exports.METRIC_PROCESS_PAGING_FAULTS = "process.paging.faults";
    exports.METRIC_PROCESS_THREAD_COUNT = "process.thread.count";
    exports.METRIC_PROCESS_UPTIME = "process.uptime";
    exports.METRIC_RPC_CLIENT_DURATION = "rpc.client.duration";
    exports.METRIC_RPC_CLIENT_REQUEST_SIZE = "rpc.client.request.size";
    exports.METRIC_RPC_CLIENT_REQUESTS_PER_RPC = "rpc.client.requests_per_rpc";
    exports.METRIC_RPC_CLIENT_RESPONSE_SIZE = "rpc.client.response.size";
    exports.METRIC_RPC_CLIENT_RESPONSES_PER_RPC = "rpc.client.responses_per_rpc";
    exports.METRIC_RPC_SERVER_DURATION = "rpc.server.duration";
    exports.METRIC_RPC_SERVER_REQUEST_SIZE = "rpc.server.request.size";
    exports.METRIC_RPC_SERVER_REQUESTS_PER_RPC = "rpc.server.requests_per_rpc";
    exports.METRIC_RPC_SERVER_RESPONSE_SIZE = "rpc.server.response.size";
    exports.METRIC_RPC_SERVER_RESPONSES_PER_RPC = "rpc.server.responses_per_rpc";
    exports.METRIC_SYSTEM_CPU_FREQUENCY = "system.cpu.frequency";
    exports.METRIC_SYSTEM_CPU_LOGICAL_COUNT = "system.cpu.logical.count";
    exports.METRIC_SYSTEM_CPU_PHYSICAL_COUNT = "system.cpu.physical.count";
    exports.METRIC_SYSTEM_CPU_TIME = "system.cpu.time";
    exports.METRIC_SYSTEM_CPU_UTILIZATION = "system.cpu.utilization";
    exports.METRIC_SYSTEM_DISK_IO = "system.disk.io";
    exports.METRIC_SYSTEM_DISK_IO_TIME = "system.disk.io_time";
    exports.METRIC_SYSTEM_DISK_LIMIT = "system.disk.limit";
    exports.METRIC_SYSTEM_DISK_MERGED = "system.disk.merged";
    exports.METRIC_SYSTEM_DISK_OPERATION_TIME = "system.disk.operation_time";
    exports.METRIC_SYSTEM_DISK_OPERATIONS = "system.disk.operations";
    exports.METRIC_SYSTEM_FILESYSTEM_LIMIT = "system.filesystem.limit";
    exports.METRIC_SYSTEM_FILESYSTEM_USAGE = "system.filesystem.usage";
    exports.METRIC_SYSTEM_FILESYSTEM_UTILIZATION = "system.filesystem.utilization";
    exports.METRIC_SYSTEM_LINUX_MEMORY_AVAILABLE = "system.linux.memory.available";
    exports.METRIC_SYSTEM_LINUX_MEMORY_SLAB_USAGE = "system.linux.memory.slab.usage";
    exports.METRIC_SYSTEM_MEMORY_LIMIT = "system.memory.limit";
    exports.METRIC_SYSTEM_MEMORY_SHARED = "system.memory.shared";
    exports.METRIC_SYSTEM_MEMORY_USAGE = "system.memory.usage";
    exports.METRIC_SYSTEM_MEMORY_UTILIZATION = "system.memory.utilization";
    exports.METRIC_SYSTEM_NETWORK_CONNECTION_COUNT = "system.network.connection.count";
    exports.METRIC_SYSTEM_NETWORK_CONNECTIONS = "system.network.connections";
    exports.METRIC_SYSTEM_NETWORK_DROPPED = "system.network.dropped";
    exports.METRIC_SYSTEM_NETWORK_ERRORS = "system.network.errors";
    exports.METRIC_SYSTEM_NETWORK_IO = "system.network.io";
    exports.METRIC_SYSTEM_NETWORK_PACKET_COUNT = "system.network.packet.count";
    exports.METRIC_SYSTEM_NETWORK_PACKET_DROPPED = "system.network.packet.dropped";
    exports.METRIC_SYSTEM_NETWORK_PACKETS = "system.network.packets";
    exports.METRIC_SYSTEM_PAGING_FAULTS = "system.paging.faults";
    exports.METRIC_SYSTEM_PAGING_OPERATIONS = "system.paging.operations";
    exports.METRIC_SYSTEM_PAGING_USAGE = "system.paging.usage";
    exports.METRIC_SYSTEM_PAGING_UTILIZATION = "system.paging.utilization";
    exports.METRIC_SYSTEM_PROCESS_COUNT = "system.process.count";
    exports.METRIC_SYSTEM_PROCESS_CREATED = "system.process.created";
    exports.METRIC_SYSTEM_UPTIME = "system.uptime";
    exports.METRIC_V8JS_GC_DURATION = "v8js.gc.duration";
    exports.METRIC_V8JS_HEAP_SPACE_AVAILABLE_SIZE = "v8js.heap.space.available_size";
    exports.METRIC_V8JS_HEAP_SPACE_PHYSICAL_SIZE = "v8js.heap.space.physical_size";
    exports.METRIC_V8JS_MEMORY_HEAP_LIMIT = "v8js.memory.heap.limit";
    exports.METRIC_V8JS_MEMORY_HEAP_SPACE_AVAILABLE_SIZE = "v8js.memory.heap.space.available_size";
    exports.METRIC_V8JS_MEMORY_HEAP_SPACE_PHYSICAL_SIZE = "v8js.memory.heap.space.physical_size";
    exports.METRIC_V8JS_MEMORY_HEAP_USED = "v8js.memory.heap.used";
    exports.METRIC_VCS_CHANGE_COUNT = "vcs.change.count";
    exports.METRIC_VCS_CHANGE_DURATION = "vcs.change.duration";
    exports.METRIC_VCS_CHANGE_TIME_TO_APPROVAL = "vcs.change.time_to_approval";
    exports.METRIC_VCS_CHANGE_TIME_TO_MERGE = "vcs.change.time_to_merge";
    exports.METRIC_VCS_CONTRIBUTOR_COUNT = "vcs.contributor.count";
    exports.METRIC_VCS_REF_COUNT = "vcs.ref.count";
    exports.METRIC_VCS_REF_LINES_DELTA = "vcs.ref.lines_delta";
    exports.METRIC_VCS_REF_REVISIONS_DELTA = "vcs.ref.revisions_delta";
    exports.METRIC_VCS_REF_TIME = "vcs.ref.time";
    exports.METRIC_VCS_REPOSITORY_COUNT = "vcs.repository.count";
  }
});

// node_modules/@opentelemetry/semantic-conventions/build/src/experimental_events.js
var require_experimental_events = __commonJS({
  "node_modules/@opentelemetry/semantic-conventions/build/src/experimental_events.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EVENT_SESSION_START = exports.EVENT_SESSION_END = exports.EVENT_RPC_MESSAGE = exports.EVENT_GEN_AI_USER_MESSAGE = exports.EVENT_GEN_AI_TOOL_MESSAGE = exports.EVENT_GEN_AI_SYSTEM_MESSAGE = exports.EVENT_GEN_AI_EVALUATION_RESULT = exports.EVENT_GEN_AI_CLIENT_INFERENCE_OPERATION_DETAILS = exports.EVENT_GEN_AI_CHOICE = exports.EVENT_GEN_AI_ASSISTANT_MESSAGE = exports.EVENT_FEATURE_FLAG_EVALUATION = exports.EVENT_DEVICE_APP_LIFECYCLE = exports.EVENT_BROWSER_WEB_VITAL = exports.EVENT_AZURE_RESOURCE_LOG = exports.EVENT_AZ_RESOURCE_LOG = exports.EVENT_APP_WIDGET_CLICK = exports.EVENT_APP_SCREEN_CLICK = exports.EVENT_APP_JANK = void 0;
    exports.EVENT_APP_JANK = "app.jank";
    exports.EVENT_APP_SCREEN_CLICK = "app.screen.click";
    exports.EVENT_APP_WIDGET_CLICK = "app.widget.click";
    exports.EVENT_AZ_RESOURCE_LOG = "az.resource.log";
    exports.EVENT_AZURE_RESOURCE_LOG = "azure.resource.log";
    exports.EVENT_BROWSER_WEB_VITAL = "browser.web_vital";
    exports.EVENT_DEVICE_APP_LIFECYCLE = "device.app.lifecycle";
    exports.EVENT_FEATURE_FLAG_EVALUATION = "feature_flag.evaluation";
    exports.EVENT_GEN_AI_ASSISTANT_MESSAGE = "gen_ai.assistant.message";
    exports.EVENT_GEN_AI_CHOICE = "gen_ai.choice";
    exports.EVENT_GEN_AI_CLIENT_INFERENCE_OPERATION_DETAILS = "gen_ai.client.inference.operation.details";
    exports.EVENT_GEN_AI_EVALUATION_RESULT = "gen_ai.evaluation.result";
    exports.EVENT_GEN_AI_SYSTEM_MESSAGE = "gen_ai.system.message";
    exports.EVENT_GEN_AI_TOOL_MESSAGE = "gen_ai.tool.message";
    exports.EVENT_GEN_AI_USER_MESSAGE = "gen_ai.user.message";
    exports.EVENT_RPC_MESSAGE = "rpc.message";
    exports.EVENT_SESSION_END = "session.end";
    exports.EVENT_SESSION_START = "session.start";
  }
});

// node_modules/@opentelemetry/semantic-conventions/build/src/index-incubating.js
var require_index_incubating = __commonJS({
  "node_modules/@opentelemetry/semantic-conventions/build/src/index-incubating.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: /* @__PURE__ */ __name(function() {
          return m[k];
        }, "get") };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_stable_attributes(), exports);
    __exportStar(require_stable_metrics(), exports);
    __exportStar(require_stable_events(), exports);
    __exportStar(require_experimental_attributes(), exports);
    __exportStar(require_experimental_metrics(), exports);
    __exportStar(require_experimental_events(), exports);
  }
});

// node_modules/joi/dist/joi-browser.min.js
var require_joi_browser_min = __commonJS({
  "node_modules/joi/dist/joi-browser.min.js"(exports, module) {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    !function(e2, t) {
      "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.joi = t() : e2.joi = t();
    }(self, () => {
      return e2 = { 7629: (e3, t2, r) => {
        "use strict";
        const s = r(375), n = r(8571), a = r(9474), i = r(1687), o = r(8652), l = r(8160), c = r(3292), u = r(6354), f = r(8901), m = r(9708), h = r(6914), d = r(2294), p = r(6133), g = r(1152), y = r(8863), b = r(2036), v = { Base: class {
          static {
            __name(this, "Base");
          }
          constructor(e4) {
            this.type = e4, this.$_root = null, this._definition = {}, this._reset();
          }
          _reset() {
            this._ids = new d.Ids(), this._preferences = null, this._refs = new p.Manager(), this._cache = null, this._valids = null, this._invalids = null, this._flags = {}, this._rules = [], this._singleRules = /* @__PURE__ */ new Map(), this.$_terms = {}, this.$_temp = { ruleset: null, whens: {} };
          }
          describe() {
            return s("function" == typeof m.describe, "Manifest functionality disabled"), m.describe(this);
          }
          allow(...e4) {
            return l.verifyFlat(e4, "allow"), this._values(e4, "_valids");
          }
          alter(e4) {
            s(e4 && "object" == typeof e4 && !Array.isArray(e4), "Invalid targets argument"), s(!this._inRuleset(), "Cannot set alterations inside a ruleset");
            const t3 = this.clone();
            t3.$_terms.alterations = t3.$_terms.alterations || [];
            for (const r2 in e4) {
              const n2 = e4[r2];
              s("function" == typeof n2, "Alteration adjuster for", r2, "must be a function"), t3.$_terms.alterations.push({ target: r2, adjuster: n2 });
            }
            return t3.$_temp.ruleset = false, t3;
          }
          artifact(e4) {
            return s(void 0 !== e4, "Artifact cannot be undefined"), s(!this._cache, "Cannot set an artifact with a rule cache"), this.$_setFlag("artifact", e4);
          }
          cast(e4) {
            return s(false === e4 || "string" == typeof e4, "Invalid to value"), s(false === e4 || this._definition.cast[e4], "Type", this.type, "does not support casting to", e4), this.$_setFlag("cast", false === e4 ? void 0 : e4);
          }
          default(e4, t3) {
            return this._default("default", e4, t3);
          }
          description(e4) {
            return s(e4 && "string" == typeof e4, "Description must be a non-empty string"), this.$_setFlag("description", e4);
          }
          empty(e4) {
            const t3 = this.clone();
            return void 0 !== e4 && (e4 = t3.$_compile(e4, { override: false })), t3.$_setFlag("empty", e4, { clone: false });
          }
          error(e4) {
            return s(e4, "Missing error"), s(e4 instanceof Error || "function" == typeof e4, "Must provide a valid Error object or a function"), this.$_setFlag("error", e4);
          }
          example(e4, t3 = {}) {
            return s(void 0 !== e4, "Missing example"), l.assertOptions(t3, ["override"]), this._inner("examples", e4, { single: true, override: t3.override });
          }
          external(e4, t3) {
            return "object" == typeof e4 && (s(!t3, "Cannot combine options with description"), t3 = e4.description, e4 = e4.method), s("function" == typeof e4, "Method must be a function"), s(void 0 === t3 || t3 && "string" == typeof t3, "Description must be a non-empty string"), this._inner("externals", { method: e4, description: t3 }, { single: true });
          }
          failover(e4, t3) {
            return this._default("failover", e4, t3);
          }
          forbidden() {
            return this.presence("forbidden");
          }
          id(e4) {
            return e4 ? (s("string" == typeof e4, "id must be a non-empty string"), s(/^[^\.]+$/.test(e4), "id cannot contain period character"), this.$_setFlag("id", e4)) : this.$_setFlag("id", void 0);
          }
          invalid(...e4) {
            return this._values(e4, "_invalids");
          }
          label(e4) {
            return s(e4 && "string" == typeof e4, "Label name must be a non-empty string"), this.$_setFlag("label", e4);
          }
          meta(e4) {
            return s(void 0 !== e4, "Meta cannot be undefined"), this._inner("metas", e4, { single: true });
          }
          note(...e4) {
            s(e4.length, "Missing notes");
            for (const t3 of e4) s(t3 && "string" == typeof t3, "Notes must be non-empty strings");
            return this._inner("notes", e4);
          }
          only(e4 = true) {
            return s("boolean" == typeof e4, "Invalid mode:", e4), this.$_setFlag("only", e4);
          }
          optional() {
            return this.presence("optional");
          }
          prefs(e4) {
            s(e4, "Missing preferences"), s(void 0 === e4.context, "Cannot override context"), s(void 0 === e4.externals, "Cannot override externals"), s(void 0 === e4.warnings, "Cannot override warnings"), s(void 0 === e4.debug, "Cannot override debug"), l.checkPreferences(e4);
            const t3 = this.clone();
            return t3._preferences = l.preferences(t3._preferences, e4), t3;
          }
          presence(e4) {
            return s(["optional", "required", "forbidden"].includes(e4), "Unknown presence mode", e4), this.$_setFlag("presence", e4);
          }
          raw(e4 = true) {
            return this.$_setFlag("result", e4 ? "raw" : void 0);
          }
          result(e4) {
            return s(["raw", "strip"].includes(e4), "Unknown result mode", e4), this.$_setFlag("result", e4);
          }
          required() {
            return this.presence("required");
          }
          strict(e4) {
            const t3 = this.clone(), r2 = void 0 !== e4 && !e4;
            return t3._preferences = l.preferences(t3._preferences, { convert: r2 }), t3;
          }
          strip(e4 = true) {
            return this.$_setFlag("result", e4 ? "strip" : void 0);
          }
          tag(...e4) {
            s(e4.length, "Missing tags");
            for (const t3 of e4) s(t3 && "string" == typeof t3, "Tags must be non-empty strings");
            return this._inner("tags", e4);
          }
          unit(e4) {
            return s(e4 && "string" == typeof e4, "Unit name must be a non-empty string"), this.$_setFlag("unit", e4);
          }
          valid(...e4) {
            l.verifyFlat(e4, "valid");
            const t3 = this.allow(...e4);
            return t3.$_setFlag("only", !!t3._valids, { clone: false }), t3;
          }
          when(e4, t3) {
            const r2 = this.clone();
            r2.$_terms.whens || (r2.$_terms.whens = []);
            const n2 = c.when(r2, e4, t3);
            if (!["any", "link"].includes(r2.type)) {
              const e5 = n2.is ? [n2] : n2.switch;
              for (const t4 of e5) s(!t4.then || "any" === t4.then.type || t4.then.type === r2.type, "Cannot combine", r2.type, "with", t4.then && t4.then.type), s(!t4.otherwise || "any" === t4.otherwise.type || t4.otherwise.type === r2.type, "Cannot combine", r2.type, "with", t4.otherwise && t4.otherwise.type);
            }
            return r2.$_terms.whens.push(n2), r2.$_mutateRebuild();
          }
          cache(e4) {
            s(!this._inRuleset(), "Cannot set caching inside a ruleset"), s(!this._cache, "Cannot override schema cache"), s(void 0 === this._flags.artifact, "Cannot cache a rule with an artifact");
            const t3 = this.clone();
            return t3._cache = e4 || o.provider.provision(), t3.$_temp.ruleset = false, t3;
          }
          clone() {
            const e4 = Object.create(Object.getPrototypeOf(this));
            return this._assign(e4);
          }
          concat(e4) {
            s(l.isSchema(e4), "Invalid schema object"), s("any" === this.type || "any" === e4.type || e4.type === this.type, "Cannot merge type", this.type, "with another type:", e4.type), s(!this._inRuleset(), "Cannot concatenate onto a schema with open ruleset"), s(!e4._inRuleset(), "Cannot concatenate a schema with open ruleset");
            let t3 = this.clone();
            if ("any" === this.type && "any" !== e4.type) {
              const r2 = e4.clone();
              for (const e5 of Object.keys(t3)) "type" !== e5 && (r2[e5] = t3[e5]);
              t3 = r2;
            }
            t3._ids.concat(e4._ids), t3._refs.register(e4, p.toSibling), t3._preferences = t3._preferences ? l.preferences(t3._preferences, e4._preferences) : e4._preferences, t3._valids = b.merge(t3._valids, e4._valids, e4._invalids), t3._invalids = b.merge(t3._invalids, e4._invalids, e4._valids);
            for (const r2 of e4._singleRules.keys()) t3._singleRules.has(r2) && (t3._rules = t3._rules.filter((e5) => e5.keep || e5.name !== r2), t3._singleRules.delete(r2));
            for (const r2 of e4._rules) e4._definition.rules[r2.method].multi || t3._singleRules.set(r2.name, r2), t3._rules.push(r2);
            if (t3._flags.empty && e4._flags.empty) {
              t3._flags.empty = t3._flags.empty.concat(e4._flags.empty);
              const r2 = Object.assign({}, e4._flags);
              delete r2.empty, i(t3._flags, r2);
            } else if (e4._flags.empty) {
              t3._flags.empty = e4._flags.empty;
              const r2 = Object.assign({}, e4._flags);
              delete r2.empty, i(t3._flags, r2);
            } else i(t3._flags, e4._flags);
            for (const r2 in e4.$_terms) {
              const s2 = e4.$_terms[r2];
              s2 ? t3.$_terms[r2] ? t3.$_terms[r2] = t3.$_terms[r2].concat(s2) : t3.$_terms[r2] = s2.slice() : t3.$_terms[r2] || (t3.$_terms[r2] = s2);
            }
            return this.$_root._tracer && this.$_root._tracer._combine(t3, [this, e4]), t3.$_mutateRebuild();
          }
          extend(e4) {
            return s(!e4.base, "Cannot extend type with another base"), f.type(this, e4);
          }
          extract(e4) {
            return e4 = Array.isArray(e4) ? e4 : e4.split("."), this._ids.reach(e4);
          }
          fork(e4, t3) {
            s(!this._inRuleset(), "Cannot fork inside a ruleset");
            let r2 = this;
            for (let s2 of [].concat(e4)) s2 = Array.isArray(s2) ? s2 : s2.split("."), r2 = r2._ids.fork(s2, t3, r2);
            return r2.$_temp.ruleset = false, r2;
          }
          rule(e4) {
            const t3 = this._definition;
            l.assertOptions(e4, Object.keys(t3.modifiers)), s(false !== this.$_temp.ruleset, "Cannot apply rules to empty ruleset or the last rule added does not support rule properties");
            const r2 = null === this.$_temp.ruleset ? this._rules.length - 1 : this.$_temp.ruleset;
            s(r2 >= 0 && r2 < this._rules.length, "Cannot apply rules to empty ruleset");
            const a2 = this.clone();
            for (let i2 = r2; i2 < a2._rules.length; ++i2) {
              const r3 = a2._rules[i2], o2 = n(r3);
              for (const n2 in e4) t3.modifiers[n2](o2, e4[n2]), s(o2.name === r3.name, "Cannot change rule name");
              a2._rules[i2] = o2, a2._singleRules.get(o2.name) === r3 && a2._singleRules.set(o2.name, o2);
            }
            return a2.$_temp.ruleset = false, a2.$_mutateRebuild();
          }
          get ruleset() {
            s(!this._inRuleset(), "Cannot start a new ruleset without closing the previous one");
            const e4 = this.clone();
            return e4.$_temp.ruleset = e4._rules.length, e4;
          }
          get $() {
            return this.ruleset;
          }
          tailor(e4) {
            e4 = [].concat(e4), s(!this._inRuleset(), "Cannot tailor inside a ruleset");
            let t3 = this;
            if (this.$_terms.alterations) for (const { target: r2, adjuster: n2 } of this.$_terms.alterations) e4.includes(r2) && (t3 = n2(t3), s(l.isSchema(t3), "Alteration adjuster for", r2, "failed to return a schema object"));
            return t3 = t3.$_modify({ each: /* @__PURE__ */ __name((t4) => t4.tailor(e4), "each"), ref: false }), t3.$_temp.ruleset = false, t3.$_mutateRebuild();
          }
          tracer() {
            return g.location ? g.location(this) : this;
          }
          validate(e4, t3) {
            return y.entry(e4, this, t3);
          }
          validateAsync(e4, t3) {
            return y.entryAsync(e4, this, t3);
          }
          $_addRule(e4) {
            "string" == typeof e4 && (e4 = { name: e4 }), s(e4 && "object" == typeof e4, "Invalid options"), s(e4.name && "string" == typeof e4.name, "Invalid rule name");
            for (const t4 in e4) s("_" !== t4[0], "Cannot set private rule properties");
            const t3 = Object.assign({}, e4);
            t3._resolve = [], t3.method = t3.method || t3.name;
            const r2 = this._definition.rules[t3.method], n2 = t3.args;
            s(r2, "Unknown rule", t3.method);
            const a2 = this.clone();
            if (n2) {
              s(1 === Object.keys(n2).length || Object.keys(n2).length === this._definition.rules[t3.name].args.length, "Invalid rule definition for", this.type, t3.name);
              for (const e5 in n2) {
                let i2 = n2[e5];
                if (r2.argsByName) {
                  const o2 = r2.argsByName.get(e5);
                  if (o2.ref && l.isResolvable(i2)) t3._resolve.push(e5), a2.$_mutateRegister(i2);
                  else if (o2.normalize && (i2 = o2.normalize(i2), n2[e5] = i2), o2.assert) {
                    const t4 = l.validateArg(i2, e5, o2);
                    s(!t4, t4, "or reference");
                  }
                }
                void 0 !== i2 ? n2[e5] = i2 : delete n2[e5];
              }
            }
            return r2.multi || (a2._ruleRemove(t3.name, { clone: false }), a2._singleRules.set(t3.name, t3)), false === a2.$_temp.ruleset && (a2.$_temp.ruleset = null), r2.priority ? a2._rules.unshift(t3) : a2._rules.push(t3), a2;
          }
          $_compile(e4, t3) {
            return c.schema(this.$_root, e4, t3);
          }
          $_createError(e4, t3, r2, s2, n2, a2 = {}) {
            const i2 = false !== a2.flags ? this._flags : {}, o2 = a2.messages ? h.merge(this._definition.messages, a2.messages) : this._definition.messages;
            return new u.Report(e4, t3, r2, i2, o2, s2, n2);
          }
          $_getFlag(e4) {
            return this._flags[e4];
          }
          $_getRule(e4) {
            return this._singleRules.get(e4);
          }
          $_mapLabels(e4) {
            return e4 = Array.isArray(e4) ? e4 : e4.split("."), this._ids.labels(e4);
          }
          $_match(e4, t3, r2, s2) {
            (r2 = Object.assign({}, r2)).abortEarly = true, r2._externals = false, t3.snapshot();
            const n2 = !y.validate(e4, this, t3, r2, s2).errors;
            return t3.restore(), n2;
          }
          $_modify(e4) {
            return l.assertOptions(e4, ["each", "once", "ref", "schema"]), d.schema(this, e4) || this;
          }
          $_mutateRebuild() {
            return s(!this._inRuleset(), "Cannot add this rule inside a ruleset"), this._refs.reset(), this._ids.reset(), this.$_modify({ each: /* @__PURE__ */ __name((e4, { source: t3, name: r2, path: s2, key: n2 }) => {
              const a2 = this._definition[t3][r2] && this._definition[t3][r2].register;
              false !== a2 && this.$_mutateRegister(e4, { family: a2, key: n2 });
            }, "each") }), this._definition.rebuild && this._definition.rebuild(this), this.$_temp.ruleset = false, this;
          }
          $_mutateRegister(e4, { family: t3, key: r2 } = {}) {
            this._refs.register(e4, t3), this._ids.register(e4, { key: r2 });
          }
          $_property(e4) {
            return this._definition.properties[e4];
          }
          $_reach(e4) {
            return this._ids.reach(e4);
          }
          $_rootReferences() {
            return this._refs.roots();
          }
          $_setFlag(e4, t3, r2 = {}) {
            s("_" === e4[0] || !this._inRuleset(), "Cannot set flag inside a ruleset");
            const n2 = this._definition.flags[e4] || {};
            if (a(t3, n2.default) && (t3 = void 0), a(t3, this._flags[e4])) return this;
            const i2 = false !== r2.clone ? this.clone() : this;
            return void 0 !== t3 ? (i2._flags[e4] = t3, i2.$_mutateRegister(t3)) : delete i2._flags[e4], "_" !== e4[0] && (i2.$_temp.ruleset = false), i2;
          }
          $_parent(e4, ...t3) {
            return this[e4][l.symbols.parent].call(this, ...t3);
          }
          $_validate(e4, t3, r2) {
            return y.validate(e4, this, t3, r2);
          }
          _assign(e4) {
            e4.type = this.type, e4.$_root = this.$_root, e4.$_temp = Object.assign({}, this.$_temp), e4.$_temp.whens = {}, e4._ids = this._ids.clone(), e4._preferences = this._preferences, e4._valids = this._valids && this._valids.clone(), e4._invalids = this._invalids && this._invalids.clone(), e4._rules = this._rules.slice(), e4._singleRules = n(this._singleRules, { shallow: true }), e4._refs = this._refs.clone(), e4._flags = Object.assign({}, this._flags), e4._cache = null, e4.$_terms = {};
            for (const t3 in this.$_terms) e4.$_terms[t3] = this.$_terms[t3] ? this.$_terms[t3].slice() : null;
            e4.$_super = {};
            for (const t3 in this.$_super) e4.$_super[t3] = this._super[t3].bind(e4);
            return e4;
          }
          _bare() {
            const e4 = this.clone();
            e4._reset();
            const t3 = e4._definition.terms;
            for (const r2 in t3) {
              const s2 = t3[r2];
              e4.$_terms[r2] = s2.init;
            }
            return e4.$_mutateRebuild();
          }
          _default(e4, t3, r2 = {}) {
            return l.assertOptions(r2, "literal"), s(void 0 !== t3, "Missing", e4, "value"), s("function" == typeof t3 || !r2.literal, "Only function value supports literal option"), "function" == typeof t3 && r2.literal && (t3 = { [l.symbols.literal]: true, literal: t3 }), this.$_setFlag(e4, t3);
          }
          _generate(e4, t3, r2) {
            if (!this.$_terms.whens) return { schema: this };
            const s2 = [], n2 = [];
            for (let a3 = 0; a3 < this.$_terms.whens.length; ++a3) {
              const i3 = this.$_terms.whens[a3];
              if (i3.concat) {
                s2.push(i3.concat), n2.push(`${a3}.concat`);
                continue;
              }
              const o2 = i3.ref ? i3.ref.resolve(e4, t3, r2) : e4, l2 = i3.is ? [i3] : i3.switch, c2 = n2.length;
              for (let c3 = 0; c3 < l2.length; ++c3) {
                const { is: u2, then: f2, otherwise: m2 } = l2[c3], h2 = `${a3}${i3.switch ? "." + c3 : ""}`;
                if (u2.$_match(o2, t3.nest(u2, `${h2}.is`), r2)) {
                  if (f2) {
                    const a4 = t3.localize([...t3.path, `${h2}.then`], t3.ancestors, t3.schemas), { schema: i4, id: o3 } = f2._generate(e4, a4, r2);
                    s2.push(i4), n2.push(`${h2}.then${o3 ? `(${o3})` : ""}`);
                    break;
                  }
                } else if (m2) {
                  const a4 = t3.localize([...t3.path, `${h2}.otherwise`], t3.ancestors, t3.schemas), { schema: i4, id: o3 } = m2._generate(e4, a4, r2);
                  s2.push(i4), n2.push(`${h2}.otherwise${o3 ? `(${o3})` : ""}`);
                  break;
                }
              }
              if (i3.break && n2.length > c2) break;
            }
            const a2 = n2.join(", ");
            if (t3.mainstay.tracer.debug(t3, "rule", "when", a2), !a2) return { schema: this };
            if (!t3.mainstay.tracer.active && this.$_temp.whens[a2]) return { schema: this.$_temp.whens[a2], id: a2 };
            let i2 = this;
            this._definition.generate && (i2 = this._definition.generate(this, e4, t3, r2));
            for (const e5 of s2) i2 = i2.concat(e5);
            return this.$_root._tracer && this.$_root._tracer._combine(i2, [this, ...s2]), this.$_temp.whens[a2] = i2, { schema: i2, id: a2 };
          }
          _inner(e4, t3, r2 = {}) {
            s(!this._inRuleset(), `Cannot set ${e4} inside a ruleset`);
            const n2 = this.clone();
            return n2.$_terms[e4] && !r2.override || (n2.$_terms[e4] = []), r2.single ? n2.$_terms[e4].push(t3) : n2.$_terms[e4].push(...t3), n2.$_temp.ruleset = false, n2;
          }
          _inRuleset() {
            return null !== this.$_temp.ruleset && false !== this.$_temp.ruleset;
          }
          _ruleRemove(e4, t3 = {}) {
            if (!this._singleRules.has(e4)) return this;
            const r2 = false !== t3.clone ? this.clone() : this;
            r2._singleRules.delete(e4);
            const s2 = [];
            for (let t4 = 0; t4 < r2._rules.length; ++t4) {
              const n2 = r2._rules[t4];
              n2.name !== e4 || n2.keep ? s2.push(n2) : r2._inRuleset() && t4 < r2.$_temp.ruleset && --r2.$_temp.ruleset;
            }
            return r2._rules = s2, r2;
          }
          _values(e4, t3) {
            l.verifyFlat(e4, t3.slice(1, -1));
            const r2 = this.clone(), n2 = e4[0] === l.symbols.override;
            if (n2 && (e4 = e4.slice(1)), !r2[t3] && e4.length ? r2[t3] = new b() : n2 && (r2[t3] = e4.length ? new b() : null, r2.$_mutateRebuild()), !r2[t3]) return r2;
            n2 && r2[t3].override();
            for (const n3 of e4) {
              s(void 0 !== n3, "Cannot call allow/valid/invalid with undefined"), s(n3 !== l.symbols.override, "Override must be the first value");
              const e5 = "_invalids" === t3 ? "_valids" : "_invalids";
              r2[e5] && (r2[e5].remove(n3), r2[e5].length || (s("_valids" === t3 || !r2._flags.only, "Setting invalid value", n3, "leaves schema rejecting all values due to previous valid rule"), r2[e5] = null)), r2[t3].add(n3, r2._refs);
            }
            return r2;
          }
        } };
        v.Base.prototype[l.symbols.any] = { version: l.version, compile: c.compile, root: "$_root" }, v.Base.prototype.isImmutable = true, v.Base.prototype.deny = v.Base.prototype.invalid, v.Base.prototype.disallow = v.Base.prototype.invalid, v.Base.prototype.equal = v.Base.prototype.valid, v.Base.prototype.exist = v.Base.prototype.required, v.Base.prototype.not = v.Base.prototype.invalid, v.Base.prototype.options = v.Base.prototype.prefs, v.Base.prototype.preferences = v.Base.prototype.prefs, e3.exports = new v.Base();
      }, 8652: (e3, t2, r) => {
        "use strict";
        const s = r(375), n = r(8571), a = r(8160), i = { max: 1e3, supported: /* @__PURE__ */ new Set(["undefined", "boolean", "number", "string"]) };
        t2.provider = { provision: /* @__PURE__ */ __name((e4) => new i.Cache(e4), "provision") }, i.Cache = class {
          constructor(e4 = {}) {
            a.assertOptions(e4, ["max"]), s(void 0 === e4.max || e4.max && e4.max > 0 && isFinite(e4.max), "Invalid max cache size"), this._max = e4.max || i.max, this._map = /* @__PURE__ */ new Map(), this._list = new i.List();
          }
          get length() {
            return this._map.size;
          }
          set(e4, t3) {
            if (null !== e4 && !i.supported.has(typeof e4)) return;
            let r2 = this._map.get(e4);
            if (r2) return r2.value = t3, void this._list.first(r2);
            r2 = this._list.unshift({ key: e4, value: t3 }), this._map.set(e4, r2), this._compact();
          }
          get(e4) {
            const t3 = this._map.get(e4);
            if (t3) return this._list.first(t3), n(t3.value);
          }
          _compact() {
            if (this._map.size > this._max) {
              const e4 = this._list.pop();
              this._map.delete(e4.key);
            }
          }
        }, i.List = class {
          constructor() {
            this.tail = null, this.head = null;
          }
          unshift(e4) {
            return e4.next = null, e4.prev = this.head, this.head && (this.head.next = e4), this.head = e4, this.tail || (this.tail = e4), e4;
          }
          first(e4) {
            e4 !== this.head && (this._remove(e4), this.unshift(e4));
          }
          pop() {
            return this._remove(this.tail);
          }
          _remove(e4) {
            const { next: t3, prev: r2 } = e4;
            return t3.prev = r2, r2 && (r2.next = t3), e4 === this.tail && (this.tail = t3), e4.prev = null, e4.next = null, e4;
          }
        };
      }, 8160: (e3, t2, r) => {
        "use strict";
        const s = r(375), n = r(7916), a = r(5934);
        let i, o;
        const l = { isoDate: /^(?:[-+]\d{2})?(?:\d{4}(?!\d{2}\b))(?:(-?)(?:(?:0[1-9]|1[0-2])(?:\1(?:[12]\d|0[1-9]|3[01]))?|W(?:[0-4]\d|5[0-2])(?:-?[1-7])?|(?:00[1-9]|0[1-9]\d|[12]\d{2}|3(?:[0-5]\d|6[1-6])))(?![T]$|[T][\d]+Z$)(?:[T\s](?:(?:(?:[01]\d|2[0-3])(?:(:?)[0-5]\d)?|24\:?00)(?:[.,]\d+(?!:))?)(?:\2[0-5]\d(?:[.,]\d+)?)?(?:[Z]|(?:[+-])(?:[01]\d|2[0-3])(?::?[0-5]\d)?)?)?)?$/ };
        t2.version = a.version, t2.defaults = { abortEarly: true, allowUnknown: false, artifacts: false, cache: true, context: null, convert: true, dateFormat: "iso", errors: { escapeHtml: false, label: "path", language: null, render: true, stack: false, wrap: { label: '"', array: "[]" } }, externals: true, messages: {}, nonEnumerables: false, noDefaults: false, presence: "optional", skipFunctions: false, stripUnknown: false, warnings: false }, t2.symbols = { any: Symbol.for("@hapi/joi/schema"), arraySingle: Symbol("arraySingle"), deepDefault: Symbol("deepDefault"), errors: Symbol("errors"), literal: Symbol("literal"), override: Symbol("override"), parent: Symbol("parent"), prefs: Symbol("prefs"), ref: Symbol("ref"), template: Symbol("template"), values: Symbol("values") }, t2.assertOptions = function(e4, t3, r2 = "Options") {
          s(e4 && "object" == typeof e4 && !Array.isArray(e4), "Options must be of type object");
          const n2 = Object.keys(e4).filter((e5) => !t3.includes(e5));
          s(0 === n2.length, `${r2} contain unknown keys: ${n2}`);
        }, t2.checkPreferences = function(e4) {
          o = o || r(3378);
          const t3 = o.preferences.validate(e4);
          if (t3.error) throw new n([t3.error.details[0].message]);
        }, t2.compare = function(e4, t3, r2) {
          switch (r2) {
            case "=":
              return e4 === t3;
            case ">":
              return e4 > t3;
            case "<":
              return e4 < t3;
            case ">=":
              return e4 >= t3;
            case "<=":
              return e4 <= t3;
          }
        }, t2.default = function(e4, t3) {
          return void 0 === e4 ? t3 : e4;
        }, t2.isIsoDate = function(e4) {
          return l.isoDate.test(e4);
        }, t2.isNumber = function(e4) {
          return "number" == typeof e4 && !isNaN(e4);
        }, t2.isResolvable = function(e4) {
          return !!e4 && (e4[t2.symbols.ref] || e4[t2.symbols.template]);
        }, t2.isSchema = function(e4, r2 = {}) {
          const n2 = e4 && e4[t2.symbols.any];
          return !!n2 && (s(r2.legacy || n2.version === t2.version, "Cannot mix different versions of joi schemas"), true);
        }, t2.isValues = function(e4) {
          return e4[t2.symbols.values];
        }, t2.limit = function(e4) {
          return Number.isSafeInteger(e4) && e4 >= 0;
        }, t2.preferences = function(e4, s2) {
          i = i || r(6914), e4 = e4 || {}, s2 = s2 || {};
          const n2 = Object.assign({}, e4, s2);
          return s2.errors && e4.errors && (n2.errors = Object.assign({}, e4.errors, s2.errors), n2.errors.wrap = Object.assign({}, e4.errors.wrap, s2.errors.wrap)), s2.messages && (n2.messages = i.compile(s2.messages, e4.messages)), delete n2[t2.symbols.prefs], n2;
        }, t2.tryWithPath = function(e4, t3, r2 = {}) {
          try {
            return e4();
          } catch (e5) {
            throw void 0 !== e5.path ? e5.path = t3 + "." + e5.path : e5.path = t3, r2.append && (e5.message = `${e5.message} (${e5.path})`), e5;
          }
        }, t2.validateArg = function(e4, r2, { assert: s2, message: n2 }) {
          if (t2.isSchema(s2)) {
            const t3 = s2.validate(e4);
            if (!t3.error) return;
            return t3.error.message;
          }
          if (!s2(e4)) return r2 ? `${r2} ${n2}` : n2;
        }, t2.verifyFlat = function(e4, t3) {
          for (const r2 of e4) s(!Array.isArray(r2), "Method no longer accepts array arguments:", t3);
        };
      }, 3292: (e3, t2, r) => {
        "use strict";
        const s = r(375), n = r(8160), a = r(6133), i = {};
        t2.schema = function(e4, t3, r2 = {}) {
          n.assertOptions(r2, ["appendPath", "override"]);
          try {
            return i.schema(e4, t3, r2);
          } catch (e5) {
            throw r2.appendPath && void 0 !== e5.path && (e5.message = `${e5.message} (${e5.path})`), e5;
          }
        }, i.schema = function(e4, t3, r2) {
          s(void 0 !== t3, "Invalid undefined schema"), Array.isArray(t3) && (s(t3.length, "Invalid empty array schema"), 1 === t3.length && (t3 = t3[0]));
          const a2 = /* @__PURE__ */ __name((t4, ...s2) => false !== r2.override ? t4.valid(e4.override, ...s2) : t4.valid(...s2), "a");
          if (i.simple(t3)) return a2(e4, t3);
          if ("function" == typeof t3) return e4.custom(t3);
          if (s("object" == typeof t3, "Invalid schema content:", typeof t3), n.isResolvable(t3)) return a2(e4, t3);
          if (n.isSchema(t3)) return t3;
          if (Array.isArray(t3)) {
            for (const r3 of t3) if (!i.simple(r3)) return e4.alternatives().try(...t3);
            return a2(e4, ...t3);
          }
          return t3 instanceof RegExp ? e4.string().regex(t3) : t3 instanceof Date ? a2(e4.date(), t3) : (s(Object.getPrototypeOf(t3) === Object.getPrototypeOf({}), "Schema can only contain plain objects"), e4.object().keys(t3));
        }, t2.ref = function(e4, t3) {
          return a.isRef(e4) ? e4 : a.create(e4, t3);
        }, t2.compile = function(e4, r2, a2 = {}) {
          n.assertOptions(a2, ["legacy"]);
          const o = r2 && r2[n.symbols.any];
          if (o) return s(a2.legacy || o.version === n.version, "Cannot mix different versions of joi schemas:", o.version, n.version), r2;
          if ("object" != typeof r2 || !a2.legacy) return t2.schema(e4, r2, { appendPath: true });
          const l = i.walk(r2);
          return l ? l.compile(l.root, r2) : t2.schema(e4, r2, { appendPath: true });
        }, i.walk = function(e4) {
          if ("object" != typeof e4) return null;
          if (Array.isArray(e4)) {
            for (const t4 of e4) {
              const e5 = i.walk(t4);
              if (e5) return e5;
            }
            return null;
          }
          const t3 = e4[n.symbols.any];
          if (t3) return { root: e4[t3.root], compile: t3.compile };
          s(Object.getPrototypeOf(e4) === Object.getPrototypeOf({}), "Schema can only contain plain objects");
          for (const t4 in e4) {
            const r2 = i.walk(e4[t4]);
            if (r2) return r2;
          }
          return null;
        }, i.simple = function(e4) {
          return null === e4 || ["boolean", "string", "number"].includes(typeof e4);
        }, t2.when = function(e4, r2, o) {
          if (void 0 === o && (s(r2 && "object" == typeof r2, "Missing options"), o = r2, r2 = a.create(".")), Array.isArray(o) && (o = { switch: o }), n.assertOptions(o, ["is", "not", "then", "otherwise", "switch", "break"]), n.isSchema(r2)) return s(void 0 === o.is, '"is" can not be used with a schema condition'), s(void 0 === o.not, '"not" can not be used with a schema condition'), s(void 0 === o.switch, '"switch" can not be used with a schema condition'), i.condition(e4, { is: r2, then: o.then, otherwise: o.otherwise, break: o.break });
          if (s(a.isRef(r2) || "string" == typeof r2, "Invalid condition:", r2), s(void 0 === o.not || void 0 === o.is, 'Cannot combine "is" with "not"'), void 0 === o.switch) {
            let l2 = o;
            void 0 !== o.not && (l2 = { is: o.not, then: o.otherwise, otherwise: o.then, break: o.break });
            let c = void 0 !== l2.is ? e4.$_compile(l2.is) : e4.$_root.invalid(null, false, 0, "").required();
            return s(void 0 !== l2.then || void 0 !== l2.otherwise, 'options must have at least one of "then", "otherwise", or "switch"'), s(void 0 === l2.break || void 0 === l2.then || void 0 === l2.otherwise, "Cannot specify then, otherwise, and break all together"), void 0 === o.is || a.isRef(o.is) || n.isSchema(o.is) || (c = c.required()), i.condition(e4, { ref: t2.ref(r2), is: c, then: l2.then, otherwise: l2.otherwise, break: l2.break });
          }
          s(Array.isArray(o.switch), '"switch" must be an array'), s(void 0 === o.is, 'Cannot combine "switch" with "is"'), s(void 0 === o.not, 'Cannot combine "switch" with "not"'), s(void 0 === o.then, 'Cannot combine "switch" with "then"');
          const l = { ref: t2.ref(r2), switch: [], break: o.break };
          for (let t3 = 0; t3 < o.switch.length; ++t3) {
            const r3 = o.switch[t3], i2 = t3 === o.switch.length - 1;
            n.assertOptions(r3, i2 ? ["is", "then", "otherwise"] : ["is", "then"]), s(void 0 !== r3.is, 'Switch statement missing "is"'), s(void 0 !== r3.then, 'Switch statement missing "then"');
            const c = { is: e4.$_compile(r3.is), then: e4.$_compile(r3.then) };
            if (a.isRef(r3.is) || n.isSchema(r3.is) || (c.is = c.is.required()), i2) {
              s(void 0 === o.otherwise || void 0 === r3.otherwise, 'Cannot specify "otherwise" inside and outside a "switch"');
              const t4 = void 0 !== o.otherwise ? o.otherwise : r3.otherwise;
              void 0 !== t4 && (s(void 0 === l.break, "Cannot specify both otherwise and break"), c.otherwise = e4.$_compile(t4));
            }
            l.switch.push(c);
          }
          return l;
        }, i.condition = function(e4, t3) {
          for (const r2 of ["then", "otherwise"]) void 0 === t3[r2] ? delete t3[r2] : t3[r2] = e4.$_compile(t3[r2]);
          return t3;
        };
      }, 6354: (e3, t2, r) => {
        "use strict";
        const s = r(5688), n = r(8160), a = r(3328);
        t2.Report = class {
          constructor(e4, r2, s2, n2, a2, i, o) {
            if (this.code = e4, this.flags = n2, this.messages = a2, this.path = i.path, this.prefs = o, this.state = i, this.value = r2, this.message = null, this.template = null, this.local = s2 || {}, this.local.label = t2.label(this.flags, this.state, this.prefs, this.messages), void 0 === this.value || this.local.hasOwnProperty("value") || (this.local.value = this.value), this.path.length) {
              const e5 = this.path[this.path.length - 1];
              "object" != typeof e5 && (this.local.key = e5);
            }
          }
          _setTemplate(e4) {
            if (this.template = e4, !this.flags.label && 0 === this.path.length) {
              const e5 = this._template(this.template, "root");
              e5 && (this.local.label = e5);
            }
          }
          toString() {
            if (this.message) return this.message;
            const e4 = this.code;
            if (!this.prefs.errors.render) return this.code;
            const t3 = this._template(this.template) || this._template(this.prefs.messages) || this._template(this.messages);
            return void 0 === t3 ? `Error code "${e4}" is not defined, your custom type is missing the correct messages definition` : (this.message = t3.render(this.value, this.state, this.prefs, this.local, { errors: this.prefs.errors, messages: [this.prefs.messages, this.messages] }), this.prefs.errors.label || (this.message = this.message.replace(/^"" /, "").trim()), this.message);
          }
          _template(e4, r2) {
            return t2.template(this.value, e4, r2 || this.code, this.state, this.prefs);
          }
        }, t2.path = function(e4) {
          let t3 = "";
          for (const r2 of e4) "object" != typeof r2 && ("string" == typeof r2 ? (t3 && (t3 += "."), t3 += r2) : t3 += `[${r2}]`);
          return t3;
        }, t2.template = function(e4, t3, r2, s2, i) {
          if (!t3) return;
          if (a.isTemplate(t3)) return "root" !== r2 ? t3 : null;
          let o = i.errors.language;
          if (n.isResolvable(o) && (o = o.resolve(e4, s2, i)), o && t3[o]) {
            if (void 0 !== t3[o][r2]) return t3[o][r2];
            if (void 0 !== t3[o]["*"]) return t3[o]["*"];
          }
          return t3[r2] ? t3[r2] : t3["*"];
        }, t2.label = function(e4, r2, s2, n2) {
          if (!s2.errors.label) return "";
          if (e4.label) return e4.label;
          let a2 = r2.path;
          "key" === s2.errors.label && r2.path.length > 1 && (a2 = r2.path.slice(-1));
          return t2.path(a2) || t2.template(null, s2.messages, "root", r2, s2) || n2 && t2.template(null, n2, "root", r2, s2) || "value";
        }, t2.process = function(e4, r2, s2) {
          if (!e4) return null;
          const { override: n2, message: a2, details: i } = t2.details(e4);
          if (n2) return n2;
          if (s2.errors.stack) return new t2.ValidationError(a2, i, r2);
          const o = Error.stackTraceLimit;
          Error.stackTraceLimit = 0;
          const l = new t2.ValidationError(a2, i, r2);
          return Error.stackTraceLimit = o, l;
        }, t2.details = function(e4, t3 = {}) {
          let r2 = [];
          const s2 = [];
          for (const n2 of e4) {
            if (n2 instanceof Error) {
              if (false !== t3.override) return { override: n2 };
              const e6 = n2.toString();
              r2.push(e6), s2.push({ message: e6, type: "override", context: { error: n2 } });
              continue;
            }
            const e5 = n2.toString();
            r2.push(e5), s2.push({ message: e5, path: n2.path.filter((e6) => "object" != typeof e6), type: n2.code, context: n2.local });
          }
          return r2.length > 1 && (r2 = [...new Set(r2)]), { message: r2.join(". "), details: s2 };
        }, t2.ValidationError = class extends Error {
          constructor(e4, t3, r2) {
            super(e4), this._original = r2, this.details = t3;
          }
          static isError(e4) {
            return e4 instanceof t2.ValidationError;
          }
        }, t2.ValidationError.prototype.isJoi = true, t2.ValidationError.prototype.name = "ValidationError", t2.ValidationError.prototype.annotate = s.error;
      }, 8901: (e3, t2, r) => {
        "use strict";
        const s = r(375), n = r(8571), a = r(8160), i = r(6914), o = {};
        t2.type = function(e4, t3) {
          const r2 = Object.getPrototypeOf(e4), l = n(r2), c = e4._assign(Object.create(l)), u = Object.assign({}, t3);
          delete u.base, l._definition = u;
          const f = r2._definition || {};
          u.messages = i.merge(f.messages, u.messages), u.properties = Object.assign({}, f.properties, u.properties), c.type = u.type, u.flags = Object.assign({}, f.flags, u.flags);
          const m = Object.assign({}, f.terms);
          if (u.terms) for (const e5 in u.terms) {
            const t4 = u.terms[e5];
            s(void 0 === c.$_terms[e5], "Invalid term override for", u.type, e5), c.$_terms[e5] = t4.init, m[e5] = t4;
          }
          u.terms = m, u.args || (u.args = f.args), u.prepare = o.prepare(u.prepare, f.prepare), u.coerce && ("function" == typeof u.coerce && (u.coerce = { method: u.coerce }), u.coerce.from && !Array.isArray(u.coerce.from) && (u.coerce = { method: u.coerce.method, from: [].concat(u.coerce.from) })), u.coerce = o.coerce(u.coerce, f.coerce), u.validate = o.validate(u.validate, f.validate);
          const h = Object.assign({}, f.rules);
          if (u.rules) for (const e5 in u.rules) {
            const t4 = u.rules[e5];
            s("object" == typeof t4, "Invalid rule definition for", u.type, e5);
            let r3 = t4.method;
            if (void 0 === r3 && (r3 = /* @__PURE__ */ __name(function() {
              return this.$_addRule(e5);
            }, "r")), r3 && (s(!l[e5], "Rule conflict in", u.type, e5), l[e5] = r3), s(!h[e5], "Rule conflict in", u.type, e5), h[e5] = t4, t4.alias) {
              const e6 = [].concat(t4.alias);
              for (const r4 of e6) l[r4] = t4.method;
            }
            t4.args && (t4.argsByName = /* @__PURE__ */ new Map(), t4.args = t4.args.map((e6) => ("string" == typeof e6 && (e6 = { name: e6 }), s(!t4.argsByName.has(e6.name), "Duplicated argument name", e6.name), a.isSchema(e6.assert) && (e6.assert = e6.assert.strict().label(e6.name)), t4.argsByName.set(e6.name, e6), e6)));
          }
          u.rules = h;
          const d = Object.assign({}, f.modifiers);
          if (u.modifiers) for (const e5 in u.modifiers) {
            s(!l[e5], "Rule conflict in", u.type, e5);
            const t4 = u.modifiers[e5];
            s("function" == typeof t4, "Invalid modifier definition for", u.type, e5);
            const r3 = /* @__PURE__ */ __name(function(t5) {
              return this.rule({ [e5]: t5 });
            }, "r");
            l[e5] = r3, d[e5] = t4;
          }
          if (u.modifiers = d, u.overrides) {
            l._super = r2, c.$_super = {};
            for (const e5 in u.overrides) s(r2[e5], "Cannot override missing", e5), u.overrides[e5][a.symbols.parent] = r2[e5], c.$_super[e5] = r2[e5].bind(c);
            Object.assign(l, u.overrides);
          }
          u.cast = Object.assign({}, f.cast, u.cast);
          const p = Object.assign({}, f.manifest, u.manifest);
          return p.build = o.build(u.manifest && u.manifest.build, f.manifest && f.manifest.build), u.manifest = p, u.rebuild = o.rebuild(u.rebuild, f.rebuild), c;
        }, o.build = function(e4, t3) {
          return e4 && t3 ? function(r2, s2) {
            return t3(e4(r2, s2), s2);
          } : e4 || t3;
        }, o.coerce = function(e4, t3) {
          return e4 && t3 ? { from: e4.from && t3.from ? [.../* @__PURE__ */ new Set([...e4.from, ...t3.from])] : null, method(r2, s2) {
            let n2;
            if ((!t3.from || t3.from.includes(typeof r2)) && (n2 = t3.method(r2, s2), n2)) {
              if (n2.errors || void 0 === n2.value) return n2;
              r2 = n2.value;
            }
            if (!e4.from || e4.from.includes(typeof r2)) {
              const t4 = e4.method(r2, s2);
              if (t4) return t4;
            }
            return n2;
          } } : e4 || t3;
        }, o.prepare = function(e4, t3) {
          return e4 && t3 ? function(r2, s2) {
            const n2 = e4(r2, s2);
            if (n2) {
              if (n2.errors || void 0 === n2.value) return n2;
              r2 = n2.value;
            }
            return t3(r2, s2) || n2;
          } : e4 || t3;
        }, o.rebuild = function(e4, t3) {
          return e4 && t3 ? function(r2) {
            t3(r2), e4(r2);
          } : e4 || t3;
        }, o.validate = function(e4, t3) {
          return e4 && t3 ? function(r2, s2) {
            const n2 = t3(r2, s2);
            if (n2) {
              if (n2.errors && (!Array.isArray(n2.errors) || n2.errors.length)) return n2;
              r2 = n2.value;
            }
            return e4(r2, s2) || n2;
          } : e4 || t3;
        };
      }, 5107: (e3, t2, r) => {
        "use strict";
        const s = r(375), n = r(8571), a = r(8652), i = r(8160), o = r(3292), l = r(6354), c = r(8901), u = r(9708), f = r(6133), m = r(3328), h = r(1152);
        let d;
        const p = { types: { alternatives: r(4946), any: r(8068), array: r(546), boolean: r(4937), date: r(7500), function: r(390), link: r(8785), number: r(3832), object: r(8966), string: r(7417), symbol: r(8826) }, aliases: { alt: "alternatives", bool: "boolean", func: "function" }, root: /* @__PURE__ */ __name(function() {
          const e4 = { _types: new Set(Object.keys(p.types)) };
          for (const t3 of e4._types) e4[t3] = function(...e5) {
            return s(!e5.length || ["alternatives", "link", "object"].includes(t3), "The", t3, "type does not allow arguments"), p.generate(this, p.types[t3], e5);
          };
          for (const t3 of ["allow", "custom", "disallow", "equal", "exist", "forbidden", "invalid", "not", "only", "optional", "options", "prefs", "preferences", "required", "strip", "valid", "when"]) e4[t3] = function(...e5) {
            return this.any()[t3](...e5);
          };
          Object.assign(e4, p.methods);
          for (const t3 in p.aliases) {
            const r2 = p.aliases[t3];
            e4[t3] = e4[r2];
          }
          return e4.x = e4.expression, h.setup && h.setup(e4), e4;
        }, "root") };
        p.methods = { ValidationError: l.ValidationError, version: i.version, cache: a.provider, assert(e4, t3, ...r2) {
          p.assert(e4, t3, true, r2);
        }, attempt: /* @__PURE__ */ __name((e4, t3, ...r2) => p.assert(e4, t3, false, r2), "attempt"), build(e4) {
          return s("function" == typeof u.build, "Manifest functionality disabled"), u.build(this, e4);
        }, checkPreferences(e4) {
          i.checkPreferences(e4);
        }, compile(e4, t3) {
          return o.compile(this, e4, t3);
        }, defaults(e4) {
          s("function" == typeof e4, "modifier must be a function");
          const t3 = Object.assign({}, this);
          for (const r2 of t3._types) {
            const n2 = e4(t3[r2]());
            s(i.isSchema(n2), "modifier must return a valid schema object"), t3[r2] = function(...e5) {
              return p.generate(this, n2, e5);
            };
          }
          return t3;
        }, expression: /* @__PURE__ */ __name((...e4) => new m(...e4), "expression"), extend(...e4) {
          i.verifyFlat(e4, "extend"), d = d || r(3378), s(e4.length, "You need to provide at least one extension"), this.assert(e4, d.extensions);
          const t3 = Object.assign({}, this);
          t3._types = new Set(t3._types);
          for (let r2 of e4) {
            "function" == typeof r2 && (r2 = r2(t3)), this.assert(r2, d.extension);
            const e5 = p.expandExtension(r2, t3);
            for (const r3 of e5) {
              s(void 0 === t3[r3.type] || t3._types.has(r3.type), "Cannot override name", r3.type);
              const e6 = r3.base || this.any(), n2 = c.type(e6, r3);
              t3._types.add(r3.type), t3[r3.type] = function(...e7) {
                return p.generate(this, n2, e7);
              };
            }
          }
          return t3;
        }, isError: l.ValidationError.isError, isExpression: m.isTemplate, isRef: f.isRef, isSchema: i.isSchema, in: /* @__PURE__ */ __name((...e4) => f.in(...e4), "in"), override: i.symbols.override, ref: /* @__PURE__ */ __name((...e4) => f.create(...e4), "ref"), types() {
          const e4 = {};
          for (const t3 of this._types) e4[t3] = this[t3]();
          for (const t3 in p.aliases) e4[t3] = this[t3]();
          return e4;
        } }, p.assert = function(e4, t3, r2, s2) {
          const a2 = s2[0] instanceof Error || "string" == typeof s2[0] ? s2[0] : null, o2 = null !== a2 ? s2[1] : s2[0], c2 = t3.validate(e4, i.preferences({ errors: { stack: true } }, o2 || {}));
          let u2 = c2.error;
          if (!u2) return c2.value;
          if (a2 instanceof Error) throw a2;
          const f2 = r2 && "function" == typeof u2.annotate ? u2.annotate() : u2.message;
          throw u2 instanceof l.ValidationError == 0 && (u2 = n(u2)), u2.message = a2 ? `${a2} ${f2}` : f2, u2;
        }, p.generate = function(e4, t3, r2) {
          return s(e4, "Must be invoked on a Joi instance."), t3.$_root = e4, t3._definition.args && r2.length ? t3._definition.args(t3, ...r2) : t3;
        }, p.expandExtension = function(e4, t3) {
          if ("string" == typeof e4.type) return [e4];
          const r2 = [];
          for (const s2 of t3._types) if (e4.type.test(s2)) {
            const n2 = Object.assign({}, e4);
            n2.type = s2, n2.base = t3[s2](), r2.push(n2);
          }
          return r2;
        }, e3.exports = p.root();
      }, 6914: (e3, t2, r) => {
        "use strict";
        const s = r(375), n = r(8571), a = r(3328);
        t2.compile = function(e4, t3) {
          if ("string" == typeof e4) return s(!t3, "Cannot set single message string"), new a(e4);
          if (a.isTemplate(e4)) return s(!t3, "Cannot set single message template"), e4;
          s("object" == typeof e4 && !Array.isArray(e4), "Invalid message options"), t3 = t3 ? n(t3) : {};
          for (let r2 in e4) {
            const n2 = e4[r2];
            if ("root" === r2 || a.isTemplate(n2)) {
              t3[r2] = n2;
              continue;
            }
            if ("string" == typeof n2) {
              t3[r2] = new a(n2);
              continue;
            }
            s("object" == typeof n2 && !Array.isArray(n2), "Invalid message for", r2);
            const i = r2;
            for (r2 in t3[i] = t3[i] || {}, n2) {
              const e5 = n2[r2];
              "root" === r2 || a.isTemplate(e5) ? t3[i][r2] = e5 : (s("string" == typeof e5, "Invalid message for", r2, "in", i), t3[i][r2] = new a(e5));
            }
          }
          return t3;
        }, t2.decompile = function(e4) {
          const t3 = {};
          for (let r2 in e4) {
            const s2 = e4[r2];
            if ("root" === r2) {
              t3.root = s2;
              continue;
            }
            if (a.isTemplate(s2)) {
              t3[r2] = s2.describe({ compact: true });
              continue;
            }
            const n2 = r2;
            for (r2 in t3[n2] = {}, s2) {
              const e5 = s2[r2];
              "root" !== r2 ? t3[n2][r2] = e5.describe({ compact: true }) : t3[n2].root = e5;
            }
          }
          return t3;
        }, t2.merge = function(e4, r2) {
          if (!e4) return t2.compile(r2);
          if (!r2) return e4;
          if ("string" == typeof r2) return new a(r2);
          if (a.isTemplate(r2)) return r2;
          const i = n(e4);
          for (let e5 in r2) {
            const t3 = r2[e5];
            if ("root" === e5 || a.isTemplate(t3)) {
              i[e5] = t3;
              continue;
            }
            if ("string" == typeof t3) {
              i[e5] = new a(t3);
              continue;
            }
            s("object" == typeof t3 && !Array.isArray(t3), "Invalid message for", e5);
            const n2 = e5;
            for (e5 in i[n2] = i[n2] || {}, t3) {
              const r3 = t3[e5];
              "root" === e5 || a.isTemplate(r3) ? i[n2][e5] = r3 : (s("string" == typeof r3, "Invalid message for", e5, "in", n2), i[n2][e5] = new a(r3));
            }
          }
          return i;
        };
      }, 2294: (e3, t2, r) => {
        "use strict";
        const s = r(375), n = r(8160), a = r(6133), i = {};
        t2.Ids = i.Ids = class {
          constructor() {
            this._byId = /* @__PURE__ */ new Map(), this._byKey = /* @__PURE__ */ new Map(), this._schemaChain = false;
          }
          clone() {
            const e4 = new i.Ids();
            return e4._byId = new Map(this._byId), e4._byKey = new Map(this._byKey), e4._schemaChain = this._schemaChain, e4;
          }
          concat(e4) {
            e4._schemaChain && (this._schemaChain = true);
            for (const [t3, r2] of e4._byId.entries()) s(!this._byKey.has(t3), "Schema id conflicts with existing key:", t3), this._byId.set(t3, r2);
            for (const [t3, r2] of e4._byKey.entries()) s(!this._byId.has(t3), "Schema key conflicts with existing id:", t3), this._byKey.set(t3, r2);
          }
          fork(e4, t3, r2) {
            const a2 = this._collect(e4);
            a2.push({ schema: r2 });
            const o = a2.shift();
            let l = { id: o.id, schema: t3(o.schema) };
            s(n.isSchema(l.schema), "adjuster function failed to return a joi schema type");
            for (const e5 of a2) l = { id: e5.id, schema: i.fork(e5.schema, l.id, l.schema) };
            return l.schema;
          }
          labels(e4, t3 = []) {
            const r2 = e4[0], s2 = this._get(r2);
            if (!s2) return [...t3, ...e4].join(".");
            const n2 = e4.slice(1);
            return t3 = [...t3, s2.schema._flags.label || r2], n2.length ? s2.schema._ids.labels(n2, t3) : t3.join(".");
          }
          reach(e4, t3 = []) {
            const r2 = e4[0], n2 = this._get(r2);
            s(n2, "Schema does not contain path", [...t3, ...e4].join("."));
            const a2 = e4.slice(1);
            return a2.length ? n2.schema._ids.reach(a2, [...t3, r2]) : n2.schema;
          }
          register(e4, { key: t3 } = {}) {
            if (!e4 || !n.isSchema(e4)) return;
            (e4.$_property("schemaChain") || e4._ids._schemaChain) && (this._schemaChain = true);
            const r2 = e4._flags.id;
            if (r2) {
              const t4 = this._byId.get(r2);
              s(!t4 || t4.schema === e4, "Cannot add different schemas with the same id:", r2), s(!this._byKey.has(r2), "Schema id conflicts with existing key:", r2), this._byId.set(r2, { schema: e4, id: r2 });
            }
            t3 && (s(!this._byKey.has(t3), "Schema already contains key:", t3), s(!this._byId.has(t3), "Schema key conflicts with existing id:", t3), this._byKey.set(t3, { schema: e4, id: t3 }));
          }
          reset() {
            this._byId = /* @__PURE__ */ new Map(), this._byKey = /* @__PURE__ */ new Map(), this._schemaChain = false;
          }
          _collect(e4, t3 = [], r2 = []) {
            const n2 = e4[0], a2 = this._get(n2);
            s(a2, "Schema does not contain path", [...t3, ...e4].join(".")), r2 = [a2, ...r2];
            const i2 = e4.slice(1);
            return i2.length ? a2.schema._ids._collect(i2, [...t3, n2], r2) : r2;
          }
          _get(e4) {
            return this._byId.get(e4) || this._byKey.get(e4);
          }
        }, i.fork = function(e4, r2, s2) {
          const n2 = t2.schema(e4, { each: /* @__PURE__ */ __name((e5, { key: t3 }) => {
            if (r2 === (e5._flags.id || t3)) return s2;
          }, "each"), ref: false });
          return n2 ? n2.$_mutateRebuild() : e4;
        }, t2.schema = function(e4, t3) {
          let r2;
          for (const s2 in e4._flags) {
            if ("_" === s2[0]) continue;
            const n2 = i.scan(e4._flags[s2], { source: "flags", name: s2 }, t3);
            void 0 !== n2 && (r2 = r2 || e4.clone(), r2._flags[s2] = n2);
          }
          for (let s2 = 0; s2 < e4._rules.length; ++s2) {
            const n2 = e4._rules[s2], a2 = i.scan(n2.args, { source: "rules", name: n2.name }, t3);
            if (void 0 !== a2) {
              r2 = r2 || e4.clone();
              const t4 = Object.assign({}, n2);
              t4.args = a2, r2._rules[s2] = t4, r2._singleRules.get(n2.name) === n2 && r2._singleRules.set(n2.name, t4);
            }
          }
          for (const s2 in e4.$_terms) {
            if ("_" === s2[0]) continue;
            const n2 = i.scan(e4.$_terms[s2], { source: "terms", name: s2 }, t3);
            void 0 !== n2 && (r2 = r2 || e4.clone(), r2.$_terms[s2] = n2);
          }
          return r2;
        }, i.scan = function(e4, t3, r2, s2, o) {
          const l = s2 || [];
          if (null === e4 || "object" != typeof e4) return;
          let c;
          if (Array.isArray(e4)) {
            for (let s3 = 0; s3 < e4.length; ++s3) {
              const n2 = "terms" === t3.source && "keys" === t3.name && e4[s3].key, a2 = i.scan(e4[s3], t3, r2, [s3, ...l], n2);
              void 0 !== a2 && (c = c || e4.slice(), c[s3] = a2);
            }
            return c;
          }
          if (false !== r2.schema && n.isSchema(e4) || false !== r2.ref && a.isRef(e4)) {
            const s3 = r2.each(e4, { ...t3, path: l, key: o });
            if (s3 === e4) return;
            return s3;
          }
          for (const s3 in e4) {
            if ("_" === s3[0]) continue;
            const n2 = i.scan(e4[s3], t3, r2, [s3, ...l], o);
            void 0 !== n2 && (c = c || Object.assign({}, e4), c[s3] = n2);
          }
          return c;
        };
      }, 6133: (e3, t2, r) => {
        "use strict";
        const s = r(375), n = r(8571), a = r(9621), i = r(8160);
        let o;
        const l = { symbol: Symbol("ref"), defaults: { adjust: null, in: false, iterables: null, map: null, separator: ".", type: "value" } };
        t2.create = function(e4, t3 = {}) {
          s("string" == typeof e4, "Invalid reference key:", e4), i.assertOptions(t3, ["adjust", "ancestor", "in", "iterables", "map", "prefix", "render", "separator"]), s(!t3.prefix || "object" == typeof t3.prefix, "options.prefix must be of type object");
          const r2 = Object.assign({}, l.defaults, t3);
          delete r2.prefix;
          const n2 = r2.separator, a2 = l.context(e4, n2, t3.prefix);
          if (r2.type = a2.type, e4 = a2.key, "value" === r2.type) if (a2.root && (s(!n2 || e4[0] !== n2, "Cannot specify relative path with root prefix"), r2.ancestor = "root", e4 || (e4 = null)), n2 && n2 === e4) e4 = null, r2.ancestor = 0;
          else if (void 0 !== r2.ancestor) s(!n2 || !e4 || e4[0] !== n2, "Cannot combine prefix with ancestor option");
          else {
            const [t4, s2] = l.ancestor(e4, n2);
            s2 && "" === (e4 = e4.slice(s2)) && (e4 = null), r2.ancestor = t4;
          }
          return r2.path = n2 ? null === e4 ? [] : e4.split(n2) : [e4], new l.Ref(r2);
        }, t2.in = function(e4, r2 = {}) {
          return t2.create(e4, { ...r2, in: true });
        }, t2.isRef = function(e4) {
          return !!e4 && !!e4[i.symbols.ref];
        }, l.Ref = class {
          constructor(e4) {
            s("object" == typeof e4, "Invalid reference construction"), i.assertOptions(e4, ["adjust", "ancestor", "in", "iterables", "map", "path", "render", "separator", "type", "depth", "key", "root", "display"]), s([false, void 0].includes(e4.separator) || "string" == typeof e4.separator && 1 === e4.separator.length, "Invalid separator"), s(!e4.adjust || "function" == typeof e4.adjust, "options.adjust must be a function"), s(!e4.map || Array.isArray(e4.map), "options.map must be an array"), s(!e4.map || !e4.adjust, "Cannot set both map and adjust options"), Object.assign(this, l.defaults, e4), s("value" === this.type || void 0 === this.ancestor, "Non-value references cannot reference ancestors"), Array.isArray(this.map) && (this.map = new Map(this.map)), this.depth = this.path.length, this.key = this.path.length ? this.path.join(this.separator) : null, this.root = this.path[0], this.updateDisplay();
          }
          resolve(e4, t3, r2, n2, a2 = {}) {
            return s(!this.in || a2.in, "Invalid in() reference usage"), "global" === this.type ? this._resolve(r2.context, t3, a2) : "local" === this.type ? this._resolve(n2, t3, a2) : this.ancestor ? "root" === this.ancestor ? this._resolve(t3.ancestors[t3.ancestors.length - 1], t3, a2) : (s(this.ancestor <= t3.ancestors.length, "Invalid reference exceeds the schema root:", this.display), this._resolve(t3.ancestors[this.ancestor - 1], t3, a2)) : this._resolve(e4, t3, a2);
          }
          _resolve(e4, t3, r2) {
            let s2;
            if ("value" === this.type && t3.mainstay.shadow && false !== r2.shadow && (s2 = t3.mainstay.shadow.get(this.absolute(t3))), void 0 === s2 && (s2 = a(e4, this.path, { iterables: this.iterables, functions: true })), this.adjust && (s2 = this.adjust(s2)), this.map) {
              const e5 = this.map.get(s2);
              void 0 !== e5 && (s2 = e5);
            }
            return t3.mainstay && t3.mainstay.tracer.resolve(t3, this, s2), s2;
          }
          toString() {
            return this.display;
          }
          absolute(e4) {
            return [...e4.path.slice(0, -this.ancestor), ...this.path];
          }
          clone() {
            return new l.Ref(this);
          }
          describe() {
            const e4 = { path: this.path };
            "value" !== this.type && (e4.type = this.type), "." !== this.separator && (e4.separator = this.separator), "value" === this.type && 1 !== this.ancestor && (e4.ancestor = this.ancestor), this.map && (e4.map = [...this.map]);
            for (const t3 of ["adjust", "iterables", "render"]) null !== this[t3] && void 0 !== this[t3] && (e4[t3] = this[t3]);
            return false !== this.in && (e4.in = true), { ref: e4 };
          }
          updateDisplay() {
            const e4 = null !== this.key ? this.key : "";
            if ("value" !== this.type) return void (this.display = `ref:${this.type}:${e4}`);
            if (!this.separator) return void (this.display = `ref:${e4}`);
            if (!this.ancestor) return void (this.display = `ref:${this.separator}${e4}`);
            if ("root" === this.ancestor) return void (this.display = `ref:root:${e4}`);
            if (1 === this.ancestor) return void (this.display = `ref:${e4 || ".."}`);
            const t3 = new Array(this.ancestor + 1).fill(this.separator).join("");
            this.display = `ref:${t3}${e4 || ""}`;
          }
        }, l.Ref.prototype[i.symbols.ref] = true, t2.build = function(e4) {
          return "value" === (e4 = Object.assign({}, l.defaults, e4)).type && void 0 === e4.ancestor && (e4.ancestor = 1), new l.Ref(e4);
        }, l.context = function(e4, t3, r2 = {}) {
          if (e4 = e4.trim(), r2) {
            const s2 = void 0 === r2.global ? "$" : r2.global;
            if (s2 !== t3 && e4.startsWith(s2)) return { key: e4.slice(s2.length), type: "global" };
            const n2 = void 0 === r2.local ? "#" : r2.local;
            if (n2 !== t3 && e4.startsWith(n2)) return { key: e4.slice(n2.length), type: "local" };
            const a2 = void 0 === r2.root ? "/" : r2.root;
            if (a2 !== t3 && e4.startsWith(a2)) return { key: e4.slice(a2.length), type: "value", root: true };
          }
          return { key: e4, type: "value" };
        }, l.ancestor = function(e4, t3) {
          if (!t3) return [1, 0];
          if (e4[0] !== t3) return [1, 0];
          if (e4[1] !== t3) return [0, 1];
          let r2 = 2;
          for (; e4[r2] === t3; ) ++r2;
          return [r2 - 1, r2];
        }, t2.toSibling = 0, t2.toParent = 1, t2.Manager = class {
          constructor() {
            this.refs = [];
          }
          register(e4, s2) {
            if (e4) if (s2 = void 0 === s2 ? t2.toParent : s2, Array.isArray(e4)) for (const t3 of e4) this.register(t3, s2);
            else if (i.isSchema(e4)) for (const t3 of e4._refs.refs) t3.ancestor - s2 >= 0 && this.refs.push({ ancestor: t3.ancestor - s2, root: t3.root });
            else t2.isRef(e4) && "value" === e4.type && e4.ancestor - s2 >= 0 && this.refs.push({ ancestor: e4.ancestor - s2, root: e4.root }), o = o || r(3328), o.isTemplate(e4) && this.register(e4.refs(), s2);
          }
          get length() {
            return this.refs.length;
          }
          clone() {
            const e4 = new t2.Manager();
            return e4.refs = n(this.refs), e4;
          }
          reset() {
            this.refs = [];
          }
          roots() {
            return this.refs.filter((e4) => !e4.ancestor).map((e4) => e4.root);
          }
        };
      }, 3378: (e3, t2, r) => {
        "use strict";
        const s = r(5107), n = {};
        n.wrap = s.string().min(1).max(2).allow(false), t2.preferences = s.object({ allowUnknown: s.boolean(), abortEarly: s.boolean(), artifacts: s.boolean(), cache: s.boolean(), context: s.object(), convert: s.boolean(), dateFormat: s.valid("date", "iso", "string", "time", "utc"), debug: s.boolean(), errors: { escapeHtml: s.boolean(), label: s.valid("path", "key", false), language: [s.string(), s.object().ref()], render: s.boolean(), stack: s.boolean(), wrap: { label: n.wrap, array: n.wrap, string: n.wrap } }, externals: s.boolean(), messages: s.object(), noDefaults: s.boolean(), nonEnumerables: s.boolean(), presence: s.valid("required", "optional", "forbidden"), skipFunctions: s.boolean(), stripUnknown: s.object({ arrays: s.boolean(), objects: s.boolean() }).or("arrays", "objects").allow(true, false), warnings: s.boolean() }).strict(), n.nameRx = /^[a-zA-Z0-9]\w*$/, n.rule = s.object({ alias: s.array().items(s.string().pattern(n.nameRx)).single(), args: s.array().items(s.string(), s.object({ name: s.string().pattern(n.nameRx).required(), ref: s.boolean(), assert: s.alternatives([s.function(), s.object().schema()]).conditional("ref", { is: true, then: s.required() }), normalize: s.function(), message: s.string().when("assert", { is: s.function(), then: s.required() }) })), convert: s.boolean(), manifest: s.boolean(), method: s.function().allow(false), multi: s.boolean(), validate: s.function() }), t2.extension = s.object({ type: s.alternatives([s.string(), s.object().regex()]).required(), args: s.function(), cast: s.object().pattern(n.nameRx, s.object({ from: s.function().maxArity(1).required(), to: s.function().minArity(1).maxArity(2).required() })), base: s.object().schema().when("type", { is: s.object().regex(), then: s.forbidden() }), coerce: [s.function().maxArity(3), s.object({ method: s.function().maxArity(3).required(), from: s.array().items(s.string()).single() })], flags: s.object().pattern(n.nameRx, s.object({ setter: s.string(), default: s.any() })), manifest: { build: s.function().arity(2) }, messages: [s.object(), s.string()], modifiers: s.object().pattern(n.nameRx, s.function().minArity(1).maxArity(2)), overrides: s.object().pattern(n.nameRx, s.function()), prepare: s.function().maxArity(3), rebuild: s.function().arity(1), rules: s.object().pattern(n.nameRx, n.rule), terms: s.object().pattern(n.nameRx, s.object({ init: s.array().allow(null).required(), manifest: s.object().pattern(/.+/, [s.valid("schema", "single"), s.object({ mapped: s.object({ from: s.string().required(), to: s.string().required() }).required() })]) })), validate: s.function().maxArity(3) }).strict(), t2.extensions = s.array().items(s.object(), s.function().arity(1)).strict(), n.desc = { buffer: s.object({ buffer: s.string() }), func: s.object({ function: s.function().required(), options: { literal: true } }), override: s.object({ override: true }), ref: s.object({ ref: s.object({ type: s.valid("value", "global", "local"), path: s.array().required(), separator: s.string().length(1).allow(false), ancestor: s.number().min(0).integer().allow("root"), map: s.array().items(s.array().length(2)).min(1), adjust: s.function(), iterables: s.boolean(), in: s.boolean(), render: s.boolean() }).required() }), regex: s.object({ regex: s.string().min(3) }), special: s.object({ special: s.valid("deep").required() }), template: s.object({ template: s.string().required(), options: s.object() }), value: s.object({ value: s.alternatives([s.object(), s.array()]).required() }) }, n.desc.entity = s.alternatives([s.array().items(s.link("...")), s.boolean(), s.function(), s.number(), s.string(), n.desc.buffer, n.desc.func, n.desc.ref, n.desc.regex, n.desc.special, n.desc.template, n.desc.value, s.link("/")]), n.desc.values = s.array().items(null, s.boolean(), s.function(), s.number().allow(1 / 0, -1 / 0), s.string().allow(""), s.symbol(), n.desc.buffer, n.desc.func, n.desc.override, n.desc.ref, n.desc.regex, n.desc.template, n.desc.value), n.desc.messages = s.object().pattern(/.+/, [s.string(), n.desc.template, s.object().pattern(/.+/, [s.string(), n.desc.template])]), t2.description = s.object({ type: s.string().required(), flags: s.object({ cast: s.string(), default: s.any(), description: s.string(), empty: s.link("/"), failover: n.desc.entity, id: s.string(), label: s.string(), only: true, presence: ["optional", "required", "forbidden"], result: ["raw", "strip"], strip: s.boolean(), unit: s.string() }).unknown(), preferences: { allowUnknown: s.boolean(), abortEarly: s.boolean(), artifacts: s.boolean(), cache: s.boolean(), convert: s.boolean(), dateFormat: ["date", "iso", "string", "time", "utc"], errors: { escapeHtml: s.boolean(), label: ["path", "key"], language: [s.string(), n.desc.ref], wrap: { label: n.wrap, array: n.wrap } }, externals: s.boolean(), messages: n.desc.messages, noDefaults: s.boolean(), nonEnumerables: s.boolean(), presence: ["required", "optional", "forbidden"], skipFunctions: s.boolean(), stripUnknown: s.object({ arrays: s.boolean(), objects: s.boolean() }).or("arrays", "objects").allow(true, false), warnings: s.boolean() }, allow: n.desc.values, invalid: n.desc.values, rules: s.array().min(1).items({ name: s.string().required(), args: s.object().min(1), keep: s.boolean(), message: [s.string(), n.desc.messages], warn: s.boolean() }), keys: s.object().pattern(/.*/, s.link("/")), link: n.desc.ref }).pattern(/^[a-z]\w*$/, s.any());
      }, 493: (e3, t2, r) => {
        "use strict";
        const s = r(8571), n = r(9621), a = r(8160), i = { value: Symbol("value") };
        e3.exports = i.State = class {
          constructor(e4, t3, r2) {
            this.path = e4, this.ancestors = t3, this.mainstay = r2.mainstay, this.schemas = r2.schemas, this.debug = null;
          }
          localize(e4, t3 = null, r2 = null) {
            const s2 = new i.State(e4, t3, this);
            return r2 && s2.schemas && (s2.schemas = [i.schemas(r2), ...s2.schemas]), s2;
          }
          nest(e4, t3) {
            const r2 = new i.State(this.path, this.ancestors, this);
            return r2.schemas = r2.schemas && [i.schemas(e4), ...r2.schemas], r2.debug = t3, r2;
          }
          shadow(e4, t3) {
            this.mainstay.shadow = this.mainstay.shadow || new i.Shadow(), this.mainstay.shadow.set(this.path, e4, t3);
          }
          snapshot() {
            this.mainstay.shadow && (this._snapshot = s(this.mainstay.shadow.node(this.path))), this.mainstay.snapshot();
          }
          restore() {
            this.mainstay.shadow && (this.mainstay.shadow.override(this.path, this._snapshot), this._snapshot = void 0), this.mainstay.restore();
          }
          commit() {
            this.mainstay.shadow && (this.mainstay.shadow.override(this.path, this._snapshot), this._snapshot = void 0), this.mainstay.commit();
          }
        }, i.schemas = function(e4) {
          return a.isSchema(e4) ? { schema: e4 } : e4;
        }, i.Shadow = class {
          constructor() {
            this._values = null;
          }
          set(e4, t3, r2) {
            if (!e4.length) return;
            if ("strip" === r2 && "number" == typeof e4[e4.length - 1]) return;
            this._values = this._values || /* @__PURE__ */ new Map();
            let s2 = this._values;
            for (let t4 = 0; t4 < e4.length; ++t4) {
              const r3 = e4[t4];
              let n2 = s2.get(r3);
              n2 || (n2 = /* @__PURE__ */ new Map(), s2.set(r3, n2)), s2 = n2;
            }
            s2[i.value] = t3;
          }
          get(e4) {
            const t3 = this.node(e4);
            if (t3) return t3[i.value];
          }
          node(e4) {
            if (this._values) return n(this._values, e4, { iterables: true });
          }
          override(e4, t3) {
            if (!this._values) return;
            const r2 = e4.slice(0, -1), s2 = e4[e4.length - 1], a2 = n(this._values, r2, { iterables: true });
            t3 ? a2.set(s2, t3) : a2 && a2.delete(s2);
          }
        };
      }, 3328: (e3, t2, r) => {
        "use strict";
        const s = r(375), n = r(8571), a = r(5277), i = r(1447), o = r(8160), l = r(6354), c = r(6133), u = { symbol: Symbol("template"), opens: new Array(1e3).join("\0"), closes: new Array(1e3).join(""), dateFormat: { date: Date.prototype.toDateString, iso: Date.prototype.toISOString, string: Date.prototype.toString, time: Date.prototype.toTimeString, utc: Date.prototype.toUTCString } };
        e3.exports = u.Template = class {
          constructor(e4, t3) {
            if (s("string" == typeof e4, "Template source must be a string"), s(!e4.includes("\0") && !e4.includes(""), "Template source cannot contain reserved control characters"), this.source = e4, this.rendered = e4, this._template = null, t3) {
              const { functions: e5, ...r2 } = t3;
              this._settings = Object.keys(r2).length ? n(r2) : void 0, this._functions = e5, this._functions && (s(Object.keys(this._functions).every((e6) => "string" == typeof e6), "Functions keys must be strings"), s(Object.values(this._functions).every((e6) => "function" == typeof e6), "Functions values must be functions"));
            } else this._settings = void 0, this._functions = void 0;
            this._parse();
          }
          _parse() {
            if (!this.source.includes("{")) return;
            const e4 = u.encode(this.source), t3 = u.split(e4);
            let r2 = false;
            const s2 = [], n2 = t3.shift();
            n2 && s2.push(n2);
            for (const e5 of t3) {
              const t4 = "{" !== e5[0], n3 = t4 ? "}" : "}}", a2 = e5.indexOf(n3);
              if (-1 === a2 || "{" === e5[1]) {
                s2.push(`{${u.decode(e5)}`);
                continue;
              }
              let i2 = e5.slice(t4 ? 0 : 1, a2);
              const o2 = ":" === i2[0];
              o2 && (i2 = i2.slice(1));
              const l2 = this._ref(u.decode(i2), { raw: t4, wrapped: o2 });
              s2.push(l2), "string" != typeof l2 && (r2 = true);
              const c2 = e5.slice(a2 + n3.length);
              c2 && s2.push(u.decode(c2));
            }
            r2 ? this._template = s2 : this.rendered = s2.join("");
          }
          static date(e4, t3) {
            return u.dateFormat[t3.dateFormat].call(e4);
          }
          describe(e4 = {}) {
            if (!this._settings && e4.compact) return this.source;
            const t3 = { template: this.source };
            return this._settings && (t3.options = this._settings), this._functions && (t3.functions = this._functions), t3;
          }
          static build(e4) {
            return new u.Template(e4.template, e4.options || e4.functions ? { ...e4.options, functions: e4.functions } : void 0);
          }
          isDynamic() {
            return !!this._template;
          }
          static isTemplate(e4) {
            return !!e4 && !!e4[o.symbols.template];
          }
          refs() {
            if (!this._template) return;
            const e4 = [];
            for (const t3 of this._template) "string" != typeof t3 && e4.push(...t3.refs);
            return e4;
          }
          resolve(e4, t3, r2, s2) {
            return this._template && 1 === this._template.length ? this._part(this._template[0], e4, t3, r2, s2, {}) : this.render(e4, t3, r2, s2);
          }
          _part(e4, ...t3) {
            return e4.ref ? e4.ref.resolve(...t3) : e4.formula.evaluate(t3);
          }
          render(e4, t3, r2, s2, n2 = {}) {
            if (!this.isDynamic()) return this.rendered;
            const i2 = [];
            for (const o2 of this._template) if ("string" == typeof o2) i2.push(o2);
            else {
              const l2 = this._part(o2, e4, t3, r2, s2, n2), c2 = u.stringify(l2, e4, t3, r2, s2, n2);
              if (void 0 !== c2) {
                const e5 = o2.raw || false === (n2.errors && n2.errors.escapeHtml) ? c2 : a(c2);
                i2.push(u.wrap(e5, o2.wrapped && r2.errors.wrap.label));
              }
            }
            return i2.join("");
          }
          _ref(e4, { raw: t3, wrapped: r2 }) {
            const s2 = [], n2 = /* @__PURE__ */ __name((e5) => {
              const t4 = c.create(e5, this._settings);
              return s2.push(t4), (e6) => {
                const r3 = t4.resolve(...e6);
                return void 0 !== r3 ? r3 : null;
              };
            }, "n");
            try {
              const t4 = this._functions ? { ...u.functions, ...this._functions } : u.functions;
              var a2 = new i.Parser(e4, { reference: n2, functions: t4, constants: u.constants });
            } catch (t4) {
              throw t4.message = `Invalid template variable "${e4}" fails due to: ${t4.message}`, t4;
            }
            if (a2.single) {
              if ("reference" === a2.single.type) {
                const e5 = s2[0];
                return { ref: e5, raw: t3, refs: s2, wrapped: r2 || "local" === e5.type && "label" === e5.key };
              }
              return u.stringify(a2.single.value);
            }
            return { formula: a2, raw: t3, refs: s2 };
          }
          toString() {
            return this.source;
          }
        }, u.Template.prototype[o.symbols.template] = true, u.Template.prototype.isImmutable = true, u.encode = function(e4) {
          return e4.replace(/\\(\{+)/g, (e5, t3) => u.opens.slice(0, t3.length)).replace(/\\(\}+)/g, (e5, t3) => u.closes.slice(0, t3.length));
        }, u.decode = function(e4) {
          return e4.replace(/\u0000/g, "{").replace(/\u0001/g, "}");
        }, u.split = function(e4) {
          const t3 = [];
          let r2 = "";
          for (let s2 = 0; s2 < e4.length; ++s2) {
            const n2 = e4[s2];
            if ("{" === n2) {
              let n3 = "";
              for (; s2 + 1 < e4.length && "{" === e4[s2 + 1]; ) n3 += "{", ++s2;
              t3.push(r2), r2 = n3;
            } else r2 += n2;
          }
          return t3.push(r2), t3;
        }, u.wrap = function(e4, t3) {
          return t3 ? 1 === t3.length ? `${t3}${e4}${t3}` : `${t3[0]}${e4}${t3[1]}` : e4;
        }, u.stringify = function(e4, t3, r2, s2, n2, a2 = {}) {
          const i2 = typeof e4, o2 = s2 && s2.errors && s2.errors.wrap || {};
          let l2 = false;
          if (c.isRef(e4) && e4.render && (l2 = e4.in, e4 = e4.resolve(t3, r2, s2, n2, { in: e4.in, ...a2 })), null === e4) return "null";
          if ("string" === i2) return u.wrap(e4, a2.arrayItems && o2.string);
          if ("number" === i2 || "function" === i2 || "symbol" === i2) return e4.toString();
          if ("object" !== i2) return JSON.stringify(e4);
          if (e4 instanceof Date) return u.Template.date(e4, s2);
          if (e4 instanceof Map) {
            const t4 = [];
            for (const [r3, s3] of e4.entries()) t4.push(`${r3.toString()} -> ${s3.toString()}`);
            e4 = t4;
          }
          if (!Array.isArray(e4)) return e4.toString();
          const f = [];
          for (const i3 of e4) f.push(u.stringify(i3, t3, r2, s2, n2, { arrayItems: true, ...a2 }));
          return u.wrap(f.join(", "), !l2 && o2.array);
        }, u.constants = { true: true, false: false, null: null, second: 1e3, minute: 6e4, hour: 36e5, day: 864e5 }, u.functions = { if: /* @__PURE__ */ __name((e4, t3, r2) => e4 ? t3 : r2, "if"), length: /* @__PURE__ */ __name((e4) => "string" == typeof e4 ? e4.length : e4 && "object" == typeof e4 ? Array.isArray(e4) ? e4.length : Object.keys(e4).length : null, "length"), msg(e4) {
          const [t3, r2, s2, n2, a2] = this, i2 = a2.messages;
          if (!i2) return "";
          const o2 = l.template(t3, i2[0], e4, r2, s2) || l.template(t3, i2[1], e4, r2, s2);
          return o2 ? o2.render(t3, r2, s2, n2, a2) : "";
        }, number: /* @__PURE__ */ __name((e4) => "number" == typeof e4 ? e4 : "string" == typeof e4 ? parseFloat(e4) : "boolean" == typeof e4 ? e4 ? 1 : 0 : e4 instanceof Date ? e4.getTime() : null, "number") };
      }, 4946: (e3, t2, r) => {
        "use strict";
        const s = r(375), n = r(1687), a = r(8068), i = r(8160), o = r(3292), l = r(6354), c = r(6133), u = {};
        e3.exports = a.extend({ type: "alternatives", flags: { match: { default: "any" } }, terms: { matches: { init: [], register: c.toSibling } }, args: /* @__PURE__ */ __name((e4, ...t3) => 1 === t3.length && Array.isArray(t3[0]) ? e4.try(...t3[0]) : e4.try(...t3), "args"), validate(e4, t3) {
          const { schema: r2, error: s2, state: a2, prefs: i2 } = t3;
          if (r2._flags.match) {
            const t4 = [], o3 = [];
            for (let s3 = 0; s3 < r2.$_terms.matches.length; ++s3) {
              const n2 = r2.$_terms.matches[s3], l2 = a2.nest(n2.schema, `match.${s3}`);
              l2.snapshot();
              const c3 = n2.schema.$_validate(e4, l2, i2);
              c3.errors ? (o3.push(c3.errors), l2.restore()) : (t4.push(c3.value), l2.commit());
            }
            if (0 === t4.length) return { errors: s2("alternatives.any", { details: o3.map((e5) => l.details(e5, { override: false })) }) };
            if ("one" === r2._flags.match) return 1 === t4.length ? { value: t4[0] } : { errors: s2("alternatives.one") };
            if (t4.length !== r2.$_terms.matches.length) return { errors: s2("alternatives.all", { details: o3.map((e5) => l.details(e5, { override: false })) }) };
            const c2 = /* @__PURE__ */ __name((e5) => e5.$_terms.matches.some((e6) => "object" === e6.schema.type || "alternatives" === e6.schema.type && c2(e6.schema)), "c");
            return c2(r2) ? { value: t4.reduce((e5, t5) => n(e5, t5, { mergeArrays: false })) } : { value: t4[t4.length - 1] };
          }
          const o2 = [];
          for (let t4 = 0; t4 < r2.$_terms.matches.length; ++t4) {
            const s3 = r2.$_terms.matches[t4];
            if (s3.schema) {
              const r3 = a2.nest(s3.schema, `match.${t4}`);
              r3.snapshot();
              const n3 = s3.schema.$_validate(e4, r3, i2);
              if (!n3.errors) return r3.commit(), n3;
              r3.restore(), o2.push({ schema: s3.schema, reports: n3.errors });
              continue;
            }
            const n2 = s3.ref ? s3.ref.resolve(e4, a2, i2) : e4, l2 = s3.is ? [s3] : s3.switch;
            for (let r3 = 0; r3 < l2.length; ++r3) {
              const o3 = l2[r3], { is: c2, then: u2, otherwise: f } = o3, m = `match.${t4}${s3.switch ? "." + r3 : ""}`;
              if (c2.$_match(n2, a2.nest(c2, `${m}.is`), i2)) {
                if (u2) return u2.$_validate(e4, a2.nest(u2, `${m}.then`), i2);
              } else if (f) return f.$_validate(e4, a2.nest(f, `${m}.otherwise`), i2);
            }
          }
          return u.errors(o2, t3);
        }, rules: { conditional: { method(e4, t3) {
          s(!this._flags._endedSwitch, "Unreachable condition"), s(!this._flags.match, "Cannot combine match mode", this._flags.match, "with conditional rule"), s(void 0 === t3.break, "Cannot use break option with alternatives conditional");
          const r2 = this.clone(), n2 = o.when(r2, e4, t3), a2 = n2.is ? [n2] : n2.switch;
          for (const e5 of a2) if (e5.then && e5.otherwise) {
            r2.$_setFlag("_endedSwitch", true, { clone: false });
            break;
          }
          return r2.$_terms.matches.push(n2), r2.$_mutateRebuild();
        } }, match: { method(e4) {
          if (s(["any", "one", "all"].includes(e4), "Invalid alternatives match mode", e4), "any" !== e4) for (const t3 of this.$_terms.matches) s(t3.schema, "Cannot combine match mode", e4, "with conditional rules");
          return this.$_setFlag("match", e4);
        } }, try: { method(...e4) {
          s(e4.length, "Missing alternative schemas"), i.verifyFlat(e4, "try"), s(!this._flags._endedSwitch, "Unreachable condition");
          const t3 = this.clone();
          for (const r2 of e4) t3.$_terms.matches.push({ schema: t3.$_compile(r2) });
          return t3.$_mutateRebuild();
        } } }, overrides: { label(e4) {
          return this.$_parent("label", e4).$_modify({ each: /* @__PURE__ */ __name((t3, r2) => "is" !== r2.path[0] && "string" != typeof t3._flags.label ? t3.label(e4) : void 0, "each"), ref: false });
        } }, rebuild(e4) {
          e4.$_modify({ each: /* @__PURE__ */ __name((t3) => {
            i.isSchema(t3) && "array" === t3.type && e4.$_setFlag("_arrayItems", true, { clone: false });
          }, "each") });
        }, manifest: { build(e4, t3) {
          if (t3.matches) for (const r2 of t3.matches) {
            const { schema: t4, ref: s2, is: n2, not: a2, then: i2, otherwise: o2 } = r2;
            e4 = t4 ? e4.try(t4) : s2 ? e4.conditional(s2, { is: n2, then: i2, not: a2, otherwise: o2, switch: r2.switch }) : e4.conditional(n2, { then: i2, otherwise: o2 });
          }
          return e4;
        } }, messages: { "alternatives.all": "{{#label}} does not match all of the required types", "alternatives.any": "{{#label}} does not match any of the allowed types", "alternatives.match": "{{#label}} does not match any of the allowed types", "alternatives.one": "{{#label}} matches more than one allowed type", "alternatives.types": "{{#label}} must be one of {{#types}}" } }), u.errors = function(e4, { error: t3, state: r2 }) {
          if (!e4.length) return { errors: t3("alternatives.any") };
          if (1 === e4.length) return { errors: e4[0].reports };
          const s2 = /* @__PURE__ */ new Set(), n2 = [];
          for (const { reports: a2, schema: i2 } of e4) {
            if (a2.length > 1) return u.unmatched(e4, t3);
            const o2 = a2[0];
            if (o2 instanceof l.Report == 0) return u.unmatched(e4, t3);
            if (o2.state.path.length !== r2.path.length) {
              n2.push({ type: i2.type, report: o2 });
              continue;
            }
            if ("any.only" === o2.code) {
              for (const e5 of o2.local.valids) s2.add(e5);
              continue;
            }
            const [c2, f] = o2.code.split(".");
            "base" !== f ? n2.push({ type: i2.type, report: o2 }) : "object.base" === o2.code ? s2.add(o2.local.type) : s2.add(c2);
          }
          return n2.length ? 1 === n2.length ? { errors: n2[0].report } : u.unmatched(e4, t3) : { errors: t3("alternatives.types", { types: [...s2] }) };
        }, u.unmatched = function(e4, t3) {
          const r2 = [];
          for (const t4 of e4) r2.push(...t4.reports);
          return { errors: t3("alternatives.match", l.details(r2, { override: false })) };
        };
      }, 8068: (e3, t2, r) => {
        "use strict";
        const s = r(375), n = r(7629), a = r(8160), i = r(6914);
        e3.exports = n.extend({ type: "any", flags: { only: { default: false } }, terms: { alterations: { init: null }, examples: { init: null }, externals: { init: null }, metas: { init: [] }, notes: { init: [] }, shared: { init: null }, tags: { init: [] }, whens: { init: null } }, rules: { custom: { method(e4, t3) {
          return s("function" == typeof e4, "Method must be a function"), s(void 0 === t3 || t3 && "string" == typeof t3, "Description must be a non-empty string"), this.$_addRule({ name: "custom", args: { method: e4, description: t3 } });
        }, validate(e4, t3, { method: r2 }) {
          try {
            return r2(e4, t3);
          } catch (e5) {
            return t3.error("any.custom", { error: e5 });
          }
        }, args: ["method", "description"], multi: true }, messages: { method(e4) {
          return this.prefs({ messages: e4 });
        } }, shared: { method(e4) {
          s(a.isSchema(e4) && e4._flags.id, "Schema must be a schema with an id");
          const t3 = this.clone();
          return t3.$_terms.shared = t3.$_terms.shared || [], t3.$_terms.shared.push(e4), t3.$_mutateRegister(e4), t3;
        } }, warning: { method(e4, t3) {
          return s(e4 && "string" == typeof e4, "Invalid warning code"), this.$_addRule({ name: "warning", args: { code: e4, local: t3 }, warn: true });
        }, validate: /* @__PURE__ */ __name((e4, t3, { code: r2, local: s2 }) => t3.error(r2, s2), "validate"), args: ["code", "local"], multi: true } }, modifiers: { keep(e4, t3 = true) {
          e4.keep = t3;
        }, message(e4, t3) {
          e4.message = i.compile(t3);
        }, warn(e4, t3 = true) {
          e4.warn = t3;
        } }, manifest: { build(e4, t3) {
          for (const r2 in t3) {
            const s2 = t3[r2];
            if (["examples", "externals", "metas", "notes", "tags"].includes(r2)) for (const t4 of s2) e4 = e4[r2.slice(0, -1)](t4);
            else if ("alterations" !== r2) if ("whens" !== r2) {
              if ("shared" === r2) for (const t4 of s2) e4 = e4.shared(t4);
            } else for (const t4 of s2) {
              const { ref: r3, is: s3, not: n2, then: a2, otherwise: i2, concat: o } = t4;
              e4 = o ? e4.concat(o) : r3 ? e4.when(r3, { is: s3, not: n2, then: a2, otherwise: i2, switch: t4.switch, break: t4.break }) : e4.when(s3, { then: a2, otherwise: i2, break: t4.break });
            }
            else {
              const t4 = {};
              for (const { target: e5, adjuster: r3 } of s2) t4[e5] = r3;
              e4 = e4.alter(t4);
            }
          }
          return e4;
        } }, messages: { "any.custom": "{{#label}} failed custom validation because {{#error.message}}", "any.default": "{{#label}} threw an error when running default method", "any.failover": "{{#label}} threw an error when running failover method", "any.invalid": "{{#label}} contains an invalid value", "any.only": '{{#label}} must be {if(#valids.length == 1, "", "one of ")}{{#valids}}', "any.ref": "{{#label}} {{#arg}} references {{:#ref}} which {{#reason}}", "any.required": "{{#label}} is required", "any.unknown": "{{#label}} is not allowed" } });
      }, 546: (e3, t2, r) => {
        "use strict";
        const s = r(375), n = r(9474), a = r(9621), i = r(8068), o = r(8160), l = r(3292), c = {};
        e3.exports = i.extend({ type: "array", flags: { single: { default: false }, sparse: { default: false } }, terms: { items: { init: [], manifest: "schema" }, ordered: { init: [], manifest: "schema" }, _exclusions: { init: [] }, _inclusions: { init: [] }, _requireds: { init: [] } }, coerce: { from: "object", method(e4, { schema: t3, state: r2, prefs: s2 }) {
          if (!Array.isArray(e4)) return;
          const n2 = t3.$_getRule("sort");
          return n2 ? c.sort(t3, e4, n2.args.options, r2, s2) : void 0;
        } }, validate(e4, { schema: t3, error: r2 }) {
          if (!Array.isArray(e4)) {
            if (t3._flags.single) {
              const t4 = [e4];
              return t4[o.symbols.arraySingle] = true, { value: t4 };
            }
            return { errors: r2("array.base") };
          }
          if (t3.$_getRule("items") || t3.$_terms.externals) return { value: e4.slice() };
        }, rules: { has: { method(e4) {
          e4 = this.$_compile(e4, { appendPath: true });
          const t3 = this.$_addRule({ name: "has", args: { schema: e4 } });
          return t3.$_mutateRegister(e4), t3;
        }, validate(e4, { state: t3, prefs: r2, error: s2 }, { schema: n2 }) {
          const a2 = [e4, ...t3.ancestors];
          for (let s3 = 0; s3 < e4.length; ++s3) {
            const i3 = t3.localize([...t3.path, s3], a2, n2);
            if (n2.$_match(e4[s3], i3, r2)) return e4;
          }
          const i2 = n2._flags.label;
          return i2 ? s2("array.hasKnown", { patternLabel: i2 }) : s2("array.hasUnknown", null);
        }, multi: true }, items: { method(...e4) {
          o.verifyFlat(e4, "items");
          const t3 = this.$_addRule("items");
          for (let r2 = 0; r2 < e4.length; ++r2) {
            const s2 = o.tryWithPath(() => this.$_compile(e4[r2]), r2, { append: true });
            t3.$_terms.items.push(s2);
          }
          return t3.$_mutateRebuild();
        }, validate(e4, { schema: t3, error: r2, state: s2, prefs: n2, errorsArray: a2 }) {
          const i2 = t3.$_terms._requireds.slice(), l2 = t3.$_terms.ordered.slice(), u = [...t3.$_terms._inclusions, ...i2], f = !e4[o.symbols.arraySingle];
          delete e4[o.symbols.arraySingle];
          const m = a2();
          let h = e4.length;
          for (let a3 = 0; a3 < h; ++a3) {
            const o2 = e4[a3];
            let d = false, p = false;
            const g = f ? a3 : new Number(a3), y = [...s2.path, g];
            if (!t3._flags.sparse && void 0 === o2) {
              if (m.push(r2("array.sparse", { key: g, path: y, pos: a3, value: void 0 }, s2.localize(y))), n2.abortEarly) return m;
              l2.shift();
              continue;
            }
            const b = [e4, ...s2.ancestors];
            for (const e5 of t3.$_terms._exclusions) if (e5.$_match(o2, s2.localize(y, b, e5), n2, { presence: "ignore" })) {
              if (m.push(r2("array.excludes", { pos: a3, value: o2 }, s2.localize(y))), n2.abortEarly) return m;
              d = true, l2.shift();
              break;
            }
            if (d) continue;
            if (t3.$_terms.ordered.length) {
              if (l2.length) {
                const i3 = l2.shift(), u2 = i3.$_validate(o2, s2.localize(y, b, i3), n2);
                if (u2.errors) {
                  if (m.push(...u2.errors), n2.abortEarly) return m;
                } else if ("strip" === i3._flags.result) c.fastSplice(e4, a3), --a3, --h;
                else {
                  if (!t3._flags.sparse && void 0 === u2.value) {
                    if (m.push(r2("array.sparse", { key: g, path: y, pos: a3, value: void 0 }, s2.localize(y))), n2.abortEarly) return m;
                    continue;
                  }
                  e4[a3] = u2.value;
                }
                continue;
              }
              if (!t3.$_terms.items.length) {
                if (m.push(r2("array.orderedLength", { pos: a3, limit: t3.$_terms.ordered.length })), n2.abortEarly) return m;
                break;
              }
            }
            const v = [];
            let _ = i2.length;
            for (let l3 = 0; l3 < _; ++l3) {
              const u2 = s2.localize(y, b, i2[l3]);
              u2.snapshot();
              const f2 = i2[l3].$_validate(o2, u2, n2);
              if (v[l3] = f2, !f2.errors) {
                if (u2.commit(), e4[a3] = f2.value, p = true, c.fastSplice(i2, l3), --l3, --_, !t3._flags.sparse && void 0 === f2.value && (m.push(r2("array.sparse", { key: g, path: y, pos: a3, value: void 0 }, s2.localize(y))), n2.abortEarly)) return m;
                break;
              }
              u2.restore();
            }
            if (p) continue;
            const w = n2.stripUnknown && !!n2.stripUnknown.arrays || false;
            _ = u.length;
            for (const l3 of u) {
              let u2;
              const f2 = i2.indexOf(l3);
              if (-1 !== f2) u2 = v[f2];
              else {
                const i3 = s2.localize(y, b, l3);
                if (i3.snapshot(), u2 = l3.$_validate(o2, i3, n2), !u2.errors) {
                  i3.commit(), "strip" === l3._flags.result ? (c.fastSplice(e4, a3), --a3, --h) : t3._flags.sparse || void 0 !== u2.value ? e4[a3] = u2.value : (m.push(r2("array.sparse", { key: g, path: y, pos: a3, value: void 0 }, s2.localize(y))), d = true), p = true;
                  break;
                }
                i3.restore();
              }
              if (1 === _) {
                if (w) {
                  c.fastSplice(e4, a3), --a3, --h, p = true;
                  break;
                }
                if (m.push(...u2.errors), n2.abortEarly) return m;
                d = true;
                break;
              }
            }
            if (!d && (t3.$_terms._inclusions.length || t3.$_terms._requireds.length) && !p) {
              if (w) {
                c.fastSplice(e4, a3), --a3, --h;
                continue;
              }
              if (m.push(r2("array.includes", { pos: a3, value: o2 }, s2.localize(y))), n2.abortEarly) return m;
            }
          }
          return i2.length && c.fillMissedErrors(t3, m, i2, e4, s2, n2), l2.length && (c.fillOrderedErrors(t3, m, l2, e4, s2, n2), m.length || c.fillDefault(l2, e4, s2, n2)), m.length ? m : e4;
        }, priority: true, manifest: false }, length: { method(e4) {
          return this.$_addRule({ name: "length", args: { limit: e4 }, operator: "=" });
        }, validate: /* @__PURE__ */ __name((e4, t3, { limit: r2 }, { name: s2, operator: n2, args: a2 }) => o.compare(e4.length, r2, n2) ? e4 : t3.error("array." + s2, { limit: a2.limit, value: e4 }), "validate"), args: [{ name: "limit", ref: true, assert: o.limit, message: "must be a positive integer" }] }, max: { method(e4) {
          return this.$_addRule({ name: "max", method: "length", args: { limit: e4 }, operator: "<=" });
        } }, min: { method(e4) {
          return this.$_addRule({ name: "min", method: "length", args: { limit: e4 }, operator: ">=" });
        } }, ordered: { method(...e4) {
          o.verifyFlat(e4, "ordered");
          const t3 = this.$_addRule("items");
          for (let r2 = 0; r2 < e4.length; ++r2) {
            const s2 = o.tryWithPath(() => this.$_compile(e4[r2]), r2, { append: true });
            c.validateSingle(s2, t3), t3.$_mutateRegister(s2), t3.$_terms.ordered.push(s2);
          }
          return t3.$_mutateRebuild();
        } }, single: { method(e4) {
          const t3 = void 0 === e4 || !!e4;
          return s(!t3 || !this._flags._arrayItems, "Cannot specify single rule when array has array items"), this.$_setFlag("single", t3);
        } }, sort: { method(e4 = {}) {
          o.assertOptions(e4, ["by", "order"]);
          const t3 = { order: e4.order || "ascending" };
          return e4.by && (t3.by = l.ref(e4.by, { ancestor: 0 }), s(!t3.by.ancestor, "Cannot sort by ancestor")), this.$_addRule({ name: "sort", args: { options: t3 } });
        }, validate(e4, { error: t3, state: r2, prefs: s2, schema: n2 }, { options: a2 }) {
          const { value: i2, errors: o2 } = c.sort(n2, e4, a2, r2, s2);
          if (o2) return o2;
          for (let r3 = 0; r3 < e4.length; ++r3) if (e4[r3] !== i2[r3]) return t3("array.sort", { order: a2.order, by: a2.by ? a2.by.key : "value" });
          return e4;
        }, convert: true }, sparse: { method(e4) {
          const t3 = void 0 === e4 || !!e4;
          return this._flags.sparse === t3 ? this : (t3 ? this.clone() : this.$_addRule("items")).$_setFlag("sparse", t3, { clone: false });
        } }, unique: { method(e4, t3 = {}) {
          s(!e4 || "function" == typeof e4 || "string" == typeof e4, "comparator must be a function or a string"), o.assertOptions(t3, ["ignoreUndefined", "separator"]);
          const r2 = { name: "unique", args: { options: t3, comparator: e4 } };
          if (e4) if ("string" == typeof e4) {
            const s2 = o.default(t3.separator, ".");
            r2.path = s2 ? e4.split(s2) : [e4];
          } else r2.comparator = e4;
          return this.$_addRule(r2);
        }, validate(e4, { state: t3, error: r2, schema: i2 }, { comparator: o2, options: l2 }, { comparator: c2, path: u }) {
          const f = { string: /* @__PURE__ */ Object.create(null), number: /* @__PURE__ */ Object.create(null), undefined: /* @__PURE__ */ Object.create(null), boolean: /* @__PURE__ */ Object.create(null), bigint: /* @__PURE__ */ Object.create(null), object: /* @__PURE__ */ new Map(), function: /* @__PURE__ */ new Map(), custom: /* @__PURE__ */ new Map() }, m = c2 || n, h = l2.ignoreUndefined;
          for (let n2 = 0; n2 < e4.length; ++n2) {
            const i3 = u ? a(e4[n2], u) : e4[n2], l3 = c2 ? f.custom : f[typeof i3];
            if (s(l3, "Failed to find unique map container for type", typeof i3), l3 instanceof Map) {
              const s2 = l3.entries();
              let a2;
              for (; !(a2 = s2.next()).done; ) if (m(a2.value[0], i3)) {
                const s3 = t3.localize([...t3.path, n2], [e4, ...t3.ancestors]), i4 = { pos: n2, value: e4[n2], dupePos: a2.value[1], dupeValue: e4[a2.value[1]] };
                return u && (i4.path = o2), r2("array.unique", i4, s3);
              }
              l3.set(i3, n2);
            } else {
              if ((!h || void 0 !== i3) && void 0 !== l3[i3]) {
                const s2 = { pos: n2, value: e4[n2], dupePos: l3[i3], dupeValue: e4[l3[i3]] };
                return u && (s2.path = o2), r2("array.unique", s2, t3.localize([...t3.path, n2], [e4, ...t3.ancestors]));
              }
              l3[i3] = n2;
            }
          }
          return e4;
        }, args: ["comparator", "options"], multi: true } }, cast: { set: { from: Array.isArray, to: /* @__PURE__ */ __name((e4, t3) => new Set(e4), "to") } }, rebuild(e4) {
          e4.$_terms._inclusions = [], e4.$_terms._exclusions = [], e4.$_terms._requireds = [];
          for (const t3 of e4.$_terms.items) c.validateSingle(t3, e4), "required" === t3._flags.presence ? e4.$_terms._requireds.push(t3) : "forbidden" === t3._flags.presence ? e4.$_terms._exclusions.push(t3) : e4.$_terms._inclusions.push(t3);
          for (const t3 of e4.$_terms.ordered) c.validateSingle(t3, e4);
        }, manifest: { build: /* @__PURE__ */ __name((e4, t3) => (t3.items && (e4 = e4.items(...t3.items)), t3.ordered && (e4 = e4.ordered(...t3.ordered)), e4), "build") }, messages: { "array.base": "{{#label}} must be an array", "array.excludes": "{{#label}} contains an excluded value", "array.hasKnown": "{{#label}} does not contain at least one required match for type {:#patternLabel}", "array.hasUnknown": "{{#label}} does not contain at least one required match", "array.includes": "{{#label}} does not match any of the allowed types", "array.includesRequiredBoth": "{{#label}} does not contain {{#knownMisses}} and {{#unknownMisses}} other required value(s)", "array.includesRequiredKnowns": "{{#label}} does not contain {{#knownMisses}}", "array.includesRequiredUnknowns": "{{#label}} does not contain {{#unknownMisses}} required value(s)", "array.length": "{{#label}} must contain {{#limit}} items", "array.max": "{{#label}} must contain less than or equal to {{#limit}} items", "array.min": "{{#label}} must contain at least {{#limit}} items", "array.orderedLength": "{{#label}} must contain at most {{#limit}} items", "array.sort": "{{#label}} must be sorted in {#order} order by {{#by}}", "array.sort.mismatching": "{{#label}} cannot be sorted due to mismatching types", "array.sort.unsupported": "{{#label}} cannot be sorted due to unsupported type {#type}", "array.sparse": "{{#label}} must not be a sparse array item", "array.unique": "{{#label}} contains a duplicate value" } }), c.fillMissedErrors = function(e4, t3, r2, s2, n2, a2) {
          const i2 = [];
          let o2 = 0;
          for (const e5 of r2) {
            const t4 = e5._flags.label;
            t4 ? i2.push(t4) : ++o2;
          }
          i2.length ? o2 ? t3.push(e4.$_createError("array.includesRequiredBoth", s2, { knownMisses: i2, unknownMisses: o2 }, n2, a2)) : t3.push(e4.$_createError("array.includesRequiredKnowns", s2, { knownMisses: i2 }, n2, a2)) : t3.push(e4.$_createError("array.includesRequiredUnknowns", s2, { unknownMisses: o2 }, n2, a2));
        }, c.fillOrderedErrors = function(e4, t3, r2, s2, n2, a2) {
          const i2 = [];
          for (const e5 of r2) "required" === e5._flags.presence && i2.push(e5);
          i2.length && c.fillMissedErrors(e4, t3, i2, s2, n2, a2);
        }, c.fillDefault = function(e4, t3, r2, s2) {
          const n2 = [];
          let a2 = true;
          for (let i2 = e4.length - 1; i2 >= 0; --i2) {
            const o2 = e4[i2], l2 = [t3, ...r2.ancestors], c2 = o2.$_validate(void 0, r2.localize(r2.path, l2, o2), s2).value;
            if (a2) {
              if (void 0 === c2) continue;
              a2 = false;
            }
            n2.unshift(c2);
          }
          n2.length && t3.push(...n2);
        }, c.fastSplice = function(e4, t3) {
          let r2 = t3;
          for (; r2 < e4.length; ) e4[r2++] = e4[r2];
          --e4.length;
        }, c.validateSingle = function(e4, t3) {
          ("array" === e4.type || e4._flags._arrayItems) && (s(!t3._flags.single, "Cannot specify array item with single rule enabled"), t3.$_setFlag("_arrayItems", true, { clone: false }));
        }, c.sort = function(e4, t3, r2, s2, n2) {
          const a2 = "ascending" === r2.order ? 1 : -1, i2 = -1 * a2, o2 = a2, l2 = /* @__PURE__ */ __name((l3, u) => {
            let f = c.compare(l3, u, i2, o2);
            if (null !== f) return f;
            if (r2.by && (l3 = r2.by.resolve(l3, s2, n2), u = r2.by.resolve(u, s2, n2)), f = c.compare(l3, u, i2, o2), null !== f) return f;
            const m = typeof l3;
            if (m !== typeof u) throw e4.$_createError("array.sort.mismatching", t3, null, s2, n2);
            if ("number" !== m && "string" !== m) throw e4.$_createError("array.sort.unsupported", t3, { type: m }, s2, n2);
            return "number" === m ? (l3 - u) * a2 : l3 < u ? i2 : o2;
          }, "l");
          try {
            return { value: t3.slice().sort(l2) };
          } catch (e5) {
            return { errors: e5 };
          }
        }, c.compare = function(e4, t3, r2, s2) {
          return e4 === t3 ? 0 : void 0 === e4 ? 1 : void 0 === t3 ? -1 : null === e4 ? s2 : null === t3 ? r2 : null;
        };
      }, 4937: (e3, t2, r) => {
        "use strict";
        const s = r(375), n = r(8068), a = r(8160), i = r(2036), o = { isBool: /* @__PURE__ */ __name(function(e4) {
          return "boolean" == typeof e4;
        }, "isBool") };
        e3.exports = n.extend({ type: "boolean", flags: { sensitive: { default: false } }, terms: { falsy: { init: null, manifest: "values" }, truthy: { init: null, manifest: "values" } }, coerce(e4, { schema: t3 }) {
          if ("boolean" != typeof e4) {
            if ("string" == typeof e4) {
              const r2 = t3._flags.sensitive ? e4 : e4.toLowerCase();
              e4 = "true" === r2 || "false" !== r2 && e4;
            }
            return "boolean" != typeof e4 && (e4 = t3.$_terms.truthy && t3.$_terms.truthy.has(e4, null, null, !t3._flags.sensitive) || (!t3.$_terms.falsy || !t3.$_terms.falsy.has(e4, null, null, !t3._flags.sensitive)) && e4), { value: e4 };
          }
        }, validate(e4, { error: t3 }) {
          if ("boolean" != typeof e4) return { value: e4, errors: t3("boolean.base") };
        }, rules: { truthy: { method(...e4) {
          a.verifyFlat(e4, "truthy");
          const t3 = this.clone();
          t3.$_terms.truthy = t3.$_terms.truthy || new i();
          for (let r2 = 0; r2 < e4.length; ++r2) {
            const n2 = e4[r2];
            s(void 0 !== n2, "Cannot call truthy with undefined"), t3.$_terms.truthy.add(n2);
          }
          return t3;
        } }, falsy: { method(...e4) {
          a.verifyFlat(e4, "falsy");
          const t3 = this.clone();
          t3.$_terms.falsy = t3.$_terms.falsy || new i();
          for (let r2 = 0; r2 < e4.length; ++r2) {
            const n2 = e4[r2];
            s(void 0 !== n2, "Cannot call falsy with undefined"), t3.$_terms.falsy.add(n2);
          }
          return t3;
        } }, sensitive: { method(e4 = true) {
          return this.$_setFlag("sensitive", e4);
        } } }, cast: { number: { from: o.isBool, to: /* @__PURE__ */ __name((e4, t3) => e4 ? 1 : 0, "to") }, string: { from: o.isBool, to: /* @__PURE__ */ __name((e4, t3) => e4 ? "true" : "false", "to") } }, manifest: { build: /* @__PURE__ */ __name((e4, t3) => (t3.truthy && (e4 = e4.truthy(...t3.truthy)), t3.falsy && (e4 = e4.falsy(...t3.falsy)), e4), "build") }, messages: { "boolean.base": "{{#label}} must be a boolean" } });
      }, 7500: (e3, t2, r) => {
        "use strict";
        const s = r(375), n = r(8068), a = r(8160), i = r(3328), o = { isDate: /* @__PURE__ */ __name(function(e4) {
          return e4 instanceof Date;
        }, "isDate") };
        e3.exports = n.extend({ type: "date", coerce: { from: ["number", "string"], method: /* @__PURE__ */ __name((e4, { schema: t3 }) => ({ value: o.parse(e4, t3._flags.format) || e4 }), "method") }, validate(e4, { schema: t3, error: r2, prefs: s2 }) {
          if (e4 instanceof Date && !isNaN(e4.getTime())) return;
          const n2 = t3._flags.format;
          return s2.convert && n2 && "string" == typeof e4 ? { value: e4, errors: r2("date.format", { format: n2 }) } : { value: e4, errors: r2("date.base") };
        }, rules: { compare: { method: false, validate(e4, t3, { date: r2 }, { name: s2, operator: n2, args: i2 }) {
          const o2 = "now" === r2 ? Date.now() : r2.getTime();
          return a.compare(e4.getTime(), o2, n2) ? e4 : t3.error("date." + s2, { limit: i2.date, value: e4 });
        }, args: [{ name: "date", ref: true, normalize: /* @__PURE__ */ __name((e4) => "now" === e4 ? e4 : o.parse(e4), "normalize"), assert: /* @__PURE__ */ __name((e4) => null !== e4, "assert"), message: "must have a valid date format" }] }, format: { method(e4) {
          return s(["iso", "javascript", "unix"].includes(e4), "Unknown date format", e4), this.$_setFlag("format", e4);
        } }, greater: { method(e4) {
          return this.$_addRule({ name: "greater", method: "compare", args: { date: e4 }, operator: ">" });
        } }, iso: { method() {
          return this.format("iso");
        } }, less: { method(e4) {
          return this.$_addRule({ name: "less", method: "compare", args: { date: e4 }, operator: "<" });
        } }, max: { method(e4) {
          return this.$_addRule({ name: "max", method: "compare", args: { date: e4 }, operator: "<=" });
        } }, min: { method(e4) {
          return this.$_addRule({ name: "min", method: "compare", args: { date: e4 }, operator: ">=" });
        } }, timestamp: { method(e4 = "javascript") {
          return s(["javascript", "unix"].includes(e4), '"type" must be one of "javascript, unix"'), this.format(e4);
        } } }, cast: { number: { from: o.isDate, to: /* @__PURE__ */ __name((e4, t3) => e4.getTime(), "to") }, string: { from: o.isDate, to: /* @__PURE__ */ __name((e4, { prefs: t3 }) => i.date(e4, t3), "to") } }, messages: { "date.base": "{{#label}} must be a valid date", "date.format": '{{#label}} must be in {msg("date.format." + #format) || #format} format', "date.greater": "{{#label}} must be greater than {{:#limit}}", "date.less": "{{#label}} must be less than {{:#limit}}", "date.max": "{{#label}} must be less than or equal to {{:#limit}}", "date.min": "{{#label}} must be greater than or equal to {{:#limit}}", "date.format.iso": "ISO 8601 date", "date.format.javascript": "timestamp or number of milliseconds", "date.format.unix": "timestamp or number of seconds" } }), o.parse = function(e4, t3) {
          if (e4 instanceof Date) return e4;
          if ("string" != typeof e4 && (isNaN(e4) || !isFinite(e4))) return null;
          if (/^\s*$/.test(e4)) return null;
          if ("iso" === t3) return a.isIsoDate(e4) ? o.date(e4.toString()) : null;
          const r2 = e4;
          if ("string" == typeof e4 && /^[+-]?\d+(\.\d+)?$/.test(e4) && (e4 = parseFloat(e4)), t3) {
            if ("javascript" === t3) return o.date(1 * e4);
            if ("unix" === t3) return o.date(1e3 * e4);
            if ("string" == typeof r2) return null;
          }
          return o.date(e4);
        }, o.date = function(e4) {
          const t3 = new Date(e4);
          return isNaN(t3.getTime()) ? null : t3;
        };
      }, 390: (e3, t2, r) => {
        "use strict";
        const s = r(375), n = r(7824);
        e3.exports = n.extend({ type: "function", properties: { typeof: "function" }, rules: { arity: { method(e4) {
          return s(Number.isSafeInteger(e4) && e4 >= 0, "n must be a positive integer"), this.$_addRule({ name: "arity", args: { n: e4 } });
        }, validate: /* @__PURE__ */ __name((e4, t3, { n: r2 }) => e4.length === r2 ? e4 : t3.error("function.arity", { n: r2 }), "validate") }, class: { method() {
          return this.$_addRule("class");
        }, validate: /* @__PURE__ */ __name((e4, t3) => /^\s*class\s/.test(e4.toString()) ? e4 : t3.error("function.class", { value: e4 }), "validate") }, minArity: { method(e4) {
          return s(Number.isSafeInteger(e4) && e4 > 0, "n must be a strict positive integer"), this.$_addRule({ name: "minArity", args: { n: e4 } });
        }, validate: /* @__PURE__ */ __name((e4, t3, { n: r2 }) => e4.length >= r2 ? e4 : t3.error("function.minArity", { n: r2 }), "validate") }, maxArity: { method(e4) {
          return s(Number.isSafeInteger(e4) && e4 >= 0, "n must be a positive integer"), this.$_addRule({ name: "maxArity", args: { n: e4 } });
        }, validate: /* @__PURE__ */ __name((e4, t3, { n: r2 }) => e4.length <= r2 ? e4 : t3.error("function.maxArity", { n: r2 }), "validate") } }, messages: { "function.arity": "{{#label}} must have an arity of {{#n}}", "function.class": "{{#label}} must be a class", "function.maxArity": "{{#label}} must have an arity lesser or equal to {{#n}}", "function.minArity": "{{#label}} must have an arity greater or equal to {{#n}}" } });
      }, 7824: (e3, t2, r) => {
        "use strict";
        const s = r(978), n = r(375), a = r(8571), i = r(3652), o = r(8068), l = r(8160), c = r(3292), u = r(6354), f = r(6133), m = r(3328), h = { renameDefaults: { alias: false, multiple: false, override: false } };
        e3.exports = o.extend({ type: "_keys", properties: { typeof: "object" }, flags: { unknown: { default: void 0 } }, terms: { dependencies: { init: null }, keys: { init: null, manifest: { mapped: { from: "schema", to: "key" } } }, patterns: { init: null }, renames: { init: null } }, args: /* @__PURE__ */ __name((e4, t3) => e4.keys(t3), "args"), validate(e4, { schema: t3, error: r2, state: s2, prefs: n2 }) {
          if (!e4 || typeof e4 !== t3.$_property("typeof") || Array.isArray(e4)) return { value: e4, errors: r2("object.base", { type: t3.$_property("typeof") }) };
          if (!(t3.$_terms.renames || t3.$_terms.dependencies || t3.$_terms.keys || t3.$_terms.patterns || t3.$_terms.externals)) return;
          e4 = h.clone(e4, n2);
          const a2 = [];
          if (t3.$_terms.renames && !h.rename(t3, e4, s2, n2, a2)) return { value: e4, errors: a2 };
          if (!t3.$_terms.keys && !t3.$_terms.patterns && !t3.$_terms.dependencies) return { value: e4, errors: a2 };
          const i2 = new Set(Object.keys(e4));
          if (t3.$_terms.keys) {
            const r3 = [e4, ...s2.ancestors];
            for (const o2 of t3.$_terms.keys) {
              const t4 = o2.key, l2 = e4[t4];
              i2.delete(t4);
              const c2 = s2.localize([...s2.path, t4], r3, o2), u2 = o2.schema.$_validate(l2, c2, n2);
              if (u2.errors) {
                if (n2.abortEarly) return { value: e4, errors: u2.errors };
                void 0 !== u2.value && (e4[t4] = u2.value), a2.push(...u2.errors);
              } else "strip" === o2.schema._flags.result || void 0 === u2.value && void 0 !== l2 ? delete e4[t4] : void 0 !== u2.value && (e4[t4] = u2.value);
            }
          }
          if (i2.size || t3._flags._hasPatternMatch) {
            const r3 = h.unknown(t3, e4, i2, a2, s2, n2);
            if (r3) return r3;
          }
          if (t3.$_terms.dependencies) for (const r3 of t3.$_terms.dependencies) {
            if (null !== r3.key && false === h.isPresent(r3.options)(r3.key.resolve(e4, s2, n2, null, { shadow: false }))) continue;
            const i3 = h.dependencies[r3.rel](t3, r3, e4, s2, n2);
            if (i3) {
              const r4 = t3.$_createError(i3.code, e4, i3.context, s2, n2);
              if (n2.abortEarly) return { value: e4, errors: r4 };
              a2.push(r4);
            }
          }
          return { value: e4, errors: a2 };
        }, rules: { and: { method(...e4) {
          return l.verifyFlat(e4, "and"), h.dependency(this, "and", null, e4);
        } }, append: { method(e4) {
          return null == e4 || 0 === Object.keys(e4).length ? this : this.keys(e4);
        } }, assert: { method(e4, t3, r2) {
          m.isTemplate(e4) || (e4 = c.ref(e4)), n(void 0 === r2 || "string" == typeof r2, "Message must be a string"), t3 = this.$_compile(t3, { appendPath: true });
          const s2 = this.$_addRule({ name: "assert", args: { subject: e4, schema: t3, message: r2 } });
          return s2.$_mutateRegister(e4), s2.$_mutateRegister(t3), s2;
        }, validate(e4, { error: t3, prefs: r2, state: s2 }, { subject: n2, schema: a2, message: i2 }) {
          const o2 = n2.resolve(e4, s2, r2), l2 = f.isRef(n2) ? n2.absolute(s2) : [];
          return a2.$_match(o2, s2.localize(l2, [e4, ...s2.ancestors], a2), r2) ? e4 : t3("object.assert", { subject: n2, message: i2 });
        }, args: ["subject", "schema", "message"], multi: true }, instance: { method(e4, t3) {
          return n("function" == typeof e4, "constructor must be a function"), t3 = t3 || e4.name, this.$_addRule({ name: "instance", args: { constructor: e4, name: t3 } });
        }, validate: /* @__PURE__ */ __name((e4, t3, { constructor: r2, name: s2 }) => e4 instanceof r2 ? e4 : t3.error("object.instance", { type: s2, value: e4 }), "validate"), args: ["constructor", "name"] }, keys: { method(e4) {
          n(void 0 === e4 || "object" == typeof e4, "Object schema must be a valid object"), n(!l.isSchema(e4), "Object schema cannot be a joi schema");
          const t3 = this.clone();
          if (e4) if (Object.keys(e4).length) {
            t3.$_terms.keys = t3.$_terms.keys ? t3.$_terms.keys.filter((t4) => !e4.hasOwnProperty(t4.key)) : new h.Keys();
            for (const r2 in e4) l.tryWithPath(() => t3.$_terms.keys.push({ key: r2, schema: this.$_compile(e4[r2]) }), r2);
          } else t3.$_terms.keys = new h.Keys();
          else t3.$_terms.keys = null;
          return t3.$_mutateRebuild();
        } }, length: { method(e4) {
          return this.$_addRule({ name: "length", args: { limit: e4 }, operator: "=" });
        }, validate: /* @__PURE__ */ __name((e4, t3, { limit: r2 }, { name: s2, operator: n2, args: a2 }) => l.compare(Object.keys(e4).length, r2, n2) ? e4 : t3.error("object." + s2, { limit: a2.limit, value: e4 }), "validate"), args: [{ name: "limit", ref: true, assert: l.limit, message: "must be a positive integer" }] }, max: { method(e4) {
          return this.$_addRule({ name: "max", method: "length", args: { limit: e4 }, operator: "<=" });
        } }, min: { method(e4) {
          return this.$_addRule({ name: "min", method: "length", args: { limit: e4 }, operator: ">=" });
        } }, nand: { method(...e4) {
          return l.verifyFlat(e4, "nand"), h.dependency(this, "nand", null, e4);
        } }, or: { method(...e4) {
          return l.verifyFlat(e4, "or"), h.dependency(this, "or", null, e4);
        } }, oxor: { method(...e4) {
          return h.dependency(this, "oxor", null, e4);
        } }, pattern: { method(e4, t3, r2 = {}) {
          const s2 = e4 instanceof RegExp;
          s2 || (e4 = this.$_compile(e4, { appendPath: true })), n(void 0 !== t3, "Invalid rule"), l.assertOptions(r2, ["fallthrough", "matches"]), s2 && n(!e4.flags.includes("g") && !e4.flags.includes("y"), "pattern should not use global or sticky mode"), t3 = this.$_compile(t3, { appendPath: true });
          const a2 = this.clone();
          a2.$_terms.patterns = a2.$_terms.patterns || [];
          const i2 = { [s2 ? "regex" : "schema"]: e4, rule: t3 };
          return r2.matches && (i2.matches = this.$_compile(r2.matches), "array" !== i2.matches.type && (i2.matches = i2.matches.$_root.array().items(i2.matches)), a2.$_mutateRegister(i2.matches), a2.$_setFlag("_hasPatternMatch", true, { clone: false })), r2.fallthrough && (i2.fallthrough = true), a2.$_terms.patterns.push(i2), a2.$_mutateRegister(t3), a2;
        } }, ref: { method() {
          return this.$_addRule("ref");
        }, validate: /* @__PURE__ */ __name((e4, t3) => f.isRef(e4) ? e4 : t3.error("object.refType", { value: e4 }), "validate") }, regex: { method() {
          return this.$_addRule("regex");
        }, validate: /* @__PURE__ */ __name((e4, t3) => e4 instanceof RegExp ? e4 : t3.error("object.regex", { value: e4 }), "validate") }, rename: { method(e4, t3, r2 = {}) {
          n("string" == typeof e4 || e4 instanceof RegExp, "Rename missing the from argument"), n("string" == typeof t3 || t3 instanceof m, "Invalid rename to argument"), n(t3 !== e4, "Cannot rename key to same name:", e4), l.assertOptions(r2, ["alias", "ignoreUndefined", "override", "multiple"]);
          const a2 = this.clone();
          a2.$_terms.renames = a2.$_terms.renames || [];
          for (const t4 of a2.$_terms.renames) n(t4.from !== e4, "Cannot rename the same key multiple times");
          return t3 instanceof m && a2.$_mutateRegister(t3), a2.$_terms.renames.push({ from: e4, to: t3, options: s(h.renameDefaults, r2) }), a2;
        } }, schema: { method(e4 = "any") {
          return this.$_addRule({ name: "schema", args: { type: e4 } });
        }, validate: /* @__PURE__ */ __name((e4, t3, { type: r2 }) => !l.isSchema(e4) || "any" !== r2 && e4.type !== r2 ? t3.error("object.schema", { type: r2 }) : e4, "validate") }, unknown: { method(e4) {
          return this.$_setFlag("unknown", false !== e4);
        } }, with: { method(e4, t3, r2 = {}) {
          return h.dependency(this, "with", e4, t3, r2);
        } }, without: { method(e4, t3, r2 = {}) {
          return h.dependency(this, "without", e4, t3, r2);
        } }, xor: { method(...e4) {
          return l.verifyFlat(e4, "xor"), h.dependency(this, "xor", null, e4);
        } } }, overrides: { default(e4, t3) {
          return void 0 === e4 && (e4 = l.symbols.deepDefault), this.$_parent("default", e4, t3);
        } }, rebuild(e4) {
          if (e4.$_terms.keys) {
            const t3 = new i.Sorter();
            for (const r2 of e4.$_terms.keys) l.tryWithPath(() => t3.add(r2, { after: r2.schema.$_rootReferences(), group: r2.key }), r2.key);
            e4.$_terms.keys = new h.Keys(...t3.nodes);
          }
        }, manifest: { build(e4, t3) {
          if (t3.keys && (e4 = e4.keys(t3.keys)), t3.dependencies) for (const { rel: r2, key: s2 = null, peers: n2, options: a2 } of t3.dependencies) e4 = h.dependency(e4, r2, s2, n2, a2);
          if (t3.patterns) for (const { regex: r2, schema: s2, rule: n2, fallthrough: a2, matches: i2 } of t3.patterns) e4 = e4.pattern(r2 || s2, n2, { fallthrough: a2, matches: i2 });
          if (t3.renames) for (const { from: r2, to: s2, options: n2 } of t3.renames) e4 = e4.rename(r2, s2, n2);
          return e4;
        } }, messages: { "object.and": "{{#label}} contains {{#presentWithLabels}} without its required peers {{#missingWithLabels}}", "object.assert": '{{#label}} is invalid because {if(#subject.key, `"` + #subject.key + `" failed to ` + (#message || "pass the assertion test"), #message || "the assertion failed")}', "object.base": "{{#label}} must be of type {{#type}}", "object.instance": "{{#label}} must be an instance of {{:#type}}", "object.length": '{{#label}} must have {{#limit}} key{if(#limit == 1, "", "s")}', "object.max": '{{#label}} must have less than or equal to {{#limit}} key{if(#limit == 1, "", "s")}', "object.min": '{{#label}} must have at least {{#limit}} key{if(#limit == 1, "", "s")}', "object.missing": "{{#label}} must contain at least one of {{#peersWithLabels}}", "object.nand": "{{:#mainWithLabel}} must not exist simultaneously with {{#peersWithLabels}}", "object.oxor": "{{#label}} contains a conflict between optional exclusive peers {{#peersWithLabels}}", "object.pattern.match": "{{#label}} keys failed to match pattern requirements", "object.refType": "{{#label}} must be a Joi reference", "object.regex": "{{#label}} must be a RegExp object", "object.rename.multiple": "{{#label}} cannot rename {{:#from}} because multiple renames are disabled and another key was already renamed to {{:#to}}", "object.rename.override": "{{#label}} cannot rename {{:#from}} because override is disabled and target {{:#to}} exists", "object.schema": "{{#label}} must be a Joi schema of {{#type}} type", "object.unknown": "{{#label}} is not allowed", "object.with": "{{:#mainWithLabel}} missing required peer {{:#peerWithLabel}}", "object.without": "{{:#mainWithLabel}} conflict with forbidden peer {{:#peerWithLabel}}", "object.xor": "{{#label}} contains a conflict between exclusive peers {{#peersWithLabels}}" } }), h.clone = function(e4, t3) {
          if ("object" == typeof e4) {
            if (t3.nonEnumerables) return a(e4, { shallow: true });
            const r3 = Object.create(Object.getPrototypeOf(e4));
            return Object.assign(r3, e4), r3;
          }
          const r2 = /* @__PURE__ */ __name(function(...t4) {
            return e4.apply(this, t4);
          }, "r");
          return r2.prototype = a(e4.prototype), Object.defineProperty(r2, "name", { value: e4.name, writable: false }), Object.defineProperty(r2, "length", { value: e4.length, writable: false }), Object.assign(r2, e4), r2;
        }, h.dependency = function(e4, t3, r2, s2, a2) {
          n(null === r2 || "string" == typeof r2, t3, "key must be a strings"), a2 || (a2 = s2.length > 1 && "object" == typeof s2[s2.length - 1] ? s2.pop() : {}), l.assertOptions(a2, ["separator", "isPresent"]), s2 = [].concat(s2);
          const i2 = l.default(a2.separator, "."), o2 = [];
          for (const e5 of s2) n("string" == typeof e5, t3, "peers must be strings"), o2.push(c.ref(e5, { separator: i2, ancestor: 0, prefix: false }));
          null !== r2 && (r2 = c.ref(r2, { separator: i2, ancestor: 0, prefix: false }));
          const u2 = e4.clone();
          return u2.$_terms.dependencies = u2.$_terms.dependencies || [], u2.$_terms.dependencies.push(new h.Dependency(t3, r2, o2, s2, a2)), u2;
        }, h.dependencies = { and(e4, t3, r2, s2, n2) {
          const a2 = [], i2 = [], o2 = t3.peers.length, l2 = h.isPresent(t3.options);
          for (const e5 of t3.peers) false === l2(e5.resolve(r2, s2, n2, null, { shadow: false })) ? a2.push(e5.key) : i2.push(e5.key);
          if (a2.length !== o2 && i2.length !== o2) return { code: "object.and", context: { present: i2, presentWithLabels: h.keysToLabels(e4, i2), missing: a2, missingWithLabels: h.keysToLabels(e4, a2) } };
        }, nand(e4, t3, r2, s2, n2) {
          const a2 = [], i2 = h.isPresent(t3.options);
          for (const e5 of t3.peers) i2(e5.resolve(r2, s2, n2, null, { shadow: false })) && a2.push(e5.key);
          if (a2.length !== t3.peers.length) return;
          const o2 = t3.paths[0], l2 = t3.paths.slice(1);
          return { code: "object.nand", context: { main: o2, mainWithLabel: h.keysToLabels(e4, o2), peers: l2, peersWithLabels: h.keysToLabels(e4, l2) } };
        }, or(e4, t3, r2, s2, n2) {
          const a2 = h.isPresent(t3.options);
          for (const e5 of t3.peers) if (a2(e5.resolve(r2, s2, n2, null, { shadow: false }))) return;
          return { code: "object.missing", context: { peers: t3.paths, peersWithLabels: h.keysToLabels(e4, t3.paths) } };
        }, oxor(e4, t3, r2, s2, n2) {
          const a2 = [], i2 = h.isPresent(t3.options);
          for (const e5 of t3.peers) i2(e5.resolve(r2, s2, n2, null, { shadow: false })) && a2.push(e5.key);
          if (!a2.length || 1 === a2.length) return;
          const o2 = { peers: t3.paths, peersWithLabels: h.keysToLabels(e4, t3.paths) };
          return o2.present = a2, o2.presentWithLabels = h.keysToLabels(e4, a2), { code: "object.oxor", context: o2 };
        }, with(e4, t3, r2, s2, n2) {
          const a2 = h.isPresent(t3.options);
          for (const i2 of t3.peers) if (false === a2(i2.resolve(r2, s2, n2, null, { shadow: false }))) return { code: "object.with", context: { main: t3.key.key, mainWithLabel: h.keysToLabels(e4, t3.key.key), peer: i2.key, peerWithLabel: h.keysToLabels(e4, i2.key) } };
        }, without(e4, t3, r2, s2, n2) {
          const a2 = h.isPresent(t3.options);
          for (const i2 of t3.peers) if (a2(i2.resolve(r2, s2, n2, null, { shadow: false }))) return { code: "object.without", context: { main: t3.key.key, mainWithLabel: h.keysToLabels(e4, t3.key.key), peer: i2.key, peerWithLabel: h.keysToLabels(e4, i2.key) } };
        }, xor(e4, t3, r2, s2, n2) {
          const a2 = [], i2 = h.isPresent(t3.options);
          for (const e5 of t3.peers) i2(e5.resolve(r2, s2, n2, null, { shadow: false })) && a2.push(e5.key);
          if (1 === a2.length) return;
          const o2 = { peers: t3.paths, peersWithLabels: h.keysToLabels(e4, t3.paths) };
          return 0 === a2.length ? { code: "object.missing", context: o2 } : (o2.present = a2, o2.presentWithLabels = h.keysToLabels(e4, a2), { code: "object.xor", context: o2 });
        } }, h.keysToLabels = function(e4, t3) {
          return Array.isArray(t3) ? t3.map((t4) => e4.$_mapLabels(t4)) : e4.$_mapLabels(t3);
        }, h.isPresent = function(e4) {
          return "function" == typeof e4.isPresent ? e4.isPresent : (e5) => void 0 !== e5;
        }, h.rename = function(e4, t3, r2, s2, n2) {
          const a2 = {};
          for (const i2 of e4.$_terms.renames) {
            const o2 = [], l2 = "string" != typeof i2.from;
            if (l2) for (const e5 in t3) {
              if (void 0 === t3[e5] && i2.options.ignoreUndefined) continue;
              if (e5 === i2.to) continue;
              const r3 = i2.from.exec(e5);
              r3 && o2.push({ from: e5, to: i2.to, match: r3 });
            }
            else !Object.prototype.hasOwnProperty.call(t3, i2.from) || void 0 === t3[i2.from] && i2.options.ignoreUndefined || o2.push(i2);
            for (const c2 of o2) {
              const o3 = c2.from;
              let u2 = c2.to;
              if (u2 instanceof m && (u2 = u2.render(t3, r2, s2, c2.match)), o3 !== u2) {
                if (!i2.options.multiple && a2[u2] && (n2.push(e4.$_createError("object.rename.multiple", t3, { from: o3, to: u2, pattern: l2 }, r2, s2)), s2.abortEarly)) return false;
                if (Object.prototype.hasOwnProperty.call(t3, u2) && !i2.options.override && !a2[u2] && (n2.push(e4.$_createError("object.rename.override", t3, { from: o3, to: u2, pattern: l2 }, r2, s2)), s2.abortEarly)) return false;
                void 0 === t3[o3] ? delete t3[u2] : t3[u2] = t3[o3], a2[u2] = true, i2.options.alias || delete t3[o3];
              }
            }
          }
          return true;
        }, h.unknown = function(e4, t3, r2, s2, n2, a2) {
          if (e4.$_terms.patterns) {
            let i2 = false;
            const o2 = e4.$_terms.patterns.map((e5) => {
              if (e5.matches) return i2 = true, [];
            }), l2 = [t3, ...n2.ancestors];
            for (const i3 of r2) {
              const c2 = t3[i3], u2 = [...n2.path, i3];
              for (let f2 = 0; f2 < e4.$_terms.patterns.length; ++f2) {
                const m2 = e4.$_terms.patterns[f2];
                if (m2.regex) {
                  const e5 = m2.regex.test(i3);
                  if (n2.mainstay.tracer.debug(n2, "rule", `pattern.${f2}`, e5 ? "pass" : "error"), !e5) continue;
                } else if (!m2.schema.$_match(i3, n2.nest(m2.schema, `pattern.${f2}`), a2)) continue;
                r2.delete(i3);
                const h2 = n2.localize(u2, l2, { schema: m2.rule, key: i3 }), d = m2.rule.$_validate(c2, h2, a2);
                if (d.errors) {
                  if (a2.abortEarly) return { value: t3, errors: d.errors };
                  s2.push(...d.errors);
                }
                if (m2.matches && o2[f2].push(i3), t3[i3] = d.value, !m2.fallthrough) break;
              }
            }
            if (i2) for (let r3 = 0; r3 < o2.length; ++r3) {
              const i3 = o2[r3];
              if (!i3) continue;
              const c2 = e4.$_terms.patterns[r3].matches, f2 = n2.localize(n2.path, l2, c2), m2 = c2.$_validate(i3, f2, a2);
              if (m2.errors) {
                const r4 = u.details(m2.errors, { override: false });
                r4.matches = i3;
                const o3 = e4.$_createError("object.pattern.match", t3, r4, n2, a2);
                if (a2.abortEarly) return { value: t3, errors: o3 };
                s2.push(o3);
              }
            }
          }
          if (r2.size && (e4.$_terms.keys || e4.$_terms.patterns)) {
            if (a2.stripUnknown && void 0 === e4._flags.unknown || a2.skipFunctions) {
              const e5 = !(!a2.stripUnknown || true !== a2.stripUnknown && !a2.stripUnknown.objects);
              for (const s3 of r2) e5 ? (delete t3[s3], r2.delete(s3)) : "function" == typeof t3[s3] && r2.delete(s3);
            }
            if (!l.default(e4._flags.unknown, a2.allowUnknown)) for (const i2 of r2) {
              const r3 = n2.localize([...n2.path, i2], []), o2 = e4.$_createError("object.unknown", t3[i2], { child: i2 }, r3, a2, { flags: false });
              if (a2.abortEarly) return { value: t3, errors: o2 };
              s2.push(o2);
            }
          }
        }, h.Dependency = class {
          constructor(e4, t3, r2, s2, n2) {
            this.rel = e4, this.key = t3, this.peers = r2, this.paths = s2, this.options = n2;
          }
          describe() {
            const e4 = { rel: this.rel, peers: this.paths };
            return null !== this.key && (e4.key = this.key.key), "." !== this.peers[0].separator && (e4.options = { ...e4.options, separator: this.peers[0].separator }), this.options.isPresent && (e4.options = { ...e4.options, isPresent: this.options.isPresent }), e4;
          }
        }, h.Keys = class extends Array {
          concat(e4) {
            const t3 = this.slice(), r2 = /* @__PURE__ */ new Map();
            for (let e5 = 0; e5 < t3.length; ++e5) r2.set(t3[e5].key, e5);
            for (const s2 of e4) {
              const e5 = s2.key, n2 = r2.get(e5);
              void 0 !== n2 ? t3[n2] = { key: e5, schema: t3[n2].schema.concat(s2.schema) } : t3.push(s2);
            }
            return t3;
          }
        };
      }, 8785: (e3, t2, r) => {
        "use strict";
        const s = r(375), n = r(8068), a = r(8160), i = r(3292), o = r(6354), l = {};
        e3.exports = n.extend({ type: "link", properties: { schemaChain: true }, terms: { link: { init: null, manifest: "single", register: false } }, args: /* @__PURE__ */ __name((e4, t3) => e4.ref(t3), "args"), validate(e4, { schema: t3, state: r2, prefs: n2 }) {
          s(t3.$_terms.link, "Uninitialized link schema");
          const a2 = l.generate(t3, e4, r2, n2), i2 = t3.$_terms.link[0].ref;
          return a2.$_validate(e4, r2.nest(a2, `link:${i2.display}:${a2.type}`), n2);
        }, generate: /* @__PURE__ */ __name((e4, t3, r2, s2) => l.generate(e4, t3, r2, s2), "generate"), rules: { ref: { method(e4) {
          s(!this.$_terms.link, "Cannot reinitialize schema"), e4 = i.ref(e4), s("value" === e4.type || "local" === e4.type, "Invalid reference type:", e4.type), s("local" === e4.type || "root" === e4.ancestor || e4.ancestor > 0, "Link cannot reference itself");
          const t3 = this.clone();
          return t3.$_terms.link = [{ ref: e4 }], t3;
        } }, relative: { method(e4 = true) {
          return this.$_setFlag("relative", e4);
        } } }, overrides: { concat(e4) {
          s(this.$_terms.link, "Uninitialized link schema"), s(a.isSchema(e4), "Invalid schema object"), s("link" !== e4.type, "Cannot merge type link with another link");
          const t3 = this.clone();
          return t3.$_terms.whens || (t3.$_terms.whens = []), t3.$_terms.whens.push({ concat: e4 }), t3.$_mutateRebuild();
        } }, manifest: { build: /* @__PURE__ */ __name((e4, t3) => (s(t3.link, "Invalid link description missing link"), e4.ref(t3.link)), "build") } }), l.generate = function(e4, t3, r2, s2) {
          let n2 = r2.mainstay.links.get(e4);
          if (n2) return n2._generate(t3, r2, s2).schema;
          const a2 = e4.$_terms.link[0].ref, { perspective: i2, path: o2 } = l.perspective(a2, r2);
          l.assert(i2, "which is outside of schema boundaries", a2, e4, r2, s2);
          try {
            n2 = o2.length ? i2.$_reach(o2) : i2;
          } catch (t4) {
            l.assert(false, "to non-existing schema", a2, e4, r2, s2);
          }
          return l.assert("link" !== n2.type, "which is another link", a2, e4, r2, s2), e4._flags.relative || r2.mainstay.links.set(e4, n2), n2._generate(t3, r2, s2).schema;
        }, l.perspective = function(e4, t3) {
          if ("local" === e4.type) {
            for (const { schema: r2, key: s2 } of t3.schemas) {
              if ((r2._flags.id || s2) === e4.path[0]) return { perspective: r2, path: e4.path.slice(1) };
              if (r2.$_terms.shared) {
                for (const t4 of r2.$_terms.shared) if (t4._flags.id === e4.path[0]) return { perspective: t4, path: e4.path.slice(1) };
              }
            }
            return { perspective: null, path: null };
          }
          return "root" === e4.ancestor ? { perspective: t3.schemas[t3.schemas.length - 1].schema, path: e4.path } : { perspective: t3.schemas[e4.ancestor] && t3.schemas[e4.ancestor].schema, path: e4.path };
        }, l.assert = function(e4, t3, r2, n2, a2, i2) {
          e4 || s(false, `"${o.label(n2._flags, a2, i2)}" contains link reference "${r2.display}" ${t3}`);
        };
      }, 3832: (e3, t2, r) => {
        "use strict";
        const s = r(375), n = r(8068), a = r(8160), i = { numberRx: /^\s*[+-]?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:e([+-]?\d+))?\s*$/i, precisionRx: /(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/, exponentialPartRegex: /[eE][+-]?\d+$/, leadingSignAndZerosRegex: /^[+-]?(0*)?/, dotRegex: /\./, trailingZerosRegex: /0+$/, decimalPlaces(e4) {
          const t3 = e4.toString(), r2 = t3.indexOf("."), s2 = t3.indexOf("e");
          return (r2 < 0 ? 0 : (s2 < 0 ? t3.length : s2) - r2 - 1) + (s2 < 0 ? 0 : Math.max(0, -parseInt(t3.slice(s2 + 1))));
        } };
        e3.exports = n.extend({ type: "number", flags: { unsafe: { default: false } }, coerce: { from: "string", method(e4, { schema: t3, error: r2 }) {
          if (!e4.match(i.numberRx)) return;
          e4 = e4.trim();
          const s2 = { value: parseFloat(e4) };
          if (0 === s2.value && (s2.value = 0), !t3._flags.unsafe) if (e4.match(/e/i)) {
            if (i.extractSignificantDigits(e4) !== i.extractSignificantDigits(String(s2.value))) return s2.errors = r2("number.unsafe"), s2;
          } else {
            const t4 = s2.value.toString();
            if (t4.match(/e/i)) return s2;
            if (t4 !== i.normalizeDecimal(e4)) return s2.errors = r2("number.unsafe"), s2;
          }
          return s2;
        } }, validate(e4, { schema: t3, error: r2, prefs: s2 }) {
          if (e4 === 1 / 0 || e4 === -1 / 0) return { value: e4, errors: r2("number.infinity") };
          if (!a.isNumber(e4)) return { value: e4, errors: r2("number.base") };
          const n2 = { value: e4 };
          if (s2.convert) {
            const e5 = t3.$_getRule("precision");
            if (e5) {
              const t4 = Math.pow(10, e5.args.limit);
              n2.value = Math.round(n2.value * t4) / t4;
            }
          }
          return 0 === n2.value && (n2.value = 0), !t3._flags.unsafe && (e4 > Number.MAX_SAFE_INTEGER || e4 < Number.MIN_SAFE_INTEGER) && (n2.errors = r2("number.unsafe")), n2;
        }, rules: { compare: { method: false, validate: /* @__PURE__ */ __name((e4, t3, { limit: r2 }, { name: s2, operator: n2, args: i2 }) => a.compare(e4, r2, n2) ? e4 : t3.error("number." + s2, { limit: i2.limit, value: e4 }), "validate"), args: [{ name: "limit", ref: true, assert: a.isNumber, message: "must be a number" }] }, greater: { method(e4) {
          return this.$_addRule({ name: "greater", method: "compare", args: { limit: e4 }, operator: ">" });
        } }, integer: { method() {
          return this.$_addRule("integer");
        }, validate: /* @__PURE__ */ __name((e4, t3) => Math.trunc(e4) - e4 == 0 ? e4 : t3.error("number.integer"), "validate") }, less: { method(e4) {
          return this.$_addRule({ name: "less", method: "compare", args: { limit: e4 }, operator: "<" });
        } }, max: { method(e4) {
          return this.$_addRule({ name: "max", method: "compare", args: { limit: e4 }, operator: "<=" });
        } }, min: { method(e4) {
          return this.$_addRule({ name: "min", method: "compare", args: { limit: e4 }, operator: ">=" });
        } }, multiple: { method(e4) {
          const t3 = "number" == typeof e4 ? i.decimalPlaces(e4) : null, r2 = Math.pow(10, t3);
          return this.$_addRule({ name: "multiple", args: { base: e4, baseDecimalPlace: t3, pfactor: r2 } });
        }, validate: /* @__PURE__ */ __name((e4, t3, { base: r2, baseDecimalPlace: s2, pfactor: n2 }, a2) => i.decimalPlaces(e4) > s2 ? t3.error("number.multiple", { multiple: a2.args.base, value: e4 }) : Math.round(n2 * e4) % Math.round(n2 * r2) == 0 ? e4 : t3.error("number.multiple", { multiple: a2.args.base, value: e4 }), "validate"), args: [{ name: "base", ref: true, assert: /* @__PURE__ */ __name((e4) => "number" == typeof e4 && isFinite(e4) && e4 > 0, "assert"), message: "must be a positive number" }, "baseDecimalPlace", "pfactor"], multi: true }, negative: { method() {
          return this.sign("negative");
        } }, port: { method() {
          return this.$_addRule("port");
        }, validate: /* @__PURE__ */ __name((e4, t3) => Number.isSafeInteger(e4) && e4 >= 0 && e4 <= 65535 ? e4 : t3.error("number.port"), "validate") }, positive: { method() {
          return this.sign("positive");
        } }, precision: { method(e4) {
          return s(Number.isSafeInteger(e4), "limit must be an integer"), this.$_addRule({ name: "precision", args: { limit: e4 } });
        }, validate(e4, t3, { limit: r2 }) {
          const s2 = e4.toString().match(i.precisionRx);
          return Math.max((s2[1] ? s2[1].length : 0) - (s2[2] ? parseInt(s2[2], 10) : 0), 0) <= r2 ? e4 : t3.error("number.precision", { limit: r2, value: e4 });
        }, convert: true }, sign: { method(e4) {
          return s(["negative", "positive"].includes(e4), "Invalid sign", e4), this.$_addRule({ name: "sign", args: { sign: e4 } });
        }, validate: /* @__PURE__ */ __name((e4, t3, { sign: r2 }) => "negative" === r2 && e4 < 0 || "positive" === r2 && e4 > 0 ? e4 : t3.error(`number.${r2}`), "validate") }, unsafe: { method(e4 = true) {
          return s("boolean" == typeof e4, "enabled must be a boolean"), this.$_setFlag("unsafe", e4);
        } } }, cast: { string: { from: /* @__PURE__ */ __name((e4) => "number" == typeof e4, "from"), to: /* @__PURE__ */ __name((e4, t3) => e4.toString(), "to") } }, messages: { "number.base": "{{#label}} must be a number", "number.greater": "{{#label}} must be greater than {{#limit}}", "number.infinity": "{{#label}} cannot be infinity", "number.integer": "{{#label}} must be an integer", "number.less": "{{#label}} must be less than {{#limit}}", "number.max": "{{#label}} must be less than or equal to {{#limit}}", "number.min": "{{#label}} must be greater than or equal to {{#limit}}", "number.multiple": "{{#label}} must be a multiple of {{#multiple}}", "number.negative": "{{#label}} must be a negative number", "number.port": "{{#label}} must be a valid port", "number.positive": "{{#label}} must be a positive number", "number.precision": "{{#label}} must have no more than {{#limit}} decimal places", "number.unsafe": "{{#label}} must be a safe number" } }), i.extractSignificantDigits = function(e4) {
          return e4.replace(i.exponentialPartRegex, "").replace(i.dotRegex, "").replace(i.trailingZerosRegex, "").replace(i.leadingSignAndZerosRegex, "");
        }, i.normalizeDecimal = function(e4) {
          return (e4 = e4.replace(/^\+/, "").replace(/\.0*$/, "").replace(/^(-?)\.([^\.]*)$/, "$10.$2").replace(/^(-?)0+([0-9])/, "$1$2")).includes(".") && e4.endsWith("0") && (e4 = e4.replace(/0+$/, "")), "-0" === e4 ? "0" : e4;
        };
      }, 8966: (e3, t2, r) => {
        "use strict";
        const s = r(7824);
        e3.exports = s.extend({ type: "object", cast: { map: { from: /* @__PURE__ */ __name((e4) => e4 && "object" == typeof e4, "from"), to: /* @__PURE__ */ __name((e4, t3) => new Map(Object.entries(e4)), "to") } } });
      }, 7417: (e3, t2, r) => {
        "use strict";
        const s = r(375), n = r(5380), a = r(1745), i = r(9959), o = r(6064), l = r(9926), c = r(5752), u = r(8068), f = r(8160), m = { tlds: l instanceof Set && { tlds: { allow: l, deny: null } }, base64Regex: { true: { true: /^(?:[\w\-]{2}[\w\-]{2})*(?:[\w\-]{2}==|[\w\-]{3}=)?$/, false: /^(?:[A-Za-z0-9+\/]{2}[A-Za-z0-9+\/]{2})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/ }, false: { true: /^(?:[\w\-]{2}[\w\-]{2})*(?:[\w\-]{2}(==)?|[\w\-]{3}=?)?$/, false: /^(?:[A-Za-z0-9+\/]{2}[A-Za-z0-9+\/]{2})*(?:[A-Za-z0-9+\/]{2}(==)?|[A-Za-z0-9+\/]{3}=?)?$/ } }, dataUriRegex: /^data:[\w+.-]+\/[\w+.-]+;((charset=[\w-]+|base64),)?(.*)$/, hexRegex: { withPrefix: /^0x[0-9a-f]+$/i, withOptionalPrefix: /^(?:0x)?[0-9a-f]+$/i, withoutPrefix: /^[0-9a-f]+$/i }, ipRegex: i.regex({ cidr: "forbidden" }).regex, isoDurationRegex: /^P(?!$)(\d+Y)?(\d+M)?(\d+W)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?$/, guidBrackets: { "{": "}", "[": "]", "(": ")", "": "" }, guidVersions: { uuidv1: "1", uuidv2: "2", uuidv3: "3", uuidv4: "4", uuidv5: "5", uuidv6: "6", uuidv7: "7", uuidv8: "8" }, guidSeparators: /* @__PURE__ */ new Set([void 0, true, false, "-", ":"]), normalizationForms: ["NFC", "NFD", "NFKC", "NFKD"] };
        e3.exports = u.extend({ type: "string", flags: { insensitive: { default: false }, truncate: { default: false } }, terms: { replacements: { init: null } }, coerce: { from: "string", method(e4, { schema: t3, state: r2, prefs: s2 }) {
          const n2 = t3.$_getRule("normalize");
          n2 && (e4 = e4.normalize(n2.args.form));
          const a2 = t3.$_getRule("case");
          a2 && (e4 = "upper" === a2.args.direction ? e4.toLocaleUpperCase() : e4.toLocaleLowerCase());
          const i2 = t3.$_getRule("trim");
          if (i2 && i2.args.enabled && (e4 = e4.trim()), t3.$_terms.replacements) for (const r3 of t3.$_terms.replacements) e4 = e4.replace(r3.pattern, r3.replacement);
          const o2 = t3.$_getRule("hex");
          if (o2 && o2.args.options.byteAligned && e4.length % 2 != 0 && (e4 = `0${e4}`), t3.$_getRule("isoDate")) {
            const t4 = m.isoDate(e4);
            t4 && (e4 = t4);
          }
          if (t3._flags.truncate) {
            const n3 = t3.$_getRule("max");
            if (n3) {
              let a3 = n3.args.limit;
              if (f.isResolvable(a3) && (a3 = a3.resolve(e4, r2, s2), !f.limit(a3))) return { value: e4, errors: t3.$_createError("any.ref", a3, { ref: n3.args.limit, arg: "limit", reason: "must be a positive integer" }, r2, s2) };
              e4 = e4.slice(0, a3);
            }
          }
          return { value: e4 };
        } }, validate(e4, { schema: t3, error: r2 }) {
          if ("string" != typeof e4) return { value: e4, errors: r2("string.base") };
          if ("" === e4) {
            const s2 = t3.$_getRule("min");
            if (s2 && 0 === s2.args.limit) return;
            return { value: e4, errors: r2("string.empty") };
          }
        }, rules: { alphanum: { method() {
          return this.$_addRule("alphanum");
        }, validate: /* @__PURE__ */ __name((e4, t3) => /^[a-zA-Z0-9]+$/.test(e4) ? e4 : t3.error("string.alphanum"), "validate") }, base64: { method(e4 = {}) {
          return f.assertOptions(e4, ["paddingRequired", "urlSafe"]), e4 = { urlSafe: false, paddingRequired: true, ...e4 }, s("boolean" == typeof e4.paddingRequired, "paddingRequired must be boolean"), s("boolean" == typeof e4.urlSafe, "urlSafe must be boolean"), this.$_addRule({ name: "base64", args: { options: e4 } });
        }, validate: /* @__PURE__ */ __name((e4, t3, { options: r2 }) => m.base64Regex[r2.paddingRequired][r2.urlSafe].test(e4) ? e4 : t3.error("string.base64"), "validate") }, case: { method(e4) {
          return s(["lower", "upper"].includes(e4), "Invalid case:", e4), this.$_addRule({ name: "case", args: { direction: e4 } });
        }, validate: /* @__PURE__ */ __name((e4, t3, { direction: r2 }) => "lower" === r2 && e4 === e4.toLocaleLowerCase() || "upper" === r2 && e4 === e4.toLocaleUpperCase() ? e4 : t3.error(`string.${r2}case`), "validate"), convert: true }, creditCard: { method() {
          return this.$_addRule("creditCard");
        }, validate(e4, t3) {
          let r2 = e4.length, s2 = 0, n2 = 1;
          for (; r2--; ) {
            const t4 = e4.charAt(r2) * n2;
            s2 += t4 - 9 * (t4 > 9), n2 ^= 3;
          }
          return s2 > 0 && s2 % 10 == 0 ? e4 : t3.error("string.creditCard");
        } }, dataUri: { method(e4 = {}) {
          return f.assertOptions(e4, ["paddingRequired"]), e4 = { paddingRequired: true, ...e4 }, s("boolean" == typeof e4.paddingRequired, "paddingRequired must be boolean"), this.$_addRule({ name: "dataUri", args: { options: e4 } });
        }, validate(e4, t3, { options: r2 }) {
          const s2 = e4.match(m.dataUriRegex);
          if (s2) {
            if (!s2[2]) return e4;
            if ("base64" !== s2[2]) return e4;
            if (m.base64Regex[r2.paddingRequired].false.test(s2[3])) return e4;
          }
          return t3.error("string.dataUri");
        } }, domain: { method(e4) {
          e4 && f.assertOptions(e4, ["allowFullyQualified", "allowUnicode", "maxDomainSegments", "minDomainSegments", "tlds"]);
          const t3 = m.addressOptions(e4);
          return this.$_addRule({ name: "domain", args: { options: e4 }, address: t3 });
        }, validate: /* @__PURE__ */ __name((e4, t3, r2, { address: s2 }) => n.isValid(e4, s2) ? e4 : t3.error("string.domain"), "validate") }, email: { method(e4 = {}) {
          f.assertOptions(e4, ["allowFullyQualified", "allowUnicode", "ignoreLength", "maxDomainSegments", "minDomainSegments", "multiple", "separator", "tlds"]), s(void 0 === e4.multiple || "boolean" == typeof e4.multiple, "multiple option must be an boolean");
          const t3 = m.addressOptions(e4), r2 = new RegExp(`\\s*[${e4.separator ? o(e4.separator) : ","}]\\s*`);
          return this.$_addRule({ name: "email", args: { options: e4 }, regex: r2, address: t3 });
        }, validate(e4, t3, { options: r2 }, { regex: s2, address: n2 }) {
          const i2 = r2.multiple ? e4.split(s2) : [e4], o2 = [];
          for (const e5 of i2) a.isValid(e5, n2) || o2.push(e5);
          return o2.length ? t3.error("string.email", { value: e4, invalids: o2 }) : e4;
        } }, guid: { alias: "uuid", method(e4 = {}) {
          f.assertOptions(e4, ["version", "separator"]);
          let t3 = "";
          if (e4.version) {
            const r3 = [].concat(e4.version);
            s(r3.length >= 1, "version must have at least 1 valid version specified");
            const n3 = /* @__PURE__ */ new Set();
            for (let e5 = 0; e5 < r3.length; ++e5) {
              const a2 = r3[e5];
              s("string" == typeof a2, "version at position " + e5 + " must be a string");
              const i2 = m.guidVersions[a2.toLowerCase()];
              s(i2, "version at position " + e5 + " must be one of " + Object.keys(m.guidVersions).join(", ")), s(!n3.has(i2), "version at position " + e5 + " must not be a duplicate"), t3 += i2, n3.add(i2);
            }
          }
          s(m.guidSeparators.has(e4.separator), 'separator must be one of true, false, "-", or ":"');
          const r2 = void 0 === e4.separator ? "[:-]?" : true === e4.separator ? "[:-]" : false === e4.separator ? "[]?" : `\\${e4.separator}`, n2 = new RegExp(`^([\\[{\\(]?)[0-9A-F]{8}(${r2})[0-9A-F]{4}\\2?[${t3 || "0-9A-F"}][0-9A-F]{3}\\2?[${t3 ? "89AB" : "0-9A-F"}][0-9A-F]{3}\\2?[0-9A-F]{12}([\\]}\\)]?)$`, "i");
          return this.$_addRule({ name: "guid", args: { options: e4 }, regex: n2 });
        }, validate(e4, t3, r2, { regex: s2 }) {
          const n2 = s2.exec(e4);
          return n2 ? m.guidBrackets[n2[1]] !== n2[n2.length - 1] ? t3.error("string.guid") : e4 : t3.error("string.guid");
        } }, hex: { method(e4 = {}) {
          return f.assertOptions(e4, ["byteAligned", "prefix"]), e4 = { byteAligned: false, prefix: false, ...e4 }, s("boolean" == typeof e4.byteAligned, "byteAligned must be boolean"), s("boolean" == typeof e4.prefix || "optional" === e4.prefix, 'prefix must be boolean or "optional"'), this.$_addRule({ name: "hex", args: { options: e4 } });
        }, validate: /* @__PURE__ */ __name((e4, t3, { options: r2 }) => ("optional" === r2.prefix ? m.hexRegex.withOptionalPrefix : true === r2.prefix ? m.hexRegex.withPrefix : m.hexRegex.withoutPrefix).test(e4) ? r2.byteAligned && e4.length % 2 != 0 ? t3.error("string.hexAlign") : e4 : t3.error("string.hex"), "validate") }, hostname: { method() {
          return this.$_addRule("hostname");
        }, validate: /* @__PURE__ */ __name((e4, t3) => n.isValid(e4, { minDomainSegments: 1 }) || m.ipRegex.test(e4) ? e4 : t3.error("string.hostname"), "validate") }, insensitive: { method() {
          return this.$_setFlag("insensitive", true);
        } }, ip: { method(e4 = {}) {
          f.assertOptions(e4, ["cidr", "version"]);
          const { cidr: t3, versions: r2, regex: s2 } = i.regex(e4), n2 = e4.version ? r2 : void 0;
          return this.$_addRule({ name: "ip", args: { options: { cidr: t3, version: n2 } }, regex: s2 });
        }, validate: /* @__PURE__ */ __name((e4, t3, { options: r2 }, { regex: s2 }) => s2.test(e4) ? e4 : r2.version ? t3.error("string.ipVersion", { value: e4, cidr: r2.cidr, version: r2.version }) : t3.error("string.ip", { value: e4, cidr: r2.cidr }), "validate") }, isoDate: { method() {
          return this.$_addRule("isoDate");
        }, validate: /* @__PURE__ */ __name((e4, { error: t3 }) => m.isoDate(e4) ? e4 : t3("string.isoDate"), "validate") }, isoDuration: { method() {
          return this.$_addRule("isoDuration");
        }, validate: /* @__PURE__ */ __name((e4, t3) => m.isoDurationRegex.test(e4) ? e4 : t3.error("string.isoDuration"), "validate") }, length: { method(e4, t3) {
          return m.length(this, "length", e4, "=", t3);
        }, validate(e4, t3, { limit: r2, encoding: s2 }, { name: n2, operator: a2, args: i2 }) {
          const o2 = !s2 && e4.length;
          return f.compare(o2, r2, a2) ? e4 : t3.error("string." + n2, { limit: i2.limit, value: e4, encoding: s2 });
        }, args: [{ name: "limit", ref: true, assert: f.limit, message: "must be a positive integer" }, "encoding"] }, lowercase: { method() {
          return this.case("lower");
        } }, max: { method(e4, t3) {
          return m.length(this, "max", e4, "<=", t3);
        }, args: ["limit", "encoding"] }, min: { method(e4, t3) {
          return m.length(this, "min", e4, ">=", t3);
        }, args: ["limit", "encoding"] }, normalize: { method(e4 = "NFC") {
          return s(m.normalizationForms.includes(e4), "normalization form must be one of " + m.normalizationForms.join(", ")), this.$_addRule({ name: "normalize", args: { form: e4 } });
        }, validate: /* @__PURE__ */ __name((e4, { error: t3 }, { form: r2 }) => e4 === e4.normalize(r2) ? e4 : t3("string.normalize", { value: e4, form: r2 }), "validate"), convert: true }, pattern: { alias: "regex", method(e4, t3 = {}) {
          s(e4 instanceof RegExp, "regex must be a RegExp"), s(!e4.flags.includes("g") && !e4.flags.includes("y"), "regex should not use global or sticky mode"), "string" == typeof t3 && (t3 = { name: t3 }), f.assertOptions(t3, ["invert", "name"]);
          const r2 = ["string.pattern", t3.invert ? ".invert" : "", t3.name ? ".name" : ".base"].join("");
          return this.$_addRule({ name: "pattern", args: { regex: e4, options: t3 }, errorCode: r2 });
        }, validate: /* @__PURE__ */ __name((e4, t3, { regex: r2, options: s2 }, { errorCode: n2 }) => r2.test(e4) ^ s2.invert ? e4 : t3.error(n2, { name: s2.name, regex: r2, value: e4 }), "validate"), args: ["regex", "options"], multi: true }, replace: { method(e4, t3) {
          "string" == typeof e4 && (e4 = new RegExp(o(e4), "g")), s(e4 instanceof RegExp, "pattern must be a RegExp"), s("string" == typeof t3, "replacement must be a String");
          const r2 = this.clone();
          return r2.$_terms.replacements || (r2.$_terms.replacements = []), r2.$_terms.replacements.push({ pattern: e4, replacement: t3 }), r2;
        } }, token: { method() {
          return this.$_addRule("token");
        }, validate: /* @__PURE__ */ __name((e4, t3) => /^\w+$/.test(e4) ? e4 : t3.error("string.token"), "validate") }, trim: { method(e4 = true) {
          return s("boolean" == typeof e4, "enabled must be a boolean"), this.$_addRule({ name: "trim", args: { enabled: e4 } });
        }, validate: /* @__PURE__ */ __name((e4, t3, { enabled: r2 }) => r2 && e4 !== e4.trim() ? t3.error("string.trim") : e4, "validate"), convert: true }, truncate: { method(e4 = true) {
          return s("boolean" == typeof e4, "enabled must be a boolean"), this.$_setFlag("truncate", e4);
        } }, uppercase: { method() {
          return this.case("upper");
        } }, uri: { method(e4 = {}) {
          f.assertOptions(e4, ["allowRelative", "allowQuerySquareBrackets", "domain", "relativeOnly", "scheme", "encodeUri"]), e4.domain && f.assertOptions(e4.domain, ["allowFullyQualified", "allowUnicode", "maxDomainSegments", "minDomainSegments", "tlds"]);
          const { regex: t3, scheme: r2 } = c.regex(e4), s2 = e4.domain ? m.addressOptions(e4.domain) : null;
          return this.$_addRule({ name: "uri", args: { options: e4 }, regex: t3, domain: s2, scheme: r2 });
        }, validate(e4, t3, { options: r2 }, { regex: s2, domain: a2, scheme: i2 }) {
          if (["http:/", "https:/"].includes(e4)) return t3.error("string.uri");
          let o2 = s2.exec(e4);
          if (!o2 && t3.prefs.convert && r2.encodeUri) {
            const t4 = encodeURI(e4);
            o2 = s2.exec(t4), o2 && (e4 = t4);
          }
          if (o2) {
            const s3 = o2[1] || o2[2];
            return !a2 || r2.allowRelative && !s3 || n.isValid(s3, a2) ? e4 : t3.error("string.domain", { value: s3 });
          }
          return r2.relativeOnly ? t3.error("string.uriRelativeOnly") : r2.scheme ? t3.error("string.uriCustomScheme", { scheme: i2, value: e4 }) : t3.error("string.uri");
        } } }, manifest: { build(e4, t3) {
          if (t3.replacements) for (const { pattern: r2, replacement: s2 } of t3.replacements) e4 = e4.replace(r2, s2);
          return e4;
        } }, messages: { "string.alphanum": "{{#label}} must only contain alpha-numeric characters", "string.base": "{{#label}} must be a string", "string.base64": "{{#label}} must be a valid base64 string", "string.creditCard": "{{#label}} must be a credit card", "string.dataUri": "{{#label}} must be a valid dataUri string", "string.domain": "{{#label}} must contain a valid domain name", "string.email": "{{#label}} must be a valid email", "string.empty": "{{#label}} is not allowed to be empty", "string.guid": "{{#label}} must be a valid GUID", "string.hex": "{{#label}} must only contain hexadecimal characters", "string.hexAlign": "{{#label}} hex decoded representation must be byte aligned", "string.hostname": "{{#label}} must be a valid hostname", "string.ip": "{{#label}} must be a valid ip address with a {{#cidr}} CIDR", "string.ipVersion": "{{#label}} must be a valid ip address of one of the following versions {{#version}} with a {{#cidr}} CIDR", "string.isoDate": "{{#label}} must be in iso format", "string.isoDuration": "{{#label}} must be a valid ISO 8601 duration", "string.length": "{{#label}} length must be {{#limit}} characters long", "string.lowercase": "{{#label}} must only contain lowercase characters", "string.max": "{{#label}} length must be less than or equal to {{#limit}} characters long", "string.min": "{{#label}} length must be at least {{#limit}} characters long", "string.normalize": "{{#label}} must be unicode normalized in the {{#form}} form", "string.token": "{{#label}} must only contain alpha-numeric and underscore characters", "string.pattern.base": "{{#label}} with value {:[.]} fails to match the required pattern: {{#regex}}", "string.pattern.name": "{{#label}} with value {:[.]} fails to match the {{#name}} pattern", "string.pattern.invert.base": "{{#label}} with value {:[.]} matches the inverted pattern: {{#regex}}", "string.pattern.invert.name": "{{#label}} with value {:[.]} matches the inverted {{#name}} pattern", "string.trim": "{{#label}} must not have leading or trailing whitespace", "string.uri": "{{#label}} must be a valid uri", "string.uriCustomScheme": "{{#label}} must be a valid uri with a scheme matching the {{#scheme}} pattern", "string.uriRelativeOnly": "{{#label}} must be a valid relative uri", "string.uppercase": "{{#label}} must only contain uppercase characters" } }), m.addressOptions = function(e4) {
          if (!e4) return m.tlds || e4;
          if (s(void 0 === e4.minDomainSegments || Number.isSafeInteger(e4.minDomainSegments) && e4.minDomainSegments > 0, "minDomainSegments must be a positive integer"), s(void 0 === e4.maxDomainSegments || Number.isSafeInteger(e4.maxDomainSegments) && e4.maxDomainSegments > 0, "maxDomainSegments must be a positive integer"), false === e4.tlds) return e4;
          if (true === e4.tlds || void 0 === e4.tlds) return s(m.tlds, "Built-in TLD list disabled"), Object.assign({}, e4, m.tlds);
          s("object" == typeof e4.tlds, "tlds must be true, false, or an object");
          const t3 = e4.tlds.deny;
          if (t3) return Array.isArray(t3) && (e4 = Object.assign({}, e4, { tlds: { deny: new Set(t3) } })), s(e4.tlds.deny instanceof Set, "tlds.deny must be an array, Set, or boolean"), s(!e4.tlds.allow, "Cannot specify both tlds.allow and tlds.deny lists"), m.validateTlds(e4.tlds.deny, "tlds.deny"), e4;
          const r2 = e4.tlds.allow;
          return r2 ? true === r2 ? (s(m.tlds, "Built-in TLD list disabled"), Object.assign({}, e4, m.tlds)) : (Array.isArray(r2) && (e4 = Object.assign({}, e4, { tlds: { allow: new Set(r2) } })), s(e4.tlds.allow instanceof Set, "tlds.allow must be an array, Set, or boolean"), m.validateTlds(e4.tlds.allow, "tlds.allow"), e4) : e4;
        }, m.validateTlds = function(e4, t3) {
          for (const r2 of e4) s(n.isValid(r2, { minDomainSegments: 1, maxDomainSegments: 1 }), `${t3} must contain valid top level domain names`);
        }, m.isoDate = function(e4) {
          if (!f.isIsoDate(e4)) return null;
          /.*T.*[+-]\d\d$/.test(e4) && (e4 += "00");
          const t3 = new Date(e4);
          return isNaN(t3.getTime()) ? null : t3.toISOString();
        }, m.length = function(e4, t3, r2, n2, a2) {
          return s(!a2 || false, "Invalid encoding:", a2), e4.$_addRule({ name: t3, method: "length", args: { limit: r2, encoding: a2 }, operator: n2 });
        };
      }, 8826: (e3, t2, r) => {
        "use strict";
        const s = r(375), n = r(8068), a = {};
        a.Map = class extends Map {
          slice() {
            return new a.Map(this);
          }
        }, e3.exports = n.extend({ type: "symbol", terms: { map: { init: new a.Map() } }, coerce: { method(e4, { schema: t3, error: r2 }) {
          const s2 = t3.$_terms.map.get(e4);
          return s2 && (e4 = s2), t3._flags.only && "symbol" != typeof e4 ? { value: e4, errors: r2("symbol.map", { map: t3.$_terms.map }) } : { value: e4 };
        } }, validate(e4, { error: t3 }) {
          if ("symbol" != typeof e4) return { value: e4, errors: t3("symbol.base") };
        }, rules: { map: { method(e4) {
          e4 && !e4[Symbol.iterator] && "object" == typeof e4 && (e4 = Object.entries(e4)), s(e4 && e4[Symbol.iterator], "Iterable must be an iterable or object");
          const t3 = this.clone(), r2 = [];
          for (const n2 of e4) {
            s(n2 && n2[Symbol.iterator], "Entry must be an iterable");
            const [e5, a2] = n2;
            s("object" != typeof e5 && "function" != typeof e5 && "symbol" != typeof e5, "Key must not be of type object, function, or Symbol"), s("symbol" == typeof a2, "Value must be a Symbol"), t3.$_terms.map.set(e5, a2), r2.push(a2);
          }
          return t3.valid(...r2);
        } } }, manifest: { build: /* @__PURE__ */ __name((e4, t3) => (t3.map && (e4 = e4.map(t3.map)), e4), "build") }, messages: { "symbol.base": "{{#label}} must be a symbol", "symbol.map": "{{#label}} must be one of {{#map}}" } });
      }, 8863: (e3, t2, r) => {
        "use strict";
        const s = r(375), n = r(8571), a = r(738), i = r(9621), o = r(8160), l = r(6354), c = r(493), u = { result: Symbol("result") };
        t2.entry = function(e4, t3, r2) {
          let n2 = o.defaults;
          r2 && (s(void 0 === r2.warnings, "Cannot override warnings preference in synchronous validation"), s(void 0 === r2.artifacts, "Cannot override artifacts preference in synchronous validation"), n2 = o.preferences(o.defaults, r2));
          const a2 = u.entry(e4, t3, n2);
          s(!a2.mainstay.externals.length, "Schema with external rules must use validateAsync()");
          const i2 = { value: a2.value };
          return a2.error && (i2.error = a2.error), a2.mainstay.warnings.length && (i2.warning = l.details(a2.mainstay.warnings)), a2.mainstay.debug && (i2.debug = a2.mainstay.debug), a2.mainstay.artifacts && (i2.artifacts = a2.mainstay.artifacts), i2;
        }, t2.entryAsync = async function(e4, t3, r2) {
          let s2 = o.defaults;
          r2 && (s2 = o.preferences(o.defaults, r2));
          const n2 = u.entry(e4, t3, s2), a2 = n2.mainstay;
          if (n2.error) throw a2.debug && (n2.error.debug = a2.debug), n2.error;
          if (a2.externals.length) {
            let t4 = n2.value;
            const c3 = [];
            for (const n3 of a2.externals) {
              const f = n3.state.path, m = "link" === n3.schema.type ? a2.links.get(n3.schema) : null;
              let h, d, p = t4;
              const g = f.length ? [t4] : [], y = f.length ? i(e4, f) : e4;
              if (f.length) {
                h = f[f.length - 1];
                let e5 = t4;
                for (const t5 of f.slice(0, -1)) e5 = e5[t5], g.unshift(e5);
                d = g[0], p = d[h];
              }
              try {
                const e5 = /* @__PURE__ */ __name((e6, t5) => (m || n3.schema).$_createError(e6, p, t5, n3.state, s2), "e"), i2 = await n3.method(p, { schema: n3.schema, linked: m, state: n3.state, prefs: r2, original: y, error: e5, errorsArray: u.errorsArray, warn: /* @__PURE__ */ __name((e6, t5) => a2.warnings.push((m || n3.schema).$_createError(e6, p, t5, n3.state, s2)), "warn"), message: /* @__PURE__ */ __name((e6, t5) => (m || n3.schema).$_createError("external", p, t5, n3.state, s2, { messages: e6 }), "message") });
                if (void 0 === i2 || i2 === p) continue;
                if (i2 instanceof l.Report) {
                  if (a2.tracer.log(n3.schema, n3.state, "rule", "external", "error"), c3.push(i2), s2.abortEarly) break;
                  continue;
                }
                if (Array.isArray(i2) && i2[o.symbols.errors]) {
                  if (a2.tracer.log(n3.schema, n3.state, "rule", "external", "error"), c3.push(...i2), s2.abortEarly) break;
                  continue;
                }
                d ? (a2.tracer.value(n3.state, "rule", p, i2, "external"), d[h] = i2) : (a2.tracer.value(n3.state, "rule", t4, i2, "external"), t4 = i2);
              } catch (e5) {
                throw s2.errors.label && (e5.message += ` (${n3.label})`), e5;
              }
            }
            if (n2.value = t4, c3.length) throw n2.error = l.process(c3, e4, s2), a2.debug && (n2.error.debug = a2.debug), n2.error;
          }
          if (!s2.warnings && !s2.debug && !s2.artifacts) return n2.value;
          const c2 = { value: n2.value };
          return a2.warnings.length && (c2.warning = l.details(a2.warnings)), a2.debug && (c2.debug = a2.debug), a2.artifacts && (c2.artifacts = a2.artifacts), c2;
        }, u.Mainstay = class {
          constructor(e4, t3, r2) {
            this.externals = [], this.warnings = [], this.tracer = e4, this.debug = t3, this.links = r2, this.shadow = null, this.artifacts = null, this._snapshots = [];
          }
          snapshot() {
            this._snapshots.push({ externals: this.externals.slice(), warnings: this.warnings.slice() });
          }
          restore() {
            const e4 = this._snapshots.pop();
            this.externals = e4.externals, this.warnings = e4.warnings;
          }
          commit() {
            this._snapshots.pop();
          }
        }, u.entry = function(e4, r2, s2) {
          const { tracer: n2, cleanup: a2 } = u.tracer(r2, s2), i2 = s2.debug ? [] : null, o2 = r2._ids._schemaChain ? /* @__PURE__ */ new Map() : null, f = new u.Mainstay(n2, i2, o2), m = r2._ids._schemaChain ? [{ schema: r2 }] : null, h = new c([], [], { mainstay: f, schemas: m }), d = t2.validate(e4, r2, h, s2);
          a2 && r2.$_root.untrace();
          const p = l.process(d.errors, e4, s2);
          return { value: d.value, error: p, mainstay: f };
        }, u.tracer = function(e4, t3) {
          return e4.$_root._tracer ? { tracer: e4.$_root._tracer._register(e4) } : t3.debug ? (s(e4.$_root.trace, "Debug mode not supported"), { tracer: e4.$_root.trace()._register(e4), cleanup: true }) : { tracer: u.ignore };
        }, t2.validate = function(e4, t3, r2, s2, n2 = {}) {
          if (t3.$_terms.whens && (t3 = t3._generate(e4, r2, s2).schema), t3._preferences && (s2 = u.prefs(t3, s2)), t3._cache && s2.cache) {
            const s3 = t3._cache.get(e4);
            if (r2.mainstay.tracer.debug(r2, "validate", "cached", !!s3), s3) return s3;
          }
          const a2 = /* @__PURE__ */ __name((n3, a3, i3) => t3.$_createError(n3, e4, a3, i3 || r2, s2), "a"), i2 = { original: e4, prefs: s2, schema: t3, state: r2, error: a2, errorsArray: u.errorsArray, warn: /* @__PURE__ */ __name((e5, t4, s3) => r2.mainstay.warnings.push(a2(e5, t4, s3)), "warn"), message: /* @__PURE__ */ __name((n3, a3) => t3.$_createError("custom", e4, a3, r2, s2, { messages: n3 }), "message") };
          r2.mainstay.tracer.entry(t3, r2);
          const l2 = t3._definition;
          if (l2.prepare && void 0 !== e4 && s2.convert) {
            const t4 = l2.prepare(e4, i2);
            if (t4) {
              if (r2.mainstay.tracer.value(r2, "prepare", e4, t4.value), t4.errors) return u.finalize(t4.value, [].concat(t4.errors), i2);
              e4 = t4.value;
            }
          }
          if (l2.coerce && void 0 !== e4 && s2.convert && (!l2.coerce.from || l2.coerce.from.includes(typeof e4))) {
            const t4 = l2.coerce.method(e4, i2);
            if (t4) {
              if (r2.mainstay.tracer.value(r2, "coerced", e4, t4.value), t4.errors) return u.finalize(t4.value, [].concat(t4.errors), i2);
              e4 = t4.value;
            }
          }
          const c2 = t3._flags.empty;
          c2 && c2.$_match(u.trim(e4, t3), r2.nest(c2), o.defaults) && (r2.mainstay.tracer.value(r2, "empty", e4, void 0), e4 = void 0);
          const f = n2.presence || t3._flags.presence || (t3._flags._endedSwitch ? null : s2.presence);
          if (void 0 === e4) {
            if ("forbidden" === f) return u.finalize(e4, null, i2);
            if ("required" === f) return u.finalize(e4, [t3.$_createError("any.required", e4, null, r2, s2)], i2);
            if ("optional" === f) {
              if (t3._flags.default !== o.symbols.deepDefault) return u.finalize(e4, null, i2);
              r2.mainstay.tracer.value(r2, "default", e4, {}), e4 = {};
            }
          } else if ("forbidden" === f) return u.finalize(e4, [t3.$_createError("any.unknown", e4, null, r2, s2)], i2);
          const m = [];
          if (t3._valids) {
            const n3 = t3._valids.get(e4, r2, s2, t3._flags.insensitive);
            if (n3) return s2.convert && (r2.mainstay.tracer.value(r2, "valids", e4, n3.value), e4 = n3.value), r2.mainstay.tracer.filter(t3, r2, "valid", n3), u.finalize(e4, null, i2);
            if (t3._flags.only) {
              const n4 = t3.$_createError("any.only", e4, { valids: t3._valids.values({ display: true }) }, r2, s2);
              if (s2.abortEarly) return u.finalize(e4, [n4], i2);
              m.push(n4);
            }
          }
          if (t3._invalids) {
            const n3 = t3._invalids.get(e4, r2, s2, t3._flags.insensitive);
            if (n3) {
              r2.mainstay.tracer.filter(t3, r2, "invalid", n3);
              const a3 = t3.$_createError("any.invalid", e4, { invalids: t3._invalids.values({ display: true }) }, r2, s2);
              if (s2.abortEarly) return u.finalize(e4, [a3], i2);
              m.push(a3);
            }
          }
          if (l2.validate) {
            const t4 = l2.validate(e4, i2);
            if (t4 && (r2.mainstay.tracer.value(r2, "base", e4, t4.value), e4 = t4.value, t4.errors)) {
              if (!Array.isArray(t4.errors)) return m.push(t4.errors), u.finalize(e4, m, i2);
              if (t4.errors.length) return m.push(...t4.errors), u.finalize(e4, m, i2);
            }
          }
          return t3._rules.length ? u.rules(e4, m, i2) : u.finalize(e4, m, i2);
        }, u.rules = function(e4, t3, r2) {
          const { schema: s2, state: n2, prefs: a2 } = r2;
          for (const i2 of s2._rules) {
            const l2 = s2._definition.rules[i2.method];
            if (l2.convert && a2.convert) {
              n2.mainstay.tracer.log(s2, n2, "rule", i2.name, "full");
              continue;
            }
            let c2, f = i2.args;
            if (i2._resolve.length) {
              f = Object.assign({}, f);
              for (const t4 of i2._resolve) {
                const r3 = l2.argsByName.get(t4), i3 = f[t4].resolve(e4, n2, a2), u2 = r3.normalize ? r3.normalize(i3) : i3, m2 = o.validateArg(u2, null, r3);
                if (m2) {
                  c2 = s2.$_createError("any.ref", i3, { arg: t4, ref: f[t4], reason: m2 }, n2, a2);
                  break;
                }
                f[t4] = u2;
              }
            }
            c2 = c2 || l2.validate(e4, r2, f, i2);
            const m = u.rule(c2, i2);
            if (m.errors) {
              if (n2.mainstay.tracer.log(s2, n2, "rule", i2.name, "error"), i2.warn) {
                n2.mainstay.warnings.push(...m.errors);
                continue;
              }
              if (a2.abortEarly) return u.finalize(e4, m.errors, r2);
              t3.push(...m.errors);
            } else n2.mainstay.tracer.log(s2, n2, "rule", i2.name, "pass"), n2.mainstay.tracer.value(n2, "rule", e4, m.value, i2.name), e4 = m.value;
          }
          return u.finalize(e4, t3, r2);
        }, u.rule = function(e4, t3) {
          return e4 instanceof l.Report ? (u.error(e4, t3), { errors: [e4], value: null }) : Array.isArray(e4) && e4[o.symbols.errors] ? (e4.forEach((e5) => u.error(e5, t3)), { errors: e4, value: null }) : { errors: null, value: e4 };
        }, u.error = function(e4, t3) {
          return t3.message && e4._setTemplate(t3.message), e4;
        }, u.finalize = function(e4, t3, r2) {
          t3 = t3 || [];
          const { schema: n2, state: a2, prefs: i2 } = r2;
          if (t3.length) {
            const s2 = u.default("failover", void 0, t3, r2);
            void 0 !== s2 && (a2.mainstay.tracer.value(a2, "failover", e4, s2), e4 = s2, t3 = []);
          }
          if (t3.length && n2._flags.error) if ("function" == typeof n2._flags.error) {
            t3 = n2._flags.error(t3), Array.isArray(t3) || (t3 = [t3]);
            for (const e5 of t3) s(e5 instanceof Error || e5 instanceof l.Report, "error() must return an Error object");
          } else t3 = [n2._flags.error];
          if (void 0 === e4) {
            const s2 = u.default("default", e4, t3, r2);
            a2.mainstay.tracer.value(a2, "default", e4, s2), e4 = s2;
          }
          if (n2._flags.cast && void 0 !== e4) {
            const t4 = n2._definition.cast[n2._flags.cast];
            if (t4.from(e4)) {
              const s2 = t4.to(e4, r2);
              a2.mainstay.tracer.value(a2, "cast", e4, s2, n2._flags.cast), e4 = s2;
            }
          }
          if (n2.$_terms.externals && i2.externals && false !== i2._externals) for (const { method: e5 } of n2.$_terms.externals) a2.mainstay.externals.push({ method: e5, schema: n2, state: a2, label: l.label(n2._flags, a2, i2) });
          const o2 = { value: e4, errors: t3.length ? t3 : null };
          return n2._flags.result && (o2.value = "strip" === n2._flags.result ? void 0 : r2.original, a2.mainstay.tracer.value(a2, n2._flags.result, e4, o2.value), a2.shadow(e4, n2._flags.result)), n2._cache && false !== i2.cache && !n2._refs.length && n2._cache.set(r2.original, o2), void 0 === e4 || o2.errors || void 0 === n2._flags.artifact || (a2.mainstay.artifacts = a2.mainstay.artifacts || /* @__PURE__ */ new Map(), a2.mainstay.artifacts.has(n2._flags.artifact) || a2.mainstay.artifacts.set(n2._flags.artifact, []), a2.mainstay.artifacts.get(n2._flags.artifact).push(a2.path)), o2;
        }, u.prefs = function(e4, t3) {
          const r2 = t3 === o.defaults;
          return r2 && e4._preferences[o.symbols.prefs] ? e4._preferences[o.symbols.prefs] : (t3 = o.preferences(t3, e4._preferences), r2 && (e4._preferences[o.symbols.prefs] = t3), t3);
        }, u.default = function(e4, t3, r2, s2) {
          const { schema: a2, state: i2, prefs: l2 } = s2, c2 = a2._flags[e4];
          if (l2.noDefaults || void 0 === c2) return t3;
          if (i2.mainstay.tracer.log(a2, i2, "rule", e4, "full"), !c2) return c2;
          if ("function" == typeof c2) {
            const t4 = c2.length ? [n(i2.ancestors[0]), s2] : [];
            try {
              return c2(...t4);
            } catch (t5) {
              return void r2.push(a2.$_createError(`any.${e4}`, null, { error: t5 }, i2, l2));
            }
          }
          return "object" != typeof c2 ? c2 : c2[o.symbols.literal] ? c2.literal : o.isResolvable(c2) ? c2.resolve(t3, i2, l2) : n(c2);
        }, u.trim = function(e4, t3) {
          if ("string" != typeof e4) return e4;
          const r2 = t3.$_getRule("trim");
          return r2 && r2.args.enabled ? e4.trim() : e4;
        }, u.ignore = { active: false, debug: a, entry: a, filter: a, log: a, resolve: a, value: a }, u.errorsArray = function() {
          const e4 = [];
          return e4[o.symbols.errors] = true, e4;
        };
      }, 2036: (e3, t2, r) => {
        "use strict";
        const s = r(375), n = r(9474), a = r(8160), i = {};
        e3.exports = i.Values = class {
          constructor(e4, t3) {
            this._values = new Set(e4), this._refs = new Set(t3), this._lowercase = i.lowercases(e4), this._override = false;
          }
          get length() {
            return this._values.size + this._refs.size;
          }
          add(e4, t3) {
            a.isResolvable(e4) ? this._refs.has(e4) || (this._refs.add(e4), t3 && t3.register(e4)) : this.has(e4, null, null, false) || (this._values.add(e4), "string" == typeof e4 && this._lowercase.set(e4.toLowerCase(), e4));
          }
          static merge(e4, t3, r2) {
            if (e4 = e4 || new i.Values(), t3) {
              if (t3._override) return t3.clone();
              for (const r3 of [...t3._values, ...t3._refs]) e4.add(r3);
            }
            if (r2) for (const t4 of [...r2._values, ...r2._refs]) e4.remove(t4);
            return e4.length ? e4 : null;
          }
          remove(e4) {
            a.isResolvable(e4) ? this._refs.delete(e4) : (this._values.delete(e4), "string" == typeof e4 && this._lowercase.delete(e4.toLowerCase()));
          }
          has(e4, t3, r2, s2) {
            return !!this.get(e4, t3, r2, s2);
          }
          get(e4, t3, r2, s2) {
            if (!this.length) return false;
            if (this._values.has(e4)) return { value: e4 };
            if ("string" == typeof e4 && e4 && s2) {
              const t4 = this._lowercase.get(e4.toLowerCase());
              if (t4) return { value: t4 };
            }
            if (!this._refs.size && "object" != typeof e4) return false;
            if ("object" == typeof e4) {
              for (const t4 of this._values) if (n(t4, e4)) return { value: t4 };
            }
            if (t3) for (const a2 of this._refs) {
              const i2 = a2.resolve(e4, t3, r2, null, { in: true });
              if (void 0 === i2) continue;
              const o = a2.in && "object" == typeof i2 ? Array.isArray(i2) ? i2 : Object.keys(i2) : [i2];
              for (const t4 of o) if (typeof t4 == typeof e4) {
                if (s2 && e4 && "string" == typeof e4) {
                  if (t4.toLowerCase() === e4.toLowerCase()) return { value: t4, ref: a2 };
                } else if (n(t4, e4)) return { value: t4, ref: a2 };
              }
            }
            return false;
          }
          override() {
            this._override = true;
          }
          values(e4) {
            if (e4 && e4.display) {
              const e5 = [];
              for (const t3 of [...this._values, ...this._refs]) void 0 !== t3 && e5.push(t3);
              return e5;
            }
            return Array.from([...this._values, ...this._refs]);
          }
          clone() {
            const e4 = new i.Values(this._values, this._refs);
            return e4._override = this._override, e4;
          }
          concat(e4) {
            s(!e4._override, "Cannot concat override set of values");
            const t3 = new i.Values([...this._values, ...e4._values], [...this._refs, ...e4._refs]);
            return t3._override = this._override, t3;
          }
          describe() {
            const e4 = [];
            this._override && e4.push({ override: true });
            for (const t3 of this._values.values()) e4.push(t3 && "object" == typeof t3 ? { value: t3 } : t3);
            for (const t3 of this._refs.values()) e4.push(t3.describe());
            return e4;
          }
        }, i.Values.prototype[a.symbols.values] = true, i.Values.prototype.slice = i.Values.prototype.clone, i.lowercases = function(e4) {
          const t3 = /* @__PURE__ */ new Map();
          if (e4) for (const r2 of e4) "string" == typeof r2 && t3.set(r2.toLowerCase(), r2);
          return t3;
        };
      }, 978: (e3, t2, r) => {
        "use strict";
        const s = r(375), n = r(8571), a = r(1687), i = r(9621), o = {};
        e3.exports = function(e4, t3, r2 = {}) {
          if (s(e4 && "object" == typeof e4, "Invalid defaults value: must be an object"), s(!t3 || true === t3 || "object" == typeof t3, "Invalid source value: must be true, falsy or an object"), s("object" == typeof r2, "Invalid options: must be an object"), !t3) return null;
          if (r2.shallow) return o.applyToDefaultsWithShallow(e4, t3, r2);
          const i2 = n(e4);
          if (true === t3) return i2;
          const l = void 0 !== r2.nullOverride && r2.nullOverride;
          return a(i2, t3, { nullOverride: l, mergeArrays: false });
        }, o.applyToDefaultsWithShallow = function(e4, t3, r2) {
          const l = r2.shallow;
          s(Array.isArray(l), "Invalid keys");
          const c = /* @__PURE__ */ new Map(), u = true === t3 ? null : /* @__PURE__ */ new Set();
          for (let r3 of l) {
            r3 = Array.isArray(r3) ? r3 : r3.split(".");
            const s2 = i(e4, r3);
            s2 && "object" == typeof s2 ? c.set(s2, u && i(t3, r3) || s2) : u && u.add(r3);
          }
          const f = n(e4, {}, c);
          if (!u) return f;
          for (const e5 of u) o.reachCopy(f, t3, e5);
          const m = void 0 !== r2.nullOverride && r2.nullOverride;
          return a(f, t3, { nullOverride: m, mergeArrays: false });
        }, o.reachCopy = function(e4, t3, r2) {
          for (const e5 of r2) {
            if (!(e5 in t3)) return;
            const r3 = t3[e5];
            if ("object" != typeof r3 || null === r3) return;
            t3 = r3;
          }
          const s2 = t3;
          let n2 = e4;
          for (let e5 = 0; e5 < r2.length - 1; ++e5) {
            const t4 = r2[e5];
            "object" != typeof n2[t4] && (n2[t4] = {}), n2 = n2[t4];
          }
          n2[r2[r2.length - 1]] = s2;
        };
      }, 375: (e3, t2, r) => {
        "use strict";
        const s = r(7916);
        e3.exports = function(e4, ...t3) {
          if (!e4) {
            if (1 === t3.length && t3[0] instanceof Error) throw t3[0];
            throw new s(t3);
          }
        };
      }, 8571: (e3, t2, r) => {
        "use strict";
        const s = r(9621), n = r(4277), a = r(7043), i = { needsProtoHack: /* @__PURE__ */ new Set([n.set, n.map, n.weakSet, n.weakMap]) };
        e3.exports = i.clone = function(e4, t3 = {}, r2 = null) {
          if ("object" != typeof e4 || null === e4) return e4;
          let s2 = i.clone, o = r2;
          if (t3.shallow) {
            if (true !== t3.shallow) return i.cloneWithShallow(e4, t3);
            s2 = /* @__PURE__ */ __name((e5) => e5, "s");
          } else if (o) {
            const t4 = o.get(e4);
            if (t4) return t4;
          } else o = /* @__PURE__ */ new Map();
          const l = n.getInternalProto(e4);
          if (l === n.buffer) return false;
          if (l === n.date) return new Date(e4.getTime());
          if (l === n.regex) return new RegExp(e4);
          const c = i.base(e4, l, t3);
          if (c === e4) return e4;
          if (o && o.set(e4, c), l === n.set) for (const r3 of e4) c.add(s2(r3, t3, o));
          else if (l === n.map) for (const [r3, n2] of e4) c.set(r3, s2(n2, t3, o));
          const u = a.keys(e4, t3);
          for (const r3 of u) {
            if ("__proto__" === r3) continue;
            if (l === n.array && "length" === r3) {
              c.length = e4.length;
              continue;
            }
            const a2 = Object.getOwnPropertyDescriptor(e4, r3);
            a2 ? a2.get || a2.set ? Object.defineProperty(c, r3, a2) : a2.enumerable ? c[r3] = s2(e4[r3], t3, o) : Object.defineProperty(c, r3, { enumerable: false, writable: true, configurable: true, value: s2(e4[r3], t3, o) }) : Object.defineProperty(c, r3, { enumerable: true, writable: true, configurable: true, value: s2(e4[r3], t3, o) });
          }
          return c;
        }, i.cloneWithShallow = function(e4, t3) {
          const r2 = t3.shallow;
          (t3 = Object.assign({}, t3)).shallow = false;
          const n2 = /* @__PURE__ */ new Map();
          for (const t4 of r2) {
            const r3 = s(e4, t4);
            "object" != typeof r3 && "function" != typeof r3 || n2.set(r3, r3);
          }
          return i.clone(e4, t3, n2);
        }, i.base = function(e4, t3, r2) {
          if (false === r2.prototype) return i.needsProtoHack.has(t3) ? new t3.constructor() : t3 === n.array ? [] : {};
          const s2 = Object.getPrototypeOf(e4);
          if (s2 && s2.isImmutable) return e4;
          if (t3 === n.array) {
            const e5 = [];
            return s2 !== t3 && Object.setPrototypeOf(e5, s2), e5;
          }
          if (i.needsProtoHack.has(t3)) {
            const e5 = new s2.constructor();
            return s2 !== t3 && Object.setPrototypeOf(e5, s2), e5;
          }
          return Object.create(s2);
        };
      }, 9474: (e3, t2, r) => {
        "use strict";
        const s = r(4277), n = { mismatched: null };
        e3.exports = function(e4, t3, r2) {
          return r2 = Object.assign({ prototype: true }, r2), !!n.isDeepEqual(e4, t3, r2, []);
        }, n.isDeepEqual = function(e4, t3, r2, a) {
          if (e4 === t3) return 0 !== e4 || 1 / e4 == 1 / t3;
          const i = typeof e4;
          if (i !== typeof t3) return false;
          if (null === e4 || null === t3) return false;
          if ("function" === i) {
            if (!r2.deepFunction || e4.toString() !== t3.toString()) return false;
          } else if ("object" !== i) return e4 != e4 && t3 != t3;
          const o = n.getSharedType(e4, t3, !!r2.prototype);
          switch (o) {
            case s.buffer:
              return false;
            case s.promise:
              return e4 === t3;
            case s.regex:
              return e4.toString() === t3.toString();
            case n.mismatched:
              return false;
          }
          for (let r3 = a.length - 1; r3 >= 0; --r3) if (a[r3].isSame(e4, t3)) return true;
          a.push(new n.SeenEntry(e4, t3));
          try {
            return !!n.isDeepEqualObj(o, e4, t3, r2, a);
          } finally {
            a.pop();
          }
        }, n.getSharedType = function(e4, t3, r2) {
          if (r2) return Object.getPrototypeOf(e4) !== Object.getPrototypeOf(t3) ? n.mismatched : s.getInternalProto(e4);
          const a = s.getInternalProto(e4);
          return a !== s.getInternalProto(t3) ? n.mismatched : a;
        }, n.valueOf = function(e4) {
          const t3 = e4.valueOf;
          if (void 0 === t3) return e4;
          try {
            return t3.call(e4);
          } catch (e5) {
            return e5;
          }
        }, n.hasOwnEnumerableProperty = function(e4, t3) {
          return Object.prototype.propertyIsEnumerable.call(e4, t3);
        }, n.isSetSimpleEqual = function(e4, t3) {
          for (const r2 of Set.prototype.values.call(e4)) if (!Set.prototype.has.call(t3, r2)) return false;
          return true;
        }, n.isDeepEqualObj = function(e4, t3, r2, a, i) {
          const { isDeepEqual: o, valueOf: l, hasOwnEnumerableProperty: c } = n, { keys: u, getOwnPropertySymbols: f } = Object;
          if (e4 === s.array) {
            if (!a.part) {
              if (t3.length !== r2.length) return false;
              for (let e5 = 0; e5 < t3.length; ++e5) if (!o(t3[e5], r2[e5], a, i)) return false;
              return true;
            }
            for (const e5 of t3) for (const t4 of r2) if (o(e5, t4, a, i)) return true;
          } else if (e4 === s.set) {
            if (t3.size !== r2.size) return false;
            if (!n.isSetSimpleEqual(t3, r2)) {
              const e5 = new Set(Set.prototype.values.call(r2));
              for (const r3 of Set.prototype.values.call(t3)) {
                if (e5.delete(r3)) continue;
                let t4 = false;
                for (const s2 of e5) if (o(r3, s2, a, i)) {
                  e5.delete(s2), t4 = true;
                  break;
                }
                if (!t4) return false;
              }
            }
          } else if (e4 === s.map) {
            if (t3.size !== r2.size) return false;
            for (const [e5, s2] of Map.prototype.entries.call(t3)) {
              if (void 0 === s2 && !Map.prototype.has.call(r2, e5)) return false;
              if (!o(s2, Map.prototype.get.call(r2, e5), a, i)) return false;
            }
          } else if (e4 === s.error && (t3.name !== r2.name || t3.message !== r2.message)) return false;
          const m = l(t3), h = l(r2);
          if ((t3 !== m || r2 !== h) && !o(m, h, a, i)) return false;
          const d = u(t3);
          if (!a.part && d.length !== u(r2).length && !a.skip) return false;
          let p = 0;
          for (const e5 of d) if (a.skip && a.skip.includes(e5)) void 0 === r2[e5] && ++p;
          else {
            if (!c(r2, e5)) return false;
            if (!o(t3[e5], r2[e5], a, i)) return false;
          }
          if (!a.part && d.length - p !== u(r2).length) return false;
          if (false !== a.symbols) {
            const e5 = f(t3), s2 = new Set(f(r2));
            for (const n2 of e5) {
              if (!a.skip || !a.skip.includes(n2)) {
                if (c(t3, n2)) {
                  if (!c(r2, n2)) return false;
                  if (!o(t3[n2], r2[n2], a, i)) return false;
                } else if (c(r2, n2)) return false;
              }
              s2.delete(n2);
            }
            for (const e6 of s2) if (c(r2, e6)) return false;
          }
          return true;
        }, n.SeenEntry = class {
          constructor(e4, t3) {
            this.obj = e4, this.ref = t3;
          }
          isSame(e4, t3) {
            return this.obj === e4 && this.ref === t3;
          }
        };
      }, 7916: (e3, t2, r) => {
        "use strict";
        const s = r(8761);
        e3.exports = class extends Error {
          constructor(e4) {
            super(e4.filter((e5) => "" !== e5).map((e5) => "string" == typeof e5 ? e5 : e5 instanceof Error ? e5.message : s(e5)).join(" ") || "Unknown error"), "function" == typeof Error.captureStackTrace && Error.captureStackTrace(this, t2.assert);
          }
        };
      }, 5277: (e3) => {
        "use strict";
        const t2 = {};
        e3.exports = function(e4) {
          if (!e4) return "";
          let r = "";
          for (let s = 0; s < e4.length; ++s) {
            const n = e4.charCodeAt(s);
            t2.isSafe(n) ? r += e4[s] : r += t2.escapeHtmlChar(n);
          }
          return r;
        }, t2.escapeHtmlChar = function(e4) {
          return t2.namedHtml.get(e4) || (e4 >= 256 ? "&#" + e4 + ";" : `&#x${e4.toString(16).padStart(2, "0")};`);
        }, t2.isSafe = function(e4) {
          return t2.safeCharCodes.has(e4);
        }, t2.namedHtml = /* @__PURE__ */ new Map([[38, "&amp;"], [60, "&lt;"], [62, "&gt;"], [34, "&quot;"], [160, "&nbsp;"], [162, "&cent;"], [163, "&pound;"], [164, "&curren;"], [169, "&copy;"], [174, "&reg;"]]), t2.safeCharCodes = function() {
          const e4 = /* @__PURE__ */ new Set();
          for (let t3 = 32; t3 < 123; ++t3) (t3 >= 97 || t3 >= 65 && t3 <= 90 || t3 >= 48 && t3 <= 57 || 32 === t3 || 46 === t3 || 44 === t3 || 45 === t3 || 58 === t3 || 95 === t3) && e4.add(t3);
          return e4;
        }();
      }, 6064: (e3) => {
        "use strict";
        e3.exports = function(e4) {
          return e4.replace(/[\^\$\.\*\+\-\?\=\!\:\|\\\/\(\)\[\]\{\}\,]/g, "\\$&");
        };
      }, 738: (e3) => {
        "use strict";
        e3.exports = function() {
        };
      }, 1687: (e3, t2, r) => {
        "use strict";
        const s = r(375), n = r(8571), a = r(7043), i = {};
        e3.exports = i.merge = function(e4, t3, r2) {
          if (s(e4 && "object" == typeof e4, "Invalid target value: must be an object"), s(null == t3 || "object" == typeof t3, "Invalid source value: must be null, undefined, or an object"), !t3) return e4;
          if (r2 = Object.assign({ nullOverride: true, mergeArrays: true }, r2), Array.isArray(t3)) {
            s(Array.isArray(e4), "Cannot merge array onto an object"), r2.mergeArrays || (e4.length = 0);
            for (let s2 = 0; s2 < t3.length; ++s2) e4.push(n(t3[s2], { symbols: r2.symbols }));
            return e4;
          }
          const o = a.keys(t3, r2);
          for (let s2 = 0; s2 < o.length; ++s2) {
            const a2 = o[s2];
            if ("__proto__" === a2 || !Object.prototype.propertyIsEnumerable.call(t3, a2)) continue;
            const l = t3[a2];
            if (l && "object" == typeof l) {
              if (e4[a2] === l) continue;
              !e4[a2] || "object" != typeof e4[a2] || Array.isArray(e4[a2]) !== Array.isArray(l) || l instanceof Date || l instanceof RegExp ? e4[a2] = n(l, { symbols: r2.symbols }) : i.merge(e4[a2], l, r2);
            } else (null != l || r2.nullOverride) && (e4[a2] = l);
          }
          return e4;
        };
      }, 9621: (e3, t2, r) => {
        "use strict";
        const s = r(375), n = {};
        e3.exports = function(e4, t3, r2) {
          if (false === t3 || null == t3) return e4;
          "string" == typeof (r2 = r2 || {}) && (r2 = { separator: r2 });
          const a = Array.isArray(t3);
          s(!a || !r2.separator, "Separator option is not valid for array-based chain");
          const i = a ? t3 : t3.split(r2.separator || ".");
          let o = e4;
          for (let e5 = 0; e5 < i.length; ++e5) {
            let a2 = i[e5];
            const l = r2.iterables && n.iterables(o);
            if (Array.isArray(o) || "set" === l) {
              const e6 = Number(a2);
              Number.isInteger(e6) && (a2 = e6 < 0 ? o.length + e6 : e6);
            }
            if (!o || "function" == typeof o && false === r2.functions || !l && void 0 === o[a2]) {
              s(!r2.strict || e5 + 1 === i.length, "Missing segment", a2, "in reach path ", t3), s("object" == typeof o || true === r2.functions || "function" != typeof o, "Invalid segment", a2, "in reach path ", t3), o = r2.default;
              break;
            }
            o = l ? "set" === l ? [...o][a2] : o.get(a2) : o[a2];
          }
          return o;
        }, n.iterables = function(e4) {
          return e4 instanceof Set ? "set" : e4 instanceof Map ? "map" : void 0;
        };
      }, 8761: (e3) => {
        "use strict";
        e3.exports = function(...e4) {
          try {
            return JSON.stringify(...e4);
          } catch (e5) {
            return "[Cannot display object: " + e5.message + "]";
          }
        };
      }, 4277: (e3, t2) => {
        "use strict";
        const r = {};
        t2 = e3.exports = { array: Array.prototype, buffer: false, date: Date.prototype, error: Error.prototype, generic: Object.prototype, map: Map.prototype, promise: Promise.prototype, regex: RegExp.prototype, set: Set.prototype, weakMap: WeakMap.prototype, weakSet: WeakSet.prototype }, r.typeMap = /* @__PURE__ */ new Map([["[object Error]", t2.error], ["[object Map]", t2.map], ["[object Promise]", t2.promise], ["[object Set]", t2.set], ["[object WeakMap]", t2.weakMap], ["[object WeakSet]", t2.weakSet]]), t2.getInternalProto = function(e4) {
          if (Array.isArray(e4)) return t2.array;
          if (e4 instanceof Date) return t2.date;
          if (e4 instanceof RegExp) return t2.regex;
          if (e4 instanceof Error) return t2.error;
          const s = Object.prototype.toString.call(e4);
          return r.typeMap.get(s) || t2.generic;
        };
      }, 7043: (e3, t2) => {
        "use strict";
        t2.keys = function(e4, t3 = {}) {
          return false !== t3.symbols ? Reflect.ownKeys(e4) : Object.getOwnPropertyNames(e4);
        };
      }, 3652: (e3, t2, r) => {
        "use strict";
        const s = r(375), n = {};
        t2.Sorter = class {
          constructor() {
            this._items = [], this.nodes = [];
          }
          add(e4, t3) {
            const r2 = [].concat((t3 = t3 || {}).before || []), n2 = [].concat(t3.after || []), a = t3.group || "?", i = t3.sort || 0;
            s(!r2.includes(a), `Item cannot come before itself: ${a}`), s(!r2.includes("?"), "Item cannot come before unassociated items"), s(!n2.includes(a), `Item cannot come after itself: ${a}`), s(!n2.includes("?"), "Item cannot come after unassociated items"), Array.isArray(e4) || (e4 = [e4]);
            for (const t4 of e4) {
              const e5 = { seq: this._items.length, sort: i, before: r2, after: n2, group: a, node: t4 };
              this._items.push(e5);
            }
            if (!t3.manual) {
              const e5 = this._sort();
              s(e5, "item", "?" !== a ? `added into group ${a}` : "", "created a dependencies error");
            }
            return this.nodes;
          }
          merge(e4) {
            Array.isArray(e4) || (e4 = [e4]);
            for (const t4 of e4) if (t4) for (const e5 of t4._items) this._items.push(Object.assign({}, e5));
            this._items.sort(n.mergeSort);
            for (let e5 = 0; e5 < this._items.length; ++e5) this._items[e5].seq = e5;
            const t3 = this._sort();
            return s(t3, "merge created a dependencies error"), this.nodes;
          }
          sort() {
            const e4 = this._sort();
            return s(e4, "sort created a dependencies error"), this.nodes;
          }
          _sort() {
            const e4 = {}, t3 = /* @__PURE__ */ Object.create(null), r2 = /* @__PURE__ */ Object.create(null);
            for (const s3 of this._items) {
              const n3 = s3.seq, a2 = s3.group;
              r2[a2] = r2[a2] || [], r2[a2].push(n3), e4[n3] = s3.before;
              for (const e5 of s3.after) t3[e5] = t3[e5] || [], t3[e5].push(n3);
            }
            for (const t4 in e4) {
              const s3 = [];
              for (const n3 in e4[t4]) {
                const a2 = e4[t4][n3];
                r2[a2] = r2[a2] || [], s3.push(...r2[a2]);
              }
              e4[t4] = s3;
            }
            for (const s3 in t3) if (r2[s3]) for (const n3 of r2[s3]) e4[n3].push(...t3[s3]);
            const s2 = {};
            for (const t4 in e4) {
              const r3 = e4[t4];
              for (const e5 of r3) s2[e5] = s2[e5] || [], s2[e5].push(t4);
            }
            const n2 = {}, a = [];
            for (let e5 = 0; e5 < this._items.length; ++e5) {
              let t4 = e5;
              if (s2[e5]) {
                t4 = null;
                for (let e6 = 0; e6 < this._items.length; ++e6) {
                  if (true === n2[e6]) continue;
                  s2[e6] || (s2[e6] = []);
                  const r3 = s2[e6].length;
                  let a2 = 0;
                  for (let t5 = 0; t5 < r3; ++t5) n2[s2[e6][t5]] && ++a2;
                  if (a2 === r3) {
                    t4 = e6;
                    break;
                  }
                }
              }
              null !== t4 && (n2[t4] = true, a.push(t4));
            }
            if (a.length !== this._items.length) return false;
            const i = {};
            for (const e5 of this._items) i[e5.seq] = e5;
            this._items = [], this.nodes = [];
            for (const e5 of a) {
              const t4 = i[e5];
              this.nodes.push(t4.node), this._items.push(t4);
            }
            return true;
          }
        }, n.mergeSort = (e4, t3) => e4.sort === t3.sort ? 0 : e4.sort < t3.sort ? -1 : 1;
      }, 5380: (e3, t2, r) => {
        "use strict";
        const s = r(443), n = r(2178), a = { minDomainSegments: 2, nonAsciiRx: /[^\x00-\x7f]/, domainControlRx: /[\x00-\x20@\:\/\\#!\$&\'\(\)\*\+,;=\?]/, tldSegmentRx: /^[a-zA-Z](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?$/, domainSegmentRx: /^[a-zA-Z0-9](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?$/, URL: s.URL || URL };
        t2.analyze = function(e4, t3 = {}) {
          if (!e4) return n.code("DOMAIN_NON_EMPTY_STRING");
          if ("string" != typeof e4) throw new Error("Invalid input: domain must be a string");
          if (e4.length > 256) return n.code("DOMAIN_TOO_LONG");
          if (a.nonAsciiRx.test(e4)) {
            if (false === t3.allowUnicode) return n.code("DOMAIN_INVALID_UNICODE_CHARS");
            e4 = e4.normalize("NFC");
          }
          if (a.domainControlRx.test(e4)) return n.code("DOMAIN_INVALID_CHARS");
          e4 = a.punycode(e4), t3.allowFullyQualified && "." === e4[e4.length - 1] && (e4 = e4.slice(0, -1));
          const r2 = t3.minDomainSegments || a.minDomainSegments, s2 = e4.split(".");
          if (s2.length < r2) return n.code("DOMAIN_SEGMENTS_COUNT");
          if (t3.maxDomainSegments && s2.length > t3.maxDomainSegments) return n.code("DOMAIN_SEGMENTS_COUNT_MAX");
          const i = t3.tlds;
          if (i) {
            const e5 = s2[s2.length - 1].toLowerCase();
            if (i.deny && i.deny.has(e5) || i.allow && !i.allow.has(e5)) return n.code("DOMAIN_FORBIDDEN_TLDS");
          }
          for (let e5 = 0; e5 < s2.length; ++e5) {
            const t4 = s2[e5];
            if (!t4.length) return n.code("DOMAIN_EMPTY_SEGMENT");
            if (t4.length > 63) return n.code("DOMAIN_LONG_SEGMENT");
            if (e5 < s2.length - 1) {
              if (!a.domainSegmentRx.test(t4)) return n.code("DOMAIN_INVALID_CHARS");
            } else if (!a.tldSegmentRx.test(t4)) return n.code("DOMAIN_INVALID_TLDS_CHARS");
          }
          return null;
        }, t2.isValid = function(e4, r2) {
          return !t2.analyze(e4, r2);
        }, a.punycode = function(e4) {
          e4.includes("%") && (e4 = e4.replace(/%/g, "%25"));
          try {
            return new a.URL(`http://${e4}`).host;
          } catch (t3) {
            return e4;
          }
        };
      }, 1745: (e3, t2, r) => {
        "use strict";
        const s = r(9848), n = r(5380), a = r(2178), i = { nonAsciiRx: /[^\x00-\x7f]/, encoder: new (s.TextEncoder || TextEncoder)() };
        t2.analyze = function(e4, t3) {
          return i.email(e4, t3);
        }, t2.isValid = function(e4, t3) {
          return !i.email(e4, t3);
        }, i.email = function(e4, t3 = {}) {
          if ("string" != typeof e4) throw new Error("Invalid input: email must be a string");
          if (!e4) return a.code("EMPTY_STRING");
          const r2 = !i.nonAsciiRx.test(e4);
          if (!r2) {
            if (false === t3.allowUnicode) return a.code("FORBIDDEN_UNICODE");
            e4 = e4.normalize("NFC");
          }
          const s2 = e4.split("@");
          if (2 !== s2.length) return s2.length > 2 ? a.code("MULTIPLE_AT_CHAR") : a.code("MISSING_AT_CHAR");
          const [o, l] = s2;
          if (!o) return a.code("EMPTY_LOCAL");
          if (!t3.ignoreLength) {
            if (e4.length > 254) return a.code("ADDRESS_TOO_LONG");
            if (i.encoder.encode(o).length > 64) return a.code("LOCAL_TOO_LONG");
          }
          return i.local(o, r2) || n.analyze(l, t3);
        }, i.local = function(e4, t3) {
          const r2 = e4.split(".");
          for (const e5 of r2) {
            if (!e5.length) return a.code("EMPTY_LOCAL_SEGMENT");
            if (t3) {
              if (!i.atextRx.test(e5)) return a.code("INVALID_LOCAL_CHARS");
            } else for (const t4 of e5) {
              if (i.atextRx.test(t4)) continue;
              const e6 = i.binary(t4);
              if (!i.atomRx.test(e6)) return a.code("INVALID_LOCAL_CHARS");
            }
          }
        }, i.binary = function(e4) {
          return Array.from(i.encoder.encode(e4)).map((e5) => String.fromCharCode(e5)).join("");
        }, i.atextRx = /^[\w!#\$%&'\*\+\-/=\?\^`\{\|\}~]+$/, i.atomRx = new RegExp(["(?:[\\xc2-\\xdf][\\x80-\\xbf])", "(?:\\xe0[\\xa0-\\xbf][\\x80-\\xbf])|(?:[\\xe1-\\xec][\\x80-\\xbf]{2})|(?:\\xed[\\x80-\\x9f][\\x80-\\xbf])|(?:[\\xee-\\xef][\\x80-\\xbf]{2})", "(?:\\xf0[\\x90-\\xbf][\\x80-\\xbf]{2})|(?:[\\xf1-\\xf3][\\x80-\\xbf]{3})|(?:\\xf4[\\x80-\\x8f][\\x80-\\xbf]{2})"].join("|"));
      }, 2178: (e3, t2) => {
        "use strict";
        t2.codes = { EMPTY_STRING: "Address must be a non-empty string", FORBIDDEN_UNICODE: "Address contains forbidden Unicode characters", MULTIPLE_AT_CHAR: "Address cannot contain more than one @ character", MISSING_AT_CHAR: "Address must contain one @ character", EMPTY_LOCAL: "Address local part cannot be empty", ADDRESS_TOO_LONG: "Address too long", LOCAL_TOO_LONG: "Address local part too long", EMPTY_LOCAL_SEGMENT: "Address local part contains empty dot-separated segment", INVALID_LOCAL_CHARS: "Address local part contains invalid character", DOMAIN_NON_EMPTY_STRING: "Domain must be a non-empty string", DOMAIN_TOO_LONG: "Domain too long", DOMAIN_INVALID_UNICODE_CHARS: "Domain contains forbidden Unicode characters", DOMAIN_INVALID_CHARS: "Domain contains invalid character", DOMAIN_INVALID_TLDS_CHARS: "Domain contains invalid tld character", DOMAIN_SEGMENTS_COUNT: "Domain lacks the minimum required number of segments", DOMAIN_SEGMENTS_COUNT_MAX: "Domain contains too many segments", DOMAIN_FORBIDDEN_TLDS: "Domain uses forbidden TLD", DOMAIN_EMPTY_SEGMENT: "Domain contains empty dot-separated segment", DOMAIN_LONG_SEGMENT: "Domain contains dot-separated segment that is too long" }, t2.code = function(e4) {
          return { code: e4, error: t2.codes[e4] };
        };
      }, 9959: (e3, t2, r) => {
        "use strict";
        const s = r(375), n = r(5752);
        t2.regex = function(e4 = {}) {
          s(void 0 === e4.cidr || "string" == typeof e4.cidr, "options.cidr must be a string");
          const t3 = e4.cidr ? e4.cidr.toLowerCase() : "optional";
          s(["required", "optional", "forbidden"].includes(t3), "options.cidr must be one of required, optional, forbidden"), s(void 0 === e4.version || "string" == typeof e4.version || Array.isArray(e4.version), "options.version must be a string or an array of string");
          let r2 = e4.version || ["ipv4", "ipv6", "ipvfuture"];
          Array.isArray(r2) || (r2 = [r2]), s(r2.length >= 1, "options.version must have at least 1 version specified");
          for (let e5 = 0; e5 < r2.length; ++e5) s("string" == typeof r2[e5], "options.version must only contain strings"), r2[e5] = r2[e5].toLowerCase(), s(["ipv4", "ipv6", "ipvfuture"].includes(r2[e5]), "options.version contains unknown version " + r2[e5] + " - must be one of ipv4, ipv6, ipvfuture");
          r2 = Array.from(new Set(r2));
          const a = `(?:${r2.map((e5) => {
            if ("forbidden" === t3) return n.ip[e5];
            const r3 = `\\/${"ipv4" === e5 ? n.ip.v4Cidr : n.ip.v6Cidr}`;
            return "required" === t3 ? `${n.ip[e5]}${r3}` : `${n.ip[e5]}(?:${r3})?`;
          }).join("|")})`, i = new RegExp(`^${a}$`);
          return { cidr: t3, versions: r2, regex: i, raw: a };
        };
      }, 5752: (e3, t2, r) => {
        "use strict";
        const s = r(375), n = r(6064), a = { generate: /* @__PURE__ */ __name(function() {
          const e4 = {}, t3 = "\\dA-Fa-f", r2 = "[" + t3 + "]", s2 = "\\w-\\.~", n2 = "!\\$&'\\(\\)\\*\\+,;=", a2 = "%" + t3, i = s2 + a2 + n2 + ":@", o = "[" + i + "]", l = "(?:0{0,2}\\d|0?[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])";
          e4.ipv4address = "(?:" + l + "\\.){3}" + l;
          const c = r2 + "{1,4}", u = "(?:" + c + ":" + c + "|" + e4.ipv4address + ")", f = "(?:" + c + ":){6}" + u, m = "::(?:" + c + ":){5}" + u, h = "(?:" + c + ")?::(?:" + c + ":){4}" + u, d = "(?:(?:" + c + ":){0,1}" + c + ")?::(?:" + c + ":){3}" + u, p = "(?:(?:" + c + ":){0,2}" + c + ")?::(?:" + c + ":){2}" + u, g = "(?:(?:" + c + ":){0,3}" + c + ")?::" + c + ":" + u, y = "(?:(?:" + c + ":){0,4}" + c + ")?::" + u, b = "(?:(?:" + c + ":){0,5}" + c + ")?::" + c, v = "(?:(?:" + c + ":){0,6}" + c + ")?::";
          e4.ipv4Cidr = "(?:\\d|[1-2]\\d|3[0-2])", e4.ipv6Cidr = "(?:0{0,2}\\d|0?[1-9]\\d|1[01]\\d|12[0-8])", e4.ipv6address = "(?:" + f + "|" + m + "|" + h + "|" + d + "|" + p + "|" + g + "|" + y + "|" + b + "|" + v + ")", e4.ipvFuture = "v" + r2 + "+\\.[" + s2 + n2 + ":]+", e4.scheme = "[a-zA-Z][a-zA-Z\\d+-\\.]*", e4.schemeRegex = new RegExp(e4.scheme);
          const _ = "[" + s2 + a2 + n2 + ":]*", w = "[" + s2 + a2 + n2 + "]{1,255}", $ = "(?:\\[(?:" + e4.ipv6address + "|" + e4.ipvFuture + ")\\]|" + e4.ipv4address + "|" + w + ")", x = "(?:" + _ + "@)?" + $ + "(?::\\d*)?", j = "(?:" + _ + "@)?(" + $ + ")(?::\\d*)?", k = o + "*", R = o + "+", S = "(?:\\/" + k + ")*", A = "\\/(?:" + R + S + ")?", O = R + S, E = "[" + s2 + a2 + n2 + "@]+" + S, D = "(?:\\/\\/\\/" + k + S + ")";
          return e4.hierPart = "(?:(?:\\/\\/" + x + S + ")|" + A + "|" + O + "|" + D + ")", e4.hierPartCapture = "(?:(?:\\/\\/" + j + S + ")|" + A + "|" + O + ")", e4.relativeRef = "(?:(?:\\/\\/" + x + S + ")|" + A + "|" + E + "|)", e4.relativeRefCapture = "(?:(?:\\/\\/" + j + S + ")|" + A + "|" + E + "|)", e4.query = "[" + i + "\\/\\?]*(?=#|$)", e4.queryWithSquareBrackets = "[" + i + "\\[\\]\\/\\?]*(?=#|$)", e4.fragment = "[" + i + "\\/\\?]*", e4;
        }, "generate") };
        a.rfc3986 = a.generate(), t2.ip = { v4Cidr: a.rfc3986.ipv4Cidr, v6Cidr: a.rfc3986.ipv6Cidr, ipv4: a.rfc3986.ipv4address, ipv6: a.rfc3986.ipv6address, ipvfuture: a.rfc3986.ipvFuture }, a.createRegex = function(e4) {
          const t3 = a.rfc3986, r2 = "(?:\\?" + (e4.allowQuerySquareBrackets ? t3.queryWithSquareBrackets : t3.query) + ")?(?:#" + t3.fragment + ")?", i = e4.domain ? t3.relativeRefCapture : t3.relativeRef;
          if (e4.relativeOnly) return a.wrap(i + r2);
          let o = "";
          if (e4.scheme) {
            s(e4.scheme instanceof RegExp || "string" == typeof e4.scheme || Array.isArray(e4.scheme), "scheme must be a RegExp, String, or Array");
            const r3 = [].concat(e4.scheme);
            s(r3.length >= 1, "scheme must have at least 1 scheme specified");
            const a2 = [];
            for (let e5 = 0; e5 < r3.length; ++e5) {
              const i2 = r3[e5];
              s(i2 instanceof RegExp || "string" == typeof i2, "scheme at position " + e5 + " must be a RegExp or String"), i2 instanceof RegExp ? a2.push(i2.source.toString()) : (s(t3.schemeRegex.test(i2), "scheme at position " + e5 + " must be a valid scheme"), a2.push(n(i2)));
            }
            o = a2.join("|");
          }
          const l = "(?:" + (o ? "(?:" + o + ")" : t3.scheme) + ":" + (e4.domain ? t3.hierPartCapture : t3.hierPart) + ")", c = e4.allowRelative ? "(?:" + l + "|" + i + ")" : l;
          return a.wrap(c + r2, o);
        }, a.wrap = function(e4, t3) {
          return { raw: e4 = `(?=.)(?!https?:/(?:$|[^/]))(?!https?:///)(?!https?:[^/])${e4}`, regex: new RegExp(`^${e4}$`), scheme: t3 };
        }, a.uriRegex = a.createRegex({}), t2.regex = function(e4 = {}) {
          return e4.scheme || e4.allowRelative || e4.relativeOnly || e4.allowQuerySquareBrackets || e4.domain ? a.createRegex(e4) : a.uriRegex;
        };
      }, 1447: (e3, t2) => {
        "use strict";
        const r = { operators: ["!", "^", "*", "/", "%", "+", "-", "<", "<=", ">", ">=", "==", "!=", "&&", "||", "??"], operatorCharacters: ["!", "^", "*", "/", "%", "+", "-", "<", "=", ">", "&", "|", "?"], operatorsOrder: [["^"], ["*", "/", "%"], ["+", "-"], ["<", "<=", ">", ">="], ["==", "!="], ["&&"], ["||", "??"]], operatorsPrefix: ["!", "n"], literals: { '"': '"', "`": "`", "'": "'", "[": "]" }, numberRx: /^(?:[0-9]*(\.[0-9]*)?){1}$/, tokenRx: /^[\w\$\#\.\@\:\{\}]+$/, symbol: Symbol("formula"), settings: Symbol("settings") };
        t2.Parser = class {
          constructor(e4, t3 = {}) {
            if (!t3[r.settings] && t3.constants) for (const e5 in t3.constants) {
              const r2 = t3.constants[e5];
              if (null !== r2 && !["boolean", "number", "string"].includes(typeof r2)) throw new Error(`Formula constant ${e5} contains invalid ${typeof r2} value type`);
            }
            this.settings = t3[r.settings] ? t3 : Object.assign({ [r.settings]: true, constants: {}, functions: {} }, t3), this.single = null, this._parts = null, this._parse(e4);
          }
          _parse(e4) {
            let s = [], n = "", a = 0, i = false;
            const o = /* @__PURE__ */ __name((e5) => {
              if (a) throw new Error("Formula missing closing parenthesis");
              const o2 = s.length ? s[s.length - 1] : null;
              if (i || n || e5) {
                if (o2 && "reference" === o2.type && ")" === e5) return o2.type = "function", o2.value = this._subFormula(n, o2.value), void (n = "");
                if (")" === e5) {
                  const e6 = new t2.Parser(n, this.settings);
                  s.push({ type: "segment", value: e6 });
                } else if (i) {
                  if ("]" === i) return s.push({ type: "reference", value: n }), void (n = "");
                  s.push({ type: "literal", value: n });
                } else if (r.operatorCharacters.includes(n)) o2 && "operator" === o2.type && r.operators.includes(o2.value + n) ? o2.value += n : s.push({ type: "operator", value: n });
                else if (n.match(r.numberRx)) s.push({ type: "constant", value: parseFloat(n) });
                else if (void 0 !== this.settings.constants[n]) s.push({ type: "constant", value: this.settings.constants[n] });
                else {
                  if (!n.match(r.tokenRx)) throw new Error(`Formula contains invalid token: ${n}`);
                  s.push({ type: "reference", value: n });
                }
                n = "";
              }
            }, "o");
            for (const t3 of e4) i ? t3 === i ? (o(), i = false) : n += t3 : a ? "(" === t3 ? (n += t3, ++a) : ")" === t3 ? (--a, a ? n += t3 : o(t3)) : n += t3 : t3 in r.literals ? i = r.literals[t3] : "(" === t3 ? (o(), ++a) : r.operatorCharacters.includes(t3) ? (o(), n = t3, o()) : " " !== t3 ? n += t3 : o();
            o(), s = s.map((e5, t3) => "operator" !== e5.type || "-" !== e5.value || t3 && "operator" !== s[t3 - 1].type ? e5 : { type: "operator", value: "n" });
            let l = false;
            for (const e5 of s) {
              if ("operator" === e5.type) {
                if (r.operatorsPrefix.includes(e5.value)) continue;
                if (!l) throw new Error("Formula contains an operator in invalid position");
                if (!r.operators.includes(e5.value)) throw new Error(`Formula contains an unknown operator ${e5.value}`);
              } else if (l) throw new Error("Formula missing expected operator");
              l = !l;
            }
            if (!l) throw new Error("Formula contains invalid trailing operator");
            1 === s.length && ["reference", "literal", "constant"].includes(s[0].type) && (this.single = { type: "reference" === s[0].type ? "reference" : "value", value: s[0].value }), this._parts = s.map((e5) => {
              if ("operator" === e5.type) return r.operatorsPrefix.includes(e5.value) ? e5 : e5.value;
              if ("reference" !== e5.type) return e5.value;
              if (this.settings.tokenRx && !this.settings.tokenRx.test(e5.value)) throw new Error(`Formula contains invalid reference ${e5.value}`);
              return this.settings.reference ? this.settings.reference(e5.value) : r.reference(e5.value);
            });
          }
          _subFormula(e4, s) {
            const n = this.settings.functions[s];
            if ("function" != typeof n) throw new Error(`Formula contains unknown function ${s}`);
            let a = [];
            if (e4) {
              let t3 = "", n2 = 0, i = false;
              const o = /* @__PURE__ */ __name(() => {
                if (!t3) throw new Error(`Formula contains function ${s} with invalid arguments ${e4}`);
                a.push(t3), t3 = "";
              }, "o");
              for (let s2 = 0; s2 < e4.length; ++s2) {
                const a2 = e4[s2];
                i ? (t3 += a2, a2 === i && (i = false)) : a2 in r.literals && !n2 ? (t3 += a2, i = r.literals[a2]) : "," !== a2 || n2 ? (t3 += a2, "(" === a2 ? ++n2 : ")" === a2 && --n2) : o();
              }
              o();
            }
            return a = a.map((e5) => new t2.Parser(e5, this.settings)), function(e5) {
              const t3 = [];
              for (const r2 of a) t3.push(r2.evaluate(e5));
              return n.call(e5, ...t3);
            };
          }
          evaluate(e4) {
            const t3 = this._parts.slice();
            for (let s = t3.length - 2; s >= 0; --s) {
              const n = t3[s];
              if (n && "operator" === n.type) {
                const a = t3[s + 1];
                t3.splice(s + 1, 1);
                const i = r.evaluate(a, e4);
                t3[s] = r.single(n.value, i);
              }
            }
            return r.operatorsOrder.forEach((s) => {
              for (let n = 1; n < t3.length - 1; ) if (s.includes(t3[n])) {
                const s2 = t3[n], a = r.evaluate(t3[n - 1], e4), i = r.evaluate(t3[n + 1], e4);
                t3.splice(n, 2);
                const o = r.calculate(s2, a, i);
                t3[n - 1] = 0 === o ? 0 : o;
              } else n += 2;
            }), r.evaluate(t3[0], e4);
          }
        }, t2.Parser.prototype[r.symbol] = true, r.reference = function(e4) {
          return function(t3) {
            return t3 && void 0 !== t3[e4] ? t3[e4] : null;
          };
        }, r.evaluate = function(e4, t3) {
          return null === e4 ? null : "function" == typeof e4 ? e4(t3) : e4[r.symbol] ? e4.evaluate(t3) : e4;
        }, r.single = function(e4, t3) {
          if ("!" === e4) return !t3;
          const r2 = -t3;
          return 0 === r2 ? 0 : r2;
        }, r.calculate = function(e4, t3, s) {
          if ("??" === e4) return r.exists(t3) ? t3 : s;
          if ("string" == typeof t3 || "string" == typeof s) {
            if ("+" === e4) return (t3 = r.exists(t3) ? t3 : "") + (r.exists(s) ? s : "");
          } else switch (e4) {
            case "^":
              return Math.pow(t3, s);
            case "*":
              return t3 * s;
            case "/":
              return t3 / s;
            case "%":
              return t3 % s;
            case "+":
              return t3 + s;
            case "-":
              return t3 - s;
          }
          switch (e4) {
            case "<":
              return t3 < s;
            case "<=":
              return t3 <= s;
            case ">":
              return t3 > s;
            case ">=":
              return t3 >= s;
            case "==":
              return t3 === s;
            case "!=":
              return t3 !== s;
            case "&&":
              return t3 && s;
            case "||":
              return t3 || s;
          }
          return null;
        }, r.exists = function(e4) {
          return null != e4;
        };
      }, 9926: () => {
      }, 5688: () => {
      }, 9708: () => {
      }, 1152: () => {
      }, 443: () => {
      }, 9848: () => {
      }, 5934: (e3) => {
        "use strict";
        e3.exports = JSON.parse('{"version":"17.13.3"}');
      } }, t = {}, (/* @__PURE__ */ __name(function r(s) {
        var n = t[s];
        if (void 0 !== n) return n.exports;
        var a = t[s] = { exports: {} };
        return e2[s](a, a.exports, r), a.exports;
      }, "r"))(5107);
      var e2, t;
    });
  }
});

// .wrangler/tmp/bundle-ByNAhI/middleware-loader.entry.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// .wrangler/tmp/bundle-ByNAhI/middleware-insertion-facade.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@microlabs/otel-cf-workers/dist/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var import_api8 = __toESM(require_src(), 1);
import { Buffer as Buffer2 } from "node:buffer";

// node_modules/@opentelemetry/sdk-trace-base/build/esm/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@opentelemetry/core/build/esm/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@opentelemetry/core/build/esm/trace/suppress-tracing.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var import_api = __toESM(require_src());
var SUPPRESS_TRACING_KEY = (0, import_api.createContextKey)("OpenTelemetry SDK Context Key SUPPRESS_TRACING");
function isTracingSuppressed(context5) {
  return context5.getValue(SUPPRESS_TRACING_KEY) === true;
}
__name(isTracingSuppressed, "isTracingSuppressed");

// node_modules/@opentelemetry/core/build/esm/common/attributes.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var import_api2 = __toESM(require_src());
function sanitizeAttributes(attributes) {
  const out = {};
  if (typeof attributes !== "object" || attributes == null) {
    return out;
  }
  for (const key in attributes) {
    if (!Object.prototype.hasOwnProperty.call(attributes, key)) {
      continue;
    }
    if (!isAttributeKey(key)) {
      import_api2.diag.warn(`Invalid attribute key: ${key}`);
      continue;
    }
    const val = attributes[key];
    if (!isAttributeValue(val)) {
      import_api2.diag.warn(`Invalid attribute value set for key: ${key}`);
      continue;
    }
    if (Array.isArray(val)) {
      out[key] = val.slice();
    } else {
      out[key] = val;
    }
  }
  return out;
}
__name(sanitizeAttributes, "sanitizeAttributes");
function isAttributeKey(key) {
  return typeof key === "string" && key !== "";
}
__name(isAttributeKey, "isAttributeKey");
function isAttributeValue(val) {
  if (val == null) {
    return true;
  }
  if (Array.isArray(val)) {
    return isHomogeneousAttributeValueArray(val);
  }
  return isValidPrimitiveAttributeValueType(typeof val);
}
__name(isAttributeValue, "isAttributeValue");
function isHomogeneousAttributeValueArray(arr) {
  let type;
  for (const element of arr) {
    if (element == null)
      continue;
    const elementType = typeof element;
    if (elementType === type) {
      continue;
    }
    if (!type) {
      if (isValidPrimitiveAttributeValueType(elementType)) {
        type = elementType;
        continue;
      }
      return false;
    }
    return false;
  }
  return true;
}
__name(isHomogeneousAttributeValueArray, "isHomogeneousAttributeValueArray");
function isValidPrimitiveAttributeValueType(valType) {
  switch (valType) {
    case "number":
    case "boolean":
    case "string":
      return true;
  }
  return false;
}
__name(isValidPrimitiveAttributeValueType, "isValidPrimitiveAttributeValueType");

// node_modules/@opentelemetry/core/build/esm/common/global-error-handler.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@opentelemetry/core/build/esm/common/logging-error-handler.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var import_api3 = __toESM(require_src());
function loggingErrorHandler() {
  return (ex) => {
    import_api3.diag.error(stringifyException(ex));
  };
}
__name(loggingErrorHandler, "loggingErrorHandler");
function stringifyException(ex) {
  if (typeof ex === "string") {
    return ex;
  } else {
    return JSON.stringify(flattenException(ex));
  }
}
__name(stringifyException, "stringifyException");
function flattenException(ex) {
  const result = {};
  let current = ex;
  while (current !== null) {
    Object.getOwnPropertyNames(current).forEach((propertyName) => {
      if (result[propertyName])
        return;
      const value = current[propertyName];
      if (value) {
        result[propertyName] = String(value);
      }
    });
    current = Object.getPrototypeOf(current);
  }
  return result;
}
__name(flattenException, "flattenException");

// node_modules/@opentelemetry/core/build/esm/common/global-error-handler.js
var delegateHandler = loggingErrorHandler();
function globalErrorHandler(ex) {
  try {
    delegateHandler(ex);
  } catch {
  }
}
__name(globalErrorHandler, "globalErrorHandler");

// node_modules/@opentelemetry/core/build/esm/common/time.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var NANOSECOND_DIGITS = 9;
var NANOSECOND_DIGITS_IN_MILLIS = 6;
var MILLISECONDS_TO_NANOSECONDS = Math.pow(10, NANOSECOND_DIGITS_IN_MILLIS);
var SECOND_TO_NANOSECONDS = Math.pow(10, NANOSECOND_DIGITS);
function hrTimeDuration(startTime, endTime) {
  let seconds = endTime[0] - startTime[0];
  let nanos = endTime[1] - startTime[1];
  if (nanos < 0) {
    seconds -= 1;
    nanos += SECOND_TO_NANOSECONDS;
  }
  return [seconds, nanos];
}
__name(hrTimeDuration, "hrTimeDuration");
function isTimeInputHrTime(value) {
  return Array.isArray(value) && value.length === 2 && typeof value[0] === "number" && typeof value[1] === "number";
}
__name(isTimeInputHrTime, "isTimeInputHrTime");
function isTimeInput(value) {
  return isTimeInputHrTime(value) || typeof value === "number" || value instanceof Date;
}
__name(isTimeInput, "isTimeInput");

// node_modules/@opentelemetry/core/build/esm/ExportResult.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var ExportResultCode;
(function(ExportResultCode2) {
  ExportResultCode2[ExportResultCode2["SUCCESS"] = 0] = "SUCCESS";
  ExportResultCode2[ExportResultCode2["FAILED"] = 1] = "FAILED";
})(ExportResultCode || (ExportResultCode = {}));

// node_modules/@opentelemetry/core/build/esm/trace/W3CTraceContextPropagator.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var import_api4 = __toESM(require_src());

// node_modules/@opentelemetry/core/build/esm/trace/TraceState.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@opentelemetry/core/build/esm/internal/validators.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var VALID_KEY_CHAR_RANGE = "[_0-9a-z-*/]";
var VALID_KEY = `[a-z]${VALID_KEY_CHAR_RANGE}{0,255}`;
var VALID_VENDOR_KEY = `[a-z0-9]${VALID_KEY_CHAR_RANGE}{0,240}@[a-z]${VALID_KEY_CHAR_RANGE}{0,13}`;
var VALID_KEY_REGEX = new RegExp(`^(?:${VALID_KEY}|${VALID_VENDOR_KEY})$`);
var VALID_VALUE_BASE_REGEX = /^[ -~]{0,255}[!-~]$/;
var INVALID_VALUE_COMMA_EQUAL_REGEX = /,|=/;
function validateKey(key) {
  return VALID_KEY_REGEX.test(key);
}
__name(validateKey, "validateKey");
function validateValue(value) {
  return VALID_VALUE_BASE_REGEX.test(value) && !INVALID_VALUE_COMMA_EQUAL_REGEX.test(value);
}
__name(validateValue, "validateValue");

// node_modules/@opentelemetry/core/build/esm/trace/TraceState.js
var MAX_TRACE_STATE_ITEMS = 32;
var MAX_TRACE_STATE_LEN = 512;
var LIST_MEMBERS_SEPARATOR = ",";
var LIST_MEMBER_KEY_VALUE_SPLITTER = "=";
var TraceState = class _TraceState {
  static {
    __name(this, "TraceState");
  }
  _internalState = /* @__PURE__ */ new Map();
  constructor(rawTraceState) {
    if (rawTraceState)
      this._parse(rawTraceState);
  }
  set(key, value) {
    const traceState = this._clone();
    if (traceState._internalState.has(key)) {
      traceState._internalState.delete(key);
    }
    traceState._internalState.set(key, value);
    return traceState;
  }
  unset(key) {
    const traceState = this._clone();
    traceState._internalState.delete(key);
    return traceState;
  }
  get(key) {
    return this._internalState.get(key);
  }
  serialize() {
    return this._keys().reduce((agg, key) => {
      agg.push(key + LIST_MEMBER_KEY_VALUE_SPLITTER + this.get(key));
      return agg;
    }, []).join(LIST_MEMBERS_SEPARATOR);
  }
  _parse(rawTraceState) {
    if (rawTraceState.length > MAX_TRACE_STATE_LEN)
      return;
    this._internalState = rawTraceState.split(LIST_MEMBERS_SEPARATOR).reverse().reduce((agg, part) => {
      const listMember = part.trim();
      const i = listMember.indexOf(LIST_MEMBER_KEY_VALUE_SPLITTER);
      if (i !== -1) {
        const key = listMember.slice(0, i);
        const value = listMember.slice(i + 1, part.length);
        if (validateKey(key) && validateValue(value)) {
          agg.set(key, value);
        } else {
        }
      }
      return agg;
    }, /* @__PURE__ */ new Map());
    if (this._internalState.size > MAX_TRACE_STATE_ITEMS) {
      this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, MAX_TRACE_STATE_ITEMS));
    }
  }
  _keys() {
    return Array.from(this._internalState.keys()).reverse();
  }
  _clone() {
    const traceState = new _TraceState();
    traceState._internalState = new Map(this._internalState);
    return traceState;
  }
};

// node_modules/@opentelemetry/core/build/esm/trace/W3CTraceContextPropagator.js
var TRACE_PARENT_HEADER = "traceparent";
var TRACE_STATE_HEADER = "tracestate";
var VERSION = "00";
var VERSION_PART = "(?!ff)[\\da-f]{2}";
var TRACE_ID_PART = "(?![0]{32})[\\da-f]{32}";
var PARENT_ID_PART = "(?![0]{16})[\\da-f]{16}";
var FLAGS_PART = "[\\da-f]{2}";
var TRACE_PARENT_REGEX = new RegExp(`^\\s?(${VERSION_PART})-(${TRACE_ID_PART})-(${PARENT_ID_PART})-(${FLAGS_PART})(-.*)?\\s?$`);
function parseTraceParent(traceParent) {
  const match = TRACE_PARENT_REGEX.exec(traceParent);
  if (!match)
    return null;
  if (match[1] === "00" && match[5])
    return null;
  return {
    traceId: match[2],
    spanId: match[3],
    traceFlags: parseInt(match[4], 16)
  };
}
__name(parseTraceParent, "parseTraceParent");
var W3CTraceContextPropagator = class {
  static {
    __name(this, "W3CTraceContextPropagator");
  }
  inject(context5, carrier, setter) {
    const spanContext = import_api4.trace.getSpanContext(context5);
    if (!spanContext || isTracingSuppressed(context5) || !(0, import_api4.isSpanContextValid)(spanContext))
      return;
    const traceParent = `${VERSION}-${spanContext.traceId}-${spanContext.spanId}-0${Number(spanContext.traceFlags || import_api4.TraceFlags.NONE).toString(16)}`;
    setter.set(carrier, TRACE_PARENT_HEADER, traceParent);
    if (spanContext.traceState) {
      setter.set(carrier, TRACE_STATE_HEADER, spanContext.traceState.serialize());
    }
  }
  extract(context5, carrier, getter) {
    const traceParentHeader = getter.get(carrier, TRACE_PARENT_HEADER);
    if (!traceParentHeader)
      return context5;
    const traceParent = Array.isArray(traceParentHeader) ? traceParentHeader[0] : traceParentHeader;
    if (typeof traceParent !== "string")
      return context5;
    const spanContext = parseTraceParent(traceParent);
    if (!spanContext)
      return context5;
    spanContext.isRemote = true;
    const traceStateHeader = getter.get(carrier, TRACE_STATE_HEADER);
    if (traceStateHeader) {
      const state = Array.isArray(traceStateHeader) ? traceStateHeader.join(",") : traceStateHeader;
      spanContext.traceState = new TraceState(typeof state === "string" ? state : void 0);
    }
    return import_api4.trace.setSpanContext(context5, spanContext);
  }
  fields() {
    return [TRACE_PARENT_HEADER, TRACE_STATE_HEADER];
  }
};

// node_modules/@opentelemetry/resources/build/esm/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@opentelemetry/resources/build/esm/ResourceImpl.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var import_api5 = __toESM(require_src());

// node_modules/@opentelemetry/resources/build/esm/utils.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var isPromiseLike = /* @__PURE__ */ __name((val) => {
  return val !== null && typeof val === "object" && typeof val.then === "function";
}, "isPromiseLike");

// node_modules/@opentelemetry/resources/build/esm/ResourceImpl.js
var ResourceImpl = class _ResourceImpl {
  static {
    __name(this, "ResourceImpl");
  }
  _rawAttributes;
  _asyncAttributesPending = false;
  _schemaUrl;
  _memoizedAttributes;
  static FromAttributeList(attributes, options) {
    const res = new _ResourceImpl({}, options);
    res._rawAttributes = guardedRawAttributes(attributes);
    res._asyncAttributesPending = attributes.filter(([_, val]) => isPromiseLike(val)).length > 0;
    return res;
  }
  constructor(resource, options) {
    const attributes = resource.attributes ?? {};
    this._rawAttributes = Object.entries(attributes).map(([k, v]) => {
      if (isPromiseLike(v)) {
        this._asyncAttributesPending = true;
      }
      return [k, v];
    });
    this._rawAttributes = guardedRawAttributes(this._rawAttributes);
    this._schemaUrl = validateSchemaUrl(options?.schemaUrl);
  }
  get asyncAttributesPending() {
    return this._asyncAttributesPending;
  }
  async waitForAsyncAttributes() {
    if (!this.asyncAttributesPending) {
      return;
    }
    for (let i = 0; i < this._rawAttributes.length; i++) {
      const [k, v] = this._rawAttributes[i];
      this._rawAttributes[i] = [k, isPromiseLike(v) ? await v : v];
    }
    this._asyncAttributesPending = false;
  }
  get attributes() {
    if (this.asyncAttributesPending) {
      import_api5.diag.error("Accessing resource attributes before async attributes settled");
    }
    if (this._memoizedAttributes) {
      return this._memoizedAttributes;
    }
    const attrs = {};
    for (const [k, v] of this._rawAttributes) {
      if (isPromiseLike(v)) {
        import_api5.diag.debug(`Unsettled resource attribute ${k} skipped`);
        continue;
      }
      if (v != null) {
        attrs[k] ??= v;
      }
    }
    if (!this._asyncAttributesPending) {
      this._memoizedAttributes = attrs;
    }
    return attrs;
  }
  getRawAttributes() {
    return this._rawAttributes;
  }
  get schemaUrl() {
    return this._schemaUrl;
  }
  merge(resource) {
    if (resource == null)
      return this;
    const mergedSchemaUrl = mergeSchemaUrl(this, resource);
    const mergedOptions = mergedSchemaUrl ? { schemaUrl: mergedSchemaUrl } : void 0;
    return _ResourceImpl.FromAttributeList([...resource.getRawAttributes(), ...this.getRawAttributes()], mergedOptions);
  }
};
function resourceFromAttributes(attributes, options) {
  return ResourceImpl.FromAttributeList(Object.entries(attributes), options);
}
__name(resourceFromAttributes, "resourceFromAttributes");
function guardedRawAttributes(attributes) {
  return attributes.map(([k, v]) => {
    if (isPromiseLike(v)) {
      return [
        k,
        v.catch((err) => {
          import_api5.diag.debug("promise rejection for resource attribute: %s - %s", k, err);
          return void 0;
        })
      ];
    }
    return [k, v];
  });
}
__name(guardedRawAttributes, "guardedRawAttributes");
function validateSchemaUrl(schemaUrl) {
  if (typeof schemaUrl === "string" || schemaUrl === void 0) {
    return schemaUrl;
  }
  import_api5.diag.warn("Schema URL must be string or undefined, got %s. Schema URL will be ignored.", schemaUrl);
  return void 0;
}
__name(validateSchemaUrl, "validateSchemaUrl");
function mergeSchemaUrl(old, updating) {
  const oldSchemaUrl = old?.schemaUrl;
  const updatingSchemaUrl = updating?.schemaUrl;
  const isOldEmpty = oldSchemaUrl === void 0 || oldSchemaUrl === "";
  const isUpdatingEmpty = updatingSchemaUrl === void 0 || updatingSchemaUrl === "";
  if (isOldEmpty) {
    return updatingSchemaUrl;
  }
  if (isUpdatingEmpty) {
    return oldSchemaUrl;
  }
  if (oldSchemaUrl === updatingSchemaUrl) {
    return oldSchemaUrl;
  }
  import_api5.diag.warn('Schema URL merge conflict: old resource has "%s", updating resource has "%s". Resulting resource will have undefined Schema URL.', oldSchemaUrl, updatingSchemaUrl);
  return void 0;
}
__name(mergeSchemaUrl, "mergeSchemaUrl");

// node_modules/@opentelemetry/sdk-trace-base/build/esm/sampler/AlwaysOffSampler.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@opentelemetry/sdk-trace-base/build/esm/Sampler.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var SamplingDecision;
(function(SamplingDecision2) {
  SamplingDecision2[SamplingDecision2["NOT_RECORD"] = 0] = "NOT_RECORD";
  SamplingDecision2[SamplingDecision2["RECORD"] = 1] = "RECORD";
  SamplingDecision2[SamplingDecision2["RECORD_AND_SAMPLED"] = 2] = "RECORD_AND_SAMPLED";
})(SamplingDecision || (SamplingDecision = {}));

// node_modules/@opentelemetry/sdk-trace-base/build/esm/sampler/AlwaysOffSampler.js
var AlwaysOffSampler = class {
  static {
    __name(this, "AlwaysOffSampler");
  }
  shouldSample() {
    return {
      decision: SamplingDecision.NOT_RECORD
    };
  }
  toString() {
    return "AlwaysOffSampler";
  }
};

// node_modules/@opentelemetry/sdk-trace-base/build/esm/sampler/AlwaysOnSampler.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var AlwaysOnSampler = class {
  static {
    __name(this, "AlwaysOnSampler");
  }
  shouldSample() {
    return {
      decision: SamplingDecision.RECORD_AND_SAMPLED
    };
  }
  toString() {
    return "AlwaysOnSampler";
  }
};

// node_modules/@opentelemetry/sdk-trace-base/build/esm/sampler/ParentBasedSampler.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var import_api6 = __toESM(require_src());
var ParentBasedSampler = class {
  static {
    __name(this, "ParentBasedSampler");
  }
  _root;
  _remoteParentSampled;
  _remoteParentNotSampled;
  _localParentSampled;
  _localParentNotSampled;
  constructor(config2) {
    this._root = config2.root;
    if (!this._root) {
      globalErrorHandler(new Error("ParentBasedSampler must have a root sampler configured"));
      this._root = new AlwaysOnSampler();
    }
    this._remoteParentSampled = config2.remoteParentSampled ?? new AlwaysOnSampler();
    this._remoteParentNotSampled = config2.remoteParentNotSampled ?? new AlwaysOffSampler();
    this._localParentSampled = config2.localParentSampled ?? new AlwaysOnSampler();
    this._localParentNotSampled = config2.localParentNotSampled ?? new AlwaysOffSampler();
  }
  shouldSample(context5, traceId, spanName, spanKind, attributes, links) {
    const parentContext = import_api6.trace.getSpanContext(context5);
    if (!parentContext || !(0, import_api6.isSpanContextValid)(parentContext)) {
      return this._root.shouldSample(context5, traceId, spanName, spanKind, attributes, links);
    }
    if (parentContext.isRemote) {
      if (parentContext.traceFlags & import_api6.TraceFlags.SAMPLED) {
        return this._remoteParentSampled.shouldSample(context5, traceId, spanName, spanKind, attributes, links);
      }
      return this._remoteParentNotSampled.shouldSample(context5, traceId, spanName, spanKind, attributes, links);
    }
    if (parentContext.traceFlags & import_api6.TraceFlags.SAMPLED) {
      return this._localParentSampled.shouldSample(context5, traceId, spanName, spanKind, attributes, links);
    }
    return this._localParentNotSampled.shouldSample(context5, traceId, spanName, spanKind, attributes, links);
  }
  toString() {
    return `ParentBased{root=${this._root.toString()}, remoteParentSampled=${this._remoteParentSampled.toString()}, remoteParentNotSampled=${this._remoteParentNotSampled.toString()}, localParentSampled=${this._localParentSampled.toString()}, localParentNotSampled=${this._localParentNotSampled.toString()}}`;
  }
};

// node_modules/@opentelemetry/sdk-trace-base/build/esm/sampler/TraceIdRatioBasedSampler.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var import_api7 = __toESM(require_src());
var TraceIdRatioBasedSampler = class {
  static {
    __name(this, "TraceIdRatioBasedSampler");
  }
  _ratio;
  _upperBound;
  constructor(_ratio = 0) {
    this._ratio = _ratio;
    this._ratio = this._normalize(_ratio);
    this._upperBound = Math.floor(this._ratio * 4294967295);
  }
  shouldSample(context5, traceId) {
    return {
      decision: (0, import_api7.isValidTraceId)(traceId) && this._accumulate(traceId) < this._upperBound ? SamplingDecision.RECORD_AND_SAMPLED : SamplingDecision.NOT_RECORD
    };
  }
  toString() {
    return `TraceIdRatioBased{${this._ratio}}`;
  }
  _normalize(ratio) {
    if (typeof ratio !== "number" || isNaN(ratio))
      return 0;
    return ratio >= 1 ? 1 : ratio <= 0 ? 0 : ratio;
  }
  _accumulate(traceId) {
    let accumulation = 0;
    for (let i = 0; i < traceId.length / 8; i++) {
      const pos = i * 8;
      const part = parseInt(traceId.slice(pos, pos + 8), 16);
      accumulation = (accumulation ^ part) >>> 0;
    }
    return accumulation;
  }
};

// node_modules/@opentelemetry/sdk-trace-base/build/esm/platform/browser/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@opentelemetry/sdk-trace-base/build/esm/platform/browser/RandomIdGenerator.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var SPAN_ID_BYTES = 8;
var TRACE_ID_BYTES = 16;
var RandomIdGenerator = class {
  static {
    __name(this, "RandomIdGenerator");
  }
  /**
   * Returns a random 16-byte trace ID formatted/encoded as a 32 lowercase hex
   * characters corresponding to 128 bits.
   */
  generateTraceId = getIdGenerator(TRACE_ID_BYTES);
  /**
   * Returns a random 8-byte span ID formatted/encoded as a 16 lowercase hex
   * characters corresponding to 64 bits.
   */
  generateSpanId = getIdGenerator(SPAN_ID_BYTES);
};
var SHARED_CHAR_CODES_ARRAY = Array(32);
function getIdGenerator(bytes) {
  return /* @__PURE__ */ __name(function generateId() {
    for (let i = 0; i < bytes * 2; i++) {
      SHARED_CHAR_CODES_ARRAY[i] = Math.floor(Math.random() * 16) + 48;
      if (SHARED_CHAR_CODES_ARRAY[i] >= 58) {
        SHARED_CHAR_CODES_ARRAY[i] += 39;
      }
    }
    return String.fromCharCode.apply(null, SHARED_CHAR_CODES_ARRAY.slice(0, bytes * 2));
  }, "generateId");
}
__name(getIdGenerator, "getIdGenerator");

// node_modules/@microlabs/otel-cf-workers/dist/index.js
var import_api9 = __toESM(require_src(), 1);
var import_api10 = __toESM(require_src(), 1);
var import_otlp_exporter_base = __toESM(require_src4(), 1);

// node_modules/@opentelemetry/otlp-transformer/build/esm/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@opentelemetry/otlp-transformer/build/esm/common/utils.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@opentelemetry/otlp-transformer/node_modules/@opentelemetry/core/build/esm/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@opentelemetry/otlp-transformer/node_modules/@opentelemetry/core/build/esm/common/time.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var NANOSECOND_DIGITS2 = 9;
var NANOSECOND_DIGITS_IN_MILLIS2 = 6;
var MILLISECONDS_TO_NANOSECONDS2 = Math.pow(10, NANOSECOND_DIGITS_IN_MILLIS2);
var SECOND_TO_NANOSECONDS2 = Math.pow(10, NANOSECOND_DIGITS2);
function hrTimeToNanoseconds2(time3) {
  return time3[0] * SECOND_TO_NANOSECONDS2 + time3[1];
}
__name(hrTimeToNanoseconds2, "hrTimeToNanoseconds");

// node_modules/@opentelemetry/otlp-transformer/build/esm/common/hex-to-binary.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function intValue(charCode) {
  if (charCode >= 48 && charCode <= 57) {
    return charCode - 48;
  }
  if (charCode >= 97 && charCode <= 102) {
    return charCode - 87;
  }
  return charCode - 55;
}
__name(intValue, "intValue");
function hexToBinary(hexStr) {
  const buf = new Uint8Array(hexStr.length / 2);
  let offset = 0;
  for (let i = 0; i < hexStr.length; i += 2) {
    const hi = intValue(hexStr.charCodeAt(i));
    const lo = intValue(hexStr.charCodeAt(i + 1));
    buf[offset++] = hi << 4 | lo;
  }
  return buf;
}
__name(hexToBinary, "hexToBinary");

// node_modules/@opentelemetry/otlp-transformer/build/esm/common/utils.js
function hrTimeToNanos(hrTime3) {
  const NANOSECONDS = BigInt(1e9);
  return BigInt(hrTime3[0]) * NANOSECONDS + BigInt(hrTime3[1]);
}
__name(hrTimeToNanos, "hrTimeToNanos");
function toLongBits(value) {
  const low = Number(BigInt.asUintN(32, value));
  const high = Number(BigInt.asUintN(32, value >> BigInt(32)));
  return { low, high };
}
__name(toLongBits, "toLongBits");
function encodeAsLongBits(hrTime3) {
  const nanos = hrTimeToNanos(hrTime3);
  return toLongBits(nanos);
}
__name(encodeAsLongBits, "encodeAsLongBits");
function encodeAsString(hrTime3) {
  const nanos = hrTimeToNanos(hrTime3);
  return nanos.toString();
}
__name(encodeAsString, "encodeAsString");
var encodeTimestamp = typeof BigInt !== "undefined" ? encodeAsString : hrTimeToNanoseconds2;
function identity(value) {
  return value;
}
__name(identity, "identity");
function optionalHexToBinary(str) {
  if (str === void 0)
    return void 0;
  return hexToBinary(str);
}
__name(optionalHexToBinary, "optionalHexToBinary");
var DEFAULT_ENCODER = {
  encodeHrTime: encodeAsLongBits,
  encodeSpanContext: hexToBinary,
  encodeOptionalSpanContext: optionalHexToBinary
};
function getOtlpEncoder(options) {
  if (options === void 0) {
    return DEFAULT_ENCODER;
  }
  const useLongBits = options.useLongBits ?? true;
  const useHex = options.useHex ?? false;
  return {
    encodeHrTime: useLongBits ? encodeAsLongBits : encodeTimestamp,
    encodeSpanContext: useHex ? identity : hexToBinary,
    encodeOptionalSpanContext: useHex ? identity : optionalHexToBinary
  };
}
__name(getOtlpEncoder, "getOtlpEncoder");

// node_modules/@opentelemetry/otlp-transformer/build/esm/common/internal.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function createResource(resource) {
  return {
    attributes: toAttributes(resource.attributes),
    droppedAttributesCount: 0
  };
}
__name(createResource, "createResource");
function createInstrumentationScope(scope) {
  return {
    name: scope.name,
    version: scope.version
  };
}
__name(createInstrumentationScope, "createInstrumentationScope");
function toAttributes(attributes) {
  return Object.keys(attributes).map((key) => toKeyValue(key, attributes[key]));
}
__name(toAttributes, "toAttributes");
function toKeyValue(key, value) {
  return {
    key,
    value: toAnyValue(value)
  };
}
__name(toKeyValue, "toKeyValue");
function toAnyValue(value) {
  const t = typeof value;
  if (t === "string")
    return { stringValue: value };
  if (t === "number") {
    if (!Number.isInteger(value))
      return { doubleValue: value };
    return { intValue: value };
  }
  if (t === "boolean")
    return { boolValue: value };
  if (value instanceof Uint8Array)
    return { bytesValue: value };
  if (Array.isArray(value))
    return { arrayValue: { values: value.map(toAnyValue) } };
  if (t === "object" && value != null)
    return {
      kvlistValue: {
        values: Object.entries(value).map(([k, v]) => toKeyValue(k, v))
      }
    };
  return {};
}
__name(toAnyValue, "toAnyValue");

// node_modules/@opentelemetry/otlp-transformer/build/esm/trace/internal.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function sdkSpanToOtlpSpan(span, encoder) {
  const ctx = span.spanContext();
  const status = span.status;
  const parentSpanId = span.parentSpanContext?.spanId ? encoder.encodeSpanContext(span.parentSpanContext?.spanId) : void 0;
  return {
    traceId: encoder.encodeSpanContext(ctx.traceId),
    spanId: encoder.encodeSpanContext(ctx.spanId),
    parentSpanId,
    traceState: ctx.traceState?.serialize(),
    name: span.name,
    // Span kind is offset by 1 because the API does not define a value for unset
    kind: span.kind == null ? 0 : span.kind + 1,
    startTimeUnixNano: encoder.encodeHrTime(span.startTime),
    endTimeUnixNano: encoder.encodeHrTime(span.endTime),
    attributes: toAttributes(span.attributes),
    droppedAttributesCount: span.droppedAttributesCount,
    events: span.events.map((event) => toOtlpSpanEvent(event, encoder)),
    droppedEventsCount: span.droppedEventsCount,
    status: {
      // API and proto enums share the same values
      code: status.code,
      message: status.message
    },
    links: span.links.map((link) => toOtlpLink(link, encoder)),
    droppedLinksCount: span.droppedLinksCount
  };
}
__name(sdkSpanToOtlpSpan, "sdkSpanToOtlpSpan");
function toOtlpLink(link, encoder) {
  return {
    attributes: link.attributes ? toAttributes(link.attributes) : [],
    spanId: encoder.encodeSpanContext(link.context.spanId),
    traceId: encoder.encodeSpanContext(link.context.traceId),
    traceState: link.context.traceState?.serialize(),
    droppedAttributesCount: link.droppedAttributesCount || 0
  };
}
__name(toOtlpLink, "toOtlpLink");
function toOtlpSpanEvent(timedEvent, encoder) {
  return {
    attributes: timedEvent.attributes ? toAttributes(timedEvent.attributes) : [],
    name: timedEvent.name,
    timeUnixNano: encoder.encodeHrTime(timedEvent.time),
    droppedAttributesCount: timedEvent.droppedAttributesCount || 0
  };
}
__name(toOtlpSpanEvent, "toOtlpSpanEvent");
function createExportTraceServiceRequest(spans, options) {
  const encoder = getOtlpEncoder(options);
  return {
    resourceSpans: spanRecordsToResourceSpans(spans, encoder)
  };
}
__name(createExportTraceServiceRequest, "createExportTraceServiceRequest");
function createResourceMap(readableSpans) {
  const resourceMap = /* @__PURE__ */ new Map();
  for (const record of readableSpans) {
    let ilsMap = resourceMap.get(record.resource);
    if (!ilsMap) {
      ilsMap = /* @__PURE__ */ new Map();
      resourceMap.set(record.resource, ilsMap);
    }
    const instrumentationScopeKey = `${record.instrumentationScope.name}@${record.instrumentationScope.version || ""}:${record.instrumentationScope.schemaUrl || ""}`;
    let records = ilsMap.get(instrumentationScopeKey);
    if (!records) {
      records = [];
      ilsMap.set(instrumentationScopeKey, records);
    }
    records.push(record);
  }
  return resourceMap;
}
__name(createResourceMap, "createResourceMap");
function spanRecordsToResourceSpans(readableSpans, encoder) {
  const resourceMap = createResourceMap(readableSpans);
  const out = [];
  const entryIterator = resourceMap.entries();
  let entry = entryIterator.next();
  while (!entry.done) {
    const [resource, ilmMap] = entry.value;
    const scopeResourceSpans = [];
    const ilmIterator = ilmMap.values();
    let ilmEntry = ilmIterator.next();
    while (!ilmEntry.done) {
      const scopeSpans = ilmEntry.value;
      if (scopeSpans.length > 0) {
        const spans = scopeSpans.map((readableSpan) => sdkSpanToOtlpSpan(readableSpan, encoder));
        scopeResourceSpans.push({
          scope: createInstrumentationScope(scopeSpans[0].instrumentationScope),
          spans,
          schemaUrl: scopeSpans[0].instrumentationScope.schemaUrl
        });
      }
      ilmEntry = ilmIterator.next();
    }
    const transformedSpans = {
      resource: createResource(resource),
      scopeSpans: scopeResourceSpans,
      schemaUrl: void 0
    };
    out.push(transformedSpans);
    entry = entryIterator.next();
  }
  return out;
}
__name(spanRecordsToResourceSpans, "spanRecordsToResourceSpans");

// node_modules/@opentelemetry/otlp-transformer/build/esm/trace/json/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@opentelemetry/otlp-transformer/build/esm/trace/json/trace.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var JsonTraceSerializer = {
  serializeRequest: /* @__PURE__ */ __name((arg) => {
    const request = createExportTraceServiceRequest(arg, {
      useHex: true,
      useLongBits: false
    });
    const encoder = new TextEncoder();
    return encoder.encode(JSON.stringify(request));
  }, "serializeRequest"),
  deserializeResponse: /* @__PURE__ */ __name((arg) => {
    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(arg));
  }, "deserializeResponse")
};

// node_modules/@microlabs/otel-cf-workers/dist/index.js
var import_api11 = __toESM(require_src(), 1);
var import_api12 = __toESM(require_src(), 1);
var import_api13 = __toESM(require_src(), 1);
import { AsyncLocalStorage } from "node:async_hooks";
import { EventEmitter as EventEmitter2 } from "node:events";
var import_api14 = __toESM(require_src(), 1);
var import_semantic_conventions = __toESM(require_src2(), 1);
var import_api15 = __toESM(require_src(), 1);
var import_api16 = __toESM(require_src(), 1);
var import_api17 = __toESM(require_src(), 1);
var import_incubating = __toESM(require_index_incubating(), 1);
var import_api18 = __toESM(require_src(), 1);
var import_semantic_conventions2 = __toESM(require_src2(), 1);
var import_api19 = __toESM(require_src(), 1);
var import_semantic_conventions3 = __toESM(require_src2(), 1);
var import_api20 = __toESM(require_src(), 1);
var import_semantic_conventions4 = __toESM(require_src2(), 1);
var import_api21 = __toESM(require_src(), 1);
var import_incubating2 = __toESM(require_index_incubating(), 1);
import { DurableObject as DurableObjectClass } from "cloudflare:workers";
var import_api22 = __toESM(require_src(), 1);
var import_incubating3 = __toESM(require_index_incubating(), 1);
globalThis.Buffer = Buffer2;
function multiTailSampler(samplers) {
  return (traceInfo) => {
    return samplers.reduce((result, sampler) => result || sampler(traceInfo), false);
  };
}
__name(multiTailSampler, "multiTailSampler");
var isHeadSampled = /* @__PURE__ */ __name((traceInfo) => {
  const localRootSpan = traceInfo.localRootSpan;
  return (localRootSpan.spanContext().traceFlags & import_api8.TraceFlags.SAMPLED) === import_api8.TraceFlags.SAMPLED;
}, "isHeadSampled");
var isRootErrorSpan = /* @__PURE__ */ __name((traceInfo) => {
  const localRootSpan = traceInfo.localRootSpan;
  return localRootSpan.status.code === import_api8.SpanStatusCode.ERROR;
}, "isRootErrorSpan");
function createSampler(conf) {
  const ratioSampler = new TraceIdRatioBasedSampler(conf.ratio);
  if (typeof conf.acceptRemote === "boolean" && !conf.acceptRemote) {
    return new ParentBasedSampler({
      root: ratioSampler,
      remoteParentSampled: ratioSampler,
      remoteParentNotSampled: ratioSampler
    });
  } else {
    return new ParentBasedSampler({ root: ratioSampler });
  }
}
__name(createSampler, "createSampler");
function isSpanProcessorConfig(config2) {
  return !!config2.spanProcessors;
}
__name(isSpanProcessorConfig, "isSpanProcessorConfig");
var unwrapSymbol = Symbol("unwrap");
function isWrapped(item) {
  return item && !!item[unwrapSymbol];
}
__name(isWrapped, "isWrapped");
function isProxyable(item) {
  return item !== null && typeof item === "object" || typeof item === "function";
}
__name(isProxyable, "isProxyable");
function wrap(item, handler, autoPassthrough = true) {
  if (isWrapped(item) || !isProxyable(item)) {
    return item;
  }
  const proxyHandler = Object.assign({}, handler);
  proxyHandler.get = (target, prop, receiver) => {
    if (prop === unwrapSymbol) {
      return item;
    } else {
      if (handler.get) {
        return handler.get(target, prop, receiver);
      } else if (prop === "bind") {
        return () => receiver;
      } else if (autoPassthrough) {
        return passthroughGet(target, prop);
      }
    }
  };
  proxyHandler.apply = (target, thisArg, argArray) => {
    if (handler.apply) {
      return handler.apply(unwrap(target), unwrap(thisArg), argArray);
    }
  };
  return new Proxy(item, proxyHandler);
}
__name(wrap, "wrap");
function unwrap(item) {
  if (item && isWrapped(item)) {
    return item[unwrapSymbol];
  } else {
    return item;
  }
}
__name(unwrap, "unwrap");
function passthroughGet(target, prop, thisArg) {
  const unwrappedTarget = unwrap(target);
  thisArg = unwrap(thisArg) || unwrappedTarget;
  const value = Reflect.get(unwrappedTarget, prop);
  if (typeof value === "function") {
    if (value.constructor.name === "RpcProperty") {
      return (...args) => unwrappedTarget[prop](...args);
    }
    return value.bind(thisArg);
  } else {
    return value;
  }
}
__name(passthroughGet, "passthroughGet");
var _microlabs_otel_cf_workers = "1.0.0-rc.52";
var node = "20.19.1";
var defaultHeaders = {
  accept: "application/json",
  "content-type": "application/json",
  "user-agent": `Cloudflare Worker @microlabs/otel-cf-workers v${_microlabs_otel_cf_workers}`
};
var OTLPExporter = class {
  static {
    __name(this, "OTLPExporter");
  }
  headers;
  url;
  constructor(config2) {
    this.url = config2.url;
    this.headers = Object.assign({}, defaultHeaders, config2.headers);
  }
  export(items, resultCallback) {
    this._export(items).then(() => {
      resultCallback({ code: ExportResultCode.SUCCESS });
    }).catch((error3) => {
      resultCallback({ code: ExportResultCode.FAILED, error: error3 });
    });
  }
  _export(items) {
    return new Promise((resolve, reject) => {
      try {
        this.send(items, resolve, reject);
      } catch (e2) {
        reject(e2);
      }
    });
  }
  send(items, onSuccess, onError) {
    const decoder = new TextDecoder();
    const exportMessage = JsonTraceSerializer.serializeRequest(items);
    const body = decoder.decode(exportMessage);
    const params = {
      method: "POST",
      headers: this.headers,
      body
    };
    unwrap(fetch)(this.url, params).then((response) => {
      if (response.ok) {
        onSuccess();
      } else {
        onError(new import_otlp_exporter_base.OTLPExporterError(`Exporter received a statusCode: ${response.status}`));
      }
    }).catch((error3) => {
      onError(new import_otlp_exporter_base.OTLPExporterError(`Exception during export: ${error3.toString()}`, error3.code, error3.stack));
    });
  }
  async shutdown() {
  }
};
function getSampler() {
  const conf = getActiveConfig();
  if (!conf) {
    console.log("Could not find config for sampling, sending everything by default");
  }
  return conf ? conf.sampling.tailSampler : () => true;
}
__name(getSampler, "getSampler");
var TraceState2 = class {
  static {
    __name(this, "TraceState");
  }
  unexportedSpans = [];
  inprogressSpans = /* @__PURE__ */ new Set();
  exporter;
  exportPromises = [];
  localRootSpan;
  traceDecision;
  constructor(exporter) {
    this.exporter = exporter;
  }
  addSpan(span) {
    const readableSpan = span;
    this.localRootSpan = this.localRootSpan || readableSpan;
    this.unexportedSpans.push(readableSpan);
    this.inprogressSpans.add(span.spanContext().spanId);
  }
  endSpan(span) {
    this.inprogressSpans.delete(span.spanContext().spanId);
    if (this.inprogressSpans.size === 0) {
      this.flush();
    }
  }
  sample() {
    if (this.traceDecision === void 0 && this.unexportedSpans.length > 0) {
      const sampler = getSampler();
      this.traceDecision = sampler({
        traceId: this.localRootSpan.spanContext().traceId,
        localRootSpan: this.localRootSpan,
        spans: this.unexportedSpans
      });
    }
    this.unexportedSpans = this.traceDecision ? this.unexportedSpans : [];
  }
  async flush() {
    if (this.unexportedSpans.length > 0) {
      const unfinishedSpans = this.unexportedSpans.filter((span) => this.isSpanInProgress(span));
      for (const span of unfinishedSpans) {
        console.log(`Span ${span.spanContext().spanId} was not ended properly`);
        span.end();
      }
      this.sample();
      this.exportPromises.push(this.exportSpans(this.unexportedSpans));
      this.unexportedSpans = [];
    }
    if (this.exportPromises.length > 0) {
      await Promise.allSettled(this.exportPromises);
    }
  }
  isSpanInProgress(span) {
    return this.inprogressSpans.has(span.spanContext().spanId);
  }
  async exportSpans(spans) {
    await scheduler.wait(1);
    const promise = new Promise((resolve, reject) => {
      this.exporter.export(spans, (result) => {
        if (result.code === ExportResultCode.SUCCESS) {
          resolve();
        } else {
          console.log("exporting spans failed! " + result.error);
          reject(result.error);
        }
      });
    });
    await promise;
  }
};
var BatchTraceSpanProcessor = class {
  static {
    __name(this, "BatchTraceSpanProcessor");
  }
  constructor(exporter) {
    this.exporter = exporter;
  }
  traces = {};
  getTraceState(traceId) {
    const traceState = this.traces[traceId] || new TraceState2(this.exporter);
    this.traces[traceId] = traceState;
    return traceState;
  }
  onStart(span, _parentContext) {
    const traceId = span.spanContext().traceId;
    this.getTraceState(traceId).addSpan(span);
  }
  onEnd(span) {
    const traceId = span.spanContext().traceId;
    this.getTraceState(traceId).endSpan(span);
  }
  async forceFlush(traceId) {
    if (traceId) {
      await this.getTraceState(traceId).flush();
    } else {
      const promises = Object.values(this.traces).map((traceState) => traceState.flush);
      await Promise.allSettled(promises);
    }
  }
  async shutdown() {
    await this.forceFlush();
  }
};
var configSymbol = Symbol("Otel Workers Tracing Configuration");
function setConfig(config2, ctx = import_api10.context.active()) {
  return ctx.setValue(configSymbol, config2);
}
__name(setConfig, "setConfig");
function getActiveConfig() {
  const config2 = import_api10.context.active().getValue(configSymbol);
  return config2 || void 0;
}
__name(getActiveConfig, "getActiveConfig");
function isSpanExporter(exporterConfig) {
  return !!exporterConfig.export;
}
__name(isSpanExporter, "isSpanExporter");
function isSampler(sampler) {
  return !!sampler.shouldSample;
}
__name(isSampler, "isSampler");
function parseConfig(supplied) {
  if (isSpanProcessorConfig(supplied)) {
    const headSampleConf = supplied.sampling?.headSampler || { ratio: 1 };
    const headSampler = isSampler(headSampleConf) ? headSampleConf : createSampler(headSampleConf);
    const spanProcessors = Array.isArray(supplied.spanProcessors) ? supplied.spanProcessors : [supplied.spanProcessors];
    if (spanProcessors.length === 0) {
      console.log(
        "Warning! You must either specify an exporter or your own SpanProcessor(s)/Exporter combination in the open-telemetry configuration."
      );
    }
    return {
      fetch: {
        includeTraceContext: supplied.fetch?.includeTraceContext ?? true
      },
      handlers: {
        fetch: {
          acceptTraceContext: supplied.handlers?.fetch?.acceptTraceContext ?? true
        }
      },
      postProcessor: supplied.postProcessor || ((spans) => spans),
      sampling: {
        headSampler,
        tailSampler: supplied.sampling?.tailSampler || multiTailSampler([isHeadSampled, isRootErrorSpan])
      },
      service: supplied.service,
      spanProcessors,
      propagator: supplied.propagator || new W3CTraceContextPropagator(),
      instrumentation: {
        instrumentGlobalCache: supplied.instrumentation?.instrumentGlobalCache ?? true,
        instrumentGlobalFetch: supplied.instrumentation?.instrumentGlobalFetch ?? true
      }
    };
  } else {
    const exporter = isSpanExporter(supplied.exporter) ? supplied.exporter : new OTLPExporter(supplied.exporter);
    const spanProcessors = [new BatchTraceSpanProcessor(exporter)];
    const newConfig = Object.assign(supplied, { exporter: void 0, spanProcessors });
    return parseConfig(newConfig);
  }
}
__name(parseConfig, "parseConfig");
var ADD_LISTENER_METHODS = [
  "addListener",
  "on",
  "once",
  "prependListener",
  "prependOnceListener"
];
var AbstractAsyncHooksContextManager = class {
  static {
    __name(this, "AbstractAsyncHooksContextManager");
  }
  /**
   * Binds a the certain context or the active one to the target function and then returns the target
   * @param context A context (span) to be bind to target
   * @param target a function or event emitter. When target or one of its callbacks is called,
   *  the provided context will be used as the active context for the duration of the call.
   */
  bind(context32, target) {
    if (target instanceof EventEmitter2) {
      return this._bindEventEmitter(context32, target);
    }
    if (typeof target === "function") {
      return this._bindFunction(context32, target);
    }
    return target;
  }
  _bindFunction(context32, target) {
    const manager = this;
    const contextWrapper = /* @__PURE__ */ __name(function(...args) {
      return manager.with(context32, () => target.apply(this, args));
    }, "contextWrapper");
    Object.defineProperty(contextWrapper, "length", {
      enumerable: false,
      configurable: true,
      writable: false,
      value: target.length
    });
    return contextWrapper;
  }
  /**
   * By default, EventEmitter call their callback with their context, which we do
   * not want, instead we will bind a specific context to all callbacks that
   * go through it.
   * @param context the context we want to bind
   * @param ee EventEmitter an instance of EventEmitter to patch
   */
  _bindEventEmitter(context32, ee) {
    const map = this._getPatchMap(ee);
    if (map !== void 0) return ee;
    this._createPatchMap(ee);
    ADD_LISTENER_METHODS.forEach((methodName) => {
      if (ee[methodName] === void 0) return;
      ee[methodName] = this._patchAddListener(ee, ee[methodName], context32);
    });
    if (typeof ee.removeListener === "function") {
      ee.removeListener = this._patchRemoveListener(ee, ee.removeListener);
    }
    if (typeof ee.off === "function") {
      ee.off = this._patchRemoveListener(ee, ee.off);
    }
    if (typeof ee.removeAllListeners === "function") {
      ee.removeAllListeners = this._patchRemoveAllListeners(ee, ee.removeAllListeners);
    }
    return ee;
  }
  /**
   * Patch methods that remove a given listener so that we match the "patched"
   * version of that listener (the one that propagate context).
   * @param ee EventEmitter instance
   * @param original reference to the patched method
   */
  _patchRemoveListener(ee, original) {
    const contextManager = this;
    return function(event, listener) {
      const events = contextManager._getPatchMap(ee)?.[event];
      if (events === void 0) {
        return original.call(this, event, listener);
      }
      const patchedListener = events.get(listener);
      return original.call(this, event, patchedListener || listener);
    };
  }
  /**
   * Patch methods that remove all listeners so we remove our
   * internal references for a given event.
   * @param ee EventEmitter instance
   * @param original reference to the patched method
   */
  _patchRemoveAllListeners(ee, original) {
    const contextManager = this;
    return function(event) {
      const map = contextManager._getPatchMap(ee);
      if (map !== void 0) {
        if (arguments.length === 0) {
          contextManager._createPatchMap(ee);
        } else if (map[event] !== void 0) {
          delete map[event];
        }
      }
      return original.apply(this, arguments);
    };
  }
  /**
   * Patch methods on an event emitter instance that can add listeners so we
   * can force them to propagate a given context.
   * @param ee EventEmitter instance
   * @param original reference to the patched method
   * @param [context] context to propagate when calling listeners
   */
  _patchAddListener(ee, original, context32) {
    const contextManager = this;
    return function(event, listener) {
      if (contextManager._wrapped) {
        return original.call(this, event, listener);
      }
      let map = contextManager._getPatchMap(ee);
      if (map === void 0) {
        map = contextManager._createPatchMap(ee);
      }
      let listeners2 = map[event];
      if (listeners2 === void 0) {
        listeners2 = /* @__PURE__ */ new WeakMap();
        map[event] = listeners2;
      }
      const patchedListener = contextManager.bind(context32, listener);
      listeners2.set(listener, patchedListener);
      contextManager._wrapped = true;
      try {
        return original.call(this, event, patchedListener);
      } finally {
        contextManager._wrapped = false;
      }
    };
  }
  _createPatchMap(ee) {
    const map = /* @__PURE__ */ Object.create(null);
    ee[this._kOtListeners] = map;
    return map;
  }
  _getPatchMap(ee) {
    return ee[this._kOtListeners];
  }
  _kOtListeners = Symbol("OtListeners");
  _wrapped = false;
};
var AsyncLocalStorageContextManager = class extends AbstractAsyncHooksContextManager {
  static {
    __name(this, "AsyncLocalStorageContextManager");
  }
  _asyncLocalStorage;
  constructor() {
    super();
    this._asyncLocalStorage = new AsyncLocalStorage();
  }
  active() {
    return this._asyncLocalStorage.getStore() ?? import_api12.ROOT_CONTEXT;
  }
  with(context32, fn, thisArg, ...args) {
    const cb = thisArg == null ? fn : fn.bind(thisArg);
    return this._asyncLocalStorage.run(context32, cb, ...args);
  }
  enable() {
    return this;
  }
  disable() {
    this._asyncLocalStorage.disable();
    return this;
  }
};
function transformExceptionAttributes(exception) {
  const attributes = {};
  if (typeof exception === "string") {
    attributes[import_semantic_conventions.SemanticAttributes.EXCEPTION_MESSAGE] = exception;
  } else {
    if (exception.code) {
      attributes[import_semantic_conventions.SemanticAttributes.EXCEPTION_TYPE] = exception.code.toString();
    } else if (exception.name) {
      attributes[import_semantic_conventions.SemanticAttributes.EXCEPTION_TYPE] = exception.name;
    }
    if (exception.message) {
      attributes[import_semantic_conventions.SemanticAttributes.EXCEPTION_MESSAGE] = exception.message;
    }
    if (exception.stack) {
      attributes[import_semantic_conventions.SemanticAttributes.EXCEPTION_STACKTRACE] = exception.stack;
    }
  }
  return attributes;
}
__name(transformExceptionAttributes, "transformExceptionAttributes");
function millisToHr(millis) {
  return [Math.trunc(millis / 1e3), millis % 1e3 * 1e6];
}
__name(millisToHr, "millisToHr");
function getHrTime(input) {
  const now = Date.now();
  if (!input) {
    return millisToHr(now);
  } else if (input instanceof Date) {
    return millisToHr(input.getTime());
  } else if (typeof input === "number") {
    return millisToHr(input);
  } else if (Array.isArray(input)) {
    return input;
  }
  const v = input;
  throw new Error(`unreachable value: ${JSON.stringify(v)}`);
}
__name(getHrTime, "getHrTime");
function isAttributeKey2(key) {
  return typeof key === "string" && key.length > 0;
}
__name(isAttributeKey2, "isAttributeKey");
var SpanImpl = class {
  static {
    __name(this, "SpanImpl");
  }
  name;
  _spanContext;
  onEnd;
  parentSpanId;
  parentSpanContext;
  kind;
  attributes;
  status = {
    code: import_api14.SpanStatusCode.UNSET
  };
  endTime = [0, 0];
  _duration = [0, 0];
  startTime;
  events = [];
  links;
  resource;
  instrumentationScope = { name: "@microlabs/otel-cf-workers" };
  _ended = false;
  _droppedAttributesCount = 0;
  _droppedEventsCount = 0;
  _droppedLinksCount = 0;
  constructor(init2) {
    this.name = init2.name;
    this._spanContext = init2.spanContext;
    this.parentSpanId = init2.parentSpanId;
    this.parentSpanContext = init2.parentSpanContext;
    this.kind = init2.spanKind || import_api14.SpanKind.INTERNAL;
    this.attributes = sanitizeAttributes(init2.attributes);
    this.startTime = getHrTime(init2.startTime);
    this.links = init2.links || [];
    this.resource = init2.resource;
    this.onEnd = init2.onEnd;
  }
  addLink(link) {
    this.links.push(link);
    return this;
  }
  addLinks(links) {
    this.links.push(...links);
    return this;
  }
  spanContext() {
    return this._spanContext;
  }
  setAttribute(key, value) {
    if (isAttributeKey2(key) && isAttributeValue(value)) {
      this.attributes[key] = value;
    }
    return this;
  }
  setAttributes(attributes) {
    for (const [key, value] of Object.entries(attributes)) {
      this.setAttribute(key, value);
    }
    return this;
  }
  addEvent(name, attributesOrStartTime, startTime) {
    if (isTimeInput(attributesOrStartTime)) {
      startTime = attributesOrStartTime;
      attributesOrStartTime = void 0;
    }
    const attributes = sanitizeAttributes(attributesOrStartTime);
    const time3 = getHrTime(startTime);
    this.events.push({ name, attributes, time: time3 });
    return this;
  }
  setStatus(status) {
    this.status = status;
    return this;
  }
  updateName(name) {
    this.name = name;
    return this;
  }
  end(endTime) {
    if (this._ended) {
      return;
    }
    this._ended = true;
    this.endTime = getHrTime(endTime);
    this._duration = hrTimeDuration(this.startTime, this.endTime);
    this.onEnd(this);
  }
  isRecording() {
    return !this._ended;
  }
  recordException(exception, time3) {
    const attributes = transformExceptionAttributes(exception);
    this.addEvent("exception", attributes, time3);
  }
  get duration() {
    return this._duration;
  }
  get ended() {
    return this._ended;
  }
  get droppedAttributesCount() {
    return this._droppedAttributesCount;
  }
  get droppedEventsCount() {
    return this._droppedEventsCount;
  }
  get droppedLinksCount() {
    return this._droppedLinksCount;
  }
};
var idGenerator = new RandomIdGenerator();
var withNextSpanAttributes;
function getFlagAt(flagSequence, position) {
  return (flagSequence >> position - 1 & 1) * position;
}
__name(getFlagAt, "getFlagAt");
var WorkerTracer = class {
  static {
    __name(this, "WorkerTracer");
  }
  spanProcessors;
  resource;
  constructor(spanProcessors, resource) {
    this.spanProcessors = spanProcessors;
    this.resource = resource;
  }
  async forceFlush(traceId) {
    const promises = this.spanProcessors.map(async (spanProcessor) => {
      await spanProcessor.forceFlush(traceId);
    });
    await Promise.allSettled(promises);
  }
  addToResource(extra) {
    this.resource.merge(extra);
  }
  startSpan(name, options = {}, context32 = import_api13.context.active()) {
    if (options.root) {
      context32 = import_api13.trace.deleteSpan(context32);
    }
    const config2 = getActiveConfig();
    if (!config2) throw new Error("Config is undefined. This is a bug in the instrumentation logic");
    const parentSpanContext = import_api13.trace.getSpan(context32)?.spanContext();
    const { traceId, randomTraceFlag } = getTraceInfo(parentSpanContext);
    const spanKind = options.kind || import_api13.SpanKind.INTERNAL;
    const sanitisedAttrs = sanitizeAttributes(options.attributes);
    const sampler = config2.sampling.headSampler;
    const samplingDecision = sampler.shouldSample(context32, traceId, name, spanKind, sanitisedAttrs, []);
    const { decision, traceState, attributes: attrs } = samplingDecision;
    const attributes = Object.assign({}, options.attributes, attrs, withNextSpanAttributes);
    withNextSpanAttributes = {};
    const spanId = idGenerator.generateSpanId();
    const parentSpanId = parentSpanContext?.spanId;
    const sampleFlag = decision === SamplingDecision.RECORD_AND_SAMPLED ? import_api13.TraceFlags.SAMPLED : import_api13.TraceFlags.NONE;
    const traceFlags = sampleFlag + randomTraceFlag;
    const spanContext = { traceId, spanId, traceFlags, traceState };
    const span = new SpanImpl({
      attributes: sanitizeAttributes(attributes),
      name,
      onEnd: /* @__PURE__ */ __name((span2) => {
        this.spanProcessors.forEach((sp) => {
          sp.onEnd(span2);
        });
      }, "onEnd"),
      resource: this.resource,
      spanContext,
      parentSpanContext,
      parentSpanId,
      spanKind,
      startTime: options.startTime
    });
    this.spanProcessors.forEach((sp) => {
      sp.onStart(span, context32);
    });
    return span;
  }
  startActiveSpan(name, ...args) {
    const options = args.length > 1 ? args[0] : void 0;
    const parentContext = args.length > 2 ? args[1] : import_api13.context.active();
    const fn = args[args.length - 1];
    const span = this.startSpan(name, options, parentContext);
    const contextWithSpanSet = import_api13.trace.setSpan(parentContext, span);
    return import_api13.context.with(contextWithSpanSet, fn, void 0, span);
  }
};
function getTraceInfo(parentSpanContext) {
  if (parentSpanContext && import_api13.trace.isSpanContextValid(parentSpanContext)) {
    const { traceId, traceFlags } = parentSpanContext;
    return { traceId, randomTraceFlag: getFlagAt(traceFlags, 2) };
  } else {
    return {
      traceId: idGenerator.generateTraceId(),
      randomTraceFlag: 2
      /* RANDOM_TRACE_ID_SET */
    };
  }
}
__name(getTraceInfo, "getTraceInfo");
var WorkerTracerProvider = class {
  static {
    __name(this, "WorkerTracerProvider");
  }
  spanProcessors;
  resource;
  tracers = {};
  constructor(spanProcessors, resource) {
    this.spanProcessors = spanProcessors;
    this.resource = resource;
  }
  getTracer(name, version2, options) {
    const key = `${name}@${version2 || ""}:${options?.schemaUrl || ""}`;
    if (!this.tracers[key]) {
      this.tracers[key] = new WorkerTracer(this.spanProcessors, this.resource);
    }
    return this.tracers[key];
  }
  register() {
    import_api11.trace.setGlobalTracerProvider(this);
    import_api11.context.setGlobalContextManager(new AsyncLocalStorageContextManager());
  }
};
var netKeysFromCF = /* @__PURE__ */ new Set(["colo", "country", "request_priority", "tls_cipher", "tls_version", "asn", "tcp_rtt"]);
var camelToSnakeCase = /* @__PURE__ */ __name((s) => {
  return s.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}, "camelToSnakeCase");
var gatherOutgoingCfAttributes = /* @__PURE__ */ __name((cf) => {
  const attrs = {};
  Object.keys(cf).forEach((key) => {
    const value = cf[key];
    const destKey = camelToSnakeCase(key);
    if (!netKeysFromCF.has(destKey)) {
      if (typeof value === "string" || typeof value === "number") {
        attrs[`cf.${destKey}`] = value;
      } else {
        attrs[`cf.${destKey}`] = JSON.stringify(value);
      }
    }
  });
  return attrs;
}, "gatherOutgoingCfAttributes");
function gatherRequestAttributes(request) {
  const attrs = {};
  const headers = request.headers;
  attrs["http.request.method"] = request.method.toUpperCase();
  attrs["network.protocol.name"] = "http";
  attrs["network.protocol.version"] = request.cf?.httpProtocol;
  attrs["http.request.body.size"] = headers.get("content-length");
  attrs["user_agent.original"] = headers.get("user-agent");
  attrs["http.mime_type"] = headers.get("content-type");
  attrs["http.accepts"] = request.cf?.clientAcceptEncoding;
  const u = new URL(request.url);
  attrs["url.full"] = `${u.protocol}//${u.host}${u.pathname}${u.search}`;
  attrs["server.address"] = u.host;
  attrs["url.scheme"] = u.protocol;
  attrs["url.path"] = u.pathname;
  attrs["url.query"] = u.search;
  return attrs;
}
__name(gatherRequestAttributes, "gatherRequestAttributes");
function gatherResponseAttributes(response) {
  const attrs = {};
  attrs["http.response.status_code"] = response.status;
  if (response.headers.get("content-length") == null) {
    attrs["http.response.body.size"] = response.headers.get("content-length");
  }
  attrs["http.mime_type"] = response.headers.get("content-type");
  return attrs;
}
__name(gatherResponseAttributes, "gatherResponseAttributes");
function gatherIncomingCfAttributes(request) {
  const attrs = {};
  attrs["net.colo"] = request.cf?.colo;
  attrs["net.country"] = request.cf?.country;
  attrs["net.request_priority"] = request.cf?.requestPriority;
  attrs["net.tls_cipher"] = request.cf?.tlsCipher;
  attrs["net.tls_version"] = request.cf?.tlsVersion;
  attrs["net.asn"] = request.cf?.asn;
  attrs["net.tcp_rtt"] = request.cf?.clientTcpRtt;
  return attrs;
}
__name(gatherIncomingCfAttributes, "gatherIncomingCfAttributes");
function getParentContextFromHeaders(headers) {
  return import_api15.propagation.extract(import_api15.context.active(), headers, {
    get(headers2, key) {
      return headers2.get(key) || void 0;
    },
    keys(headers2) {
      return [...headers2.keys()];
    }
  });
}
__name(getParentContextFromHeaders, "getParentContextFromHeaders");
function getParentContextFromRequest(request) {
  const workerConfig = getActiveConfig();
  if (workerConfig === void 0) {
    return import_api15.context.active();
  }
  const acceptTraceContext = typeof workerConfig.handlers.fetch.acceptTraceContext === "function" ? workerConfig.handlers.fetch.acceptTraceContext(request) : workerConfig.handlers.fetch.acceptTraceContext ?? true;
  return acceptTraceContext ? getParentContextFromHeaders(request.headers) : import_api15.context.active();
}
__name(getParentContextFromRequest, "getParentContextFromRequest");
function updateSpanNameOnRoute(span, request) {
  const readable = span;
  if (readable.attributes["http.route"]) {
    const method = request.method.toUpperCase();
    span.updateName(`${method} ${readable.attributes["http.route"]}`);
  }
}
__name(updateSpanNameOnRoute, "updateSpanNameOnRoute");
var fetchInstrumentation = {
  getInitialSpanInfo: /* @__PURE__ */ __name((request) => {
    const spanContext = getParentContextFromRequest(request);
    const attributes = {
      ["faas.trigger"]: "http",
      ["faas.invocation_id"]: request.headers.get("cf-ray") ?? void 0
    };
    Object.assign(attributes, gatherRequestAttributes(request));
    Object.assign(attributes, gatherIncomingCfAttributes(request));
    const method = request.method.toUpperCase();
    return {
      name: `fetchHandler ${method}`,
      options: {
        attributes,
        kind: import_api15.SpanKind.SERVER
      },
      context: spanContext
    };
  }, "getInitialSpanInfo"),
  getAttributesFromResult: /* @__PURE__ */ __name((response) => {
    return gatherResponseAttributes(response);
  }, "getAttributesFromResult"),
  executionSucces: updateSpanNameOnRoute,
  executionFailed: updateSpanNameOnRoute
};
function instrumentClientFetch(fetchFn, configFn, attrs) {
  const handler = {
    apply: /* @__PURE__ */ __name((target, thisArg, argArray) => {
      const request = new Request(argArray[0], argArray[1]);
      if (!request.url.startsWith("http")) {
        return Reflect.apply(target, thisArg, argArray);
      }
      const workerConfig = getActiveConfig();
      if (!workerConfig) {
        return Reflect.apply(target, thisArg, [request]);
      }
      const config2 = configFn(workerConfig);
      const tracer2 = import_api15.trace.getTracer("fetcher");
      const options = { kind: import_api15.SpanKind.CLIENT, attributes: attrs };
      const host = new URL(request.url).host;
      const method = request.method.toUpperCase();
      const spanName = typeof attrs?.["name"] === "string" ? attrs?.["name"] : `fetch ${method} ${host}`;
      const promise = tracer2.startActiveSpan(spanName, options, async (span) => {
        try {
          const includeTraceContext = typeof config2.includeTraceContext === "function" ? config2.includeTraceContext(request) : config2.includeTraceContext;
          if (includeTraceContext ?? true) {
            import_api15.propagation.inject(import_api15.context.active(), request.headers, {
              set: /* @__PURE__ */ __name((h, k, v) => h.set(k, typeof v === "string" ? v : String(v)), "set")
            });
          }
          span.setAttributes(gatherRequestAttributes(request));
          if (request.cf) span.setAttributes(gatherOutgoingCfAttributes(request.cf));
          const response = await Reflect.apply(target, thisArg, [request]);
          span.setAttributes(gatherResponseAttributes(response));
          return response;
        } catch (error3) {
          span.recordException(error3);
          span.setStatus({ code: import_api15.SpanStatusCode.ERROR });
          throw error3;
        } finally {
          span.end();
        }
      });
      return promise;
    }, "apply")
  };
  return wrap(fetchFn, handler, true);
}
__name(instrumentClientFetch, "instrumentClientFetch");
function instrumentGlobalFetch() {
  globalThis.fetch = instrumentClientFetch(globalThis.fetch, (config2) => config2.fetch);
}
__name(instrumentGlobalFetch, "instrumentGlobalFetch");
var tracer = import_api16.trace.getTracer("cache instrumentation");
function sanitiseURL(url) {
  const u = new URL(url);
  return `${u.protocol}//${u.host}${u.pathname}${u.search}`;
}
__name(sanitiseURL, "sanitiseURL");
function instrumentFunction(fn, cacheName, op) {
  const handler = {
    async apply(target, thisArg, argArray) {
      const attributes = {
        "cache.name": cacheName,
        "http.url": argArray[0].url ? sanitiseURL(argArray[0].url) : void 0,
        "cache.operation": op
      };
      const options = { kind: import_api16.SpanKind.CLIENT, attributes };
      return tracer.startActiveSpan(`Cache ${cacheName} ${op}`, options, async (span) => {
        const result = await Reflect.apply(target, thisArg, argArray);
        if (op === "match") {
          span.setAttribute("cache.hit", !!result);
        }
        span.end();
        return result;
      });
    }
  };
  return wrap(fn, handler);
}
__name(instrumentFunction, "instrumentFunction");
function instrumentCache(cache, cacheName) {
  const handler = {
    get(target, prop) {
      if (prop === "delete" || prop === "match" || prop === "put") {
        const fn = Reflect.get(target, prop).bind(target);
        return instrumentFunction(fn, cacheName, prop);
      } else {
        return Reflect.get(target, prop);
      }
    }
  };
  return wrap(cache, handler);
}
__name(instrumentCache, "instrumentCache");
function instrumentOpen(openFn) {
  const handler = {
    async apply(target, thisArg, argArray) {
      const cacheName = argArray[0];
      const cache = await Reflect.apply(target, thisArg, argArray);
      return instrumentCache(cache, cacheName);
    }
  };
  return wrap(openFn, handler);
}
__name(instrumentOpen, "instrumentOpen");
function _instrumentGlobalCache() {
  const handler = {
    get(target, prop) {
      if (prop === "default") {
        const cache = target.default;
        return instrumentCache(cache, "default");
      } else if (prop === "open") {
        const openFn = Reflect.get(target, prop).bind(target);
        return instrumentOpen(openFn);
      } else {
        return Reflect.get(target, prop);
      }
    }
  };
  globalThis.caches = wrap(caches, handler);
}
__name(_instrumentGlobalCache, "_instrumentGlobalCache");
function instrumentGlobalCache() {
  return _instrumentGlobalCache();
}
__name(instrumentGlobalCache, "instrumentGlobalCache");
var MessageStatusCount = class {
  static {
    __name(this, "MessageStatusCount");
  }
  succeeded = 0;
  failed = 0;
  implicitly_acked = 0;
  implicitly_retried = 0;
  total;
  constructor(total) {
    this.total = total;
  }
  ack() {
    this.succeeded = this.succeeded + 1;
  }
  ackRemaining() {
    this.implicitly_acked = this.total - this.succeeded - this.failed;
    this.succeeded = this.total - this.failed;
  }
  retry() {
    this.failed = this.failed + 1;
  }
  retryRemaining() {
    this.implicitly_retried = this.total - this.succeeded - this.failed;
    this.failed = this.total - this.succeeded;
  }
  toAttributes() {
    return {
      "queue.messages_count": this.total,
      "queue.messages_success": this.succeeded,
      "queue.messages_failed": this.failed,
      "queue.batch_success": this.succeeded === this.total,
      "queue.implicitly_acked": this.implicitly_acked,
      "queue.implicitly_retried": this.implicitly_retried
    };
  }
};
var addEvent = /* @__PURE__ */ __name((name, msg) => {
  const attrs = {};
  if (msg) {
    attrs["queue.message_id"] = msg.id;
    attrs["queue.message_timestamp"] = msg.timestamp.toISOString();
  }
  import_api17.trace.getActiveSpan()?.addEvent(name, attrs);
}, "addEvent");
var proxyQueueMessage = /* @__PURE__ */ __name((msg, count3) => {
  const msgHandler = {
    get: /* @__PURE__ */ __name((target, prop) => {
      if (prop === "ack") {
        const ackFn = Reflect.get(target, prop);
        return new Proxy(ackFn, {
          apply: /* @__PURE__ */ __name((fnTarget) => {
            addEvent("messageAck", msg);
            count3.ack();
            Reflect.apply(fnTarget, msg, []);
          }, "apply")
        });
      } else if (prop === "retry") {
        const retryFn = Reflect.get(target, prop);
        return new Proxy(retryFn, {
          apply: /* @__PURE__ */ __name((fnTarget) => {
            addEvent("messageRetry", msg);
            count3.retry();
            const result = Reflect.apply(fnTarget, msg, []);
            return result;
          }, "apply")
        });
      } else {
        return Reflect.get(target, prop, msg);
      }
    }, "get")
  };
  return wrap(msg, msgHandler);
}, "proxyQueueMessage");
var proxyMessageBatch = /* @__PURE__ */ __name((batch, count3) => {
  const batchHandler = {
    get: /* @__PURE__ */ __name((target, prop) => {
      if (prop === "messages") {
        const messages = Reflect.get(target, prop);
        const messagesHandler = {
          get: /* @__PURE__ */ __name((target2, prop2) => {
            if (typeof prop2 === "string" && !isNaN(parseInt(prop2))) {
              const message = Reflect.get(target2, prop2);
              return proxyQueueMessage(message, count3);
            } else {
              return Reflect.get(target2, prop2);
            }
          }, "get")
        };
        return wrap(messages, messagesHandler);
      } else if (prop === "ackAll") {
        const ackFn = Reflect.get(target, prop);
        return new Proxy(ackFn, {
          apply: /* @__PURE__ */ __name((fnTarget) => {
            addEvent("ackAll");
            count3.ackRemaining();
            Reflect.apply(fnTarget, batch, []);
          }, "apply")
        });
      } else if (prop === "retryAll") {
        const retryFn = Reflect.get(target, prop);
        return new Proxy(retryFn, {
          apply: /* @__PURE__ */ __name((fnTarget) => {
            addEvent("retryAll");
            count3.retryRemaining();
            Reflect.apply(fnTarget, batch, []);
          }, "apply")
        });
      }
      return Reflect.get(target, prop);
    }, "get")
  };
  return wrap(batch, batchHandler);
}, "proxyMessageBatch");
var QueueInstrumentation = class {
  static {
    __name(this, "QueueInstrumentation");
  }
  count;
  getInitialSpanInfo(batch) {
    return {
      name: `queueHandler ${batch.queue}`,
      options: {
        attributes: {
          [import_incubating.ATTR_FAAS_TRIGGER]: import_incubating.FAAS_TRIGGER_VALUE_PUBSUB,
          "queue.name": batch.queue
        },
        kind: import_api17.SpanKind.CONSUMER
      }
    };
  }
  instrumentTrigger(batch) {
    this.count = new MessageStatusCount(batch.messages.length);
    return proxyMessageBatch(batch, this.count);
  }
  executionSucces(span) {
    if (this.count) {
      this.count.ackRemaining();
      span.setAttributes(this.count.toAttributes());
    }
  }
  executionFailed(span) {
    if (this.count) {
      this.count.retryRemaining();
      span.setAttributes(this.count.toAttributes());
    }
  }
};
function instrumentQueueSend(fn, name) {
  const tracer2 = import_api17.trace.getTracer("queueSender");
  const handler = {
    apply: /* @__PURE__ */ __name((target, thisArg, argArray) => {
      return tracer2.startActiveSpan(`Queues ${name} send`, async (span) => {
        span.setAttribute("queue.operation", "send");
        await Reflect.apply(target, unwrap(thisArg), argArray);
        span.end();
      });
    }, "apply")
  };
  return wrap(fn, handler);
}
__name(instrumentQueueSend, "instrumentQueueSend");
function instrumentQueueSendBatch(fn, name) {
  const tracer2 = import_api17.trace.getTracer("queueSender");
  const handler = {
    apply: /* @__PURE__ */ __name((target, thisArg, argArray) => {
      return tracer2.startActiveSpan(`Queues ${name} sendBatch`, async (span) => {
        span.setAttribute("queue.operation", "sendBatch");
        await Reflect.apply(target, unwrap(thisArg), argArray);
        span.end();
      });
    }, "apply")
  };
  return wrap(fn, handler);
}
__name(instrumentQueueSendBatch, "instrumentQueueSendBatch");
function instrumentQueueSender(queue, name) {
  const queueHandler = {
    get: /* @__PURE__ */ __name((target, prop) => {
      if (prop === "send") {
        const sendFn = Reflect.get(target, prop);
        return instrumentQueueSend(sendFn, name);
      } else if (prop === "sendBatch") {
        const sendFn = Reflect.get(target, prop);
        return instrumentQueueSendBatch(sendFn, name);
      } else {
        return Reflect.get(target, prop);
      }
    }, "get")
  };
  return wrap(queue, queueHandler);
}
__name(instrumentQueueSender, "instrumentQueueSender");
var dbSystem = "Cloudflare KV";
var KVAttributes = {
  delete(_argArray) {
    return {};
  },
  get(argArray) {
    const attrs = {};
    const opts = argArray[1];
    if (typeof opts === "string") {
      attrs["db.cf.kv.type"] = opts;
    } else if (typeof opts === "object") {
      attrs["db.cf.kv.type"] = opts.type;
      attrs["db.cf.kv.cache_ttl"] = opts.cacheTtl;
    }
    return attrs;
  },
  getWithMetadata(argArray, result) {
    const attrs = {};
    const opts = argArray[1];
    if (typeof opts === "string") {
      attrs["db.cf.kv.type"] = opts;
    } else if (typeof opts === "object") {
      attrs["db.cf.kv.type"] = opts.type;
      attrs["db.cf.kv.cache_ttl"] = opts.cacheTtl;
    }
    attrs["db.cf.kv.metadata"] = true;
    const { cacheStatus } = result;
    if (typeof cacheStatus === "string") {
      attrs["db.cf.kv.cache_status"] = cacheStatus;
    }
    return attrs;
  },
  list(argArray, result) {
    const attrs = {};
    const opts = argArray[0] || {};
    const { cursor, limit } = opts;
    attrs["db.cf.kv.list_request_cursor"] = cursor || void 0;
    attrs["db.cf.kv.list_limit"] = limit || void 0;
    const { list_complete, cacheStatus } = result;
    attrs["db.cf.kv.list_complete"] = list_complete || void 0;
    if (!list_complete) {
      attrs["db.cf.kv.list_response_cursor"] = cursor || void 0;
    }
    if (typeof cacheStatus === "string") {
      attrs["db.cf.kv.cache_status"] = cacheStatus;
    }
    return attrs;
  },
  put(argArray) {
    const attrs = {};
    if (argArray.length > 2 && argArray[2]) {
      const { expiration, expirationTtl, metadata } = argArray[2];
      attrs["db.cf.kv.expiration"] = expiration;
      attrs["db.cf.kv.expiration_ttl"] = expirationTtl;
      attrs["db.cf.kv.metadata"] = !!metadata;
    }
    return attrs;
  }
};
function instrumentKVFn(fn, name, operation) {
  const tracer2 = import_api18.trace.getTracer("KV");
  const fnHandler = {
    apply: /* @__PURE__ */ __name((target, thisArg, argArray) => {
      const attributes = {
        binding_type: "KV",
        [import_semantic_conventions2.SemanticAttributes.DB_NAME]: name,
        [import_semantic_conventions2.SemanticAttributes.DB_SYSTEM]: dbSystem,
        [import_semantic_conventions2.SemanticAttributes.DB_OPERATION]: operation
      };
      const options = {
        kind: import_api18.SpanKind.CLIENT,
        attributes
      };
      return tracer2.startActiveSpan(`KV ${name} ${operation}`, options, async (span) => {
        const result = await Reflect.apply(target, thisArg, argArray);
        const extraAttrsFn = KVAttributes[operation];
        const extraAttrs = extraAttrsFn ? extraAttrsFn(argArray, result) : {};
        span.setAttributes(extraAttrs);
        if (operation === "list") {
          const opts = argArray[0] || {};
          const { prefix } = opts;
          span.setAttribute(import_semantic_conventions2.SemanticAttributes.DB_STATEMENT, `${operation} ${prefix || void 0}`);
        } else {
          span.setAttribute(import_semantic_conventions2.SemanticAttributes.DB_STATEMENT, `${operation} ${argArray[0]}`);
          span.setAttribute("db.cf.kv.key", argArray[0]);
        }
        if (operation === "getWithMetadata") {
          const hasResults = !!result && !!result.value;
          span.setAttribute("db.cf.kv.has_result", hasResults);
        } else {
          span.setAttribute("db.cf.kv.has_result", !!result);
        }
        span.end();
        return result;
      });
    }, "apply")
  };
  return wrap(fn, fnHandler);
}
__name(instrumentKVFn, "instrumentKVFn");
function instrumentKV(kv, name) {
  const kvHandler = {
    get: /* @__PURE__ */ __name((target, prop, receiver) => {
      const operation = String(prop);
      const fn = Reflect.get(target, prop, receiver);
      return instrumentKVFn(fn, name, operation);
    }, "get")
  };
  return wrap(kv, kvHandler);
}
__name(instrumentKV, "instrumentKV");
function instrumentServiceBinding(fetcher, envName) {
  const fetcherHandler = {
    get(target, prop) {
      if (prop === "fetch") {
        const fetcher2 = Reflect.get(target, prop);
        const attrs = {
          name: `Service Binding ${envName}`
        };
        return instrumentClientFetch(fetcher2, () => ({ includeTraceContext: true }), attrs);
      } else {
        return passthroughGet(target, prop);
      }
    }
  };
  return wrap(fetcher, fetcherHandler);
}
__name(instrumentServiceBinding, "instrumentServiceBinding");
var dbSystem2 = "Cloudflare D1";
function metaAttributes(meta) {
  return {
    "db.cf.d1.rows_read": meta.rows_read,
    "db.cf.d1.rows_written": meta.rows_written,
    "db.cf.d1.duration": meta.duration,
    "db.cf.d1.size_after": meta.size_after,
    "db.cf.d1.last_row_id": meta.last_row_id,
    "db.cf.d1.changed_db": meta.changed_db,
    "db.cf.d1.changes": meta.changes
  };
}
__name(metaAttributes, "metaAttributes");
function spanOptions(dbName, operation, sql) {
  const attributes = {
    binding_type: "D1",
    [import_semantic_conventions3.SemanticAttributes.DB_NAME]: dbName,
    [import_semantic_conventions3.SemanticAttributes.DB_SYSTEM]: dbSystem2,
    [import_semantic_conventions3.SemanticAttributes.DB_OPERATION]: operation
  };
  if (sql) {
    attributes[import_semantic_conventions3.SemanticAttributes.DB_STATEMENT] = sql;
  }
  return {
    kind: import_api19.SpanKind.CLIENT,
    attributes
  };
}
__name(spanOptions, "spanOptions");
function instrumentD1StatementFn(fn, dbName, operation, sql) {
  const tracer2 = import_api19.trace.getTracer("D1");
  const fnHandler = {
    apply: /* @__PURE__ */ __name((target, thisArg, argArray) => {
      if (operation === "bind") {
        const newStmt = Reflect.apply(target, thisArg, argArray);
        return instrumentD1PreparedStatement(newStmt, dbName, sql);
      }
      const options = spanOptions(dbName, operation, sql);
      return tracer2.startActiveSpan(`${dbName} ${operation}`, options, async (span) => {
        try {
          const result = await Reflect.apply(target, thisArg, argArray);
          if (operation === "all" || operation === "run") {
            span.setAttributes(metaAttributes(result.meta));
          }
          span.setStatus({ code: import_api19.SpanStatusCode.OK });
          return result;
        } catch (error3) {
          span.recordException(error3);
          span.setStatus({ code: import_api19.SpanStatusCode.ERROR });
          throw error3;
        } finally {
          span.end();
        }
      });
    }, "apply")
  };
  return wrap(fn, fnHandler);
}
__name(instrumentD1StatementFn, "instrumentD1StatementFn");
function instrumentD1PreparedStatement(stmt, dbName, statement) {
  const statementHandler = {
    get: /* @__PURE__ */ __name((target, prop, receiver) => {
      const operation = String(prop);
      const fn = Reflect.get(target, prop, receiver);
      if (typeof fn === "function") {
        return instrumentD1StatementFn(fn, dbName, operation, statement);
      }
      return fn;
    }, "get")
  };
  return wrap(stmt, statementHandler);
}
__name(instrumentD1PreparedStatement, "instrumentD1PreparedStatement");
function instrumentD1Fn(fn, dbName, operation) {
  const tracer2 = import_api19.trace.getTracer("D1");
  const fnHandler = {
    apply: /* @__PURE__ */ __name((target, thisArg, argArray) => {
      if (operation === "prepare") {
        const sql = argArray[0];
        const stmt = Reflect.apply(target, thisArg, argArray);
        return instrumentD1PreparedStatement(stmt, dbName, sql);
      } else if (operation === "exec") {
        const sql = argArray[0];
        const options = spanOptions(dbName, operation, sql);
        return tracer2.startActiveSpan(`${dbName} ${operation}`, options, async (span) => {
          try {
            const result = await Reflect.apply(target, thisArg, argArray);
            span.setStatus({ code: import_api19.SpanStatusCode.OK });
            return result;
          } catch (error3) {
            span.recordException(error3);
            span.setStatus({ code: import_api19.SpanStatusCode.ERROR });
            throw error3;
          } finally {
            span.end();
          }
        });
      } else if (operation === "batch") {
        const statements = argArray[0];
        return tracer2.startActiveSpan(`${dbName} ${operation}`, async (span) => {
          const subSpans = statements.map(
            (s) => tracer2.startSpan(`${dbName} ${operation} > query`, spanOptions(dbName, operation, s.statement))
          );
          try {
            const result = await Reflect.apply(target, thisArg, argArray);
            result.forEach((r, i) => subSpans[i]?.setAttributes(metaAttributes(r.meta)));
            span.setStatus({ code: import_api19.SpanStatusCode.OK });
            return result;
          } catch (error3) {
            span.recordException(error3);
            span.setStatus({ code: import_api19.SpanStatusCode.ERROR });
            throw error3;
          } finally {
            subSpans.forEach((s) => s.end());
            span.end();
          }
        });
      } else {
        return Reflect.apply(target, thisArg, argArray);
      }
    }, "apply")
  };
  return wrap(fn, fnHandler);
}
__name(instrumentD1Fn, "instrumentD1Fn");
function instrumentD1(database, dbName) {
  const dbHandler = {
    get: /* @__PURE__ */ __name((target, prop, receiver) => {
      const operation = String(prop);
      const fn = Reflect.get(target, prop, receiver);
      if (typeof fn === "function") {
        return instrumentD1Fn(fn, dbName, operation);
      }
      return fn;
    }, "get")
  };
  return wrap(database, dbHandler);
}
__name(instrumentD1, "instrumentD1");
var dbSystem3 = "Cloudflare Analytics Engine";
var AEAttributes = {
  writeDataPoint(argArray) {
    const attrs = {};
    const opts = argArray[0];
    if (typeof opts === "object") {
      attrs["db.cf.ae.indexes"] = opts.indexes.length;
      attrs["db.cf.ae.index"] = opts.indexes[0].toString();
      attrs["db.cf.ae.doubles"] = opts.doubles.length;
      attrs["db.cf.ae.blobs"] = opts.blobs.length;
    }
    return attrs;
  }
};
function instrumentAEFn(fn, name, operation) {
  const tracer2 = import_api20.trace.getTracer("AnalyticsEngine");
  const fnHandler = {
    apply: /* @__PURE__ */ __name((target, thisArg, argArray) => {
      const attributes = {
        binding_type: "AnalyticsEngine",
        [import_semantic_conventions4.SemanticAttributes.DB_NAME]: name,
        [import_semantic_conventions4.SemanticAttributes.DB_SYSTEM]: dbSystem3,
        [import_semantic_conventions4.SemanticAttributes.DB_OPERATION]: operation
      };
      const options = {
        kind: import_api20.SpanKind.CLIENT,
        attributes
      };
      return tracer2.startActiveSpan(`Analytics Engine ${name} ${operation}`, options, async (span) => {
        const result = await Reflect.apply(target, thisArg, argArray);
        const extraAttrsFn = AEAttributes[operation];
        const extraAttrs = extraAttrsFn ? extraAttrsFn(argArray, result) : {};
        span.setAttributes(extraAttrs);
        span.setAttribute(import_semantic_conventions4.SemanticAttributes.DB_STATEMENT, `${operation} ${argArray[0]}`);
        span.end();
        return result;
      });
    }, "apply")
  };
  return wrap(fn, fnHandler);
}
__name(instrumentAEFn, "instrumentAEFn");
function instrumentAnalyticsEngineDataset(dataset, name) {
  const datasetHandler = {
    get: /* @__PURE__ */ __name((target, prop, receiver) => {
      const operation = String(prop);
      const fn = Reflect.get(target, prop, receiver);
      return instrumentAEFn(fn, name, operation);
    }, "get")
  };
  return wrap(dataset, datasetHandler);
}
__name(instrumentAnalyticsEngineDataset, "instrumentAnalyticsEngineDataset");
var isJSRPC = /* @__PURE__ */ __name((item) => {
  return !!item?.["__some_property_that_will_never_exist" + Math.random()];
}, "isJSRPC");
var isKVNamespace = /* @__PURE__ */ __name((item) => {
  return !isJSRPC(item) && !!item?.getWithMetadata;
}, "isKVNamespace");
var isQueue = /* @__PURE__ */ __name((item) => {
  return !isJSRPC(item) && !!item?.sendBatch;
}, "isQueue");
var isDurableObject = /* @__PURE__ */ __name((item) => {
  return !isJSRPC(item) && !!item?.idFromName;
}, "isDurableObject");
var isVersionMetadata = /* @__PURE__ */ __name((item) => {
  return !isJSRPC(item) && typeof item?.id === "string" && typeof item?.tag === "string";
}, "isVersionMetadata");
var isAnalyticsEngineDataset = /* @__PURE__ */ __name((item) => {
  return !isJSRPC(item) && !!item?.writeDataPoint;
}, "isAnalyticsEngineDataset");
var isD1Database = /* @__PURE__ */ __name((item) => {
  return !!item?.exec && !!item?.prepare;
}, "isD1Database");
var instrumentEnv = /* @__PURE__ */ __name((env2) => {
  const envHandler = {
    get: /* @__PURE__ */ __name((target, prop, receiver) => {
      const item = Reflect.get(target, prop, receiver);
      if (!isProxyable(item)) {
        return item;
      }
      if (isJSRPC(item)) {
        return instrumentServiceBinding(item, String(prop));
      } else if (isKVNamespace(item)) {
        return instrumentKV(item, String(prop));
      } else if (isQueue(item)) {
        return instrumentQueueSender(item, String(prop));
      } else if (isDurableObject(item)) {
        return instrumentDOBinding(item, String(prop));
      } else if (isVersionMetadata(item)) {
        return item;
      } else if (isAnalyticsEngineDataset(item)) {
        return instrumentAnalyticsEngineDataset(item, String(prop));
      } else if (isD1Database(item)) {
        return instrumentD1(item, String(prop));
      } else {
        return item;
      }
    }, "get")
  };
  return wrap(env2, envHandler);
}, "instrumentEnv");
function instrumentBindingStub(stub, nsName) {
  const stubHandler = {
    get(target, prop, receiver) {
      if (prop === "fetch") {
        const fetcher = Reflect.get(target, prop);
        const attrs = {
          name: `Durable Object ${nsName}`,
          "do.namespace": nsName,
          "do.id": target.id.toString(),
          "do.id.name": target.id.name
        };
        return instrumentClientFetch(fetcher, () => ({ includeTraceContext: true }), attrs);
      } else {
        return passthroughGet(target, prop, receiver);
      }
    }
  };
  return wrap(stub, stubHandler);
}
__name(instrumentBindingStub, "instrumentBindingStub");
function instrumentBindingGet(getFn, nsName) {
  const getHandler = {
    apply(target, thisArg, argArray) {
      const stub = Reflect.apply(target, thisArg, argArray);
      return instrumentBindingStub(stub, nsName);
    }
  };
  return wrap(getFn, getHandler);
}
__name(instrumentBindingGet, "instrumentBindingGet");
function instrumentDOBinding(ns, nsName) {
  const nsHandler = {
    get(target, prop, receiver) {
      if (prop === "get") {
        const fn = Reflect.get(ns, prop, receiver);
        return instrumentBindingGet(fn, nsName);
      } else {
        return passthroughGet(target, prop, receiver);
      }
    }
  };
  return wrap(ns, nsHandler);
}
__name(instrumentDOBinding, "instrumentDOBinding");
var scheduledInstrumentation = {
  getInitialSpanInfo: /* @__PURE__ */ __name(function(controller) {
    return {
      name: `scheduledHandler ${controller.cron}`,
      options: {
        attributes: {
          [import_incubating2.ATTR_FAAS_TRIGGER]: import_incubating2.FAAS_TRIGGER_VALUE_TIMER,
          [import_incubating2.ATTR_FAAS_CRON]: controller.cron,
          [import_incubating2.ATTR_FAAS_TIME]: new Date(controller.scheduledTime).toISOString()
        },
        kind: import_api21.SpanKind.INTERNAL
      }
    };
  }, "getInitialSpanInfo")
};
function versionAttributes(env2) {
  const attributes = {};
  if (typeof env2 === "object" && env2 !== null) {
    for (const [binding2, data] of Object.entries(env2)) {
      if (isVersionMetadata(data)) {
        attributes["cf.workers_version_metadata.binding"] = binding2;
        attributes["cf.workers_version_metadata.id"] = data.id;
        attributes["cf.workers_version_metadata.tag"] = data.tag;
        break;
      }
    }
  }
  return attributes;
}
__name(versionAttributes, "versionAttributes");
var PromiseTracker = class {
  static {
    __name(this, "PromiseTracker");
  }
  _outstandingPromises = [];
  get outstandingPromiseCount() {
    return this._outstandingPromises.length;
  }
  track(promise) {
    this._outstandingPromises.push(promise);
  }
  async wait() {
    await allSettledMutable(this._outstandingPromises);
  }
};
function createWaitUntil(fn, context32, tracker) {
  const handler = {
    apply(target, _thisArg, argArray) {
      tracker.track(argArray[0]);
      return Reflect.apply(target, context32, argArray);
    }
  };
  return wrap(fn, handler);
}
__name(createWaitUntil, "createWaitUntil");
function proxyExecutionContext(context32) {
  const tracker = new PromiseTracker();
  const ctx = new Proxy(context32, {
    get(target, prop) {
      if (prop === "waitUntil") {
        const fn = Reflect.get(target, prop);
        return createWaitUntil(fn, context32, tracker);
      } else {
        return passthroughGet(target, prop);
      }
    }
  });
  return { ctx, tracker };
}
__name(proxyExecutionContext, "proxyExecutionContext");
async function allSettledMutable(promises) {
  let values;
  do {
    values = await Promise.allSettled(promises);
  } while (values.length !== promises.length);
  return values;
}
__name(allSettledMutable, "allSettledMutable");
function headerAttributes(message) {
  return Object.fromEntries([...message.headers].map(([key, value]) => [`email.header.${key}`, value]));
}
__name(headerAttributes, "headerAttributes");
var emailInstrumentation = {
  getInitialSpanInfo: /* @__PURE__ */ __name((message) => {
    const attributes = {
      [import_incubating3.ATTR_FAAS_TRIGGER]: "other",
      [import_incubating3.ATTR_RPC_MESSAGE_ID]: message.headers.get("Message-Id") ?? void 0,
      [import_incubating3.ATTR_MESSAGING_DESTINATION_NAME]: message.to
    };
    Object.assign(attributes, headerAttributes(message));
    const options = {
      attributes,
      kind: import_api22.SpanKind.CONSUMER
    };
    return {
      name: `emailHandler ${message.to}`,
      options
    };
  }, "getInitialSpanInfo")
};
var createResource2 = /* @__PURE__ */ __name((config2) => {
  const workerResourceAttrs = {
    "cloud.provider": "cloudflare",
    "cloud.platform": "cloudflare.workers",
    "cloud.region": "earth",
    "faas.max_memory": 134217728,
    "telemetry.sdk.language": "js",
    "telemetry.sdk.name": "@microlabs/otel-cf-workers",
    "telemetry.sdk.version": _microlabs_otel_cf_workers,
    "telemetry.sdk.build.node_version": node
  };
  const serviceResource = resourceFromAttributes({
    "service.name": config2.service.name,
    "service.namespace": config2.service.namespace,
    "service.version": config2.service.version
  });
  const resource = resourceFromAttributes(workerResourceAttrs);
  return resource.merge(serviceResource);
}, "createResource");
var initialised = false;
function init(config2) {
  if (!initialised) {
    if (config2.instrumentation.instrumentGlobalCache) {
      instrumentGlobalCache();
    }
    if (config2.instrumentation.instrumentGlobalFetch) {
      instrumentGlobalFetch();
    }
    import_api9.propagation.setGlobalPropagator(config2.propagator);
    const resource = createResource2(config2);
    const provider = new WorkerTracerProvider(config2.spanProcessors, resource);
    provider.register();
    initialised = true;
  }
}
__name(init, "init");
function createInitialiser(config2) {
  if (typeof config2 === "function") {
    return (env2, trigger) => {
      const conf = parseConfig(config2(env2, trigger));
      init(conf);
      return conf;
    };
  } else {
    return () => {
      const conf = parseConfig(config2);
      init(conf);
      return conf;
    };
  }
}
__name(createInitialiser, "createInitialiser");
async function exportSpans(traceId, tracker) {
  const tracer2 = import_api9.trace.getTracer("export");
  if (tracer2 instanceof WorkerTracer) {
    await scheduler.wait(1);
    await tracker?.wait();
    await tracer2.forceFlush(traceId);
  } else {
    console.error("The global tracer is not of type WorkerTracer and can not export spans");
  }
}
__name(exportSpans, "exportSpans");
var cold_start2 = true;
function createHandlerFlowFn(instrumentation) {
  return (handlerFn, args) => {
    const [trigger, env2, context32] = args;
    const proxiedEnv = instrumentEnv(env2);
    const { ctx: proxiedCtx, tracker } = proxyExecutionContext(context32);
    const instrumentedTrigger = instrumentation.instrumentTrigger ? instrumentation.instrumentTrigger(trigger) : trigger;
    const tracer2 = import_api9.trace.getTracer("handler");
    const { name, options, context: spanContext } = instrumentation.getInitialSpanInfo(trigger);
    const attrs = options.attributes || {};
    attrs["faas.coldstart"] = cold_start2;
    options.attributes = attrs;
    Object.assign(attrs, versionAttributes(env2));
    cold_start2 = false;
    const parentContext = spanContext || import_api9.context.active();
    const result = tracer2.startActiveSpan(name, options, parentContext, async (span) => {
      try {
        const result2 = await handlerFn(instrumentedTrigger, proxiedEnv, proxiedCtx);
        if (instrumentation.getAttributesFromResult) {
          const attributes = instrumentation.getAttributesFromResult(result2);
          span.setAttributes(attributes);
        }
        if (instrumentation.executionSucces) {
          instrumentation.executionSucces(span, trigger, result2);
        }
        return result2;
      } catch (error3) {
        span.recordException(error3);
        span.setStatus({ code: import_api9.SpanStatusCode.ERROR });
        if (instrumentation.executionFailed) {
          instrumentation.executionFailed(span, trigger, error3);
        }
        throw error3;
      } finally {
        span.end();
        context32.waitUntil(exportSpans(span.spanContext().traceId, tracker));
      }
    });
    return result;
  };
}
__name(createHandlerFlowFn, "createHandlerFlowFn");
function createHandlerProxy(handler, handlerFn, initialiser, instrumentation) {
  return (trigger, env2, ctx) => {
    const config2 = initialiser(env2, trigger);
    const context32 = setConfig(config2);
    const flowFn = createHandlerFlowFn(instrumentation);
    return import_api9.context.with(context32, flowFn, handler, handlerFn, [trigger, env2, ctx]);
  };
}
__name(createHandlerProxy, "createHandlerProxy");
function instrument(handler, config2) {
  const initialiser = createInitialiser(config2);
  if (handler.fetch) {
    const fetcher = unwrap(handler.fetch);
    handler.fetch = createHandlerProxy(handler, fetcher, initialiser, fetchInstrumentation);
  }
  if (handler.scheduled) {
    const scheduler2 = unwrap(handler.scheduled);
    handler.scheduled = createHandlerProxy(handler, scheduler2, initialiser, scheduledInstrumentation);
  }
  if (handler.queue) {
    const queuer = unwrap(handler.queue);
    handler.queue = createHandlerProxy(handler, queuer, initialiser, new QueueInstrumentation());
  }
  if (handler.email) {
    const emailer = unwrap(handler.email);
    handler.email = createHandlerProxy(handler, emailer, initialiser, emailInstrumentation);
  }
  return handler;
}
__name(instrument, "instrument");
var __unwrappedFetch = unwrap(fetch);

// src/utils/tracing.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function resolveConfig(env2 = {}) {
  const SERVICE_NAME = env2.SERVICE_NAME || "Catalog_Worker_Service";
  const API_KEY = env2.HONEYCOMB_API_KEY || env2.HONEYCOMB_API_KEY_SECRET || "";
  const DATASET = env2.HONEYCOMB_DATASET || "workers-traces";
  const SAMPLE_RATE = 10;
  return {
    // exporter shape expected by the library
    exporter: {
      url: "https://api.honeycomb.io/v1/traces",
      headers: {
        "x-honeycomb-team": API_KEY,
        "x-honeycomb-dataset": DATASET
      }
    },
    // <-- **this** is the important part the library expects
    service: {
      name: SERVICE_NAME
    },
    includeTraceContext: true,
    // add custom sampling + resource attributes
    sampling: {
      type: "probabilistic",
      probability: 0.1
    }
    // optional: sane defaults for library (you can add more)
    // sampling: { /* ... */ },
    // resourceAttributes: { env: env.ENVIRONMENT || 'dev' },
  };
}
__name(resolveConfig, "resolveConfig");

// src/routers/catalog.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/itty-router/dist/itty-router.min.mjs
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function e({ base: t = "", routes: n = [] } = {}) {
  return { __proto__: new Proxy({}, { get: /* @__PURE__ */ __name((e2, a, o) => (e3, ...r) => n.push([a.toUpperCase(), RegExp(`^${(t + e3).replace(/(\/?)\*/g, "($1.*)?").replace(/(\/$)|((?<=\/)\/)/, "").replace(/:(\w+)(\?)?(\.)?/g, "$2(?<$1>[^/]+)$2$3").replace(/\.(?=[\w(])/, "\\.").replace(/\)\.\?\(([^\[]+)\[\^/g, "?)\\.?($1(?<=\\.)[^\\.")}/*$`), r]) && o, "get") }), routes: n, async handle(e2, ...r) {
    let a, o, t2 = new URL(e2.url);
    e2.query = Object.fromEntries(t2.searchParams);
    for (var [p, s, u] of n) if ((p === e2.method || "ALL" === p) && (o = t2.pathname.match(s))) {
      e2.params = o.groups;
      for (var c of u) if (void 0 !== (a = await c(e2.proxy || e2, ...r))) return a;
    }
  } };
}
__name(e, "e");

// src/handlers/catalogHandlers.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/services/catalogService.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/uuid/dist/esm-browser/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/uuid/dist/esm-browser/rng.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
  }
  return getRandomValues(rnds8);
}
__name(rng, "rng");

// node_modules/uuid/dist/esm-browser/stringify.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}
__name(unsafeStringify, "unsafeStringify");

// node_modules/uuid/dist/esm-browser/v4.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/uuid/dist/esm-browser/native.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native_default = {
  randomUUID
};

// node_modules/uuid/dist/esm-browser/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
__name(v4, "v4");
var v4_default = v4;

// src/db/db1.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/utils/logger.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var import_api23 = __toESM(require_src(), 1);
var spanLogs = /* @__PURE__ */ new WeakMap();
function addLogToSpan(span, logData) {
  if (!span) return;
  let logs = spanLogs.get(span);
  if (!logs) {
    logs = [];
    spanLogs.set(span, logs);
  }
  logs.push(logData);
  const logsJson = JSON.stringify(logs);
  span.setAttribute("log", logsJson);
  if (logData.level) span.setAttribute("log.level", logData.level);
  if (logData.message) span.setAttribute("log.message", logData.message);
  if (logData.event) span.setAttribute("log.event", logData.event);
  span.addEvent(logData.event || logData.message || "log", {
    ...logData,
    timestamp: Date.now()
  });
}
__name(addLogToSpan, "addLogToSpan");
function logger(event, meta = {}) {
  const span = import_api23.trace.getSpan(import_api23.context.active());
  const safeMeta = { ...meta };
  if (safeMeta.email) safeMeta.email = redactEmail(safeMeta.email);
  delete safeMeta.password;
  delete safeMeta.refreshToken;
  delete safeMeta.accessToken;
  delete safeMeta.pwd_hash;
  delete safeMeta.pwd_salt;
  const logData = {
    ts: (/* @__PURE__ */ new Date()).toISOString(),
    event,
    level: "info",
    ...safeMeta
    // trace_id: traceId,
    // span_id: spanId,
  };
  addLogToSpan(span, logData);
  console.log("[utils/logger]", JSON.stringify(logData));
}
__name(logger, "logger");
function logError(message, error3 = null, meta = {}) {
  const span = import_api23.trace.getSpan(import_api23.context.active());
  const errorData = {
    ts: (/* @__PURE__ */ new Date()).toISOString(),
    level: "error",
    message,
    error: error3 ? {
      message: error3.message,
      stack: error3.stack,
      name: error3.name
    } : null,
    ...meta
    // trace_id: traceId,
    // span_id: spanId,
  };
  addLogToSpan(span, errorData);
  if (span && error3) {
    span.recordException(error3);
    span.setStatus({ code: 2, message });
  } else if (span) {
    span.setStatus({ code: 2, message });
  }
}
__name(logError, "logError");
function redactEmail(e2) {
  try {
    const [local, domain2] = e2.split("@");
    if (!local || !domain2) return "redacted";
    const visible = local.slice(0, Math.min(2, local.length));
    return `${visible}***@${domain2}`;
  } catch {
    return "redacted";
  }
}
__name(redactEmail, "redactEmail");

// src/db/db1.js
async function getProductById(productId, env2) {
  try {
    const res = await env2.CATALOG_DB.prepare("SELECT * FROM products WHERE product_id = ? AND deleted = 0").bind(productId).first();
    return res || null;
  } catch (err) {
    logError("getProductById: Database error", err, { productId });
    throw err;
  }
}
__name(getProductById, "getProductById");
async function getProducts({ category, search, page = 1, limit = 20, featured, status = "active" }, env2) {
  try {
    let sql = "SELECT * FROM products WHERE deleted = 0";
    const bindings = [];
    if (status) {
      sql += " AND status = ?";
      bindings.push(status);
    }
    if (category) {
      sql += " AND (category = ? OR categories LIKE ?)";
      bindings.push(category, `%${category}%`);
    }
    if (featured !== void 0) {
      sql += " AND featured = ?";
      bindings.push(featured ? 1 : 0);
    }
    if (search) {
      sql += " AND (title LIKE ? OR description LIKE ? OR brand LIKE ?)";
      const searchTerm = `%${search}%`;
      bindings.push(searchTerm, searchTerm, searchTerm);
    }
    sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    bindings.push(limit, (page - 1) * limit);
    const res = await env2.CATALOG_DB.prepare(sql).bind(...bindings).all();
    return res?.results || [];
  } catch (err) {
    logError("getProducts: Database error", err, { category, search, page, limit });
    throw err;
  }
}
__name(getProducts, "getProducts");
async function getProductsByCategory(category, limit = 10, env2) {
  try {
    const res = await env2.CATALOG_DB.prepare(
      "SELECT * FROM products WHERE deleted = 0 AND status = ? AND (category = ? OR categories LIKE ?) ORDER BY featured DESC, created_at DESC LIMIT ?"
    ).bind("active", category, `%${category}%`, limit).all();
    return res?.results || [];
  } catch (err) {
    logError("getProductsByCategory: Database error", err, { category, limit });
    throw err;
  }
}
__name(getProductsByCategory, "getProductsByCategory");
async function searchProducts(keyword, { page = 1, limit = 20, category }, env2) {
  try {
    let sql = "SELECT * FROM products WHERE deleted = 0 AND status = ? AND (title LIKE ? OR description LIKE ? OR brand LIKE ? OR tags LIKE ?)";
    const bindings = ["active"];
    const searchTerm = `%${keyword}%`;
    bindings.push(searchTerm, searchTerm, searchTerm, searchTerm);
    if (category) {
      sql += " AND (category = ? OR categories LIKE ?)";
      bindings.push(category, `%${category}%`);
    }
    sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    bindings.push(limit, (page - 1) * limit);
    const res = await env2.CATALOG_DB.prepare(sql).bind(...bindings).all();
    return res?.results || [];
  } catch (err) {
    logError("searchProducts: Database error", err, { keyword, page, limit });
    throw err;
  }
}
__name(searchProducts, "searchProducts");
async function createProduct(product, env2) {
  try {
    const fields = Object.keys(product);
    const placeholders = fields.map(() => "?").join(", ");
    const values = fields.map((field) => product[field]);
    const sql = `INSERT INTO products (${fields.join(", ")}) VALUES (${placeholders})`;
    await env2.CATALOG_DB.prepare(sql).bind(...values).run();
    logger("product.created", { productId: product.product_id, title: product.title });
    return product;
  } catch (err) {
    logError("createProduct: Database error", err, { productId: product.product_id });
    throw err;
  }
}
__name(createProduct, "createProduct");
async function updateProduct(productId, updates, env2) {
  try {
    const fields = Object.keys(updates);
    if (fields.length === 0) return null;
    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => updates[field]);
    const sql = `UPDATE products SET ${setClause}, updated_at = ? WHERE product_id = ? AND deleted = 0`;
    values.push((/* @__PURE__ */ new Date()).toISOString());
    values.push(productId);
    await env2.CATALOG_DB.prepare(sql).bind(...values).run();
    logger("product.updated", { productId });
    return await getProductById(productId, env2);
  } catch (err) {
    logError("updateProduct: Database error", err, { productId });
    throw err;
  }
}
__name(updateProduct, "updateProduct");
async function deleteProduct(productId, env2) {
  try {
    await env2.CATALOG_DB.prepare("UPDATE products SET deleted = 1, deleted_at = ? WHERE product_id = ?").bind((/* @__PURE__ */ new Date()).toISOString(), productId).run();
    logger("product.deleted", { productId });
    return true;
  } catch (err) {
    logError("deleteProduct: Database error", err, { productId });
    throw err;
  }
}
__name(deleteProduct, "deleteProduct");
async function getProductSkus(productId, env2) {
  try {
    const res = await env2.CATALOG_DB.prepare("SELECT * FROM skus WHERE product_id = ?").bind(productId).all();
    return res?.results || [];
  } catch (err) {
    logError("getProductSkus: Database error", err, { productId });
    throw err;
  }
}
__name(getProductSkus, "getProductSkus");
async function createSku(sku, env2) {
  try {
    const sql = `INSERT INTO skus (sku_id, product_id, sku_code, attributes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`;
    await env2.CATALOG_DB.prepare(sql).bind(
      sku.sku_id,
      sku.product_id,
      sku.sku_code,
      typeof sku.attributes === "string" ? sku.attributes : JSON.stringify(sku.attributes || {}),
      sku.created_at || (/* @__PURE__ */ new Date()).toISOString(),
      sku.updated_at || (/* @__PURE__ */ new Date()).toISOString()
    ).run();
    logger("sku.created", { skuId: sku.sku_id, productId: sku.product_id });
    return sku;
  } catch (err) {
    logError("createSku: Database error", err, { skuId: sku.sku_id });
    throw err;
  }
}
__name(createSku, "createSku");
async function deleteSku(skuId, env2) {
  try {
    await env2.CATALOG_DB.prepare("DELETE FROM skus WHERE sku_id = ?").bind(skuId).run();
    logger("sku.deleted", { skuId });
    return true;
  } catch (err) {
    logError("deleteSku: Database error", err, { skuId });
    throw err;
  }
}
__name(deleteSku, "deleteSku");

// config.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var CACHE_TTL_SECONDS = 3600;
var PRODUCTS_PER_PAGE = 20;
var MAX_PRODUCTS_PER_PAGE = 100;

// src/services/catalogService.js
async function getProduct(productId, env2) {
  try {
    const cacheKey = `product:${productId}`;
    const cached = await env2.CATALOG_KV?.get(cacheKey, "json");
    if (cached) {
      logger("product.cache.hit", { productId });
      return cached;
    }
    const product = await getProductById(productId, env2);
    if (!product) {
      return null;
    }
    const skus = await getProductSkus(productId, env2);
    const parsedProduct = parseProductJsonFields(product);
    parsedProduct.skus = skus.map((sku) => ({
      ...sku,
      attributes: typeof sku.attributes === "string" ? JSON.parse(sku.attributes || "{}") : sku.attributes
    }));
    if (env2.CATALOG_KV) {
      await env2.CATALOG_KV.put(cacheKey, JSON.stringify(parsedProduct), {
        expirationTtl: CACHE_TTL_SECONDS
      });
    }
    logger("product.fetched", { productId });
    return parsedProduct;
  } catch (err) {
    logError("getProduct: Error", err, { productId });
    throw err;
  }
}
__name(getProduct, "getProduct");
async function listProducts(query, env2) {
  try {
    const { q, category, page = 1, limit = 20, featured, status = "active" } = query;
    let products;
    if (q) {
      products = await searchProducts(q, { page, limit, category }, env2);
    } else {
      products = await getProducts({ category, page, limit, featured, status }, env2);
    }
    const parsedProducts = products.map(parseProductJsonFields);
    logger("products.listed", { count: parsedProducts.length, page, limit });
    return parsedProducts;
  } catch (err) {
    logError("listProducts: Error", err, { query });
    throw err;
  }
}
__name(listProducts, "listProducts");
async function getHomePageProducts(categories = ["Electronics", "Toys", "Dress"], limit = 10, env2) {
  try {
    const result = {};
    for (const category of categories) {
      const products = await getProductsByCategory(category, limit, env2);
      result[category] = products.map(parseProductJsonFields);
    }
    logger("homepage.products.fetched", { categories: Object.keys(result) });
    return result;
  } catch (err) {
    logError("getHomePageProducts: Error", err, { categories });
    throw err;
  }
}
__name(getHomePageProducts, "getHomePageProducts");
async function createProductService(productData, userId, env2) {
  try {
    const productId = productData.product_id || v4_default();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const product = {
      ...productData,
      product_id: productId,
      created_at: now,
      updated_at: now,
      created_by: userId,
      updated_by: userId
    };
    const preparedProduct = prepareProductJsonFields(product);
    await createProduct(preparedProduct, env2);
    if (productData.skus && Array.isArray(productData.skus)) {
      for (const skuData of productData.skus) {
        await createSkuService({
          ...skuData,
          product_id: productId
        }, userId, env2);
      }
    }
    await invalidateProductCache(productId, env2);
    logger("product.created", { productId, title: product.title });
    return await getProduct(productId, env2);
  } catch (err) {
    logError("createProductService: Error", err, { productData });
    throw err;
  }
}
__name(createProductService, "createProductService");
async function updateProductService(productId, updates, userId, env2) {
  try {
    const preparedUpdates = prepareProductJsonFields({
      ...updates,
      updated_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_by: userId
    });
    await updateProduct(productId, preparedUpdates, env2);
    if (updates.skus && Array.isArray(updates.skus)) {
      const existingSkus = await getProductSkus(productId, env2);
      for (const sku of existingSkus) {
        await deleteSku(sku.sku_id, env2);
      }
      for (const skuData of updates.skus) {
        await createSkuService({
          ...skuData,
          product_id: productId
        }, userId, env2);
      }
    }
    await invalidateProductCache(productId, env2);
    logger("product.updated", { productId });
    return await getProduct(productId, env2);
  } catch (err) {
    logError("updateProductService: Error", err, { productId, updates });
    throw err;
  }
}
__name(updateProductService, "updateProductService");
async function deleteProductService(productId, env2) {
  try {
    await deleteProduct(productId, env2);
    await invalidateProductCache(productId, env2);
    logger("product.deleted", { productId });
    return true;
  } catch (err) {
    logError("deleteProductService: Error", err, { productId });
    throw err;
  }
}
__name(deleteProductService, "deleteProductService");
async function getProductImageUrl(productId, imageId, env2) {
  try {
    if (!env2.CATALOG_IMG_BUCKET) {
      throw new Error("R2 bucket not configured");
    }
    const r2Path = `products/${productId}/${imageId}.jpg`;
    const object = await env2.CATALOG_IMG_BUCKET.head(r2Path);
    if (!object) {
      return null;
    }
    const r2Object = await env2.CATALOG_IMG_BUCKET.get(r2Path);
    if (!r2Object) {
      return null;
    }
    return r2Object;
  } catch (err) {
    logError("getProductImageUrl: Error", err, { productId, imageId });
    return null;
  }
}
__name(getProductImageUrl, "getProductImageUrl");
async function createSkuService(skuData, userId, env2) {
  try {
    const skuId = skuData.sku_id || v4_default();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const sku = {
      sku_id: skuId,
      product_id: skuData.product_id,
      sku_code: skuData.sku_code,
      attributes: skuData.attributes || {},
      created_at: now,
      updated_at: now
    };
    await createSku(sku, env2);
    await invalidateProductCache(skuData.product_id, env2);
    logger("sku.created", { skuId, productId: skuData.product_id });
    return sku;
  } catch (err) {
    logError("createSkuService: Error", err, { skuData });
    throw err;
  }
}
__name(createSkuService, "createSkuService");
function parseProductJsonFields(product) {
  const jsonFields = [
    "categories",
    "tags",
    "colors",
    "sizes",
    "materials",
    "grouped_products",
    "upsell_ids",
    "cross_sell_ids",
    "related_products",
    "product_images",
    "gallery_images",
    "downloadable_files",
    "product_attributes",
    "default_attributes",
    "variations",
    "variation_data",
    "custom_fields",
    "seo_data",
    "social_data",
    "analytics_data",
    "pricing_data",
    "inventory_data",
    "shipping_data",
    "tax_data",
    "discount_data",
    "promotion_data",
    "bundle_data",
    "subscription_data",
    "membership_data",
    "gift_card_data",
    "auction_data",
    "rental_data",
    "booking_data",
    "event_data",
    "course_data",
    "service_data",
    "digital_data",
    "physical_data",
    "variant_data",
    "specifications",
    "features",
    "benefits",
    "use_cases",
    "compatibility",
    "requirements",
    "included_items",
    "accessories",
    "replacement_parts",
    "certifications",
    "awards",
    "testimonials",
    "faq",
    "video_tutorials"
  ];
  const parsed = { ...product };
  for (const field of jsonFields) {
    if (parsed[field] && typeof parsed[field] === "string") {
      try {
        parsed[field] = JSON.parse(parsed[field]);
      } catch (e2) {
      }
    }
  }
  return parsed;
}
__name(parseProductJsonFields, "parseProductJsonFields");
function prepareProductJsonFields(product) {
  const jsonFields = [
    "categories",
    "tags",
    "colors",
    "sizes",
    "materials",
    "grouped_products",
    "upsell_ids",
    "cross_sell_ids",
    "related_products",
    "product_images",
    "gallery_images",
    "downloadable_files",
    "product_attributes",
    "default_attributes",
    "variations",
    "variation_data",
    "custom_fields",
    "seo_data",
    "social_data",
    "analytics_data",
    "pricing_data",
    "inventory_data",
    "shipping_data",
    "tax_data",
    "discount_data",
    "promotion_data",
    "bundle_data",
    "subscription_data",
    "membership_data",
    "gift_card_data",
    "auction_data",
    "rental_data",
    "booking_data",
    "event_data",
    "course_data",
    "service_data",
    "digital_data",
    "physical_data",
    "variant_data",
    "specifications",
    "features",
    "benefits",
    "use_cases",
    "compatibility",
    "requirements",
    "included_items",
    "accessories",
    "replacement_parts",
    "certifications",
    "awards",
    "testimonials",
    "faq",
    "video_tutorials"
  ];
  const prepared = { ...product };
  for (const field of jsonFields) {
    if (prepared[field] !== null && prepared[field] !== void 0) {
      if (typeof prepared[field] === "object") {
        prepared[field] = JSON.stringify(prepared[field]);
      }
    }
  }
  return prepared;
}
__name(prepareProductJsonFields, "prepareProductJsonFields");
async function invalidateProductCache(productId, env2) {
  if (env2.CATALOG_KV) {
    await env2.CATALOG_KV.delete(`product:${productId}`);
  }
}
__name(invalidateProductCache, "invalidateProductCache");

// src/utils/validators.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var import_joi = __toESM(require_joi_browser_min(), 1);
var productSchema = import_joi.default.object({
  product_id: import_joi.default.string().optional(),
  title: import_joi.default.string().min(1).max(500).required(),
  description: import_joi.default.string().max(1e4).allow(null, ""),
  short_description: import_joi.default.string().max(500).allow(null, ""),
  brand: import_joi.default.string().max(200).allow(null, ""),
  manufacturer: import_joi.default.string().max(200).allow(null, ""),
  model_number: import_joi.default.string().max(100).allow(null, ""),
  mpn: import_joi.default.string().max(100).allow(null, ""),
  upc: import_joi.default.string().max(50).allow(null, ""),
  ean: import_joi.default.string().max(50).allow(null, ""),
  isbn: import_joi.default.string().max(50).allow(null, ""),
  gtin: import_joi.default.string().max(50).allow(null, ""),
  sku: import_joi.default.string().max(100).allow(null, ""),
  default_sku: import_joi.default.string().max(100).allow(null, ""),
  category: import_joi.default.string().max(200).allow(null, ""),
  subcategory: import_joi.default.string().max(200).allow(null, ""),
  categories: import_joi.default.alternatives().try(import_joi.default.array(), import_joi.default.string()).allow(null, ""),
  tags: import_joi.default.alternatives().try(import_joi.default.array(), import_joi.default.string()).allow(null, ""),
  status: import_joi.default.string().valid("active", "inactive", "draft", "archived").default("active"),
  visibility: import_joi.default.string().valid("public", "private", "hidden").default("public"),
  featured: import_joi.default.number().integer().valid(0, 1).default(0),
  new_arrival: import_joi.default.number().integer().valid(0, 1).default(0),
  best_seller: import_joi.default.number().integer().valid(0, 1).default(0),
  on_sale: import_joi.default.number().integer().valid(0, 1).default(0),
  weight: import_joi.default.number().allow(null),
  weight_unit: import_joi.default.string().max(10).default("g"),
  length: import_joi.default.number().allow(null),
  width: import_joi.default.number().allow(null),
  height: import_joi.default.number().allow(null),
  dimensions_unit: import_joi.default.string().max(10).default("cm"),
  color: import_joi.default.string().max(100).allow(null, ""),
  colors: import_joi.default.alternatives().try(import_joi.default.array(), import_joi.default.string()).allow(null, ""),
  size: import_joi.default.string().max(50).allow(null, ""),
  sizes: import_joi.default.alternatives().try(import_joi.default.array(), import_joi.default.string()).allow(null, ""),
  material: import_joi.default.string().max(200).allow(null, ""),
  materials: import_joi.default.alternatives().try(import_joi.default.array(), import_joi.default.string()).allow(null, ""),
  pattern: import_joi.default.string().max(100).allow(null, ""),
  style: import_joi.default.string().max(100).allow(null, ""),
  gender: import_joi.default.string().valid("men", "women", "unisex", "kids").allow(null, ""),
  age_group: import_joi.default.string().max(50).allow(null, ""),
  season: import_joi.default.string().valid("spring", "summer", "fall", "winter", "all").allow(null, ""),
  country_of_origin: import_joi.default.string().max(100).allow(null, ""),
  warranty_period: import_joi.default.string().max(100).allow(null, ""),
  warranty_type: import_joi.default.string().max(100).allow(null, ""),
  return_policy: import_joi.default.string().max(1e3).allow(null, ""),
  shipping_weight: import_joi.default.number().allow(null),
  shipping_class: import_joi.default.string().max(100).allow(null, ""),
  package_quantity: import_joi.default.number().integer().default(1),
  min_order_quantity: import_joi.default.number().integer().default(1),
  max_order_quantity: import_joi.default.number().integer().allow(null),
  stock_status: import_joi.default.string().valid("in_stock", "out_of_stock", "backorder", "preorder").allow(null, ""),
  stock_quantity: import_joi.default.number().integer().allow(null),
  low_stock_threshold: import_joi.default.number().integer().allow(null),
  manage_stock: import_joi.default.number().integer().valid(0, 1).default(1),
  allow_backorders: import_joi.default.number().integer().valid(0, 1).default(0),
  backorder_status: import_joi.default.string().max(100).allow(null, ""),
  purchase_note: import_joi.default.string().max(1e3).allow(null, ""),
  meta_title: import_joi.default.string().max(200).allow(null, ""),
  meta_description: import_joi.default.string().max(500).allow(null, ""),
  meta_keywords: import_joi.default.string().max(500).allow(null, ""),
  slug: import_joi.default.string().max(500).allow(null, ""),
  permalink: import_joi.default.string().max(1e3).allow(null, ""),
  canonical_url: import_joi.default.string().uri().allow(null, ""),
  rating_average: import_joi.default.number().min(0).max(5).default(0),
  rating_count: import_joi.default.number().integer().default(0),
  review_count: import_joi.default.number().integer().default(0),
  view_count: import_joi.default.number().integer().default(0),
  sales_count: import_joi.default.number().integer().default(0),
  wishlist_count: import_joi.default.number().integer().default(0),
  compare_count: import_joi.default.number().integer().default(0),
  download_count: import_joi.default.number().integer().default(0),
  virtual_product: import_joi.default.number().integer().valid(0, 1).default(0),
  downloadable_product: import_joi.default.number().integer().valid(0, 1).default(0),
  requires_shipping: import_joi.default.number().integer().valid(0, 1).default(1),
  taxable: import_joi.default.number().integer().valid(0, 1).default(1),
  tax_class: import_joi.default.string().max(100).allow(null, ""),
  tax_status: import_joi.default.string().valid("taxable", "shipping", "none").default("taxable"),
  shipping_required: import_joi.default.number().integer().valid(0, 1).default(1),
  shipping_taxable: import_joi.default.number().integer().valid(0, 1).default(1),
  reviews_allowed: import_joi.default.number().integer().valid(0, 1).default(1),
  average_rating: import_joi.default.number().min(0).max(5).allow(null),
  total_sales: import_joi.default.number().integer().default(0),
  parent_id: import_joi.default.string().allow(null, ""),
  menu_order: import_joi.default.number().integer().default(0),
  purchase_only: import_joi.default.number().integer().valid(0, 1).default(0),
  catalog_visibility: import_joi.default.string().valid("visible", "catalog", "search", "hidden").default("visible"),
  date_on_sale_from: import_joi.default.string().isoDate().allow(null, ""),
  date_on_sale_to: import_joi.default.string().isoDate().allow(null, ""),
  sold_individually: import_joi.default.number().integer().valid(0, 1).default(0),
  product_url: import_joi.default.string().uri().allow(null, ""),
  button_text: import_joi.default.string().max(100).allow(null, ""),
  external_product: import_joi.default.number().integer().valid(0, 1).default(0),
  grouped_products: import_joi.default.alternatives().try(import_joi.default.array(), import_joi.default.string()).allow(null, ""),
  upsell_ids: import_joi.default.alternatives().try(import_joi.default.array(), import_joi.default.string()).allow(null, ""),
  cross_sell_ids: import_joi.default.alternatives().try(import_joi.default.array(), import_joi.default.string()).allow(null, ""),
  related_products: import_joi.default.alternatives().try(import_joi.default.array(), import_joi.default.string()).allow(null, ""),
  product_images: import_joi.default.alternatives().try(import_joi.default.array(), import_joi.default.string()).allow(null, ""),
  image_url: import_joi.default.string().uri().allow(null, ""),
  image_alt: import_joi.default.string().max(500).allow(null, ""),
  gallery_images: import_joi.default.alternatives().try(import_joi.default.array(), import_joi.default.string()).allow(null, ""),
  video_url: import_joi.default.string().uri().allow(null, ""),
  video_embed: import_joi.default.string().max(2e3).allow(null, ""),
  product_type: import_joi.default.string().valid("simple", "variable", "grouped", "external").default("simple"),
  downloadable_files: import_joi.default.alternatives().try(import_joi.default.array(), import_joi.default.string()).allow(null, ""),
  download_limit: import_joi.default.number().integer().allow(null),
  download_expiry: import_joi.default.number().integer().allow(null),
  product_attributes: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  default_attributes: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  variations: import_joi.default.alternatives().try(import_joi.default.array(), import_joi.default.string()).allow(null, ""),
  variation_data: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  custom_fields: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  seo_data: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  social_data: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  analytics_data: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  pricing_data: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  inventory_data: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  shipping_data: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  tax_data: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  discount_data: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  promotion_data: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  bundle_data: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  subscription_data: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  membership_data: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  gift_card_data: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  auction_data: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  rental_data: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  booking_data: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  event_data: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  course_data: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  service_data: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  digital_data: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  physical_data: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  variant_data: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  specifications: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  features: import_joi.default.alternatives().try(import_joi.default.array(), import_joi.default.string()).allow(null, ""),
  benefits: import_joi.default.alternatives().try(import_joi.default.array(), import_joi.default.string()).allow(null, ""),
  use_cases: import_joi.default.alternatives().try(import_joi.default.array(), import_joi.default.string()).allow(null, ""),
  compatibility: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  requirements: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, ""),
  included_items: import_joi.default.alternatives().try(import_joi.default.array(), import_joi.default.string()).allow(null, ""),
  accessories: import_joi.default.alternatives().try(import_joi.default.array(), import_joi.default.string()).allow(null, ""),
  replacement_parts: import_joi.default.alternatives().try(import_joi.default.array(), import_joi.default.string()).allow(null, ""),
  care_instructions: import_joi.default.string().max(2e3).allow(null, ""),
  washing_instructions: import_joi.default.string().max(2e3).allow(null, ""),
  storage_instructions: import_joi.default.string().max(2e3).allow(null, ""),
  safety_warnings: import_joi.default.string().max(2e3).allow(null, ""),
  certifications: import_joi.default.alternatives().try(import_joi.default.array(), import_joi.default.string()).allow(null, ""),
  awards: import_joi.default.alternatives().try(import_joi.default.array(), import_joi.default.string()).allow(null, ""),
  testimonials: import_joi.default.alternatives().try(import_joi.default.array(), import_joi.default.string()).allow(null, ""),
  faq: import_joi.default.alternatives().try(import_joi.default.array(), import_joi.default.string()).allow(null, ""),
  support_url: import_joi.default.string().uri().allow(null, ""),
  documentation_url: import_joi.default.string().uri().allow(null, ""),
  video_tutorials: import_joi.default.alternatives().try(import_joi.default.array(), import_joi.default.string()).allow(null, ""),
  user_manual_url: import_joi.default.string().uri().allow(null, ""),
  installation_guide_url: import_joi.default.string().uri().allow(null, ""),
  created_by: import_joi.default.string().allow(null, ""),
  updated_by: import_joi.default.string().allow(null, "")
});
var skuSchema = import_joi.default.object({
  sku_id: import_joi.default.string().optional(),
  product_id: import_joi.default.string().required(),
  sku_code: import_joi.default.string().required(),
  attributes: import_joi.default.alternatives().try(import_joi.default.object(), import_joi.default.string()).allow(null, "")
});
var productsQuerySchema = import_joi.default.object({
  q: import_joi.default.string().allow(""),
  category: import_joi.default.string().allow(""),
  page: import_joi.default.number().integer().min(1).default(1),
  limit: import_joi.default.number().integer().min(1).max(100).default(20),
  featured: import_joi.default.number().integer().valid(0, 1).allow(""),
  status: import_joi.default.string().valid("active", "inactive", "draft", "archived").allow("")
});
var productUpdateSchema = productSchema;
function validateProduct(data) {
  return productSchema.validate(data, { abortEarly: false, stripUnknown: true });
}
__name(validateProduct, "validateProduct");
function validateProductUpdate(data) {
  const result = productUpdateSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: false
  });
  if (result.error) {
    const filteredErrors = result.error.details.filter((detail) => detail.type !== "any.required");
    if (filteredErrors.length > 0) {
      return {
        error: {
          ...result.error,
          details: filteredErrors
        },
        value: result.value
      };
    }
    return { error: null, value: result.value };
  }
  return result;
}
__name(validateProductUpdate, "validateProductUpdate");
function validateProductsQuery(params) {
  return productsQuerySchema.validate(params, { abortEarly: false, stripUnknown: true });
}
__name(validateProductsQuery, "validateProductsQuery");

// src/handlers/catalogHandlers.js
async function listProducts2(request, env2) {
  try {
    const url = new URL(request.url);
    const queryParams = {
      q: url.searchParams.get("q") || "",
      category: url.searchParams.get("category") || "",
      page: parseInt(url.searchParams.get("page") || "1", 10),
      limit: Math.min(parseInt(url.searchParams.get("limit") || String(PRODUCTS_PER_PAGE), 10), MAX_PRODUCTS_PER_PAGE),
      featured: url.searchParams.get("featured") ? parseInt(url.searchParams.get("featured"), 10) : void 0,
      status: url.searchParams.get("status") || "active"
    };
    const { error: error3, value } = validateProductsQuery(queryParams);
    if (error3) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: "Invalid query parameters",
          details: error3.details
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const products = await listProducts(value, env2);
    return new Response(
      JSON.stringify({
        products: products.map((p) => ({
          product_id: p.product_id,
          title: p.title,
          description: p.description,
          default_sku: p.default_sku,
          images: Array.isArray(p.product_images) ? p.product_images : p.image_url ? [p.image_url] : [],
          categories: Array.isArray(p.categories) ? p.categories : p.category ? [p.category] : []
        })),
        page: value.page,
        limit: value.limit,
        count: products.length
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    logError("listProducts: Handler error", err);
    return new Response(
      JSON.stringify({ error: "internal_error", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
__name(listProducts2, "listProducts");
async function getProduct2(request, env2) {
  try {
    const productId = request.params?.product_id;
    if (!productId) {
      return new Response(
        JSON.stringify({ error: "validation_error", message: "Product ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const product = await getProduct(productId, env2);
    if (!product) {
      return new Response(
        JSON.stringify({ error: "not_found", message: "Product not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify(product),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    logError("getProduct: Handler error", err);
    return new Response(
      JSON.stringify({ error: "internal_error", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
__name(getProduct2, "getProduct");
async function createProduct2(request, env2) {
  try {
    const body = await request.json();
    const { error: error3, value } = validateProduct(body);
    if (error3) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: "Invalid product data",
          details: error3.details
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const userId = request.user?.userId || "system";
    const product = await createProductService(value, userId, env2);
    return new Response(
      JSON.stringify(product),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    logError("createProduct: Handler error", err);
    return new Response(
      JSON.stringify({ error: "internal_error", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
__name(createProduct2, "createProduct");
async function updateProduct2(request, env2) {
  try {
    const productId = request.params?.product_id;
    if (!productId) {
      return new Response(
        JSON.stringify({ error: "validation_error", message: "Product ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const body = await request.json();
    const { error: error3, value } = validateProductUpdate(body);
    if (error3) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: "Invalid product data",
          details: error3.details
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const userId = request.user?.userId || "system";
    const product = await updateProductService(productId, value, userId, env2);
    if (!product) {
      return new Response(
        JSON.stringify({ error: "not_found", message: "Product not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify(product),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    logError("updateProduct: Handler error", err);
    return new Response(
      JSON.stringify({ error: "internal_error", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
__name(updateProduct2, "updateProduct");
async function deleteProduct2(request, env2) {
  try {
    const productId = request.params?.product_id;
    if (!productId) {
      return new Response(
        JSON.stringify({ error: "validation_error", message: "Product ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    await deleteProductService(productId, env2);
    return new Response(
      JSON.stringify({ message: "Product deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    logError("deleteProduct: Handler error", err);
    return new Response(
      JSON.stringify({ error: "internal_error", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
__name(deleteProduct2, "deleteProduct");
async function getProductImage(request, env2) {
  try {
    const productId = request.params?.product_id;
    const imageId = request.params?.image_id;
    if (!productId || !imageId) {
      return new Response(
        JSON.stringify({ error: "validation_error", message: "Product ID and Image ID are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const r2Object = await getProductImageUrl(productId, imageId, env2);
    if (!r2Object) {
      return new Response(
        JSON.stringify({ error: "not_found", message: "Image not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(r2Object.body, {
      headers: {
        "Content-Type": r2Object.httpMetadata?.contentType || "image/jpeg",
        "Cache-Control": "public, max-age=31536000"
      }
    });
  } catch (err) {
    logError("getProductImage: Handler error", err);
    return new Response(
      JSON.stringify({ error: "internal_error", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
__name(getProductImage, "getProductImage");
async function getHomePage(request, env2) {
  try {
    const url = new URL(request.url);
    const categoriesParam = url.searchParams.get("categories");
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const categories = categoriesParam ? categoriesParam.split(",").map((c) => c.trim()) : ["Electronics", "Toys", "Dress", "Books", "Sports"];
    const products = await getHomePageProducts(categories, limit, env2);
    return new Response(
      JSON.stringify(products),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    logError("getHomePage: Handler error", err);
    return new Response(
      JSON.stringify({ error: "internal_error", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
__name(getHomePage, "getHomePage");
async function searchProductsHandler(request, env2) {
  try {
    const url = new URL(request.url);
    const keyword = url.searchParams.get("q");
    const category = url.searchParams.get("category") || "";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = Math.min(parseInt(url.searchParams.get("limit") || String(PRODUCTS_PER_PAGE), 10), MAX_PRODUCTS_PER_PAGE);
    if (!keyword || keyword.trim() === "") {
      return new Response(
        JSON.stringify({ error: "validation_error", message: "Search keyword (q) is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const products = await listProducts({ q: keyword, category, page, limit }, env2);
    return new Response(
      JSON.stringify({
        products: products.map((p) => ({
          product_id: p.product_id,
          title: p.title,
          description: p.description,
          default_sku: p.default_sku,
          images: Array.isArray(p.product_images) ? p.product_images : p.image_url ? [p.image_url] : [],
          categories: Array.isArray(p.categories) ? p.categories : p.category ? [p.category] : []
        })),
        page,
        limit,
        count: products.length,
        keyword
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    logError("searchProductsHandler: Handler error", err);
    return new Response(
      JSON.stringify({ error: "internal_error", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
__name(searchProductsHandler, "searchProductsHandler");

// src/middleware/adminAuth.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/utils/jwt.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function pemToArrayBuffer(pem) {
  const b64 = pem.replace(/-----(BEGIN|END)[\w\s]+-----/g, "").replace(/\s+/g, "");
  const binStr = atob(b64);
  const len = binStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binStr.charCodeAt(i);
  return bytes.buffer;
}
__name(pemToArrayBuffer, "pemToArrayBuffer");
function base64UrlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
}
__name(base64UrlDecode, "base64UrlDecode");
async function verifyJWT(token, env2) {
  try {
    const publicPem = env2.JWT_PUBLIC_KEY;
    if (!publicPem) {
      logError("verifyJWT: PUBLIC key not set in secrets (JWT_PUBLIC_KEY). Cannot verify token.", null, { function: "verifyJWT" });
      return null;
    }
    if (!token || typeof token !== "string") {
      logError("verifyJWT: Invalid token format (not a string)", null, { function: "verifyJWT", hasToken: !!token });
      return null;
    }
    const parts = token.split(".");
    if (parts.length !== 3) {
      logError("verifyJWT: Invalid token format", null, { function: "verifyJWT", partsCount: parts.length, expected: 3 });
      return null;
    }
    const [h, p, s] = parts;
    const signingInput = `${h}.${p}`;
    let sig;
    try {
      sig = base64UrlDecode(s);
    } catch (err) {
      logError("verifyJWT: Error decoding signature", err, { function: "verifyJWT" });
      return null;
    }
    let key;
    try {
      const pubKeyBuf = pemToArrayBuffer(publicPem);
      key = await crypto.subtle.importKey("spki", pubKeyBuf, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    } catch (err) {
      logError("verifyJWT: Error importing public key", err, { function: "verifyJWT" });
      return null;
    }
    const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, sig, new TextEncoder().encode(signingInput));
    if (!ok) {
      logError("verifyJWT: Signature verification failed", null, { function: "verifyJWT" });
      return null;
    }
    let payload;
    try {
      const payloadJson = new TextDecoder().decode(base64UrlDecode(p));
      payload = JSON.parse(payloadJson);
    } catch (err) {
      logError("verifyJWT: Error decoding/parsing payload", err, { function: "verifyJWT" });
      return null;
    }
    const now = Math.floor(Date.now() / 1e3);
    if (payload.exp && now > payload.exp) {
      logError("verifyJWT: Token expired", null, { function: "verifyJWT", exp: payload.exp, now });
      return null;
    }
    return payload;
  } catch (err) {
    logError("verifyJWT error", err, { function: "verifyJWT" });
    return null;
  }
}
__name(verifyJWT, "verifyJWT");

// src/middleware/adminAuth.js
async function requireAdmin(request, env2) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        ok: false,
        error: "unauthorized",
        message: "Missing or invalid Authorization header",
        status: 401
      };
    }
    const token = authHeader.substring(7);
    const payload = await verifyJWT(token, env2);
    if (!payload) {
      return {
        ok: false,
        error: "unauthorized",
        message: "Invalid or expired token",
        status: 401
      };
    }
    if (payload.role !== "admin" && payload.role !== "service") {
      return {
        ok: false,
        error: "forbidden",
        message: "Admin access required",
        status: 403
      };
    }
    request.user = {
      userId: payload.sub,
      role: payload.role,
      email: payload.email
    };
    return { ok: true, user: request.user };
  } catch (err) {
    logError("requireAdmin: Error", err);
    return {
      ok: false,
      error: "internal_error",
      message: "Authentication check failed",
      status: 500
    };
  }
}
__name(requireAdmin, "requireAdmin");

// src/routers/catalog.js
var router = e();
router.get("/_/health", () => new Response(JSON.stringify({ ok: true }), {
  status: 200,
  headers: { "Content-Type": "application/json" }
}));
router.get("/api/v1/products", async (request, env2, ctx) => listProducts2(request, request.env || env2));
router.get("/api/v1/products/:product_id", async (request, env2, ctx) => getProduct2(request, request.env || env2));
router.get("/api/v1/products/:product_id/images/:image_id", async (request, env2, ctx) => getProductImage(request, request.env || env2));
router.get("/api/v1/home", async (request, env2, ctx) => getHomePage(request, request.env || env2));
router.get("/api/v1/search", async (request, env2, ctx) => searchProductsHandler(request, request.env || env2));
router.post(
  "/api/v1/products",
  async (request, env2, ctx) => {
    const authResult = await requireAdmin(request, request.env || env2);
    if (!authResult.ok) {
      return new Response(
        JSON.stringify({ error: authResult.error, message: authResult.message }),
        { status: authResult.status, headers: { "Content-Type": "application/json" } }
      );
    }
    return createProduct2(request, request.env || env2);
  }
);
router.put(
  "/api/v1/products/:product_id",
  async (request, env2, ctx) => {
    const authResult = await requireAdmin(request, request.env || env2);
    if (!authResult.ok) {
      return new Response(
        JSON.stringify({ error: authResult.error, message: authResult.message }),
        { status: authResult.status, headers: { "Content-Type": "application/json" } }
      );
    }
    return updateProduct2(request, request.env || env2);
  }
);
router.delete(
  "/api/v1/products/:product_id",
  async (request, env2, ctx) => {
    const authResult = await requireAdmin(request, request.env || env2);
    if (!authResult.ok) {
      return new Response(
        JSON.stringify({ error: authResult.error, message: authResult.message }),
        { status: authResult.status, headers: { "Content-Type": "application/json" } }
      );
    }
    return deleteProduct2(request, request.env || env2);
  }
);
router.all("*", () => new Response(
  JSON.stringify({ error: "not_found", message: "Endpoint not found" }),
  { status: 404, headers: { "Content-Type": "application/json" } }
));
var catalog_default = router;

// src/middleware/logger.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var import_api24 = __toESM(require_src(), 1);
function withLogger(handler) {
  return async function(request, env2, ctx) {
    const span = import_api24.trace.getSpan(import_api24.context.active());
    const traceId = span ? span.spanContext().traceId : "none";
    const spanId = span ? span.spanContext().spanId : "none";
    if (span) {
      const rayId = request.headers.get("cf-ray");
      const colo = request.cf?.colo;
      if (rayId) span.setAttribute("cfray", rayId);
      if (colo) span.setAttribute("colo", colo);
    }
    if (span) {
      span.addEvent("request.start", {
        method: request.method,
        url: request.url,
        timestamp: Date.now()
      });
    }
    console.log("[Logger]", JSON.stringify({
      ts: (/* @__PURE__ */ new Date()).toISOString(),
      msg: `${request.method} ${request.url}`,
      trace_id: traceId,
      span_id: spanId
    }));
    const res = await handler(request, env2, ctx);
    try {
      if (res && typeof res.headers?.set === "function") {
        res.headers.set("x-trace-id", traceId);
        res.headers.set("x-span-id", spanId);
        if (span) {
          span.addEvent("response.end", {
            status: res.status,
            timestamp: Date.now()
          });
        }
      }
    } catch (e2) {
      console.error("failed to set trace headers", e2);
    }
    return res;
  };
}
__name(withLogger, "withLogger");

// src/index.js
async function baseFetch(request, env2, ctx) {
  try {
    request.env = env2;
    const response = await catalog_default.handle(request, env2, ctx);
    return response;
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "internal_error", message: err?.message ?? String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
__name(baseFetch, "baseFetch");
var handlerWithLogger = withLogger(baseFetch);
var src_default = instrument({ fetch: handlerWithLogger }, resolveConfig);

// ../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e2) {
      console.error("Failed to drain the unused request body.", e2);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function reduceError(e2) {
  return {
    name: e2?.name,
    message: e2?.message ?? String(e2),
    stack: e2?.stack,
    cause: e2?.cause === void 0 ? void 0 : reduceError(e2.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e2) {
    const error3 = reduceError(e2);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-ByNAhI/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// ../../../../../.nvm/versions/node/v24.11.1/lib/node_modules/wrangler/templates/middleware/common.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-ByNAhI/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init2) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init2.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init2) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init2.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
