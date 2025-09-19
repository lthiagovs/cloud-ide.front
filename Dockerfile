# Etapa 1: Build da aplicação Angular
FROM node:22 AS build

# Diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json para instalar dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todos os arquivos do projeto
COPY . .

# Build em modo de produção
RUN npx ng build --configuration production

# Etapa 2: Servir com Nginx
FROM nginx:alpine

# Copiar build do Angular para o diretório do Nginx
COPY --from=build /app/dist/ /usr/share/nginx/html

# Copiar configuração customizada do Nginx (opcional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta
EXPOSE 80

# Rodar Nginx
CMD ["nginx", "-g", "daemon off;"]
