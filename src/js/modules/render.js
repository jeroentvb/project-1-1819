/* global L */

import { element } from './element.js'
import { helper } from './helper.js'

function searchForm () {
  const form = element.create('form', [ 'form', 'form--search' ])
  const label = element.label('book-title', 'Zoek een titel ', 'form__label')
  const field = element.input('text', 'book-title', 'form__input', 'Titel van een boek')
  const submit = element.input('submit', 'search-book', [ 'form__submit', 'button' ])

  element.appendChildren(form, [
    label,
    field,
    submit
  ])

  return form
}

function pageHeader (title) {
  const header = element.create('header')
  const h1 = element.heading('h1', title)
  const logo = element.image('./src/images/oba-logo.svg', 'logo')

  element.appendChildren(header, [
    h1,
    logo
  ])

  return header
}

function loader () {
  const div = element.create('div', 'loader')
  div.innerHTML = `<svg version="1.1" class="loader__img" id="Laag_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="0 0 144.57 79.37" xml:space="preserve">
  <style type="text/css">
    .st0{fill:#E30613;}
  </style>
  <g class="l-1">
    <path class="st0" d="M46.16,0h15v32.2h0.2c3.4-4.7,9.2-6.4,15.4-6.4c13.8,0,22.2,12.4,22.2,25.9c0,14.7-9.5,25.1-23.9,25.1
    c-6.8,0-12.6-4.1-14.9-7.6h-0.2v6.4h-13.8V0z M71.96,63.6c7.5,0,12-5,12-12.3c0-7.3-4.5-12.3-12-12.3s-12,5-12,12.3
    C59.96,58.6,64.46,63.6,71.96,63.6z"/>
  </g>
  <g class="l-2">
    <path class="st0" d="M0.3,51.42c0-11.25,7.5-20.25,19.13-20.25c11.63,0,19.13,9,19.13,20.25s-7.5,20.25-19.13,20.25
    C7.8,71.67,0.3,62.67,0.3,51.42z M28.65,51.42c0-5.62-3.75-9-9.23-9c-5.47,0-9.22,3.38-9.22,9s3.75,9,9.22,9
    C24.9,60.42,28.65,57.04,28.65,51.42z"/>
  </g>
  <g class="l-3">
    <path class="st0" d="M138.8,44.71v0.15c3.9,2.48,5.48,6.98,5.48,11.55c0,6.82-3.9,12.97-11.25,12.97
      c-12.6,0-12.82-15.3-12.82-24.67c-3.98,0-6.53,3.3-6.53,7.2c0,3.67,1.65,6.75,4.35,9.15l-6.15,6c-3.9-4.13-5.85-10.13-5.85-16.05
      c0-13.12,6.67-16.65,18.83-16.65h18.53v10.35H138.8z M127.4,47.48c0,3.45,0.3,11.1,5.25,11.1c2.7,0,3.98-2.85,3.98-5.33
      c0-4.42-2.33-8.55-6.83-8.55h-2.4V47.48z"/>
  </g>
  </svg>`

  if (document.querySelector('main')) {
    element.update(document.querySelector('main'), div)
  } else {
    document.body.appendChild(div)
  }
}

function home () {
  window.scrollTo(0, 0)
  const header = pageHeader('Zoek een boek')

  const main = element.create('main', [ 'main', 'main--home' ])
  const form = searchForm()

  main.appendChild(form)

  element.update(document.body, [
    header,
    main
  ])
}

