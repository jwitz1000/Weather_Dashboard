var key = "d73fae2e1ac5146d1ea6fa1f709095ec";

var cities = ["vienna", "los gatos"];

renderHistory();

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
    console.log(response);
    displayCity(response);
  });

  cities.push(currentCity);
  console.log(cities);
  saveInfo();
  renderHistory();
});

$(document).on("click", ".cityButton", function() {
  event.preventDefault();
  var currentCity = $(this).val();
  console.log(currentCity);
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    currentCity +
    "&APPID=" +
    key;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    displayCity(response);
  });
});

function displayCity(response) {
  $(".stagnentWeatherInfo").empty();
  var temp = response.main.temp;
  var wind = response.wind.speed;
  $("#cityName").text(response.name);
  $("#temp").text("Temperature is " + temp + " degrees Kelvin");
  $("#wind").text("Wind speeds of " + wind + " mph");
}

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

function saveInfo() {}
