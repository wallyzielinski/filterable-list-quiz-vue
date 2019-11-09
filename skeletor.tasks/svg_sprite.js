var gulp = require('gulp'),
	svgo = require('gulp-svgo'),
	inlineSvg = require('gulp-inline-svg'),
	svgSprite = require('gulp-svg-sprite');


/**
* This creates an svg file of any name you wish to be <use>d on the site
*/
gulp.task('svg:sprite', function () {
	return gulp.src(`${global.skltr.vectors}/vectors/*.svg`)
		.pipe(svgo())
		.pipe(svgSprite({
			svg:{
				rootAttributes: {width: 0, height: 0, display: 'none'},
				xmlDeclaration: true,
				doctypeDeclaration: false
			},
			mode: {
				symbol: {
					dest: '.',
					sprite : 'vector-spritesheet.svg',
					example: null
				}
			}
		}))
		.pipe(gulp.dest(global.skltr.sprites));
});

gulp.task('svg:inline', function() {
	return gulp.src(`${global.skltr.vectors}/inline/*.svg`)
		.pipe(svgo())
		.pipe(inlineSvg({ template: `${global.skltr.mustache}` }))
		.pipe(gulp.dest(`${global.skltr.sass}/___foundations/tokens/`));
});