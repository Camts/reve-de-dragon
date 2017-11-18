app.controller("feuilleCtrl", ['$scope', function($scope) {
	var data = service.dao.loadPerso();
	$scope.config = config;
	$scope.perso = data.perso;
	$scope.display = data.display;
	$scope.zones = data.zones;
}]);