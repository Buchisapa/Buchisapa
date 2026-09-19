<?php

namespace App\Http\Controllers;

use App\Models\Claim;
use Illuminate\Http\Request;

class ClaimController extends Controller
{
    /**
     * Muestra la vista del Libro de Reclamaciones Virtual.
     */
    public function index()
    {
        return view('claims');
    }

    /**
     * Registrar un nuevo reclamo o queja conforme a la Ley N° 29571 (INDECOPI).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:150',
            'document_type' => 'required|string|in:DNI,CE,PASAPORTE,RUC',
            'document_number' => 'required|string|max:20',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:100',
            'address' => 'nullable|string|max:255',
            'contracted_type' => 'required|string|in:producto,servicio',
            'amount' => 'nullable|numeric|min:0',
            'claim_type' => 'required|string|in:reclamo,queja',
            'detail' => 'required|string|max:2000'
        ]);

        $claimNumber = 'REC-' . date('Y') . '-' . str_pad(Claim::count() + 1, 4, '0', STR_PAD_LEFT);

        $claim = Claim::create(array_merge($validated, [
            'claim_number' => $claimNumber,
            'status' => 'pendiente'
        ]));

        return response()->json([
            'success' => true,
            'claim_number' => $claim->claim_number,
            'message' => 'Su reclamo ha sido registrado conforme a ley. Recibirá respuesta en un plazo no mayor a 15 días hábiles.'
        ], 201);
    }
}
