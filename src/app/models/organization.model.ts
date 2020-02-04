import { IModule } from './module.model';

export interface IOrganization {
    id?: string;
    name?: string;
    modules?: IModule[];
}
