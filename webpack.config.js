const path = require('path')

// const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 특정 파일들을 copy해서 다른 디렉토리로 넣어 주는 플러그인
const CopyPlugin = require('copy-webpack-plugin')
// dist 삭제 후 재생성 플러그인
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { merge } = require('webpack-merge')

// 구형 브라우저 호환용 플러그인
require('@babel/polyfill')

module.exports = (env, opts) => {
  // 공통 설정
  const config = {
    resolve: {
      extensions: ['.vue', '.js'],
      alias: {
        '~': path.join(__dirname),
        'scss': path.join(__dirname, './scss')
      },
      fallback: {
        'util': false,
        'crypto': false
      }
    },
    // 진입점
    entry: {
      app: [
        '@babel/polyfill',
        path.join(__dirname, 'main.js')
      ]
    },
    // 결과물에 대한 설정
    output: {
      filename: '[name].js', // app.js
      path: path.join(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          // 정규식 표현
          test: /\.vue$/,
          use: 'vue-loader'
          // loader: 'vue-loader'
        },
        {
          // 정규식 표현
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader'
          // loader: 'babel-loader'
        },
        {
          // 정규식 표현
          test: /\.css$/,
          // 2개이상 로드시
          // 순서 중요
          use: [
            'vue-style-loader',
            'css-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.scss$/,
          // 순서 중요
          use: [
            'vue-style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html')
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'assets/',
            to: ''
          }
        ]
      })
      // new CleanWebpackPlugin()
    ]
    // devServer: {
    //     // 빌드 후 페이지로 이동 여부
    //     open: false,
    //     // 기본적으로 명시되어 있음 생략가능, 빌드시 자동반영
    //     hot: true
    // },
    // devtool: 'eval'
  }

  if (opts.mode === 'development') {
    // 개발용
    return merge(config, {
      devtool: 'eval',
      devServer: {
        open: false,
        hot: true
      }
    })
  } else {
    // 제품용
    return merge(config, {
      devtool: 'cheap-module-source-map',
      devServer: {
        open: false,
        hot: true
      },
      plugins: [
        new CleanWebpackPlugin()
      ]
    })
  }
}
