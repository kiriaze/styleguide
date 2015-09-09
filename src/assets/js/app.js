
var introduction = require('../../modules/1_introduction/introduction.js');

(function($){

	/* jshint devel:true */
	'use strict';

	window.THEMENAME = {};

	var SHORTNAME = window.THEMENAME;

	var $window      = $(window),
		$body        = $(document.body),
		$html        = $(document.documentElement);

	SHORTNAME.init = function(){

		SHORTNAME.setElements();
		SHORTNAME.colors();
		SHORTNAME.basics();

	};

	SHORTNAME.setElements = function(){
		SHORTNAME.elems               = {};

		// defaults
		SHORTNAME.elems.html          =	$('html');
		SHORTNAME.elems.body          =	$('body');
		SHORTNAME.elems.scrollToTop   =	$('a[data-scroll-to="top"]');

	};

	SHORTNAME.colors = function() {
		var colors = {
			aqua    : '#7FDBFF',
			blue    : '#0074D9',
			lime    : '#01FF70',
			navy    : '#001F3F',
			teal    : '#39CCCC',
			olive   : '#3D9970',
			green   : '#2ECC40',
			red     : '#FF4136',
			maroon  : '#85144B',
			orange  : '#FF851B',
			purple  : '#B10DC9',
			yellow  : '#FFDC00',
			fuchsia : '#F012BE',
			gray    : '#aaa',
			white   : '#fff',
			black   : '#111',
			silver  : '#ddd'
		};
		// console.log(colors);
		// console.log(colors.blue);
	};

	SHORTNAME.basics = function() {

		// SimpleAnchors
		$.simpleAnchors({
			offset: 75-1, // 80-1, header height on scroll
			easing: 'easeInOutCubic',
			autoBuild: true,
			sections: '.styleguide-module__title',	// the elements auto build targets to generate links from
            sectionEl: 'section class="module"',             // the elements auto build searchs for the section arg
            wrapper: '.primary',              // wrapper of all the auto build sections
            navEl: '#nav'
		});

		// simpleforms - styles/effects for forms, checkboxes, radio's
		// $('body').simpleforms();

		// Target your .container, .wrapper, .post, etc.
		// SHORTNAME.elems.body.fitVids();

		$('.toggle-sidebar').on('click',function(){
			$('body').toggleClass('sidebar-open');
		});

		$('.styleguide-header-breakpoints').find('a').on('click', function(){
			var size = $(this).data('breakpoint-size');
			$('.styleguide-header-breakpoints').find('a').removeClass('active');
			$(this).addClass('active');
			$('.primary').attr('data-breakpoint-size', size);
		});

	};

	$window.load(function() {

	});

	$window.resize(function(event) {

	});

	$(document).ready(function(){

		SHORTNAME.init();

	});

})(window.jQuery);
