import { parsePath } from '../utils'

export default class Watcher {
  constructor(vm, expOrFn, cb) {
    this.vm = vm
    this.getter = parsePath(expOrFn)
    this.cb = cb
    this.value = this.get()
  }

  get() {
    window.target = this
    // 触发依赖收集
    let value = this.getter.call(vm, vm)
    window.target = undefined

    return value
  }

  update() {
    let oldVal = this.value
    this.value = this.get()
    this.cb.call(this.vm, this.value, oldVal)
  }
}