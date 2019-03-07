/* global routie, localStorage */

import { API } from '../../node_modules/oba-wrapper/js/index.js'
import { render } from './modules/render.js'

const api = new API({
  key: '1e19898c87464e239192c8bfe422f280'
})

routie({
  'home': () => home(),
  'info/:frabl': frabl => detail(frabl),
  '*': () => home()
})

function home () {
  render.home()

  const search = {
    field: document.getElementById('book-title'),
    submit: document.getElementById('search-book')
  }

  search.submit.addEventListener('click', async e => {
    const query = search.field.value
    e.preventDefault()
    search.submit.disabled = true

    render.loader()

    if (!query) return console.error('No query!')

    try {
      const result = await api.createStream(`search/${query}{1}`)
      result
        .pipe(available)
    } catch (err) {
      render.error('Er is geen boek gevonden met deze titel..')
    }
  })
}

async function available (data) {
  const url = window.location.href
  const frabl = data.frabl._text
  const availabilityData = await api.availability(frabl)
  const availability = availabilityData.aquabrowser.locations.location
  const dataset = {
    search: data,
    availability: availability
  }

  localStorage.setItem('dataset', JSON.stringify(dataset))
  if (url === window.location.href.split('#')[0] + `#info/${dataset.search.frabl._text}`) {
    render.detail(dataset)
  } else if (url.includes('#')) {
    window.location.href = window.location.href.split('#')[0] + `#info/${dataset.search.frabl._text}`
  } else {
    window.location.href = window.location.href + `#info/${dataset.search.frabl._text}`
  }
}

async function detail (frabl) {
  render.loader()
  const dataset = JSON.parse(localStorage.getItem('dataset'))

  if (!dataset || frabl !== dataset.search.frabl._text) {
    const result = await api.details(frabl)
    console.log(result)

    if (result.aquabrowser.error) {
      return render.error('A book with this id doesn\'t exist')
    }

    available(result.aquabrowser)
  } else {
    render.detail(dataset)
  }
}
