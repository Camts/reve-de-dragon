app.directive("terresMedianesCase", function() {
	// Au 3/8ème
	// var rowEvenTop = [18, 60, 101, 143, 184, 224, 265, 306,
	// 346, 388, 428,
	// 469, 509, 550, 590, 632];
	// var rowOddTop = [40, 80, 122, 164, 206, 246, 286, 327,
	// 369, 409, 451,
	// 491, 532, 572, 612];
	// var colLeft = [20, 61, 102, 144, 185, 227, 267, 309, 350,
	// 391, 432, 473,
	// 515, 555];

	// A la moitié
	var rowEvenTop = [24, 79, 134, 191, 243, 298, 352, 407, 461, 516, 570, 625, 678, 733, 787, 843];
	var rowOddTop = [53, 106, 162, 218, 274, 327, 382, 436, 491, 546, 600, 654, 709, 762, 816];
	var colLeft = [26, 81, 136, 191, 245, 301, 355, 411, 466, 520, 575, 630, 686, 739];

	var isNeighbour = function(col0, row0, col1, row1) {
		return (col1 == col0 && Math.abs(row1 - row0) == 1)
				|| (Math.abs(col1 - col0) == 1 && (row1 == row0 || row1 - row0 == (col0 % 2 == 0 ? -1 : 1)));
	};

	return {
		restrict : "A",
		replace : true,
		scope : true,
		template : '<div ng-click="onClick()" ng-class="classe + \' w-tmc-type-\' + terresMedianesType(position)"'
				+ ' title="{{titleText()}}">{{perso.magie.sorts[ihm.magie.sortVu].bonus[position]}}</div>',

		controller : function($scope) {
			$scope.titleText = function() {
				var out = $scope.text, reserve = $scope.perso.magie.reserve[$scope.position];
				if (reserve)
					out += ", en réserve : " + reserve;
				return out;
			};

			$scope.onClick = function() {
				if ($scope.$parent.perso.magie.monte && $scope.classe.startsWith("w-tmc-neighbour")) {
					$scope.$parent.perso.magie.terreMediane = $scope.position;
					$scope.$parent.perso.compteur.fatigue += 1;
				}
			};
		},

		link : function(scope, elt, attrs) {
			scope.position = attrs.terresMedianesCase;
			scope.col = scope.terresMedianesCol(scope.position);
			scope.row = scope.terresMedianesRow(scope.position);
			scope.text = scope.terresMedianesTexte(scope.position);

			var rowTop = scope.col % 2 == 0 ? rowEvenTop : rowOddTop;
			elt[0].style.top = rowTop[scope.row] + "px";
			var height = rowTop[scope.row + 1] - rowTop[scope.row] - 1;
			elt[0].style.height = height + "px";
			elt[0].style.lineHeight = (height - 3) + "px";
			elt[0].style.left = colLeft[scope.col] + "px";
			elt[0].style.width = (colLeft[scope.col + 1] - colLeft[scope.col] - 1) + "px";

			var setClass = function(newVal, oldVal) {
				var tm = scope.$parent.perso.magie.terreMediane;
				var tmCol = tm.charCodeAt(0) - "A".charCodeAt(0);
				var tmRow = parseInt(tm.substr(1)) - 1;
				var classe = "w-tmc";
				if (tmCol == scope.col && tmRow == scope.row) {
					classe = "w-tmc-current";
					var reserve = scope.$parent.perso.magie.reserve[scope.position];
					if (reserve && (!newVal || newVal == scope.position)) {
						scope.$parent.perso.magie.reserve[scope.position] = undefined;
						util.notify("Le sort en réserve <span class='emphase'>" + reserve + "</span> a été lancé.");
					}
				} else if (isNeighbour(scope.col, scope.row, tmCol, tmRow)) {
					classe = "w-tmc-neighbour";
				}
				if (scope.$parent.perso.magie.reserve[scope.position])
					classe += " w-tmc-reserve";
				scope.classe = classe;
			};
			scope.$watch("perso.magie.terreMediane", setClass);
			scope.$watch("perso.magie.reserve." + scope.position, setClass);
			setClass();
		}
	}
});