var _pathToRoot = "../../";
(function($) {
	skel.init({
		reset: 'full',
		containers: '100%',
		breakpoints: {
			'max': { range: '*', href: _pathToRoot + 'css/style.css', viewport: { scalable: false } },
			'wide': { range: '-2270', href: _pathToRoot + 'css/style-wide.css' },
			'normal': { range: '-1700', href: _pathToRoot + 'css/style-normal.css' },
			'narrow': { range: '-1310', href: _pathToRoot + 'css/style-narrow.css' },
			'narrower': { range: '-1000', href: _pathToRoot + 'css/style-narrower.css' },
			'mobile': { range: '-756', href: _pathToRoot + 'css/style-mobile.css' },
			'mobile-narrow': { range: '-590', href: _pathToRoot + 'css/style-mobile-narrow.css' }
		}
	});

	skel.change(function() {
		if (skel.isActive('narrower') || skel.isActive('mobile') || skel.isActive('mobile-narrow')) {
		/* Turn on feature for small displays */

		} else {
		/* Turn off feature for small displays */
		
		}
	});

	$(function() {
		var	$window = $(window),
			$body = $('body'),
			$header = $('#header');


		var settings = {

			// Fullscreen?
				fullScreen: true
				
		};		
			// Resize.
				var resizeTimeout, resizeScrollTimeout;
				
				$window.resize(function() {

					// Disable animations/transitions.
						$body.addClass('is-loading');

					window.clearTimeout(resizeTimeout);

					resizeTimeout = window.setTimeout(function() {

						// Resize fullscreen fixed elements.
							if (settings.fullScreen) {
								$('.fullscreen-fixed').css('height', $window.height());	
							}

						// Re-enable animations/transitions.
							window.setTimeout(function() {
								$body.removeClass('is-loading');
								$window.trigger('scroll');
							}, 0);

					}, 100);

				});
				
		// Trigger events on load.
			$window.load(function() {
				
				$window
					.trigger('resize')
					.trigger('scroll');
			
				formatScreenings();
				
			});
				
		// Trigger events on scroll.
			$window.scroll(function() {
				var sWindow = $window.scrollTop();

				var cPos = "center " +  -1 * sWindow/3 + "px";
				$(".top-image").css("background-position", cPos);
			});


		if ($('.top-image')[0]) {
			$('.top-image').waitForImages({
				finished: function() {
				    $('.top-image').delay(390).animate({opacity:1}, {duration:980, easing:'easeInOutQuart'});
				    $('.main').delay(1220).animate({opacity:1}, {duration:930, easing:'easeInOutQuad'});
				},
				each: function() {
				   
				},
				waitForAll: true
			});
		} else {
			$('.main').delay(1220).animate({opacity:1}, {duration:930, easing:'easeInOutQuad'});
		}

		initHoverStates();
		initClickEvents();

	});

})(jQuery);

var _windowTop;

function initHoverStates() {
	$("#citiesmenu li").bind("mouseenter", function() {
		$(this).stop().animate({color:"#076f91"}, {duration:360, easing:"easeOutQuart"});
	});

	$("#citiesmenu li").bind("mouseleave", function() {
		$(this).stop().animate({color:"#5a5b64"}, {duration:360, easing:"easeOutQuart"});
	});

	$(".openscreening").bind("mouseenter", function() {
		$(this).find(".screeningdetails").stop().animate({color:"#134151"}, {duration:360, easing:"easeOutQuart"});
	});

	$(".openscreening").bind("mouseleave", function() {
		$(this).find(".screeningdetails").stop().animate({color:"#5a5b64"}, {duration:360, easing:"easeOutQuart"});
	});

	$(".track").bind("mouseenter", function() {
		$(this).stop().animate({color:"#134151"}, {duration:360, easing:"easeOutQuart"});
	});

	$(".track").bind("mouseleave", function() {
		if (!$(this).hasClass("playing"))
			$(this).stop().animate({color:"#5a5b64"}, {duration:360, easing:"easeOutQuart"});
	});

	$(".closedscreening").bind("mouseenter", function() {
		$(this).find(".closedscreeningtext").animate({opacity:1}, {duration:250, easing:"easeOutQuart"});
		$(this).find(".screeningdetails").animate({opacity:0}, {duration:250, easing:"easeOutQuart"});
	});

	$(".closedscreening").bind("mouseleave", function() {
		$(this).find(".closedscreeningtext").animate({opacity:0}, {duration:250, easing:"easeOutQuart"});
		$(this).find(".screeningdetails").animate({opacity:1}, {duration:250, easing:"easeOutQuart"});
	});
}


