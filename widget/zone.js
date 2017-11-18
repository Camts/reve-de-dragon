zone = {};

zone.createSepVertical = function(elt, before, tr, colspan) {
	var td = document.createElement("td");
	td.setAttribute("class", "zone-sep-v");
	td.setAttribute("title", "Insérer une zone en verticale");
	td.setAttribute("onclick", "zone.onClickSep(this)");
	if (colspan)
		td.setAttribute("colspan", colspan);
	if (tr) {
		var tr = document.createElement("tr");
		tr.appendChild(td)
		td = tr;
	}
	if (before)
		elt.insertBefore(td, before);
	else
		elt.appendChild(td);
	return td;
};

zone.createTableHorizontal = function(elt, before) {
	var tr = document.createElement("tr");
	var td = document.createElement("td");
	td.setAttribute("class", "zone-inner");
	tr.appendChild(td);
	var table = document.createElement("table");
	td.appendChild(table);
	if (before)
		elt.insertBefore(tr, before);
	else
		elt.appendChild(tr);
	return table;
};

zone.createSepHorizontal = function(elt, before, tr) {
	var td = document.createElement("td");
	td.setAttribute("class", "zone-sep-h");
	td.setAttribute("title", "Insérer une zone en horizontale");
	td.setAttribute("onclick", "zone.onClickSep(this)");
	if (tr) {
		var tr = document.createElement("tr");
		tr.appendChild(td)
		td = tr;
	}
	if (before)
		elt.insertBefore(td, before);
	else
		elt.appendChild(td);
	return td;
};

zone.createCellDrop = function(elt, before) {
	var td = document.createElement("td");
	td.setAttribute("class", "zone-content");
	td.setAttribute("title", "Suppriner cette zone");
	td.setAttribute("onclick", "zone.onClickDrop(this)");
	td.setAttribute("ondrop", "zone.drop(event)");
	td.setAttribute("ondragover", "zone.allowDrop(event)");
	if (before)
		elt.insertBefore(td, before);
	else
		elt.appendChild(td);
	return td;
};

zone.onClickDrop = function(elt) {
	if (elt.childNodes.length > 0)
		return;
	var parent = elt.parentNode; // tr
	var root = parent.parentNode.parentNode.parentNode.parentNode;
	if (root.className && root.className.indexOf("zone") != -1
			&& root.getElementsByClassName("zone-content").length == 1)
		return;
	var cont = false, cn = parent.childNodes;
	if (cn.length == 1) { // Vertical
		parent.removeChild(elt);
		elt = parent.parentNode.parentNode; // td
		parent = elt.parentNode; // tr
		parent.removeChild(elt.previousSibling);
		parent.removeChild(elt);
		cont = true;
	} else { // Horizontal
		parent.removeChild(elt.previousSibling);
		parent.removeChild(elt);
		if (cn.length == 1) {
			elt = parent.parentNode.parentNode.parentNode; // tr
			parent = elt.parentNode; // table
			parent.removeChild(elt.previousSibling);
			parent.removeChild(elt);
			cont = true;
		}
	}

	var dev;
	while (cont && (!parent.className || parent.className.indexOf("zone") == -1)) {
		if (parent.nodeName == "TABLE" && parent.childNodes.length == 3) { // Vertical
			if (parent.childNodes[1].firstChild.firstChild.firstChild.childNodes.length == 3) { // 3 td
				elt = parent.childNodes[1]; // tr
				elt.appendChild(elt.firstChild.firstChild.firstChild.childNodes[1]);
				elt.removeChild(elt.firstChild);
				parent = parent.parentNode.parentNode; // tr
			} else {
				parent.removeChild(parent.firstChild); // top sep
				parent.removeChild(parent.lastChild); // bottom sep
				dev = parent.firstChild.firstChild.firstChild.firstChild; // tr
				dev.removeChild(dev.firstChild); // left sep
				dev.removeChild(dev.lastChild); // right sep
				parent = parent.parentNode; // td
				elt = parent.nextSibling; // td vertical sep
				parent = parent.parentNode; // tr
				parent.removeChild(elt.previousSibling);
				while (dev.firstChild) {
					parent.insertBefore(dev.firstChild, elt);
				}
				var len = parent.childNodes.length;
				elt = parent;
				parent = parent.parentNode;
				if (len > elt.previousSibling.firstChild.colSpan) {
					cn = parent.childNodes;
					for (var i = 0; i < cn.length; i += 2)
						cn[i].firstChild.colSpan = len;
				}
			}
		} else if (parent.nodeName == "TR" && parent.childNodes.length == 3) { // Horizontal
			if (parent.childNodes[1].firstChild.childNodes.length == 3) { // 3 tr
				elt = parent.childNodes[1].firstChild; // table
				parent.insertBefore(elt.childNodes[1].firstChild, parent.lastChild);
				parent.removeChild(parent.childNodes[1]);
				parent = parent.parentNode.parentNode; // tr
			} else
				cont = false;
		} else
			cont = false;
	}
};

