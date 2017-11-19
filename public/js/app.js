
//Angular App Module and Controller
var mapApp = angular.module('mapApp', ['ngDialog']);
mapApp.controller('MapController', function ($scope, $http, ngDialog) {

    $scope.openTopics = function() {
        ngDialog.openConfirm({template: 'modal.html',
            className: 'ngdialog-theme-default',
		    scope: $scope //Pass the scope object if you need to access in the template
		}).then(
			function(value) {
				//save the contact form
			},
			function(value) {
				//Cancel or do nothing
			}
		);
	};

    var createMarker = function (info, i){

        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.lat, info.long),
            title: info.place,
            icon : 'images/marker.png'
        });

        var activeUsers = 0;
        for (let i=0; i<info.topics.length;i++){
            activeUsers += info.topics[i].activePeople;
        }
        marker.content = '<div class="infoWindowContent">' + info.desc + '<br />Total topics: ' + info.topics.length + ' !!<br>Active people <i class="fa fa-user" aria-hidden="true"/> : ' + activeUsers +  ' </div>';

        google.maps.event.addListener(marker, 'click', function(){
            $scope.infoWindow.setContent('<h3>' + marker.title + '</h3>' +  marker.content);
            $scope.infoWindow.open($scope.map, marker);

            if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
            } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            }
        });

        var cityCircle = new google.maps.Circle({
            center: new google.maps.LatLng(info.lat, info.long),
            radius:  80,
            strokeColor: '#1565C0',
            strokeOpacity: 0.9,
            strokeWeight: 2,
            fillColor: '#42A5F5',
            fillOpacity: 0.30
        });
        google.maps.event.addListener(cityCircle, 'click', function(){
            $scope.dataTopic = info;
            $scope.openTopics($scope.dataTopic);
        });

        cityCircle.setMap($scope.map);
        $scope.markers[i] = marker;
    }

    function getDistanceFromLatLon(lat1,lon1,lat2,lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lon2-lon1);
        var a =
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
          Math.sin(dLon/2) * Math.sin(dLon/2)
          ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c; // Distance in km
        return d*1000;
      };
    function deg2rad(deg) {
        return deg * (Math.PI/180)
    };

    // setInterval(function(){
    //     for (i = $scope.totalData; i < $scope.data.length; i++){
    //         createMarker($scope.data[i]);
    //     }
    //  }, 3000);

    $http.get('/api/getData').then(function(response){
        $scope.data = response.data;
        $scope.totalData = $scope.data.length;
        var h = window.innerHeight;
        var w = window.innerWidth;

        $("#search").width(w/3- 35);
        $("#map").height(h - 100);
        $(".pre-scrollable").css('max-height', h - 350 );

        var location = {lat: 49.2827, lng: -123.1207};
        var mapOptions = {
            zoom: 16,
            center: location,
            markers: []
        };

        $scope.inputLocation = document.getElementById('inputLoc');
        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        var autocomplete = new google.maps.places.Autocomplete($scope.inputLocation);
        $scope.markers = [];

        $scope.infoWindow = new google.maps.InfoWindow();

        for (i = 0; i < $scope.data.length; i++){
            createMarker($scope.data[i], i);
        }

        //Listen to zoom change to that we can remove radius zone when clustering happens
        $scope.map.addListener('zoom_changed', function(){

        });

        var optionForCluster = {imagePath : 'images/m' };
        var markerCluster = new MarkerClusterer($scope.map, $scope.markers, optionForCluster);

        $scope.openInfoWindow = function(e, selectedMarker){
            e.preventDefault();
            google.maps.event.trigger(selectedMarker, 'click');
        }

        $scope.addTopic = function(){
            if ($scope.topicTitle && $scope.topicLocation && $scope.topicDes){

                axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
                    params:{
                      address: $scope.topicLocation,
                      key:'AIzaSyD0mVAoqSKvKHy7BGXfngqTeJaFXpheQ54'
                    }
                  })
                  .then(function(response){
                    // Log full response

                    // Formatted Address
                    var formattedAddress = response.data.results[0].formatted_address;
                     // Geometry
                    var lat = response.data.results[0].geometry.location.lat;
                    var lng = response.data.results[0].geometry.location.lng;

                    $scope.map.panTo({lat, lng});
                    var isInData = false;
                    var indexObj = 0;
                    for (let i = 0; i<$scope.data.length; i++){
                       if (getDistanceFromLatLon($scope.data[i].lat, $scope.data[i].long, lat, lng) < 80){
                            isInData = true;
                            indexObj = i;
                            break;
                        }else {
                            isInData = false;
                        }
                    }

                    if (isInData){
                        //Its in data add a topic and description only
                        var topicObj = {"title" : $scope.topicTitle, "activePeople" : 5, "desc" : $scope.topicDes};
                        $scope.data[indexObj].topics.push(topicObj);
                        $scope.markers[indexObj].setMap(null);
                        console.log("calling create mamrker");
                        createMarker($scope.data[indexObj], indexObj);

                      //  $http.post('/api/update', $scope.data[indexObj]);
                    }else {
                        // Add new object to the data
                        var obj = {
                            "place" : formattedAddress,
                            "desc" : $scope.topicDes,
                            "lat" : lat,
                            "long" : lng,
                            "topics" : [{ title : $scope.topicTitle, activePeople : 1}]
                        }
                        $http.post('/api/save', obj);
                        $scope.data.push(obj);
                        createMarker(obj, $scope.data.length);
                    }

                  });
            }
        }

    });

});
