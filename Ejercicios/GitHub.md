# GitHub: Guía práctica de sus funciones principales

**Autor:** Alonso Mariblanca Romo
**Curso:** DAW — Desarrollo de Aplicaciones Web
**Fecha:** 2025-2026

---

## 1. Introducción

**GitHub** es la plataforma de alojamiento de código fuente más utilizada en el mundo. Basada en el sistema de control de versiones distribuido **Git**, permite a desarrolladores individuales y equipos gestionar, versionar y colaborar en proyectos de software de forma centralizada.

Sus usos principales son:

- **Control de versiones:** guardar el historial de cambios de un proyecto.
- **Colaboración:** trabajar en equipo sobre el mismo código mediante ramas, *pull requests* y revisiones.
- **Hospedaje:** alojar repositorios públicos o privados en la nube.
- **Gestión de proyectos:** usar *Issues*, *Projects* y *Milestones* para organizar tareas.
- **Integración continua:** automatizar pruebas y despliegues con *GitHub Actions*.
- **Portafolio profesional:** mostrar proyectos y contribuciones a posibles empleadores.

En este informe se recogen, paso a paso, las operaciones más habituales que se realizan en GitHub, tanto desde la interfaz web como desde la terminal.

---

## 2. Acciones y pasos a seguir

### 2.1. Crear un repositorio

**Desde la web:**

#### 1. Inicia sesión en [github.com](https://github.com).
#### 2. Haz clic en el botón **+** (arriba a la derecha) → **New repository**.
#### 3. Rellena:
   - **Repository name:** nombre del proyecto.
   - **Description** (opcional).
   - **Public** o **Private**.
   - Marca **Add a README file** si quieres inicializarlo con un README.
#### 4. Pulsa **Create repository**.

**Desde la terminal:**

```
git init nombre_repositorio
cd nombre_repositorio
git add .
git commit -m "Primer commit"
git branch -M main
git remote add origin https://github.com/usuario/nombre_repositorio.git
git push -u origin main
```

### 2.2. Clonar un repositorio

```
git clone https://github.com/usuario/nombre_repositorio.git
cd nombre_repositorio
```
Esto descarga una copia local completa del proyecto, incluido su historial.

### 2.3. Crear y borrar carpetas
GitHub no admite carpetas vacías (Git no rastrea directorios sin archivos).

Crear una carpeta desde la web:

En el repositorio, pulsa Add file → Create new file.
En el campo de nombre, escribe carpeta/nombre_archivo.md.
Añade contenido y pulsa Commit new file.
Crear desde la terminal:

```
mkdir docs
touch docs/.gitkeep
git add docs/
git commit -m "Añadir carpeta docs"
git push origin main
```

El archivo .gitkeep es una convención para forzar que Git rastree la carpeta vacía.

Borrar una carpeta desde la web:

Navega hasta la carpeta.
Pulsa el menú … → Delete directory.
Confirma con Commit changes.
Borrar desde la terminal:

```
git rm -r nombre_carpeta
git commit -m "Eliminar carpeta"
git push origin main
```
### 2.4. Crear y editar un README
El archivo README.md es la "portada" del repositorio: se muestra como descripción principal en la página del proyecto.

Pasos:

1.En la raíz del repositorio, pulsa Add file → Create new file.
2.Nombra el archivo README.md.
3.Redacta el contenido en Markdown:

# Nombre del proyecto

Descripción breve.

## Instalación

Instrucciones...

## Uso

Ejemplos...   

 4.Pulsa Commit new file.
Enlaces relativos entre archivos:

[Ver el diario de la Unidad 1](Diarios/Diario_UT1.md)

No se necesitan permalinks para enlazar entre archivos; solo se usa #seccion para apuntar a un encabezado concreto dentro del mismo documento.

### 2.5. Trabajar con ramas (branches)
Las ramas permiten desarrollar funcionalidades sin alterar la rama principal.

1.Crear una rama:

```
git checkout -b nombre_rama
```

o desde la web: en la pestaña Code, selecciona la rama en el desplegable → Create branch.

Cambiar de rama:

```
git checkout main
```

Eliminar una rama local:

```
git branch -d nombre_rama
```

### 2.6. Hacer commits y push

```
git add .
git commit -m "Mensaje descriptivo del cambio"
git push origin main
```

Buenas prácticas para el mensaje:

Usa imperativo presente: "Añadir" en vez de "Añadido".
Sé específico: "Corregir error en el bucle for de la UT3".
Máximo 50 caracteres en la primera línea.

### 2.7. Sincronizar con pull
Antes de empujar cambios, actualiza tu copia local:

```
git pull origin main
```

Esto descarga y fusiona los cambios remotos. Si hay conflictos, Git los marca en los archivos afectados y debes resolverlos manualmente antes de hacer commit.

### 2.8. Pull Requests (PR)
Un Pull Request solicita fusionar una rama en otra (normalmente main).

Pasos desde la web:

Ve a la pestaña Pull requests → New pull request.
Selecciona la rama base (main) y la rama de comparación.
Revisa la diferencia (diff).
Pulsa Create pull request.
Añade título, descripción y revisores si es necesario.
Cuando se apruebe, pulsa Merge pull request.

### 2.9. Issues y Projects
Issues: sistema de seguimiento de errores y tareas. Se crean en la pestaña Issues → New issue.
Projects: tableros tipo kanban para organizar Issues por estado (To do, In progress, Done).

### 2.10. GitHub Actions (CI/CD básico)
Permite ejecutar flujos de trabajo automáticos (tests, despliegues, etc.).

Crea la carpeta .github/workflows/ en la raíz del repo.
Añade un archivo YAML, por ejemplo ci.yml:
name: CI
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "Ejecutando pruebas..."

Haz commit y push. Cada vez que se haga push, GitHub ejecutará el flujo.

## 3. Conclusiones
GitHub es una herramienta indispensable en el desarrollo de software actual. Su combinación de control de versiones distribuido, colaboración en equipo y automatización lo convierte en mucho más que un simple "alojamiento de código": es un entorno de trabajo completo.

Las operaciones vistas en este informe —crear repositorios, gestionar carpetas, trabajar con ramas, hacer commits, resolver conflictos y automatizar con Actions— cubren el 90 % de las tareas diarias de un desarrollador. Dominarlas es el primer paso para trabajar de forma eficiente, ya sea en solitario o en equipo.

## 4. Bibliografía
GitHub Docs. (s. f.). GitHub Documentation. Recuperado de https://docs.github.com
Chacon, S. & Straub, B. (2014). Pro Git (2.ª ed.). Apress. (disponible gratis en https://git-scm.com/book/es/v2)
Markdown. (s. f.). CommonMark Specification. Recuperado de https://commonmark.org

---

### Notas sobre la redacción

- **Título y autor** van al principio, como en un informe académico.
- La **introducción** contextualiza qué es GitHub y qué se va a ver, tal como pide el enunciado.
- Cada sección tiene **pasos numerados** y, cuando aplica, **código** entre bloques ` ``` `.
- Las **conclusiones** sintetizan lo aprendido sin repetir literalmente los pasos.
- La **bibliografía** cita fuentes reales y accesibles.
