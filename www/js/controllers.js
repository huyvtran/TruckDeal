angular.module('starter.controllers', ['firebase'])



//*************************** start of SideMenuController ****************************

.controller('SideMenuController', function($scope, $rootScope, $state, route_screen,$window, $cordovaToast) {
  
  var loginprof, cust_info, driver_info;
  $scope.main = {};

  $scope.$on('$ionicView.enter', function(ev) {
    if(ev.targetScope !== $scope)
        return;
      //console.log("called initialize function");
      //initialize1();
  });

  $scope.initialize1 = function() 
  {
      //console.log("called initialize");
      loginprof=route_screen.get_login_prof();
      if(loginprof == 1){
          cust_info = route_screen.return_cust_info();
          $scope.showcustprof = function(){ return true};
          $scope.showdriverprof = function(){ return false};
          $scope.user_name = cust_info.first_name + " " + cust_info.last_name;
          $scope.profile_picture = cust_info.picture;
          //$scope.profile_picture="img/profile.jpg";
        }
      else if (loginprof == 2){
          driver_info = route_screen.return_driver_info();
          $scope.showdriverprof = function(){ return true};
          $scope.showcustprof = function(){ return false};
          $scope.user_name = driver_info.first_name + " " + driver_info.last_name;
          $scope.profile_picture = driver_info.picture;
          //$scope.profile_picture = "img/profile.jpg";
          $scope.profile = "Profile: Driver";
        }
      else if (loginprof == 3){
          cust_info = route_screen.return_cust_info();
          $scope.showdriverprof = function(){ return false};
          $scope.showcustprof = function(){ return true};
          $scope.user_name = cust_info.first_name + " " + cust_info.last_name;
          $scope.profile_picture = cust_info.picture;
          //$scope.profile_picture = "img/profile.jpg";
          $scope.profile = "Profile: Admin";
        }

  };

  $scope.open_menu = function()
  {
    $scope.initialize1();
  }

  $scope.go_home = function()
  {
    var loginprof = route_screen.get_login_prof();
    if(loginprof == 1 || loginprof == 2){
        $state.go('tab.location');
    }
    /*else if(loginprof == 2){
        var truck_reg_stat = route_screen.return_truck_reg_stat();
        var driver_prof_stat = route_screen.return_driver_prof_stat();
        if (truck_reg_stat == 2 &&  driver_prof_stat == 2){
            $state.go('tab.location');          
        }
        else{
            //$state.go('driverpending');
            console.log("called");
            $state.go('tab.location');
        }
    }*/
    else if(loginprof == 3){
        $state.go('tab3.driver-admin');
    }
  }

  $scope.logout = function()
  {
    Parse.User.logOut();
    $state.go('login');
    //$window.location.reload(true)
  }


  $scope.initialize = function() 
  {
    //console.log("called inti of the home screen")
    //$scope.initialize1(); 
  };

})

//*************************** end of SideMenuController ****************************

//*************************** start of LoginCtrl ****************************

.controller('LoginCtrl', function($scope, $ionicModal, $state, $rootScope, $ionicPopup, $timeout, route_screen,$cordovaCamera,$cordovaToast) {

  var self=this;
  var dl_file;

  $scope.$on('$ionicView.enter', function(ev) {
    if(ev.targetScope !== $scope)
        return;
      //console.log("called initialize function");
      initialize1();
  });

  function initialize1() {
      $scope.currentUser ={
        mobilenumber: null,
        password:''
      };
      $scope.newUser={
        firstName: 'sendurr',
        lastName: "",
        mobilenumber: null,
        password:'',
        email:'',
        dob: new Date(),
        driving_license: ""
      };

      $scope.ischecked = true;
      $scope.isdriver = false;
      $scope.showdriver = function(){ return false};

      $scope.newUser= {driver:"Are you a driver?"};    
      var credential = route_screen.getlocal();
      if(credential.usr_name!=""){
          $scope.currentUser= {
            mobilenumber:Number(credential.usr_name),
            password:credential.pass,
            };     
        }
  }

  $scope.login_user = function(currentUser)
  {
      if(currentUser.mobilenumber== null ){
        message='Please enter mobile number!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if(currentUser.password ==""){
        message='Please enter password!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else{
        $scope.login_user_after_valid(currentUser);
      }
  }

  $scope.login_user_after_valid = function(currentUser)
  {
  	//$scope.showAlert();
    Parse.User.logIn(currentUser.mobilenumber.toString(),currentUser.password, {
      success: function(user) {
        // Hooray! Let them use the app now.
        console.log(user.get("username"));
        if ($scope.ischecked){
            $scope.ischecked = false;
            $scope.signedin(currentUser);
        }
        if(user.get("group")=="customer"){
            route_screen.set_login_prof(1);
            route_screen.get_cust_info();
            $state.go('tab.location');
          }
        else if(user.get("group")=="driver"){
            route_screen.set_login_prof(2);
            route_screen.get_driver_info().then(function(results) {
                driver_info = results;
                driver_prof_stat = route_screen.get_driver_prof_stat();
                route_screen.get_truck_reg_stat().then(function(results1) {
                      truck_reg_stat = results1;
                      if(truck_reg_stat == 2 && driver_prof_stat == 2)
                      {
                          $state.go('tab.location');
                      }
                      else{
                          //$state.go('driverpending');
                          $state.go('tab.location');
                      }
                  });
            });
        }
        else if(user.get("group")=="admin"){
            route_screen.set_login_prof(3);
            route_screen.get_cust_info();
            $state.go('tab3.driver-admin');
        }
        $rootScope.$broadcast('authorized');
      },
      error: function(user, error) {
        // Show the error message somewhere and let the user try again.
        alert("Error: " + error.code + " " + error.message);
      }
    });  
  };

  $scope.signup = function(newUser)
  {
      if(typeof(newUser.lastName) == 'undefined' ){
        newUser.lastName = "" ;
        //console.log(newUser.lastName);
      }
      if(typeof(newUser.email) == 'undefined' ){
        newUser.email = "" ;
        //console.log(newUser.email);
      }
      if(newUser.firstName== ""  || typeof(newUser.firstName) == 'undefined'){
        message='Please enter first name!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if(newUser.mobilenumber== null ){
        message='Please enter mobile number!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if(newUser.password== ""  || typeof(newUser.password) == 'undefined'){
        message='Please enter password!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if((newUser.driving_license== ""  || typeof(newUser.driving_license) == 'undefined')  && $scope.isdriver){
        message='Please enter Driving license No!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if((newUser.dob== ""  || typeof(newUser.dob) == 'undefined')  && $scope.isdriver){
        message='Please enter Date of Birth!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if((newUser.dl_picture== ""  || typeof(newUser.dl_picture) == 'undefined') && $scope.isdriver){
        message='Please upload picture Driving license!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else{
        //console.log("successful");
        $scope.signup_after_valid(newUser);
      }
  }

  $scope.signup_after_valid = function(newUser){
    var user = new Parse.User();
    user.set("username", newUser.mobilenumber.toString());
    user.set("password", newUser.password);
    user.set("email", newUser.email);

    // other fields can be set just like with Parse.Object
    // user.set("phone", "");

    return user.signUp(null, {
      success: function(user) {
        console.log(user.id);
        if ($scope.isdriver){
            $scope.create_driver(newUser);
            $scope.add_driver_role();
          }
        else{
            $scope.create_customer(newUser);
            $scope.add_cust_role();
          }
        newUser.firstName="";
        newUser.lastName="";
        newUser.mobilenumber="";
        newUser.password="";
        newUser.email="";
        $scope.closeModal();
        $state.go('tab.location');
        },
      error: function(user, error) {
        // Show the error message somewhere and let the user try again.
        alert("Error: " + error.code + " " + error.message);
        }
      });
    };

  $scope.create_customer = function(newUser) {
    var customer_class = Parse.Object.extend("Customer");
    p1= new customer_class();
    p1.set("first_name",newUser.firstName);
    p1.set("last_name",newUser.lastName);
    p1.set("mobile_number",newUser.mobilenumber.toString());

    p1.save(null,{
    success:function(obj){
	    //console.log(obj.id);
      var p2 = Parse.User.current();
      p2.set("group","customer");
      p2.set("customer", obj);
      p2.save();
      route_screen.set_login_prof(1);
      route_screen.get_cust_info(); 
      route_screen.savelocal("","");
	    },
    error:function(error){
	    console.log(error.message);
	    }
    });
  };

  $scope.create_driver = function(newUser) {
    var driver_class = Parse.Object.extend("Driver");
    d1= new driver_class();
    d1.set("first_name",newUser.firstName);
    d1.set("last_name",newUser.lastName);
    d1.set("mobile_number",newUser.mobilenumber.toString());
    d1.set("driving_license",newUser.driving_license);
    d1.set("dob",newUser.dob);
    d1.set("no_of_trucks",0);
    d1.set("no_of_rating",0);
    d1.set("no_of_comment",0);
    d1.set("no_of_ship",0);
    d1.set("approval","Pending");
    //d1.set("dl_picture",newUser.dl_picture);
    var parseFile = new Parse.File('dl_pic.jpeg', dl_file);
    parseFile.save().then(function() {
        // The file has been saved to Parse.
        d1.set("dl_picture",parseFile);
        d1.save(null,{
            success:function(obj){
                //alert(obj.id);
                var p2 = Parse.User.current();
                p2.set("group","driver");
                p2.set("driver", obj);
                p2.save();
                route_screen.set_login_prof(2);
                route_screen.get_driver_info();
                route_screen.savelocal("","");
                },
            error:function(error){
                //console.log(error.message);
                //alert(error.message);
                }
            });
        }, function(error) {
            alert(error.message);
              // The file either could not be read, or could not be saved to Parse.
        });

    /*d1.save(null,{
    success:function(obj){
      console.log(obj.id);
      //$scope.uploadprofpic(dl_file, 'dl_pic.jpeg',d1);
      var p2 = Parse.User.current();
      p2.set("group","driver");
      p2.set("driver", obj);
      p2.save();
      route_screen.set_login_prof(2);
      route_screen.get_driver_info();
      route_screen.savelocal("","");
      },
    error:function(error){
      console.log(error.message);
      }
    });*/
  };

 $scope.takePicture = function() {
      var options = { 
          quality : 75, 
          destinationType : Camera.DestinationType.DATA_URL, 
          sourceType : Camera.PictureSourceType.CAMERA, 
          allowEdit : true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
        };
 
      $cordovaCamera.getPicture(options).then(function(imageData) {
          $scope.newUser.dl_picture = "data:image/jpeg;base64," + imageData;;
          dl_file = { __ContentType: "image/jpeg", base64: imageData };
        }, function(err) {
            // An error occured. Show a message to the user
        });
    }

  $scope.uploaddlpic = function(file, name, currentdriver ) 
  {
      var parseFile = new Parse.File(name, file);
      parseFile.save().then(function() {
              // The file has been saved to Parse.
              currentdriver.set("dl_picture",parseFile);
              currentdriver.save(null,{
                  success:function(obj){
                        alert(obj.id);
                    },
                  error:function(error){
                        //console.log(error.message);
                        alert(error.message);
                    }
                });
        }, function(error) {
            alert(error.message);
              // The file either could not be read, or could not be saved to Parse.
        });
  };

  $scope.add_cust_role = function() {
      var query = new Parse.Query(Parse.Role);
      query.contains("name", "customers");
      query.find({
          success : function(role) {
              //console.log("roles: " + role[0].get("name"));
              role[0].getUsers().add(Parse.User.current());
              role[0].save();
            },
            error : function(error) {
                response.error("error adding to admin role " + error);
              }
      });
  };

  $scope.add_driver_role = function() {
      var query = new Parse.Query(Parse.Role);
      query.contains("name", "drivers");
      query.find({
          success : function(role) {
              //console.log("roles: " + role[0].get("name"));
              role[0].getUsers().add(Parse.User.current());
              role[0].save();
            },
            error : function(error) {
                response.error("error adding to admin role " + error);
              }
      });
  };

  $ionicModal.fromTemplateUrl('modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
    }).then(function(modal) {
    $scope.modal = modal;
    });

  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

   $scope.showAlert = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Don\'t eat that!',
       template: 'It might taste good'
     });
     alertPopup.then(function(res) {
       console.log('Thank you for not eating my delicious ice cream cone');
     });

     $timeout(function() {
        alertPopup.close(); //close the popup after 3 seconds for some reason
     }, 3000);
   };

  $scope.signedin = function (currentUser) {
    if ($scope.ischecked){
      $scope.ischecked = false;
      //console.log("unchecked" +  $scope.ischecked);
      route_screen.savelocal("","");
    }
    else{
      $scope.ischecked = true;
      //console.log("checked" + $scope.ischecked);
      route_screen.savelocal(currentUser.mobilenumber.toString(),currentUser.password);
    }
  };

  $scope.drivermode = function() 
  {
    if(!$scope.isdriver){
        $scope.newUser= {driver:"Creating your profile as a driver!"};
        $scope.isdriver = true;
        $scope.showdriver = function(){ return true};
      }
    else{
        $scope.newUser= {driver:"Are you a driver?"};
        $scope.isdriver = false;
        $scope.showdriver = function(){ return false};
      }
  }

  $scope.init = function() 
  {
    /*$scope.ischecked = true;
    $scope.isdriver = false;
    $scope.showdriver = function(){ return false};

    $scope.newUser= {driver:"Are you a driver?"};    
    var credential = route_screen.getlocal();
    if(credential.usr_name!=""){
        $scope.currentUser= {
          mobilenumber:Number(credential.usr_name),
          password:credential.pass,
          };     
      }*/
  }


})

//*************************** end of LoginCtrl ****************************

//*************************** start of driver-adminController ****************************
.controller('driver-adminController', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen) {

  var driver_list_admin =[];
  $scope.$on('$ionicView.enter', function(ev) {
    if(ev.targetScope !== $scope)
        return;
      //console.log("called initialize function");
      initialize1();
  });

  function initialize1() {
      $scope.nodrivers = function() {return false;}
      route_screen.get_driver_list_admin().then(function(results){
            driver_list_admin=results;
            $scope.drivers=results;
            $scope.nodrivers = function() {
                if (results.length>0){
                    return false;
                }else{
                    return true;
                }
              };
        });
  }
  
  $scope.clickedriver = function(id) 
  {
      //console.log("you clicked " + id);
      route_screen.store_driver_id(id);
      //console.log(driver_list_admin[0]);
      route_screen.override_driver_info_admin(driver_list_admin);
      //console.log("you clicked " + id);
      $state.go('driver-admindetail');

  };

  $scope.initialize = function() 
  {

  };
})

//*************************** end of driver-adminController ****************************

//*************************** start of driver-admindetailController ****************************
.controller('driver-admindetailController', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen,$ionicPopup) {

  var driver_info;
  var clicked_item;
  var cust_trip_info;
  $scope.$on('$ionicView.enter', function(ev) {
    if(ev.targetScope !== $scope)
        return;
      //console.log("called initialize function");
      initialize1();
  });

  function initialize1() {
    clicked_item = route_screen.get_driver_id();
    driver_info=route_screen.return_driver_info();
    $scope.user=driver_info[clicked_item];
      $scope.show_approve = function() {
          if(driver_info[clicked_item].approval == "Approved"){
              return false;
            }
            else{
              return true;
            }
        }

    //$scope.user.email=currentuser.get("email");
  }

  $scope.back = function() 
  {
      $state.go('tab3.driver-admin');

  };

  $scope.rating = function()
  {
      //console.log("clicked_rating");
      $state.go('driverrating');
  };

  $scope.approve = function() 
  {
        var confirmPopup = $ionicPopup.confirm({
             title: 'Approve Driver',
             template: 'Are you sure you want to approve?'
           });
           confirmPopup.then(function(res) {
             if(res) {
               $scope.updt_driver();
             } else {
               console.log('You are not sure');
             }
           });

  };

  $scope.updt_driver = function() 
  {
      var driver_info_class = Parse.Object.extend("Driver");
      var query = new Parse.Query(driver_info_class);
      query.equalTo("mobile_number", driver_info[clicked_item].mobile_number);
      query.find({
          success: function(results) {
              results[0].set("approval","Approved");
              results[0].save();
              $state.go("tab3.driver-admin");
            },
          error: function(error) {
              console.log(" The object was not retrieved successfully.");
          }
        });
  };

  $scope.initialize = function() 
  {

  };

 
})

//*************************** end of driver-admindetailController ****************************

//*************************** start of truck-adminController ****************************
.controller('truck-adminController', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen) {

  var cust_info;
  var cust_trip_info;
  $scope.$on('$ionicView.enter', function(ev) {
    if(ev.targetScope !== $scope)
        return;
      //console.log("called initialize function");
      initialize1();
  });

  function initialize1() {
      $scope.notrucks = function() {return false;}
      route_screen.get_trucks_info().then(function(results){
          $scope.trucks=results;
          $scope.notrucks = function(){
              if(results.length>0){
                  return false;
                }
              else{
                  return true;
                }
            }
        });
  }

  $scope.initialize = function() 
  {
      //initialize1();
  };

  $scope.clickedtruck = function(id) 
  {
      //console.log("you clicked " + id);
      route_screen.store_truck_id(id);
      $state.go('viewtruck');
  }

  $scope.initialize = function() 
  {

  };
})

//*************************** end of truck-adminController ****************************

//*************************** start of driverpendingController ****************************
.controller('driverpendingController', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen) {


  $scope.$on('$ionicView.enter', function(ev) {
    if(ev.targetScope !== $scope)
        return;
      //console.log("called initialize function");
      initialize1();
  });

  function initialize1() {
      $scope.truckpending = function() {return false;}
      $scope.profpending = function() {return false;}
      var truck_reg_stat = route_screen.return_truck_reg_stat();
      var driver_prof_stat = route_screen.return_driver_prof_stat();
      $scope.truckpending = function() {
          if(truck_reg_stat == 2){
            return false;
          }
          else{
            return true;
          }
      }
      $scope.profpending = function() {
          if(driver_prof_stat == 2){
            return false;
          }
          else{
            return true;
          }
      }
  }

  $scope.initialize = function() 
  {

  };
})

//*************************** end of driverpendingController ****************************

