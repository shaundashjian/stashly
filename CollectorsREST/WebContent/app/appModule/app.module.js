angular.module("appModule", ['nav','item','ngRoute', 'authModule'])
.config(function($routeProvider){
	$routeProvider
	
	// Home path for both login and sign up on home page. DB
	.when('/',{
	template: '<login>Loading Login </login>'

		
	})
	.when('/itemList',{
		template: '<item-list> loading Item List</item-list>'

	})
	.when('/itemShow/:id',{
		template: '<item-show> loading Item show</item-show>'
	})
	.when('/signup',{
        template: '<signup> loading Item List</signup>'
		})

})