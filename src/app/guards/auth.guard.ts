import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/http/auth.service';
import { of, switchMap } from 'rxjs';
import { Permission } from '../models/permission';
import { AuthFacade } from '../services/auth.facade';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  authFacade: AuthFacade = inject(AuthFacade);

  canActivate() {
    return this.authFacade.user$.pipe(
      switchMap((user: User | null) => {
        if (user) {
          return of(true);
        } else {
          inject(Router).navigate(['/login']);
          return of(false);
        }
      })
    );
  }
}
