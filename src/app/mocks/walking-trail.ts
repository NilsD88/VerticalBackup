import { IThing } from 'src/app/models/g-thing.model';
export let MOCK_TOTAL_COUNT_PAST_WEEK: IThing[] = [{
  id: '22',
  devEui: '4883C7DF300C104D',
  name: 'thing SHOCK',
  batteryPercentage: 95,
  sensors: [{
    id: '24',
    sensorType: {
      id: '6',
      name: 'shock',
      postfix: '%',
      min: 0.0,
      max: 100.0,
    },
    sensorDefinition: {
      name: 'shoooooock',
      chartType: 'spline',
      useOnChart: true,
      aggregatedValues: {
        min: true,
        max: true,
        avg: false,
        sum: true
      }
    },
    series: [{
      timestamp: 1572476400000,
      avg: 1.0,
      min: 1.0,
      max: 1.0,
      sum: 14.0
    }, {
      timestamp: 1572822000000,
      avg: 1.0,
      min: 1.0,
      max: 1.0,
      sum: 55.0
    }, {
      timestamp: 1572908400000,
      avg: 1.0,
      min: 1.0,
      max: 1.0,
      sum: 22.0
    }]
  }]
}];
