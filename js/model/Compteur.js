"use strict";
// jshint esversion: 6

class Compteur {
	constructor(perso, data) {
		if (!data)
			data = {
				date : {
					heure : 1,
					jour : 1,
					mois : 1,
					annee : 1
				},
				destinee : 0,
				moral : 0,
				xpEndu : 0,
				reve : 0,
				stress : 0,
				perteVieHorsBlessure : 0,
				perteEnduHorsBlessure : 0,
				fatigue : 0
			};

		this[pPerso] = perso;
		this[pPerteVieHorsBlessure] = 0;
		this[pPerteVie] = 0;
		this[pXpEndu] = 0;
		this[pEnduLimite] = this[pPerso].carac.enduMax;
		this.enduMax = this[pEnduLimite];
		this[pPerteEnduHorsBlessure] = 0;
		this[pPerteEndu] = 0;
		this[pEndu] = 0;
		this[pFatigue] = 0;
		this[pFatigueMalus] = 0;
		this[pMalus] = 0;

		this.date = new CompteurDate(perso, data.date);
		this.destinee = defZero(data.destinee);
		this.moral = defZero(data.moral);
		this.xpEndu = defZero(data.xpEndu);
		this.endu = this.enduMax;
		this.reve = defZero(data.reve);
		this.stress = defZero(data.stress);
		this.perteVieHorsBlessure = defZero(data.perteVieHorsBlessure);
		this.perteEnduHorsBlessure = defZero(data.perteEnduHorsBlessure);
		this.fatigue = defZero(data.fatigue);
		// Computed: perteVie, enduLimite, enduMax, perteEndu, endu,
		// fatigueMalus, malus
	}

	toData() {
		return {
			date : this.date.toData(),
			destinee : this.destinee,
			moral : this.moral,
			xpEndu : this.xpEndu,
			reve : this.reve,
			stress : this.stress,
			perteVieHorsBlessure : this.perteVieHorsBlessure,
			perteEnduHorsBlessure : this.perteEnduHorsBlessure,
			fatigue : this.fatigue
		};
	}

	get destinee() {
		return this[pDestinee];
	}
	set destinee(val) {
		if (val === undefined)
			val = 0;
		if (val == this[pDestinee])
			return;
		if (this[pDestinee] !== undefined && val == 0) {
			this[pPerso].carac.chance.val--;
			this[pDestinee] = perso.carac.chance.val;
			util.notify("Les points de destinée sont tombés à <span class='emphase'>0</span>,"
					+ " vous avez perdu <span class='emphase'>1</span> en caractéristique"
					+ " <span class='emphase'>chance</span>.<br/>Les points de"
					+ " <span class='emphase'>destinée</span> recommmencent à la valeur de votre"
					+ " caractéristique chance : <span class='emphase'>" + this[pDestinee] + "</span>.");
		} else
			this[pDestinee] = val;
	}

	// Vie

	get perteVieHorsBlessure() {
		return this[pPerteVieHorsBlessure];
	}
	set perteVieHorsBlessure(val) {
		if (val === undefined || val < 0)
			val = 0;
		if (val == this[pPerteVieHorsBlessure])
			return;
		let diff = val - this[pPerteVieHorsBlessure];
		this[pPerteVieHorsBlessure] = val;
		this.perteVie += diff;
	}

	get perteVie() {
		return this[pPerteVie];
	}
	set perteVie(val) {
		if (val === undefined || val < 0)
			val = 0;
		if (val == this[pPerteVie])
			return;
		let diff = val - this[pPerteVie];
		this[pPerteVie] = val;
		this.malus += diff;
	}

	// Endu

	get xpEndu() {
		return this[pXpEndu];
	}
	set xpEndu(val) {
		if (val === undefined || val < 0)
			val = 0;
		if (val == this[pXpEndu])
			return;
		let diff = val - this[pXpEndu];
		this[pXpEndu] = val;
		this.enduMax += diff;
		this.enduLimite += diff;
		this.endu += diff;
	}

