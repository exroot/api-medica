# Usa la imagen oficial de Node.js
FROM node:20

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias antes de la aplicación para aprovechar la caché de Docker
COPY package.json yarn.lock ./

# Instala las dependencias con Yarn
RUN yarn install

# Copia todo el código fuente dentro del contenedor
COPY . .

# Expone el puerto 3000 para acceder a la API
EXPOSE 3000

# Comando por defecto para ejecutar la aplicación con Yarn
CMD ["yarn", "dev"]
