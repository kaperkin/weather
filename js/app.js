(function ($) {

  // Map sample
  function initMap(lat, long) {
    $('#map').empty();
    var src = "src='https://maps.googleapis.com/maps/api/staticmap?center=" + lat
    + "," + long + "&amp;zoom=13&amp;size=350x350&amp;maptype=hybrid&amp;key=AIzaSyB6c7H_mSZpiBv5btI2OdydpmZriPX6HWs";
    $('#map').append("<img " + src +"'/>")
  }
  ///end map sample





  // Get geolocation
  var geoURL = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyB1JHX9rQpFz9vvN-9SV9ShQq_BFEEYXQY";
  $.post(geoURL, (function (data) {
    var geoData = JSON.stringify(data);
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

  function getPForLoop(currentHour, lat, long, timestamp){
    var timezoneURL = "https://maps.googleapis.com/maps/api/timezone/json?location="+ lat
    + "," + long + "&timestamp=" + timestamp + "&key=AIzaSyBgaBItDNQSan9FBL6HAr_9oLmmkMowr34";
    offset = 0;
    var p = 0;
    $.getJSON(timezoneURL).done(function(data){
      resData = JSON.stringify(data);
      resData = JSON.parse(resData);
      offset = (resData.rawOffset)/60/60;
      currentHour += offset;
      if((currentHour >=21)|| currentHour==0){
        p = 5;
      } else if(currentHour >=18){
        p = 6;
      } else if(currentHour >=15){
        p = 7;
      } else if(currentHour >=12){
        p = 0;
      } else if(currentHour >=9){
        p = 1;
      } else if(currentHour >=6){
        p = 2;
      } else if(currentHour >=3){
        p = 3;
      } else{
        p = 4;
      }
    });
    return p;
  }

  function getDay(dayNum){
    day = "";
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
    return day;
  }

  function getForecast(city, country, currentHour, lat, long, timestamp, currentTempF){
    $("#forecast").empty();
    $("#forecast").append("<div class='col-lg-1' id='forecastBuffer'></div>");
    var baseURLForecast = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?q="
    + city +"," + country + "&APPID=b05db25a78ee7104abd3a9b1f46133b5";
    $.getJSON(baseURLForecast).done(function (data) {
      var resDataForecast = JSON.stringify(data);
      resDataForecast = $.parseJSON(resDataForecast);
      resDataForecastList = resDataForecast.list;

      var highTempF = 0;
      var highTempIcon = 0;
      var lowTempF = currentTempF;
      var lastDay = getDay((new Date((resDataForecastList[0].dt)*1000)).getUTCDay());
      for(p = 0; p < resDataForecastList.length; p++){
        var date = new Date((resDataForecastList[p].dt)*1000);
        var dayNum = date.getUTCDay();
        var day = "";
        var icon = "http://openweathermap.org/img/w/" + resDataForecastList[highTempIcon].weather[0]["icon"] + ".png";
        var hours = date.getUTCHours();
        var tempF = getTempF(resDataForecastList[p].main["temp"]);
        var tempC = getTempC(resDataForecastList[p].main["temp"]);


        day = getDay(dayNum);
        if(lastDay == day){
          if(tempF > highTempF){
            highTempF = tempF;
            highTempIcon = p;
          } else if (tempF < lowTempF) {
            lowTempF = tempF;
          }
        } else {
          $("#forecast").append("<div class='forecast col-lg-2'>" + "<p class='forecastBanner'>"
          + lastDay + "</p><p class='forecastIcon'><img class='icon' src='" + icon + "' alt='weather icon' /></p>"
          + "<p class='temp'><span class='temperatureF'>High: " + highTempF
          + "&#730;" + "</span></p><p class='temp'><span class='temperatureC'>High: " +
          Math.round(((highTempF-32) * 5)/9) + "&#730;" + "</span></p>"
          + "<p class='temp'><span class='temperatureF'>Low: " + lowTempF
          + "&#730;" + "</span></p><p class='temp'><span class='temperatureC'>Low: " +
          Math.round(((lowTempF-32) * 5)/9) + "&#730;" + "</span></p></div>"
        );
        lastDay= day;
        highTempF = 0;
      }

    }
    if($('#forecast').children().length==6){
      $("#forecast").append("<div class='col-lg-1' id='forecastBuffer2'> </div><div class='col-lg-1' id='forecastBuffer3'> </div>");
    }
    $("#forecast").append("<div class='forecast col-lg-2'>" + "<p class='forecastBanner'>"
    + lastDay + "</p><p class='forecastIcon'><img class='icon' src='" + icon + "' alt='weather icon' /></p>"
    + "<p class='temp'><span class='temperatureF'>High: " + highTempF
    + "&#730;" + "</span></p><p class='temp'><span class='temperatureC'>High: " +
    Math.round(((highTempF-32) * 5)/9) + "&#730;" + "</span></p>"
    + "<p class='temp'><span class='temperatureF'>Low: " + lowTempF
    + "&#730;" + "</span></p><p class='temp'><span class='temperatureC'>Low: " +
    Math.round(((lowTempF-32) * 5)/9) + "&#730;" + "</span></p></div>"
  );
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
  $.getJSON(baseUrl).done(function (data) {
    var resData = JSON.stringify(data);

    resData = $.parseJSON(resData);
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
    var lat = resData.coord["lat"];
    var long = resData.coord["lon"];
    $('#description').append("<p>Current weather in " + city + " is " + weather["description"] + ".</p>");
    $('#description').append("<img class='icon iconDescription img-rounded' src="+ image + " alt='weather icon' />");
    $("#temperatureF").text("Temperature: " + tempF);
    $("#temperatureC").text("Temperature: " + tempC);
    $("#tempBtn").show();

    //call API forecast
    getForecast(city,country, currentHour, lat, long, resData.dt, tempF);

    //create map
    initMap(lat, long);

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
$("#description").empty();
var zip = $('#zipcode').val();
var baseUrl = 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?zip='
+ zip + "&APPID=b05db25a78ee7104abd3a9b1f46133b5";
getWeather(baseUrl);
$('#tempBtn').val('C');
$('#tempBtn').trigger('click');
});


// populate toggle
$('#tempBtn').click(function() {
  var cBtn = $("#tempBtn").val();
  if(cBtn==("F")){
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
