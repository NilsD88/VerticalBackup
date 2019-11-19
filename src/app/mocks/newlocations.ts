import {
  floorPlanImage1,
  floorPlanImage2,
  floorPlanImage3
} from './image';
import {
  ILocation
} from './../models/g-location.model';
import { IPeopleCountingLocation } from '../models/peoplecounting/location.model';

export let MOCK_LOCATIONS: ILocation[] = [];

export let MOCK_LOCATIONS_WALKING_TRAIL: IPeopleCountingLocation[] = [];

MOCK_LOCATIONS = [{
    id: '0',
    parentId: 'null',
    parent: null,
    name: 'Location 1',
    description: null,
    image: null,
    geolocation: {
      lng: 4.357602596282959,
      lat: 50.85181330562521
    }
  },
  {
    id: '1',
    parentId: '0',
    parent: null,
    name: 'Sublocation 1',
    description: null,
    image: floorPlanImage1,
    geolocation: {
      lng: 4.316768646240234,
      lat: 50.87054481536601
    }
  },
  {
    id: '2',
    parentId: '0',
    parent: null,
    name: 'Sublocation 2',
    description: null,
    image: floorPlanImage2,
    geolocation: {
      lng: 4.382514953613281,
      lat: 50.84713941352264
    }
  },
  {
    id: '3',
    parentId: '0',
    parent: null,
    name: 'Sublocation 3',
    description: null,
    image: floorPlanImage3,
    geolocation: {
      lng: 4.313335418701172,
      lat: 50.83705846962927
    }
  },
  {
    id: '4',
    parentId: '1',
    parent: null,
    name: 'Sublocation 1 of sublocation 1',
    description: null,
    image: null,
    geolocation: {
      lng: 0.5,
      lat: 0.5,
    }
  }
];

MOCK_LOCATIONS_WALKING_TRAIL = [{
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
