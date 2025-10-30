import { HttpHeaders } from "@angular/common/http";

export const getHeaders = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      })
    }