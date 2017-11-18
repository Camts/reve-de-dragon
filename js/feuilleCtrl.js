"use strict";
// jshint esversion: 6

app.controller("feuilleCtrl", ["$scope", function($scope) {
	$scope.service = service;

	let data = service.dao.loadPerso();
	$scope.perso = new Perso(data.perso, false);
	service.dao.data.perso = $scope.perso;
	$scope.display = data.display;
	$scope.zones = data.zones;
	$scope.ihm = service.dao.initialIhmGlobal;

	// Verify display.sac
	let sacs = [];
	for (let s of $scope.perso.eqmt.sac)
		sacs.push(s.nom);
	let ds = $scope.display.sac, presents = [];
	for (let i=ds.length-1; i>=0; i--) {
		let s0 = ds[i];
		for (let j=s0.length-1; j>=0; j--) {
			let s1 = s0[j];
			if (sacs.indexOf(s1) == -1) {
				util.notify("Le sac '" + s1 + "' référencé par les préférences de positionnement est inconnu");
				s0.splice(j, 1);
			} else if (presents.indexOf(s1) != -1) {
				util.notify("Le sac '" + s1 + "' était référencé plusieurs fois par les préférences de positionnement");
				s0.splice(j, 1);
			} else
				presents.push(s1);
		}
		if (s0.length == 0 && ds.length > 1)
			ds.splice(i, 1);
	}
	for (let s of sacs)
		if (presents.indexOf(s) == -1) {
			ds[0].push(s);
			util.notify("Le sac '" + s + "' était manquant dans les préférences de positionnement");
		}

	$scope.roundStart = function() {
		$scope.display.round = 1;
	};

	$scope.roundEnd = function() {
		$scope.display.round = undefined;
	};

	$scope.roundIncr = function() {
		$scope.display.round++;
		$scope.perso.blessureIncrRound($scope.display.round);
	};

	setTimeout(function() {
		zone.setConfig(document.getElementById("cadres-normal"), $scope.zones.normal);
		zone.setConfig(document.getElementById("cadres-eqmt"), $scope.zones.eqmt);
		zone.setConfig(document.getElementById("cadres-magie"), $scope.zones.magie);
		service.pref.applyAll($scope.display.pref);
	}, 1500);
}]);