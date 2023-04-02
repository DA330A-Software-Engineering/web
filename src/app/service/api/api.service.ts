import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseURL: string = 'http://localhost:3000/users/'

  constructor(private http: HttpClient) { }

  getUsers(){
    return this.http.get<any>(this.baseURL)
  }
}
