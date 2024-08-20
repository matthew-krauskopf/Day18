import { Routes } from '@angular/router';
import { EngagedByComponent } from './components/engaged-by/engaged-by.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MessagesComponent } from './components/messages/messages.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ThreadComponent } from './components/thread/thread.component';
import { AuthGuard } from './guards/auth.guard';

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
        path: '',
        redirectTo: 'messages',
        pathMatch: 'full',
      },
      {
        path: 'messages',
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: MessagesComponent,
          },
          {
            path: ':id',
            children: [
              {
                path: '',
                pathMatch: 'full',
                component: ThreadComponent,
              },
              {
                path: 'likedBy',
                component: EngagedByComponent,
              },
              {
                path: 'retwattedBy',
                component: EngagedByComponent,
              },
            ],
          },
        ],
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'messages',
          },
          {
            path: ':id',
            component: ProfileComponent,
          },
        ],
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
