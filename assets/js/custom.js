"use strict";

var select = document.querySelector('.select');
var stationName = document.querySelector('.data__name');
var stations;
var sensors;
var sensorData;
var quality;

var createSelect = function createSelect(stations) {
  stations.forEach(function (station) {
    var option = document.createElement('option');
    option.text = station.stationName;
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
  data.append('id', id);
  fetch('inc/sensor-data.php', {
    method: "POST",
    body: data
  }).then(function (response) {
    return response.text();
  }).then(function (response) {
    sensorData = JSON.parse(response);
  }).catch(function (error) {
    return console.log(error);
  });
};

var loadSensors = function loadSensors() {
  var data = new FormData();
  data.append('id', select.value);
  fetch('inc/sensors.php', {
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
  data.append('id', select.value);
  fetch('inc/quality.php', {
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

fetch('inc/stations.php', {
  method: "GET"
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
select.addEventListener('change', function () {
  loadSensors();
  loadQuality();
});