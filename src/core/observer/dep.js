import { remove } from '../utils'

let uid = 0
export default class Dep {
  constructor() {
    this.id = uid++
    this.subs = []
  }

  addSub(sub) {
    this.subs.push(sub)
  }

  removeSub(sub) {
    remove(this.subs, sub)
  }

  depend() {
    if (window.target) {
      window.target.addDep(this)
    }
  }

  notify() {
    let subs = this.subs
    for (let i = 0; i < subs.length; i++) {
      subs[i].update()
    }
  }
}