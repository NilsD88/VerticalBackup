import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IThing, Thing } from 'src/app/models/thing.model';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { INewThresholdTemplate } from '../models/new-threshold-template.model';
import { IPagedThresholdTemplates } from '../models/threshold.model';

@Injectable({
    providedIn: 'root'
})
export class NewThresholdTemplateService {

    public thresholdTemplatesUrl = 'fakeapi/thresholdTemplates';

    private headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
    private perfop = { headers: this.headers };
    private httpOptions = { headers: this.headers };

    private handleError(error: any) {
        console.error(error);
        return throwError(error);
    }

    constructor(public http: HttpClient) { }

    getPagedThresholdTemplates(): Promise<IPagedThresholdTemplates> {
        return new Promise(async (resolve, reject) => {
            return this.http.get<INewThresholdTemplate[]>(this.thresholdTemplatesUrl)
                .subscribe((response: INewThresholdTemplate[]) => {
                    resolve ({
                        number: 0,
                        data: response,
                        size: 100,
                        totalElements: response.length,
                        hasContent: true,
                        last: true,
                        pageNumber: 0,
                        numberOfElements: response.length,
                        totalPages: 1 + response.length % 100,
                        first: true,
                        sort: null
                    })
                }, () => {
                    reject(console.error('Error! Failed to fetch things. Please reload.'));
                });
        });
    }

    getThresholdTemplateById(id: number): Promise<INewThresholdTemplate> {
        return new Promise(async (resolve, reject) => {
            return this.http.get<INewThresholdTemplate[]>(`${this.thresholdTemplatesUrl}/?id=${id}`)
                .subscribe((response: INewThresholdTemplate[]) => {
                    if (response.length) {
                        resolve(response[0]);
                    } else {
                        reject(console.error('No threshold template found with this id'));
                    }
                }, () => {
                    reject(console.error('Error! Failed to fetch things. Please reload.'));
                });
        });
    }

    getThresholdTemplatesByName(name: string): Promise<INewThresholdTemplate[]> {
        return new Promise(async (resolve, reject) => {
            return this.http.get<INewThresholdTemplate[]>(`${this.thresholdTemplatesUrl}/?name=${name}`)
                .subscribe((response: INewThresholdTemplate[]) => {
                    resolve(response);
                }, () => {
                    reject(console.error('Error! Failed to fetch things. Please reload.'));
                });
        });
    }

    public updateThresholdTemplate(thresholdTemplate: INewThresholdTemplate) {
        return this.http.put(`${this.thresholdTemplatesUrl}/${thresholdTemplate.id}`, thresholdTemplate, this.httpOptions);
    }

    public createThresholdTemplate(thresholdTemplate: INewThresholdTemplate) {
        return this.http.post<INewThresholdTemplate>(`${this.thresholdTemplatesUrl}`, thresholdTemplate, this.httpOptions).pipe(
            tap(data => console.log(data)),
            catchError(this.handleError)
        );
    }

    public deleteThresholdTemplate(thresholdTemplateId: number) {
        console.log('will remove', thresholdTemplateId);
        return this.http.delete(`${this.thresholdTemplatesUrl}/${thresholdTemplateId}`, this.httpOptions).pipe(
            catchError(this.handleError)
        );
    }


    public searchTerm(terms: Observable<string>) {
        return terms.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap(term => {
                return this.getThresholdTemplatesByName(term);
            })
        );
    }

}
