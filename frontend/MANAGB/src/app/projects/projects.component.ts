import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { alphanumericValidator } from '../validators/alphanumeric.directive';
import { Project } from '../models/project';
import { ProjectService } from '../services/project.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  projectForm!: FormGroup;
  projectsInTable: Project[] = [];
  page: number = 0;
  pages: number = 0;
  admin: Boolean = this.appcomponent.admin;

  constructor(private projectService: ProjectService, private router: Router, private appcomponent: AppComponent, private userService: UserService) { }

  ngOnInit(): void {
    if (!this.appcomponent.isLogged()) {
      this.router.navigate(['/login'])
    }
    this.getProjects();

    this.createForm();
  }

  getProjectsAux(projects: Project[]): void {
    this.pages = Math.floor(projects.length / 10)
    var page = this.page;
    if (page > this.pages) {
      this.page--;
      return;
    }
    if (page < 0) {
      this.page++;
      return;
    }
    this.projectsInTable = projects.slice(page * 10, (page * 10) + 10);

  }

  getProjects(): void {
    
    if (this.admin) {
      this.projectService.getProjects()
        .subscribe(projects => this.getProjectsAux(projects));
    } else {
      this.userService.getUserByName(this.appcomponent.name).subscribe(
        user => {

          this.projectService.getProjects().subscribe(projects => {

            var projectsUser = [];

            for (var i = 0; i < projects.length; i++) {
              if (projects[i].team != null) {
                var users = projects[i].team.users;
                for (var x = 0; x < users.length; x++) {
                  var u = users[x].toString();
                  if (user._id.toString() == u) {
                    projectsUser.push(projects[i]);
                  }

                }
              }
            }
            this.getProjectsAux(projectsUser);
          })
        }
      );
    }

  }

  add(name: string, acronym: string, start_date: string, end_date: string): void {
    name = name.trim()
    acronym = acronym.toUpperCase()

    this.projectService.addProject({ name, acronym, start_date, end_date } as Project)
      .subscribe(project => {
        this.getProjects();
      });
    this.getProjects();
  }


  get name() {
    return this.projectForm.get('name')!;
  }

  get acronym() {
    return this.projectForm.get('acronym')!;
  }

  get start_date() {
    return this.projectForm.get('start_date')!;
  }

  get end_date() {
    return this.projectForm.get('end_date')!;
  }

  validatesStartDate(): void {
    var start_date = this.projectForm.value.start_date;
    var now = new Date(Date.now());
    var date = new Date(start_date);
    if (date < now) {
      this.projectForm.controls['start_date'].setErrors({ 'after_today': true });
    }
  }

  validatesEndDate(date: string): void {
    var star_date = new Date(date);
    var end_date = new Date(this.projectForm.value.end_date);
    if (end_date < star_date) {
      this.projectForm.controls['end_date'].setErrors({ 'after_start_date': true });
    }
  }

  createForm(): void {
    this.projectForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        alphanumericValidator()
      ]),
      acronym: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(3),
        alphanumericValidator()
      ]),
      start_date: new FormControl('', [
        Validators.required
      ]),
      end_date: new FormControl('', [

      ])
    })
  }

  onSubmit(): void {

    this.projectService.getProjects().subscribe(projects => {
      var exists = false;

      for (var i = 0; i < projects.length; i++) {
        var project = projects[i];
        if (project.acronym.toUpperCase() == this.projectForm.value.acronym.toUpperCase()) {
          exists = true;
        }
      }

      if (exists) {
        this.projectForm.controls['acronym'].setErrors({ 'unique': true });
      }
      else {
        this.add(
          this.projectForm.value.name,
          this.projectForm.value.acronym,
          this.projectForm.value.start_date,
          this.projectForm.value.end_date
        );

        this.createForm();
      }

    });

    this.getProjects();


  }

  prevProjects(): void {
    this.page--;
    this.getProjects();
  }

  nextProjects(): void {
    this.page++;
    this.getProjects();
  }


}
