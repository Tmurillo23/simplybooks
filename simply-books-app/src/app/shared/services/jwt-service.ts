import { Injectable } from '@angular/core';
import { JwtPayload } from '../interfaces/jwt-payload';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  TOKEN = 'token'

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN);
  }

  decodeToken(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      //return jwtDecode<JwtPayload>(token);
      return null
    } catch (error) {
      console.error('Not valid token:', error);
      return null;
    }
  }

  isTokenExpired(): boolean {
    const payload = this.decodeToken();
    if (!payload?.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }

  clearToken(): void {
    sessionStorage.removeItem(this.TOKEN);
  }
  
}
