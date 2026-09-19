<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => '1 Pollo a la Brasa + Papas + Ensalada',
                'slug' => '1-pollo-a-la-brasa',
                'description' => '1 pollo entero dorado al carbón de leña selvática, acompañado de papas crujientes, ensalada fresca y cremas de la casa.',
                'price' => 64.90,
                'original_price' => 75.00,
                'category' => 'brasas',
                'image_url' => 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&auto=format&fit=crop&q=80',
                'is_featured' => true,
                'is_active' => true,
                'serves_count' => 4,
                'sort_order' => 1
            ],
            [
                'name' => '1/2 Pollo a la Brasa + Guarniciones',
                'slug' => 'medio-pollo-a-la-brasa',
                'description' => 'Medio pollo dorado a la brasa con papas fritas crocantes y ensalada clásica.',
                'price' => 36.90,
                'original_price' => 42.00,
                'category' => 'brasas',
                'image_url' => 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80',
                'is_featured' => true,
                'is_active' => true,
                'serves_count' => 2,
                'sort_order' => 2
            ],
            [
                'name' => '1/4 Pollo a la Brasa Personal',
                'slug' => 'cuarto-pollo-a-la-brasa',
                'description' => 'Un cuarto de pollo jugoso al carbón con papas fritas y ensalada fresca.',
                'price' => 21.90,
                'original_price' => null,
                'category' => 'brasas',
                'image_url' => 'https://images.unsplash.com/photo-1594221708779-94832f4320d1?w=600&auto=format&fit=crop&q=80',
                'is_featured' => false,
                'is_active' => true,
                'serves_count' => 1,
                'sort_order' => 3
            ],
            [
                'name' => 'Chaufa Amazónico con Cecina Ahumada',
                'slug' => 'chaufa-amazonico-cecina',
                'description' => 'Arroz salteado al wok al estilo oriental-selvático con trozos de cecina ahumada de Tarapoto, plátano maduro frito y cebollita china.',
                'price' => 28.50,
                'original_price' => 34.00,
                'category' => 'chaufas',
                'image_url' => 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80',
                'is_featured' => true,
                'is_active' => true,
                'serves_count' => 1,
                'sort_order' => 4
            ],
            [
                'name' => 'Mostrito Buchisapa Especial',
                'slug' => 'mostrito-buchisapa-especial',
                'description' => '1/4 de pollo a la brasa dorado al carbón montado sobre una generosa porción de Chaufa Amazónico con papas fritas y plátano frito.',
                'price' => 26.90,
                'original_price' => 30.00,
                'category' => 'mostritos',
                'image_url' => 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80',
                'is_featured' => true,
                'is_active' => true,
                'serves_count' => 1,
                'sort_order' => 5
            ],
            [
                'name' => 'Jarra de Chicha Morada Artesanal (1L)',
                'slug' => 'chicha-morada-1l',
                'description' => 'Preparada con maíz morado fresco, piña, manzana y canela aromática.',
                'price' => 12.00,
                'original_price' => null,
                'category' => 'bebidas',
                'image_url' => 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
                'is_featured' => false,
                'is_active' => true,
                'serves_count' => 4,
                'sort_order' => 6
            ],
            [
                'name' => 'Inca Kola 1.5L Helada',
                'slug' => 'inca-kola-1-5l',
                'description' => 'La bebida de sabor nacional bien helada.',
                'price' => 10.00,
                'original_price' => null,
                'category' => 'bebidas',
                'image_url' => 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',
                'is_featured' => false,
                'is_active' => true,
                'serves_count' => 4,
                'sort_order' => 7
            ]
        ];

        foreach ($products as $item) {
            Product::updateOrCreate(['slug' => $item['slug']], $item);
        }
    }
}
