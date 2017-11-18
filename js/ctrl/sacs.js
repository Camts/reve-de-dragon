"use strict";
// jshint esversion: 6

controle.sacs = function($scope) {
	$scope.sacGetIndex = function(nom) {
		let i = 0, sacs = $scope.perso.eqmt.sac;
		while (i < sacs.length)
			if (sacs[i].nom == nom)
				return i;
			else
				i++;
		return -1;
	};

	$scope.sacAddCol = function() {
		let sacs = $scope.display.sac;
		if (sacs[sacs.length - 1].length > 0)
			sacs.push([]);
	};

	$scope.sacRemoveCol = function() {
		let sacs = $scope.display.sac;
		if (sacs[sacs.length - 1].length == 0)
			sacs.splice(sacs.length - 1, 1);
	};

	$scope.sacAddSac = function() {
		let input = document.getElementById('sac-new-nom');
		let nom = input.value;
		input.value = "";
		if ($scope.sacGetIndex(nom) != -1) {
			util.notify("Le sac <span class='emphase'>" + nom + "</span> existe déjà.")
			return;
		}
		$scope.perso.eqmt.sac.push({
			nom : nom,
			liste : []
		});
		$scope.display.sac[$scope.display.sac.length - 1].push(nom);
	};
};