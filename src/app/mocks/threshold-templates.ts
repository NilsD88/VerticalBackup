export let MOCK_THRESHOLD_TEMPLATES_PAGED;
export let MOCK_THRESHOLD_TEMPLATES;

MOCK_THRESHOLD_TEMPLATES = [
  {
    id: 1,
    name: 'Threshold mock 1 with very very long title to test',
    metadata: {
      lastModificationDate: new Date(2019, 8),
      creationDate: new Date(1970, 3),
      lastModificationAuthor: 'Nicolas A.',
      creationAuthor: 'Nils D.',
    },
    sensors: [
      {
        sensorType: {
          id: '1',
          name: 'temperature',
          postfix: 'C',
          min: -20,
          max: 60,
          type: 'NUMBER'
        },
        thresholds: [
          {
            id: 123213123123,
            range: {
              from: -5,
              to: 0
            },
            severity: 'LOW',
            alert: {
              web: true,
              sms: false,
              mail: false
            }
          },
          {
            id: 123213129873,
            range: {
              from: -10,
              to: -5
            },
            severity: 'MEDIUM',
            alert: {
              web: true,
              sms: false,
              mail: true
            }
          },
          {
            id: 897809263,
            range: {
              from: -20,
              to: -10
            },
            severity: 'CRITICAL',
            alert: {
              web: true,
              sms: true,
              mail: true
            },
            label: 'MyLabel'
          },
          {
            id: 123213038873,
            range: {
              from: 5,
              to: 10
            },
            severity: 'LOW',
            alert: {
              web: true,
              sms: false,
              mail: false
            }
          },
          {
            id: 123213,
            range: {
              from: 10,
              to: 15
            },
            severity: 'MEDIUM',
            alert: {
              web: true,
              sms: false,
              mail: false
            }
          },
          {
            id: 1232130988873,
            range: {
              from: 15,
              to: 60
            },
            severity: 'CRITICAL',
            alert: {
              web: true,
              sms: false,
              mail: false
            }
          }
        ]
      },
      {
        sensorType: {
          id: '2',
          name: 'humidity',
          postfix: '%',
          min: 0,
          max: 100,
          type: 'NUMBER'
        },
        thresholds: [
          {
            id: 23980239,
            range: {
              from: 28,
              to: 59
            },
            severity: 'LOW',
            alert: {
              web: true,
              sms: false,
              mail: false
            }
          },
          {
            id: 2398023329,
            range: {
              from: 59,
              to: 80
            },
            severity: 'MEDIUM',
            alert: {
              web: true,
              sms: false,
              mail: false
            }
          },
          {
            id: 23980234099,
            range: {
              from: 80,
              to: 100
            },
            severity: 'CRITICAL',
            alert: {
              web: true,
              sms: false,
              mail: false
            }
          },
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Threshold mock 2',
    metadata: {
      lastModificationDate: new Date(2019, 7),
      creationDate: new Date(1990, 2),
      lastModificationAuthor: 'Maarten W.',
      creationAuthor: 'Nils D.',
    },
    sensors: [
      {
        sensorType: {
          id: '1',
          name: 'Temperature',
          postfix: 'C',
          min: -20,
          max: 60,
          type: 'NUMBER'
        },
        thresholds: [
          {
            id: 123128887,
            range: {
              from: -5,
              to: 0
            },
            severity: 'LOW',
            alert: {
              web: true,
              sms: false,
              mail: false
            }
          },
          {
            id: 1266667,
            range: {
              from: -10,
              to: -5
            },
            severity: 'MEDIUM',
            alert: {
              web: true,
              sms: false,
              mail: false
            }
          },
          {
            id: 987,
            range: {
              from: -20,
              to: -10
            },
            severity: 'CRITICAL',
            alert: {
              web: true,
              sms: false,
              mail: false
            }
          },
          {
            id: 98677777,
            range: {
              from: 5,
              to: 10
            },
            severity: 'LOW',
            alert: {
              web: true,
              sms: false,
              mail: false
            }
          },
          {
            id: 127,
            range: {
              from: 10,
              to: 15
            },
            severity: 'MEDIUM',
            alert: {
              web: true,
              sms: false,
              mail: false
            }
          },
          {
            id: 123123345678,
            range: {
              from: 15,
              to: 60
            },
            severity: 'CRITICAL',
            alert: {
              web: true,
              sms: false,
              mail: false
            }
          }
        ]
      },
      {
        sensorType: {
          id: '2',
          name: 'Humidity',
          postfix: '%',
          min: 0,
          max: 100,
          type: 'NUMBER'
        },
        thresholds: [
          {
            id: 1231232199007,
            range: {
              from: 28,
              to: 59
            },
            severity: 'LOW',
            alert: {
              web: true,
              sms: false,
              mail: false
            }
          },
          {
            id: 122333332107,
            range: {
              from: 59,
              to: 80
            },
            severity: 'MEDIUM',
            alert: {
              web: true,
              sms: false,
              mail: false
            }
          },
          {
            id: 12312387654547,
            range: {
              from: 80,
              to: 100
            },
            severity: 'CRITICAL',
            alert: {
              web: true,
              sms: false,
              mail: false
            }
          },
        ]
      },
      {
        sensorType: {
          id: 41,
          name: 'Counter',
          postfix: null,
          min: null,
          max: null,
          type: 'COUNTER'
        },
        thresholds: [
          {
            id: 1231232107,
            range: {
              from: 100,
              to: 150
            },
            severity: 'LOW',
            alert: {
              web: true,
              sms: false,
              mail: false
            }
          },
          {
            id: 1231232108,
            range: {
              from: 150,
              to: 300
            },
            severity: 'MEDIUM',
            alert: {
              web: true,
              sms: false,
              mail: false
            }
          },
          {
            id: 12312312358,
            range: {
              from: 300,
              to: 500
            },
            severity: 'CRITICAL',
            alert: {
              web: true,
              sms: false,
              mail: false
            }
          },
        ]
      },
      {
        sensorType: {
          id: 22,
          name: 'Pulse',
          postfix: null,
          min: 0,
          max: 1,
          type: 'BOOLEAN'
        },
        thresholds: [
          {
            id: 32049234,
            range: {
              from: 1,
              to: 1
            },
            severity: 'LOW',
            alert: {
              web: true,
              sms: false,
              mail: false
            }
          },
          {
            id: 32049235,
            range: {
              from: 0,
              to: 0
            },
            severity: 'CRITICAL',
            alert: {
              web: true,
              sms: false,
              mail: false
            }
          },
        ]
      }
    ]
  }
];


MOCK_THRESHOLD_TEMPLATES_PAGED = {
  data: MOCK_THRESHOLD_TEMPLATES,
  "number":0,
  "size":100,
  "totalElements":2,
  "hasContent":true,
  "last":true,
  "numberOfElements":2,
  "totalPages":1,
  "first":true,
  "sort":null
};

