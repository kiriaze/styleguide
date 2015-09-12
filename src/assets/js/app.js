var $ = require('../vendor/jquery/dist/jquery.js');

// (function($){
$(function() {

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
		SHORTNAME.breakpointToggle();

	};

	SHORTNAME.setElements = function(){
		SHORTNAME.elems                   = {};

		// defaults
		SHORTNAME.elems.html              =	$('html');
		SHORTNAME.elems.body              =	$('body');
		SHORTNAME.elems.scrollToTop       =	$('a[data-scroll-to="top"]');

		SHORTNAME.elems.toggleSidebar     = $('.toggle-sidebar');
		SHORTNAME.elems.header            = $('.styleguide-header');
		SHORTNAME.elems.headerBreakpoints = $('.styleguide-header-breakpoints');

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

		// simpleforms - styles/effects for forms, checkboxes, radio's
		// $('body').simpleforms();

		// Target your .container, .wrapper, .post, etc.
		// SHORTNAME.elems.body.fitVids();

		SHORTNAME.elems.toggleSidebar.on('click',function(){
			SHORTNAME.elems.body.add(SHORTNAME.elems.html).toggleClass('sidebar-open');
		});

		var width = $window.width();

		var sidebarToggle = function() {
			if ( width > 768 ) {
				SHORTNAME.elems.body.add(SHORTNAME.elems.html).addClass('sidebar-open');
			} else {
				SHORTNAME.elems.body.add(SHORTNAME.elems.html).removeClass('sidebar-open');
			}
		}

		sidebarToggle();

		$window.resize(function(e) {
			if ( $window.width() != width ) {
				// DO RESIZE
				width = $window.width();
				sidebarToggle();
			}
		});

	};

	SHORTNAME.breakpointToggle = function(){
		SHORTNAME.elems.headerBreakpoints.find('a').on('click', function(){
			var size = $(this).data('breakpoint-size');
			SHORTNAME.elems.headerBreakpoints.find('a').removeClass('active');
			$(this).addClass('active');
			$('iframe').attr('data-breakpoint-size', size);
		});
	};

	$window.load(function() {
		SHORTNAME.elems.body.addClass('loaded');
	});

	$('iframe').load(function() {
		frames[0].$('body').addClass('loaded');
		// hack
		SHORTNAME.elems.header.after(frames[0].$('.sidebar'));
	});

	$window.resize(function(event) {

	});

	$(document).ready(function(){
		SHORTNAME.init();
	});

// })(window.jQuery);
});
