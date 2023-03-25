import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Constants from 'src/app/constants';

@Injectable({
  providedIn: 'root'
})


export class AuthService {

  private baseUrl = `http://${Constants.ip}:${Constants.port}`; 

  constructor(private http: HttpClient ) {}
  
}