zone.onClickSep = function(elt) {
	var out, parent = elt.parentNode;
	if (elt.className.indexOf("zone-sep-v") != -1) {
		// Vertical separator
		var table, tr;
		elt = parent; // tr
		parent = parent.parentNode; // table
		if (parent.childNodes[1].firstChild.className.indexOf("zone-content") != -1) {
			table = zone.createTableHorizontal(parent, parent.lastChild);
			tr = parent.childNodes[1];
			table.appendChild(tr);
			zone.createSepHorizontal(tr, tr.firstChild);
			zone.createSepHorizontal(tr);
		}
		zone.createSepVertical(parent, elt, true);
		var tr = document.createElement("tr");
		table = zone.createTableHorizontal(parent, elt);
		table.appendChild(tr);
		zone.createSepHorizontal(tr);
		zone.createCellDrop(tr);
		zone.createSepHorizontal(tr);
		out = tr;

	} else {
		// Horizontal separator
		var table, tr, td, i = util.indexOf(parent.childNodes, elt);
		if (parent.childNodes.length == 3) {
			table = document.createElement("table");
			zone.createSepVertical(table, null, true);
			tr = document.createElement("tr");
			tr.appendChild(parent.childNodes[1]);
			table.appendChild(tr);
			zone.createSepVertical(table, null, true);
			td = document.createElement("td");
			td.setAttribute("class", "zone-inner");
			td.appendChild(table);
			parent.insertBefore(td, parent.childNodes[1]);
		}
		zone.createSepHorizontal(parent, elt);
		table = document.createElement("table");
		zone.createSepVertical(table, null, true);
		tr = document.createElement("tr");
		zone.createCellDrop(tr);
		table.appendChild(tr);
		zone.createSepVertical(table, null, true);
		td = document.createElement("td");
		td.setAttribute("class", "zone-inner");
		td.appendChild(table);
		parent.insertBefore(td, elt);
		out = table;
	}

	return out;
};

zone.setVisible = function(visible) {
	var body = document.getElementsByTagName("body")[0];
	var i, contents = body.getElementsByClassName("zone-content");
	if (visible) {
		for (i = 0; i < contents.length; i++)
			contents[i].setAttribute("title", "Suppriner cette zone");
		if (body.className) {
			if (body.className.indexOf("zone-show") == -1)
				body.className += " zone-show";
		} else
			body.className = "zone-show";
	} else {
		for (i = 0; i < contents.length; i++)
			contents[i].removeAttribute("title");
		if (body.className)
			if (body.className == "zone-show")
				body.className = "";
			else {
				i = body.className.indexOf("zone-show");
				if (i == 0)
					body.className = body.className.substring(10);
				else if (i > 0)
					body.className = body.className.substring(0, i - 1) + body.className.substring(i + 9);
			}
		else
			body.className = "zone-show";
	}
};

zone.drag = function(evt) {
	if (evt.target.id && evt.target.className && evt.target.className.indexOf("cadre") != -1)
		evt.dataTransfer.setData("cadre", evt.target.id);
};

