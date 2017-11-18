"use strict";
// jshint esversion: 6

controle.jet = function($scope) {
	$scope.jetSetCaracVal = function(val) {
		$scope.ihm.jet.carac.nom = undefined;
		$scope.ihm.jet.carac.val = val;
		$scope.jetOnDiffChange();
	};

	$scope.jetSetCaracNom = function(nom) {
		$scope.ihm.jet.carac.nom = nom;
		let val;
		if ($scope.perso.carac[nom].val !== undefined)
			val = $scope.perso.carac[nom].val;
		else
			val = $scope.perso.carac[nom];
		$scope.ihm.jet.carac.val = val;
		$scope.jetOnDiffChange();
	};

	$scope.jetSetCompNom = function(nom) {
		$scope.ihm.jet.comp.nom = nom;
		$scope.ihm.jet.comp.val = $scope.perso.comp[nom].val;
		$scope.jetOnDiffChange();
	};

	$scope.jetOnCaracChange = function() {
		$scope.ihm.jet.carac.nom = undefined;
		$scope.jetOnDiffChange();
	};

	$scope.jetOnCompChange = function() {
		$scope.ihm.jet.comp.nom = undefined;
		$scope.jetOnDiffChange();
	};

	$scope.$watch("perso.compteur.malus", function() {
		$scope.jetOnDiffChange();
	});

	$scope.jetOnDiffChange = function() {
		if ($scope.ihm.jet.carac.val && ($scope.ihm.jet.comp.val || $scope.ihm.jet.comp.val === 0)) {
			let diff = parseInt($scope.ihm.jet.comp.val);
			if ($scope.ihm.jet.diff) {
				diff += parseInt($scope.ihm.jet.diff);
			}
			if ($scope.ihm.jet.carac.nom != "chance") {
				diff -= $scope.perso.compteur.malus;
			}
			let normale = service.seuil.normale(parseInt($scope.ihm.jet.carac.val), diff);
			$scope.ihm.jet.seuil.norm = normale;

			$scope.ihm.jet.seuil.crit = service.seuil.critique(normale);
			$scope.ihm.jet.seuil.part = service.seuil.particuliere(normale);
			$scope.ihm.jet.seuil.sign = service.seuil.significative(normale);
			$scope.ihm.jet.seuil.total = service.seuil.echecTotal(normale);
		}
	};
};