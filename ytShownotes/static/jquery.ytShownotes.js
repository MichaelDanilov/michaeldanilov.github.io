/*
* jQuery ytShownotes Plugin 0.4.0
* https://github.com/MichaelDanilov/jQuery.ytShownotes
*
* Copyright 2013, Michael Danilov
* http://danilov.me
*
* Licensed under the MIT license:
* http://www.opensource.org/licenses/MIT
* ./LICENSE
*/

var iframe_api = document.createElement('script');
	iframe_api.type = 'text/javascript';
	iframe_api.src = '//www.youtube.com/iframe_api';
document.getElementsByTagName('head')[0].appendChild(iframe_api);

var constants = {
	ytPlayer: {
		wrapper: 'ytShownotesWrapper',
		place: 'ytShownotesPlayer'
	},
	ytVideo: {
		videoID: '00000000000',
		// startTime: '0',
		// endTime: '60',
		playerWidth: '640',
		playerHeight: '360',
		caption: '',
	}
};

var methods = {
	addPlayer:function(options) {
		options = $.extend(true, {}, constants, options);
		$('#' + options.ytPlayer.place).remove();
		$('#' + options.ytPlayer.wrapper).append('<div id="' + options.ytPlayer.place + '"></div>');
		window.yt_player = new YT.Player(
			options.ytPlayer.place,
			{
				height: String(options.ytVideo.playerHeight),
				width: String(options.ytVideo.playerWidth),
				playerVars: {
					'rel': 0,
					'showinfo':	0,
					'hidecontrols': 1
				},
				events: {
					'onReady': function(e) {
						e.target.cueVideoById(
							{
								videoId: String(options.ytVideo.videoID),
								startSeconds: options.ytVideo.startTime,
								endSeconds: options.ytVideo.endTime
							}
						);
						e.target.playVideo();
					}
				}
			}
		);
		return this;
	},
	click:function(params) {
		this.unbind('click.ytShownotes');

		return this.bind('click.ytShownotes',function() {
			var data = {
				ytVideo: {
					videoID: $(this).data('ytvideoid'),
					startTime: $(this).data('ytstarttime'),
					endTime: $(this).data('ytendtime'),
					playerWidth: $(this).data('ytplayerwidth'),
					playerHeight: $(this).data('ytplayerheight')
				}
			}
			methods.addPlayer($.extend(true, data, params));
		});
	},
	getHTML:function() {
		var list = arguments[0], tag, tagClass, safe = false;
		if (arguments[1] === undefined) {
			tag = 'div';
		};
		if (arguments[2] === undefined) {
			tagClass = 'ytShownotes';
		} else {
			tagClass = arguments[2].replace(/( )+/gi,' ');
		};
		if (arguments[3] !== undefined) {
			safe = arguments[3];
		};
		var html = '';
		for (var i = 0; i < list.length; i++) {
			html += '<' + tag + ' class="' + tagClass + '"';
			if (list[i].ytVideo.videoID !== undefined) {
				html += ' data-ytvideoid="' + list[i].ytVideo.videoID + '"';
			};
			if (list[i].ytVideo.startTime !== undefined) {
				html += ' data-ytstarttime="' + list[i].ytVideo.startTime + '"';
			};
			if (list[i].ytVideo.endTime !== undefined) {
				html += ' data-ytendtime="' + list[i].ytVideo.endTime + '"';
			};
			if (list[i].ytVideo.playerWidth !== undefined) {
				html += ' data-ytplayerwidth="' + list[i].ytVideo.playerWidth + '"';
			};
			if (list[i].ytVideo.playerHeight !== undefined) {
				html += ' data-ytplayerheight="' + list[i].ytVideo.playerHeight + '"';
			};
			html += '>' + list[i].ytVideo.caption;
			html += '</' + tag + '>\n';
		}
		if (safe) {
			html = html.replace('<', '&lt;', 'gi');
			html = html.replace('>', '&gt;', 'gi');
		};
		return html;
	}
};

(function($) {
	$.fn.ytShownotes = function(method) {
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( !method ) {
			return methods.click.apply( this, arguments );
		} else if ( typeof method === 'object') {
			return methods.addPlayer.apply( this, arguments );
		} else if ( typeof method === 'array') {
			return methods.getHTML.apply( this, arguments );
		} else {
			$.error( 'Method "' +  method + '" is not exist in jQuery.ytShownotes plugin.' );
		}
	};
}(jQuery));