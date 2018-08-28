// Karma configuration
// Generated on Thu Mar 16 2017 12:21:14 GMT+0100 (W. Europe Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [
        'https://unpkg.com/dashjs@2.9.0/dist/dash.mediaplayer.min.js'
      , 'lib/bundle.js'
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
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel:  config.LOG_INFo,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    customLaunchers: {
      SmallHeadlessChrome: {
        base: 'ChromeHeadless',
        flags: ['--disable-translate', '--disable-extensions', '--remote-debugging-port=9222'
        , '--window-size=412,732']
      }
      , LargeHeadlessChrome: {
        base: 'ChromeHeadless',
        flags: ['--disable-translate', '--disable-extensions', '--remote-debugging-port=9222'
        , '--window-size=1412,1732']
      }
    }

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    , browsers: ['SmallHeadlessChrome', 'Firefox', 'Edge', 'IE'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 4

    , client: {
        captureConsole: true,
        mocha: {
            timeout : 60000 // 60 seconds - upped from 2 seconds
        }
        // Example passing through `args`.
      , args: config.foo ? ["--foo"] : [],

      // It is also possible to just pass stuff like this,
      // but this works only with `karma start`, not `karma run`.
      testuri: config.testuri
    }

    , browserDisconnectTimeout: 40000 // 120 seconds
    , browserDisconnectTolerance: 2
    //, concurrency: 2
    //, hostname :
    //, transports : ['polling']//, 'websocket']
    , browserNoActivityTimeout : 40000
     
  })
}
