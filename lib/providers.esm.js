function osm(x, y, z) {
  return 'https://tile.openstreetmap.org/' + z + '/' + x + '/' + y + '.png'
}
function stamenToner(x, y, z, dpr) {
  if (dpr === void 0) {
    dpr = 1
  }

  return 'https://stamen-tiles.a.ssl.fastly.net/toner/' + z + '/' + x + '/' + y + (dpr >= 2 ? '@2x' : '') + '.png'
}
function stamenTerrain(x, y, z, dpr) {
  if (dpr === void 0) {
    dpr = 1
  }

  return 'https://stamen-tiles.a.ssl.fastly.net/terrain/' + z + '/' + x + '/' + y + (dpr >= 2 ? '@2x' : '') + '.jpg'
}
var maptiler = function maptiler(apiKey, map) {
  if (map === void 0) {
    map = 'streets'
  }

  return function (x, y, z, dpr) {
    if (dpr === void 0) {
      dpr = 1
    }

    return (
      'https://api.maptiler.com/maps/' +
      map +
      '/256/' +
      z +
      '/' +
      x +
      '/' +
      y +
      (dpr >= 2 ? '@2x' : '') +
      '.png?key=' +
      apiKey
    )
  }
}
var stadiamaps = function stadiamaps(style) {
  if (style === void 0) {
    style = 'alidade_smooth'
  }

  return function (x, y, z, dpr) {
    if (dpr === void 0) {
      dpr = 1
    }

    return (
      'https://tiles.stadiamaps.com/styles/' + style + '/' + z + '/' + x + '/' + y + (dpr >= 2 ? '@2x' : '') + '.png'
    )
  }
}

export { maptiler, osm, stadiamaps, stamenTerrain, stamenToner }
