/**
 * Angular weather demo application
 */

/**
 * Main weather application module
 */
var app = angular.module('weatherApp', ['ngAnimate']);

/**
 * Main app config settings
 */
app.config(function($logProvider){
  //Change to turn of debug options
  var production = true;

  var mode = production ? false : true;
  $logProvider.debugEnabled(mode);
});

/**
 * Directive for adding googleplace Autocomplete to an inputbox
 * borrowed from :
 * @link https://gist.github.com/VictorBjelkholm/6687484
 */
app.directive('googleplace', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {}
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                scope.$apply(function() {
                    model.$setViewValue(element.val());
                });
            });
        }
    };
});

/**
 * Directive than handles resize functionality
 */
app.directive('resize', function($window){
  return function (scope, element, attr) {
    var w = angular.element($window);

    function getWindowDimensions(){
      return {
        'h': $window.innerWidth,
        'w': $window.innerHeight
      };
    };

    scope.$watch(getWindowDimensions, function (newValue) {
      scope.windowHeight = newValue.h;
      scope.windowWidth = newValue.w;

      scope.elementsResize('.future-days .weather-container');
    }, true)

    w.bind('resize', function () {
      scope.$apply();
    });

  };
});

/**
 * Service that gets the forcast
 */
app.factory('forcastService', ['$http', '$q', '$log', function($http, $q, $log){
  var weatherTextLookup = {
    '0':'A friggin\' tornado!',
    '1':'Tropical storm',
    '2':'Really really windy (hurricane)',
    '3':'Raining down thunder!',
    '4':'Bring the thunder!',
    '5':'Snowy and Wet',
    '6':'Wet, Sleety and Basically Nasty',
    '7':'Snowy with Sleet-y tendencies',
    '8':'It\'s drizzle but Freezing',
    '9':'Drizzly. That Rain That Gets You Wet',
    '10':'Watchout, Freezing rain everywhere',
    '11':'It\'s gonna rain, but not all day',
    '12':'It\'s gonna rain, but not all day',
    '13':'Everywhere there\'s flurries',
    '14':'A gentle dusting',
    '15':'Snow, blowing everywhere',
    '16':'Let it snow!',
    '17':'All <b>Hail</b> the weather',
    '18':'Sleet. It horrid',
    '19':'A dust cloud commeth',
    '20':'It\'s gonna be hard to see out there',
    '21':'It\'s not your eyes, it is hazy',
    '22':'Is somthing on fire?',
    '23':'Sporadic high winds',
    '24':'Dont get blown away',
    '25':'Its pretty chilly out there',
    '26':'It\'s pretty cloudy out there',
    '27':'It\'s grey all eveing',
    '28':'It\'s grey all day',
    '29':'You\'ll see some of the sky',
    '30':'You\'ll see some of the sky at night',
    '31':'Stargazing weather at night',
    '32':'Sun screen up people!',
    '33':'Pretty good, fair to be honest.',
    '34':'Pretty good, fair to be honest.',
    '35':'mixed rain and hail',
    '36':'Wow its hot out there',
    '37':'There a small chance you\'ll see thunder',
    '38':'There a good chance you\'ll see thunder',
    '39':'There a good chance you\'ll see thunder',
    '40':'Showers spread around',
    '41':'It\'s skiing weather out there',
    '42':'Small amounts snow falling sporadicly',
    '43':'So much snow coming down',
    '44':'Small clouds fill the sky',
    '45':'Short showers with thunder',
    '46':'Short show showers',
    '47':'Rare short showers with thunder!',
    '3200':'Sorry, Somthings gone wrong'
  };

  function getWeather(searchText) {
    var deferred = $q.defer();
    var locationQuery = escape('select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="'+searchText+'") and u="c"');
    $http.get('https://query.yahooapis.com/v1/public/yql?q='+locationQuery+'&format=json&callback=&diagnostics=true&debug=true')
      .success(function(data){
        var weatherData = data.query.results.channel;
        weatherData.item.forecast = weatherData.item.forecast.slice(0,3);
        for (var i = 0; i < weatherData.item.forecast.length; i++) {
          weatherData.item.forecast[i].weatherType = weatherTextLookup[weatherData.item.forecast[i].code];
        }
        deferred.resolve(weatherData);
      })
      .error(function(err){
        $log.error(err.error.description);
        deferred.reject(err);
      });
    return deferred.promise;
  }
  return {
    getWeather:getWeather
  };
}]);

/**
 * Main app controller, displays weateh info
 */
app.controller('weatherControl', ['$scope', '$log', '$timeout', 'forcastService', function($scope, $log, $timeout, forcastService){

  /**
   * Retruns the largest height of any node array from DOM
   *
   * @param   {Array}  el  - Node list to be compared
   * @returns {number}     - Maximum height
   */
  function largestHeight(el) {

    this.largestSoFar = 0;

    for (var i = 0; i < el.length; i++) {
      //Reset for resize to get correct height
      el[i].style.height = 'auto';
      this.largestSoFar = el[i].offsetHeight > this.largestSoFar ? el[i].offsetHeight : this.largestSoFar;
    }

    return this.largestSoFar;
  }

  /**
   * Resizes all elements with the query string passed to it
   *
   * @param  {string}  el  - query string to be used to get dom objects
   */
  $scope.elementsResize = function (el) {
    $log.debug('elementsResize el = ' + el);
    this.elementsToSize = document.querySelectorAll(el);
    $log.debug('elementsResize elements to size ' + JSON.stringify(this.elementsToSize));
    this.maxElementHeight = largestHeight(this.elementsToSize);

    for (var i = 0; i < this.elementsToSize.length; i++) {
      this.elementsToSize[i].style.height = this.maxElementHeight + 'px';
    }

  }

  /**
   * UI function that toggs the visiablity of Data elements
   */
  function toggleData() {
    $log.debug('toggleData');
    $scope.forecastData = $scope.forecastData ? false : true;
    $scope.locationInfo = $scope.locationInfo ? false : true;
  }

  /**
   * UI function that toggs the visiablity of control elements
   */
  function toggleControls() {
    $log.debug('toggleControls ' + $scope.controls);
    $scope.controls = $scope.controls ? false : true;
  }

  /**
   * Gets the forcast information, displays it and formats it
   *
   * @param  {string}  searchText  -String that includes the text which will be passed to our factory
   */
  function fetchForcast(searchText) {
    toggleControls();
    forcastService.getWeather(searchText).then(function(data){
      $scope.forecast = data;
      toggleData();

      $timeout(function(){
        $scope.elementsResize('.future-days .weather-container');
      }, 100);

    });
  }

  /**
   * Called from dom on submit. Updates forcast information and UI
   *
   * @param  {string}  searchText  -String that includes the text which will be passed to our factory
   */
  $scope.findForcast = function(searchText) {
    if ($scope.forecastForm.$valid) {
      $scope.forecast = '';
      fetchForcast(searchText);
    }
  };

  /**
   * Called from dom. Shows controls
   */
  $scope.revealControls = function() {
    toggleData();
    $timeout(toggleControls, 800);
  };

  /**
   *  Inital visiablity settings for UI elements
   */
  $scope.forecastData = false;
  $scope.locationInfo = false;
  $scope.controls = true;

}]);
