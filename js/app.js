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
    var lat = -16.92;
    var lon = 145.77;
    var zip = $('#zipcode').val();
    var baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=' + zip + "&APPID=b05db25a78ee7104abd3a9b1f46133b5";
    submitBtn.click(function(){
      $.getJSON(baseURL).done(function (data) {
        var resData = JSON.stringify(data);
        console.log(resData);
        resData = $.parseJSON(resData);
        var weather = resData.weather[0];
        $('#api').text(weather["description"]);
      }).fail(function (jqxhr, textStatus, err) {
        $('#api').html(textStatus + ": " + err);
      });
    });


//  }
})
}(jQuery));
