import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
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
    borderBottomColor: "#000",
    paddingBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableHeader: {
    width: "30%",
    backgroundColor: "#E4E4E4",
    padding: 8,
    fontSize: 10,
    fontWeight: "bold",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  tableCell: {
    width: "70%",
    padding: 8,
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  description: {
    fontSize: 12,
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#F9F9F9",
  },
  authorizationText: {
    fontSize: 12,
    marginBottom: 20,
    lineHeight: 1.5,
  },
  signatureContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 20,
  },
  signatureBox: {
    width: "45%",
    alignItems: "center",
  },
  signatureImage: {
    width: 200,
    height: 80,
    marginBottom: 8,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    width: "100%",
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 10,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 10,
    borderTopWidth: 1,
    borderTopColor: "#000",
    paddingTop: 5,
  },
});

interface PDFDocumentProps {
  product: Product;
  company: Company;
  signatures: {
    stockManager: string;
    receiver: string;
  };
  withdrawnQuantity: number;
  description: string;
}

export const PDFDocument = ({
  product,
  company,
  signatures,
  withdrawnQuantity,
  description,
}: PDFDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        {company?.logo && <Image src={company.logo} style={styles.logo} />} {/* Logo da empresa cadastrada */}
        <Text style={styles.companyName}>{company?.name}</Text>
      </View>

      <Text style={styles.title}>Comprovante de Movimentação de Produto</Text>

      {/* Tabela com todas as informações do produto */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Nome</Text>
          <Text style={styles.tableCell}>{product.name || "N/A"}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Modelo</Text>
          <Text style={styles.tableCell}>{product.model || "N/A"}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Categoria</Text>
          <Text style={styles.tableCell}>{product.category || "N/A"}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Marca</Text>
          <Text style={styles.tableCell}>{product.company_brand || "N/A"}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Setor</Text>
          <Text style={styles.tableCell}>{product.sector || "N/A"}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Tamanho</Text>
          <Text style={styles.tableCell}>{product.size || "N/A"}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Preço</Text>
          <Text style={styles.tableCell}>{product.price ? `R$ ${product.price.toFixed(2)}` : "N/A"}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Quantidade Total</Text>
          <Text style={styles.tableCell}>{product.quantity || "0"}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Quantidade Retirada</Text>
          <Text style={styles.tableCell}>{withdrawnQuantity || "0"}</Text>
        </View>
      </View>

      {/* Descrição digitada pelo usuário */}
      <Text style={styles.description}>
        Descrição: {description || "Nenhuma descrição fornecida."}
      </Text>

      {/* Texto de Autorização */}
      <Text style={styles.authorizationText}>
        Declaro para os devidos fins que o produto {product.name} foi retirado na data de {new Date().toLocaleDateString()} na quantidade de {withdrawnQuantity} unidade(s) pelo(a) {product.delivered_by || "N/A"}. O produto foi recebido por {product.received_by?.first_name || "N/A"} da empresa {product.received_company?.name || "N/A"}.
      </Text>

      {/* Assinaturas */}
      <View style={styles.signatureContainer}>
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

      {/* Rodapé */}
      <View style={styles.footer} fixed>
        <Text>{company?.name} - CNPJ: {company?.cnpj || "N/A"}</Text>
      </View>
    </Page>
  </Document>
);