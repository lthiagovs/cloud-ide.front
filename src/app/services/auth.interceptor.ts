import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('🔍 Interceptando requisição:', req.url);
   
    // Obter o token
    const token = this.authService.getToken();
   
    let authReq = req;
   
    // Se há token, adicionar no header Authorization
    if (token) {
      console.log('🔑 Adicionando token JWT na requisição');
      console.log('🔑 Token (primeiros 20 chars):', token.substring(0, 20) + '...');
      
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      
      console.log('🔑 Headers da requisição:', authReq.headers.get('Authorization'));
    } else {
      console.log('❌ Nenhum token encontrado para adicionar na requisição');
    }

    // Processar requisição e tratar erros
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('💥 Erro interceptado:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message
        });
       
        // Se erro 401 (Unauthorized), limpar dados de autenticação
        if (error.status === 401) {
          console.log('🚫 Erro 401 - Token inválido ou expirado, fazendo logout local');
          this.authService.logoutLocal();
        }
       
        // Repassar o erro
        return throwError(() => error);
      })
    );
  }
}