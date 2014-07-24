//Define an angular module for our app
var sampleApp = angular.module('sampleApp', ['ngTouch','ngTable','ngTableExport','ngSanitize','ngCsv','ngRoute','ngCookies','ngAnimate','ngMessages','ngGrid']);

//Define Routing for app
//Uri /AddNewOrder -> template AddOrder.html and Controller AddOrderController
//Uri /ShowOrders -> template ShowOrders.html and Controller AddOrderController
sampleApp.config(['$routeProvider',
  function($routeProvider) {
	$routeProvider.
	when('/AddNewOrder', {
		templateUrl: 'templates/add_order.html',
		controller: 'OrdersController'
	}).
	when('/ShowOrders', {
		templateUrl: 'templates/show_order.html',
		controller: 'ShowOrdersController'
	}).
    otherwise({
		redirectTo: '/AddNewOrder'
	});
  }
]);


sampleApp.factory('sharedOrders', ['$http', '$rootScope', function($http, $rootScope) {

  var orders_factory = {};
  var base_url = 'http://192.168.0.75/savedata/saveorder.php';
  
  	orders_factory.getOrders= function() {
		return $http.get(base_url + '?action=get_orders').then(function(response) {
	        // turn on if reponse DATA is not JSON
	        //orders = $.parseJSON(JSON.stringify(response.data));
	        orders = response.data;
	        $rootScope.$broadcast('handleSharedOrders',orders);
	        return orders;
		})
    },
	orders_factory.updateOrders = function($params) {
		return $http({
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			url: base_url + '?action=edit',
			method: "POST",
			data: $params,
		})
		.success(function(addData) {
			orders = addData;
			orders_factory.getOrders();		// Reload List View
			//$rootScope.$broadcast('handleSharedOrders',orders);
		});
	},
    orders_factory.saveOrders = function($params) {
		return $http({
	        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        	url: base_url + '?action=save',
        	method: "POST",
        	data: $params,
		})
		.success(function(addData) {
			orders = addData;
			orders_factory.getOrders();		// Reload List View
			//$rootScope.$broadcast('handleSharedOrders',orders);
		});
	},
	orders_factory.deleteOrder = function($params) {
		return $http({
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			url: base_url + '?action=delete_order',
			method: "POST",
			data: $params,
		})
		.success(function(addData) {
			orders = addData;
			orders_factory.getOrders();		// Reload List View
			//$rootScope.$broadcast('handleSharedOrders',orders);
		});
	};
  
  return orders_factory;
  }
]);
	
	// TURN ON toArray Filter IF getData is not in JSON format
	// Custom Filter -- Converting object to Array KEY|VALUE format
	/*
	sampleApp.filter('toArray', function() { return function(obj) {
			if (!(obj instanceof Object)) return obj;
			return _.map(obj, function(val, key) {
				return Object.defineProperty(val, '$key', {__proto__: null, value: key});
			});
		}});*/


