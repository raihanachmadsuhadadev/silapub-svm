<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Aspiration;
use App\Models\AspirationCategory;
use App\Models\Region;
use App\Models\SvmTrainingData;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@silapub.test'],
            [
                'name' => 'Admin Kelurahan',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'nik' => null,
                'phone' => null,
                'rt' => null,
                'rw' => null,
                'address' => null,
                'is_active' => true,
            ],
        );

        User::updateOrCreate(
            ['email' => 'warga@silapub.test'],
            [
                'name' => 'Warga Demo',
                'password' => Hash::make('password'),
                'role' => 'warga',
                'nik' => '3209000000000001',
                'phone' => '081234567890',
                'rt' => '01',
                'rw' => '02',
                'address' => 'Kelurahan Watubelah',
                'is_active' => true,
            ],
        );

        $categories = [
            ['code' => 'KAT-INFRA', 'name' => 'Infrastruktur'],
            ['code' => 'KAT-KEB', 'name' => 'Kebersihan'],
            ['code' => 'KAT-KAM', 'name' => 'Keamanan'],
            ['code' => 'KAT-ADM', 'name' => 'Pelayanan Administrasi'],
            ['code' => 'KAT-SOS', 'name' => 'Sosial Kemasyarakatan'],
            ['code' => 'KAT-LING', 'name' => 'Lingkungan'],
            ['code' => 'KAT-EKO', 'name' => 'Ekonomi dan UMKM'],
            ['code' => 'KAT-LAIN', 'name' => 'Lainnya'],
        ];

        foreach ($categories as $category) {
            AspirationCategory::updateOrCreate(
                ['code' => $category['code']],
                [
                    'name' => $category['name'],
                    'description' => null,
                    'is_active' => true,
                ],
            );
        }

        $regions = [
            ['code' => 'WIL-RT01-RW01', 'rt' => '01', 'rw' => '01', 'name' => 'Lingkungan Watubelah Utara'],
            ['code' => 'WIL-RT02-RW01', 'rt' => '02', 'rw' => '01', 'name' => 'Lingkungan Watubelah Utara'],
            ['code' => 'WIL-RT03-RW01', 'rt' => '03', 'rw' => '01', 'name' => 'Lingkungan Watubelah Utara'],
            ['code' => 'WIL-RT01-RW02', 'rt' => '01', 'rw' => '02', 'name' => 'Lingkungan Watubelah Tengah'],
            ['code' => 'WIL-RT02-RW02', 'rt' => '02', 'rw' => '02', 'name' => 'Lingkungan Watubelah Tengah'],
            ['code' => 'WIL-RT03-RW02', 'rt' => '03', 'rw' => '02', 'name' => 'Lingkungan Watubelah Tengah'],
            ['code' => 'WIL-RT01-RW03', 'rt' => '01', 'rw' => '03', 'name' => 'Lingkungan Watubelah Selatan'],
            ['code' => 'WIL-RT02-RW03', 'rt' => '02', 'rw' => '03', 'name' => 'Lingkungan Watubelah Selatan'],
        ];

        foreach ($regions as $region) {
            Region::updateOrCreate(
                ['code' => $region['code']],
                [
                    'rt' => $region['rt'],
                    'rw' => $region['rw'],
                    'name' => $region['name'],
                    'address' => 'Kelurahan Watubelah',
                    'description' => null,
                    'is_active' => true,
                ],
            );
        }

        $warga = User::where('email', 'warga@silapub.test')->first();

        $aspirationSeeds = [
            ['code' => 'ASP-20260707-0001', 'category' => 'KAT-INFRA', 'region' => 'WIL-RT01-RW01', 'title' => 'Jalan berlubang di depan RT 01', 'status' => 'submitted', 'priority' => null],
            ['code' => 'ASP-20260707-0002', 'category' => 'KAT-KEB', 'region' => 'WIL-RT02-RW01', 'title' => 'Sampah menumpuk di pinggir jalan', 'status' => 'verified', 'priority' => 'tinggi'],
            ['code' => 'ASP-20260707-0003', 'category' => 'KAT-KAM', 'region' => 'WIL-RT03-RW01', 'title' => 'Lampu jalan mati di gang utama', 'status' => 'in_progress', 'priority' => 'sedang'],
            ['code' => 'ASP-20260707-0004', 'category' => 'KAT-LING', 'region' => 'WIL-RT01-RW02', 'title' => 'Saluran air tersumbat saat hujan', 'status' => 'completed', 'priority' => 'tinggi'],
            ['code' => 'ASP-20260707-0005', 'category' => 'KAT-ADM', 'region' => 'WIL-RT02-RW02', 'title' => 'Pelayanan administrasi perlu antrean lebih rapi', 'status' => 'rejected', 'priority' => 'rendah'],
            ['code' => 'ASP-20260707-0006', 'category' => 'KAT-KEB', 'region' => 'WIL-RT03-RW02', 'title' => 'Usulan penambahan tempat sampah', 'status' => 'submitted', 'priority' => null],
            ['code' => 'ASP-20260707-0007', 'category' => 'KAT-KAM', 'region' => 'WIL-RT01-RW03', 'title' => 'Pos ronda membutuhkan perbaikan', 'status' => 'verified', 'priority' => 'sedang'],
            ['code' => 'ASP-20260707-0008', 'category' => 'KAT-INFRA', 'region' => 'WIL-RT02-RW03', 'title' => 'Drainase meluap saat hujan deras', 'status' => 'in_progress', 'priority' => 'tinggi'],
            ['code' => 'ASP-20260707-0009', 'category' => 'KAT-LING', 'region' => 'WIL-RT01-RW01', 'title' => 'Taman lingkungan kurang terawat', 'status' => 'completed', 'priority' => 'rendah'],
            ['code' => 'ASP-20260707-0010', 'category' => 'KAT-EKO', 'region' => 'WIL-RT02-RW02', 'title' => 'Kegiatan UMKM butuh pendampingan', 'status' => 'submitted', 'priority' => null],
            ['code' => 'ASP-20260707-0011', 'category' => 'KAT-INFRA', 'region' => 'WIL-RT03-RW01', 'title' => 'Jembatan kecil mulai retak', 'status' => 'verified', 'priority' => 'tinggi'],
            ['code' => 'ASP-20260707-0012', 'category' => 'KAT-SOS', 'region' => 'WIL-RT01-RW02', 'title' => 'Usulan kegiatan posyandu remaja', 'status' => 'completed', 'priority' => 'rendah'],
            ['code' => 'ASP-20260707-0013', 'category' => 'KAT-ADM', 'region' => 'WIL-RT02-RW01', 'title' => 'Permintaan jadwal layanan malam', 'status' => 'in_progress', 'priority' => 'sedang'],
            ['code' => 'ASP-20260707-0014', 'category' => 'KAT-KEB', 'region' => 'WIL-RT03-RW02', 'title' => 'Tempat pembuangan sementara penuh', 'status' => 'verified', 'priority' => 'tinggi'],
            ['code' => 'ASP-20260707-0015', 'category' => 'KAT-LING', 'region' => 'WIL-RT01-RW03', 'title' => 'Permintaan penanaman pohon pelindung', 'status' => 'submitted', 'priority' => null],
            ['code' => 'ASP-20260707-0016', 'category' => 'KAT-KAM', 'region' => 'WIL-RT02-RW03', 'title' => 'CCTV lingkungan tidak menyala', 'status' => 'rejected', 'priority' => 'sedang'],
            ['code' => 'ASP-20260707-0017', 'category' => 'KAT-EKO', 'region' => 'WIL-RT01-RW01', 'title' => 'Pelatihan pemasaran online untuk UMKM', 'status' => 'completed', 'priority' => 'rendah'],
            ['code' => 'ASP-20260707-0018', 'category' => 'KAT-INFRA', 'region' => 'WIL-RT02-RW02', 'title' => 'Paving jalan lingkungan bergelombang', 'status' => 'in_progress', 'priority' => 'sedang'],
            ['code' => 'ASP-20260707-0019', 'category' => 'KAT-SOS', 'region' => 'WIL-RT03-RW01', 'title' => 'Bantuan warga lansia perlu didata ulang', 'status' => 'submitted', 'priority' => null],
            ['code' => 'ASP-20260707-0020', 'category' => 'KAT-LAIN', 'region' => 'WIL-RT01-RW02', 'title' => 'Papan informasi kelurahan perlu diperbarui', 'status' => 'completed', 'priority' => 'rendah'],
        ];

        foreach ($aspirationSeeds as $index => $seed) {
            $category = AspirationCategory::where('code', $seed['category'])->first();
            $region = Region::where('code', $seed['region'])->first();
            $admin = User::where('email', 'admin@silapub.test')->first();
            $submittedAt = now()->subDays(10 - $index);

            $aspiration = Aspiration::updateOrCreate(
                ['code' => $seed['code']],
                [
                    'user_id' => $warga?->id,
                    'aspiration_category_id' => $category?->id,
                    'region_id' => $region?->id,
                    'title' => $seed['title'],
                    'content' => 'Aspirasi demo untuk kebutuhan pengujian fitur warga dan monitoring status aspirasi pada sistem SILAPUB.',
                    'location_detail' => 'Area sekitar '.$region?->name,
                    'status' => $seed['status'],
                    'priority_recommendation' => $seed['priority'],
                    'svm_score' => $seed['priority'] ? round(0.64 + (($index % 6) * 0.047), 4) : null,
                    'submitted_at' => $submittedAt,
                    'verified_at' => in_array($seed['status'], ['verified', 'in_progress', 'completed'], true) ? $submittedAt->copy()->addDay() : null,
                    'processed_at' => in_array($seed['status'], ['in_progress', 'completed'], true) ? $submittedAt->copy()->addDays(2) : null,
                    'completed_at' => $seed['status'] === 'completed' ? $submittedAt->copy()->addDays(4) : null,
                ],
            );

            $aspiration->statusHistories()->updateOrCreate(
                ['status' => 'submitted'],
                [
                    'note' => 'Aspirasi berhasil diajukan oleh warga',
                    'created_by' => $warga?->id,
                    'created_at' => $submittedAt,
                    'updated_at' => $submittedAt,
                ],
            );

            if ($seed['status'] !== 'submitted') {
                $aspiration->statusHistories()->updateOrCreate(
                    ['status' => $seed['status']],
                    [
                        'note' => 'Status demo: '.$seed['status'],
                        'created_by' => null,
                        'created_at' => $submittedAt->copy()->addDay(),
                        'updated_at' => $submittedAt->copy()->addDay(),
                    ],
                );
            }

            if (in_array($seed['status'], ['in_progress', 'completed', 'rejected'], true) && $admin) {
                $aspiration->responses()->updateOrCreate(
                    ['status' => $seed['status']],
                    [
                        'admin_id' => $admin->id,
                        'response_text' => match ($seed['status']) {
                            'in_progress' => 'Aspirasi sedang kami koordinasikan dengan petugas terkait.',
                            'completed' => 'Aspirasi telah selesai ditindaklanjuti. Terima kasih atas laporan warga.',
                            'rejected' => 'Aspirasi belum dapat diproses karena informasi pendukung belum mencukupi.',
                            default => 'Tanggapan admin kelurahan.',
                        },
                        'created_at' => $submittedAt->copy()->addDays(2),
                        'updated_at' => $submittedAt->copy()->addDays(2),
                    ],
                );
            }
        }

        $trainingSeeds = [
            ['Jalan utama berlubang besar dan membahayakan pengendara', 'tinggi'],
            ['Saluran air tersumbat menyebabkan banjir saat hujan deras', 'tinggi'],
            ['Jembatan lingkungan rusak dan berisiko ambruk', 'tinggi'],
            ['Kabel listrik menjuntai di jalan warga', 'tinggi'],
            ['Pohon besar hampir tumbang di dekat rumah warga', 'tinggi'],
            ['Tembok penahan tanah retak dan membahayakan', 'tinggi'],
            ['Lampu jalan mati di area rawan keamanan', 'tinggi'],
            ['Genangan air tinggi menghambat akses warga', 'tinggi'],
            ['Sampah menumpuk menyebabkan bau dan penyakit', 'tinggi'],
            ['Pos keamanan rusak dan tidak dapat digunakan', 'tinggi'],
            ['Lampu jalan mati di gang kecil', 'sedang'],
            ['Tempat sampah umum perlu ditambah', 'sedang'],
            ['Jalan lingkungan mulai retak', 'sedang'],
            ['Drainase perlu dibersihkan', 'sedang'],
            ['Pelayanan administrasi perlu antrean lebih tertib', 'sedang'],
            ['Warga meminta jadwal kerja bakti rutin', 'sedang'],
            ['Area taman perlu dirapikan', 'sedang'],
            ['Rambu lingkungan perlu diperbarui', 'sedang'],
            ['Fasilitas pos ronda perlu dicat ulang', 'sedang'],
            ['Saluran air mulai dangkal', 'sedang'],
            ['Usulan penambahan tanaman hias', 'rendah'],
            ['Permintaan pengecatan pagar lingkungan', 'rendah'],
            ['Usulan lomba kebersihan antar RT', 'rendah'],
            ['Penambahan papan informasi kegiatan warga', 'rendah'],
            ['Usulan dekorasi taman kecil', 'rendah'],
            ['Permintaan tempat duduk di balai warga', 'rendah'],
            ['Usulan mural edukasi lingkungan', 'rendah'],
            ['Penataan ulang pot bunga', 'rendah'],
            ['Usulan jadwal olahraga bersama', 'rendah'],
            ['Permintaan lampu hias untuk kegiatan warga', 'rendah'],
        ];

        foreach ($trainingSeeds as [$text, $label]) {
            SvmTrainingData::updateOrCreate(
                ['text' => $text],
                [
                    'title' => null,
                    'label' => $label,
                    'is_active' => true,
                    'created_by' => User::where('email', 'admin@silapub.test')->value('id'),
                ],
            );
        }
    }
}
