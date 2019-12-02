export interface IField {
    id?: string;
    label?: IFieldLabel;
    options?: string;
    type?: FieldType;
}

export interface IFieldLabel {
    en?: string;
    fr?: string;
    nl?: string;
}

export type FieldType = 'text' | 'list' | 'boolean';
