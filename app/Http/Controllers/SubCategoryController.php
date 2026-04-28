<?php

namespace App\Http\Controllers;

use App\Models\SubCategory;
use App\Models\ActivityLogs;
use Illuminate\Http\Request;

class SubCategoryController extends Controller
{
    // Show all subcategories with category
    public function index()
    {
        $subcategories = SubCategory::with('category')->get();

        return response()->json([
            'success' => true,
            'data' => $subcategories
        ]);
    }

    // Store a new subcategory
    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'sub_category' => 'required|string|max:255',
        ]);

        $subcategory = SubCategory::create([
            'category_id' => $request->category_id,
            'sub_category' => $request->sub_category,
        ]);

        // Log activity
        ActivityLogs::create([
            'name' => auth()->user()->name ?? 'Guest',
            'ip_address' => $request->ip(),
            'title' => "Created subcategory: {$subcategory->sub_category}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Subcategory created successfully!',
            'data' => $subcategory
        ], 201);
    }

    // Update an existing subcategory
    public function update(Request $request, $id)
    {
        $request->validate([
            'category_id' => 'sometimes|required|exists:categories,id',
            'sub_category' => 'required|string|max:255',
        ]);

        $subcategory = SubCategory::findOrFail($id);
        $oldSubCategory = $subcategory->sub_category;

        $subcategory->update([
            'category_id' => $request->category_id ?? $subcategory->category_id,
            'sub_category' => $request->sub_category,
        ]);

        // Log activity
        ActivityLogs::create([
            'name' => auth()->user()->name ?? 'Guest',
            'ip_address' => $request->ip(),
            'title' => "Updated subcategory from '{$oldSubCategory}' to '{$request->sub_category}'",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Subcategory updated successfully!',
            'data' => $subcategory
        ]);
    }

    // Delete a subcategory
    public function destroy(Request $request, $id)
    {
        $subcategory = SubCategory::findOrFail($id);
        $subcategoryName = $subcategory->sub_category;

        $subcategory->delete();

        // Log activity
        ActivityLogs::create([
            'name' => auth()->user()->name ?? 'Guest',
            'ip_address' => $request->ip(),
            'title' => "Deleted subcategory: {$subcategoryName}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Subcategory deleted successfully!'
        ]);
    }
}
