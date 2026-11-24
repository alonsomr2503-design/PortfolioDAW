# Diario de aprendizaje — Unidad 3

## Qué he trabajado

En esta unidad he estudiado Apache HTTP Server y he realizado prácticas de instalación, configuración y publicación de una página web en Ubuntu. He aprendido que Apache recibe peticiones HTTP y entrega recursos al navegador, y que su funcionamiento se organiza mediante archivos de configuración, módulos y sitios virtuales.

## Proceso de los ejercicios

Primero he trabajado la introducción teórica: qué es un servidor web, para qué sirve Apache, sus características y su relación con otras tecnologías como Nginx y Tomcat.

Después he desarrollado una página personalizada. En lugar de modificar directamente el sitio predeterminado, la práctica propone crear un directorio propio en `/var/www`, guardar allí el `index.html` y configurar un sitio independiente. He tenido que prestar atención a los permisos al trabajar dentro de `/var/www` y a que las rutas del archivo de configuración coincidan con las del sitio.

Por último, he documentado la implementación de HTTPS. He revisado la función de TLS, los certificados y los módulos de Apache necesarios. En la parte práctica se habilitan `ssl` y `headers`, se genera un certificado autofirmado, se configura un VirtualHost en el puerto 443 y se redirige el tráfico HTTP a HTTPS. La verificación con navegador y `curl` permite comprobar la respuesta del servidor.

## Dificultades y aprendizaje

La configuración de Apache exige respetar la sintaxis y las rutas de los archivos. También he aprendido que un certificado autofirmado sirve para practicar el cifrado, pero el navegador no lo considera confiable como uno emitido por una autoridad certificadora. Para un sitio público se puede utilizar una CA, por ejemplo mediante Let's Encrypt y Certbot.

## Qué me llevo de la unidad

He comprendido mejor la diferencia entre servir una página por HTTP y hacerlo por HTTPS, así como la función de los módulos, los VirtualHost, el certificado y la clave privada. Documentar cada paso y comprobarlo desde el navegador facilita localizar errores.

## Ejercicios de la unidad

1. [Apache: instalación, funcionamiento y conceptos](../Ejercicios/Apache/introduccion_apache.md)
2. [Desarrollo: creación de una web personalizada](../Ejercicios/Apache/desarrollo_apache.md)
3. [Memoria: implementación de HTTPS en Apache2](../Ejercicios/Apache/memoria_https_apache2.md)

