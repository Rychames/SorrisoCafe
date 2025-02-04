"use client";

import React from "react";
import { FaFileExcel } from "react-icons/fa";

interface ExportButtonProps {
    exportData: any[]; // Os dados que serão exportados; idealmente, tipados conforme sua estrutura
}

const ExportButton: React.FC<ExportButtonProps> = ({ exportData }) => {
    const handleExport = async () => {
        // Importa dinamicamente as bibliotecas para evitar problemas de build no Next.js
        const XLSX = await import("xlsx");
        const fileSaverModule = await import("file-saver");
        // Alguns módulos exportam a função saveAs na propriedade default ou diretamente
        const saveAs =
            fileSaverModule.saveAs || fileSaverModule.default || fileSaverModule;

        // Cria uma nova estrutura de dados, gerando um ID sequencial para cada produto
        const formattedData = exportData.map((item: any, index: number) => {
            // Supondo que item contenha os demais campos (exceto o ID original)
            return {
                ID: index + 1, // ID sequencial na planilha
                Nome: item.Nome,
                Categoria: item.Categoria,
                Modelo: item.Modelo,
                Marca: item.Marca,
                Descrição: item.Descrição,
                Quantidade: item.Quantidade,
                Setor: item.Setor,
                "Empresa Atual": item["Empresa Atual"],
                "Data de Cadastro": item["Data de Cadastro"],
            };
        });

        // Cria a worksheet a partir dos dados formatados
        const worksheet = XLSX.utils.json_to_sheet(formattedData);

        // Recupera as chaves do cabeçalho (que estão na primeira linha)
        const headerKeys = Object.keys(formattedData[0]);
        // Define o estilo para cada célula do cabeçalho (linha 1)
        for (let col = 0; col < headerKeys.length; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
            if (worksheet[cellAddress]) {
                worksheet[cellAddress].s = {
                    fill: { patternType: "solid", fgColor: { rgb: "92D050" } },
                    font: { color: { rgb: "FFFFFF" }, bold: true, name: "Arial", sz: 12 },
                    alignment: { horizontal: "center", vertical: "center" },
                };
            }
        }

        // Cria um novo workbook e adiciona a worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inventário");

        // Gera o arquivo binário com a opção cellStyles ativada
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
            cellStyles: true, // Habilita os estilos de célula
        });
        const data = new Blob([excelBuffer], {
            type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        // Dispara o download do arquivo com o nome "inventario.xlsx"
        saveAs(data, "inventario.xlsx");
    };

    return (
        <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all"
        >
            <FaFileExcel />
            Gerar Planilha
        </button>
    );
};

export default ExportButton;
