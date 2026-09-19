<?php

return [
    'name' => env('APP_NAME', 'Buchisapa - Sabor Amazónico'),
    'env' => env('APP_ENV', 'production'),
    'debug' => (bool) env('APP_DEBUG', false),
    'url' => env('APP_URL', 'http://localhost:3000'),
    'timezone' => 'America/Lima',
    'locale' => 'es',
    'fallback_locale' => 'es',
    'faker_locale' => 'es_PE',
    'cipher' => 'AES-256-CBC',
    'key' => env('APP_KEY', 'base64:buchisapatarapoto2026secretkey123456='),
];
