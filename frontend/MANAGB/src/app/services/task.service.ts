import { Injectable } from '@angular/core';
import { Task } from '../models/task';
import { Observable} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getTask(id : string): Observable<Task>{
    const url = `${this.taskUrl}/${id}`
    return this.http.get<Task>(url).pipe();
  }

  removeTask(id: number): Observable<void>{
    let url =  `${this.taskUrl}/${id}`
    return this.http.delete<void>(url, this.httpOptions).pipe();
  }

  updateTask(task : Task): Observable<any>{
    var id = task._id;
    const url = `${this.taskUrl}/${id}`;
    return this.http.put(url, task, this.httpOptions).pipe()
  }

  private taskUrl = 'http://localhost:3000/task'
  private tasksUrl = 'http://localhost:3000/tasks'

  getTasks(): Observable<Task[]>{
    return this.http.get<Task[]>(this.tasksUrl).pipe();
  } 

  addTask(user: User, task: Task){

    return this.http.post<Task>(this.taskUrl, {user, task}, this.httpOptions).pipe();
    
  }

}

  