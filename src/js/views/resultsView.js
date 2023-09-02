import view from "./View.js";
import previewView from "./previewView.js";

class ResultsView extends view {
 _parentElement = document.querySelector(".results");
 _errorMessage = "No recipies found for your query";
 _message = "";
 _generateMarkup() {
  return this._data.map((result) => previewView.render(result, false)).join("");
 }
}

export default new ResultsView();
