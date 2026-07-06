<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Region;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RegionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Region::query()->orderBy('rw')->orderBy('rt');

        if ($request->user()->role !== 'admin' || $request->boolean('active')) {
            $query->where('is_active', true);
        }

        return $this->success('Data wilayah berhasil dimuat', $query->get());
    }

    public function store(Request $request): JsonResponse
    {
        if ($response = $this->adminOnly($request)) {
            return $response;
        }

        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50', 'unique:regions,code'],
            'rt' => ['required', 'string', 'max:10'],
            'rw' => ['required', 'string', 'max:10'],
            'name' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $region = Region::create([
            ...$validated,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return $this->success('Wilayah berhasil dibuat', $region, 201);
    }

    public function show(Request $request, Region $region): JsonResponse
    {
        if ($response = $this->adminOnly($request)) {
            return $response;
        }

        return $this->success('Detail wilayah berhasil dimuat', $region);
    }

    public function update(Request $request, Region $region): JsonResponse
    {
        if ($response = $this->adminOnly($request)) {
            return $response;
        }

        $validated = $request->validate([
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('regions', 'code')->ignore($region->id),
            ],
            'rt' => ['required', 'string', 'max:10'],
            'rw' => ['required', 'string', 'max:10'],
            'name' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $region->update($validated);

        return $this->success('Wilayah berhasil diperbarui', $region->fresh());
    }

    public function destroy(Request $request, Region $region): JsonResponse
    {
        if ($response = $this->adminOnly($request)) {
            return $response;
        }

        $region->delete();

        return $this->success('Wilayah berhasil dihapus');
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
