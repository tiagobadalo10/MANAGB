import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../models/project';
import { ProjectService } from "../services/project.service"
import { TaskService } from '../services/task.service';
import { Task } from '../models/task';
import { Location } from '@angular/common';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {

  @Input() project?:Project;
  tasksForm!: FormGroup;
  tasksAvailable: Task[] | undefined;
  admin : Boolean = false;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private taskService: TaskService,
    private location: Location,
    private fb: FormBuilder,
    private appComponent: AppComponent
  ) { }

  ngOnInit(): void {

    this.admin = this.appComponent.admin;

    this.getProject();
    this.getTasksAvailable();

    this.formCreate();
    }

  formCreate() {
    this.tasksForm = this.fb.group({
      task: [null]
    });
  }

  getTasksAvailable(): void {
    this.taskService.getTasks().subscribe( tasks => {
      this.projectService.getProjects().subscribe(projects => {
        var tasksInProjects = new Array();
        projects.forEach(project => {
          project.tasks.forEach(task => {
            tasksInProjects.push(task);
          })
        });
        
        this.tasksAvailable = tasks.filter(x => !tasksInProjects.map(x => x._id).includes(x._id));
      })
    })
    
  }

  getProject(): void {
    const id = this.route.snapshot.paramMap.get('_id')!;
    this.projectService.getProject(id)
      .subscribe(project => {
        this.project = project;
      });
  }


  delete(task: Task): void {

    if (this.project?.tasks) {
      this.project.tasks = this.project.tasks.filter(t => t !== task);
      this.tasksAvailable?.push(task);

    }

  }

  add(): void {
    
    var b = false;
    this.tasksAvailable?.forEach(x => {
      if (x._id == this.tasksForm.value.task) {
        b = true;
      }
    })

    if (!b) {
      return;
    }

    this.taskService.getTask(this.tasksForm.value.task).subscribe(task => {
  
      this.project?.tasks.push(task);
      var i = 0;
      this.tasksAvailable?.forEach(taskAvailable => {
        if (taskAvailable._id == task._id) {
         
          this.tasksAvailable?.splice(i, 1);
        }
        i++;
      })

    })

    this.formCreate();    

  }

  update(): void {
    if (this.project) {
      this.projectService.updateProject(this.project, 0)
      .subscribe();
    }
  }

  save(): void {
    this.update();
    this.goBack();
  }

  /**
   * Go back to the last location
   */
  goBack(): void {
    this.location.back();
  }
}
