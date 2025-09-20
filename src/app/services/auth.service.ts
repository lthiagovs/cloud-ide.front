// auth.service.ts - Versão com headers manuais para testar
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, map, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../shared/enviornment';

// ... interfaces permanecem iguais ...
export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface UserProfile {
  userId: string;
  username: string;
  role: 'admin' | 'user' | 'premium';
}

export interface AdminResponse {
  message: string;
  user: UserProfile;
}

export interface LogoutResponse {
  message: string;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'access_token';
  
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    console.log('AuthService inicializado');
    this.checkInitialAuthState();
  }

  /**
   * Cria headers com token de autorização
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (token) {
      console.log('🔑 Adicionando token manualmente:', token.substring(0, 20) + '...');
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.log('❌ Nenhum token encontrado');
    }
    
    return headers;
  }

  /**
   * Registra um novo usuário no sistema
   */
  register(userData: RegisterData): Observable<UserResponse> {
    console.log('📝 Registrando usuário:', { ...userData, password: '***' });
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post<UserResponse>(`${this.API_URL}/register`, userData, { headers })
      .pipe(
        tap(response => {
          console.log('✅ Registro realizado com sucesso:', response);
        }),
        catchError((error) => {
          console.error('❌ Erro no registro:', error);
          return this.handleError(error);
        })
      );
  }

  /**
   * Realiza login do usuário
   */
  login(credentials: LoginData): Observable<LoginResponse> {
    console.log('🔐 Tentando fazer login para:', credentials.email);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials, { headers })
      .pipe(
        tap(response => {
          console.log('✅ Login realizado, salvando token');
          this.saveToken(response.access_token);
          this.isAuthenticatedSubject.next(true);
        }),
        delay(100),
        tap(() => {
          console.log('👤 Tentando carregar perfil do usuário...');
          this.loadUserProfile();
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Obtém o perfil do usuário logado - COM HEADER MANUAL
   */
  getProfile(): Observable<UserProfile> {
    console.log('👤 Carregando perfil do usuário...');
    
    const headers = this.getAuthHeaders();
    console.log('📡 Headers enviados:', headers.get('Authorization'));
    
    return this.http.get<UserProfile>(`${this.API_URL}/me`, { headers })
      .pipe(
        tap(user => {
          console.log('✅ Perfil do usuário carregado:', user);
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        }),
        catchError((error) => {
          console.error('❌ Erro ao carregar perfil:', error);
          console.error('📡 URL tentada:', `${this.API_URL}/me`);
          console.error('🔑 Token usado:', this.getToken()?.substring(0, 20) + '...');
          
          if (error.status === 401) {
            console.log('🚫 Erro 401 - Token inválido, limpando dados');
            this.clearAuthData();
          }
          return throwError(() => error);
        })
      );
  }

  /**
   * Acessa rota administrativa
   */
  getAdminData(): Observable<AdminResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<AdminResponse>(`${this.API_URL}/admin`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Realiza logout do usuário
   */
  logout(): Observable<LogoutResponse> {
    const headers = this.getAuthHeaders();
    return this.http.post<LogoutResponse>(`${this.API_URL}/logout`, {}, { headers })
      .pipe(
        tap(() => {
          console.log('Logout realizado');
          this.clearAuthData();
        }),
        catchError((error) => {
          console.log('Erro no logout, limpando dados localmente');
          this.clearAuthData();
          return throwError(() => error);
        })
      );
  }

  /**
   * Logout local (sem chamada para API)
   */
  logoutLocal(): void {
    console.log('Logout local realizado');
    this.clearAuthData();
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const isValid = payload.exp > currentTime;
      
      if (!isValid) {
        console.log('Token expirado');
        this.clearAuthData();
        return false;
      }
      
      return true;
    } catch (error) {
      console.log('Erro ao verificar token:', error);
      this.clearAuthData();
      return false;
    }
  }

  hasRole(role: string): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(this.TOKEN_KEY);
      return token;
    }
    return null;
  }

  private saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      console.log('💾 Salvando token no localStorage');
      localStorage.setItem(this.TOKEN_KEY, token);
      console.log('✅ Token salvo com sucesso');
    }
  }

  private removeToken(): void {
    if (typeof window !== 'undefined') {
      console.log('🗑️ Removendo token do localStorage');
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  private clearAuthData(): void {
    this.removeToken();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  private loadUserProfile(): void {
    console.log('🔄 Tentando carregar perfil do usuário...');
    this.getProfile().subscribe({
      next: (profile) => {
        console.log('✅ Perfil carregado com sucesso:', profile);
      },
      error: (error) => {
        console.log('❌ Erro ao carregar perfil:', error);
      }
    });
  }

  private checkInitialAuthState(): void {
    console.log('🔍 Verificando estado inicial de autenticação...');
    if (this.isAuthenticated()) {
      this.isAuthenticatedSubject.next(true);
      this.loadUserProfile();
    } else {
      this.isAuthenticatedSubject.next(false);
    }
  }

  private handleError = (error: HttpErrorResponse) => {
    let errorMessage: string;
    
    console.log('💥 Erro HTTP:', error);
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      const apiError = error.error as ApiError;
      if (apiError && apiError.message) {
        if (Array.isArray(apiError.message)) {
          errorMessage = apiError.message.join(', ');
        } else {
          errorMessage = apiError.message;
        }
      } else {
        switch (error.status) {
          case 400:
            errorMessage = 'Dados inválidos fornecidos';
            break;
          case 401:
            errorMessage = 'Email ou senha incorretos';
            break;
          case 409:
            errorMessage = 'Email ou username já existem';
            break;
          case 500:
            errorMessage = 'Erro interno do servidor';
            break;
          default:
            errorMessage = `Erro ${error.status}: ${error.statusText}`;
        }
      }

      if (error.status === 401) {
        console.log('🚫 Erro 401 - Limpando dados de autenticação');
        this.clearAuthData();
      }
    }

    console.log('📝 Mensagem de erro final:', errorMessage);
    return throwError(() => new Error(errorMessage));
  };
}