var key = "d73fae2e1ac5146d1ea6fa1f709095ec";
var m = moment();
var todayDate = moment().format("MMMM Do YYYY");
// check to see if cities array in local storage, if not, make an empty one
if (!localStorage.getItem("cities")) {
  var cities = [];
} else {
  var cities = JSON.parse(localStorage.getItem("cities"));
}

// render history list of cities
renderHistory();

// on click for search button
$(document).on("click", ".searchButton", function() {
  event.preventDefault();
  var currentCity = $("#searchBar").val();

  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    currentCity +
    "&APPID=" +
    key;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    displayCity(response);
    uvIndex(response);
    forecast(response);
  });

  cities.push(currentCity);
  saveInfo();
  renderHistory();
});

// on click for city buttons
$(document).on("click", ".cityButton", function() {
  event.preventDefault();
  var currentCity = $(this).val();
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    currentCity +
    "&APPID=" +
    key;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    displayCity(response);
    uvIndex(response);
    forecast(response);
  });
});

// displays stagnent weather stats
function displayCity(response) {
  $(".stagnentWeatherInfo").empty();
  var temp = response.main.temp;
  var wind = response.wind.speed;
  var humidity = response.main.humidity;

  $("#cityName").text(response.name + ", " + todayDate);
  $("#temp").text("Temperature is " + temp + " degrees Kelvin");
  $("#wind").text("Wind speeds of " + wind + " mph");
  $("#humidity").text("humidity of " + humidity + " units");
}

// displays UV index with other weather stats
function uvIndex(response) {
  var city = response.name;
  var lat = response.coord.lat;
  var lon = response.coord.lon;
  var queryURL =
    "http://api.openweathermap.org/data/2.5/uvi?appid=" +
    key +
    "&lat=" +
    lat +
    "&lon=" +
    lon;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);

    var UV = response.value;
    $("#UV").text("UV index: " + UV);
  });
}

// renders history cities
function renderHistory() {
  $("#newCityArea").empty();
  for (var i = 0; i < cities.length; i++) {
    var row = $("<div>");
    row.addClass("row");
    var col = $("<div>");
    row.addClass("col-sm-12");
    var element = $("<button>");
    element.text(cities[i]);
    element.addClass("cityButton");
    element.addClass("btn-primary");
    element.attr("value", cities[i]);
    col.prepend(element);
    row.prepend(col);
    $("#newCityArea").prepend(row);
  }
}

// saves cities array to local storage
function saveInfo() {
  localStorage.setItem("cities", JSON.stringify(cities));
}

function forecast(response) {
  var city = response.name;
  var lat = response.coord.lat;
  var lon = response.coord.lon;
  var queryURL =
    "http://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    key;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    for (var i = 0; i < 5; i++) {
      console.log("hey");
      var col = $("<div>");
      col.addClass = "col-sm-2";
      var card = $("<div>");
      card.addClass("card");
      var cardBody = $("<div>");
      cardBody.addClass("card-body");
      var text = $("<p>");
      text.text(response.list[i.toString()].main.temp);
      console.log(response.list[i.toString()].main.temp);
      cardBody.prepend(text);
      card.prepend(cardBody);
      col.prepend(card);
      $("#forecast").prepend(col);
    }
  });
}
