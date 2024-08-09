import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthFacade } from '../features/auth/auth.facade';
import { User } from '../features/user/user.entity';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  authFacade: AuthFacade = inject(AuthFacade);
  router: Router = inject(Router);

  canActivate() {
    return this.authFacade.user$.pipe(
      map((user: User | null) => {
        if (user !== undefined) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
