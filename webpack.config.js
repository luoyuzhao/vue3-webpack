//配置webpackbuild
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')//html压缩
const MiniCssExtractPlugin = require('mini-css-extract-plugin');//css分离
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");//压缩css
const CopyPlugin = require("copy-webpack-plugin");//复制静态资源
const TerserPlugin = require("terser-webpack-plugin");//压缩js
const fs = require('fs');//file


/*plugin-config-references */
class ConfigRefPlugin {
  _filter;
  constructor(filter) {
    this._filter = filter;
  }
  replaceAll(find, replace, str) {
    var findRegex = find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    return str.replace(new RegExp(findRegex, 'g'), replace);
  }
  apply(compiler) {
    var self = this;
    const pluginName = "ConfigRef";
    const { webpack } = compiler;
    const { Compilation } = webpack;
    const { RawSource } = webpack.sources;
    compiler.hooks.thisCompilation.tap(pluginName, compilation => {
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
        },
        (assets) => {
          Object.entries(assets).forEach(([pathname, source]) => {
            if (pathname.endsWith('.html') || pathname.endsWith('.css')) {
              let contentStr = source._valueAsString.toString();
              self._filter.forEach(filter => {
                console.log("ConfigRef--" + pathname + ":replace:/" + filter + " to ./" + filter);
                contentStr = self.replaceAll("/" + filter, "./" + filter, contentStr);
              });
              compilation.updateAsset(
                pathname,
                new RawSource(contentStr)
              );
            }
          });
        }
      );
    });
  }
}
/*plugin-clear-dist */
class ClearDistPlugin {
  delDir(dir) {
    let files = [];
    if (fs.existsSync(dir)) {
      files = fs.readdirSync(dir);
      files.forEach((f, i) => {
        let p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
          this.delDir(p);
        }
        else {
          fs.unlinkSync(p);
        }
      })
      fs.rmdirSync(dir);
    }
  }
  delUpdateFile(dir) {
    let files = [];
    if (fs.existsSync(dir)) {
      files = fs.readdirSync(dir);
      files.forEach((f, i) => {
        let p = path.join(dir, f);
        if (!fs.statSync(p).isDirectory() && p.indexOf('hot-update.') > -1) {
          fs.unlinkSync(p);
        }
      })
    }
  }
  apply(compiler) {
    var self = this;
    compiler.hooks.emit.tap('clearDist', compilation => {
      if (process.env.NODE_ENV === 'production') {
        self.delDir(path.join(__dirname, 'dist'));
      }
      else { 
        self.delUpdateFile(path.join(__dirname, 'dist'));
      }
    });
  }
}


module.exports = {
  devServer: {
    allowedHosts: 'all',
    client: {
      webSocketURL: 'ws://localhost:8080/ws',//websocketHotReload
    },
    webSocketServer: 'ws',
    static: [{
      directory: path.join(__dirname, 'dist'),
    }],
    compress: true,
    devMiddleware: {
      index: true,
      mimeTypes: { 'text/html': ['html'] },
      publicPath: 'dist',
      serverSideRender: true,
      writeToDisk: true,
    },
    port: 8080
  },
  devtool: 'eval-source-map',
  entry: {
    index: ['./src/index.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),//out-dir
    filename: "bundle.js",//out-file
    publicPath: './'
  },
  performance: { hints: false },
  module: {
    rules: [
      {
        //javascript-ES6
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: { presets: ['@babel/env'] }
        }]
      },
      { test: /\.css$/i, use: [MiniCssExtractPlugin.loader, 'css-loader'] },//CSS
      {
        test: /\.less$/, use: [
          { loader: MiniCssExtractPlugin.loader }, 
          { loader: 'css-loader' },
          {
            loader: 'less-loader',//LESS
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
            }
          }
        ]
      },
      { test: /\.html/, loader: 'html-loader' },//HTML
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,//PICTURE
        loader: 'url-loader',
        options: {
          limit: 10000,
        }
      },
      { test: /\.(ttf|eot|woff|woff2)(\?.*)?$/, loader: 'file-loader' }//FONTS
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        extractComments: false,
        test: /\.js(\?.*)?$/i
      })
    ],
  },
  resolve: {
   'vue': 'vue/dist/vue.esm-bundler.js',
   'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
    extensions: ['.wasm', '.mjs', '.js', '.json', '.css', '.less']
  },
  externals: {
    //CDN Links
    'vue': 'Vue',
    'vue-i18n':'VueI18n',
    'vuex':'Vuex',
    'vue-router':'VueRouter'
  },
  plugins: [
    new ClearDistPlugin(),//清空dist
    new ConfigRefPlugin(["thirdParty", "static"]),//自定义的插件用于替换引入路径
    new MiniCssExtractPlugin({//打包css'main[chunkhash].css'
      filename: 'main.css'
    }),
    new CopyPlugin({
      patterns: [
        //{ from: "static", to: "static" },
        { from: "thirdParty", to: "thirdParty" }//复制第三方资源
      ],
    }),

    new HtmlWebpackPlugin({ //生成页面
      title: '',
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['index']
    })
  ]
}
