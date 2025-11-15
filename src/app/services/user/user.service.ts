import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// Define a User interface (adjust fields as needed)
export interface User {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;  // Usually not sent back from server
  token?: string;     // For auth (if you implement JWT)
  role?: string;      // User role (client/admin)
  createdAt?: string; // Timestamp from backend
  updatedAt?: string; // Timestamp from backend
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/users`;
  
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'currentUser';

  constructor(private http: HttpClient) {}

  // Register a new user
  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user).pipe(
      tap(response => response),
      catchError(this.handleError)
    );
  }

  // Login user and get user details with token
  login(credentials: { email: string; password: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(`${this.apiUrl}/login`, credentials, { headers }).pipe(
      tap(response => {
        if (!response || !response.token) {
          throw new Error('Invalid response from server');
        }
      }),
      catchError(this.handleError)
    );
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
    return !!token;
  }

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem(this.USER_KEY) || sessionStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Logout
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    sessionStorage.removeItem(this.USER_KEY);
  }

  // Get user profile by id (or token-based)
  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Update user info
  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user).pipe(
      catchError(this.handleError)
    );
  }

  // Delete user
  deleteUser(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    console.group('Error in UserService');
    console.error('Error status:', error.status);
    console.error('Error message:', error.message);
    console.error('Error details:', error.error);
    console.groupEnd();

    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server error (${error.status}): ${error.message}`;
      if (error.error && error.error.error) {
        errorMessage += ` - ${error.error.error}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }

  // Get all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`).pipe(
      catchError(this.handleError)
    );
  }
}
