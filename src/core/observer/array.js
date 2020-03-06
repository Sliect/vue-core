import { def } from "../utils";

export const arrayMethods = Object.create(Array.prototype)
const mutateMethods = ['pop', 'push', 'shift', 'unshift', 'sort', 'splice', 'reverse']

mutateMethods.forEach(function(method) {
  let originalMethod = arrayMethods[method]
  def(arrayMethods, method, function (...args) {
    let res = originalMethod.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // 数组触发依赖
    ob.dep.notify()

    return res
  })
})
