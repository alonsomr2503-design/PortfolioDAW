# Errores corregidos respecto al código original

Comparación entre `original_sin_comentar/buuscaminas.html` y la versión corregida (`buscaminas.html`, `buscaminas.js`, `buscaminas.css`).

| # | Error en el original | Corrección |
|---|---|---|
| 1 | **Ruta de imágenes incorrecta:** `cambiaImagen` buscaba en `./imagenes/`, pero la carpeta se llama `buscaminas_imagenes`. Ninguna casilla mostraba imagen. | Ruta en la constante `RUTA_IMAGENES = "./buscaminas_imagenes/"`. |
| 2 | **Celdas fuera de las filas:** las `td` se añadían directamente a la tabla y los `tr` se añadían vacíos. | Cada `td` se añade a su `tr` y cada `tr` a la tabla. |
| 3 | **Sin fin de partida:** se podía seguir pulsando después de pisar una mina y nunca se detectaba la victoria. | Funciones `perder` (muestra todas las minas, casilla pulsada en rojo) y `ganar`; el estado `estado` bloquea los clics al terminar. |
| 4 | **Banderas sin usar:** existía `bandera.jpg` pero no había forma de marcar minas. | Clic derecho (`alternarBandera`) pone/quita bandera, sin menú contextual. Las casillas con bandera no se destapan, ni siquiera en cadena. Contador de minas restantes. |
| 5 | **Imposible reiniciar** sin recargar la página. | Botón "Nueva partida" que vuelve a montar el tablero y reinicia el estado. |
| 6 | **Se revelaban las minas por consola:** `generarCampo` imprimía siempre el tablero. | Solo se imprime si `DEPURACION` es `true` (por defecto `false`). |
| 7 | **`<script>` después de `</html>`:** HTML inválido. | El script va dentro del `body`, al final, en el fichero externo `buscaminas.js`. |
| 8 | **Título y idioma:** `<title>Document</title>` y `lang="en"`. | `<title>Buscaminas</title>` y `lang="es"`. |
| 9 | **Nombre del fichero con errata:** `buuscaminas.html`. | Renombrado a `buscaminas.html`. |
| 10 | **Recursión mezclada con el clic:** `click` se llamaba a sí misma para el destapado en cadena, por lo que no se podía separar el clic del usuario del destapado. | Separada en `click` (acción del usuario) y `destapar` (recursiva). |

El algoritmo de colocación de minas y de cálculo de números se mantiene igual que en el original.

## Pruebas realizadas

Se comprobó con un DOM simulado (jsdom) que: el tablero tiene 8 filas de 10 celdas; las imágenes existen en disco; en 300 partidas aleatorias el primer clic nunca es una mina, hay siempre 10 minas y los números de cada casilla son correctos; se pierde al pisar una mina y no se puede seguir jugando; se gana al destapar todas las casillas seguras; las banderas se ponen, se quitan y no se destapan; y "Nueva partida" reinicia sin duplicar celdas.
