// mini modernizr for picture element polyfill
if (!!window.HTMLPictureElement == false) {
	$.getScript('//golocal.com/ajax/libs/picturefill/3.0.3/picturefill.min.js')
		.done(function(script, textStatus) {
			console.log(script, textStatus);
		})
		.fail( function(jqxhr, settings, exception) {
			console.log('failed over cdn');
			$.getScript('/Static/dist/js/fallbacks/picturefill.js')
				.done(function(script, textStatus) {
					console.log('getting local script', textStatus);
				})
				.fail( function(jqzhr, settings, exception) {
					console.log('failed locally');
				});
		});
}