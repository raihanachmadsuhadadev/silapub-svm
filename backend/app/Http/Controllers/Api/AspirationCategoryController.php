<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AspirationCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AspirationCategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = AspirationCategory::query()->latest();

        if ($request->user()->role !== 'admin' || $request->boolean('active')) {
            $query->where('is_active', true);
        }

        return $this->success('Data kategori aspirasi berhasil dimuat', $query->get());
    }

    public function store(Request $request): JsonResponse
    {
        if ($response = $this->adminOnly($request)) {
            return $response;
        }

        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50', 'unique:aspiration_categories,code'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $category = AspirationCategory::create([
            ...$validated,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return $this->success('Kategori aspirasi berhasil dibuat', $category, 201);
    }

    public function show(Request $request, AspirationCategory $aspirationCategory): JsonResponse
    {
        if ($response = $this->adminOnly($request)) {
            return $response;
        }

        return $this->success('Detail kategori aspirasi berhasil dimuat', $aspirationCategory);
    }

    public function update(Request $request, AspirationCategory $aspirationCategory): JsonResponse
    {
        if ($response = $this->adminOnly($request)) {
            return $response;
        }

        $validated = $request->validate([
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('aspiration_categories', 'code')->ignore($aspirationCategory->id),
            ],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $aspirationCategory->update($validated);

        return $this->success('Kategori aspirasi berhasil diperbarui', $aspirationCategory->fresh());
    }

    public function destroy(Request $request, AspirationCategory $aspirationCategory): JsonResponse
    {
        if ($response = $this->adminOnly($request)) {
            return $response;
        }

        $aspirationCategory->delete();

        return $this->success('Kategori aspirasi berhasil dihapus');
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
