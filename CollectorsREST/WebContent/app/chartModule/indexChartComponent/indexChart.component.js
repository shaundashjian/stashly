angular
		.module("appModule")
		.component(
				'indexChart',
				{
					templateUrl : 'app/chartModule/indexChartComponent/indexChart.component.html',
					controller : function($scope, priceService, $routeParams, $scope) {
						var vm = this;

						var dates = [];
						var totalValue = [];
						vm.prices = [];

						var getPrices = function() {

										vm.prices.sort(function compareNumbers(a,b) {
											return (new Date(a.date) - new Date(b.date));
										})
										
										var tempDates = [];

										vm.prices.forEach(function(v, i, a) {
																						
											if(!tempDates.includes(v.date)){
												tempDates.push(v.date);
												totalValue.push(parseFloat(v.itemPrice));
											} else {
												var ndx = tempDates.indexOf(v.date);
												var num = parseFloat(totalValue[ndx]); 
												num += parseFloat(v.itemPrice);
												num = num.toFixed(2);
												totalValue[ndx] = num;
											}

										})

																				
										var options = {
											month : "short",
											day : "numeric",
											hour : "2-digit",
											minute : "2-digit"
										};
										
										tempDates.forEach(function(v,i,a){
											dates.push(new Date(v).toLocaleTimeString("en-US", options));
										})

						}
						
						var createGraph = function() {
							$scope.labels = dates;
							$scope.data = [totalValue];
							$scope.datasetOverride = [ {
								yAxisID : 'y-axis-1'
							}, {
								yAxisID : 'y-axis-2'
							} ];
							$scope.options = {
									scales : {
										yAxes : [ {
											id : 'y-axis-1',
											type : 'linear',
											display : true,
											position : 'left',
											labelString : "Value in US Dollars ($)"
										} ]
									},
							};
						}
						var reload = function(){
							getPrices();
							createGraph();
						};
						
						reload();
						
						$scope.$on('allItemsGotUpdated', function(e,msg){

							dates = [];
							totalValue = [];
							vm.prices = [];
							msg.filteredItems.forEach(function(v){
								v.prices.forEach(function(p){
									vm.prices.push(p)
								})
							});
							reload();
						});
						
						
						

					},
					controllerAs : 'vm'
				});
