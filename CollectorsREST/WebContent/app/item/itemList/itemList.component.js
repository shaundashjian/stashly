angular.module('item')
.component('itemList', {
	templateUrl: 'app/item/itemList/itemList.component.html',
	controller: function(itemService, priceService, $location, $filter){
		var vm = this;

		vm.buttonLoad = false;
		
		vm.items = [];

		vm.selected = {name: "all "};
		
		vm.clearUpdateStatus = function(){
			vm.items.forEach(function(item){
				item.updated = false;
			})
		}
		
		vm.reload = function(){
			itemService.index()
			.then(function(response){
				vm.items = response.data;
				vm.items.forEach((item) => {
					itemService.getInflation(item)
						.then(function(res){
							vm.items[vm.items.indexOf(item)].inflationPrice = res.data.substring(4,res.data.length-2);
							
						})
				})
				vm.clearUpdateStatus();
			
			
			})
		}
		
		vm.reload();
		// injected filters
		var categorySort = $filter('categorySort');
		var searchByName = $filter('searchByName');
		
		vm.category = function(){
			itemService.getCategories()
			.then(function(category){
				vm.categories = category.data;
				vm.categories.unshift({name: "all"})
				vm.selected = vm.categories[0];
				})
			}
		vm.category();

		vm.orderBy = null;

		vm.reverse = false;
		
		vm.changeOrderBy = function (columnName){
			if (vm.orderBy === columnName) {
                if (!vm.reverse) {
                    vm.reverse = true;
                } else {
                    vm.reverse = false;
                    vm.orderBy = null;
                }
            } else {
                vm.orderBy = columnName;
            }
		}
		
		vm.currentTotalValue = function (){
			var total = 0;			
			var items = searchByName(vm.items, vm.keywords);
			items = categorySort(items, vm.selected.name);
			items.forEach(function(item){
			if(!item.retired)
				total += parseFloat(item.currentValue);
			})			
			return total;
		}
		

		
		vm.totalPurchasePrice = function (){
			var total = 0;
			var items = searchByName(vm.items, vm.keywords);
			items = categorySort(items, vm.selected.name);
			items.forEach(function(item){
				if (!item.retired){
					total += item.purchasePrice;
				}

			})
			return total;
		}

		vm.updateCurrentValues = function(){

			vm.buttonLoad = true;


			vm.items.forEach(function(item){
				itemService.updateCurrentValue(item.name)
				.then(function(response){
					item.currentValue  = response.data.findItemsByKeywordsResponse[0].searchResult[0].item[0].sellingStatus[0].currentPrice[0].__value__;
					
					item.price = {
							itemPrice: item.currentValue
					};
					
					itemService.update(item);
					priceService.create(item);

					vm.buttonLoad = false;

					item.updated = true;
				})

			})
		}

		vm.showItem = function(item){
			$location.path('/itemShow/'+item.id);
		}
		
		vm.updated = function(item){
			if (item.updated){
				return 'updated';
			} else {
				return 'not-updated';
			}
		}

	},

	controllerAs: 'vm',
	
	bindings:{
		keywords: '<'
	}

})

