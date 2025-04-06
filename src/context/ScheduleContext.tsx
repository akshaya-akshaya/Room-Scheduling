import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Shift, Block, Room, WeekSchedule } from '../types';

interface ScheduleContextType {
  shifts: Shift[];
  blocks: Block[];
  rooms: Room[];
  weekSchedule: WeekSchedule | null;
  addShift: (shift: Shift) => void;
  updateShift: (shift: Shift) => void;
  deleteShift: (id: string) => void;
  addBlock: (block: Block) => void;
  updateBlock: (block: Block) => void;
  deleteBlock: (id: string) => void;
  addRoom: (room: Room) => void;
  updateRoom: (room: Room) => void;
  deleteRoom: (id: string) => void;
  updateWeekSchedule: (schedule: WeekSchedule) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shifts, setShifts] = useState<Shift[]>(() => {
    const saved = localStorage.getItem('shifts');
    return saved ? JSON.parse(saved) : [];
  });

  const [blocks, setBlocks] = useState<Block[]>(() => {
    const saved = localStorage.getItem('blocks');
    return saved ? JSON.parse(saved) : [];
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('rooms');
    return saved ? JSON.parse(saved) : [];
  });

  const [weekSchedule, setWeekSchedule] = useState<WeekSchedule | null>(() => {
    const saved = localStorage.getItem('weekSchedule');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('shifts', JSON.stringify(shifts));
  }, [shifts]);

  useEffect(() => {
    localStorage.setItem('blocks', JSON.stringify(blocks));
  }, [blocks]);

  useEffect(() => {
    localStorage.setItem('rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    if (weekSchedule) {
      localStorage.setItem('weekSchedule', JSON.stringify(weekSchedule));
    }
  }, [weekSchedule]);

  const addShift = (shift: Shift) => setShifts(prev => [...prev, shift]);
  const updateShift = (shift: Shift) => {
    setShifts(prev => prev.map(s => s.id === shift.id ? shift : s));
  };
  const deleteShift = (id: string) => setShifts(prev => prev.filter(s => s.id !== id));

  const addBlock = (block: Block) => setBlocks(prev => [...prev, block]);
  const updateBlock = (block: Block) => {
    setBlocks(prev => prev.map(b => b.id === block.id ? block : b));
  };
  const deleteBlock = (id: string) => setBlocks(prev => prev.filter(b => b.id !== id));

  const addRoom = (room: Room) => setRooms(prev => [...prev, room]);
  const updateRoom = (room: Room) => {
    setRooms(prev => prev.map(r => r.id === room.id ? room : r));
  };
  const deleteRoom = (id: string) => setRooms(prev => prev.filter(r => r.id !== id));

  const updateWeekSchedule = (schedule: WeekSchedule) => {
    setWeekSchedule(schedule);
    localStorage.setItem('weekSchedule', JSON.stringify(schedule));
  };

  const contextValue = useMemo(() => ({
    shifts,
    blocks,
    rooms,
    weekSchedule,
    addShift,
    updateShift,
    deleteShift,
    addBlock,
    updateBlock,
    deleteBlock,
    addRoom,
    updateRoom,
    deleteRoom,
    updateWeekSchedule,
  }), [shifts, blocks, rooms, weekSchedule]);

  return (
    <ScheduleContext.Provider value={contextValue}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) throw new Error('useSchedule must be used within a ScheduleProvider');
  return context;
};
