window.addEventListener("load", async () => {
	Renderer.get().setBaseUrl("/");
	const it = await Renderer.hover.pCacheAndGet(`${_SEO_PAGE}.html`, _SEO_SOURCE, _SEO_HASH);

	document.title = `${it.name} - 5etools`;
	$(`.page__title`).text(`${_SEO_PAGE.toTitleCase()}: ${it.name}`);

	$(`<div class="col-12 flex-vh-center my-2 pt-3">
		<button class="btn btn-primary">
			<a href="/${_SEO_PAGE}.html" style="font-size: 1.7em;">${_SEO_STYLE === 1 ? `View All` : `View Complete`} ${_SEO_PAGE.toTitleCase()}</a>
		</button>
	</div>`).appendTo($(`#link-page`));

	const $content = $(`#pagecontent`).empty();

	$(`.nav__link`).each((i, e) => {
		const $e = $(e);
		const href = $e.attr("href");
		if (!href.startsWith("http") && href.endsWith(".html")) $e.attr("href", `../${href}`);

		if (href.startsWith("https://wiki.5e.tools")) $e.remove();
	});

	switch (_SEO_PAGE) {
		case "spells": $content.append(RenderSpells.$getRenderedSpell(it, {})); break;
		case "bestiary": {
			Renderer.utils.bindPronounceButtons();
			const meta = {};
			const languages = {};
			await RenderBestiary.pPopulateMetaAndLanguages(meta, languages);
			$content.append(RenderBestiary.$getRenderedCreature(it, meta));
			$(`.mon__name--token`).css({paddingRight: 5});
			break;
		}
		case "items": $content.append(RenderItems.$getRenderedItem(it)); break;

		// TODO expand this as required
		case "races": {
			Renderer.utils.bindPronounceButtons();
			break;
		}
	}
});
