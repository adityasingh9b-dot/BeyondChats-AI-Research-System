<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Kreait\Firebase\Contract\Database;

class ArticleController extends Controller
{
    protected $database;

    public function __construct(Database $database)
    {
        $this->database = $database;
    }

    // Saare articles dekhne ke liye
    public function index()
    {
        $articles = $this->database->getReference('articles')->getValue();
        return response()->json($articles);
    }

    // Naya article daalne ke liye (Fixed for Phase 2 & 3)
    public function store(Request $request)
    {
        // FIX: Hum 'url' aur 'link' dono ko check karenge
        // Taaki agar Node.js 'url' bheje ya Scraper 'link' bheje, dono save ho jayein
        $data = [
            'title'   => $request->input('title'),
            'content' => $request->input('content'),
            'source'  => $request->input('source', 'Scraper'),
            // Agar 'url' hai toh wo lo, warna 'link' lo, warna null
            'url'     => $request->input('url') ?? $request->input('link'), 
            'created_at' => now()->toDateTimeString(),
        ];

        $newPost = $this->database->getReference('articles')->push($data);
        
        return response()->json([
            'message' => 'Article Created Successfully!', 
            'id' => $newPost->getKey()
        ]);
    }
}
