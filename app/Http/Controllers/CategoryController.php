<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\ActivityLogs;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // Show all categories
    public function index()
    {
        $categories = Category::all();
        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    public function indexWithSubCategory()
    {
        $categories = Category::with('subCategories')->get();
        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    // Store a new category
    public function store(Request $request)
    {
        $request->validate([
            'category' => 'required|string|max:255|unique:categories,category',
        ]);

        $category = Category::create([
            'category' => $request->category,
        ]);

        // Log activity
        ActivityLogs::create([
            'name' => auth()->user()->name ?? 'Guest',
            'ip_address' => $request->ip(),
            'title' => "Created category: {$category->category}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully!',
            'data' => $category
        ], 201);
    }

    // Update an existing category
    public function update(Request $request, $id)
    {
        $request->validate([
            'category' => 'required|string|max:255|unique:categories,category,' . $id,
        ]);

        $category = Category::findOrFail($id);
        $oldCategory = $category->category;

        $category->update([
            'category' => $request->category,
        ]);

        // Log activity
        ActivityLogs::create([
            'name' => auth()->user()->name ?? 'Guest',
            'ip_address' => $request->ip(),
            'title' => "Updated category from '{$oldCategory}' to '{$request->category}'",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully!',
            'data' => $category
        ]);
    }

    // Delete a category
    public function destroy(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $categoryName = $category->category;

        $category->delete();

        // Log activity
        ActivityLogs::create([
            'name' => auth()->user()->name ?? 'Guest',
            'ip_address' => $request->ip(),
            'title' => "Deleted category: {$categoryName}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully!'
        ]);
    }
}
