"use strict";
// jshint esversion: 6

app.controller("pnjsCtrl", ["$scope", function($scope) {
	$scope.service = service;

	function clonePerso(perso, arr, isModele) {
		let i, data = perso.toData();
		if (!isModele) {
			for (i in data.carac) {
				let c = data.carac[i];
				if (c.max > c.val)
					c.val = Math.round(Math.random() * (c.max - c.val)) + c.val;
			}
			for (i in data.comp) {
				let c = data.comp[i];
				if (c.max > c.val)
					c.val = Math.round(Math.random() * (c.max - c.val)) + c.val;
			}
		}
		let p = new Perso(data, isModele);
		if (!isModele) {
			let unic = true;
			i = 0;
			while (unic && i < arr.length)
				if (arr[i].id.nom == p.id.nom)
					unic = false;
				else
					i++;
			if (!unic) {
				let base = p.id.nom.replace(/[0-9]$/, "");
				let exists = [], len = base.length;
				for (i in arr)
					if (arr[i].id.nom.startsWith(base))
						exists.push(arr[i].id.nom.substring(len));
				i = 0;
				while (exists.indexOf("" + i) != -1)
					i++;
				p.id.nom = base + i;
			}
		}
		return p;
	}

	let i, data = service.dao.loadPNJs();
	$scope.display = data.display;
	$scope.zones = data.zones;
	$scope.ihm = service.dao.initialIhmGlobal;
	$scope.ihm.mode = "pnjs";

	// Modèles

	$scope.modeles = [];
	for (i of data.modeles)
		$scope.modeles.push(new Perso(i, true));
	data.modeles = $scope.modeles;

	$scope.modeleAdd = function(groupe) {
		let modele = new Perso(service.dao.initialPersoData, true);
		modele.id.nom = "nouveau";
		if (groupe != undefined)
			modele.groupe = groupe;
		$scope.modeles.push(modele);
	};
	if ($scope.modeles.length == 0) {
		$scope.modeleAdd();
	}

	$scope.modelesSort = function() {
		$scope.modeles.sort(function(a, b) {
			if (a.groupe < b.groupe)
				return -1;
			if (a.groupe > b.groupe)
				return 1;
			if (a.id.nom < b.id.nom)
				return -1;
			if (a.id.nom > b.id.nom)
				return 1;
			return $scope.modeles.indexOf(a) - $scope.modeles.indexOf(b);
		});
	};

	// Groupes de modèles

	$scope.modeleGroupes = [];
	for (i of data.modeles)
		$scope.modeleGroupes.push({nom: i.groupe, shown: false});
	$scope.modeleGroupes[0].shown = true;
	$scope.modeleGroupesSort = function() {
		$scope.modeleGroupes.sort(function(a, b) {
			return a.nom < b.nom ? -1 : a.nom == b.nom ? 0 : 1;
		});
		$scope.modelesSort();
	};
	$scope.modeleGroupesSort();

	$scope.modeleGroupeShow = function(groupe) {
		for (let g of $scope.modeleGroupes) {
			g.shown = g.nom == groupe && !g.shown;
		}
	};

	$scope.modeleGroupeNameToggle = function(evt) {
		let td = evt.target.parentNode;
		td.classList.toggle("group-edit");
		setTimeout(function() {
			td.querySelectorAll("input")[0].focus();
		}, 100);
	};

	$scope.modeleGroupeNameModify = function(old, evt) {
		let val = evt.currentTarget.value;
		if (val !== old) {
			for (let modele of $scope.modeles)
				if (modele.groupe == old)
					modele.groupe = val;
			for (let groupe of $scope.modeleGroupes)
				if (groupe.nom == old)
					groupe.nom = val;
			$scope.modeleGroupesSort();
		}
		let h2 = evt.target.parentNode;
		h2.classList.toggle("group-edit");
	};

	$scope.modeleFindByGroupeAndIndex = function(groupe, index) {
		let i = 0;
		for (let m of $scope.modeles)
			if (m.groupe == groupe)
				if (i != index)
					i++;
				else
					return m;
	};

	$scope.modeleInstancie = function(groupe, index) {
		let m = $scope.modeleFindByGroupeAndIndex(groupe, index);
		$scope.persos.push(clonePerso(m, $scope.persos, false));
	};

	$scope.modeleDuplicate = function(groupe, index) {
		let m = $scope.modeleFindByGroupeAndIndex(groupe, index);
		$scope.modeles.push(clonePerso(m, $scope.modeles, true));
	};

	$scope.modelesSelect = function(groupe, index) {
		let m = $scope.modeleFindByGroupeAndIndex(groupe, index);
		if ($scope.perso)
			$scope.perso.selected = false;
		$scope.perso = m;
		$scope.perso.selected = true;
	};
	$scope.modelesSelect($scope.modeleGroupes[0].nom, 0);

	// Persos

	$scope.persos = [];
	for (i = 0; i < data.persos.length; i++)
		$scope.persos.push(new Perso(data.persos[i], false));
	data.persos = $scope.persos;

	if ($scope.persos.length == 0) {
		$scope.modeleInstancie($scope.modeleGroupes[0].nom, 0);
	}

	$scope.persosSelect = function(i) {
		if ($scope.perso)
			$scope.perso.selected = false;
		$scope.perso = $scope.persos[i];
		$scope.perso.selected = true;
	};

	$scope.persoJaugeBack = function(val, max) {
		let r = Math.floor(((max - val) / max) * 255);
		let g = Math.floor((val / max) * 224);
		return {
			"background-color" : "rgb(" + r + "," + g + ",0)"
		};
	}

	$scope.persoJaugeMissing = function(val, max) {
		let h = Math.floor(((max - val) / max) * 16);
		return {
			height : h + "px"
		};
	}

	// Rounds

	$scope.roundStart = function() {
		$scope.display.round = 1;
		$scope.roundDisplay();
	};

	$scope.roundEnd = function() {
		$scope.display.round = undefined;
		$scope.roundDisplay();
	};

	$scope.roundDisplay = function() {
		let enCombat = $scope.display.round != undefined;
		$scope.display.cadre.combat.eqmt = !enCombat;
	}
	$scope.roundDisplay();

	$scope.roundIncr = function() {
		$scope.display.round++;
		let i;
		for (i = 0; i < $scope.persos.length; i++)
			$scope.persos[i].blessureIncrRound($scope.display.round);
	};

	setTimeout(function() {
		zone.setConfig(document.getElementById("cadres-pnjs"), $scope.zones);
		service.pref.applyAll($scope.display.pref);
	}, 1500);
}]);

