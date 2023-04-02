import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Constants from 'src/app/constants';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})


export class AuthService {

  private baseUrl = `http://${Constants.ip}:${Constants.port}/`; 

  constructor(private http: HttpClient, private router: Router ) {}

  signup(userObj: any){
    return this.http.post<any>(`${this.baseUrl}users/signin`, userObj)
  }

  login(loginObj: any){
    return this.http.post<any>(`${this.baseUrl}users/login`, loginObj)
  }

  storeToken(tokenValue: string){
    localStorage.setItem('token', tokenValue)
  }

  getToken(){
    return localStorage.getItem('token')
  }

  isLoggedIn():boolean{
    return !!localStorage.getItem('token')
  }
  
  signOut(){
    localStorage.clear();
    //localStorage.removeItem('token');
    this.router.navigate(['login']);
  }
}
