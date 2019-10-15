<<<<<<< HEAD
require('dotenv').config()
var crypto = require('crypto')
var path = require('path')
var express = require('express')
var session = require('express-session')
var nunjucks = require('nunjucks')
var routes = require('./app/routes.js')
var documentationRoutes = require('./docs/documentation_routes.js')
var favicon = require('serve-favicon')
var app = express()
var documentationApp = express()
var bodyParser = require('body-parser')
var browserSync = require('browser-sync')
var config = require('./app/config.js')
var utils = require('./lib/utils.js')
var packageJson = require('./package.json')

// Grab environment variables specified in Procfile or as Heroku config vars
var releaseVersion = packageJson.version
var username = process.env.USERNAME
var password = process.env.PASSWORD
var env = process.env.NODE_ENV || 'development'
var useAuth = process.env.USE_AUTH || config.useAuth
var useAutoStoreData = process.env.USE_AUTO_STORE_DATA || config.useAutoStoreData
var useHttps = process.env.USE_HTTPS || config.useHttps
var useBrowserSync = config.useBrowserSync
var analyticsId = process.env.ANALYTICS_TRACKING_ID

env = env.toLowerCase()
useAuth = useAuth.toLowerCase()
useHttps = useHttps.toLowerCase()
useBrowserSync = useBrowserSync.toLowerCase()
=======
// Core dependencies
const path = require('path')

// NPM dependencies
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const express = require('express')
const nunjucks = require('nunjucks')
const sessionInCookie = require('client-sessions')
const sessionInMemory = require('express-session')
const cookieParser = require('cookie-parser')

// Run before other code to make sure variables from .env are available
dotenv.config()

// Local dependencies
const middleware = [
  require('./lib/middleware/authentication/authentication.js'),
  require('./lib/middleware/extensions/extensions.js')
]
const config = require('./app/config.js')
const documentationRoutes = require('./docs/documentation_routes.js')
const packageJson = require('./package.json')
const routes = require('./app/routes.js')
const utils = require('./lib/utils.js')
const extensions = require('./lib/extensions/extensions.js')

// Variables for v6 backwards compatibility
// Set false by default, then turn on if we find /app/v6/routes.js
var useV6 = false
var v6App
var v6Routes

try {
  v6Routes = require('./app/v6/routes.js')
  useV6 = true
} catch (e) {
  // No routes.js in app/v6 so we can continue with useV6 false
}

const app = express()
const documentationApp = express()

if (useV6) {
  console.log('/app/v6/routes.js detected - using v6 compatibility mode')
  v6App = express()
}

// Set cookies for use in cookie banner.
app.use(cookieParser())
documentationApp.use(cookieParser())
const handleCookies = utils.handleCookies(app)
app.use(handleCookies)
documentationApp.use(handleCookies)

// Set up configuration variables
var releaseVersion = packageJson.version
var env = (process.env.NODE_ENV || 'development').toLowerCase()
var useAutoStoreData = process.env.USE_AUTO_STORE_DATA || config.useAutoStoreData
var useCookieSessionStore = process.env.USE_COOKIE_SESSION_STORE || config.useCookieSessionStore
var useHttps = process.env.USE_HTTPS || config.useHttps
var gtmId = process.env.GOOGLE_TAG_MANAGER_TRACKING_ID

useHttps = useHttps.toLowerCase()
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95

var useDocumentation = (config.useDocumentation === 'true')

// Promo mode redirects the root to /docs - so our landing page is docs when published on heroku
var promoMode = process.env.PROMO_MODE || 'false'
promoMode = promoMode.toLowerCase()

// Disable promo mode if docs aren't enabled
if (!useDocumentation) promoMode = 'false'

<<<<<<< HEAD
// Force HTTPs on production connections. Do this before asking for basicAuth to
// avoid making users fill in the username/password twice (once for `http`, and
// once for `https`).

var isSecure = (env === 'production' && useHttps === 'true')

=======
// Force HTTPS on production. Do this before using basicAuth to avoid
// asking for username/password twice (for `http`, then `https`).
var isSecure = (env === 'production' && useHttps === 'true')
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95
if (isSecure) {
  app.use(utils.forceHttps)
  app.set('trust proxy', 1) // needed for secure cookies on heroku
}

<<<<<<< HEAD
// Authenticate against the environment-provided credentials, if running
// the app in production (Heroku, effectively)
if (env === 'production' && useAuth === 'true') {
  app.use(utils.basicAuth(username, password))
}

// Set up App
var appViews = [path.join(__dirname, '/app/views/'), path.join(__dirname, '/lib/')]

