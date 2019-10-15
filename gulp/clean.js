/*
  clean.js
  ===========
  removes folders:
    - public
<<<<<<< HEAD
    - govuk_modules
*/
var config = require('./config.json')

var gulp = require('gulp')
var clean = require('gulp-clean')

gulp.task('clean', function () {
  return gulp.src([config.paths.public + '/*',
    config.paths.govukModules + '/*',
    '.port.tmp'], {read: false})
  .pipe(clean())
=======
*/

const del = require('del')
const gulp = require('gulp')

const config = require('./config.json')

gulp.task('clean', function (done) {
  return del([config.paths.public + '/*',
    '.port.tmp'])
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95
})
