"use strict";
// jshint esversion: 6

app.directive("competence", function() {
	class CompStress {
		constructor(scope) {
			this.scope = scope;

			// val : current val
			// lvl up with stress
			this.xp = 0; // stress to spend
		}

		get xp() {
			return this[pXp];
		}
		set xp(val) {
			if (isNaN(val))
				return;
			if (val < 0)
				val = 0;
			if (val - this[pXp] > this.scope.perso.ihm.xp.restant)
				val = this[pXp] + this.scope.perso.ihm.xp.restant;
			this.val = this.scope.m().val;
			let up = service.competence.computeUp(this, (this.scope.m().xp ? this.scope.m().xp : 0) + val);
			let seuil = Comp.xpToUpFrom(up[1]);
			this.lvl = up[1] - this.val;

			// Archetype
			if (up[1] > this.scope.m().arch) {
				let max = Comp.xpToArchetype(this.scope.m());
				val = max;
				this.lvl = this.scope.m().arch - this.val;
				this.arch = true;
			} else if (up[1] == this.scope.m().arch) {
				if (up[2] > 0)
					val -= up[2];
				this.arch = true;
			} else
				this.arch = false;

			this.scope.perso.ihm.xp.restant -= val - this[pXp];
			this[pXp] = val;
			this.canUp = seuil <= up[2] + this.scope.perso.ihm.xp.restant;
		}
	}

	return {
		restrict : "A",
		replace : true,
		scope : true,
		templateUrl : "widget/competence.html",

		controller : function($scope) {
			$scope.upWithStress = function() {
				let xp = $scope.g.xp ? parseInt($scope.g.xp) : 0;
				$scope.g.val = $scope.m().val;
				let up = service.competence.computeUp($scope.g, ($scope.m().xp ? $scope.m().xp : 0) + xp);
				let seuil = Comp.xpToUpFrom(up[1]);
				$scope.g.xp = xp + seuil - up[2];
			};
		},

		link : function(scope, elt, attrs) {
			scope.nom = attrs.competence;
			scope.label = Comp.typeLabel[attrs.competence][1];
			scope.m = function() {
				return scope.perso.comp[attrs.competence];
			};

			let classes = "w-competence";
			if (scope.m().type == "drac")
				classes += " comp-drac";
			elt[0].setAttribute("class", classes);

			scope.perso.ihm.xp.valid.push(function() {
				let xp = defZero(scope.m().xp) + scope.g.xp;
				scope.g.xp = 0;
				scope.g.lvl = 0;
				scope.m().xp = xp;
			});

			scope.g = new CompStress(scope);
			if (scope.addStressListener)
				scope.addStressListener(scope.g);
		}
	}
});