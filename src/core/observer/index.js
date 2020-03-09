import Dep from './dep'
import { arrayMethods } from "./array";
import {
  def,
  hasProto,
  isObject,
  hasOwn,
  isValidArrayIndex
} from "../utils";

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)
export class Observer {
  constructor(value) {
    this.value = value
    // 仅收集数组依赖
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)

    if (Array.isArray(value)) {
      let augment = hasProto ? protoAugment : copyAugment
      // 兼容性 拦截7个突变的数组方法
      augment(value, arrayMethods, arrayKeys)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  walk(value) {
    let keys = Object.keys(value)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(value, keys[i], value[keys[i]])
    }
  }

  observeArray(items) {
    for (let i = 0; i < items.length; i++) {
      observe(items[i])
    }
  }
}

function protoAugment(target, src, keys) {
  target.__proto__ = src
}

function copyAugment(target, src, keys) {
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}

export function defineReactive(obj, key, val) {
  let childOb = observe(val)
  // 收集所有依赖
  let dep = new Dep()
  Object.defineProperty(obj, key, {
    get() {
      dep.depend()
      // 数组收集依赖 或者 增删对象属性
      if (childOb) {
        childOb.dep.depend()
        if (Array.isArray(val)) {
          dependArray(val)
        }
      }
      return val
    },
    set(newVal) {
      if (val === newVal) return
      val = newVal
      dep.notify()
    },
    enumerable: true,
    configurable: true
  })
}

// 联结 Observer实例 和 响应式对象
function observe(value) {
  if (!isObject(value)) return
  let ob
  // 避免重复监测
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else {
    ob = new Observer(value)
  }

  return ob
}

export function set(target, key, val) {
  // 数组
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  // 已存在
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  // 新增
  const ob = target.__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }
  if (!ob) {
    target[key] = val
    return val
  }
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}

export function del(target, key) {
  // 数组
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)
    return
  }
  const ob = target.__ob__
  // vue实例或根data
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    )
    return
  }
  // 不存在该属性
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key]
  // 非响应式
  if (!ob) {
    return
  }
  ob.dep.notify()
}

function dependArray(value) {
  for (let i = 0; i < value.length; i++) {
    const e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}