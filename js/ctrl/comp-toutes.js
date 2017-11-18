"use strict";
// jshint esversion: 6

controle.compToutes = function($scope) {
	let normalizeText = function(t) {
		return t.toLowerCase().replace(/[éèê]/, "e").replace(/ç/, "c");
	};

	$scope.compToutesReorganize = function() {
		util.removeEmptyText(document.getElementById("cadre-comp-toutes"));

		let cols = $scope.display.cadre.compToutesCols;
		if (cols < 1)
			return;
		let rootTr = document.getElementById("cadre-comp-toutes-comps");
		let nodes = rootTr.getElementsByClassName("w-competence");
		let i, nbc = nodes.length, competences = [], hidden = [];
		for (i = 0; i < nbc; i++) {
			if (window.getComputedStyle(nodes[i]).display == "none")
				hidden.push(nodes[i]);
			else
				competences.push(nodes[i]);
		}
		nbc = competences.length;
		for (i = 0; i < nbc; i++)
			competences[i].parentNode.removeChild(competences[i]);
		for (i = 0; i < hidden.length; i++)
			hidden[i].parentNode.removeChild(hidden[i]);

		// Add/remove td>table>tbody
		while (rootTr.childNodes.length > cols) {
			rootTr.removeChild(rootTr.lastChild);
		}
		let tbody = rootTr.parentNode;
		while (rootTr.childNodes.length < cols) {
			let td = document.createElement("td");
			let table = document.createElement("table");
			tbody = document.createElement("tbody");
			table.appendChild(tbody);
			td.appendChild(table);
			rootTr.appendChild(td);
		}

		competences.sort(function(a, b) {
			a = normalizeText(Comp.typeLabel[a.getAttribute("competence")][1]);
			b = normalizeText(Comp.typeLabel[b.getAttribute("competence")][1]);
			return a < b ? -1 : 1;
		});
		let col, byCol = Math.ceil(nbc / cols);
		for (i = 0; i < nbc; i++) {
			col = rootTr.childNodes[Math.floor(i / byCol)].firstChild.firstChild;
			col.appendChild(competences[i]);
		}
		col = rootTr.childNodes[cols - 1].firstChild.firstChild;
		for (i = 0; i < hidden.length; i++)
			col.appendChild(hidden[i]);

		rootTr.parentNode.getElementsByTagName("h1")[0].parentNode.setAttribute("colspan", "" + cols);
	};

	setTimeout(function() {
		$scope.compToutesReorganize();
		$scope.$watch("perso.id.hautRevant", function() {
			setTimeout($scope.compToutesReorganize, 250);
		});
		$scope.$watch("display.pref.compMin", function() {
			setTimeout($scope.compToutesReorganize, 250);
		});
	}, 1000);
};