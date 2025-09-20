import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService, UserProfile } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
  standalone: true,
  imports: [CommonModule]
})
export class Header implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
 
  isAuthenticated = false;
  currentUser: UserProfile | null = null;
  showUserMenu = false;
  isLoggingOut = false;
  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';
  
  @Output() navigate = new EventEmitter<string>();
  @Output() showAuth = new EventEmitter<'login' | 'register'>();
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    console.log('🏠 Header Component construído');
    console.log('🏠 AuthService injetado no header:', !!this.authService);
  }
  
  ngOnInit() {
    // Observar estado de autenticação
    this.authService.isAuthenticated$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });
    
    // Observar usuário atual
    this.authService.currentUser$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      this.currentUser = user;
    });
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  onAuth() {
    console.log('🔄 Redirecionando para página de autenticação');
    this.router.navigate(['/authentication']);
  }
  
  onLogout() {
    if (this.isLoggingOut) return;
   
    this.isLoggingOut = true;
    this.showUserMenu = false;
    
    this.authService.logout().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.isLoggingOut = false;
        // Redirecionar para /authentication após logout
        console.log('🔄 Redirecionando para /authentication após logout');
        this.router.navigate(['/authentication']);
      },
      error: () => {
        // Mesmo com erro, limpar dados locais
        this.authService.logoutLocal();
        this.isLoggingOut = false;
        // Redirecionar mesmo com erro
        console.log('🔄 Redirecionando para /authentication após erro no logout');
        this.router.navigate(['/authentication']);
      }
    });
  }
  
  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }
  
  closeUserMenu() {
    this.showUserMenu = false;
  }
  
  go(to: string) {
    console.log(`🔄 Redirecionando para: ${to}`);
    this.router.navigate([`/${to}`]);
    this.closeUserMenu();
  }
  
  getUserInitials(): string {
    if (!this.currentUser?.username) return 'U';
   
    // Usar username em vez de userId para as iniciais
    const name = this.currentUser.username;
    const words = name.split(' ');
   
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    } else if (words[0]) {
      return words[0].substring(0, 2).toUpperCase();
    }
   
    return 'U';
  }
  
  getUserDisplayName(): string {
    if (!this.currentUser?.username) return 'Usuário';
    // Retornar username em vez de userId
    return this.currentUser.username;
  }
  
  getRoleBadge(): string {
    if (!this.currentUser?.role) return '';
   
    switch (this.currentUser.role) {
      case 'admin': return 'Admin';
      case 'premium': return 'Pro';
      case 'user': return '';
      default: return '';
    }
  }
  
  getRoleColor(): string {
    if (!this.currentUser?.role) return '';
   
    switch (this.currentUser.role) {
      case 'admin': return 'role-admin';
      case 'premium': return 'role-premium';
      default: return '';
    }
  }
  
  // Fechar menu ao clicar fora
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-container')) {
      this.closeUserMenu();
    }
  }
}