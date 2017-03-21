// Karma configuration

module.exports = function(config) {

// Browsers to run on SauceLabs Labs
  var customLaunchers = require("./browserlist.json");
    
    
    
    config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    //plugins: ['karma-sauce-launcher'],


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [
        'src/bundle.js'
      , 'src/test/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
// test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots', 'saucelabs'],
    


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel:  config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    //autoWatch: true,


    sauceLabs: {
      testName: 'Karma and SauceLabs Labs Play Test ' + Date.now()
      , directDomains: 'play.mediagoom.com'
      , startConnect: false
    },

    captureTimeout: 120000,
    customLaunchers: customLaunchers,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: Object.keys(customLaunchers),
    singleRun: true
   

    , client: {
        captureConsole: true,
        mocha: {
            timeout : 1200000 // 60 seconds - upped from 2 seconds
        }
    }

    , browserDisconnectTimeout: 40000 // 120 seconds
    , browserDisconnectTolerance: 2
    , concurrency: 2
    //, hostname :
    , transports : ['polling']//, 'websocket']
    , browserNoActivityTimeout : 40000
    
     
  })
}
