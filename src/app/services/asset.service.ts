import {Injectable} from '@angular/core';
import {Asset, IAsset} from '../models/asset.model';
import {SharedService} from './shared.service';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  constructor(public sharedService: SharedService, private http: HttpClient, private snackBar: MatSnackBar) {
  }

  public getAssetById(id: string | number): Promise<Asset> {
      return new Promise(async (resolve, reject) => {
        this.http.get(`${this.sharedService.baseUrl}assets/${id}`)
          .subscribe((response: IAsset) => {
            resolve(new Asset(response));
          }, (err) => {
            const snackBarRef = this.snackBar.open(
              'Error! Failed to fetch asset data. Please reload.',
              null, {
                duration: 3000,
                panelClass: 'error-snackbar'
              });
            console.error('AssetService: ' + err.message);
            reject(err);
          });
      });
  }
}
