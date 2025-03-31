"use client";
import Swal from "sweetalert2";
import type { SweetAlertOptions } from "sweetalert2";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { PDFDocument } from "@/app/components/PDFGenerator"; // Importar o PDFDocument corrigido
import { Product, Company } from "@/app/models";

const SWAL_STYLES = {
  popup: "rounded-xl font-sans max-w-md",
  title: "text-xl font-semibold mb-4",
  input: "mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
  select: "mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
  textarea: "mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none",
  validationMessage: "mt-2 text-sm text-red-600",
  confirmButton: "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium px-4 py-2 rounded-lg",
  cancelButton: "bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium px-4 py-2 rounded-lg ml-2",
  denyButton: "bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg ml-2",
};

const createSwalOptions = (customOptions: SweetAlertOptions): SweetAlertOptions => ({
  customClass: {
    popup: SWAL_STYLES.popup,
    title: SWAL_STYLES.title,
    input: SWAL_STYLES.input,
    htmlContainer: "text-left",
    validationMessage: SWAL_STYLES.validationMessage,
    confirmButton: SWAL_STYLES.confirmButton,
    cancelButton: SWAL_STYLES.cancelButton,
    denyButton: SWAL_STYLES.denyButton,
  },
  ...customOptions,
});

export const showSuccessAlert = (title: string, text: string) => {
  Swal.fire({
    ...createSwalOptions({}),
    icon: "success",
    title,
    text,
  });
};

export const showErrorAlert = (title: string, text: string) => {
  Swal.fire({
    ...createSwalOptions({}),
    icon: "error",
    title,
    text,
  });
};

export const ProductAlerts = {
    withdraw: async (
        maxQuantity: number,
        product: Product,
        company: Company
      ) => {
        const basicData = await Swal.fire(
          createSwalOptions({
            title: "Registro de Retirada",
            html: `
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Autorização</label>
                  <select id="authorized" class="${SWAL_STYLES.select}">
                    <option value="Cindy">Cindy</option>
                    <option value="Dib">Dib</option>
                    <option value="Mariane">Mariane</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                  <select id="withdrawnBy" class="${SWAL_STYLES.select}">
                    <option value="Brasil">Brasil</option>
                    <option value="Bolsonaro">Bolsonaro</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                  <input 
                    type="number" 
                    id="quantity" 
                    class="${SWAL_STYLES.input}"
                    min="1" 
                    max="${maxQuantity}"
                    placeholder="Ex: 5"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                  <textarea 
                    id="description" 
                    rows="3" 
                    class="${SWAL_STYLES.textarea}"
                    placeholder="Detalhes adicionais..."
                  ></textarea>
                </div>
              </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Próximo",
            cancelButtonText: "Cancelar",
            preConfirm: () => {
              const authorized = (document.getElementById("authorized") as HTMLSelectElement)?.value;
              const withdrawnBy = (document.getElementById("withdrawnBy") as HTMLSelectElement)?.value;
              const quantity = Number(
                (document.getElementById("quantity") as HTMLInputElement)?.value
              );
              const description = (document.getElementById("description") as HTMLTextAreaElement)?.value;
    
              if (!quantity || quantity <= 0 || quantity > maxQuantity) {
                Swal.showValidationMessage(
                  "Quantidade inválida ou excede o estoque disponível"
                );
                return undefined;
              }
    
              return { authorized, withdrawnBy, quantity, description };
            },
          })
        );
    
        if (!basicData.isConfirmed) {
          return basicData;
        }
    
        const signatures = await collectSignatures();
        if (!signatures) {
          return { isConfirmed: false };
        }
    
        // Gerar o PDF com quantidade retirada e descrição
        const pdfDoc = (
          <PDFDocument
            product={product}
            company={company}
            signatures={signatures}
            withdrawnQuantity={basicData.value.quantity}
            description={basicData.value.description}
          />
        );
        const pdfBlob = await pdf(pdfDoc).toBlob();
        saveAs(pdfBlob, `comprovante_${product.name}.pdf`);
    
        return {
          isConfirmed: true,
          value: {
            ...basicData.value,
            signatures,
          },
        };
      },

  shipping: async () => {
    const result = await Swal.fire(
      createSwalOptions({
        title: "Registro de Envio",
        html: `
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Autorização</label>
              <select id="authorized" class="${SWAL_STYLES.select}">
                <option value="Cindy">Cindy</option>
                <option value="Dib">Dib</option>
                <option value="Mariane">Mariane</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
              <select id="withdrawnBy" class="${SWAL_STYLES.select}">
                <option value="Brasil">Brasil</option>
                <option value="Bolsonaro">Bolsonaro</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Destino</label>
              <select id="destination" class="${SWAL_STYLES.select}">
                <option value="Kadosh">Kadosh</option>
                <option value="Escritorio PP">Escritorio PP</option>
              </select>
            </div>
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        preConfirm: () => {
          const authorized = (document.getElementById("authorized") as HTMLSelectElement)?.value;
          const withdrawnBy = (document.getElementById("withdrawnBy") as HTMLSelectElement)?.value;
          const destination = (document.getElementById("destination") as HTMLSelectElement)?.value;
          return { authorized, withdrawnBy, destination };
        },
      })
    );

    return result;
  },

  addStock: async () => {
    const result = await Swal.fire(
      createSwalOptions({
        title: "Adicionar Estoque",
        html: `
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
              <input 
                type="number" 
                id="quantity" 
                class="${SWAL_STYLES.input}"
                min="1" 
                placeholder="Ex: 5"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Observações</label>
              <textarea 
                id="description" 
                rows="3" 
                class="${SWAL_STYLES.textarea}"
                placeholder="Detalhes adicionais..."
              ></textarea>
            </div>
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Adicionar",
        cancelButtonText: "Cancelar",
        preConfirm: () => {
          const quantity = Number(
            (document.getElementById("quantity") as HTMLInputElement)?.value
          );
          const description = (document.getElementById("description") as HTMLTextAreaElement)?.value;

          if (!quantity || quantity <= 0) {
            Swal.showValidationMessage("Quantidade inválida");
            return undefined;
          }

          return { quantity, description };
        },
      })
    );

    return result;
  },

  delete: async (productName: string) => {
    const result = await Swal.fire(
      createSwalOptions({
        title: "Excluir Produto",
        html: `Tem certeza que deseja excluir o produto <strong>${productName}</strong>? Esta ação é irreversível.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar",
      })
    );

    return result;
  },
};

