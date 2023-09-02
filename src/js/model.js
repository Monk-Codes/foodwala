import { async } from "regenerator-runtime";
import { API_URL, KEY, RES_PER_PAGE } from "./config";
import { key, AJAX } from "./helpers";
export const state = {
 recipe: {},
 search: {
  query: "",
  results: [],
  page: 1,
  resultsPerPage: RES_PER_PAGE,
 },
 bookmarks: [],
};

createRecipeObj = function (data) {
 const { recipe } = data.data;
 return {
  id: recipe.id,
  title: recipe.title,
  publisher: recipe.publisher,
  sourceUrl: recipe.source_url,
  image: recipe.image_url,
  servings: recipe.servings,
  cookingTime: recipe.cooking_time,
  ingredients: recipe.ingredients,
  // using short circuiting
  ...(recipe.key && { key: recipe.key }),
 };
};
export const loadRecipe = async function (id) {
 try {
  const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
  state.recipe = createRecipeObj(data);
  if (state.bookmarks.some((bMark) => bMark.id === id)) state.recipe.bookmarked = true;
  else state.recipe.bookmarked = false;
 } catch (err) {
  console.error("error");
  throw err;
 }
};

export const loadSearchResults = async function (query) {
 try {
  state.search.query = query;
  const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
  state.search.results = data.data.recipes.map((rec) => ({
   id: rec.id,
   title: rec.title,
   publisher: rec.publisher,
   image: rec.image_url,
   ...(rec.key && { key: rec.key }),
  }));
  state.search.page = 1;
 } catch (error) {
  throw error;
 }
};

export const getSearchResultsPage = function (page = state.search.page) {
 state.search.page = page;
 const start = (page - 1) * state.search.resultsPerPage;
 const end = page * state.search.resultsPerPage;
 return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
 state.recipe.ingredients.forEach((ing) => {
  ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
 });
 state.recipe.servings = newServings;
};

const persistBookmarks = function () {
 localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};
export const addBookmark = function (recipe) {
 state.bookmarks.push(recipe);
 if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
 persistBookmarks();
};
export const removeBookmark = function (id) {
 const index = state.bookmarks.findIndex((el) => el.id === id);
 state.bookmarks.splice(index, 1);
 if (id === state.recipe.id) state.recipe.bookmarked = false;
 persistBookmarks();
};

const init = function () {
 const storage = localStorage.getItem("bookmarks");
 if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
 localStorage.clear("bookmarks");
};
export const uploadRecipe = async function (newRecipe) {
 try {
  const ingredients = Object.entries(newRecipe)
   .filter((i) => i[0].startsWith("ingredient") && i[1] != "")
   .map((ing) => {
    ingArr = ing[1].replaceAll(" ", "").split(",");
    if (ingArr.length !== 3) throw new Error("Wrong ingredient format! Try to put quantity,unit,description in this format");
    const [quantity, unit, description] = ingArr;
    return { quantity: quantity ? +quantity : null, unit, description };
   });
  const recipe = {
   title: newRecipe.title,
   source_url: newRecipe.sourceUrl,
   image_url: newRecipe.image,
   publisher: newRecipe.publisher,
   cooking_time: +newRecipe.cookingTime,
   servings: +newRecipe.servings,
   ingredients,
  };
  const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
  state.recipe = createRecipeObj(data);
  addBookmark(state.recipe);
 } catch (error) {
  throw error;
 }
};
