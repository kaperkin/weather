(function ($) {
  /*
  if (navigator.geolocation) {
  console.log('navigator.geolocation found');
  navigator.geolocation.getCurrentPosition(function (position) {
  console.log(position);
  $('#myLocation').html("found");
}, function (err) {
$('#myLocation').html(err.code + ": " + err.message);
console.log(err.code + ": " + err.message);
})
}
*/

// Map sample
function initMap(lat, long) {
  $('#map').empty();
        $('#map').append("<img src='https://maps.googleapis.com/maps/api/staticmap?center="
         + lat + "," + long + "&zoom=13&size=400x500&maptype=hybrid&markers=color:#4256f4|" + lat + "|" + long +"'/>")
      }
///end map sample






  var geoURL = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyB1JHX9rQpFz9vvN-9SV9ShQq_BFEEYXQY";
  $.post(geoURL, (function (data) {
    var geoData = JSON.stringify(data);
    console.log(geoData);
    geoData = $.parseJSON(geoData);
    var lat = geoData.location['lat'];
    var long = geoData.location['lng'];
    var baseUrl = 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat='
    + lat + "&lon=" + long + "&APPID=b05db25a78ee7104abd3a9b1f46133b5";
    getWeather(baseUrl);
  }));



var submitBtn = $('#submit');
$("#tempBtn").hide();

function getTempF(temp){
  return Math.round((temp * (9/5) - 459.67));
}

function getTempC(temp){
  return Math.round((temp - 273.15));
}

function getForecast(city, country, currentHour){
  $("#forecast").empty();
  $("#forecast").append("<div class='col-lg-1' id='forecastBuffer'></div>")
  var baseURLForecast = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?q="
  + city +"," + country + "&APPID=b05db25a78ee7104abd3a9b1f46133b5";
  console.log("calling forecast");
  $.getJSON(baseURLForecast).done(function (data) {
    var resDataForecast = JSON.stringify(data);
    console.log(resDataForecast);
    resDataForecast = $.parseJSON(resDataForecast);
    resDataForecastList = resDataForecast.list;
    // LIST HAS FORECAST FOR EVERY THREE HOURS FOR NEXT FIVE DAYS
    /*
loop through forecast.list[0] to find hour

    */
console.log("Current Hour: " + currentHour);
var p;
switch(currentHour){
  case (currentHour >21)|| currentHour==0:
  console.log("Forecast start at 0, p set to 5");
  p = 5
  break;
  case currentHour >18:
  console.log("Forecast start at 21, p set to 6");
  p = 6;
  break;
  case currentHour >15:
  console.log("Forecast start at 18, p set to 7");
  p = 7
  break;
  case currentHour >12:
  console.log("Forecast start at 15, p set to 0");
  p = 0
  break;
  case currentHour >9:
  console.log("Forecast start at 12, p set to 1");
  p = 1
  break;
  case currentHour >6:
  console.log("Forecast start at 9, p set to 2");
  p = 2
  break;
  case currentHour >3:
  console.log("Forecast start at 6, p set to 3");
  p = 3
  break;
  default:
  console.log("Forecast start at 3, p set to 4");
  p = 4
  break;
}





    for(p; p < resDataForecastList.length; p+=8){
      var date = new Date((resDataForecastList[p].dt)*1000);
      var dayNum = date.getUTCDay();
      var day = "";
      var icon = "http://openweathermap.org/img/w/" + resDataForecastList[p].weather[0]["icon"] + ".png";
      var hours = date.getUTCHours();
      console.log("p hours: " + hours);

      switch(dayNum){
        case 0:
        day = "Sunday";
        break;
        case 1:
        day = "Monday";
        break;
        case 2:
        day = "Tuesday";
        break;
        case 3:
        day = "Wednesday";
        break;
        case 4:
        day = "Thursday";
        break;
        case 5:
        day = "Friday";
        break;
        case 6:
        day = "Saturday";
        break;
      }

      $("#forecast").append("<div class='forecast col-lg-2'>" + "<p class='forecastBanner'>"
      + day + "</p><p class='forecastIcon'><img class='icon' src='" + icon + "' alt='weather icon' /></p>"
      + "<p class='temp'><span class='temperatureF'>" + getTempF(resDataForecastList[p].main["temp"])
      + "&#730;" + "</span></p><p class='temp'><span class='temperatureC'>" +
      getTempC(resDataForecastList[p].main["temp"]) + "&#730;" + "</span></p></div>"
    );
  }
  var tempArrayCHide = document.getElementsByClassName("temperatureC");
  for(var i=0; i<tempArrayCHide.length; i++){
    $(tempArrayCHide[i]).hide();
  }
  //when API fails
}).fail(function (jqxhr, textStatus, err) {
  $('#api').html(textStatus + ": " + err);
});
}

function getWeather(baseUrl){
  // API Call Current Weather
  console.log("getWeather called");
  $.getJSON(baseUrl).done(function (data) {
    var resData = JSON.stringify(data);

    resData = $.parseJSON(resData);
        console.log(resData.dt);
        var date = new Date((resData.dt)*1000);
        var currentHour = date.getUTCHours();

    var city = resData.name;
    var country = (resData.sys.country).toUpperCase();
    var weather = resData.weather[0];
    var icon = weather["icon"];
    var image = "http://openweathermap.org/img/w/" + icon + ".png";
    var tempK = resData.main.temp;
    var tempF = getTempF(tempK);
    var tempC = getTempC(tempK);
    $('#description').text("Current weather in " + city + " is " + weather["description"] + ".");
    $('#description').append("<img class='icon img-rounded' src="+ image + " alt='weather icon' />");
    $("#temperatureF").text("Temperature: " + tempF);
    $("#temperatureC").text("Temperature: " + tempC);
    $("#tempBtn").show();

    //call API forecast
    getForecast(city,country, currentHour);

    //create map
    initMap(resData.coord["lat"], resData.coord["lon"]);

    //when API fails
  }).fail(function (jqxhr, textStatus, err) {
    $('#description').html($('#zipcode').val() + " is not a valid zipcode");
    $('#forecast').text("");
    $("#temperatureF").text("");
    $("#temperatureC").text("");
      $("#tempBtn").hide();


  });
}

// ad keybinding for enter to trigger submit click
$('#zipcode').keypress(function(e){
        if(e.which == 13){//Enter key pressed
            $('#submit').click();//Trigger search button click event
        }
    });


// when submit button is clicked
submitBtn.click(function(){

  //Using $.ajax()  var zip = $('#zipcode').val();
  /*  var baseUrl = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?zip=" + zip + "&APPID=b05db25a78ee7104abd3a9b1f46133b5&origin=*";
  $.ajax({
  type: "GET",
  dataType: "jsonp",
  url: baseUrl,
  crossDomain: false,
  headers: {'X-Requested-With': 'XMLHttpRequest'},
  success: function(data){
  console.log("ajax done");
  var resData = JSON.stringify(data);
  console.log(resData);
  resData = $.parseJSON(resData);
  var city = resData.name;
  var country = (resData.sys.country).toUpperCase();
  var weather = resData.weather[0];
  var icon = weather["icon"];
  var image = "http://openweathermap.org/img/w/" + icon + ".png";
  var tempK = resData.main.temp;
  var tempF = getTempF(tempK);
  var tempC = getTempC(tempK);
  $('#description').text("Current weather in " + city + " is " + weather["description"] + ".");
  $('#description').append("<img class='icon img-rounded' src="+ image + " alt='weather icon' />");
  $("#temperatureF").text("Temperature: " + tempF);
  $("#temperatureC").text("Temperature: " + tempC);
  $("#tempBtn").show();

  //call API forecast
  getForecast(city,country);

}
});
}); */
//end $.ajax()

var zip = $('#zipcode').val();
var baseUrl = 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?zip='
+ zip + "&APPID=b05db25a78ee7104abd3a9b1f46133b5";
console.log(baseUrl);
getWeather(baseUrl);
});


// populate toggle
$('#tempBtn').click(function() {
  var cBtn = $("#tempBtn").val();
  if(cBtn==("F")){
    console.log("Celsius");
    var tempArrayCShow = document.getElementsByClassName("temperatureC");
    for(var i=0; i<tempArrayCShow.length; i++){
      $(tempArrayCShow[i]).show();
    }
    var tempArrayFHide = document.getElementsByClassName("temperatureF");
    for(var i=0; i<tempArrayFHide.length; i++){
      $(tempArrayFHide[i]).hide();
    }
    $("#tempBtn").val("C");
    $("#tempBtn").html("C&#730;")
  } else{
    var tempArrayCHide = document.getElementsByClassName("temperatureC");
    for(var i=0; i<tempArrayCHide.length; i++){
      $(tempArrayCHide[i]).hide();
    }
    var tempArrayFShow = document.getElementsByClassName("temperatureF");
    for(var i=0; i<tempArrayFShow.length; i++){
      $(tempArrayFShow[i]).show();
    }
    $("#tempBtn").val("F");
    $("#tempBtn").html("F&#730;")
  }
  $('#tempBtn').toggleClass('active');
  $('#tempBtn').toggleClass('btn-default');
  $('#tempBtn').toggleClass('btn-primary');

});

//end toggle


}(jQuery));
