module.exports = file => () => import(/* webpackChunkName: 'ImportFuncDemo' */'@/views/' + file + '.vue')
