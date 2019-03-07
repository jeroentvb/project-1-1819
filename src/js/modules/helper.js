/* global L */

function icon (color) {
  return L.icon({
    iconUrl: `src/images/marker-${color}.png`,

    iconSize: [ 38, 60 ],
    iconAnchor: [ 22, 59 ],
    popupAnchor: [-3, -76]
  })
}

export const helper = {
  icon
}
