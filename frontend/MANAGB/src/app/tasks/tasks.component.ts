import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { alphanumericValidator } from '../validators/alphanumeric.directive';
import { Task } from '../models/task';
import { TaskService } from '../services/task.service';
import { Priority } from '../models/priority';
import { PriorityService } from '../services/priority.service';
import { AppComponent } from '../app.component';
import { User } from '../models/user'
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})


export class TasksComponent implements OnInit {

  taskForm!: FormGroup;
  tasks: Task[] = [];
  priorityTypes: Priority[] = [];
  user!: User;
  admin: Boolean = false;

  types() : Array<Priority> {
    var keys = Object.keys(this.priorityTypes);
    var types = [];
    for (var i = 0; i < keys.length; i++) {
      types.push(this.priorityTypes[i])
    }
    return types;
  }

  constructor(private taskService: TaskService, private priorityService: PriorityService, private userService: UserService,
    private appComponent: AppComponent) { }

  ngOnInit(): void {

    this.admin = this.appComponent.admin;
    
    this.getTasks();

    this.priorityTypes = this.priorityService.getPriorityTypes();

    this.createForm();
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
            if(tasks[i].users[x].name == this.appComponent.getName()){
              this.tasks.push(tasks[i]);
            }
          }
        }
        
      }
     });

  } 

  add(name: string, priority: Priority, start_date: string, end_date: string): void {

    name = name.trim();
    if (this.isValidDate(new Date(start_date))) {
        start_date = start_date.concat(":00.000Z");
    }
    if (this.isValidDate(new Date(end_date))) {
      end_date = end_date.concat(":00.000Z");
    }

    this.userService.getUsers().subscribe(users => {
      for (var i = 0; i < users.length; i++) {
        var user = users[i];
        if (user.name == this.appComponent.getName()) {
          this.user = user;
          this.taskService.addTask(user, {name, priority, start_date, end_date} as Task).subscribe(task => {
            this.tasks.push(task)});
          
        }
      }
    });

  }

  delete(task: Task): void{
    if(!task){
      return;
    }

    if(this.tasks){

      const index = this.tasks.indexOf(task, 0);

      if(index > -1){
        this.tasks.splice(index, 1);
        this.taskService.removeTask(task._id).subscribe(res => console.log(res));
      }
    }
  }

  get name() {
    return this.taskForm.get('name')!;
  }

  get priority() {
    return this.taskForm.get('priority')!;
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

  onSubmit(): void {

    this.validatesOverlapUrgentTask(new Date(this.taskForm.value.start_date), new Date(this.taskForm.value.end_date));

    if (this.taskForm.controls['overlaps'].errors?.['overlaps']) {
      return;
    }
  
    this.add(
      this.taskForm.value.name,
      this.taskForm.value.priority, 
      this.taskForm.value.start_date,
      this.taskForm.value.end_date
    );
    this.createForm();
  }



  createForm(): void {
    this.taskForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        alphanumericValidator()
      ]),
      priority: new FormControl('', [
        Validators.required,
      ]),
      start_date: new FormControl('', [

      ]),
      end_date: new FormControl('', [
        
      ]),
      overlaps: new FormControl('', [

      ])
    });
  }


  validateDates(): void {
    this.validatesStartDate();
    this.validatesEndDate();  
  }

  validatesStartDate(): void {
    if (this.taskForm.controls['overlaps'].errors?.['overlaps']) {
      this.taskForm.controls['overlaps'].reset();
    }
    var start_date = this.taskForm.value.start_date;
    var now:Date = new Date(Date.now());
    now.setMinutes(now.getMinutes() - 1);
    var date = new Date(start_date);
    if (date < now) {
      this.taskForm.controls['start_date'].setErrors({ 'after_today': true });
    }
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
    if (this.taskForm.value.priority != "URGENT" || this.taskForm.controls['end_date'].errors?.['after_start_date']) {
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

