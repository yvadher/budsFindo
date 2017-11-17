
//Angular App Module and Controller
var mapApp = angular.module('mapApp', []);
mapApp.controller('MapController', function ($scope, $http) {
    
    $http.get('js/data.json').then(function(response){
        $scope.data = response.data;

        var h = window.innerHeight;
        $("#map").height(h - 100);
        $(".pre-scrollable").css('max-height', h - 300 );
    
        var location = {lat: 49.2827, lng: -123.1207};
        var mapOptions = {
            zoom: 16,
            center: location
        };

        $scope.inputLocation = document.getElementById('inputLoc');
        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        var autocomplete = new google.maps.places.Autocomplete($scope.inputLocation);
        $scope.markers = [];
        
        var infoWindow = new google.maps.InfoWindow();
        
        var createMarker = function (info){
            
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
                infoWindow.setContent('<h3>' + marker.title + '</h3>' +  marker.content);
                infoWindow.open($scope.map, marker);
                
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
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#42A5F5',
                fillOpacity: 0.35
            });
            cityCircle.setMap($scope.map);
            
            $scope.markers.push(marker);
            
        }  
        
        for (i = 0; i < $scope.data.length; i++){
            createMarker($scope.data[i]);
        }

        $scope.openInfoWindow = function(e, selectedMarker){
            e.preventDefault();
            google.maps.event.trigger(selectedMarker, 'click');
        }

        $scope.addTopic = function(){
            if ($scope.topicTitle && $scope.topicLocation && $scope.locationDes){
                var obj = {
                        place : $scope.topicLocation,
                        desc : $scope.locationDes,
                        lat : $scope.topicLocation.lat,
                        long : $scope.topicLocation.lang,
                        topics : [{ title : $scope.topicTitle, activePeople : 1}]
                    }
                topics.push(obj);
            }
        }

    });
    
});