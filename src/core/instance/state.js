import { Watcher } from "../observer/watcher";
import {
  set,
  del
} from "../observer";

export function stateMixin(Vue) {

  Vue.prototype.$set = set
  Vue.prototype.$delete = del
  Vue.prototype.$watch = function (expOrFn, cb, options) {
    const vm = this
    options = options || {}
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      cb.call(vm, watcher.value)
    }

    return function unwatch() {
      watcher.teardown()
    }
  }
}