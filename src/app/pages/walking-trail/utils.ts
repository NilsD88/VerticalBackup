import {IWalkingTrailLocation} from 'src/app/models/walkingtrail/location.model';

function findLeaftsLocation(location: IWalkingTrailLocation, leafs: IWalkingTrailLocation[], parent = null): IWalkingTrailLocation[] {
  if (!location.children || !location.children.length) {
    leafs.push({
      id: location.id,
      name: location.name,
      parent
    });
    return leafs;
  } else {
    const children = location.children;
    if (children && children.length) {
      for (const child of children) {
        if (child) {
          findLeaftsLocation(child, leafs, {
            id: location.id,
            name: location.name,
            parent
          });
        }
      }
    }
  }
}

export {
    findLeaftsLocation
};
