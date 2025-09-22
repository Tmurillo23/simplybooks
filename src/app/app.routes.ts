import { Routes } from '@angular/router';
import { Login } from './features/pages/login/login';
import { SignUp } from './features/pages/sign-up/sign-up';
import { Home } from './features/pages/home/home';
import {Profile} from './features/pages/profile/profile';

export const routes: Routes = [
  {
    path:"",
    component:Login,
    pathMatch:"full"
  },
  {
    path:"sign-up",
    component:SignUp,
    pathMatch:"full"
  },
  {
    path:"home",
    component:Home,
    pathMatch:"full"
  },
  {
    path:"profile",
    component:Profile,
    pathMatch:"full"
  },
  {
    path:"**",
    redirectTo:""
  }
];
