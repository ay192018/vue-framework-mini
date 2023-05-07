var Vue = (function (exports) {
    'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    var isArray = Array.isArray;

    var createDep = function (effects) {
        return new Set(effects);
    };

    var targetMap = new WeakMap(); //基于weakmap来实现读写代理的操作
    function effect(fn) {
        var _effect = new ReactiveEffect(fn); //传入要执行的回调函数
        _effect.run();
    }
    var activeEffect;
    var ReactiveEffect = /** @class */ (function () {
        function ReactiveEffect(fn) {
            this.fn = fn;
        }
        ReactiveEffect.prototype.run = function () {
            // 代表当前被激活的ReactiveEffect全局变量
            activeEffect = this;
            //标记当前激活的Effect触发的函数 且在加载完毕时执行一次
            return this.fn();
        };
        return ReactiveEffect;
    }());
    /* 最终的数据格式为  weakmap{key:对象，value：{指定的key，指定的key对应的effect函数并且是一对多的Set格式}} */
    /* 收集依赖的函数 */
    function track(target, key) {
        if (!activeEffect)
            return;
        var depsMap = targetMap.get(target); //读取map对象
        if (!depsMap) {
            //如果depsMap没有的话就让他生成新的Map对象
            targetMap.set(target, (depsMap = new Map()));
        }
        var dep = depsMap.get(key); //读取key对应的Set对象
        if (!dep) {
            depsMap.set(key, (dep = createDep()));
        }
        trackEffects(dep);
        //  depsMap.set(key, activeEffect)
    }
    //利用deps依次跟踪指定key的所有effect
    function trackEffects(dep) {
        dep.add(activeEffect);
    }
    /* 触发依赖的函数 */
    function trigger(target, key, newValue) {
        var depsMap = targetMap.get(target);
        if (!depsMap)
            return;
        var dep = depsMap.get(key);
        if (!dep)
            return;
        triggerEffects(dep);
    }
    //一次触发dep中保存的依赖
    function triggerEffects(dep) {
        var e_1, _a;
        var effects = isArray(dep) ? dep : __spreadArray([], __read(dep), false);
        console.log(dep);
        try {
            for (var effects_1 = __values(effects), effects_1_1 = effects_1.next(); !effects_1_1.done; effects_1_1 = effects_1.next()) {
                var effect_1 = effects_1_1.value;
                //循环触发一个响应式数据绑定多个effect 函数的操作
                triggerEffect(effect_1);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (effects_1_1 && !effects_1_1.done && (_a = effects_1.return)) _a.call(effects_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    //触发指定依赖
    function triggerEffect(effect) {
        console.log(111);
        effect.run(); //触发更新
    }

    var get = createGetter();
    var set = createSetter();
    // ! 处理getter 和setter
    var mutableHandlers = {
        get: get,
        set: set,
    };
    function createGetter() {
        return function get(target, key, receiver) {
            var res = Reflect.get(target, key, receiver);
            /* 收集依赖  */
            track(target, key);
            return res;
        };
    }
    function createSetter() {
        return function set(target, key, newValue, receiver) {
            var result = Reflect.set(target, key, newValue, receiver);
            /* 触发依赖 */
            trigger(target, key);
            return result;
        };
    }

    var reactiveMap = new WeakMap();
    function reactive(target) {
        return createReactiveObject(target, mutableHandlers, reactiveMap);
    }
    // & 创建 响应式对象
    function createReactiveObject(target, baseHandlers, proxyMap) {
        var existingProxy = proxyMap.get(target);
        /* 判断缓存有的话不走重复代理 */
        if (existingProxy) {
            return existingProxy;
        }
        var proxy = new Proxy(target, baseHandlers);
        proxyMap.set(target, proxy);
        return proxy;
    }

    exports.effect = effect;
    exports.reactive = reactive;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
//# sourceMappingURL=vue.js.map
