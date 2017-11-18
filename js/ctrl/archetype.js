controle.archetype = function($scope) {
	$scope.archetypeValid = function() {
		$scope.ihm.modeArchetype = false;
		$scope.ihm.mode = undefined;
	};

	// Initialisation
	var cur = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var c, comps = $scope.perso.comp;
	for (c in comps)
		if (comps[c].arch > 0)
			cur[comps[c].arch]++;
	$scope.ihm.archetype.values[0].restant = 100 - cur[0];
	$scope.ihm.archetype.values[1].restant = 10 - cur[1];
	$scope.ihm.archetype.values[2].restant = 9 - cur[2];
	$scope.ihm.archetype.values[3].restant = 8 - cur[3];
	$scope.ihm.archetype.values[4].restant = 7 - cur[4];
	$scope.ihm.archetype.values[5].restant = 6 - cur[5];
	$scope.ihm.archetype.values[6].restant = 5 - cur[6];
	$scope.ihm.archetype.values[7].restant = 4 - cur[7];
	$scope.ihm.archetype.values[8].restant = 3 - cur[8];
	$scope.ihm.archetype.values[9].restant = 2 - cur[9];
	$scope.ihm.archetype.values[10].restant = 1 - cur[10];
	$scope.ihm.archetype.values[11].restant = 1 - cur[11];
};