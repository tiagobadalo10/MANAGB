import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import { User } from '../models/user';
import { TaskService } from '../services/task.service';
import { UserService } from '../services/user.service';
import { MeetingService} from '../services/meeting.service'
import { CalendarView, CalendarEvent} from 'angular-calendar';
import { Subject } from 'rxjs';

const colors: any = {
  red:{
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue:{
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow:{
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-user-schedule',
  templateUrl: './user-schedule.component.html',
  styleUrls: ['./user-schedule.component.css']
})
export class UserScheduleComponent implements OnInit {

  users: User[] = [];
  tasks: Task[] = [];
  events: CalendarEvent[] = []
  refresh: Subject<any> = new Subject();

  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;

  setView(view: CalendarView) {
    this.view = view;
  }

  constructor(private userService: UserService, private taskService: TaskService, private meetingService: MeetingService) { }

  ngOnInit() {

    this.getUsers();
    
  }

  getTasks(user: String) {
    this.taskService.getTasks().subscribe(tasks => {
      for (var i = 0; i < tasks.length; i++) {
        for (var j = 0; j < tasks[i].users.length; j++) {
          if (tasks[i].users[j].name == user) {
            this.events.push(
              {
                title: tasks[i].name + " Progress: " + tasks[i].progress,
                start: new Date(tasks[i].start_date),
                end: new Date(tasks[i].end_date),
                color: colors.blue,
              }
            );
          }
        }
      }
    });
  }

  getMeets(user: String){
    this.meetingService.getMeetings().subscribe(meets => {
      for (var i = 0; i < meets.length; i++) {
        for (var j = 0; j < meets[i].users.length; j++) {
          if (meets[i].users[j].name == user) {
            this.events.push(
              {
                title: "Meeting",
                start: new Date(meets[i].start_date),
                end: new Date(meets[i].end_date),
                color: colors.yellow 
              }
            );
          }
        }
      }
    });
  }

  getAvailability(user: string){
    this.userService.getAvailability(user).subscribe(avail => {
     for (var i = 0; i < avail.length; i++) {
            this.events.push(
              {
                title: "Unavailable",
                start: new Date(avail[i].start_time),
                end: new Date(avail[i].end_time),
                color: colors.red 
              }
            );
          }
    });
  }


  getUsers(): void {

    this.users = [];

    this.userService.getUsers().subscribe(users => {

      for (var i = 0; i < users.length; i++) {
          if (users[i].admin == false) {
            this.users.push(users[i]);
          }
      }
    });
  }

  async showC(user: string) {
    var _this = this;
    this.events = [];
    await this.getTasks(user);
    await this.getMeets(user);
    await this.getAvailability(user);

    _this.setView(CalendarView.Week)
    setTimeout( function(){
    _this.setView(CalendarView.Month);
    }, 500);

  }


}
