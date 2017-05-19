(function ($) {
  $(document).ready(function () {
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
    submitBtn.click(function(){
      var zip = $('#zipcode').val();
      var baseURL = 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?zip=' + zip + "&APPID=b05db25a78ee7104abd3a9b1f46133b5";
      $.getJSON(baseURL).done(function (data) {
        var resData = JSON.stringify(data);
        console.log(resData);
        resData = $.parseJSON(resData);
        var weather = resData.weather[0];
        var icon = resData.weather[0]["icon"];
        var image = "http://openweathermap.org/img/w/" + icon + ".png";
        $('#api').text("The weather is currently " + weather["description"] + ". ");
        $('#api').append("<img src="+ image + " alt='weather icon' />");
      }).fail(function (jqxhr, textStatus, err) {
        $('#api').html(textStatus + ": " + err);
      });
    });


//  }
})
}(jQuery));
