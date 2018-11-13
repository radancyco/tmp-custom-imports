/// Scripts you might need for the video script



// //
// // textfill
// //

// // Orginally from http://jquery-textfill.github.io/

// (function(m){m.fn.textfill=function(r){function f(){a.debug&&"undefined"!=typeof console&&"undefined"!=typeof console.debug&&console.debug.apply(console,arguments)}function s(){"undefined"!=typeof console&&"undefined"!=typeof console.warn&&console.warn.apply(console,arguments)}function p(a,b,e,k,n,g){function d(a,b){var c=" / ";a>b?c=" > ":a==b&&(c=" = ");return c}f("[TextFill] "+a+" { font-size: "+b.css("font-size")+",Height: "+b.height()+"px "+d(b.height(),e)+e+"px,Width: "+b.width()+d(b.width(),
// k)+k+",minFontPixels: "+n+"px, maxFontPixels: "+g+"px }")}function q(a,b,e,k,f,g,d,h){for(p(a,b,f,g,d,h);d<h-1;){var l=Math.floor((d+h)/2);b.css("font-size",l);if(e.call(b)<=k){if(d=l,e.call(b)==k)break}else h=l;p(a,b,f,g,d,h)}b.css("font-size",h);e.call(b)<=k&&(d=h,p(a+"* ",b,f,g,d,h));return d}var a=m.extend({debug:!1,maxFontPixels:40,minFontPixels:4,innerTag:"span",widthOnly:!1,success:null,callback:null,fail:null,complete:null,explicitWidth:null,explicitHeight:null,changeLineHeight:!1},r);f("[TextFill] Start Debug");
// this.each(function(){var c=m(a.innerTag+":visible:first",this),b=a.explicitHeight||m(this).height(),e=a.explicitWidth||m(this).width(),k=c.css("font-size"),n=parseFloat(c.css("line-height"))/parseFloat(k);f("[TextFill] Inner text: "+c.text());f("[TextFill] All options: ",a);f("[TextFill] Maximum sizes: { Height: "+b+"px, Width: "+e+"px }");var g=a.minFontPixels,d=0>=a.maxFontPixels?b:a.maxFontPixels,h=void 0;a.widthOnly||(h=q("Height",c,m.fn.height,b,b,e,g,d));var l=void 0,l=q("Width",c,m.fn.width,
// e,b,e,g,d);a.widthOnly?(c.css({"font-size":l,"white-space":"nowrap"}),a.changeLineHeight&&c.parent().css("line-height",n*l+"px")):(g=Math.min(h,l),c.css("font-size",g),a.changeLineHeight&&c.parent().css("line-height",n*g+"px"));f("[TextFill] Finished { Old font-size: "+k+", New font-size: "+c.css("font-size")+" }");c.width()>e||c.height()>b&&!a.widthOnly?(c.css("font-size",k),a.fail&&a.fail(this),f("[TextFill] Failure { Current Width: "+c.width()+", Maximum Width: "+e+", Current Height: "+c.height()+
// ", Maximum Height: "+b+" }")):a.success?a.success(this):a.callback&&(s("callback is deprecated, use success, instead"),a.callback(this))});a.complete&&a.complete(this);f("[TextFill] End Debug");return this}})(window.jQuery);

// //
// // Video Scripts
// //

// // This pattern will rip out the video id of any youtube video
// var youtubeRegex = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/ytscreeningroom\?v=|\/feeds\/api\/videos\/|\/user\S*[^\w\-\s]|\S*[^\w\-\s]))([\w\-]{11})[?=&+%\w-]*/ig;

// // This pattern will rip out the video id of any viemeo video
// var vimeoRegex = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;

// // Get and set placeholder images

// function embedVideoImageholder() {
//   var _this = $(this);
//   var placeholderImage = _this.attr('data-placeholder');
//   var videoUrl = _this.attr('href');
//   var videoId = '';

//   // If video is a youtube video
//   // youtu is required for in case youtu.be is used
//   if ( matches("youtu", videoUrl) ) {
//     videoId = videoUrl.replace(youtubeRegex, '$1');

//   // If video is a viemo video
//   } else if ( matches("vimeo", videoUrl) ) {
//     videoId = videoUrl.replace(vimeoRegex, '$3');
//     //  console.log('viemo video ' + videoId);
//   }

//   if ( typeof placeholderImage === 'undefined') {
//     placeholderImage = 'no-placeholder';
//   }

//   // If placeholder image works use it, if it doesn't and it is a youtube video use youtube thumbnail
//   UrlExists(placeholderImage, function(status) {
//       if( matches("https", placeholderImage) && status === 200 || matches("https", placeholderImage) && status === 304 ) {
//         // file was found
//         console.log( 'file found ' + placeholderImage );
//         _this.css( 'background-image', 'url(' + placeholderImage + ')' );
//       }
//       else {
//         // File not found or other error
//         console.log('file NOT found');

//         // if youtube grab youtube thumbnail
//         if ( matches("youtu", videoUrl) ) {
//           console.log('Getting Youtube Image');
//           _this.css( 'background-image', 'url(https://img.youtube.com/vi/' + videoId + '/maxresdefault.jpg)' );
//         // if viemo grab viemo thumbnail
//         } else if ( matches("vimeo", videoUrl) ) {

//           console.log('Getting Vimeo Image');
//           $.getJSON('https://www.vimeo.com/api/v2/video/' + videoId + '.json?callback=?', {format: "json"}, function(data) {

//               _this.css( 'background-image', 'url(' + data[0].thumbnail_large + ')' );
//           });

//         } else {
//           _this.css( 'background-image', 'url(https://via.placeholder.com/1600x900/c00c00/ffffff?text=Missing-placeholder-image)' );
//         }
//       }

//   });

// }

// // Play Video

// function embedVideoPlay(e) {
//   e.preventDefault();
//   var _this = $(this);
//   var videoClass = _this.attr('class');
//   var videoUrl = _this.attr('href');
//   var videoId = '';

//   // if youtube
//   if ( matches("youtu", videoUrl) ) {
//     videoId = videoUrl.replace(youtubeRegex, '$1');
//     _this.wrapInner('<div>').children().unwrap().addClass(videoClass).html('<iframe class="embed-video__player" src="https://www.youtube.com/embed/' + videoId + '?rel=0&autoplay=1&showinfo=0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');

//   // if viemo
//   } else if ( matches("vimeo", videoUrl) ) {
//     videoId = videoUrl.replace(vimeoRegex, '$3');
//     _this.wrapInner('<div>').children().unwrap().addClass(videoClass).html('<iframe class="embed-video__player" src="https://player.vimeo.com/video/' + videoId + '?autoplay=1&title=0&byline=0&portrait=0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');

//   } else if ( matches(".mp4", videoUrl) ) {

//     _this.wrapInner('<div>').children().unwrap().addClass(videoClass).html('<video class="embed-video__player" id="active-video" controls autoplay><source src="' + videoUrl + '?autoplay=1" type="video/mp4"></video>');

//   // If href is not youtube, viemo nor an MP4 just open link
//   } else {
//     window.location = _this.attr('href');
//   }
// }

// // On load run these scripts on each video
// $('.embed-video').each( embedVideoImageholder );
// $('.embed-video').on( 'click', embedVideoPlay );


// Video popup on page load
// Requires fancybox3

var playvideo = getParameter("playvideo", url);


if ( matches("?custom-debug", url) ) {
  console.log("CI Debug - Video Script URL playvideo param: " + playvideo)
}


// url video trigger
if ( playvideo ) {
    $('.js-ci-video[data-video-name="' + playvideo + '"]').click()
}
