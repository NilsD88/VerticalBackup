import { INewAsset } from 'src/app/models/new-asset.model';
import { divIcon } from 'leaflet';


const assetIconDefault = divIcon({
    className: 'map-marker-asset',
    iconSize: null,
    html: '<div><span class="pxi-map-marker"></span></div>'
});

const assetIconTankMonitoring = divIcon({
    className: 'map-marker-asset tank-monitoring',
    iconSize: null,
    html: '<div><span class="pxi-map-marker"></span></div>'
});

const assetIconTankMonitoringLowFuel = divIcon({
    className: 'map-marker-asset tank-monitoring low-fuel',
    iconSize: null,
    html: '<div><span class="pxi-map-marker"></span></div>'
});

const assetIconTankMonitoringEmptyFuel = divIcon({
    className: 'map-marker-asset tank-monitoring empty-fuel',
    iconSize: null,
    html: '<div><span class="pxi-map-marker"></span></div>'
});


export function generateAssetIcon(mode: string = null, asset: INewAsset = null) {
    console.log('generateAssetIcon', mode);
    switch (mode) {
        case 'TANK_MONITORING':
            console.log('TANK_MONITORING');
            switch (asset.test) {
                case 'EMPTY':
                    console.log('TANK_MONITORING-EMPTY');
                    return assetIconTankMonitoringEmptyFuel;
                case 'LOW':
                    return assetIconTankMonitoringLowFuel;
                default:
                    return assetIconTankMonitoring;
            }
        default:
            return assetIconDefault;
    }
}
