var key = "d73fae2e1ac5146d1ea6fa1f709095ec";
var m = moment();
var todayDate = moment().format("MMMM Do YYYY");
var dayTwo = moment()
  .add(1, "d")
  .format("MMMM Do YYYY");
var dayThree = moment()
  .add(2, "d")
  .format("MMMM Do YYYY");
var dayFour = moment()
  .add(3, "d")
  .format("MMMM Do YYYY");
var dayFive = moment()
  .add(4, "d")
  .format("MMMM Do YYYY");
var daySix = moment()
  .add(5, "d")
  .format("MMMM Do YYYY");
var days = [dayTwo, dayThree, dayFour, dayFive, daySix];

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
  console.log(cities.indexOf(currentCity));
  if (cities.indexOf(currentCity) == -1) {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      currentCity +
      "&APPID=" +
      key;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      if (response) {
        uvIndex(response);
        displayCity(response);
        forecast(response);
        cities.push(currentCity);
        saveInfo();
        renderHistory();
      }
    });
    // if
  }
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
    uvIndex(response);

    displayCity(response);
    forecast(response);
  });
});

// displays stagnent weather stats
function displayCity(response) {
  $(".stagnentWeatherInfo").empty();
  var temp = Math.round(response.main.temp * (9 / 5) - 459.67);
  var wind = Math.round(response.wind.speed * 2.237);
  var humidity = response.main.humidity;

  $("#cityName").text(response.name + ", " + todayDate);
  $("#temp").text("Temperature is " + temp + " degrees F");
  $("#wind").text("Wind speeds of " + wind + " mph");
  $("#humidity").text("Humidity of " + humidity + "%");
}

// displays UV index with other weather stats
function uvIndex(response) {
  var city = response.name;
  var lat = response.coord.lat;
  var lon = response.coord.lon;
  var queryURL =
    "https://api.openweathermap.org/data/2.5/uvi?appid=" +
    key +
    "&lat=" +
    lat +
    "&lon=" +
    lon;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    var UVvalue = response.value;
    console.log(UVvalue);
    var UV = $("#UV");
    UV.css("color", "white");

    if (UVvalue > 8) {
      UV.css("background-color", "red");
    } else if (UVvalue > 3 && UVvalue < 8) {
      UV.css("background-color", "blue");
    } else {
      UV.css("background-color", "green");
    }

    UV.text("UV index: " + UVvalue);
  });
}

// renders history cities
function renderHistory() {
  if (!localStorage.getItem("cities")) {
    var cities = [];
    $("#newCityArea").addClass("hideBorder");
    console.log(cities);
  } else {
    var cities = JSON.parse(localStorage.getItem("cities"));
    $("#newCityArea").removeClass("hideBorder");
  }
  $("#newCityArea").empty();

  for (var i = 0; i < cities.length; i++) {
    // var row = $("<div>");
    // row.addClass("row");
    // var col = $("<div>");
    // row.addClass("col-sm-12");
    var element = $("<button>");
    element.text(cities[i]);
    element.addClass("cityButton");

    element.attr("value", cities[i]);
    // col.prepend(element);
    // row.prepend(element);
    $("#newCityArea").prepend(element);
  }
}

// saves cities array to local storage
function saveInfo() {
  localStorage.setItem("cities", JSON.stringify(cities));
}

// creates forecast
function forecast(response) {
  $("#forecast").empty();
  $("#forecastTitle").empty();

  var newDiv = $("<div>");
  newDiv.text("5-Day Forecast:");
  $("#forecastTitle").append(newDiv);

  var city = response.name;
  var lat = response.coord.lat;
  var lon = response.coord.lon;
  var queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    key;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    var sum = 0;
    for (var i = 0; i < response.list.length; i += 8) {
      var col = $("<div>");
      col.addClass = "col-sm-2";
      var card = $("<div>");
      card.addClass("card");
      var cardBody = $("<div>");
      cardBody.addClass("card-body");

      var img = $("<img>");
      img.attr(
        "src",
        "https://openweathermap.org/img/wn/" +
          response.list[i.toString()].weather[0].icon +
          "@2x.png"
      );

      var text1 = $("<p>");
      var temp = Math.round(
        response.list[i.toString()].main.temp * (9 / 5) - 459.67
      );
      text1.text("Temperature: " + temp + "℉");
      var text2 = $("<p>");
      text2.text(days[sum]);
      sum++;

      var text3 = $("<p>");
      var humidity = response.list[i.toString()].main.humidity;
      text3.text("Humidity: " + humidity + "%");

      cardBody.prepend(text3);
      cardBody.prepend(text1);
      cardBody.prepend(img);
      cardBody.prepend(text2);

      cardBody.addClass("cards");

      card.prepend(cardBody);
      col.prepend(card);
      $("#forecast").append(col);
    }
  });
}

// resets search history
$(document).on("click", "#reset", function() {
  localStorage.clear();
  cities = [];
  renderHistory();
});
