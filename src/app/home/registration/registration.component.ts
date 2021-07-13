import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registerForm: FormGroup = new FormGroup({});

  maxDate!: Date;

  validationErrors: any[] = [];

  constructor(private router: Router, private accountService: AccountService, private toastr: ToastrService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm();

    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      gender: ['male', [Validators.required]],
      username: ['', [Validators.required]],
      knownAs: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      country: ['', Validators.required],
      city: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      confirmPassword: ['', [Validators.required]],

    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup): void {
    const password = g.controls.password;
    const confirmPassword = g.controls.confirmPassword;
 
    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({isMatching: true});
    } else if ((password.value === "" && confirmPassword.value === "")) {
      confirmPassword.setErrors({required: true});
    } else {
      confirmPassword.setErrors(null);
    }
  }

  onSubmit() {
    this.accountService.register(this.registerForm.value).subscribe(response => {
      this.router.navigate(['./members']);
    }, error => {
      this.validationErrors = error;
    });
  }

  onCancel() {
    this.router.navigate(['/']);
  }

}
