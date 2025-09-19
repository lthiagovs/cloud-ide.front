import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Editor } from './pages/editor/editor';
import { Auth } from './pages/auth/auth';
import { Profile } from './pages/profile/profile';

export const routes: Routes = [
  {
    path: 'home',
    component: Home
  },
  {
    path: 'editor',
    component: Editor
  },
  {
    path: 'authentication',
    component: Auth
  },
  {
    path: 'profile',
    component: Profile
  },
];
