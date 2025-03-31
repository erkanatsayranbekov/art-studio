'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Modal from '../components/Modal';
import GroupForm from '../components/GroupForm';
import GroupCard from '../components/GroupCard';
import EditGroupForm from '../components/EditGroupForm';
import ConfirmModal from '../components/ConfirmModal';
import { FaPlus } from 'react-icons/fa';

interface Group {
  id: string;
  name: string;
  day1: string;
  day2: string;
  startTime: string;
  endTime: string;
}

export default function GroupsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/groups');
      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }
      const data = await response.json();
      setGroups(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchGroups();
    }
  }, [status, updateTrigger]);

  const handleCreateSuccess = (newGroup: Group) => {
    setGroups(prevGroups => [...prevGroups, newGroup]);
    setIsCreateModalOpen(false);
  };

  const handleEditSuccess = (updatedGroup: Group) => {
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === updatedGroup.id ? updatedGroup : group
      )
    );
    setIsEditModalOpen(false);
    setSelectedGroup(null);
    setUpdateTrigger(prev => prev + 1);
  };

  const handleDelete = async (groupId: string) => {
    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete group');
      }

      setGroups(prevGroups => prevGroups.filter(group => group.id !== groupId));
      setUpdateTrigger(prev => prev + 1);
      setIsDeleteModalOpen(false);
      setSelectedGroup(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the group');
    }
  };

  const handleDeleteClick = (group: Group) => {
    setSelectedGroup(group);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (group: Group) => {
    setSelectedGroup(group);
    setIsEditModalOpen(true);
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-200 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Группы</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Создать группу
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <GroupCard
            key={group.id}
            id={group.id}
            name={group.name}
            day1={group.day1}
            day2={group.day2}
            startTime={group.startTime}
            endTime={group.endTime}
            onEditClick={() => handleEditClick(group)}
            onDeleteClick={() => handleDeleteClick(group)}
          />
        ))}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Создание новой группы"
      >
        <GroupForm
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedGroup(null);
        }}
        title="Редактирование группы"
      >
        {selectedGroup && (
          <EditGroupForm
            group={selectedGroup}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedGroup(null);
            }}
            onSuccess={handleEditSuccess}
          />
        )}
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedGroup(null);
        }}
        onConfirm={() => selectedGroup && handleDelete(selectedGroup.id)}
        title="Удаление группы"
        message={`Вы уверены, что хотите удалить группу "${selectedGroup?.name}"? Это действие нельзя отменить.`}
      />
    </div>
  );
} 