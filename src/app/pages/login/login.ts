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
  loginForm!: FormGroup;
  submitted = false;
  loginError: string = '';

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.loginError = '';
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.userService.login(this.loginForm.value).subscribe({
      next: (response: LoginResponse) => {
        if (response && response.token) {
          const user = {
            _id : response._id,
            firstName: response.firstName,
            lastName: response.lastName,
            email: this.loginForm.value.email,
            role: response.role
          };
          if (this.loginForm.value.rememberMe) {
            localStorage.setItem('token', response.token);
            sessionStorage.removeItem('token');
            localStorage.setItem('currentUser', JSON.stringify(user));
            sessionStorage.removeItem('currentUser');
          } else {
            sessionStorage.setItem('token', response.token);
            localStorage.removeItem('token');
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.removeItem('currentUser');
          }
        }
        // Redirect based on user role
        if (response.role === 'admin') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/products']);
        }
      },
      error: (err: any) => {
        if (err.error && (err.error.error?.toLowerCase().includes('invalid') || err.error.error?.toLowerCase().includes('not found'))) {
          this.loginError = 'Invalid email or password. Please try again.';
        } else {
          this.loginError = 'Login failed. Please try again.';
        }
      }
    });
  }
}
