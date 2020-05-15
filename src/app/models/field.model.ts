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
    label?: string; // ONLY FRONT-END
}

export type FieldType = 'text' | 'number' | 'list' | 'boolean';
