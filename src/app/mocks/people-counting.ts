
import { IPeopleCountingLocation } from '../models/peoplecounting/location.model';

export let MOCK_STORE_PEOPLE_COUNTING: IPeopleCountingLocation = {};
export let MOCK_LOCATIONS_PEOPLE_COUNTING: IPeopleCountingLocation[] = [];

MOCK_STORE_PEOPLE_COUNTING = {
  id: '2',
  name: 'Trail A',
  description: null,
  geolocation: {
    lat: 50.453331,
    lng: 3.948740
  },
  image: null,
  children: [],
  parent: {
    id: '1',
    name: 'Mons',
  },
  leftId: null,
  assets: [
    {
      id: 'c1',
      name: 'Checkpoint 1'
    },
    {
      id: 'c2',
      name: 'Checkpoint 2'
    },
    {
      id: 'c3',
      name: 'Checkpoint 3'
    },
  ]
};


MOCK_LOCATIONS_PEOPLE_COUNTING = [{
    id: '0',
    name: 'Hainaut',
    description: null,
    geolocation: {
      lat: 50.600450,
      lng: 3.621870
    },
    image: null,
    children: [{
      id: '1',
      name: 'Mons',
      description: null,
      geolocation: {
        lat: 50.453331,
        lng: 3.948740
      },
      image: null,
      children: [{
          id: '2',
          name: 'Trail A',
          description: null,
          geolocation: {
            lat: 50.453331,
            lng: 3.948740
          },
          image: null,
          children: [],
          parentId: null,
          leftId: null,
        },
        {
          id: '3',
          name: 'Trail B',
          description: null,
          geolocation: {
            lat: 50.454331,
            lng: 3.949740
          },
          image: null,
          children: [],
          parentId: null,
          leftId: null,
        }
      ],
      parentId: null,
      leftId: null,
    }, ],
    parentId: null,
    leftId: null,
  },
  {
    id: '4',
    name: 'Namur',
    description: null,
    geolocation: {
      lat: 50.464920,
      lng: 4.865060
    },
    image: null,
    children: [{
      id: '5',
      name: 'Jambes',
      description: null,
      geolocation: {
        lat: 50.457810,
        lng: 4.868170
      },
      image: null,
      children: [{
          id: '6',
          name: 'Trail C',
          description: null,
          geolocation: {
            lat: 50.457810,
            lng: 4.868170
          },
          image: null,
          children: [],
          parentId: null,
          leftId: null,
        },
        {
          id: '7',
          name: 'Trail C',
          description: null,
          geolocation: {
            lat: 50.458810,
            lng: 4.869170
          },
          image: null,
          children: [],
          parentId: null,
          leftId: null,
        }
      ],
      parentId: null,
      leftId: null,
    }],
    parentId: null,
    leftId: null,
  }
];