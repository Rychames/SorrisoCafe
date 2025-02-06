'use client';

import { useState } from 'react';
import axios from 'axios';

export interface UserModel {
  id?: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: string; // 'true' ou 'false'
}

export type UserRole = 'admin' | 'moderador' | 'comum';

export interface ExtendedUserModel extends UserModel {
  role: UserRole;
}

export default function AdminPage() {
  // Simulação com 3 usuários
  const [users, setUsers] = useState<ExtendedUserModel[]>([
    {
      id: 1,
      email: 'admin@example.com',
      first_name: 'Admin',
      last_name: 'User',
      is_active: 'true',
      role: 'admin',
    },
    {
      id: 2,
      email: 'moderador@example.com',
      first_name: 'Mod',
      last_name: 'User',
      is_active: 'false',
      role: 'moderador',
    },
    {
      id: 3,
      email: 'comum@example.com',
      first_name: 'Common',
      last_name: 'User',
      is_active: 'true',
      role: 'comum',
    },
  ]);

  // Função para alternar o status do usuário (ativar/desativar)
  const toggleUserActivation = async (id: number) => {
    // Encontra o usuário pelo id
    const user = users.find((user) => user.id === id);
    if (!user) return;

    // Define o novo status (inverte o valor atual)
    const newStatus = user.is_active === 'true' ? 'false' : 'true';

    try {
      // Simula uma chamada à API utilizando uma URL fake
      // Substitua a URL abaixo pelo endpoint real quando estiver disponível
      await axios.patch(`https://fakeapi.com/users/${id}`, {
        is_active: newStatus,
      });

      // Atualiza o estado local para refletir a alteração
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === id ? { ...u, is_active: newStatus } : u
        )
      );

      alert(`Usuário ${id} ${newStatus === 'true' ? 'ativado' : 'desativado'} com sucesso!`);
    } catch (error) {
      console.error('Erro ao atualizar o usuário:', error);
      alert('Ocorreu um erro ao atualizar o usuário.');
    }
  };

  // Função para deletar um usuário com integração via Axios
  const deleteUser = async (id: number) => {
    try {
      // Chamada fictícia para deletar usuário
      await axios.delete(`https://fakeapi.com/users/${id}`);

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
                      className={`px-3 py-1 mr-2 rounded ${
                        user.is_active === 'true'
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

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Administração de Usuários</h1>
      {renderTable('Administradores', 'admin')}
      {renderTable('Moderadores', 'moderador')}
      {renderTable('Contas Comuns', 'comum')}
    </div>
  );
}
