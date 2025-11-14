import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hero } from '../../components/hero/hero';
import { Categories } from '../../components/categories/categories';
import { ScrollingText } from '../../components/scrolling-text/scrolling-text';
import { Collections } from '../../components/collections/collections';
import { InfoBar } from '../../components/info-bar/info-bar';
import { Testimonials } from '../../components/testimonials/testimonials';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    Hero,
    Categories,
    ScrollingText,
    Collections,
    InfoBar,
    Testimonials
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  // Component logic here
}
