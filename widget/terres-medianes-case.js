"use strict";
// jshint esversion: 6

app.directive("terresMedianesCase", function() {
	// Au 3/8ème
	// let rowEvenTop = [18, 60, 101, 143, 184, 224, 265, 306,
	// 346, 388, 428,
	// 469, 509, 550, 590, 632];
	// let rowOddTop = [40, 80, 122, 164, 206, 246, 286, 327,
	// 369, 409, 451,
	// 491, 532, 572, 612];
	// let colLeft = [20, 61, 102, 144, 185, 227, 267, 309, 350,
	// 391, 432, 473,
	// 515, 555];

	// A la moitié
	let rowEvenTop = [24, 79, 134, 191, 243, 298, 352, 407, 461, 516, 570, 625, 678, 733, 787, 843];
	let rowOddTop = [53, 106, 162, 218, 274, 327, 382, 436, 491, 546, 600, 654, 709, 762, 816];
	let colLeft = [26, 81, 136, 191, 245, 301, 355, 411, 466, 520, 575, 630, 686, 739];

	return {
		restrict : "A",
		replace : true,
		scope : true,
		template : '<div ng-click="onClick()" ng-attr-class="{{classe()}}"'
				+ ' title="{{titleText()}}">{{perso.magie.sorts[perso.ihm.magie.sortVu].bonus[position]}}</div>',

		controller : function($scope) {
			$scope.classe = function() {
				let classe;
				if ($scope.perso.magie.terreMediane == $scope.position)
					classe = "w-tmc-current";
				else if ($scope.perso.magie.voisines.indexOf($scope.position) != -1)
					classe = "w-tmc-neighbour";
				else
					classe = "w-tmc";
				classe += " w-tmc-type-" + $scope.type;
				if ($scope.perso.magie.reserve[$scope.position])
					classe += " w-tmc-reserve";
				return classe;
			};

			$scope.titleText = function() {
				let out = $scope.text, reserve = $scope.perso.magie.reserve[$scope.position];
				if (reserve)
					out += ", en réserve : " + reserve;
				return out;
			};

			$scope.onClick = function() {
				if ($scope.perso.magie.monte && $scope.perso.magie.voisines.indexOf($scope.position) != -1) {
					$scope.perso.magie.terreMediane = $scope.position;
					$scope.perso.compteur.fatigue += 1;
				}
			};
		},

		link : function(scope, elt, attrs) {
			scope.position = attrs.terresMedianesCase;
			scope.col = Magie.terresMedianesCol(scope.position);
			scope.row = Magie.terresMedianesRow(scope.position);
			scope.text = Magie.terresMedianesTexte(scope.position);
			scope.type = Magie.terresMedianesType(scope.position);

			let rowTop = scope.col % 2 == 0 ? rowEvenTop : rowOddTop;
			elt[0].style.top = rowTop[scope.row] + "px";
			let height = rowTop[scope.row + 1] - rowTop[scope.row] - 1;
			elt[0].style.height = height + "px";
			elt[0].style.lineHeight = (height - 3) + "px";
			elt[0].style.left = colLeft[scope.col] + "px";
			elt[0].style.width = (colLeft[scope.col + 1] - colLeft[scope.col] - 1) + "px";
		}
	}
});