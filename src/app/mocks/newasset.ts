import { INewAsset } from '../models/new-asset.model';
import { floorPlanImage } from './image';

export let MOCK_ASSETS: INewAsset[] = [];

MOCK_ASSETS = [
    {
        id: 0,
        name: 'Asset 1',
        locationId: 2,
        image: floorPlanImage
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
];
