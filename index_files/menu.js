var _____WB$wombat$assign$function_____=function(name){return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name))||self[name];};if(!self.__WB_pmw){self.__WB_pmw=function(obj){this.__WB_source=obj;return this;}}{
let window = _____WB$wombat$assign$function_____("window");
let self = _____WB$wombat$assign$function_____("self");
let document = _____WB$wombat$assign$function_____("document");
let location = _____WB$wombat$assign$function_____("location");
let top = _____WB$wombat$assign$function_____("top");
let parent = _____WB$wombat$assign$function_____("parent");
let frames = _____WB$wombat$assign$function_____("frames");
let opens = _____WB$wombat$assign$function_____("opens");
$(function() {

        $(window).scroll(function() {
            var scroll = getCurrentScroll();
            if (scroll >= shrinkHeader) {
                $('.topmenu').addClass('shrink');
            } else {
                $('.topmenu').removeClass('shrink');
            }
        });

    });
	
	function getCurrentScroll() {
        return window.pageYOffset || document.documentElement.scrollTop;
    }
	
  
$(document).ready(function () {
	shrinkHeader = 100;

	$(".topmenu").mouseenter(function () {
		$('.topmenu').removeClass('shrink');
	}).mouseleave(function () {
		var scroll = getCurrentScroll();
		if (scroll >= shrinkHeader) {
			$('.topmenu').addClass('shrink');
		}

	});

	$(".menu-button").click(function () {
		$('.overlay').toggle("blind");

		//$(".overlay").fadeToggle(200);
		$(this).toggleClass('btn-open').toggleClass('btn-close');
	});
});

$('.overlay').on('click', function () {
	//$(".overlay").fadeToggle(200);
	$('.overlay').toggle("blind");
	$(".menu-button").toggleClass('btn-open').toggleClass('btn-close');
	open = false;
});	
}
/*
     FILE ARCHIVED ON 11:32:40 Aug 06, 2022 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 03:13:36 Dec 17, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.593
  exclusion.robots: 0.021
  exclusion.robots.policy: 0.008
  esindex: 0.012
  cdx.remote: 14.001
  LoadShardBlock: 77.695 (3)
  PetaboxLoader3.datanode: 135.059 (5)
  load_resource: 104.251
  PetaboxLoader3.resolve: 37.385
  loaddict: 32.854
*/