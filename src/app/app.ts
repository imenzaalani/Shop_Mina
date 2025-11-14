import { RouterOutlet } from '@angular/router';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser, ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  protected readonly title = signal('frontend');
  showHeaderAndFooter: boolean = true;

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showHeaderAndFooter = !(
          event.urlAfterRedirects.includes('/dashboard') || 
          event.urlAfterRedirects.includes('/checkouts')
        );
        
        // Scroll to top on route change
        if (isPlatformBrowser(this.platformId)) {
          // First try the Angular way
          this.viewportScroller.scrollToPosition([0, 0]);
          
          // Then force a native scroll as a fallback
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
          
          // One more fallback with a small delay
          setTimeout(() => {
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
          }, 100);
        }
      }
    });
  }
}
