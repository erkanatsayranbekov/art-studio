export default function MasterClassesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Мастер Классы</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Список мастер классов</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Добавить мастер класс
          </button>
        </div>
        <div className="space-y-4">
          {/* Placeholder for master classes list */}
          <p className="text-gray-600">Список мастер классов будет отображаться здесь</p>
        </div>
      </div>
    </div>
  );
} 