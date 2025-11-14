import { Component, OnInit } from '@angular/core';
import { User, UserService } from '../../services/user/user.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-get-all-users',
  imports: [DatePipe],
  templateUrl: './get-all-users.html',
  styleUrl: './get-all-users.css',
})
export class GetAllUsers implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Failed to fetch users', err)
    });
  }
}
