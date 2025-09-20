<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FeedbackController extends Controller
{
    public function index()
    {
        $feedback = DB::table('feedback')->get();
        return response()->json($feedback);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'FStatus' => 'required|in:Processed,Waiting',
        ]);

        $affected = DB::table('feedback')
            ->where('FeedbackID', $id)
            ->update(['FStatus' => $validated['FStatus']]);

        if ($affected) {
            return response()->json(['message' => 'Feedback updated successfully']);
        }
        return response()->json(['message' => 'Feedback not found or unchanged'], 404);
    }

    public function destroy($id)
    {
        $deleted = DB::table('feedback')->where('FeedbackID', $id)->delete();

        if ($deleted) {
            return response()->json(['message' => 'Feedback deleted successfully']);
        }
        return response()->json(['message' => 'Feedback not found'], 404);
    }
}
