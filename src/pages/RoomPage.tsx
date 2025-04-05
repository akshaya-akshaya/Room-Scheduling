// import React, { useState } from 'react';
// import { Plus, Edit, Trash2 } from 'lucide-react';
// import { useSchedule } from '../context/ScheduleContext';
// import RoomModal from '../components/RoomModal';
// import { Room } from '../types';

// const RoomPage: React.FC = () => {
//   const { rooms, addRoom, updateRoom, deleteRoom } = useSchedule();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();

//   const handleEdit = (room: Room) => {
//     setSelectedRoom(room);
//     setIsModalOpen(true);
//   };

//   const handleSave = (room: Room) => {
//     if (selectedRoom) {
//       updateRoom(room);
//     } else {
//       addRoom(room);
//     }
//     setSelectedRoom(undefined);
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Rooms</h1>
//         <button
//           onClick={() => {
//             setSelectedRoom(undefined);
//             setIsModalOpen(true);
//           }}
//           className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//         >
//           <Plus size={20} className="mr-2" />
//           Add Room
//         </button>
//       </div>

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Room Name
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Block
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {rooms.map((room) => (
//               <tr key={room.id}>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                   {room.name}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                   {room.blockName}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                   <button
//                     onClick={() => handleEdit(room)}
//                     className="text-blue-600 hover:text-blue-900 mr-4"
//                   >
//                     <Edit size={18} />
//                   </button>
//                   <button
//                     onClick={() => deleteRoom(room.id)}
//                     className="text-red-600 hover:text-red-900"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <RoomModal
//         isOpen={isModalOpen}
//         onClose={() => {
//           setIsModalOpen(false);
//           setSelectedRoom(undefined);
//         }}
//         onSave={handleSave}
//         room={selectedRoom}
//       />
//     </div>
//   );
// };

// export default RoomPage;

import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useSchedule } from '../context/ScheduleContext';
import RoomModal from '../components/RoomModal';
import { Room } from '../types';

const RoomPage: React.FC = () => {
  const { rooms, addRoom, updateRoom, deleteRoom } = useSchedule();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();
  const [searchText, setSearchText] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleSave = (room: Room) => {
    if (selectedRoom) {
      updateRoom(room);
    } else {
      addRoom(room);
    }
    setSelectedRoom(undefined);
    setIsModalOpen(false);
  };

  // Filter rooms based on search text
  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchText.toLowerCase()) ||
    (room.blockName && room.blockName.toLowerCase().includes(searchText.toLowerCase()))
  );

  // Calculate pagination
  const totalItems = filteredRooms.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / entriesPerPage));
  
  // Ensure current page is valid
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Get paginated data
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalItems);
  const paginatedRooms = filteredRooms.slice(startIndex, endIndex);

  // Navigation functions
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

  return (
    <div className="p-6 w-full bg-gray-50 min-h-screen">
      {/* Header with controls */}
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
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
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
              setSelectedRoom(undefined);
              setIsModalOpen(true);
            }}
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-md px-5 py-2 flex items-center justify-center transition-colors duration-200"
          >
            <Plus size={18} className="mr-1" />
            Add New Room
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-b">
                Rooms
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-b border-l">
                Blocks
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-900 border-b border-l w-32">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedRooms.map((room, index) => (
              <tr key={room.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 border-b">
                  {room.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 border-b border-l">
                  {room.blockName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right border-b border-l">
                  <div className="flex justify-end space-x-2">
                    <button 
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200"
                      onClick={() => handleEdit(room)}
                    >
                      <Pencil size={16} className="text-gray-600" />
                    </button>
                    <button 
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100"
                      onClick={() => deleteRoom(room.id)}
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedRooms.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500">
                  No rooms found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <span>
          {totalItems > 0 
            ? `Showing ${startIndex + 1} to ${endIndex} of ${totalItems} entries` 
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
          
          {/* Generate page buttons */}
          {(() => {
            // Calculate which page numbers to show
            let startPage = 1;
            
            // If current page is near the end, adjust startPage
            if (currentPage > totalPages - 3) {
              startPage = Math.max(1, totalPages - 3);
            }
            // Otherwise center current page if possible
            else if (currentPage > 2) {
              startPage = currentPage - 1;
            }
            
            // Limit to maximum of 4 pages
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
      <RoomModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRoom(undefined);
        }}
        onSave={handleSave}
        room={selectedRoom}
      />
    </div>
  );
};

export default RoomPage;