import { HostListener, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import Constants from 'src/app/constants';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})


export class AuthService {

  //private baseUrl = `http://${Constants.ip}:${Constants.port}/`; 
  private restUrl = `http://localhost:3000/users/`; 

  private userPayload:any;

  constructor(private http: HttpClient, private router: Router ) {
    this.userPayload = this.decodedToken();
  }

  

  signup(userObj: any){
    return this.http.post<any>(`${this.restUrl}signin`, userObj)
    .pipe(
      tap(res => {
        const token = res.token;
        this.storeToken(token); 
      })
    );
  }

  login(loginObj: any){
    return this.http.post<any>(`${this.restUrl}login`, loginObj)
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

  decodedToken(){
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    return jwtHelper.decodeToken(token);
  }

  getEmailFromToken(){
    if(this.userPayload){
      return this.userPayload.email;
    }
}
}
