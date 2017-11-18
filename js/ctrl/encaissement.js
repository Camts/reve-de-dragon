controle.encaissement = function($scope) {
	var armure = ["basVentre", "mainBouclier", "mainBouclier", "poignetBouclier", "poignetBouclier",
			"avantBrasBouclier", "avantBrasBouclier", "avantBrasBouclier", "avantBrasBouclier", "coudeBouclier",
			"coudeBouclier", "genouxBouclier", "cuisseBouclier", "cuisseBouclier", "hancheBouclier", "hancheBouclier",
			"hancheBouclier", "hancheBouclier", "genouxArme", "cuisseArme", "cuisseArme", "hancheArme", "hancheArme",
			"hancheArme", "hancheArme", "cotesBouclier", "cotesBouclier", "cotesBouclier", "cotesBouclier",
			"cotesBouclier", "cotesBouclier", "cotesBouclier", "ventre", "ventre", "ventre", "ventre", "ventre",
			"ventre", "ventre", "ventre", "ventre", "cotesArme", "cotesArme", "cotesArme", "cotesArme", "cotesArme",
			"cotesArme", "cotesArme", "thorax", "thorax", "thorax", "thorax", "thorax", "thorax", "thorax", "thorax",
			"thorax", "thorax", "thorax", "thorax", "brasArme", "brasArme", "brasArme", "brasArme", "epauleArme",
			"epauleArme", "epauleArme", "epauleArme", "epauleArme", "epauleArme", "epauleArme", "avantBrasArme",
			"avantBrasArme", "avantBrasArme", "coudeArme", "coudeArme", "coudeArme", "poignetArme", "poignetArme",
			"mainArme", "mainArme", "brasBouclier", "brasBouclier", "brasBouclier", "brasBouclier", "brasBouclier",
			"brasBouclier", "epauleBouclier", "epauleBouclier", "epauleBouclier", "epauleBouclier", "epauleBouclier",
			"epauleBouclier", "cou", "cou", "visage", "visage", "crane", "crane", "crane"];

	var armureTexte = {
		avantBrasArme : "avant-bras de l'arme",
		avantBrasBouclier : "avant-bras du bouclier",
		basVentre : "bas-ventre",
		brasArme : "bras de l'arme",
		brasBouclier : "bras du bouclier",
		cotesArme : "côtes de l'arme",
		cotesBouclier : "côtes du bouclier",
		cou : "cou",
		coudeArme : "coude de l'arme",
		coudeBouclier : "coude du bouclier",
		crane : "crâne",
		cuisseArme : "cuisse de l'arme",
		cuisseBouclier : "cuisse du bouclier",
		epauleArme : "épaule de l'arme",
		epauleBouclier : "épaule du bouclier",
		genouxArme : "genoux de l'arme",
		genouxBouclier : "genoux du bouclier",
		hancheArme : "hanche de l'arme",
		hancheBouclier : "hanche du bouclier",
		mainArme : "main de l'arme",
		mainBouclier : "main du bouclier",
		poignetArme : "poignet de l'arme",
		poignetBouclier : "poignet du bouclier",
		thorax : "thorax",
		ventre : "ventre",
		visage : "visage"
	};

	/* localisation -> normal, significative, particuliere, critique */
	var localisation2grade = {
		avantBrasArme : [9, 12, 16, 22],
		avantBrasBouclier : [9, 12, 16, 22],
		basVentre : [12, 14, 17, 22],
		brasArme : [9, 12, 16, 22],
		brasBouclier : [9, 12, 16, 22],
		cotesArme : [10, 13, 18, 24],
		cotesBouclier : [10, 13, 18, 24],
		cou : [12, 15, 19, 25],
		coudeArme : [11, 13, 16, 22],
		coudeBouclier : [11, 13, 16, 22],
		crane : [10, 13, 17, 25],
		cuisseArme : [9, 12, 16, 22],
		cuisseBouclier : [9, 12, 16, 22],
		epauleArme : [11, 13, 16, 22],
		epauleBouclier : [11, 13, 16, 22],
		genouxArme : [11, 13, 16, 22],
		genouxBouclier : [11, 13, 16, 22],
		hancheArme : [10, 13, 17, 23],
		hancheBouclier : [10, 13, 17, 23],
		mainArme : [10, 12, 15, 20],
		mainBouclier : [10, 12, 15, 20],
		poignetArme : [11, 13, 16, 22],
		poignetBouclier : [11, 13, 16, 22],
		thorax : [11, 14, 18, 25],
		ventre : [9, 12, 15, 21],
		visage : [11, 13, 16, 22]
	};

	var protection = {
		T : [-3, 0, 2, 4, 5, 7, 10],
		C : [-3, -1, 2, 4, 6, 5, 8],
		P : [-3, -1, 1, 3, 6, 4, 7]
	};

	/* grade-1 -> endurance, vie, chances de saigner */
	var grade2perte = {
		T : [[1, 0, 0], [2, 0, 0], [3, 0, 0], [3, 0, 0], [3, 0, 0], [4, 0, 0], [4, 0, 0], [4, 0, 0], [5, 0, 0],
				[5, 0, 0], [6, 0, 0], [6, 0, 0], [7, 0, 0], [7, 0, 0], [8, 0, 0], [9, 0, 0], [10, 0, 0], [11, 0, 0],
				[12, 1, 0], [13, 2, 25], [14, 3, 5], [15, 4, 75], [17, 5, 100], [19, 6, 100], [21, 7, 100],
				[23, 8, 100], [26, 9, 100], [29, 10, 100], [32, 11, 100], [35, 12, 100], [39, 13, 100], [44, 14, 100],
				[50, 15, 100]],
		C : [[3, 0, 0], [4, 0, 0], [5, 0, 0], [6, 0, 0], [6, 0, 0], [7, 0, 0], [7, 0, 0], [7, 0, 0], [8, 0, 0],
				[8, 0, 0], [9, 0, 0], [9, 0, 0], [10, 0, 0], [10, 0, 0], [11, 0, 0], [12, 0, 0], [13, 0, 0],
				[15, 0, 0], [16, 0, 0], [17, 0, 0], [18, 1, 10], [19, 1, 25], [21, 2, 45], [23, 2, 70], [25, 3, 95],
				[27, 4, 100], [30, 5, 100], [34, 6, 100], [37, 7, 100], [41, 8, 100], [45, 9, 100], [50, 11, 100],
				[57, 12, 100]],
		P : [[1, 0, 0], [1, 0, 0], [2, 0, 0], [2, 0, 0], [2, 0, 0], [2, 0, 0], [2, 0, 0], [3, 0, 0], [3, 0, 0],
				[3, 0, 0], [3, 0, 0], [4, 0, 0], [4, 0, 0], [4, 0, 0], [5, 0, 0], [5, 0, 0], [5, 1, 0], [6, 1, 5],
				[6, 2, 10], [7, 2, 15], [7, 3, 22], [9, 3, 32], [11, 4, 45], [13, 4, 60], [15, 5, 78], [17, 6, 98],
				[20, 7, 100], [23, 8, 100], [27, 9, 100], [31, 10, 100], [35, 11, 100], [40, 12, 100], [45, 13, 100]]
	};

	$scope.encaissementTypeArmure = ["Peau nue", "Vêtements", "Cuir normal", "Cuir rigide", "Cuir + métal",
			"Côte de mailles", "Mailles + plaque"];

	$scope.encaissementValid = function() {
		var localisationDes = util.rand(100);
		var localisation = armure[localisationDes - 1];
		var prot = $scope.perso.eqmt.armure[localisation];
		var reussite = $scope.ihm.encaissement.reussite == "0" ? "normale"
				: $scope.ihm.encaissement.reussite == "1" ? "significative"
						: $scope.ihm.encaissement.reussite == "s" ? "particulière" : "critique";
		var type = $scope.ihm.encaissement.type == "T" ? "tranchant"
				: $scope.ihm.encaissement.type == "C" ? "contandant" : "pointe";
		var grade = localisation2grade[localisation][$scope.ihm.encaissement.reussite];
		grade += $scope.ihm.encaissement.dom;
		grade -= protection[$scope.ihm.encaissement.type][prot.val] + prot.bonus;
		var endu2vie = 0, perte = grade2perte[$scope.ihm.encaissement.type][grade - 1];
		if (perte[0] > $scope.ihm.compteur.endu) {
			endu2vie = perte[0] - $scope.ihm.compteur.endu;
			perte[0] -= endu2vie;
			perte[1] += endu2vie;
		}

		var msg = "<div>Encaissement : dommage <span class='emphase'>" + $scope.ihm.encaissement.dom
				+ "</span>, réussite <span class='emphase'>" + reussite + "</span>, type <span class='emphase'>" + type
				+ "</span></div><div>Locatisation <span class='emphase'>" + localisationDes
				+ "</span> : <span class='emphase'>" + armureTexte[localisation]
				+ "</span>, protection <span class='emphase'>" + prot.val + "</span>";
		if (prot.bonus > 0)
			msg += " bonus <span class='emphase'>+" + prot.bonus + "</span>";
		msg += "</div><div>Blessure : grade <span class='emphase'>" + grade + "</span>, perte <span class='emphase'>"
				+ perte[0] + "</span> endurance";
		if (perte[1] > 0)
			msg += " et <span class='emphase'>" + perte[1] + "</span> vie";

		var saigne;
		if (perte[2] > 0 && perte[2] < 100) {
			saigne = util.rand(100) <= perte[2];
			msg += "</div><div><span class='emphase'>" + perte[2] + "%</span> de chances de saigner";
		} else
			saigne == perte[2] == 100;
		if (saigne)
			msg += ", <img src='img/blood.png'/> <span class='emphase'>saignement</span>";
		else
			msg += ", <span class='emphase'>pas</span> de saignement"

		if (endu2vie > 0)
			msg += "</div><div><span class='emphase'>" + endu2vie
					+ "</span> point d'endurance perdus transformés en points de vie perdus par manque d'endurance";
		msg += "</div>";
		util.notify(msg);

		$scope.perso.blessure.push({
			grade : grade,
			type : $scope.ihm.encaissement.type,
			localisation : armureTexte[localisation],
			jours : grade,
			date : {
				heure : $scope.perso.compteur.date.heure,
				jour : $scope.perso.compteur.date.jour,
				mois : $scope.perso.compteur.date.mois,
				annee : $scope.perso.compteur.date.annee
			},
			endu : perte[0],
			vie : perte[1],
			saigne : saigne,
			recupEndu : true,
			soin : undefined
		});
	};
}