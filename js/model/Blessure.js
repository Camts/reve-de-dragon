"use strict";
// jshint esversion: 6

class Blessure {
	constructor(perso, data) {
		this[pPerso] = perso;
		this[pPerso].blessure.push(this);
		this[pVie] = 0;
		this[pEndu] = 0;
		this[pRecupEndu] = undefined;

		this.grade = data.grade;
		this.type = data.type;
		this.localisation = data.localisation;
		this.jours = data.jours;
		this.heure = data.heure;
		this.vie = data.vie;
		this.endu = data.endu;
		this.saigne = data.saigne;
		this.herbes = data.herbes ? JSON.parse(JSON.stringify(data.herbes)) : undefined;
		this.recupEndu = data.recupEndu !== undefined ? data.recupEndu : Math.floor(this.endu / 2) - this.vie;
		this.soin = data.soin;
	}

	toData() {
		return {
			grade : this.grade,
			type : this.type,
			localisation : this.localisation,
			jours : this.jours,
			heure : this.heure,
			vie : this.vie,
			endu : this.endu,
			saigne : this.saigne,
			herbes : this.herbes,
			recupEndu : this.recupEndu,
			soin : this.soin
		};
	}

	get vie() {
		return this[pVie];
	}
	set vie(val) {
		if (val === undefined)
			val = 0;
		if (val == this[pVie])
			return;
		let diff = val - this[pVie];
		this[pVie] = val;
		this[pPerso].compteur.perteVie += diff;
	}

	get endu() {
		return this[pEndu];
	}
	set endu(val) {
		if (val === undefined)
			val = 0;
		if (val == this[pEndu])
			return;
		let diff = val - this[pEndu];
		this[pEndu] = val;
		this[pPerso].compteur.perteEndu += diff;
	}

	get recupEndu() {
		return this[pRecupEndu];
	}
	set recupEndu(val) {
		if (val === undefined)
			val = 0;
		if (val == this[pRecupEndu])
			return;
		if (this[pRecupEndu] == undefined) { // init
			this[pPerso].compteur.enduLimite -= this.endu - val;
		} else {
			this.endu += val - this[pRecupEndu];
		}
		this[pRecupEndu] = val;
	}

	texteSoin() {
		let out, mini = Blessure.refMini[this.grade];
		if (mini[0] == 0)
			out = "Aucune herbe n'est nécessaire";
		else
			out = "Au moins " + mini[0] + (mini[0] > 1 ? " brins" : " brin") + " de " + Blessure.herbe[mini[1]];
		return out;
	}

	herbeNecessaireEtSuffisant() {
		let herbes = this[pPerso].ihm.herbes;
		let mini = Blessure.refMini[this.grade];
		if (mini[0] == 0)
			return false; // Herbes non nécessaires
		return Blessure.herbe.indexOf(herbes.qualite) >= mini[1] && herbes.bruns >= mini[0];
	}

	appliqueHerbe(heure, qualite, bruns) {
		this.date = {
			heure : this[pPerso].compteur.date.heure,
			jour : this[pPerso].compteur.date.jour,
			mois : this[pPerso].compteur.date.mois,
			annee : this[pPerso].compteur.date.annee
		};
		this.herbes = {
			qualite : Blessure.herbe.indexOf(this[pPerso].ihm.herbes.qualite),
			bruns : this[pPerso].ihm.herbes.bruns
		};
	}

	incrRound() {
		if (this.saigne)
			this.vie ++;
	}

	suppr() {
		this.vie = 0;
		this[pPerso].compteur.enduLimite += this.endu - this.recupEndu;
		this.recupEndu = 0;
		this.endu = 0;
		this[pPerso].blessure.splice(this[pPerso].blessure.indexOf(this), 1);
	}
};

Blessure.herbe = ["Fausse Suppure", "Suppure", "Méritoine", "Ortigal", "Ortigal Noir", "Belidane", "Faux Murus", "Murus", "Tanemiel", "Tanemiel Dorée"];

// grade -> [bruns, qualite]
Blessure.refMini = [[0], [0], [0], [0], [0], [0], [0], [0], [1, 0], [2, 0], [3, 1], [3, 1], [3, 2], [4, 2], [4, 3],
		[5, 3], [5, 4], [6, 4], [6, 5], [7, 5], [7, 6], [8, 6], [8, 7], [9, 7], [9, 8], [10, 8], [10, 9], [11, 9],
		[12, 9], [13, 9], [14, 9], [15, 9], [16, 9], [17, 9]];