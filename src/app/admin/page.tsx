'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserModel } from '@/app/models/user.model'; // ajuste o caminho conforme sua estrutura
import { BASE_URL } from '@/app/utils/constants'; // ajuste o caminho conforme sua estrutura

// Definindo os tipos de role utilizados no frontend
export type UserRole = 'admin' | 'moderador' | 'comum';

// Interface extendida para incluir a role
export interface ExtendedUserModel extends UserModel {
  role: UserRole;
}

// Função para mapear os dados vindos do backend para o modelo do frontend
const mapBackendUserToFrontend = (backendUser: any): ExtendedUserModel => {
  // Mapeamento dos valores de role do backend para os valores do frontend
  const roleMap: Record<string, UserRole> = {
    ADMIN: 'admin',
    MODERATOR: 'moderador',
    COMMON: 'comum',
  };

  return {
    id: backendUser.id,
    email: backendUser.email,
    first_name: backendUser.first_name,
    last_name: backendUser.last_name,
    // Converte o boolean para string ('true' ou 'false')
    is_active: backendUser.is_active ? 'true' : 'false',
    role: roleMap[backendUser.role] || 'comum',
  };
};

export default function AdminPage() {
  const [users, setUsers] = useState<ExtendedUserModel[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscando os usuários do backend ao montar o componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // A URL completa utiliza a BASE_URL definida nos seus constants.
        // Supondo que o endpoint seja: BASE_URL + 'user/manager/'
        const response = await axios.get(`${BASE_URL}user/manager/`);
        // Supondo que o backend retorne um array de usuários
        const backendUsers = response.data;
        const mappedUsers = backendUsers.map(mapBackendUserToFrontend);
        setUsers(mappedUsers);
      } catch (error) {
        console.error('Erro ao buscar os usuários:', error);
        alert('Ocorreu um erro ao buscar os usuários.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Função para alternar o status do usuário (ativar/desativar)
  const toggleUserActivation = async (id: number) => {
    // Encontra o usuário pelo id
    const user = users.find((user) => user.id === id);
    if (!user) return;

    // Calcula o novo status: converte 'true' para false e vice-versa
    const newStatusBoolean = user.is_active !== 'true';
    const newStatusString = newStatusBoolean ? 'true' : 'false';

    try {
      // O backend espera o campo is_active como boolean
      await axios.patch(`${BASE_URL}user/manager/${id}`, {
        is_active: newStatusBoolean,
      });

      // Atualiza o estado local para refletir a alteração
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === id ? { ...u, is_active: newStatusString } : u))
      );

      alert(`Usuário ${id} ${newStatusBoolean ? 'ativado' : 'desativado'} com sucesso!`);
    } catch (error) {
      console.error('Erro ao atualizar o usuário:', error);
      alert('Ocorreu um erro ao atualizar o usuário.');
    }
  };

  // Função para deletar um usuário
  const deleteUser = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}user/manager/${id}`);

      // Atualiza o estado removendo o usuário deletado
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      alert(`Usuário ${id} deletado com sucesso!`);
    } catch (error) {
      console.error('Erro ao deletar o usuário:', error);
      alert('Ocorreu um erro ao deletar o usuário.');
    }
  };

  // Função auxiliar para renderizar uma tabela de usuários filtrando por role
  const renderTable = (title: string, filterRole: UserRole) => {
    const filteredUsers = users.filter((user) => user.role === filterRole);
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        {filteredUsers.length === 0 ? (
          <p>Nenhum usuário encontrado.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ativo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.is_active === 'true' ? 'Sim' : 'Não'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleUserActivation(user.id!)}
                      className={`px-3 py-1 mr-2 rounded ${user.is_active === 'true'
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-green-500 hover:bg-green-600'
                        } text-white`}
                    >
                      {user.is_active === 'true' ? 'Desativar Acesso' : 'Ativar Acesso'}
                    </button>
                    <button
                      onClick={() => deleteUser(user.id!)}
                      className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800"
                    >
                      Deletar Conta
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  if (loading) {
    return <p>Carregando usuários...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Administração de Usuários</h1>
      {renderTable('Administradores', 'admin')}
      {renderTable('Moderadores', 'moderador')}
      {renderTable('Contas Comuns', 'comum')}
    </div>
  );
}
