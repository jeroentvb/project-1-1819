/* global routie, localStorage */

import { API } from './modules/oba-wrapper/js/index.js'
import { render } from './modules/render.js'

const api = new API({
  key: '1e19898c87464e239192c8bfe422f280'
})

routie({
  'home': () => home(),
  'info/:frabl': frabl => detail(frabl),
  'locatie/:name': name => locatie(name),
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
    const main = document.querySelector('main')
    e.preventDefault()
    search.submit.disabled = true

    render.loader()
    main.classList.remove('main--home')
    main.classList.add('main--loader')

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
    document.querySelector('.main--loader').classList.add('fadeOut')

    setTimeout(() => {
      render.detail(dataset)
    }, 700)
  } else if (url.includes('#')) {
    document.querySelector('.main--loader').classList.add('fadeOut')

    setTimeout(() => {
      window.location.href = window.location.href.split('#')[0] + `#info/${dataset.search.frabl._text}`
    }, 700)
  } else {
    document.querySelector('.main--loader').classList.add('fadeOut')

    setTimeout(() => {
      window.location.href = window.location.href + `#info/${dataset.search.frabl._text}`
    }, 700)
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

function locatie (name) {
  const dataset = JSON.parse(localStorage.getItem('dataset'))

  render.locatie(name, dataset)
}
