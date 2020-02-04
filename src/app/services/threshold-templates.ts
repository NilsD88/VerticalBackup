import {
  Injectable
} from '@angular/core';
import {
  map
} from 'rxjs/operators';
import {
  Observable
} from 'rxjs';

import {
  Apollo
} from 'apollo-angular';
import gql from 'graphql-tag';
import {
  IThresholdTemplate
} from '../models/threshold-template.model';

@Injectable({
  providedIn: 'root'
})
export class ThresholdTemplateService {

  constructor(
    private apollo: Apollo,
  ) {}


  // START APOLLO

  public createThresholdTemplate(thresholdTemplate: IThresholdTemplate): Observable < IThresholdTemplate > {

    const CREATE_THRESHOLD_TEMPLATE = gql `
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

    return this.apollo.mutate < CreateThresholdTemplateResponse > ({
      mutation: CREATE_THRESHOLD_TEMPLATE,
      variables: {
        input: {
          name: thresholdTemplate.name,
          thresholds: createThresholsdInput(thresholdTemplate)
        }
      }
    }).pipe(
      map(({
        data
      }) => data.thresholdTemplate)
    );
  }

  public getThresholdTemplates(): Observable < IThresholdTemplate[] > {
    const GET_THRESHOLD_TEMPLATES = gql `
            query findThresholdTemplates {
                thresholdTemplates: findThresholdTemplates {
                    id,
                    name,
                    hasAssetsAttached,
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

    return this.apollo.query < GetThresholdTemplatesResponse > ({
      query: GET_THRESHOLD_TEMPLATES,
      fetchPolicy: 'network-only',
    }).pipe(map(({
      data
    }) => {
      return data.thresholdTemplates;
    }));
  }

  public getThresholdTemplateById(id: string): Observable < IThresholdTemplate > {
    const GET_THRESHOLD_TEMPLATE_BY_ID = gql `
            query findThresholdTemplateById($input: ThresholdTemplateFindInput!) {
                thresholdTemplate: findThresholdTemplateById(input: $input) {
                    id,
                    name,
                    hasAssetsAttached,
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
                            },
                            label
                        }
                    }
                }
            }
        `;

    interface GetThresholdTemplateByIdResponse {
      thresholdTemplate: IThresholdTemplate;
    }

    return this.apollo.query < GetThresholdTemplateByIdResponse > ({
      query: GET_THRESHOLD_TEMPLATE_BY_ID,
      fetchPolicy: 'network-only',
      variables: {
        input: {
          id,
        }
      }
    }).pipe(map(({
      data
    }) => {
      console.log(data);
      return data.thresholdTemplate;
    }));
  }

  public updateThresholdTemplate(thresholdTemplate: IThresholdTemplate): Observable < boolean > {
    const UPDATE_THRESHOLD_TEMPLATE = gql `
            mutation updateThresholdTemplate($input: ThresholdTemplateUpdateInput!) {
                updateThresholdTemplate(input: $input)
            }
        `;

    interface UpdateThresholdTemplateResponse {
      updateThresholdTemplate: boolean;
    }

    return this.apollo.mutate < UpdateThresholdTemplateResponse > ({
      mutation: UPDATE_THRESHOLD_TEMPLATE,
      variables: {
        input: {
          id: thresholdTemplate.id,
          name: thresholdTemplate.name,
          thresholds: createThresholsdInput(thresholdTemplate)
        }
      }
    }).pipe(map(({
      data
    }) => data.updateThresholdTemplate));
  }

  public deleteThresholdTemplate(id: string): Observable < boolean > {
    const DELETE_THRESHOLD_TEMPLATE = gql `
            mutation deleteThresholdTemplate($input: ThresholdTemplateDeleteInput!) {
                deleteThresholdTemplate(input: $input)
            }
        `;

    interface DeleteThresholdTemplateResponse {
      deleteThresholdTemplate: boolean;
    }

    return this.apollo.mutate < DeleteThresholdTemplateResponse > ({
      mutation: DELETE_THRESHOLD_TEMPLATE,
      variables: {
        input: {
          id
        }
      }
    }).pipe(map(({
      data
    }) => data.deleteThresholdTemplate));
  }
}


function createThresholsdInput(thresholdTemplate: IThresholdTemplate) {
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
