import React, { useState, useEffect } from 'react';

interface DoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (doctorName: string) => void;
  isRemove?: boolean;
  currentDoctor?: string;
  cellData: {
    roomId: string;
    day: string;
    shiftId: string;
    doctor?: string;
  } | null;
}
const DoctorModal: React.FC<DoctorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isRemove,
  currentDoctor,
  cellData,
}) => {
  const [doctorName, setDoctorName] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [doctorList, setDoctorList] = useState<string[]>([]);
  const [isCustomDoctor, setIsCustomDoctor] = useState(false);

  useEffect(() => {
    if (isOpen && cellData) {
      localStorage.setItem('selectedCellData', JSON.stringify(cellData));
    }
  }, [isOpen, cellData]);

  useEffect(() => {
    const savedDoctors = localStorage.getItem('doctorList');
    if (savedDoctors) {
      setDoctorList(JSON.parse(savedDoctors));
    } else {
      const defaultDoctors: string[] = [];
      setDoctorList(defaultDoctors);
      localStorage.setItem('doctorList', JSON.stringify(defaultDoctors));
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (isRemove && currentDoctor) {
        setSelectedDoctor(currentDoctor);
      } else {
        setSelectedDoctor('');
      }
      setDoctorName('');
      setIsCustomDoctor(false);
    }
  }, [isOpen, isRemove, currentDoctor]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (isRemove) {
      onSave('');
      onClose();
      return;
    }

    let finalDoctorName = '';

    if (isCustomDoctor) {
      if (!doctorName.trim()) return;
      finalDoctorName = doctorName;

      if (!doctorList.includes(doctorName)) {
        const updatedList = [...doctorList, doctorName];
        setDoctorList(updatedList);
        localStorage.setItem('doctorList', JSON.stringify(updatedList));
      }
    } else {
      if (!selectedDoctor) return;
      finalDoctorName = selectedDoctor;
    }

    onSave(finalDoctorName);
    setDoctorName('');
    setSelectedDoctor('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto z-10 overflow-hidden">
        <div className="border-b p-4">
          <h3 className="text-xl font-medium text-gray-800">
            {isRemove ? 'Remove Doctor' : 'Add Doctor'}
          </h3>
        </div>
        {isRemove ? (
          <div className="p-6 border-b">
            <p className="text-gray-600">
              Are you sure you want to remove Dr. {currentDoctor}?
            </p>
          </div>
        ) : (
          <div className="p-6 border-b">
            <form id="doctorForm" onSubmit={handleSubmit}>
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    id="existingDoctor"
                    name="doctorType"
                    checked={!isCustomDoctor}
                    onChange={() => setIsCustomDoctor(false)}
                    className="mr-2"
                  />
                  <label htmlFor="existingDoctor" className="font-medium text-gray-700">
                    Select Existing Doctor
                  </label>
                </div>

                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  disabled={isCustomDoctor}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                >
                  <option value="">-- Select a doctor --</option>
                  {doctorList.map((doctor, index) => (
                    <option key={index} value={doctor}>
                      {doctor}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    id="newDoctor"
                    name="doctorType"
                    checked={isCustomDoctor}
                    onChange={() => setIsCustomDoctor(true)}
                    className="mr-2"
                  />
                  <label htmlFor="newDoctor" className="font-medium text-gray-700">
                    Add New Doctor
                  </label>
                </div>

                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  disabled={!isCustomDoctor}
                  placeholder="Enter doctor name (without 'Dr.' prefix)"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                />
              </div>
            </form>
          </div>
        )}
        <div className="flex justify-end p-4 space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          {isRemove ? (
            <button
              onClick={handleSubmit}
              className="px-5 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Remove
            </button>
          ) : (
            <button
              type="submit"
              form="doctorForm"
              className="px-5 py-2 rounded bg-purple-500 text-white hover:bg-purple-600 transition-colors"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default DoctorModal;