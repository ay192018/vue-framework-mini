import { mutableHandlers } from "./baseHandlers"
export const reactiveMap = new WeakMap<object, any>()
export function reactive(target: object) {
  return createReactiveObject(target, mutableHandlers, reactiveMap)
}
// & 创建 响应式对象
function createReactiveObject(
  target: object,
  baseHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<object, any>
) {
  const existingProxy = proxyMap.get(target)
  /* 判断缓存有的话不走重复代理 */
  if (existingProxy) {
    return existingProxy
  }
  const proxy = new Proxy(target, baseHandlers)
  proxyMap.set(target, proxy)
  return proxy
}