var nunjucksAppEnv = nunjucks.configure(appViews, {
  autoescape: true,
  express: app,
  noCache: true,
  watch: true
})

// Nunjucks filters
=======
middleware.forEach(func => app.use(func))

// Set up App
var appViews = extensions.getAppViews([
  path.join(__dirname, '/app/views/'),
  path.join(__dirname, '/lib/')
])

var nunjucksConfig = {
  autoescape: true,
  noCache: true,
  watch: false // We are now setting this to `false` (it's by default false anyway) as having it set to `true` for production was making the tests hang
}

if (env === 'development') {
  nunjucksConfig.watch = true
}

nunjucksConfig.express = app

var nunjucksAppEnv = nunjucks.configure(appViews, nunjucksConfig)

// Add Nunjucks filters
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95
utils.addNunjucksFilters(nunjucksAppEnv)

// Set views engine
app.set('view engine', 'html')

// Middleware to serve static assets
app.use('/public', express.static(path.join(__dirname, '/public')))
<<<<<<< HEAD
app.use('/public', express.static(path.join(__dirname, '/govuk_modules/govuk_template/assets')))
app.use('/public', express.static(path.join(__dirname, '/govuk_modules/govuk_frontend_toolkit')))
app.use('/public/images/icons', express.static(path.join(__dirname, '/govuk_modules/govuk_frontend_toolkit/images')))

// Elements refers to icon folder instead of images folder
app.use(favicon(path.join(__dirname, 'govuk_modules', 'govuk_template', 'assets', 'images', 'favicon.ico')))

