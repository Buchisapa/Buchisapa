<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('claims', function (Blueprint $table) {
            $table->id();
            $table->string('claim_number')->unique();
            $table->string('full_name');
            $table->string('document_type'); // DNI, CE, PASAPORTE, RUC
            $table->string('document_number');
            $table->string('phone');
            $table->string('email');
            $table->string('address')->nullable();
            $table->string('contracted_type'); // producto, servicio
            $table->decimal('amount', 8, 2)->nullable();
            $table->string('claim_type'); // reclamo, queja
            $table->text('detail');
            $table->string('status')->default('pendiente'); // pendiente, en_proceso, atendido
            $table->text('response_notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('claims');
    }
};
