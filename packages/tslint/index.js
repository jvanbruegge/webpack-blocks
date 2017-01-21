/**
 * Tslint webpack block.
 *
 * @see https://github.com/wbuchwalter/tslint-loader
 */

module.exports = tslint

/**
 * @param {object}   [options]                  See https://github.com/wbuchwalter/tslint-loader#usage
 * @return {Function}
 */
function tslint (options) {
  options = options || {}

  const loader = context => ({
    test: context.fileType('application/x-typescript'),
    loaders: [ 'tslint-loader' ]
  })

  const module = context => (context.webpack.version === 1 ? {
    preLoaders: [ loader(context) ]
  } : {
    loaders: [ Object.assign({}, loader(context), {
      enforce: 'pre'
    })]
  })

  const setter = (context) => Object.assign({
    module: module(context),
    plugins: context.webpack.version === 2 ? [
      new context.webpack.LoaderOptionsPlugin({
        options: {
          tslint: options
        }
      })
    ] : []
  }, context.webpack.version === 1 ? { tslint: options } : undefined)

  return Object.assign(setter, { pre })
}

function pre (context) {
  const registeredTypes = context.fileType.all()
  if (!('application/x-typescript' in registeredTypes)) {
    context.fileType.add('application/x-typescript', /\.(ts|tsx)$/)
  }
}
