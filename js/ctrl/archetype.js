"use strict";
// jshint esversion: 6

controle.archetype = function($scope) {
	$scope.archetypeValid = function() {
		$scope.ihm.modeArchetype = false;
		$scope.ihm.mode = undefined;
	};

	$scope.archetypeLabelRestant = function(niveau) {
		let restant = $scope.perso.ihm.archetype[niveau].restant;
		if (restant > 1)
			return "Il reste " + restant + " compétences auxquelles attribuer +" + niveau + " en archétype";
		if (restant == 1)
			return "Il reste 1 compétence à laquelle attribuer +" + niveau + " en archétype";
		return "Tous les niveaux +" + niveau + " ont été attribués en archétype à des compétences";
	};
};