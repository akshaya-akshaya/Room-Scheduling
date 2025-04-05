import React, { useState } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import { Room} from '../types';

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (room: Room) => void;
  room?: Room;
}

const RoomModal: React.FC<RoomModalProps> = ({ isOpen, onClose, onSave, room }) => {
  const { blocks } = useSchedule();
  const [name, setName] = useState(room?.name || '');
  const [blockId, setBlockId] = useState(room?.blockId || '');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedBlock = blocks.find(b => b.id === blockId);
    if (!selectedBlock) return;

    onSave({
      id: room?.id || crypto.randomUUID(),
      name,
      blockId,
      blockName: selectedBlock.name,
    });
    setName('');
    setBlockId('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto z-10 overflow-hidden">
        <div className="border-b p-4">
          <h3 className="text-xl font-medium text-gray-800">
            {room ? 'Edit Room' : 'Add New Room'}
          </h3>
        </div>
        <div className="p-6 border-b">
          <form id="roomForm" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block font-medium text-gray-700 mb-2">Room Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <div className="mb-2">
              <label className="block font-medium text-gray-700 mb-2">Block</label>
              <div className="relative">
                <select
                  value={blockId}
                  onChange={(e) => setBlockId(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select an option</option>
                  {blocks.map((block) => (
                    <option key={block.id} value={block.id}>
                      {block.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="flex justify-end p-4 space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
          <button
            type="submit"
            form="roomForm"
            className="px-5 py-2 rounded bg-purple-500 text-white hover:bg-purple-600 transition-colors"
          >
            Save Room
          </button>
        </div>
      </div>
    </div>
  );
};
export default RoomModal;