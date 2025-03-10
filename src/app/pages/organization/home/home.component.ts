import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgIf,
    RouterLink
  ],
  template: `
    <div class="container">
      <h1>Home Page</h1>
      <p>Welcome to the application!</p>
      <a routerLink="/organization/create">Create Company</a>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    h1 {
      color: #333;
    }
  `]
})
export class HomeComponent implements OnInit {
  // Inline template and styles to avoid potential path resolution issues
  
  constructor() {
    console.log('HomeComponent constructed');
  }
  
  ngOnInit(): void {
    console.log('HomeComponent initialized');
  }
}