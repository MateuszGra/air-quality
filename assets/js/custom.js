"use strict";

var form = document.querySelector('.form');
var returnHTML = document.querySelector('.form-return-js');
var vError;

var createTooltip = function createTooltip(text, parent) {
  vError = document.createElement('div');
  vError.classList.add('form__tooltip');
  vError.textContent = text;
  parent.appendChild(vError);
  return false;
};

var validation = function validation() {
  var inputLabel = document.querySelector('.form__input-label');
  var checkboxLabel = document.querySelector('.form__checkbox-label');

  if (input.value == '') {
    input.focus();
    return createTooltip('To pole jest wymagane.', inputLabel);
  }

  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (!input.value.match(emailPattern)) {
    input.focus();
    return createTooltip('Błędny adres e-mail.', inputLabel);
  }

  var checkbox = document.querySelector('.form__checkbox');

  if (checkbox.checked == false) {
    return createTooltip('Wymagana zgoda', checkboxLabel);
  }

  return true;
};

var addToDataBase = function addToDataBase() {
  returnHTML.innerHTML = '';
  var email = document.querySelector('.form__input');
  var loader = document.querySelector('.form__loader');
  loader.classList.add('active');
  var data = new FormData();
  data.append('email', email.value);
  data.append('id', select.dataset.id);
  fetch('inc/subscription.php', {
    method: "POST",
    body: data
  }).then(function (response) {
    return response.text();
  }).then(function (response) {
    returnHTML.innerHTML = response;
    form.reset();
    placeholder.classList.remove('active');
    loader.classList.remove('active');
  }).catch(function (error) {
    return console.log(error);
  });
};

form.addEventListener('submit', function (e) {
  e.preventDefault();

  if (validation()) {
    addToDataBase();
  }
});
document.addEventListener('click', function () {
  if (vError) vError.remove();
});
"use strict";

var input = document.querySelector('.form__input');
var placeholder = document.querySelector('.form__placeholder');
input.addEventListener('focus', function (e) {
  placeholder.classList.add('active');
});
input.addEventListener('focusout', function (e) {
  if (input.value == '') {
    placeholder.classList.remove('active');
  }
});
"use strict";

var loadQuality = function loadQuality() {
  var loader = document.querySelector('.loader');

  if (!loader) {
    dataWrapper.innerHTML = "\n        <div class=\"loader\">\n            <img class=\"loader__cloud-1\" src=\"assets/images/Loader1.svg\">\n            <img class=\"loader__cloud-2\" src=\"assets/images/Loader2.svg\">\n        </div>";
  }

  var station = stations.filter(function (obj) {
    return obj.id == select.dataset.id;
  });
  var data = new FormData();
  data.append('url', 'http://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/' + select.dataset.id);
  fetch('inc/ajax.php', {
    method: "POST",
    body: data
  }).then(function (response) {
    return response.json();
  }).then(function (response) {
    quality = response;
    var color = '';

    switch (quality.stIndexLevel.indexLevelName) {
      case 'Bardzo dobry':
      case 'Dobry':
        color = 'font-good';
        break;

      case 'Umiarkowany':
      case 'Dostateczny':
        color = 'font-neutral';
        break;

      case 'Zły':
      case 'Bardzo zły':
        color = 'font-bad';
        break;
    }

    htmlText += "\n            <div class=\"data__wrapper\">\n                <div class=\"box box--left box-shadow\">\n                    <p class=\"station\">".concat(station[0].city.name, "</p>\n                    <p>\n                        <span>Indeks jako\u015Bci powietrza:</span>\n                        <span class=\"quality ").concat(color, "\">").concat(quality.stIndexLevel.indexLevelName, "</span>\n                    </p>\n                    <div class=\"image\"></div>\n                    <p>\n                        <span>Data pomiaru:</span>\n                        <span class=\"date\">").concat(quality.stCalcDate, "</span>\n                    </p>\n                </div>\n            ");
    loadSensors();
  }).catch(function (error) {
    return console.log(error);
  });
};
"use strict";

var sensorsData = [];

var decimal = function decimal(n, k) {
  var factor = Math.pow(10, k + 1);
  n = Math.round(Math.round(n * factor) / 10);
  return n / (factor / 10);
};

