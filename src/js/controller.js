import * as model from './model.js'
import { MODAL_CLOSE_SEC } from './config.js'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'
import resultsView from './views/resultsView.js'
import paginationView from './views/paginationView.js'
import bookmarksView from './views/bookmarksView.js'
import addRecipeView from './views/addRecipeView.js'

import 'core-js/stable'
import 'regenerator-runtime/runtime'

// This is not js this is coming from parcel
/*
if (module.hot) {
  module.hot.accept()
}
*/
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1)
    if (!id) return
    recipeView.renderSpinner()

    // 0. Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage())

    // 1. Update bookmarks view
    bookmarksView.update(model.state.bookmarks)

    // 1. Loading recipe
    await model.loadRecipe(id)

    // 2. Rendering recipe
    recipeView.render(model.state.recipe)
  } catch (err) {
    recipeView.renderError()
  }
}

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner()

    // 1. Get search query
    const query = searchView.getQuery()
    if (!query) return

    // 2. Load search results
    await model.loadSearchResults(query)

    // 3. Render results
    resultsView.render(model.getSearchResultsPage())

    // 4. Render initial pagination buttons
    paginationView.render(model.state.search)
  } catch (err) {
    console.log(err)
  }
}

const controlPagination = function (goToPage) {
  // 1. Render New results
  resultsView.render(model.getSearchResultsPage(goToPage))

  // 2. Render New initial pagination buttons
  paginationView.render(model.state.search)
}

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings)

  // Update the recipe view
  recipeView.update(model.state.recipe)
}

const controlAddBookmark = function () {
  // 1. Add/Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id)

  // 2. Update recipe view
  recipeView.update(model.state.recipe)

  // 3. Render bookmarks
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmark = function () {
  bookmarksView.render(model.state.bookmarks)
}

const controlAddNewRecipe = async function (data) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner()

    // Upload the new recipe data
    await model.uploadRecipe(data)
    console.log(model.state.recipe)

    // Success message
    addRecipeView.renderMessage()

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks)

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    // Render recipe
    recipeView.render(model.state.recipe)

    // Close form
    setTimeout(function () {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)
  } catch (err) {
    console.error(err)
    addRecipeView.renderError(err.message)
  }
}

// controlRecipes()
const init = function () {
  bookmarksView.addHandlerRender(controlBookmark)
  recipeView.addHandlerRender(controlRecipes)
  searchView.addHandlerSearch(controlSearchResults)
  recipeView.addHandlerAddBookMark(controlAddBookmark)
  paginationView.addHandlerClick(controlPagination)
  recipeView.addHandlerUpdateServings(controlServings)
  addRecipeView.addHandlerUpload(controlAddNewRecipe)
}
init()

// For development
const clearBookmarks = function () {
  localStorage.clear()
}
clearBookmarks()
