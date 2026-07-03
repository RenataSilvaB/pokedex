import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../models/pokemon.model';
import { AbilitiesListPipe } from '../../pipes/abilities.pipe';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, AbilitiesListPipe],
  template: `
    <div class="container" *ngIf="pokemon; else loader">
      <a routerLink="/" class="back-link">← Voltar</a>

      <div class="detail-card" [style.background]="getTypeGradient(pokemon.types[0]?.type?.name)">
        <div class="detail-header">
          <div>
            <h1 class="detail-name">{{ pokemon.name }}</h1>
            <div class="detail-types">
              <span *ngFor="let t of pokemon.types" class="type-badge">{{ t.type.name }}</span>
            </div>
          </div>
          <span class="detail-id">#{{ pokemon.id.toString().padStart(3, '0') }}</span>
        </div>

        <img
          [src]="pokemon.sprites.other['official-artwork'].front_default"
          [alt]="pokemon.name"
          class="detail-img"
        />
      </div>

      <div class="info-card">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Altura</span>
            <span class="info-value">{{ pokemon.height / 10 }} m</span>
          </div>
          <div class="info-item">
            <span class="info-label">Peso</span>
            <span class="info-value">{{ pokemon.weight / 10 }} kg</span>
          </div>
          <div class="info-item">
            <span class="info-label">Habilidades</span>
            <span class="info-value">
              {{ pokemon.abilities | abilitiesList }}
            </span>
          </div>
        </div>

        <h3 class="stats-title">Estatísticas Base</h3>
        <div class="stats">
          <div *ngFor="let stat of pokemon.stats" class="stat-row">
            <span class="stat-name">{{ formatStatName(stat.stat.name) }}</span>
            <span class="stat-value">{{ stat.base_stat }}</span>
            <div class="stat-bar-bg">
              <div
                class="stat-bar"
                [style.width.%]="(stat.base_stat / 255) * 100"
                [style.background]="stat.base_stat >= 80 ? '#48bb78' : stat.base_stat >= 50 ? '#ed8936' : '#e53e3e'"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loader>
      <div class="loading">
        <div class="pokeball-spinner"></div>
        <p>Carregando...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .container { max-width: 600px; margin: 1rem auto; padding: 0 1rem 2rem; }
    .back-link {
      display: inline-block;
      margin-bottom: 1rem;
      color: #e63946;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.95rem;
    }
    .detail-card {
      border-radius: 20px;
      padding: 1.5rem;
      color: white;
      position: relative;
      overflow: hidden;
      text-align: center;
    }
    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      text-align: left;
    }
    .detail-name {
      text-transform: capitalize;
      font-size: 1.8rem;
      margin: 0 0 0.5rem;
    }
    .detail-id { font-size: 1.2rem; font-weight: 700; opacity: 0.6; }
    .detail-types { display: flex; gap: 0.4rem; }
    .type-badge {
      background: rgba(255,255,255,0.3);
      padding: 0.3rem 0.8rem;
      border-radius: 14px;
      font-size: 0.8rem;
      text-transform: capitalize;
      font-weight: 600;
    }
    .detail-img {
      width: 220px;
      height: 220px;
      object-fit: contain;
      filter: drop-shadow(0 6px 12px rgba(0,0,0,0.3));
      margin: 1rem 0;
    }

    .info-card {
      background: white;
      border-radius: 20px;
      padding: 1.5rem;
      margin-top: -2rem;
      position: relative;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding-top: 1rem;
    }
    .info-item { text-align: center; }
    .info-label { display: block; font-size: 0.8rem; color: #888; margin-bottom: 0.3rem; }
    .info-value { font-weight: 600; color: #333; text-transform: capitalize; font-size: 0.9rem; }

    .stats-title { margin-bottom: 1rem; color: #333; }
    .stats { display: flex; flex-direction: column; gap: 0.6rem; }
    .stat-row { display: grid; grid-template-columns: 100px 40px 1fr; align-items: center; gap: 0.5rem; }
    .stat-name { font-size: 0.85rem; color: #666; text-transform: capitalize; }
    .stat-value { font-weight: 700; font-size: 0.85rem; color: #333; text-align: right; }
    .stat-bar-bg {
      height: 8px;
      background: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;
    }
    .stat-bar {
      height: 100%;
      border-radius: 4px;
      transition: width 0.6s ease;
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
  `]
})
export class PokemonDetailComponent implements OnInit {
  pokemon: Pokemon | null = null;

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

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.pokemonService.getById(id).subscribe(p => this.pokemon = p);
  }

  getTypeGradient(type: string): string {
    const colors = this.typeColors[type] || ['#68A090', '#49796B'];
    return `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;
  }

  formatStatName(name: string): string {
    const map: Record<string, string> = {
      hp: 'HP',
      attack: 'Ataque',
      defense: 'Defesa',
      'special-attack': 'Atq. Esp.',
      'special-defense': 'Def. Esp.',
      speed: 'Velocidade'
    };
    return map[name] || name;
  }
}
