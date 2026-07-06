<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Aspiration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminAspirationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        if ($response = $this->adminOnly($request)) {
            return $response;
        }

        $aspirations = Aspiration::query()
            ->with(['user', 'category', 'region', 'statusHistories'])
            ->withCount('attachments')
            ->latest()
            ->get();

        return $this->success('Data aspirasi berhasil dimuat', $aspirations);
    }

    public function show(Request $request, Aspiration $aspiration): JsonResponse
    {
        if ($response = $this->adminOnly($request)) {
            return $response;
        }

        return $this->success(
            'Detail aspirasi berhasil dimuat',
            $aspiration->load(['user', 'category', 'region', 'attachments', 'statusHistories.creator']),
        );
    }

    private function adminOnly(Request $request): ?JsonResponse
    {
        if ($request->user()->role === 'admin') {
            return null;
        }

        return response()->json([
            'success' => false,
            'message' => 'Akses hanya untuk admin.',
            'data' => (object) [],
        ], 403);
    }

    private function success(string $message, mixed $data = [], int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }
}
