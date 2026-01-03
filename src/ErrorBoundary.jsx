import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';

function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          {error?.status === 404 ? '404' : 'Oops!'}
        </h1>
        <p className="text-xl text-gray-700 mb-2">
          {error?.status === 404 
            ? 'Page Not Found' 
            : error?.statusText || error?.message || 'Something went wrong'}
        </p>
        <p className="text-gray-500 mb-6">
          {error?.status === 404
            ? "The page you're looking for doesn't exist."
            : 'An unexpected error occurred.'}
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

export default ErrorBoundary;

