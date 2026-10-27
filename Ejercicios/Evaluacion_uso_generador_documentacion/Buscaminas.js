/**
 * @file Lógica del juego Buscaminas.
 * @author Alonso Mariblanca
 * @version 2.0.0
 *
 * @description
 * Buscaminas de 10 columnas x 8 filas con 10 minas. El tablero se dibuja en
 * una tabla HTML (`#tablero`).
 *
 * Reglas implementadas:
 * - Clic izquierdo: destapa una casilla. Si no tiene minas alrededor (valor 0)
 *   se destapan en cadena las vecinas.
 * - Clic derecho: pone o quita una bandera (las casillas con bandera no se destapan).
 * - Las minas se colocan en el primer clic, así la primera casilla nunca tiene mina.
 * - Se pierde al destapar una mina (se muestran todas las minas).
 * - Se gana al destapar todas las casillas sin mina.
 * - El botón "Nueva partida" reinicia el juego.
 *
 * Convención de coordenadas: `x` = columna (0..COLUMNAS-1), `y` = fila (0..FILAS-1).
 * Las matrices se indexan como `matriz[x][y]`.
 */

/**
 * Estado de la partida.
 * @typedef {"jugando"|"ganado"|"perdido"} EstadoPartida
 */

/**
 * Número de filas del tablero.
 * @constant {number}
 * @default 8
 */
const FILAS = 8;

/**
 * Número de columnas del tablero.
 * @constant {number}
 * @default 10
 */
const COLUMNAS = 10;

/**
 * Número de minas que se colocan en el tablero.
 * @constant {number}
 * @default 10
 */
const MINAS = 10;

/**
 * Carpeta donde están las imágenes de las casillas.
 * @constant {string}
 * @default "./buscaminas_imagenes/"
 */
const RUTA_IMAGENES = "./buscaminas_imagenes/";

/**
 * Si es `true`, se imprime el tablero lógico en la consola al generar el campo
 * (solo para depurar: revela dónde están las minas).
 * @constant {boolean}
 * @default false
 */
const DEPURACION = false;

/**
 * Código de imagen para una casilla sin destapar (botón).
 * @constant {number}
 * @default -2
 */
const IMG_BOTON = -2;

/**
 * Código de imagen para una casilla con bandera.
 * @constant {number}
 * @default -3
 */
const IMG_BANDERA = -3;

/**
 * Tablero lógico (backend). `tableroBackend[x][y]` vale `-1` si hay una mina
 * o el número (0-8) de minas adyacentes. Se rellena en {@link generarCampo}.
 * @type {number[][]}
 */
var tableroBackend;

/**
 * Celdas `td` del DOM, indexadas como `elementos[x][y]`.
 * @type {HTMLTableCellElement[][]}
 */
var elementos;

/**
 * Casillas ya destapadas, indexadas como `pulsados[x][y]`.
 * @type {boolean[][]}
 */
var pulsados;

/**
 * Casillas marcadas con bandera, indexadas como `banderas[x][y]`.
 * @type {boolean[][]}
 */
var banderas;

/**
 * Indica si falta el primer clic de la partida (momento en que se generan las minas).
 * @type {boolean}
 */
var primeraVez;

/**
 * Estado actual de la partida.
 * @type {EstadoPartida}
 */
var estado;

/**
 * Número de casillas sin mina que el jugador ya ha destapado.
 * @type {number}
 */
var casillasDestapadas;

/**
 * Número de banderas colocadas en el tablero.
 * @type {number}
 */
var banderasPuestas;


/**
 * Muestra una matriz por la consola del navegador (útil para depurar).
 * Imprime una línea por fila, es decir, la matriz traspuesta respecto a `matriz[x][y]`.
 *
 * @param {number[][]} matriz - Matriz indexada como `matriz[x][y]`.
 * @returns {void}
 */
function imprimirMatriz(matriz){
    for (let j=0; j<matriz[0].length; j++){
        let cadena= "";
        for(let i=0;i<matriz.length;i++){
            cadena = cadena + matriz[i][j]+"  ";
        }
        console.log(cadena);
    }
}


/**
 * Genera el campo de minas y calcula los números de cada casilla.
 *
 * 1. Crea la matriz `tableroBackend`.
 * 2. Coloca {@link MINAS} minas aleatorias (valor `-1`), evitando la casilla `(x, y)`.
 * 3. Para cada casilla sin mina cuenta las minas de sus 8 vecinas.
 * 4. Si {@link DEPURACION} es `true`, muestra el resultado en consola.
 *
 * Se llama una sola vez por partida, en el primer clic de {@link click}.
 *
 * @param {number} x - Columna de la primera casilla pulsada (sin mina).
 * @param {number} y - Fila de la primera casilla pulsada (sin mina).
 * @returns {void}
 */
