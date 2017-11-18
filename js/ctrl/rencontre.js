controle.rencontre = function($scope) {
	$scope.rencontreNormale = function() {
		var comp = $scope.perso.comp;
		// meilleure voie de magie
		var mvm = Math.max(service.competence.val(comp.oniros), service.competence.val(comp.hypnos), service.competence
				.val(comp.narcos), service.competence.val(comp.thanatos));
		return service.seuil.normale($scope.perso.compteur.reve, mvm - $scope.ihm.jet.malus
				- defZero($scope.ihm.magie.rencontre));
	};
	$scope.rencontreCritique = function() {
		return service.seuil.critique($scope.rencontreNormale());
	};
	$scope.rencontreParticuliere = function() {
		return service.seuil.particuliere($scope.rencontreNormale());
	};
	$scope.rencontreSignificative = function() {
		return service.seuil.significative($scope.rencontreNormale());
	};
	$scope.rencontreEchecTotal = function() {
		return service.seuil.echecTotal($scope.rencontreNormale());
	};
};