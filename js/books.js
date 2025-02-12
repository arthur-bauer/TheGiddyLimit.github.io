"use strict";

class Books {
	static sortBooks (dataList, a, b) {
		a = dataList[a.ix];
		b = dataList[b.ix];
		return SortUtil.ascSort(a.name, b.name);
	}
}

const booksList = new BooksList({
	contentsUrl: "data/books.json",
	sortFn: Books.sortBooks,
	dataProp: "book",
	rootPage: "book.html",
	rowBuilderFn: (bk) => {
		return `<span class="col-12 bold">${bk.name}</span>`;
	}
});

window.onload = booksList.pOnPageLoad.bind(booksList);

function handleBrew (homebrew) {
	booksList.addData(homebrew);
	return Promise.resolve();
}
