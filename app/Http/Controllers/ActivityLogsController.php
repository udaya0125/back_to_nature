<?php

namespace App\Http\Controllers;

use App\Models\ActivityLogs;
use Illuminate\Http\Request;

class ActivityLogsController extends Controller
{
    /**
     * Display a listing of the activity logs.
     */
    public function index()
    {
        // Fetch all logs, latest first
        $logs = ActivityLogs::latest()->get();

        return response()->json([
            'success' => true,
            'data' => $logs
        ]);
    }
}
