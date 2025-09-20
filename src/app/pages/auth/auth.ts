import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AuthService, LoginData, RegisterData } from '../../services/auth.service';

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

interface RegisterForm {
  username: string;  // Apenas um campo nome (username)
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

@Component({
  selector: 'auth',
  templateUrl: './auth.html',
  styleUrls: ['./auth.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Auth implements OnInit, OnDestroy {
  
  private destroy$ = new Subject<void>();
  
  currentMode: 'login' | 'register' = 'login';
  isLoading = false;
  showSuccess = false;
  showError = false;
  successTitle = '';
  successMessage = '';
  errorMessage = '';

  loginForm: LoginForm = {
    email: '',
    password: '',
    remember: false
  };

  registerForm: RegisterForm = {
    username: '',  // Apenas username
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  };

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { 
    console.log('Auth Component construído');
    console.log('AuthService injetado:', !!this.authService);
  }

  ngOnInit(): void {
    console.log('Auth Component iniciado');
    
    // Verificar se o usuário já está autenticado
    this.authService.isAuthenticated$.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (isAuthenticated) => {
        console.log('Estado de autenticação:', isAuthenticated);
        if (isAuthenticated) {
          console.log('Usuário já está autenticado');
        }
      },
      error: (error) => {
        console.error('Erro ao verificar autenticação:', error);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  switchMode(mode: 'login' | 'register'): void {
    this.currentMode = mode;
    this.clearForms();
    this.clearMessages();
  }

  onLogin(): void {
    if (!this.validateLoginForm()) return;

    console.log('Iniciando processo de login');
    console.log('Estado antes do login - isLoading:', this.isLoading);
    this.isLoading = true;
    this.clearMessages();
    
    // Força a detecção da mudança
    this.cdr.detectChanges();
    console.log('Loading ativado no login, estado atual:', this.isLoading);

    const loginData: LoginData = {
      email: this.loginForm.email.trim(),
      password: this.loginForm.password
    };

    this.authService.login(loginData).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido, parando loading');
        
        // Para o loading
        this.isLoading = false;
        console.log('Loading parado no login, estado atual:', this.isLoading);
        
        // Força a detecção da mudança
        this.cdr.detectChanges();
        
        // Exibe mensagem de sucesso
        this.successTitle = 'Autenticação realizada com sucesso!';
        this.successMessage = `Bem-vindo de volta! Redirecionando...`;
        this.showSuccess = true;
        
        // Limpa o formulário
        this.clearForms();
        
        // Redireciona para /profile após 1.5 segundos para mostrar a mensagem
        setTimeout(() => {
          this.showSuccess = false;
          console.log('Redirecionando para /profile...');
          this.router.navigate(['/profile']);
        }, 1500);
      },
      error: (error) => {
        console.log('Erro no login, parando loading');
        
        // Para o loading
        this.isLoading = false;
        console.log('Loading parado após erro no login, estado atual:', this.isLoading);
        
        // Força a detecção da mudança
        this.cdr.detectChanges();
        
        this.errorMessage = error.message || 'Erro ao fazer login. Verifique suas credenciais.';
        this.showError = true;
      }
    });
  }

  onRegister(): void {
    console.log('Iniciando processo de registro');

    if (!this.validateRegisterForm()) {
      return;
    }

    console.log('Estado antes do registro - isLoading:', this.isLoading);
    this.isLoading = true;
    this.clearMessages();
    
    // Força a detecção da mudança
    this.cdr.detectChanges();
    console.log('Loading ativado, estado atual:', this.isLoading);

    const registerData: RegisterData = {
      username: this.registerForm.username.trim(),
      email: this.registerForm.email.trim(),
      password: this.registerForm.password
    };

    console.log('Enviando dados de registro:', {
      username: registerData.username,
      email: registerData.email,
      password: '***'
    });

    this.authService.register(registerData).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        console.log('Registro bem-sucedido, parando loading');
        
        // Para o loading
        this.isLoading = false;
        console.log('Loading parado, estado atual:', this.isLoading);
        
        // Força a detecção da mudança
        this.cdr.detectChanges();
        
        // Define mensagem de sucesso
        this.successTitle = 'Conta criada com sucesso!';
        this.successMessage = `Olá ${this.registerForm.username}! Sua conta foi criada.`;
        this.showSuccess = true;
        
        this.clearForms();

        setTimeout(() => {
          this.showSuccess = false;
          this.switchMode('login');
        }, 3000);
      },
      error: (error) => {
        console.log('Erro no registro, parando loading');
        
        // Para o loading
        this.isLoading = false;
        console.log('Loading parado após erro, estado atual:', this.isLoading);
        
        // Força a detecção da mudança
        this.cdr.detectChanges();
        
        this.errorMessage = error.message || 'Erro ao criar conta. Tente novamente.';
        this.showError = true;
      }
    });
  }

  showForgotPassword(): void {
    const email = prompt('Digite seu email para recuperação de senha:');
    if (email) {
      if (!this.isValidEmail(email)) {
        this.errorMessage = 'Por favor, insira um email válido.';
        this.showError = true;
        return;
      }

      // Simulação - em uma implementação real, você criaria um método no AuthService
      this.successTitle = 'Email de recuperação enviado!';
      this.successMessage = `Enviamos instruções para ${email}. Verifique sua caixa de entrada.`;
      this.showSuccess = true;

      setTimeout(() => {
        this.showSuccess = false;
      }, 3000);
    }
  }

  loginWithGoogle(): void {
    this.errorMessage = 'Login com Google será implementado em breve.';
    this.showError = true;
  }

  loginWithGithub(): void {
    this.errorMessage = 'Login com GitHub será implementado em breve.';
    this.showError = true;
  }

  getPasswordStrength(): string {
    const password = this.registerForm.password;
    if (!password) return '';
    
    let strength = 0;
    
    // Critérios de força da senha
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    switch (strength) {
      case 0:
      case 1: return 'weak';
      case 2: return 'fair';
      case 3:
      case 4: return 'good';
      case 5: return 'strong';
      default: return '';
    }
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 'weak': return 'Fraca';
      case 'fair': return 'Regular';
      case 'good': return 'Boa';
      case 'strong': return 'Forte';
      default: return '';
    }
  }

  isRegisterValid(): boolean {
    return !!(
      this.registerForm.username &&
      this.registerForm.email &&
      this.registerForm.password &&
      this.registerForm.confirmPassword &&
      this.registerForm.acceptTerms &&
      this.registerForm.password === this.registerForm.confirmPassword &&
      this.registerForm.password.length >= 6 &&
      this.registerForm.username.length >= 3 &&
      this.isValidEmail(this.registerForm.email) &&
      this.isValidUsername(this.registerForm.username)
    );
  }

  dismissError(): void {
    this.showError = false;
    this.errorMessage = '';
  }

  dismissSuccess(): void {
    this.showSuccess = false;
    this.successTitle = '';
    this.successMessage = '';
  }

  private validateLoginForm(): boolean {
    if (!this.loginForm.email) {
      this.showErrorMessage('Por favor, insira seu email.');
      return false;
    }

    if (!this.loginForm.password) {
      this.showErrorMessage('Por favor, insira sua senha.');
      return false;
    }

    if (!this.isValidEmail(this.loginForm.email)) {
      this.showErrorMessage('Por favor, insira um email válido.');
      return false;
    }

    return true;
  }

  private validateRegisterForm(): boolean {
    if (!this.registerForm.username) {
      this.showErrorMessage('Por favor, insira um nome de usuário.');
      return false;
    }

    if (this.registerForm.username.length < 3) {
      this.showErrorMessage('Nome de usuário deve ter pelo menos 3 caracteres.');
      return false;
    }

    if (this.registerForm.username.length > 20) {
      this.showErrorMessage('Nome de usuário deve ter no máximo 20 caracteres.');
      return false;
    }

    if (!this.isValidUsername(this.registerForm.username)) {
      this.showErrorMessage('Nome de usuário deve conter apenas letras, números e underscore.');
      return false;
    }

    if (!this.registerForm.email) {
      this.showErrorMessage('Por favor, insira seu email.');
      return false;
    }

    if (!this.isValidEmail(this.registerForm.email)) {
      this.showErrorMessage('Por favor, insira um email válido.');
      return false;
    }

    if (!this.registerForm.password) {
      this.showErrorMessage('Por favor, insira uma senha.');
      return false;
    }

    if (this.registerForm.password.length < 6) {
      this.showErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      return false;
    }

    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      this.showErrorMessage('As senhas não coincidem.');
      return false;
    }

    if (!this.registerForm.acceptTerms) {
      this.showErrorMessage('Você deve aceitar os termos de uso.');
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    return usernameRegex.test(username);
  }

  private clearForms(): void {
    this.loginForm = {
      email: '',
      password: '',
      remember: false
    };

    this.registerForm = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    };
  }

  private clearMessages(): void {
    this.showError = false;
    this.showSuccess = false;
    this.errorMessage = '';
    this.successTitle = '';
    this.successMessage = '';
  }

  private showErrorMessage(message: string): void {
    this.errorMessage = message;
    this.showError = true;
  }
}