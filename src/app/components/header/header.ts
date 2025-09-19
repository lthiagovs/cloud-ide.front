import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
  imports: [CommonModule]
})
export class Header {
  @Input() userName: string | null = null;
  @Output() login = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() register = new EventEmitter<void>();
  @Output() navigate = new EventEmitter<string>();

  onLogin() {
    this.login.emit();
  }

  onLogout() {
    this.logout.emit();
  }

  onRegister() {
    this.register.emit();
  }

  go(to: string) {
    this.navigate.emit(to);
  }
}
