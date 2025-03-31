import Link from "next/link";

export default function Home() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Добро пожаловать в Art Studio</h2>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-600">
          Выберите раздел в боковом меню для начала работы.
        </p>
      </div>
    </div>
  );
}
