import { floorPlanImage } from './image';
import { INewLocation } from './../models/new-location';

export let MOCK_LOCATIONS: INewLocation[] = [];


MOCK_LOCATIONS = [
  {
    id: 0,
    parentId: null,
    parent: null,
    name: 'Location 1',
    description: null,
    locationType: null,
    sublocationsId: null,
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
    description: null,
    locationType: null,
    sublocationsId: null,
    floorPlan: floorPlanImage,
    geolocation: {
      lng: 4.357602596282959,
      lat: 50.85181330562521
    }
  },
  {
    id: 2,
    parentId: 1,
    parent: null,
    name: 'Sublocation 1 of sublocation 1',
    description: null,
    locationType: null,
    sublocationsId: null,
    floorPlan: null,
    geolocation: {
      lng: 2.349014,
      lat: 48.864716,
    }
  }
];
