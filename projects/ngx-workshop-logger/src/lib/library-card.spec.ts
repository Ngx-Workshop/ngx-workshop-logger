import { TestBed } from '@angular/core/testing';
import { LibraryCard } from './library-card';

describe('LibraryCard public input', () => {
  it('renders input changes in its heading and accessible label', async () => {
    await TestBed.configureTestingModule({ imports: [LibraryCard] }).compileComponents();
    const fixture = TestBed.createComponent(LibraryCard);
    fixture.componentRef.setInput('heading', 'Account settings');
    await fixture.whenStable();
    const section: HTMLElement = fixture.nativeElement.querySelector('section');
    expect(section.getAttribute('aria-label')).toBe('Account settings');
    expect(section.querySelector('h2')?.textContent).toBe('Account settings');
    fixture.componentRef.setInput('heading', 'Preferences');
    await fixture.whenStable();
    expect(section.getAttribute('aria-label')).toBe('Preferences');
    expect(section.querySelector('h2')?.textContent).toBe('Preferences');
  });
});
