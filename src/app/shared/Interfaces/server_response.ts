export interface IisLogged {
    roles: [string, string];
    id: string;
    username: string;
    response: string;
}

export interface Ilogin {
    roles: [string, string];
    id: string;
    username: string;
    response: string;
}

export interface Idata {
    user: string;
    returnUrl: string;
}
