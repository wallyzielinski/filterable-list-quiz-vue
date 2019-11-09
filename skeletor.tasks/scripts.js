var gulp = require('gulp'),
	pump = require('pump'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat');

	
gulp.task('scripts:dev', function() {
	return pump([
		gulp.src([`${global.skltr.jsSrc}/vendor/*.js`, `${global.skltr.jsSrc}/components/common/*.js`, `${global.skltr.jsSrc}/components/*.js`, `${global.skltr.jsSrc}/skeletor.main.js`]),
		concat('main.js'),
		gulp.dest(`${global.skltr.jsDist}/`)
	]);
});

gulp.task('scripts:prod', function() {
	return pump([
		gulp.src([`${global.skltr.jsSrc}/vendor/*.js`, `${global.skltr.jsSrc}/components/common/*.js`, `${global.skltr.jsSrc}/components/*.js`, `${global.skltr.jsSrc}/skeletor.main.js`]),
		concat('main.js'),
		uglify({ compress: { 'drop_console': true }}),
		gulp.dest(`${global.skltr.jsDist}/`)
	]);
});

gulp.task('scripts:fallbacks', function() {
	return pump([
		gulp.src(`${global.skltr.jsSrc}/fallbacks/*.js`),
		gulp.dest(`${global.skltr.jsDist}/fallbacks/`)
	]);
});