function detail (data) {
  window.scrollTo(0, 0)
  const url = window.location.href.split('#')[0]
  const header = pageHeader('Beschikbaarheid')

  const main = element.create('main', [ 'main', 'main--availability' ])
  const a = element.link(`${url}#home`, 'Terug', 'button')

  const container = element.create('section', 'section__book-info')
  const containerDiv = element.create('div', 'book-info__container')

  const img = element.image(data.search.coverimages.coverimage[1]._text, 'cover')

  const div1 = createRow('Titel', data.search.titles['short-title']._text)
  const div2 = createRow('Auteur', data.search.authors ? data.search.authors['main-author']._text.split(',')[1] + ' ' + data.search.authors['main-author']._text.split(',')[0] : 'Niet gevonden')
  const div3 = createRow('Isbn', data.search.identifiers['isbn-id'] ? data.search.identifiers['isbn-id']._text : 'Niet gevonden')

  let subjectString = ''

  if (data.search.subjects) {
    if (data.search.subjects['topical-subject'].length > 0) {
      data.search.subjects['topical-subject'].forEach(subject => {
        subjectString += subject._text + ', '
      })
    } else {
      subjectString += data.search.subjects['topical-subject']._text + ', '
    }
  } else {
    subjectString = 'Niet gevonden'
  }

  const div4 = createRow('Genres', subjectString)

  const div5 = createRow('Samenvatting', data.search.summaries ? data.search.summaries.summary._text : 'Niet gevonden')
  element.appendChildren(containerDiv, [
    div1,
    div2,
    div3,
    div4,
    div5
  ])

  element.appendChildren(container, [
    img,
    containerDiv
  ])

  element.appendChildren(main, [
    a,
    container
  ])

  // console.log(data.availability)

  element.update(document.body, [
    header,
    main
  ])

  initMap(data)
}

function createRow (heading, content) {
  const div = element.create('div', 'row')
  const title = element.heading('h3', heading)
  const text = element.paragraph(content)

  element.appendChildren(div, [
    title,
    text
  ])

  return div
}

function initMap (dataset) {
  const url = window.location.href.split('#')[0]
  dataset = dataset.availability
  const coordinates = {
    lat: 52.370216,
    long: 4.895168
  }
  const main = document.getElementsByTagName('main')[0]

  // console.log(dataset)

  if (dataset.length > 0) {
    const div = document.createElement('div')
    div.id = 'map'

    main.appendChild(div)

    const map = L.map('map').setView([coordinates.lat, coordinates.long], 11)
    // map.dragging.disable()

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      // subdomains: 'abcd',
      maxZoom: 13,
      minZoom: 11
    })
      .addTo(map)

    dataset.forEach(location => {
      const lat = location.holding._attributes.latitude
      const long = location.holding._attributes.longitude

      if (location._attributes.available === 'true') {
        const marker = L.marker([lat, long], { icon: helper.icon('green') })
          .addTo(map)

        let string = `<h2>Locatie: ${location._attributes.name}</h2>`

        if (location.items.item.length > 0) {
          location.items.item.forEach(shelf => {
            if (shelf._attributes.available === 'true') string += `<p>Te vinden op de afdeling: ${shelf.subloc._text}</p>`
          })
        } else {
          if (location.items.item._attributes.available === 'true') string += `<p>Te vinden op de afdeling: ${location.items.item.subloc._text}</p>`
        }

        string += `<p><a class="button" href="${url}#locatie/${location._attributes.name.split(' ').join('-')}">Openingstijden</a></p>`
        string += '<button class="button">Reserveer</button>'

        marker.bindPopup(string)
      } else {
        const marker = L.marker([lat, long], { icon: helper.icon('red') })
          .addTo(map)

        let string = `<h2>Locatie: ${location._attributes.name}</h2>`

        if (location.items.item.length > 0) {
          location.items.item.forEach(shelf => {
            if (shelf.returndate) string += `<p>Weer beschikbaar op: ${shelf.returndate._text}</p>`
          })
        } else {
          if (location.items.item.returndate) string += `<p>Weer beschikbaar op: ${location.items.item.returndate._text}</p>`
        }

        string += `<p><a class="button" href="${url}#locatie/${location._attributes.name.split(' ').join('-')}">Openingstijden</a></p>`
        string += '<button class="button">Reserveer</button>'

        marker.bindPopup(string)
      }
    })
  } else {
    const p = element.paragraph(`Dit boek is alleen vindbaar in het ${dataset.holding._attributes.name}`)

    main.appendChild(p)
  }
}

