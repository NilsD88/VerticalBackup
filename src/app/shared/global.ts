const MAP_TILES_URL = {
    MAPBOX: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoibmljb2xhc2FuY2VsIiwiYSI6ImNqeHZ4ejg0ZjAzeGIzcW1vazI0MHJia3MifQ.METba-D_-BOMeRbRnwDkFw',
    OSM: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
}

const MAP_TILES_URL_ACTIVE = MAP_TILES_URL.OSM;
const UNKNOWN_PARENT_ID = 'xXxXx';

const DEFAULT_LOCATION = {
    lat: 50.860180,
    lng: 4.358606
};

const HIGHCHARTS_MENU_ITEMS = [
    'viewFullscreen',
    'printChart',
    'separator',
    'downloadPNG',
    'downloadJPEG',
    'separator',
    'downloadCSV',
    'downloadXLS',
    'viewData'
];

const COLORS = {
    blue: '#0073CF',
    red: '#DE2A56'
};

const SENSOR_TYPE_COLORS =  {
    'alarm 1': 'black',
    'alarm 2': 'black',
    'alarm 3': 'black',
    'backtonormal_overrun': 'black',
    'battery': 'brown',
    'battery level': 'brown',
    'battery percentage': 'brown',
    'battery voltage': 'brown',
    'Battery Voltage': 'brown',
    'battery_current_level': 'brown',
    'co2': 'lightgreen',
    'consumption': 'lightgray',
    'counter': 'orange',
    'Counter A': 'orange',
    'Counter B': 'darkorange',
    'device id': 'black',
    'device status': 'black',
    'freshness_alarm1': 'black',
    'highthreshold_overrun': 'black',
    'historic tank fill level': 'green',
    'historic temperature': 'red',
    'humidity': 'lightblue',
    'keep alive': 'black',
    'keep alive active scenarios': 'black',
    'keep alive battery percentage': 'black',
    'luminosity': 'yellow',
    'measurement interval': 'black',
    'Payload Counter': 'black',
    'payload type': 'black',
    'presence': 'lightorange',
    'pulse': 'lightorange',
    'resistance': 'purple',
    'resistance_alarm1': 'black',
    'RSSI': 'black',
    'Sensor Status': 'black',
    'shock': 'lightorange',
    'shock counter': 'orange',
    'tank fill level': 'green',
    'Tank fill level': 'green',
    'temperature': 'red',
    'Temperature': 'red',
    'Total Counter A': 'orange',
    'Total Counter B': 'darkorange',
    'total_count': 'orange',
    'transmit interval': 'black',
    'type variant': 'black',
    'x axis': 'darkgrey',
    'y axis': 'darkgrey',
    'z axis': 'darkgrey'
  };

export {
    MAP_TILES_URL_ACTIVE,
    UNKNOWN_PARENT_ID,
    DEFAULT_LOCATION,
    HIGHCHARTS_MENU_ITEMS,
    COLORS,
    SENSOR_TYPE_COLORS,
};
