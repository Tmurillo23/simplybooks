import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserResponse} from '../interfaces/user-response';
import {User} from '../interfaces/user';
import {getHeaders} from '../utils/utility';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient)


  findById(userId:string){
    return this.http.get<UserResponse>(`http://localhost:3000/api/v1/users/${userId}`, getHeaders);
  }

  findAll() {
    return this.http.get<UserResponse[]>(`http://localhost:3000/api/v1/users`, getHeaders);
  }

  update(userId:string, user:Partial<User>) {
    return this.http.patch<User>(`http://localhost:3000/api/v1/users/${userId}`, user, getHeaders);
  }

}