//*************************** start of custprofileController ****************************
.controller('custprofileController', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen,$cordovaCamera) {

  var cust_info;
  var cust_trip_info;
  $scope.$on('$ionicView.enter', function(ev) {
    if(ev.targetScope !== $scope)
        return;
      //console.log("called initialize function");
      initialize1();
  });

  function initialize1() {
    var currentuser = Parse.User.current();
    $scope.user=route_screen.return_cust_info();
    $scope.user.email=currentuser.get("email");
    //$scope.user.picture ="img/profile.jpg";
  }

  $scope.initialize = function() 
  {

  };

  $scope.edit = function() 
  {
      $state.go('editcustprofile');
  };

  $scope.takePicture = function() {
      var options = { 
          quality : 75, 
          destinationType : Camera.DestinationType.DATA_URL, 
          sourceType : Camera.PictureSourceType.CAMERA, 
          allowEdit : true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
        };
 
      $cordovaCamera.getPicture(options).then(function(imageData) {
          $scope.user.picture = "data:image/jpeg;base64," + imageData;;
          file = { __ContentType: "image/jpeg", base64: imageData };
          $scope.uploadprofpic(file, 'user_profile_pic.jpeg');
        }, function(err) {
            // An error occured. Show a message to the user
        });
    }

  $scope.uploadprofpic = function(file, name) 
  {
      var currentuser = Parse.User.current();
      var currentcustomer = currentuser.get('customer');
      var parseFile = new Parse.File(name, file);
      parseFile.save().then(function() {
              // The file has been saved to Parse.
              currentcustomer.set("picture",parseFile);
              currentcustomer.save(null,{
                  success:function(obj){
                        console.log(obj.id);
                    },
                  error:function(error){
                        //console.log(error.message);
                        console.log(error.message);
                    }
                });
        }, function(error) {
            alert(error.message);
              // The file either could not be read, or could not be saved to Parse.
        });
  };

})

//*************************** end of custprofileController ****************************

//*************************** start of editcustprofileController ****************************
.controller('editcustprofileController', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen) {

  var cust_info;
  var cust_trip_info;
  $scope.$on('$ionicView.enter', function(ev) {
    if(ev.targetScope !== $scope)
        return;
      //console.log("called initialize function");
      initialize1();
  });

  function initialize1() {
      var currentuser = Parse.User.current();
      $scope.user=route_screen.return_cust_info();
      $scope.user.email=currentuser.get("email");
  }

  $scope.initialize = function() 
  {

  };

  $scope.save = function() 
  {

      var currentuser = Parse.User.current();
      currentuser.set("email",$scope.user.email);
      currentuser.save();
      var currentcustomer = currentuser.get('customer');
      currentcustomer.set("first_name",$scope.user.first_name);
      currentcustomer.set("last_name",$scope.user.last_name);
      currentcustomer.set("addline1",$scope.user.addline1);
      currentcustomer.set("addline2",$scope.user.addline2);
      currentcustomer.set("city",$scope.user.city);
      currentcustomer.set("state",$scope.user.state);
      currentcustomer.set("postal_code",$scope.user.postal_code);

      currentcustomer.save(null,{
          success:function(obj){
                console.log(obj.id);
                $state.go('custprofile');
            },
          error:function(error){
                console.log(error.message);
            }
        });

  };

})

//*************************** end of editcustprofileController ****************************

//*************************** start of driverprofileController ****************************
.controller('driverprofileController', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen,$cordovaCamera) {

  var cust_info;
  var cust_trip_info;
  $scope.$on('$ionicView.enter', function(ev) {
    if(ev.targetScope !== $scope)
        return;
      //console.log("called initialize function");
      initialize1();
  });

  function initialize1() {
    var currentuser = Parse.User.current();
    $scope.user=route_screen.return_driver_info();
    $scope.user.email=currentuser.get("email");
    //$scope.user.picture ="img/profile.jpg";
  }

  $scope.initialize = function() 
  {

  };

  $scope.rating = function()
  {
      //console.log("clicked_rating");
      $state.go('driverrating');
  };

  $scope.edit = function() 
  {
      $state.go('editdriverprofile');
  };

  $scope.takePicture = function() {
      var options = { 
          quality : 75, 
          destinationType : Camera.DestinationType.DATA_URL, 
          sourceType : Camera.PictureSourceType.CAMERA, 
          allowEdit : true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
        };
 
      $cordovaCamera.getPicture(options).then(function(imageData) {
          $scope.user.picture = "data:image/jpeg;base64," + imageData;;
          file = { __ContentType: "image/jpeg", base64: imageData };
          $scope.uploadprofpic(file, 'user_profile_pic.jpeg');
        }, function(err) {
            // An error occured. Show a message to the user
        });
    }

  $scope.uploadprofpic = function(file, name) 
  {
      var currentuser = Parse.User.current();
      var currentdriver = currentuser.get('driver');
      var parseFile = new Parse.File(name, file);
      parseFile.save().then(function() {
              // The file has been saved to Parse.
              currentdriver.set("picture",parseFile);
              currentdriver.save(null,{
                  success:function(obj){
                        console.log(obj.id);
                        //alert(obj.id);
                    },
                  error:function(error){
                        console.log(error.message);
                        //alert(error.message);
                    }
                });
        }, function(error) {
            console.log(error.message);
              // The file either could not be read, or could not be saved to Parse.
        });
  };

})

//*************************** end of driverprofileController ****************************

//*************************** start of driverratingController ****************************
.controller('driverratingController', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen) {

  var driver;
  var driver_info;
  var driver_username;
  var driver_rating;
  var driver_temp = [];
  $scope.$on('$ionicView.enter', function(ev) {
    if(ev.targetScope !== $scope)
        return;
      //console.log("called initialize function");
      initialize1();
  });

  function initialize1() {

      $scope.norating= function(){return false};
      var currentuser = Parse.User.current();
      if(currentuser.get("group") == "driver"){
          driver = true;
          driver_username = currentuser.get("username");
        }else{
          driver = false;
          driver_info = route_screen.return_driver_info();
          driver_username = driver_info.mobile_number;
        }
        
      route_screen.get_driver_rating(driver_username).then(function(results){
          driver_rating=results;
          $scope.norating= function(){
              if (driver_rating.length > 0){
                  return false;
                }else{
                  return true;
                }
            };
          for(i=0; i<driver_rating.length;i++){
                var ratingObject_temp = {
                    iconOn : 'ion-ios-star',
                    iconOff : 'ion-ios-star-outline',
                    iconOnColor: 'rgb(200, 200, 100)',
                    iconOffColor:  'rgb(200, 100, 100)',
                    rating:  driver_rating[i].get("rating"),
                    minRating:1,
                    readOnly: true
                  }
                var driver_object = {
                  id: i,
                  cust_name: driver_rating[i].get("cust_name"),
                  rating: driver_rating[i].get("rating"),
                  createdAt: driver_rating[i].get("createdAt"),
                  ratingsObject: ratingObject_temp,
                  comments: driver_rating[i].get("comments"),
                }
                driver_temp.push(driver_object);
                if(i == driver_rating.length-1){
                    $scope.drivers = driver_temp;
                  }
              };
        });
      }

  $scope.initialize = function() 
  {

  };

})

//*************************** end of driverratingController ****************************

//*************************** start of ratedriverController ****************************
.controller('ratedriverController', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen, $stateParams, $ionicPopup) {


  var driver_trip_info;
  var driver_trip_list;
  var driver_trip_gps;
  var clicked_item;
  var driver_info;
  var truck_info;
  var driver;
  var from_lat , from_lng , to_lat, to_lng;
  var def_rating =3;
  var currentuser, cust_info, driver_comment_no =1;
  $scope.$on('$ionicView.enter', function() {
      //console.log("called initialize function");
      //console.log("you clicked in the details section " + route_screen.get_driver_id());
      //console.log("you clicked on mode " + route_screen.get_driver_mode());
      //route_screen.clear_driver_trip_match_var();
      clicked_item = route_screen.get_driver_id();
      $scope.drivermode = function() {
          if(route_screen.get_driver_mode() == 4)
              {
                //console.log("the driver mode is select view mode of customer");
                return true;
              }
            else{
                //console.log("the dirver mode is edit");
                return false;
              }
        }
      var currentuser = Parse.User.current();
      cust_info = route_screen.return_cust_info();
      if(currentuser.get("group") == "driver"){
        driver = true;
      }else{
        driver = false;
      }

      initMap();
      //initialize1();
  });

      function initMap() {
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var map = new google.maps.Map(document.getElementById('map4'), {
            zoom: 7,
            center: {lat: 41.85, lng: -87.65},
            navigationControl: false,
            mapTypeControl: false,
            scaleControl: false,
            draggable: false,
            disableDefaultUI: true,
            zoomControl:false
          });
        //$scope.map=map;

        route_screen.get_driver_trip_list_detail(clicked_item).then(function(results){
            driver_trip_list=results;
            //console.log(driver_trip_list);
            route_screen.get_driver_trip_info_detail(clicked_item).then(function(results){
                driver_trip_info = results;
                //console.log(driver_trip_info);
                route_screen.get_driver_trip_gps(driver_trip_info).then(function(results){
                    driver_trip_gps=results;
                    from_lat = driver_trip_info.get("source_coordinates")._latitude;
                    from_lng = driver_trip_info.get("source_coordinates")._longitude;
                    to_lat = driver_trip_gps.get("destination_coordinates")._latitude;
                    to_lng = driver_trip_gps.get("destination_coordinates")._longitude;
                    //console.log(driver_trip_info.get("source_coordinates"));
                    directionsDisplay.setMap(map);
                    calculateAndDisplayRoute(directionsService, directionsDisplay,map);
                  });
                route_screen.get_trucks_info_details(driver_trip_info).then(function(results1){
                    truck_info = results1;
                    //console.log(truck_info);
                    if (route_screen.get_driver_mode() == 3 || route_screen.get_driver_mode() == 4 || route_screen.get_driver_mode() == 2){
                            driver_info=route_screen.return_driver_info();
                            //console.log(driver_info);
                            $scope.build_driver_list_disp(); 
                    }
                    else{
                        route_screen.get_driver_info().then(function(results){
                              driver_info=results;
                              //console.log(driver_info);
                              $scope.build_driver_list_disp();
                          });
                    }
                  });
              });

          });



      }

      function calculateAndDisplayRoute(directionsService, directionsDisplay,map) {
        var start = new google.maps.LatLng(from_lat,from_lng);
        var end = new google.maps.LatLng(to_lat,to_lng);
        directionsService.route({
          origin: start,
          destination: end,
          travelMode: google.maps.TravelMode.DRIVING
        }, function(response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            //console.log("success direction");
            directionsDisplay.setDirections(response);
          } else {
            //window.alert('Directions request failed due to ' + status);
            var myLatlng = new google.maps.LatLng(from_lat,from_lng);
            map.setCenter(myLatlng);
            $scope.marker_current = new google.maps.Marker({
                map: map,
                position:myLatlng
              });
          }
        });
      }

  $scope.build_driver_list_disp = function(){

      var d = new Date();
      var curr_year = d.getFullYear();

      var R = 6371;
      var dLat = toRad(from_lat-to_lat);
      var dLon = toRad(from_lng - to_lng);
      var dLat1 = toRad(to_lat);
      var dLat2 = toRad(from_lat);
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(dLat1) * Math.cos(dLat1) * Math.sin(dLon/2) * Math.sin(dLon/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = Math.round(Number(R * c)); // in kms

      $scope.driver={
          age: curr_year - driver_info.dob.getFullYear(),
          source: driver_trip_info.get("source"),
          destination: driver_trip_info.get("destination"),
          start_date_time: driver_trip_info.get("start_date_time"),
          end_date_time: driver_trip_info.get("end_date_time"),
          status: driver_trip_info.get("status"),
          name: driver_info.first_name + " " + driver_info.last_name,
          make: truck_info.make,
          model: truck_info.model,
          type: truck_info.type,
          registration_number: truck_info.registration_number,
          profile_pic: driver_info.picture,
          rating: def_rating,
          distance: d
        };
    };

     $scope.ratingsObject = {
       iconOn : 'ion-ios-star',
        iconOff : 'ion-ios-star-outline',
        iconOnColor: 'rgb(200, 200, 100)',
        iconOffColor:  'rgb(200, 100, 100)',
        rating:  def_rating,
        minRating:1,
        readOnly: false,
        callback: function(rating) {
          $scope.ratingsCallback(rating);
        }
      };

      $scope.ratingsCallback = function(rating) {
        //console.log('Selected rating is : ', rating);
        $scope.driver.rating=rating;
      };

  function toRad(x) {
      return x * Math.PI / 180;
    };

  $scope.submit = function() 
  {
      if($scope.driver.comments == ""  || typeof($scope.driver.comments) == 'undefined'){
        $scope.driver.comments="NA";
        driver_comment_no=0;
      }
      var driver_rating_class = Parse.Object.extend("Rating");
      dr1= new driver_rating_class();
      dr1.set("rating",Number($scope.driver.rating));
      dr1.set("comments",$scope.driver.comments);
      dr1.set("driver_username",driver_info.mobile_number);
      dr1.set("cust_name", cust_info.first_name + " " + cust_info.last_name);
      dr1.save(null,{
      success:function(obj){
        console.log(obj.id);
        driver_trip_list.set("rating",obj);
        driver_trip_list.save();
        $scope.updt_driver_prof();
        },
      error:function(error){
        console.log(error.message);
        }
      });
  };

  $scope.updt_driver_prof = function() 
  {
      var driver_info_class = Parse.Object.extend("Driver");
      var query = new Parse.Query(driver_info_class);
      query.equalTo("mobile_number", driver_info.mobile_number);
      query.find({
          success: function(results) {
              var rating_temp = results[0].get("no_of_rating");
              var comment_temp = results[0].get("no_of_comment");
              results[0].set("no_of_rating",rating_temp+1);
              results[0].set("no_of_comment",comment_temp+driver_comment_no);
              results[0].save();
          },
          error: function(object, error) {
              console.log(error.message);
              // The file either could not be read, or could not be saved to Parse.
            }
        });

  };

  $scope.initialize = function() 
  {

  };


})

//*************************** end of ratedriverController ****************************

//*************************** start of editdriverprofileController ****************************
.controller('editdriverprofileController', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen) {

  var cust_info;
  var cust_trip_info;
  $scope.$on('$ionicView.enter', function(ev) {
    if(ev.targetScope !== $scope)
        return;
      //console.log("called initialize function");
      initialize1();
  });

  function initialize1() {
      var currentuser = Parse.User.current();
      $scope.user=route_screen.return_driver_info();
      $scope.user.email=currentuser.get("email");
  }

  $scope.initialize = function() 
  {

  };

  $scope.save = function() 
  {

      var currentuser = Parse.User.current();
      currentuser.set("email",$scope.user.email);
      currentuser.save();
      var currentdriver = currentuser.get('driver');
      currentdriver.set("first_name",$scope.user.first_name);
      currentdriver.set("last_name",$scope.user.last_name);
      currentdriver.set("address_line1",$scope.user.address_line1);
      currentdriver.set("address_line2",$scope.user.address_line2);
      currentdriver.set("city",$scope.user.city);
      currentdriver.set("state",$scope.user.state);
      currentdriver.set("postal_code",$scope.user.postal_code);
      currentdriver.set("driving_license",$scope.user.driving_license);
      currentdriver.set("dob",$scope.user.dob);

      currentdriver.save(null,{
          success:function(obj){
                console.log(obj.id);
                $state.go('driverprofile');
            },
          error:function(error){
                console.log(error.message);
            }
        });

  };

})

//*************************** end of editdriverprofileController ****************************

//*************************** start of trucksController ****************************
.controller('trucksController', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen) {


  $scope.$on('$ionicView.enter', function(ev) {
      if(ev.targetScope !== $scope)
          return;
      //console.log("called initialize function");
      initialize1();

  });

  function initialize1() {

      route_screen.get_trucks_info().then(function(results){
          $scope.trucks=results;
          $scope.notrucks = function(){
              if(results.length>0){
                  return false;
                }
              else{
                  return true;
                }
            }
        });
  }

  $scope.initialize = function() 
  {
      //initialize1();
  };

  $scope.add = function() 
  {
      $state.go('addtruck');
  };

  $scope.clickedtruck = function(id) 
  {
      //console.log("you clicked " + id);
      route_screen.store_truck_id(id);
      $state.go('viewtruck');
  }

})

//*************************** end of trucksController ****************************

