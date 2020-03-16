# 模板编译

将模板编译成渲染函数

how：先将模板解析成AST，标记静态节点，然后使用AST生成渲染函数

流程： 模板 => 解析器 => 优化器 => 代码生成器 => 渲染函数

## 解析器

开始标签钩子函数 结束标签钩子函数 文本钩子函数 注释钩子函数

## 优化器

plain节点没有属性为true

static是否静态节点

staticRoot是否静态根节点

node.type === 2 带变量的动态文本节点

node.type === 3 不带变量的纯文本节点

node.hasBindings 是否有v-,@,:开头的属性

isBuiltInTag 是否内置标签 slot,component

## 代码生成器

字符串拼接，递归AST来生成字符串，最先生成根节点，然后在子节点字符串生成后，将其拼接在根节点的参数中，递归拼接

``` js
function genElement(el, state) {
  const data = el.plain ? undefined : genData(el, state)
  const children = genChildren(el, state)
  code = `_c('${el.tag}'${
    data ? `,${data}` : '' // data
  }${
    children ? `,${children}` : '' // children
  })`

  return code
}

function genData(el, state) {
  let data = '{'
  if (el.key) {
    data += `key:${el.key},`
  }
  if (el.ref) {
    data += `ref:${el.ref},`
  }
  if (el.pre) {
    data += `pre:true`
  }
  // 还有很多其它情况 略
  data = data.replace(/,$/, '') + '}'
  return data
}

function genChildren(el, state) {
  const children = el.children
  if (children.length) {
    return `[${children.map(c => genNode(c, state)).join(',')}]`
  }
}

function genNode(node, state) {
  if (node.type === 1) {
    return genElement(node, state)
  } else if (node.type === 3 && node.isComment) {
    return genComment(node)
  } else {
    return genText(node)
  }
}

function genComment(comment) {
  return `_e(${JSON.stringify(comment.text)})`
}

function genText(node) {
  return `_v(${node.type === 2
    ? node.expression
    : JSON.stringify(node.text)
  })`
}
```
