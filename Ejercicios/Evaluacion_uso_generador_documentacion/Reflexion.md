# Reflexión sobre la experiencia

Documentar el Buscaminas con JSDoc fue sencillo. Solo hay que escribir comentarios `/** ... */` encima de cada función y variable con etiquetas como `@param`, `@returns` y `@type`, y ejecutar un comando (`jsdoc -c jsdoc.json`) para obtener un sitio HTML con todo listado. Para que JSDoc analizara el código tuve que mover el script que estaba dentro del HTML a un fichero `buscaminas.js`, porque JSDoc solo lee archivos JavaScript.

**Ventajas:** la documentación está pegada al código, así que es más fácil mantenerla actualizada. Escribir las descripciones me obligó a entender mejor el programa (por ejemplo, que `x` es la columna y `y` la fila, y que el campo se genera en el primer clic). Además, al documentar el código aparecieron fallos que antes pasaban desapercibidos: la ruta de las imágenes no coincidía con el nombre de la carpeta, las celdas no se añadían a sus filas y el juego no detectaba la victoria ni la derrota. Los corregí y están listados en `CAMBIOS.md`.

**Desventajas:** JSDoc genera HTML por defecto; el Markdown necesita otra herramienta (`jsdoc-to-markdown`) y el PDF también. El aspecto de la plantilla es básico, y si el comentario no se actualiza al cambiar el código la documentación queda desfasada.

**¿La recomendaría en un proyecto colaborativo?** Sí. Es el estándar en JavaScript, los editores lo reconocen y muestran la ayuda al escribir código, y la documentación se puede regenerar con un comando cada vez que cambie el proyecto. Es útil para que cualquier compañero entienda qué hace cada función sin leer todo el programa.
