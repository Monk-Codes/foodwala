import view from "./View.js";
import previewView from "./previewView.js";

class BookmarksView extends view {
 _parentElement = document.querySelector(".bookmarks__list");
 _errorMessage = "No bookmarks yet. Add some recipe to bookmarks!";
 _message = "";

 addHandlerRender(handler) {
  window.addEventListener("load", handler);
 }
 _generateMarkup() {
  return this._data.map((bookmark) => previewView.render(bookmark, false)).join("");
 }
}

export default new BookmarksView();
