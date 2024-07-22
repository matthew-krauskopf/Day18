import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { StoreService } from '../../services/store.service';
import { AuthFacade } from '../../services/auth.facade';

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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  authFacade: AuthFacade = inject(AuthFacade);
  storeService: StoreService = inject(StoreService);
  router: Router = inject(Router);
  snackbar: MatSnackBar = inject(MatSnackBar);

  pattern: string = '\\w{5,}';

  loginSuccess$;

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

  constructor() {
    this.loginSuccess$ = this.authFacade.watchLoginSuccess();
  }

  ngOnInit(): void {
    this.loginSuccess$.subscribe((loginSuccess) => {
      if (loginSuccess) {
        this.router.navigate(['home', 'messages']);
      } else if (loginSuccess == false) {
        this.snackbar.open('Invalid Login Credentials', 'Close', {
          duration: 2000,
        });
      } // If null, do nothing
    });
  }

  performLogin() {
    this.authFacade.performLogin(
      this.loginForm.value.username,
      this.loginForm.value.password
    );
  }
}