app.directive("dragTypeValue", function() {
	return {
		restrict : "A",
		link : function(scope, elt, attrs) {
			let i = attrs.dragTypeValue.indexOf("|");
			let type = attrs.dragTypeValue.substring(0, i);
			let value = attrs.dragTypeValue.substring(i + 1);
			elt[0].setAttribute("draggable", "true");
			elt[0].addEventListener("dragstart", function(evt) {
				evt.dataTransfer.setData(type, value);
			});
		}
	};
});

app.directive("dropTypeIndex", function() {
	return {
		restrict : "A",
		link : function(scope, elt, attrs) {
			let type = attrs.dropTypeIndex;
			elt[0].addEventListener("dragover", function(evt) {
				if (evt.dataTransfer.types.indexOf(type) != -1 && scope[type].length > 1)
					evt.preventDefault();
			});
			elt[0].addEventListener("drop", function(evt) {
				let value = evt.dataTransfer.getData(type);
				if (!value || !scope[type] || scope[type].length == 1)
					return;
				if (type == "persos") {
					if (scope[type][value].selected)
						scope[type + "Select"](value > 0 ? 0 : 1);
					scope[type].splice(value, 1);
				} else { // type = "modeles"
					let groupeIndex = value.split("|");
					let m = scope.modeleFindByGroupeAndIndex(groupeIndex[0], groupeIndex[1]);
					if (evt.target.nodeName == "IMG") { // remove modele
						let index = scope[type].indexOf(m);
						scope[type].splice(index, 1);
						if (m.selected)
							scope[type][0].selected = true;
					} else // change modele groupe
						m.groupe = evt.target.firstChild.nodeValue;
					scope.modelesSort();
				}
				scope.$apply();
			});
		}
	};
});

app.filter("groupe", function() {
	return function(modeles, nom) {
		let out = [];
		for (let modele of modeles)
			if (modele.groupe == nom)
				out.push(modele);
		return out;
	};
});