import { floorPlanImage } from './image';
import { INewLocation } from './../models/new-location';

export let MOCK_LOCATIONS: INewLocation[] = [];
export let MOCK_LOCATIONS_FLAT: INewLocation[] = [];

MOCK_LOCATIONS_FLAT = [
  {
    id: 0,
    parentId: null,
    parent: null,
    name: 'Location 1',
    locationType: null,
    sublocationsId: [1],
    floorPlan: null,
    geolocation: {
      lng: 4.357602596282959,
      lat: 50.85181330562521
    }
  },
  {
    id: 1,
    parentId: 0,
    parent: null,
    name: 'Sublocation 1',
    locationType: null,
    sublocationsId: [2],
    floorPlan: floorPlanImage,
    geolocation: {
      lng: 3.357602596282959,
      lat: 51.85181330562521
    }
  },
  {
    id: 2,
    parentId: 1,
    parent: null,
    name: 'Sublocation of sublocation 1',
    locationType: null,
    sublocationsId: null,
    floorPlan: null,
    geolocation: {
      lng: 0,
      lat: 0
    }
  },
  {
    id: 3,
    parentId: null,
    parent: null,
    name: 'Location 2',
    locationType: null,
    sublocationsId: null,
    geolocation: {
      lng: 4.357602596282959,
      lat: 50.85181330562521
    },
    floorPlan: null,
  }
];

MOCK_LOCATIONS = [
  {
    id: 0,
    parentId: null,
    parent: null,
    name: 'Location 1',
    locationType: null,
    sublocations: [
      {
        id: 1,
        parentId: 0,
        parent: null,
        name: 'Sublocation 1',
        locationType: null,
        sublocationsId: null,
        sublocations: [
          {
            id: 2,
            parentId: 1,
            parent: null,
            name: 'Sublocation 1 of sublocation 1',
            locationType: null,
            sublocationsId: null,
            floorPlan: null,
            geolocation: {
              lng: 0,
              lat: 0
            }
          }
        ],
        floorPlan: floorPlanImage,
        geolocation: {
          lng: 4.357602596282959,
          lat: 50.85181330562521
        }
      },
    ],
    sublocationsId: null,
    floorPlan: null,
    geolocation: {
      lng: 4.357602596282959,
      lat: 50.85181330562521
    }
  },
  {
    id: 3,
    parentId: null,
    parent: null,
    name: 'Location 2',
    locationType: null,
    sublocationsId: null,
    geolocation: {
      lng: 3.357602596282959,
      lat: 51.85181330562521
    },
    floorPlan: null,
  }
];
