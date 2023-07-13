import { User } from "./user";

export interface Meeting {
    _id : number;
    users: User[];
    duration: number;
    start_date : string;
    end_date : string;
}