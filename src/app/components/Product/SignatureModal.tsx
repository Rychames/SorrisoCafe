// src/app/components/Product/SignatureModal.tsx
"use client";
import { useRef, useEffect } from "react";
import ReactSignatureCanvas from "react-signature-canvas";

interface SignatureModalProps {
  onSave: (signature: string) => void;
  onClose: () => void;
}

export default function SignatureModal({ onSave, onClose }: SignatureModalProps) {
  const sigCanvas = useRef<ReactSignatureCanvas>(null);

  useEffect(() => {
    // Configurar a cor da caneta após o componente ser montado
    if (sigCanvas.current) {
      sigCanvas.current.getCanvas().getContext("2d")!.strokeStyle = "black"; // Define a cor da caneta
    }
  }, []);

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  const saveSignature = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const dataURL = sigCanvas.current.toDataURL();
      onSave(dataURL);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Assinatura</h2>
        <ReactSignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            width: 400,
            height: 200,
            className: "border border-gray-300 rounded",
          }}
        />
        <div className="mt-4 flex gap-4">
          <button
            onClick={clearSignature}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Limpar
          </button>
          <button
            onClick={saveSignature}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Salvar
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}