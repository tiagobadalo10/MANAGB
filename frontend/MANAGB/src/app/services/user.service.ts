import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = 'http://localhost:3000';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getUserByName(name: string): Observable<User>{
    return this.http.get<User>(`${this.url}/user/${name}`).pipe();
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/users`).pipe();
  }

  register(name: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.url}/user/register`, {username: name, password: password}, this.httpOptions).pipe();
  }

  login(name: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.url}/user/authenticate`, {username: name, password: password}, this.httpOptions).pipe();
  }

  getAvailability(name: string): Observable<any> {
    return this.http.get<any>(`${this.url}/user/${name}/availability`, this.httpOptions).pipe();
  }

  newUnavailPeriod(name: string, s: string, e: string): Observable<any> {
    return this.http.post<any>(`${this.url}/user/${name}/availability`, {start: s, end: e}, this.httpOptions).pipe();
  }

}
