import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Debug({ message = 'Debug page loaded successfully!' }) {
  return (
    <AppLayout>
      <Head title="Debug Page" />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
            <p>{message}</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
