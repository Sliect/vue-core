import { remove } from '../utils'

export default class Dep {
  constructor() {
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
      this.addSub(window.target)
    }
  }

  notify() {
    let subs = this.subs
    for (let i = 0; i < subs.length; i++) {
      subs[i].update()
    }
  }
}