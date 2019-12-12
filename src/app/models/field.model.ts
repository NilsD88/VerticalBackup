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

export interface ICustomField {
    keyId?: string;
    value?: string;
}

export type FieldType = 'text' | 'list' | 'boolean';
