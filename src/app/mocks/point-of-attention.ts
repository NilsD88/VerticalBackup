import {
  IPointOfAttention,
  EAggregation
} from './../models/point-of-attention.model';

export let MOCK_POINTS_OF_ATTENTION: IPointOfAttention[] = [];

MOCK_POINTS_OF_ATTENTION = [{
  id: "0",
  name: "Group of assets",
  location: {
    id: "0",
    name: "tc0"
  },
  items: [{
    id: "0",
    assets: [{
      id: "0",
      name: "asset",
    }],
    name: "zaeaze",
    aggregation: EAggregation.MAX,
    sensorType: {
      id: "2",
      name: "humidity"
    },
  }]
},
{
    id: "1",
    name: "Group of assets 2",
    location: {
      id: "0",
      name: "tc0"
    },
    items: [
      {
        id: "1",
        assets: [
          {
            id: "0",
            name: "asset"
          }
        ],
        name: "Item 1",
        aggregation: EAggregation.MAX,
        sensorType: {
          id: "2",
          name: "humidity"
        }
      },
      {
        id: "2",
        assets: [
          {
            id: "0",
            name: "asset",
            description: null,
            location: {
              id: "211",
              name: "tc211"
            },
            geolocation: null
          }
        ],
        name: "Item 2",
        aggregation: EAggregation.AVG,
        sensorType: {
          id: "1",
          name: "temperature"
        },
        tempId: 1575042440472
      },
      {
        id:"3",
        assets: [
          {
            id: "0",
            name: "asset",
            description: null,
            location: {
              id: "211",
              name: "tc211"
            },
            geolocation: null
          }
        ],
        name: "Item 3",
        aggregation: EAggregation.MAX,
        sensorType: {
          id: "1",
          name: "temperature"
        },
        tempId: 1575042456547
      },
      {
        id:"4",
        assets: [
          {
            id: "0",
            name: "asset",
            description: null,
            location: {
              id: "211",
              name: "tc211"
            },
            geolocation: null
          }
        ],
        name: "Item 4",
        aggregation: EAggregation.MIN,
        sensorType: {
          id: "5",
          name: "battery"
        },
        tempId: 1575042478353
      },
      {
        id:"5",
        assets: [
          {
            id: "0",
            name: "asset",
            description: null,
            location: {
              id: "211",
              name: "tc211"
            },
            geolocation: null
          }
        ],
        name: "Item 5",
        aggregation: EAggregation.AVG,
        sensorType: {
          id: "5",
          name: "battery"
        },
        tempId: 1575042491854
      }
    ]
}
];
