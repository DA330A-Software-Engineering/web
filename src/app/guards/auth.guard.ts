import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router, private toast: NgToastService){}
  canActivate():boolean{
    if(this.auth.isLoggedIn()){
      return true
    }
    else {
      this.toast.error({detail:"ERROR", summary: "Please log in"})
      this.router.navigate(['login']);
      return false
    }
  }
}