function generarCampo(x,y) {
    tableroBackend = Array(COLUMNAS);
    for (let i = 0; i < COLUMNAS; i++){
        tableroBackend[i] = new Array(FILAS);
    }
    let minasPuestas = 0;
    while (minasPuestas < MINAS) {
        let posX = Math.floor(Math.random()*COLUMNAS);
        let posY = Math.floor(Math.random()*FILAS);
        if (posX != x || posY != y) {
            if (tableroBackend[posX][posY] != -1) {
                tableroBackend[posX][posY] = -1;
                minasPuestas ++;
            }
        }
    }
    for (let i = 0; i < COLUMNAS; i++) {
        for (let j = 0; j < FILAS; j++) {
            if (tableroBackend[i][j] != -1) {
                let minasAdyacentes = 0;
                if (i>0 && j>0 && tableroBackend[i-1][j-1]==-1) {//arriba a la izquierda
                    minasAdyacentes++;
                }
                if (i>0 && tableroBackend[i-1][j]==-1) {//izquierda
                    minasAdyacentes++;
                }
                if (i>0 && j<FILAS-1 && tableroBackend[i-1][j+1]==-1) {//abajo a la izquierda
                    minasAdyacentes++;
                }
                if ( j>0 && tableroBackend[i][j-1]==-1) {//arriba
                    minasAdyacentes++;
                }
                if ( j<FILAS-1 && tableroBackend[i][j+1]==-1) {//abajo
                    minasAdyacentes++;
                }
                if (i<COLUMNAS-1 && j>0 && tableroBackend[i+1][j-1]==-1) {//arriba a la derecha
                    minasAdyacentes++;
                }
                if (i<COLUMNAS-1 && tableroBackend[i+1][j]==-1) {//derecha
                    minasAdyacentes++;
                }
                if (i<COLUMNAS-1 && j<FILAS-1 && tableroBackend[i+1][j+1]==-1) {//abajo a la derecha
                    minasAdyacentes++;
                }
                tableroBackend[i][j] = minasAdyacentes;
            }
        }
    }
    if (DEPURACION) {
        imprimirMatriz(tableroBackend);
    }
}


/**
 * Cambia la imagen de fondo de una celda según su valor.
 *
 * Valores: `0`-`8` muestran `a0`-`a8` (minas adyacentes), `-1` muestra `mina`,
 * {@link IMG_BANDERA} muestra `bandera` y cualquier otro valor (p. ej.
 * {@link IMG_BOTON}) muestra `boton` (casilla sin destapar).
 * Las imágenes se buscan en {@link RUTA_IMAGENES}.
 *
 * @param {HTMLTableCellElement} elemento - Celda `td` a modificar.
 * @param {number} imagen - Valor de la casilla (`-1` mina, `0`-`8` número, {@link IMG_BANDERA}, otro = botón).
 * @returns {void}
 */
function cambiaImagen(elemento, imagen){
    let nombre;
    if (imagen >= 0 && imagen <= 8) {
        nombre = "a" + imagen;
    } else if (imagen === -1) {
        nombre = "mina";
    } else if (imagen === IMG_BANDERA) {
        nombre = "bandera";
    } else {
        nombre = "boton";
    }
    elemento.style.backgroundImage = "url('" + RUTA_IMAGENES + nombre + ".jpg')";
}


/**
 * Escribe el mensaje de estado y actualiza el contador de minas restantes
 * (minas totales menos banderas puestas; puede ser negativo si se ponen de más).
 *
 * @param {string} texto - Mensaje a mostrar encima del tablero.
 * @returns {void}
 */
function actualizarInfo(texto){
    document.getElementById("mensaje").textContent = texto;
    document.getElementById("contador").textContent = MINAS - banderasPuestas;
}


/**
 * Destapa una casilla y, si no tiene minas alrededor (valor `0`), se llama a sí
 * misma para las 8 vecinas (destapado en cadena, recursivo).
 * Ignora las casillas ya destapadas y las que tienen bandera.
 *
 * @param {number} x - Columna de la casilla (0..COLUMNAS-1).
 * @param {number} y - Fila de la casilla (0..FILAS-1).
 * @returns {void}
 */
function destapar(x,y){
    if (pulsados[x][y] || banderas[x][y]) {
        return;
    }
    pulsados[x][y] = true;
    casillasDestapadas++;
    cambiaImagen(elementos[x][y], tableroBackend[x][y]);

    if(tableroBackend[x][y]==0){
        if(x>0 && y>0)                  destapar(x-1, y-1); //arr izda
        if(x>0)                         destapar(x-1,y); //izq
        if(x>0 && y<FILAS-1)            destapar(x-1, y+1);//abj izq
        if(y>0)                         destapar(x,y-1);//arriba
        if(y<FILAS-1)                   destapar(x,y+1); //abajo
        if(x<COLUMNAS-1 && y>0)         destapar(x+1, y-1);//arr dcha
        if(x<COLUMNAS-1)                destapar(x+1,y); //dch
        if(x<COLUMNAS-1 && y<FILAS-1)   destapar(x+1, y+1); //abajo dcha
    }
}