//*************************** start of addtruckController ****************************
.controller('addtruckController', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen,$ionicPopup,$cordovaCamera,$cordovaToast) {

  var cust_info;
  var cust_trip_info;
  var pict1_file , pict2_file, pict3_file;
  $scope.$on('$ionicView.enter', function(ev) {
    if(ev.targetScope !== $scope)
        return;
      //console.log("called initialize function");
      initialize1();
  });

  function initialize1() {
    $scope.truck=[];
  }

  $scope.initialize = function() 
  {

  };

  $scope.save = function()
  {
      if($scope.truck.make == ""  || typeof($scope.truck.make) == 'undefined'){
        message='Please enter truck make!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.truck.model == ""  || typeof($scope.truck.model) == 'undefined'){
        message='Please enter truck model!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.truck.type == ""  || typeof($scope.truck.type) == 'undefined'){
        message='Please enter truck type!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.truck.registration_number == ""  || typeof($scope.truck.registration_number) == 'undefined'){
        message='Please enter truck registration number!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.truck.load_height== null ){
        message='Please enter truck load height!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.truck.load_width== null ){
        message='Please enter truck load width!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.truck.load_length== null ){
        message='Please enter truck load length!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.truck.capacity== null ){
        message='Please enter truck load capacity!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.truck.picture1 == ""  || typeof($scope.truck.picture1) == 'undefined'){
        message='Please Upload Front Picture!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.truck.picture2 == ""  || typeof($scope.truck.picture2) == 'undefined'){
        message='Please Upload registration documents!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.truck.picture3 == ""  || typeof($scope.truck.picture3) == 'undefined'){
        message='Please Upload Load Area Picture!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else{
        //console.log("successful");
        $scope.save_after_valid();
      }
  }


  $scope.save_after_valid = function()
  {
      //console.log($scope.truck.make);
      //console.log($scope.truck.load_width);
      var new_truck_class = Parse.Object.extend("Trucks");
      var t1= new new_truck_class();
      t1.set("make",$scope.truck.make);
      t1.set("model",$scope.truck.model);
      t1.set("type",$scope.truck.type);
      t1.set("registration_number",$scope.truck.registration_number);
      t1.set("load_height",$scope.truck.load_height);
      t1.set("load_width",$scope.truck.load_width);
      t1.set("load_length",$scope.truck.load_length);
      t1.set("capacity",$scope.truck.capacity);
      t1.set("status","Registration Pending");

      acl=new Parse.ACL(Parse.User.current());
      acl.setReadAccess(Parse.User.current(),true);
      acl.setWriteAccess(Parse.User.current(),true);

    //get list of customers
    var query = new Parse.Query(Parse.Role);
    query.contains("name", "customers");
    query.find({
        success : function(role) {
            acl.setReadAccess(role[0],true);
            acl.setWriteAccess(role[0],true);
            t1.setACL(acl);
            t1.save(null,{
                success:function(obj){
                    console.log(obj.id);
                    $scope.uploadtruckpic(obj);
                    $scope.updatetruckinfo();
                    route_screen.get_driver_info();
                    $ionicPopup.alert({
                        title: 'Submitted - Great!',
                        content: 'Your truck has been submitted for approval.'
                        }).then(function(res) {
                            $state.go('trucks');
                      });
                },
                error:function(error){
                    console.log(error.message);
                }
            });
          },
        error : function(error) {
             response.error("error in finding roles of customers" + error);
        }
     });
  };

  $scope.uploadtruckpic = function(obj){
      var new_truck_class = Parse.Object.extend("Trucks");
      var query = new Parse.Query(new_truck_class);
      query.get(obj.id, {
          success: function(t1) {
              if(pict1_file){
                  var parseFile1 = new Parse.File("picture1.jpeg", pict1_file);
                  parseFile1.save().then(function() {
                          // The file has been saved to Parse.
                          t1.set("picture1",parseFile1);
                          t1.save(null,{
                              success:function(obj){
                                    console.log(obj.id);
                                    //alert(obj.id);
                                    route_screen.get_driver_info();
                                },
                              error:function(error){
                                    console.log(error.message);
                                    //alert(error.message);
                                }
                            });
                }, function(error) {
                    alert(error.message);
                      // The file either could not be read, or could not be saved to Parse.
                });
              }
              if(pict2_file){
                  var parseFile2 = new Parse.File("picture2.jpeg", pict2_file);
                  parseFile2.save().then(function() {
                          // The file has been saved to Parse.
                          t1.set("picture2",parseFile2);
                          t1.save(null,{
                              success:function(obj){
                                    console.log(obj.id);
                                    //alert(obj.id);
                                },
                              error:function(error){
                                    console.log(error.message);
                                    //alert(error.message);
                                    route_screen.get_driver_info();
                                }
                            });
                }, function(error) {
                    //alert(error.message);
                      // The file either could not be read, or could not be saved to Parse.
                });
              }
              if(pict3_file){
                  var parseFile3 = new Parse.File("picture3.jpeg", pict3_file);
                  parseFile3.save().then(function() {
                          // The file has been saved to Parse.
                          t1.set("picture3",parseFile3);
                          t1.save(null,{
                              success:function(obj){
                                    console.log(obj.id);
                                    //alert(obj.id);
                                    route_screen.get_driver_info();
                                },
                              error:function(error){
                                    console.log(error.message);
                                    //alert(error.message);
                                }
                            });
                }, function(error) {
                    //alert(error.message);
                      // The file either could not be read, or could not be saved to Parse.
                });

              }  
          },
          error: function(object, error) {
              console.log(" The object was not retrieved successfully.");
          }
        });
  };

  $scope.updatetruckinfo = function() 
  {
      var currentuser = Parse.User.current();
      var currentdriver = currentuser.get('driver');
      var driver_info_class = Parse.Object.extend("Driver");
      var query = new Parse.Query(driver_info_class);
      query.get(currentdriver.id, {
          success: function(results) {
              var trucks_temp = results.get("no_of_trucks");
              results.set("no_of_trucks",trucks_temp+1);
              results.save();
          },
          error: function(object, error) {
              alert(error.message);
              // The file either could not be read, or could not be saved to Parse.
            }
        });
  };


 $scope.takePicture1 = function() {
      var options = { 
          quality : 75, 
          destinationType : Camera.DestinationType.DATA_URL, 
          sourceType : Camera.PictureSourceType.CAMERA, 
          allowEdit : true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
        };
 
      $cordovaCamera.getPicture(options).then(function(imageData) {
          $scope.truck.picture1 = "data:image/jpeg;base64," + imageData;
          pict1_file = { __ContentType: "image/jpeg", base64: imageData };
        }, function(err) {
            // An error occured. Show a message to the user
        });
    };

 $scope.takePicture2 = function() {
      //var deferred = $q.defer();
      var options = { 
          quality : 75, 
          destinationType : Camera.DestinationType.DATA_URL, 
          sourceType : Camera.PictureSourceType.CAMERA, 
          allowEdit : true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
        };
 
      $cordovaCamera.getPicture(options).then(function(imageData) {
          //deferred.resolve(imageData);
          $scope.truck.picture2 = "data:image/jpeg;base64," + imageData;
          pict2_file = { __ContentType: "image/jpeg", base64: imageData };
        }, function(err) {
            // An error occured. Show a message to the user
            //deferred.reject();
        });
      //return deferred.promise;
    };

 $scope.takePicture3 = function() {
      //var deferred = $q.defer();
      var options = { 
          quality : 75, 
          destinationType : Camera.DestinationType.DATA_URL, 
          sourceType : Camera.PictureSourceType.CAMERA, 
          allowEdit : true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
        };
 
      $cordovaCamera.getPicture(options).then(function(imageData) {
          //deferred.resolve(imageData);
          $scope.truck.picture3 = "data:image/jpeg;base64," + imageData;
          pict3_file = { __ContentType: "image/jpeg", base64: imageData };
        }, function(err) {
            // An error occured. Show a message to the user
            //deferred.reject();
        });
      //return deferred.promise;
    };


})

//*************************** end of addtruckController ****************************

//*************************** start of edittruckController ****************************
.controller('edittruckController', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen,$ionicPopup,$cordovaCamera,$cordovaToast) {

  var cust_info;
  var cust_trip_info;
  var hold_regist_no;
  var pict1_file , pict2_file, pict3_file;
  $scope.$on('$ionicView.enter', function(ev) {
    if(ev.targetScope !== $scope)
        return;
      //console.log("called initialize function");
      initialize1();
  });

  function initialize1() {
      var id = route_screen.get_truck_id();
      //console.log(id);
      $scope.truck=route_screen.return_truck_indiv(id);
      hold_regist_no = $scope.truck.registration_number;
  }

  $scope.initialize = function() 
  {

  };

  $scope.save = function()
  {
      if($scope.truck.make == ""  || typeof($scope.truck.make) == 'undefined'){
        message='Please enter truck make!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.truck.model == ""  || typeof($scope.truck.model) == 'undefined'){
        message='Please enter truck model!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.truck.type == ""  || typeof($scope.truck.type) == 'undefined'){
        message='Please enter truck type!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.truck.registration_number == ""  || typeof($scope.truck.registration_number) == 'undefined'){
        message='Please enter truck registration number!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.truck.load_height== null ){
        message='Please enter truck load height!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.truck.load_width== null ){
        message='Please enter truck load width!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.truck.load_length== null ){
        message='Please enter truck load length!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.truck.capacity== null ){
        message='Please enter truck load capacity!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.truck.picture1 == ""  || typeof($scope.truck.picture1) == 'undefined'){
        message='Please Upload Front Picture!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.truck.picture2 == ""  || typeof($scope.truck.picture2) == 'undefined'){
        message='Please Upload registration documents!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.truck.picture3 == ""  || typeof($scope.truck.picture3) == 'undefined'){
        message='Please Upload Load Area Picture!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else{
        //console.log("successful");
        $scope.save_after_valid();
      }
  }


  $scope.save_after_valid = function()
  {

      //console.log($scope.truck.registration_number);
      var truck_info_class = Parse.Object.extend("Trucks");
      var query = new Parse.Query(truck_info_class);
      query.equalTo("registration_number", hold_regist_no);
      query.find({
          success: function(results) {
                results[0].set("make",$scope.truck.make);
                results[0].set("model",$scope.truck.model);
                results[0].set("type",$scope.truck.type);
                results[0].set("registration_number",$scope.truck.registration_number);
                results[0].set("load_height",$scope.truck.load_height);
                results[0].set("load_width",$scope.truck.load_width);
                results[0].set("load_length",$scope.truck.load_length);
                results[0].set("capacity",$scope.truck.capacity);
                results[0].set("status","Registration Pending");
                results[0].save();
                $scope.uploadtruckpic(results[0]);
                $ionicPopup.alert({
                    title: 'Updated - Great!',
                    content: 'Your truck has been re-submitted for approval.'
                    }).then(function(res) {
                        $state.go('trucks');
                  });
            },
          error: function(error) {
              console.log(" The object was not retrieved successfully.");
          }
        });

  };

  $scope.uploadtruckpic = function(obj){
      var new_truck_class = Parse.Object.extend("Trucks");
      var query = new Parse.Query(new_truck_class);
      query.get(obj.id, {
          success: function(t1) {
              if(pict1_file){
                  var parseFile1 = new Parse.File("picture1.jpeg", pict1_file);
                  parseFile1.save().then(function() {
                          // The file has been saved to Parse.
                          t1.set("picture1",parseFile1);
                          t1.save(null,{
                              success:function(obj){
                                    console.log(obj.id);
                                    //alert(obj.id);
                                    route_screen.get_driver_info();
                                },
                              error:function(error){
                                    console.log(error.message);
                                    //alert(error.message);
                                }
                            });
                }, function(error) {
                    alert(error.message);
                      // The file either could not be read, or could not be saved to Parse.
                });
              }
              if(pict2_file){
                  var parseFile2 = new Parse.File("picture2.jpeg", pict2_file);
                  parseFile2.save().then(function() {
                          // The file has been saved to Parse.
                          t1.set("picture2",parseFile2);
                          t1.save(null,{
                              success:function(obj){
                                    console.log(obj.id);
                                    //alert(obj.id);
                                },
                              error:function(error){
                                    console.log(error.message);
                                    //alert(error.message);
                                    route_screen.get_driver_info();
                                }
                            });
                }, function(error) {
                    //alert(error.message);
                      // The file either could not be read, or could not be saved to Parse.
                });
              }
              if(pict3_file){
                  var parseFile3 = new Parse.File("picture3.jpeg", pict3_file);
                  parseFile3.save().then(function() {
                          // The file has been saved to Parse.
                          t1.set("picture3",parseFile3);
                          t1.save(null,{
                              success:function(obj){
                                    console.log(obj.id);
                                    //alert(obj.id);
                                    route_screen.get_driver_info();
                                },
                              error:function(error){
                                    console.log(error.message);
                                    //alert(error.message);
                                }
                            });
                }, function(error) {
                    //alert(error.message);
                      // The file either could not be read, or could not be saved to Parse.
                });

              }  
          },
          error: function(object, error) {
              console.log(" The object was not retrieved successfully.");
          }
        });
  };


 $scope.takePicture1 = function() {
      var options = { 
          quality : 75, 
          destinationType : Camera.DestinationType.DATA_URL, 
          sourceType : Camera.PictureSourceType.CAMERA, 
          allowEdit : true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
        };
 
      $cordovaCamera.getPicture(options).then(function(imageData) {
          $scope.truck.picture1 = "data:image/jpeg;base64," + imageData;
          pict1_file = { __ContentType: "image/jpeg", base64: imageData };
        }, function(err) {
            // An error occured. Show a message to the user
        });
    };

 $scope.takePicture2 = function() {
      //var deferred = $q.defer();
      var options = { 
          quality : 75, 
          destinationType : Camera.DestinationType.DATA_URL, 
          sourceType : Camera.PictureSourceType.CAMERA, 
          allowEdit : true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
        };
 
      $cordovaCamera.getPicture(options).then(function(imageData) {
          //deferred.resolve(imageData);
          $scope.truck.picture2 = "data:image/jpeg;base64," + imageData;
          pict2_file = { __ContentType: "image/jpeg", base64: imageData };
        }, function(err) {
            // An error occured. Show a message to the user
            //deferred.reject();
        });
      //return deferred.promise;
    };

 $scope.takePicture3 = function() {
      //var deferred = $q.defer();
      var options = { 
          quality : 75, 
          destinationType : Camera.DestinationType.DATA_URL, 
          sourceType : Camera.PictureSourceType.CAMERA, 
          allowEdit : true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
        };
 
      $cordovaCamera.getPicture(options).then(function(imageData) {
          //deferred.resolve(imageData);
          $scope.truck.picture3 = "data:image/jpeg;base64," + imageData;
          pict3_file = { __ContentType: "image/jpeg", base64: imageData };
        }, function(err) {
            // An error occured. Show a message to the user
            //deferred.reject();
        });
      //return deferred.promise;
    };


})

//*************************** end of edittruckController ****************************

//*************************** start of viewtruckController ****************************
.controller('viewtruckController', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen,$ionicPopup) {

  var cust_info;
  var cust_trip_info;
  $scope.$on('$ionicView.enter', function(ev) {
    if(ev.targetScope !== $scope)
        return;
      //console.log("called initialize function");
      initialize1();
  });

  function initialize1() {
      var id = route_screen.get_truck_id();
      $scope.show_approve = function() {return false;}
      //console.log(id);
      $scope.truck=route_screen.return_truck_indiv(id);
      $scope.show_approve = function() {
          var currentuser = Parse.User.current();
          if(currentuser.get("group") == "driver"){
              return false;
            }
            else{
            if($scope.truck.status == "Approved"){
                return false;
              }
              else{
                return true;
              }
            }
        }
      $scope.show_back = function() {
          var currentuser = Parse.User.current();
          if(currentuser.get("group") == "driver"){
              return false;
            }
            else{
            if($scope.truck.status == "Approved"){
                return true;
              }
              else{
                return false;
              }
            }
        }
      $scope.show_edit = function() {
          var currentuser = Parse.User.current();
          if(currentuser.get("group") == "driver" && $scope.truck.status == "Registration Pending"){
              return true;
            }
            else{
              return false;
            }
        }
    }

  $scope.approve = function() 
  {
        var confirmPopup = $ionicPopup.confirm({
             title: 'Approve Truck',
             template: 'Are you sure you want to approve?'
           });
           confirmPopup.then(function(res) {
             if(res) {
               $scope.updt_truck();
             } else {
               console.log('You are not sure');
             }
           });

  };

    $scope.back = function() 
  {
      $state.go('tab3.truck-admin');

  };

  $scope.edit = function() 
  {
      $state.go('edittruck');
  };

  $scope.updt_truck = function() 
  {
      //console.log($scope.truck.registration_number);
      var truck_info_class = Parse.Object.extend("Trucks");
      var query = new Parse.Query(truck_info_class);
      query.equalTo("registration_number", $scope.truck.registration_number);
      query.find({
          success: function(results) {
              results[0].set("status","Approved");
              results[0].save();
              $state.go("tab3.truck-admin");
            },
          error: function(error) {
              console.log(" The object was not retrieved successfully.");
          }
        });
  };

  $scope.initialize = function() 
  {

  };
})

//*************************** end of viewtruckController ****************************

//*************************** start of Location - SET ROUTE page ****************************

.controller('Location', function($state, $scope, $ionicLoading, $compile, $rootScope, $cordovaGeolocation, $ionicModal, route_screen,$cordovaToast) {

  var from_temp , to_temp , from_latlng_temp , to_latlng_temp;
  var myLatlng , loginprof , cust_trip_list=[], cust_trip_info=[], cust_info=[];

  //$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    //$scope.init();
  //});

  /**
   * The CenterControl adds a control to the map that recenters the map on
   * the user.
   * This constructor takes the control DIV as an argument.
   * @constructor
   */


  function CenterControl(controlDiv, map) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginTop = '100px';
    controlUI.style.marginRight = '10px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '12px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Center Map';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to the user.
    controlUI.addEventListener('click', function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          myLatlng = pos;
          map.setCenter(pos);
        }, function() {
          handleLocationError(true, map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, map.getCenter());
      }
    });
  }

  function initialize() {

    //var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
    // set option for map
    var mapOptions = {
      center: myLatlng,
      zoom: 12,
      zoomControl: true,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.disableTap_from = function() {
        var container = document.getElementsByClassName('pac-container');
        angular.element(container).attr('data-tap-disabled', 'true');
        var backdrop = document.getElementsByClassName('backdrop');
        angular.element(backdrop).attr('data-tap-disabled', 'true');
        angular.element(container).on("click", function() {
          document.getElementById('pac-input-from').blur();
          });
      };


    $scope.disableTap_to = function() {
        var container = document.getElementsByClassName('pac-container');
        angular.element(container).attr('data-tap-disabled', 'true');
        var backdrop = document.getElementsByClassName('backdrop');
        angular.element(backdrop).attr('data-tap-disabled', 'true');
        angular.element(container).on("click", function() {
          document.getElementById('pac-input-to').blur();
          });
      };

    // init map
    var map = new google.maps.Map(document.getElementById("map"),mapOptions);

    var input_from = (document.getElementById('pac-input-from'));
    var input_to = (document.getElementById('pac-input-to'));
    var from_box = (document.getElementById('from_box'));
    var from_box = (document.getElementById('to_box'));

    var autocomplete_from = new google.maps.places.Autocomplete(input_from);
    autocomplete_from.bindTo('bounds', map);
    var autocomplete_to = new google.maps.places.Autocomplete(input_to);
    autocomplete_to.bindTo('bounds', map);
    //map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(from_box);
    //map.controls[google.maps.ControlPosition.LEFT_TOP].push(to_box);

    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
        map: map
      });
    $scope.marker_current = new google.maps.Marker({
        map: map,
        position:myLatlng
      });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
      });

    // Get the full place details when the user selects a place from the
    // list of suggestions.
    google.maps.event.addListener(autocomplete_from,'place_changed', function() {
        infowindow.close();
        from_temp = document.getElementById('pac-input-from').value;
        var place = autocomplete_from.getPlace();
        if (!place.geometry) {
            return;
          }
        from_latlng_temp = place.geometry.location;
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          }
        else {
            map.setCenter(place.geometry.location);
            map.setZoom(15);
          }

          // Set the position of the marker using the place ID and location.
        marker_current.setPlace( /** @type {!google.maps.Place} */ ({
            placeId: place.place_id,
            location: place.geometry.location
          }));
        marker_current.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
        marker_current.setVisible(true);

        //infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + 'Place ID: ' + place.place_id + '<br>' + place.formatted_address + '</div>');
        //infowindow.open(map, marker);
        $scope.displayAll();
      });

    google.maps.event.addListener(autocomplete_to,'place_changed', function() {
        infowindow.close();
        var place = autocomplete_to.getPlace();
        to_temp = document.getElementById('pac-input-to').value;
        //console.log(place.geometry.location.lat());
        to_latlng_temp = place.geometry.location;

      });
      
    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');   

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        myLatlng = pos;
        map.setCenter(pos);
      }, function() {
        handleLocationError(true, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, map.getCenter());
    }
    // Create the DIV to hold the control and call the CenterControl()
    // constructor passing in this DIV.
    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);

    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);

    // assign to stop
    $scope.map = map;

    google.maps.event.addListener(map , "center_changed", function() {
        myLatlng = map.getCenter();
        //console.log("center_changed");
        $scope.displayAll();
        set_from_to_current_post(myLatlng);
        $scope.marker_current.setPosition(myLatlng);
      });

    google.maps.event.addListener(map , "zoom_changed", function() {
        myLatlng = map.getCenter();
        $scope.displayAll();
        set_from_to_current_post(myLatlng);
        $scope.marker_current.setPosition(myLatlng);
      });

    //Wait until the map is loaded
    //google.maps.event.addListenerOnce($scope.map, 'idle', function(){

    //});
  }

  function set_from_to_current_post(myLatlng){

    var geocoder = new google.maps.Geocoder;
        geocoder.geocode({'location': myLatlng}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              console.log(results[1].formatted_address);
              //$scope.search_from=results[1].formatted_address;
              var address = document.getElementById('pac-input-from');
              address.value=results[1].formatted_address;
              from_temp = results[1].formatted_address;
              from_latlng_temp = myLatlng;
            } else {
              window.alert('No results found');
            }
          } else {
            //window.alert('Geocoder failed due to: ' + status);
          }
        });

  }


  // load map when the ui is loaded