	get enduLimite() {
		return this[pEnduLimite];
	}
	set enduLimite(val) {
		if (val === undefined)
			val = 0;
		if (val == this[pEnduLimite])
			return;
		let diff = val - this[pEnduLimite];
		this[pEnduLimite] = val;
	}

	get perteEnduHorsBlessure() {
		return this[pPerteEnduHorsBlessure];
	}
	set perteEnduHorsBlessure(val) {
		if (val === undefined || val < 0)
			val = 0;
		if (val == this[pPerteEnduHorsBlessure])
			return;
		let diff = val - this[pPerteEnduHorsBlessure];
		this[pPerteEnduHorsBlessure] = val;
		this.perteEndu += diff;
	}

	get perteEndu() {
		return this[pPerteEndu];
	}
	set perteEndu(val) {
		if (val === undefined)
			val = 0;
		if (val == this[pPerteEndu])
			return;
		if (val > this.enduMax)
			console.warn("Perte endu > endu max");
		let diff = val - this[pPerteEndu];
		this[pPerteEndu] = val;
		this.endu -= diff;
	}

	get endu() {
		return this[pEndu];
	}
	set endu(val) {
		if (val == this[pEndu])
			return;
		let diff = val - this[pEndu];
		this[pEndu] = val;
		if (diff < 0)
			this.fatigue -= diff;
	}

	// Fatigue

	get fatigue() {
		return this[pFatigue];
	}
	set fatigue(val) {
		if (val === undefined || val < 0)
			val = 0;
		if (val == this[pFatigue])
			return;
		this[pFatigue] = val;
		let tmp = val * 2 - 1;
		tmp = Math.floor(tmp / this.enduMax);
		this.fatigueMalus = Math.max(0, tmp - 1);
	}

	get fatigueMalus() {
		return this[pFatigueMalus];
	}
	set fatigueMalus(val) {
		if (val === undefined)
			val = 0;
		if (val == this[pFatigueMalus])
			return;
		let diff = val - this[pFatigueMalus];
		this[pFatigueMalus] = val;
		this.malus += diff;
	}

	sommeil() {
		this.fatigue -= this[pPerso].fatiguePourSommeil();
	}

	// Malus global

	get malus() {
		return this[pMalus];
	}
	set malus(val) {
		if (val === undefined)
			val = 0;
		if (val == this[pMalus])
			return;
		let i, diff = val - this[pMalus];
		this[pMalus] = val;
		for (i in this[pPerso].eqmt.arme) {
			let arme = this[pPerso].eqmt.arme[i];
			if (arme.constructor == Arme) {
				arme.computeSeuils();
				arme.computeInit();
			}
		}
	}
}

class CompteurDate {
	constructor(perso, data) {
		this[pPerso] = perso;
		this.annee = data.annee;
		this.mois = data.mois;
		this.jour = data.jour;
		this.heure = data.heure;
	}

	toData() {
		return {
			heure : this.heure,
			jour : this.jour,
			mois : this.mois,
			annee : this.annee
		}
	}

	get heure() {
		return this[pHeure];
	} 
	set heure(val) {
		if (isNaN(val) || val < 1 || val === this[pHeure])
			return;
		while (val > 12) {
			this.jour++;
			val -= 12;
		}
		this[pHeure] = val;
	}

	get jour() {
		return this[pJour];
	}
	set jour(val) {
		if (isNaN(val) || val < 1 || val === this[pJour])
			return;
		if (val == this[pJour] + 1 && this[pPerso].compteur.reve > this[pPerso].carac.reve.val) {
			this[pPerso].compteur.reve--;
			util.notify("Le changement de jour vous fait perdre 1 point de rêve actuel.");
		}
		while (val > 28) {
			this.mois++;
			val -= 28;
		}
		this[pJour] = val;
		this.heure = 1;
	}

	get mois() {
		return this[pMois];
	}
	set mois(val) {
		while (val > 12) {
			this.annee++;
			val -= 12;
		}
		this[pMois] = val;
	}
}