// Set up documentation app
if (useDocumentation) {
  var documentationViews = [path.join(__dirname, '/docs/views/'), path.join(__dirname, '/lib/')]

  var nunjucksDocumentationEnv = nunjucks.configure(documentationViews, {
    autoescape: true,
    express: documentationApp,
    noCache: true,
    watch: true
  })
=======

// Serve govuk-frontend in from node_modules (so not to break pre-extenstions prototype kits)
app.use('/node_modules/govuk-frontend', express.static(path.join(__dirname, '/node_modules/govuk-frontend')))

// Set up documentation app
if (useDocumentation) {
  var documentationViews = [
    path.join(__dirname, '/node_modules/govuk-frontend/'),
    path.join(__dirname, '/node_modules/govuk-frontend/components'),
    path.join(__dirname, '/docs/views/'),
    path.join(__dirname, '/lib/')
  ]

  nunjucksConfig.express = documentationApp
  var nunjucksDocumentationEnv = nunjucks.configure(documentationViews, nunjucksConfig)
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95
  // Nunjucks filters
  utils.addNunjucksFilters(nunjucksDocumentationEnv)

  // Set views engine
  documentationApp.set('view engine', 'html')
}

// Support for parsing data in POSTs
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

<<<<<<< HEAD
// Add variables that are available in all views
app.locals.analyticsId = analyticsId
app.locals.asset_path = '/public/'
app.locals.useAutoStoreData = (useAutoStoreData === 'true')
=======
// Set up v6 app for backwards compatibility
if (useV6) {
  var v6Views = [
    path.join(__dirname, '/node_modules/govuk_template_jinja/views/layouts'),
    path.join(__dirname, '/app/v6/views/'),
    path.join(__dirname, '/lib/v6') // for old unbranded template
  ]
  nunjucksConfig.express = v6App
  var nunjucksV6Env = nunjucks.configure(v6Views, nunjucksConfig)

  // Nunjucks filters
  utils.addNunjucksFilters(nunjucksV6Env)

  // Set views engine
  v6App.set('view engine', 'html')

  // Backward compatibility with GOV.UK Elements
  app.use('/public/v6/', express.static(path.join(__dirname, '/node_modules/govuk_template_jinja/assets')))
  app.use('/public/v6/', express.static(path.join(__dirname, '/node_modules/govuk_frontend_toolkit')))
  app.use('/public/v6/javascripts/govuk/', express.static(path.join(__dirname, '/node_modules/govuk_frontend_toolkit/javascripts/govuk/')))
}

// Add global variable to determine if DoNotTrack is enabled.
// This indicates a user has explicitly opted-out of tracking.
// Therefore we can avoid injecting third-party scripts that do not respect this decision.
app.use(function (req, res, next) {
  // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/DNT
  res.locals.doNotTrackEnabled = (req.header('DNT') === '1')
  next()
})

// Add variables that are available in all views
app.locals.gtmId = gtmId
app.locals.asset_path = '/public/'
app.locals.useAutoStoreData = (useAutoStoreData === 'true')
app.locals.useCookieSessionStore = (useCookieSessionStore === 'true')
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95
app.locals.cookieText = config.cookieText
app.locals.promoMode = promoMode
app.locals.releaseVersion = 'v' + releaseVersion
app.locals.serviceName = config.serviceName
<<<<<<< HEAD

// Support session data
app.use(session({
  cookie: {
    maxAge: 1000 * 60 * 60 * 4, // 4 hours
    secure: isSecure
  },
  // use random name to avoid clashes with other prototypes
  name: 'govuk-prototype-kit-' + crypto.randomBytes(64).toString('hex'),
  resave: false,
  saveUninitialized: false,
  secret: crypto.randomBytes(64).toString('hex')
}))

// add nunjucks function called 'checked' to populate radios and checkboxes,
// needs to be here as it needs access to req.session and nunjucks environment
var addCheckedFunction = function (app, nunjucksEnv) {
  app.use(function (req, res, next) {
    nunjucksEnv.addGlobal('checked', function (name, value) {
      // check session data exists
      if (req.session.data === undefined) {
        return ''
      }

      var storedValue = req.session.data[name]

      // check the requested data exists
      if (storedValue === undefined) {
        return ''
      }

      var checked = ''

      // if data is an array, check it exists in the array
      if (Array.isArray(storedValue)) {
        if (storedValue.indexOf(value) !== -1) {
          checked = 'checked'
        }
      } else {
        // the data is just a simple value, check it matches
        if (storedValue === value) {
          checked = 'checked'
        }
      }
      return checked
    })

    next()
  })
}

if (useAutoStoreData === 'true') {
  app.use(utils.autoStoreData)
  addCheckedFunction(app, nunjucksAppEnv)
  addCheckedFunction(documentationApp, nunjucksDocumentationEnv)
}

// Disallow search index idexing
app.use(function (req, res, next) {
  // Setting headers stops pages being indexed even if indexed pages link to them.
  res.setHeader('X-Robots-Tag', 'noindex')
  next()
})

app.get('/robots.txt', function (req, res) {
  res.type('text/plain')
  res.send('User-agent: *\nDisallow: /')
})

app.get('/prototype-admin/clear-data', function (req, res) {
  req.session.destroy()
  res.render('prototype-admin/clear-data')
=======
// extensionConfig sets up variables used to add the scripts and stylesheets to each page.
app.locals.extensionConfig = extensions.getAppConfig()

// Session uses service name to avoid clashes with other prototypes
const sessionName = 'govuk-prototype-kit-' + (Buffer.from(config.serviceName, 'utf8')).toString('hex')
let sessionOptions = {
  secret: sessionName,
  cookie: {
    maxAge: 1000 * 60 * 60 * 4, // 4 hours
    secure: isSecure
  }
}

// Support session data in cookie or memory
if (useCookieSessionStore === 'true') {
  app.use(sessionInCookie(Object.assign(sessionOptions, {
    cookieName: sessionName,
    proxy: true,
    requestKey: 'session'
  })))
} else {
  app.use(sessionInMemory(Object.assign(sessionOptions, {
    name: sessionName,
    resave: false,
    saveUninitialized: false
  })))
}

// Automatically store all data users enter
if (useAutoStoreData === 'true') {
  app.use(utils.autoStoreData)
  utils.addCheckedFunction(nunjucksAppEnv)
  if (useDocumentation) {
    utils.addCheckedFunction(nunjucksDocumentationEnv)
  }
  if (useV6) {
    utils.addCheckedFunction(nunjucksV6Env)
  }
}

// Clear all data in session if you open /prototype-admin/clear-data
app.post('/prototype-admin/clear-data', function (req, res) {
  req.session.data = {}
  res.render('prototype-admin/clear-data-success')
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95
})

// Redirect root to /docs when in promo mode.
if (promoMode === 'true') {
<<<<<<< HEAD
  console.log('Prototype kit running in promo mode')
=======
  console.log('Prototype Kit running in promo mode')

  app.locals.cookieText = 'GOV.UK uses cookies to make the site simpler. <a href="/docs/cookies">Find out more about cookies</a>'
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95

  app.get('/', function (req, res) {
    res.redirect('/docs')
  })

<<<<<<< HEAD
  // allow search engines to index the prototype kit promo site
=======
  // Allow search engines to index the Prototype Kit promo site
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95
  app.get('/robots.txt', function (req, res) {
    res.type('text/plain')
    res.send('User-agent: *\nAllow: /')
  })
} else {
<<<<<<< HEAD
  // Disallow search index idexing
=======
  // Prevent search indexing
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95
  app.use(function (req, res, next) {
    // Setting headers stops pages being indexed even if indexed pages link to them.
    res.setHeader('X-Robots-Tag', 'noindex')
    next()
  })

  app.get('/robots.txt', function (req, res) {
    res.type('text/plain')
    res.send('User-agent: *\nDisallow: /')
  })
}

<<<<<<< HEAD
// routes (found in app/routes.js)
if (typeof (routes) !== 'function') {
  console.log(routes.bind)
  console.log('Warning: the use of bind in routes is deprecated - please check the prototype kit documentation for writing routes.')
=======
// Load routes (found in app/routes.js)
if (typeof (routes) !== 'function') {
  console.log(routes.bind)
  console.log('Warning: the use of bind in routes is deprecated - please check the Prototype Kit documentation for writing routes.')
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95
  routes.bind(app)
} else {
  app.use('/', routes)
}

<<<<<<< HEAD
// Returns a url to the zip of the latest release on github
app.get('/prototype-admin/download-latest', function (req, res) {
  var url = utils.getLatestRelease()
  res.redirect(url)
})

if (useDocumentation) {
  // Copy app locals to documentation app locals
  documentationApp.locals = app.locals
=======
if (useDocumentation) {
  // Clone app locals to documentation app locals
  // Use Object.assign to ensure app.locals is cloned to prevent additions from
  // updating the original app.locals
  documentationApp.locals = Object.assign({}, app.locals)
  documentationApp.locals.serviceName = 'Prototype Kit'
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95

  // Create separate router for docs
  app.use('/docs', documentationApp)

  // Docs under the /docs namespace
  documentationApp.use('/', documentationRoutes)
}

<<<<<<< HEAD
=======
if (useV6) {
  // Clone app locals to v6 app locals
  v6App.locals = Object.assign({}, app.locals)
  v6App.locals.asset_path = '/public/v6/'

  // Create separate router for v6
  app.use('/', v6App)

  // Docs under the /docs namespace
  v6App.use('/', v6Routes)
}

>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95
// Strip .html and .htm if provided
app.get(/\.html?$/i, function (req, res) {
  var path = req.path
  var parts = path.split('.')
  parts.pop()
  path = parts.join('.')
  res.redirect(path)
})

// Auto render any view that exists

// App folder routes get priority
<<<<<<< HEAD
app.get(/^\/([^.]+)$/, function (req, res) {
  utils.matchRoutes(req, res)
=======
app.get(/^([^.]+)$/, function (req, res, next) {
  utils.matchRoutes(req, res, next)
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95
})

if (useDocumentation) {
  // Documentation  routes
<<<<<<< HEAD
  documentationApp.get(/^\/([^.]+)$/, function (req, res) {
    if (!utils.matchMdRoutes(req, res)) {
      utils.matchRoutes(req, res)
=======
  documentationApp.get(/^([^.]+)$/, function (req, res, next) {
    if (!utils.matchMdRoutes(req, res)) {
      utils.matchRoutes(req, res, next)
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95
    }
  })
}

<<<<<<< HEAD
// redirect all POSTs to GETs - this allows users to use POST for autoStoreData
=======
if (useV6) {
  // App folder routes get priority
  v6App.get(/^([^.]+)$/, function (req, res, next) {
    utils.matchRoutes(req, res, next)
  })
}

// Redirect all POSTs to GETs - this allows users to use POST for autoStoreData
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95
app.post(/^\/([^.]+)$/, function (req, res) {
  res.redirect('/' + req.params[0])
})

<<<<<<< HEAD
console.log('\nGOV.UK Prototype kit v' + releaseVersion)
// Display warning not to use kit for production services.
console.log('\nNOTICE: the kit is for building prototypes, do not use it for production services.')

// start the app
utils.findAvailablePort(app, function (port) {
  console.log('Listening on port ' + port + '   url: http://localhost:' + port)
  if (env === 'production' || useBrowserSync === 'false') {
    app.listen(port)
  } else {
    app.listen(port - 50, function () {
      browserSync({
        proxy: 'localhost:' + (port - 50),
        port: port,
        ui: false,
        files: ['public/**/*.*', 'app/views/**/*.*'],
        ghostmode: false,
        open: false,
        notify: false,
        logLevel: 'error'
      })
    })
  }
})

=======
// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error(`Page not found: ${req.path}`)
  err.status = 404
  next(err)
})

// Display error
app.use(function (err, req, res, next) {
  console.error(err.message)
  res.status(err.status || 500)
  res.send(err.message)
})

console.log('\nGOV.UK Prototype Kit v' + releaseVersion)
console.log('\nNOTICE: the kit is for building prototypes, do not use it for production services.')

>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95
module.exports = app
