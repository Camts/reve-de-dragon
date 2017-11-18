"use strict";
// jshint esversion: 6

app.directive("eqmtItem", function() {
	return {
		restrict : "A",
		replace : false,
		scope : true,
		templateUrl : "widget/eqmt-item.html",

		controller : function($scope) {
			$scope.onNomKeyUp = function(evt) {
				if (evt.which == 13 /* enter */|| evt.which == 27/* escape */) {
					evt.target.blur();
				}
			};

			$scope.onNomClick = function(evt) {
				let elt = evt.target;
				while (elt.nodeName != "TD")
					elt = elt.parentNode;
				elt.classList.toggle("eqmt-edit");
				setTimeout(function() {
					elt.querySelectorAll("input")[0].focus();
				}, 100);
			};

			$scope.onNomBlur = function(evt) {
				evt.target.parentNode.classList.toggle("eqmt-edit");
			};

			$scope.remove = function() {
				$scope.sac.liste.splice($scope.sac.liste.indexOf($scope.item), 1);
			};
		},

		link : function(scope, elt, attrs) {
			elt[0].setAttribute("class", "eqmt-item");
			elt[0].setAttribute("draggable", "true");

			scope.sac = scope.$parent.$parent.sac;
			scope.item = scope.sac.liste[scope.$parent.$index];

			elt[0].addEventListener("dragstart", function(evt) {
				let sac = scope.perso.eqmt.sac.indexOf(scope.sac);
				let item = scope.sac.liste.indexOf(scope.item);
				evt.dataTransfer.setData("eqmt-item", sac + "-" + item);
			});
		}
	}
});