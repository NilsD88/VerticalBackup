export let MOCK_ALERTS;

MOCK_ALERTS = [{
    id: '0',
    timestamp: new Date(),
    read: false,
    asset: {
      name: 'Test asset',
      location: {
        name: 'Test Location'
      }
    },
    severity: 'LOW',
    label: 'Careful!',
    sensorType: {
      name: 'humidity',
      postfix: '%',
      id: '2'
    },
    thing: {
      name: 'Thing Name',
      devEui: '0012390381203812'
    },
    thresholdTemplateName: 'Threshold Template',
    value: 22
  },
  {
    id: '1',
    timestamp: new Date(1970),
    read: true,
    asset: {
      name: 'Asset',
      location: {
        name: 'Location'
      }
    },
    severity: 'CRITICAL',
    sensorType: {
      name: 'temperature',
      postfix: '°C',
      id: '1'
    },
    thing: {
      name: 'ZThing',
      devEui: '0012390381203812'
    },
    thresholdTemplateName: 'Threshold Template 1',
    value: 22
  },
  {
    id: '2',
    timestamp: new Date(1970),
    read: true,
    asset: {
      name: 'AEZ',
      location: {
        name: 'Location'
      }
    },
    severity: 'MEDIUM',
    sensorType: {
      name: 'temperature',
      postfix: '°C',
      id: '1'
    },
    thing: {
      name: 'OThing',
      devEui: 'IUOU9879'
    },
    thresholdTemplateName: 'Threshold Template 2',
    value: 90
  },
];