async function collectSignatures(): Promise<{
  stockManager: string;
  receiver: string;
} | null> {
  const { default: SignaturePad } = await import("signature_pad");

  let stockManagerSignature = "";
  let receiverSignature = "";

  let stockManagerPad: any;
  const stockManagerResult = await Swal.fire({
    title: "Assinatura do Responsável pelo Estoque",
    html: '<div id="stock-manager-signature" style="height: 200px; width: 600px;"></div>',
    showConfirmButton: true,
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Confirmar Assinatura",
    denyButtonText: "Limpar",
    cancelButtonText: "Cancelar",
    didOpen: () => {
      const container = document.getElementById("stock-manager-signature");
      if (container) {
        container.innerHTML = "";
        const canvas = document.createElement("canvas");
        canvas.width = 600;
        canvas.height = 200;
        canvas.style.border = "1px solid #000";
        container.appendChild(canvas);

        stockManagerPad = new SignaturePad(canvas);
        stockManagerPad.penColor = "black";
      }
    },
    preConfirm: () => {
      if (stockManagerPad && stockManagerPad.isEmpty()) {
        Swal.showValidationMessage("Por favor, forneça uma assinatura");
        return undefined;
      }
      return stockManagerPad ? stockManagerPad.toDataURL() : undefined;
    },
    didRender: () => {
      const denyButton = document.querySelector(".swal2-deny") as HTMLButtonElement;
      if (denyButton && stockManagerPad) {
        denyButton.onclick = () => {
          stockManagerPad.clear();
        };
      }
    },
  });

  if (!stockManagerResult.isConfirmed || !stockManagerResult.value) {
    return null;
  }
  stockManagerSignature = stockManagerResult.value;

  let receiverPad: any;
  const receiverResult = await Swal.fire({
    title: "Assinatura do Recebedor",
    html: '<div id="receiver-signature" style="height: 200px; width: 600px;"></div>',
    showConfirmButton: true,
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Confirmar Assinatura",
    denyButtonText: "Limpar",
    cancelButtonText: "Cancelar",
    didOpen: () => {
      const container = document.getElementById("receiver-signature");
      if (container) {
        container.innerHTML = "";
        const canvas = document.createElement("canvas");
        canvas.width = 600;
        canvas.height = 200;
        canvas.style.border = "1px solid #000";
        container.appendChild(canvas);

        receiverPad = new SignaturePad(canvas);
        receiverPad.penColor = "black";
      }
    },
    preConfirm: () => {
      if (receiverPad && receiverPad.isEmpty()) {
        Swal.showValidationMessage("Por favor, forneça uma assinatura");
        return undefined;
      }
      return receiverPad ? receiverPad.toDataURL() : undefined;
    },
    didRender: () => {
      const denyButton = document.querySelector(".swal2-deny") as HTMLButtonElement;
      if (denyButton && receiverPad) {
        denyButton.onclick = () => {
          receiverPad.clear();
        };
      }
    },
  });

  if (!receiverResult.isConfirmed || !receiverResult.value) {
    return null;
  }
  receiverSignature = receiverResult.value;

  return {
    stockManager: stockManagerSignature,
    receiver: receiverSignature,
  };
};