var sensorTemplate = function sensorTemplate(value, element) {
  var maxValue;
  var unit = 'µg/m3';

  switch (element.param.idParam) {
    case 1:
      maxValue = 350;
      break;

    case 3:
      maxValue = 50;
      break;

    case 5:
      maxValue = 120;
      break;

    case 6:
      maxValue = 200;
      break;

    case 8:
      maxValue = 10000;
      unit = 'mg/m3';
      break;

    case 10:
      maxValue = 5;
      break;

    case 69:
      maxValue = 25;
      break;
  }

  var percent = Math.round(value / maxValue * 100);
  var color = '';
  if (percent < 40) color = 'bg-good';else if (percent < 100) color = 'bg-neutral';else color = 'bg-bad';
  var sensor = {
    percent: percent,
    HTML: "\n        <div class=\"sensor\">\n            <p>\n                <span class=\"sensor__label\" data-id=\"".concat(element.param.idParam, "\">").concat(element.param.paramName, ": </span>\n                <span>").concat(decimal(value, 5), " ").concat(unit, "</span>\n            </p>\n            <div class=\"sensor__row\">\n                <div class=\"sensor__bar\">\n                    <div class=\"sensor__indicator ").concat(color, "\" style=\"width: ").concat(percent, "%\"></div>\n                </div>\n\n                <span class=\"sensor__percent ").concat(color, "\" >").concat(percent, "%</span>\n            </div>\n        </div>\n        ")
  };
  sensorsData.push(sensor);
};

var loadSensorData = function loadSensorData(id, index) {
  var data = new FormData();
  data.append('url', 'http://api.gios.gov.pl/pjp-api/rest/data/getData/' + id);
  fetch('inc/ajax.php', {
    method: "POST",
    body: data
  }).then(function (response) {
    return response.json();
  }).then(function (response) {
    var sensorData = response;
    var value = false;

    for (var i = 0; i < sensorData.values.length; i++) {
      if (sensorData.values[i].value != null) {
        value = sensorData.values[i].value;
        break;
      }
    }

    if (value) sensorTemplate(value, sensors[index]);
    counter++;

    if (counter == sensors.length) {
      sensorsData.sort(function (a, b) {
        return b.percent - a.percent;
      });
      sensorsData.forEach(function (sensor) {
        htmlText += sensor.HTML;
      });
      sensorsData.splice(0, sensorsData.length);
      htmlText += "\n                    </div>\n                </div>\n                ";
      dataWrapper.innerHTML = htmlText;
      switchImage();
    }
  }).catch(function (error) {
    return console.log(error);
  });
};
"use strict";

var loadSensors = function loadSensors() {
  var data = new FormData();
  data.append('url', 'http://api.gios.gov.pl/pjp-api/rest/station/sensors/' + select.dataset.id);
  fetch('inc/ajax.php', {
    method: "POST",
    body: data
  }).then(function (response) {
    return response.json();
  }).then(function (response) {
    sensors = response;
    htmlText += "<div class=\"box box--right box-shadow\">";
    sensors.forEach(function (sensor, index) {
      loadSensorData(sensor.id, index);
    });
  }).catch(function (error) {
    return console.log(error);
  });
};
"use strict";

var createSelect = function createSelect(stations) {
  stations.sort(function (a, b) {
    return a.city.name.localeCompare(b.city.name);
  });
  stations.forEach(function (station) {
    selectList.innerHTML += "<li class=\"search__list-el\" data-id=\"".concat(station.id, "\">").concat(station.city.name, "</li>");
  });
};

var loadStacions = function loadStacions() {
  dataWrapper.innerHTML = "\n    <div class=\"loader\">\n        <img class=\"loader__cloud-1\" src=\"assets/images/Loader1.svg\">\n        <img class=\"loader__cloud-2\" src=\"assets/images/Loader2.svg\">\n    </div>";
  var data = new FormData();
  data.append('url', 'http://api.gios.gov.pl/pjp-api/rest/station/findAll');
  fetch('inc/ajax.php', {
    method: "POST",
    body: data
  }).then(function (response) {
    return response.json();
  }).then(function (response) {
    stations = response;
    stations.forEach(function (station) {
      if (station.addressStreet != null) station.city.name += ' ' + station.addressStreet;
    });
    createSelect(stations);
    loadSelectValue();
    selectClose.classList.add('active');
  }).catch(function (error) {
    return console.log(error);
  });
};
"use strict";

var showBtn = document.querySelectorAll('.popup-show-js');
var closeBtn = document.querySelectorAll('.popup-close-js');

var openPopup = function openPopup(id) {
  document.body.classList.add('block');
  var popup = document.getElementById(id);
  popup.classList.add('active');
};

var closePopup = function closePopup(id) {
  document.body.classList.remove('block');
  var popup = document.getElementById(id);
  popup.classList.remove('active');
  returnHTML.innerHTML = '';
};

closeBtn.forEach(function (btn) {
  btn.addEventListener('click', function () {
    closePopup(btn.dataset.id);
  });
});
showBtn.forEach(function (btn) {
  btn.addEventListener('click', function () {
    openPopup(btn.dataset.id);
  });
});
document.addEventListener('click', function (e) {
  if (e.target.matches('.popup')) {
    closePopup(e.target.dataset.id);
  }
}, false);
document.addEventListener('keydown', function (e) {
  if (e.key == 'Escape') {
    closeBtn.forEach(function (btn) {
      closePopup(btn.dataset.id);
    });
  }
});
"use strict";

