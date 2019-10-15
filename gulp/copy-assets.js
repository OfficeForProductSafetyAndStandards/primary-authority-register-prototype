/*
  copy.js
  ===========
  copies images and javascript folders to public
*/

<<<<<<< HEAD
var gulp = require('gulp')
var config = require('./config.json')
=======
const gulp = require('gulp')

const config = require('./config.json')
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95

gulp.task('copy-assets', function () {
  return gulp.src(['!' + config.paths.assets + 'sass{,/**/*}',
    config.paths.assets + '/**'])
<<<<<<< HEAD
  .pipe(gulp.dest(config.paths.public))
})

gulp.task('copy-documentation-assets', function () {
  return gulp.src(['!' + config.paths.docsAssets + 'sass{,/**/*}',
    config.paths.docsAssets + '/**'])
  .pipe(gulp.dest(config.paths.public))
=======
    .pipe(gulp.dest(config.paths.public))
})

gulp.task('copy-assets-documentation', function () {
  return gulp.src(['!' + config.paths.docsAssets + 'sass{,/**/*}',
    config.paths.docsAssets + '/**'])
    .pipe(gulp.dest(config.paths.public))
})

gulp.task('copy-assets-v6', function () {
  return gulp.src(['!' + config.paths.v6Assets + 'sass{,/**/*}',
    config.paths.v6Assets + '/**'])
    .pipe(gulp.dest(config.paths.public + '/v6'))
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95
})
