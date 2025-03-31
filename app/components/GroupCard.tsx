import { FaClock, FaCalendarAlt, FaUsers, FaEdit, FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import Modal from './Modal';
import EditGroupForm from './EditGroupForm';

interface GroupCardProps {
  id: string;
  name: string;
  day1: string;
  day2: string;
  startTime: string;
  endTime: string;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const englishToRussianDays: { [key: string]: string } = {
  'Monday': 'Пн',
  'Tuesday': 'Вт',
  'Wednesday': 'Ср',
  'Thursday': 'Чт',
  'Friday': 'Пт',
  'Saturday': 'Сб',
  'Sunday': 'Вс'
};

export default function GroupCard({
  id,
  name,
  day1,
  day2,
  startTime,
  endTime,
  onEditClick,
  onDeleteClick
}: GroupCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteClick();
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-100 p-1.5 rounded-lg shadow-sm">
                <FaUsers className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
            </div>
            <div className="bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm">
              Активная
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="bg-gray-50 rounded-lg p-3 shadow-sm">
              <div className="flex items-center text-gray-600">
                <FaCalendarAlt className="w-3.5 h-3.5 mr-2 text-blue-500" />
                <span className="font-medium text-sm">Дни занятий:</span>
                <span className="ml-1 text-sm text-gray-700">
                  {englishToRussianDays[day1]}, {englishToRussianDays[day2]}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 shadow-sm">
              <div className="flex items-center text-gray-600">
                <FaClock className="w-3.5 h-3.5 mr-2 text-blue-500" />
                <span className="font-medium text-sm">Время занятий:</span>
                <span className="ml-1 text-sm text-gray-700">
                  {startTime} - {endTime}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex justify-end">
              <div className="flex space-x-1.5">
                <button 
                  onClick={handleEditClick}
                  className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleDeleteClick}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Редактировать группу"
      >
        <EditGroupForm
          onClose={() => setIsEditModalOpen(false)}
          group={{
            id,
            name,
            day1,
            day2,
            startTime,
            endTime,
          }}
        />
      </Modal>
    </>
  );
} 