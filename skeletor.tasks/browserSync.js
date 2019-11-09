var gulp = require('gulp'),
	path = require('path'),
	ssi = require('browsersync-ssi');

global.browserSync = require('browser-sync').create();

var bsyncConfig = {
	open: global.skltr.bsOpen,
	ghostMode: {
		clicks: global.skltr.bsGhostMode,
		forms: global.skltr.bsGhostMode,
		scroll: global.skltr.bsGhostMode
	},
	notify: global.skltr.bsNotify,
};

if (global.skltr.bsServer == 'ssi') {
	bsyncConfig['server'] = { 
		baseDir: global.skltr.localRoot,
		middleware: ssi({ 
			baseDir: path.resolve(__dirname, '..'),
			ext: '.shtml'
		})
	};
} else if (global.skltr.bsServer == 'proxy') {
	bsyncConfig['proxy'] = global.skltr.localUrl;
}

gulp.task('browserSync', function(){
	global.browserSync.init(bsyncConfig);
});

gulp.task('browserSync:reload', function(done){
	global.browserSync.reload();
	done();
});