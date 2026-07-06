<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Aspiration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

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
            $aspiration->load(['user', 'category', 'region', 'attachments', 'statusHistories.creator', 'responses.admin']),
        );
    }

    public function verify(Request $request, Aspiration $aspiration): JsonResponse
    {
        if ($response = $this->adminOnly($request)) {
            return $response;
        }

        if ($aspiration->status !== 'submitted') {
            return $this->error('Hanya aspirasi berstatus diajukan yang dapat diverifikasi.', 422);
        }

        $validated = $request->validate([
            'note' => ['nullable', 'string', 'min:5'],
        ]);

        return $this->applyStatusUpdate(
            $request,
            $aspiration,
            'verified',
            $validated['note'] ?? 'Aspirasi telah diverifikasi oleh admin kelurahan.',
            false,
            'Aspirasi berhasil diverifikasi',
        );
    }

    public function reject(Request $request, Aspiration $aspiration): JsonResponse
    {
        if ($response = $this->adminOnly($request)) {
            return $response;
        }

        if ($aspiration->status === 'completed') {
            return $this->error('Aspirasi yang sudah selesai tidak dapat ditolak.', 422);
        }

        if ($aspiration->status === 'rejected') {
            return $this->error('Aspirasi sudah berstatus ditolak.', 422);
        }

        $validated = $request->validate([
            'note' => ['required', 'string', 'min:5'],
        ]);

        return $this->applyStatusUpdate(
            $request,
            $aspiration,
            'rejected',
            $validated['note'],
            true,
            'Aspirasi berhasil ditolak',
        );
    }

    public function updateStatus(Request $request, Aspiration $aspiration): JsonResponse
    {
        if ($response = $this->adminOnly($request)) {
            return $response;
        }

        $validated = $request->validate([
            'status' => ['required', Rule::in(['verified', 'in_progress', 'completed', 'rejected'])],
            'note' => [
                Rule::requiredIf(fn () => in_array($request->input('status'), ['completed', 'rejected'], true)),
                'nullable',
                'string',
                'min:5',
            ],
        ]);

        $allowedTransitions = [
            'submitted' => ['verified', 'rejected'],
            'verified' => ['in_progress', 'rejected'],
            'in_progress' => ['completed', 'rejected'],
        ];

        if (in_array($aspiration->status, ['completed', 'rejected'], true)) {
            return $this->error('Aspirasi sudah berstatus final dan tidak dapat diubah.', 422);
        }

        if (! in_array($validated['status'], $allowedTransitions[$aspiration->status] ?? [], true)) {
            return $this->error('Perubahan status tidak sesuai alur yang diizinkan.', 422);
        }

        return $this->applyStatusUpdate(
            $request,
            $aspiration,
            $validated['status'],
            $validated['note'] ?? $this->defaultNote($validated['status']),
            filled($validated['note'] ?? null),
            'Status aspirasi berhasil diperbarui',
        );
    }

    public function storeResponse(Request $request, Aspiration $aspiration): JsonResponse
    {
        if ($response = $this->adminOnly($request)) {
            return $response;
        }

        $validated = $request->validate([
            'response_text' => ['required', 'string', 'min:5'],
        ]);

        $response = $aspiration->responses()->create([
            'admin_id' => $request->user()->id,
            'response_text' => $validated['response_text'],
            'status' => $aspiration->status,
        ]);

        return $this->success('Tanggapan admin berhasil dikirim', $response->load('admin'), 201);
    }

    private function applyStatusUpdate(
        Request $request,
        Aspiration $aspiration,
        string $status,
        string $note,
        bool $createResponse,
        string $message,
    ): JsonResponse {
        $aspiration = DB::transaction(function () use ($request, $aspiration, $status, $note, $createResponse) {
            $updates = ['status' => $status];

            if ($status === 'verified') {
                $updates['verified_at'] = $aspiration->verified_at ?? now();
            }

            if ($status === 'in_progress') {
                $updates['processed_at'] = $aspiration->processed_at ?? now();
            }

            if ($status === 'completed') {
                $updates['completed_at'] = $aspiration->completed_at ?? now();
            }

            $aspiration->update($updates);

            $aspiration->statusHistories()->create([
                'status' => $status,
                'note' => $note,
                'created_by' => $request->user()->id,
            ]);

            if ($createResponse) {
                $aspiration->responses()->create([
                    'admin_id' => $request->user()->id,
                    'response_text' => $note,
                    'status' => $status,
                ]);
            }

            return $aspiration->fresh();
        });

        return $this->success(
            $message,
            $aspiration->load(['user', 'category', 'region', 'attachments', 'statusHistories.creator', 'responses.admin']),
        );
    }

    private function defaultNote(string $status): string
    {
        return match ($status) {
            'verified' => 'Aspirasi telah diverifikasi oleh admin kelurahan.',
            'in_progress' => 'Aspirasi sedang diproses oleh admin kelurahan.',
            'completed' => 'Aspirasi telah selesai ditindaklanjuti.',
            'rejected' => 'Aspirasi ditolak oleh admin kelurahan.',
            default => 'Status aspirasi diperbarui.',
        };
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

    private function error(string $message, int $status = 400): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'data' => (object) [],
        ], $status);
    }
}
