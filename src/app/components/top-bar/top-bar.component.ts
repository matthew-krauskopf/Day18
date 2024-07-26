import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthFacade } from '../../services/facades/auth.facade';

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

  goHome() {
    this.router.navigate(['home']);
  }
}
