sampleApp.controller('OrdersController', function($scope,$filter,sharedOrders,ngTableParams,$sce,$http) {


	var uid = 1;		//Increment ID field each time
	
	
	$scope.header = 'Add New Order';	// SHOW header

    $scope.update_order = false;		// Hide Update Button
	$scope.add_order = true;			// Show Submit Button        
	
	/*
	 * Sample Data
	$scope.orders = [{
					   'id':0, 
						'name': 'Viral', 
						'email':'hello@gmail.com', 
						'phone': '123-2343-44'
			},
			{
					   'id':1, 
						'name': 'chitresh', 
						'email':'hello@gmail.com', 
						'phone': '123-2343-44'
		}];*/
	
    sharedOrders.getOrders().then(function(orders) {
		$scope.orders = orders;
		//var removeTemplate = '<input type="button" value="remove" ng-click="removeRow($index)" />';
		
		// Pagination Script
		var data = $scope.orders; 
		$scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            },{
            	$scope: null, // set by ngTable controller
            	$loading: true,
            	data: null, //allows data to be set when table is initialized
	            total: data.length,
            	defaultSort: 'desc',
            	filterDelay: 750,
            	counts: [], //counts: [10,25,50]
            	getGroups: this.getGroups,
                getData: function($defer, params) {
                    $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
			}
		);
	
	});

// --------------- Grid Data And Pagination --------------------------------
	
	 $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [15, 20, 40],
        pageSize: 7,
        currentPage: 1
    };  
    $scope.setPagingData = function(data, page, pageSize){	
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);

        $scope.myData = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(function () {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get('http://192.168.0.75/savedata/saveorder.php?action=get_orders').success(function (largeLoad) {		
                    data = largeLoad.filter(function(item) {
                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                    $scope.setPagingData(data,page,pageSize);
                });            
            } else {
                $http.get('http://192.168.0.75/savedata/saveorder.php?action=get_orders').success(function (largeLoad) {
                    $scope.setPagingData(largeLoad,page,pageSize);
                });
            }
        }, 100);
    };
	
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
	
    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
  

	  $scope.gridOptions = {
	    data: 'myData',
	    enablePaging: true,
	    showFooter: true,
		totalServerItems:'totalServerItems',	 
	    pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,

	    //enablePinning: true,
	    //	rowHeight: 30,
	    enableCellSelection: true,		// selection for column
	    enableRowSelection: false,		// selection for row
	    enableCellEdit: true,			// Edit like excel sheet
	    enableCellEditOnFocus: true,	// Cell edit on 1 click
		//selectedItems: $scope.selections,
	    columnDefs: [
		    			{ field: "id", width: 120, pinned: true },
	                    { field: "name", width: 180 },
	                    { field: "email", width: 270 },
	                    { field: "phone", width: 180},
	                    { displayName: 'Actions', 
	                    	cellTemplate: '<button type="button" class="btn btn-default" ng-click="update(row.entity)" >Update</button> ',
	                    	enableCellEdit: false}
                    ]

	  };
    
// --------------- Grid Data And Pagination --------------------------------


    
    $scope.$on('handleSharedOrders', function(events, orders) {
        $scope.orders = orders;
	});
    
    // Reset Button
    $scope.reset = function(orderData){
    	$scope.update_order = false;		// Hide Update Button
		$scope.add_order = true;			// Show Submit Button
		$scope.neworder = {};
    }
    
    // CREATE Action
	$scope.addNewOrder = function(orderData){
		$params = $.param({
						"name": orderData.name,
						"email": orderData.email,
						"phone": orderData.phone
					})
		sharedOrders.saveOrders($params);
		/*
		if($scope.neworder.id == null) {
					//if this is new contact, add it in contacts array
					$scope.neworder.id = uid++;
					$scope.orders.push($scope.neworder);
				} else {
					for(i in $scope.orders) {
						if($scope.orders[i].id == $scope.neworder.id) {
						$scope.orders[i] = $scope.neworder;
												  }
					}  
				}
				$scope.neworder = {};*/
	};
	
	// EDIT Action
	$scope.edit = function(id) {
        $scope.update_order = true;
        $scope.add_order = false;
        
        for(i in $scope.orders) {
            if($scope.orders[i].id == id) {
                $scope.neworder = angular.copy($scope.orders[i]);
            }
		}
        
	};
	
	// UPDATE Action
	$scope.update = function(orderData) {
		console.log("Update Action:");
		console.log(orderData);
    	$params = $.param({
    				"id": orderData.id,
					"name": orderData.name,
					"email": orderData.email,
					"phone": orderData.phone
		})
		sharedOrders.updateOrders($params);    
		$scope.reset();   
	};
	
	// DELETE Action
	$scope.delete = function(id) {
        $params = $.param({"id": id,})
		sharedOrders.deleteOrder($params);
        //search contact with given id and delete it
        /*
        for(i in $scope.orders) {
                    if($scope.orders[i].id == id) {
                        $scope.orders.splice(i,1);
                        $scope.neworder = {};
                    }
                }*/
        
   };
   
 	//$scope.filename = "order";
 	//$scope.getHeader = function() {return "['Field Id','Field Name','Field Email','FieldPhone']" };
 
 
});