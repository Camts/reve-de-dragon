"use strict";
// jshint esversion: 6

class Perso {
	constructor(data, isModele) {
		// Computed: ihm
		this.ihm = JSON.parse(JSON.stringify(service.dao.initialPersoIhm));
		this.ihm.archetype = JSON.parse(JSON.stringify(Comp.archetypeMax));

		this.isModele = isModele;
		this.id = JSON.parse(JSON.stringify(data.id));
		this.carac = {taille : {val : 6}, apparence : {val : 6}, constitution : {val : 6}, force : {val : 6}, agilite : {val : 6}, dexterite : {val : 6}, vue : {val : 6}, ouie : {val : 6}, odorat : {val : 6}, gout : {val : 6}, volonte : {val : 6}, intellect : {val : 6}, empathie : {val : 6}, eloquence : {val : 6}, reve : {val : 6}, chance : {val : 6}, melee: 6, tir : 6, lance : 6, derobee : 6, vieMax : 6, enduMax : 12};
		// Computed caracs: melee, tir, lance, derobee, vieMax, enduMax,
		// bonusDommages, vitesse
		this.comp = {};
		this.blessure = [];
		this.eqmt = JSON.parse(JSON.stringify(data.eqmt));
		this.magie = new Magie(data.magie);
		this.combat = JSON.parse(JSON.stringify(data.combat));
		this.compteur = new Compteur(this, data.compteur);

		let i;
		for (i in Carac.noms) {
			let nom = Carac.noms[i];
			this.carac[nom] = new Carac(this, nom, data.carac[nom], isModele);
		}
		for (i in Comp.typeLabel)
			this.comp[i] = new Comp(this, i, data.comp[i]);
		for (i = 0; i<data.blessure.length; i++)
			new Blessure(this, data.blessure[i]);
		// If blessure not empty, adding them has decreased fatigue
		this.compteur.fatigue = data.compteur.fatigue;
		// TODO remove after perso.json upgrade -- begin
		for (i in this.eqmt.arme) {
			if (i.endsWith("1m") || i == "dague") {
				this.eqmt.arme[i + "-d"] = this.eqmt.arme[i];
				this.eqmt.arme[i] = undefined;
			}
		}
		// TODO remove after perso.json upgrade -- end
		let armes = {};
		for (i in Arme.armes) {
			let arme = Arme.armes[i];
			armes[arme] = new Arme(this, arme, this.eqmt.arme[arme]);
		}
		this.eqmt.arme = armes;
		this.combat.diff = new CombatDiff(this, this.combat.diff);
		if (isModele) {
			this.groupe = data.groupe != undefined ? data.groupe : "Défaut";
		}
	}

	toData() {
		let out = {
			id : this.id,
			carac : {},
			comp : {},
			compteur : this.compteur.toData(),
			blessure : [],
			eqmt : JSON.parse(JSON.stringify(this.eqmt)),
			magie : this.magie.toData(),
			combat : JSON.parse(JSON.stringify(this.combat))
		};
		let i;
		for (i in this.carac) {
			let c = this.carac[i];
			if (typeof(c) == "object")
				out.carac[i] = c.toData();
		}
		for (i in this.comp)
			out.comp[i] = this.comp[i].toData();
		for (i in this.blessure)
			out.blessure.push(this.blessure[i].toData());
		let armes = {};
		for (i in this.eqmt.arme) {
			let o = this.eqmt.arme[i].toData();
			if (o)
				armes[i] = o;
		}
		out.eqmt.arme = armes;
		out.combat.diff = this.combat.diff.toData();
		if (this.isModele)
			out.groupe = this.groupe;
		return out;
	}

	// Armure

	armureNoms() {
		return Object.keys(this.eqmt.armure).sort();
	}

	armureAdd(nom) {
		if (!nom || this.eqmt.armure[nom])
			return;
		this.eqmt.armure[nom] = JSON.parse(JSON.stringify(this.eqmt.armure[this.eqmt.armureCourante]));
	}

	armureRemove() {
		if (Object.keys(this.eqmt.armure).length < 2)
			return;
		delete this.eqmt.armure[this.eqmt.armureCourante];
		this.eqmt.armureCourante = Object.keys(this.eqmt.armure)[0];
	}

