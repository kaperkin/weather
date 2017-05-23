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


function getForecast(city, country){
  var baseURLForecast = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?q=" + city +"," + country + "&APPID=b05db25a78ee7104abd3a9b1f46133b5";
  console.log("calling forecast");
  $.getJSON(baseURLForecast).done(function (data) {
    var resDataForecast = JSON.stringify(data);
    resDataForecast = $.parseJSON(resDataForecast);
    resDataForecastList = resDataForecast.list;
    // LIST HAS FORECAST FOR EVERY THREE HOURS FOR NEXT FIVE DAYS
    console.log(resDataForecast.list);

    for(var i=0; i < 5; i++){
      var date = new Date((resDataForecastList[i].dt)*1000);
      var day = date.getUTCDate();
      var month = date.getUTCMonth() + 1;
      var year = date.getUTCFullYear();
      console.log(resDataForecastList.length);
      $("#forecast").append("<p class='forecast'>"+ month + "/" + day + "/" + year + "    " + resDataForecastList[i] + "</p>");
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
        var tempF = Math.round((tempK * (9/5) - 459.67));
        var tempC = Math.round((tempK - 273.15));
        $('#description').text("Current weather in " + city + " is " + weather["description"] + ".");
        $('#description').append("<img class='icon img-rounded' src="+ image + " alt='weather icon' />");
        $("#temperatureF").text("Temperature: " + tempF);
        $("#temperatureC").text("Temperature: " + tempC);
        $("#temperatureC").hide();
        $("#toggleDiv").show();


//call API forecast
//getForecast(city,country);
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
    $("#temperatureC").show();
    $("#temperatureF").hide();
});

$('#tempBtnF').click(function() {
  $('#tempBtnF').toggleClass('active');
  $('#tempBtnF').toggleClass('btn-default')
    $('#tempBtnF').toggleClass('btn-primary');
    // change classes on tempBtnC
    $('#tempBtnC').toggleClass('active');
    $('#tempBtnC').toggleClass('btn-default');
    $('#tempBtnC').toggleClass('btn-primary');
    $("#temperatureF").show();
    $("#temperatureC").hide();
});
//end toggle



}(jQuery));
