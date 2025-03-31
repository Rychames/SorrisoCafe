"use client";
import Swal from "sweetalert2";
import type { SweetAlertOptions } from "sweetalert2";

const SWAL_STYLES = {
  popup: 'rounded-xl font-sans max-w-md',
  title: 'text-xl font-semibold mb-4',
  input: 'mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  select: 'mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  textarea: 'mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none',
  validationMessage: 'mt-2 text-sm text-red-600',
  confirmButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium px-4 py-2 rounded-lg',
  cancelButton: 'bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium px-4 py-2 rounded-lg ml-2'
};

const createSwalOptions = (customOptions: SweetAlertOptions): SweetAlertOptions => ({
  customClass: {
    popup: SWAL_STYLES.popup,
    title: SWAL_STYLES.title,
    input: SWAL_STYLES.input,
    htmlContainer: 'text-left',
    validationMessage: SWAL_STYLES.validationMessage,
    confirmButton: SWAL_STYLES.confirmButton,
    cancelButton: SWAL_STYLES.cancelButton
  },
  ...customOptions
});

export const showSuccessAlert = (title: string, text: string) => {
  Swal.fire({
    ...createSwalOptions({}),
    icon: 'success',
    title,
    text
  });
};

export const showErrorAlert = (title: string, text: string) => {
  Swal.fire({
    ...createSwalOptions({}),
    icon: 'error',
    title,
    text
  });
};

export const ProductAlerts = {
    withdraw: (maxQuantity: number) => Swal.fire(createSwalOptions({
        title: 'Registro de Retirada',
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
        confirmButtonText: 'Confirmar Retirada',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const authorized = (document.getElementById('authorized') as HTMLSelectElement)?.value;
            const withdrawnBy = (document.getElementById('withdrawnBy') as HTMLSelectElement)?.value;
            const quantity = Number((document.getElementById('quantity') as HTMLInputElement)?.value);
            const description = (document.getElementById('description') as HTMLTextAreaElement)?.value;

            if (!quantity || quantity <= 0 || quantity > maxQuantity) {
                Swal.showValidationMessage('Quantidade inválida ou excede o estoque disponível');
                return undefined;
            }

            return { authorized, withdrawnBy, quantity, description };
        }
    })),


    shipping: () => {
        const options: SweetAlertOptions = createSwalOptions({
            title: 'Registro de Envio',
            width: '600px',
            html: `
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Destino</label>
            <select id="destination" class="${SWAL_STYLES.select}">
              <option value="Kadosh">Kadosh</option>
              <option value="Escritorio PP">Escritório PP</option>
            </select>
          </div>

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

          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea 
              id="notes" 
              rows="2" 
              class="${SWAL_STYLES.textarea}"
              placeholder="Informações adicionais do envio..."
            ></textarea>
          </div>
        </div>
      `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Registrar Envio',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                return {
                    destination: (document.getElementById('destination') as HTMLSelectElement)?.value,
                    authorized: (document.getElementById('authorized') as HTMLSelectElement)?.value,
                    withdrawnBy: (document.getElementById('withdrawnBy') as HTMLSelectElement)?.value,
                    notes: (document.getElementById('notes') as HTMLTextAreaElement)?.value
                };
            }
        });

        return Swal.fire(options);
    },

    delete: (productName: string) => {
        const options: SweetAlertOptions = createSwalOptions({
            title: 'Confirmação de Exclusão',
            html: `
        <div class="text-center py-4">
          <div class="mx-auto mb-4 text-red-500">
            <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <p class="text-gray-600 mb-2">Você está prestes a excluir permanentemente:</p>
          <p class="font-semibold text-lg text-gray-900">${productName}</p>
          <p class="text-red-600 mt-4">Esta ação não pode ser desfeita!</p>
        </div>
      `,
            showCancelButton: true,
            confirmButtonText: 'Confirmar Exclusão',
            cancelButtonText: 'Manter Produto',
            confirmButtonColor: '#dc2626',
            reverseButtons: true
        });

        return Swal.fire(options);
    },

    addStock: () => {
        const options: SweetAlertOptions = createSwalOptions({
            title: 'Adicionar Estoque',
            html: `
        <div class="text-left">
          <label class="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
          <input 
            type="number" 
            id="swal-input1" 
            class="${SWAL_STYLES.input}"
            placeholder="Número de unidades a adicionar"
            min="1"
          >
        </div>
      `,
            inputValidator: (value) => {
                if (!value || Number(value) <= 0) return 'Insira uma quantidade válida!';
                return null;
            },
            confirmButtonText: 'Adicionar ao Estoque',
            showCancelButton: true,
            cancelButtonText: 'Cancelar'
        });

        return Swal.fire(options);
    }
};