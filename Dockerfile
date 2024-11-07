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
CMD node index.js --mode cron-1-am --profile default

###########################

# git pull

#sudo docker stop {id_container}
#sudo docker rm {id_container}
#sudo docker image rm {id_image}

# sudo docker build . -t dudu:v2
# sudo docker run -d --name dockdudu-alive2 dudu:v2
# docker ps
# sudo docker logs -f --tail 50 {id_container}
# reza

# sudo docker rm {id}
###########################




#######################
# NOVO
# sudo git pull origin production
# sudo docker-compose up --build -d
# sudo docker ps
# sudo docker logs -f --tail 50 {id_container}
######################