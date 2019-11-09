var gulp = require('gulp');

gulp.task('watch', function() {
    gulp.watch(`${global.skltr.sass}/**/*.scss`, gulp.series('sass:watch'));
    gulp.watch(`${global.skltr.vectors}/**/*.svg`, gulp.series('svg:sprite'));
    gulp.watch(`${global.skltr.vectors}/inline/*.svg`, gulp.series('svg:inline'));
    gulp.watch(`${global.skltr.jsSrc}/**/*.js`, gulp.series('scripts:dev', 'scripts:fallbacks'));
});

gulp.task('watch:bs', function() {
    gulp.watch(`${global.skltr.sass}/**/*.scss`, gulp.series('sass:watch:bs'));
    gulp.watch(`${global.skltr.vectors}/**/*.svg`, gulp.series('svg:sprite', 'browserSync:reload'));
        gulp.watch(`${global.skltr.vectors}/inline/*.svg`, gulp.series('svg:inline'));
	gulp.watch(`${global.skltr.jsSrc}/**/*.js`, gulp.series('scripts:dev', 'scripts:fallbacks',  'browserSync:reload'));
	gulp.watch(global.skltr.views, gulp.series('browserSync:reload'));
});