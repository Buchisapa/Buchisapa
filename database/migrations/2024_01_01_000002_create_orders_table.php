<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->string('customer_name');
            $table->string('phone');
            $table->string('delivery_address');
            $table->string('order_type')->default('delivery'); // delivery, pickup, table
            $table->string('payment_method')->default('yape'); // yape, plin, efectivo, tarjeta
            $table->decimal('subtotal', 8, 2);
            $table->decimal('delivery_fee', 8, 2)->default(4.00);
            $table->decimal('total', 8, 2);
            $table->string('status')->default('recibido'); // recibido, en_preparacion, listo, entregado, cancelado
            $table->text('notes')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
