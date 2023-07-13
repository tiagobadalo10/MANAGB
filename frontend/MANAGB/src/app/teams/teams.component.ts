import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Team } from '../models/team';
import { alphanumericValidator } from '../validators/alphanumeric.directive';
import { TeamService } from '../services/team.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {

  teamForm!: FormGroup;
  teams: Team [] = [];
  admin: Boolean = false;

  constructor(private teamService: TeamService, private appComponent: AppComponent) { }

  ngOnInit(): void {

    this.admin = this.appComponent.admin;

    if(this.appComponent.admin){
      this.teamService.getTeams().subscribe(teams => {this.teams = teams});
    }
    else{
      this.teamService.getTeams().subscribe(teams => {

        for(var i = 0; i < teams.length; i++){
          var users = teams[i].users;
          for(var x = 0; x < users.length; x++){
            if(users[x].name == this.appComponent.name){
              this.teams.push(teams[i]);
            }
          }
        }

      });
    }
    

    this.createForm();

  }

  createForm(): void{
    this.teamForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        alphanumericValidator()
      ])
    });
  }

  add(name : string): void{
    name = name.trim();

    this.teamService.addTeam({name} as Team)
    .subscribe(team => {
      this.teams.push(team);
    });

  }

  onSubmit(): void{
    var name = this.teamForm.value.name;

    this.teamService.getTeams().subscribe(teams => {

      var exists = false;

      for(var i = 0; i < teams.length; i++){
        var team = teams[i];
        if(team.name == name){
          exists = true;
        }
      }

      if(exists){
        this.teamForm.controls['name'].setErrors({'unique' : true});
      }
      else{
        this.add(
          name
        );

        this.createForm();
      }




    });
  }

  get name() {
    return this.teamForm.get('name')!;
  }


}
