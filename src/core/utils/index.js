export function remove(list, item) {
  for (let i = 0; i < list.length; i++) {
    let idx = list.indexOf(item)
    if (idx > -1) {
      list.splice(idx, 1)
    }
  }
}

const bailRE = /^\w.$/
export function parsePath(path) {
  if (bailRE.test(path)) return
  let segments = path.split('.')

  return function(obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}
