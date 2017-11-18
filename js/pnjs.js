app.controller("pnjsCtrl", ['$scope', function($scope) {
	var data = service.dao.loadPNJs();
	$scope.config = config;
	$scope.pnjs = data.pnjs;
	$scope.display = data.display;
	$scope.zones = data.zones;

	// TODO for test => remove
	$scope.pnjs.persos[0] = service.dao.initialPersoData;
	$scope.perso = $scope.pnjs.persos[0];
}]);

app.controller("choixCtrl", ["$scope", function($scope) {
	// $scope.fn = function()
}]);