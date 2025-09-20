<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    // Lấy danh sách báo cáo từ bảng results
    public function index()
    {
        $reports = DB::table('results')->get();
        return response()->json($reports);
    }

    // Cập nhật trạng thái báo cáo
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'RStatus' => 'required|in:Passed,Pending,Failed',
        ]);

        $affected = DB::table('results')
            ->where('ResultID', $id)
            ->update(['RStatus' => $validated['RStatus']]);

        if ($affected) {
            return response()->json(['message' => 'Report updated successfully']);
        }
        return response()->json(['message' => 'Report not found or unchanged'], 404);
    }

    // Xóa báo cáo
    public function destroy($id)
    {
        $deleted = DB::table('results')->where('ResultID', $id)->delete();

        if ($deleted) {
            return response()->json(['message' => 'Report deleted successfully']);
        }
        return response()->json(['message' => 'Report not found'], 404);
    }
}
