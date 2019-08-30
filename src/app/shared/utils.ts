import { INewLocation } from 'src/app/models/new-location';

function findLocationById(location: INewLocation, id: number, path: INewLocation[] = []): {location: INewLocation, path: INewLocation []} {
    if (location && location.id === id) {
        return {location, path};
    } else {
        const sublocations = location.sublocations;
        if (sublocations && sublocations.length) {
            for (const sublocation of sublocations) {
                console.log('-----' + sublocation.id);
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
