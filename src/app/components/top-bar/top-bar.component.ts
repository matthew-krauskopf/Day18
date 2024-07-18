import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Permission } from '../../models/permission';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthFacade } from '../../services/auth.facade';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
})
export class TopBarComponent {
  router: Router = inject(Router);
  authFacade: AuthFacade = inject(AuthFacade);
  loggedIn: boolean = false;

  constructor() {
    this.authFacade.user$.pipe(takeUntilDestroyed()).subscribe((user) => {
      if (!user) {
        this.router.navigate(['login']);
      }
    });
  }

  goHome() {
    this.router.navigate(['home']);
  }
}
