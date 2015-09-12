var introduction = require('../../modules/01_introduction/introduction.js');
require('./plugins/prism.js');

(function($){

	// console.log('modules loaded');

	// SimpleAnchors
	$.simpleAnchors({
		offset: 75,
		easing: 'easeInOutCubic',
		autoBuild: true,
		sections: '.styleguide-module__title',	// the elements auto build targets to generate links from
		sectionEl: 'section class="module"',             // the elements auto build searchs for the section arg
		wrapper: '#main',              // wrapper of all the auto build sections
		navEl: '#nav'
	});

	// overwrite scrolling function of simpleAnchors because of iframe
	$('[data-scroll-to]').on('click',function(){
		var target = $(this).data('scroll-to'),
			dest = $('[data-scroll-target=' + target + ']');
		$('html, body').animate({
			scrollTop: dest.offset().top
		}, 800, 'easeInOutCubic');
	});

	// overwrite scrollspy of simpleAnchors for iframe
	$(window).scroll(function() {

		var scrollPos = $(window).scrollTop();


		$('[data-scroll-target]').each(function() {

			var currLink = $(this).data('scroll-target');

			if (
				( $(this).position().top <= scrollPos ) &&
				( $(this).position().top + $(this).outerHeight() > scrollPos )
			) {
				$('[data-scroll-to="'+ currLink +'"]', parent.document.body).addClass('active');
			} else {
				$('[data-scroll-to="'+ currLink +'"]', parent.document.body).removeClass('active');
			}


		});

	});

	var codeSnippets = function(){
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

	codeSnippets();

})(window.jQuery);
