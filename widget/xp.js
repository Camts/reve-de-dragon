"use strict";
// jshint esversion: 6

app.directive("xp", function() {
	let pRadio = Symbol("radio");
	let pDiff = Symbol("diff");
	let pCarac = Symbol("carac");
	return {
		restrict : "E",
		replace : true,
		scope : {
			diff : "=diff",
			carac : "=carac", // name
			comp : "=comp" // name
		},
		templateUrl : "widget/xp.html",

		controller : function($scope) {
			$scope.xp = {};
			$scope.caracs = {};
			$scope.radio = undefined;

			$scope.computeCaracXp = function() {
				if ($scope.caracs.length == 1)
					$scope.caracs[0].val = $scope.xp.caracs;
				else if ($scope.caracs.length == 2) {
					if ($scope.xp.caracs % 2 == 0)
						$scope.caracs[0].val = $scope.caracs[1].val = $scope.xp.caracs / 2;
					else {
						$scope.caracs[0].val = $scope.caracs[1].val = Math.floor($scope.xp.caracs / 2);
						$scope.caracs[$scope.radio == $scope.caracs[0].nom ? 0 : 1].val++;
					}
				} else if ($scope.caracs.length == 3) {
					if ($scope.xp.caracs % 3 == 0)
						$scope.caracs[0].val = $scope.caracs[1].val = $scope.caracs[2].val = $scope.xp.caracs / 3;
					else if ($scope.xp.caracs % 3 == 1) {
						$scope.caracs[0].val = $scope.caracs[1].val = $scope.caracs[2].val = Math
								.floor($scope.xp.caracs / 3);
						$scope.caracs[$scope.radio == $scope.caracs[0].nom ? 0
								: $scope.radio == $scope.caracs[1].nom ? 1 : 2].val++;
					} else { // $scope.xp.caracs % 3 == 2
						$scope.caracs[0].val = $scope.caracs[1].val = $scope.caracs[2].val = Math
								.ceil($scope.xp.caracs / 3);
						$scope.caracs[$scope.radio == $scope.caracs[0].nom ? 0
								: $scope.radio == $scope.caracs[1].nom ? 1 : 2].val--;
					}
				}
			};

			$scope.valid = function() {
				let perso = $scope;
				while (!perso.perso)
					perso = perso.$parent;
				perso = perso.perso;

				let cur, msg = "", notFirst = false;
				// comp
				if ($scope.comp) {
					let comp = perso.comp[$scope.comp];
					cur = comp.xp;
					if (isNaN(cur))
						cur = 0;
					comp.xp = cur + $scope.xp.comp;
					service.competence.onXpChange(comp);
					msg = "XP : <span class='emphase'>" + $scope.xp.comp
							+ "</span> en compétence <span class='emphase'>" + Comp.typeLabel[$scope.comp][1]
							+ "</span>.";
					notFirst = true;
				}

				// carac
				let carac;
				if ($scope.xp.caracs > 0) {
					let i, add;
					for (i = 0; i < $scope.caracs.length; i++) {
						add = $scope.caracs[i].val;
						if (add > 0) {
							let nom = $scope.caracs[i].nom;
							carac = perso.carac[nom];
							cur = carac.xp;
							if (isNaN(cur))
								cur = 0;
							carac.xp = cur + add;
							if (notFirst)
								msg += "<br/>";
							else
								notFirst = true;
							msg += "XP : <span class='emphase'>" + add
									+ "</span> en caractéristique <span class='emphase'>" + i18n.carac[nom]
									+ "</span>.";
						}
					}
				}
				util.notify(msg);
			};

			Object.defineProperty($scope, "radio", {
				get : function() {
					return $scope[pRadio];
				},
				set : function(val) {
					if ($scope[pRadio] === val)
						return;
					$scope[pRadio] = val;
					$scope.computeCaracXp();
				}
			});

			let initDiff = $scope.diff;
			Object.defineProperty($scope, "diff", {
				get : function() {
					return $scope[pDiff];
				},
				set : function(val) {
					if ($scope[pDiff] === val)
						return;
					$scope[pDiff] = val;
					$scope.xp.caracs = Math.floor(-$scope.diff / 2);
					$scope.xp.comp = Math.ceil(-$scope.diff / 2);
					$scope.computeCaracXp();
				}
			});
			$scope.diff = initDiff;

			let initCarac = $scope.carac;
			Object.defineProperty($scope, "carac", {
				get : function() {
					return $scope[pCarac];
				},
				set : function(val) {
					if ($scope[pCarac] === val)
						return;
					$scope[pCarac] = val;
					$scope.caracs = [];
					let base = Carac.base[$scope.carac];
					if (base) {
						for (let i = 0; i < base.length; i++) {
							if (Carac.noXp.indexOf(base[i]) == -1) {
								$scope.caracs.push({
									nom : base[i],
									label : i18n.carac[base[i]],
									val : 0
								});
							}
						}
					} else if ($scope.carac && Carac.noXp.indexOf($scope.carac) == -1) {
						$scope.caracs.push({
							nom : $scope.carac,
							label : i18n.carac[$scope.carac],
							val : 0
						});
					}
					$scope.radio = $scope.caracs.length > 0 ? $scope.caracs[0].nom : "";
					$scope.computeCaracXp();
				}
			});
			$scope.carac = initCarac;
		},
	}
});