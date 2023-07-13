import { Injectable } from '@angular/core';
import { Priority } from '../models/priority';

@Injectable({
  providedIn: 'root'
})
export class PriorityService {

  priorityTypes: Priority[] = [];

  constructor() { 
    this.addPriorityTypes();
  }

  addPriorityTypes(): void{
    this.priorityTypes.push(Priority.URGENT);
    this.priorityTypes.push(Priority.HIGH);
    this.priorityTypes.push(Priority.MEDIUM);
    this.priorityTypes.push(Priority.LOW);
  }

  getPriorityTypes(): Priority[]{
    return this.priorityTypes;
  }

}
