var gulp = require('gulp'),
  sass = require('sass'),
  sassGlob = require('gulp-sass-glob'),
  sourcemaps = require('gulp-sourcemaps'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  cssnano = require('cssnano')

var sassSettings = {
  outputStyle: 'expanded',
  includePaths: ['./node_modules/breakpoint-sass/stylesheets']
}

var postcssPlugins = []

if (global.skltr.postCssDev == true) {
  postcssPlugins = [autoprefixer, cssnano]
}

gulp.task('sass:watch:bs', function () {
  return gulp
    .src(`${global.skltr.sass}/main.scss`)
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass(sassSettings).on('error', sass.logError))
    .pipe(postcss(postcssPlugins))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(global.skltr.css))
    .pipe(global.browserSync.stream({ match: '**/*.css' }))
})

gulp.task('sass:watch', function () {
  return gulp
    .src(`${global.skltr.sass}/main.scss`)
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass(sassSettings).on('error', sass.logError))
    .pipe(postcss(postcssPlugins))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(global.skltr.css))
})

gulp.task('sass', function () {
  return gulp
    .src(`${global.skltr.sass}/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass(sassSettings).on('error', sass.logError))
    .pipe(postcss([autoprefixer, cssnano]))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(global.skltr.css))
})