function initClickEvents() {
	$("li.track").bind("click", function() {
		$("li.playing").removeClass("playing").stop().animate({color:"#5a5b64"}, {duration:360, easing:"easeOutQuart"});
		$(this).addClass("playing").stop().animate({color:"#134151"}, {duration:360, easing:"easeOutQuart"});
		loadTrack($("span.track-title", this).text(), $("span.track-artist", this).text(), $(this).index() + 1);
	});

	$("#citiesmenu li").bind("click", function() {
		$(this).unbind("mouseleave");
		$(this).removeClass("linked");
		$(this).siblings().addClass("linked");
		$(this).siblings().bind("mouseleave", function() {
			$(this).stop().animate({color:"#5a5b64"}, {duration:360, easing:"easeOutQuart"});
		});
		$(this).siblings().stop().animate({color:"#5a5b64"}, {duration:360, easing:"easeOutQuart"});
		$(".screeningcity").addClass("displaynone");
		$(".screeningcity").eq($(this).index()).removeClass("displaynone");
	});

	$(".openscreening").bind("click", function() {
		showRSVP($(this).attr("id"));
	});

	$("#close-overlay").bind("click", function() {
		closeOverlay();
	});

	$(".comingsoonlink a").bind("click", function(e) {
		e.preventDefault();
	});

	$("#mobile-nav-button").bind("click", function(e) {
		showMobileMenu();
	});

	$("#movies-nav-container li:has(ul)").doubleTapToGo();
}

function formatScreenings() {	
	var maxHeight = 0;

	$('.screeningcity').each(function(){
	   if ($(this).height() > maxHeight) { maxHeight = $(this).height(); }
	});

	$('.screeningcity').height(maxHeight);	

	$('#citiesmenu li').eq(0).mouseenter().click();
}

function loadTrack(trackTitle, composer, trackNumber) {	
	var ie = skel.vars.IEVersion;

	if (_currentTrack != trackNumber && ie != 99) {
		var srcTag1 = document.getElementById("audio-src-1");
		var srcTag2 = document.getElementById("audio-src-2");
		srcTag1.setAttribute("src", _audioPath + trackNumber + ".mp3");
		srcTag2.setAttribute("src", _audioPath + trackNumber + ".ogg");
	} else if (_currentTrack != trackNumber) {	
		$(".audio-1").eq(0).html(
			"<source src=\"" + _audioPath + trackNumber + ".mp3\" type=\"audio/mpeg\" />" + 
			"<source src=\"" + _audioPath + trackNumber + ".ogg\" type=\"audio/ogg\" />");
	}
		
	
	$(".track-info").delay(0).animate({opacity:0}, {duration:80, easing:"easeInOutSine", complete: function () {
		$(".track-info").html("<strong>" + trackTitle + "</strong><br />" + composer);
		if ($(".track-info").width() < $(".track-info strong").width())
			$(".track-info").html("<strong>" + trackTitle + "</strong><br />" + composer + "<img src=\"../../images/fade-right.png\">");
		$(".track-info").delay(100).animate({opacity:1}, {duration:210, easing:"easeInOutSine"});
	}});
	var audio = document.getElementsByClassName("audio-1");
	audio[0].load();
	if (_currentTrack != "begin")
		audio[0].play();
	audio[0].addEventListener("ended", playNextTrack);
	_currentTrack = trackNumber;
}

function playNextTrack() {
	var numSongs = $("li.track").length;
	
	if (_currentTrack == numSongs) {
		_currentTrack = "begin";
		$("li.track").eq(0).click();
	} else
		$("li.track").eq(_currentTrack).click();
}

function showOverlay(overlayContent) {
	$("#close-overlay").removeClass("displaynone").css({cursor:"pointer"});
	$("#close-overlay").delay(130).animate({opacity:1}, {duration:410, easing:"easeInOutExpo"});

	$("#fullscreen-overlay").removeClass("displaynone").scrollTop(0);
	$("#fullscreen-overlay").delay(130).animate({opacity:1}, {duration:410, easing:"easeInOutExpo"});

	if (overlayContent == "rsvp") {
		_windowTop = $(window).scrollTop();
		$("html, body").delay(541).animate({scrollTop:0}, {duration:0, complete:function () {
			$("#fullscreen-overlay").css({position:"absolute", height:"auto"});
			$("html, body").css({overflow:"hidden"});
			$(".main, .top-image").css({visibility:"hidden"});
		}});
	} else {
		$("html, body").css({overflow: "hidden"});
	}
}

function closeOverlay() {
	$("#close-overlay").css({cursor:"default"});
	$("#close-overlay").delay(0).animate({opacity:0}, {duration:360, easing:"easeInOutExpo", complete:function () { 
		$("#close-overlay").addClass("displaynone");
	}});
	$("#fullscreen-overlay").delay(20).animate({opacity:0}, {duration:360, easing:"easeInOutExpo", complete:function () { 
		$("#fullscreen-overlay, #fullscreen-overlay > div").addClass("displaynone");
	}});
	$(".main, .top-image").css({visibility: "visible"});
	$("#fullscreen-overlay").css({position: "fixed", height: "100%"});
	$("html, body").css({overflow: "visible"});
	$("html, body").delay(0).animate({scrollTop:_windowTop}, {duration:0});
}

function showRSVP(screeningID) {
	$("#centered-form").removeClass("displaynone");
	showOverlay("rsvp");
	var formURL = _pathToRoot + "screeningrsvp.php?screeningid=" + screeningID + "&filmid=" + _filmID;
	$("#rsvp-frame").attr("src", formURL);
}

function showMobileMenu() {
	$("#movies-nav-container-mobile").removeClass("displaynone");
	showOverlay();
}
















