import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IndexComponent } from './index/index.component';
import { ProjectsComponent } from './projects/projects.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserSignupComponent } from './user-signup/user-signup.component';
import { TasksComponent } from './tasks/tasks.component';
import { TeamsComponent } from './teams/teams.component';
import { MeetingsComponent } from './meetings/meetings.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { UserScheduleComponent } from './user-schedule/user-schedule.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';

const routes: Routes = [
  { path: '', component: IndexComponent},
  { path: 'login', component: UserLoginComponent},
  { path: 'signup', component: UserSignupComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'projects', component: ProjectsComponent},
  { path: 'tasks', component: TasksComponent},
  { path: 'teams', component: TeamsComponent},
  { path: 'schedule', component: UserScheduleComponent},
  { path: 'meetings' , component: MeetingsComponent},
  { path: 'task/:_id', component: TaskDetailComponent},
  { path: 'user/:_id', component: UserDetailComponent},
  { path: 'project/:_id', component: ProjectDetailComponent},
  { path: 'team/:_id' , component: TeamDetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
