angular.module('starter.services', [])


.factory('route_screen',['$q', function($q,$localStorage,$http) {

  var chats = [{
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/truck.ico'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/truck.ico'
  }, 
  {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/truck.ico'
  }, 
   {
    id: 4,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/truck.ico'
  }, 
   {
    id: 4,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/truck.ico'
  }, 
   {
    id: 6,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/truck.ico'
  }, 
   {
    id: 7,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/truck.ico'
  }, 
   {
    id: 8,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/truck.ico'
  }, 
   {
    id: 9,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/truck.ico'
  }, 
   {
    id: 10,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/truck.ico'
  }, 
  {
    id: 11,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/truck.ico'
  },
  {
    id: 12,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/truck.ico'
  }];

	var deviceid; // This holds the device id for push notification.
	var loginprof=1; // loginprof = 1 logined as customer , loginprof = 2 logined as driver , loginprof = 3 logined as admin
	var currentuser , currentcustomer, location;
	var driver_prof_stat = 1;// driver_prof_stat = 1 for approval pending , driver_prof_stat = 2 for approved.
	var truck_reg_stat = 1; // truck_reg_stat = 1 for approval pending , truck_reg_stat = 2, for approved.
	var cust_trp, cust_goods;
	var driver_trp, driver_goods , selected_truck_info, cust_srch_list=[], driver_all_detail=[];
	var cust_all_detail=[];
	var driver_list_admin =[];
  	var cust_trip_info_inprog=[] , cust_trip_info_past=[] , cust_trip_info_upcmg=[], cust_trip_info=[];
  	var cust_trip_list_inprog=[], cust_trip_list_past=[],  cust_trip_list_upcmg=[];
  	var driver_trip_info_inprog=[] , driver_trip_info_past=[] , driver_trip_info_upcmg=[], driver_trip_info=[];
  	var driver_trip_list_inprog=[], driver_trip_list_past=[],  driver_trip_list_upcmg=[];
  	var cust_trip_gps, driver_info, trucks_info=[], driver_rating=[];
	var driverid;
	var drivermode=1; // drivermode = 1 for view mode , drivermode = 2 for confirm mode drivermode = 3 for view mode of customer
					// drivermode = 4 for select view mode of customer
	var customerid;
	var truckid;
	var customermode=1; // customermode = 1 for view mode , customermode = 2 for confirm mode, customermode = 3 for view mode of driver
						// customermode = 4 for select view mode of driver
	var cust_tabmode=1; // tabmode = 1 for inprogress mode , tabmode = 2 for past mode , tabmode = 3 for upcommming mode
	var driver_tabmode=1; // tabmode = 1 for inprogress mode , tabmode = 2 for past mode , tabmode = 3 for upcommming mode
	//var locations=[];
	var cust_info= {
		first_name:"",
		last_name:"",
		mobile_number:"",
		addline1:"",
		addline2:"",
		city:"",
		state:"",
		postal_code:"",
		picture:""
	};
	var from_truck_trips = [{
		lat:34.000117,lng:-80.995827
	  }, {
		lat:34.0010274,lng:-81.0172357
	  }, {
	  	lat:34.916088,lng:-81.027557
	  }, {
	  	lat:34.120085,lng:-80.877074
	  }, {
	  	lat:34.08612349999999,lng:-80.90614399999998
	  }];

  	return {
		    savelocal:function(username,password){
		      var records = { usr_name: username, pass: password};
		      window.localStorage.setItem("login", angular.toJson(records));
		    },
		    getlocal: function() {
		        var records = JSON.parse(localStorage.getItem('login')); 
		        return records;
		    },

		    set_device_id: function(id) {
		    	deviceid = id;
		      	currentuser = Parse.User.current();
		      	currentuser.set('deviceid',deviceid);
		      	currentuser.save();
		    },

		    get_device_id_match: function(mobile_number) { 
			    // define the function as a promise function
			    var deferred = $q.defer();
				var user_info_class = Parse.Object.extend("User");
			    var query = new Parse.Query(user_info_class);
			    query.equalTo("username", mobile_number);
			    query.find({
			        success: function(results) {
			        	//console.log(results);
	                	deferred.resolve(results[0].get("deviceid"));    
			        },
			        error: function(object, error) {
			          console.log(" The object was not retrieved successfully.");
			          deferred.reject();
			        }
			     });
			    return deferred.promise;
		    },

		    get_device_id: function() {
		    	return deviceid;
		    },

		    set_login_prof: function(prof) {
		    	loginprof = prof
		    },

		    get_login_prof: function() {
		    	return loginprof;
		    },

		    get_driver_prof_stat: function(){
		      	//console.log(driver_info.approval);
		      	if(driver_info.approval == "Approved"){
		      		driver_prof_stat = 2;
		      	}
		      	else{
		      		driver_prof_stat = 1;
		      	}
		      	return driver_prof_stat;
		    },

		    return_driver_prof_stat: function(){
		    	return driver_prof_stat;
		    },

		    get_truck_reg_stat: function(){
		    	// define the function as a promise function
		    	var deferred = $q.defer();
			      var truck_info_class = Parse.Object.extend("Trucks");
			      var query = new Parse.Query(truck_info_class);
			      query.equalTo("status", "Approved");
			      query.find({
			          success: function(results) {
					      	if(results.length>0){
					      		truck_reg_stat = 2;
					      		deferred.resolve(truck_reg_stat);
					      	}
					      	else{
					      		truck_reg_stat = 1;
					      		deferred.resolve(truck_reg_stat);
					      	}
			            },
			          error: function(error) {
			              console.log(" The object was not retrieved successfully.");
			              deferred.reject();
			          }
			        });
		      	return deferred.promise;
		    },

		    return_truck_reg_stat: function(){
		    	return truck_reg_stat;
		    },


    
    		store_temp_loc: function(from_temp,to_temp, from_latlng_temp , to_latlng_temp) {
    			location = {
    				from_add: from_temp, 
    				to_add: to_temp,
    				from_lat: from_latlng_temp.lat(),
    				from_lng: from_latlng_temp.lng(),
    				to_lat: to_latlng_temp.lat(),
    				to_lng: to_latlng_temp.lng()
    				};
    			//console.log(location);	
      			//locations.push(location);
    			},

		    get_temp_loc: function() {
		    	//console.log(location);
		      	return location;
		    },

    		store_cust_trp: function(newtrip,newtrip1) {
				 cust_trp = {
					sendername:newtrip.sendername,
					sendernumber:newtrip.sendernumber,
					pickdatetime:newtrip.pickdatetime,
					senderaddrline1:newtrip.senderaddrline1,
					senderaddrline2:newtrip.senderaddrline2,
					senderraddr:newtrip.senderraddr,
					receivername:newtrip1.receivername,
					receivernumber:newtrip1.receivernumber,
					droptimedate:newtrip.droptimedate,
					receiveraddrline1:newtrip.receiveraddrline1,
					receiveraddrline2:newtrip.receiveraddrline2,
					receiveraddr:newtrip.receiveraddr
				};

    			//console.log(cust_trp);	
    			},

		    get_cust_trip: function() {
		    	//console.log(cust_trp);
		    	//alert(cust_trp.sendername)
		    	return cust_trp;
		    },

		    store_cust_goods: function(newgoods) {
		    	cust_goods={
		    		goodstype:newgoods.goodstype,
		    		goodsweight:newgoods.goodsweight,
		    		comments:newgoods.comments,
		    		cost:newgoods.cost,
		    		picture:newgoods.picture,
		    		pict_base64:newgoods.pict_base64
		    	};
		    },

		    get_cust_goods: function() {
		    	//console.log(cust_goods);
		    	return cust_goods;
		    },

		    store_driver_trp: function(trip) {
		    	driver_trp = trip;
		    },

		    get_driver_trp: function() {
		    	return driver_trp;
		    },

		    store_driver_truck: function(truck) {
		    	selected_truck_info = truck;
		    },

		    get_driver_truck: function() {
		    	return selected_truck_info;
		    },

		    store_driver_goods: function(newgoods) {
		    	driver_goods = newgoods;
		    },

		    get_driver_goods: function() {
		    	return driver_goods;
		    },

		    get_truck_start_loc: function() {
		      	return from_truck_trips;
		    },

		    store_driver_id: function(id){
		    	driverid = id;
		    },

		    get_driver_id: function(id){
		    	return driverid;
		    },

		    store_driver_mode: function(mode){
		    	drivermode =  mode;
		    },

		    get_driver_mode: function(id){
		    	return drivermode;
		    },

		    store_customer_id: function(id){
		    	customerid = id;
		    },

		    get_customer_id: function(id){
		    	return customerid;
		    },

		    store_truck_id: function(id){
		    	truckid = id;
		    },

		    get_truck_id: function(id){
		    	return truckid;
		    },

		    store_customer_mode: function(mode){
		    	customermode =  mode;
		    },

		    get_customer_mode: function(id){
		    	return customermode;
		    },

		    store_cust_tab_mode: function(mode){
		    	cust_tabmode =  mode;
		    },

		    get_cust_tab_mode: function(id){
		    	return cust_tabmode;
		    },

		    store_driver_tab_mode: function(mode){
		    	driver_tabmode =  mode;
		    },

		    get_driver_tab_mode: function(id){
		    	return driver_tabmode;
		    },


		    submit_cust_trip: function(){
		    	//cust_all_detail=[location,cust_trp,cust_goods];
		    	cust_all_detail.push(location);
		    	cust_all_detail.push(cust_trp);
		    	cust_all_detail.push(cust_goods);
		    	return cust_all_detail;
			    /*var cust_trip_class = Parse.Object.extend("Customer_trip");
			    t1= new cust_trip_class();
			    t1.set("source",cust_trp.senderraddr);
			    t1.set("destination",cust_trp.receiveraddr);
			    var point = new Parse.GeoPoint({latitude: Number(location.from_lat), longitude: Number(location.from_lng)});
			    t1.set("source_coordinates",point);*/
				/*var point = new Parse.GeoPoint({latitude: Number(location.to_lat), longitude: Number(location.to_lng)});
			    t1.set("destination_coordinates",point);*/
			    /*t1.set("start_date_time",cust_trp.pickdatetime);
			    t1.set("end_date_time",cust_trp.droptimedate);
			    
			    t1.set("sender_name",cust_trp.sendername);
			    t1.set("sender_mobile_number",cust_trp.sendernumber.toString());
			    t1.set("sender_complete_address",(cust_trp.senderaddrline1+" "+cust_trp.senderaddrline2+" "+cust_trp.senderraddr));

			    t1.set("receiver_name",cust_trp.receivername);
			    t1.set("receiver_mobile_number",cust_trp.receivernumber.toString());
			    t1.set("receiver_complete_address",(cust_trp.receiveraddrline1+" "+cust_trp.receiveraddrline2+" "+cust_trp.receiveraddr));

			    t1.set("goods_type",cust_goods.goodstype);
			    t1.set("goods_weight",Number(cust_goods.goodsweight));
			    t1.set("cost",Number(cust_goods.cost));
			    t1.set("comments",cust_goods.comments);

			    t1.save(null,{
			    success:function(obj){
				    console.log(obj.id);
				    return true;
				    },
			    error:function(error){
				    console.log(error.message);
				    return false;
				    }
			    });*/

		    },

 			submit_driver_trip: function(){
		    	//cust_all_detail=[location,cust_trp,cust_goods];
		    	driver_all_detail.push(location);
		    	driver_all_detail.push(driver_trp);
		    	driver_all_detail.push(driver_goods);
		    	driver_all_detail.push(selected_truck_info);
		    	return driver_all_detail;
		    },

		    all: function(){
		    	return chats;
		    },

		    get_cust_info: function() {
		    	// define the function as a promise function
		    	var deferred = $q.defer();
		      	currentuser = Parse.User.current();
		      	//console.log("The current logged user is " + currentuser.get('username'));
		      	currentcustomer = currentuser.get('customer');
				var cust_info_class = Parse.Object.extend("Customer");
			    var query = new Parse.Query(cust_info_class);
			    query.get(currentcustomer.id, {
			        success: function(results) {
						if(results.get('picture')){
							pict_temp = results.get('picture').url();
						}
						else{
							pict_temp = "img/profile.jpg";
						}
				      	cust_info= {
							first_name:results.get('first_name'),
							last_name:results.get('last_name'),
							mobile_number:results.get('mobile_number'),
							addline1:results.get('addline1'),
							addline2:results.get('addline2'),
							city:results.get('city'),
							state:results.get('state'),
							postal_code:results.get('postal_code'),
							pend_rating:results.get('pend_rating'),
							picture:pict_temp
						};
						if(!cust_info.picture){
							cust_info={picture:"img/profile.jpg"};
						}
						//console.log(results.get('picture'));
						//alert(cust_info.first_name);
						deferred.resolve(cust_info);
			        },
			        error: function(object, error) {
			          console.log(" The object was not retrieved successfully.");
			          deferred.reject();
			        }
			     });
		      	//console.log("The current logged user is " + currentcustomer.get('first_name'));
		      	return deferred.promise;
		    },

		    get_cust_info_match: function(mobile_number) { 
			    // define the function as a promise function
			    var deferred = $q.defer();
				var cust_info_class = Parse.Object.extend("Customer");
			    var query = new Parse.Query(cust_info_class);
			    query.equalTo("mobile_number", mobile_number);
			    query.find({
			        success: function(results) {
			        	//console.log(results);
	                	deferred.resolve(results[0]);    
			        },
			        error: function(object, error) {
			          console.log(" The object was not retrieved successfully.");
			          deferred.reject();
			        }
			     });
			    return deferred.promise;
		    },

		    override_cust_info: function(results){
						if(results.get('picture')){
							pict_temp = results.get('picture').url();
						}
						else{
							pict_temp = "img/profile.jpg";
						}
				      	cust_info= {
							first_name:results.get('first_name'),
							last_name:results.get('last_name'),
							mobile_number:results.get('mobile_number'),
							addline1:results.get('addline1'),
							addline2:results.get('addline2'),
							city:results.get('city'),
							state:results.get('state'),
							pend_rating:results.get('pend_rating'),
							postal_code:results.get('postal_code'),
							picture:pict_temp
						};
		    },

		    return_cust_info: function(){
		    	return cust_info;
		    },

		    push_cust_srch_list: function(){
		    	return cust_info;
		    },

		    return_cust_srch_list: function(){
		    	return cust_info;
		    },


		    get_driver_info: function() {
		    	// define the function as a promise function
		    	var deferred = $q.defer();
		      	currentuser = Parse.User.current();
		      	//console.log("The current logged user is " + currentuser.get('username'));
		      	currentdriver = currentuser.get('driver');
				var driver_info_class = Parse.Object.extend("Driver");
			    var query = new Parse.Query(driver_info_class);
			    query.get(currentdriver.id, {
			        success: function(results) {
						if(results.get('picture')){
							pict_temp = results.get('picture').url();
						}
						else{
							pict_temp = "img/profile.jpg";
						}
				      	driver_info= {
							first_name:results.get('first_name'),
							last_name:results.get('last_name'),
							mobile_number:results.get('mobile_number'),
							address_line1:results.get('address_line1'),
							address_line2:results.get('address_line2'),
							city:results.get('city'),
							state:results.get('state'),
							postal_code:results.get('postal_code'),
							dob:results.get('dob'),
							driving_license:results.get('driving_license'),
							dl_picture:results.get('dl_picture').url(),
							no_of_trucks:results.get('no_of_trucks'),
							no_of_rating:results.get('no_of_rating'),
							no_of_comment:results.get('no_of_comment'),
							no_of_ship:results.get('no_of_ship'),
							picture:pict_temp,
							approval:results.get("approval")
						};
						//console.log(results.get('picture'));
						//alert(cust_info.first_name);
						deferred.resolve(driver_info);
			        },
			        error: function(object, error) {
			          console.log(" The object was not retrieved successfully.");
			          deferred.reject();
			        }
			     });
		      	//console.log("The current logged user is " + currentcustomer.get('first_name'));
		      	return deferred.promise;
		    },

		    get_driver_info_match: function(mobile_number) { 
			    // define the function as a promise function
			    var deferred = $q.defer();
				var driver_info_class = Parse.Object.extend("Driver");
			    var query = new Parse.Query(driver_info_class);
			    query.equalTo("mobile_number", mobile_number);
			    query.find({
			        success: function(results) {
			        	//console.log(results);
	                	deferred.resolve(results[0]);    
			        },
			        error: function(object, error) {
			          console.log(" The object was not retrieved successfully.");
			          deferred.reject();
			        }
			     });
			    return deferred.promise;
		    },

		    override_driver_info: function(results){
						if(results.get('picture')){
							pict_temp = results.get('picture').url();
						}
						else{
							pict_temp = "img/profile.jpg";
						}
				      	driver_info= {
							first_name:results.get('first_name'),
							last_name:results.get('last_name'),
							mobile_number:results.get('mobile_number'),
							address_line1:results.get('address_line1'),
							address_line2:results.get('address_line2'),
							city:results.get('city'),
							state:results.get('state'),
							postal_code:results.get('postal_code'),
							dob:results.get('dob'),
							driving_license:results.get('driving_license'),
							dl_picture:results.get('dl_picture').url(),
							no_of_trucks:results.get('no_of_trucks'),
							no_of_rating:results.get('no_of_rating'),
							no_of_comment:results.get('no_of_comment'),
							no_of_ship:results.get('no_of_ship'),
							picture:pict_temp,
							approval:results.get("approval")
						};

		    },

		    get_driver_list_admin: function() {
		    	// define the function as a promise function
		    	var deferred = $q.defer();
		    	driver_list_admin = [];
		    	var driver_list_admin_temp=[]
				var driver_info_class = Parse.Object.extend("Driver");
			    var query = new Parse.Query(driver_info_class);
			    query.find({
			        success: function(results) {
			        	for (i=0;i<results.length;i++){
								if(results[i].get('picture')){
									pict_temp = results[i].get('picture').url();
								}
								else{
									pict_temp = "img/profile.jpg";
								}
						      	driver_list_admin_temp= {
									first_name:results[i].get('first_name'),
									last_name:results[i].get('last_name'),
									mobile_number:results[i].get('mobile_number'),
									address_line1:results[i].get('address_line1'),
									address_line2:results[i].get('address_line2'),
									city:results[i].get('city'),
									state:results[i].get('state'),
									postal_code:results[i].get('postal_code'),
									dob:results[i].get('dob'),
									driving_license:results[i].get('driving_license'),
									dl_picture:results[i].get('dl_picture').url(),
									no_of_trucks:results[i].get('no_of_trucks'),
									no_of_rating:results[i].get('no_of_rating'),
									no_of_comment:results[i].get('no_of_comment'),
									no_of_ship:results[i].get('no_of_ship'),
									picture:pict_temp,
									id:i,
									approval:results[i].get("approval")
								};
								driver_list_admin.push(driver_list_admin_temp);
			        	}
						//console.log(driver_list_admin.length);
						//alert(cust_info.first_name);
						deferred.resolve(driver_list_admin);
			        },
			        error: function(object, error) {
			          console.log(" The object was not retrieved successfully.");
			          deferred.reject();
			        }
			     });
		      	//console.log("The current logged user is " + currentcustomer.get('first_name'));
		      	return deferred.promise;
		    },

		    override_driver_info_admin: function(results){
		    	driver_info = results;
		    },

		    return_driver_info: function(){
		    	return driver_info;
		    },

		    get_driver_rating: function(mobile_number) { 
			    // define the function as a promise function
			    var deferred = $q.defer();
				var driver_rating_class = Parse.Object.extend("Rating");
			    var query = new Parse.Query(driver_rating_class);
			    query.equalTo("driver_username", mobile_number);
			    query.find({
			        success: function(results) {
			        	//console.log(results);
			        	driver_rating = results;
	                	deferred.resolve(driver_rating);    
			        },
			        error: function(object, error) {
			          console.log(" The object was not retrieved successfully.");
			          deferred.reject();
			        }
			     });
			    return deferred.promise;
		    },

		    return_driver_rating: function(){
		    	return driver_rating;
		    },

		    get_trucks_info: function() {
		    	// define the function as a promise function
		    	var deferred = $q.defer();
				var driver_info_class = Parse.Object.extend("Trucks");
			    var query = new Parse.Query(driver_info_class);
			    query.find({
			        success: function(results) {
			        	trucks_info=[];
			        	for(i=0;i<results.length;i++){
								if(results[i].get('picture1')){
									pict1_temp = results[i].get('picture1').url();
								}
								else{
									pict1_temp = 'img/truck.ico';
								}
								if(results[i].get('picture2')){
									pict2_temp = results[i].get('picture2').url();
								}
								else{
									pict2_temp = "img/truck.jpeg";
								}
								if(results[i].get('picture3')){
									pict3_temp = results[i].get('picture3').url();
								}
								else{
									pict3_temp = "img/truck.jpeg";
								}
						      	trucks_info_temp= {
						      		id:i,
									registration_number:results[i].get('registration_number'),
									type:results[i].get('type'),
									make:results[i].get('make'),
									model:results[i].get('model'),
									load_height:results[i].get('load_height'),
									load_width:results[i].get('load_width'),
									load_length:results[i].get('load_length'),
									capacity:results[i].get('capacity'),
									//picture1:results[i].get('picture1'),
									picture1:pict1_temp,
									//picture2:results[i].get('picture2'),
									picture2:pict2_temp,
									//picture3:results[i].get('picture3'),
									picture3:pict3_temp,
									status:results[i].get('status'),
									driver_username:results[i].get('driver_username'),
									object_id:results[i].id
								};
								trucks_info.push(trucks_info_temp);
			        		}
						//alert(cust_info.first_name);
						deferred.resolve(trucks_info);
			        },
			        error: function(object, error) {
			          console.log(" The object was not retrieved successfully.");
			          deferred.reject();
			        }
			     });
		      	//console.log("The current logged user is " + currentcustomer.get('first_name'));
		      	return deferred.promise;
		    },

		    get_approved_trucks_info: function(filter) {
		    	// define the function as a promise function
		    	var deferred = $q.defer();
				var driver_info_class = Parse.Object.extend("Trucks");
			    var query = new Parse.Query(driver_info_class);
	          	query.containedIn("status", filter);
			    query.find({
			        success: function(results) {
			        	trucks_info=[];
			        	for(i=0;i<results.length;i++){
								if(results[i].get('picture1')){
									pict1_temp = results[i].get('picture1').url();
								}
								else{
									pict1_temp = 'img/truck.ico';
								}
								if(results[i].get('picture2')){
									pict2_temp = results[i].get('picture2').url();
								}
								else{
									pict2_temp = "img/truck.jpeg";
								}
								if(results[i].get('picture3')){
									pict3_temp = results[i].get('picture3').url();
								}
								else{
									pict3_temp = "img/truck.jpeg";
								}
						      	trucks_info_temp= {
						      		id:i,
									registration_number:results[i].get('registration_number'),
									type:results[i].get('type'),
									make:results[i].get('make'),
									model:results[i].get('model'),
									load_height:results[i].get('load_height'),
									load_width:results[i].get('load_width'),
									load_length:results[i].get('load_length'),
									capacity:results[i].get('capacity'),
									//picture1:results[i].get('picture1'),
									picture1:pict1_temp,
									//picture2:results[i].get('picture2'),
									picture2:pict2_temp,
									//picture3:results[i].get('picture3'),
									picture3:pict3_temp,
									status:results[i].get('status'),
									driver_username:results[i].get('driver_username'),
									object_id:results[i].id
								};
								trucks_info.push(trucks_info_temp);
			        		}
						//alert(cust_info.first_name);
						deferred.resolve(trucks_info);
			        },
			        error: function(object, error) {
			          console.log(" The object was not retrieved successfully.");
			          deferred.reject();
			        }
			     });
		      	//console.log("The current logged user is " + currentcustomer.get('first_name'));
		      	return deferred.promise;
		    },

		    return_trucks_info: function(){
		    	return trucks_info;
		    },

		    return_truck_indiv: function(i){
		    	return trucks_info[i];
		    },

		    get_trucks_info_details: function(truck) {
		    	// define the function as a promise function
		    	var deferred = $q.defer();
				var driver_info_class = Parse.Object.extend("Trucks");
			    var query = new Parse.Query(driver_info_class);
			    query.get(truck.get("truck").id,{
			        success: function(results) {
			        	trucks_info=[];
								if(results.get('picture1')){
									pict1_temp = results.get('picture1').url();
								}
								else{
									pict1_temp = 'img/truck.ico';
								}
								if(results.get('picture2')){
									pict2_temp = results.get('picture2').url();
								}
								else{
									pict2_temp = "img/truck.jpeg";
								}
								if(results.get('picture3')){
									pict3_temp = results.get('picture3').url();
								}
								else{
									pict3_temp = "img/truck.jpeg";
								}
						      	trucks_info_temp= {
						      		id:i,
									registration_number:results.get('registration_number'),
									type:results.get('type'),
									make:results.get('make'),
									model:results.get('model'),
									load_height:results.get('load_height'),
									load_width:results.get('load_width'),
									load_length:results.get('load_length'),
									capacity:results.get('capacity'),
									//picture1:results.get('picture1'),
									picture1:pict1_temp,
									//picture2:results.get('picture2'),
									picture2:pict2_temp,
									//picture3:results.get('picture3'),
									picture3:pict3_temp,
									status:results.get('status'),
									driver_username:results.get('driver_username'),
									object_id:results.id
								};
								trucks_info = trucks_info_temp;
						//alert(cust_info.first_name);
						deferred.resolve(trucks_info);
			        },
			        error: function(object, error) {
			          console.log(" The object was not retrieved successfully.");
			          deferred.reject();
			        }
			     });
		      	//console.log("The current logged user is " + currentcustomer.get('first_name'));
		      	return deferred.promise;
		    },

		    get_cust_trip_list: function(filter,tab) {
		    	// define the function as a promise function
		    	var deferred = $q.defer();
	         	var cust_trip_table= new Parse.Object.extend("Customer_trip_list");
	          	query =  new Parse.Query(cust_trip_table);
	          	query.containedIn("status", filter);
	          	query.find({
	              	success: function(results) {
	                	//console.log("Successfully retrieved " + results.length + " trips.");
	                	if(tab == 1){
	                		cust_trip_list_inprog = results;	
	                	}
	                	else if(tab == 2){
	                		cust_trip_list_past = results;		
	                	}
	                	else if(tab == 3){
	                		cust_trip_list_upcmg = results;		
	                	}
	                	
						deferred.resolve(results); 
	                },
	              	error: function(error) {
	                	alert("Error: " + error.code + " " + error.message);
	                	deferred.reject();
	              	}
	            });
	            return deferred.promise;
		    },

		    get_cust_trip_list_match: function(results) {
		    	// define the function as a promise function
		    	var deferred = $q.defer();
		    	var Comment = Parse.Object.extend("Customer_trip");
				var pointer_class = Parse.Object.extend("Customer_trip");
				var pointer = new pointer_class();
				pointer.id = results.id;
	         	var cust_trip_table= new Parse.Object.extend("Customer_trip_list");
	          	query =  new Parse.Query(cust_trip_table);
	          	//console.log(results.id);
	          	query.equalTo("customer_trip", pointer);
	          	query.find({
	              	success: function(results) {
	                	//console.log("Successfully retrieved " + results.length + " trips.");
	                	//console.log(results[0].get("customer_username"));
						deferred.resolve(results[0]); 
	                },
	              	error: function(error) {
	                	alert("Error: " + error.code + " " + error.message);
	                	deferred.reject();
	              	}
	            });
	            return deferred.promise;
		    },

		    get_driver_trip_list: function(filter,tab) {
		    	// define the function as a promise function
		    	var deferred = $q.defer();
	         	var driver_trip_table= new Parse.Object.extend("Driver_trip_list");
	          	query =  new Parse.Query(driver_trip_table);
	          	query.containedIn("status", filter);
	          	query.find({
	              	success: function(results) {
	                	//console.log("Successfully retrieved " + results.length + " trips.");
	                	if(tab == 1){
	                		driver_trip_list_inprog = results;	
	                	}
	                	else if(tab == 2){
	                		driver_trip_list_past = results;		
	                	}
	                	else if(tab == 3){
	                		driver_trip_list_upcmg = results;		
	                	}
	                	
						deferred.resolve(results); 
	                },
	              	error: function(error) {
	                	alert("Error: " + error.code + " " + error.message);
	                	deferred.reject();
	              	}
	            });
	            return deferred.promise;
		    },

		    get_driver_trip_list_match: function(results) {
		    	// define the function as a promise function
		    	var deferred = $q.defer();
				var pointer_class = Parse.Object.extend("Driver_trip");
				var pointer = new pointer_class();
				pointer.id = results.id;
	         	var driver_trip_table= new Parse.Object.extend("Driver_trip_list");
	          	query =  new Parse.Query(driver_trip_table);
	          	//console.log(results.id);
	          	query.equalTo("driver_trip", pointer);
	          	query.find({
	              	success: function(results) {
	                	//console.log("Successfully retrieved " + results.length + " trips.");
	                	//console.log(results[0].get("driver_username"));
						deferred.resolve(results[0]); 
	                },
	              	error: function(error) {
	                	alert("Error: " + error.code + " " + error.message);
	                	deferred.reject();
	              	}
	            });
	            return deferred.promise;
		    },

		    get_driver_trip_list_link: function(results) {
		    	// define the function as a promise function
		    	var deferred = $q.defer();
				var pointer_class = Parse.Object.extend("Customer_trip");
				var pointer = new pointer_class();
				pointer.id = results.id;
	         	var driver_trip_table= new Parse.Object.extend("Driver_trip_list");
	          	query =  new Parse.Query(driver_trip_table);
	          	//console.log(results.id);
	          	query.equalTo("customer_trip", pointer);
	          	query.find({
	              	success: function(results) {
	                	//console.log("Successfully retrieved " + results.length + " trips.");
	                	//console.log(results[0].get("driver_username"));
						deferred.resolve(results); 
	                },
	              	error: function(error) {
	                	alert("Error: " + error.code + " " + error.message);
	                	deferred.reject();
	              	}
	            });
	            return deferred.promise;
		    },


		    clear_cust_trip_var: function(){
		    	// define the function as a promise function
		    	var deferred = $q.defer();
		    	//console.log("customer variable cleared!");
  				cust_trip_info_inprog=[];
  				cust_trip_info_past=[];
  				cust_trip_info_upcmg=[];
  				cust_trip_list_inprog=[];
  				cust_trip_list_past=[];
  				cust_trip_list_upcmg=[];
  				deferred.resolve();
  				return deferred.promise;
		    },

		    clear_driver_trip_var: function(){
		    	// define the function as a promise function
		    	var deferred = $q.defer();
  				driver_trip_info_inprog=[];
  				driver_trip_info_past=[];
  				driver_trip_info_upcmg=[];
  				driver_trip_list_inprog=[];
  				driver_trip_list_past=[];
  				driver_trip_list_upcmg=[];
  				deferred.resolve();
  				return deferred.promise;
		    },

		    get_cust_trip_info: function(results,tab) { 
			    // define the function as a promise function
			    var deferred = $q.defer();
				var cust_trp = Parse.Object.extend("Customer_trip");
			    var query = new Parse.Query(cust_trp);
			    query.get(results.get("customer_trip").id, {
			        success: function(results) {
	                	if(tab == 1){
	                		cust_trip_info_inprog.push(results);
	                		deferred.resolve(cust_trip_info_inprog);
	                	}
	                	else if(tab == 2){
	                		cust_trip_info_past.push(results);		
	                		deferred.resolve(cust_trip_info_past);
	                	}
	                	else if(tab == 3){
	                		cust_trip_info_upcmg.push(results);	
	                		deferred.resolve(cust_trip_info_upcmg);
	                	}
			            //console.log(cust_trip_info.length,first_call);
			            //deferred.resolve(cust_trip_info);      
			        },
			        error: function(object, error) {
			          console.log(" The object was not retrieved successfully.");
			          deferred.reject();
			        }
			     });
			    return deferred.promise;
		    },

		    get_cust_trip_match: function(latNEValue,lngtNEValue,latSWValue,lngtSWValue,filter) { 
			    // define the function as a promise function
			    var deferred = $q.defer();
			    var southwestOfSF = new Parse.GeoPoint(latSWValue, lngtSWValue);
				var northeastOfSF = new Parse.GeoPoint(latNEValue, lngtNEValue);
				var cust_trp = Parse.Object.extend("Customer_trip");
			    var query = new Parse.Query(cust_trp);
			    //query.equalTo("objectId", results.get("customer_trip").id);
			    query.withinGeoBox("source_coordinates", southwestOfSF, northeastOfSF);
			    query.containedIn("status", filter);
			    query.find({
			    //query.get(results.get("customer_trip").id,{
			        success: function(results) {
			        	cust_trip_info = results
	                	deferred.resolve(cust_trip_info);
			        },
			        error: function(object, error) {
			          console.log(" The object was not retrieved successfully.");
			          deferred.reject();
			        }
			     });
			    return deferred.promise;
		    },

		    get_cust_trip_refine: function(filter,mile) { 
			    // define the function as a promise function
			    var deferred = $q.defer();
				var point = new Parse.GeoPoint({latitude: location.from_lat, longitude: location.from_lng});
				var cust_trp = Parse.Object.extend("Customer_trip");
			    var query = new Parse.Query(cust_trp);
			    query.withinMiles("source_coordinates", point, mile);
			    query.containedIn("status", filter);
			    query.find({
			    //query.get(results.get("customer_trip").id,{
			        success: function(results) {
			        	cust_trip_info = results
	                	deferred.resolve(cust_trip_info);
			        },
			        error: function(object, error) {
			          console.log(" The object was not retrieved successfully.");
			          deferred.reject();
			        }
			     });
			    return deferred.promise;
		    },

		    clear_cust_trip_match_var: function(){
  				cust_trip_info=[];
  				cust_trip_list_inprog=[];
  				cust_trip_list_past=[];
  				cust_trip_list_upcmg=[];
		    },

		    clear_driver_trip_match_var: function(){
  				driver_trip_info=[];
  				driver_trip_list_inprog=[];
  				driver_trip_list_past=[];
  				driver_trip_list_upcmg=[];
		    },

		    get_driver_trip_info: function(results,tab) { 
			    // define the function as a promise function
			    var deferred = $q.defer();
				var driver_trp = Parse.Object.extend("Driver_trip");
			    var query = new Parse.Query(driver_trp);
			    query.get(results.get("driver_trip").id, {
			        success: function(results) {
	                	if(tab == 1){
	                		driver_trip_info_inprog.push(results);
	                		deferred.resolve(driver_trip_info_inprog);
	                	}
	                	else if(tab == 2){
	                		driver_trip_info_past.push(results);		
	                		deferred.resolve(driver_trip_info_past);
	                	}
	                	else if(tab == 3){
	                		driver_trip_info_upcmg.push(results);	
	                		deferred.resolve(driver_trip_info_upcmg);
	                	}
			            //console.log(cust_trip_info.length,first_call);
			            //deferred.resolve(cust_trip_info);      
			        },
			        error: function(object, error) {
			          console.log(" The object was not retrieved successfully.");
			          deferred.reject();
			        }
			     });
			    return deferred.promise;
		    },

		    get_driver_trip_match: function(latNEValue,lngtNEValue,latSWValue,lngtSWValue,filter) { 
			    // define the function as a promise function
			    var deferred = $q.defer();
			    var southwestOfSF = new Parse.GeoPoint(latSWValue, lngtSWValue);
				var northeastOfSF = new Parse.GeoPoint(latNEValue, lngtNEValue);
				var driver_trp = Parse.Object.extend("Driver_trip");
			    var query = new Parse.Query(driver_trp);
			    //query.equalTo("objectId", results.get("driver_trip").id);
			    query.withinGeoBox("source_coordinates", southwestOfSF, northeastOfSF);
			    query.containedIn("status", filter);
			    query.find({
			    //query.get(results.get("driver_trip").id,{
			        success: function(results) {
			        	driver_trip_info = results
	                	deferred.resolve(driver_trip_info);
			        },
			        error: function(object, error) {
			          console.log(" The object was not retrieved successfully.");
			          deferred.reject();
			        }
			     });
			    return deferred.promise;
		    },

		    get_driver_trip_refine: function(filter,mile) { 
			    // define the function as a promise function
			    var deferred = $q.defer();
				var point = new Parse.GeoPoint({latitude: location.from_lat, longitude: location.from_lng});
				var driver_trp = Parse.Object.extend("Driver_trip");
			    var query = new Parse.Query(driver_trp);
			    query.withinMiles("source_coordinates", point, mile);
			    query.containedIn("status", filter);
			    query.find({
			    //query.get(results.get("driver_trip").id,{
			        success: function(results) {
			        	driver_trip_info = results
	                	deferred.resolve(driver_trip_info);
			        },
			        error: function(object, error) {
			          console.log(" The object was not retrieved successfully.");
			          deferred.reject();
			        }
			     });
			    return deferred.promise;
		    },

		    get_cust_trip_gps_refine: function(results,mile) { 
			    // define the function as a promise function
			    var deferred = $q.defer();
				var point = new Parse.GeoPoint({latitude: location.to_lat, longitude: location.to_lng});
				var cust_trp_gps = Parse.Object.extend("Customer_trip_gps");
			    var query = new Parse.Query(cust_trp_gps);
			    //query.withinKilometers("destination_coordinates", point, mile);
			    query.get(results.get("customer_trip_gps").id, {
			        success: function(results) {
			            cust_trip_gps = results;
			            //console.log(cust_trip_gps.length);
			            deferred.resolve(cust_trip_gps);      
			        },
			        error: function(object, error) {
			          console.log(" The object was not retrieved successfully.");
			          deferred.reject();
			        }
			     });
			    return deferred.promise;
		    },

		    get_cust_trip_gps: function(results) { 
			    // define the function as a promise function
			    var deferred = $q.defer();
				var cust_trp_gps = Parse.Object.extend("Customer_trip_gps");
			    var query = new Parse.Query(cust_trp_gps);
			    query.get(results.get("customer_trip_gps").id, {
			        success: function(results) {
			            cust_trip_gps = results;
			            //console.log(cust_trip_gps.length);
			            deferred.resolve(cust_trip_gps);      
			        },
			        error: function(object, error) {
			          console.log(" The object was not retrieved successfully.");
			          deferred.reject();
			        }
			     });
			    return deferred.promise;
		    },

		    get_driver_trip_gps_refine: function(results,mile) { 
			    // define the function as a promise function
			    var deferred = $q.defer();
				var point = new Parse.GeoPoint({latitude: location.to_lat, longitude: location.to_lng});
				var driver_trp_gps = Parse.Object.extend("Driver_trip_gps");
			    var query = new Parse.Query(driver_trp_gps);
			    //query.withinKilometers("destination_coordinates", point, mile);
			    query.get(results.get("driver_trip_gps").id, {
			        success: function(results) {
			            driver_trip_gps = results;
			            //console.log(driver_trip_gps.length);
			            deferred.resolve(driver_trip_gps);      
			        },
			        error: function(object, error) {
			          console.log(" The object was not retrieved successfully.");
			          deferred.reject();
			        }
			     });
			    return deferred.promise;
		    },

		    get_driver_trip_gps: function(results) { 
			    // define the function as a promise function
			    var deferred = $q.defer();
				var driver_trp_gps = Parse.Object.extend("Driver_trip_gps");
			    var query = new Parse.Query(driver_trp_gps);
			    query.get(results.get("driver_trip_gps").id, {
			        success: function(results) {
			            driver_trip_gps = results;
			            //console.log(driver_trip_gps.length);
			            deferred.resolve(driver_trip_gps);      
			        },
			        error: function(object, error) {
			          console.log(" The object was not retrieved successfully.");
			          deferred.reject();
			        }
			     });
			    return deferred.promise;
		    },

		    override_cust_trip_list: function(results) {
				cust_trip_list_upcmg = results;
	    	},

		    get_cust_trip_list_detail: function(i) {
		    	// define the function as a promise function
			    var deferred = $q.defer();
			    //console.log(cust_tabmode);
	            if(cust_tabmode == 1){
	                	deferred.resolve(cust_trip_list_inprog[i]);
	                }
	            else if(cust_tabmode == 2){
	               		deferred.resolve(cust_trip_list_past[i]);
	               	}
	            else if(cust_tabmode == 3){
	               		deferred.resolve(cust_trip_list_upcmg[i]);
	               	}
			    //deferred.resolve(cust_trip_list[i]);
			    return deferred.promise;
	    	},

		    override_driver_trip_list: function(results) {
				driver_trip_list_upcmg = results;
	    	},

		    get_driver_trip_list_detail: function(i) {
		    	// define the function as a promise function
			    var deferred = $q.defer();
	            if(driver_tabmode == 1){
	                	deferred.resolve(driver_trip_list_inprog[i]);
	                }
	            else if(driver_tabmode == 2){
	               		deferred.resolve(driver_trip_list_past[i]);
	               	}
	            else if(driver_tabmode == 3){
	               		deferred.resolve(driver_trip_list_upcmg[i]);
	               	}
			    //deferred.resolve(cust_trip_list[i]);
			    return deferred.promise;
	    	},

		    override_cust_trip_info: function(results) {
				cust_trip_info_upcmg = results;
	    	},

		    get_cust_trip_info_detail: function(i) {
		    	// define the function as a promise function
			    var deferred = $q.defer();
	            if(cust_tabmode == 1){
	                	deferred.resolve(cust_trip_info_inprog[i]);
	                }
	            else if(cust_tabmode == 2){
	               		deferred.resolve(cust_trip_info_past[i]);
	               	}
	            else if(cust_tabmode == 3){
	               		deferred.resolve(cust_trip_info_upcmg[i]);
	               	}
			    //deferred.resolve(cust_trip_info[i]);
			    return deferred.promise;
	    	},

		    override_driver_trip_info: function(results) {
				driver_trip_info_upcmg = results;
	    	},

		    get_driver_trip_info_detail: function(i) {
		    	// define the function as a promise function
			    var deferred = $q.defer();
	            if(driver_tabmode == 1){
	                	deferred.resolve(driver_trip_info_inprog[i]);
	                }
	            else if(driver_tabmode == 2){
	               		deferred.resolve(driver_trip_info_past[i]);
	               	}
	            else if(driver_tabmode == 3){
	               		deferred.resolve(driver_trip_info_upcmg[i]);
	               	}
			    //deferred.resolve(cust_trip_info[i]);
			    return deferred.promise;
	    	},

			test_pusf_notif: function(deviceid,msg,title) {

			      // Define relevant info
			      var jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIyZjI3MDc3Yy00MDYxLTRlOWMtOGI0ZC0zNmE3OTY1ZDUzNTQifQ.zUg4IxvJoVVQLK_LxRLn3iaMcvdE-LZECymyCUC3VOY';
			      var tokens = [];
			      var profile = 'sendurr';

			      // Build the request object
			      tokens.push(deviceid);
			      var req = {
			        method: 'POST',
			        url: 'https://api.ionic.io/push/notifications',
			        headers: {
			          'Content-Type': 'application/json',
			          'Authorization': 'Bearer ' + jwt
			        },
			        data: {
			          "tokens": tokens,
			          "profile": profile,
			          "notification": {
			            //"title": "Hi",
			            //"message": "Hello world!",
			            "android": {
			              //"title": "Hey",
			              "message": msg,
			              //"image": "https://images-na.ssl-images-amazon.com/images/I/71dttusOQyL.png"
			               "image": "http://files.softicons.com/download/internet-icons/social-trucks-icons-by-cutelittlefactory.com/png/128/Social-Truck_stumblupon.png"
			            },
			            "ios": {
			              //"title": "Howdy",
			              "message": msg
			            }
			          }
			        }
			      };
			      return req;
			      // Make the API call
			      /*$http(req).success(function(resp){
			        // Handle success
			        //console.log("Ionic Push: Push success", resp);
			        console.log("Push notification successfully");
			        deferred.resolve();
			      }).error(function(error){
			        // Handle error 
			        //console.log("Ionic Push: Push error", error);
			        console.log("Push notification failed");
			        deferred.reject();
			      });*/

			   }



  	};
}]);
