import { Component, EventEmitter, Output, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-search-overlay',
  imports: [],
  templateUrl: './search-overlay.html',
  styleUrl: './search-overlay.css',
})
export class SearchOverlay implements OnInit, AfterViewInit {
  @Output() close = new EventEmitter<void>();
  @ViewChild('searchInput') searchInput!: ElementRef;
  isOpen: boolean = false; /* Added for animation */

  ngOnInit() {
    /* Add the 'open' class after a short delay to trigger the animation */
    setTimeout(() => {
      this.isOpen = true;
    }, 10);
  }

  ngAfterViewInit() {
    // Focus the input after the overlay opens
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 300); // Wait for the animation to complete
  }

  closeSearchOverlay() {
    this.isOpen = false;
    /* Emit the close event after the animation completes */
    setTimeout(() => {
      this.close.emit();
    }, 400); /* Match the transition duration */
  }
}
