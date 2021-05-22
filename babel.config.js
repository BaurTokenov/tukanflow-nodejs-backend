const presets = [['@babel/preset-env', { targets: { node: 'current' } }]]

const plugins = [
  ['@babel/plugin-transform-runtime'],
  [
    'module-resolver',
    {
      root: ['./server'],
      extensions: ['.js', '.json']
    }
  ]
]

module.exports = {
  presets,

  plugins
}
