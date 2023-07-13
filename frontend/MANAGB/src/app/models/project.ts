import { Task } from './task';
import { Team } from './team';

export interface Project {
    _id : number;
    name : string;
    acronym : string;
    tasks: Task[];
    start_date : string;
    end_date : string;
    team: Team;
}