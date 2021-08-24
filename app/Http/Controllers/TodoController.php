<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TodoController extends Controller
{
    //
    public function listView(){
        return view('/list');
    }

    public function editView(){
        return view('edit');

    }

    public function addView(){
        return view('add');
    }
}
