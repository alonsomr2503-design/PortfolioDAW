## Members

<dl>
<dt><a href="#tableroBackend">tableroBackend</a> : <code>Array.&lt;Array.&lt;number&gt;&gt;</code></dt>
<dd><p>Tablero lógico (backend). <code>tableroBackend[x][y]</code> vale <code>-1</code> si hay una mina
o el número (0-8) de minas adyacentes. Se rellena en <a href="#generarCampo">generarCampo</a>.</p>
</dd>
<dt><a href="#elementos">elementos</a> : <code>Array.&lt;Array.&lt;HTMLTableCellElement&gt;&gt;</code></dt>
<dd><p>Celdas <code>td</code> del DOM, indexadas como <code>elementos[x][y]</code>.</p>
</dd>
<dt><a href="#pulsados">pulsados</a> : <code>Array.&lt;Array.&lt;boolean&gt;&gt;</code></dt>
<dd><p>Casillas ya destapadas, indexadas como <code>pulsados[x][y]</code>.</p>
</dd>
<dt><a href="#banderas">banderas</a> : <code>Array.&lt;Array.&lt;boolean&gt;&gt;</code></dt>
<dd><p>Casillas marcadas con bandera, indexadas como <code>banderas[x][y]</code>.</p>
</dd>
<dt><a href="#primeraVez">primeraVez</a> : <code>boolean</code></dt>
<dd><p>Indica si falta el primer clic de la partida (momento en que se generan las minas).</p>
</dd>
<dt><a href="#estado">estado</a> : <code><a href="#EstadoPartida">EstadoPartida</a></code></dt>
<dd><p>Estado actual de la partida.</p>
</dd>
<dt><a href="#casillasDestapadas">casillasDestapadas</a> : <code>number</code></dt>
<dd><p>Número de casillas sin mina que el jugador ya ha destapado.</p>
</dd>
<dt><a href="#banderasPuestas">banderasPuestas</a> : <code>number</code></dt>
<dd><p>Número de banderas colocadas en el tablero.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#FILAS">FILAS</a> : <code>number</code></dt>
<dd><p>Número de filas del tablero.</p>
</dd>
<dt><a href="#COLUMNAS">COLUMNAS</a> : <code>number</code></dt>
<dd><p>Número de columnas del tablero.</p>
</dd>
<dt><a href="#MINAS">MINAS</a> : <code>number</code></dt>
<dd><p>Número de minas que se colocan en el tablero.</p>
</dd>
<dt><a href="#RUTA_IMAGENES">RUTA_IMAGENES</a> : <code>string</code></dt>
<dd><p>Carpeta donde están las imágenes de las casillas.</p>
</dd>
<dt><a href="#DEPURACION">DEPURACION</a> : <code>boolean</code></dt>
<dd><p>Si es <code>true</code>, se imprime el tablero lógico en la consola al generar el campo
(solo para depurar: revela dónde están las minas).</p>
</dd>
<dt><a href="#IMG_BOTON">IMG_BOTON</a> : <code>number</code></dt>
<dd><p>Código de imagen para una casilla sin destapar (botón).</p>
</dd>
<dt><a href="#IMG_BANDERA">IMG_BANDERA</a> : <code>number</code></dt>
<dd><p>Código de imagen para una casilla con bandera.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#imprimirMatriz">imprimirMatriz(matriz)</a> ⇒ <code>void</code></dt>
<dd><p>Muestra una matriz por la consola del navegador (útil para depurar).
Imprime una línea por fila, es decir, la matriz traspuesta respecto a <code>matriz[x][y]</code>.</p>
</dd>
<dt><a href="#generarCampo">generarCampo(x, y)</a> ⇒ <code>void</code></dt>
<dd><p>Genera el campo de minas y calcula los números de cada casilla.</p>
<ol>
<li>Crea la matriz <code>tableroBackend</code>.</li>
<li>Coloca <a href="#MINAS">MINAS</a> minas aleatorias (valor <code>-1</code>), evitando la casilla <code>(x, y)</code>.</li>
<li>Para cada casilla sin mina cuenta las minas de sus 8 vecinas.</li>
<li>Si <a href="#DEPURACION">DEPURACION</a> es <code>true</code>, muestra el resultado en consola.</li>
</ol>
<p>Se llama una sola vez por partida, en el primer clic de <a href="#click">click</a>.</p>
</dd>
<dt><a href="#cambiaImagen">cambiaImagen(elemento, imagen)</a> ⇒ <code>void</code></dt>
<dd><p>Cambia la imagen de fondo de una celda según su valor.</p>
<p>Valores: <code>0</code>-<code>8</code> muestran <code>a0</code>-<code>a8</code> (minas adyacentes), <code>-1</code> muestra <code>mina</code>,
<a href="#IMG_BANDERA">IMG_BANDERA</a> muestra <code>bandera</code> y cualquier otro valor (p. ej.
<a href="#IMG_BOTON">IMG_BOTON</a>) muestra <code>boton</code> (casilla sin destapar).
Las imágenes se buscan en <a href="#RUTA_IMAGENES">RUTA_IMAGENES</a>.</p>
</dd>
<dt><a href="#actualizarInfo">actualizarInfo(texto)</a> ⇒ <code>void</code></dt>
<dd><p>Escribe el mensaje de estado y actualiza el contador de minas restantes
(minas totales menos banderas puestas; puede ser negativo si se ponen de más).</p>
</dd>
<dt><a href="#destapar">destapar(x, y)</a> ⇒ <code>void</code></dt>
<dd><p>Destapa una casilla y, si no tiene minas alrededor (valor <code>0</code>), se llama a sí
misma para las 8 vecinas (destapado en cadena, recursivo).
Ignora las casillas ya destapadas y las que tienen bandera.</p>
</dd>
<dt><a href="#perder">perder(x, y)</a> ⇒ <code>void</code></dt>
<dd><p>Termina la partida como derrota: muestra todas las minas sin bandera y marca
en rojo la casilla que explotó.</p>
</dd>
<dt><a href="#ganar">ganar()</a> ⇒ <code>void</code></dt>
<dd><p>Termina la partida como victoria: pone bandera a las minas que quedaban sin marcar.</p>
</dd>
<dt><a href="#click">click(x, y)</a> ⇒ <code>void</code></dt>
<dd><p>Gestiona el clic izquierdo sobre una casilla.</p>
<ul>
<li>No hace nada si la partida ha terminado, o si la casilla tiene bandera o ya está destapada.</li>
<li>En el primer clic genera el campo con <a href="#generarCampo">generarCampo</a>.</li>
<li>Si hay una mina, llama a <a href="#perder">perder</a>.</li>
<li>Si no, destapa con <a href="#destapar">destapar</a> y llama a <a href="#ganar">ganar</a> si ya no quedan casillas seguras.</li>
</ul>
</dd>
<dt><a href="#alternarBandera">alternarBandera(x, y)</a> ⇒ <code>void</code></dt>
<dd><p>Gestiona el clic derecho sobre una casilla: pone o quita una bandera.
No hace nada si la partida ha terminado o la casilla ya está destapada.</p>
</dd>
<dt><a href="#montarTablero">montarTablero()</a> ⇒ <code>void</code></dt>
<dd><p>Construye (o reconstruye) el tablero en el DOM y reinicia el estado del juego.</p>
<p>Vacía la tabla <code>#tablero</code>, inicializa las matrices <a href="#elementos">elementos</a>,
<a href="#pulsados">pulsados</a> y <a href="#banderas">banderas</a>, y crea una fila <code>tr</code> por cada fila del
tablero con sus celdas <code>td</code>. Cada celda recibe un evento de clic izquierdo
(<a href="#click">click</a>) y de clic derecho (<a href="#alternarBandera">alternarBandera</a>, sin menú contextual).
Se ejecuta al cargar el script y al pulsar &quot;Nueva partida&quot;.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#EstadoPartida">EstadoPartida</a> : <code>&quot;jugando&quot;</code> | <code>&quot;ganado&quot;</code> | <code>&quot;perdido&quot;</code></dt>
<dd><p>Estado de la partida.</p>
</dd>
</dl>

