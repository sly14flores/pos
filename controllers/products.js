var app = angular.module('products', ['bootstrap-modal']);

app.factory('appService',function($http,$timeout,bootstrapModal) {
	
	function appService() {
		
		var self = this;
		
		// self.required = ['product_date','product_brand','product_description','product_wsp','product_srp','product_minimum_stock'];
		self.required = ['product_date','product_brand','product_description'];
		
		self.listProduct = function(scope) {

			$http({
			  method: 'POST',
			  url: 'controllers/products.php?r=list'
			}).then(function mySucces(response) {
				
				angular.copy(response.data,scope.products);
				
			}, function myError(response) {
				 
			  // error
				
			});
			
			$timeout(function() {
					
				var datatable = $('.datatable').DataTable({
				  "ordering": false,
				  "dom": '<"top"fl<"clear">>rt<"bottom"ip<"clear">>',
				  "oLanguage": {
					"sSearch": "",
					"sLengthMenu": "_MENU_"
				  },
				  "initComplete": function initComplete(settings, json) {
					$('div.dataTables_filter input').attr('placeholder', 'Search...');
					// $(".dataTables_wrapper select").select2({
					//   minimumResultsForSearch: Infinity
					// });
				  }
				});
			},500);
		
		}
		
		self.newProduct = function(scope) {

			scope.views.alerts.product = {
				show: false,
				message: ''
			};
			
			$http.get('views/product.html').then(function(response) {
				bootstrapModal.box(scope,'Add New Product',response.data,self.saveProduct);
				angular.copy(scope.productModel,scope.product);
				$timeout(function() { $('#product').removeClass('__loading'); },1000);
			});
			
		};
		
		self.editProduct = function(scope,product) {

			$http.get('views/product.html').then(function(response) {
				bootstrapModal.box(scope,'Edit Product Info',response.data,self.saveProduct);
			});			
			
			$http({
			  method: 'POST',
			  url: 'controllers/products.php?r=edit',
			  data: {product_id: product.product_id}
			}).then(function mySucces(response) {						
				
				angular.copy(response.data,scope.product);
				scope.product.product_date = new Date(response.data.product_date);
				$timeout(function() { $('#product').removeClass('__loading'); },1000);				
				
			}, function myError(response) {
				 
			  // error
				
			});			
			
		};
		
		self.saveProduct = function(scope) {

			if (scope.formHolder.product.$invalid) {
				
				scope.$apply(function() {
					scope.views.alerts.product = {
						show: true,
						message: 'Please fill up required fields'
					};
				});
				
				angular.forEach(self.required, function(item,i) {
					if ((scope.product[item] == '') || (scope.product[item] == undefined)) {
						scope.$apply(function() {
							scope.formHolder.product[item].$invalid = true;
							scope.formHolder.product[item].$touched = true;
						});						
					}
				});
				
				return false;
				
			};			
			
			scope.$apply(function() {	
				scope.views.alerts.product = {
					show: false,
					message: ''
				};
			});
			
			$http({
			  method: 'POST',
			  url: 'controllers/products.php?r=save',
			  data: scope.product
			}).then(function mySucces(response) {
			
				$('.datatable').DataTable().destroy();			
				self.listProduct(scope);
				
			}, function myError(response) {
				 
			  // error
				
			});
			
			return true;
			
		};
		
		self.delProduct = function(scope,product) {
			
			var onOk = function(scope) {
				
				$http({
				  method: 'POST',
				  url: 'controllers/products.php?r=delete',
				  data: {product_id: [product.product_id]}
				}).then(function mySucces(response) {
				
					$('.datatable').DataTable().destroy();			
					self.listProduct(scope);
					
				}, function myError(response) {
					 
				  // error
					
				});				
				
			};
			
			bootstrapModal.confirm(scope,'Confirmation','Are you sure you want to delete thi product?',onOk,function() {});			
			
		};

	}
	
	return new appService();
	
});

app.controller('productsCtrl',function($scope,appService,bootstrapModal) {
	
	$scope.views = {};
	$scope.views.alerts = {};
	$scope.views.product = {show: false, message: ''};
	$scope.formHolder = {};
	
	$scope.productModel = {
		product_id: 0,
		product_date: new Date(),
		product_supplier: '',
		product_brand: '',
		product_description: '',
		product_wsp: 0,
		product_srp: 0,
		product_minimum_stock: 0
	}	
	
	$scope.product = {};
	$scope.products = [];
	
	$scope.appService = appService;
	var appServiceL = appService;
	
	appServiceL.listProduct($scope);
	
});