$scope.$on('$ionicView.enter', function(ev) {
    if(ev.targetScope !== $scope)
        return;

    loginprof = route_screen.get_login_prof();
    if(loginprof == 2){
        var truck_reg_stat = route_screen.return_truck_reg_stat();
        var driver_prof_stat = route_screen.return_driver_prof_stat();
        if (truck_reg_stat == 2 &&  driver_prof_stat == 2){
            //$state.go('tab.location');          
        }
        else{
            $state.go('driverpending');
        }
    }

    //myLatlng={lat: 41.85, lng: -87.65};
    myLatlng={lat:33.9861917, lng:-81.03091890000002};
    var options = {timeout: 10000, enableHighAccuracy: true};
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
        myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        set_from_to_current_post(myLatlng);
        $scope.marker_current.setPosition(myLatlng);
        $scope.marker_current.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
        $scope.map.setCenter(myLatlng);
    });

    //get the login profile mode
    loginprof = route_screen.get_login_prof();
    $scope.custmode = function() {
        if(loginprof == 1)
            {
              //console.log("Logged as customer");
              return true;
            }
          else if (loginprof == 2){
              //console.log("Logged as driver");
              return false;
            }
      };

    //get the driver list
    $scope.chats = route_screen.all();
    $scope.nomatch = function() {
        if($scope.chats.length > 0)
            {
              //console.log("Matches available");
              return false;
            }
          else{
              //console.log("Matched unavailable");
              return true;
            }
      };

    //console.log("called initialize function");
    initialize();

    myDataRef.on("value", function(snapshot)
    {
      //console.log("here is the DB" + snapshot.val());
      $scope.places_in_database = snapshot.val();
      $scope.places_to_show = [];
      $scope.markers = [];
      //$scope.displayAll();
    }, function (errorObject) 
    {
      console.log("The read failed: " + errorObject.code);
    });

});


  $scope.init = function() 
  {
    var address = document.getElementById('pac-input-from');
    address.value="";
    var address1 = document.getElementById('pac-input-to');
    address1.value="";
    /*//console.log("called initialize function");
    initialize();
    myDataRef.on("value", function(snapshot)
    {
      //console.log("here is the DB" + snapshot.val());
      $scope.places_in_database = snapshot.val();
      $scope.places_to_show = [];
      $scope.markers = [];
      $scope.displayAll();
    }, function (errorObject) 
    {
      console.log("The read failed: " + errorObject.code);
    });*/


  }

  $scope.deleteMarkers = function()
  {
    console.log("deleting markers...");
    for (var i = 0; i < $scope.markers.length; i++)
    {
      $scope.markers[i].setMap(null);
    }
  }

  $scope.displayAll = function()
  {
    $scope.deleteMarkers();
    $scope.markers = [];
    $scope.places_to_show = [];
    
    var latNEValue =  $scope.map.getBounds().getNorthEast().lat();
    var lngtNEValue =  $scope.map.getBounds().getNorthEast().lng();
    var latSWValue =  $scope.map.getBounds().getSouthWest().lat();
    var lngtSWValue =  $scope.map.getBounds().getSouthWest().lng();
    //console.log(latNEValue+","+lngtNEValue+ " - " + latSWValue+","+lngtSWValue);

    //console.log(loginprof);
    if(loginprof == 1){

         var filter =["Posted"];
          route_screen.get_driver_trip_match(latNEValue,lngtNEValue,latSWValue,lngtSWValue,filter).then(function(results){
              driver_trip_info = results;
              //console.log(driver_trip_info);
              for (var i = 0; i < driver_trip_info.length; i++) {
                  var pos = {lat: driver_trip_info[i].get("source_coordinates")._latitude,
                             lng: driver_trip_info[i].get("source_coordinates")._longitude};
                  //console.log("lat:"+pos.lat+","+"lng:"+pos.lng);
                  var marker = new google.maps.Marker({
                    position: pos,
                    map: $scope.map,
                    title: $scope.places_in_database[i].name
                  });
                  marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
                }
          });
        }
    else if(loginprof == 2){

         var filter =["Posted"];
          route_screen.get_cust_trip_match(latNEValue,lngtNEValue,latSWValue,lngtSWValue,filter).then(function(results){
              cust_trip_info = results;
              //console.log(cust_trip_info);
              for (var i = 0; i < cust_trip_info.length; i++) {
                  var pos = {lat: cust_trip_info[i].get("source_coordinates")._latitude,
                             lng: cust_trip_info[i].get("source_coordinates")._longitude};
                  //console.log("lat:"+pos.lat+","+"lng:"+pos.lng);
                  var marker = new google.maps.Marker({
                    position: pos,
                    map: $scope.map,
                    title: $scope.places_in_database[i].name
                  });
                  marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
                }
          });
        }
  }


  $scope.addtripdetails = function() 
  {
      //console.log(_latlng_temp.lng());
      loginprof = route_screen.get_login_prof();
      
      if(!from_latlng_temp){
        message='Please enter to your source!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if(!to_latlng_temp){
        message='Please enter your destination!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else{
        //console.log("successful");
          route_screen.store_temp_loc(from_temp,to_temp,from_latlng_temp,to_latlng_temp);
          if(loginprof == 1){
            $state.go('tripdetails');
          }
          else if(loginprof == 2){
            $state.go('drivertripdetails');
          }
      }

      /*if (from_latlng_temp && to_latlng_temp){
          route_screen.store_temp_loc(from_temp,to_temp,from_latlng_temp,to_latlng_temp);
          if(loginprof == 1){
            $state.go('tripdetails');
          }
          else if(loginprof == 2){
            $state.go('drivertripdetails');
          }
          
        }*/
  }


  $scope.clickedriver = function(id) 
  {
      //console.log("you clicked " + id);
      route_screen.store_driver_id(id);
      // set driver to view mode
      route_screen.store_driver_mode(1);
      $scope.closeModal();
      $state.go('selectdriver');
  }

  $ionicModal.fromTemplateUrl('modal1.html', {
    scope: $scope,
    animation: 'slide-in-up'
    }).then(function(modal) {
    $scope.modal = modal;
    });

  $scope.openModal = function() {
      $scope.drivers=[];
      $scope.nodriver = function() {
          if(driver_trip_info.length > 0)
              {
                //console.log("Drivers available");
                return false;
              }
            else{
                //console.log("No Drivers");
                return true;
              }
        };

      driver_trip_list = [];
      driver_info = [];
      for (i=0; i<driver_trip_info.length;i++){
          route_screen.get_driver_trip_list_match(driver_trip_info[i]).then(function(results){
                  driver_trip_list.push(results);
                  mobilenumber=results.get("driver_username");
                  //console.log(mobilenumber);
                  route_screen.get_driver_info_match(mobilenumber).then(function(results1){
                          driver_info.push(results1);
                          $scope.build_driver_list_disp();
                        });
                });
            };
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $ionicModal.fromTemplateUrl('modal2.html', {
    scope: $scope,
    animation: 'slide-in-up'
    }).then(function(modal) {
    $scope.modal2 = modal;
    });

  $scope.openModal2 = function() {
      $scope.customers=[];
      $scope.nocustomer = function() {
          if(cust_trip_info.length > 0)
              {
                //console.log("Customers available");
                return false;
              }
            else{
                //console.log("No Customers");
                return true;
              }
        };

      cust_trip_list = [];
      cust_info = [];
      for (i=0; i<cust_trip_info.length;i++){
          route_screen.get_cust_trip_list_match(cust_trip_info[i]).then(function(results){
                  cust_trip_list.push(results);
                  mobilenumber=results.get("customer_username");
                  //console.log(mobilenumber);
                  route_screen.get_cust_info_match(mobilenumber).then(function(results1){
                          cust_info.push(results1);
                          $scope.build_cust_list_disp();
                        });
                });
            };
      $scope.modal2.show();
  };
  $scope.closeModal2 = function() {
    $scope.modal2.hide();
  };

  $scope.build_cust_list_disp = function(){

      if(cust_trip_info.length  == cust_trip_list.length ){
        var temp_customer;
        var temp_customer1=[];
        for(i=0; i<cust_trip_info.length; i++){
            if(cust_info[i].get('picture')){
              pict_temp = cust_info[i].get('picture').url();
            }
            else{
              pict_temp = "img/profile.jpg";
            }
            temp_customer={
                source: cust_trip_info[i].get("source"),
                destination: cust_trip_info[i].get("destination"),
                start_date_time: cust_trip_info[i].get("start_date_time"),
                end_date_time: cust_trip_info[i].get("start_date_time"),
                status: cust_trip_info[i].get("status"),
                id:i,
                picture: pict_temp
              };
            temp_customer1.push(temp_customer);
        }
        $scope.customers = temp_customer1;
      }
  }

  $scope.build_driver_list_disp = function(){

      if(driver_trip_info.length  == driver_trip_list.length ){
        var temp_driver;
        var temp_driver1=[];
        for(i=0; i<driver_trip_info.length; i++){
            if(driver_info[i].get('picture')){
              pict_temp = driver_info[i].get('picture').url();
            }
            else{
              pict_temp = "img/profile.jpg";
            }
            temp_driver={
                source: driver_trip_info[i].get("source"),
                destination: driver_trip_info[i].get("destination"),
                start_date_time: driver_trip_info[i].get("start_date_time"),
                end_date_time: driver_trip_info[i].get("start_date_time"),
                status: driver_trip_info[i].get("status"),
                id:i,
                picture: pict_temp
              };
            temp_driver1.push(temp_driver);
        }
        $scope.drivers = temp_driver1;
      }
  }

  $scope.clickecustomer = function(id) 
  {
     $scope.modal2.hide();
     route_screen.override_cust_info(cust_info[id]);
     route_screen.override_cust_trip_list(cust_trip_list);
     route_screen.override_cust_trip_info(cust_trip_info);
      //console.log("you clicked " + id);
      route_screen.store_customer_id(id);
      // set customer to driver view mode
      route_screen.store_customer_mode(3);
      // set tab to inprogress mode
      route_screen.store_cust_tab_mode(3);
      $state.go('selectcustomer');
  }

  $scope.clickedriver = function(id) 
  {
     $scope.modal.hide();
     route_screen.override_driver_info(driver_info[id]);
     route_screen.override_driver_trip_list(driver_trip_list);
     route_screen.override_driver_trip_info(driver_trip_info);
      console.log("you clicked " + id);
      route_screen.store_driver_id(id);
      // set driver to customerr view mode
      route_screen.store_driver_mode(3);
      // set tab to inprogress mode
      route_screen.store_driver_tab_mode(3);
      $state.go('selectdriver');
  }


})

//*************************** end of Location - SET ROUTE page ****************************

//*************************** start of tripdetailsController ****************************
.controller('tripdetailsController', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen,$cordovaToast) {

  var cust_info;
  var cust_trip_info;
$scope.$on('$ionicView.enter', function(ev) {
    if(ev.targetScope !== $scope)
        return;
      //console.log("called initialize function");
      initialize1();
  });

  function initialize1() {
    route_screen.get_cust_info().then(function(results){
          cust_info=results;
          //cust_info = route_screen.get_cust_info();
          cust_trip_info = route_screen.get_temp_loc();
          //console.log(cust_trip_info);
          $scope.newtrip={
              sendername: cust_info.first_name + " "  + cust_info.last_name,
              sendernumber: Number(cust_info.mobile_number),
              pickdatetime: new Date(),
              droptimedate: new Date(),
              senderraddr:cust_trip_info.from_add,
              receiveraddr:cust_trip_info.to_add,
              checked:true
            };
          $scope.newtrip1={
              receivername:cust_info.first_name + " "  + cust_info.last_name,
              receivernumber: Number(cust_info.mobile_number),
              checked:true
            };  
      });
  }

  $scope.initialize = function() 
  {
    //initialize1();
  };


  $scope.save = function()
  {
      var curr_date = new Date();
      if(typeof($scope.newtrip.senderaddrline2) == 'undefined' ){
        $scope.newtrip.senderaddrline2 = "" ;
        //console.log($scope.newtrip.senderaddrline2);
      }
      if(typeof($scope.newtrip.receiveraddrline2) == 'undefined' ){
        $scope.newtrip.receiveraddrline2 = "" ;
        //console.log($scope.newtrip.receiveraddrline2);
      }
      if($scope.newtrip.sendername== ""  || typeof($scope.newtrip.sendername) == 'undefined'){
        message='Please enter sender name!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.newtrip.sendernumber== null ){
        message='Please enter sender mobile number!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.newtrip.pickdatetime== ""  || typeof($scope.newtrip.pickdatetime) == 'undefined'){
        message='Please enter pick up date and time!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.newtrip.pickdatetime < curr_date){
        message='Pick up date and time cannot be in the past!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.newtrip.senderaddrline1== ""  || typeof($scope.newtrip.senderaddrline1) == 'undefined'){
        message='Please enter senders address!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.newtrip1.receivername== ""  || typeof($scope.newtrip1.receivername) == 'undefined'){
        message='Please enter receiver name!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.newtrip1.receivernumber== null ){
        message='Please enter receiver mobile number!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.newtrip.droptimedate== ""  || typeof($scope.newtrip.droptimedate) == 'undefined'){
        message='Please enter drop date and time!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.newtrip.droptimedate <= $scope.newtrip.pickdatetime){
        message='Drop date and time cannot be before pick up date!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.newtrip.receiveraddrline1== ""  || typeof($scope.newtrip.receiveraddrline1) == 'undefined'){
        message='Please enter receiver address!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else{
        //console.log("successful");
        $scope.save_after_valid();
      }
  }

  $scope.save_after_valid = function()
  {
      if ($scope.newtrip.pickdatetime && $scope.newtrip.droptimedate){   
          route_screen.store_cust_trp($scope.newtrip,$scope.newtrip1);
          $state.go('goodsdetails');
        }
  };

  $scope.updatereceiver = function () {
    if ($scope.newtrip1.checked){
      $scope.newtrip1={
          /**receivername:cust_info.first_name + " "  + cust_info.last_name,
          receivernumber: Number(cust_info.mobile_number),*/
          receivername: $scope.newtrip.sendername,
          receivernumber: $scope.newtrip.sendernumber,
          checked:true
        };
    }
    else{
    $scope.newtrip1={
        receivername:"",
        receivernumber: "",
        checked:false
      };
    }
  }
})
//*************************** end of tripdetailsController ****************************

//*************************** start of drivertripdetailsController ****************************
.controller('drivertripdetailsController', function($state, $scope, $ionicLoading, $compile, $rootScope,$ionicModal,route_screen,$cordovaToast) {

  var driver_info;
  var driver_trip_info;
  var trucks_info;
  var selected_truck_info;
$scope.$on('$ionicView.enter', function(ev) {
    if(ev.targetScope !== $scope)
        return;
      //console.log("called initialize function");
      initialize1();
  });

  function initialize1() {
    route_screen.get_driver_info().then(function(results){
          driver_info=results;
          //cust_info = route_screen.get_cust_info();
          
              
              driver_trip_info = route_screen.get_temp_loc();
              //console.log(cust_trip_info);
              $scope.driver={
                  name: driver_info.first_name + " "  + driver_info.last_name,
                  mobile_number: Number(driver_info.mobile_number),
                  start_date_time: new Date(),
                  end_date_time: new Date(),
                  source:driver_trip_info.from_add,
                  destination:driver_trip_info.to_add,
                  truck: "No Trucks Selected!"
                };
            
      });
  }

  $scope.selecttruck = function() 
  {
      var filter=["Approved"];
      route_screen.get_approved_trucks_info(filter).then(function(results){
          $scope.trucks=results;
          trucks_info = results;
          $scope.openModal();
        });
  };


  $ionicModal.fromTemplateUrl('modal3.html', {
    scope: $scope,
    animation: 'slide-in-up'
    }).then(function(modal) {
    $scope.modal = modal;
    });

  $scope.openModal = function() {
    $scope.modal.show();
    $scope.notrucks = function(){
          if($scope.trucks.length>0){
              return false;
             }
           else{
              return true;
            }
        }
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.clickedtruck = function(id) 
  {
      //console.log("clicked = " + id);
      selected_truck_info = trucks_info[id];
      $scope.driver.truck =  trucks_info[id].make + " " + trucks_info[id].model + " " + trucks_info[id].registration_number;
      $scope.closeModal();
  };

  $scope.save = function()
  {
      var curr_date = new Date();
      if($scope.driver.truck== "No Trucks Selected!"  || typeof($scope.driver.truck) == 'undefined'){
        message='Please select a truck!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.driver.start_date_time== ""  || typeof($scope.driver.start_date_time) == 'undefined'){
        message='Please enter pick up date and time!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.driver.start_date_time < curr_date){
        message='Pick up date and time cannot be in the past!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.driver.end_date_time== ""  || typeof($scope.driver.end_date_time) == 'undefined'){
        message='Please enter drop date and time!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.driver.end_date_time <= $scope.driver.start_date_time){
        message='Drop date and time cannot be before pick up date!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else{
        //console.log("successful");
        $scope.save_after_valid();
      }
  }

  $scope.save_after_valid = function()
  {
      if ($scope.driver.start_date_time && $scope.driver.end_date_time){   
          route_screen.store_driver_trp($scope.driver);
          route_screen.store_driver_truck(selected_truck_info);
          $state.go('drivergoodsdetails');
        }
  };

  $scope.initialize = function() 
  {

  };

  
})

//*************************** end of drivertripdetailsController ****************************

//*************************** start of goodsdetailsController ****************************
.controller('goodsdetailsController', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen,$cordovaCamera,$cordovaToast) {

  $scope.$on('$ionicView.enter', function() {
      //console.log("called initialize function");
      initialize1();
  });

  function initialize1() {
    $scope.newgoods={goodstype:""};
      route_screen.get_cust_trip();
  }

  $scope.save = function()
  {
      if(typeof($scope.newgoods.cost) == 'undefined' ){
        $scope.newgoods.cost = "" ;
        //console.log($scope.newgoods.cost);
      }
      if(typeof($scope.newgoods.comments) == 'undefined' ){
        $scope.newgoods.comments = "" ;
        //console.log($scope.newgoods.comments);
      }
      if($scope.newgoods.goodstype == ""  || typeof($scope.newgoods.goodstype) == 'undefined'){
        message='Please enter the goods type!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.newgoods.goodsweight== null ){
        message='Please enter the approximate weight of the goods!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else{
        //console.log("successful");
        $scope.save_after_valid();
      }
  }

  $scope.save_after_valid = function(newgoods)
  {
    //console.log($scope.newgoods);
    route_screen.store_cust_goods($scope.newgoods);
    $state.go('searchdriver');
  };

  $scope.takePicture = function() {
      var options = { 
          quality : 75, 
          destinationType : Camera.DestinationType.DATA_URL, 
          sourceType : Camera.PictureSourceType.CAMERA, 
          allowEdit : true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
        };
 
      $cordovaCamera.getPicture(options).then(function(imageData) {
          $scope.newgoods.picture = "data:image/jpeg;base64," + imageData;
          $scope.newgoods.pict_base64= imageData;
        }, function(err) {
            // An error occured. Show a message to the user
        });
    }

  $scope.initialize = function() 
  {

  };
})
//*************************** end of goodsdetailsController ****************************

