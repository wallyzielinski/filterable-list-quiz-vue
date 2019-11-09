var dateTimeStamp = Date.now().toString(),
	gulp = require('gulp'),
	replace = require('gulp-replace');

// gulp.task('replace:prod',
// 	function() {
// 		return gulp.src(global.skltr.baseLayout, { base: global.skltr.views })
// 			.pipe(replace(/t=([A-Z0-9]*)\w+/g, 't=' + dateTimeStamp))
// 			.pipe(gulp.dest(global.skltr.views));
// 	});


// gulp.task('replace:dev',
// 	function() {
// 		return gulp.src(global.skltr.baseLayout, { base: global.skltr.views })
// 			.pipe(replace(/t=([A-Z0-9]*)\w+/g, 't=cache_bust_version'))
// 			.pipe(gulp.dest(global.skltr.views));
// 	});
