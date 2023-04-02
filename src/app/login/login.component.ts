import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth/auth.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  signupForm!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private toast: NgToastService){}

  ngOnInit(): void{
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    }),
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  onLogin(){
    if(this.loginForm.valid){
      this.auth.login(this.loginForm.value)
      .subscribe((res) => {
        console.log('sent');
        this.signupForm.reset();
        this.auth.storeToken(res.token);
        this.toast.success({detail: "SUCCESS", summary:res.message, duration:5000})
        this.router.navigate(['devices'])
      }, (error) => {
        console.error(error);
      });
    } else {
      this.validateAllFields(this.loginForm)
      this.toast.error({detail: "ERROR", summary:"Form is not valid.", duration:5000})
    }
  }

  onSignup(){
    if(this.signupForm.valid){
      this.auth.signup(this.signupForm.value)
      .subscribe((res) => {
        console.log('sent');
        this.signupForm.reset();
        
        this.toast.success({detail: "SUCCESS", summary:res.message, duration:5000})
        this.router.navigate(['devices'])
      }, (error) => {
        console.error(error);
      });
    } else {
      this.validateAllFields(this.signupForm)
      this.toast.error({detail: "ERROR", summary:"Form is not valid.", duration:5000})
    }
  }

  private validateAllFields(formGroup: FormGroup){
    Object.keys(formGroup.controls).forEach(field =>{
      const control = formGroup.get(field);
      if (control instanceof FormControl){
        control.markAsDirty({onlySelf:true});
      } else if (control instanceof FormGroup){
        this.validateAllFields(control)
      }
    })
  }
  
}
