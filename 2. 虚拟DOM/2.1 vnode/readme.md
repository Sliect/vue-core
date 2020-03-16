# vnode

## 虚拟DOM

why：减少直接操作DOM的代价，但是不能对所有状态进行监测（开销太大）。折中解决方案：组件级别是一个watcher实例，组件内部通过虚拟DOM去对比和渲染

what：vnode即js对象版本的DOM元素

``` js
export default class VNode {
  constructor(tag, data, children, text, elm, context, componentOptions, asyncFactory) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.functionalContext = undefined
    this.functionalOptions = undefined
    this.functionalScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = fasle
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  get child() {
    return this.componentInstance
  }
}
```

## vnode类型

### 注释节点

``` js
export const createEmptyVNode = text => {
  const node = new VNode()
  node.text = text
  node.isComment = true
  return node
}
```

### 文本节点

``` js
export function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}
```

### 元素节点

- tag：     如 p, ul等
- data：    如 attrs, class, style
- children：子节点列表
- context： 当前Vue实例

### 组件节点

相比元素节点，多了以下两个属性

- componentOptions 组件节点选项参数

- componentInstance 组件实例

### 函数式组件

相比组件节点，多了以下两个属性

- functionalContext

- functionalOptions

### 克隆节点

``` js
export function cloneVNode(vnode, deep) {
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  )
  cloned.ns = vnode.ns
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  cloned.isComment = vnode.isComment
  cloned.isCloned = true
  if (deep && cloned.children) {
    cloned.children = clonedVNodes(vnode.children)
  }
  return cloned
}
```
