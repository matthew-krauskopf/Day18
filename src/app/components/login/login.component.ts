import { CommonModule, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthFacade } from '../../features/auth/auth.facade';
import { UserFacade } from '../../features/user/user.facade';
import { User } from '../../features/user/user.entity';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  authFacade: AuthFacade = inject(AuthFacade);
  userFacade: UserFacade = inject(UserFacade);
  users$;

  constructor() {
    this.users$ = this.userFacade.users$;
  }

  pattern: string = '\\w{5,}';

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('mattyk17', [
      Validators.required,
      Validators.pattern(this.pattern),
    ]),
    password: new FormControl('pass123', [
      Validators.required,
      Validators.pattern(this.pattern),
    ]),
  });

  performLogin(users: User[]) {
    this.authFacade.performLogin(
      this.loginForm.value.username,
      this.loginForm.value.password,
      users.find((u) => u.username == this.loginForm.value.username)
    );
  }
}
