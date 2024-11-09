# Usando a imagem Node.js como base
FROM node:18

# Define o diretório de trabalho
WORKDIR /app

# Copia o package.json e instala as dependências
COPY package*.json ./
RUN apt-get update && apt-get install -y wait-for-it


# Copia o restante dos arquivos do projeto para o diretório de trabalho
COPY . .

# Expõe a porta que a aplicação usa
EXPOSE 3000

# Comando para rodar o backend
CMD ["node", "app.js"]
