// NOTES
// underscore.js is used, remapped to `__`, because our coding standards utilize `_` regularly

var HERO_filterableList = {
	config: {
		explorerResults: sessionStorage.getItem('ev-explorer-results'), 
		init: false,
		data: sessionStorage.getItem('list-data')
	},

	init: function() {
		var _ = this, explorerResults;

		if (_.config.explorerResults) {  
			explorerResults = _.config.explorerResults;
		}

		if (!_.config.data) {
			$.ajax({
				type: 'GET',
				url: 'https://demo2703826.mockable.io/cars', 
				success: function(data) {
					// Store the result in the session so we don't need to make additonal calls
					sessionStorage.setItem('list-data', JSON.stringify(data));
					
					_.setup(data, explorerResults); 
				},
				error: function() {
					console.error('unable to load data');
				}
			});
		} else {
			data = JSON.parse(_.config.data);
			_.setup(data, explorerResults);
		}
		
	},

	setup: function(data, explorerResults) {
		var _ = this,
			filterBy,
			sortState = 'default',
			qstring = (window.location.hash) ? window.location.hash.slice(1).split('&') : '',
			query = {};

		if (qstring !== '') {
			// create a JSON object from thr querystring
			qstring.forEach(function(item) {
				item = item.split('=');
				query[item[0]] = decodeURIComponent(item[1]) || '';
			});
		}

		// Set up default filter objects
		var filterByData = {
			brand: [],
			range: 0,
			budget: '',
			seats: [],
			bodyType: [],
			fuelType: ''
		};

		filterBy = $.extend(true,{},filterByData);
		
		// replace defaults with anything from the querystring
		// .split(',') is used for multi-select or array values
		// .map is used to convert from a String to a Number
		if (!__.isEmpty(query)) {
			if (query.brand) {
				filterBy.brand = query.brand.split(',');
			}

			if (query.seats) {
				filterBy.seats = query.seats.split(',')
											.map(function(x){return parseInt(x)});
			}

			if (query.bodyType) {
				filterBy.bodyType = query.bodyType.split(',');
			}

			if (query.budget) {
				filterBy.budget = query.budget;
			}

			if (query.range) {
				filterBy.range = query.range;
			}

			if (query.fuelType) {
				filterBy.fuelType = query.fuelType;
			}

			if(query.showroomSort) {
				sortState = query.showroomSort;
			}

			if (query.showExplorer) {
				showExplorer = true;
			}
		} 

		// The options available for each filter.
		// Hardcoded for now, will come from Sitecore eventually
		var filterOptions = {
			'bodyType': {
				'label': 'Body Type',
				'name': 'bodyType',
				'type': 'checkbox',
				'function': function(car, filter) {
					return $.inArray(car.bodyType, filter) > -1;
				},
				'options': [
					{
						'label': 'Sedan',
						'value': 'Sedan'
					},
					{
						'label': 'Hatchback',
						'value': 'Hatchback'
					},
					{
						'label': 'Coupe',
						'value': 'Coupe'
					},
					{
						'label': 'Crossover',
						'value': 'Crossover'
					},
					{
						'label': 'Minivan',
						'value': 'Minivan'
					},
					{
						'label': 'SUV',
						'value': 'SUV'
					},
					{
						'label': 'Truck',
						'value': 'Truck'
					}
				]
			},
			'fuelType': {
				'label': 'Fuel Type',
				'name': 'fuelType',
				'type': 'radio',
				'function': function(car, filter) {
					return car.fuelType == filter;
				},
				'options': [
					{
						'label': 'All Electric',
						'value': 'Electric Vehicle'
					},
					{
						'label': 'Plug-in Hybrid',
						'value': 'Plug-In Hybrid'
					}
				]
			},
			'seats': {
				'label': 'Seats',
				'name': 'seats',
				'type': 'checkbox',
				'function': function(car,filter) {
					if ($.inArray(6, filter) > -1) {
						return $.inArray(car.seats, filter) > -1 || car.seats >= 6;
					} else {
						return $.inArray(car.seats, filter) > -1;
					}
				},
				'options': [
					{
						'label': '2 Seats',
						'value': 2 
					},
					{
						'label': '4 Seats',
						'value': 4
					},
					{
						'label': '5 Seats',
						'value': 5
					},
					{
						'label': '6+ Seats',
						'value': 6
					}
				]
			},
			'range': {
				'label': 'Commute (one way)',
				'name': 'range',
				'type': 'radio',
				'function': function(car, filter) {
					return car.totalRange >= filter * 2;
				},
				'options': [
					{
						'label': '< 25 mi. commute',
						'value': '25'
					},
					{
						'label': '< 50 mi. commute',
						'value': '50'
					},
					{
						'label': '< 100 mi. commute',
						'value': '100'
					},
					{
						'label': '< 200 mi. commute',
						'value': '200'
					},
				]
			},
			'budget': {
				'label': 'Budget',
				'name': 'budget',
				'type': 'radio',
				'function': function(car, filter, min, max) {
					return car.price <= min && car.price >= max;
				},
				'options': [
					{
						'label': '< $35,000 (Economy)',
						'value': '0 - 34999'
					},
					{
						'label': '$35,000 - $50,000',
						'value': '35000 - 50000'
					},
					{
						'label': '> $50,000 (Luxury)',
						'value': '50001 - Infinity'
					}
				]
			},
			'brand': {
				'label': 'Brand',
				'name': 'brand',
				'type': 'checkbox',
				'function': function(car, filter) {
					return $.inArray(car.brand, filter) > -1;
				},
				'options': [
					{
						'label': 'Audi',
						'value': 'Audi'
					},
					{
						'label': 'BMW',
						'value': 'BMW'
					},
					{
						'label': 'Cadillac',
						'value': 'Cadillac'
					},
					{
						'label': 'Chevrolet',
						'value': 'Chevrolet'
					},
					{
						'label': 'Chrysler',
						'value': 'Chrysler'
					},
					{
						'label': 'Fiat',
						'value': 'Fiat'
					},
					
					{
						'label': 'Ford',
						'value': 'Ford'
					},
					{
						'label': 'Honda',
						'value': 'Honda'
					},
					{
						'label': 'Hyundai',
						'value': 'Hyundai'
					},
					{
						'label': 'Jaguar',
						'value': 'Jaguar'
					},
					{
						'label': 'Karma',
						'value': 'Karma'
					},
					{
						'label': 'Kia',
						'value': 'Kia'
					},
					{
						'label': 'MINI',
						'value': 'Mini'
					},
					{
						'label': 'Mercedes',
						'value': 'Mercedes'
					},
					{
						'label': 'Mitsubishi',
						'value': 'Mitsubishi'
					},
					{
						'label': 'Nissan',
						'value': 'Nissan'
					},
					{
						'label': 'Porsche',
						'value': 'Porsche'
					},
					{
						'label': 'Smart',
						'value': 'Smart'
					},
					{
						'label': 'Subaru',
						'value': 'Subaru'
					},
					{
						'label': 'Tesla',
						'value': 'Tesla'
					},
					{
						'label': 'Toyota',
						'value': 'Toyota'
					},
					{
						'label': 'Volkswagen',
						'value': 'Volkswagen'
					},
					{
						'label': 'Volvo',
						'value': 'Volvo'
					}
				]
			}
		};

		var explorerQuestions = [ 
			{ 
				id: 1, 
				progress: 10, 
				text: 'What styles do you prefer?', 
				filter: 'bodyType', 
				style: 'threeup' 
			}, 
			{ 
				id: 2, 
				progress: 20, 
				text: 'How many seats do you need?', 
				filter: 'seats', 
				style: 'multi' 
			}, 
			{ 
				id: 3, 
				progress: 40, 
				text: 'What is your daily commute (one way)?', 
				filter: 'range', 
				style: 'single' 
			}, 
			{ 
				id: 4, 
				progress: 60, 
				text: 'What are your preferred brands?', 
				filter: 'brand', 
				style: 'fiveup' 
			}, 
			{ 
				id: 5, 
				progress: 80, 
				text: 'What\'s your budget?', 
				filter: 'budget', 
				style: 'single' 
			} 
		]; 

		// Global state. This is where we manage the filtered list of data to show
		var state = {
			filterBy: filterBy,							// An object mapping of each filter by type (used for filtering list of data)
			filterOptions: filterOptions,				// Options available for each filter
			appliedFilters: [],							// An array of the applied filters (used for pills)
			filteredList: [],							// The list of data based on user filters
			showroomSort: sortState,					// Sort
			explorerQuestions: explorerQuestions, 
			explorerList: [],
			explorerResults: explorerResults, 
			showPerPage: 30
		};

		// console.log(state.filterBy);
		_.vue(data, state, filterByData);
	},

	vue: function(cars, state, filterByData) {

		Vue.component('ev-explorer', { 
			template: '#ev-explorer', 
			props: ['filters'], 
			data: function() { 
				return { 
					valid: true, 
					currentQuestion: 0, 
					progress: 0, // 0 = splash, 1-99 = quiz, 100 = results, >100 = login 
					questions: state.explorerQuestions,  
					exploreBy: state.exploreBy, 
					remainingCars: state.explorerList 
				} 
			}, 
			mounted: function() { 
				state.explorerList = cars; 
				 
				var explorerModal = document.getElementById('evExplorerModal'); 
				HERO_modals.initialize(explorerModal) 
			}, 
			computed: { 
				theRemaining: function() { 
					var _ = this; 
 
					state.explorerList = cars; 
 
					if (_.currentQuestion > 0) { 
						var currentFilter = __.findWhere(_.questions, {id: _.currentQuestion}).filter; 
 
						// For each type of filer, check if it's set and if so, apply the filter. 
						for (attr in _.exploreBy) { 
							var blank = filterByData[attr]; 
 
							if (attr !== currentFilter || (_.currentQuestion == _.questions.length && _.progress >= 100 )) { 
								if (_.exploreBy[attr].toString() !== blank.toString()) { 
									_.reduceThis(attr, _.exploreBy[attr]); 
								} 
							} 
							 
						} 
					} 
 
					_.remainingCars = state.explorerList; 
					return _.remainingCars.length; 
				} 
			}, 
			methods: { 
				resetExplorer: function() { 
					var _ = this; 
					 
					_.currentQuestion = 0; 
					_.progress = 0; 
					_.exploreBy = $.extend(true,{},filterByData); 
				}, 
				closeModal: function() {
					window['evExplorerModal'].hide(); 
				},
				validate: function(e) { 
					var _ = this; 
 
					var input = $('input[name="question-' + _.currentQuestion + '"]:checked'); 
 
					if (input.val()) { 
						_.valid = true; 
						_.next(); 
					} else { 
						_.valid = false; 
					} 
					 
				}, 
				clearSelection: function() { 
					var _ = this; 
 
					if (_.currentQuestion > 0) { 
						var currentFilter = __.findWhere(_.questions, {id: _.currentQuestion}).filter; 
						var blank = filterByData[currentFilter]; 
 
						console.log('clearSelection'); 
 
						_.exploreBy[currentFilter] = blank; 
					} 
				}, 
				skip: function(e) { 
					var _ = this;
				 
					_.clearSelection(); 
 
					_.valid = true; 
					_.next(); 
 
				}, 
				next: function() { 
					var _ = this; 

					if (_.currentQuestion < _.questions.length) { 
						_.goto(_.currentQuestion + 1); 
					} else if (_.currentQuestion == _.questions.length) { 
						_.complete(); 
					} 
					 
				}, 
				prev: function() { 
					var _ = this;

					_.clearSelection(); 
 
					if (_.progress == 100) { 
						_.goto(_.questions.length); 
					} else if (_.currentQuestion > 0) { 
						_.goto(_.currentQuestion - 1); 
					} 
 
					 
					setTimeout(function() { 
						$('.ev-explorer__question').focus(); 
					}, 300); 
 
					var windowTitle; 
					if (_.currentQuestion == 0) { 
						windowTitle = 'EV Explorer' 
					} else if (_.progress == 100) { 
						windowTitle = $('.ev-explorer__complete-title').text(); 
					} else { 
						windowTitle = _.questions[_.currentQuestion].text; 
					} 
					 
				}, 
				goto: function(goTo) { 
					var _ = this, 
						newQuestion; 
 
					if (goTo !== 0) { 
						newQuestion = __.findWhere(_.questions, { id: goTo}); 
 
						_.currentQuestion = newQuestion.id; 
						_.progress = newQuestion.progress; 
 
						setTimeout(function() { 
							$('.ev-explorer__question').focus(); 
						}, 300) 
					} else { 
						_.currentQuestion = 0; 
						_.progress = 0; 
					} 
				}, 
				complete: function() { 
					var _ = this; 
 
					_.progress = 100; 
 
					sessionStorage.setItem('ev-explorer-results', JSON.stringify(_.exploreBy)); 
					var evExplorerResults = _.generateProfileData(); 
				}, 
				generateProfileData: function() { 
					var _ = this; 
 
					// MAP JSON to labels 
					var evExplorerResults = { 
						'json': _.exploreBy,  
						'profileData': {} 
					}; 
 
					for (var key in _.exploreBy) { 
 
						if (_.$parent.filterOptions.hasOwnProperty(key)) { 
							var thisVal = _.exploreBy[key],  
								choice; 
 
							if ($.isArray(thisVal)) { 
								 
								if (thisVal.length > 0) { 
									evExplorerResults.profileData[key] = []; 
 
									var each = __.each(thisVal, function(val, k){ 
										choice = __.findWhere(_.$parent.filterOptions[key].options, {'value': val}); 
 
										if (!__.isUndefined(choice) && !__.isNull(choice)) { 
											evExplorerResults.profileData[key].push(choice.label); 
										} 
									}); 
 
									evExplorerResults.profileData[key] = evExplorerResults.profileData[key].join(', ');
								} 
								 
							} else if (key !== 'fuelType') { 
								choice = __.findWhere(_.$parent.filterOptions[key].options, {'value': thisVal}); 
 
								if (!__.isUndefined(choice) && !__.isNull(choice)) { 
									evExplorerResults.profileData[key] = choice.label; 
								} 
							} 
						} 
					}
 
					return JSON.stringify(evExplorerResults); 
				}, 
				passToShowroom: function(e) { 
					var _ = this; 
 
					_.$parent.filterBy = $.extend({},true,_.exploreBy); 
					_.$parent.explorerResults = sessionStorage.getItem('ev-explorer-results'); 
 
					window['evExplorerModal'].hide(); 

				}, 
				getFilterOptions: function(filter) { 
					var _ = this; 
 
					return _.filters[filter].options; 
				}, 
				getRemaining: function(filter, value) { 
					var _ = this; 
 
					var remaining = _.remainingCars;  
 
					remaining = remaining.filter(function(car) { 
						if (filter == 'budget') { 
							var max = value.split(' - '); 
							var min = max.pop(); 
 
							return car.price <= min && car.price >= max; 
						} else if (filter == 'range') { 
							return car.totalRange >= value * 2; 
						} else if (filter == 'seats') { 
							if (value == 6) { 
								return car.seats == value || car.seats >= 6; 
							} else { 
								return car.seats == value; 
							} 
						} else { 
							return (car[filter] == value); 
						} 
					}); 
 
					return remaining.length; 
				}, 
 
				reduceThis: function(type, value) { 
					var _ = this; 
					 
					state.explorerList = state.explorerList.filter(function(car) { 
						var max, min; 
						if (type == 'budget') { 
							max = value.split(' - '); 
							min = max.pop(); 
 
							return car.price <= min && car.price >= max; 
						} else if (type == 'range') { 
							return car.totalRange >= value * 2; 
						} else { 
							return _.$parent.filterOptions[type]['function'](car, value, min, max); 
						} 
					}); 
				}
			} 
		}); 
		
		var evShowroomVue = new Vue ({
			el: '#showroom',
			data: {
				cars: cars, 
				showroomSort: state.showroomSort, 
				refined: state.filteredList, 
				filterBy: state.filterBy, 
				filterOptions: state.filterOptions, 
				appliedFilters: state.appliedFilters, 
				selected: new Array, 
				maxSelected: 3, 
				compared: state.compared, 
				persona: new String, 
				showExplorer: state.showExplorer, 
				explorerResults: state.explorerResults, 
				maxShown: state.showPerPage 
			},
			mounted: function() {
				var _ = this;
				console.log('mounted');

				// When Vue is initialized and ready to go, hide loading spinner and show component
				this.$nextTick(function() {
					window.requestAnimationFrame( function() {
						window.requestAnimationFrame( function() {
							$('.vue-app').addClass('vue--ready');

							var compareModal = document.getElementById('compareModal'); 
							HERO_modals.initialize(compareModal) 
 
							if (_.showExplorer) { 
								window.setTimeout( function() { 
									window.evExplorerModal.show(); 
								}, 750); 
								 
							} 
						});
					});
				});
			},
			watch: {
				persona: function(newVal, val) {
					var _ = this;

					if (_.persona.length < 1) {
						// Remove active personas
						$('.showroom__group button').removeClass('active');
					}
				},
				refined: function(nv, ov) {
					var _ = this;

					// handle transitions
					if (nv !== ov) {
						var items = $('.showroom__image img'),
							delay = 200;
		
						// Animation from Design 
						items.css('opacity', '0');
						
						items.each( function(i, item) {
							setTimeout(function () {
								$(item).addClass('transition');
								$(item).css('opacity', '1');
		
								setTimeout(function() {
									$(item).removeClass('transition');
								}, delay + 222);
							}, delay);
						});
						
					}

					// Set active state on persona filters if the current filters exactly match
					var allPersonas =  [],
						currentFilters = JSON.stringify(_.filterBy);

					$('.showroom__group button').each(function(i, item) {
						var $this = $(this);

						allPersonas.push($this.attr('data-persona'));
					});

					if (__.contains(allPersonas, currentFilters) && currentFilters !== filterByData) {
						var activePersona = $("[data-persona='" + currentFilters + "']");

						$('.showroom__group button').not(activePersona).removeClass('active');
						activePersona.addClass('active'); 
					}
				}
			},
			computed: {
				applyFilters: function() { 
					var _ = this; 

					// Our filters always need to reference the full list of possible data. 
					state.filteredList = _.cars; 
					 
					// For each type of filer, check if it's set and if so, apply the filter.
					for (attr in _.filterBy) { 
						var blank = filterByData[attr];

						if (_.filterBy[attr].toString() !== blank.toString()) { 
							_.filterThis(attr, _.filterBy[attr]);
						} 
					}
 
					// Store the current filters in the query string for sharability
					window.history.replaceState(_.filterBy, null, _.generateQuery()); 
					 
					// Store the filtered slist back in Vue and return it. 
					_.refined = _.sortList(state.filteredList); 

					return _.refined; 
				}, 

				filterTags: function() {
					var _ = this;

					state.appliedFilters = [];
					var obj = {};

					// For each type of filter, find the option and value by the filterOptions object, and push to the appliedFilters array
					for (attr in _.filterBy) { 
						var blank = filterByData[attr];

						if (_.filterBy[attr].toString() !== blank.toString()) {

							// Handling arrays vs strings/numbers. Could be implified.
							if ($.isArray(_.filterBy[attr])) {
								for (i = 0; i < _.filterBy[attr].length; i++) {
									var filterObject = __.findWhere(_.filterOptions[attr].options, {value: _.filterBy[attr][i]});

									obj = {};
									obj.type = attr.toString();
									obj.value = _.filterBy[attr][i];
									obj.label = filterObject.label;
		
									state.appliedFilters.push(obj);
								}
							} else {
								var filterObject = __.findWhere(_.filterOptions[attr].options, {value: _.filterBy[attr]});

								obj = {};
								obj.type = attr.toString();
								obj.value = _.filterBy[attr];
								obj.label = filterObject.label;

								state.appliedFilters.push(obj);
							}
						} 
					}
					
					// Save the applied filters to Vue and return them
					_.appliedFilters = state.appliedFilters;

					return _.appliedFilters;
				},
				carComparison: function() { 
					var _ = this; 
 
					if (_.selected.length > 0) { 
						_.compareCars(_.selected, _.cars); 
 
						_.compared = state.compared; 
						return _.compared; 
					} 
				}
			},
			methods: {

				// Sort
				sortList: function(data) {
					var _ = this;

					if (_.showroomSort == "seat-desc") {
						data = data.sort(function(a, b) {
							if (a.seats > b.seats) { return -1; }
							if (a.seats < b.seats) { return 1; }
							return 0;
						});
					} else if(_.showroomSort == "price-asc") {
						data = data.sort(function(a, b) {
							if (a.price < b.price) { return -1; }
							if (a.price > b.price) { return 1; }
							return 0;
						});
					} else if(_.showroomSort == "price-desc") {
						data = data.sort(function(a, b) {
							if (a.price > b.price) { return -1; }
							if (a.price < b.price) { return 1; }
							return 0;
						});
					} else if(_.showroomSort == "range-electric") {
						data = data.sort(function(a, b) {
							if (a.electricRange > b.electricRange) { return -1; }
							if (a.electricRange < b.electricRange) { return 1; }
							return 0;
						});
					} else if(_.showroomSort == "range-total") {
						data = data.sort(function(a, b) {
							if (a.totalRange > b.totalRange) { return -1; }
							if (a.totalRange < b.totalRange) { return 1; }
							return 0;
						});
					} else {
						data = data.sort(function(a, b) {
							if (a.name < b.name) { return -1; }
							if (a.name > b.name) { return 1; }
							return 0;
						});
					}

					return data;
				},
				// Logic for carComparison 
				compareCars: function(selected, cars) { 
					var _ = this;
 
					state.compared = cars.filter(function(car) { 
						return $.inArray(car.id, selected) > -1; 
					}); 
				}, 
				showCompare: function() { 
					window['compareModal'].show(); 
				}, 
				filterThis: function(type, value) {
					var _ = this;
					
					state.filteredList = state.filteredList.filter(function(car) {
						var max, min;
						if (type == 'budget') {
							max = value.split(' - ');
							min = max.pop();
						}

						return _.filterOptions[type]['function'](car, value, min, max);
					});
				},

				// Clear all filters
				clearFilters: function() {
					var _ = this;

					_.filterBy = $.extend(true,{},filterByData);

					// Remove any active personas
					// Repeated in a couple places, should be cleaned up
					_.persona = '';
				},

				// Clear a single filter (through pills)
				removeFilter: function(e) {
					var _ = this,
						el = $(e.target),
						type = el.attr('data-filter-type'),
						value = el.attr('data-filter-value'),
						label = el.text().trim(),
						newFilters;
					
					// needs cleanup
					if (type == 'range') {
						newFilters = 0;
					} else if ( (typeof _.filterBy[type] == 'array' && _.filterBy[type].length == 1) || typeof _.filterBy[type] == 'string') {
						newFilters = '';
					} else {
						newFilters = _.filterBy[type].filter(function(f) {
							return f.toString() !== value.toString();
						});
					}
					
					_.persona = '';
					_.filterBy[type] = newFilters;
				},
				applyPersona: function(e) {
					var _ = this;

					if($(e.target).hasClass('active')) {
						_.clearFilters();
						return;
					}

					var el = $(e.target),
						filterBy = el.attr('data-persona');
					
					_.persona = filterBy;
					_.filterBy = JSON.parse(filterBy);
				},
				generateQuery: function(hashOnly) {
					var _ = this,
						parameters = {},
						querystring = '';

					// Loop over all fields and generate key/value pairs for querystring
					for (var prop in _.filterBy) {
						if (_.filterBy[prop] !== '' && _.filterBy[prop].length > 0) {
							parameters[prop] = _.filterBy[prop].toString();
						}
					};

					if (_.showroomSort !== 'default') {
						parameters['showroomSort'] = _.showroomSort.toString();
					}

					if (_.showExplorer) {
						parameters['showExplorer'] = true;
					}

					if (!hashOnly) {
						querystring = window.location.pathname;
					}

					// create the querystring from these values
					if (!$.isEmptyObject(parameters)) {
						querystring += '#' + $.param(parameters);
					}
					
					return querystring;
				},
				
				btnClearFilters: function(e) {
					var _ = this;

					_.clearFilters();
				},
				openExplorer: function(e) { 
					var _ = this; 

					_.$children[0].currentQuestion = 0; 
					_.$children[0].progress = 0; 
					_.$children[0].exploreBy = $.extend(true,{},filterByData); 
 
					window['evExplorerModal'].show(); 
 
					var buttonText = $(e.target).text(); 
				}, 
				
				loadMore: function() {
					var _ = this,
						lastItem = $('.showroom__list li:last-of-type');

					_.maxShown += state.showPerPage;

					setTimeout( function() {
						lastItem.next().find('.showroom__image a').focus();
					}, 800);
				}
			},
			filters: {
				currency: function(price) { 
					return '$' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				}, 

				float: function(x) {
					return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				},
				 
				distance: function(range) { 
					return range + ' miles'; 
				}, 
 
				distanceShorthand: function(range) { 
					return range + ' mi'; 
				},
				
				co2: function(co2){
					return co2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' lbs CO2';
				}
			}
		}); 
	}
};