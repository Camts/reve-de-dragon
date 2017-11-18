controle.compToutes = function($scope) {
	var normalizeText = function(t) {
		return t.toLowerCase().replace(/[éèê]/, "e").replace(/ç/, "c");
	};

	$scope.compToutesReorganize = function() {
		util.removeEmptyText(document.getElementById("cadre-comp-toutes"));

		var cols = $scope.display.cadre.compToutesCols;
		if (cols < 1)
			return;
		var rootTr = document.getElementById("cadre-comp-toutes-comps");
		var i, nodes = rootTr.getElementsByClassName("w-competence");
		var i, nbc = nodes.length, competences = [], hidden = [];
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
		var tbody = rootTr.parentNode;
		while (rootTr.childNodes.length < cols) {
			td = document.createElement("td");
			table = document.createElement("table");
			tbody = document.createElement("tbody");
			table.appendChild(tbody);
			td.appendChild(table);
			rootTr.appendChild(td);
		}

		competences.sort(function(a, b) {
			a = normalizeText(service.competence.label[a.getAttribute("competence")]);
			b = normalizeText(service.competence.label[b.getAttribute("competence")]);
			return a < b ? -1 : 1;
		});
		var col, byCol = Math.ceil(nbc / cols);
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