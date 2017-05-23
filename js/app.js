(function ($) {
    //  if (navigator.geolocation) {
    //    console.log('navigator.geolocation found');
    //  navigator.geolocation.getCurrentPosition(function (position) {
    //    console.log(position);
    //                $('#myLocation').html("found");
    //            }, function (err) {
    //                $('#myLocation').html(err.code + ": " + err.message);
    //                console.log(err.code + ": " + err.message);
    //            })
    //        }
    var submitBtn = $('#submit');
    $("#toggleDiv").hide();

function getTempF(temp){
  return Math.round((temp * (9/5) - 459.67));
}

function getTempC(temp){
  return Math.round((temp - 273.15));
}

function getForecast(city, country){
  $("#forecast").empty();
  $("#forecast").append("<div class='col-lg-1' id='forecastBuffer'></div>")
  var baseURLForecast = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?q="
  + city +"," + country + "&APPID=b05db25a78ee7104abd3a9b1f46133b5";
  console.log("calling forecast");
  $.getJSON(baseURLForecast).done(function (data) {
    var resDataForecast = JSON.stringify(data);
    resDataForecast = $.parseJSON(resDataForecast);
    resDataForecastList = resDataForecast.list;
    // LIST HAS FORECAST FOR EVERY THREE HOURS FOR NEXT FIVE DAYS
    console.log(resDataForecast.list);

    for(var i=4; i < resDataForecastList.length; i+=8){
      var date = new Date((resDataForecastList[i].dt)*1000);
      var dayNum = date.getUTCDay();
      var day = "";
      var icon = "http://openweathermap.org/img/w/" + resDataForecastList[i].weather[0]["icon"] + ".png";


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
      + day + "</p><p class='forecastIcon'><img src='" + icon + "' alt='weather icon' /></p>"
      + "<p class='temp'><span class='temperatureF'>" + getTempF(resDataForecastList[i].main["temp"])
      + "&#730;" + "</span></p><p class='temp'><span class='temperatureC'>" +
      getTempC(resDataForecastList[i].main["temp"]) + "&#730;" + "</span></p></div>"
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

    // when submit button is clicked
    submitBtn.click(function(){
      var zip = $('#zipcode').val();
      var baseURL = 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?zip=' + zip + "&APPID=b05db25a78ee7104abd3a9b1f46133b5";

      // API Call Current Weather
      $.getJSON(baseURL).done(function (data) {
        var resData = JSON.stringify(data);
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
        $("#toggleDiv").show();

        //call API forecast
        getForecast(city,country);


        //when API fails
      }).fail(function (jqxhr, textStatus, err) {
        $('#api').html(textStatus + ": " + err);
      });
    });

// populate toggle
$('#tempBtnC').click(function() {
  $('#tempBtnC').toggleClass('active');
  $('#tempBtnC').toggleClass('btn-default');
  $('#tempBtnC').toggleClass('btn-primary');
  //change tempBtnF
  $('#tempBtnF').toggleClass('active');
  $('#tempBtnF').toggleClass('btn-default');
  $('#tempBtnF').toggleClass('btn-primary');
    var tempArrayCShow = document.getElementsByClassName("temperatureC");
    for(var i=0; i<tempArrayCShow.length; i++){
      $(tempArrayCShow[i]).show();
    }
    var tempArrayFHide = document.getElementsByClassName("temperatureF");
    for(var i=0; i<tempArrayFHide.length; i++){
      $(tempArrayFHide[i]).hide();
    }

});

$('#tempBtnF').click(function() {
  $('#tempBtnF').toggleClass('active');
  $('#tempBtnF').toggleClass('btn-default')
    $('#tempBtnF').toggleClass('btn-primary');
    // change classes on tempBtnC
    $('#tempBtnC').toggleClass('active');
    $('#tempBtnC').toggleClass('btn-default');
    $('#tempBtnC').toggleClass('btn-primary');

    var tempArrayCHide = document.getElementsByClassName("temperatureC");
    for(var i=0; i<tempArrayCHide.length; i++){
      $(tempArrayCHide[i]).hide();
    }
    var tempArrayFShow = document.getElementsByClassName("temperatureF");
    for(var i=0; i<tempArrayFShow.length; i++){
      $(tempArrayFShow[i]).show();
    }
});
//end toggle



}(jQuery));
