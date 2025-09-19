import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface FileItem {
  name: string;
  path: string;
  content: string;
  type: 'file';
}

interface FolderItem {
  name: string;
  expanded: boolean;
  files: FileItem[];
  type: 'folder';
}

interface ConsoleMessage {
  timestamp: string;
  message: string;
  type: 'info' | 'error' | 'warning' | 'success';
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.html',
  styleUrls: ['./editor.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Editor implements OnInit {
  
  showExplorer = true;
  showConsole = false;
  activeFile: FileItem | null = null;
  openTabs: FileItem[] = [];
  commandInput = '';
  consoleOutput: ConsoleMessage[] = [];

  folders: FolderItem[] = [
    {
      name: 'src',
      expanded: true,
      files: [
        {
          name: 'app.ts',
          path: 'src/app.ts',
          content: `import { Component } from '@angular/core';

@Component({{ '{' }}
  selector: 'app-root',
  template: \`
    <div class="app-container">
      <h1>Hello Cloud IDE!</h1>
      <p>Bem-vindo ao seu editor na nuvem</p>
      <button (click)="sayHello()">
        Clique aqui
      </button>
    </div>
  \`,
  styles: [\`
    .app-container {{ '{' }}
      padding: 2rem;
      text-align: center;
      font-family: Arial, sans-serif;
    {{ '}' }}
    
    h1 {{ '{' }}
      color: #4f46e5;
      margin-bottom: 1rem;
    {{ '}' }}
    
    button {{ '{' }}
      background: #4f46e5;
      color: white;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    {{ '}' }}
  \`]
{{ '}' }})
export class AppComponent {{ '{' }}
  
  sayHello() {{ '{' }}
    console.log('Olá do Cloud IDE!');
    alert('Funcionalidade executada com sucesso!');
  {{ '}' }}
{{ '}' }}`,
          type: 'file'
        },
        {
          name: 'main.ts',
          path: 'src/main.ts',
          content: `import {{ '{' }} bootstrapApplication {{ '}' }} from '@angular/platform-browser';
import {{ '{' }} AppComponent {{ '}' }} from './app';

bootstrapApplication(AppComponent)
  .catch(err => console.error(err));`,
          type: 'file'
        },
        {
          name: 'styles.css',
          path: 'src/styles.css',
          content: `/* Global Styles */
* {{ '{' }}
  margin: 0;
  padding: 0;
  box-sizing: border-box;
{{ '}' }}

body {{ '{' }}
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f8fafc;
  color: #334155;
  line-height: 1.6;
{{ '}' }}

.container {{ '{' }}
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
{{ '}' }}`,
          type: 'file'
        }
      ],
      type: 'folder'
    },
    {
      name: 'assets',
      expanded: false,
      files: [
        {
          name: 'logo.svg',
          path: 'assets/logo.svg',
          content: `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4f46e5"/>
      <stop offset="100%" style="stop-color:#7c3aed"/>
    </linearGradient>
  </defs>
  <path d="M48.5 27.5A9.5 9.5 0 0 0 31 20a11 11 0 0 0-20 6 8 8 0 0 0 .5 16h36a8 8 0 0 0 1-16z" fill="url(#gradient)"/>
</svg>`,
          type: 'file'
        },
        {
          name: 'favicon.ico',
          path: 'assets/favicon.ico',
          content: '<!-- Ícone do navegador -->', 
          type: 'file'
        }
      ],
      type: 'folder'
    }
  ];

  rootFiles: FileItem[] = [
    {
      name: 'package.json',
      path: 'package.json',
      content: `{
  "name": "cloud-ide-project",
  "version": "1.0.0",
  "description": "Projeto criado no Cloud IDE",
  "main": "src/main.ts",
  "scripts": {
    "dev": "ng serve",
    "build": "ng build",
    "test": "ng test",
    "start": "node server.js"
  },
  "dependencies": {
    "@angular/core": "^17.0.0",
    "@angular/common": "^17.0.0",
    "@angular/platform-browser": "^17.0.0",
    "@angular/router": "^17.0.0"
  },
  "devDependencies": {
    "@angular/cli": "^17.0.0",
    "typescript": "^5.0.0"
  },
  "keywords": ["angular", "typescript", "cloud-ide"],
  "author": "Cloud IDE User",
  "license": "MIT"
}`,
      type: 'file'
    },
    {
      name: 'README.md',
      path: 'README.md',
      content: `# Meu Projeto Cloud IDE

Este é um projeto criado usando o **Cloud IDE** - a melhor plataforma de desenvolvimento na nuvem!

## 🚀 Getting Started

### Desenvolvimento
\`\`\`bash
npm run dev
\`\`\`

### Build
\`\`\`bash
npm run build
\`\`\`

### Deploy
\`\`\`bash
npm run start
\`\`\`

## 📁 Estrutura do Projeto

- \`src/\` - Código fonte principal
- \`assets/\` - Recursos estáticos
- \`package.json\` - Dependências e scripts

## 🛠 Tecnologias

- Angular 17+
- TypeScript 5+
- CSS3
- HTML5

---

*Desenvolvido com ❤️ usando Cloud IDE*`,
      type: 'file'
    },
    {
      name: 'tsconfig.json',
      path: 'tsconfig.json',
      content: `{
  "compileOnSave": false,
  "compilerOptions": {
    "outDir": "./dist/out-tsc",
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "sourceMap": true,
    "declaration": false,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "useDefineForClassFields": false,
    "lib": [
      "ES2022",
      "dom"
    ]
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}`,
      type: 'file'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.addConsoleMessage('Cloud IDE iniciado com sucesso!', 'success');
    this.addConsoleMessage('Pronto para desenvolvimento', 'info');
  }

  toggleExplorer(): void {
    this.showExplorer = !this.showExplorer;
  }

  toggleFolder(folder: FolderItem): void {
    folder.expanded = !folder.expanded;
  }

  openFile(file: FileItem): void {
    this.activeFile = file;
    
    // Adicionar à lista de abas abertas se ainda não estiver
    if (!this.openTabs.find(tab => tab.path === file.path)) {
      this.openTabs.push(file);
    }
  }

  switchTab(file: FileItem): void {
    this.activeFile = file;
  }

  closeTab(file: FileItem, event: Event): void {
    event.stopPropagation();
    
    const index = this.openTabs.findIndex(tab => tab.path === file.path);
    if (index > -1) {
      this.openTabs.splice(index, 1);
      
      // Se fechou a aba ativa, selecionar outra
      if (file === this.activeFile) {
        if (this.openTabs.length > 0) {
          const newIndex = Math.min(index, this.openTabs.length - 1);
          this.activeFile = this.openTabs[newIndex];
        } else {
          this.activeFile = null;
        }
      }
    }
  }

  runCode(): void {
    if (!this.activeFile) return;
    
    this.showConsole = true;
    this.addConsoleMessage(`Executando ${this.activeFile.name}...`, 'info');
    
    // Simular execução
    setTimeout(() => {
      this.addConsoleMessage('✓ Compilação bem-sucedida', 'success');
      this.addConsoleMessage('✓ Servidor de desenvolvimento iniciado', 'success');
      this.addConsoleMessage('🌐 Aplicação rodando em http://localhost:4200', 'info');
      this.addConsoleMessage('📁 Arquivos sendo observados para mudanças...', 'info');
    }, 1500);
  }

  closeConsole(): void {
    this.showConsole = false;
  }

  executeCommand(): void {
    if (!this.commandInput.trim()) return;
    
    const command = this.commandInput.trim();
    this.addConsoleMessage(`> ${command}`, 'info');
    
    // Simular comandos
    setTimeout(() => {
      switch (command.toLowerCase()) {
        case 'clear':
          this.consoleOutput = [];
          break;
        case 'help':
          this.addConsoleMessage('Comandos disponíveis:', 'info');
          this.addConsoleMessage('• clear - Limpar console', 'info');
          this.addConsoleMessage('• run - Executar projeto', 'info');
          this.addConsoleMessage('• build - Compilar projeto', 'info');
          this.addConsoleMessage('• status - Status do projeto', 'info');
          break;
        case 'run':
          this.runCode();
          break;
        case 'build':
          this.addConsoleMessage('🔨 Iniciando build...', 'info');
          this.addConsoleMessage('✓ Build concluído com sucesso!', 'success');
          break;
        case 'status':
          this.addConsoleMessage('📊 Status do projeto:', 'info');
          this.addConsoleMessage(`• Arquivos: ${this.getAllFiles().length}`, 'info');
          this.addConsoleMessage(`• Abas abertas: ${this.openTabs.length}`, 'info');
          this.addConsoleMessage('• Status: Pronto para desenvolvimento', 'success');
          break;
        default:
          this.addConsoleMessage(`Comando não reconhecido: ${command}`, 'error');
          this.addConsoleMessage('Digite "help" para ver comandos disponíveis', 'info');
      }
    }, 500);
    
    this.commandInput = '';
  }

  getLineNumbers(): number[] {
    if (!this.activeFile) return [];
    const lines = this.activeFile.content.split('\n').length;
    return Array.from({ length: lines }, (_, i) => i + 1);
  }

  private addConsoleMessage(message: string, type: ConsoleMessage['type']): void {
    const timestamp = new Date().toLocaleTimeString();
    this.consoleOutput.push({ timestamp, message, type });
    
    // Limitar o número de mensagens no console
    if (this.consoleOutput.length > 100) {
      this.consoleOutput.shift();
    }
  }

  private getAllFiles(): FileItem[] {
    let allFiles: FileItem[] = [...this.rootFiles];
    this.folders.forEach(folder => {
      allFiles = allFiles.concat(folder.files);
    });
    return allFiles;
  }
}