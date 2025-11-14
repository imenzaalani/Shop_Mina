import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface LoginResponse {
  token: string;
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  role: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  loginError: string = '';

  constructor(
    private fb: FormBuilder, 
    private userService: UserService, 
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    if (this.userService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.loginError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.userService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        if (response && response.token) {
          const user = {
            _id: response._id,
            firstName: response.firstName,
            lastName: response.lastName,
            email: response.email || this.loginForm.value.email,
            role: response.role
          };

          const storage = this.loginForm.value.rememberMe ? localStorage : sessionStorage;
          storage.setItem('token', response.token);
          storage.setItem('currentUser', JSON.stringify(user));

          // Clear the other storage
          const otherStorage = this.loginForm.value.rememberMe ? sessionStorage : localStorage;
          otherStorage.removeItem('token');
          otherStorage.removeItem('currentUser');
          if (user.role === 'admin') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/products']);
          }
        } else {
          this.loginError = 'Invalid response from server. Please try again.';
        }
      },
      error: (err: any) => {
        if (err.status === 401) {
          this.loginError = 'Invalid email or password. Please try again.';
        } else if (err.status === 0) {
          this.loginError = 'Unable to connect to the server. Please check your internet connection.';
        } else {
          this.loginError = 'Login failed. Please try again.';
        }
      },
      complete: () => {}
    });
  }

  // Helper to easily access form controls in the template
  get f() { 
    return this.loginForm.controls; 
  }
}
