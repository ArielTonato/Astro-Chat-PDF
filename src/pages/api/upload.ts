import type { APIRoute } from "astro"
import fs from "fs/promises"
import path from "path"

import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.CLOUDINARY_API_KEY,
  api_secret: import.meta.env.CLOUDINARY_API_SECRET
});

const outputDir = path.join(process.cwd(), "public/text");

// Asegurar que el directorio existe
const ensureDirectoryExists = async (dirPath: string) => {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
};
const uploadStream = async (buffer: Uint8Array, options: {
  folder: string,
  ocr?: string
}): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary
      .uploader
      .upload_stream(options, (error, result) => {
        if (result) return resolve(result);
        reject(error);
      }).end(buffer)
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file found" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validar que sea un PDF
    if (!file.type.includes('pdf')) {
      return new Response(JSON.stringify({ error: "Only PDF files are allowed" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const buffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    
    console.log('Uploading to Cloudinary...');
    const result = await uploadStream(uint8Array, {
      folder: "pdf",
      ocr: "adv_ocr"
    });

    console.log('Cloudinary upload completed:', result.asset_id);

    const {
      asset_id: id,
      secure_url: url,
      pages,
      info
    } = result;

    // Verificar que se extrajo texto
    const data = info?.ocr?.adv_ocr?.data;
    
    if (!data || data.length === 0) {
      return new Response(JSON.stringify({ 
        error: "No text could be extracted from the PDF" 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const text = data.map((blocks: { textAnnotations: { description: string }[] }) => {
      const annotations = blocks['textAnnotations'] ?? {};
      const first = annotations[0] ?? {};
      const content = first['description'] ?? '';
      return content.trim();
    }).filter(Boolean).join('\n');

    if (!text.trim()) {
      return new Response(JSON.stringify({ 
        error: "No readable text found in the PDF" 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Saving text file...');
    await ensureDirectoryExists(outputDir);
    await fs.writeFile(`${outputDir}/${id}.txt`, text, 'utf-8');
    
    console.log('Upload process completed successfully');
    return new Response(JSON.stringify({
      id, url, pages
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in upload endpoint:', error);
    
    return new Response(JSON.stringify({ 
      error: "Error processing the file. Please try again." 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}