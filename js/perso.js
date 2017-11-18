app.controller("persoCtrl", ['$scope', function($scope) {
	$scope.ihm = {
		mode : undefined,
		background : undefined,
		archetype : {
			values : [{
				value : 0,
				restant : 100
			}, {
				value : 1,
				restant : 10
			}, {
				value : 2,
				restant : 9
			}, {
				value : 3,
				restant : 8
			}, {
				value : 4,
				restant : 7
			}, {
				value : 5,
				restant : 6
			}, {
				value : 6,
				restant : 5
			}, {
				value : 7,
				restant : 4
			}, {
				value : 8,
				restant : 3
			}, {
				value : 9,
				restant : 2
			}, {
				value : 10,
				restant : 1
			}, {
				value : 11,
				restant : 1
			}],
			emphase : undefined
		},
		xp : {
			jet : undefined,
			restant : undefined,
			invalid : 0,
			valid : []
		},
		avancement : {
			caracs : undefined,
			comps : undefined
		},
		compteur : {
			perteVie : undefined,
			vie : undefined,
			enduLimite : undefined,
			endu : undefined,
			fatigueMalus : undefined
		},
		recup : {
			enduMn : 0,
			fatigueH : 0,
			fatigueMn : 0
		},
		jet : {
			malus : undefined,
			carac : {
				val : undefined,
				nom : undefined
			},
			comp : {
				val : undefined,
				nom : undefined
			},
			diff : undefined,
			seuil : {
				crit : undefined,
				part : undefined,
				sign : undefined,
				norm : undefined,
				total : undefined
			}
		},
		encaissement : {
			dom : 0,
			reussite : "0", /* 0=n, 1=s, 2=p, 3=c */
			type : "T"
		},
		herbes : {
			qualite : "Fausse Suppure",
			bruns : 1
		},
		magie : {
			typeCase : undefined,
			sortNew : {
				voie : "oniros",
				typeCase : "CITE",
				diff : -1,
				conso : 1
			},
			sortVu : undefined,
			sortBonusTexte : {},
			sortEdit : -1,
			sortDetail : "",
			castVar : 0,
			castAstro : 0,
			rencontre : 0
		}
	};

	if (service.dao.fs) {
		if (service.dao.fs.existsSync(service.dao.dataDir + "/bg.png"))
			$scope.ihm.background = service.dao.dataDir + "/bg.png";
		else if (service.dao.fs.existsSync(service.dao.dataDir + "/bg.jpg"))
			$scope.ihm.background = service.dao.dataDir + "/bg.jpg";
	}

	if ($scope.ihm.background) {
		var url = $scope.ihm.background.replace(new RegExp("\\\\", 'g'), "/");
		document.getElementsByTagName("body")[0].style.backgroundImage = 'url("file:///' + url + '")';
	}

	$scope.service = service;

	ctrls = [];
	ctrls.push(controle.archetype);
	ctrls.push(controle.blessure);
	ctrls.push(controle.compteur);
	ctrls.push(controle.compToutes);
	ctrls.push(controle.encaissement);
	ctrls.push(controle.jet);
	ctrls.push(controle.rencontre);
	ctrls.push(controle.sacs);
	ctrls.push(controle.sort);
	ctrls.push(controle.stress);
	ctrls.push(controle.terresMedianes);
	var i, ctrl;
	for (i = 0; i < ctrls.length; i++) {
		ctrl = ctrls[i];
		if (ctrl)
			ctrl($scope);
	}

	setTimeout(function() {
		util.setNumberInputsWidth(document);

		zone.setConfig(document.getElementById("cadres-normal"), $scope.zones.normal);
		zone.setConfig(document.getElementById("cadres-magie"), $scope.zones.magie);

		service.pref.applyAll($scope.display.pref);
	}, 1000);
}]);