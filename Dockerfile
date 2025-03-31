# Etapa 1: Construcción de la aplicación Vue
FROM node:18-alpine AS build

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /MedialertApp

# Copiar los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código fuente al contenedor
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Etapa 2: Servir los archivos estáticos con "serve"
FROM node:18-alpine

# Instalar "serve" globalmente
RUN npm install -g serve

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /MedialertApp

# Copiar los archivos generados en la etapa de construcción al directorio actual
COPY --from=build /MedialertApp/dist ./dist

# Exponer el puerto 8080 para servir la aplicación
EXPOSE 8080

# Comando por defecto para iniciar "serve"
CMD ["serve", "-s", "dist", "-l", "8080"]
