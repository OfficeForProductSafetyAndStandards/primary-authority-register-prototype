<<<<<<< HEAD
var express = require('express')
var router = express.Router()

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

// add your routes here
=======
const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95

module.exports = router
