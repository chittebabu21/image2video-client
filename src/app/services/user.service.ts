import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { JsonResponse } from '../interfaces/json-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.baseUrl;
  private uploadsUrl = environment.uploadsUrl;

  constructor(private http: HttpClient) { }

  getUserById(id: number): Observable<User> {
    return this.http.get<JsonResponse>(`${this.baseUrl}/users/${id}`).pipe(
      map(res => {
        res.data.created_on = new Date(res.data.created_on);
        res.data.profile_image_url = `${this.uploadsUrl}/uploads/images/${res.data.profile_image_url}` || null;

        if (res.data.is_verified !== 0 && res.data.is_verified !== 1) {
          throw new Error('Invalid value for verification field...');
        }

        return res.data;
      })
    );
  }

  getUserByEmail(emailAddress: string) {
    return this.http.get(`${this.baseUrl}/users/user?email_address=${emailAddress}`);
  }

  insertUser(body: { email_address: string; password_hash: string }) {
    return this.http.post(`${this.baseUrl}/users`, body);
  }

  insertOAuthUser(body: { email_address: string; password_hash: string; profile_image_url: string | null; is_verified: number; }) {
    return this.http.post(`${this.baseUrl}/users/oauth_user`, body);
  }

  updateUser(id: number, body: any) { // { password_hash?: string; profile_image_url?: string; is_verified?: 0 | 1 }
    const token = this.get('token');
    const cleanedToken = token?.replace(/^['"](.*)['"]$/, '$1');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${cleanedToken}`
    });

    return this.http.put(`${this.baseUrl}/users/${id}`, body, { headers: headers });
  }

  login(body: { email_address: string; password_hash: string; }) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const payload = {
      email_address: body.email_address,
      password_hash: body.password_hash
    }

    return this.http.post(`${this.baseUrl}/users/login`, payload, { headers: headers });
  }

  validatePassword(id: number, password_hash: string) {
    const token = this.get('token');
    const cleanedToken = token?.replace(/^['"](.*)['"]$/, '$1');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${cleanedToken}`
    });

    return this.http.post(`${this.baseUrl}/users/validate-password/${id}`, { password_hash: password_hash }, { headers: headers });
  }

  sendVerificationLink(emailAddress: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/verify_email_request`, { email_address: emailAddress });
  }

  sendResetPasswordLink(emailAddress: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/reset_password_request`, { email_address: emailAddress });
  }

  logout() {
    localStorage.clear();
  }

  set(key: string, value: string | number) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  get(key: string): string | null {
    const storedValue = localStorage.getItem(key);

    if (storedValue) {
      return storedValue;
    } else {
      return null;
    }
  }
}
