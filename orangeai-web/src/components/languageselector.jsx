import { useState } from 'react';

function LanguageSelector() {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('hi');

  return (
    <div className="flex gap-4 items-center justify-center py-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">From</label>
        <select
          value={sourceLang}
          onChange={(e) => setSourceLang(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="es">Spanish</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">To</label>
        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="hi">Hindi</option>
          <option value="en">English</option>
          <option value="es">Spanish</option>
        </select>
      </div>
    </div>
  );
}

export default LanguageSelector;
