import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { IThresholdTemplate } from '../models/g-threshold-template.model';

@Injectable({
    providedIn: 'root'
})
export class NewThresholdTemplateService {

    constructor(
        private apollo: Apollo,
    ) { }


    // START APOLLO

    public createThresholdTemplate(thresholdTemplate: IThresholdTemplate): Observable<IThresholdTemplate> {

        const CREATE_THRESHOLD_TEMPLATE = gql`
            mutation createThresholdTemplate($input: ThresholdTemplateCreateInput!) {
                thresholdTemplate: createThresholdTemplate(input: $input) {
                    id,
                    name,
                    thresholds {
                        sensorType {
                            id,
                            name
                        }
                    }
                }
            }
        `;

        interface CreateThresholdTemplateResponse {
            thresholdTemplate: IThresholdTemplate;
        }

        return this.apollo.mutate<CreateThresholdTemplateResponse>({
            mutation: CREATE_THRESHOLD_TEMPLATE,
            variables: {
                input: {
                    organizationId: 1,
                    name: thresholdTemplate.name,
                    thresholds: createThresholsdInput(thresholdTemplate)
                }
            }
        }).pipe(
            map(({data}) => data.thresholdTemplate)
        );
    }

    public getThresholdTemplates(): Observable<IThresholdTemplate[]> {
        const GET_THRESHOLD_TEMPLATES = gql`
            query findThresholdTemplatesByOrganizationId($input: ThresholdTemplatesFindInput!) {
                thresholdTemplates: findThresholdTemplatesByOrganizationId(input: $input) {
                    id,
                    name,
                    thresholds {
                        sensorType {
                            id,
                            name
                        }
                    }
                }
            }
        `;

        interface GetThresholdTemplatesResponse {
            thresholdTemplates: IThresholdTemplate[];
        }

        return this.apollo.query<GetThresholdTemplatesResponse>({
            query: GET_THRESHOLD_TEMPLATES,
            fetchPolicy: 'network-only',
            variables: {
                input: {
                    organizationId: 1 // TODO: remove organizationId
                }
            },
        }).pipe(map(({data}) => {
            return data.thresholdTemplates;
        }));
    }

    public getThresholdTemplateById(id: string): Observable<IThresholdTemplate> {
        const GET_THRESHOLD_TEMPLATE_BY_ID = gql`
            query findThresholdTemplateById($input: ThresholdTemplateFindInput!) {
                thresholdTemplate: findThresholdTemplateById(input: $input) {
                    id,
                    name,
                    thresholds {
                        sensorType {
                            id,
                            name
                            postfix
                            min
                            max
                            type
                        },
                        thresholdItems {
                            id,
                            range {
                                from,
                                to
                            },
                            severity,
                            notification {
                                web,
                                mail,
                                sms
                            }
                        }
                    }
                }
            }
        `;

        interface GetThresholdTemplateByIdResponse {
            thresholdTemplate: IThresholdTemplate;
        }

        return this.apollo.query<GetThresholdTemplateByIdResponse>({
            query: GET_THRESHOLD_TEMPLATE_BY_ID,
            fetchPolicy: 'network-only',
            variables: {
                input: {
                    id,
                }
            }
        }).pipe(map(({data}) => {
            console.log(data);
            return data.thresholdTemplate;
        }));
    }

    public updateThresholdTemplate(thresholdTemplate: IThresholdTemplate): Observable<boolean> {
        const UPDATE_THRESHOLD_TEMPLATE = gql`
            mutation updateThresholdTemplate($input: ThresholdTemplateUpdateInput!) {
                updateThresholdTemplate(input: $input)
            }
        `;

        interface UpdateThresholdTemplateResponse {
            updateThresholdTemplate: boolean;
        }

        return this.apollo.mutate<UpdateThresholdTemplateResponse>({
            mutation: UPDATE_THRESHOLD_TEMPLATE,
            variables: {
                input: {
                    id: thresholdTemplate.id,
                    name: thresholdTemplate.name,
                    thresholds: createThresholsdInput(thresholdTemplate)
                }
            }
        }).pipe(map(({data}) => data.updateThresholdTemplate));
    }

    public deleteThresholdTemplate(id: string): Observable<boolean> {
        const DELETE_THRESHOLD_TEMPLATE = gql`
            mutation deleteThresholdTemplate($input: ThresholdTemplateDeleteInput!) {
                deleteThresholdTemplate(input: $input)
            }
        `;

        interface DeleteThresholdTemplateResponse {
            deleteThresholdTemplate: boolean;
        }

        return this.apollo.mutate<DeleteThresholdTemplateResponse>({
            mutation: DELETE_THRESHOLD_TEMPLATE,
            variables: {
                input: {
                    id
                }
            }
        }).pipe(map(({data}) => data.deleteThresholdTemplate));
    }

    // END APOLLO


    /*
    OLD METHOD WITH FAKE API
    getThresholdTemplates(filter: any = null): Observable<IThresholdTemplate[]> {
        let request = this.thresholdTemplatesUrl;
        if (filter) {
            if (filter.name) {
                request += `?name=${filter.name}`;
            }
        }
        return this.http.get<IThresholdTemplate[]>(request);
    }
    */


    /*
    OLD MEHTOD WITH FAKE API
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
    */

    /*
    OLD METHOD WITH FAKE API
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
    */

    /*
    public updateThresholdTemplate(thresholdTemplate: IThresholdTemplate) {
        return this.http.put(`${this.thresholdTemplatesUrl}/${thresholdTemplate.id}`, thresholdTemplate, this.httpOptions);
    }
    */

    /*
    public createThresholdTemplate(thresholdTemplate: IThresholdTemplate) {
        return this.http.post<IThresholdTemplate>(`${this.thresholdTemplatesUrl}`, thresholdTemplate, this.httpOptions).pipe(
            tap(data => console.log(data)),
            catchError(this.handleError)
        );
    }
    */

    /*
    public deleteThresholdTemplate(thresholdTemplateId: string) {
        return this.http.delete(`${this.thresholdTemplatesUrl}/${thresholdTemplateId}`, this.httpOptions).pipe(
            catchError(this.handleError)
        );
    }
    */


    //TODO: REPLACE WITH NEW BACKEND
    /*
    public searchThresholdTemplatesWithFilter(filters: Observable<any>) {
        return filters.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap(filter => {
                return this.getPagedThresholdTemplates(filter);
            })
        );
    }
    */

}


function createThresholsdInput(thresholdTemplate: IThresholdTemplate) {
    return thresholdTemplate.thresholds.map((threshold) => {
        return {
            sensorTypeId: threshold.sensorType.id,
            thresholdItems: threshold.thresholdItems.map((thresholdItem) => {
                return {
                    range: thresholdItem.range,
                    severity: thresholdItem.severity,
                    label: thresholdItem.label,
                    notification: thresholdItem.notification
                };
            })
        };
    });
}
