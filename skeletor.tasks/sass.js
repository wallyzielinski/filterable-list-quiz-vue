var gulp = require('gulp'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	postcss = require('gulp-postcss'),
	autoprefixer = require('autoprefixer'),
	cssnano = require('cssnano');

var sassSettings = {
	outputStyle: 'nested',
	importer: require('node-sass-globbing'),
	includePaths:['./node_modules/breakpoint-sass/stylesheets'],
};


var postcssPlugins = [];

if (global.skltr.postCssDev == true) {
	postCssPlugins = [ autoprefixer, cssnano ];
}


gulp.task('sass:watch:bs', function () {
	return gulp.src(`${global.skltr.sass}/main.scss`)
		.pipe(sourcemaps.init())
		.pipe(sass(sassSettings).on('error', sass.logError))
		.pipe(postcss(postcssPlugins))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(global.skltr.css))
		.pipe(global.browserSync.stream({match: '**/*.css'}));
});

gulp.task('sass:watch', function () {
	return gulp.src(`${global.skltr.sass}/main.scss`)
		.pipe(sourcemaps.init())
		.pipe(sass(sassSettings).on('error', sass.logError))
		.pipe(postcss(postcssPlugins))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(global.skltr.css));
});

gulp.task('sass', function () {
	return gulp.src(`${global.skltr.sass}/*.scss`)
		.pipe(sourcemaps.init())
		.pipe(sass(sassSettings).on('error', sass.logError))
		.pipe(postcss([ autoprefixer, cssnano ]))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(global.skltr.css));
});