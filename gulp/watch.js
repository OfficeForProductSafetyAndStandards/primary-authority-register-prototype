/*
  watch.js
  ===========
  watches sass/js/images
*/

<<<<<<< HEAD
var gulp = require('gulp')
var config = require('./config.json')

gulp.task('watch-sass', function () {
  return gulp.watch(config.paths.assets + 'sass/**', {cwd: './'}, ['sass'])
=======
const gulp = require('gulp')

const config = require('./config.json')

gulp.task('watch-sass', function () {
  return gulp.watch(config.paths.assets + 'sass/**', { cwd: './' }, gulp.task('sass'))
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95
})

gulp.task('watch-assets', function () {
  return gulp.watch([config.paths.assets + 'images/**',
<<<<<<< HEAD
    config.paths.assets + 'javascripts/**'], {cwd: './'}, ['copy-assets'])
=======
    config.paths.assets + 'javascripts/**'], { cwd: './' }, gulp.task('copy-assets'))
})

// Backward compatibility with Elements

gulp.task('watch-sass-v6', function () {
  return gulp.watch(config.paths.v6Assets + 'sass/**', { cwd: './' }, gulp.task('sass-v6'))
})

gulp.task('watch-assets-v6', function () {
  return gulp.watch([config.paths.v6Assets + 'images/**',
    config.paths.v6Assets + 'javascripts/**'], { cwd: './' }, gulp.task('copy-assets-v6'))
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95
})
