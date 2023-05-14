import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from '../service/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  signupForm!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private toast: NgToastService){}
  ngOnInit(): void{
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  hideShowPassword(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password"
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
        this.toast.error({detail: "ERROR", summary:"Sign up failed", duration:5000})
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
