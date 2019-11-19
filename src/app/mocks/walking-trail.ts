import { IPeopleCountingLocation } from '../models/peoplecounting/location.model';

export let MOCK_TRAIL_WALKING_TRAIL: IPeopleCountingLocation = {};

MOCK_TRAIL_WALKING_TRAIL = {
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
