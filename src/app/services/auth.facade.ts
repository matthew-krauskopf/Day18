import { inject, Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { AuthService } from './http/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  constructor() {}

  store: StoreService = inject(StoreService);
  auth: AuthService = inject(AuthService);
}
