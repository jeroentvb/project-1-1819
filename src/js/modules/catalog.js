import { API } from '../../../node_modules/oba-wrapper/js/index.js'

const api = new API({
  key: '1e19898c87464e239192c8bfe422f280'
})

async function search (query) {
  const stream = await api.createStream(`search/${query}`) // &facet=type(cd)
  stream
    .pipe(log)
    // .pipe(res => console.save(res))
}

async function available () {
  const stream = await api.createStream('availability/32F6F7C2CF360A0')
  stream
    .pipe(log)
}

function log (val) {
  console.log(val)

  return val
}

export const catalog = {
  search,
  available
}
