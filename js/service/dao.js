"use strict";
// jshint esversion: 6

service.dao = {
	initialPersoData : {
		id : {
			nom : "",
			hautRevant : true,
			sexe : "M",
			age : 20,
			heure : 1,
			taille : "1m70",
			poids : undefined,
			cheveux : "",
			yeux : "",
			signePart : ""
		},
		carac : { /* $nom : {val: , xp: } */
		},
		comp : { /* $nom {type: , val: , arch: , xp: } */
		},
		magie : {
			terreMediane : "G7",
			monte : false,
			sorts : [/*
						 * { voie : "hypnos", nom : "Abc", typeCase : "PLAINES",
						 * diff : -1, conso : 1, portee : undefined, variable :
						 * true, rituel : false, bonus : { G8 : 12, I7 : 5 },
						 * detail : "Détail abc" }
						 */],
			reserve : {/* G8 : "Abc" */}
		},
		compteur : {
			date : {
				heure : 10,
				jour : 21,
				mois : 7,
				annee : 3456
			},
			destinee : 6,
			moral : 0,
			xpEndu : undefined,
			reve : 6,
			stress : undefined,
			perteVieHorsBlessure : undefined,
			perteEnduHorsBlessure : undefined,
			fatigue : 0
		},
		combat : {
			diff : {
				att : 0,
				dist : 0,
				def : 0
			},
			round : undefined,
			sonne : undefined
		},
		blessure : [/*
					 * { grade: 17, type : "T", localisation : "thorax", jours :
					 * 1, heure : 10, endu : 5, vie : 1, saigne : false, herbes : {
					 * qualite : 4, bruns : 6 }, recupEndu : false, soin :
					 * undefined }
					 */],
		eqmt : { /* equipement */
			monnaie : {
				etain : 0,
				bronze : 0,
				argent : 0,
				or : 0
			},
			herbe : {
				soin : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				lune : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			},
			arme : {/* comp : {nom:, bonus:, dt:, dc:, dp:, res:, enc:} */},
			armure : {
				aventure : {
					hancheArme : {
						val : 0,
						bonus : 0
					},
					crane : {
						val : 0,
						bonus : 0
					},
					hancheBouclier : {
						val : 0,
						bonus : 0
					},
					cuisseArme : {
						val : 0,
						bonus : 0
					},
					visage : {
						val : 0,
						bonus : 0
					},
					cuisseBouclier : {
						val : 0,
						bonus : 0
					},
					genouxArme : {
						val : 0,
						bonus : 0
					},
					cou : {
						val : 0,
						bonus : 0
					},
					genouxBouclier : {
						val : 0,
						bonus : 0
					},
					epauleArme : {
						val : 0,
						bonus : 0
					},
					thorax : {
						val : 0,
						bonus : 0
					},
					epauleBouclier : {
						val : 0,
						bonus : 0
					},
					brasArme : {
						val : 0,
						bonus : 0
					},
					cotesArme : {
						val : 0,
						bonus : 0
					},
					brasBouclier : {
						val : 0,
						bonus : 0
					},
					coudeArme : {
						val : 0,
						bonus : 0
					},
					ventre : {
						val : 0,
						bonus : 0
					},
					coudeBouclier : {
						val : 0,
						bonus : 0
					},
					avantBrasArme : {
						val : 0,
						bonus : 0
					},
					cotesBouclier : {
						val : 0,
						bonus : 0
					},
					avantBrasBouclier : {
						val : 0,
						bonus : 0
					},
					poignetArme : {
						val : 0,
						bonus : 0
					},
					basVentre : {
						val : 0,
						bonus : 0
					},
					poignetBouclier : {
						val : 0,
						bonus : 0
					},
					mainArme : {
						val : 0,
						bonus : 0
					},
					mainBouclier : {
						val : 0,
						bonus : 0
					}
				}
			},
			armureCourante : "aventure",
			sac : [{
				nom : "Ceinture",
				liste : [/* {nom:, qte:}, {nom:, qte:} */]
			}, {
				nom : "Besace",
				liste : []
			}, {
				nom : "Grand sac",
				liste : []
			}, {
				nom : "Monture",
				liste : []
			}]
		}
	},

	initialPersoDisplay : {
		pref : {
			background : 0,
			zoom : 100,
			zones : false,
			archetype : false,
			compMin : -11,
			compToutes : false
		},
		cadre : {
			jet : "h",
			compToutesCols : 5,
			identite : {
				heure : "bottom"
			},
			combat : {
				eqmt : false
			},
			blessures : {
				detail : false,
				heure : "middle"
			},
			magieSort : {
				actions : true
			}
		},
		round : undefined,
		sac : [["Ceinture", "Besace", "Grand sac"], ["Monture"]]
	},

	initialPersoIhm : {
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
			vie : 0
		},
		recup : {
			enduMn : 0,
			fatigueH : 0
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
	},

	initialPersoZones : {
		normal : [[
				[
						[
								[["cadre-identite"], ["cadre-caracs"], ["cadre-jet"]],
								[["cadre-attributs"], ["cadre-date"], ["cadre-vie"], ["cadre-endurance"],
										["cadre-fatigue"]]], ["cadre-compteurs", "cadre-round"]],
				[
						["cadre-comp-toutes", [["cadre-comp-gen"], ["cadre-comp-drac"]], "cadre-comp-combat",
								"cadre-comp-part", [["cadre-comp-spe"], ["cadre-comp-conn"]]],
						[[["cadre-encaissement"], ["cadre-blessures"]], "cadre-combat"]]]],
		eqmt : [["cadre-sacs", [["cadre-armure"], ["cadre-herbes", "cadre-monnaie"]]]],
		magie : [["cadre-magie-terres-medianes",
				[["cadre-magie-drac", "cadre-magie-compteurs", "cadre-magie-rencontre"], ["cadre-magie-sorts"]]]]
	},

	initialPnjsData : {
		joueurs : [],
		persos : [],
		modeles : []
	},

	initialPnjsDisplay : {
		pref : {
			background : 0,
			zoom : 100,
			zones : false,
			archetype : false,
			compMin : -11,
			compToutes : false
		},
		cadre : {
			jet : "h",
			compToutesCols : 5,
			identite : {
				heure : "bottom"
			},
			combat : {
				eqmt : true
			},
			blessures : {
				detail : false,
				heure : "middle"
			}
		},
		round : undefined
	},

	initialPnjsZones : [[
			[["cadre-round"], ["cadre-joueurs"], ["cadre-persos"], ["cadre-modeles"]],
			[["cadre-identite"], ["cadre-caracs", "cadre-assignation"], ["cadre-jet"],
					[[["cadre-attributs"], ["cadre-endurance"]], [["cadre-vie"], ["cadre-fatigue"]]]],
			[["cadre-comp-pnjs", [["cadre-encaissement"], ["cadre-armure"], ["cadre-blessures"]]], ["cadre-combat"]]]],

	initialIhmGlobal : {
		mode : undefined,
		modeArchetype : false,
		background : undefined,
		archetype : {
			emphase : undefined
		},
		jet : {
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
		}
	},

	fs : undefined,
	dataDir : undefined,

	loadPerso : function() {
		let perso, display, zones;
		if (service.dao.fs != undefined) {
			if (!service.dao.fs.existsSync(service.dao.dataDir))
				service.dao.fs.mkdirSync(service.dao.dataDir);

			if (service.dao.fs.existsSync(service.dao.dataDir + "/perso.json")) {
				perso = JSON.parse(service.dao.fs.readFileSync(service.dao.dataDir + "/perso.json"));
				service.dao.upgradeData(perso);
				service.dao.merge("perso", perso, service.dao.initialPersoData);
			} else
				perso = service.dao.initialPersoData;

			if (service.dao.fs.existsSync(service.dao.dataDir + "/display.json")) {
				display = JSON.parse(service.dao.fs.readFileSync(service.dao.dataDir + "/display.json"));
				service.dao.merge("display", display, service.dao.initialPersoDisplay);
			} else
				display = service.dao.initialPersoDisplay;

			if (service.dao.fs.existsSync(service.dao.dataDir + "/zones.json")) {
				zones = JSON.parse(service.dao.fs.readFileSync(service.dao.dataDir + "/zones.json"));
				service.dao.upgradePersoZones(zones);
			} else {
				zones = service.dao.initialPersoZones;
				service.dao.upgradePersoZones(zones);
			}
		} else {
			perso = service.dao.initialPersoData;
			display = service.dao.initialPersoDisplay;
			zones = service.dao.initialPersoZones;
		}

		service.dao.data = {
			perso : perso,
			display : display,
			zones : zones,
		};

		return service.dao.data;
	},

	savePerso : function() {
		if (service.dao.fs != undefined) {
			let perso = service.dao.data.perso.toData();
			service.dao.removeHashKeys(perso);
			service.dao.fs.writeFileSync(service.dao.dataDir + "/perso.json", JSON.stringify(perso, null, 2));

			service.dao.displayVerifySacs();
			let display = service.dao.data.display;
			service.dao.removeHashKeys(display);
			service.dao.fs.writeFileSync(service.dao.dataDir + "/display.json", JSON.stringify(display, null, 2));

			service.dao.fs.writeFileSync(service.dao.dataDir + "/zones.json", JSON.stringify({
				normal : zone.getConfig("cadres-normal"),
				eqmt : zone.getConfig("cadres-eqmt"),
				magie : zone.getConfig("cadres-magie")
			}, null, 2));
		}
	},

	loadPNJs : function() {
		let pnjs, display, zones;
		if (service.dao.fs != undefined) {
			if (!service.dao.fs.existsSync(service.dao.dataDir))
				service.dao.fs.mkdirSync(service.dao.dataDir);

			if (service.dao.fs.existsSync(service.dao.dataDir + "/pnjs-persos.json")) {
				pnjs = JSON.parse(service.dao.fs.readFileSync(service.dao.dataDir + "/pnjs-persos.json"));
				if (pnjs.joueurs === undefined)
					pnjs.joueurs = [];
				let i;
				for (i = 0; i < pnjs.persos.length; i++) {
					service.dao.upgradeData(pnjs.persos[i]);
					service.dao.merge("persos[" + i + "]", pnjs.persos[i], service.dao.initialPersoData);
				}
				for (i = 0; i < pnjs.modeles.length; i++) {
					service.dao.upgradeData(pnjs.modeles[i]);
					service.dao.merge("modeles[" + i + "]", pnjs.modeles[i], service.dao.initialPersoData);
				}
			} else {
				pnjs = service.dao.initialPnjsData;
			}

			if (service.dao.fs.existsSync(service.dao.dataDir + "/pnjs-display.json")) {
				display = JSON.parse(service.dao.fs.readFileSync(service.dao.dataDir + "/pnjs-display.json"));
				service.dao.merge("display", display, service.dao.initialPnjsDisplay);
			} else
				display = service.dao.initialPnjsDisplay;

			if (service.dao.fs.existsSync(service.dao.dataDir + "/pnjs-zones.json"))
				zones = JSON.parse(service.dao.fs.readFileSync(service.dao.dataDir + "/pnjs-zones.json"));
			else
				zones = service.dao.initialPnjsZones;
		} else {
			pnjs = service.dao.initialPnjsData;
			display = service.dao.initialPnjsDisplay;
			zones = service.dao.initialPnjsZones;
		}

		service.dao.data = {
			joueurs : pnjs.joueurs,
			persos : pnjs.persos,
			modeles : pnjs.modeles,
			display : display,
			zones : zones,
		};

		return service.dao.data;
	},

	savePNJs : function() {
		if (service.dao.fs != undefined) {
			service.dao.removeHashKeys(service.dao.data.joueurs);
			let i, pnjs = {
				joueurs : service.dao.data.joueurs,
				persos : [],
				modeles : []
			};
			for (i in service.dao.data.persos) {
				let perso = service.dao.data.persos[i].toData();
				service.dao.removeHashKeys(perso);
				pnjs.persos.push(perso);
			}
			for (i in service.dao.data.modeles) {
				let modele = service.dao.data.modeles[i].toData();
				service.dao.removeHashKeys(modele);
				pnjs.modeles.push(modele);
			}
			service.dao.fs.writeFileSync(service.dao.dataDir + "/pnjs-persos.json", JSON.stringify(pnjs, null, 2));

			let display = service.dao.data.display;
			service.dao.removeHashKeys(display);
			service.dao.fs.writeFileSync(service.dao.dataDir + "/pnjs-display.json", JSON.stringify(display, null, 2));

			service.dao.fs.writeFileSync(service.dao.dataDir + "/pnjs-zones.json", JSON.stringify(zone
					.getConfig("cadres-pnjs"), null, 2));
		}
	},

	merge : function(path, data, from) {
		if (from instanceof Array) {
			let i = 0;
			while (i < data.length) {
				if (from[i] instanceof Object)
					service.dao.merge(path + "[" + i + "]", data[i], from[i])
				i++;
			}
			while (i < from.length) {
				util.notify("Merge : add " + path + "[" + i + "]");
				data.push(from[i]);
				i++;
			}
		} else if (from instanceof Object) {
			for ( let attr in from)
				if (from[attr] !== undefined)
					if (data[attr] !== undefined) {
						if (from[attr] instanceof Object)
							service.dao.merge(path + "." + attr, data[attr], from[attr]);
					} else {
						util.notify("Merge : add " + path + "." + attr);
						data[attr] = from[attr];
					}
		}
	},

	removeHashKeys : function(data) {
		if (data instanceof Array) {
			for (let i = 0; i < data.length; i++)
				if (data[i] instanceof Object)
					service.dao.removeHashKeys(data[i])
		} else if (data instanceof Object)
			for ( let attr in data)
				if (attr == "$$hashKey")
					data[attr] = undefined;
				else if (data[attr] instanceof Object)
					service.dao.removeHashKeys(data[attr]);
	},

	displayVerifySacs : function() {
		let display = service.dao.data.display.sac;
		let sacs = service.dao.data.perso.eqmt.sac;
		let i, j, col, nom, noms = {};
		for (i = 0; i < sacs.length; i++)
			noms[sacs[i].nom] = false;
		i = 0;
		while (i < display.length) {
			j = 0;
			while (j < display[i].length) {
				nom = display[i][j];
				if (noms[nom]) {
					display[i].splice(j, 1);
				} else {
					noms[nom] = true;
					j++;
				}
			}
			if (display[i].length == 0)
				display.splice(i, 1);
			else
				i++;
		}
		for (nom in noms) {
			if (!noms[nom])
				display.push([nom]);
		}
	},

	upgradeData : function(perso) {
		// armure : 1 set to several
		let tmp = perso.eqmt.armure;
		if (tmp.crane && tmp.crane.val != undefined) {
			perso.eqmt.armure = {};
			perso.eqmt.armure.aventure = tmp;
			perso.eqmt.armureCourante = "aventure";
			util.notify("Armure unique gardée dans le set \"aventure\"");
		}
	},

	upgradePersoZones : function(zones) {
		// add eqmt if missing
		if (!zones.eqmt) {
			let removeMovedToEqmt = function(arr) {
				let i = arr.indexOf("cadre-herbes");
				if (i != -1)
					arr.splice(i, 1);
				i = arr.indexOf("cadre-monnaie");
				if (i != -1)
					arr.splice(i, 1);
				i = arr.indexOf("cadre-sacs");
				if (i != -1)
					arr.splice(i, 1);
				i = 0;
				while (i < arr.length) {
					if (typeof (arr[i]) != "string") {
						removeMovedToEqmt(arr[i]);
						if (arr[i].length == 0)
							arr.splice(i, 1);
						else
							i++;
					} else
						i++;
				}
			};
			removeMovedToEqmt(zones.normal);
			zones.eqmt = service.dao.initialPersoZones.eqmt;
			util.notify("Cadres déplacés de la vue normale à la vue équipement");
		}
	}
};

// Initialisation
if (typeof (require) != "undefined") {
	service.dao.fs = require("fs");
	service.dao.dataDir = process.env.APPDATA + "/reve-de-dragon";

	let gui = require('nw.gui');
	if (gui) {
		let win = gui.Window.get();
		win.on('close', function() {
			if (document.body.id == "pnjs")
				service.dao.savePNJs()
			else
				service.dao.savePerso();
			gui.App.quit();
		});
	}
}