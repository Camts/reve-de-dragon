app.directive("heure", function() {
	return {
		restrict : "A",
		replace : false,
		scope : {
			h : "=heure"
		},
		templateUrl : "widget/heure.html",

		link : function(scope, elt, attrs) {
			scope.nom = i18n.date.heure[scope.h - 1];
			scope.old = scope.h;
			elt[0].classList.toggle("w-heure");
			elt[0].classList.toggle("w-heure-" + scope.h);

			scope.$parent.$watch(attrs.heure, function(newVal) {
				if (newVal >= 1 && newVal <= 12) {
					scope.nom = i18n.date.heure[newVal - 1];
					elt[0].classList.toggle("w-heure-" + scope.old);
					elt[0].classList.toggle("w-heure-" + newVal);
					scope.old = newVal;
				}
			});
			util.removeEmptyText(elt[0]);
		}
	}
});