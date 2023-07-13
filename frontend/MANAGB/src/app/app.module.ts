import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserSignupComponent } from './user-signup/user-signup.component';
import { IndexComponent } from './index/index.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { TasksComponent } from './tasks/tasks.component';
import { TeamsComponent } from './teams/teams.component';
import { UserScheduleComponent } from './user-schedule/user-schedule.component';
import { MeetingsComponent } from './meetings/meetings.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    TaskDetailComponent,
    DashboardComponent,
    ProjectsComponent,
    UserDetailComponent,
    UserLoginComponent,
    UserSignupComponent,
    IndexComponent,
    TeamDetailComponent,
    ProjectDetailComponent,
    TasksComponent,
    TeamsComponent,
    UserScheduleComponent,
    MeetingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    NgbModule,

    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
