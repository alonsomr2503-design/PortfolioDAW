# Informe técnico: Virtualización y contenedores con Ubuntu, Docker, Nginx y Tomcat

**Autor:** Alonso Mariblanca
**Fecha de realización:** 20 de octubre de 2026
**Entorno:** Ubuntu 24.04 LTS sobre Oracle VirtualBox (máquina `Ubuntu-DAW2DAW`)

---

## Índice

1. [Introducción](#1-introducción)
2. [Instalación de Ubuntu en VirtualBox](#2-instalación-de-ubuntu-en-virtualbox)
3. [Instalación de Docker Desktop en Ubuntu](#3-instalación-de-docker-desktop-en-ubuntu)
4. [Contenedores de servidor web y de aplicaciones](#4-contenedores-de-servidor-web-y-de-aplicaciones)
5. [Requisitos mínimos para implantar una aplicación web](#5-requisitos-mínimos-para-implantar-una-aplicación-web)
6. [Conclusiones](#6-conclusiones)
7. [Relación con los criterios de evaluación](#7-relación-con-los-criterios-de-evaluación)

---

## 1. Introducción

La **virtualización** permite ejecutar varios sistemas operativos o entornos independientes sobre una misma máquina física mediante un **hipervisor** (VirtualBox, VMware, Hyper-V...). Cada entorno se denomina **máquina virtual (VM)** y dispone de recursos virtualizados: CPU, memoria RAM, almacenamiento y red.

Un **contenedor**, en cambio, empaqueta el código de una aplicación junto con sus dependencias y configuración, pero **comparte el kernel** del sistema operativo anfitrión. Por eso es más ligero y rápido que una VM.

| Característica | Máquina virtual | Contenedor |
|---|---|---|
| Kernel | Propio (SO invitado completo) | Compartido con el anfitrión |
| Tamaño | Gigabytes | Megabytes |
| Arranque | Segundos o minutos | Segundos o menos |
| Aislamiento | Muy alto (hardware virtual) | Alto (a nivel de proceso) |
| Ejemplo | Ubuntu en VirtualBox | Contenedor Nginx en Docker |

**Ventajas de Docker:** portabilidad, aislamiento, escalabilidad y rapidez de despliegue.

**Objetivo de la práctica:** crear una VM con Ubuntu, instalar Docker, desplegar un servidor web (Nginx) y un servidor de aplicaciones (Tomcat) en contenedores, probarlos y documentar el proceso.

---

## 2. Instalación de Ubuntu en VirtualBox

### 2.1 Descarga de la imagen ISO

Se descargó la ISO de **Ubuntu 24.04 LTS** desde la página oficial de Ubuntu. Una imagen ISO es un archivo que contiene una copia exacta del sistema operativo o del software de instalación.

### 2.2 Creación de la máquina virtual

En VirtualBox se creó una nueva VM con las características recomendadas:

| Parámetro | Valor |
|---|---|
| Nombre | `Ubuntu-DAW2DAW` |
| Tipo / versión | Linux / Ubuntu (64-bit) |
| Memoria RAM | 4096 MB |
| Disco duro virtual | Mínimo 50 GB |
| Adaptador de red | NAT |
| Medio de instalación | ISO de Ubuntu 24.04 LTS |

### 2.3 Instalación del sistema operativo

1. Se arrancó la VM con la ISO montada en la unidad óptica virtual.
2. Se siguió el asistente de instalación de Ubuntu (idioma, distribución de teclado, particionado del disco virtual, zona horaria y creación del usuario).
3. Se creó el usuario `vboxuser` en el equipo `dd-ubuntu-DAW2`.
4. Tras finalizar, se reinició la VM retirando la ISO.

### 2.4 Instalación de las Guest Additions

Las **Guest Additions** mejoran la integración entre anfitrión e invitado (resolución de pantalla ajustable, portapapeles compartido, carpetas compartidas, mejor rendimiento gráfico). Se instalaron desde el menú *Dispositivos → Insertar imagen de CD de las Guest Additions* y ejecutando el instalador dentro de la VM. Después se reinició el sistema.

### 2.5 Resultado

La VM `Ubuntu-DAW2DAW` aparece en estado **"Corriendo"** en VirtualBox y muestra la pantalla de inicio de sesión de Ubuntu con el usuario `vboxuser`.

![Ubuntu 24.04 ejecutándose en VirtualBox (VM Ubuntu-DAW2DAW)](img/01-ubuntu-vm.png)

*Figura 1. Máquina virtual Ubuntu-DAW2DAW en ejecución en VirtualBox.*

---

## 3. Instalación de Docker Desktop en Ubuntu

### 3.1 Actualización del sistema

```bash
sudo apt update && sudo apt upgrade -y
```

Actualiza la lista de paquetes de los repositorios y aplica las actualizaciones pendientes.

### 3.2 Instalación de dependencias

```bash
sudo apt install ca-certificates curl gnupg -y
```

- `ca-certificates`: certificados para conexiones HTTPS seguras.
- `curl`: descarga de archivos desde la terminal.
- `gnupg`: verificación de las claves de firma de los repositorios.

### 3.3 Instalación de Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo apt install docker-desktop -y
```

- El script oficial `get.docker.com` configura el repositorio de Docker e instala el motor (**Docker Engine**).
- Después se instaló **Docker Desktop** mediante el paquete `.deb` (`docker-desktop-amd64.deb`), que añade la interfaz gráfica y arrastra dependencias como QEMU (visible en la salida de la instalación en la Figura 2).

> **Nota:** al instalar desde un `.deb` local apareció el aviso *"La descarga está siendo realizada en un sandbox como superusuario, ya que el archivo ... no es accesible por el usuario «_apt»"*. Es un aviso informativo de `apt` sobre permisos del archivo descargado; **no impidió la instalación**.

### 3.4 Verificación

```bash
docker --version
docker run hello-world
```

`docker run hello-world` descarga la imagen `hello-world` desde Docker Hub, crea un contenedor y muestra un mensaje de confirmación. Su salida (*"Hello from Docker! This message shows that your installation appears to be working correctly."*) confirma que:

1. El cliente Docker contactó con el daemon.
2. El daemon descargó la imagen desde Docker Hub (arquitectura `amd64`).
3. El daemon creó un contenedor que ejecuta el programa de prueba.
4. La salida se envió al terminal.

![Resultado de docker run hello-world](img/02-docker-hello-world.png)

*Figura 2. Instalación completada y ejecución correcta de `docker run hello-world`.*

---

## 4. Contenedores de servidor web y de aplicaciones

### 4.1 Conceptos

- **Servidor web:** atiende peticiones HTTP/HTTPS y sirve contenido estático o actúa como proxy inverso (ej. **Nginx**, Apache).
- **Servidor de aplicaciones:** ejecuta la lógica de negocio de la aplicación (ej. **Tomcat**, WildFly).

### 4.2 Búsqueda de imágenes

```bash
docker search nginx
docker search tomcat
```

Consulta Docker Hub y lista las imágenes disponibles. Se utilizaron las imágenes oficiales.

### 4.3 Descarga y ejecución de los contenedores

```bash
docker run -d -p 8080:80 --name webserver nginx
docker run -d -p 8081:8080 --name appserver tomcat
```

| Opción | Significado |
|---|---|
| `-d` | Ejecuta el contenedor en segundo plano (*detached*). |
| `-p 8080:80` | Redirige el puerto **8080 del anfitrión** al puerto **80 del contenedor** (Nginx). |
| `-p 8081:8080` | Redirige el puerto **8081 del anfitrión** al puerto **8080 del contenedor** (Tomcat). |
| `--name` | Asigna un nombre identificable al contenedor. |
| `nginx` / `tomcat` | Imagen que se descarga (si no existe localmente) y se ejecuta. |

Si la imagen no está en local, Docker la descarga automáticamente desde Docker Hub.

### 4.4 Verificación de contenedores activos

```bash
docker ps
```

Debe mostrar dos contenedores en estado `Up`: `webserver` (puerto `8080->80`) y `appserver` (puerto `8081->8080`).

### 4.5 Pruebas de funcionamiento desde el navegador

| Servicio | URL | Resultado esperado |
|---|---|---|
| Nginx | <http://localhost:8080> | Página *Welcome to nginx!* |
| Tomcat | <http://localhost:8081> | Página de inicio de Apache Tomcat |

**Nginx (servidor web):** la página *"Welcome to nginx!"* confirma que el servidor está instalado y respondiendo peticiones HTTP.

![Nginx funcionando en localhost:8080](img/03-nginx-8080.png)

*Figura 3. Servidor web Nginx accesible en `http://localhost:8080`.*

**Tomcat (servidor de aplicaciones):** se muestra la página de inicio de **Apache Tomcat/11.0.27** con el mensaje de instalación correcta.

![Tomcat funcionando en localhost:8081](img/04-tomcat-8081.png)

*Figura 4. Servidor de aplicaciones Apache Tomcat 11.0.27 accesible en `http://localhost:8081`.*

> **Observación sobre Tomcat:** las aplicaciones *Manager App* y *Host Manager* están restringidas por defecto por motivos de seguridad. Para usarlas habría que definir usuarios en `$CATALINA_HOME/conf/tomcat-users.xml`.

### 4.6 Comandos útiles de gestión

```bash
docker ps -a              # Lista todos los contenedores (activos y detenidos)
docker logs webserver     # Muestra los registros del contenedor
docker stop webserver appserver    # Detiene los contenedores
docker start webserver appserver   # Los vuelve a iniciar
docker rm -f webserver appserver   # Elimina los contenedores
docker images             # Lista las imágenes descargadas
```

---

## 5. Requisitos mínimos para implantar una aplicación web

### 5.1 Estructura y recursos de una aplicación web

Una aplicación web se compone, normalmente, de:

- **Cliente (front-end):** HTML, CSS y JavaScript que se ejecutan en el navegador.
- **Servidor web:** recibe las peticiones HTTP/HTTPS y sirve contenido estático (Nginx, Apache).
- **Servidor de aplicaciones:** ejecuta la lógica de negocio (Tomcat, WildFly...).
- **Base de datos:** almacena la información persistente (MySQL, PostgreSQL...).
- **Recursos estáticos y configuración:** imágenes, ficheros de configuración, certificados, registros (*logs*).

En esta práctica, Nginx cumple el papel de servidor web y Tomcat el de servidor de aplicaciones, ambos aislados en contenedores.

### 5.2 Requisitos de hardware

Valores orientativos para un entorno de pruebas o pequeña producción:

| Recurso | Mínimo | Recomendado |
|---|---|---|
| CPU | 2 núcleos | 4 o más núcleos |
| RAM | 2 GB | 4–8 GB (Tomcat/Java consume memoria; 4 GB en la VM de esta práctica) |
| Almacenamiento | 20 GB | 50 GB o más, preferiblemente SSD (50 GB en esta práctica) |
| Red | 100 Mbps | 1 Gbps |

### 5.3 Requisitos de software

| Componente | Ejemplo en esta práctica |
|---|---|
| Sistema operativo | Ubuntu 24.04 LTS |
| Virtualización | VirtualBox + Guest Additions |
| Motor de contenedores | Docker Engine / Docker Desktop |
| Servidor web | Nginx |
| Servidor de aplicaciones | Apache Tomcat 11 (requiere un JDK, ya incluido en la imagen) |
| Base de datos (si procede) | MySQL, MariaDB o PostgreSQL |
| Navegador | Firefox / Chrome para las pruebas |

### 5.4 Infraestructura de red

- **Direccionamiento:** IP fija para el servidor en producción y nombre de dominio resuelto por **DNS**.
- **Puertos a abrir:**

  | Puerto | Protocolo | Uso |
  |---|---|---|
  | 80 | HTTP | Servidor web |
  | 443 | HTTPS | Servidor web seguro |
  | 8080 | HTTP | Tomcat (por defecto) / publicado en esta práctica para Nginx |
  | 3306 / 5432 | TCP | Base de datos (solo acceso interno) |

- **Cortafuegos:** permitir únicamente los puertos necesarios.
- **Modo de red en VirtualBox:** NAT permite que la VM acceda a Internet; para acceder a ella desde otros equipos haría falta *reenvío de puertos* o adaptador en modo puente.
- **Redes en Docker:** los contenedores se conectan a una red virtual (`bridge` por defecto) y exponen puertos al anfitrión con `-p`.
- **Buenas prácticas:** proxy inverso (Nginx delante de Tomcat), balanceo de carga si se requiere alta disponibilidad, y separación de la base de datos en una red interna.

### 5.5 Configuración del servidor web y de aplicaciones

**Servidor web (Nginx):**

- Fichero principal: `/etc/nginx/nginx.conf`; sitios en `/etc/nginx/conf.d/`.
- Ruta de contenido estático: `/usr/share/nginx/html`.
- Configurar `server_name`, puerto de escucha, certificados TLS y, si procede, `proxy_pass` hacia Tomcat.
- Montar contenido propio mediante volúmenes, por ejemplo:

```bash
docker run -d -p 8080:80 --name webserver -v $(pwd)/web:/usr/share/nginx/html:ro nginx
```

**Servidor de aplicaciones (Tomcat):**

- Directorio de aplicaciones: `webapps/` (se despliega un archivo `.war`).
- Configuración: `conf/server.xml` (conectores y puertos), `conf/tomcat-users.xml` (usuarios y roles), `conf/web.xml`.
- Parámetros de memoria de la JVM (`-Xms`, `-Xmx`) ajustados al hardware disponible.
- Despliegue de una aplicación con volumen o copia al contenedor:

```bash
docker cp aplicacion.war appserver:/usr/local/tomcat/webapps/
```

**Persistencia:** los datos de un contenedor se pierden al eliminarlo; para conservarlos se usan **volúmenes** o *bind mounts*.

### 5.6 Seguridad y mantenimiento

**Seguridad:**

- Mantener el sistema, Docker y las imágenes **actualizados**.
- Usar **HTTPS/TLS** con certificados válidos (p. ej. Let's Encrypt).
- Aplicar el **principio de mínimo privilegio**: no ejecutar contenedores como `root` cuando sea posible y no exponer puertos innecesarios.
- Restringir o desactivar las aplicaciones de administración de Tomcat (*Manager*, *Host Manager*) y usar contraseñas robustas.
- Configurar un **cortafuegos** (por ejemplo, `ufw`).
- Utilizar imágenes **oficiales** y verificadas de Docker Hub.
- No incluir credenciales dentro de las imágenes; usar variables de entorno o *secrets*.

**Mantenimiento:**

- **Copias de seguridad** periódicas de volúmenes, configuración y base de datos.
- **Monitorización** de recursos y estado (`docker stats`, `docker logs`).
- **Gestión de registros** (*logs*) con rotación para evitar llenar el disco.
- **Actualización** de imágenes (`docker pull`) y recreación de contenedores.
- Limpieza de recursos sin usar: `docker system prune`.
- Documentar la configuración y los procedimientos de despliegue.

---

## 6. Conclusiones

- Se creó correctamente una máquina virtual **Ubuntu 24.04 LTS** en VirtualBox con los recursos recomendados.
- Se instaló **Docker** y se verificó su funcionamiento con `docker run hello-world`.
- Se desplegaron un servidor web (**Nginx**, puerto 8080) y un servidor de aplicaciones (**Tomcat 11.0.27**, puerto 8081) en contenedores y se comprobó su respuesta desde el navegador.
- Los contenedores permiten desplegar servicios en segundos, de forma aislada y reproducible, con un consumo de recursos muy inferior al de una VM completa para cada servicio.

---

## 7. Relación con los criterios de evaluación

| Criterio | Dónde se cubre |
|---|---|
| **1c)** Instalación y configuración básica de servidores web | Apartado 4 (Nginx) y 5.5 |
| **1d)** Instalación y configuración básica de servidores de aplicaciones | Apartado 4 (Tomcat) y 5.5 |
| **1e)** Instalación y configuración básica de tecnologías de virtualización y contenedores | Apartados 2 y 3 |
| **1f)** Pruebas de funcionamiento | Apartados 3.4 y 4.5 (Figuras 2, 3 y 4) |
| **1g)** Análisis de la estructura y recursos de una aplicación web | Apartado 5.1 |
| **1h)** Requerimientos para la implantación de una aplicación web | Apartados 5.2 a 5.6 |
| **1i)** Documentación de los procesos realizados | Todo el informe |
