export default function AttendancePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Посещаемость</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Учет посещаемости</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Отметить посещаемость
          </button>
        </div>
        <div className="space-y-4">
          {/* Placeholder for attendance tracking */}
          <p className="text-gray-600">Здесь будет отображаться информация о посещаемости</p>
        </div>
      </div>
    </div>
  );
} 