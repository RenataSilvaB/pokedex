import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <header class="header">
      <div class="header-content">
        <h1 class="logo">
          <span class="pokeball">●</span> Pokédex
        </h1>
      </div>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .header {
      background: linear-gradient(135deg, #e63946 0%, #c1121f 100%);
      padding: 1rem 2rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.15);
    }
    .header-content {
      max-width: 1100px;
      margin: 0 auto;
    }
    .logo {
      color: white;
      font-size: 1.5rem;
      margin: 0;
      font-weight: 700;
    }
    .pokeball {
      display: inline-block;
      width: 28px;
      height: 28px;
      background: white;
      border-radius: 50%;
      text-align: center;
      line-height: 28px;
      color: #e63946;
      font-size: 0.9rem;
      margin-right: 4px;
      vertical-align: middle;
    }
    main {
      min-height: calc(100vh - 65px);
      background: #f8f9fa;
    }
  `]
})
export class AppComponent {}
