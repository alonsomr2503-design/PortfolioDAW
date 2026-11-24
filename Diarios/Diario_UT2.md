# Diario de aprendizaje — Unidad 2

## Qué he trabajado

En esta unidad he realizado una práctica de iniciación a la virtualización y los contenedores. He creado una máquina virtual con Ubuntu 24.04 LTS en Oracle VirtualBox y he configurado recursos como memoria, disco y red. También he instalado las Guest Additions para mejorar la integración entre el sistema anfitrión y la máquina virtual.

Después he instalado y comprobado Docker. La ejecución de `docker run hello-world` me ha permitido verificar que el cliente y el daemon funcionan y que Docker puede descargar y ejecutar una imagen.

## Proceso de la práctica

He buscado imágenes de Nginx y Tomcat y he creado dos contenedores, asignándoles nombres y publicando sus puertos:

- Nginx: puerto 8080 del anfitrión hacia el 80 del contenedor.
- Tomcat: puerto 8081 del anfitrión hacia el 8080 del contenedor.

Con `docker ps` he comprobado que los contenedores estaban activos. Después he abierto `http://localhost:8080` y `http://localhost:8081` para verificar las páginas de ambos servicios.

La práctica también me ha servido para distinguir una máquina virtual, que ejecuta un sistema operativo invitado completo, de un contenedor, que comparte el kernel del anfitrión y suele ser más ligero.

## Dificultades y aprendizaje

La instalación requiere prestar atención a las dependencias y a la forma de instalar Docker. También es importante comprender el mapeo de puertos: el puerto publicado es el que se utiliza desde el navegador del anfitrión, mientras que el puerto interno pertenece al servicio del contenedor.

He aprendido comandos básicos para consultar, detener, iniciar y eliminar contenedores, así como revisar sus registros.

## Qué me llevo de la unidad

Ahora entiendo mejor cómo preparar un entorno aislado para probar servicios web y de aplicaciones. VirtualBox me permite disponer de un sistema Linux separado y Docker facilita desplegar servicios sin instalar cada uno directamente en el sistema.

## Ejercicios de la unidad

1. [Iniciación a la virtualización: Ubuntu, Docker, Nginx y Tomcat](../Ejercicios/Iniciacion_a_la_Virtualizacion/Ubuntu.md)
2. [Cuestionario de presentación](../Ejercicios/Cuestionario_Alonso.pdf)

