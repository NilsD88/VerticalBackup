import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { IThresholdTemplate } from '../models/g-threshold-template.model';

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

    constructor(
        public http: HttpClient,
        private apollo: Apollo,
    ) { }


    // START APOLLO

    public a_createThresholdTemplate(thresholdTemplate: IThresholdTemplate): Observable<IThresholdTemplate> {
        const CREATE_THRESHOLD_TEMPLATE = gql`
            mutation CreateThresholdTemplate($thresholdTemplate: ThresholdTemplateInput!) {
                thresholdTemplate: CreateThresholdTemplate(thresholdTemplate: $thresholdTemplate) {
                    id,
                    name,
                }
            }
        `;

        interface CreateThresholdTemplateResponse {
            thresholdTemplate: IThresholdTemplate;
        }

        return this.apollo.mutate<CreateThresholdTemplateResponse>({
            mutation: CREATE_THRESHOLD_TEMPLATE,
            variables: {
                thresholdTemplate: {
                    name: thresholdTemplate.name
                }
            }
        }).pipe(
            tap(data => {
                console.log(data);
            }),
            map(({data}) => data.thresholdTemplate)
        );
    }

    public a_getThresholdTemplates(): Observable<IThresholdTemplate[]> {
        const GET_THRESHOLD_TEMPLATES = gql`
            query findAllThresholdTemplates {
                thresholdTemplates: findAllThresholdTemplates {
                    id,
                    name,
                }
            }
        `;

        interface GetThresholdTemplatesQuery {
            thresholdTemplates: IThresholdTemplate[];
        }

        return this.apollo.watchQuery<GetThresholdTemplatesQuery>({
            query: GET_THRESHOLD_TEMPLATES
        }).valueChanges.pipe(map(({data}) => {
            return data.thresholdTemplates;
        }));
    }

    public a_getThresholdTemplateById(id: string): Observable<IThresholdTemplate> {
        const GET_THRESHOLD_TEMPLATE_BY_ID = gql`
            query findThresholdTemplateById($id: Long!) {
                thresholdTemplate: findThresholdTemplateById(id: $id) {
                    id,
                    name,
                }
            }
        `;

        interface GetThresholdTemplateByIdQuery {
            thresholdTemplate: IThresholdTemplate;
        }

        return this.apollo.query<GetThresholdTemplateByIdQuery>({
            query: GET_THRESHOLD_TEMPLATE_BY_ID,
            variables: {
                id,
            }
        }).pipe(map(({data}) => data.thresholdTemplate));
    }

    public a_updateThresholdTemplate(thresholdTemplate: IThresholdTemplate): Observable<IThresholdTemplate> {
        const UPDATE_THRESHOLD_TEMPLATE = gql`
            mutation updateThresholdTemplate($input: ThresholdTemplateInput!) {
                thresholdTemplate: updateThresholdTemplate(id: $id) {
                    id,
                    name,
                }
            }
        `;

        interface UpdateThresholdTemplateQuery {
            thresholdTemplate: IThresholdTemplate;
        }

        return this.apollo.mutate<UpdateThresholdTemplateQuery>({
            mutation: UPDATE_THRESHOLD_TEMPLATE,
            variables: {
                input: {
                    ...thresholdTemplate
                }
            }
        }).pipe(map(({data}) => data.thresholdTemplate));
    }


    // END APOLLO


    getThresholdTemplates(filter: any = null): Observable<IThresholdTemplate[]> {
        let request = this.thresholdTemplatesUrl;
        if (filter) {
            if (filter.name) {
                request += `?name=${filter.name}`;
            }
        }
        return this.http.get<IThresholdTemplate[]>(request);
    }


    getPagedThresholdTemplates(filter: any = null): Promise<any> {
        return new Promise(async (resolve, reject) => {
            this.getThresholdTemplates(filter).subscribe((response: IThresholdTemplate[]) => {
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

    getThresholdTemplateById(id: string): Promise<IThresholdTemplate> {
        return new Promise(async (resolve, reject) => {
            return this.http.get<IThresholdTemplate[]>(`${this.thresholdTemplatesUrl}/?id=${id}`)
                .subscribe((response: IThresholdTemplate[]) => {
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

    public updateThresholdTemplate(thresholdTemplate: IThresholdTemplate) {
        return this.http.put(`${this.thresholdTemplatesUrl}/${thresholdTemplate.id}`, thresholdTemplate, this.httpOptions);
    }

    public createThresholdTemplate(thresholdTemplate: IThresholdTemplate) {
        return this.http.post<IThresholdTemplate>(`${this.thresholdTemplatesUrl}`, thresholdTemplate, this.httpOptions).pipe(
            tap(data => console.log(data)),
            catchError(this.handleError)
        );
    }

    public deleteThresholdTemplate(thresholdTemplateId: string) {
        return this.http.delete(`${this.thresholdTemplatesUrl}/${thresholdTemplateId}`, this.httpOptions).pipe(
            catchError(this.handleError)
        );
    }


    public searchThresholdTemplatesWithFilter(filters: Observable<any>) {
        return filters.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap(filter => {
                return this.getPagedThresholdTemplates(filter);
            })
        );
    }

}
