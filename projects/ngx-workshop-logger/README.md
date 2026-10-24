# @tmdjr/ngx-workshop-logger

Shared Angular 21 components for Ngx-Workshop. Requires @angular/core and
@angular/common ^21.2.25.

```sh
npm install @tmdjr/ngx-workshop-logger
```

```ts
import { Component } from '@angular/core';
import { LibraryCard } from '@tmdjr/ngx-workshop-logger';

@Component({
  selector: 'app-example',
  imports: [LibraryCard],
  template: '<ngx-library-card heading="Example"><p>Content</p></ngx-library-card>',
})
export class Example {}
```

LibraryCard exposes a heading input (default: Shared Angular library) and projects
child content. Replace this starter API and its documentation before your first release.
Apache-2.0 licensed.
