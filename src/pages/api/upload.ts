import type {APIRoute} from "astro"

import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'aridev21', 
  api_key: '827353881855768', 
  api_secret: import.meta.env.CLOUDINARY_SECRET
});

export const POST: APIRoute = async ({request}) => {
    const formData = await request.formData();
    const file = formData.get("file");
    //Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return new Response("Hello, world!")
}