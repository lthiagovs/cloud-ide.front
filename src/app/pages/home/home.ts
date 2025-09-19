import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface Stat {
  number: string;
  label: string;
}

@Component({
  selector: 'home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  standalone: true,
  imports: [CommonModule]
})
export class Home implements OnInit {
  
  features: Feature[] = [
    {
      title: 'Editor Inteligente',
      description: 'Syntax highlighting, autocomplete e debugging integrado para múltiplas linguagens.',
      icon: '<path fill="currentColor" d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>'
    },
    {
      title: 'Colaboração Real-time',
      description: 'Trabalhe em equipe com sincronização instantânea e controle de versão integrado.',
      icon: '<path fill="currentColor" d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H16.5c-.83 0-1.54.5-1.85 1.22l-1.92 5.78c-.34 1.03.28 2.14 1.38 2.14.5 0 .97-.26 1.23-.69l.95-2.28.77 2.28c.11.33.39.55.72.55H20v6h4zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-6H9l-1.32-3.96A1.49 1.49 0 0 0 6.26 11H4.74c-.83 0-1.54.5-1.85 1.22l-1.92 5.78c-.34 1.03.28 2.14 1.38 2.14.5 0 .97-.26 1.23-.69L4.5 17.5l.77 2.28c.11.33.39.55.72.55H7.5v2h4z"/>'
    },
    {
      title: 'Deploy Instantâneo',
      description: 'Publique seus projetos com um clique. Integração com principais plataformas de cloud.',
      icon: '<path fill="currentColor" d="M2.5 19h19v2h-19zm19.35-10.5c.68 0 1.25.58 1.25 1.25s-.57 1.25-1.25 1.25h-3.5V13h1.5c.83 0 1.5-.67 1.5-1.5S19.33 10 18.5 10h-1.5V8h3.5c.68 0 1.25.58 1.25 1.25s-.57 1.25-1.25 1.25zm-2.85-3c0-.83.67-1.5 1.5-1.5H22v2h-1.5c-.83 0-1.5.67-1.5 1.5V13h-2V8.5z"/><path fill="currentColor" d="M9 12l2 2 4-4 1.41 1.41L11 17 7.59 13.41 9 12z"/>'
    }
  ];

  stats: Stat[] = [
    { number: '50K+', label: 'Desenvolvedores' },
    { number: '1M+', label: 'Projetos' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Suporte' }
  ];

  constructor() { }

  ngOnInit(): void {
    // Inicialização do componente
  }

  startCoding(): void {
    console.log('Iniciando codificação...');
    // Lógica para redirecionar ao editor
  }

  watchDemo(): void {
    console.log('Reproduzindo demo...');
    // Lógica para mostrar demo
  }

  getStarted(): void {
    console.log('Começando gratuitamente...');
    // Lógica para registro/login
  }
}