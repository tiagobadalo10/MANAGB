import { Injectable } from '@angular/core';


import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Project } from '../models/project';
import { User } from '../models/user'

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private api = 'http://localhost:3000/';  // URL to web api

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  updateProject(project: Project, num: number): Observable<Project>{
    if(num == 0){
      return this.http.put<Project>(this.api.concat("project/" + project._id), {project: project, flag: "normal"}, this.httpOptions).pipe();
    }
    else{
      return this.http.put<Project>(this.api.concat("project/" + project._id), {project : project, flag: "delete"}, this.httpOptions).pipe();
    }
    
  }

  getProjects() : Observable<Project[]> {
    return this.http.get<Project[]>(this.api.concat("projects")).pipe();
  }



  addProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.api.concat("project"), project, this.httpOptions).pipe();
  }

  getProject(id: string): Observable<Project> {
    return this.http.get<Project>(this.api.concat("project/" + id)).pipe();
  }

}
