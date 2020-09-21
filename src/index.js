const babelParser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const t = require('@babel/types')
const core = require('@babel/core')
const loaderUtils = require('loader-utils')

const DEFAULT = {
  callback: (err) => {
    console.log(err)
  },
}

let options = loaderUtils.getOptions(this)

options = {
  ...DEFAULT,
  ...options,
}

module.exports = function (source) {
  let ast = babelParser.parse(source, {
    sourceType: 'module', // 支持 es6 module
    plugins: ['dynamicImport'], // 支持动态 import
  })
  let options = loaderUtils.getOptions(this)

  options = {
    ...DEFAULT,
    ...options,
  }
  if (typeof options.callback !== 'function') {
    throw new Error('input must function or arrow-function')
  }
  console.log(options.callback)
  const codeBody = babelParser.parse(options.callback.toString()).program.body[0]
  traverse(ast, {
    AwaitExpression(path) {
      if (t.isAwaitExpression(path.node)) {
        var current = path.node
        var handleType = codeBody.type
        if (handleType === 'ExpressionStatement' && codeBody.type.expression.type === 'ArrowFunctionExpression') {
          var newNode = t.arrowFunctionExpression(codeBody.expression.params, codeBody.expression.body)
        } else if (handleType === 'FunctionDeclaration') {
          var newNode = t.functionExpression(null, codeBody.params, codeBody.body)
        } else {
          throw new Error('input must function or arrow-function')
        }
        const originFunc = t.callExpression(current.argument.callee, current.argument.arguments)
        var resultNode = t.callExpression(t.memberExpression(originFunc, t.identifier('then')), [t.nullLiteral(), newNode])
        path.replaceWith(t.awaitExpression(resultNode))
        path.skip()
      }
    },
  })

  const result = core.transformFromAstSync(ast, null, {
    // configFile: false // 屏蔽 babel.config.js，否则会注入 polyfill 使得调试变得困难
  }).code

  return result
}
