<<<<<<< HEAD
var express = require('express')
var fs = require('fs')
var marked = require('marked')
var path = require('path')
var router = express.Router()
var utils = require('../lib/utils.js')
=======
// Core dependencies
const fs = require('fs')
const path = require('path')

// NPM dependencies
const express = require('express')
const marked = require('marked')
const router = express.Router()

// Local dependencies
const utils = require('../lib/utils.js')
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95

// Page routes

// Docs index
router.get('/', function (req, res) {
  res.render('index')
})

router.get('/install', function (req, res) {
<<<<<<< HEAD
  var url = utils.getLatestRelease()
  res.render('install', { 'releaseURL': url })
=======
  res.render('install')
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95
})

// Pages in install folder are markdown
router.get('/install/:page', function (req, res) {
  // If the link already has .md on the end (for GitHub docs)
  // remove this when we render the page
  if (req.params.page.slice(-3).toLowerCase() === '.md') {
    req.params.page = req.params.page.slice(0, -3)
  }
  redirectMarkdown(req.params.page, res)
  var doc = fs.readFileSync(path.join(__dirname, '/documentation/install/', req.params.page + '.md'), 'utf8')
  var html = marked(doc)
<<<<<<< HEAD
  res.render('install_template', {'document': html})
})

// Examples - exampes post here
=======
  res.render('install_template', { 'document': html })
})

// Redirect to the zip of the latest release of the Prototype Kit on GitHub
router.get('/download', function (req, res) {
  var url = utils.getLatestRelease()
  res.redirect(url)
})

// Examples - examples post here
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95
router.post('/tutorials-and-examples', function (req, res) {
  res.redirect('tutorials-and-examples')
})

// Example routes

// Passing data into a page
<<<<<<< HEAD

=======
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95
router.get('/examples/template-data', function (req, res) {
  res.render('examples/template-data', { 'name': 'Foo' })
})

// Branching
<<<<<<< HEAD

router.get('/examples/over-18', function (req, res) {
  // get the answer from the query string (eg. ?over18=false)
  var over18 = req.query.over18

  if (over18 === 'false') {
    // redirect to the relevant page
    res.redirect('/docs/examples/under-18')
  } else {
    // if over18 is any other value (or is missing) render the page requested
    res.render('examples/over-18')
=======
router.post('/examples/branching/over-18-answer', function (req, res) {
  // Get the answer from session data
  // The name between the quotes is the same as the 'name' attribute on the input elements
  // However in JavaScript we can't use hyphens in variable names

  let over18 = req.session.data['over-18']

  if (over18 === 'false') {
    res.redirect('/docs/examples/branching/under-18')
  } else {
    res.redirect('/docs/examples/branching/over-18')
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95
  }
})

module.exports = router

// Strip off markdown extensions if present and redirect
var redirectMarkdown = function (requestedPage, res) {
  if (requestedPage.slice(-3).toLowerCase() === '.md') {
    res.redirect(requestedPage.slice(0, -3))
  }
  if (requestedPage.slice(-9).toLowerCase() === '.markdown') {
    res.redirect(requestedPage.slice(0, -9))
  }
}
