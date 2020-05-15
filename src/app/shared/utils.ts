import {isEqual, reduce} from 'lodash';
import {ILocation} from 'src/app/models/location.model';
import {ILeafColors} from './people-counting/dashboard/leaf.model';

import gradstop from 'gradstop';
import { COLORS } from 'src/app/shared/global';

import {IPeopleCountingLocation, IPeopleCountingLocationSerie} from '../models/peoplecounting/location.model';
import * as moment from 'moment';

function findLocationById(location: ILocation, id: string, path: ILocation[] = []): { location: ILocation, path: ILocation [] } {
  if (location && location.id === id) {
    return {location, path};
  } else {
    const children = location.children;
    if (children && children.length) {
      for (const child of children) {
        if (child) {
          const result = findLocationById(child, id, path);
          if (result) {
            path.unshift(child);
            return result;
          }
        }
      }
    }
  }
}

function compareTwoObjectOnSpecificProperties(object1: object, object2: object, properties: string[]) {
  // return an empty array if no difference
  // return propertie names on differences
  return reduce(object1, (result, value, key) => {
    if (properties.indexOf(key) > -1) {
      return isEqual(value, object2[key]) ? result : result.concat(key);
    } else {
      return result;
    }
  }, []);
}

function findItemsWithTermOnKey(term: string, collection: any[], key: string) {
  const TERM = term.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
  return collection.filter((item) => item[key].toUpperCase().includes(TERM));
}

function increaseLeafs(leafs: IPeopleCountingLocation[]): IPeopleCountingLocation[] {
  const increasedLeafs = [];
  const increasedLeafsRaw = {};
  for (const leaf of leafs) {
    if (leaf.parent !== null) {
      if (!increasedLeafsRaw[leaf.parent.id]) {
        increasedLeafsRaw[leaf.parent.id] = {
          id: leaf.parent.id,
          name: leaf.parent.name,
          series: leaf.series,
          parent: (leaf.parent || {}).parent,
          children: [leaf]
        };
      } else {
        increasedLeafsRaw[leaf.parent.id].series = [
          ...increasedLeafsRaw[leaf.parent.id].series,
          ...leaf.series
        ];
        increasedLeafsRaw[leaf.parent.id].children.push(leaf);
      }
    }
  }
  Object.values(increasedLeafsRaw).forEach((leaf: IPeopleCountingLocation) => {
    const series = {};
    leaf.series.forEach(serie => {
      series[serie.timestamp] = {
        timestamp: serie.timestamp,
        valueIn: ((series[serie.timestamp] || {}).valueIn || 0) + serie.valueIn,
        valueOut: ((series[serie.timestamp] || {}).valueOut || 0) + serie.valueOut
      };
    });
    increasedLeafs.push({
      ...leaf,
      series: Object.values(series),
    });
  });
  if (increasedLeafs.length > 0) {
    return increasedLeafs;
  } else {
    return leafs;
  }
}

function decreaseLeafs(leafs: IPeopleCountingLocation[]): IPeopleCountingLocation[] {
  const decreasedLeafs = [];
  for (const leaf of leafs) {
    if (leaf.children && leaf.children.length > 0) {
      for (const child of leaf.children) {
        decreasedLeafs.push(child);
      }
    }
  }
  if (decreasedLeafs.length > 0) {
    return decreasedLeafs;
  } else {
    return leafs;
  }
}

function generateLeafColors(leafs: IPeopleCountingLocation[]): ILeafColors[] {
  const gradient = gradstop({
    stops: leafs.length,
    inputFormat: 'hex',
    colorArray: [COLORS.blue, COLORS.red]
  });

  const leafColors = gradient.map((element, index) => ({
    id: leafs[index].id,
    color: element
  }));

  return leafColors;
}

function generatePxsGradientColor(count: number = 2): string[] {
  count = (count && count > 1) ? count : 2;
  return gradstop({
    stops: count,
    inputFormat: 'hex',
    colorArray: [COLORS.blue, COLORS.red]
  });
}

function allIntervalBetween(from: number, to: number, interval: moment.unitOfTime.DurationConstructor): IPeopleCountingLocationSerie[] {
  let currentTimestamp: number = from;
  const emptySeries: IPeopleCountingLocationSerie[] = [];
  do {
    emptySeries.push({
      timestamp: currentTimestamp,
      valueIn: null,
      valueOut: null
    });
    currentTimestamp = moment(currentTimestamp).add(1, interval).valueOf();
  } while (currentTimestamp <= to);
  return emptySeries;
}

export {
  findLocationById,
  compareTwoObjectOnSpecificProperties,
  findItemsWithTermOnKey,
  decreaseLeafs,
  increaseLeafs,
  generateLeafColors,
  allIntervalBetween,
  generatePxsGradientColor
};



