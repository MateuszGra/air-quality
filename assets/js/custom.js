"use strict";

var cookies = document.querySelector('.cookies');
var cookieAccept = document.querySelector('.js-cookie-accept');

if (cookies !== null) {
  if (getCookie('cookieAccept') != 1) {
    cookies.classList.add('visible');
  }
}

if (cookieAccept !== null) {
  cookieAccept.onclick = function (e) {
    e.preventDefault();
    setCookie('cookieAccept', 1, 365);
    cookies.classList.remove('visible');
  };
}
"use strict";

console.log('map');
"use strict";

var nav = document.querySelector('.nav');

if (nav !== null) {
  var updateNav = function updateNav() {
    if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
      nav.classList.add('shrink');
    } else {
      nav.classList.remove('shrink');
    }
  };

  window.onscroll = function (e) {
    updateNav();
  };

  updateNav();
}
"use strict";

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '360',
    width: '640',
    videoId: 'vD41B2BCkCY',
    playerVars: {
      'autoplay': 1,
      'controls': 0,
      'enablejsapi': 1,
      'fs': 1,
      'iv_load_policy': 3,
      'modestbranding': 1,
      'rel': 0,
      'showinfo': 0
    }
  });
}

var playerw = document.querySelector('.player');
var playerwClose = document.querySelector('.player__close');
var play = document.querySelector('.play');

if (play !== null) {
  play.onclick = function (e) {
    e.preventDefault();
    body.classList.add('stop-scrolling');
    playerw.classList.add('visible');
    player.playVideo();
  };
}

function closePlayer() {
  body.classList.remove('stop-scrolling');
  playerw.classList.remove('visible');
  player.stopVideo();
}

if (playerwClose !== null) {
  playerwClose.onclick = function (e) {
    closePlayer();
  };
}

document.onkeyup = function (e) {
  if (e.keyCode == 27) {
    closePlayer();
  }
};
"use strict";

var popupCall = document.querySelector('a[data-popup]');
var popup = document.querySelector('.popup');
var popupClose = document.querySelector('.popup__close');

if (popupCall !== null) {
  popupCall.onclick = function (e) {
    e.preventDefault();
    body.classList.add('stop-scrolling');
    popup.classList.add('visible');
  };
}

function closePopup() {
  body.classList.remove('stop-scrolling');
  popup.classList.remove('visible');
}

if (popupClose !== null) {
  popupClose.onclick = function (e) {
    closePopup();
  };
}

document.onkeyup = function (e) {
  if (e.keyCode == 27) {
    closePopup();
  }
};
"use strict";

var jsSwiper1 = new Swiper('.js-swiper-1', {
  autoplay: 3000,
  speed: 1000,
  loop: true,
  spaceBetween: 0,
  navigation: {
    nextEl: '.js-swiper-1 .swiper-button-next',
    prevEl: '.js-swiper-1 .swiper-button-prev'
  },
  pagination: {
    el: '.js-swiper-1 .swiper-pagination',
    type: 'bullets',
    clickable: true
  }
});
var jsSwiper2 = new Swiper('.js-swiper-2', {
  init: false,
  autoplay: 3000,
  speed: 1000,
  loop: true,
  spaceBetween: 0
});

if (getWidth() < 820) {
  jsSwiper2.init();
}

window.onresize = function (e) {
  if (getWidth() < 820) {
    jsSwiper2.init();
  } else {
    jsSwiper2.destroy(false, true); // For some reason, it doesn't work after like ~ 5 screen changes
  }
};
"use strict";

/*
  Have you ever dreamed of JavaScript variables and functions you can use across multiple files?
  Put them below.
*/
var body = document.querySelector('body');

function getWidth() {
  return Math.max(document.body.scrollWidth, document.documentElement.scrollWidth, document.body.offsetWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth);
}

function getHeight() {
  return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.documentElement.clientHeight);
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];

    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }

    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }

  return "";
}