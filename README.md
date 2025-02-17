# Proyecto API Médica

Este proyecto es una API para gestionar citas médicas, utilizando Docker para facilitar su configuración y ejecución. Además, se incluyen pasos detallados para ejecutar las pruebas unitarias.

## Requisitos

Antes de ejecutar el proyecto, asegúrate de tener las siguientes herramientas instaladas en tu máquina:

- Docker
- Docker Compose
- Yarn (si deseas ejecutar los tests fuera de Docker)

## 1. **Ejecutar la aplicación con Docker**

### 1.1. **Construir y ejecutar los contenedores**

Para levantar la aplicación con Docker, ejecuta el siguiente comando en la raíz del proyecto:

```bash
docker-compose up --build
```

### 1.2. **Ejecutar tests unitarios con docker y jest**

```bash
docker exec -it api-medica_api_1 bash
yarn test
```

## 2. **Ejecutar la aplicación manualmente con node.js**

### 2.1. **Instalar dependencias, generar build y ejecutar proyecto**

Para levantar la base de datos, ejecutar, importar o copiar y pegar el contenido de database.sql que se encuentra ubicado en la raíz del proyecto.

```bash
database.sql
```

### 2.2. **Instalar dependencias, generar build y ejecutar proyecto**

Para levantar la aplicación con Node.js verifica que la version es v20.10 o superior y ejecuta el siguiente comando en la raíz del proyecto:

```bash
yarn install
yarn build
yarn start
```

### 2.3. **Ejecutar tests unitarios con jest**

```bash
yarn test
```
