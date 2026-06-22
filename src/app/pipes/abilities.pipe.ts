import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abilitiesList',
  standalone: true
})
export class AbilitiesListPipe implements PipeTransform {
  transform(abilities: { ability: { name: string }; is_hidden: boolean }[]): string {
    return abilities.map(a => a.ability.name.replace('-', ' ')).join(', ');
  }
}
