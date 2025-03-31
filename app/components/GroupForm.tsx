'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface GroupFormProps {
  onClose: () => void;
  onSuccess?: (group: {
    id: string;
    name: string;
    day1: string;
    day2: string;
    startTime: string;
    endTime: string;
  }) => void;
}

const russianToEnglishDays: { [key: string]: string } = {
  'Понедельник': 'Monday',
  'Вторник': 'Tuesday',
  'Среда': 'Wednesday',
  'Четверг': 'Thursday',
  'Пятница': 'Friday',
  'Суббота': 'Saturday',
  'Воскресенье': 'Sunday'
};

const russianDays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

export default function GroupForm({ onClose, onSuccess }: GroupFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    day1: 'Понедельник',
    day2: 'Вторник',
    startTime: '',
    endTime: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          day1: russianToEnglishDays[formData.day1],
          day2: russianToEnglishDays[formData.day2],
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create group');
      }

      const newGroup = await response.json();
      
      // Call the success callback with the new group data
      if (onSuccess) {
        onSuccess(newGroup);
      }
      
      // Close the modal
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Название группы
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          placeholder="Введите название группы"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="day1" className="block text-sm font-medium text-gray-700 mb-1">
            Первый день
          </label>
          <select
            id="day1"
            name="day1"
            value={formData.day1}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          >
            {russianDays.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="day2" className="block text-sm font-medium text-gray-700 mb-1">
            Второй день
          </label>
          <select
            id="day2"
            name="day2"
            value={formData.day2}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          >
            {russianDays.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
            Время начала
          </label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            required
          />
        </div>

        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
            Время окончания
          </label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Создание...' : 'Создать группу'}
        </button>
      </div>
    </form>
  );
} 