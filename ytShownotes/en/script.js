var ytShownote = {
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

var ytShownotes = [];

var error = {
	status: false,
	id: undefined,
	getStatus: function() {
		return this.status;
	},
	getId: function() {
		return '#' + this.id;
	},
	setStatus: function() {
		this.status = arguments[0];
		var obj = {}, action = ['success', 'error'];
		if (arguments[1] !== undefined) {
			obj = arguments[1];
		};
		if (arguments[2] !== undefined) {
			action = arguments[2];
		};
		if (obj !== {}) {
			this.id = obj.attr('id');
			if (action[0] !== undefined && action[1] !== undefined) {
				if (this.status) {
					obj.parent().removeClass(action[0]).addClass(action[1]);
				} else {
					obj.parent().removeClass(action[1]).addClass(action[0]);
				}
			}
		};
	}
}

function clone(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;
    var temp = new obj.constructor();
    for(var key in obj)
        temp[key] = clone(obj[key]);
    return temp;
}

$().ready(function() {
	// $('.dnlv-ytShownotes').ytShownotes();
	$('.ytShownotes').ytShownotes('click');

	$('pre').each(function(i, e) {
		hljs.highlightBlock(e,'  ');
	});

	$('#tabs a').click(function(e) {
		e.preventDefault();
		$(this).tab('show');
	});

	$('.dnlv-inputytvideoid').focusout(function() {
		if ($(this).val() == '') {
			window.error.setStatus(true,$(this));
		} else if ($(this).val().match(/^(?:(?:(?:http(?:s)?:)?\/\/)?www.)?youtube.com\/watch/gi)) {
			window.ytShownote.ytVideo.videoID = $(this).val().match(/((\?)|(\&))v=(.{11})/gi)[0];
			window.ytShownote.ytVideo.videoID = window.ytShownote.ytVideo.videoID.match(/(.{11})$/gi)[0];
			window.error.setStatus(false,$(this));
		} else if ($(this).val().match(/^(?:(?:http:)?\/\/)?youtu.be\/(.{11})$/gi)) {
			window.ytShownote.ytVideo.videoID = $(this).val().match(/(.{11})$/gi)[0];
			window.error.setStatus(false,$(this));
		} else {
			window.error.setStatus(true,$(this));
		}
	});

	$('.dnlv-inputytstart').focusout(function() {
		if ($(this).val() == '') {
			delete(window.ytShownote.ytVideo.startTime);
			window.error.setStatus(false,$(this));
		} else if ($(this).val().match(/^(\d)+:\d\d$/gi)) {
			var min, sec;
			min = Number($(this).val().match(/^(\d)+:/gi)[0].match(/(\d)+/gi)[0]);
			if (min < 0) {
				window.error.setStatus(true,$(this));
			} else {
				min = min * 60;
				sec = Number($(this).val().match(/:\d\d/gi)[0].match(/\d\d/gi)[0]);
				if (sec > 59 || sec < 0) {
					window.error.setStatus(true,$(this));
				} else {
					sec += min;
					window.ytShownote.ytVideo.startTime = sec;
					window.error.setStatus(false,$(this));
				}
			}
		} else {
			window.error.setStatus(true,$(this));
		}
	});

	$('.dnlv-inputytstop').focusout(function() {
		if ($(this).val() == '') {
			delete(window.ytShownote.ytVideo.endTime);
			window.error.setStatus(false,$(this));
		} else if ($(this).val().match(/^(\d)+:\d\d$/gi)) {
			var min, sec;
			min = Number($(this).val().match(/^(\d)+:/gi)[0].match(/(\d)+/gi)[0]);
			if (min < 0) {
				window.error.setStatus(true,$(this));
			} else {
				min = min * 60;
				sec = Number($(this).val().match(/:\d\d/gi)[0].match(/\d\d/gi)[0]);
				if (sec > 59 || sec < 0) {
					window.error.setStatus(true,$(this));
				} else {
					sec += min;
					window.ytShownote.ytVideo.endTime = sec;
					window.error.setStatus(false,$(this));
				}
			}
		} else {
			window.error.setStatus(true,$(this));
		}
	});

	$('.dnlv-inputytwidth').focusout(function() {
		if ($(this).val() == '') {
			delete(window.ytShownote.ytVideo.playerWidth);
			window.error.setStatus(false,$(this));
		} else if ($(this).val().match(/^(\d)+$/gi)) {
			var w = Number($(this).val().match(/^(\d)+$/gi)[0]);
			if (w < 0) {
				window.error.setStatus(true,$(this));
			} else {
				window.ytShownote.ytVideo.playerWidth = w;
				window.error.setStatus(false,$(this));
			}
		} else {
			window.error.setStatus(true,$(this));
		}
	});

	$('.dnlv-inputytheight').focusout(function() {
		if ($(this).val() == '') {
			delete(window.ytShownote.ytVideo.playerHeight);
			window.error.setStatus(false,$(this));
		} else if ($(this).val().match(/^(\d)+$/gi)) {
			var h = Number($(this).val().match(/^(\d)+$/gi)[0]);
			if (h < 0) {
				window.error.setStatus(true,$(this));
			} else {
				window.ytShownote.ytVideo.playerHeight = h;
				window.error.setStatus(false,$(this));
			}
		} else {
			window.error.setStatus(true,$(this));
		};
	});

	$('.dnlv-inputytcaption').focusout(function() {
		if ($(this).val() === '') {
			window.error.setStatus(true,$(this));
		} else {
			window.ytShownote.ytVideo.caption = $(this).val();
			window.ytShownote.ytVideo.caption = window.ytShownote.ytVideo.caption.replace('<','&lt;','gi');
			window.ytShownote.ytVideo.caption = window.ytShownote.ytVideo.caption.replace('>','&gt;','gi');
			window.error.setStatus(false,$(this));
		};
	});

	$('.dnlv-addToList').click(function() {
		if (window.error.getStatus() !== true) {
			$('.dnlv-inputytvideoid').focusout();
		};
		if (window.error.getStatus() !== true) {
			$('.dnlv-inputytstart').focusout();
		};
		if (window.error.getStatus() !== true) {
			$('.dnlv-inputytstop').focusout();
		};
		if (window.error.getStatus() !== true) {
			$('.dnlv-inputytcaption').focusout();
		};
		if (window.error.getStatus() === true && window.error.getId() !== undefined) {
			$(window.error.getId()).focus();
		} else if (window.error.getStatus() === true) {
			// nothing
		} else {
			window.ytShownotes.push(window.clone(window.ytShownote));
			var a = $().ytShownotes('getHTML',[window.ytShownote],'span','dnlv-ytShownotes',false);
			var b = (window.ytShownote.ytVideo.startTime !== undefined) ? window.ytShownote.ytVideo.startTime + ' sec.' : '';
			var c = (window.ytShownote.ytVideo.endTime !== undefined) ? window.ytShownote.ytVideo.endTime + ' sec.' : '';
			var d = '<tr class="info"><td class="span6">' + a + '</td><td class="span1">' + b + '</td><td class="span1">' + c + '</td><td class="span1"><div class="btn btn-danger btn-mini dnlv-delete">delete</div></td></tr>';
			$('table.dnlv-list > tbody').append(d);
			$('.dnlv-ytShownotes').ytShownotes();
			$('.dnlv-delete').unbind('click');
			$('.dnlv-delete').click(function() {
				window.ytShownotes.splice($(this).parent().parent().index(),1);
				$(this).parent().parent().remove();

			});
		};
	});

	$('.dnlv-preview').click(function() {
		if (window.error.getStatus() !== true) {
			$('.dnlv-inputytvideoid').focusout();
		};
		if (window.error.getStatus() !== true) {
			$('.dnlv-inputytstart').focusout();
		};
		if (window.error.getStatus() !== true) {
			$('.dnlv-inputytstop').focusout();
		};
		if (window.error.getStatus() === true && window.error.getId() !== undefined) {
			$(window.error.getId()).focus();
		} else if (window.error.getStatus() === true) {
			// nothing
		} else {
			$().ytShownotes('addPlayer',window.ytShownote);
		};
	});

	$('.dnlv-clear').click(function() {
		window.ytShownote = {};
		$('.dnlv-inputytvideoid').val('').parent().removeClass('success').removeClass('error');
		$('.dnlv-inputytstart').val('').parent().removeClass('success').removeClass('error');
		$('.dnlv-inputytstop').val('').parent().removeClass('success').removeClass('error');
		$('.dnlv-inputytwidth').val('').parent().removeClass('success').removeClass('error');
		$('.dnlv-inputytheight').val('').parent().removeClass('success').removeClass('error');
		$('.dnlv-inputytcaption').val('').parent().removeClass('success').removeClass('error');
	});

	$('.dnlv-inputyttag').focusout(function() {
		if ($(this).val() == '') {
			window.error.setStatus(false,$(this));
		} else if ($(this).val().match(/^([a-z])+$/gi)) {
			window.error.setStatus(false,$(this));
		} else {
			window.error.setStatus(true,$(this));
		}
	});

	$('.dnlv-inputyttagclass').focusout(function() {
		if ($(this).val() == '') {
			window.error.setStatus(false,$(this));
		} else if ($(this).val().match(/^(( )*|[a-z]*|[0-9]*)+$/gi)) {
			window.error.setStatus(false,$(this));
		} else {
			window.error.setStatus(true,$(this));
		}
	});

	$('.dnlv-getSource').click(function() {
		if (window.error.getStatus() !== true) {
			$('.dnlv-inputyttag').focusout();
		};
		if (window.error.getStatus() !== true) {
			$('.dnlv-inputyttagclass').focusout();
		};
		if (window.error.getStatus() === true && window.error.getId() !== undefined) {
			$(window.error.getId()).focus();
		} else if (window.error.getStatus() === true) {
			// nothing
		} else {
			// var tag = ($('.dnlv-inputyttag').val() === '') ? null : $('.dnlv-inputyttag').val();
			var s = $().ytShownotes(
				'getHTML',
				window.ytShownotes,
				($('.dnlv-inputyttag').val() === '') ? undefined : $('.dnlv-inputyttag').val(),
				($('.dnlv-inputyttagclass').val() === '') ? undefined : $('.dnlv-inputyttagclass').val(),
				true
			);
			$('.dnlv-sourceCode').empty();
			$('.dnlv-sourceCode').append('<pre class="xml">' + s + '</pre>');
			$('.dnlv-sourceCode > pre').each(function(i, e) {
				hljs.highlightBlock(e,'  ');
			});
		};
	});

	$('.dnlv-clearSource').click(function() {
		$('.dnlv-sourceCode').empty();
	});
});