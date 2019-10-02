import { IAsset } from '../models/g-asset.model';
import { assetImage1 } from './image';

export let MOCK_ASSETS: IAsset[] = [];

MOCK_ASSETS = [
  {
    id: '0',
    name: 'Asset 1',
    locationId: '2',
    things: [],
    thresholdTemplate: null,
  },
  {
    id: '1',
    name: 'Asset 2',
    locationId: '2',
    things: [],
    thresholdTemplate: null,
  },
  {
    id: '2',
    name: 'Asset 3',
    locationId: '2',
    things: [],
    thresholdTemplate: null,
  },
  {
    id: '3',
    name: 'Asset 4',
    locationId: '2',
    things: [],
    thresholdTemplate: null,
  },
  {
    id: '4',
    name: 'Asset 5',
    locationId: '1',
    things: [],
    thresholdTemplate: null,
    geolocation: {
      lng: 1,
      lat: 1
    }
  },
  {
    id: '5',
    name: 'Asset 6',
    locationId: '1',
    things: [],
    thresholdTemplate: null,
  },
  {
    id: '6',
    name: 'Asset 7',
    locationId: '1',
    things: [],
    thresholdTemplate: null,
  },
  {
    id: '7',
    name: "Super asset with very very very long title",
    locationId: '1',
    things: [],
    thresholdTemplate: null,
    image: assetImage1,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vestibulum erat libero, varius rutrum nunc porttitor vitae. Morbi sed tempus elit. Nulla facilisi. Suspendisse vel dui arcu. Curabitur id nulla lectus. Praesent non lacinia nibh. Nunc et mauris volutpat, malesuada nibh vitae, eleifend libero. Vestibulum et lacus odio. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec posuere, nunc a venenatis lobortis, dui dolor faucibus elit, eget venenatis purus nisl eleifend nisl. Integer leo purus, gravida sed est luctus, egestas convallis lorem. Cras interdum, mi nec mattis fringilla, neque enim sodales risus, id efficitur ipsum libero nec est. Aliquam leo est, bibendum quis tempor eget, dapibus at arcu. Suspendisse rutrum scelerisque felis eu maximus. Quisque nec lobortis arcu. Nam eget aliquam purus.",
    geolocation: {
      lng: 3.916015625,
      lat: 3.546875
    },
  },
  {
    id: '8',
    name: 'Tank 1',
    locationId: '0',
    things: [],
    thresholdTemplate: null,
    geolocation: {
      lng: 3.2080078125,
      lat: 51.205162601119824
    },
    test: 'EMPTY'
  },
  {
    id: '9',
    name: 'Tank 2',
    locationId: '0',
    things: [],
    thresholdTemplate: null,
    geolocation: {
      lng: 4.3670654296875,
      lat: 51.20172082074822
    },
    test: 'OK'
  },
  {
    id: '0',
    name: 'Tank 3',
    locationId: '0',
    things: [],
    thresholdTemplate: null,
    geolocation: {
      lng: 5.55084228515625,
      lat: 50.640752142960615
    },
    test: 'OK'
  },
  {
    id: '1',
    name: 'Tank 4',
    locationId: '0',
    things: [],
    thresholdTemplate: null,
    geolocation: {
      lng: 4.405517578125,
      lat: 50.41376850768414
    },
    test: 'LOW'
  },
  {
    id: '2',
    name: 'Tank 5',
    locationId: '0',
    things: [],
    thresholdTemplate: null,
    geolocation: {
      lng: 4.67742919921875,
      lat: 50.86317771513582
    },
    test: 'LOW'
  },
];


