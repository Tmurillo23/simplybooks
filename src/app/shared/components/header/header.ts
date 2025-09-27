import { Component, inject } from "@angular/core";
import { Auth } from "../../services/auth";

@Component({
  selector:'app-header',
  imports: [],
  templateUrl:'./header.html',
  styleUrl:'./header.css'
})
export class Header {
  authService = inject(Auth);
  isLogged = this.authService.isLogged;

}
