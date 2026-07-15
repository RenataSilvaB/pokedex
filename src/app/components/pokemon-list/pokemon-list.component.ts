import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../models/pokemon.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="search-box">
        <input
          type="text"
          [(ngModel)]="searchTerm"
          (keyup.enter)="search()"
          placeholder="Buscar pokémon por nome..."
          class="search-input"
        />
        <button class="search-btn" (click)="search()">🔍</button>
      </div>

      <div class="pokemon-grid" *ngIf="!loading; else loader">
        <a
          *ngFor="let pokemon of pokemons"
          [routerLink]="['/pokemon', pokemon.id]"
          class="pokemon-card"
          [style.background]="getTypeGradient(pokemon.types[0]?.type?.name || 'normal')"
        >
          <span class="pokemon-id">#{{ pokemon.id.toString().padStart(3, '0') }}</span>
          <img
            [src]="pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default"
            [alt]="pokemon.name"
            class="pokemon-img"
            loading="lazy"
          />
          <h3 class="pokemon-name">{{ pokemon.name }}</h3>
          <div class="pokemon-types">
            <span *ngFor="let t of pokemon.types" class="type-badge">
              {{ t.type.name }}
            </span>
          </div>
        </a>
      </div>

      <ng-template #loader>
        <div class="loading">
          <div class="pokeball-spinner"></div>
          <p>Carregando...</p>
        </div>
      </ng-template>

      <div class="pagination" *ngIf="!loading">
        <button class="page-btn" (click)="prevPage()" [disabled]="offset === 0">← Anterior</button>
        <span class="page-info">Página {{ currentPage }}</span>
        <button class="page-btn" (click)="nextPage()">Próxima →</button>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1100px; margin: 2rem auto; padding: 0 1rem; }

    .search-box {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }
    .search-input {
      flex: 1;
      padding: 0.8rem 1.2rem;
      border: 2px solid #e0e0e0;
      border-radius: 25px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }
    .search-input:focus { outline: none; border-color: #e63946; }
    .search-btn {
      padding: 0.8rem 1.2rem;
      border: none;
      border-radius: 25px;
      background: #e63946;
      color: white;
      font-size: 1.1rem;
      cursor: pointer;
    }

    .pokemon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1.2rem;
    }
    .pokemon-card {
      border-radius: 16px;
      padding: 1.2rem;
      text-align: center;
      text-decoration: none;
      color: white;
      transition: transform 0.2s, box-shadow 0.2s;
      position: relative;
      overflow: hidden;
    }
    .pokemon-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    .pokemon-id {
      position: absolute;
      top: 0.8rem;
      right: 1rem;
      font-size: 0.85rem;
      font-weight: 700;
      opacity: 0.6;
    }
    .pokemon-img {
      width: 130px;
      height: 130px;
      object-fit: contain;
      filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
    }
    .pokemon-name {
      text-transform: capitalize;
      margin: 0.5rem 0;
      font-size: 1.1rem;
    }
    .pokemon-types { display: flex; gap: 0.4rem; justify-content: center; }
    .type-badge {
      background: rgba(255,255,255,0.3);
      padding: 0.2rem 0.6rem;
      border-radius: 12px;
      font-size: 0.75rem;
      text-transform: capitalize;
      font-weight: 600;
    }

    .loading { text-align: center; padding: 4rem; color: #888; }
    .pokeball-spinner {
      width: 50px; height: 50px;
      border: 4px solid #e0e0e0;
      border-top-color: #e63946;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1.5rem;
      margin-top: 2rem;
      padding-bottom: 2rem;
    }
    .page-btn {
      padding: 0.6rem 1.2rem;
      border: 2px solid #e63946;
      border-radius: 25px;
      background: white;
      color: #e63946;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .page-btn:hover:not(:disabled) { background: #e63946; color: white; }
    .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .page-info { font-weight: 600; color: #555; }
  `]
})
export class PokemonListComponent implements OnInit {
  pokemons: Pokemon[] = [];
  loading = true;
  offset = 0;
  limit = 20;
  searchTerm = '';

  private typeColors: Record<string, string[]> = {
    fire: ['#F08030', '#DD6610'],
    water: ['#6890F0', '#386CEB'],
    grass: ['#78C850', '#5CA935'],
    electric: ['#F8D030', '#E0B000'],
    ice: ['#98D8D8', '#69C6C6'],
    fighting: ['#C03028', '#9D2721'],
    poison: ['#A040A0', '#803380'],
    ground: ['#E0C068', '#C5A23C'],
    flying: ['#A890F0', '#7E6CC5'],
    psychic: ['#F85888', '#E5355E'],
    bug: ['#A8B820', '#8D9A1B'],
    rock: ['#B8A038', '#9E8A2B'],
    ghost: ['#705898', '#554374'],
    dragon: ['#7038F8', '#4C08EF'],
    dark: ['#705848', '#513F34'],
    steel: ['#B8B8D0', '#9797BA'],
    fairy: ['#EE99AC', '#E46F89'],
    normal: ['#A8A878', '#8A8A59'],
  };

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadPage();
  }

  get currentPage(): number {
    return Math.floor(this.offset / this.limit) + 1;
  }

  getTypeGradient(type: string): string {
    const colors = this.typeColors[type] || ['#68A090', '#49796B'];
    return `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;
  }

  loadPage(): void {
    this.loading = true;
    this.pokemonService.getList(this.offset, this.limit).subscribe(res => {
      const requests = res.results.map((_, i) =>
        this.pokemonService.getById(this.offset + i + 1)
      );
      forkJoin(requests).subscribe(pokemons => {
        this.pokemons = pokemons;
        this.loading = false;
      });
    });
  }

  search(): void {
    if (!this.searchTerm.trim()) {
      this.offset = 0;
      this.loadPage();
      return;
    }
    this.loading = true;
    this.pokemonService.getByName(this.searchTerm.trim()).subscribe({
      next: pokemon => {
        this.pokemons = [pokemon];
        this.loading = false;
      },
      error: () => {
        this.pokemons = [];
        this.loading = false;
      }
    });
  }

  nextPage(): void {
    this.offset += this.limit;
    this.searchTerm = '';
    this.loadPage();
  }

  prevPage(): void {
    this.offset = Math.max(0, this.offset - this.limit);
    this.searchTerm = '';
    this.loadPage();
  }
}
