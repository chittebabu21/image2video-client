import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getUserByEmail(emailAddress: string) {
    return this.http.get(`${this.baseUrl}/users/user?email_address=${emailAddress}`);
  }

  insertUser(body: { email_address: string; password_hash: string }) {
    return this.http.post(`${this.baseUrl}/users`, body);
  }

  insertOAuthUser(body: { email_address: string; password_hash: string; profile_image_url: string | null; is_verified: number; }) {
    return this.http.post(`${this.baseUrl}/users/oauth_user`, body);
  }

  updateUser(id: number, body: { password_hash?: string; profile_image_url?: string; is_verified?: 0 | 1 }) {
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

  sendVerificationLink(emailAddress: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/verify_email_request`, { email_address: emailAddress });
  }

  sendResetPasswordLink(emailAddress: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/reset_password_request`, { email_address: emailAddress });
  }

  logout() {
    window.localStorage.clear();
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
