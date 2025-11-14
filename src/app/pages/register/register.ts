import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
  providers: [UserService]
})
export class Register implements OnInit {
  private userService = inject(UserService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  
  registerForm = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  
  submitted = false;
  loginError: string = '';

  ngOnInit(): void {
    // Initialization logic if needed
  }

  onSubmit(): void {
    this.submitted = true;
    this.loginError = '';
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    
    // Get form values with non-null assertion since we've already validated the form
    const { firstName, lastName, email, password } = this.registerForm.getRawValue();
    
    // Build the user object with proper type safety
    const user = {
      firstName: firstName!,
      lastName: lastName!,
      email: email!,
      password: password!,
      role: 'client' as const // Default role for new registrations
    };
    
    this.userService.register(user).subscribe({
      next: () => {
        // Navigate to login page on successful registration
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.error && (err.error.error?.toLowerCase().includes('email') || err.error.error?.toLowerCase().includes('duplicate'))) {
          this.loginError = 'This email address is already registered. Please use a different email.';
        } else {
          this.loginError = 'Registration failed. Please try again.';
        }
      }
    });
  }
}
