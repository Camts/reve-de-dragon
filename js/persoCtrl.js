"use strict";
// jshint esversion: 6

app.controller("persoCtrl", ['$scope', function($scope) {
	$scope.i18n = i18n;
	$scope.Blessure = Blessure;
	$scope.Carac = Carac;
	$scope.Comp = Comp;

	if (service.dao.fs) {
		if (service.dao.fs.existsSync(service.dao.dataDir + "/bg.png"))
			$scope.ihm.background = service.dao.dataDir + "/bg.png";
		else if (service.dao.fs.existsSync(service.dao.dataDir + "/bg.jpg"))
			$scope.ihm.background = service.dao.dataDir + "/bg.jpg";
	}

	if ($scope.ihm.background) {
		let url = $scope.ihm.background.replace(new RegExp("\\\\", 'g'), "/");
		document.getElementsByTagName("body")[0].style.backgroundImage = 'url("file:///' + url + '")';
	}

	$scope.switchVueEqmt = function() {
		let ihm = $scope.ihm;
		if (ihm.mode == "magie") {
			$scope.perso.switchVueMagie(ihm);
			if (ihm.mode == "magie")
				return;
		}
		ihm.mode = ihm.mode == "eqmt" ? undefined : "eqmt";
	};

	let ctrls = [];
	ctrls.push(controle.archetype);
	ctrls.push(controle.blessure);
	ctrls.push(controle.compToutes);
	ctrls.push(controle.encaissement);
	ctrls.push(controle.jet);
	ctrls.push(controle.rencontre);
	ctrls.push(controle.sacs);
	ctrls.push(controle.sort);
	ctrls.push(controle.stress);
	ctrls.push(controle.terresMedianes);
	let i, ctrl;
	for (i = 0; i < ctrls.length; i++) {
		ctrl = ctrls[i];
		if (ctrl)
			ctrl($scope);
	}
}]);