var select = document.querySelector('.search__select');
var selectList = document.querySelector('.search__list');
var searchWrapper = document.querySelector('.search');
var selectClose = document.querySelector('.search__close');

var closeSearch = function closeSearch() {
  selectList.classList.remove('active');
  searchWrapper.classList.remove('active');
};

var openSearch = function openSearch() {
  selectList.classList.add('active');
  if (selectList.firstChild) searchWrapper.classList.add('active');else searchWrapper.classList.remove('active');
  if (select.value) selectClose.classList.add('active');else selectClose.classList.remove('active');
};

select.addEventListener('click', function () {
  openSearch();
});
selectClose.addEventListener('click', function () {
  select.value = null;
  sortSelect(stations);
  openSearch();
  select.focus();
});
document.addEventListener('click', function (e) {
  if (e.target.matches('.search__list-el')) {
    select.dataset.id = e.target.dataset.id;
  }

  if (!e.target.matches('.search__select')) {
    closeSearch();
  }
}, false);

var handleArrowKey = function handleArrowKey(e) {
  e.preventDefault();
  var listEl = document.querySelectorAll('.search__list-el');

  for (var i = 0; i < listEl.length; i++) {
    if (listEl[i].classList.contains('active')) {
      listEl[i].classList.remove('active');
      var next = void 0;

      if (e.key == 'ArrowDown') {
        next = i + 1;
        if (next == listEl.length) next = 0;
      } else if (e.key == 'ArrowUp') {
        next = i - 1;
        if (next == -1) next = listEl.length - 1;
      }

      listEl[next].classList.add('active');
      listEl[next].scrollIntoView({
        block: 'nearest'
      });
      break;
    } else if (i == listEl.length - 1) {
      if (e.key == 'ArrowDown') {
        listEl[0].classList.add('active');
        listEl[0].scrollIntoView();
      } else if (e.key == 'ArrowUp') {
        listEl[listEl.length - 1].classList.add('active');
        listEl[listEl.length - 1].scrollIntoView({
          block: 'nearest'
        });
      }
    }
  }
};

document.addEventListener('keydown', function (e) {
  if (selectList.classList.contains('active')) {
    if (e.key == 'ArrowUp' || e.key == 'ArrowDown') handleArrowKey(e);

    if (e.key == 'Enter') {
      var activeEl = document.querySelector('.search__list-el.active');

      if (activeEl) {
        select.dataset.id = activeEl.dataset.id;
        closeSearch();
      } else {
        var listEl = document.querySelector('.search__list-el');
        if (listEl) select.dataset.id = listEl.dataset.id;
        closeSearch();
      }
    }

    if (e.key == 'Escape') {
      closeSearch();
    }
  } else {
    if (e.key == 'Enter') {
      var popupSub = document.querySelector('.popup[data-id="sub"]');
      var popupUnsub = document.querySelector('.popup[data-id="unsub"]');

      if (!popupSub.classList.contains('active') && !popupUnsub.classList.contains('active')) {
        select.focus();
        openSearch();
      }
    }
  }
});
document.addEventListener('mousemove', function (e) {
  var lastActive = document.querySelector('.search__list-el.active');
  if (lastActive) lastActive.classList.remove('active');
  if (e.target.matches('.search__list-el')) e.target.classList.add('active');
}, false);

var sortSelect = function sortSelect(stations) {
  var sortedStations = stations;

  if (select.value) {
    sortedStations = stations.filter(function (a) {
      return a.city.name.toLowerCase().includes(select.value.toLowerCase());
    });
    sortedStations.sort(function (a, b) {
      if (a.city.name.toLowerCase().startsWith(select.value.toLowerCase())) return -1;else if (a.city.name.toLowerCase().startsWith(select.value.toLowerCase())) return 1;
    });
  }

  var sorted = '';
  sortedStations.forEach(function (station) {
    sorted += "<li class=\"search__list-el\" data-id=\"".concat(station.id, "\">").concat(station.city.name, "</li>");
  });
  selectList.innerHTML = sorted;
};

select.addEventListener('input', function (e) {
  sortSelect(stations);
  openSearch();
});
"use strict";

