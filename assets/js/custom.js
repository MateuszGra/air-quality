"use strict";

var form = document.querySelector('.form');
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
  var email = document.querySelector('.form__input');
  var returnHTML = document.querySelector('.form__return');
  returnHTML.innerHTML = "\n    <div class=\"loader loader--margin\">\n        <img class=\"loader__cloud-1 small\" src=\"assets/images/Loader1.svg\">\n        <img class=\"loader__cloud-2 small\" src=\"assets/images/Loader2.svg\">\n    </div>";
  var data = new FormData();
  data.append('email', email.value);
  data.append('id', select.value);
  fetch('inc/subscription.php', {
    method: "POST",
    body: data
  }).then(function (response) {
    return response.text();
  }).then(function (response) {
    returnHTML.innerHTML = response;
    form.reset();
    placeholder.classList.remove('active');
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
document.addEventListener('touch', function () {
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
  dataWrapper.innerHTML = "\n    <div class=\"loader\">\n        <img class=\"loader__cloud-1\" src=\"assets/images/Loader1.svg\">\n        <img class=\"loader__cloud-2\" src=\"assets/images/Loader2.svg\">\n    </div>";
  var data = new FormData();
  data.append('url', 'http://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/' + select.value);
  fetch('inc/ajax.php', {
    method: "POST",
    body: data
  }).then(function (response) {
    return response.text();
  }).then(function (response) {
    quality = JSON.parse(response);
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

    htmlText += "\n            <div class=\"data__wrapper\">\n                <div class=\"box box--left box-shadow\">\n                    <p>\n                        <span>Indeks jako\u015Bci powietrza:</span>\n                        <span class=\"quality ".concat(color, "\">").concat(quality.stIndexLevel.indexLevelName, "</span>\n                    </p>\n                    <div class=\"image\"></div>\n                    <p>\n                        <span>Data pomiaru:</span>\n                        <span class=\"date\">").concat(quality.stCalcDate, "</span>\n                    </p>\n                </div>\n            ");
    loadSensors();
  }).catch(function (error) {
    return console.log(error);
  });
};
"use strict";

var decimal = function decimal(n, k) {
  var factor = Math.pow(10, k + 1);
  n = Math.round(Math.round(n * factor) / 10);
  return n / (factor / 10);
};

var loadSensorData = function loadSensorData(id, index) {
  var data = new FormData();
  data.append('url', 'http://api.gios.gov.pl/pjp-api/rest/data/getData/' + id);
  fetch('inc/ajax.php', {
    method: "POST",
    body: data
  }).then(function (response) {
    return response.text();
  }).then(function (response) {
    var sensorData = JSON.parse(response);
    var value = 'brak danych';

    for (var i = 0; i < sensorData.values.length; i++) {
      if (sensorData.values[i].value != null) {
        value = sensorData.values[i].value;
        break;
      }
    }

    var maxValue;
    var unit = 'µg/m3';

    switch (sensors[index].param.idParam) {
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

    if (percent < 40) {
      color = 'bg-good';
    } else if (percent < 100) {
      color = 'bg-neutral';
    } else {
      color = 'bg-bad';
    }

    if (value != 'brak danych') {
      htmlText += "\n            <div class=\"sensor\">\n                <p>\n                    <span class=\"sensor__label\" data-id=\"".concat(sensors[index].param.idParam, "\">").concat(sensors[index].param.paramName, ": </span>\n                    <span>").concat(decimal(value, 5), " ").concat(unit, "</span>\n                </p>\n                <div class=\"sensor__row\">\n                    <div class=\"sensor__bar\">\n                        <div class=\"sensor__indicator ").concat(color, "\" style=\"width: ").concat(percent, "%\"></div>\n                    </div>\n\n                    <span class=\"sensor__percent ").concat(color, "\" >").concat(percent, "%</span>\n                </div>\n            </div>\n            ");
    }

    counter++;

    if (counter == sensors.length) {
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
  data.append('url', 'http://api.gios.gov.pl/pjp-api/rest/station/sensors/' + select.value);
  fetch('inc/ajax.php', {
    method: "POST",
    body: data
  }).then(function (response) {
    return response.text();
  }).then(function (response) {
    sensors = JSON.parse(response);
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
    var option = document.createElement('option');
    option.text = station.city.name;

    if (station.addressStreet != null) {
      option.text += ' ' + station.addressStreet;
    }

    option.value = station.id;
    select.add(option);
  });
};

var loadStacions = function loadStacions() {
  var data = new FormData();
  data.append('url', 'http://api.gios.gov.pl/pjp-api/rest/station/findAll');
  fetch('inc/ajax.php', {
    method: "POST",
    body: data
  }).then(function (response) {
    return response.text();
  }).then(function (response) {
    stations = JSON.parse(response);
    createSelect(stations);
    loadSelectValue();
    loadQuality();
  }).catch(function (error) {
    return console.log(error);
  });
};
"use strict";

var showBtn = document.querySelector('.popup__btn');
var closeBtn = document.querySelector('.popup__close');
var popup = document.querySelector('.popup');

var tooglePopup = function tooglePopup() {
  return popup.classList.toggle('active');
};

closeBtn.addEventListener('click', tooglePopup);
closeBtn.addEventListener('touch', tooglePopup);
showBtn.addEventListener('click', tooglePopup);
showBtn.addEventListener('touch', tooglePopup);
document.addEventListener('click', function (e) {
  if (e.target.matches('.popup')) tooglePopup();
}, false);
document.addEventListener('keydown', function (event) {
  if (event.keyCode == 27) {
    popup.classList.remove('active');
  }
});
"use strict";

var select = document.querySelector('.search__select');
var icon = document.querySelector('.search__icon');
select.addEventListener('focusout', function () {
  icon.classList.remove('active');
});
select.addEventListener('click', function () {
  icon.classList.toggle('active');
});
select.addEventListener('touch', function () {
  icon.classList.toggle('active');
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
themeBtn.addEventListener('touch', toggleTheme);
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
  importStationToPopup();
};

var loadSelectValue = function loadSelectValue() {
  var params = new URLSearchParams(window.location.search);
  var station = params.get('station');

  if (station) {
    select.value = station;
  } else if (localStorage.getItem('station') != null) {
    select.value = localStorage.getItem('station');
  } else {
    select.value = 117;
  }

  generateSearch(select.value);
  localStorage.setItem('station', select.value);
};

var importStationToPopup = function importStationToPopup() {
  var popupStacion = document.querySelector('.js-station');
  popupStacion.textContent = select.options[select.selectedIndex].text;
};

loadStacions();
select.addEventListener('change', function () {
  localStorage.setItem('station', select.value);
  htmlText = "";
  counter = 0;
  generateSearch(select.value);
  loadQuality();
  importStationToPopup();
});