//*************************** start of drivergoodsdetailsController ****************************
.controller('drivergoodsdetailsController', function($state, $scope, $ionicLoading, $compile, $cordovaCamera,$rootScope,route_screen,$cordovaToast) {

  $scope.$on('$ionicView.enter', function() {
      //console.log("called initialize function");
      initialize1();
  });

  function initialize1() {
    $scope.newgoods={goodstype:""};
      route_screen.get_cust_trip();
  }

  $scope.save = function()
  {
      if(typeof($scope.newgoods.comments) == 'undefined' ){
        $scope.newgoods.comments = "" ;
        //console.log($scope.newgoods.comments);
      }
      if($scope.newgoods.available_capacity== null ){
        message='Please enter available load area!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else if($scope.newgoods.cost== null ){
        message='Please enter your expected cost!';
        console.log(message);
        $cordovaToast.showShortBottom(message);
      }
      else{
        //console.log("successful");
        $scope.save_after_valid();
      }
  }

  $scope.save_after_valid = function(newgoods)
  {
    //console.log($scope.newgoods);
    route_screen.store_driver_goods($scope.newgoods);
    $state.go('searchcustomer');
  };

  $scope.takePicture = function() {
      var options = { 
          quality : 75, 
          destinationType : Camera.DestinationType.DATA_URL, 
          sourceType : Camera.PictureSourceType.CAMERA, 
          allowEdit : true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
        };
 
      $cordovaCamera.getPicture(options).then(function(imageData) {
          $scope.newgoods.picture = "data:image/jpeg;base64," + imageData;
          $scope.newgoods.pict_base64= imageData;
        }, function(err) {
            // An error occured. Show a message to the user
        });
    }

  $scope.initialize = function() 
  {

  };
})

//*************************** end of drivergoodsdetailsController ****************************

//*************************** start of searchdriverController ****************************
.controller('searchdriverController', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen,$ionicPopup) {

  var cust_goods_info;
  var cust_trip_info;
  var cust_info;
  var driver_trip_info=[], driver_trip_list=[],driver_info=[], driver_trip_gps=[];
  var mile = 50;
  var location;
  var nomatch_temp;

  $scope.$on('$ionicView.enter', function() {
      //console.log("called initialize function");
      initialize1();
  });

  function initialize1() {

      $scope.nomatch = function() {
          nomatch_temp=false;
          return false;
        };

        driver_trip_info=[], driver_trip_list=[],driver_info=[], driver_trip_gps=[];
        var filter =["Posted"];
        location = route_screen.get_temp_loc();
        route_screen.get_driver_trip_refine(filter,mile).then(function(results){
            driver_trip_info_temp = results;
            $scope.innerloop(0,driver_trip_info_temp.length);
        });

      //$scope.chats = route_screen.all();
      cust_goods_info = route_screen.get_cust_goods();
      cust_trip_info = route_screen.get_cust_trip();
      cust_info = route_screen.return_cust_info();
      /*route_screen.return_cust_info().then(function(results){
        cust_info = results;
        $scope.summary.picture = cust_info.picture;
      });*/
      $scope.summary={
          picture: cust_info.picture,
          senderraddr: cust_trip_info.senderraddr,
          receiveraddr: cust_trip_info.receiveraddr,
          pickdatetime: cust_trip_info.pickdatetime,
          droptimedate: cust_trip_info.droptimedate
        };
  }

  $scope.innerloop = function(i,max) 
  {
    if(i<max){
                route_screen.get_driver_trip_list_match(driver_trip_info_temp[i]).then(function(results1){
                    driver_trip_list_temp = results1;
                    //console.log(driver_trip_list);
                    //console.log(driver_trip_info[i].get("driver_trip_gps"));
                    route_screen.get_driver_trip_gps_refine(driver_trip_info_temp[i],mile).then(function(results2){
                        driver_trip_gps_temp = results2;
                        //console.log(driver_trip_gps_temp);
                        var R = 6371;
                        var dLat = toRad(driver_trip_gps_temp.get("destination_coordinates")._latitude-location.to_lat);
                        var dLon = toRad(driver_trip_gps_temp.get("destination_coordinates")._longitude - location.to_lng);
                        var dLat1 = toRad(location.to_lat);
                        var dLat2 = toRad(driver_trip_gps_temp.get("destination_coordinates")._latitude);
                        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                                Math.cos(dLat1) * Math.cos(dLat1) *
                                Math.sin(dLon/2) * Math.sin(dLon/2);
                        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                        var d = (R * c)/1.6; // in miles
                        //console.log("distance for " + driver_trip_list_temp[i].get("destination") + " is " + d/1.6 + "miles");
                        if(d <= mile){
                            mobilenumber=driver_trip_list_temp.get("driver_username");
                            route_screen.get_driver_info_match(mobilenumber).then(function(results3){
                                driver_info_temp = results3;
                                driver_trip_info.push(driver_trip_info_temp[i]);
                                driver_trip_list.push(driver_trip_list_temp);
                                driver_trip_gps.push(driver_trip_gps_temp);
                                driver_info.push(driver_info_temp);
                                //console.log(driver_info_temp);
                                i++;
                                $scope.innerloop(i,max);  
                              });             
                        }
                        else{
                            i++;
                            $scope.innerloop(i,max);                          
                        }

                    });
                });
    }
    else if(max>0 && i==max){
      //console.log("calling build");
      $scope.build_driver_list_disp();
    }
    else if (max == 0){
        $scope.nomatch = function() {
          nomatch_temp=true;
          return true;
        };
    }

  };

  function toRad(x) {
      return x * Math.PI / 180;
    };

  $scope.build_driver_list_disp = function(){

      $scope.nomatch = function() {
          if(driver_trip_info.length > 0)
              {
                //console.log("Matches available");
                nomatch_temp=false;
                return false;
              }
            else{
                //console.log("Matched unavailable");
                nomatch_temp=true;
                return true;
              }
        };

      if(driver_trip_info.length  == driver_trip_list.length ){
        var temp_driver;
        var temp_driver1=[];
        for(i=0; i<driver_trip_info.length; i++){
            if(driver_info[i].get('picture')){
              pict_temp = driver_info[i].get('picture').url();
            }
            else{
              pict_temp = "img/profile.jpg";
            }
            temp_driver={
                source: driver_trip_info[i].get("source"),
                destination: driver_trip_info[i].get("destination"),
                start_date_time: driver_trip_info[i].get("start_date_time"),
                end_date_time: driver_trip_info[i].get("start_date_time"),
                status: driver_trip_info[i].get("status"),
                id:i,
                picture: pict_temp
              };
            temp_driver1.push(temp_driver);
        }
        $scope.drivers = temp_driver1;
      }
  }

  $scope.clickedriver = function(id) 
  {
     route_screen.override_driver_info(driver_info[id]);
     route_screen.override_driver_trip_list(driver_trip_list);
     route_screen.override_driver_trip_info(driver_trip_info);
      //console.log("you clicked " + id);
      route_screen.store_driver_id(id);
      // set cutomer to driver details view mode
      route_screen.store_driver_mode(4);
      // set tab to inprogress mode
      route_screen.store_driver_tab_mode(3);
      $state.go('selectdriver');
  }


  $scope.initialize = function() 
  {
      
  };

  $scope.post = function() 
  {
      if (nomatch_temp){
          $scope.submit();
        }
      else{
        var confirmPopup = $ionicPopup.confirm({
             title: 'No Drivers Selected',
             template: 'Are you sure you want to post?'
           });
           confirmPopup.then(function(res) {
             if(res) {
               $scope.submit();
             } else {
               console.log('You are not sure');
             }
           });
         }
  };


$scope.submit = function() 
  {
      var cust_all_detail=[];
      cust_all_detail = route_screen.submit_cust_trip();

      var cust__trp_gps_class = Parse.Object.extend("Customer_trip_gps");
      tgps1= new cust__trp_gps_class();
      var point = new Parse.GeoPoint({latitude: Number(cust_all_detail[0].to_lat), longitude: Number(cust_all_detail[0].to_lng)});
      tgps1.set("destination_coordinates",point);
      tgps1.save(null,{
      success:function(obj){
        console.log(obj.id);
        $scope.add_entry_to_cust_trp(obj, cust_all_detail);
        },
      error:function(error){
        console.log(error.message);
        }
      });
  };

  $scope.add_entry_to_cust_trp = function(obj_gps, cust_all_detail) {
      var cust_trip_class = Parse.Object.extend("Customer_trip");
      t1= new cust_trip_class();
      t1.set("source",cust_all_detail[1].senderraddr);
      t1.set("destination",cust_all_detail[1].receiveraddr);
      var point = new Parse.GeoPoint({latitude: Number(cust_all_detail[0].from_lat), longitude: Number(cust_all_detail[0].from_lng)});
      t1.set("source_coordinates",point);
      t1.set("start_date_time",cust_all_detail[1].pickdatetime);
      t1.set("end_date_time",cust_all_detail[1].droptimedate);
      t1.set("status","Posted");
          
      t1.set("sender_name",cust_all_detail[1].sendername);
      t1.set("sender_mobile_number",cust_all_detail[1].sendernumber.toString());
      t1.set("sender_complete_address",(cust_all_detail[1].senderaddrline1+" "+cust_all_detail[1].senderaddrline2+" "+cust_all_detail[1].senderraddr));

      t1.set("receiver_name",cust_all_detail[1].receivername);
      t1.set("receiver_mobile_number",cust_all_detail[1].receivernumber.toString());
      t1.set("receiver_complete_address",(cust_all_detail[1].receiveraddrline1+" "+cust_all_detail[1].receiveraddrline2+" "+cust_all_detail[1].receiveraddr));

      t1.set("goods_type",cust_all_detail[2].goodstype);
      t1.set("goods_weight",Number(cust_all_detail[2].goodsweight));
      t1.set("cost",Number(cust_all_detail[2].cost));
      t1.set("comments",cust_all_detail[2].comments);
      /*var base64 = "V29ya2luZyBhdCBQYXJzZSBpcyBncmVhdCE=";
      var file = new Parse.File(cust_all_detail[2].picture,{ base64: base64 });
      t1.set("comments",file);*/
      t1.set("customer_trip_gps",obj_gps);
      //alert(cust_all_detail[2].pict_base64);
      if(cust_all_detail[2].pict_base64){
          var goods_pic_file = { __ContentType: "image/jpeg", base64: cust_all_detail[2].pict_base64 };
          var parseFile = new Parse.File('goods_pic.jpeg', goods_pic_file);
          parseFile.save().then(function() {
              // The file has been saved to Parse.
              t1.set("picture",parseFile);
              t1.save(null,{
              success:function(obj){
                console.log(obj.id);
                $scope.add_entry_to_cust_trp_list(obj);
                },
              error:function(error){
                console.log(error.message);
                }
              });
            }, function(error) {
                  alert(error.message);
                 // The file either could not be read, or could not be saved to Parse.
            });
        }
      else{
          t1.save(null,{
          success:function(obj){
            console.log(obj.id);
            $scope.add_entry_to_cust_trp_list(obj);
            },
          error:function(error){
            console.log(error.message);
            }
          });
        }
  };

  $scope.add_entry_to_cust_trp_list = function(cust_trip) {
    var cust__trp_lst_class = Parse.Object.extend("Customer_trip_list");
    tl1= new cust__trp_lst_class();
    tl1.set("customer_trip",cust_trip);
    tl1.set("status","Posted");
    tl1.set("customer_username",Parse.User.current().get("username"));

    acl=new Parse.ACL(Parse.User.current());
    acl.setReadAccess(Parse.User.current(),true);
    acl.setWriteAccess(Parse.User.current(),true);

    //get list of drivers
    var query = new Parse.Query(Parse.Role);
    query.contains("name", "drivers");
    query.find({
        success : function(role) {
            //console.log("roles: " + role[0].get("name"));
            acl.setReadAccess(role[0],true);
            acl.setWriteAccess(role[0],true);
            tl1.setACL(acl);
            tl1.save(null,{
                success:function(obj){
                  console.log(obj.id);
                  $ionicPopup.alert({
                      title: 'Posted - Great!',
                      content: 'You will be contacted soon by an interested driver.'
                    }).then(function(res) {
                        $state.go('tab.location');
                    });
                  },
                error:function(error){
                  console.log(error.message);
                  }
              });
        },
        error : function(error) {
             response.error("error in finding roles of drivers" + error);
        }
     });
  };

})

//*************************** end of searchdriverController ****************************

//*************************** start of searchcustomerController ****************************
.controller('searchcustomerController', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen,$ionicPopup) {

  var driver_info;
  var driver_trip_info;
  var trucks_info;
  var selected_truck_info;
  var cust_trip_info=[], cust_trip_list=[],cust_info=[], cust_trip_gps=[];
  var mile = 50;
  var location;
  var nomatch_temp;
  $scope.$on('$ionicView.enter', function(ev) {
    if(ev.targetScope !== $scope)
        return;
      //console.log("called initialize function");
      initialize1();
  });

  function initialize1() {

      $scope.nomatch = function() {
          nomatch_temp=false;
          return false;
        };

        cust_trip_info=[], cust_trip_list=[],cust_info=[], cust_trip_gps=[];
        var filter =["Posted"];
        location = route_screen.get_temp_loc();
        route_screen.get_cust_trip_refine(filter,mile).then(function(results){
            cust_trip_info_temp = results;
            $scope.innerloop(0,cust_trip_info_temp.length);
        });

      //$scope.chats = route_screen.all();
      driver_goods_info = route_screen.get_driver_goods();
      driver_trip_info = route_screen.get_driver_trp();
      selected_truck_info = route_screen.get_driver_truck();
      driver_info = route_screen.return_driver_info();
      $scope.driver={
          source:driver_trip_info.source,
          destination: driver_trip_info.destination,
          start_date_time: driver_trip_info.start_date_time,
          end_date_time: driver_trip_info.end_date_time,
          truck: driver_trip_info.truck,
          picture:driver_info.picture
        };
  }

  $scope.innerloop = function(i,max) 
  {
    if(i<max){
                //console.log(cust_trip_info_temp[i]);
                route_screen.get_cust_trip_list_match(cust_trip_info_temp[i]).then(function(results1){
                    cust_trip_list_temp = results1;
                    //console.log(cust_trip_list_temp);
                    //console.log(cust_trip_info[i].get("customer_trip_gps"));
                    route_screen.get_cust_trip_gps_refine(cust_trip_info_temp[i],mile).then(function(results2){
                        cust_trip_gps_temp = results2;
                        //console.log(cust_trip_gps_temp);
                        var R = 6371;
                        var dLat = toRad(cust_trip_gps_temp.get("destination_coordinates")._latitude-location.to_lat);
                        var dLon = toRad(cust_trip_gps_temp.get("destination_coordinates")._longitude - location.to_lng);
                        var dLat1 = toRad(location.to_lat);
                        var dLat2 = toRad(cust_trip_gps_temp.get("destination_coordinates")._latitude);
                        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                                Math.cos(dLat1) * Math.cos(dLat1) *
                                Math.sin(dLon/2) * Math.sin(dLon/2);
                        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                        var d = (R * c)/1.6; // in miles
                        //console.log("distance for " + cust_trip_info_temp[i].get("destination") + " is " + d/1.6 + "miles");
                        if(d <= mile){
                            //console.log(cust_trip_list_temp);
                            //console.log(cust_trip_list_temp.get("customer_username"));
                            mobilenumber=cust_trip_list_temp.get("customer_username");
                            route_screen.get_cust_info_match(mobilenumber).then(function(results3){
                                cust_info_temp = results3;
                                cust_trip_info.push(cust_trip_info_temp[i]);
                                cust_trip_list.push(cust_trip_list_temp);
                                cust_trip_gps.push(cust_trip_gps_temp);
                                cust_info.push(cust_info_temp);
                                //console.log(cust_info_temp);
                                i++;
                                $scope.innerloop(i,max);  
                              });             
                        }
                        else{
                            i++;
                            $scope.innerloop(i,max);                          
                        }

                    });
                });
    }
    else if(max>0 && i==max){
      //console.log("calling build");
      $scope.build_cust_list_disp();
    }
    else if (max == 0){
        $scope.nomatch = function() {
          nomatch_temp=true;
          return true;
        };
    }

  };

  function toRad(x) {
      return x * Math.PI / 180;
    };

  $scope.build_cust_list_disp = function(){

      $scope.nomatch = function() {
          if(cust_trip_info.length > 0)
              {
                //console.log("Matches available");
                nomatch_temp=false;
                return false;
              }
            else{
                //console.log("Matched unavailable");
                nomatch_temp=true;
                return true;
              }
        };

      if(cust_trip_info.length  == cust_trip_list.length ){
        var temp_customer;
        var temp_customer1=[];
        for(i=0; i<cust_trip_info.length; i++){
            if(cust_info[i].get('picture')){
              pict_temp = cust_info[i].get('picture').url();
            }
            else{
              pict_temp = "img/profile.jpg";
            }
            temp_customer={
                source: cust_trip_info[i].get("source"),
                destination: cust_trip_info[i].get("destination"),
                start_date_time: cust_trip_info[i].get("start_date_time"),
                end_date_time: cust_trip_info[i].get("start_date_time"),
                status: cust_trip_info[i].get("status"),
                id:i,
                picture: pict_temp
              };
            temp_customer1.push(temp_customer);
        }
        $scope.customers = temp_customer1;
      }
  }

  $scope.clickecustomer = function(id) 
  {
    //console.log(cust_trip_list);
     route_screen.override_cust_info(cust_info[id]);
     route_screen.override_cust_trip_list(cust_trip_list);
     route_screen.override_cust_trip_info(cust_trip_info);
      //console.log("you clicked " + id);
      route_screen.store_customer_id(id);
      // set customer to driver view mode
      route_screen.store_customer_mode(4);
      // set tab to inprogress mode
      route_screen.store_cust_tab_mode(3);
      $state.go('selectcustomer');
  }

    $scope.post = function() 
  {

    if(nomatch_temp){
        $scope.submit();
    }
    else{
        var confirmPopup = $ionicPopup.confirm({
             title: 'No Customers Selected',
             template: 'Are you sure you want to post?'
           });
           confirmPopup.then(function(res) {
             if(res) {
               $scope.submit();
             } else {
               console.log('You are not sure');
             }
           });
      }
  };

  $scope.submit = function() 
  {
      var driver_all_detail=[];
      driver_all_detail = route_screen.submit_driver_trip();

      var driver_trp_gps_class = Parse.Object.extend("Driver_trip_gps");
      tgps1= new driver_trp_gps_class();
      var point = new Parse.GeoPoint({latitude: Number(driver_all_detail[0].to_lat), longitude: Number(driver_all_detail[0].to_lng)});
      tgps1.set("destination_coordinates",point);
      tgps1.save(null,{
      success:function(obj){
        console.log(obj.id);
        $scope.add_entry_to_driver_trp(obj, driver_all_detail);
        },
      error:function(error){
        console.log(error.message);
        }
      });
  };

  $scope.add_entry_to_driver_trp = function(obj_gps, driver_all_detail) {
      var driver_trip_class = Parse.Object.extend("Driver_trip");
      t1= new driver_trip_class();
      t1.set("source",driver_all_detail[1].source);
      t1.set("destination",driver_all_detail[1].destination);
      var point = new Parse.GeoPoint({latitude: Number(driver_all_detail[0].from_lat), longitude: Number(driver_all_detail[0].from_lng)});
      t1.set("source_coordinates",point);
      t1.set("start_date_time",driver_all_detail[1].start_date_time);
      t1.set("end_date_time",driver_all_detail[1].end_date_time);
      t1.set("status","Posted");

      t1.set("available_capacity",Number(driver_all_detail[2].available_capacity));
      t1.set("cost",Number(driver_all_detail[2].cost));
      t1.set("comments",driver_all_detail[2].comments);
      t1.set("driver_trip_gps",obj_gps);

      var truck_class = Parse.Object.extend("Trucks");
      var query = new Parse.Query(truck_class);
      query.get(driver_all_detail[3].object_id, {
          success: function(results) {
              t1.set("truck",results);
              //alert(driver_all_detail[2].pict_base64);
              if(driver_all_detail[2].pict_base64){
                  var aval_cap_file = { __ContentType: "image/jpeg", base64: driver_all_detail[2].pict_base64 };
                  var parseFile = new Parse.File('aval_cap_pic.jpeg', aval_cap_file);
                  parseFile.save().then(function() {
                          // The file has been saved to Parse.
                          t1.set("picture",parseFile);
                          t1.save(null,{
                          success:function(obj){
                            console.log(obj.id);
                            $scope.add_entry_to_driver_trp_list(obj);
                            },
                          error:function(error){
                            console.log(error.message);
                            }
                          });
                    }, function(error) {
                        alert(error.message);
                          // The file either could not be read, or could not be saved to Parse.
                    });
              }
              else{
                  t1.save(null,{
                  success:function(obj){
                    console.log(obj.id);
                    $scope.add_entry_to_driver_trp_list(obj);
                    },
                  error:function(error){
                    console.log(error.message);
                    }
                  });
              }
            },
          error: function(object, error) {
              console.log(" The object was not retrieved successfully.");
            }
        });
  };

  $scope.add_entry_to_driver_trp_list = function(driver_trip) {
    var driver_trp_lst_class = Parse.Object.extend("Driver_trip_list");
    tl1= new driver_trp_lst_class();
    tl1.set("driver_trip",driver_trip);
    tl1.set("status","Posted");
    tl1.set("driver_username",Parse.User.current().get("username"));

    acl=new Parse.ACL(Parse.User.current());
    acl.setReadAccess(Parse.User.current(),true);
    acl.setWriteAccess(Parse.User.current(),true);

    //get list of drivers
    var query = new Parse.Query(Parse.Role);
    query.contains("name", "customers");
    query.find({
        success : function(role) {
            //console.log(role);
            acl.setReadAccess(role[0],true);
            acl.setWriteAccess(role[0],true);
            tl1.setACL(acl);
            tl1.save(null,{
                success:function(obj){
                  console.log(obj.id);
                  $ionicPopup.alert({
                      title: 'Posted - Great!',
                      content: 'You will be contacted soon by an interested customer.'
                    }).then(function(res) {
                        $state.go('tab.location');
                    });
                  },
                error:function(error){
                  console.log(error.message);
                  }
              });
        },
        error : function(error) {
             response.error("error in finding roles of customers" + error);
        }
     });
  };


  $scope.initialize = function() 
  {

  };
})

