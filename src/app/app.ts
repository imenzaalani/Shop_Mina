import { RouterOutlet } from '@angular/router';
import { Component, OnInit, Inject, PLATFORM_ID, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser, ViewportScroller, CommonModule } from '@angular/common';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    Header,
    Footer
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
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
