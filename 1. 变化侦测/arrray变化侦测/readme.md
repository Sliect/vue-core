# Array变化侦测

## 分区Object和Array

why：object新增可以用$set收集依赖，array新增方法push也要能触发getter和setter方法

how：在数组的原型方法上对各个数组突变方法进行拦截，追踪Array的变化

## 拦截数组突变方法

how：通过覆盖数组原型链，并且只覆盖响应式数组上的原型方法
