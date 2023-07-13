import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../models/task';
import { User } from '../models/user';
import { TaskService } from '../services/task.service';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AppComponent } from '../app.component';
import { alphanumericValidator } from '../validators/alphanumeric.directive';


@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {

  @Input() task?: Task;
  usersForm!: FormGroup;
  taskForm!: FormGroup;
  users : User[] = [];
  usersAvailable : User[] = [];
  admin : Boolean = false;
  rangevalue : number = 0;
  tasks: Task[] = [];

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private location: Location,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private appComponent : AppComponent
  ) { }

  ngOnInit(): void {

    this.admin = this.appComponent.admin;

     this.userService.getUsers().subscribe(users => { this.users = users;
      var id = this.route.snapshot.paramMap.get('_id');
      if(id){
        this.taskService.getTask(id).subscribe(task => {
          this.task = task;
          this.rangevalue = this.task.progress;
          for(var i = 0; i < this.users.length; i++){
            var exists = false;
            for(var x = 0; x < this.task.users.length; x++){
              if(this.users[i].name == this.task.users[x].name){
                exists = true;
              }
            }
            if(!exists){
              if(this.users[i].admin == false){
                this.usersAvailable.push(this.users[i]);
              }    
            }
             
              
            }
            
            this.createForm();

            if(this.task.start_date)
              (<FormGroup>this.taskForm).get('start_date')?.setValue(this.task?.start_date.split('.')[0]);
            if(this.task.end_date)
              (<FormGroup>this.taskForm).get('end_date')?.setValue(this.task?.end_date.split('.')[0]);

            this.getTasks();
          });
      }
    }); 
   
  
    this.usersForm = this.fb.group({
      user: [null]
    });

  }


  getTasks(): void {

    this.tasks = [];
    
    this.taskService.getTasks().subscribe(tasks => {
      
      for(var i = 0; i < tasks.length; i++){

        if(this.appComponent.admin == true){
          this.tasks.push(tasks[i]);
        }

        else{
          for(var x = 0; x < tasks[i].users.length; x++){
            if(tasks[i].users[x].name == this.appComponent.getName() && tasks[i]._id != this.task?._id){
              this.tasks.push(tasks[i]);
            }
          }
        }
        
      }
     });
  }


  delete(user: User): void {
    if(!user){
      return;
    }
    if(this.task){
      const index = this.task.users.indexOf(user, 0);

      if(index > -1){
        this.task.users.splice(index, 1);
      }

      this.usersAvailable.push(user);
    }
  }


  add(): void {

    if(this.usersAvailable.length != 0 && this.usersForm.value.user != null){
      this.userService.getUserByName(this.usersForm.value.user).subscribe(user => {
      
        this.task?.users.push(user);
            
        var index = -1;
 
        for(var i = 0; i < this.usersAvailable.length; i++){
          if(this.usersAvailable[i].name == user.name){
            index = i;
          }
        }
        
        if(index != -1){
          this.usersAvailable.splice(index, 1);
        }
        
       
      });
    }
  
  }

  goBack(): void {
    this.location.back();
  }

 
  save(): void{
    if(this.task){
      this.validatesOverlapUrgentTask(new Date(this.taskForm.value.start_date), new Date(this.taskForm.value.end_date));

      if (this.taskForm.controls['overlaps'].errors?.['overlaps']) {
        return;
      }
      
      this.task.start_date = this.dateToString(this.taskForm.value.start_date)
      this.task.end_date = this.dateToString(this.taskForm.value.end_date)
  
      this.taskService.updateTask(this.task).subscribe();
      this.router.navigate(['/tasks']);
    }
  }

  dateToString(str: string): string {
    if (str == "")
      return ""
    console.log(str.length)
    if (str.length == 16) {
      str = str.concat(":00")
    }
    return str.concat(".000Z")
  }

  getProgress(e : any) {
    this.rangevalue = e.target.value;
    if(this.task){
      this.task.progress = this.rangevalue;
    }
  
  }


  createForm(): void {
    this.taskForm = new FormGroup({
      start_date: new FormControl('', [

      ]),
      end_date: new FormControl('', [
        
      ]),
      overlaps: new FormControl('', [

      ])
    });
  }

  get start_date() {
    return this.taskForm.get('start_date')!;
  }

  get end_date() {
    return this.taskForm.get('end_date')!;
  }

  get overlaps() {
    return this.taskForm.get('overlaps')!;
  }

  validatesEndDate(): void {
    if (this.taskForm.controls['overlaps'].errors?.['overlaps']) {
      this.taskForm.controls['overlaps'].reset();
    }
    var start_date = new Date(this.taskForm.value.start_date);
    var end_date = new Date(this.taskForm.value.end_date);
    if (end_date <= start_date) {
      this.taskForm.controls['end_date'].setErrors({ 'after_start_date': true });
    }
  }

  validatesOverlapUrgentTask(start_date:Date, end_date:Date): void {
    if (this.task?.priority != "URGENT" || this.taskForm.controls['end_date'].errors?.['after_start_date']) {
      this.taskForm.controls['overlaps'].reset();
      return;
    }
    
    if (!this.isValidDate(start_date) && !this.isValidDate(end_date)) {
      return;
    }
  
    this.tasks.forEach(task => {
      if (task.priority == 'URGENT' && (task.start_date || task.end_date) && task.progress != 100) {
        if (this.verifyOverlap(start_date, end_date, task)) {
          this.taskForm.controls['overlaps'].setErrors({ 'overlaps': true });
          return;
        }
      }
    });
  }

  verifyOverlap(start_date:Date, end_date:Date, task: Task): Boolean {
    var task_start_date = new Date(task.start_date);
    var task_end_date = new Date(task.end_date);

    if (this.isValidDate(task_start_date) && this.isValidDate(task_end_date)) {
      return (start_date > task_start_date && start_date < task_end_date
              || end_date > task_start_date && end_date < task_end_date);
       
    }
    else {
      return (start_date > task_start_date || start_date < task_end_date
        || end_date > task_start_date || end_date < task_end_date);
    }
    
  }

  isValidDate(d:Date) {
    return d instanceof Date && !isNaN(d.getTime());
  }

}