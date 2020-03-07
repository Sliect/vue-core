import { parsePath, isObject } from '../utils'

export default class Watcher {
  constructor(vm, expOrFn, cb, options) {
    this.vm = vm
    if (options) {
      this.deep = !!options.deep
    } else {
      this.deep = false
    }
    // 存放订阅了哪些 dep
    this.deps = []
    this.depIds = new Set()
    this.getter = parsePath(expOrFn)
    this.cb = cb
    this.value = this.get()
  }

  get() {
    window.target = this
    // 触发依赖收集
    let value = this.getter.call(vm, vm)
    if (this.deep) {
      traverse(value)
    }
    window.target = undefined

    return value
  }

  update() {
    let oldVal = this.value
    this.value = this.get()
    this.cb.call(this.vm, this.value, oldVal)
  }

  addDep(dep) {
    const depId = dep.id
    if (!this.depIds.has(depId)) {
      this.deps.push(dep)
      this.depIds.add(depId)
      dep.addSub(this)
    }
  }

  teardown() {
    let i = this.deps.length
    while(i--) this.deps[i].removeSub(this)
  }
}

const seenObjects = new Set()
function traverse(val) {
  seenObjects.clear()
  _traverse(val, seenObjects)
}

function _traverse(val, seen) {
  let i, keys
  if (!isObject(val) || Object.isFrozen(val)) {
    return
  }
  if (val.__ob__) {
    const depId = val.__ob__.dep.id
    if (seen.has(depId)) {
      return
    }
    seen.add(depId)
  }
  if (Array.isArray(val)) {
    i = val.length
    while(i--) _traverse(val[i], seen)
  } else {
    keys = Object.keys(val)
    i = keys.length
    while(i--) _traverse(val[keys[i]], seen)
  }
}