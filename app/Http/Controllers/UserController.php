<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ActivityLogs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index()
    {
        // You can use pagination if needed
        $users = User::all();
        return response()->json($users, 200);
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'image'    => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'role'     => 'required|string'
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images/users', 'public');
        }

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'image'    => $imagePath,
            'role'     => $validated['role'],
        ]);

        ActivityLogs::create([
            'name'       => auth()->user()->name ?? 'Guest',
            'ip_address' => $request->ip(),
            'title'      => "Created user: {$user->name}",
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'data'    => [
                'user'      => $user,
                'image_url' => $user->image ? asset('storage/' . $user->image) : null,
            ]
        ], 201);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $oldName = $user->name; // Save old name for logging

        $validated = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'email'    => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|nullable|string|min:6',
            'image'    => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'role'     => 'sometimes|string'
        ]);

        // Hash password only if provided
        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        // Replace image if new one is uploaded
        if ($request->hasFile('image')) {
            if ($user->image) {
                Storage::disk('public')->delete($user->image);
            }
            $validated['image'] = $request->file('image')->store('images/users', 'public');
        }

        $user->update($validated);

        // Activity log with old & new names
        ActivityLogs::create([
            'name'       => auth()->user()->name ?? 'Guest',
            'ip_address' => $request->ip(),
            'title'      => "Updated user from '{$oldName}' to '{$user->name}'",
        ]);

        return response()->json([
            'message' => 'User updated successfully',
            'data'    => [
                'user'      => $user,
                'image_url' => $user->image ? asset('storage/' . $user->image) : null,
            ]
        ], 200);
    }

    /**
     * Remove the specified user.
     */
    public function destroy(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $deletedName = $user->name;

        if ($user->image) {
            Storage::disk('public')->delete($user->image);
        }

        $user->delete();

        ActivityLogs::create([
            'name'       => auth()->user()->name ?? 'Guest',
            'ip_address' => $request->ip(),
            'title'      => "Deleted user: {$deletedName}",
        ]);

        return response()->json([
            'message' => 'User deleted successfully'
        ], 200);
    }
}
