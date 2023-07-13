import {User} from './user';

export interface Team{
    _id : number;
    name: string;
    users: User[];
}