zone.drop = function(evt) {
	var id = evt.dataTransfer.getData("cadre");
	if (id) {
		evt.target.appendChild(document.getElementById(id));
		evt.preventDefault();
	}
};

zone.allowDrop = function(evt) {
	if (evt.dataTransfer.types.indexOf("cadre") != -1) {
		var elt = evt.target;
		while (elt && elt.className != "zone-content")
			elt = elt.parentNode;
		if (elt && elt.childNodes.length == 0)
			evt.preventDefault();
	}
};

zone.getConfig = function(eltId) {
	var root = document.getElementById(eltId).querySelector(".zone");
	var out = [];
	var cn = root.childNodes;
	for (var i = 1; i < cn.length; i += 2) {
		out.push(zone.traverseHorizontalTr(cn[i].firstChild.firstChild.firstChild));
	}
	return out;
};

zone.traverseHorizontalTr = function(tr) {
	var out = [], td, table, cn = tr.childNodes;
	for (var i = 1; i < cn.length; i += 2) {
		td = cn[i];
		if (td.className == "zone-content") {
			if (td.firstChild)
				out.push(td.firstChild.id);
		} else {
			table = cn[i].firstChild;
			if (table.childNodes.length == 3 && table.childNodes[1].firstChild.className == "zone-content") {
				var td = table.childNodes[1].firstChild;
				if (td.firstChild)
					out.push(td.firstChild.id);
			} else
				out.push(zone.traverseVerticalTable(table));
		}
	}
	if (typeof (out) != "string" && out.length == 1 && typeof (out[0]) != "string" && out[0].length == 1)
		out = out[0][0];
	return out;
};

zone.traverseVerticalTable = function(table) {
	var out = [], td, cn = table.childNodes;
	for (var i = 1; i < cn.length; i += 2) {
		td = cn[i].firstChild;
		if (td.className == "zone-content") {
			if (td.firstChild)
				out.push(td.firstChild.id);
		} else
			out.push(zone.traverseHorizontalTr(td.firstChild.firstChild));
	}
	if (typeof (out) != "string" && out.length == 1 && typeof (out[0]) != "string" && out[0].length == 1)
		out = out[0][0];
	return out;
};

zone.setConfig = function(elt, cfg) {
	var root = document.createElement("table");
	root.setAttribute("class", "zone");
	// elt.insertBefore(table, elt.firstChild);
	elt.appendChild(root);
	zone.createSepVertical(root, null, true);
	var table = zone.createTableHorizontal(root);
	zone.createSepVertical(root, null, true);
	var tr = zone.createSepHorizontal(table, null, true);
	zone.createCellDrop(tr);
	zone.createSepHorizontal(tr);
	zone.readVerticalCfg(root, cfg);
};

zone.readVerticalCfg = function(table, vCfg) {
	var tr, hCfg;
	for (var i = 1; i <= vCfg.length; i++) {
		if (i == vCfg.length) {
			tr = table.childNodes[1].firstChild.firstChild.firstChild;
			hCfg = vCfg[0];
		} else {
			tr = zone.onClickSep(table.lastChild.firstChild);
			hCfg = vCfg[i];
		}
		if (typeof (hCfg) == "string") {
			tr.childNodes[1].appendChild(document.getElementById(hCfg));
		} else {
			zone.readHorizontalCfg(tr, hCfg);
		}
	}
};

zone.readHorizontalCfg = function(tr, hCfg) {
	var table, vCfg;
	for (var i = 1; i <= hCfg.length; i++) {
		if (i == hCfg.length) {
			table = tr.childNodes[1].firstChild;
			vCfg = hCfg[0];
		} else {
			table = zone.onClickSep(tr.lastChild);
			vCfg = hCfg[i];
		}
		if (typeof (vCfg) == "string")
			if (table)
				table.childNodes[1].firstChild.appendChild(document.getElementById(vCfg));
			else
				tr.childNodes[1].appendChild(document.getElementById(vCfg));
		else
			zone.readVerticalCfg(table, vCfg);
	}
};