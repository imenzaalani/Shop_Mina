import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:3000/api/users'; // Your backend user API endpoint

  constructor(private http: HttpClient) {}

  // Register a new user
  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  // Login user and get _id, token, firstName, lastName, and role
  login(credentials: { email: string; password: string }): Observable<{_id: string, token: string; firstName: string; lastName: string; role: string }> {
    return this.http.post<{ _id: string, token: string; firstName: string; lastName: string; role: string }>(`${this.apiUrl}/login`, credentials);
  }

  // Get user profile by id (or token-based)
  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Update user info
  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // Delete user
  deleteUser(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  // Get all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token') || !!sessionStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }
}
