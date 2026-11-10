# Implementación de HTTPS en un servidor Apache2 sobre Ubuntu

**Autor:** [tu nombre]
**Centro / Asignatura:** [centro educativo] · [asignatura] · [curso]
**Fecha:** [fecha de entrega]

## Resumen

Este documento recoge la investigación y la implementación del protocolo HTTPS en un servidor web Apache2 que se ejecuta sobre Ubuntu. En la parte teórica se explica el funcionamiento de HTTPS y TLS, se comparan los certificados autofirmados con los emitidos por una autoridad de certificación (CA) y se identifican los módulos de Apache necesarios. En la parte práctica se instala y verifica Apache, se habilitan los módulos `ssl` y `headers`, se genera un certificado autofirmado, se configura un VirtualHost en el puerto 443 y se redirige el tráfico HTTP a HTTPS. Por último, se valida el resultado con el navegador y con `curl`. La opción de Let's Encrypt con Certbot se describe y se contrasta con la autofirmada. El resultado es un sitio accesible por `https://` con cifrado TLS, y la experiencia sirve para entender qué papel cumple cada pieza (certificado, clave, módulo y VirtualHost) en una conexión segura.

**Palabras clave:** HTTPS, TLS, SSL, Apache2, certificado autofirmado, Let's Encrypt, Certbot, VirtualHost, HSTS, Ubuntu.

## Índice

