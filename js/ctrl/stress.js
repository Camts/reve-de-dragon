"use strict";
// jshint esversion: 6

controle.stress = function($scope) {
	let listeners = [];
	$scope.addStressListener = function(listener) {
		listeners.push(listener);
	}

	$scope.stressTransform = function() {
		$scope.perso.ihm.xp.restant = service.compteur.stressToXP($scope.perso.compteur, $scope.perso.ihm.xp.jet);
		for (let i = 0; i < listeners.length; i++)
			listeners[i].xp = 0;
		$scope.ihm.mode = "stress";
	};

	$scope.stressCancel = function() {
		for (let i = 0; i < listeners.length; i++)
			listeners[i].xp = 0;
		$scope.perso.ihm.xp.restant = undefined;
		$scope.ihm.mode = undefined;
	};

	$scope.stressValid = function() {
		let valid = $scope.perso.ihm.xp.valid;
		for (let i = 0; i < valid.length; i++) {
			valid[i]();
		}
		$scope.perso.ihm.xp.jet = undefined;
		$scope.perso.ihm.xp.restant = undefined;
		$scope.ihm.mode = undefined;
		$scope.perso.compteur.stress = 0;
	};
};