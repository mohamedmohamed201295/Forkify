import View from './View.js'

import icons from 'url:../../img/icons.svg'

class AddRecipe extends View {
  _parentEl = document.querySelector('.upload')
  _message = 'Recipe has successfully uploaded :)'

  _window = document.querySelector('.add-recipe-window')
  _overlay = document.querySelector('.overlay')
  _btnOpen = document.querySelector('.nav__btn--add-recipe')
  _btnClose = document.querySelector('.btn--close-modal')

  constructor() {
    super()
    this._addHandlerShowWindow()
    this._addHandlerHideWindow()
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden')
    this._window.classList.toggle('hidden')
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this))
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this))
    this._overlay.addEventListener('click', this.toggleWindow.bind(this))
  }

  addHandlerUpload(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault()
      const dataArr = [...new FormData(this)]
      const dataObj = Object.fromEntries(dataArr)
      handler(dataObj)
    })
  }

  _generateMarkup() {}
}

export default new AddRecipe()