//*************************** end of searchcustomerController ****************************

//*************************** start of driverinprogresstripController ****************************
.controller('driverinprogresstripController', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen,$q) {

  var driver_trip_info=[];
  var driver_trip_list=[];
  var driver_info;
  $scope.$on('$ionicView.enter', function(ev) {
      if(ev.targetScope !== $scope)
          return;
      //console.log("called initialize function");
      route_screen.clear_driver_trip_var().then(function(){
          initialize1();
      });
  });

  function initialize1() {
      var filter = ["In-progress"];
      //var filter = ["Posted","Requested","Confirmed","Please Respond"];
      route_screen.get_driver_info().then(function(results){
            driver_info=results;
            //console.log(cust_info);
        }); 
      route_screen.get_driver_trip_list(filter,1).then(function(results){
          driver_trip_list=results;
          $scope.build_driver_list_disp();
          for (i=0; i<driver_trip_list.length;i++){
              route_screen.get_driver_trip_info(driver_trip_list[i],1).then(function(results){
                  driver_trip_info = results;
                  $scope.build_driver_list_disp();
                });
            };   
        });
  }

  $scope.build_driver_list_disp = function(){
      $scope.notrips = function() {
          if(driver_trip_list.length > 0)
              {
                //console.log("Trips available");
                return false;
              }
            else{
                //console.log("No unavailable");
                return true;
              }
        };
      if(driver_trip_info.length  == driver_trip_list.length ){
        var temp_trips;
        var temp_trips1=[];
        for(i=0; i<driver_trip_info.length; i++){
            temp_trips={
                source: driver_trip_info[i].get("source"),
                destination: driver_trip_info[i].get("destination"),
                start_date_time: driver_trip_info[i].get("start_date_time"),
                end_date_time: driver_trip_info[i].get("start_date_time"),
                status: driver_trip_info[i].get("status"),
                id:i,
                picture: driver_info.picture
              };
            temp_trips1.push(temp_trips);
        }
        $scope.trips = temp_trips1;
      }
  }

  $scope.initialize = function() 
  {
      //initialize1();
  };

  $scope.clickedriver = function(id) 
  {
      //console.log("you clicked " + id);
      route_screen.store_driver_id(id);
      // set customer to view mode
      route_screen.store_driver_mode(1);
      // set tab to inprogress mode
      route_screen.store_driver_tab_mode(1);
      $state.go('selectdriver');
  }

})

//*************************** end of driverinprogresstripController ****************************

//*************************** start of driverpasttripController ****************************
.controller('driverpasttripController', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen) {

  var driver_trip_info=[];
  var driver_trip_list=[];
  var driver_info;
  $scope.$on('$ionicView.enter', function(ev) {
      if(ev.targetScope !== $scope)
          return;
      //console.log("called initialize function");
      route_screen.clear_driver_trip_var().then(function(){
          initialize1();
      });

  });

  function initialize1() {
      var filter = ["Completed","Cancelled"]
      //var filter = ["Posted","Requested","Confirmed","Please Respond"];
      route_screen.get_driver_info().then(function(results){
            driver_info=results;
            //console.log(cust_info);
        }); 
      route_screen.get_driver_trip_list(filter,2).then(function(results){
          driver_trip_list=results;
          $scope.build_driver_list_disp();
          for (i=0; i<driver_trip_list.length;i++){
              route_screen.get_driver_trip_info(driver_trip_list[i],2).then(function(results){
                  driver_trip_info = results;
                  $scope.build_driver_list_disp();
                });
            };    
        });
  }

  $scope.build_driver_list_disp = function(){
      $scope.notrips = function() {
          if(driver_trip_list.length > 0)
              {
                //console.log("Trips available");
                return false;
              }
            else{
                //console.log("No unavailable");
                return true;
              }
        };
      if(driver_trip_info.length  == driver_trip_list.length ){
        var temp_trips;
        var temp_trips1=[];
        for(i=0; i<driver_trip_info.length; i++){
            temp_trips={
                source: driver_trip_info[i].get("source"),
                destination: driver_trip_info[i].get("destination"),
                start_date_time: driver_trip_info[i].get("start_date_time"),
                end_date_time: driver_trip_info[i].get("start_date_time"),
                status: driver_trip_info[i].get("status"),
                id:i,
                picture: driver_info.picture
              };
            temp_trips1.push(temp_trips);
        }
        $scope.trips = temp_trips1;
      }
  }

  $scope.initialize = function() 
  {
      //initialize1();
  };

  $scope.clickedriver = function(id) 
  {
      //console.log("you clicked " + id);
      route_screen.store_driver_id(id);
      // set customer to view mode
      route_screen.store_driver_mode(1);
      // set tab to inprogress mode
      route_screen.store_driver_tab_mode(2);
      $state.go('selectdriver');
  }

})

//*************************** end of driverpasttripController ****************************

//*************************** start of driverupcomingtripController ****************************
.controller('driverupcomingtripController', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen) {

  var driver_trip_info=[];
  var driver_trip_list=[];
  var driver_info;
  $scope.$on('$ionicView.enter', function(ev) {
      if(ev.targetScope !== $scope)
          return;
      //console.log("called initialize function");
      route_screen.clear_driver_trip_var().then(function(){
          initialize1();
      });

  });

  function initialize1() {
      var filter = ["Posted","Requested","Confirmed","Please Respond"];
      route_screen.get_driver_info().then(function(results){
            driver_info=results;
            //console.log(cust_info);
        }); 
      route_screen.get_driver_trip_list(filter,3).then(function(results){
          driver_trip_list=results;
          $scope.build_driver_list_disp();
          for (i=0; i<driver_trip_list.length;i++){
              route_screen.get_driver_trip_info(driver_trip_list[i],3).then(function(results){
                  driver_trip_info = results;
                  $scope.build_driver_list_disp();
                });
            };    
        });
  }

  $scope.build_driver_list_disp = function(){
      $scope.notrips = function() {
          if(driver_trip_list.length > 0)
              {
                //console.log("Trips available");
                return false;
              }
            else{
                //console.log("No unavailable");
                return true;
              }
        };
      if(driver_trip_info.length  == driver_trip_list.length ){
        var temp_trips;
        var temp_trips1=[];
        for(i=0; i<driver_trip_info.length; i++){
            temp_trips={
                source: driver_trip_info[i].get("source"),
                destination: driver_trip_info[i].get("destination"),
                start_date_time: driver_trip_info[i].get("start_date_time"),
                end_date_time: driver_trip_info[i].get("start_date_time"),
                status: driver_trip_info[i].get("status"),
                id:i,
                picture: driver_info.picture
              };
            temp_trips1.push(temp_trips);
        }
        $scope.trips = temp_trips1;
      }
  }

  $scope.initialize = function() 
  {
      //initialize1();
  };

  $scope.clickedriver = function(id) 
  {
      //console.log("you clicked " + id);
      route_screen.store_driver_id(id);
      // set customer to view mode
      route_screen.store_driver_mode(1);
      // set tab to inprogress mode
      route_screen.store_driver_tab_mode(3);
      $state.go('selectdriver');
  }

})

//*************************** end of driverupcomingtripController ****************************

//*************************** start of selectdriverController ****************************
.controller('selectdriverController', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen, $stateParams, $ionicPopup) {


  var driver_trip_info;
  var driver_trip_list;
  var driver_trip_gps;
  var clicked_item;
  var driver_info;
  var truck_info;
  var driver;
  var from_lat , from_lng , to_lat, to_lng;
  $scope.$on('$ionicView.enter', function() {
      //console.log("called initialize function");
      //console.log("you clicked in the details section " + route_screen.get_driver_id());
      //console.log("you clicked on mode " + route_screen.get_driver_mode());
      //route_screen.clear_driver_trip_match_var();
      $scope.show_start = function() { return false;}
      $scope.show_response = function() { return false;}
      $scope.show_complete = function() { return false;}
      clicked_item = route_screen.get_driver_id();
      $scope.drivermode = function() {
          if(route_screen.get_driver_mode() == 4)
              {
                //console.log("the driver mode is select view mode of customer");
                return true;
              }
            else{
                //console.log("the dirver mode is edit");
                return false;
              }
        }
      var currentuser = Parse.User.current();
      if(currentuser.get("group") == "driver"){
        driver = true;
      }else{
        driver = false;
      }

      initMap();
      //initialize1();
  });

      function initMap() {
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var map = new google.maps.Map(document.getElementById('map2'), {
            zoom: 7,
            center: {lat: 41.85, lng: -87.65},
            navigationControl: false,
            mapTypeControl: false,
            scaleControl: false,
            draggable: false,
            disableDefaultUI: true,
            zoomControl:false
          });
        //$scope.map=map;

        route_screen.get_driver_trip_list_detail(clicked_item).then(function(results){
            driver_trip_list=results;
            //console.log(driver_trip_list);
            route_screen.get_driver_trip_info_detail(clicked_item).then(function(results){
                driver_trip_info = results;
                //console.log(driver_trip_info);
                route_screen.get_driver_trip_gps(driver_trip_info).then(function(results){
                    driver_trip_gps=results;
                    from_lat = driver_trip_info.get("source_coordinates")._latitude;
                    from_lng = driver_trip_info.get("source_coordinates")._longitude;
                    to_lat = driver_trip_gps.get("destination_coordinates")._latitude;
                    to_lng = driver_trip_gps.get("destination_coordinates")._longitude;
                    //console.log(driver_trip_info.get("source_coordinates"));
                    directionsDisplay.setMap(map);
                    calculateAndDisplayRoute(directionsService, directionsDisplay,map);
                  });
                route_screen.get_trucks_info_details(driver_trip_info).then(function(results1){
                    truck_info = results1;
                    //console.log(truck_info);
                    if (route_screen.get_driver_mode() == 3 || route_screen.get_driver_mode() == 4 || route_screen.get_driver_mode() == 2){
                            driver_info=route_screen.return_driver_info();
                            //console.log(driver_info);
                            $scope.build_driver_list_disp(); 
                    }
                    else{
                        route_screen.get_driver_info().then(function(results){
                              driver_info=results;
                              //console.log(driver_info);
                              $scope.build_driver_list_disp();
                          });
                    }
                  });
              });

          });



      }

      function calculateAndDisplayRoute(directionsService, directionsDisplay,map) {
        var start = new google.maps.LatLng(from_lat,from_lng);
        var end = new google.maps.LatLng(to_lat,to_lng);
        directionsService.route({
          origin: start,
          destination: end,
          travelMode: google.maps.TravelMode.DRIVING
        }, function(response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            //console.log("success direction");
            directionsDisplay.setDirections(response);
          } else {
            //window.alert('Directions request failed due to ' + status);
            var myLatlng = new google.maps.LatLng(from_lat,from_lng);
            map.setCenter(myLatlng);
            $scope.marker_current = new google.maps.Marker({
                map: map,
                position:myLatlng
              });
          }
        });
      }

  $scope.build_driver_list_disp = function(){

      var d = new Date();
      var curr_year = d.getFullYear();

      $scope.driver={
          age: curr_year - driver_info.dob.getFullYear(),
          source: driver_trip_info.get("source"),
          destination: driver_trip_info.get("destination"),
          start_date_time: driver_trip_info.get("start_date_time"),
          end_date_time: driver_trip_info.get("end_date_time"),
          status: driver_trip_info.get("status"),
          name: driver_info.first_name + " " + driver_info.last_name,
          available_capacity:driver_trip_info.get("available_capacity"),
          cost:driver_trip_info.get("cost"),
          comments:driver_trip_info.get("comments"),
          make: truck_info.make,
          model: truck_info.model,
          type: truck_info.type,
          registration_number: truck_info.registration_number,
          mobile_number: driver_info.mobile_number,
          picture1: truck_info.picture1,
          picture2: truck_info.picture2,
          picture3: truck_info.picture3,
          load_pic: driver_trip_info.picture,
          profile_pic: driver_info.picture,
          no_of_rating: driver_info.no_of_rating,
          no_of_comment: driver_info.no_of_comment,
          no_of_ship: driver_info.no_of_ship
        };

    $scope.display_add = function() {
        if (route_screen.get_driver_mode() == 3 || route_screen.get_driver_mode() == 4 ){
            return false;
        }else{
            return true;
        }
      };

    $scope.show_response = function() {
        if ($scope.driver.status == "Please Respond" && route_screen.get_driver_mode() == 1){
            return true;
        }else{
            return false;
        }
      };

    $scope.show_start = function() {
        if ($scope.driver.status == "Confirmed" && driver){
            return true;
        }else{
            return false;
        }
      };

    $scope.show_complete = function() {
        if ($scope.driver.status == "In-progress" &&  driver){
            return true;
        }else{
            return false;
        }
      };

    $scope.show_cancel_trip = function() {
        if ($scope.driver.status == "Posted" &&  driver){
            return true;
        }else{
            return false;
        }
      };


    $scope.show_customer_info = function() {
        if((route_screen.get_driver_tab_mode() == 1 || route_screen.get_driver_tab_mode() == 3) && driver)
            {
            //console.log("the tab mode is inprogress or upcoming");
            if($scope.driver.status == "Posted" || route_screen.get_driver_mode() == 3 || route_screen.get_driver_mode() == 4){
              return false;
            }else{
              return true;
            }
          }
        else{
            //console.log("the tab mode is past");
            return false;
          }
      };

    }

  $scope.customerdetail = function(id) 
  {
      var cust_trip_info =[], cust_trip_list = [],cust_info;
      route_screen.clear_cust_trip_var();
      //console.log(driver_trip_list);
      route_screen.get_cust_trip_info(driver_trip_list,3).then(function(results){
          cust_trip_info = results;
          route_screen.get_cust_trip_list_match(cust_trip_info[0]).then(function(results1){
              cust_trip_list.push(results1);
              var mobile_number = cust_trip_list[0].get("customer_username");
              route_screen.get_cust_info_match(mobile_number).then(function(results2){
                  cust_info=results2;
                  route_screen.override_cust_info(cust_info);
                  route_screen.override_cust_trip_list(cust_trip_list);
                  route_screen.override_cust_trip_info(cust_trip_info);
                  route_screen.store_customer_id(id);
                  if($scope.driver.status == "Confirmed" || $scope.driver.status == "In-progress"){
                      // set customer to driver confirm mode
                      route_screen.store_customer_mode(2);
                  }else{
                      // set customer to driver view mode
                      route_screen.store_customer_mode(3);
                  }
                  // set tab to inprogress mode
                  route_screen.store_cust_tab_mode(3);
                  $state.go('selectcustomer');
                });
            });
        });

      //console.log(cust_trip_info);
  }

  /*function initialize1() {
      $scope.driver=[{pic:"img/truck.jpeg"},{pic:"img/truck.jpeg"},{pic:"img/truck.jpeg"}];
      //console.log($stateParams.driverId);
    }*/


  $scope.initialize = function() 
  {

  };

  $scope.rating = function()
  {
      //console.log("clicked_rating");
      $state.go('driverrating');
  };

