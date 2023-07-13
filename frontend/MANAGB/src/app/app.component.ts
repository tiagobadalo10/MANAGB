import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'MANAGB';

  admin: boolean = false;
  logged: boolean = false;
  name: string = "";

  constructor(public router: Router) {}

  ngOnInit(): void{
    var adminLocalStorage = localStorage.getItem("admin");
    var nameLocalStorage = localStorage.getItem("name");
    var loggedLocalStorage = localStorage.getItem("logged");

    if(adminLocalStorage == "true"){
      this.admin = true;
    }
    else{
      this.admin = false;
    }
   
    if(loggedLocalStorage == "true"){
      this.logged = true;
    }
    else{
      this.logged = false;
    }

    if(nameLocalStorage){
      this.name = nameLocalStorage;
    }
    
  }

 
  setAdmin(): void{
    this.admin = true;
    localStorage.setItem("admin", JSON.stringify(true));
  }

  setName(name : string): void {
    this.name = name;
    localStorage.setItem("name", name);
  }

  setLogged(): void{
    this.logged = true;
    localStorage.setItem("logged", JSON.stringify(true));
  }

  setUnlogged(): void{
    this.logged = false;
    localStorage.setItem("logged", JSON.stringify(false));
  }

  isLogged() : Boolean{
    //return this.logged;
    return localStorage.getItem("logged") == 'true';
  }
  
  logout(): void{
    this.logged = false;
    this.admin = false;
    this.name = "";
    localStorage.removeItem("name");
    localStorage.removeItem("logged");
    localStorage.removeItem("admin");
  }

  getName(): string {
    //return this.name;
    var name = localStorage.getItem("name");
    if (!name) {
      return ""
    }
    return name
  }

}
