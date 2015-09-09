
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
		SHORTNAME.breakpointToggle();
		SHORTNAME.codeSnippets();

	};

	SHORTNAME.setElements = function(){
		SHORTNAME.elems               = {};

		// defaults
		SHORTNAME.elems.html          =	$('html');
		SHORTNAME.elems.body          =	$('body');
		SHORTNAME.elems.scrollToTop   =	$('a[data-scroll-to="top"]');

		SHORTNAME.elems.toggleSidebar       = $('.toggle-sidebar');
		SHORTNAME.elems.headerBreakpoints   = $('.styleguide-header-breakpoints');

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

		SHORTNAME.elems.toggleSidebar.on('click',function(){
			SHORTNAME.elems.body.toggleClass('sidebar-open');
		});

	};

	SHORTNAME.breakpointToggle = function(){
		SHORTNAME.elems.headerBreakpoints.find('a').on('click', function(){
			var size = $(this).data('breakpoint-size');
			SHORTNAME.elems.headerBreakpoints.find('a').removeClass('active');
			$(this).addClass('active');
			$('.primary').attr('data-breakpoint-size', size);
		});
	};

	SHORTNAME.codeSnippets = function(){
		var codeToCreateSnippetClass = '.snippet',
			codeSnippetsClass        = '.styleguide-module__toggle-code';

		/**
		* Setup markup code snippet.
		* It gets the HTML of the element and creates the code area
		*/

		var options = {
			"indent":"auto",
			"indent-spaces":2,
			"wrap":80,
			"markup":true,
			"output-xml":false,
			"numeric-entities":true,
			"quote-marks":true,
			"quote-nbsp":false,
			"show-body-only":true,
			"quote-ampersand":false,
			"break-before-br":true,
			"uppercase-tags":false,
			"uppercase-attributes":false,
			"drop-font-tags":true,
			"tidy-mark":false,
			"quiet":"yes",
			"show-warnings":"no"
		};

		$.each($(codeToCreateSnippetClass), function(index, val) {
			// console.log($(val), val);
			var snippetClassName = codeToCreateSnippetClass.substr(1);
			var snippet = $(val)[0].outerHTML;
			$(val).before('<a href="javascript:;" class="' + codeSnippetsClass.replace('.', '') + '"></a>');
			$(val).after('<pre class="language-markup"><code>' + $('<p/>').text(snippet).html() + '</code></pre>').next().hide();
		});

		$(codeSnippetsClass).click(function(e) {
			e.preventDefault();
			var $code = $(this).next().next();
			// console.log($code);
			$code.toggle();
		});

		Prism.highlightAll();
	};

	$window.load(function() {

	});

	$window.resize(function(event) {

	});

	$(document).ready(function(){

		SHORTNAME.init();

	});

})(window.jQuery);
