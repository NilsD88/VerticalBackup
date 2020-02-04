export interface ISensorType {
    id?: string;
    name?: string;
    postfix?: string;
    min?: number;
    max?: number;
    type?: Type;
}

export type Type = 'BOOLEAN' | 'COUNTER' | 'NUMBER';
