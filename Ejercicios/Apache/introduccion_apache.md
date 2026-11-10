# Apache: instalación, funcionamiento y documentación de un servidor web

**Palabras clave:** Apache HTTP Server, servidor web, HTTP, módulos,
host virtual, software libre, Nginx, IIS, Tomcat.

## 1. Introducción

### 1.1 Contexto

El presente trabajo se desarrolla en el ámbito formativo de \[nombre del
centro educativo\], dentro del módulo/asignatura de \[nombre de la
asignatura\], y forma parte de las actividades prácticas del curso
\[curso\]. Se realiza de manera individual y tiene un carácter
eminentemente didáctico: el objetivo no es dar servicio a una
organización real, sino comprender cómo funciona una de las piezas
fundamentales de la web y dejar constancia por escrito de todo el
proceso.

### 1.2 Entorno: Apache HTTP Server

Un servidor web es un programa que espera peticiones de los clientes
(normalmente navegadores), las interpreta mediante el protocolo HTTP y
responde enviando el recurso solicitado: una página HTML, una imagen, un
archivo o el resultado de ejecutar un programa en el servidor. Apache
HTTP Server es uno de los servidores web más conocidos y utilizados de
la historia de Internet.

Apache sirve para publicar sitios y aplicaciones web, tanto contenido
estático como dinámico, ya que se integra con lenguajes como PHP, Perl o
Python. Entre sus características más relevantes están:

-   **Arquitectura modular:** funcionalidades como la reescritura de URL
    (`mod_rewrite`), el cifrado HTTPS (`mod_ssl`) o la ejecución de PHP
    se activan o desactivan mediante módulos.
-   **Hosts virtuales:** permite alojar varios sitios web distintos en
    una misma máquina.
-   **Configuración flexible:** se controla mediante ficheros de texto,
    incluidos los `.htaccess` por directorio.
-   **Multiplataforma:** funciona en Linux, Windows y macOS. Forma parte
    de pilas muy habituales como LAMP o XAMPP.
-   **Software libre:** se distribuye bajo la licencia Apache 2.0.

En cuanto a su historia, el proyecto nació en 1995, cuando un grupo de
desarrolladores comenzó a mejorar y aplicar parches al servidor NCSA
HTTPd, que había quedado sin mantenimiento. Aquel grupo dio lugar al
proyecto Apache y, en 1999, se constituyó la Apache Software Foundation,
organización sin ánimo de lucro que hoy mantiene Apache y otros muchos
proyectos de software libre. Durante muchos años fue el servidor web más
utilizado del mundo, lo que ha contribuido a que exista abundante
documentación y una comunidad muy activa.

### 1.3 Alternativas

Apache no es la única opción. Conviene conocer brevemente las
siguientes:

-   **Nginx:** servidor web de código abierto aparecido en 2004,
    diseñado para atender un gran número de conexiones simultáneas con
    poco consumo de recursos. Es muy utilizado como proxy inverso y
    balanceador de carga.
-   **IIS (Internet Information Services):** servidor web de Microsoft,
    incluido en Windows Server. Su principal ventaja es la integración
    con el ecosistema Microsoft, en especial con ASP.NET, aunque queda
    ligado a ese sistema operativo.
-   **Apache Tomcat:** aunque lo mantiene también la Apache Software
    Foundation, no es exactamente lo mismo que Apache HTTP Server. Es un
    contenedor de servlets y JSP orientado a ejecutar aplicaciones web
    en Java. A menudo se combina con Apache o Nginx, que atienden el
    contenido estático mientras Tomcat ejecuta la parte Java.

### 1.4 Motivación

La motivación de este trabajo es puramente formativa: aprender cómo
funciona un servidor web y documentar el proceso de forma ordenada. Se
ha elegido Apache por su larga trayectoria, su carácter libre, su
abundante documentación y porque sus conceptos (peticiones HTTP,
módulos, hosts virtuales, ficheros de configuración) son aplicables a
otros servidores. Entender bien Apache facilita después comprender las
alternativas descritas.

Además, el trabajo sirve para practicar la redacción de un documento
tipo memoria, con una estructura clara (introducción, actividades,
resultados y conclusión), y para acostumbrarse a recopilar las fuentes
consultadas desde el principio.
