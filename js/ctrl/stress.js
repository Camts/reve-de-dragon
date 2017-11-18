controle.stress = function($scope) {
	$scope.stressTransform = function() {
		$scope.ihm.xp.restant = service.compteur.stressToXP($scope.perso.compteur, $scope.ihm.xp.jet);
		$scope.ihm.mode = "stress";
	};
	$scope.stressCancel = function() {
		$scope.$broadcast("stress-cancel");
		$scope.ihm.xp.restant = undefined;
		$scope.ihm.mode = undefined;
	};
	$scope.stressValid = function() {
		var valid = $scope.ihm.xp.valid;
		for (var i = 0; i < valid.length; i++) {
			valid[i]();
		}
		$scope.ihm.xp.jet = undefined;
		$scope.ihm.xp.restant = undefined;
		$scope.ihm.mode = undefined;
		$scope.perso.compteur.stress = 0;
	};
};