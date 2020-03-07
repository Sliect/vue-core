# 变化侦测API

## $watch

demo：

``` js
var unwatch = vm.$watch('a', (newVal, oldVal) => {})
// 取消观察
unwatch()

vm.$watch('object', cb, {
  // vm.object.innerVal = 233 将会立即触发 cb
  deep: true,
  // 以当前表达式的值立刻触发回调
  immediate: true
})
```

how：在Watcher中记录订阅了哪些Dep，并在取消订阅时互相通知。deep的实现需要在收集依赖的时候将其所有子值也收集依赖，注意子值不要重复订阅

## $set

what：vm.$set(target, key, value)

how：如果target是响应式的，key被创建后也是响应式，并且触发视图更新

## $delete

what：vm.$delete(target, key)

how：如果target是响应式的，key被删除后应该触发更新视图
