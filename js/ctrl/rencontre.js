"use strict";
// jshint esversion: 6

controle.rencontre = function($scope) {
	$scope.rencontreNormale = function() {
		let comp = $scope.perso.comp;
		// meilleure voie de magie
		let mvm = Math.max(comp.oniros.val, comp.hypnos.val, comp.narcos.val, comp.thanatos.val);
		return service.seuil.normale($scope.perso.compteur.reve, mvm - $scope.perso.compteur.malus
				- defZero($scope.perso.ihm.magie.rencontre));
	};
	$scope.rencontreCritique = function() {
		return service.seuil.critique($scope.rencontreNormale());
	};
	$scope.rencontreParticuliere = function() {
		return service.seuil.particuliere($scope.rencontreNormale());
	};
	$scope.rencontreSignificative = function() {
		return service.seuil.significative($scope.rencontreNormale());
	};
	$scope.rencontreEchecTotal = function() {
		return service.seuil.echecTotal($scope.rencontreNormale());
	};
};