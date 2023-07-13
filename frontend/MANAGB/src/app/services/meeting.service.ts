import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Meeting } from '../models/meeting';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  
  constructor(
    private http: HttpClient
  ) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private meetingsUrl = 'http://localhost:3000/meetings'
  private meetingUrl = 'http://localhost:3000/meeting'

  getMeetings(): Observable<Meeting[]>{
    return this.http.get<Meeting[]>(this.meetingsUrl).pipe();
  }
  
  getMeeting(id : string): Observable<Meeting>{
    const url = `${this.meetingUrl}/${id}`;
    return this.http.get<Meeting>(url).pipe();
  }

  addMeeting(meeting: Meeting):Observable<Meeting> {
    return this.http.post<Meeting>(this.meetingUrl, meeting, this.httpOptions).pipe();
  }

  removeMeeting(id: number): Observable<Meeting> {
    const url = `${this.meetingUrl}/${id}`
    return this.http.delete<Meeting>(url).pipe();
  }
}
