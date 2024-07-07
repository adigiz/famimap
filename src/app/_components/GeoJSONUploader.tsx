import React, { useState } from 'react'
import ProgressBar from './ProgressBar'

const GeoJSONUploader: React.FC = () => {
  const [isFormFilled, setIsFormFilled] = useState<boolean | false>(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<object | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const validateGeoJson = (json: any): boolean => {
    return (
      json.type === 'FeatureCollection' &&
      Array.isArray(json.features) &&
      json.features.every((feature: any) => feature.type === 'Feature')
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split('.').pop();
      if (fileExtension !== 'geojson' && fileExtension !== 'json') {
        setError('Please upload a valid GeoJSON file.');
        setFileName(null);
        setGeoJsonData(null);
        return;
      }

      setFileName(file.name);
      const reader = new FileReader();
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(progress);
        }
      };

      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          if (validateGeoJson(json)) {
            setGeoJsonData(json);
            setError(null);
            setUploadProgress(100);
          } else {
            throw new Error('Invalid GeoJSON structure');
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
          setGeoJsonData(null);
          setError('Invalid GeoJSON file content.');
          setUploadProgress(0);
        }
      };
      reader.readAsText(file);
      setIsFormFilled(true)
    }
  };
  const handleDelete = () => {
    setFileName(null);
    setGeoJsonData(null);
    setError(null);
    setUploadProgress(0);
    setIsFormFilled(false)
  };

  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[550px] bg-zinc-00 rounded border border-[#e0e0e0]">
        <form
          className="py-6 px-9"
          action=""
          method="POST"
        >

          <div className="mb-6 pt-4">
            <label className="mb-5 block text-xl font-semibold">
              Upload Geo JSON File
            </label>

            <div className="mb-8">
              <input type="file" name="file" id="file" className="sr-only" onChange={handleFileChange} accept=".geojson,application/json" />
              <label
                htmlFor="file"
                className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center"
              >
                <div>
                  <span className="mb-2 block text-xl font-semibold">
                    Drop files here
                  </span>
                  <span className="mb-2 block text-base font-medium">
                    Or
                  </span>
                  <span
                    className="hover:bg-blue-600 hover:text-white inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium"
                  >
                    Browse
                  </span>
                </div>
              </label>
              <p className='text-red-500'>{error}</p>
            </div>
            {!error && fileName && (
              <ProgressBar fileName={fileName} uploadProgress={uploadProgress} handleDelte={handleDelete} />
            )}
          </div>

          <div>
            <button
              disabled={!isFormFilled}
              className="hover:shadow-form hover:bg-blue-700 disabled:opacity-50 w-full rounded-md bg-blue-600 py-3 px-8 text-center text-base font-semibold text-white outline-none"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GeoJSONUploader;