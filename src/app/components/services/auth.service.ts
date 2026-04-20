import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenResponse } from '../models/token-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private ACCESS = 'access_token';
  private REFRESH = 'refresh_token';

  constructor(private http: HttpClient) {}

  // Método para gravar os tokens no localStorage
  setTokens(access: string, refresh: string) {
    localStorage.setItem(this.ACCESS, access);
    localStorage.setItem(this.REFRESH, refresh);
  }

  getAccessToken(): string {
    return localStorage.getItem(this.ACCESS) || '';
  }

  getRefreshToken(): string {
    return localStorage.getItem(this.REFRESH) || '';
  }

  clearTokens() {
    localStorage.removeItem(this.ACCESS);
    localStorage.removeItem(this.REFRESH);
  }

  refreshToken() {
    const refreshToken = this.getRefreshToken();

    return this.http.post<TokenResponse>(
      '192.168.200.225:9900/rest/api/oauth2/v1/token',
      {},
      {
        params: {
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        },
      },
    );
  }
}
