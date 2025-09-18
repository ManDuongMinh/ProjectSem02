<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CourseController extends Controller
{
    // Lấy tất cả courses
    public function index()
    {
        $courses = DB::table('courses')->get();
        return response()->json($courses);
    }

    // Cập nhật trạng thái course
    public function update(Request $request, $id)
    {
        DB::table('courses')
            ->where('CourseID', $id)
            ->update(['CStatus' => $request->CStatus]);

        return response()->json(['message' => 'Course updated successfully']);
    }

    // Xóa course
    public function destroy($id)
    {
        DB::table('courses')->where('CourseID', $id)->delete();
        return response()->json(['message' => 'Course deleted successfully']);
    }
}
