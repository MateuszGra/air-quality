"use strict";

var select = document.querySelector('.search__select');
var stationName = document.querySelector('.data__name');
var htmlText = "";
var dataWrapper = document.querySelector('.data');
var counter = 0;
var stations;
var sensors;
var quality;

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

var loadSelectValue = function loadSelectValue() {
  if (localStorage.getItem('station') != null) {
    select.value = localStorage.getItem('station');
  } else {
    select.value = 117;
  }

  localStorage.setItem('station', select.value);
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
      htmlText += "\n            <div class=\"sensor\">\n                <p>\n                    <span class=\"sensor__label\" data-id=\"".concat(sensors[index].param.idParam, "\">").concat(sensors[index].param.paramName, ": </span>\n                    <span>").concat(value, " ").concat(unit, "</span>\n                </p>\n                <div class=\"sensor__row\">\n                    <div class=\"sensor__bar\">\n                        <div class=\"sensor__indicator ").concat(color, "\" style=\"width: ").concat(percent, "%\"></div>\n                    </div>\n\n                    <span class=\"sensor__percent ").concat(color, "\" >").concat(percent, "%</span>\n                </div>\n            </div>\n            ");
    }

    counter++;

    if (counter == sensors.length) {
      htmlText += "</div>";
      dataWrapper.innerHTML = htmlText;
    }
  }).catch(function (error) {
    return console.log(error);
  });
};

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
    htmlText += "<div class=\"box box--right\">";
    sensors.forEach(function (sensor, index) {
      loadSensorData(sensor.id, index);
    });
  }).catch(function (error) {
    return console.log(error);
  });
};

var loadQuality = function loadQuality() {
  dataWrapper.innerHTML = '<div class="loader"></div>';
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

    htmlText += "\n            <div class=\"box box--left\">\n                <p>\n                    <span>Indeks jako\u015Bci powietrza:</span>\n                    <span class=\"quality ".concat(color, "\">").concat(quality.stIndexLevel.indexLevelName, "</span>\n                </p>\n                <p>\n                    <span>Data pomiaru:</span>\n                    <span class=\"date\">").concat(quality.stCalcDate, "</span>\n                </p>\n            </div>\n            ");
    loadSensors();
  }).catch(function (error) {
    return console.log(error);
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

loadStacions();
select.addEventListener('change', function () {
  localStorage.setItem('station', select.value);
  htmlText = "";
  counter = 0;
  loadQuality();
});
"use strict";

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
};

if (localStorage.getItem('theme') === 'theme-dark') {
  setTheme('theme-dark');
  themeBtn.classList.add('active');
} else {
  setTheme('theme-light');
  themeBtn.classList.remove('active');
}

themeBtn.addEventListener('click', toggleTheme);