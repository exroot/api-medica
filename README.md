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

### Lo que contiene este `README.md` actualizado:

1. **Ejecución en Docker**: Instrucciones detalladas sobre cómo construir y ejecutar los contenedores con `docker-compose`, cómo acceder a la API y cómo detener los contenedores.

2. **Ejecución de Tests**:

   - Cómo ejecutar los tests dentro del contenedor Docker.
   - Cómo ejecutar los tests automáticamente al levantar los contenedores.
   - Cómo ejecutar los tests desde tu entorno local (sin Docker).

3. **Documentación con Swagger**: Guía sobre cómo integrar Swagger para generar y ver la documentación de la API de manera interactiva.

4. **Comandos útiles**: Incluye los comandos más relevantes para gestionar los contenedores y ejecutar los tests.

Con esto, ahora puedes ejecutar los tests en Docker o de manera local, y tener la documentación de tu API usando Swagger. ¡Déjame saber si necesitas algún ajuste adicional!
