var HERO_modals = {
	config: { 
		init: false,
		FOCUSABLE_ELEMENTS: ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex^="-"])']
	},

	init: function() {
		var _ = this;
		var modals;
		var previousScrollY = 0;
		
		if ($('.modal').length > 0) {
			$('.modal').each(function(i, item) {
				_.initialize(item);
			});
		}
	},

	initialize: function(item) {
		var _ = this;
		var modalName = $(item).attr('id');
		
		window[modalName] = new A11yDialog(item).on('show', function(dialogEl, event) {

			if (modalName == 'signInModal') {
				console.log('signin Modal fired');

				localStorage.setItem('redirectURL', window.location.pathname);
			}
			
			previousScrollY = window.scrollY;
			$('body').addClass('modal-open').css({
				marginTop: -previousScrollY,
				overflow: 'hidden',
				left: 0,
				right: 0,
				top: 0,
				bottom: 0,
				position: 'fixed'
			});
			$(dialogEl).addClass("modal--visible");

			_.toggleTabIndex(dialogEl, true);
		}).on('hide', function(dialogEl, event) {
			
			if (modalName == 'signInModal') {
				localStorage.removeItem('redirectURL');
			}

			$('body').removeClass('modal-open').css({
				marginTop: 0,
				overflow: 'visible',
				left: 'auto',
				right: 'auto',
				top: 'auto',
				bottom: 'auto',
				position: 'static'
			});
			$(dialogEl).removeClass("modal--visible");
			window.scrollTo(0, previousScrollY);

			_.toggleTabIndex(dialogEl, false);
		});

		_.toggleTabIndex(item, true);
	},

	getFocusableElements: function(el) {
		var _ = this;

		return Array.prototype.slice.call(
			el.querySelectorAll(_.config.FOCUSABLE_ELEMENTS.join(','))
		)
	},

	makeTabbable: function(el) {
		if (el.hasAttribute('data-tabindex')) {
			el.setAttribute('tabindex', el.getAttribute('data-tabindex'));
		} else {
			el.removeAttribute('tabindex');
		}
	},

	makeUntabbable: function(el) {
		if (el.hasAttribute('tabindex')) {
			el.setAttribute('data-tabindex', el.getAttribute('tabindex'));
		}

		el.setAttribute('tabindex', -1);
	},

	toggleTabIndex: function(parent, focusable) {
		var _ = this;
		var els = _.getFocusableElements(parent)

		focusable
			?
			els.forEach(_.makeTabbable) :
			els.forEach(_.makeUntabbable)
	}
};