function locatie (name, data) {
  window.scrollTo(0, 0)
  data = data.availability
  name = name.split('-').join(' ')
  const coordinates = {
    lat: 52.370216,
    long: 4.895168
  }
  let locatie

  const header = pageHeader('Locatie info')
  const main = element.create('main', [ 'main', 'main--location' ])
  const a = element.link(`#`, 'Terug', 'button')
  a.addEventListener('click', e => {
    e.preventDefault()
    window.history.back()
  })

  data.forEach(location => {
    if (name === location._attributes.name) {
      locatie = location
      const div1 = createRow('Naam', location.holding._attributes.name)
      const div2 = createRow('Adres', location.holding.address.street._text + location.holding.address.number._text)
      const div3 = createRow('Telefoon', location.holding.address.phone._text)

      const h2 = element.heading('h2', 'Openingstijden')
      console.log(location.holding)

      const div4 = createRow('Maandag', location.holding['opening-hours'].monday.timespan ? location.holding['opening-hours'].monday.timespan._attributes.open + ' - ' + location.holding['opening-hours'].monday.timespan._attributes.close : 'Niet beschikbaar')
      const div5 = createRow('Dinsdag', location.holding['opening-hours'].tuesday.timespan ? location.holding['opening-hours'].tuesday.timespan._attributes.open + ' - ' + location.holding['opening-hours'].tuesday.timespan._attributes.close : 'Niet beschikbaar')
      const div6 = createRow('Woensdag', location.holding['opening-hours'].wednesday.timespan ? location.holding['opening-hours'].wednesday.timespan._attributes.open + ' - ' + location.holding['opening-hours'].wednesday.timespan._attributes.close : 'Niet beschikbaar')
      const div7 = createRow('Donderdag', location.holding['opening-hours'].thursday.timespan ? location.holding['opening-hours'].thursday.timespan._attributes.open + ' - ' + location.holding['opening-hours'].thursday.timespan._attributes.close : 'Niet beschikbaar')
      const div8 = createRow('Vrijdag', location.holding['opening-hours'].friday.timespan ? location.holding['opening-hours'].friday.timespan._attributes.open + ' - ' + location.holding['opening-hours'].friday.timespan._attributes.close : 'Niet beschikbaar')
      const div9 = createRow('Zaterdag', location.holding['opening-hours'].saturday.timespan ? location.holding['opening-hours'].saturday.timespan._attributes.open + ' - ' + location.holding['opening-hours'].saturday.timespan._attributes.close : 'Niet beschikbaar')
      const div10 = createRow('Zondag', location.holding['opening-hours'].sunday.timespan ? location.holding['opening-hours'].sunday.timespan._attributes.open + ' - ' + location.holding['opening-hours'].sunday.timespan._attributes.close : 'Niet beschikbaar')

      const h22 = element.heading('h2', 'Op de kaart')
      const div = element.create('div')
      div.id = 'map'

      element.appendChildren(main, [
        a,
        div1,
        div2,
        div3,
        h2,
        div4,
        div5,
        div6,
        div7,
        div8,
        div9,
        div10,
        h22,
        div
      ])
    }
  })

  element.update(document.body, [
    header,
    main
  ])

  const map = L.map('map').setView([coordinates.lat, coordinates.long], 11)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 13,
    minZoom: 11
  })
    .addTo(map)

  L.marker([locatie.holding._attributes.latitude, locatie.holding._attributes.longitude], { icon: helper.icon('black') })
    .addTo(map)
}

function error (message) {
  const url = window.location.href.split('#')[0]
  const p = element.paragraph(`Error: ${message}`)
  const a = element.link(`${url}`, 'Terug', 'button')

  if (document.querySelector('main')) {
    element.update(document.querySelector('main'), [
      p,
      a
    ])
  } else {
    element.appendChildren(document.body, [
      p,
      a
    ])
  }
}

export const render = {
  loader,
  home,
  detail,
  locatie,
  error
}
