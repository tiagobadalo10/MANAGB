import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Team } from '../models/team';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private http: HttpClient) { }

  
  private url = 'http://localhost:3000';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getTeams(): Observable<Team[]>{
    return this.http.get<Team[]>(`${this.url}/teams`).pipe();
  }

  addTeam( team : Team): Observable<Team>{
    return this.http.post<Team>(`${this.url}/team`, team, this.httpOptions).pipe();
  }
  
  getTeam(id: string): Observable<Team>{
    const url = `${this.teamUrl}/${id}`
    return this.http.get<Team>(url).pipe();
  }

   updateTeam(team : Team): Observable<any>{
    var id = team._id;
    const url = `${this.teamUrl}/${id}`;
    return this.http.put(url, team.users, this.httpOptions).pipe()
  }

  private teamUrl = 'http://localhost:3000/team'
}
