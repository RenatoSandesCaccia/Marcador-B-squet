# Cómo subir el Marcador a la web

Tu carpeta tiene solo 3 archivos: `index.html`, `basquet.css` y `basquet.js`. Cualquier servicio de hosting estático los puede publicar.

---

## Opción 1: Netlify (muy fácil, sin instalar nada)

1. Entra en **[netlify.com](https://www.netlify.com)** y crea una cuenta (gratis, con email o Google).
2. Arrastra la **carpeta** `MarcadorBasquet` (con los 3 archivos dentro) a la zona que dice **"Drag and drop your site output folder here"** en la página de Netlify.
3. En unos segundos te dará un enlace tipo `https://algo-random.netlify.app`. Ese es tu marcador en la web.
4. (Opcional) En **Domain settings** puedes cambiar el nombre por uno que prefieras, por ejemplo `marcador-basquet.netlify.app`.

**Ventaja:** No necesitas Git ni instalar programas. Solo arrastrar la carpeta.

---

## Opción 2: GitHub Pages (gratis, con GitHub)

1. Crea una cuenta en **[github.com](https://github.com)** si no tienes.
2. Crea un repositorio nuevo (por ejemplo `MarcadorBasquet`).
3. Sube los 3 archivos (`index.html`, `basquet.css`, `basquet.js`) a la **raíz** del repositorio (no dentro de una carpeta).
4. En el repositorio: **Settings** → **Pages** → en "Source" elige **Deploy from a branch** → branch **main** (o **master**) → carpeta **/ (root)** → **Save**.
5. En 1–2 minutos tu sitio estará en `https://tu-usuario.github.io/MarcadorBasquet` (o el nombre que le hayas puesto al repo).

**Ventaja:** Queda guardado en GitHub y puedes actualizarlo subiendo de nuevo los archivos.

---

## Opción 3: Vercel

1. Entra en **[vercel.com](https://vercel.com)** y regístrate (con GitHub o email).
2. Haz clic en **Add New** → **Project**.
3. Si subes con Git: conecta el repo donde estén los archivos. Si no usas Git: instala **Vercel CLI** y en la carpeta del proyecto ejecuta `vercel` y sigue los pasos (te pedirá que subas la carpeta).
4. Te dará un enlace tipo `https://marcador-basquet-xxx.vercel.app`.

---

## Opción 4: Cloudflare Pages

1. Entra en **[pages.cloudflare.com](https://pages.cloudflare.com)**.
2. **Create a project** → **Direct Upload**.
3. Arrastra un **ZIP** de tu carpeta (con `index.html`, `basquet.css` y `basquet.js` en la raíz del ZIP).
4. Te dará una URL tipo `https://marcador-basquet.pages.dev`.

---

## Resumen rápido

| Servicio       | Dificultad | Qué hacer                          |
|----------------|------------|-------------------------------------|
| **Netlify**    | Muy fácil  | Arrastrar la carpeta a netlify.com  |
| **GitHub Pages** | Fácil   | Subir archivos a un repo y activar Pages |
| **Vercel**     | Fácil      | Conectar repo o usar CLI            |
| **Cloudflare Pages** | Fácil | Subir ZIP con los 3 archivos   |

Para empezar sin complicarte: **Netlify** con “drag and drop” de la carpeta es lo más rápido.
