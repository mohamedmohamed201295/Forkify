import icons from 'url:../../img/icons.svg'

export default class View {
  _data

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe). If the data is invalid or an empty array, an error is rendered instead.
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {string | undefined} Returns the generated markup as a string if `render` is `false`. Otherwise, returns `undefined`.
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError()
    this._data = data
    const markup = this._generateMarkup()

    if (!render) return markup

    this._clear()
    this._parentEl.insertAdjacentHTML('afterbegin', markup)
  }

  /**
   * Updates the DOM elements with new data without re-rendering the entire view.
   *
   * This method compares the new markup with the current markup and only updates the elements that have changed. This allows for efficient DOM updates, especially when dealing with large data sets.
   *
   * @param {Object} data The new data to be used for updating the view.
   * @returns {void} This method does not return a value.
   */
  update(data) {
    this._data = data
    const newMarkup = this._generateMarkup()

    const newDOM = document.createRange().createContextualFragment(newMarkup)
    const newEls = Array.from(newDOM.querySelectorAll('*'))
    const curEls = Array.from(this._parentEl.querySelectorAll('*'))

    newEls.forEach((newEl, i) => {
      const curEl = curEls[i]
      if (
        !curEl.isEqualNode(newEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      )
        curEl.textContent = newEl.textContent

      if (!curEl.isEqualNode(newEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        )
    })
  }

  _clear() {
    return (this._parentEl.innerHTML = '')
  }

  renderError(message = this._errMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `
    this._clear()
    this._parentEl.insertAdjacentHTML('afterbegin', markup)
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `
    this._clear()
    this._parentEl.insertAdjacentHTML('afterbegin', markup)
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `
    this._clear()
    this._parentEl.insertAdjacentHTML('afterbegin', markup)
  }
}
