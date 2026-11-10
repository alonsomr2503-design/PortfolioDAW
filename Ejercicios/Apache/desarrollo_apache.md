# 2. Desarrollo

## 2.1 Entorno de trabajo

Se parte de un servidor Ubuntu con Apache ya instalado, según el paso 2
del tutorial. En él se aloja la web (`[nombre de la máquina o IP]`), y
las pruebas se hacen desde `[equipo cliente]`.

> *\[Captura: página por defecto de Apache, que confirma que la
> instalación es correcta\]*

## 2.2 Creación de la página web personalizada (paso 3)

Por defecto, Apache sirve el contenido de `/var/www/html` y usa el sitio
definido en `000-default.conf`. En lugar de modificarlo, se crea un
sitio nuevo e independiente, que es la práctica recomendable: así el
sitio por defecto queda intacto y se pueden alojar varios sitios en el
mismo servidor.

**1. Se crea el directorio del sitio:**

``` bash
sudo mkdir /var/www/gci/
```

El nombre `gci` es arbitrario. Lo único importante es que después
coincida con lo que se indique en el fichero de configuración.

**2. Se crea la página de inicio:**

``` bash
cd /var/www/gci/
sudo nano index.html
```

Se usa `sudo` porque `/var/www` pertenece a root y, sin él, el editor no
podría guardar el archivo. El tutorial no lo indica, así que es fácil
que aparezca un error de permisos. Si te salió, anótalo en el apartado
de problemas.

**3. Se escribe el contenido personalizado.** El código del tutorial
deja la etiqueta `<p>` sin cerrar. Aquí se corrige y se añade un toque
personal:

``` html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Web de [tu nombre]</title>
</head>
<body>
  <h1>Bienvenido a la web de [tu nombre]</h1>
  <p>Esta página se sirve desde Apache en Ubuntu.</p>
  <p>[Una frase tuya: tu afición, tu curso, una broma...]</p>
</body>
</html>
```

La línea `<meta charset="UTF-8">` evita que las tildes y la «ñ» se vean
mal en el navegador.

> *\[Captura: contenido del directorio y del archivo `index.html`\]*

## 2.3 Configuración del VirtualHost (paso 4)

Un VirtualHost indica a Apache qué sitio debe servir según el nombre con
que se le llame. Se parte del fichero por defecto como plantilla, para
no escribir uno desde cero:

``` bash
cd /etc/apache2/sites-available/
sudo cp 000-default.conf gci.conf
sudo nano gci.conf
```

Se modifican tres directivas:

  -----------------------------------------------------------------------
  Directiva               Valor                   Para qué sirve
  ----------------------- ----------------------- -----------------------
  `ServerAdmin`           `[tu correo]`           Contacto que se muestra
                                                  en los errores del
                                                  servidor

  `DocumentRoot`          `/var/www/gci/`         Carpeta de la que
                                                  Apache lee los archivos
                                                  del sitio

  `ServerName`            `gci.example.com`       Nombre con el que
                                                  Apache identifica este
                                                  sitio
  -----------------------------------------------------------------------

`ServerName` no viene en el fichero por defecto, así que hay que
añadirlo. Sin él, Apache no sabría distinguir este sitio del sitio por
defecto.

> *\[Captura: fichero `gci.conf` ya editado\]*

## 2.4 Activación del VirtualHost (paso 5)

``` bash
sudo a2ensite gci.conf
sudo systemctl reload apache2
```

`a2ensite` no copia nada: crea un enlace simbólico de `sites-available`
a `sites-enabled`, que es la carpeta que Apache realmente lee. El
`reload` aplica el cambio sin cortar las conexiones activas. El tutorial
usa `service apache2 reload`, que equivale a lo anterior. Antes del
reload conviene comprobar la sintaxis:

``` bash
sudo apache2ctl configtest
```

Debe responder `Syntax OK`. Si aparece un aviso `AH00558` sobre el
nombre de dominio, es solo informativo y no impide el funcionamiento.

**Un punto clave para que funcione:** `example.com` es un dominio real
que no apunta a tu servidor. Por eso, en el equipo desde el que se
prueba hay que asociar el nombre a la IP del servidor en el fichero
`hosts`:

-   Linux/macOS: `/etc/hosts`
-   Windows: `C:\Windows\System32\drivers\etc\hosts` (editar como
    administrador)

``` text
[IP-del-servidor]   gci.example.com
```

Sin esta línea, el navegador no encontrará el sitio aunque Apache esté
bien configurado. Este suele ser el problema más habitual.

> *\[Captura: la web personalizada abierta en el navegador con
> `gci.example.com`\]*

## 2.5 Problemas encontrados

  Problema                          Causa       Solución
  --------------------------------- ----------- ------------------------
  `[describe el error o síntoma]`   `[causa]`   `[cómo lo resolviste]`

Si no tuviste ninguno, también se puede decir, aunque suele quedar mejor
reflejar al menos uno aunque sea pequeño.

## 2.6 Banco de pruebas

  ----------------------------------------------------------------------------------------------
                     Nº Prueba                     Resultado esperado           Resultado
                                                                                obtenido
  --------------------- -------------------------- ---------------------------- ----------------
                      1 Abrir `http://[IP]`        Página por defecto de Apache `[ ]`

                      2 Abrir                      Web personalizada            `[ ]`
                        `http://gci.example.com`                                
                        desde el cliente                                        

                      3 Abrir `gci.example.com`    Error de resolución de       `[ ]`
                        sin la línea en `hosts`    nombre                       

                      4 Ejecutar                   `Syntax OK`                  `[ ]`
                        `apache2ctl configtest`                                 

                      5 Acceso desde el equipo de  `[según su configuración]`   `[ ]`
                        un compañero                                            
  ----------------------------------------------------------------------------------------------
