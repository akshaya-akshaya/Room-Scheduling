import React, { useState } from 'react';
import { Block } from '../types';
import { message } from 'antd';
interface BlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (block: Block) => void;
  block?: Block;
}

const BlockModal: React.FC<BlockModalProps> = ({ isOpen, onClose, onSave, block }) => {
  const [name, setName] = useState(block?.name || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); 
      onSave({
        id: block?.id || crypto.randomUUID(),
        name,
      });
      message.success(block ? 'Block updated successfully' : 'Block created successfully');
      setName('');
      onClose();
    } catch (err) {
      message.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    setName(block?.name || '');
  }, [block]);
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto z-10 overflow-hidden">
        <div className="border-b p-4">
          <h3 className="text-xl font-medium text-gray-800">
            {block ? 'Edit Block' : 'Add New Block'}
          </h3>
        </div>
        <div className="p-6 border-b">
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-2">Block Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
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
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded bg-purple-500 text-white hover:bg-purple-600 transition-colors"
          >
            {loading ? 'Saving...' : 'Save Block'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default BlockModal;