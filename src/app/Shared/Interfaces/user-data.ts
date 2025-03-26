
export interface LoginData {

    email: string;
    password:string;
}


export interface UserData extends LoginData{

    name: string;
    phone:number;
    rePassword:string;
}

