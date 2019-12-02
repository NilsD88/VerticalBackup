const MAP_TILES_URL = {
    MAPBOX: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoibmljb2xhc2FuY2VsIiwiYSI6ImNqeHZ4ejg0ZjAzeGIzcW1vazI0MHJia3MifQ.METba-D_-BOMeRbRnwDkFw',
    OSM: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
}

const MAP_TILES_URL_ACTIVE = MAP_TILES_URL.OSM;

export {
    MAP_TILES_URL_ACTIVE
}
