import { INewAsset } from '../models/new-asset.model';
import { assetImage1 } from './image';

export let MOCK_ASSETS: INewAsset[] = [];

MOCK_ASSETS = [
  {
    id: 0,
    name: 'Asset 1',
    locationId: 2,
  },
  {
    id: 1,
    name: 'Asset 2',
    locationId: 2
  },
  {
    id: 2,
    name: 'Asset 3',
    locationId: 2
  },
  {
    id: 3,
    name: 'Asset 4',
    locationId: 2
  },
  {
    id: 4,
    name: 'Asset 5',
    locationId: 1,
    geolocation: {
      lng: 1,
      lat: 1
    }
  },
  {
    id: 5,
    name: 'Asset 6',
    locationId: 1
  },
  {
    id: 6,
    name: 'Asset 7',
    locationId: 1
  },
  {
    id: 7,
    name: "Super asset with very very very long title",
    locationId: 1,
    image: assetImage1,
    things: [
      {
        id: 21,
        devEui: "0E7E34640610129E",
        name: "thing desk",
        batteryPercentage: 95,
        unreadAlerts: [],
        sensors: [
          {
            devEui: "0E7E34640610129E",
            organization: {
              _organization: null,
              id: null,
              name: ""
            },
            thing: {
              id: null,
              devEui: "",
              name: "",
              batteryPercentage: null,
              unreadAlerts: [],
              sensors: []
            },
            sensorType: {
              id: 5,
              name: "battery",
              postfix: "%",
              min: 0,
              max: 100,
              type: "NUMBER"
            }
          },
          {
            devEui: "0E7E34640610129E",
            organization: {
              _organization: null,
              id: null,
              name: ""
            },
            thing: {
              id: null,
              devEui: "",
              name: "",
              batteryPercentage: null,
              unreadAlerts: [],
              sensors: []
            },
            sensorType: {
              id: 41,
              name: "counter",
              postfix: null,
              min: null,
              max: null,
              type: "NUMBER"
            }
          },
          {
            devEui: "0E7E34640610129E",
            organization: {
              _organization: null,
              id: null,
              name: ""
            },
            thing: {
              id: null,
              devEui: "",
              name: "",
              batteryPercentage: null,
              unreadAlerts: [],
              sensors: []
            },
            sensorType: {
              id: 2,
              name: "humidity",
              postfix: "%",
              min: 0,
              max: 100,
              type: "NUMBER"
            }
          },
          {
            devEui: "0E7E34640610129E",
            organization: {
              _organization: null,
              id: null,
              name: ""
            },
            thing: {
              id: null,
              devEui: "",
              name: "",
              batteryPercentage: null,
              unreadAlerts: [],
              sensors: []
            },
            sensorType: {
              id: 22,
              name: "pulse",
              postfix: null,
              min: null,
              max: null,
              type: "NUMBER"
            }
          },
          {
            devEui: "0E7E34640610129E",
            organization: {
              _organization: null,
              id: null,
              name: ""
            },
            thing: {
              id: null,
              devEui: "",
              name: "",
              batteryPercentage: null,
              unreadAlerts: [],
              sensors: []
            },
            sensorType: {
              id: 1,
              name: "temperature",
              postfix: "°C",
              min: -20,
              max: 50,
              type: "NUMBER"
            }
          }
        ]
      },
      {
        id: 122,
        devEui: "4883C7DF300C1273",
        name: "Temperature & humidity",
        batteryPercentage: null,
        unreadAlerts: [],
        sensors: [
          {
            devEui: "4883C7DF300C1273",
            organization: {
              _organization: null,
              id: null,
              name: ""
            },
            thing: {
              id: null,
              devEui: "",
              name: "",
              batteryPercentage: null,
              unreadAlerts: [],
              sensors: []
            },
            sensorType: {
              id: 35,
              name: "battery percentage",
              postfix: null,
              min: null,
              max: null,
              type: "NUMBER"
            }
          },
          {
            devEui: "4883C7DF300C1273",
            organization: {
              _organization: null,
              id: null,
              name: ""
            },
            thing: {
              id: null,
              devEui: "",
              name: "",
              batteryPercentage: null,
              unreadAlerts: [],
              sensors: []
            },
            sensorType: {
              id: 2,
              name: "humidity",
              postfix: "%",
              min: 0,
              max: 100,
              type: "NUMBER"
            }
          },
          {
            devEui: "4883C7DF300C1273",
            organization: {
              _organization: null,
              id: null,
              name: ""
            },
            thing: {
              id: null,
              devEui: "",
              name: "",
              batteryPercentage: null,
              unreadAlerts: [],
              sensors: []
            },
            sensorType: {
              id: 30,
              name: "keep alive",
              postfix: null,
              min: null,
              max: null,
              type: "NUMBER"
            }
          },
          {
            devEui: "4883C7DF300C1273",
            organization: {
              _organization: null,
              id: null,
              name: ""
            },
            thing: {
              id: null,
              devEui: "",
              name: "",
              batteryPercentage: null,
              unreadAlerts: [],
              sensors: []
            },
            sensorType: {
              id: 31,
              name: "keep alive battery percentage",
              postfix: null,
              min: null,
              max: null,
              type: "NUMBER"
            }
          },
          {
            devEui: "4883C7DF300C1273",
            organization: {
              _organization: null,
              id: null,
              name: ""
            },
            thing: {
              id: null,
              devEui: "",
              name: "",
              batteryPercentage: null,
              unreadAlerts: [],
              sensors: []
            },
            sensorType: {
              id: 114,
              name: "push",
              postfix: null,
              min: null,
              max: null,
              type: "NUMBER"
            }
          },
          {
            devEui: "4883C7DF300C1273",
            organization: {
              _organization: null,
              id: null,
              name: ""
            },
            thing: {
              id: null,
              devEui: "",
              name: "",
              batteryPercentage: null,
              unreadAlerts: [],
              sensors: []
            },
            sensorType: {
              id: 129,
              name: "short push",
              postfix: null,
              min: null,
              max: null,
              type: null
            }
          },
          {
            devEui: "4883C7DF300C1273",
            organization: {
              _organization: null,
              id: null,
              name: ""
            },
            thing: {
              id: null,
              devEui: "",
              name: "",
              batteryPercentage: null,
              unreadAlerts: [],
              sensors: []
            },
            sensorType: {
              id: 1,
              name: "temperature",
              postfix: "°C",
              min: -20,
              max: 50,
              type: "NUMBER"
            }
          }
        ]
      }
    ],
    thresholdTemplate: {
      id: 1,
      name: "Threshold mock 1",
      metadata: {
        lastModificationDate: new Date("2019-08-31T22:00:00.000Z"),
        creationDate: new Date("1970-03-31T23:00:00.000Z"),
        lastModificationAuthor: "Nicolas A.",
        creationAuthor: "Nils D."
      },
      sensors: [
        {
          sensorType: {
            id: "1",
            name: "temperature",
            postfix: "C",
            min: -20,
            max: 60,
            type: "NUMBER"
          },
          thresholds: [
            {
              id: 123213123123,
              range: {
                from: -5,
                to: 0
              },
              severity: "LOW",
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
              severity: "CRITICAL",
              alert: {
                web: true,
                sms: true,
                mail: true
              },
              label: "MyLabel"
            },
            {
              id: 123213038873,
              range: {
                from: 5,
                to: 10
              },
              severity: "LOW",
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
              severity: "MEDIUM",
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
              severity: "CRITICAL",
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
            id: "2",
            name: "humidity",
            postfix: "%",
            min: 0,
            max: 100,
            type: "NUMBER"
          },
          thresholds: [
            {
              id: 23980239,
              range: {
                from: 28,
                to: 59
              },
              severity: "LOW",
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
              severity: "MEDIUM",
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
              severity: "CRITICAL",
              alert: {
                web: true,
                sms: false,
                mail: false
              }
            }
          ]
        }
      ]
    },
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vestibulum erat libero, varius rutrum nunc porttitor vitae. Morbi sed tempus elit. Nulla facilisi. Suspendisse vel dui arcu. Curabitur id nulla lectus. Praesent non lacinia nibh. Nunc et mauris volutpat, malesuada nibh vitae, eleifend libero. Vestibulum et lacus odio. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec posuere, nunc a venenatis lobortis, dui dolor faucibus elit, eget venenatis purus nisl eleifend nisl. Integer leo purus, gravida sed est luctus, egestas convallis lorem. Cras interdum, mi nec mattis fringilla, neque enim sodales risus, id efficitur ipsum libero nec est. Aliquam leo est, bibendum quis tempor eget, dapibus at arcu. Suspendisse rutrum scelerisque felis eu maximus. Quisque nec lobortis arcu. Nam eget aliquam purus.",
    geolocation: {
      lng: 3.916015625,
      lat: 3.546875
    },
  },
  {
    id: 8,
    name: 'Tank 1',
    locationId: 0,
    geolocation: {
      lng: 3.2080078125,
      lat: 51.205162601119824
    },
    test: 'EMPTY'
  },
  {
    id: 9,
    name: 'Tank 2',
    locationId: 0,
    geolocation: {
      lng: 4.3670654296875,
      lat: 51.20172082074822
    },
    test: 'OK'
  },
  {
    id: 10,
    name: 'Tank 3',
    locationId: 0,
    geolocation: {
      lng: 5.55084228515625,
      lat: 50.640752142960615
    },
    test: 'OK'
  },
  {
    id: 11,
    name: 'Tank 4',
    locationId: 0,
    geolocation: {
      lng: 4.405517578125,
      lat: 50.41376850768414
    },
    test: 'LOW'
  },
  {
    id: 12,
    name: 'Tank 5',
    locationId: 0,
    geolocation: {
      lng: 4.67742919921875,
      lat: 50.86317771513582
    },
    test: 'LOW'
  },
];


