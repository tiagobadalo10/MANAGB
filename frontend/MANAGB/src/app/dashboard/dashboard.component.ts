import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Task } from '../models/task';
import { UserService } from '../services/user.service';
import { TaskService } from '../services/task.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  availabilityForm!: FormGroup;
  name: string = "";
  tasks: Task[] = [];
  periods: {day: string, start: string, end: string}[] = [];
  admin: Boolean = this.appcomponent.admin;

  constructor(
      private appcomponent: AppComponent, 
      private taskService: TaskService, 
      private userService: UserService,
      private appComponent: AppComponent
    ) { }

  ngOnInit(): void {
    this.name = this.appcomponent.getName();
    this.getTasks();
    this.getPeriods();
    this.createForm();
  }

  getTasks(): void {

    this.taskService.getTasks().subscribe(tasks => {

      for (var i = 0; i < tasks.length; i++) {

        if (this.appComponent.admin == true) {
          this.tasks.push(tasks[i]);
        } else {
          for (var x = 0; x < tasks[i].users.length; x++) {
            if (tasks[i].users[x].name == this.appComponent.getName()) {
              this.tasks.push(tasks[i]);
            }
          }
        }
      }

      if (this.tasks.length > 1) {
        this.tasks = this.tasks.sort((a, b) => (this.getIndex(a.priority) > this.getIndex(b.priority) ? 1: 
        (this.getIndex(a.priority) < this.getIndex(b.priority)) ? -1 : 0))
      }

    });

  }
  
  getIndex(priority : string): number{
    if(priority == "URGENT"){
      return 0;
    }

    else if(priority == "HIGH"){
      return 1;
    }

    else if(priority == "MEDIUM"){
      return 2;
    }
    else{
      return 3;
    }
  }

  getPeriods(): void {
    if (!this.admin) {
      this.userService.getAvailability(this.name).subscribe(pl => {
        for (let p of pl) {
          let period = {
            day: new Date(p.start_time).toLocaleString('en-GB').split(',')[0],
            start: new Date(p.start_time).toLocaleTimeString('en-US',{hour: '2-digit', minute: '2-digit'}),
            end: new Date(p.end_time).toLocaleTimeString('en-US',{hour: '2-digit', minute: '2-digit'})
          };
          this.periods.push(period);
        }
      });
    }
  }

  createForm(): void {
    this.availabilityForm = new FormGroup({
      day: new FormControl('', [
        Validators.required
      ]),
      start_time: new FormControl('', [
        Validators.required
      ]),
      end_time: new FormControl('', [
        Validators.required
      ])
    })
  }

  validatesTime(): void {
    var day = this.availabilityForm.value.day;
    var s_time = this.availabilityForm.value.start_time;
    var e_time = this.availabilityForm.value.end_time;
    var s_date = new Date(day + " " + s_time);
    var e_date = new Date(day + " " + e_time);
    if ((s_date >= e_date) && (day != "" && s_time != "" && e_time != "")) {
      this.availabilityForm.controls['end_time'].setErrors({ 'wrong_time': true });
    }
  }

  onSubmit(): void {

    var day = this.availabilityForm.value.day;
    var s_time = this.availabilityForm.value.start_time;
    var e_time = this.availabilityForm.value.end_time;

    this.userService.newUnavailPeriod(this.name, day + " " + s_time, day + " " + e_time).subscribe(res => {
      this.periods = [];
      this.getPeriods();
    });
  }

}
