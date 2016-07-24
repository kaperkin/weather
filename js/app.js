(function ($) {
    $(document).ready(function () {
        //if (navigator.geolocation) {
        //    console.log('navigator.geolocation found');
        //    navigator.geolocation.getCurrentPosition(function (position) {
        //        console.log(position);
        //        $('#myLocation').html("found");
        //    }, function (err) {
        //        $('#myLocation').html(err.code + ": " + err.message);
        //        console.log(err.code + ": " + err.message);
        //    })
        //}
        var lat = -16.92;
        var lon = 145.77;
        var baseURL = 'https://crossorigin.me/http://api.openweathermap.org/data/2.5/forecast/weather?lat=' + lat + '&lon=' + lon + "&APPID=b05db25a78ee7104abd3a9b1f46133b5";
        $.getJSON(baseURL).done(function (data) {
       //    var resData = JSON.parse(data);
            $('#api').text("Latitude: " + data.city.coord.lat + " Longitude" +  data.city.coord.lon);
            console.log("JSON name: " + data.name);
            console.log(data);
         //   console.log(resData.coord.lon);
         //  console.log("Response Data: " + resData);
        }).fail(function (jqxhr, textStatus, err) {
            $('#api').html(textStatus + ": " + err);
        });
    })
}(jQuery));