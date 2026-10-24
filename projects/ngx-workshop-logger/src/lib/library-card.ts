import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ngx-library-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="library-card" [attr.aria-label]="heading()">
      <h2 class="library-card__heading">{{ heading() }}</h2>
      <ng-content />
    </section>
  `,
  styles: `
    :host { display: block; }
    .library-card { padding: 1.5rem; border: 1px solid currentColor; border-radius: .75rem; }
    .library-card__heading { margin: 0 0 1rem; font: inherit; font-weight: 600; }
  `,
})
export class LibraryCard {
  readonly heading = input('Shared Angular library');
}