var switchImage = function switchImage() {
  var wrapper = document.querySelector('.image');
  var index = quality.stIndexLevel.indexLevelName;
  var theme = '';
  if (localStorage.getItem('theme') === 'theme-dark') theme = '_Noc';

  if (index == 'Bardzo dobry' || index == 'Dobry') {
    wrapper.innerHTML = "\n            <img class=\"image__bg\" src=\"assets/images/Bardzo-dobry_Tlo".concat(theme, ".svg\"> \n            <img class=\"image__cloud\" src=\"assets/images/Bardzo-dobry_Chmurka").concat(theme, ".svg\"> \n            <img class=\"image__addition\" src=\"assets/images/Bardzo-dobry_Dodatek").concat(theme, ".svg\"> \n            ");
  } else if (index == 'Umiarkowany' || index == 'Dostateczny') {
    wrapper.innerHTML = "\n            <img class=\"image__bg\" src=\"assets/images/Umiarkowany_Tlo".concat(theme, ".svg\"> \n            <img class=\"image__cloud\" src=\"assets/images/Umiarkowany_Chmurka").concat(theme, ".svg\"> \n            ");
  } else if (index == 'Zły' || index == 'Bardzo zły') {
    wrapper.innerHTML = "\n            <img class=\"image__bg\" src=\"assets/images/Zly_Tlo".concat(theme, ".svg\"> \n            <img class=\"image__cloud\" src=\"assets/images/Zly_Chmurka").concat(theme, ".svg\"> \n            ");
  } else {
    wrapper.innerHTML = "\n            <img class=\"image__bg\" src=\"assets/images/Brak-danych_Tlo".concat(theme, ".svg\"> \n            <img class=\"image__cloud\" src=\"assets/images/Brak-danych-Chmurka").concat(theme, ".svg\"> \n            ");
  }
};
"use strict";

var themeBtn = document.querySelector('.theme-switch');

var setTheme = function setTheme(themeName) {
  localStorage.setItem('theme', themeName);
  document.documentElement.className = themeName;
};

var toggleTheme = function toggleTheme() {
  if (localStorage.getItem('theme') === 'theme-dark') {
    setTheme('theme-light');
    themeBtn.classList.remove('active');
  } else {
    setTheme('theme-dark');
    themeBtn.classList.add('active');
  }

  switchImage();
};

if (localStorage.getItem('theme') === 'theme-dark') {
  setTheme('theme-dark');
  themeBtn.classList.add('active');
} else {
  setTheme('theme-light');
  themeBtn.classList.remove('active');
}

themeBtn.addEventListener('click', toggleTheme);
"use strict";

var params = new URLSearchParams(window.location.search);
var unsubHTML = document.querySelector('.unsub-return-js');
var token = params.get('t');
var id = params.get('un');

if (token && id) {
  openPopup('unsub');
  unsubHTML.innerHTML = "\n    <div class=\"loader loader--no-margin\">\n        <img class=\"loader__cloud-1\" src=\"assets/images/Loader1.svg\">\n        <img class=\"loader__cloud-2\" src=\"assets/images/Loader2.svg\">\n    </div>";
  var data = new FormData();
  data.append('token', token);
  data.append('id', id);
  fetch('inc/unsub.php', {
    method: "POST",
    body: data
  }).then(function (response) {
    return response.text();
  }).then(function (response) {
    unsubHTML.innerHTML = response;
  }).catch(function (error) {
    unsubHTML.innerHTML = response;
  });
}
"use strict";

var select = document.querySelector('.search__select');
var stationName = document.querySelector('.data__name');
var htmlText = "";
var dataWrapper = document.querySelector('.data');
var counter = 0;
var stations;
var sensors;
var quality;

var generateSearch = function generateSearch(id) {
  var string = "?station=".concat(id);
  history.pushState(false, '', string);
};

var loadSelectValue = function loadSelectValue() {
  var params = new URLSearchParams(window.location.search);
  var station = params.get('station');

  if (station) {
    select.dataset.id = station;
  } else if (localStorage.getItem('station') != null) {
    select.dataset.id = localStorage.getItem('station');
  } else {
    select.dataset.id = 117;
  }

  localStorage.setItem('station', select.dataset.id);
};

var importStationToPopup = function importStationToPopup() {
  var popupStacion = document.querySelector('.js-station');
  var station = stations.filter(function (obj) {
    return obj.id == select.dataset.id;
  });
  popupStacion.textContent = station[0].city.name;
};

loadStacions();
var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.type == "attributes") {
      var listEl = document.querySelector(".search__list-el[data-id=\"".concat(select.dataset.id, "\"]"));

      if (listEl) {
        select.value = listEl.innerText;
        localStorage.setItem('station', select.dataset.id);
        htmlText = "";
        counter = 0;
        generateSearch(select.dataset.id);
        loadQuality();
        importStationToPopup();
      } else {
        dataWrapper.innerHTML = "<h2 class=\"error\">Brak wynik\xF3w wyszukiwania, lub stacja obecnie nie jest dost\u0119pna :(</h2>";
      }
    }
  });
});
observer.observe(select, {
  attributes: true
});