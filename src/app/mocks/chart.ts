import {
  IThing
} from './../models/g-thing.model';
export let MOCK_CHART_DATA = [];
export let MOCK_NEW_CHART_DATA: IThing[] = [];
export let MOCK_NEW_CHART_TANK_DATA: IThing[] = [];


MOCK_NEW_CHART_DATA = [{
  id: '0',
  name: 'thing name',
  sensors: [{
    id: '0',
    sensorType: {
      id: '0',
      name: 'battery percentage',
      postfix: '%'
    },
    series: [{
        timestamp: 1568066400000,
        avg: 75.83794466403162,
        min: 75.0,
        max: 77.0,
        sum: 19187.0
      },
      {
        timestamp: 1568671200000,
        avg: 75.0,
        min: 75.0,
        max: 75.0,
        sum: 19350.0
      }
    ]
  }]
}];


MOCK_NEW_CHART_TANK_DATA = [{
  id: '0',
  name: 'thing name',
  sensors: [{
    id: '0',
    sensorType: {
      id: '0',
      name: 'tank fill level',
      postfix: '%'
    },
    series: [{
      timestamp: 1560819600000,
      avg: 96.0,
      min: 96.0,
      max: 96.0,
      sum: 96.0
    }, {
      timestamp: 1560837600000,
      avg: 96.0,
      min: 96.0,
      max: 96.0,
      sum: 96.0
    }, {
      timestamp: 1560859200000,
      avg: 94.0,
      min: 94.0,
      max: 94.0,
      sum: 94.0
    }, {
      timestamp: 1560880800000,
      avg: 23.0,
      min: 23.0,
      max: 23.0,
      sum: 23.0
    }, {
      timestamp: 1560902400000,
      avg: 23.0,
      min: 23.0,
      max: 23.0,
      sum: 23.0
    }, {
      timestamp: 1560924000000,
      avg: 23.0,
      min: 23.0,
      max: 23.0,
      sum: 23.0
    }, {
      timestamp: 1560949200000,
      avg: 23.0,
      min: 23.0,
      max: 23.0,
      sum: 23.0
    }, {
      timestamp: 1560967200000,
      avg: 23.0,
      min: 23.0,
      max: 23.0,
      sum: 23.0
    }]
  }]
}];
