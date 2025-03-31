"use client";
import React, { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import Modal from "react-modal";
import { Product, Company } from "@/app/models";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  content: {
    fontSize: 12,
    marginBottom: 20,
    lineHeight: 1.5,
  },
  signaturesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  signatureBox: {
    width: "45%",
    alignItems: "center",
  },
  signatureImage: {
    width: 250,
    height: 100,
    marginBottom: 10,
  },
  signatureLine: {
    borderBottomWidth: 1,
    width: "100%",
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 10,
  },
});

interface PDFDocumentProps {
  product: Product;
  company: Company;
  signatures: {
    stockManager: string;
    receiver: string;
  };
}

export const PDFDocument = ({ product, company, signatures }: PDFDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        {company?.logo && <Image src={company.logo} style={styles.logo} />}
        <Text>{company?.name}</Text>
      </View>
      
      <Text style={styles.title}>Comprovante de Movimentação</Text>
      
      <Text style={styles.content}>
        Produto: {product.name}
        {"\n"}Modelo: {product.model}
        {"\n"}Quantidade: {product.quantity}
        {"\n"}Data: {new Date().toLocaleDateString()}
      </Text>

      <View style={styles.signaturesContainer}>
        <View style={styles.signatureBox}>
          <Image src={signatures.stockManager} style={styles.signatureImage} />
          <View style={styles.signatureLine} />
          <Text style={styles.signatureText}>Responsável pelo Estoque</Text>
        </View>

        <View style={styles.signatureBox}>
          <Image src={signatures.receiver} style={styles.signatureImage} />
          <View style={styles.signatureLine} />
          <Text style={styles.signatureText}>Recebedor</Text>
        </View>
      </View>
    </Page>
  </Document>
);

interface PDFGeneratorProps {
  product: Product;
  company: Company;
  onSignaturesComplete: (signatures: {
    stockManager: string;
    receiver: string;
  }) => void;
}

const PDFGenerator = ({ product, company, onSignaturesComplete }: PDFGeneratorProps) => {
  const stockSignatureRef = useRef<SignatureCanvas>(null);
  const receiverSignatureRef = useRef<SignatureCanvas>(null);
  const [modalType, setModalType] = useState<"stockManager" | "receiver" | null>(null);
  const [signatures, setSignatures] = useState<{
    stockManager?: string;
    receiver?: string;
  }>({});

  // Configurar o appElement do react-modal apenas no lado do cliente
  useEffect(() => {
    if (typeof window !== "undefined") {
      const appElement = document.getElementById("__next");
      if (appElement) {
        Modal.setAppElement(appElement);
      }
    }
  }, []);

  useEffect(() => {
    if (stockSignatureRef.current) {
      stockSignatureRef.current.getCanvas().getContext("2d")!.strokeStyle = "black";
    }
    if (receiverSignatureRef.current) {
      receiverSignatureRef.current.getCanvas().getContext("2d")!.strokeStyle = "black";
    }
  }, [modalType]);

  const handleOpenModal = (type: "stockManager" | "receiver") => {
    setModalType(type);
  };

  const handleSaveSignature = () => {
    if (!modalType) return;

    const signatureRef = modalType === "stockManager" ? stockSignatureRef : receiverSignatureRef;
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      const signature = signatureRef.current.toDataURL();
      setSignatures(prev => ({
        ...prev,
        [modalType]: signature,
      }));
      setModalType(null);

      const updatedSignatures = {
        ...signatures,
        [modalType]: signature,
      };

      if (updatedSignatures.stockManager && updatedSignatures.receiver) {
        onSignaturesComplete({
          stockManager: updatedSignatures.stockManager,
          receiver: updatedSignatures.receiver,
        });
      }
    }
  };

  const handleClearSignature = () => {
    const signatureRef = modalType === "stockManager" ? stockSignatureRef : receiverSignatureRef;
    signatureRef.current?.clear();
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <div className="flex justify-between mb-4">
        <button
          onClick={() => handleOpenModal("stockManager")}
          className={`px-4 py-2 rounded-md ${
            signatures.stockManager
              ? "bg-green-500 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {signatures.stockManager ? "Assinatura 1 ✔" : "Assinar Responsável"}
        </button>
        
        <button
          onClick={() => handleOpenModal("receiver")}
          className={`px-4 py-2 rounded-md ${
            signatures.receiver
              ? "bg-green-500 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {signatures.receiver ? "Assinatura 2 ✔" : "Assinar Recebedor"}
        </button>
      </div>

      {signatures.stockManager && signatures.receiver && (
        <PDFDownloadLink
          document={
            <PDFDocument
              product={product}
              company={company}
              signatures={{
                stockManager: signatures.stockManager,
                receiver: signatures.receiver,
              }}
            />
          }
          fileName={`comprovante_${product.name}.pdf`}
          className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-md transition"
        >
          Baixar Comprovante PDF
        </PDFDownloadLink>
      )}

      <Modal
        isOpen={!!modalType}
        onRequestClose={() => setModalType(null)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "90%",
            width: "500px",
            padding: "20px",
            borderRadius: "8px",
          },
        }}
      >
        <h2 className="text-xl font-semibold mb-4">
          {modalType === "stockManager"
            ? "Assinatura do Responsável pelo Estoque"
            : "Assinatura do Recebedor"}
        </h2>
        
        <SignatureCanvas
          ref={modalType === "stockManager" ? stockSignatureRef : receiverSignatureRef}
          canvasProps={{
            width: 450,
            height: 200,
            className: "border border-gray-300 rounded-md w-full",
          }}
        />
        
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleClearSignature}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Limpar
          </button>
          <button
            onClick={handleSaveSignature}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PDFGenerator;