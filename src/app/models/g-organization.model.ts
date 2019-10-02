import { IModule } from './g-module.model';

export interface IOrganization {
    id?: string;
    name?: string;
    modules?: IModule[];
}