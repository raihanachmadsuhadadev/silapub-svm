<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SvmTrainingData;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SvmTrainingDataController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        if ($response = $this->adminOnly($request)) {
            return $response;
        }

        return $this->success(
            'Data latih SVM berhasil dimuat',
            SvmTrainingData::query()->with('creator')->latest()->get(),
        );
    }

    public function store(Request $request): JsonResponse
    {
        if ($response = $this->adminOnly($request)) {
            return $response;
        }

        $validated = $this->validated($request);

        $data = SvmTrainingData::create([
            ...$validated,
            'is_active' => $validated['is_active'] ?? true,
            'created_by' => $request->user()->id,
        ]);

        return $this->success('Data latih SVM berhasil dibuat', $data, 201);
    }

    public function show(Request $request, SvmTrainingData $svmTrainingDatum): JsonResponse
    {
        if ($response = $this->adminOnly($request)) {
            return $response;
        }

        return $this->success('Detail data latih SVM berhasil dimuat', $svmTrainingDatum->load('creator'));
    }

    public function update(Request $request, SvmTrainingData $svmTrainingDatum): JsonResponse
    {
        if ($response = $this->adminOnly($request)) {
            return $response;
        }

        $svmTrainingDatum->update($this->validated($request));

        return $this->success('Data latih SVM berhasil diperbarui', $svmTrainingDatum->fresh());
    }

    public function destroy(Request $request, SvmTrainingData $svmTrainingDatum): JsonResponse
    {
        if ($response = $this->adminOnly($request)) {
            return $response;
        }

        $svmTrainingDatum->delete();

        return $this->success('Data latih SVM berhasil dihapus');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'title' => ['nullable', 'string', 'max:150'],
            'text' => ['required', 'string', 'min:10'],
            'label' => ['required', Rule::in(['tinggi', 'sedang', 'rendah'])],
            'is_active' => ['sometimes', 'boolean'],
        ]);
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
