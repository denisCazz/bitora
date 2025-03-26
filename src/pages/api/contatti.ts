// src/pages/api/contatti.ts
import { type APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const FORMSPREE_URL = "https://formspree.io/f/xdkedraq"; // SOSTITUIRE
  
  try {
    const formData = await request.formData();
    const email = formData.get('email')?.toString() || '';
    
    // Costruisci payload per Formspree
    const payload = {
      _replyto: email,
      _subject: `Nuovo messaggio da ${formData.get('name')}`,
      message: formData.get('message'),
      name: formData.get('name'),
      email: email
    };

    const response = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Errore Formspree');
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};