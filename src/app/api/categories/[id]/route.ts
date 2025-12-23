import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

// GET /api/categories/[id] - Get a specific category
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await supabaseServer({ cookies: req.cookies, canSet: false, headers: req.headers });
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const categoryId = parseInt(id);
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    // Fetch the category
    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching category:', error);
      return NextResponse.json(
        { error: 'Failed to fetch category' },
        { status: 500 }
      );
    }

    return NextResponse.json({ category });

  } catch (error) {
    console.error('Get category API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Update a category
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await supabaseServer({ cookies: req.cookies, canSet: false, headers: req.headers });
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const categoryId = parseInt(id);
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { name } = body;

    // Validate input
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Category name is required and must be a string' },
        { status: 400 }
      );
    }

    if (name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Category name cannot be empty' },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: 'Category name must be 100 characters or less' },
        { status: 400 }
      );
    }

    // Check if category exists and belongs to user
    const { data: existingCategory, error: fetchError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', categoryId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if another category with same name already exists for this user
    const { data: duplicateCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('user_id', user.id)
      .eq('name', name.trim())
      .neq('id', categoryId)
      .single();

    if (duplicateCategory) {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 409 }
      );
    }

    // Update the category
    const { data: category, error } = await supabase
      .from('categories')
      .update({ name: name.trim() })
      .eq('id', categoryId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      return NextResponse.json(
        { error: 'Failed to update category' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Category updated successfully',
      category
    });

  } catch (error) {
    console.error('Update category API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await supabaseServer({ cookies: req.cookies, canSet: false, headers: req.headers });
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const categoryId = parseInt(id);
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    // Check if category exists and belongs to user
    const { data: existingCategory, error: fetchError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', categoryId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if category is being used by any expenses
    const { data: expensesUsingCategory, error: expensesError } = await supabase
      .from('expenses')
      .select('id')
      .eq('category_id', categoryId)
      .limit(1);

    if (expensesError) {
      console.error('Error checking expenses:', expensesError);
      return NextResponse.json(
        { error: 'Failed to check category usage' },
        { status: 500 }
      );
    }

    if (expensesUsingCategory && expensesUsingCategory.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category that has associated expenses' },
        { status: 400 }
      );
    }

    // Delete the category
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting category:', error);
      return NextResponse.json(
        { error: 'Failed to delete category' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error('Delete category API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 