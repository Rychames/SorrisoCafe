import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { PDFDownloadLink, Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import Modal from 'react-modal';  // Usando react-modal para o modal
import { Product } from '@/app/models';

// Estilos para o PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 40,
    },
    signatureBox: {
        marginTop: 30,
        borderTopWidth: 1,
        paddingTop: 15,
        width: '60%',
    },
    signatureText: {
        fontSize: 12,
        marginBottom: 5,
    },
    signatureLine: {
        borderBottomWidth: 1,
        width: '100%',
        marginTop: 25,
    },
    qrcode: {
        width: 100,
        height: 100,
        marginTop: 20,
    },
});

// Componente de documento PDF com assinatura
const PDFDocument = ({ product, signature }: { product: Product; signature: string }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.signatureText}>Comprovante de Recebimento</Text>
            {/* Assinatura no PDF */}
            <View style={styles.signatureBox}>
                <Text style={styles.signatureText}>Assinatura do Recebedor:</Text>
                <Image src={signature} style={styles.signatureLine} />
                <Text style={{ ...styles.signatureText, marginTop: 5, fontSize: 10 }}>
                    (Assinatura digital)
                </Text>
            </View>
        </Page>
    </Document>
);

const PDFGenerator = ({ product }: { product: Product }) => {
    const signatureRef = useRef<SignatureCanvas>(null);
    const [signatureDataUrl, setSignatureDataUrl] = useState<string>('');
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    // Função para capturar a assinatura
    const handleSaveSignature = () => {
        if (signatureRef.current) {
            const signature = signatureRef.current.toDataURL();
            setSignatureDataUrl(signature);
            setModalIsOpen(false); // Fecha o modal após salvar a assinatura
        }
    };

    return (
        <div>
            {/* Botão para abrir o modal */}
            <button
                onClick={() => setModalIsOpen(true)}
                style={{
                    marginBottom: '20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Assinar
            </button>

            {/* Modal de assinatura */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Assinar"
                ariaHideApp={false}
                style={{
                    content: {
                        padding: '20px',
                        maxWidth: '80%',
                        margin: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    },
                }}
            >
                <h2>Assine abaixo</h2>
                {/* Canvas responsivo */}
                <SignatureCanvas
                    ref={signatureRef}
                    penColor="black"
                    canvasProps={{
                        width: '100%',
                        height: 150,
                        className: 'signature-canvas',
                        style: { border: '1px solid #000' },
                    }}
                />
                <div>
                    <button
                        onClick={handleSaveSignature}
                        style={{
                            marginTop: '10px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Salvar Assinatura
                    </button>
                </div>
            </Modal>

            {/* Se a assinatura foi capturada, mostrar o botão para download do PDF */}
            {signatureDataUrl && (
                <PDFDownloadLink
                    document={<PDFDocument product={product} signature={signatureDataUrl} />}
                    fileName={`comprovante_${product.name}.pdf`}
                >
                    <button
                        style={{
                            marginTop: '20px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Baixar Comprovante com Assinatura
                    </button>
                </PDFDownloadLink>
            )}
        </div>
    );
};

export default PDFGenerator;
