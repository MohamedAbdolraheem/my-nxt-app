'use client';
import React, { useEffect, useState } from 'react';

interface Category {
  id: number;
  name: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setFetching(true);
        const response = await fetch('/api/categories');
        const data = await response.json();
        
        if (response.ok && data.categories) {
          setCategories(data.categories);
          setError('');
        } else {
          setError(data.error || 'Failed to load categories');
          console.error('Categories fetch error:', data);
        }
      } catch (err) {
        setError('Network error. Please try again.');
        console.error('Categories fetch error:', err);
      } finally {
        setFetching(false);
      }
    };

    fetchCategories();
  }, []);

  // Add category
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    }).then(r => r.json());
    setLoading(false);
    if (res.category) {
      setCategories((prev) => [...prev, res.category]);
      setName('');
    } else {
      setError(res.error || 'Failed to add category');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Categories</h1>
          <p className="text-slate-600 dark:text-slate-300">Organize your expenses with custom categories</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Category Form */}
          <div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Add New Category</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Category Name
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g., Food, Transportation, Entertainment"
                    required
                  />
                </div>
                <button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" 
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Category'}
                </button>
              </form>
              {error && <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">{error}</div>}
            </div>
          </div>

          {/* Categories List */}
          <div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Your Categories</h2>
              {fetching ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">Loading categories...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">No categories yet</p>
                  <p className="text-sm text-slate-500 dark:text-slate-500">Create your first category to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map((cat: Category) => (
                    <div key={cat.id} className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">{cat.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}