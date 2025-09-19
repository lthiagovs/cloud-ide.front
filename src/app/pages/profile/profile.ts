import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface User {
  name: string;
  username: string;
  bio: string;
  avatar?: string;
  stats: {
    projects: number;
    stars: number;
    followers: number;
  };
}

interface Project {
  id: string;
  name: string;
  description: string;
  author: string;
  technologies: string[];
  stars: number;
  forks?: number;
  collaborators: string[];
  lastUpdate: string;
  isPrivate?: boolean;
  isStarred?: boolean;
}

interface NewProject {
  name: string;
  description: string;
  language: string;
  template: string;
  collaborators: string[];
  isPrivate: boolean;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Profile implements OnInit {
  
  currentTab: 'projects' | 'starred' | 'explore' = 'projects';
  viewMode: 'grid' | 'list' = 'grid';
  searchQuery = '';
  selectedLanguage = '';
  selectedSort = 'recent';
  showCreateModal = false;
  collaboratorEmail = '';

  user: User = {
    name: 'João Silva',
    username: 'joaosilva',
    bio: 'Desenvolvedor Full Stack apaixonado por criar soluções inovadoras. Especialista em React, Node.js e Cloud Computing.',
    stats: {
      projects: 12,
      stars: 89,
      followers: 45
    }
  };

  newProject: NewProject = {
    name: '',
    description: '',
    language: 'typescript',
    template: 'blank',
    collaborators: [],
    isPrivate: false
  };

  projects: Project[] = [
    {
      id: '1',
      name: 'task-manager-pro',
      description: 'Sistema completo de gerenciamento de tarefas com interface moderna e funcionalidades avançadas.',
      author: 'joaosilva',
      technologies: ['React', 'Node.js', 'MongoDB'],
      stars: 24,
      collaborators: ['maria@email.com', 'pedro@email.com'],
      lastUpdate: '2 dias atrás',
      isPrivate: false
    },
    {
      id: '2',
      name: 'e-commerce-platform',
      description: 'Plataforma de e-commerce escalável com carrinho, pagamentos e dashboard administrativo.',
      author: 'joaosilva',
      technologies: ['Angular', 'TypeScript', 'PostgreSQL'],
      stars: 18,
      collaborators: ['ana@email.com'],
      lastUpdate: '5 dias atrás',
      isPrivate: false
    },
    {
      id: '3',
      name: 'weather-app',
      description: 'Aplicativo de previsão do tempo com geolocalização e interface responsiva.',
      author: 'joaosilva',
      technologies: ['Vue.js', 'JavaScript', 'API'],
      stars: 12,
      collaborators: [],
      lastUpdate: '1 semana atrás',
      isPrivate: true
    }
  ];

  starredProjects: Project[] = [
    {
      id: '4',
      name: 'awesome-ui-kit',
      description: 'Kit de componentes UI modernos e acessíveis para React e Vue.',
      author: 'designsystem',
      technologies: ['React', 'Vue', 'Storybook'],
      stars: 1250,
      collaborators: ['team@designsystem.com'],
      lastUpdate: '3 dias atrás',
      isStarred: true
    },
    {
      id: '5',
      name: 'ml-image-classifier',
      description: 'Classificador de imagens usando machine learning com interface web intuitiva.',
      author: 'aidev',
      technologies: ['Python', 'TensorFlow', 'Flask'],
      stars: 890,
      collaborators: ['research@aidev.com'],
      lastUpdate: '1 semana atrás',
      isStarred: true
    }
  ];

  exploreProjects: Project[] = [
    {
      id: '6',
      name: 'chat-app-realtime',
      description: 'Aplicação de chat em tempo real com salas, emoji e compartilhamento de arquivos.',
      author: 'chatdev',
      technologies: ['Socket.io', 'React', 'Express'],
      stars: 456,
      forks: 123,
      collaborators: ['team@chatdev.com'],
      lastUpdate: '4 horas atrás'
    },
    {
      id: '7',
      name: 'portfolio-generator',
      description: 'Gerador automático de portfólios profissionais a partir de dados do GitHub.',
      author: 'webtools',
      technologies: ['Next.js', 'GitHub API', 'Tailwind'],
      stars: 234,
      forks: 67,
      collaborators: ['dev@webtools.com'],
      lastUpdate: '2 dias atrás'
    },
    {
      id: '8',
      name: 'expense-tracker',
      description: 'Rastreador de despesas pessoais com categorias, gráficos e relatórios detalhados.',
      author: 'financeapp',
      technologies: ['Angular', 'Chart.js', 'Firebase'],
      stars: 189,
      forks: 45,
      collaborators: ['support@financeapp.com'],
      lastUpdate: '6 dias atrás'
    }
  ];

  filteredProjects: Project[] = [];

  constructor() { }

  ngOnInit(): void {
    this.filteredProjects = [...this.exploreProjects];
  }

  switchTab(tab: 'projects' | 'starred' | 'explore'): void {
    this.currentTab = tab;
    if (tab === 'explore') {
      this.filteredProjects = [...this.exploreProjects];
    }
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  createProject(): void {
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.resetNewProject();
  }

  onCreateProject(): void {
    if (!this.newProject.name) return;

    const project: Project = {
      id: Date.now().toString(),
      name: this.newProject.name,
      description: this.newProject.description || 'Sem descrição',
      author: this.user.username,
      technologies: [this.newProject.language, this.newProject.template],
      stars: 0,
      collaborators: [...this.newProject.collaborators],
      lastUpdate: 'agora',
      isPrivate: this.newProject.isPrivate
    };

    this.projects.unshift(project);
    this.user.stats.projects++;
    
    this.closeCreateModal();
    this.showSuccessMessage('Projeto criado com sucesso!');
  }

  editProfile(): void {
    this.showSuccessMessage('Funcionalidade de editar perfil será implementada em breve!');
  }

  editAvatar(): void {
    this.showSuccessMessage('Funcionalidade de editar avatar será implementada em breve!');
  }

  openProject(project: Project): void {
    console.log('Abrindo projeto:', project.name);
    this.showSuccessMessage(`Abrindo projeto ${project.name}...`);
  }

  shareProject(project: Project): void {
    const url = `https://cloudide.com/${project.author}/${project.name}`;
    navigator.clipboard.writeText(url);
    this.showSuccessMessage('Link do projeto copiado para a área de transferência!');
  }

  deleteProject(project: Project): void {
    if (confirm(`Tem certeza que deseja excluir o projeto "${project.name}"?`)) {
      const index = this.projects.findIndex(p => p.id === project.id);
      if (index > -1) {
        this.projects.splice(index, 1);
        this.user.stats.projects--;
        this.showSuccessMessage('Projeto excluído com sucesso!');
      }
    }
  }

  toggleStar(project: Project): void {
    const isCurrentlyStarred = this.isProjectStarred(project);
    
    if (isCurrentlyStarred) {
      // Remove dos favoritos
      const index = this.starredProjects.findIndex(p => p.id === project.id);
      if (index > -1) {
        this.starredProjects.splice(index, 1);
        project.stars = Math.max(0, project.stars - 1);
        this.user.stats.stars--;
        this.showSuccessMessage('Removido dos favoritos');
      }
    } else {
      // Adiciona aos favoritos
      const starredProject = { ...project, isStarred: true };
      this.starredProjects.unshift(starredProject);
      project.stars++;
      this.user.stats.stars++;
      this.showSuccessMessage('Adicionado aos favoritos!');
    }
  }

  isProjectStarred(project: Project): boolean {
    return this.starredProjects.some(p => p.id === project.id);
  }

  forkProject(project: Project): void {
    const forkedProject: Project = {
      ...project,
      id: Date.now().toString(),
      name: `${project.name}-fork`,
      author: this.user.username,
      stars: 0,
      collaborators: [],
      lastUpdate: 'agora'
    };

    this.projects.unshift(forkedProject);
    this.user.stats.projects++;
    this.showSuccessMessage(`Fork do projeto ${project.name} criado com sucesso!`);
  }

  viewProject(project: Project): void {
    console.log('Visualizando projeto:', project.name);
    this.showSuccessMessage(`Visualizando projeto ${project.name}...`);
  }

  onSearch(): void {
    this.filterProjects();
  }

  onFilter(): void {
    this.filterProjects();
  }

  private filterProjects(): void {
    let filtered = [...this.exploreProjects];

    // Filtrar por busca
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.author.toLowerCase().includes(query) ||
        project.technologies.some(tech => tech.toLowerCase().includes(query))
      );
    }

    // Filtrar por linguagem
    if (this.selectedLanguage) {
      filtered = filtered.filter(project =>
        project.technologies.some(tech => 
          tech.toLowerCase().includes(this.selectedLanguage.toLowerCase())
        )
      );
    }

    // Ordenar
    switch (this.selectedSort) {
      case 'popular':
        filtered.sort((a, b) => (b.forks || 0) - (a.forks || 0));
        break;
      case 'stars':
        filtered.sort((a, b) => b.stars - a.stars);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'recent':
      default:
        // Manter ordem original (mais recentes primeiro)
        break;
    }

    this.filteredProjects = filtered;
  }

  getDisplayProjects(): Project[] {
    return this.currentTab === 'explore' ? this.filteredProjects : this.exploreProjects;
  }

  addCollaborator(): void {
    if (this.collaboratorEmail.trim() && this.isValidEmail(this.collaboratorEmail)) {
      if (!this.newProject.collaborators.includes(this.collaboratorEmail)) {
        this.newProject.collaborators.push(this.collaboratorEmail);
        this.collaboratorEmail = '';
      } else {
        alert('Este colaborador já foi adicionado.');
      }
    } else {
      alert('Por favor, insira um email válido.');
    }
  }

  removeCollaborator(email: string): void {
    const index = this.newProject.collaborators.indexOf(email);
    if (index > -1) {
      this.newProject.collaborators.splice(index, 1);
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private resetNewProject(): void {
    this.newProject = {
      name: '',
      description: '',
      language: 'typescript',
      template: 'blank',
      collaborators: [],
      isPrivate: false
    };
    this.collaboratorEmail = '';
  }

  private showSuccessMessage(message: string): void {
    // Simular notificação toast
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    `;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Mostrar toast
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    }, 100);

    // Remover toast
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }
}