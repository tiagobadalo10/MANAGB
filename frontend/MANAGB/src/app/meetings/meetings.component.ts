import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { Meeting } from '../models/meeting';
import { MeetingService } from '../services/meeting.service';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { CalendarEvent } from 'angular-calendar';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.css']
})
export class MeetingsComponent implements OnInit {
  
  meetingForm!: FormGroup;
  availableUsers: User[] = [];
  meetingUsers: User[] = [];
  usersForm!: FormGroup;
  admin : Boolean = false;
  meetingsCurrentUser: Meeting[] = [];
  meetingsAllUsers: Meeting[] = [];
  datas: Date[] = [];
  durations: number[] = [];
  availability: CalendarEvent[] = []
  usrUnavailable: boolean = false;

  range = new FormGroup({
    start_date: new FormControl(),
    end_date: new FormControl()
  })

  
 
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private appComponent : AppComponent,
    private meetingService: MeetingService,
  ) { }

  ngOnInit(): void {


    this.getUserMeetings();
    this.getUsers();
    this.possibleDurations();

    this.usersForm = this.fb.group({
      user: [null]
    });

    this.createForm();
  }

  getUserMeetings(): void {
    this.meetingsCurrentUser = [];
    
    this.meetingService.getMeetings().subscribe(meetings => {
      for(var i = 0; i < meetings.length; i++){
        var meetingUsers = meetings[i].users;
        for(var x = 0; x < meetingUsers.length; x++){
          if(meetingUsers[x].name == this.appComponent.getName()){
            this.meetingsCurrentUser.push(meetings[i]);
            break;
          }
        }
       
      }
    });
  }

  getUsers(): void {

    this.availableUsers = [];

    this.userService.getUsers().subscribe(users => { 
      for(var i = 0; i < users.length; i++){
        if(users[i].admin == false)
          this.availableUsers.push(users[i]);
      }
    });
  }

  addUsers(): void {
    var userName = this.usersForm.value.user;
    if(this.availableUsers.length != 0 && userName != null){
      this.userService.getUserByName(userName).subscribe(user => {
      
        this.meetingUsers.push(user);
        var index = -1;
 
        for(var i = 0; i < this.availableUsers.length; i++){
          if(this.availableUsers[i].name == user.name){
            index = i;
          }
        }
        
        if(index != -1)
          this.availableUsers.splice(index, 1);

      });
    }
    this.usersForm.reset();
  }

  delete(user: User): void {
    if(!user)
      return;
    
    const index = this.meetingUsers.indexOf(user, 0);

    if(index > -1){
      this.meetingUsers.splice(index, 1);
    }

    this.availableUsers.push(user);
  }

  possibleDurations(): void {
    for(var i = 1; i < 1001; i++){
      if(i % 30 == 0)
        this.durations.push(i);
    }
  }

  getUsersAvailability(){

    this.availability = [];

    for(var usr of this.meetingUsers){
      this.userService.getAvailability(usr.name).subscribe(avail => {
        for (var x = 0; x < avail.length; x++) {
          this.availability.push(
            {
              title: "Unavailable",
              start: new Date(avail[x].start_time),
              end: new Date(avail[x].end_time),
            }
          );
        }
      });
    }
  }


  get duration() {
    return this.meetingForm.get('duration');
  }

  get start_date() {
    return this.meetingForm.get('start_date');
  }

  get end_date() {
    return this.meetingForm.get('end_date');
  }

  createForm(): void {
    this.meetingForm = new FormGroup({
      duration: new FormControl('', [
        Validators.required
      ]),
      start_date: new FormControl('', [
        Validators.required
      ]),
      end_date: new FormControl('', [
        Validators.required
      ])
    })
  }

  
  deleteMeeting(meeting: Meeting): void{
    if(!meeting){
      return;
    }

    if(this.meetingsCurrentUser){

      const index = this.meetingsCurrentUser.indexOf(meeting, 0);

      if(index > -1){
        this.meetingsCurrentUser.splice(index, 1);
        this.meetingService.removeMeeting(meeting._id).subscribe(res => console.log(res));
      }
    }
  }


  checkDates(): void{

    this.datas = [];
    this.getUsersAvailability();

    var start = new Date(new Date(this.meetingForm.value.start_date).setHours(7,30))

    var end = new Date(new Date(this.meetingForm.value.end_date).setHours(17,30))

    var availableDates = []
    availableDates.push(start);

    var duration = this.meetingForm.value.duration

    let currentDate = new Date(start);
    
    while(currentDate < end){
      availableDates.push(currentDate);
      currentDate = new Date(currentDate.setHours(currentDate.getHours(), currentDate.getMinutes() + duration));
    }

    // temos datas possiveis

    for(var i = 0; i < availableDates.length; i++){

      var b = true;

      if(i != availableDates.length - 1){
        var start_date = availableDates[i];
        var end_date = availableDates[i+1];

        for(var x = 0; x < this.availability.length; x++){

          var start_date_u = this.availability[i].start;
          var end_date_u = this.availability[i].end;

          if(end_date_u){

            if(this.verifyOverlap(start_date, end_date, start_date_u, end_date_u)){
              b = false;
              break;
            }
          }
          
        }

        if(b ==  true){

          this.getMeetingsAllUsers();

          for(var y = 0;  y < this.meetingsAllUsers.length; y++){

            var start_date_y = this.meetingsAllUsers[i].start_date;
            var end_date_y = this.meetingsAllUsers[i].end_date;

            if(this.verifyOverlap(start_date, end_date, new Date(start_date_y), new Date(end_date_y))){
              b = false;
              break;
            }
          }
        }


        if(b == true){
          this.datas.push(availableDates[i]);
        }
      
      }
    }


  }

  getMeetingsAllUsers() {
  
    this.meetingService.getMeetings().subscribe(meetings => {
      meetings.forEach(m => {
        m.users.forEach(u => {
          if(this.meetingUsers.includes(u)) {
            this.meetingsAllUsers.push(m);
          }
        })
      });
    });
  }

  verifyOverlap(start_date:Date, end_date:Date, start_date_u: Date, end_date_u: Date): Boolean {
   
    if (this.isValidDate(start_date_u) && this.isValidDate(end_date_u)) {
      return (start_date > start_date_u && start_date < end_date_u
              || end_date > start_date_u && end_date < end_date_u);
       
    }
    else {
      return (start_date > start_date_u || start_date < end_date_u
        || end_date > start_date_u || end_date < end_date_u);
    }
    
  }

  isValidDate(d:Date) {
    return d instanceof Date && !isNaN(d.getTime());
  }

  createMeeting(){

    let duration = Number(this.meetingForm.value.duration);
    let start_date = this.meetingForm.value.start_date;
    let end_date = this.meetingForm.value.end_date;

    let users = this.meetingUsers;

    if(this.meetingUsers){
      this.meetingService.addMeeting({ users, duration, start_date, end_date } as Meeting)
      .subscribe(meeting => {
        this.meetingsCurrentUser.push(meeting);
      });

    this.meetingUsers = [];
    this.getUsers();
    this.createForm();
    }

    
  }
  
}
