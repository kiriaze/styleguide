function parseVideoURL(url) {

	function getParm(url, base) {
		var re = new RegExp("(\\?|&)" + base + "\\=([^&]*)(&|$)");
		var matches = url.match(re);
		if (matches) {
			return(matches[2]);
		} else {
			return("");
		}
	}

	var retVal = {};
	var matches;

	if ( url.indexOf("youtube.com/watch") != -1 ) {
		retVal.provider = "youtube";
		retVal.id = getParm(url, "v");
	} else if (matches = url.match(/vimeo.com\/(\d+)/)) {
		retVal.provider = "vimeo";
		retVal.id = matches[1];
	}
	return(retVal);
}

$('.video').each(function() {

	var $this     = $(this);

	var videoSrc  = parseVideoURL( $(this).find('.video-player').attr('href') );
	var id        = videoSrc.id;
	var provider  = videoSrc.provider;
	var src       = '';
	var thumb_url = '';

	switch(provider) {

		case 'youtube':
			// console.log('youtube');
	    	src = '//www.youtube.com/embed/'+ id +'?autoplay=1&autohide=2&border=0&wmode=opaque&enablejsapi=1&controls=0&showinfo=0';
			thumb_url = '//i.ytimg.com/vi/' + id + '/hqdefault.jpg';
			$(this).find('.video-thumb').attr('src', thumb_url);
			break;

		case 'vimeo':
			// console.log('vimeo');
	    	src = '//player.vimeo.com/video/' + id + '?portrait=0&title=0&color=bf1f48&badge=0&byline=0&autoplay=1';

			var url = 'http://www.vimeo.com/api/v2/video/' + id + '.json?callback=?';

			var foo = $.getJSON( url, {
				format: 'json'
			})
				.done(function( data ) {
					thumb_url = data[0].thumbnail_large;
					$this.find('.video-thumb').attr('src', thumb_url);
					// console.log(thumb_url,console.log($this));
				});
			break;

		default:
			break;
	}

	$(this).on('click', function() {
	    $(this).append('<iframe src="'+ src +'" frameborder="0" allowfullscreen></iframe>').css('background', 'none');
	});

});
