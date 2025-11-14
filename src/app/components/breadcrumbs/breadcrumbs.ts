import { Component, OnInit, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Breadcrumb { 
  label: string; 
  link?: string; 
}

@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterLink],
  templateUrl: './breadcrumbs.html',
  styleUrl: './breadcrumbs.css',
})
export class Breadcrumbs {
  @Input() items: Breadcrumb[] = [];
}