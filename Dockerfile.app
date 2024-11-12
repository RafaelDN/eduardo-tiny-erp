# Define a imagem base
FROM node:latest

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copie o package.json e package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Mudar para o diretório do app Vite
WORKDIR /usr/src/app/app/dudu-app

# Instalar as dependências do Vite
RUN npm install

# Fazer o build do Vite
RUN npm run build

# Voltar para o diretório principal do Express
WORKDIR /usr/src/app

# Exponha a porta que o app irá usar
EXPOSE 8080

# Comando para rodar a aplicação
CMD [ "node", "app/index.js" ]