angular.module('starter', ['ionic','ionic.service.core', 'starter.controllers', 'starter.services','ngCordova','ion-datetime-picker','ionic-ratings'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {

    setTimeout(function () {
        //navigator.splashscreen.hide();
    }, 2000);

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
        //StatusBar.styleDefault();
        StatusBar.styleLightContent();
    }

    var push = new Ionic.Push({
      "debug": true
    });
 
    push.register(function(token) {
      console.log("My Device token:",token.token);
      push.saveToken(token);  // persist the token in the Ionic Platform
    });

  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  PARSE_APPLICATION_ID="nAvDSrirvAdkj5dzcZ6GlJNUovLlSEAway0d6HOi";
  PARSE_JAVASCRIPT_KEY="ScxvD3GM0Sm5Ol1XcBNLOEUXEwZMhjqqeIihAyxG";
  PARSE_MASTER_KEY="hy8SszgIN8YKGzuE1NJDR4r8P0HIp1k1lwNhKE4v";
  Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY,PARSE_MASTER_KEY);
  Parse.serverURL = 'https://parseapi.back4app.com'

    $ionicConfigProvider.backButton.previousTitleText(false);
    $ionicConfigProvider.backButton.text('');

    // set tabs position on the top
    $ionicConfigProvider.tabs.position('top');
    $stateProvider
  // Search for customer page
  .state('searchcustomer', {
    url: '/searchcustomer',
    templateUrl: 'templates/searchcustomer.html',
    controller: 'searchcustomerController'
  })

  // driver trip goods details page
  .state('drivergoodsdetails', {
    url: '/drivergoodsdetails',
    templateUrl: 'templates/drivergoodsdetails.html',
    controller: 'drivergoodsdetailsController'
  })

  // driver trip details page
  .state('drivertripdetails', {
    cache: false,
    url: '/drivertripdetails',
    templateUrl: 'templates/drivertripdetails.html',
    controller: 'drivertripdetailsController'
  })

  // View and Select a customer for driver trip
  .state('selectcustomer', {
    url: '/selectcustomer/:customerId',
    templateUrl: 'templates/selectcustomer.html',
    controller: 'selectcustomerController'
  })

  // View and Select a driver for customer trip
  .state('selectdriver', {
    url: '/selectdriver/:driverId',
    templateUrl: 'templates/selectdriver.html',
    controller: 'selectdriverController'
  })

  // Search for driver page
  .state('searchdriver', {
    url: '/searchdriver',
    templateUrl: 'templates/searchdriver.html',
    controller: 'searchdriverController'
  })

  // customer trip goods details page
  .state('goodsdetails', {
    url: '/goodsdetails',
    templateUrl: 'templates/goodsdetails.html',
    controller: 'goodsdetailsController'
  })

  // customer trip details page
  .state('tripdetails', {
    cache: false,
    url: '/custtripdetails',
    templateUrl: 'templates/custtripdetails.html',
    controller: 'tripdetailsController'
  })

 // customer upcoming start page

  .state('tab1.upcomingtrip', {
    url: '/Upcoming Trips',
    views: {
      'tab1-upcomingtrip': {
        templateUrl: 'templates/tab1-upcomingtrip.html',
        controller: 'upcomingtripController'
      }
    }
  })

 // driver upcoming start page

  .state('tab2.driverupcomingtrip', {
    url: '/Upcoming Trips',
    views: {
      'tab2-driverupcomingtrip': {
        templateUrl: 'templates/tab2-driverupcomingtrip.html',
        controller: 'driverupcomingtripController'
      }
    }
  })

  // driver inprogress start page

  .state('tab2.driverpasttrip', {
    url: '/Past Trips',
    views: {
      'tab2-driverpasttrip': {
        templateUrl: 'templates/tab2-driverpasttrip.html',
        controller: 'driverpasttripController'
      }
    }
  })

  // driver inprogress start page

  .state('tab2.driverinprogresstrip', {
    url: '/In-progress Trips',
    views: {
      'tab2-driverinprogresstrip': {
        templateUrl: 'templates/tab2-driverinprogresstrip.html',
        controller: 'driverinprogresstripController'
      }
    }
  })

  // customer inprogress start page

  .state('tab1.pasttrip', {
    url: '/Past Trips',
    views: {
      'tab1-pasttrip': {
        templateUrl: 'templates/tab1-pasttrip.html',
        controller: 'pasttripController'
      }
    }
  })

  // customer inprogress start page

  .state('tab1.inprogresstrip', {
    url: '/In-progress Trips',
    views: {
      'tab1-inprogresstrip': {
        templateUrl: 'templates/tab1-inprogresstrip.html',
        controller: 'inprogresstripController'
      }
    }
  })

  // customer  / Driver trip start page

  .state('tab.location', {
    url: '/SET ROUTE',
    views: {
      'tab-location': {
        templateUrl: 'templates/tab-location.html',
        controller: 'Location'
      }
    }
  })

  // admin trucks view page

  .state('tab3.truck-admin', {
    url: '/Trucks',
    views: {
      'tab3-truck-admin': {
        templateUrl: 'templates/tab3-truck-admin.html',
        controller: 'truck-adminController'
      }
    }
  })

  // admin driver details view page
  .state('driver-admindetail', {
    url: '/driver-admindetail',
    templateUrl: 'templates/driver-admindetail.html',
    controller: 'driver-admindetailController'
  })

  // admin driver view page

  .state('tab3.driver-admin', {
    url: '/Drivers',
    views: {
      'tab3-driver-admin': {
        templateUrl: 'templates/tab3-driver-admin.html',
        controller: 'driver-adminController'
      }
    }
  })

// tabs for admin page
  .state('tab3', {
    url: '/tab3',
    abstract: true,
    templateUrl: 'templates/tabs3.html',
    controller: 'tab3Controller'
  })

// tabs for driver order list page
  .state('tab2', {
    url: '/tab2',
    abstract: true,
    templateUrl: 'templates/tabs2.html',
    controller: 'tab2Controller'
  })

// tabs for customer order list page
  .state('tab1', {
    url: '/tab1',
    abstract: true,
    templateUrl: 'templates/tabs1.html',
    controller: 'tab1Controller'
  })

// tabs for customer home page
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

// edit driver truck page
  .state('edittruck', {
    url: '/edittruck',
    templateUrl: 'templates/edittruck.html',
    controller: 'edittruckController'
  })

// add a new  driver truck page
  .state('addtruck', {
    url: '/addtruck',
    templateUrl: 'templates/addtruck.html',
    controller: 'addtruckController'
  })

// view each driver truck page
  .state('viewtruck', {
    url: '/viewtruck',
    templateUrl: 'templates/viewtruck.html',
    controller: 'viewtruckController'
  })

// list of driver trucks page
  .state('trucks', {
    url: '/trucks',
    templateUrl: 'templates/trucks.html',
    controller: 'trucksController'
  })

// rate the driver  page
  .state('ratedriver', {
    url: '/ratedriver',
    templateUrl: 'templates/ratedriver.html',
    controller: 'ratedriverController'
  })

// view driver rating page
  .state('driverrating', {
    url: '/driverrating',
    templateUrl: 'templates/driverrating.html',
    controller: 'driverratingController'
  })

// edit customer profile page
  .state('editdriverprofile', {
    url: '/editdriverprofile',
    templateUrl: 'templates/editdriverprofile.html',
    controller: 'editdriverprofileController'
  })

// edit customer profile page
  .state('editcustprofile', {
    url: '/editcustprofile',
    templateUrl: 'templates/editcustprofile.html',
    controller: 'editcustprofileController'
  })

// view driver profile page
  .state('driverprofile', {
    url: '/driverprofile',
    templateUrl: 'templates/driverprofile.html',
    controller: 'driverprofileController'
  })

// view customer profile page
  .state('custprofile', {
    url: '/custprofile',
    templateUrl: 'templates/custprofile.html',
    controller: 'custprofileController'
  })

// driver pending page
  .state('driverpending', {
    url: '/driverpending',
    templateUrl: 'templates/driverpending.html',
    controller: 'driverpendingController'
  })

  // login screen
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  // register screen
  .state('register', {
    url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'RegCtrl'
  });

  // default url state
  $urlRouterProvider.otherwise('/login');

});
