export interface Users {
    id?: number;
    login: string;
    password?: string;
    email: string;
    firstname?: string;
    lastname?: string;
    roles: string[];
}

export interface Categories {
    [x: string]: any;
    brand?: string;
    resolution?: string;
    size?: string;
    technology?: string;
    connectivity?: string;
    is_smart_tv?: string | undefined;
}

export interface Catalogs {
    id: number;
    name: string;
    description?: string;
    photo?: string;
    price: GLfloat;
    brand?: string;
    resolution?: string;
    size?: string;
    technology?: string;
    connectivity?: string;
    is_smart_tv?: boolean;
}

export interface Orders {
    id: number;
    idUser: number;
    totalPrice: number;
    creationDate: string;
    products: Catalogs[];
}

export interface Carts {
    id?: number;
    idUser?: number;
    totalPrice?: number;
    creationDate?: string;
    products: Catalogs[];
}

export const STRIPE_PUBLIC_KEY: string = "pk_test_51PBCkrLHFH1qWaVzVLXZPt4NfvoyA0DGRvOX33pmqkTUdhtTuXzdiwz03K3IwX3OQ3kar6whlIpyiwReUS1z5rbO00Nk5OdTNJ"