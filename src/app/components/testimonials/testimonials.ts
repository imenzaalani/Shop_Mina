import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-testimonials',
  imports: [],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css',
})
export class Testimonials implements OnInit {
  @ViewChild('reviewsGrid') reviewsGrid!: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  scroll(direction: 'left' | 'right'): void {
    const scrollContainer = this.reviewsGrid.nativeElement;
    const scrollAmount = 350; // Adjust this value based on card width + gap

    if (direction === 'left') {
      scrollContainer.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    } else {
      scrollContainer.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }
}
