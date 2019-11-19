import { reduce, isEqual } from 'lodash';
import { ILocation } from 'src/app/models/g-location.model';
import { ILeafColors } from './people-counting/dashboard/leaf.model';

import * as randomColor from 'randomcolor';
import { IPeopleCountingLocation } from '../models/peoplecounting/location.model';

function findLocationById(location: ILocation, id: string, path: ILocation[] = []): {location: ILocation, path: ILocation []} {
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
    return collection.filter((item) => item[key].toLocaleUpperCase().includes(TERM));
}

function decreaseLeafs(leafs: IPeopleCountingLocation[]): IPeopleCountingLocation[] {
  const decreasedLeafs = [];
  const decreasedLeafsRaw = {};
  for (const leaf of leafs) {
    if (leaf.parent !== null) {
      if (!decreasedLeafsRaw[leaf.parent.id]) {
        decreasedLeafsRaw[leaf.parent.id] = {
          id: leaf.parent.id,
          name: leaf.parent.name,
          series: leaf.series,
          parent: (leaf.parent || {}).parent,
          children: [leaf]
        };
      } else {
        decreasedLeafsRaw[leaf.parent.id].series = [
          ...decreasedLeafsRaw[leaf.parent.id].series,
          ...leaf.series
        ];
        decreasedLeafsRaw[leaf.parent.id].children.push(leaf);
      }
    }
  }
  Object.values(decreasedLeafsRaw).forEach((leaf: IPeopleCountingLocation) => {
    const series = {};
    leaf.series.forEach(serie => {
      series[serie.timestamp] = {
        timestamp: serie.timestamp,
        sum: ((series[serie.timestamp] || {}).sum || 0) + serie.sum
      };
    });
    decreasedLeafs.push({
      ...leaf,
      series: Object.values(series),
    });
  });
  if (decreasedLeafs.length > 0) {
    return decreasedLeafs;
  } else {
    return leafs;
  }
}

function increaseLeafs(leafs: IPeopleCountingLocation[]): IPeopleCountingLocation[] {
  const increasedLeafs = [];
  for (const leaf of leafs) {
    if (leaf.children && leaf.children.length > 0) {
      for (const child of leaf.children) {
        increasedLeafs.push(child);
      }
    }
  }
  if (increasedLeafs.length > 0) {
    return increasedLeafs;
  } else {
    return leafs;
  }
}

function generateLeafColors(leafs: IPeopleCountingLocation[]): ILeafColors[] {
  const leafColors = randomColor({count: leafs.length}).map((element, index) => ({
    id: leafs[index].id,
    color: element
  }));
  return leafColors;
}



export {
    findLocationById,
    compareTwoObjectOnSpecificProperties,
    findItemsWithTermOnKey,
    decreaseLeafs,
    increaseLeafs,
    generateLeafColors,
};

