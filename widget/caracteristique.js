app.directive("caracteristique", function() {
	return {
		restrict : "A",
		replace : false,
		scope : true,
		templateUrl : "widget/caracteristique.html",

		controller : function($scope) {
			$scope.onXpChange = function() {
				service.carac.onXpChange($scope.m);
			};
		},

		link : function(scope, elt, attrs) {
			scope.nom = attrs.caracteristique;
			elt[0].setAttribute("class", "w-caracteristique");
			scope.label = i18n.carac[attrs.caracteristique];
			scope.m = scope.perso.carac[attrs.caracteristique];
			scope.noXp = config.caracNoXp.indexOf(attrs.caracteristique) != -1;

			var onCaracChange = function() {
				var title = "";
				if (attrs.ft == "true")
					title += "FT : " + config.caracFacteurTemps[scope.m.val];
				if (attrs.fr == "true") {
					if (title)
						title += ", ";
					title += "FR : " + config.caracFacteurResistance[scope.m.val] + " ";
				}
				scope.title = title;
			};
			onCaracChange();
			scope.$parent.$watch("perso.carac." + attrs.caracteristique + ".val", onCaracChange);
		}
	}
});