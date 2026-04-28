<?php

namespace App\Http\Controllers;

use App\Models\Tour;
use App\Models\TourImage;
use App\Models\TourItinerary;
use App\Models\ActivityLogs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TourController extends Controller
{
    /**
     * Display all tours with images & itineraries
     */
    public function index()
    {
        $tours = Tour::with(['images', 'itinerary', 'category', 'subCategory'])->get();

        return response()->json([
            'status' => true,
            'message' => 'Tours retrieved successfully',
            'data' => $tours
        ], 200);
    }

    public function indexShowTourSlug($slug)
    {
        $tour = Tour::where('slug', $slug)
            ->with(['images', 'itinerary', 'category', 'subCategory'])
            ->firstOrFail();

        return response()->json([
            'status' => true,
            'message' => 'Tour retrieved successfully',
            'data' => $tour
        ], 200);
    }

    /**
     * Store a new tour
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'                 => 'required|string|max:255',
            'description'           => 'nullable|string',
            'tour_type'             => 'nullable|string|max:255',
            'includes'              => 'nullable|string',
            'excludes'              => 'nullable|string',
            'category_id'           => 'nullable|integer|exists:categories,id',
            'sub_category_id'       => 'nullable|integer|exists:sub_categories,id',
            'important_message'     => 'nullable|string',
            'best_time'             => 'nullable|string|max:255',
            'duration'              => 'nullable|string|max:255',
            'season'                => 'nullable|string|max:255',
            'city_covered'          => 'nullable|string|max:255',
            'things_to_remember'    => 'nullable|string',
            'terms_for_booking'     => 'nullable|string',

            'images'                => 'nullable|array',
            'images.*'              => 'nullable|image|mimes:jpeg,png,jpg|max:2048',

            'itinerary'             => 'nullable|array',
            'itinerary.*.day'       => 'required_with:itinerary|string|max:255',
            'itinerary.*.title'     => 'required_with:itinerary|string|max:255',
            'itinerary.*.description' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $tour = Tour::create($validated);

            // Save images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('tours', 'public');
                    $tour->images()->create(['image_path' => $path]);
                }
            }

            // Save itinerary
            if ($request->has('itinerary')) {
                foreach ($request->itinerary as $item) {
                    $tour->itinerary()->create([
                        'day' => $item['day'],
                        'title' => $item['title'],
                        'description' => $item['description'] ?? null,
                    ]);
                }
            }

            // Log activity
            ActivityLogs::create([
                'name'       => auth()->user()->name ?? 'Guest',
                'ip_address' => $request->ip(),
                'title'      => "Created Tour: {$tour->title}",
            ]);

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Tour created successfully',
                'data' => $tour->load(['images', 'itinerary', 'category', 'subCategory'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Failed to create tour',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an existing tour
     */
    public function update(Request $request, $id)
    {
        $tour = Tour::findOrFail($id);

        $validated = $request->validate([
            'title'                 => 'sometimes|required|string|max:255',
            'description'           => 'nullable|string',
            'tour_type'             => 'nullable|string|max:255',
            'includes'              => 'nullable|string',
            'excludes'              => 'nullable|string',
            'category_id'           => 'nullable|integer|exists:categories,id',
            'sub_category_id'       => 'nullable|integer|exists:sub_categories,id',
            'important_message'     => 'nullable|string',
            'best_time'             => 'nullable|string|max:255',
            'duration'              => 'nullable|string|max:255',
            'season'                => 'nullable|string|max:255',
            'city_covered'          => 'nullable|string|max:255',
            'things_to_remember'    => 'nullable|string',
            'terms_for_booking'     => 'nullable|string',

            'images'                => 'nullable|array',
            'images.*'              => 'nullable|image|mimes:jpeg,png,jpg|max:2048',

            'itinerary'             => 'nullable|array',
            'itinerary.*.day'       => 'required_with:itinerary|string|max:255',
            'itinerary.*.title'     => 'required_with:itinerary|string|max:255',
            'itinerary.*.description' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $oldTitle = $tour->title;

            $tour->update($validated);

            // Handle images update - only delete and replace if new images are provided
            if ($request->hasFile('images')) {
                $tour->images()->delete();
                foreach ($request->file('images') as $image) {
                    $path = $image->store('tours', 'public');
                    $tour->images()->create(['image_path' => $path]);
                }
            }

            // Handle itinerary update - only replace if new itinerary is provided
            if ($request->has('itinerary')) {
                $tour->itinerary()->delete();
                foreach ($request->itinerary as $item) {
                    $tour->itinerary()->create([
                        'day' => $item['day'],
                        'title' => $item['title'],
                        'description' => $item['description'] ?? null,
                    ]);
                }
            }

            // Log activity
            $logMessage = ($oldTitle !== $tour->title)
                ? "Updated Tour title from '{$oldTitle}' to '{$tour->title}'"
                : "Updated Tour: {$tour->title}";

            ActivityLogs::create([
                'name'       => auth()->user()->name ?? 'Guest',
                'ip_address' => $request->ip(),
                'title'      => $logMessage,
            ]);

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Tour updated successfully',
                'data' => $tour->load(['images', 'itinerary', 'category', 'subCategory'])
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Failed to update tour',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a tour
     */
    public function destroy(Request $request, $id)
    {
        $tour = Tour::findOrFail($id);
        $tourTitle = $tour->title;

        DB::beginTransaction();
        try {
            $tour->images()->delete();
            $tour->itinerary()->delete();
            $tour->delete();

            // Log activity
            ActivityLogs::create([
                'name'       => auth()->user()->name ?? 'Guest',
                'ip_address' => $request->ip(),
                'title'      => "Deleted Tour: {$tourTitle}",
            ]);

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Tour deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete tour',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}