$scope.confirm = function() 
  {
      var cust_all_detail=[];
      cust_all_detail = route_screen.submit_cust_trip();

      var cust__trp_gps_class = Parse.Object.extend("Customer_trip_gps");
      tgps1= new cust__trp_gps_class();
      var point = new Parse.GeoPoint({latitude: Number(cust_all_detail[0].to_lat), longitude: Number(cust_all_detail[0].to_lng)});
      tgps1.set("destination_coordinates",point);
      tgps1.save(null,{
      success:function(obj){
        console.log(obj.id);
        $scope.add_entry_to_cust_trp(obj, cust_all_detail);
        },
      error:function(error){
        console.log(error.message);
        }
      });
  };

  $scope.add_entry_to_cust_trp = function(obj_gps, cust_all_detail) {

      var cust_trip_class = Parse.Object.extend("Customer_trip");
      t1= new cust_trip_class();
      t1.set("source",cust_all_detail[1].senderraddr);
      t1.set("destination",cust_all_detail[1].receiveraddr);
      var point = new Parse.GeoPoint({latitude: Number(cust_all_detail[0].from_lat), longitude: Number(cust_all_detail[0].from_lng)});
      t1.set("source_coordinates",point);
      t1.set("start_date_time",cust_all_detail[1].pickdatetime);
      t1.set("end_date_time",cust_all_detail[1].droptimedate);
      t1.set("status","Requested");

      t1.set("sender_name",cust_all_detail[1].sendername);
      t1.set("sender_mobile_number",cust_all_detail[1].sendernumber.toString());
      t1.set("sender_complete_address",(cust_all_detail[1].senderaddrline1+" "+cust_all_detail[1].senderaddrline2+" "+cust_all_detail[1].senderraddr));

      t1.set("receiver_name",cust_all_detail[1].receivername);
      t1.set("receiver_mobile_number",cust_all_detail[1].receivernumber.toString());
      t1.set("receiver_complete_address",(cust_all_detail[1].receiveraddrline1+" "+cust_all_detail[1].receiveraddrline2+" "+cust_all_detail[1].receiveraddr));

      t1.set("goods_type",cust_all_detail[2].goodstype);
      t1.set("goods_weight",Number(cust_all_detail[2].goodsweight));
      t1.set("cost",Number(cust_all_detail[2].cost));
      t1.set("comments",cust_all_detail[2].comments);
      /*var base64 = "V29ya2luZyBhdCBQYXJzZSBpcyBncmVhdCE=";
      var file = new Parse.File(cust_all_detail[2].picture,{ base64: base64 });
      t1.set("comments",file);*/
      t1.set("customer_trip_gps",obj_gps);
      if(cust_all_detail[2].pict_base64){
          var goods_pic_file = { __ContentType: "image/jpeg", base64: cust_all_detail[2].pict_base64 };
          var parseFile = new Parse.File('goods_pic.jpeg', goods_pic_file);
          parseFile.save().then(function() {
              // The file has been saved to Parse.
              t1.set("picture",parseFile);
              t1.save(null,{
              success:function(obj){
                console.log(obj.id);
                $scope.add_entry_to_cust_trp_list(obj);
                },
              error:function(error){
                console.log(error.message);
                }
              });
            }, function(error) {
                  alert(error.message);
                 // The file either could not be read, or could not be saved to Parse.
            });
        }
      else{
          t1.save(null,{
          success:function(obj){
            console.log(obj.id);
            $scope.add_entry_to_cust_trp_list(obj);
            },
          error:function(error){
            console.log(error.message);
            }
          });
        }
  };

  $scope.add_entry_to_cust_trp_list = function(cust_trip) {
    var cust__trp_lst_class = Parse.Object.extend("Customer_trip_list");
    tl1= new cust__trp_lst_class();
    tl1.set("customer_trip",cust_trip);
    tl1.set("status","Requested");
    tl1.set("customer_username",Parse.User.current().get("username"));

    acl=new Parse.ACL(Parse.User.current());
    acl.setReadAccess(Parse.User.current(),true);
    acl.setWriteAccess(Parse.User.current(),true);

    //get list of drivers
    var query = new Parse.Query(Parse.Role);
    query.contains("name", "drivers");
    query.find({
        success : function(role) {
            //console.log("roles: " + role[0].get("name"));
            acl.setReadAccess(role[0],true);
            acl.setWriteAccess(role[0],true);
            tl1.setACL(acl);
            tl1.save(null,{
            success:function(obj){
              console.log(obj.id);
              driver_trip_list.set("status","Please Respond");
              driver_trip_list.set("customer_trip",cust_trip);
              driver_trip_list.save();
              driver_trip_info.set("status","Please Respond");
              driver_trip_info.save();
              $ionicPopup.alert({
                  title: 'Requested - Great!',
                  content: 'You will soon be contacted by the driver.'
                }).then(function(res) {
                    $state.go('tab.location');
                });
              },
            error:function(error){
              console.log(error.message);
              }
            });
        },
        error : function(error) {
             response.error("error in finding roles of drivers" + error);
        }
     });
  };

  $scope.respond = function() 
  {
      var confirmPopup = $ionicPopup.confirm({
          //title: 'Do you want to confirm trip? <button class="button button-clear icon ion-ios-list-outline" ></button>',
          template: ' Do you want to confirm trip?  <button class="button button-small ng-click="close()" icon ion-close-circled" >Exit</button>',
          cancelText: 'Cancel Trip',
          okText: 'Confirm Trip'
      }).then(function(res) {
          if (res) {
              console.log('confirmed');
              $scope.updt_cnf_trp();
          }
      });
  };

  $scope.start = function() 
  {
      var confirmPopup = $ionicPopup.confirm({
          title: 'Do you want to Start trip? ',
          //template: ' Do you want to Start trip?  <button class="button button-small ng-click="close()" icon ion-close-circled" >Exit</button>',
          cancelText: 'Cancel ',
          okText: 'Start Trip'
      }).then(function(res) {
          if (res) {
              console.log('start');
              $scope.updt_start_trp();
          }
      });
  };

  $scope.complete = function() 
  {
      var confirmPopup = $ionicPopup.confirm({
          title: 'Do you want to complete trip? ',
          //template: ' Do you want to complete trip?  <button class="button button-small ng-click="close()" icon ion-close-circled" >Exit</button>',
          cancelText: 'Cancel ',
          okText: 'Complete Trip'
      }).then(function(res) {
          if (res) {
              console.log('complete');
              $scope.updt_cmpt_trp();
          }
      });
  };

  $scope.cancel_trip = function() 
  {
      var confirmPopup = $ionicPopup.confirm({
          title: 'Do you want to cancel the trip? ',
          //template: ' Do you want to cancel the trip?  <button class="button button-small ng-click="close()" icon ion-close-circled" >Exit</button>',
          cancelText: 'No ',
          okText: 'Yes'
      }).then(function(res) {
          if (res) {
              console.log('cancel');
              $scope.updt_cncl_trp();
          }
      });
  };

  $scope.close = function(){
    console.log("close");
  };

  $scope.updt_cnf_trp = function() {
      driver_trip_info.set("status","Confirmed");
      driver_trip_list.set("status","Confirmed");
      cust_trip_info = driver_trip_list.get("customer_trip");
      cust_trip_info.set("status","Confirmed");
      var pointer_class = Parse.Object.extend("Customer_trip");
      var pointer = new pointer_class();
      pointer.id = cust_trip_info.id;
      var cust_trip_class = Parse.Object.extend("Customer_trip_list");
      var query = new Parse.Query(cust_trip_class);
      query.equalTo("customer_trip", pointer);
      query.find({
          success: function(results) {
              console.log(results.length);
              cust_trip_list = results[0]
              cust_trip_list.set("status","Confirmed");
              cust_trip_list.save();
              cust_trip_info.save();
              driver_trip_list.save();
              driver_trip_info.save();
              $ionicPopup.alert({
                  title: 'Confirmed - Great!',
                  content: 'Your trip is confirmed and customer is notified.'
                }).then(function(res) {
                     $state.go('tab.location');
                });
            },
          error: function(error) {
              console.log(" The object was not retrieved successfully.");
          }
        });
   };

  $scope.updt_start_trp = function() {
      driver_trip_info.set("status","In-progress");
      driver_trip_list.set("status","In-progress");
      cust_trip_info = driver_trip_list.get("customer_trip");
      cust_trip_info.set("status","In-progress");
      var pointer_class = Parse.Object.extend("Customer_trip");
      var pointer = new pointer_class();
      pointer.id = cust_trip_info.id;
      var cust_trip_class = Parse.Object.extend("Customer_trip_list");
      var query = new Parse.Query(cust_trip_class);
      query.equalTo("customer_trip", pointer);
      query.find({
          success: function(results) {
              console.log(results.length);
              cust_trip_list = results[0]
              cust_trip_list.set("status","In-progress");
              cust_trip_list.save();
              cust_trip_info.save();
              driver_trip_list.save();
              driver_trip_info.save();
              $ionicPopup.alert({
                  title: 'Started - Great!',
                  content: 'Your trip is started and customer is notified.'
                }).then(function(res) {
                     $state.go('tab.location');
                });
            },
          error: function(error) {
              console.log(" The object was not retrieved successfully.");
          }
        });
   };

  $scope.updt_cmpt_trp = function() {
      driver_trip_info.set("status","Completed");
      driver_trip_list.set("status","Completed");
      cust_trip_info = driver_trip_list.get("customer_trip");
      cust_trip_info.set("status","Completed");
      var pointer_class = Parse.Object.extend("Customer_trip");
      var pointer = new pointer_class();
      pointer.id = cust_trip_info.id;
      var cust_trip_class = Parse.Object.extend("Customer_trip_list");
      var query = new Parse.Query(cust_trip_class);
      query.equalTo("customer_trip", pointer);
      query.find({
          success: function(results) {
              console.log(results.length);
              cust_trip_list = results[0]
              cust_trip_list.set("status","Completed");
              cust_trip_list.save();
              cust_trip_info.save();
              driver_trip_list.save();
              driver_trip_info.save();
              $ionicPopup.alert({
                  title: 'Completed - Great!',
                  content: 'Your trip is completed and customer is notified.'
                }).then(function(res) {
                     $state.go('tab.location');
                });
            },
          error: function(error) {
              console.log(" The object was not retrieved successfully.");
          }
        });
   };

  $scope.updt_decline_req = function() {
      cust_trip_info.set("status","Posted");
      cust_trip_info.save();
      cust_trip_list.set("status","Posted");
      cust_trip_list.save();
      var pointer_class = Parse.Object.extend("Customer_trip");
      var pointer = new pointer_class();
      pointer.id = cust_trip_info.id;
      var driver_trip_class = Parse.Object.extend("Driver_trip_list");
      var query = new Parse.Query(driver_trip_class);
      query.equalTo("customer_trip", pointer);
      query.find({
          success: function(results) {
              console.log(results.length);
              driver_trip_list = results[0]
              driver_trip_list.set("status","Posted");
              driver_trip_list.set("customer_trip","");
              driver_trip_list.save();
              driver_trip_info = driver_trip_list.get("driver_trip");
              driver_trip_info.set("status","Posted");
              driver_trip_info.save();
              $ionicPopup.alert({
                  title: 'Cancelled!',
                  content: 'You will shortly be contacted by another interested driver.'
                }).then(function(res) {
                     //$state.go('tab.location');
                });
            },
          error: function(error) {
              console.log(" The object was not retrieved successfully.");
          }
        });
   };

  $scope.updt_cncl_trp = function() {
      driver_trip_info.set("status","Cancelled");
      driver_trip_list.set("status","Cancelled");
      driver_trip_list.save();
      driver_trip_info.save();
      $ionicPopup.alert({
          title: 'Cancelled!',
          content: 'Your trip is Cancelled.'
        }).then(function(res) {
             $state.go('tab.location');
        });
   };


})

//*************************** end of selectdriverController ****************************

//*************************** start of customer inprogresstripController ****************************
.controller('inprogresstripController', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen,$q) {

  var cust_trip_info=[];
  var cust_trip_list=[];
  var cust_info;
  $scope.$on('$ionicView.enter', function(ev) {
      if(ev.targetScope !== $scope)
          return;
      //console.log("called initialize function");
      route_screen.clear_cust_trip_var().then(function(){
          initialize1();
      });

  });

  function initialize1() {
      var filter = ["In-progress"];
      //var filter = ["Posted","Requested","Confirmed","Please Respond"];
      route_screen.get_cust_info().then(function(results){
            cust_info=results;
            //console.log(cust_info);
        });
      route_screen.get_cust_trip_list(filter,1).then(function(results){
          cust_trip_list=results;
          $scope.build_cust_list_disp();
          for (i=0; i<cust_trip_list.length;i++){
              route_screen.get_cust_trip_info(cust_trip_list[i],1).then(function(results){
                  cust_trip_info = results;
                  $scope.build_cust_list_disp();
                });
            };    
        });
  }

  $scope.build_cust_list_disp = function(){
      $scope.notrips = function() {
          if(cust_trip_list.length > 0)
              {
                //console.log("Trips available");
                return false;
              }
            else{
                //console.log("No unavailable");
                return true;
              }
        };
      if(cust_trip_info.length  == cust_trip_list.length ){
        var temp_trips;
        var temp_trips1=[];
        for(i=0; i<cust_trip_info.length; i++){
            temp_trips={
                source: cust_trip_info[i].get("source"),
                destination: cust_trip_info[i].get("destination"),
                start_date_time: cust_trip_info[i].get("start_date_time"),
                end_date_time: cust_trip_info[i].get("start_date_time"),
                status: cust_trip_info[i].get("status"),
                id:i,
                picture: cust_info.picture
              };
            temp_trips1.push(temp_trips);
        }
        $scope.trips = temp_trips1;
      }
  }

  $scope.initialize = function() 
  {
      //initialize1();
  };

  $scope.clickecustomer = function(id) 
  {
      //console.log("you clicked " + id);
      route_screen.store_customer_id(id);
      // set customer to view mode
      route_screen.store_customer_mode(1);
      // set tab to inprogress mode
      route_screen.store_cust_tab_mode(1);
      $state.go('selectcustomer');
  }

})

//*************************** end of customer inprogresstripController ****************************

//*************************** start of customer pasttripController ****************************
.controller('pasttripController', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen) {

  var cust_trip_info=[];
  var cust_trip_list=[];
  var cust_info;
  $scope.$on('$ionicView.enter', function(ev) {
      if(ev.targetScope !== $scope)
          return;
      //console.log("called initialize function");
      route_screen.clear_cust_trip_var().then(function(){
          initialize1();
      });

  });

  function initialize1() {
      var filter = ["Completed","Cancelled"];
      route_screen.get_cust_info().then(function(results){
            cust_info=results;
            //console.log(cust_info);
        });
      route_screen.get_cust_trip_list(filter,2).then(function(results){
          cust_trip_list=results;
          $scope.build_cust_list_disp();
          for (i=0; i<cust_trip_list.length;i++){
              route_screen.get_cust_trip_info(cust_trip_list[i],2).then(function(results){
                  cust_trip_info = results;
                  $scope.build_cust_list_disp();
                });
            };    
        });
  }

  $scope.build_cust_list_disp = function(){
      $scope.notrips = function() {
          if(cust_trip_list.length > 0)
              {
                //console.log("Trips available");
                return false;
              }
            else{
                //console.log("No unavailable");
                return true;
              }
        };
      if(cust_trip_info.length  == cust_trip_list.length ){
        var temp_trips;
        var temp_trips1=[];
        for(i=0; i<cust_trip_info.length; i++){
            temp_trips={
                source: cust_trip_info[i].get("source"),
                destination: cust_trip_info[i].get("destination"),
                start_date_time: cust_trip_info[i].get("start_date_time"),
                end_date_time: cust_trip_info[i].get("start_date_time"),
                status: cust_trip_info[i].get("status"),
                id:i,
                picture: cust_info.picture
              };
            temp_trips1.push(temp_trips);
        }
        $scope.trips = temp_trips1;
      }
  }

  $scope.initialize = function() 
  {
      //initialize1();
  };

  $scope.clickecustomer = function(id) 
  {
      //console.log("you clicked " + id);
      route_screen.store_customer_id(id);
      // set customer to view mode
      route_screen.store_customer_mode(1);
      // set tab to past mode
      route_screen.store_cust_tab_mode(2);
      $state.go('selectcustomer');
  }


})

//*************************** end of customer pasttripController ****************************

//*************************** start of customer upcomingtripController ****************************
.controller('upcomingtripController', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen) {

  var cust_trip_info=[];
  var cust_trip_list=[];
  var cust_info;
  $scope.$on('$ionicView.enter', function(ev) {
      if(ev.targetScope !== $scope)
          return;
      //console.log("called initialize function");
      route_screen.clear_cust_trip_var().then(function(){
          initialize1();
      });

  });

  function initialize1() {
      var filter = ["Posted","Requested","Confirmed","Please Respond"];
      route_screen.get_cust_info().then(function(results){
            cust_info=results;
            //console.log(cust_info);
        });
      route_screen.get_cust_trip_list(filter,3).then(function(results){
          cust_trip_list=results;
          $scope.build_cust_list_disp();
          for (i=0; i<cust_trip_list.length;i++){
              route_screen.get_cust_trip_info(cust_trip_list[i],3).then(function(results){
                  cust_trip_info = results;
                  $scope.build_cust_list_disp();
                });
            };    
        });
  }

  $scope.build_cust_list_disp = function(){
      $scope.notrips = function() {
          if(cust_trip_list.length > 0)
              {
                //console.log("Trips available");
                return false;
              }
            else{
                //console.log("No unavailable");
                return true;
              }
        };
      if(cust_trip_info.length  == cust_trip_list.length ){
        var temp_trips;
        var temp_trips1=[];
        for(i=0; i<cust_trip_info.length; i++){
            temp_trips={
                source: cust_trip_info[i].get("source"),
                destination: cust_trip_info[i].get("destination"),
                start_date_time: cust_trip_info[i].get("start_date_time"),
                end_date_time: cust_trip_info[i].get("start_date_time"),
                status: cust_trip_info[i].get("status"),
                id:i,
                picture: cust_info.picture
              };
            temp_trips1.push(temp_trips);
        }
        $scope.trips = temp_trips1;
      }
  }

  $scope.initialize = function() 
  {
      //initialize1();
      //console.log("called initialize function");
  };

  $scope.clickecustomer = function(id) 
  {
      //console.log("you clicked " + id);
      route_screen.store_customer_id(id);
      // set customer to view mode
      route_screen.store_customer_mode(1);
      // set tab to upcomming mode
      route_screen.store_cust_tab_mode(3);
      $state.go('selectcustomer');
  }


})

