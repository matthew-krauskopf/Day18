import { Injectable } from '@angular/core';
import { Permission } from '../../models/permission';
import { of } from 'rxjs';
import { BaseAPIService } from './base-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseAPIService {
  endpoint = 'users';

  performLogin(username: string, password: string) {
    return true;
  }

  watchLoginState() {
    return of(Permission.NONE);
  }

  isLoggedIn(perm: Permission) {
    return perm !== Permission.NONE;
  }

  isAdmin(perm: Permission | null) {
    return perm && perm === Permission.ADMIN;
  }
}
