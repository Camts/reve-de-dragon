service.competence = {
	label : {
		acrobatie : "Acrobatie",
		alchimie : "Alchimie",
		arbalete : "Arbalète",
		arc : "Arc",
		armurerie : "Armurerie",
		astrologie : "Astrologie",
		botanique : "Botanique",
		bouclier : "Bouclier",
		bricolage : "Bricolage",
		chant : "Chant",
		charpenterie : "Charpenterie",
		chirurgie : "Chirurgie",
		comedie : "Comédie",
		commerce : "Commerce",
		corpsACorps : "Corps à corps",
		course : "Course",
		cuisine : "Cuisine",
		dagueLancee : "Dague lancée",
		dague : "Dague",
		danse : "Danse",
		dessin : "Dessin",
		discours : "Discours",
		discretion : "Discrétion",
		epee1m : "Epée 1m",
		epee2m : "Epée 2m",
		equitation : "Equitation",
		escalade : "Escalade",
		esquive : "Esquive",
		fleaux : "Fléaux",
		hache1m : "Hache 1m",
		hache2m : "Hache 2m",
		hacheLancee : "Hache lancée",
		jeu : "Jeu",
		jonglerie : "Jonglerie",
		legendes : "Légendes",
		lireEtEcrire : "Lire & écrire",
		maconnerie : "Maçonnerie",
		maconnerie : "Maçonnerie",
		maroquinerie : "Maroquinerie",
		masse1m : "Masse 1m",
		masse2m : "Masse 2m",
		medecine : "Médecine",
		musique : "Musique",
		natation : "Natation",
		navigation : "Navigation",
		orfevrerie : "Orfèvrerie",
		pickpocket : "Pickpocket",
		premiersSoins : "Premiers soins",
		saut : "Saut",
		seCacher : "Se cacher",
		seduction : "Séduction",
		serrurerie : "Serrurerie",
		srvCite : "Srv. cité",
		srvDesert : "Srv. désert",
		srvExt : "Srv. extérieur",
		srvForet : "Srv. forêt",
		srvGlace : "Srv. glace",
		srvMarais : "Srv. marais",
		srvMer : "Srv. mer",
		srvMontagne : "Srv. montagne",
		srvPlaine : "Srv. plaine",
		srvSousSol : "Srv. sous-sol",
		travestissement : "Travestissement",
		hypnos : "Voix d'Hypnos",
		oniros : "Voix d'Oniros",
		narcos : "Voix de Narcos",
		thanatos : "Voix de Thanatos",
		zoologie : "Zoologie"
	},
	min : {
		gen : -4,
		combat : -6,
		part : -8,
		spe : -11,
		conn : -11,
		drac : -11
	},
	val : function(comp) {
		if (!comp)
			return;
		return comp.val || comp.val === 0 ? comp.val : service.competence.min[comp.type];
	},
	xpToUpFrom : function(comp) {
		// comp can be val or comp object with "val" attribute
		var val = typeof (comp) == "number" ? comp : service.competence.val(comp);
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
	},
	xpToArchetype : function(comp) {
		var val = service.competence.val(comp);
		if (val >= comp.arch)
			return 0;
		var out = service.competence.xpToUpFrom(val) - (comp.xp ? comp.xp : 0);
		val++;
		while (val < comp.arch) {
			out += service.competence.xpToUpFrom(val);
			val++;
		}
		return out;
	},
	computeUp : function(comp, xp) {
		var outComp = comp.val || comp.val == 0 ? comp.val : service.competence.val(comp);
		var outXp = xp ? xp : 0, up = true;
		while (up) {
			var seuil = service.competence.xpToUpFrom(outComp);
			if (outXp >= seuil) {
				outComp++;
				outXp -= seuil;
			} else
				up = false;
		}
		return [outXp != xp, outComp, outXp];
	},
	onXpChange : function(comp) {
		var up = service.competence.computeUp(comp, comp.xp);
		if (up[0]) {
			comp.val = up[1] == service.competence.min[comp.type] ? undefined : up[1];
			comp.xp = up[2] && up[2] != 0 ? up[2] : undefined;
		}
	},
	emphaseArchetype : function(ihm, level) {
		if (ihm.archetype.emphase == level)
			ihm.archetype.emphase = undefined;
		else
			ihm.archetype.emphase = level;
	}
};