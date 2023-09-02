import * as model from "./model.js";
import bookmarksView from "./views/bookmarksView.js";
import paginationView from "./views/paginationView.js";
import recipeView from "./views/recipeView.js";
import resultsView from "./views/resultsView.js";
import searchView from "./views/searchView.js";
import addRecipeView from "./views/addRecipeView.js";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime";
import { CLOSE_SEC } from "./config.js";

// if (module.hot) {
//  module.hot.accept();
// }
const controlRecipes = async function () {
 try {
  const id = window.location.hash.slice(1);
  if (!id) return;
  console.log(id);
  recipeView.renderSpinner();
  resultsView.update(model.getSearchResultsPage());
  bookmarksView.update(model.state.bookmarks);
  console.log(model.state.bookmarks);
  //1 LOADING
  await model.loadRecipe(id);
  //2 RENDERING
  recipeView.render(model.state.recipe);
 } catch (error) {
  recipeView.renderError();
 }
};

const controlSearchResults = async function () {
 try {
  resultsView.renderSpinner();
  const query = searchView.getQuery();
  if (!query) return;
  await model.loadSearchResults(query);
  resultsView.render(model.getSearchResultsPage());
  paginationView.render(model.state.search);
 } catch (error) {
  console.log(error);
 }
};

const controlPagination = function (gotoPage) {
 resultsView.render(model.getSearchResultsPage(gotoPage));
 paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
 model.updateServings(newServings);
 //  recipeView.render(model.state.recipe);
 recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
 if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
 // remove bookmark
 else model.removeBookmark(model.state.recipe.id);
 recipeView.update(model.state.recipe);
 bookmarksView.render(model.state.bookmarks);
 console.log(model.state.bookmarks);
};
const controlBookmarks = function () {
 bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
 try {
  await model.uploadRecipe(newRecipe);
  addRecipeView.renderSpinner();
  recipeView.render(model.state.recipe);
  addRecipeView.renderMessage();
  bookmarksView.render(model.state.bookmarks);
  window.history.pushState(null, "", `#${model.state.recipe.id}`);
  setTimeout(() => {
   addRecipeView.toggleWindow();
  }, CLOSE_SEC);
 } catch (error) {
  console.error(error);
  addRecipeView.renderError(error.message);
 }
};
const init = function () {
 bookmarksView.addHandlerRender(controlBookmarks);
 recipeView.addHandlerRender(controlRecipes);
 recipeView.addHandlerUpdateServings(controlServings);
 recipeView.addHandlerAddBookmark(controlAddBookmark);
 searchView.addHandlerSearch(controlSearchResults);
 paginationView.addHandlerClick(controlPagination);
 addRecipeView.addHandlerUpoad(controlAddRecipe);
};
init();
