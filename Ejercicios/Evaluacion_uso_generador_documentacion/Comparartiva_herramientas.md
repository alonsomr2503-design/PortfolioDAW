# Ficha comparativa de herramientas de generación de documentación

**Autor:** Alonso Mariblanca

## 1. Herramientas analizadas

| Herramienta | Lenguaje / ámbito | Cómo funciona |
|---|---|---|
| **Javadoc** | Java | Lee comentarios `/** ... */` con etiquetas (`@param`, `@return`) y genera HTML. |
| **JSDoc** | JavaScript / Node.js | Lee comentarios `/** ... */` con etiquetas y genera HTML. |
| **Doxygen** | C, C++, Java, Python, PHP y otros | Analiza el código y sus comentarios; genera HTML, PDF (LaTeX) y más. |
| **Sphinx** | Python (y documentación general) | Usa *docstrings* y ficheros reStructuredText/Markdown. |
| **MkDocs** | Cualquier proyecto | Convierte ficheros Markdown escritos a mano en un sitio web. |
| **Swagger / OpenAPI** | APIs REST | Describe los endpoints en YAML/JSON y genera documentación interactiva. |

## 2. Comparativa

| Criterio | Javadoc | JSDoc | Doxygen | Sphinx | MkDocs | Swagger |
|---|---|---|---|---|---|---|
| **Facilidad de uso** | Alta (viene con el JDK) | Alta | Media (muchas opciones) | Media | Muy alta | Media |
| **Integración con proyectos** | Maven, Gradle, IDEs | npm, Node.js, navegador | CMake, makefiles | Python, Read the Docs | Cualquier repositorio, CI | Frameworks de APIs |
| **Formatos de salida** | HTML | HTML (plantillas); Markdown con `jsdoc-to-markdown` | HTML, PDF, LaTeX, man, XML | HTML, PDF, ePub | HTML (PDF con complementos) | HTML interactivo, JSON/YAML |
| **Comunidad** | Muy grande (estándar en Java) | Grande | Grande | Muy grande en Python | Grande y creciente | Muy grande en APIs |
| **Curva de aprendizaje** | Baja | Baja | Media | Media-alta (reStructuredText) | Muy baja (solo Markdown) | Media |
| **Documenta desde el código** | Sí | Sí | Sí | Sí (docstrings) | No (texto aparte) | Sí o manual |
| **Licencia** | Gratuita | Gratuita | Gratuita | Gratuita | Gratuita | Gratuita (núcleo) |

## 3. Elección para mi proyecto

El proyecto del curso anterior es un **Buscaminas en HTML, CSS y JavaScript**. El estándar de documentación de esta tecnología es **JSDoc**, así que es la herramienta elegida:

- Se integra directamente con el código JavaScript (comentarios `/** ... */`).
- Genera HTML navegable con funciones, constantes y variables.
- Con `jsdoc-to-markdown` se obtiene también la versión en Markdown, y el PDF se genera a partir del HTML.
- Es gratuita y se instala con `npm`.

Javadoc, Sphinx y Doxygen están pensados para otros lenguajes; Swagger es para APIs REST, que este proyecto no tiene; MkDocs sirve para texto escrito a mano, no extrae documentación del código.
