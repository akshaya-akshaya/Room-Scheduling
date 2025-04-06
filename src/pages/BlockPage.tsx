import React, { useState } from 'react';
import { Plus, Pencil, Trash2, ChevronDown } from 'lucide-react';
import { useSchedule } from '../context/ScheduleContext';
import BlockModal from '../components/BlockModal';
import { Block } from '../types';
const BlockPage: React.FC = () => {
  const {blocks, addBlock, updateBlock, deleteBlock } = useSchedule();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [selectedBlock, setSelectedBlock] = useState<Block | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const handleEdit = (block: Block) => {
    setSelectedBlock(block);
    setIsModalOpen(true);
  };
  const handleSave = (block: Block) => {
    if (selectedBlock) {
      updateBlock(block);
    } else {
      addBlock(block);
    }
    setSelectedBlock(undefined);
    setIsModalOpen(false);
  };
  const filteredBlocks = blocks.filter(block => 
    block.name.toLowerCase().includes(searchText.toLowerCase())
    );
    const totalItems = filteredBlocks.length;
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
  
    const displayData = filteredBlocks;
    const totalDisplayItems = displayData.length;
  
    const paginatedDisplayData = displayData.slice(startIndex, startIndex + entriesPerPage);
    const displayBlock = paginatedDisplayData;

  return (
    <div className="p-6 w-full bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Show</span>
          <div className="relative">
              <select 
                className="appearance-none border border-gray-300 rounded px-3 py-1 text-sm pr-8 bg-white"
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500">
                <ChevronDown size={16} />
              </div>
            </div>
          <span className="text-sm text-gray-600">entries</span>
        </div>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 mr-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={() => {
              setSelectedBlock(undefined);
              setIsModalOpen(true);
            }}
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-md px-5 py-2 flex items-center justify-center transition-colors duration-200"
          >
            <Plus size={18} className="mr-1" />
            Add New Block
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-b">
                Block
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-900 border-b border-l w-32">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {displayBlock.map((block: any, index) => (
              <tr key={block.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <td className="px-6 py-0 whitespace-nowrap text-sm text-gray-800 border-b">
                  {block.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right border-b border-l">
                  <div className="flex justify-end space-x-2">
                    <button 
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200"
                      onClick={() => handleEdit(block)}
                    >
                      <Pencil size={16} className="text-gray-600" />
                    </button>
                    <button 
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100"
                      onClick={() => deleteBlock(block.id)}
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {displayBlock.length === 0 && (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-sm text-gray-500">
                  No Block found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
      <BlockModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBlock(undefined);
        }}
        onSave={handleSave}
        block={selectedBlock}
      />
    </div>
  );
};
export default BlockPage;