// https://github.com/shelljs/shelljs
require('./check-versions')()
require('shelljs/global')

process.env.NODE_ENV = 'production'

var path = require('path')
var config = require('../config')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.prod.conf')
var rm = require('rimraf')
var fs = require('fs')
var replaceContent = '<!--[if gt IE 6]><!--><script>window.onerror = function(a,b,c){ return true};!function(t){t.loadScript(["http://szhuodong.duowan.com/feq/m_huya/yy-f2e-m_huya.min"])}(function(){function t(e,a){var n=a[e];if(n){e++;var o=document.createElement("script");o.type="text/javascript",o.setAttribute("async","async"),o.onload=o.onreadystatechange=function(){return o.readyState&&"complete"!==o.readyState&&"loaded"!==o.readyState?!1:(o.onload=o.onreadystatechange=null,void t(e,a))};var c=new Date;c.setSeconds(0),c.setMilliseconds(0),c=c.getTime(),o.async=!0,o.src=n+"?_="+c,document.getElementsByTagName("head")[0].appendChild(o)}}return{loadScript:function(e){e&&e.length&&e instanceof Array&&t(0,e)}}}());</script><!--<![endif]--></body></html>';


console.log(
  '  Tip:\n' +
  '  Built files are meant to be served over an HTTP server.\n' +
  '  Opening index.html over file:// won\'t work.\n'
)

var spinner = ora('building for production...')
spinner.start()

var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err

  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n')
    
    // cp('-R', './websocket.js', assetsPath + '/js/')
    // cp('-R', './icon-share.png', assetsPath + '/img/')

    //防劫持代码，在打包之后用替换的方式添加到html底部
    var dirPath = './dist';

    fs.readdirSync(dirPath).forEach(function(fileName) {
      if (/\.html/.test(fileName)) {
        var filePath = 'dist/' + fileName;
        fs.readFile(filePath, 'utf8', function(err, fileContent) {
          if (err) throw err;
          var result = fileContent.replace('</body></html>', replaceContent);
          fs.writeFile(filePath, result);
        });
      }
    });
  })
})
