import {User} from './user';
import {Priority} from './priority';

export interface Task{
    _id: number;
    name: string;
    priority: Priority; 
    users: User[];
    progress: number;
    start_date : string;
    end_date : string;
}