import { QRCodeSVG } from "qrcode.react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

interface ProductQRCardProps {
  companyId: string;
  productId: string;
  productName: string;
}

export const ProductQRCard = ({ companyId, productId, productName }: ProductQRCardProps) => (
  <div className="bg-white rounded-xl shadow-sm p-6 text-center">
    <div className="bg-gray-50 p-4 rounded-lg">
      <QRCodeSVG
        value={`https://ppscanner.vercel.app/companies/${companyId}/product/${productId}`}
        size={160}
        className="mx-auto"
      />
    </div>
    <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
      <ArrowDownTrayIcon className="w-5 h-5" />
      Baixar QR Code
    </button>
  </div>
);