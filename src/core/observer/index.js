import Dep from './dep'

export class Observer {
  constructor(value) {
    if (Array.isArray(value)) {

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
}

export function defineReactive(obj, key, val) {
  if (typeof val === 'object') {
    new Observer(val)
  }
  let dep = new Dep()
  Object.defineProperty(obj, key, {
    get() {
      dep.depend()
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