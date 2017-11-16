var topics = [
              {
                  place : 'Vancouver',
                  desc : 'A City of cultures and snow!',
                  lat : 49.2827,
                  long : -123.1207,
                  topics : [{ title : "Best food here", activePeople : 5}]
              },
              {
                  place : 'Vancouver Lookout',
                  desc : 'SFU harbour center',
                  lat : 49.284688,
                  long : -123.112235,
                  topics : [{ title : "Best place to see", activePeople : 2}]
              },
              {
                  place : 'Vancouver Public Library',
                  desc : 'Fun with books',
                  lat : 49.279817,
                  long : -123.115711,
                  topics : [{ title : "idiots are here", activePeople : 50}]
              },
              {
                  place : 'Victory Square',
                  desc : 'Commercial city!',
                  lat : 49.282252,
                  long : -123.110175,
                  topics : [{ title : "Nice nice", activePeople : 1}]
              },
              {
                  place : 'SFU',
                  desc : 'Most hard working guys ...',
                  lat : 49.278094,
                  long : -122.919883,
                  topics : [{ title : "Yagnik is here", activePeople : 500}]
              }
          ];

//Angular App Module and Controller
var mapApp = angular.module('mapApp', []);
mapApp.controller('MapController', function ($scope) {
    
    var h = window.innerHeight;
    $("#map").height(h - 100);
    
    
    var location = {lat: 49.2827, lng: -123.1207};
    var mapOptions = {
        zoom: 16,
        center: location
    };

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
   

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
        
        
        $scope.markers.push(marker);
        
    }  
    
    for (i = 0; i < topics.length; i++){
        createMarker(topics[i]);
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