<a name="tableroBackend"></a>

## tableroBackend : <code>Array.&lt;Array.&lt;number&gt;&gt;</code>
Tablero lógico (backend). `tableroBackend[x][y]` vale `-1` si hay una mina
o el número (0-8) de minas adyacentes. Se rellena en [generarCampo](#generarCampo).

**Kind**: global variable  
<a name="elementos"></a>

## elementos : <code>Array.&lt;Array.&lt;HTMLTableCellElement&gt;&gt;</code>
Celdas `td` del DOM, indexadas como `elementos[x][y]`.

**Kind**: global variable  
<a name="pulsados"></a>

## pulsados : <code>Array.&lt;Array.&lt;boolean&gt;&gt;</code>
Casillas ya destapadas, indexadas como `pulsados[x][y]`.

**Kind**: global variable  
<a name="banderas"></a>

## banderas : <code>Array.&lt;Array.&lt;boolean&gt;&gt;</code>
Casillas marcadas con bandera, indexadas como `banderas[x][y]`.

**Kind**: global variable  
<a name="primeraVez"></a>

## primeraVez : <code>boolean</code>
Indica si falta el primer clic de la partida (momento en que se generan las minas).

**Kind**: global variable  
<a name="estado"></a>

## estado : [<code>EstadoPartida</code>](#EstadoPartida)
Estado actual de la partida.

**Kind**: global variable  
<a name="casillasDestapadas"></a>

## casillasDestapadas : <code>number</code>
Número de casillas sin mina que el jugador ya ha destapado.

**Kind**: global variable  
<a name="banderasPuestas"></a>

## banderasPuestas : <code>number</code>
Número de banderas colocadas en el tablero.

**Kind**: global variable  
<a name="FILAS"></a>

## FILAS : <code>number</code>
Número de filas del tablero.

**Kind**: global constant  
**Default**: <code>8</code>  
<a name="COLUMNAS"></a>

## COLUMNAS : <code>number</code>
Número de columnas del tablero.

**Kind**: global constant  
**Default**: <code>10</code>  
<a name="MINAS"></a>

## MINAS : <code>number</code>
Número de minas que se colocan en el tablero.

**Kind**: global constant  
**Default**: <code>10</code>  
<a name="RUTA_IMAGENES"></a>

## RUTA\_IMAGENES : <code>string</code>
Carpeta donde están las imágenes de las casillas.

**Kind**: global constant  
**Default**: <code>&quot;\&quot;./buscaminas_imagenes/\&quot;&quot;</code>  
<a name="DEPURACION"></a>

## DEPURACION : <code>boolean</code>
Si es `true`, se imprime el tablero lógico en la consola al generar el campo
(solo para depurar: revela dónde están las minas).

**Kind**: global constant  
**Default**: <code>false</code>  
<a name="IMG_BOTON"></a>

## IMG\_BOTON : <code>number</code>
Código de imagen para una casilla sin destapar (botón).

**Kind**: global constant  
**Default**: <code>-2</code>  
<a name="IMG_BANDERA"></a>

## IMG\_BANDERA : <code>number</code>
Código de imagen para una casilla con bandera.

**Kind**: global constant  
**Default**: <code>-3</code>  
<a name="imprimirMatriz"></a>

## imprimirMatriz(matriz) ⇒ <code>void</code>
Muestra una matriz por la consola del navegador (útil para depurar).
Imprime una línea por fila, es decir, la matriz traspuesta respecto a `matriz[x][y]`.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| matriz | <code>Array.&lt;Array.&lt;number&gt;&gt;</code> | Matriz indexada como `matriz[x][y]`. |

<a name="generarCampo"></a>

## generarCampo(x, y) ⇒ <code>void</code>
Genera el campo de minas y calcula los números de cada casilla.

1. Crea la matriz `tableroBackend`.
2. Coloca [MINAS](#MINAS) minas aleatorias (valor `-1`), evitando la casilla `(x, y)`.
3. Para cada casilla sin mina cuenta las minas de sus 8 vecinas.
4. Si [DEPURACION](#DEPURACION) es `true`, muestra el resultado en consola.

Se llama una sola vez por partida, en el primer clic de [click](#click).

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | Columna de la primera casilla pulsada (sin mina). |
| y | <code>number</code> | Fila de la primera casilla pulsada (sin mina). |

<a name="cambiaImagen"></a>

## cambiaImagen(elemento, imagen) ⇒ <code>void</code>
Cambia la imagen de fondo de una celda según su valor.

Valores: `0`-`8` muestran `a0`-`a8` (minas adyacentes), `-1` muestra `mina`,
[IMG_BANDERA](#IMG_BANDERA) muestra `bandera` y cualquier otro valor (p. ej.
[IMG_BOTON](#IMG_BOTON)) muestra `boton` (casilla sin destapar).
Las imágenes se buscan en [RUTA_IMAGENES](#RUTA_IMAGENES).

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| elemento | <code>HTMLTableCellElement</code> | Celda `td` a modificar. |
| imagen | <code>number</code> | Valor de la casilla (`-1` mina, `0`-`8` número, [IMG_BANDERA](#IMG_BANDERA), otro = botón). |

<a name="actualizarInfo"></a>

## actualizarInfo(texto) ⇒ <code>void</code>
Escribe el mensaje de estado y actualiza el contador de minas restantes
(minas totales menos banderas puestas; puede ser negativo si se ponen de más).

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| texto | <code>string</code> | Mensaje a mostrar encima del tablero. |

<a name="destapar"></a>

## destapar(x, y) ⇒ <code>void</code>
Destapa una casilla y, si no tiene minas alrededor (valor `0`), se llama a sí
misma para las 8 vecinas (destapado en cadena, recursivo).
Ignora las casillas ya destapadas y las que tienen bandera.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | Columna de la casilla (0..COLUMNAS-1). |
| y | <code>number</code> | Fila de la casilla (0..FILAS-1). |

<a name="perder"></a>

## perder(x, y) ⇒ <code>void</code>
Termina la partida como derrota: muestra todas las minas sin bandera y marca
en rojo la casilla que explotó.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | Columna de la mina pulsada. |
| y | <code>number</code> | Fila de la mina pulsada. |

<a name="ganar"></a>

## ganar() ⇒ <code>void</code>
Termina la partida como victoria: pone bandera a las minas que quedaban sin marcar.

**Kind**: global function  
<a name="click"></a>

## click(x, y) ⇒ <code>void</code>
Gestiona el clic izquierdo sobre una casilla.

- No hace nada si la partida ha terminado, o si la casilla tiene bandera o ya está destapada.
- En el primer clic genera el campo con [generarCampo](#generarCampo).
- Si hay una mina, llama a [perder](#perder).
- Si no, destapa con [destapar](#destapar) y llama a [ganar](#ganar) si ya no quedan casillas seguras.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | Columna de la casilla (0..COLUMNAS-1). |
| y | <code>number</code> | Fila de la casilla (0..FILAS-1). |

<a name="alternarBandera"></a>

## alternarBandera(x, y) ⇒ <code>void</code>
Gestiona el clic derecho sobre una casilla: pone o quita una bandera.
No hace nada si la partida ha terminado o la casilla ya está destapada.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | Columna de la casilla (0..COLUMNAS-1). |
| y | <code>number</code> | Fila de la casilla (0..FILAS-1). |

<a name="montarTablero"></a>

## montarTablero() ⇒ <code>void</code>
Construye (o reconstruye) el tablero en el DOM y reinicia el estado del juego.

Vacía la tabla `#tablero`, inicializa las matrices [elementos](#elementos),
[pulsados](#pulsados) y [banderas](#banderas), y crea una fila `tr` por cada fila del
tablero con sus celdas `td`. Cada celda recibe un evento de clic izquierdo
([click](#click)) y de clic derecho ([alternarBandera](#alternarBandera), sin menú contextual).
Se ejecuta al cargar el script y al pulsar "Nueva partida".

**Kind**: global function  
<a name="EstadoPartida"></a>

## EstadoPartida : <code>&quot;jugando&quot;</code> \| <code>&quot;ganado&quot;</code> \| <code>&quot;perdido&quot;</code>
Estado de la partida.

**Kind**: global typedef
