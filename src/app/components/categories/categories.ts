import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  @ViewChild('categoriesScroll') categoriesScroll!: ElementRef;

  categories = [
    { image: 'assets/categories/men.jpg', alt: 'Mens', label: 'MENS' },
    { image: 'assets/categories/women.jpg', alt: 'Womens', label: 'WOMENS' },
    { image: 'assets/categories/jackets.jpg', alt: 'Outwears', label: 'Outwears' },
    { image: 'assets/categories/tops.jpg', alt: 'Tops', label: 'TOPS' },
    { image: 'assets/categories/pants.jpg', alt: 'Bottoms', label: 'BOTTOMS' },
    { image: 'assets/categories/shoes.jpg', alt: 'Shoes', label: 'Shoes' },
    { image: 'assets/categories/accessories.jpg', alt: 'Accessories', label: 'Accessories' },
    
    // Add more categories here as needed
  ];

  constructor(private router: Router) {}

  onCardClick(category: string) {
    if (category === 'MENS') {
      this.router.navigate(['/products'], { queryParams: { gender: 'men' } });
    } else if (category === 'WOMENS') {
      this.router.navigate(['/products'], { queryParams: { gender: 'women' } });
    } else {
      this.router.navigate(['/products'], { queryParams: { category: category.toLowerCase() } });
    }
  }

  scroll(direction: 'left' | 'right') {
    const container = this.categoriesScroll.nativeElement;
    const scrollAmount = 300; // Adjust scroll distance as needed

    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }
}
