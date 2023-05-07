import { track, trigger } from "./effect"

const get = createGetter()
const set = createSetter()
// ! 处理getter 和setter
export const mutableHandlers: ProxyHandler<object> = {
  get,
  set,
}

function createGetter() {
  return function get(target: object, key: string | symbol, receiver: object) {
    const res = Reflect.get(target, key, receiver)
    /* 收集依赖  */
    track(target, key)
    return res
  }
}
function createSetter() {
  return function set(
    target: object,
    key: string | symbol,
    newValue: unknown,
    receiver: object
  ) {
    const result = Reflect.set(target, key, newValue, receiver)
    /* 触发依赖 */
    trigger(target, key, newValue)
    return result
  }
}
