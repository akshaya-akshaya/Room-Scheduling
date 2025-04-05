import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useSchedule } from '../context/ScheduleContext';
import BlockModal from '../components/BlockModal';
import { Block } from '../types';
const BlockPage: React.FC = () => {
  const {blocks, addBlock, updateBlock, deleteBlock } = useSchedule();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [selectedBlock, setSelectedBlock] = useState<Block | undefined>();

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

  const sampleShifts = [
    { id: 1, name: '9 am - 1 pm', startTime: '09:00', endTime: '13:00' },
    { id: 2, name: '1 pm - 3 pm', startTime: '13:00', endTime: '15:00' },
    { id: 3, name: 'Lorem Ipsum', startTime: '00:00', endTime: '00:00' },
    { id: 4, name: 'Lorem Ipsum', startTime: '00:00', endTime: '00:00' },
    { id: 5, name: 'Lorem Ipsum', startTime: '00:00', endTime: '00:00' },
    { id: 6, name: 'Lorem Ipsum', startTime: '00:00', endTime: '00:00' },
  ];
  const displayBlock = filteredBlocks.length > 0 ? filteredBlocks : sampleShifts;
  console.log('--------filteredBlocks--------', filteredBlocks);

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
        <span>Showing 1 to {Math.min(displayBlock.length, entriesPerPage)} of {displayBlock.length} entries</span>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border-0 text-gray-400 cursor-not-allowed">
            Previous
          </button>
          <button className="px-3 py-1 border-0 rounded bg-purple-50 font-bold text-purple-500">
            1
          </button>
          <button className="px-3 py-1 border-0 text-gray-400 cursor-not-allowed">
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