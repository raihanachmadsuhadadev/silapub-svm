<?php

namespace Database\Seeders;

use App\Models\User;
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
    }
}
