import _ from 'lodash';
import { INewLocation } from 'src/app/models/new-location';
import { Sublocation } from '../models/locations.model';

function findLocationById(location: INewLocation, id: number, path: INewLocation[] = []): {location: INewLocation, path: INewLocation []} {
    if (location && location.id === id) {
        return {location, path};
    } else {
        const sublocations = location.sublocations;
        if (sublocations && sublocations.length) {
            for (const sublocation of sublocations) {
                if (sublocation) {
                    const result = findLocationById(sublocation, id, path);
                    if (result) {
                        path.unshift(sublocation);
                        return result;
                    }
                }
            }
        }
    }
}

export {
    findLocationById
};

