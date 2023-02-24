# Define a imagem base
FROM node:latest

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia o arquivo do script para o diretório de trabalho
COPY . .

# Instala as dependências do projeto
RUN npm install

# Expõe a porta 80 (caso o script escute nessa porta)
EXPOSE 80

# Inicia o cron em segundo plano
CMD node index.js

###########################
# docker build . -t dudu:v2
# docker run -d --name dockdudu-alive2 dudu:v2
# docker ps
# docker logs -f {id_container}
# reza
###########################