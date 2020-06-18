"use strict";

var select = document.querySelector('.select');
var stationName = document.querySelector('.data__name');
var sensorsDOM = document.querySelector('.data__sensors');
var stations;
var sensors;
var sensorData = [];
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

var loadSensorData = function loadSensorData(id) {
  var data = new FormData();
  data.append('url', 'http://api.gios.gov.pl/pjp-api/rest/data/getData/' + id);
  fetch('inc/ajax.php', {
    method: "POST",
    body: data
  }).then(function (response) {
    return response.text();
  }).then(function (response) {
    var respObject = JSON.parse(response);
    sensorData.push(respObject);
    var value = 'brak danych';

    for (var i = 0; i < respObject.values.length; i++) {
      if (respObject.values[i].value != null) {
        value = respObject.values[i].value;
        break;
      }
    }

    sensorsDOM.innerHTML += "\n            <p class=\"data__sensor\">\n                <span>".concat(respObject.key, ": </span>\n                <span>").concat(value, "</span>\n            </p>\n            ");
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
    sensors.forEach(function (sensor) {
      loadSensorData(sensor.id);
    });
  }).catch(function (error) {
    return console.log(error);
  });
};

var loadQuality = function loadQuality() {
  var data = new FormData();
  data.append('url', 'http://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/' + select.value);
  fetch('inc/ajax.php', {
    method: "POST",
    body: data
  }).then(function (response) {
    return response.text();
  }).then(function (response) {
    quality = JSON.parse(response);
    var dateDOM = document.querySelector('.js-date');
    dateDOM.innerText = quality.stCalcDate;
    var indexLevelDOM = document.querySelector('.js-quality');
    indexLevelDOM.innerText = quality.stIndexLevel.indexLevelName;
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
    loadSensors();
    loadQuality();
  }).catch(function (error) {
    return console.log(error);
  });
};

loadStacions();
select.addEventListener('change', function () {
  localStorage.setItem('station', select.value);
  sensorsDOM.innerHTML = null;
  loadSensors();
  loadQuality();
});