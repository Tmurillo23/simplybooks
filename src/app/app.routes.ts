import { Routes } from '@angular/router';
import { Login } from './features/pages/login/login';
import { SignUp } from './features/pages/sign-up/sign-up';
import { Home } from './features/pages/home/home';
import { Profile } from './features/pages/profile/profile';
import { Upload } from './features/pages/upload/upload';
import { Collections } from './features/pages/collections/collections';
import { Borrows } from './features/pages/borrows/borrows';
import { Book } from './features/pages/book/book';
import { ResetPassword } from './features/pages/reset-password/reset-password';
import {UpdateBook} from './features/pages/update-book/update-book';

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
    path:"reset-password",
    component:ResetPassword,
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
    path:"upload",
    component:Upload,
    pathMatch:"full"
  },
  {
    path:"collections",
    component:Collections,
    pathMatch:"full"
  },
  {
    path:"borrows",
    component:Borrows,
    pathMatch:"full"
  },
  {
    path:"book/:id",
    component:Book,
    pathMatch:"full"
  },
  {
    path:"editbook/:id",
    component:UpdateBook,
    pathMatch:"full"
  },
  {
    path:"**",
    redirectTo:""
  }
];
