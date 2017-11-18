app.directive("xp", function() {
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
			$scope.valid = function() {
				var perso = $scope;
				while (!perso.perso)
					perso = perso.$parent;
				perso = perso.perso;

				var cur, msg = "", notFirst = false;
				// comp
				if ($scope.comp) {
					var comp = perso.comp[$scope.comp];
					cur = comp.xp;
					if (isNaN(cur))
						cur = 0;
					comp.xp = cur + $scope.xp.comp;
					service.competence.onXpChange(comp);
					msg = "XP : <span class='emphase'>" + $scope.xp.comp
							+ "</span> en compétence <span class='emphase'>" + service.competence.label[$scope.comp]
							+ "</span>.";
					notFirst = true;
				}

				// carac
				var carac;
				if ($scope.xp.caracs > 0 && $scope.caracs.length > 1) {
					var i, add;
					for (i = 0; i < $scope.caracs.length; i++) {
						add = $scope.caracs[i].val;
						if (add > 0) {
							var nom = $scope.caracs[i].nom;
							carac = perso.carac[nom];
							cur = carac.xp;
							if (isNaN(cur))
								cur = 0;
							carac.xp = cur + add;
							service.carac.onXpChange(carac);
							if (notFirst)
								msg += "<br/>";
							else
								notFirst = true;
							msg += "XP : <span class='emphase'>" + add
									+ "</span> en caractéristique <span class='emphase'>" + i18n.carac[nom]
									+ "</span>.";
						}
					}
				} else if ($scope.xp.caracs > 0 && $scope.caracs.length == 1) {
					carac = perso.carac[$scope.caracs[0].nom];
					cur = carac.xp;
					if (isNaN(cur))
						cur = 0;
					carac.xp = cur + $scope.xp.caracs;
					service.carac.onXpChange(carac);
					if (notFirst)
						msg += "<br/>";
					msg += "XP : <span class='emphase'>" + $scope.xp.caracs
							+ "</span> en caractéristique <span class='emphase'>" + i18n.carac[$scope.caracs[0].nom]
							+ "</span>.";
				}
				util.notify(msg);
			};
		},

		link : function(scope, elt, attrs) {
			scope.xp = {};
			scope.caracs = {};

			scope.computeInvalid = function() {
				if (scope.caracs.length > 1) {
					var i, sum = 0;
					for (i = 0; i < scope.caracs.length; i++)
						sum += scope.caracs[i].val;
					scope.invalid = sum != scope.xp.caracs;
				} else {
					scope.invalid = false;
				}
			};

			onDiffChange = function() {
				scope.xp.caracs = Math.floor(-scope.diff / 2);
				scope.xp.comp = Math.ceil(-scope.diff / 2);
				scope.computeInvalid();
			};
			scope.$watch("diff", onDiffChange);

			var onCaracChange = function() {
				scope.caracs = [];
				var base = config.caracBase[scope.carac];
				if (base) {
					for (var i = 0; i < base.length; i++) {
						if (config.caracNoXp.indexOf(base[i]) == -1) {
							scope.caracs.push({
								nom : base[i],
								label : i18n.carac[base[i]],
								val : 0
							});
						}
					}
				} else if (scope.carac && config.caracNoXp.indexOf(scope.carac) == -1) {
					scope.caracs.push({
						nom : scope.carac,
						label : i18n.carac[scope.carac],
						val : 0
					});
				}
				setTimeout(function() {
					util.setNumberInputsWidth(elt[0]);
				}, 250);
				scope.computeInvalid();
			};
			scope.$watch("carac", onCaracChange);
			onCaracChange();
		}
	}
});