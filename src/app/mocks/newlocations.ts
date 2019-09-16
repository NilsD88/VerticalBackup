import { floorPlanImage1, floorPlanImage2, floorPlanImage3 } from './image';
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
    floorPlan: floorPlanImage1,
    geolocation: {
      lng:  4.316768646240234,
      lat: 50.87054481536601
    }
  },
  {
    id: 2,
    parentId: 0,
    parent: null,
    name: 'Sublocation 2',
    description: null,
    locationType: null,
    sublocationsId: null,
    floorPlan: floorPlanImage2,
    geolocation: {
      lng: 4.382514953613281,
      lat: 50.84713941352264
    }
  },
  {
    id: 3,
    parentId: 0,
    parent: null,
    name: 'Sublocation 3',
    description: null,
    locationType: null,
    sublocationsId: null,
    floorPlan: floorPlanImage3,
    geolocation: {
      lng: 4.313335418701172,
      lat: 50.83705846962927
    }
  },
  {
    id: 4,
    parentId: 1,
    parent: null,
    name: 'Sublocation 1 of sublocation 1',
    description: null,
    locationType: null,
    sublocationsId: null,
    floorPlan: null,
    geolocation: {
      lng: 0.5,
      lat: 0.5,
    }
  }
];
