<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Aspiration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AspirationReportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        if ($response = $this->adminOnly($request)) {
            return $response;
        }

        $validated = $request->validate([
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'status' => ['nullable', Rule::in(['submitted', 'verified', 'in_progress', 'completed', 'rejected'])],
            'priority' => ['nullable', Rule::in(['tinggi', 'sedang', 'rendah', 'unprocessed'])],
            'category_id' => ['nullable', 'integer', 'exists:aspiration_categories,id'],
            'region_id' => ['nullable', 'integer', 'exists:regions,id'],
            'search' => ['nullable', 'string', 'max:150'],
        ]);

        $query = $this->filteredQuery($validated);

        $items = (clone $query)
            ->with(['user', 'category', 'region'])
            ->latest('submitted_at')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Laporan aspirasi berhasil dimuat',
            'data' => [
                'summary' => [
                    'total' => (clone $query)->count(),
                    'submitted' => (clone $query)->where('status', 'submitted')->count(),
                    'verified' => (clone $query)->where('status', 'verified')->count(),
                    'in_progress' => (clone $query)->where('status', 'in_progress')->count(),
                    'completed' => (clone $query)->where('status', 'completed')->count(),
                    'rejected' => (clone $query)->where('status', 'rejected')->count(),
                    'priority_high' => (clone $query)->where('priority_recommendation', 'tinggi')->count(),
                    'priority_medium' => (clone $query)->where('priority_recommendation', 'sedang')->count(),
                    'priority_low' => (clone $query)->where('priority_recommendation', 'rendah')->count(),
                    'priority_unprocessed' => (clone $query)->whereNull('priority_recommendation')->count(),
                ],
                'items' => $items,
            ],
        ]);
    }

    private function filteredQuery(array $filters)
    {
        return Aspiration::query()
            ->when($filters['start_date'] ?? null, fn ($query, $date) => $query->whereDate('submitted_at', '>=', $date))
            ->when($filters['end_date'] ?? null, fn ($query, $date) => $query->whereDate('submitted_at', '<=', $date))
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($filters['priority'] ?? null, function ($query, $priority) {
                if ($priority === 'unprocessed') {
                    $query->whereNull('priority_recommendation');
                    return;
                }

                $query->where('priority_recommendation', $priority);
            })
            ->when($filters['category_id'] ?? null, fn ($query, $categoryId) => $query->where('aspiration_category_id', $categoryId))
            ->when($filters['region_id'] ?? null, fn ($query, $regionId) => $query->where('region_id', $regionId))
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($innerQuery) use ($search) {
                    $innerQuery
                        ->where('code', 'like', "%{$search}%")
                        ->orWhere('title', 'like', "%{$search}%")
                        ->orWhereHas('user', fn ($userQuery) => $userQuery->where('name', 'like', "%{$search}%"));
                });
            });
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
}
