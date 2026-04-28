<?php

namespace App\Http\Controllers;

use App\Models\Hiking;
use App\Models\HikingImage;
use App\Models\HikingItinerary;
use App\Models\ActivityLogs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class HikingController extends Controller
{
    /**
     * Display a listing of the resource.
     * GET /hikings
     */
    public function index()
    {
        $hikings = Hiking::with(['images', 'itineraries', 'category', 'subCategory'])->latest()->get();

        return response()->json([
            'status' => true,
            'message' => 'All Hiking records fetched successfully.',
            'data' => $hikings
        ], 200);
    }


    public function indexShowHirSlug($slug)
    {
        $tour = Hiking::where('slug', $slug)
            ->with(['images', 'itinerary', 'category', 'subCategory'])
            ->firstOrFail();

        return response()->json([
            'status' => true,
            'message' => 'All Hiking records fetched successfully.',
            'data' => $hikings
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     * POST /hikings
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title'             => 'required|string|max:255|unique:hikings,title',
            'description'       => 'required|string',
            'included'          => 'nullable|string',
            'excluded'          => 'nullable|string',
            'category_id'       => 'required|exists:categories,id',
            'sub_category_id'   => 'nullable|exists:sub_categories,id',
            'what_to_bring'     => 'nullable|string',
            'best_time_to_visit'=> 'nullable|string',
            'duration'          => 'nullable|string',
            'elevation'         => 'nullable|string',
            'season'            => 'nullable|string',

            'images'            => 'nullable|array',
            'images.*'          => 'image|mimes:jpeg,png,jpg,webp|max:4096',

            'itineraries'       => 'nullable|array',
            'itineraries.*.day'         => 'required_with:itineraries|string|max:50',
            'itineraries.*.title'       => 'required_with:itineraries|string|max:255',
            'itineraries.*.description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            $hiking = Hiking::create($request->only([
                'title','description','included','excluded',
                'category_id','sub_category_id','what_to_bring',
                'best_time_to_visit','duration','elevation','season'
            ]));

            // Save images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $img) {
                    $path = $img->store('hiking_images', 'public');
                    HikingImage::create([
                        'hiking_id' => $hiking->id,
                        'image_path' => $path,
                    ]);
                }
            }

            // Save itineraries
            if ($request->filled('itineraries')) {
                foreach ($request->itineraries as $itinerary) {
                    HikingItinerary::create([
                        'hiking_id'   => $hiking->id,
                        'day'         => $itinerary['day'],
                        'title'       => $itinerary['title'],
                        'description' => $itinerary['description'] ?? null
                    ]);
                }
            }

            // Log activity
            ActivityLogs::create([
                'name'       => auth()->user()->name ?? 'Guest',
                'ip_address' => $request->ip(),
                'title'      => "Created Hiking: {$hiking->title}",
            ]);

            DB::commit();

            return response()->json([
                'status'  => true,
                'message' => 'Hiking created successfully.',
                'data'    => $hiking->load(['images','itineraries', 'category', 'subCategory'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Failed to create hiking',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource.
     * PUT/PATCH /hikings/{id}
     */
    public function update(Request $request, $id)
    {
        $hiking = Hiking::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title'             => 'sometimes|required|string|max:255|unique:hikings,title,' . $hiking->id,
            'description'       => 'sometimes|required|string',
            'included'          => 'nullable|string',
            'excluded'          => 'nullable|string',
            'category_id'       => 'sometimes|required|exists:categories,id',
            'sub_category_id'   => 'nullable|exists:sub_categories,id',
            'what_to_bring'     => 'nullable|string',
            'best_time_to_visit'=> 'nullable|string',
            'duration'          => 'nullable|string',
            'elevation'         => 'nullable|string',
            'season'            => 'nullable|string',

            'images'            => 'nullable|array',
            'images.*'          => 'image|mimes:jpeg,png,jpg,webp|max:4096',

            'itineraries'       => 'nullable|array',
            'itineraries.*.day' => 'required_with:itineraries|string|max:50',
            'itineraries.*.title'=> 'required_with:itineraries|string|max:255',
            'itineraries.*.description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            $oldTitle = $hiking->title;

            $hiking->update($request->only([
                'title','description','included','excluded',
                'category_id','sub_category_id','what_to_bring',
                'best_time_to_visit','duration','elevation','season'
            ]));

            // Replace images only if new ones provided
            if ($request->hasFile('images')) {
                // Delete old images from storage
                foreach ($hiking->images as $img) {
                    Storage::disk('public')->delete($img->image_path);
                }
                // Delete old image records
                $hiking->images()->delete();

                // Upload new images
                foreach ($request->file('images') as $img) {
                    $path = $img->store('hiking_images', 'public');
                    HikingImage::create([
                        'hiking_id' => $hiking->id,
                        'image_path' => $path,
                    ]);
                }
            }

            // Replace itineraries only if new ones provided
            if ($request->filled('itineraries')) {
                $hiking->itineraries()->delete(); // Delete all old

                foreach ($request->itineraries as $itinerary) {
                    HikingItinerary::create([
                        'hiking_id'   => $hiking->id,
                        'day'         => $itinerary['day'],
                        'title'       => $itinerary['title'],
                        'description' => $itinerary['description'] ?? null
                    ]);
                }
            }

            // Log activity
            $logMessage = ($oldTitle !== $hiking->title)
                ? "Updated Hiking title from '{$oldTitle}' to '{$hiking->title}'"
                : "Updated Hiking: {$hiking->title}";

            ActivityLogs::create([
                'name'       => auth()->user()->name ?? 'Guest',
                'ip_address' => $request->ip(),
                'title'      => $logMessage,
            ]);

            DB::commit();

            return response()->json([
                'status'  => true,
                'message' => 'Hiking updated successfully.',
                'data'    => $hiking->load(['images','itineraries', 'category', 'subCategory'])
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Failed to update hiking',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource.
     * DELETE /hikings/{id}
     */
    public function destroy(Request $request, $id)
    {
        $hiking = Hiking::with('images')->findOrFail($id);
        $hikingTitle = $hiking->title;

        DB::beginTransaction();
        try {
            // Delete images from storage
            foreach ($hiking->images as $img) {
                Storage::disk('public')->delete($img->image_path);
            }

            // Delete related records
            $hiking->images()->delete();
            $hiking->itineraries()->delete();
            $hiking->delete();

            // Log activity
            ActivityLogs::create([
                'name'       => auth()->user()->name ?? 'Guest',
                'ip_address' => $request->ip(),
                'title'      => "Deleted Hiking: {$hikingTitle}",
            ]);

            DB::commit();

            return response()->json([
                'status'  => true,
                'message' => 'Hiking and related data deleted successfully.'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete hiking',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}