function create (name, cssClass) {
  const el = document.createElement(name)

  if (cssClass && !Array.isArray(cssClass)) el.classList.add(cssClass)
  if (cssClass && Array.isArray(cssClass)) cssClass.forEach(cssClass => el.classList.add(cssClass))

  return el
}

function article (data) {
  const url = window.location.href.split('#')[0]

  if (!data) throw new Error('No data given')

  const article = document.createElement('article')
  const a = this.link(`${url}#detail/${data.id}`)
  const img = this.image(data.img_src)
  const p = this.paragraph(`Id: ${data.id}`)
  const p2 = this.paragraph(`Earth date of photo: ${data.earth_date}`)

  a.appendChild(img)

  article.appendChild(a)
  article.appendChild(p)
  article.appendChild(p2)

  return article
}

function heading (type, content = '') {
  const headings = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6'
  ]

  if (!content) console.warn('No content given')
  if (headings.indexOf(type) === -1) {
    type = 'h1'
    console.warn('No existing heading type specified, h1 used.')
  }

  const heading = document.createElement(type)
  const text = document.createTextNode(content)

  heading.appendChild(text)

  return heading
}

function paragraph (content = '') {
  if (!content) console.warn('No content given')

  const p = document.createElement('p')
  const text = document.createTextNode(content)

  p.appendChild(text)

  return p
}

function link (href, content, cssClass) {
  if (!href) throw new Error('No href specified')

  const a = document.createElement('a')

  a.href = href

  if (content) {
    const text = document.createTextNode(content)
    a.appendChild(text)
  }

  if (cssClass) a.classList.add(cssClass)

  return a
}

function image (src, cssClass) {
  if (!src) throw new Error('No image source specified')

  const img = document.createElement('img')

  img.src = src

  if (cssClass) img.classList.add(cssClass)

  return img
}

function label (forLink, content, cssClass) {
  const label = document.createElement('label')

  if (forLink) label.for = forLink
  if (content) {
    const text = document.createTextNode(content)
    label.appendChild(text)
  }
  if (cssClass) label.classList.add(cssClass)

  return label
}

function input (type, id, cssClass, placeholder) {
  if (!type || !id) throw new Error('No input type or id specified')

  const input = document.createElement('input')

  input.type = type
  input.id = id

  if (cssClass && !Array.isArray(cssClass)) input.classList.add(cssClass)
  if (cssClass && Array.isArray(cssClass)) cssClass.forEach(cssClass => input.classList.add(cssClass))
  if (placeholder) input.placeholder = placeholder

  return input
}

function section (id) {
  const section = document.createElement('section')

  if (id) section.id = id

  return section
}

function removeChildren (el) {
  while (el.firstChild) el.removeChild(el.firstChild)
}

function update (el, elements) {
  removeChildren(el)

  if (elements.length === undefined) {
    el.appendChild(elements)
  } else {
    elements.forEach(element => el.appendChild(element))
  }
}

function appendChildren (el, elements) {
  elements.forEach(element => el.appendChild(element))
}

export const element = {
  create,
  article,
  heading,
  paragraph,
  link,
  image,
  label,
  input,
  section,
  removeChildren,
  update,
  appendChildren
}
