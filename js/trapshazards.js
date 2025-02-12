"use strict";

function filterTypeSort (a, b) {
	a = a.item;
	b = b.item;
	return SortUtil.ascSortLower(Parser.trapHazTypeToFull(a), Parser.trapHazTypeToFull(b));
}

class TrapsHazardsPage extends ListPage {
	constructor () {
		const sourceFilter = getSourceFilter();
		const typeFilter = new Filter({
			header: "Type",
			items: [
				"MECH",
				"MAG",
				"SMPL",
				"CMPX",
				"HAZ",
				"WTH",
				"ENV",
				"WLD",
				"GEN"
			],
			displayFn: Parser.trapHazTypeToFull,
			itemSortFn: filterTypeSort
		});

		super({
			dataSource: "data/trapshazards.json",

			filters: [
				sourceFilter,
				typeFilter
			],
			filterSource: sourceFilter,

			listClass: "trapshazards",

			sublistClass: "subtrapshazards",

			dataProps: ["trap", "hazard"]
		});

		this._sourceFilter = sourceFilter;
	}

	getListItem (it, thI) {
		it.trapHazType = it.trapHazType || "HAZ";

		// populate filters
		this._sourceFilter.addItem(it.source);

		const eleLi = document.createElement("li");
		eleLi.className = "row";

		const source = Parser.sourceJsonToAbv(it.source);
		const hash = UrlUtil.autoEncodeHash(it);
		const trapType = Parser.trapHazTypeToFull(it.trapHazType);

		eleLi.innerHTML = `<a href="#${hash}">
			<span class="bold col-6 pl-0">${it.name}</span>
			<span class="col-4">${trapType}</span>
			<span class="col-2 text-center ${Parser.sourceJsonToColor(it.source)} pr-0" title="${Parser.sourceJsonToFull(it.source)}" ${BrewUtil.sourceJsonToStyle(it.source)}>${source}</span>
		</a>`;

		const listItem = new ListItem(
			thI,
			eleLi,
			it.name,
			{
				hash,
				source,
				trapType,
				uniqueid: it.uniqueId ? it.uniqueId : thI
			}
		);

		eleLi.addEventListener("click", (evt) => this._list.doSelect(listItem, evt));
		eleLi.addEventListener("contextmenu", (evt) => ListUtil.openContextMenu(evt, this._list, listItem));

		return listItem;
	}

	handleFilterChange () {
		const f = this._filterBox.getValues();
		this._list.filter((item) => {
			const it = this._dataList[item.ix];
			return this._filterBox.toDisplay(
				f,
				it.source,
				it.trapHazType
			);
		});
		FilterBox.selectFirstVisible(this._dataList);
	}

	getSublistItem (it, pinId) {
		const hash = UrlUtil.autoEncodeHash(it);
		const trapType = Parser.trapHazTypeToFull(it.trapHazType);

		const $ele = $(`<li class="row">
			<a href="#${hash}">
				<span class="bold col-8 pl-0">${it.name}</span>
				<span class="col-4 pr-0">${trapType}</span>
			</a>
		</li>`)
			.contextmenu(evt => ListUtil.openSubContextMenu(evt, listItem));

		const listItem = new ListItem(
			pinId,
			$ele,
			it.name,
			{
				hash,
				trapType
			}
		);
		return listItem;
	}

	doLoadHash (id) {
		Renderer.get().setFirstSection(true);
		const it = this._dataList[id];

		$(`#pagecontent`).empty().append(RenderTrapsHazards.$getRenderedTrapHazard(it));

		ListUtil.updateSelected();
	}

	doLoadSubHash (sub) {
		sub = this._filterBox.setFromSubHashes(sub);
		ListUtil.setFromSubHashes(sub);
	}
}

const trapsHazardsPage = new TrapsHazardsPage();
window.addEventListener("load", () => trapsHazardsPage.pOnLoad());
