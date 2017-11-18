controle.compteur = function($scope) {
	// Endurance récupérée par repos

	$scope.compteurEnduPourRepos = function() {
		var endu = $scope.ihm.compteur.endu;
		var max = $scope.ihm.compteur.enduLimite;
		var cons = $scope.perso.carac.constitution.val;
		var recup = Math.floor($scope.ihm.recup.enduMn / config.caracFacteurTemps[cons]);
		if (endu + recup > max)
			recup = max - endu;
		return recup;
	};

	$scope.compteurMinutesPourRecupEnduTotale = function() {
		var recup = $scope.ihm.compteur.enduLimite - $scope.ihm.compteur.endu;
		var cons = $scope.perso.carac.constitution.val;
		return Math.ceil(recup) * config.caracFacteurTemps[cons];
	};

	$scope.compteurRepos = function() {
		var recup = $scope.compteurEnduPourRepos();
		if (recup == 0)
			return;

		if ($scope.perso.compteur.perteEnduHorsBlessure > 0) {
			if ($scope.perso.compteur.perteEnduHorsBlessure < recup) {
				recup -= $scope.perso.compteur.perteEnduHorsBlessure;
				$scope.perso.compteur.perteEnduHorsBlessure = 0;
			} else {
				$scope.perso.compteur.perteEnduHorsBlessure -= recup;
				return;
			}
		}
		var i, recuperable, blessures = $scope.perso.blessure;
		for (i = 0; i < blessures.length; i++) {
			recuperable = $scope.blessureEnduParRepos(blessures[i]);
			if (recuperable > 0) {
				if (recuperable <= recup) {
					recup -= recuperable;
					blessures[i].endu -= recuperable;
					blessures[i].recupEndu = false;
				} else {
					blessures[i].endu -= recup;
					return;
				}
			}
		}
	};

	// Fatigue récupérée par sommeil

	$scope.compteurFatiguePourSommeil = function() {
		var cons = $scope.perso.carac.constitution.val;
		var mn = $scope.ihm.recup.fatigueH * 120 + $scope.ihm.recup.fatigueMn;
		var recup = Math.floor((mn / 60) * config.caracFacteurResistance[cons]);
		return Math.min(recup, $scope.perso.compteur.fatigue);
	};

	$scope.compteurHeuresPourRecupFatigueTotale = function() {
		var recup = $scope.perso.compteur.fatigue;
		return Math.ceil(recup / config.caracFacteurResistance[$scope.perso.carac.constitution.val]) / 2;
	};

	// Watch

	$scope.$watch("perso.compteur.date.heure", function() {
		var date = $scope.perso.compteur.date;
		while (date.heure > 12) {
			date.jour++;
			date.heure -= 12;
		}
	});

	$scope.$watch("perso.compteur.date.jour", function(newVal, oldVal) {
		if (newVal == oldVal + 1 && $scope.perso.compteur.reve > $scope.perso.carac.reve.val) {
			$scope.perso.compteur.reve--;
			util.notify("Le changement de jour vous fait perdre 1 point de rêve actuel.");
		}
		var date = $scope.perso.compteur.date;
		while (date.jour > 28) {
			date.mois++;
			date.jour -= 28;
		}
		$scope.perso.compteur.date.heure = 1;
	});

	$scope.$watch("perso.compteur.date.mois", function() {
		var date = $scope.perso.compteur.date;
		while (date.mois > 12) {
			date.annee++;
			date.mois -= 12;
		}
	});

	$scope.$watch("perso.compteur.destinee",
			function() {
				if ($scope.perso.compteur.destinee == 0) {
					$scope.perso.carac.chance.val--;
					$scope.perso.compteur.destinee = $scope.perso.carac.chance.val;
					util.notify("Les points de destinée sont tombés à <span class='emphase'>0</span>,"
							+ " vous avez perdu <span class='emphase'>1</span> en caractéristique"
							+ " <span class='emphase'>chance</span>.<br/>Les points de"
							+ " <span class='emphase'>destinée</span> recommmencent à la valeur de votre"
							+ " caractéristique chance : <span class='emphase'>" + $scope.perso.compteur.destinee
							+ "</span>.");
				}
			});

	var computeMalus = function() {
		$scope.ihm.jet.malus = $scope.ihm.compteur.perteVie + $scope.ihm.compteur.fatigueMalus;
	};

	var computeEndu = function() {
		var i, b, e = service.compteur.enduMax($scope.perso);
		e -= defZero($scope.perso.compteur.perteVieHorsBlessure);
		var el = e;
		for (i = 0; i < $scope.perso.blessure.length; i++) {
			b = $scope.perso.blessure[i];
			e -= b.endu;
			el -= b.endu - $scope.blessureEnduParRepos(b);
		}
		e -= defZero($scope.perso.compteur.perteEnduHorsBlessure);
		$scope.ihm.compteur.enduLimite = el;
		$scope.ihm.compteur.endu = e <= el ? e : el;
	};
	$scope.$watch("perso.compteur.perteEnduHorsBlessure", computeEndu);

	var computeVie = function() {
		var i, perte = 0, endu;
		if ($scope.perso.compteur.perteVieHorsBlessure > 0)
			perte = $scope.perso.compteur.perteVieHorsBlessure;
		for (i = 0; i < $scope.perso.blessure.length; i++)
			if ($scope.perso.blessure[i].vie > 0)
				perte += $scope.perso.blessure[i].vie;
		$scope.ihm.compteur.perteVie = perte;
		$scope.ihm.compteur.vie = service.carac.vieMax($scope.perso.carac) - perte;
		computeEndu();
		computeMalus();
	};
	$scope.$watch("perso.compteur.perteVieHorsBlessure", computeVie);
	$scope.$watch("perso.blessure", computeVie, true);
	computeVie();

	var computeFatigueMalus = function() {
		var prev = $scope.ihm.compteur.fatigueMalus;
		var tmp = defZero($scope.perso.compteur.fatigue) * 2 - 1;
		tmp = Math.floor(tmp / service.compteur.enduMax($scope.perso));
		$scope.ihm.compteur.fatigueMalus = Math.max(0, tmp - 1);
		if ($scope.ihm.compteur.fatigueMalus != prev)
			computeMalus();
	};
	$scope.$watch("perso.compteur.fatigue", computeFatigueMalus);
	computeFatigueMalus();

	$scope.computeAvancement = function() {
		var i, c, xp = 0, niv = 0;
		for (i in $scope.perso.carac) {
			c = $scope.perso.carac[i];
			niv += c.val;
			if (c.xp !== undefined)
				xp += c.xp;
		}
		$scope.ihm.avancement.caracsNiv = niv - 180;
		$scope.ihm.avancement.caracsXP = xp;

		var j, v;
		xp = 0;
		for (i in $scope.perso.comp) {
			c = $scope.perso.comp[i];
			j = service.competence.min[c.type];
			v = service.competence.val(c);
			while (j < v)
				xp += service.competence.xpToUpFrom(j++);
			if (c.xp !== undefined)
				xp += c.xp;
		}
		$scope.ihm.avancement.comps = xp - ($scope.perso.id.hautRevant ? 2300 : 2800);
	};
};
