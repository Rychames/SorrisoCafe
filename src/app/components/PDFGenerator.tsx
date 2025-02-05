"use client";
import React, { useRef, useState } from "react";
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
    textAlign: "justify",
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
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  contentText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "justify",
    lineHeight: 1.5,
  },
  signatureBox: {
    marginTop: 30,
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
  },
  signatureImage: {
    width: 300,
    height: 100,
  },
  signatureLine: {
    borderBottomWidth: 1,
    width: "80%",
    marginTop: 10,
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 12,
    marginTop: 5,
  },
});

const PDFDocument = ({
  product,
  signature,
  company,
}: {
  product: Product;
  signature: string;
  company: Company;
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        {company?.logo && <Image src={company.logo} style={styles.logo} />}
        <Text style={styles.companyName}>{company?.name}</Text>
      </View>
      <Text style={styles.title}>Comprovante de Entrega</Text>
      <Text style={styles.contentText}>
        O produto "{product.name}" (Modelo: {product.model}, Categoria: {product.category}, Tamanho: {product.size})
        da empresa {product.company_brand} foi entregue pelo funcionário {product.delivered_by} da empresa {product.current_company?.name}
        para {product.received_by.first_name} {product.received_by.last_name} da empresa {product.received_company?.name}
        no dia {new Date(product.date_receipt).toLocaleDateString()} às {new Date(product.date_receipt).toLocaleTimeString()}.
      </Text>
      <View style={styles.signatureBox}>
        <Image src={signature} style={styles.signatureImage} />
        <View style={styles.signatureLine} />
        <Text style={styles.signatureText}>Assinatura do Entregador</Text>
      </View>
    </Page>
  </Document>
);

const PDFGenerator = ({
  product,
  company,
}: {
  product: Product;
  company: Company;
}) => {
  const signatureRef = useRef<SignatureCanvas>(null);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string>("");
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  const handleSaveSignature = () => {
    if (signatureRef.current) {
      setSignatureDataUrl(signatureRef.current.toDataURL());
      setModalIsOpen(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center">
      {/* Botões de ação em linha (não serão impressos) */}
      <div className="no-print flex flex-row items-center justify-center gap-4 mt-4">
        <button
          onClick={() => setModalIsOpen(true)}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Assinar
        </button>
        {signatureDataUrl ? (
          <PDFDownloadLink
            document={
              <PDFDocument
                product={product}
                signature={signatureDataUrl}
                company={company}
              />
            }
            fileName={`comprovante_${product.name}.pdf`}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition"
          >
            Salvar PDF
          </PDFDownloadLink>
        ) : (
          <button
            disabled
            className="bg-gray-300 text-white font-semibold py-2 px-4 rounded-md shadow-md transition cursor-not-allowed"
          >
            Salvar PDF
          </button>
        )}
        <button
          onClick={handlePrint}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition"
        >
          Imprimir
        </button>
      </div>

      {/* Modal para assinatura (não será impresso) */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Assinar"
        ariaHideApp={false}
        className="no-print flex flex-col items-center bg-white p-6 rounded-md shadow-lg w-11/12 max-w-lg"
        overlayClassName="no-print fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-lg font-semibold mb-4">Assine abaixo</h2>
        <SignatureCanvas
          ref={signatureRef}
          penColor="black"
          canvasProps={{
            width: 500,
            height: 200,
            className: "border border-gray-500 rounded-md",
          }}
        />
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleSaveSignature}
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
          >
            Salvar
          </button>
          <button
            onClick={() => signatureRef.current?.clear()}
            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
          >
            Limpar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PDFGenerator;
