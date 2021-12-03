// vue.config.js

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
const path = require('path')
// const webpack = require('webpack')
const { name } = require('./package.json')
const theme = require('./config/theme')

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    // 选项...
    publicPath: process.env.NODE_ENV === 'production' ? `/${name}/` : '/',
    chainWebpack: config => {
        config.resolve.alias.set('@$', resolve('src'))
    },
    // qiankun 配置
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        port: '8081',
    },
    configureWebpack: {
        output: {
            library: `${name}-[name]`,
            libraryTarget: 'umd', // 把微应用打包成 umd 库格式
            jsonpFunction: `webpackJsonp_${name}`,
        },
    },
    css: {
        loaderOptions: {
            less: {
                modifyVars: theme,
                javascriptEnabled: true,
            },
        },
    },
}
