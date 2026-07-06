<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Aspiration;
use App\Models\AspirationResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    private const STATUSES = [
        'submitted' => 'Diajukan',
        'verified' => 'Diverifikasi',
        'in_progress' => 'Diproses',
        'completed' => 'Selesai',
        'rejected' => 'Ditolak',
    ];

    private const PRIORITIES = [
        'tinggi' => 'Tinggi',
        'sedang' => 'Sedang',
        'rendah' => 'Rendah',
    ];

    public function admin(Request $request): JsonResponse
    {
        if ($response = $this->roleOnly($request, 'admin')) {
            return $response;
        }

        $summary = $this->adminSummary();

        return $this->success('Dashboard admin berhasil dimuat', [
            'summary' => $summary,
            'status_distribution' => $this->statusDistribution(),
            'priority_distribution' => $this->priorityDistribution($summary['priority_unprocessed']),
            'category_distribution' => $this->categoryDistribution(),
            'region_distribution' => $this->regionDistribution(),
            'latest_aspirations' => Aspiration::query()
                ->with(['user', 'category', 'region'])
                ->latest('submitted_at')
                ->limit(8)
                ->get(),
        ]);
    }

    public function warga(Request $request): JsonResponse
    {
        if ($response = $this->roleOnly($request, 'warga')) {
            return $response;
        }

        $baseQuery = Aspiration::query()->where('user_id', $request->user()->id);

        return $this->success('Dashboard warga berhasil dimuat', [
            'summary' => [
                'total_aspirations' => (clone $baseQuery)->count(),
                'submitted' => (clone $baseQuery)->where('status', 'submitted')->count(),
                'in_progress' => (clone $baseQuery)->whereIn('status', ['verified', 'in_progress'])->count(),
                'completed' => (clone $baseQuery)->where('status', 'completed')->count(),
                'rejected' => (clone $baseQuery)->where('status', 'rejected')->count(),
            ],
            'latest_aspirations' => (clone $baseQuery)
                ->with(['category', 'region'])
                ->latest('submitted_at')
                ->limit(5)
                ->get(),
            'latest_responses' => AspirationResponse::query()
                ->with(['admin', 'aspiration.category', 'aspiration.region'])
                ->whereHas('aspiration', fn ($query) => $query->where('user_id', $request->user()->id))
                ->latest()
                ->limit(5)
                ->get(),
        ]);
    }

    private function adminSummary(): array
    {
        $baseQuery = Aspiration::query();

        return [
            'total_aspirations' => (clone $baseQuery)->count(),
            'submitted' => (clone $baseQuery)->where('status', 'submitted')->count(),
            'verified' => (clone $baseQuery)->where('status', 'verified')->count(),
            'in_progress' => (clone $baseQuery)->where('status', 'in_progress')->count(),
            'completed' => (clone $baseQuery)->where('status', 'completed')->count(),
            'rejected' => (clone $baseQuery)->where('status', 'rejected')->count(),
            'priority_high' => (clone $baseQuery)->where('priority_recommendation', 'tinggi')->count(),
            'priority_medium' => (clone $baseQuery)->where('priority_recommendation', 'sedang')->count(),
            'priority_low' => (clone $baseQuery)->where('priority_recommendation', 'rendah')->count(),
            'priority_unprocessed' => (clone $baseQuery)->whereNull('priority_recommendation')->count(),
        ];
    }

    private function statusDistribution(): array
    {
        return collect(self::STATUSES)
            ->map(fn (string $label, string $status) => [
                'label' => $label,
                'value' => Aspiration::where('status', $status)->count(),
            ])
            ->values()
            ->all();
    }

    private function priorityDistribution(int $unprocessed): array
    {
        $distribution = collect(self::PRIORITIES)
            ->map(fn (string $label, string $priority) => [
                'label' => $label,
                'value' => Aspiration::where('priority_recommendation', $priority)->count(),
            ])
            ->values();

        $distribution->push([
            'label' => 'Belum diproses',
            'value' => $unprocessed,
        ]);

        return $distribution->all();
    }

    private function categoryDistribution(): array
    {
        return Aspiration::query()
            ->join('aspiration_categories', 'aspirations.aspiration_category_id', '=', 'aspiration_categories.id')
            ->selectRaw('aspiration_categories.name as label, count(*) as value')
            ->groupBy('aspiration_categories.name')
            ->orderByDesc('value')
            ->limit(5)
            ->get()
            ->map(fn ($item) => [
                'label' => $item->label,
                'value' => (int) $item->value,
            ])
            ->toArray();
    }

    private function regionDistribution(): array
    {
        return Aspiration::query()
            ->join('regions', 'aspirations.region_id', '=', 'regions.id')
            ->selectRaw("concat('RT ', regions.rt, ' / RW ', regions.rw) as label, count(*) as value")
            ->groupBy('regions.rt', 'regions.rw')
            ->orderByDesc('value')
            ->limit(5)
            ->get()
            ->map(fn ($item) => [
                'label' => $item->label,
                'value' => (int) $item->value,
            ])
            ->toArray();
    }

    private function roleOnly(Request $request, string $role): ?JsonResponse
    {
        if ($request->user()->role === $role) {
            return null;
        }

        return response()->json([
            'success' => false,
            'message' => 'Akses tidak sesuai role.',
            'data' => (object) [],
        ], 403);
    }

    private function success(string $message, mixed $data = []): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ]);
    }
}
