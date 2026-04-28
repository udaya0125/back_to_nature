<?php

namespace App\Http\Controllers;

use App\Models\Trekking;
use App\Models\TrekkingImage;
use App\Models\TrekkingItinerary;
use App\Models\ActivityLogs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TrekkingController extends Controller
{
    /**
     * Display all trekkings with images & itineraries
     */
    public function index()
    {
        $trekkings = Trekking::with(['images', 'itineraries', 'category', 'subCategory'])->get();

        return response()->json([
            'status' => true,
            'message' => 'Trekkings retrieved successfully',
            'data' => $trekkings
        ], 200);
    }

    public function indexShowTrekkingSlug($slug)
    {
        $trekking=Trekking::where('slug',$slug)
        ->with(['images','itineraries','category','subCategory'])
        ->firstOrFail();
        return response()->json([
            'status' => true,
            'message' => 'Trekkings retrieved successfully',
            'data' => $trekking
        ], 200);

    }

    /**
     * Store a new trekking with optional images & itineraries
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'             => 'required|string|max:255',
            'category_id'       => 'required|exists:categories,id',
            'sub_category_id'   => 'nullable|exists:sub_categories,id',
            'description'       => 'nullable|string',
            'includes'          => 'nullable|string',
            'excludes'          => 'nullable|string',
            'important_message' => 'nullable|string',
            'best_time'         => 'nullable|string',
            'whatto_wear'       => 'nullable|string',
            'duration'          => 'nullable|string|max:255',
            'elevation'         => 'nullable|string|max:255',
            'grade'             => 'nullable|string|max:255',
            'season'            => 'nullable|string|max:255',

            'images'            => 'nullable|array',
            'images.*'          => 'nullable|image|mimes:jpeg,png,jpg|max:2048',

            'itineraries'       => 'nullable|array',
            'itineraries.*.day' => 'required_with:itineraries|string|max:255',
            'itineraries.*.title' => 'required_with:itineraries|string|max:255',
            'itineraries.*.description' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $trekking = Trekking::create($validated);

            // Save images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('trekkings', 'public');
                    TrekkingImage::create([
                        'trekking_id' => $trekking->id,
                        'image_path'  => $path
                    ]);
                }
            }

            // Save itineraries
            if ($request->has('itineraries')) {
                foreach ($request->itineraries as $item) {
                    TrekkingItinerary::create([
                        'trekking_id' => $trekking->id,
                        'day'         => $item['day'],
                        'title'       => $item['title'],
                        'description' => $item['description'] ?? null,
                    ]);
                }
            }

            // ✅ Log Activity
            ActivityLogs::create([
                'name'       => auth()->user()->name ?? 'Guest',
                'ip_address' => $request->ip(),
                'title'      => "Created Trekking: {$trekking->title}",
            ]);

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Trekking created successfully',
                'data' => $trekking->load(['images', 'itineraries', 'category', 'subCategory'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Failed to create trekking',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update trekking + images + itineraries
     */
    public function update(Request $request, $id)
    {
        $trekking = Trekking::findOrFail($id);

        $validated = $request->validate([
            'title'             => 'sometimes|required|string|max:255',
            'category_id'       => 'sometimes|required|exists:categories,id',
            'sub_category_id'   => 'nullable|exists:sub_categories,id',
            'description'       => 'nullable|string',
            'includes'          => 'nullable|string',
            'excludes'          => 'nullable|string',
            'important_message' => 'nullable|string',
            'best_time'         => 'nullable|string',
            'whatto_wear'       => 'nullable|string',
            'duration'          => 'nullable|string|max:255',
            'elevation'         => 'nullable|string|max:255',
            'grade'             => 'nullable|string|max:255',
            'season'            => 'nullable|string|max:255',

            'images'            => 'nullable|array',
            'images.*'          => 'nullable|image|mimes:jpeg,png,jpg|max:2048',

            'itineraries'       => 'nullable|array',
            'itineraries.*.day' => 'required_with:itineraries|string|max:255',
            'itineraries.*.title' => 'required_with:itineraries|string|max:255',
            'itineraries.*.description' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $oldTitle = $trekking->title;

            $trekking->update($validated);

            // Update images
            if ($request->hasFile('images')) {
                foreach ($trekking->images as $img) {
                    Storage::disk('public')->delete($img->image_path);
                }
                $trekking->images()->delete();

                foreach ($request->file('images') as $image) {
                    $path = $image->store('trekkings', 'public');
                    TrekkingImage::create([
                        'trekking_id' => $trekking->id,
                        'image_path'  => $path
                    ]);
                }
            }

            // Update itineraries
            if ($request->has('itineraries')) {
                $trekking->itineraries()->delete();

                foreach ($request->itineraries as $item) {
                    TrekkingItinerary::create([
                        'trekking_id' => $trekking->id,
                        'day'         => $item['day'],
                        'title'       => $item['title'],
                        'description' => $item['description'] ?? null,
                    ]);
                }
            }

            // ✅ Log Activity
            $logMessage = ($oldTitle !== $trekking->title)
                ? "Updated Trekking title from '{$oldTitle}' to '{$trekking->title}'"
                : "Updated Trekking: {$trekking->title}";

            ActivityLogs::create([
                'name'       => auth()->user()->name ?? 'Guest',
                'ip_address' => $request->ip(),
                'title'      => $logMessage,
            ]);

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Trekking updated successfully',
                'data' => $trekking->load(['images', 'itineraries', 'category', 'subCategory'])
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Failed to update trekking',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete trekking + related images & itineraries
     */
    public function destroy(Request $request, $id)
{
    try {
        $trekking = Trekking::findOrFail($id);
        $trekTitle = $trekking->title;

        foreach ($trekking->images as $img) {
            Storage::disk('public')->delete($img->image_path);
        }

        $trekking->images()->delete();
        $trekking->itineraries()->delete();
        $trekking->delete();

        ActivityLogs::create([
            'name'       => auth()->user()?->name ?? 'Guest',
            'ip_address' => $request->ip(),
            'title'      => "Deleted Trekking: {$trekTitle}",
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Trekking deleted successfully'
        ], 200);

    } catch (\Exception $e) {
        \Log::error('Error deleting trekking: ' . $e->getMessage());
        return response()->json([
            'status' => false,
            'message' => 'Failed to delete trekking'
        ], 500);
    }
}
}