1. [Introducción](#1-introducción)
2. [Investigación teórica](#2-investigación-teórica)
3. [Implementación paso a paso](#3-implementación-paso-a-paso)
4. [Verificación y resultados](#4-verificación-y-resultados)
5. [Dificultades encontradas](#5-dificultades-encontradas)
6. [Conclusiones](#6-conclusiones)
7. [Bibliografía](#7-bibliografía)
8. [Anexos](#8-anexos)

---

## 1. Introducción

### 1.1 Contexto

El trabajo se realiza en [centro educativo], dentro de [asignatura], como continuación de las prácticas previas con Apache, en las que ya se dispone de un sitio web servido mediante un VirtualHost (`gci.example.com`). Esta práctica añade la capa de seguridad que le faltaba: el cifrado de las comunicaciones.

### 1.2 Objetivos

- Comprender cómo funciona HTTPS y por qué es necesario.
- Distinguir los tipos de certificados SSL/TLS y cuándo conviene cada uno.
- Habilitar los módulos de Apache necesarios y configurar un VirtualHost seguro.
- Forzar la redirección de HTTP a HTTPS.
- Verificar el funcionamiento desde el navegador y desde la línea de comandos.

### 1.3 Entorno

| Elemento | Valor |
|---|---|
| Sistema operativo | Ubuntu `[versión, p. ej. 22.04 / 24.04]` |
| Servidor web | Apache2 `[versión, resultado de apache2 -v]` |
| Máquina | `[máquina virtual / equipo físico]` |
| IP del servidor | `[IP]` |
| Nombre del sitio | `gci.example.com` |
| Cliente de pruebas | `[equipo y navegador]` |

---

## 2. Investigación teórica

### 2.1 ¿Qué es HTTPS y cómo funciona?

HTTPS (*HyperText Transfer Protocol Secure*) es el protocolo HTTP transportado sobre una conexión cifrada mediante **TLS** (*Transport Layer Security*). Utiliza por defecto el puerto **443**, mientras que HTTP usa el 80. SSL es el nombre del protocolo antiguo, hoy obsoleto; aunque se sigue hablando de «certificados SSL», en la práctica se usa TLS 1.2 o TLS 1.3.

HTTPS proporciona tres garantías:

| Garantía | Qué significa | Cómo se consigue |
|---|---|---|
| **Confidencialidad** | Nadie en el camino puede leer los datos | Cifrado simétrico de la sesión |
| **Integridad** | Los datos no se alteran sin que se detecte | Códigos de autenticación de mensajes |
| **Autenticación** | El servidor es quien dice ser | Certificado digital firmado por una CA |

**Funcionamiento simplificado del establecimiento de la conexión (*handshake*):**

1. El cliente envía un *ClientHello* con las versiones de TLS y los algoritmos de cifrado que soporta.
2. El servidor responde con el algoritmo elegido y envía su **certificado**, que contiene su clave pública.
3. El cliente comprueba el certificado: que esté firmado por una CA en la que confía, que no haya caducado y que el nombre coincida con el dominio visitado.
4. Cliente y servidor acuerdan, mediante intercambio de claves (normalmente ECDHE), una **clave de sesión** que solo ellos conocen.
5. A partir de ahí, todo el tráfico HTTP se cifra con esa clave simétrica, que es mucho más rápida que la criptografía asimétrica.

### 2.2 Importancia en la seguridad web

- Evita que contraseñas, formularios o cookies viajen en texto plano y puedan ser capturados (ataques de escucha o *sniffing*).
- Dificulta los ataques de intermediario (*man-in-the-middle*), al autenticar al servidor.
- Es un requisito de facto: los navegadores marcan como «no seguros» los sitios HTTP, y funciones modernas del navegador exigen HTTPS.
- Mejora la confianza del usuario y es un factor tenido en cuenta por los buscadores.
- Ayuda al cumplimiento normativo cuando se tratan datos personales.

Como refuerzo, se puede usar la cabecera **HSTS** (*HTTP Strict Transport Security*), que indica al navegador que solo debe conectarse a ese sitio por HTTPS durante un tiempo determinado.

### 2.3 Tipos de certificados: autofirmado frente a CA confiable

| Aspecto | Autofirmado | Emitido por CA confiable (p. ej. Let's Encrypt) |
|---|---|---|
| Quién lo firma | El propio servidor | Una autoridad de certificación reconocida |
| Confianza del navegador | **No** (muestra advertencia) | **Sí**, sin avisos |
| Coste | Gratuito | Let's Encrypt es gratuito; otras CA pueden cobrar |
| Requisitos | Ninguno | Dominio público real y servidor accesible desde Internet |
| Validez | La que se decida (p. ej. 365 días) | Corta (unos 90 días en Let's Encrypt), con renovación automática |
| Uso recomendado | Pruebas, laboratorio, redes internas | Sitios en producción |
| Cifrado | Igual de robusto | Igual de robusto |

La diferencia fundamental no está en la fortaleza del cifrado, sino en la **confianza**: un certificado autofirmado cifra igual, pero el navegador no puede verificar que el servidor sea quien dice ser. Por eso, en entornos reales se usa una CA, y en laboratorio, uno autofirmado.

Existen además distintos niveles de validación (DV, OV y EV) según cuánto verifique la CA sobre el titular. Let's Encrypt emite certificados DV (validación de dominio).

### 2.4 Módulos de Apache2 necesarios

| Módulo | Función | Necesario |
|---|---|---|
| `mod_ssl` | Implementa SSL/TLS en Apache; añade directivas `SSLEngine`, `SSLCertificateFile`, etc. | Imprescindible |
| `mod_headers` | Permite añadir o modificar cabeceras HTTP, como HSTS | Recomendado |
| `mod_alias` | Proporciona `Redirect`. Viene activado por defecto en Ubuntu | Para la redirección |
| `mod_rewrite` | Alternativa más flexible para redirigir con reglas | Opcional |
| `mod_socache_shmcb` | Caché de sesiones TLS. Se habilita junto con `ssl` | Dependencia |

En Ubuntu, los módulos se activan con `a2enmod` y se desactivan con `a2dismod`.

---

## 3. Implementación paso a paso

> **Nota sobre las capturas.** Las imágenes se enlazan desde la carpeta `capturas/`. Sustituye cada ruta por tu captura real.

### 3.1 Instalación y verificación de Apache2

```bash
sudo apt update
sudo apt install apache2
```

Se comprueba que el servicio está activo y la versión instalada:

```bash
sudo systemctl status apache2
apache2 -v
```

También se verifica que escucha en el puerto 80:

```bash
sudo ss -tlnp | grep apache2
```

![Estado de Apache2 activo](capturas/01_apache_status.png)

*Figura 1. Apache2 instalado y en ejecución.*

### 3.2 Habilitación de los módulos SSL y headers

```bash
sudo a2enmod ssl headers
sudo systemctl restart apache2
```

Es necesario **reiniciar** (no basta con recargar) porque se han cargado módulos nuevos. Para comprobar que están activos:

```bash
apache2ctl -M | grep -E "ssl|headers"
```

Debe aparecer `ssl_module` y `headers_module`.

![Módulos habilitados](capturas/02_modulos.png)

*Figura 2. Módulos `ssl` y `headers` habilitados.*

### 3.3 Generación del certificado

#### Opción A: certificado autofirmado (la implementada)

Se elige esta opción porque el sitio se prueba con el nombre local `gci.example.com`, que no es un dominio público real, y Let's Encrypt solo emite certificados para dominios que pueda verificar desde Internet.

```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/gci-selfsigned.key \
  -out /etc/ssl/certs/gci-selfsigned.crt \
  -subj "/C=ES/O=[tu centro]/CN=gci.example.com" \
  -addext "subjectAltName=DNS:gci.example.com"
```

Qué hace cada parte:

| Parámetro | Significado |
|---|---|
| `req -x509` | Genera directamente un certificado autofirmado, en lugar de una solicitud de firma |
| `-nodes` | No cifra la clave privada con contraseña, para que Apache arranque sin pedirla |
| `-days 365` | Validez de un año |
| `-newkey rsa:2048` | Crea una clave RSA de 2048 bits nueva |
| `-keyout` / `-out` | Rutas de la clave privada y del certificado |
| `-subj` | Datos del titular; `CN` debe coincidir con el nombre del sitio |
| `-addext "subjectAltName=..."` | Añade el nombre alternativo (SAN), que los navegadores modernos exigen |

Se protegen los permisos de la clave privada, que nunca debe ser legible por otros usuarios:

```bash
sudo chmod 600 /etc/ssl/private/gci-selfsigned.key
```

Se comprueba el contenido del certificado:

```bash
openssl x509 -in /etc/ssl/certs/gci-selfsigned.crt -noout -subject -dates -ext subjectAltName
```

![Generación del certificado](capturas/03_certificado.png)

*Figura 3. Generación y comprobación del certificado autofirmado.*

#### Opción B: Let's Encrypt con Certbot (descripción)

Esta opción requiere un **dominio público** cuyo DNS apunte a la IP pública del servidor y que los puertos 80 y 443 sean accesibles desde Internet. Como no se dispone de ello en el entorno de laboratorio, se documenta el procedimiento sin ejecutarlo `[o: se ejecutó en ... — ajusta según el caso]`.

```bash
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d midominio.ejemplo.org
```

Certbot valida el control del dominio (reto HTTP-01), obtiene el certificado, crea o modifica el VirtualHost 443 y puede configurar la redirección automáticamente. La renovación se programa de forma automática y se puede probar con:

```bash
sudo certbot renew --dry-run
```

### 3.4 Configuración del VirtualHost en el puerto 443

Se crea un fichero propio para el sitio seguro:

```bash
sudo nano /etc/apache2/sites-available/gci-ssl.conf
```

Con el siguiente contenido:

```apache
<VirtualHost *:443>
    ServerAdmin [tu correo]
    ServerName gci.example.com
    DocumentRoot /var/www/gci

    SSLEngine on
    SSLCertificateFile    /etc/ssl/certs/gci-selfsigned.crt
    SSLCertificateKeyFile /etc/ssl/private/gci-selfsigned.key

    # Cabeceras de seguridad (requieren mod_headers)
    Header always set X-Content-Type-Options "nosniff"
    Header always set Strict-Transport-Security "max-age=300"

    ErrorLog  ${APACHE_LOG_DIR}/gci-ssl-error.log
    CustomLog ${APACHE_LOG_DIR}/gci-ssl-access.log combined
</VirtualHost>
```

Explicación de las directivas clave:

- `<VirtualHost *:443>`: atiende las conexiones entrantes por el puerto 443.
- `SSLEngine on`: activa TLS para este VirtualHost.
- `SSLCertificateFile` / `SSLCertificateKeyFile`: indican el certificado y su clave privada.
- `Header always set Strict-Transport-Security`: activa HSTS. Se usa un `max-age` corto (300 s) durante las pruebas; en producción suele ser de un año o más, y solo debe subirse cuando se está seguro de que HTTPS funciona bien, porque el navegador recuerda esa instrucción.

Se activa el sitio y se comprueba la sintaxis antes de recargar:

```bash
sudo a2ensite gci-ssl.conf
sudo apache2ctl configtest
```

Si el cortafuegos UFW estuviera activo, hay que permitir el tráfico:

```bash
sudo ufw allow 'Apache Full'
```

![VirtualHost SSL](capturas/04_vhost_ssl.png)

*Figura 4. Contenido de `gci-ssl.conf` y resultado de `configtest`.*

### 3.5 Redirección de HTTP a HTTPS

Se edita el VirtualHost del puerto 80 creado en la práctica anterior:

```bash
sudo nano /etc/apache2/sites-available/gci.conf
```

Se añade, dentro de `<VirtualHost *:80>`:

```apache
Redirect permanent / https://gci.example.com/
```

`Redirect` pertenece a `mod_alias`, ya activo por defecto. Una alternativa equivalente con `mod_rewrite` sería:

```apache
RewriteEngine On
RewriteRule ^/?(.*) https://%{SERVER_NAME}/$1 [R=301,L]
```

**Consejo:** el código 301 (permanente) lo guardan en caché los navegadores. Durante las pruebas conviene usar `Redirect 302 / ...` para evitar quedarse con una redirección antigua, y cambiar a `permanent` cuando todo funcione.

![Redirección](capturas/05_redireccion.png)

*Figura 5. Configuración de la redirección en el puerto 80.*

### 3.6 Recarga de Apache

```bash
sudo apache2ctl configtest
sudo systemctl reload apache2
```

Se confirma que ahora escucha en ambos puertos:

```bash
sudo ss -tlnp | grep apache2
```

Deben aparecer los puertos 80 y 443.

### 3.7 Resolución del nombre en el cliente

Como `example.com` es un dominio que no apunta al servidor, en el equipo cliente se añade una línea al fichero `hosts`:

| Sistema | Fichero |
|---|---|
| Linux / macOS | `/etc/hosts` |
| Windows | `C:\Windows\System32\drivers\etc\hosts` (como administrador) |

```
[IP-del-servidor]   gci.example.com
```

---

## 4. Verificación y resultados

### 4.1 Prueba desde el navegador

Al abrir `https://gci.example.com`, el navegador muestra una **advertencia de certificado no confiable**, comportamiento esperado en un certificado autofirmado, ya que ninguna CA conocida lo ha firmado. Tras aceptar la excepción, se carga la web personalizada y se puede consultar el certificado desde el icono del candado.

![Advertencia del navegador](capturas/06_advertencia.png)

*Figura 6. Advertencia por certificado autofirmado.*

![Sitio por HTTPS](capturas/07_https_ok.png)

*Figura 7. Sitio cargado mediante `https://gci.example.com`.*

![Detalle del certificado](capturas/08_detalle_certificado.png)

*Figura 8. Detalles del certificado en el navegador.*

### 4.2 Pruebas con curl

**Redirección HTTP → HTTPS:**

```bash
curl -I http://gci.example.com
```

Resultado esperado: código `301` (o `302` si se usó para pruebas) y una cabecera `Location: https://gci.example.com/`.

**Acceso HTTPS** (`-k` omite la verificación porque el certificado es autofirmado):

```bash
curl -kI https://gci.example.com
```

Resultado esperado: `HTTP/1.1 200 OK` y las cabeceras de seguridad configuradas.

**Verificación confiando explícitamente en el certificado propio**, sin saltarse la comprobación:

```bash
curl --cacert /etc/ssl/certs/gci-selfsigned.crt -I https://gci.example.com
```

**Inspección del handshake TLS:**

```bash
openssl s_client -connect gci.example.com:443 -servername gci.example.com
```

Muestra la versión de TLS negociada, el cifrado y la cadena del certificado.

![Resultados de curl](capturas/09_curl.png)

*Figura 9. Salida de las pruebas con `curl`.*

### 4.3 Banco de pruebas

| Nº | Prueba | Resultado esperado | Resultado obtenido |
|---|---|---|---|
| 1 | `systemctl status apache2` | Servicio activo | `[ ]` |
| 2 | `apache2ctl -M \| grep ssl` | `ssl_module` cargado | `[ ]` |
| 3 | `apache2ctl configtest` | `Syntax OK` | `[ ]` |
| 4 | `ss -tlnp \| grep apache2` | Puertos 80 y 443 abiertos | `[ ]` |
| 5 | `curl -I http://gci.example.com` | 301/302 hacia HTTPS | `[ ]` |
| 6 | `curl -kI https://gci.example.com` | 200 OK | `[ ]` |
| 7 | Navegador a `https://...` | Advertencia y, tras aceptarla, la web | `[ ]` |
| 8 | Navegador a `http://...` | Redirige a HTTPS | `[ ]` |
| 9 | `openssl s_client` | TLS 1.2 o 1.3 negociado | `[ ]` |
| 10 | Acceso desde otro equipo `[compañero]` | `[según configuración]` | `[ ]` |

### 4.4 Resumen de resultados

[Redacta aquí, de forma impersonal, lo logrado: «Se ha conseguido servir el sitio mediante HTTPS con TLS `[versión]`, así como redirigir el tráfico HTTP...». Si lo comparas con otros compañeros, indica si usaron la misma opción de certificado y qué diferencias hubo.]

---

## 5. Dificultades encontradas

Sustituye esta tabla por los problemas que realmente te surgieron. Abajo tienes problemas **habituales** en esta práctica; conserva solo los que te ocurrieron.

| Problema | Causa | Solución |
|---|---|---|
| `[tu problema real]` | `[causa]` | `[solución]` |
| *(si ocurrió)* El navegador no encuentra `gci.example.com` | Falta la línea en el fichero `hosts` del cliente | Añadir IP y nombre al `hosts` |
| *(si ocurrió)* Apache no arranca tras activar el sitio SSL | Ruta incorrecta al certificado o la clave | Revisar con `apache2ctl configtest` y corregir las rutas |
| *(si ocurrió)* No se puede acceder por el puerto 443 | Cortafuegos bloqueando el tráfico | `sudo ufw allow 'Apache Full'` |
| *(si ocurrió)* La redirección sigue activa tras cambiarla | El navegador cacheó el 301 | Probar en ventana privada o usar 302 durante las pruebas |
| *(si ocurrió)* Error de permisos al leer la clave privada | Permisos o ubicación incorrectos | Revisar `chmod 600` y que esté en `/etc/ssl/private/` |
| *(si ocurrió)* El navegador rechaza el certificado por nombre | Falta el SAN en el certificado | Regenerarlo con `-addext "subjectAltName=..."` |

---

## 6. Conclusiones

Se ha logrado implementar HTTPS en Apache2 sobre Ubuntu, cumpliendo los objetivos planteados: se han habilitado los módulos necesarios, generado un certificado autofirmado, configurado un VirtualHost en el puerto 443 y forzado la redirección desde HTTP. Las pruebas realizadas confirman que el acceso se produce de forma cifrada.

La investigación ha permitido concluir que:

- HTTPS aporta confidencialidad, integridad y autenticación, y hoy se considera un requisito básico en cualquier sitio web.
- Un certificado autofirmado ofrece el mismo cifrado que uno de una CA, pero **no confianza**, por lo que su uso queda limitado a pruebas y entornos internos.
- Let's Encrypt y Certbot hacen que obtener y renovar certificados de confianza sea sencillo y gratuito, siempre que se disponga de un dominio público.

**Valoración personal:** [Escribe aquí, en primera persona, qué te ha parecido la práctica, qué has aprendido, qué te ha costado más y qué mejorarías o ampliarías, por ejemplo probando Let's Encrypt con un dominio real o ajustando los protocolos y cifrados permitidos.]

---

## 7. Bibliografía

Comprueba cada enlace y añade la fecha de consulta.

- Apache Software Foundation. *Apache Module mod_ssl*. https://httpd.apache.org/docs/2.4/mod/mod_ssl.html
- Apache Software Foundation. *SSL/TLS Strong Encryption: How-To*. https://httpd.apache.org/docs/2.4/ssl/ssl_howto.html
- Apache Software Foundation. *Apache Module mod_headers*. https://httpd.apache.org/docs/2.4/mod/mod_headers.html
- Canonical. *Install and Configure Apache*. https://ubuntu.com/tutorials/install-and-configure-apache
- Let's Encrypt. *Documentación*. https://letsencrypt.org/docs/
- EFF. *Certbot*. https://certbot.eff.org/
- Rescorla, E. (2018). *RFC 8446: The Transport Layer Security (TLS) Protocol Version 1.3*. https://www.rfc-editor.org/rfc/rfc8446
- OpenSSL Project. *Documentación de `openssl req`*. https://docs.openssl.org/

*(Consultado el [fecha].)*

---

## 8. Anexos

### Anexo A. Fichero `gci-ssl.conf` completo

```apache
[pega aquí tu fichero final]
```

### Anexo B. Fichero `gci.conf` (puerto 80) completo

```apache
[pega aquí tu fichero final]
```

### Anexo C. Comandos de referencia

| Comando | Utilidad |
|---|---|
| `a2enmod` / `a2dismod` | Activar / desactivar módulos |
| `a2ensite` / `a2dissite` | Activar / desactivar sitios |
| `apache2ctl configtest` | Comprobar la sintaxis de la configuración |
| `systemctl reload apache2` | Recargar la configuración sin cortar conexiones |
| `tail -f /var/log/apache2/gci-ssl-error.log` | Ver errores en tiempo real |
