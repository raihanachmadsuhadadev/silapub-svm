<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('warga')->after('password');
            $table->string('nik')->nullable()->unique()->after('role');
            $table->string('phone')->nullable()->after('nik');
            $table->string('rt')->nullable()->after('phone');
            $table->string('rw')->nullable()->after('rt');
            $table->text('address')->nullable()->after('rw');
            $table->boolean('is_active')->default(true)->after('address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role',
                'nik',
                'phone',
                'rt',
                'rw',
                'address',
                'is_active',
            ]);
        });
    }
};
