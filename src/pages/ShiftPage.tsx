import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useSchedule } from '../context/ScheduleContext';
import ShiftModal from '../components/ShiftModal';
import { Shift } from '../types';

const ShiftPage: React.FC = () => {
  const { shifts, addShift, updateShift, deleteShift } = useSchedule();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | undefined>();
  const [searchText, setSearchText] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  
  const handleEdit = (shift: Shift) => {
    setSelectedShift(shift);
    setIsModalOpen(true);
  };

  const handleSave = (shift: Shift) => {
    if (selectedShift) {
      updateShift(shift);
    } else {
      addShift(shift);
    }
    setSelectedShift(undefined);
    setIsModalOpen(false);
  };

  const filteredShifts = shifts.filter(shift => 
    shift.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const totalItems = filteredShifts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / entriesPerPage));
  
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalItems);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const sampleShifts = [
    { id: 1, name: '9 am - 1 pm', startTime: '09:00', endTime: '13:00' },
    { id: 2, name: '1 pm - 3 pm', startTime: '13:00', endTime: '15:00' },
    { id: 3, name: 'Morning Shift', startTime: '07:00', endTime: '11:00' },
    { id: 4, name: 'Afternoon Shift', startTime: '12:00', endTime: '16:00' },
    { id: 5, name: 'Evening Shift', startTime: '17:00', endTime: '21:00' },
    { id: 6, name: 'Night Shift', startTime: '22:00', endTime: '06:00' },
    { id: 7, name: 'Weekend Morning', startTime: '08:00', endTime: '12:00' },
    { id: 8, name: 'Weekend Evening', startTime: '16:00', endTime: '20:00' },
    { id: 9, name: 'Half Day', startTime: '08:00', endTime: '14:00' },
    { id: 10, name: 'Full Day', startTime: '09:00', endTime: '17:00' },
  ];
  const displayData = filteredShifts.length > 0 ? filteredShifts : sampleShifts;
  const totalDisplayItems = displayData.length;

  const paginatedDisplayData = displayData.slice(startIndex, startIndex + entriesPerPage);
  const displayShifts = paginatedDisplayData;

  return (
    <div className="p-6 w-full bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Show</span>
          <div className="relative">
            <select 
              className="appearance-none border border-gray-300 rounded px-3 py-1 text-sm pr-8 bg-white"
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1); 
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <span className="text-sm text-gray-600">entries</span>
        </div>

        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1); 
            }}
            className="border border-gray-300 rounded-md px-3 py-2 mr-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={() => {
              setSelectedShift(undefined);
              setIsModalOpen(true);
            }}
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-md px-5 py-2 flex items-center justify-center transition-colors duration-200"
          >
            <Plus size={18} className="mr-1" />
            Add New Shift
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-b">
                Shift
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-900 border-b border-l w-32">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {displayShifts.map((shift: any, index) => (
              <tr key={shift.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <td className="px-6 py-0 whitespace-nowrap text-sm text-gray-800 border-b">
                  {shift.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right border-b border-l">
                  <div className="flex justify-end space-x-2">
                    <button 
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200"
                      onClick={() => handleEdit(shift)}
                    >
                      <Pencil size={16} className="text-gray-600" />
                    </button>
                    <button 
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100"
                      onClick={() => deleteShift(shift.id)}
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {displayShifts.length === 0 && (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-sm text-gray-500">
                  No shifts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <span>
          {totalDisplayItems > 0 
            ? `Showing ${startIndex + 1} to ${Math.min(endIndex, totalDisplayItems)} of ${totalDisplayItems} entries` 
            : 'Showing 0 to 0 of 0 entries'}
        </span>
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 border-0 ${
              currentPage > 1 
                ? 'text-purple-500 hover:bg-purple-50 cursor-pointer' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
            onClick={goToPreviousPage}
            disabled={currentPage <= 1}
          >
            Previous
          </button>
          {(() => {
            let startPage = 1;
            
            if (currentPage > totalPages - 3) {
              startPage = Math.max(1, totalPages - 3);
            }
            else if (currentPage > 2) {
              startPage = currentPage - 1;
            }
            const pagesToShow = Math.min(4, totalPages);
            return Array.from({ length: pagesToShow }, (_, i) => {
              const pageNum = startPage + i;
              if (pageNum <= totalPages) {
                return (
                  <button 
                    key={pageNum}
                    className={`px-3 py-1 border-0 rounded ${
                      pageNum === currentPage 
                        ? 'bg-purple-50 font-bold text-purple-500' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
            });
          })()}
          
          <button 
            className={`px-3 py-1 border-0 ${
              currentPage < totalPages 
                ? 'text-purple-500 hover:bg-purple-50 cursor-pointer' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
            onClick={goToNextPage}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      <ShiftModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedShift(undefined);
        }}
        onSave={handleSave}
        shift={selectedShift}
      />
    </div>
  );
};
export default ShiftPage;