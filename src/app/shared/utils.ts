import * as _ from 'lodash';
import { ILocation } from 'src/app/models/g-location.model';

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
    return _.reduce(object1, (result, value, key) => {
        if (properties.indexOf(key) > -1) {
            return _.isEqual(value, object2[key]) ? result : result.concat(key);
        } else {
            return result;
        }
    }, []);
}

function findItemsWithTermOnKey(term: string, collection: any[], key: string) {
    const TERM = term.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    return collection.filter((item) => item[key].toLocaleUpperCase().includes(TERM));
}

export {
    findLocationById,
    compareTwoObjectOnSpecificProperties,
    findItemsWithTermOnKey
};

