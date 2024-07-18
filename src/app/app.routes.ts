import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MessagesComponent } from './components/messages/messages.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { ThreadComponent } from './components/thread/thread.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'messages',
        component: MessagesComponent,
      },
      {
        path: 'profile/:id',
        component: ProfileComponent,
      },
      {
        path: 'thread/:id',
        component: ThreadComponent,
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