//*************************** end of customer upcomingtripController ****************************

//*************************** start of selectcustomerController ****************************
.controller('selectcustomerController', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen, $stateParams, $ionicPopup,$ionicModal) {

  var cust_trip_info;
  var cust_trip_list;
  var cust_trip_gps;
  var clicked_item;
  var cust_info;
  var from_lat , from_lng , to_lat, to_lng;
  var customer;
  $scope.$on('$ionicView.enter', function() {
      //console.log("called initialize function");
      //console.log("you clicked in the details section " + route_screen.get_customer_id());
      //console.log("you clicked on mode " + route_screen.get_driver_mode());
      //route_screen.clear_cust_trip_match_var();
      $scope.show_response = function() { return false;}
      clicked_item = route_screen.get_customer_id();
      $scope.customermode = function() {
          if(route_screen.get_customer_mode() == 4)
              {
                //console.log("the customer mode is select view mode of driver");
                return true;
              }
            else{
                //console.log("the customer mode is edit");
                return false;
              }
        }
      var currentuser = Parse.User.current();
      if(currentuser.get("group") == "customer"){
        customer = true;
      }else{
        customer = false;
      }

      initMap();
      initialize1();
  });

      function initMap() {
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var map = new google.maps.Map(document.getElementById('map3'), {
            zoom: 7,
            center: {lat: 41.85, lng: -87.65},
            navigationControl: false,
            mapTypeControl: false,
            scaleControl: false,
            draggable: false,
            disableDefaultUI: true,
            zoomControl:false
          });
        //$scope.map=map;

        route_screen.get_cust_trip_list_detail(clicked_item).then(function(results){
            cust_trip_list=results;
            route_screen.get_cust_trip_info_detail(clicked_item).then(function(results){
                cust_trip_info = results;
                //console.log(cust_trip_info.get("status"));
                route_screen.get_cust_trip_gps(cust_trip_info).then(function(results){
                    cust_trip_gps=results;
                    from_lat = cust_trip_info.get("source_coordinates")._latitude;
                    from_lng = cust_trip_info.get("source_coordinates")._longitude;
                    to_lat = cust_trip_gps.get("destination_coordinates")._latitude;
                    to_lng = cust_trip_gps.get("destination_coordinates")._longitude;
                    //console.log(cust_trip_info.get("source_coordinates"));
                    directionsDisplay.setMap(map);
                    calculateAndDisplayRoute(directionsService, directionsDisplay,map);
                  });
                if (route_screen.get_customer_mode() == 3 || route_screen.get_customer_mode() == 4 || route_screen.get_customer_mode() == 2){
                        cust_info=route_screen.return_cust_info();
                        //console.log(cust_info);
                        $scope.build_cust_list_disp(); 
                }
                else{
                    route_screen.get_cust_info().then(function(results){
                          cust_info=results;
                          //console.log(cust_info);
                          $scope.build_cust_list_disp();
                      });
                }
              });

          });



      }

      function calculateAndDisplayRoute(directionsService, directionsDisplay,map) {
        var start = new google.maps.LatLng(from_lat,from_lng);
        var end = new google.maps.LatLng(to_lat,to_lng);
        directionsService.route({
          origin: start,
          destination: end,
          travelMode: google.maps.TravelMode.DRIVING
        }, function(response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            //console.log("success direction");
            directionsDisplay.setDirections(response);
          } else {
            //window.alert('Directions request failed due to ' + status);
            var myLatlng = new google.maps.LatLng(from_lat,from_lng);
            map.setCenter(myLatlng);
            $scope.marker_current = new google.maps.Marker({
                map: map,
                position:myLatlng
              });
          }
        });
      }

  function initialize1() {
      $scope.driver=[{pic:"img/truck.jpeg"},{pic:"img/truck.jpeg"},{pic:"img/truck.jpeg"}];
      //console.log($stateParams.driverId);
    }

  $scope.initialize = function() 
  {

  };

  $scope.build_cust_list_disp = function(){

      /*if(cust_info.get('picture')){
          prof_pict_temp = cust_info.get('picture').url();
      }
      else{
          prof_pict_temp = "img/profile.jpg";
      }*/
      if(cust_trip_info.get('picture')){
          pict_temp = cust_trip_info.get('picture').url();
      }
      else{
          pict_temp = "img/truck.jpeg";
      }
      $scope.customer={
          source: cust_trip_info.get("source"),
          destination: cust_trip_info.get("destination"),
          pickdatetime: cust_trip_info.get("start_date_time"),
          droptimedate: cust_trip_info.get("start_date_time"),
          status: cust_trip_info.get("status"),
          id:i,
          name: cust_info.first_name + " " + cust_info.last_name,
          sendername:cust_trip_info.get("sender_name"),
          sendernumber:cust_trip_info.get("sender_mobile_number"),
          sender_complete_address:cust_trip_info.get("sender_complete_address"),
          receivername:cust_trip_info.get("receiver_name"),
          receivernumber:cust_trip_info.get("receiver_mobile_number"),
          receiver_complete_address:cust_trip_info.get("receiver_complete_address"),
          goodstype:cust_trip_info.get("goods_type"),
          goodsweight:cust_trip_info.get("goods_weight"),
          cost:cust_trip_info.get("cost"),
          comments:cust_trip_info.get("comments"),
          picture: pict_temp,
          profile_pic: cust_info.picture
        };
        //console.log($scope.customer);

    $scope.display_add = function() {
        if (route_screen.get_customer_mode() == 3 || route_screen.get_customer_mode() == 4 ){
            return false;
        }else{
            return true;
        }
      };

    $scope.show_response = function() {
        if ($scope.customer.status == "Please Respond" && route_screen.get_customer_mode() == 1){
            return true;
        }else{
            return false;
        }
      };

    $scope.show_cancel_trip = function() {
        if ($scope.customer.status == "Posted" &&  customer){
            return true;
        }else{
            return false;
        }
      };

    $scope.show_rating = function() {
        if ($scope.customer.status == "In-progress" &&  customer){
            return true;
        }else{
            return false;
        }
      };

    $scope.show_driver_info = function() {
        if((route_screen.get_cust_tab_mode() == 1 || route_screen.get_cust_tab_mode() == 3) && customer)
            {
            //console.log("the tab mode is inprogress or upcoming");
            if($scope.customer.status == "Posted" || route_screen.get_customer_mode() == 3 || route_screen.get_customer_mode() == 4){
              return false;
            }else{
              return true;
            }
          }
        else{
            //console.log("the tab mode is past");
            return false;
          }
      };
  }

  $scope.driverdetail = function(id) 
  {
      var driver_trip_info =[], driver_trip_list = [],driver_info; 
      route_screen.clear_driver_trip_var();
      route_screen.get_driver_trip_list_link(cust_trip_info).then(function(results){
          driver_trip_list = results;
          route_screen.get_driver_trip_info(driver_trip_list[0],3).then(function(results1){
              driver_trip_info = results1;
              //console.log(driver_trip_list[0].get("driver_username"));
              var mobile_number = driver_trip_list[0].get("driver_username");
              route_screen.get_driver_info_match(mobile_number).then(function(results2){
                  driver_info=results2;
                  route_screen.override_driver_info(driver_info);
                  route_screen.override_driver_trip_list(driver_trip_list);
                  route_screen.override_driver_trip_info(driver_trip_info);
                  route_screen.store_driver_id(id);
                  if($scope.customer.status == "Confirmed" || $scope.customer.status == "In-progress"){
                      // set driver to customer confirm mode
                      route_screen.store_driver_mode(2);
                  }else{
                      // set driver to customer view mode
                      route_screen.store_driver_mode(3);
                  }
                  // set tab to inprogress mode
                  route_screen.store_driver_tab_mode(3);
                  $state.go('selectdriver');
                });
            });
        });
  }

  $scope.confirm = function() 
  {
      var driver_all_detail=[];
      driver_all_detail = route_screen.submit_driver_trip();

      var driver_trp_gps_class = Parse.Object.extend("Driver_trip_gps");
      tgps1= new driver_trp_gps_class();
      var point = new Parse.GeoPoint({latitude: Number(driver_all_detail[0].to_lat), longitude: Number(driver_all_detail[0].to_lng)});
      tgps1.set("destination_coordinates",point);
      tgps1.save(null,{
      success:function(obj){
        console.log(obj.id);
        $scope.add_entry_to_driver_trp(obj, driver_all_detail);
        },
      error:function(error){
        console.log(error.message);
        }
      });
  };

  $scope.add_entry_to_driver_trp = function(obj_gps, driver_all_detail) {
      var driver_trip_class = Parse.Object.extend("Driver_trip");
      t1= new driver_trip_class();
      t1.set("source",driver_all_detail[1].source);
      t1.set("destination",driver_all_detail[1].destination);
      var point = new Parse.GeoPoint({latitude: Number(driver_all_detail[0].from_lat), longitude: Number(driver_all_detail[0].from_lng)});
      t1.set("source_coordinates",point);
      t1.set("start_date_time",driver_all_detail[1].start_date_time);
      t1.set("end_date_time",driver_all_detail[1].end_date_time);
      t1.set("status","Requested");

      t1.set("available_capacity",Number(driver_all_detail[2].available_capacity));
      t1.set("cost",Number(driver_all_detail[2].cost));
      t1.set("comments",driver_all_detail[2].comments);
      t1.set("driver_trip_gps",obj_gps);

      var truck_class = Parse.Object.extend("Trucks");
      var query = new Parse.Query(truck_class);
      query.get(driver_all_detail[3].object_id, {
          success: function(results) {
              t1.set("truck",results);
              //alert(driver_all_detail[2].pict_base64);
              if(driver_all_detail[2].pict_base64){
                  var aval_cap_file = { __ContentType: "image/jpeg", base64: driver_all_detail[2].pict_base64 };
                  var parseFile = new Parse.File('aval_cap_pic.jpeg', aval_cap_file);
                  parseFile.save().then(function() {
                          // The file has been saved to Parse.
                          t1.set("picture",parseFile);
                          t1.save(null,{
                          success:function(obj){
                            console.log(obj.id);
                            $scope.add_entry_to_driver_trp_list(obj);
                            },
                          error:function(error){
                            console.log(error.message);
                            }
                          });
                    }, function(error) {
                        alert(error.message);
                          // The file either could not be read, or could not be saved to Parse.
                    });
              }
              else{
                  t1.save(null,{
                  success:function(obj){
                    console.log(obj.id);
                    $scope.add_entry_to_driver_trp_list(obj);
                    },
                  error:function(error){
                    console.log(error.message);
                    }
                  });
              }
            },
          error: function(object, error) {
              console.log(" The object was not retrieved successfully.");
            }
        });
  };

  $scope.add_entry_to_driver_trp_list = function(driver_trip) {
    var driver_trp_lst_class = Parse.Object.extend("Driver_trip_list");
    tl1= new driver_trp_lst_class();
    tl1.set("driver_trip",driver_trip);
    tl1.set("status","Requested");
    tl1.set("driver_username",Parse.User.current().get("username"));

    tl1.set("customer_trip",cust_trip_info);

    acl=new Parse.ACL(Parse.User.current());
    acl.setReadAccess(Parse.User.current(),true);
    acl.setWriteAccess(Parse.User.current(),true);

    //get list of customers
    var query = new Parse.Query(Parse.Role);
    query.contains("name", "customers");
    query.find({
        success : function(role) {
            //console.log(role);
            acl.setReadAccess(role[0],true);
            acl.setWriteAccess(role[0],true);
            tl1.setACL(acl);
            tl1.save(null,{
                success:function(obj){
                  console.log(obj.id);
                  cust_trip_list.set("status","Please Respond");
                  cust_trip_list.save();
                  cust_trip_info.set("status","Please Respond");
                  cust_trip_info.save();
                  $ionicPopup.alert({
                      title: 'Posted - Great!',
                      content: 'You will be contacted soon by the customer.'
                    }).then(function(res) {
                        $state.go('tab.location');
                    });
                  },
                error:function(error){
                  console.log(error.message);
                  }
              });
        },
        error : function(error) {
             response.error("error in finding roles of customers" + error);
        }
     });
  };

  $scope.respond = function() 
  {
      var confirmPopup = $ionicPopup.confirm({
          title: 'Do you want to confirm trip?',
          //template: 'Popup text',
          cancelText: 'Cancel',
          okText: 'Confirm'
      }).then(function(res) {
          if (res) {
              console.log('confirmed');
              $scope.updt_cnf_trp();
          }
      });
  };

  $scope.cancel_trip = function() 
  {
      var confirmPopup = $ionicPopup.confirm({
          title: 'Do you want to cancel the trip? ',
          //template: ' Do you want to cancel the trip?  <button class="button button-small ng-click="close()" icon ion-close-circled" >Exit</button>',
          cancelText: 'No ',
          okText: 'Yes'
      }).then(function(res) {
          if (res) {
              console.log('cancel');
              $scope.updt_cncl_trp();
          }
      });
  };

  $scope.rate_driver = function() 
  {
      var confirmPopup = $ionicPopup.confirm({
          //title: 'Do you want to cancel the trip? ',
          template: ' <button class="button button-small ng-click="close()" icon ion-close-circled" >Exit</button>',
          cancelText: 'No ',
          okText: 'Yes'
      }).then(function(res) {
          if (res) {
              console.log('cancel');
              //$scope.updt_cncl_trp();
          }
      });
  };


  $scope.updt_cnf_trp = function() {
      cust_trip_info.set("status","Confirmed");
      cust_trip_info.save();
      cust_trip_list.set("status","Confirmed");
      cust_trip_list.save();
      var pointer_class = Parse.Object.extend("Customer_trip");
      var pointer = new pointer_class();
      pointer.id = cust_trip_info.id;
      var driver_trip_class = Parse.Object.extend("Driver_trip_list");
      var query = new Parse.Query(driver_trip_class);
      query.equalTo("customer_trip", pointer);
      query.find({
          success: function(results) {
              console.log(results.length);
              driver_trip_list = results[0]
              driver_trip_list.set("status","Confirmed");
              driver_trip_list.save();
              driver_trip_info = driver_trip_list.get("driver_trip");
              driver_trip_info.set("status","Confirmed");
              driver_trip_info.save();
              $ionicPopup.alert({
                  title: 'Confirmed - Great!',
                  content: 'Your trip is confirmed and driver is notified.'
                }).then(function(res) {
                     $state.go('tab.location');
                });
            },
          error: function(error) {
              console.log(" The object was not retrieved successfully.");
          }
        });
   };

  $scope.updt_decline_req = function() {
      cust_trip_info.set("status","Posted");
      cust_trip_info.save();
      cust_trip_list.set("status","Posted");
      cust_trip_list.save();
      var pointer_class = Parse.Object.extend("Customer_trip");
      var pointer = new pointer_class();
      pointer.id = cust_trip_info.id;
      var driver_trip_class = Parse.Object.extend("Driver_trip_list");
      var query = new Parse.Query(driver_trip_class);
      query.equalTo("customer_trip", pointer);
      query.find({
          success: function(results) {
              console.log(results.length);
              driver_trip_list = results[0]
              driver_trip_list.set("status","Posted");
              driver_trip_list.set("customer_trip","");
              driver_trip_list.save();
              driver_trip_info = driver_trip_list.get("driver_trip");
              driver_trip_info.set("status","Posted");
              driver_trip_info.save();
              $ionicPopup.alert({
                  title: 'Cancelled!',
                  content: 'You will shortly be contacted by another interested driver.'
                }).then(function(res) {
                     $state.go('tab.location');
                });
            },
          error: function(error) {
              console.log(" The object was not retrieved successfully.");
          }
        });
   };

  $scope.updt_cncl_trp = function() {
      cust_trip_info.set("status","Cancelled");
      cust_trip_list.set("status","Cancelled");
      cust_trip_list.save();
      cust_trip_info.save();
      $ionicPopup.alert({
          title: 'Cancelled!',
          content: 'Your trip is Cancelled.'
        }).then(function(res) {
             $state.go('tab.location');
        });
   };


  $scope.rate_driver = function(id) {
      var driver_trip_info =[], driver_trip_list = [],driver_info; 
      route_screen.clear_driver_trip_var();
      route_screen.get_driver_trip_list_link(cust_trip_info).then(function(results){
          driver_trip_list = results;
          route_screen.get_driver_trip_info(driver_trip_list[0],3).then(function(results1){
              driver_trip_info = results1;
              //console.log(driver_trip_list[0].get("driver_username"));
              var mobile_number = driver_trip_list[0].get("driver_username");
              route_screen.get_driver_info_match(mobile_number).then(function(results2){
                  driver_info=results2;
                  route_screen.override_driver_info(driver_info);
                  route_screen.override_driver_trip_list(driver_trip_list);
                  route_screen.override_driver_trip_info(driver_trip_info);
                  route_screen.store_driver_id(id);
                  // set driver to customer confirm mode
                  route_screen.store_driver_mode(2);
                  // set tab to inprogress mode
                  route_screen.store_driver_tab_mode(3);
                  $state.go('ratedriver');
                });
            });
        });
  };



})

//*************************** end of selectcustomerController ****************************

//*************************** start of tab1Controller ****************************
.controller('tab1Controller', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen) {

  var cust_info;
  var cust_trip_info;
  $scope.$on('$ionicView.enter', function() {
      //console.log("called initialize function of tabs");
      //initialize1();
  });

  function initialize1() {
   //route_screen.get_cust_trip();
  }

  $scope.initialize = function() 
  {

  };
})

//*************************** end of tab1Controller ****************************

//*************************** start of tab2Controller ****************************
.controller('tab2Controller', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen) {

  var cust_info;
  var cust_trip_info;
  $scope.$on('$ionicView.enter', function() {
      //console.log("called initialize function of tabs");
      //initialize1();
  });

  function initialize1() {
   //route_screen.get_cust_trip();
  }

  $scope.initialize = function() 
  {

  };
})

//*************************** end of tab2Controller ****************************

//*************************** start of tab3Controller ****************************
.controller('tab3Controller', function($state, $scope, $ionicLoading, $compile, $rootScope,route_screen) {

  var cust_info;
  var cust_trip_info;
  $scope.$on('$ionicView.enter', function() {
      //console.log("called initialize function of tabs");
      //initialize1();
  });

  function initialize1() {
   //route_screen.get_cust_trip();
  }

  $scope.initialize = function() 
  {

  };
})

//*************************** end of tab3Controller ****************************


