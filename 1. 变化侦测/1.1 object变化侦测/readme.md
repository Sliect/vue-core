# object变化侦测

## 追踪变化

what: 数据变化后能通知浏览器重新渲染

how: 通过defineProperty

## 收集依赖

why: 知道数据变化后通知谁

how: 在getter中收集依赖，在setter中触发依赖

## 声明依赖

who: 数据变化后通知的是谁？Watcher

what：Watcher是一个中介角色，数据发生变化时通知它，然后它再通知其他地方

how：触发getter以收集自身实例

## 递归侦测所有key

why：对象属性值可能也是对象（非数组对象）

how：通过类Observer
