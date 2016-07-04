(function ($) {
    $(document).ready(function () {
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
        var lat = 45;
        var lon = 139;
        var baseURL = 'http://api.openweathermap.org/data/2.5/forecast/weather?lat=' + lat + '&lon=' + lon + "&APPID=b05db25a78ee7104abd3a9b1f46133b5";
        $.getJSON(baseURL).done(function (json) {
            $('#api').html(json.coords);
            console.log("baseURL: " + baseURL);
        }).fail(function (jqxhr, textStatus, err) {
            $('#api').html(textStatus + ": " + err);
        });

        $('#btn').on("click", function () {
            console.log('button clicked')
        });
    })
}(jQuery));