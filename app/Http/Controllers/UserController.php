<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index() {
        $users = DB::table('accounts')->get();
        return response()->json($users);
    }

    public function update(Request $request, $id) {
        DB::table('accounts')
            ->where('AccountID', $id)
            ->update(['ARole' => $request->ARole]);
        return response()->json(['message' => 'User updated']);
    }

    public function destroy($id) {
        DB::table('accounts')->where('AccountID', $id)->delete();
        return response()->json(['message' => 'User deleted']);
    }
}

