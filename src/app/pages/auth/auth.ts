import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

interface RegisterForm {
  firstName: string;
  lastName: string;
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
export class Auth implements OnInit {
  
  currentMode: 'login' | 'register' = 'login';
  isLoading = false;
  showSuccess = false;
  successTitle = '';
  successMessage = '';

  loginForm: LoginForm = {
    email: '',
    password: '',
    remember: false
  };

  registerForm: RegisterForm = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  };

  constructor() { }

  ngOnInit(): void {
    // Inicialização do componente
  }

  switchMode(mode: 'login' | 'register'): void {
    this.currentMode = mode;
    this.clearForms();
  }

  onLogin(): void {
    if (!this.validateLoginForm()) {
      return;
    }

    this.isLoading = true;

    // Simular chamada de API
    setTimeout(() => {
      this.isLoading = false;
      this.successTitle = 'Login realizado com sucesso!';
      this.successMessage = `Bem-vindo de volta, ${this.loginForm.email}! Redirecionando para o editor...`;
      this.showSuccess = true;

      // Simular redirecionamento após 3 segundos
      setTimeout(() => {
        this.showSuccess = false;
        console.log('Redirecionando para o dashboard...');
        // Aqui seria feito o redirecionamento real
      }, 3000);

    }, 2000);
  }

  onRegister(): void {
    if (!this.validateRegisterForm()) {
      return;
    }

    this.isLoading = true;

    // Simular chamada de API
    setTimeout(() => {
      this.isLoading = false;
      this.successTitle = 'Conta criada com sucesso!';
      this.successMessage = `Olá ${this.registerForm.firstName}! Sua conta foi criada. Enviamos um email de confirmação para ${this.registerForm.email}`;
      this.showSuccess = true;

      // Simular redirecionamento após 4 segundos
      setTimeout(() => {
        this.showSuccess = false;
        this.switchMode('login');
        console.log('Conta criada, mudando para login...');
      }, 4000);

    }, 2500);
  }

  showForgotPassword(): void {
    // Simular modal de recuperação de senha
    const email = prompt('Digite seu email para recuperação de senha:');
    if (email) {
      this.successTitle = 'Email de recuperação enviado!';
      this.successMessage = `Enviamos instruções para ${email}. Verifique sua caixa de entrada.`;
      this.showSuccess = true;

      setTimeout(() => {
        this.showSuccess = false;
      }, 3000);
    }
  }

  loginWithGoogle(): void {
    this.isLoading = true;
    
    setTimeout(() => {
      this.isLoading = false;
      this.successTitle = 'Login com Google realizado!';
      this.successMessage = 'Autenticação com Google bem-sucedida. Configurando sua conta...';
      this.showSuccess = true;

      setTimeout(() => {
        this.showSuccess = false;
      }, 3000);
    }, 1500);
  }

  loginWithGithub(): void {
    this.isLoading = true;
    
    setTimeout(() => {
      this.isLoading = false;
      this.successTitle = 'Login com GitHub realizado!';
      this.successMessage = 'Autenticação com GitHub bem-sucedida. Importando seus repositórios...';
      this.showSuccess = true;

      setTimeout(() => {
        this.showSuccess = false;
      }, 3000);
    }, 1500);
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
      this.registerForm.firstName &&
      this.registerForm.lastName &&
      this.registerForm.email &&
      this.registerForm.password &&
      this.registerForm.confirmPassword &&
      this.registerForm.acceptTerms &&
      this.registerForm.password === this.registerForm.confirmPassword &&
      this.registerForm.password.length >= 6
    );
  }

  private validateLoginForm(): boolean {
    if (!this.loginForm.email) {
      alert('Por favor, insira seu email.');
      return false;
    }

    if (!this.loginForm.password) {
      alert('Por favor, insira sua senha.');
      return false;
    }

    if (!this.isValidEmail(this.loginForm.email)) {
      alert('Por favor, insira um email válido.');
      return false;
    }

    return true;
  }

  private validateRegisterForm(): boolean {
    if (!this.registerForm.firstName) {
      alert('Por favor, insira seu nome.');
      return false;
    }

    if (!this.registerForm.lastName) {
      alert('Por favor, insira seu sobrenome.');
      return false;
    }

    if (!this.registerForm.email) {
      alert('Por favor, insira seu email.');
      return false;
    }

    if (!this.isValidEmail(this.registerForm.email)) {
      alert('Por favor, insira um email válido.');
      return false;
    }

    if (!this.registerForm.password) {
      alert('Por favor, insira uma senha.');
      return false;
    }

    if (this.registerForm.password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return false;
    }

    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      alert('As senhas não coincidem.');
      return false;
    }

    if (!this.registerForm.acceptTerms) {
      alert('Você deve aceitar os termos de uso.');
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private clearForms(): void {
    this.loginForm = {
      email: '',
      password: '',
      remember: false
    };

    this.registerForm = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    };
  }
}