import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface EditGroupFormProps {
  onClose: () => void;
  onSuccess?: (group: {
    id: string;
    name: string;
    day1: string;
    day2: string;
    startTime: string;
    endTime: string;
  }) => void;
  group: {
    id: string;
    name: string;
    day1: string;
    day2: string;
    startTime: string;
    endTime: string;
  };
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

const englishToRussianDays: { [key: string]: string } = {
  'Monday': 'Понедельник',
  'Tuesday': 'Вторник',
  'Wednesday': 'Среда',
  'Thursday': 'Четверг',
  'Friday': 'Пятница',
  'Saturday': 'Суббота',
  'Sunday': 'Воскресенье'
};

const russianDays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

export default function EditGroupForm({ onClose, onSuccess, group }: EditGroupFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: group.name,
    day1: englishToRussianDays[group.day1] || group.day1,
    day2: englishToRussianDays[group.day2] || group.day2,
    startTime: group.startTime,
    endTime: group.endTime,
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
      const response = await fetch(`/api/groups/${group.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          day1: russianToEnglishDays[formData.day1],
          day2: russianToEnglishDays[formData.day2],
          startTime: formData.startTime,
          endTime: formData.endTime,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update group');
      }

      const updatedGroup = await response.json();
      
      if (onSuccess) {
        onSuccess(updatedGroup);
      }
      
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
          {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </div>
    </form>
  );
} 