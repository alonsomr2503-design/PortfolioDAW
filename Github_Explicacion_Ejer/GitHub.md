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

1. Inicia sesión en [github.com](https://github.com).
2. Haz clic en el botón **+** (arriba a la derecha) → **New repository**.
3. Rellena:
   - **Repository name:** nombre del proyecto.
   - **Description** (opcional).
   - **Public** o **Private**.
   - Marca **Add a README file** si quieres inicializarlo con un README.
4. Pulsa **Create repository**.

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

2.2. Clonar un repositorio

```
git clone https://github.com/usuario/nombre_repositorio.git
cd nombre_repositorio
```
Esto descarga una copia local completa del proyecto, incluido su historial.

2.3. Crear y borrar carpetas
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
2.4. Crear y editar un README
El archivo README.md es la "portada" del repositorio: se muestra como descripción principal en la página del proyecto.

Pasos:

En la raíz del repositorio, pulsa Add file → Create new file.
Nombra el archivo README.md.
Redacta el contenido en Markdown:

# Nombre del proyecto

Descripción breve.

## Instalación

Instrucciones...

## Uso

Ejemplos...   
