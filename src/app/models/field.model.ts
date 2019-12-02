export interface IField {
    id?: string;
    label?: {
        en?: string;
        fr?: string;
        nl?: string;
    };
    options?: string;
    type?: FieldType;
}

export type FieldType = 'text' | 'list' | 'boolean';
