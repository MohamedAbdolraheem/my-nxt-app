'use client';
import React, { useEffect, useState } from 'react';

interface Category {
  id: number;
  name: string;
}

interface Expense {
  id: string;
  amount: number;
  note: string | null;
  created_at: string;
  category?: {
    id: number;
    name: string;
  } | null;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch categories and expenses
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();
        
        if (categoriesResponse.ok && categoriesData.categories) {
          setCategories(categoriesData.categories);
        } else {
          console.error('Categories fetch error:', categoriesData);
        }

        // Fetch expenses
        const expensesResponse = await fetch('/api/expenses');
        const expensesData = await expensesResponse.json();
        
        if (expensesResponse.ok && expensesData.expenses) {
          setExpenses(expensesData.expenses);
        } else {
          console.error('Expenses fetch error:', expensesData);
        }
      } catch (err) {
        console.error('Data fetch error:', err);
      }
    };

    fetchData();
  }, []);

  // Add expense
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const requestData = { 
      amount: Number(amount), 
      note, 
      category_id: categoryId && categoryId !== '' ? Number(categoryId) : null 
    };
    
    console.log('Frontend sending data:', requestData);
    console.log('CategoryId state:', categoryId, 'Type:', typeof categoryId);
    
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    }).then(r => r.json());
    setLoading(false);
    if (res.expense) {
      setExpenses((prev) => [res.expense, ...prev]);
      setAmount('');
      setNote('');
      setCategoryId('');
    } else {
      setError(res.error || 'Failed to add expense');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Expenses</h1>
          <p className="text-slate-600 dark:text-slate-300">Track and manage your expenses</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Expense Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Add New Expense</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Amount
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Note
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="What was this expense for?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Category (Optional)
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                  >
                    <option value="">No category</option>
                    {categories.map((cat: Category) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" 
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Expense'}
                </button>
              </form>
              {error && <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">{error}</div>}
            </div>
          </div>

          {/* Expenses List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Recent Expenses</h2>
              {expenses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">No expenses yet</p>
                  <p className="text-sm text-slate-500 dark:text-slate-500">Add your first expense to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {expenses.map((exp: Expense) => (
                    <div key={exp.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">${exp.amount}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{exp.note}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200">
                              {exp.category?.name || 'Uncategorized'}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {new Date(exp.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
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