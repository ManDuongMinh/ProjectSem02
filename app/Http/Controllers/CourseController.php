<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CourseController extends Controller
{
    public function index()
    {
        $courses = DB::table('courses')->get();
        return response()->json($courses);
    }

   public function store(Request $request)
{
    $validated = $request->validate([
        'CName' => 'required|string|max:255',
        'CDescription' => 'nullable|string',
    ]);

    // Lấy CourseID cuối cùng có prefix ADM
    $last = DB::table('courses')
        ->where('CourseID', 'like', 'ADM%')
        ->orderBy('CourseID', 'desc')
        ->first();

    if ($last) {
        // Lấy phần số phía sau ADM, tăng lên 1
        $num = intval(substr($last->CourseID, 3)) + 1;
        $newId = 'ADM' . str_pad($num, 5, '0', STR_PAD_LEFT);
    } else {
        $newId = 'ADM00001';
    }

    DB::table('courses')->insert([
        'CourseID'     => $newId,
        'CName'        => $validated['CName'],
        'CDescription' => $validated['CDescription'] ?? '',
        'StartDate'    => now(),
        'CStatus'      => 'Inactive',
        'CreatorID'    => 'INS003', // sau này thay bằng user login
    ]);

    return response()->json([
        'message'  => 'Course added successfully',
        'CourseID' => $newId
    ]);
}



public function update(Request $request, $id)
{
    $course = Course::find($id);

    if (!$course) {
        return response()->json(['error' => 'Course not found'], 404);
    }

    // chỉ cập nhật nếu có CStatus
    if ($request->has('CStatus')) {
        $course->CStatus = $request->input('CStatus');
    }

    $course->save();

    return response()->json([
        'message' => 'Course updated successfully',
        'course' => $course
    ]);
}


    public function destroy($id)
    {
        $deleted = DB::table('courses')->where('CourseID', $id)->delete();

        if ($deleted) {
            return response()->json(['message' => 'Course deleted successfully']);
        }
        return response()->json(['message' => 'Course not found'], 404);
    }
}
