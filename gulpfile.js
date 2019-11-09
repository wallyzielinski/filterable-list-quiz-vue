const gulp = require('gulp');
global.skltr = require('./skeletor.config.js');

require('./skeletor.tasks/browserSync.js');
require('./skeletor.tasks/sass.js');
require('./skeletor.tasks/svg_sprite.js')
require('./skeletor.tasks/scripts.js');
require('./skeletor.tasks/watch.js');
require('./skeletor.tasks/replace.js');

// Default task, assumes you want all bells and whistles
gulp.task('default', gulp.parallel('browserSync', 'watch:bs'));

// Build task minifies and obfuscates all scripts and compiles css
gulp.task('build', gulp.series('scripts:prod', 'scripts:fallbacks', 'svg:sprite', 'sass'));

// Other tasks:
// `watch`                (like default, but no browserSync)
// `replace:dev`          (replace css/js query strings to disable cache bust)
// `scripts:dev`          (compiles js, leaves comments and console logs)
// `replace:prod`         (replace css/js query strings to enable cache bust)
// `scripts:prod`         (compiles, obfuscates js, strips logs)
// `sass`                 (compiles sass)
// `svg_sprite`           (generates spritesheet from vectors)