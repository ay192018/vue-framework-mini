import { isArray } from "@vue/shared"
import { Dep, createDep } from "./dep"

type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>() //基于weakmap来实现读写代理的操作

export function effect<T = any>(fn: () => T) {
  const _effect = new ReactiveEffect(fn) //传入要执行的回调函数
  _effect.run()
}
export let activeEffect: ReactiveEffect | undefined
export class ReactiveEffect<T = any> {
  constructor(public fn: () => T) {}
  run() {
    // 代表当前被激活的ReactiveEffect全局变量
    activeEffect = this
    //标记当前激活的Effect触发的函数 且在加载完毕时执行一次
    return this.fn()
  }
}
/* 最终的数据格式为  weakmap{key:对象，value：{指定的key，指定的key对应的effect函数并且是一对多的Set格式}} */
/* 收集依赖的函数 */
export function track(target: object, key: unknown) {
  if (!activeEffect) return
  let depsMap = targetMap.get(target) //读取map对象
  if (!depsMap) {
    //如果depsMap没有的话就让他生成新的Map对象
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key) //读取key对应的Set对象
  if (!dep) {
    depsMap.set(key, (dep = createDep()))
  }
  trackEffects(dep)
  //  depsMap.set(key, activeEffect)
}
//利用deps依次跟踪指定key的所有effect
export function trackEffects(dep: Dep) {
  dep.add(activeEffect!)
}
/* 触发依赖的函数 */
export function trigger(target: object, key: unknown, newValue: unknown) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  const dep: Dep | undefined = depsMap.get(key)
  if (!dep) return
  triggerEffects(dep)
}
//一次触发dep中保存的依赖
export function triggerEffects(dep: Dep) {
  const effects = isArray(dep) ? dep : [...dep]
  console.log(dep)

  for (const effect of effects) {
    //循环触发一个响应式数据绑定多个effect 函数的操作
    triggerEffect(effect)
  }
}
//触发指定依赖
export function triggerEffect(effect: ReactiveEffect) {
  effect.run() //触发更新
}
