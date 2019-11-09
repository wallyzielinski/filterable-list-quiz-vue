// Super-Streamlined Dynamic Component Execution
var componentname, component, HERO_calls = $('[data-component]');

// Loop over all [data-component]s on the page
HERO_calls.each(function(i, item) {
	componentname = $(item).attr('data-component');
	component = window['HERO_'+componentname];
	
	// Ensure the component exists
	if (typeof component == 'undefined') {
		console.error('skltr: Call to undefined data-component `' + componentname + '`. Check to be sure it exists before calling with [data-component].');

		return true;
	} else if (!component.config.init) {
		console.info('skltr: Initializing `' + componentname + '`...');

		// Initialize the component, and set it's config.init to `true` to ensure initialization is a one-time only event.
		component.init();
		component.config.init = true;
	}
});
