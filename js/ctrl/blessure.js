controle.blessure = function($scope) {
	$scope.blessureHerbe = ["Fausse Suppure", "Suppure", "Méritoine", "Ortigal", "Ortigal Noir", "Belidane",
			"Faux Murus", "Murus", "Tanemiel", "Tanemiel Dorée"];

	// grade -> [bruns, qualite]
	var refMini = [[0], [0], [0], [0], [0], [0], [0], [0], [1, 0], [2, 0], [3, 1], [3, 1], [3, 2], [4, 2], [4, 3],
			[5, 3], [5, 4], [6, 4], [6, 5], [7, 5], [7, 6], [8, 6], [8, 7], [9, 7], [9, 8], [10, 8], [10, 9], [11, 9],
			[12, 9], [13, 9], [14, 9], [15, 9], [16, 9], [17, 9]];

	$scope.blessureMiniText = function(gradeBlessure) {
		var out, mini = refMini[gradeBlessure];
		if (mini[0] == 0)
			out = "Aucune herbe n'est nécessaire";
		else
			out = "Au moins " + mini[0] + (mini[0] > 1 ? " brins" : " brin") + " de " + $scope.blessureHerbe[mini[1]];
		return out;
	};

	$scope.blessureNecessaireEtSuffisant = function(blessure, herbes) {
		var mini = refMini[blessure.grade];
		if (mini[0] == 0)
			return false; // Herbes non nécessaires
		return $scope.blessureHerbe.indexOf(herbes.qualite) >= mini[1] && herbes.bruns >= mini[0];
	}

	$scope.blessureEnduParRepos = function(blessures) {
		if (blessures instanceof Array) {
			var endu = 0;
			for (var i = 0; i < blessures.length; i++) {
				endu += $scope.blessureEnduParRepos(blessures[i]);
			}
			return endu;
		} else {
			return blessures.recupEndu ? Math.floor(blessures.endu / 2) - blessures.vie : 0;
		}
	};

	$scope.blessureEnduParReposText = function(blessures) {
		var endu = $scope.blessureEnduParRepos(blessures);
		return endu > 0 ? "Se reposer pour récupérer " + endu + " endurance" : "Pas d'endurance récupérable par repos";
	};

	$scope.blessureRepos = function(blessures) {
		var i, b, endu, total = 0;
		for (i = 0; i < blessures.length; i++) {
			b = blessures[i];
			if (b.recupEndu) {
				endu = Math.floor(b.endu / 2) - b.vie;
				total += endu;
				b.endu -= endu;
				b.recupEndu = false;
			}
		}
		util.notify("Le repos vous fait regagner <span class='emphase'>" + total + "</span> en endurance.");
	};

	$scope.blessureApplique = function(blessure, heure, qualite, bruns) {
		blessure.date = {
			heure : $scope.perso.compteur.date.heure,
			jour : $scope.perso.compteur.date.jour,
			mois : $scope.perso.compteur.date.mois,
			annee : $scope.perso.compteur.date.annee
		};
		blessure.herbes = {
			heure : i18n.date.heure.indexOf(heure) + 1,
			qualite : $scope.blessureHerbe.indexOf(qualite),
			bruns : bruns
		};

	};

	$scope.blessureSuppr = function(blessures, b) {
		blessures.splice(blessures.indexOf(b), 1);
	};

	$scope.blessureIncrRound = function() {
		$scope.perso.combat.round++;
		var i, b;
		for (i = 0; i < $scope.perso.blessure.length; i++) {
			b = $scope.perso.blessure[i];
			if (b.saigne)
				b.vie++;
		}
	};

	$scope.blessureSonne = function() {
		var c = $scope.perso.combat;
		if (c.sonne && c.sonne > c.round)
			c.sonne++;
		else
			c.sonne = c.round + 1;
	};

	$scope.$watch("perso.combat.round", function() {
		var c = $scope.perso.combat;
		if (c.sonne && c.sonne < c.round)
			c.sonne = undefined;
	});
};