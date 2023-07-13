import { Component, Input, OnInit } from '@angular/core';
import { Team } from '../models/team';
import { User } from '../models/user';
import { Project } from '../models/project';
import { TeamService } from '../services/team.service';
import { UserService } from '../services/user.service';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.css']
})
export class TeamDetailComponent implements OnInit {

  @Input() team?: Team;
  usersForm!: FormGroup;
  users : User[] = [];
  usersAvailable: User[] = [];
  project: Project[] = [];
  projectBackup!: Project;
  exists : Boolean = false;
  projectsForm!: FormGroup;
  projectsAvailable: Project[] = [];
  admin: Boolean = false;

  constructor(
    private route: ActivatedRoute,
    private teamService: TeamService,
    private location: Location,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private projectService: ProjectService,
    private appComponent: AppComponent,
  ) { }

  ngOnInit(): void {

    this.admin = this.appComponent.admin;

    this.userService.getUsers().subscribe(users => { this.users = users;
      var id = this.route.snapshot.paramMap.get('_id');
      if(id){
        this.teamService.getTeam(id).subscribe(team => {
          this.team = team;


          for(var i = 0; i < this.users.length; i++){
            var exists = false;
            for(var x = 0; x < this.team.users.length; x++){
              if(this.users[i].name == this.team.users[x].name){
                exists = true;
              }
            }
            if(!exists){
              if(this.users[i].admin == false){
                this.usersAvailable.push(this.users[i]);
              }    
            } 
            }
          
          this.projectService.getProjects().subscribe(projects => {
            for( var i = 0; i < projects.length; i++){
              if(projects[i].team == null){
                this.projectsAvailable.push(projects[i]);
              }
              else{
                var teamID = projects[i].team._id;
                if(teamID == this.team?._id){
                  this.project.push(projects[i]);
                  this.projectsAvailable = [];
                  this.exists = true;
                  break;
                }
              }
            }
          })
         
          
          });
      }


     
    }); 

    this.usersForm = this.fb.group({
      user: [null]
    });

    this.projectsForm = this.fb.group({
      project: [null]
    });
  }

  delete(user : User): void{
    if(!user){
      return;
    }

    if(this.team){

      const index = this.team.users.indexOf(user, 0);

      if(index > -1){
        this.team.users.splice(index, 1);
      }

      this.usersAvailable.push(user);
    }
  }

  add(): void{

    if(this.usersAvailable.length != 0 && this.usersForm.value.user != null){

      this.userService.getUserByName(this.usersForm.value.user).subscribe(user => {

        this.team?.users.push(user);
  
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

  addTeam(): void{

    if(this.projectsAvailable.length != 0 && this.projectsForm.value.project != null){

      this.projectService.getProject(this.projectsForm.value.project).subscribe(project =>{
        this.project[0] = project;
        
        if(this.team){
          this.project[0].team = this.team;
        }
       
      })
        
    }
  }

  deleteProject(): void{
    this.projectBackup = this.project[0];

    
    this.project = [];

  }
  


  goBack(): void {
    this.location.back();
  }

 
  save(): void{
    if(this.team){
      this.teamService.updateTeam(this.team).subscribe();
      if(this.projectBackup != null){
        this.projectService.updateProject(this.projectBackup, -1).subscribe();
      }
      else{
        if(this.project[0] != undefined){
          this.projectService.updateProject(this.project[0], 0).subscribe();
        }
      }
    
      this.router.navigate(['/teams']);
    }
  }
}

