import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Shift } from '../types';
import { message, TimePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (shift: Shift) => void;
  shift?: Shift;
}
const ShiftModal: React.FC<ShiftModalProps> = ({ isOpen, onClose, onSave, shift }) => {
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (shift) {
      setStartTime(shift?.startTime ? dayjs(shift.startTime, 'HH:mm') : null);
      setEndTime(shift?.endTime ? dayjs(shift.endTime, 'HH:mm') : null);
    } else {
      setStartTime(null);
      setEndTime(null);
    }
  }, [shift, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); 
      onSave({
        id: shift?.id || crypto.randomUUID(),
        name: `${startTime?.format('h:mm A')} - ${endTime?.format('h:mm A')}`,
        startTime: startTime ? startTime.format('HH:mm') : '',
        endTime: endTime ? endTime.format('HH:mm') : '',
      });
      message.success(shift ? 'Shift updated successfully' : 'Shift created successfully');
      onClose();
    } catch (err) {
      message.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const format = 'h:mm A';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={shift ? 'Edit Shift' : 'Add New Shift'}>
      <div className="border-t border-gray-200 py-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
          <div className="flex items-center space-x-2">
            <TimePicker 
              format={format}
              value={startTime}
              onChange={setStartTime}
              placeholder="Start Time"
              className="w-full"
              use12Hours
            />
            <span className="text-gray-500">-</span>
            <TimePicker 
              format={format}
              value={endTime}
              onChange={setEndTime}
              placeholder="End Time"
              className="w-full"
              use12Hours
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded-md hover:bg-purple-600"
            disabled={!startTime || !endTime || loading}
          >
            {loading ? 'Saving...' : 'Save Shift'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default ShiftModal;