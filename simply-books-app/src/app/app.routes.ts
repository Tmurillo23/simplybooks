import { Routes } from '@angular/router';
import { Login } from './features/pages/login/login';
import { SignUp } from './features/pages/sign-up/sign-up';
import { Home } from './features/pages/home/home';
import { Profile } from './features/pages/profile/profile';
import { Upload } from './features/pages/upload/upload';
import { Collections } from './features/pages/collections/collections';
import { Loans } from './features/pages/loans/loans';
import { Book } from './features/pages/book/book';
import { ResetPassword } from './features/pages/reset-password/reset-password';
import {UpdateBook} from './features/pages/update-book/update-book';
import {UpdateProfile} from './features/pages/update-profile/update-profile';
import {CollectionDetail} from './features/pages/collection-detail/collection-detail';
import {CreateCollection} from './features/pages/create-collection/create-collection';
import {EditCollection} from './features/pages/edit-collection/edit-collection';
import {LoanHistory} from './features/pages/loan-history/loan-history';
import {Reviews} from './features/pages/reviews/reviews';
import {CreateReview} from './features/pages/create-review/create-review';
import {ReviewDetail} from './features/pages/review-detail/review-detail';
import {EditReview} from './features/pages/edit-review/edit-review';
import {Followers} from './features/pages/followers/followers';
import {Following} from './features/pages/following/following';
import {SocialFeed} from './features/pages/social-feed/social-feed';

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
    path:"update-profile",
    component:UpdateProfile,
    pathMatch:"full"
  },
  {
    path:"followers",
    component:Followers,
    pathMatch:"full"
  },
  {
    path:"following",
    component:Following,
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
    path:"collection/:id",
    component:CollectionDetail,
    pathMatch:"full"
  },
  {
    path:"create-collection",
    component:CreateCollection,
    pathMatch:"full"
  },
  {
    path:"edit-collection/:id",
    component:EditCollection,
    pathMatch:"full"
  },

  {
    path:"loans",
    component:Loans,
    pathMatch:"full"
  },
  {
    path:"loan-history",
    component:LoanHistory,
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
    path:"reviews",
    component:Reviews,
    pathMatch:"full"
  },
  {
    path:"create-review",
    component:CreateReview,
    pathMatch:"full"
  },
  {
    path:"review/:id",
    component:ReviewDetail,
    pathMatch:"full"
  },
  {
    path:"edit-review/:id",
    component:EditReview,
    pathMatch:"full"
  },
  {
    path:"feed",
    component:SocialFeed,
    pathMatch:"full"
  },
  {
    path:"**",
    redirectTo:""
  }
];