	// Endurance récupérée par repos

	enduPourRepos() {
		let endu = this.compteur.endu;
		let max = this.compteur.enduLimite;
		let cons = this.carac.constitution.val;
		let recup = Math.floor(this.ihm.recup.enduMn / Carac.facteurTemps[cons]);
		if (endu + recup > max)
			recup = max - endu;
		return recup;
	}

	enduMinutesPourRecupTotale() {
		let recup = this.compteur.enduLimite - this.compteur.endu;
		let cons = this.carac.constitution.val;
		return Math.ceil(recup) * Carac.facteurTemps[cons];
	}

	// Fatigue récupérée par sommeil

	fatiguePourSommeil() {
		let cons = this.carac.constitution.val;
		let mn = this.ihm.recup.fatigueH * 120 + this.ihm.recup.fatigueMn;
		let recup = Math.floor((mn / 60) * Carac.facteurResistance[cons]);
		return Math.min(recup, this.compteur.fatigue);
	}

	fatigueHeuresPourRecupTotale() {
		let recup = this.compteur.fatigue;
		return Math.ceil(recup / Carac.facteurResistance[this.carac.constitution.val]) / 2;
	}

	// Blessures

	blessureSonne(round) {
		let c = this.combat;
		if (c.sonne && c.sonne > round)
			c.sonne++;
		else
			c.sonne = round + 1;
	};

	blessureIncrRound(round) {
		let c, i = this.combat;
		if (c.sonne && c.sonne < round)
			c.sonne = undefined;
		for (i = 0; i < this.blessure.length; i++) {
			this.blessure[i].incrRound();
		}
	}

	blessureRepos() {
		let recup = this.enduPourRepos()
		if (this.compteur.perteEnduHorsBlessure > 0) {
			if (this.compteur.perteEnduHorsBlessure < recup) {
				recup -= this.compteur.perteEnduHorsBlessure;
				this.compteur.perteEnduHorsBlessure = 0;
			} else {
				this.compteur.perteEnduHorsBlessure -= recup;
				return;
			}
		}
		let i, recuperable, blessures = this.blessure;
		for (i = 0; i < blessures.length; i++) {
			recuperable = blessures[i].recupEndu;
			if (recuperable > 0) {
				if (recuperable < recup) {
					recup -= recuperable;
					blessures[i].recupEndu -= recuperable;
				} else {
					blessures[i].recupEndu -= recup;
					return;
				}
			}
		}
	}

	// Autre...

	switchVueMagie(ihm) {
		if (ihm.mode != "magie") {
			ihm.mode = "magie";
		} else {
			ihm.mode = undefined;
			let msg = "Vous avez quitté la vue magie et vous êtes toujours dans les terres médianes du rêve, voulez-vous redescendre";
			if (this.magie.monte && window.confirm(msg))
				this.magie.monte = false;
		}
	}

	terresMedianesMonter(rapide) {
		this.compteur.reve -= rapide ? 2 : 1;
		this.compteur.fatigue += 1;
		this.magie.monte = true;
		let reserve = this.magie.reserve[this.magie.terreMediane];
		if (reserve) {
			this.magie.reserve[this.magie.terreMediane] = undefined;
			util.notify("Le sort en réserve <span class='emphase'>" + reserve + "</span> a été lancé.");
		}
	}

	computeAvancement() {
		let i, c, xp = 0, niv = 0;
		for (i in this.carac) {
			c = this.carac[i];
			if (typeof(c) == "object") {
				niv += c.val;
				if (c.xp !== undefined)
					xp += c.xp;
			}
		}
		this.ihm.avancement.caracsNiv = niv - 180;
		this.ihm.avancement.caracsXP = xp;

		let j, v;
		xp = 0;
		for (i in this.comp) {
			c = this.comp[i];
			j = Comp.min[c.type];
			v = c.val;
			while (j < v)
				xp += Comp.xpToUpFrom(j++);
			if (c.xp !== undefined)
				xp += c.xp;
		}
		this.ihm.avancement.comps = xp - (this.id.hautRevant ? 2300 : 2800);
	}
}