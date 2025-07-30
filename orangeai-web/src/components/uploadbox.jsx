

import { useState } from 'react';

function UploadBox() {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="border-2 border-dashed border-gray-400 p-6 rounded-lg text-center bg-white shadow-sm">
      <label htmlFor="upload" className="cursor-pointer block text-lg font-medium text-gray-700">
        {file ? `Selected: ${file.name}` : 'Click to upload a video file'}
      </label>
      <input
        type="file"
        id="upload"
        accept="video/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}

export default UploadBox;