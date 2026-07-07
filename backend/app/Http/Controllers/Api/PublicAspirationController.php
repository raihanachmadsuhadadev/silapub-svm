<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Aspiration;
use Illuminate\Http\JsonResponse;

class PublicAspirationController extends Controller
{
    public function latest(): JsonResponse
    {
        $aspirations = Aspiration::query()
            ->with(['category:id,name', 'region:id,rt,rw,name'])
            ->latest('submitted_at')
            ->limit(6)
            ->get([
                'id',
                'code',
                'title',
                'status',
                'priority_recommendation',
                'submitted_at',
                'aspiration_category_id',
                'region_id',
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Aspirasi terbaru berhasil dimuat',
            'data' => $aspirations,
        ]);
    }
}
