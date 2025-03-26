// src/components/ContactForm.jsx
import React from 'react';
import { useForm, ValidationError } from '@formspree/react';

export default function ContactForm() {
  const [state, handleSubmit] = useForm("xdkedraq"); // Sostituisci con il tuo form ID

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email" 
          name="email"
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <ValidationError 
          prefix="Email" 
          field="email"
          errors={state.errors}
          className="text-red-500 text-sm"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Messaggio
        </label>
        <textarea
          id="message"
          name="message"
          rows="4"
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <ValidationError 
          prefix="Message" 
          field="message"
          errors={state.errors}
          className="text-red-500 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={state.submitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
      >
        {state.submitting ? 'Invio in corso...' : 'Invia'}
      </button>

      {state.succeeded && (
        <p className="mt-4 text-green-600 text-center">
          Messaggio inviato con successo! 🎉
        </p>
      )}
    </form>
  );
}