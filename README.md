# Astro Chat PDF

Chat con tus archivos PDF usando Astro, Svelte, OpenAI y Cloudinary.

## 🖥️ Vista Desktop

![Vista Desktop](https://res.cloudinary.com/aridev21/image/upload/v1752091035/p1_zirlyj.png)

## 📱 Vista Móvil

![Vista Móvil](https://res.cloudinary.com/aridev21/image/upload/v1752091082/p1.1_qgjdyn.png)

---

## 🚀 ¿Qué hace esta app?

- Permite subir un archivo PDF (máx. 3MB)
- Extrae el texto usando OCR de Cloudinary
- Puedes hacer preguntas sobre el contenido del PDF usando la API de OpenAI (ChatGPT)
- Interfaz moderna, responsiva y fácil de usar

## 🛠️ Tecnologías usadas

- [Astro](https://astro.build/) (framework principal)
- [Svelte](https://svelte.dev/) (componentes interactivos)
- [Tailwind CSS](https://tailwindcss.com/) (estilos)
- [OpenAI API](https://platform.openai.com/) (respuestas inteligentes)
- [Cloudinary](https://cloudinary.com/) (OCR y almacenamiento de PDFs)

## ⚡ Instalación y uso

1. Clona el repositorio:
   ```bash
   git clone <url-del-repo>
   cd Astro-Chat-PDF
   ```
2. Instala dependencias:
   ```bash
   pnpm install
   # o npm install
   ```
3. Crea un archivo `.env` en la raíz con tus claves:
   ```env
   OPENAI_API_KEY=tu_clave_openai
   CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   pnpm dev
   # o npm run dev
   ```
5. Abre [http://localhost:4321](http://localhost:4321) en tu navegador.

## 📋 Notas
- El tamaño máximo de archivo es 3MB.
- Solo se aceptan archivos PDF.
- El procesamiento puede tardar unos segundos dependiendo del tamaño del PDF y la calidad del OCR.

## 📝 Licencia
MIT