/**
 * Termina la partida como derrota: muestra todas las minas sin bandera y marca
 * en rojo la casilla que explotó.
 *
 * @param {number} x - Columna de la mina pulsada.
 * @param {number} y - Fila de la mina pulsada.
 * @returns {void}
 */
function perder(x,y){
    estado = "perdido";
    for (let i = 0; i < COLUMNAS; i++) {
        for (let j = 0; j < FILAS; j++) {
            if (tableroBackend[i][j] == -1 && !banderas[i][j]) {
                cambiaImagen(elementos[i][j], -1);
            }
        }
    }
    elementos[x][y].style.backgroundColor = "red";
    actualizarInfo("¡Has perdido!");
}


/**
 * Termina la partida como victoria: pone bandera a las minas que quedaban sin marcar.
 *
 * @returns {void}
 */
function ganar(){
    estado = "ganado";
    for (let i = 0; i < COLUMNAS; i++) {
        for (let j = 0; j < FILAS; j++) {
            if (tableroBackend[i][j] == -1 && !banderas[i][j]) {
                banderas[i][j] = true;
                banderasPuestas++;
                cambiaImagen(elementos[i][j], IMG_BANDERA);
            }
        }
    }
    actualizarInfo("¡Has ganado!");
}


/**
 * Gestiona el clic izquierdo sobre una casilla.
 *
 * - No hace nada si la partida ha terminado, o si la casilla tiene bandera o ya está destapada.
 * - En el primer clic genera el campo con {@link generarCampo}.
 * - Si hay una mina, llama a {@link perder}.
 * - Si no, destapa con {@link destapar} y llama a {@link ganar} si ya no quedan casillas seguras.
 *
 * @param {number} x - Columna de la casilla (0..COLUMNAS-1).
 * @param {number} y - Fila de la casilla (0..FILAS-1).
 * @returns {void}
 */
function click(x,y){
    if (estado !== "jugando" || banderas[x][y] || pulsados[x][y]) {
        return;
    }
    if(primeraVez) {
        primeraVez=false;
        generarCampo(x,y);
    }
    if (tableroBackend[x][y] == -1) {
        perder(x,y);
        return;
    }
    destapar(x,y);
    if (casillasDestapadas === FILAS*COLUMNAS - MINAS) {
        ganar();
    }
}


/**
 * Gestiona el clic derecho sobre una casilla: pone o quita una bandera.
 * No hace nada si la partida ha terminado o la casilla ya está destapada.
 *
 * @param {number} x - Columna de la casilla (0..COLUMNAS-1).
 * @param {number} y - Fila de la casilla (0..FILAS-1).
 * @returns {void}
 */
function alternarBandera(x,y){
    if (estado !== "jugando" || pulsados[x][y]) {
        return;
    }
    if (banderas[x][y]) {
        banderas[x][y] = false;
        banderasPuestas--;
        cambiaImagen(elementos[x][y], IMG_BOTON);
    } else {
        banderas[x][y] = true;
        banderasPuestas++;
        cambiaImagen(elementos[x][y], IMG_BANDERA);
    }
    actualizarInfo("Jugando");
}


/**
 * Construye (o reconstruye) el tablero en el DOM y reinicia el estado del juego.
 *
 * Vacía la tabla `#tablero`, inicializa las matrices {@link elementos},
 * {@link pulsados} y {@link banderas}, y crea una fila `tr` por cada fila del
 * tablero con sus celdas `td`. Cada celda recibe un evento de clic izquierdo
 * ({@link click}) y de clic derecho ({@link alternarBandera}, sin menú contextual).
 * Se ejecuta al cargar el script y al pulsar "Nueva partida".
 *
 * @returns {void}
 */
function montarTablero() {
    elementos = Array(COLUMNAS);
    pulsados = Array(COLUMNAS);
    banderas = Array(COLUMNAS);
    tableroBackend = undefined;
    primeraVez = true;
    estado = "jugando";
    casillasDestapadas = 0;
    banderasPuestas = 0;

    for (let i = 0; i < COLUMNAS; i++){
        elementos[i] = new Array(FILAS);
        pulsados[i] = new Array(FILAS);
        banderas[i] = new Array(FILAS);
        for (let j=0; j<FILAS; j++){
            pulsados[i][j]=false;
            banderas[i][j]=false;
        }
    }
    var miTabla = document.getElementById("tablero");
    miTabla.innerHTML = "";
    for (let j = 0 ; j < FILAS; j++) {
        let filaTablero = document.createElement('tr');
        for (let i = 0; i < COLUMNAS; i++) {
            let celda = document.createElement('td');
            cambiaImagen(celda, IMG_BOTON);
            elementos[i][j] = celda;
            celda.addEventListener("click",()=>{
                click(i,j);
            });
            celda.addEventListener("contextmenu",(evento)=>{
                evento.preventDefault();
                alternarBandera(i,j);
            });
            filaTablero.appendChild(celda);
        }
        miTabla.appendChild(filaTablero);
    }
    actualizarInfo("Jugando");
}

document.getElementById("reiniciar").addEventListener("click", montarTablero);
montarTablero();
