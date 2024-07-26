import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map } from 'rxjs';
import { User } from '../models/user';
import { AuthFacade } from '../services/facades/auth.facade';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  authFacade: AuthFacade = inject(AuthFacade);
  router: Router = inject(Router);

  canActivate() {
    return this.authFacade.user$.pipe(
      map((user: User | null) => {
        if (user) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
