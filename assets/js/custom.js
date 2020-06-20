"use strict";

var select = document.querySelector('.select');
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
    select.value = 129;
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

    console.log(sensorData);
    htmlText += "\n            <p class=\"data__sensor\">\n                <span data-id=\"".concat(sensors[index].param.idParam, "\">").concat(sensors[index].param.paramName, ": </span>\n                <span>").concat(value, "</span>\n            </p>\n            ");
    counter++;
    if (counter == sensors.length) dataWrapper.innerHTML = htmlText;
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
    htmlText += "<p>Sensory:</p>";
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
    htmlText += "\n            <p class=\"data__date\">\n                <span>Data pomiaru: </span>\n                <span>".concat(quality.stCalcDate, "</span>\n            </p>\n            <p class=\"data__quality\">\n                <span>Index jako\u015Bci powietrza: </span>\n                <span class=\"js-quality\">").concat(quality.stIndexLevel.indexLevelName, "</span>\n            </p>\n            ");
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