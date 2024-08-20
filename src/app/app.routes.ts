import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { EngagedByComponent } from './components/engaged-by/engaged-by.component';
import { LoginComponent } from './components/login/login.component';
import { MessagesComponent } from './components/messages/messages.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
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
        component: MessagesComponent,
      },
      {
        path: 'thread',
        children: [
          {
            path: '',
            redirectTo: '/home',
            pathMatch: 'full',
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
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
