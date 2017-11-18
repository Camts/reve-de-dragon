app.directive("competence", function() {
	return {
		restrict : "A",
		replace : true,
		scope : true,
		templateUrl : "widget/competence.html",

		controller : function($scope) {
			$scope.onArchChange = function(newVal, oldVal) {
				if (newVal === null)
					return;
				var v;
				newVal = newVal.value !== undefined ? newVal.value : parseInt(newVal);
				oldVal = oldVal.value !== undefined ? oldVal.value : parseInt(oldVal);
				v = $scope.ihm.archetype.values[oldVal];
				v.restant = v.restant + 1;
				v = $scope.ihm.archetype.values[newVal];
				v.restant = v.restant - 1;
			};

			$scope.onXpChange = function() {
				service.competence.onXpChange($scope.m);
			};

			$scope.onStressXpChange = function() {
				var valid = !$scope.g.input.classList.contains("ng-invalid");
				var xp = valid ? parseInt($scope.g.xp) : 0;
				$scope.g.val = service.competence.val($scope.m);
				var up = service.competence.computeUp($scope.g, ($scope.m.xp ? $scope.m.xp : 0) + xp);
				var seuil = service.competence.xpToUpFrom(up[1]);
				if (valid != $scope.prevOK) {
					if (valid)
						$scope.ihm.xp.invalid = $scope.ihm.xp.invalid - 1;
					else
						$scope.ihm.xp.invalid = $scope.ihm.xp.invalid + 1;
					$scope.prevOK = valid;
				}
				$scope.g.lvl = up[1] - $scope.g.val;

				// Archetype
				if (up[1] > $scope.m.arch) {
					var max = service.competence.xpToArchetype($scope.m);
					$scope.g.xp = max;
					$scope.g.lvl = $scope.m.arch - $scope.g.val;
					$scope.g.arch = true;
				} else if (up[1] == $scope.m.arch) {
					if (up[2] > 0)
						$scope.g.xp = $scope.g.xp - up[2];
					$scope.g.arch = true;
				} else
					$scope.g.arch = false;

				if (xp != $scope.prevVal) {
					$scope.ihm.xp.restant = $scope.ihm.xp.restant - (xp - $scope.prevVal);
					$scope.prevVal = xp;
				}
				$scope.g.canUp = seuil <= up[2] + $scope.ihm.xp.restant;
			};

			$scope.upWithStress = function() {
				var xp = $scope.g.xp ? parseInt($scope.g.xp) : 0;
				$scope.g.val = service.competence.val($scope.m);
				var up = service.competence.computeUp($scope.g, ($scope.m.xp ? $scope.m.xp : 0) + xp);
				var seuil = service.competence.xpToUpFrom(up[1]);
				$scope.g.xp = xp + seuil - up[2];
				$scope.onStressXpChange();
			};
		},

		link : function(scope, elt, attrs) {
			scope.nom = attrs.competence;
			scope.label = service.competence.label[attrs.competence];
			scope.m = scope.perso.comp[attrs.competence];
			if (scope.m.arch === undefined)
				scope.m.arch = 0;
			scope.prevVal = 0;
			scope.prevOK = true;
			var inputs = elt[0].getElementsByTagName("input");
			scope.g = {
				val : service.competence.val(scope.m),
				xp : 0,
				lvl : 0,
				input : inputs[inputs.length - 1]
			};
			scope.g.arch = scope.g.val >= scope.m.arch;

			var classes = "w-competence";
			if (scope.m.type == "drac")
				classes += " comp-drac";
			elt[0].setAttribute("class", classes);

			scope.ihm.xp.valid.push(function() {
				var xp = (scope.m.xp ? scope.m.xp : 0) + (scope.g.xp ? scope.g.xp : 0);
				scope.g.xp = 0;
				scope.g.lvl = 0;
				scope.m.xp = xp > 0 ? xp : undefined;
				scope.onXpChange();
			});
			scope.$parent.$watch("ihm.xp.restant", scope.onStressXpChange);
			scope.onStressXpChange();

			scope.xpToUpFrom = function() {
				return service.competence.xpToUpFrom(scope.m);
			};

			scope.$parent.$on("stress-cancel", function() {
				scope.g.xp = 0;
				scope.onStressXpChange();
			});
		}
	}
});
