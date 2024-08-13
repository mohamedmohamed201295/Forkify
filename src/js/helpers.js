import { TIMEOUT_SECS } from './config.js'

import { async } from 'regenerator-runtime'

/**
 * Promisifying setTimeout() method
 *
 * Creates a promise that rejects after a specified number of seconds.
 *
 * This function is typically used to set a timeout for asynchronous operations like fetch requests. If the operation takes longer than the specified time, the promise will reject with a timeout error.
 * @param {number} s The number of seconds before the promise rejects.
 * @returns {Promise<never>} A promise that always rejects with a timeout error after the specified time.
 */
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`))
    }, s * 1000)
  })
}

/**
 * Makes an AJAX request to a given URL. Can handle both GET and POST requests.
 *
 * This function supports both GET (by default) and POST requests (when `uploadData` is provided). It also includes a timeout to prevent the request from hanging indefinitely.
 *
 * @async
 * @param {string} url The URL to which the request is sent.
 * @param {Object} [uploadData=undefined] Optional data to be sent with a POST request. If not provided, a GET request is made.
 * @returns {Promise<*>} A promise that resolves with the parsed JSON data from the response.
 * @throws {Error} Throws an error if the request fails or the server returns a non-OK status.
 */
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = await Promise.race([
      uploadData
        ? fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(uploadData)
          })
        : fetch(url),
      timeout(TIMEOUT_SECS)
    ])
    const data = await fetchPro.json()
    if (!fetchPro.ok) throw new Error(`${data.message} (${res.status})`)
    return data
  } catch (err) {
    throw err
  }
}
/*
export const getJSON = async function (url) {
  try {
    const res = await Promise.race([
      fetch(
        // 'https://forkify-api.herokuapp.com/api/v2/recipes/${id}'
        url
      ),
      timeout(TIMEOUT_SECS)
    ])
    const data = await res.json()
    if (!res.ok) throw new Error(`${data.message} (${res.status})`)
    return data
  } catch (err) {
    throw err
  }
}

export const sendJSON = async function (url, uploadData) {
  try {
    const res = await Promise.race([
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData)
      }),
      timeout(TIMEOUT_SECS)
    ])
    const data = await res.json()
    if (!res.ok) throw new Error(`${data.message} (${res.status})`)
    return data
  } catch (err) {
    throw err
  }
}
*/
