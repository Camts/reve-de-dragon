"use strict";
// jshint esversion: 6

class Comp {
	constructor(perso, nom, data) {
		if (!data)
			data = {};
		this[pPerso] = perso;
		this.nom = nom;
		this.type = Comp.typeLabel[nom][0];
		this.label = Comp.typeLabel[nom][1];
		this.val = data.val;
		this.xp = data.xp;
		this.arch = data.arch;
	}

	toData() {
		let out = {};
		if (this.val != Comp.min[this.type])
			out.val = this.val;
		if (this.xp != 0)
			out.xp = this.xp;
		out.arch = this.arch;
		return out;
	}

	get val() {
		return this[pVal];
	}
	set val(val) {
		if (val === undefined)
			val = Comp.min[this.type];
		if (val === this[pVal])
			return;
		this[pVal] = val;
		this.xpToUp = Comp.xpToUpFrom(val);
		if (this.type == "combat" || this.nom == "esquive") {
			let i, armes = this[pPerso].eqmt.arme;
			for (i in armes)
				if (armes[i].comp == this.nom) {
					armes[i].computeSeuils();
					armes[i].computeInit();
				}
		}
	}
	get valIhm() {
		return this[pVal] == Comp.min[this.type] ? undefined : this[pVal];
	}
	set valIhm(val) {
		this.val = val;
	}

	get xp() {
		return this[pXp];
	}
	set xp(xp) {
		if (xp === this[pXp])
			return;
		if (xp === undefined)
			xp = 0;
		if (xp >= this.xpToUp) {
			xp -= this.xpToUp;
			this[pXp] = 0;
			this.val ++;
			this.xp = xp;
		} else
			this[pXp] = xp == 0 ? undefined : xp;
	}
	get xpIhm() {
		return this[pXp] == 0 ? undefined : this[pXp];
	}
	set xpIhm(val) {
		this.xp = val;
	}

	get arch() {
		return this[pArch];
	}
	set arch(arch) {
		if (arch === undefined)
			arch = 0;
		if (arch === this[pArch])
			return;
		if (this[pArch])
			this[pPerso].ihm.archetype[this[pArch]].restant ++;
		this[pArch] = arch;
		if (arch)
			this[pPerso].ihm.archetype[arch].restant --;
	}
}

Comp.typeLabel = {
	acrobatie : ["spe", "Acrobatie"],
	alchimie : ["conn", "Alchimie"],
	arbalete : ["combat", "Arbalète"],
	arc : ["combat", "Arc"],
	armurerie : ["spe", "Armurerie"],
	astrologie : ["conn", "Astrologie"],
	botanique : ["conn", "Botanique"],
	bouclier : ["combat", "Bouclier"],
	bricolage : ["gen", "Bricolage"],
	chant : ["gen", "Chant"],
	charpenterie : ["part", "Charpenterie"],
	chirurgie : ["conn", "Chirurgie"],
	comedie : ["part", "Comédie"],
	commerce : ["part", "Commerce"],
	corpsACorps : ["combat", "Corps à corps"],
	course : ["gen", "Course"],
	cuisine : ["gen", "Cuisine"],
	dagueLancee : ["combat", "Dague lancée"],
	dague : ["combat", "Dague"],
	danse : ["gen", "Danse"],
	dessin : ["gen", "Dessin"],
	discours : ["gen", "Discours"],
	discretion : ["gen", "Discrétion"],
	epee1m : ["combat", "Epée 1m"],
	epee2m : ["combat", "Epée 2m"],
	equitation : ["part", "Equitation"],
	escalade : ["gen", "Escalade"],
	esquive : ["gen", "Esquive"],
	fleaux : ["combat", "Fléaux"],
	hache1m : ["combat", "Hache 1m"],
	hache2m : ["combat", "Hache 2m"],
	hacheLancee : ["combat", "Hache lancée"],
	jeu : ["spe", "Jeu"],
	jonglerie : ["spe", "Jonglerie"],
	legendes : ["conn", "Légendes"],
	lireEtEcrire : ["conn", "Lire & écrire"],
	maconnerie : ["part", "Maçonnerie"],
	maroquinerie : ["spe", "Maroquinerie"],
	masse1m : ["combat", "Masse 1m"],
	masse2m : ["combat", "Masse 2m"],
	medecine : ["conn", "Médecine"],
	musique : ["part", "Musique"],
	natation : ["spe", "Natation"],
	navigation : ["spe", "Navigation"],
	orfevrerie : ["spe", "Orfèvrerie"],
	pickpocket : ["part", "Pickpocket"],
	premiersSoins : ["part", "Premiers soins"],
	saut : ["gen", "Saut"],
	seCacher : ["gen", "Se cacher"],
	seduction : ["gen", "Séduction"],
	serrurerie : ["spe", "Serrurerie"],
	srvCite : ["part", "Srv. cité"],
	srvDesert : ["part", "Srv. désert"],
	srvExt : ["gen", "Srv. extérieur"],
	srvForet : ["part", "Srv. forêt"],
	srvGlace : ["part", "Srv. glace"],
	srvMarais : ["part", "Srv. marais"],
	srvMer : ["part", "Srv. mer"],
	srvMontagne : ["part", "Srv. montagne"],
	srvPlaine : ["part", "Srv. plaine"],
	srvSousSol : ["part", "Srv. sous-sol"],
	travestissement : ["part", "Travestissement"],
	hypnos : ["drac", "Voix d'Hypnos"],
	oniros : ["drac", "Voix d'Oniros"],
	narcos : ["drac", "Voix de Narcos"],
	thanatos : ["drac", "Voix de Thanatos"],
	zoologie : ["conn", "Zoologie"]
};

Comp.min = {
	gen : -4,
	combat : -6,
	part : -8,
	spe : -11,
	conn : -11,
	drac : -11
};

Comp.archetypeMax =  [{
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
}];

Comp.val = function(comp) {
	if (!comp)
		return;
	return comp.val || comp.val === 0 ? comp.val : Comp.min[comp.type];
};

Comp.xpToUpFrom = function(comp) {
	// comp can be val or comp object with "val" attribute
	let val = typeof (comp) == "number" ? comp : Comp.val(comp);
	if (val < -8)
		return 5;
	if (val < -4)
		return 10;
	if (val < 0)
		return 15;
	if (val < 4)
		return 20;
	if (val < 6)
		return 30;
	if (val < 8)
		return 40;
	if (val < 10)
		return 60;
	return 100;
};

Comp.xpToArchetype = function(comp) {
  let val = comp.val;
  if (val >= comp.arch)
	  return 0;
  let out = Comp.xpToUpFrom(val) - (comp.xp ? comp.xp : 0);
  val++;
  while (val < comp.arch) {
	  out += Comp.xpToUpFrom(val);
	  val++;
  }
  return out;
};