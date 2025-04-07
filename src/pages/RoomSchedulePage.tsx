import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { format, addDays, startOfWeek, getWeek } from 'date-fns';
import { X } from 'lucide-react';
import { useSchedule } from '../context/ScheduleContext';
import DoctorModal from '../components/DoctorModal';

const RoomSchedulePage: React.FC = () => {
  const { shifts, rooms, weekSchedule, updateWeekSchedule } = useSchedule();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    roomId: string;
    day: string;
    shiftId: string;
    doctor?: string;
  } | null>(null);

  const initialized = useRef(false);

  const today = useMemo(() => new Date(), []);
  const start = useMemo(() => startOfWeek(today), [today]);

  const { weekDays, weekNumber, year, weekKey } = useMemo(() => ({
    weekDays: Array.from({ length: 7 }, (_, i) => addDays(start, i)),
    weekNumber: getWeek(start),
    year: start.getFullYear(),
    weekKey: `Week-${getWeek(start)}-${start.getFullYear()}`,
  }), [start]);

  const roomsByBlock = useMemo(() => {
    return rooms.reduce((acc, room) => {
      const blockName = room.blockName || 'Unknown Block';
      acc[blockName] = acc[blockName] || [];
      acc[blockName].push(room);
      return acc;
    }, {} as Record<string, typeof rooms>);
  }, [rooms]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const savedSchedule = localStorage.getItem(weekKey);
    if (savedSchedule) {
      try {
        const parsedSchedule = JSON.parse(savedSchedule);
        const doctorAssignments = JSON.parse(localStorage.getItem('doctorAssignments') || '[]');

        doctorAssignments.forEach((assignment: any) => {
          const dayIndex = parsedSchedule.data.findIndex((d: any) => d.day === assignment.day);
          if (dayIndex !== -1 && parsedSchedule.data[dayIndex].roomData[assignment.roomId]) {
            const shiftIndex = parsedSchedule.data[dayIndex].roomData[assignment.roomId]
              .findIndex((s: any) => s.shiftId === assignment.shiftId);
            if (shiftIndex !== -1) {
              parsedSchedule.data[dayIndex].roomData[assignment.roomId][shiftIndex].doctor = assignment.doctor;
            }
          }
        });

        updateWeekSchedule(parsedSchedule);
        return;
      } catch (error) {
        console.error("Error parsing saved schedule:", error);
      }
    }

    const newSchedule: any = {
      weekKey,
      weekNumber,
      year,
      data: weekDays.map(day => ({
        day: format(day, 'EEEE'),
        roomData: Object.fromEntries(
          rooms.map(room => [
            room.id,
            shifts.map(shift => ({
              shiftId: shift.id,
              shiftName: shift.name,
              doctor: '',
            }))
          ])
        ),
      })),
    };

    updateWeekSchedule(newSchedule);
    localStorage.setItem(weekKey, JSON.stringify(newSchedule));
  }, [weekKey, rooms, shifts, updateWeekSchedule, weekDays]);

  const handleCellClick = useCallback((roomId: string, day: string, shiftId: string, doctor?: string) => {
    setSelectedCell({ roomId, day, shiftId, doctor });
    setIsModalOpen(true);
  }, []);

  const handleDoctorUpdate = useCallback((doctorName: string) => {
    if (!selectedCell || !weekSchedule) return;

    const updatedData = weekSchedule.data.map((dayData: any) => {
      if (dayData.day !== selectedCell.day) return dayData;
      if (!dayData.roomData[selectedCell.roomId]) {
        console.log(`Initializing room data for roomId: ${selectedCell.roomId}`);
        dayData.roomData[selectedCell.roomId] = shifts.map(shift => ({
          shiftId: shift.id,
          shiftName: shift.name,
          doctor: '',
        }));
      }
      
      return {
        ...dayData,
        roomData: {
          ...dayData.roomData,
          [selectedCell.roomId]: dayData.roomData[selectedCell.roomId].map((shift: any) =>
            shift.shiftId === selectedCell.shiftId
              ? { ...shift, doctor: doctorName }
              : shift
          ),
        },
      };
    });

    const updatedSchedule = { ...weekSchedule, data: updatedData };
    updateWeekSchedule(updatedSchedule);
    localStorage.setItem(weekKey, JSON.stringify(updatedSchedule));
    const doctorAssignments = JSON.parse(localStorage.getItem('doctorAssignments') || '[]');
    const filteredAssignments = doctorAssignments.filter((item: any) =>
      !(item.roomId === selectedCell.roomId && item.day === selectedCell.day && item.shiftId === selectedCell.shiftId)
    );

    if (doctorName) {
      filteredAssignments.push({
        roomId: selectedCell.roomId,
        day: selectedCell.day,
        shiftId: selectedCell.shiftId,
        doctor: doctorName
      });
    }

    localStorage.setItem('doctorAssignments', JSON.stringify(filteredAssignments));
    setIsModalOpen(false);
    setSelectedCell(null);
  }, [selectedCell, weekSchedule, updateWeekSchedule, weekKey, shifts]);

  if (!weekSchedule) return null;

  const displayDays = weekSchedule.data;

  return (
    <div className="p-6 w-full bg-gray-50 min-h-screen">
      <div className="mb-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-3 bg-gray-100"></th>
              {Object.entries(roomsByBlock).map(([blockName, blockRooms]) => (
                <th key={blockName} className="border p-3 bg-gray-100 text-center" colSpan={blockRooms.length}>
                  {blockName}
                </th>
              ))}
            </tr>
            <tr>
              <th className="border p-3 bg-gray-100"></th>
              {Object.values(roomsByBlock).flatMap(blockRooms =>
                blockRooms.map(room => (
                  <th key={room.id} className="border p-3 bg-gray-200 text-center">
                    {room.name}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {displayDays.map(day => (
              <React.Fragment key={day.day}>
                <tr>
                  <td className="border p-3 bg-gray-200 font-medium">{day.day}</td>
                  {Object.values(roomsByBlock).flatMap(blockRooms =>
                    blockRooms.map(room => (
                      <td key={`${day.day}-${room.id}-header`} className="border p-0 bg-gray-50"></td>
                    ))
                  )}
                </tr>
                {shifts.map(shift => (
                  <tr key={`${day.day}-${shift.id}`}>
                    <td className="border p-3 text-center">{shift.name}</td>
                    {Object.values(roomsByBlock).flatMap(blockRooms =>
                      blockRooms.map(room => {
                        const schedule = day.roomData[room.id]?.find(s => s.shiftId === shift.id);
                        const doctor = schedule?.doctor || '';
                        const hasDoctor = !!doctor;

                        return (
                          <td key={`${day.day}-${room.id}-${shift.id}`} className="border p-0 min-w-32" onClick={() => {
                            if(!doctor){
                              handleCellClick(room.id, day.day, shift.id, doctor)}}
                            }
                           >
                            <div className={`w-full h-full p-3 cursor-pointer ${hasDoctor ? 'bg-green-400' : 'bg-yellow-300'}`}>
                              {hasDoctor ? (
                                <div className="flex items-center justify-between">
                                  <span>Dr. {doctor}</span>
                                  <X
                                    size={16}
                                    className="text-black"
                                    onClick={() => handleCellClick(room.id, day.day, shift.id, doctor)}
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center justify-between">
                                  <span className="text-yellow-300">.</span>
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })
                    )}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <DoctorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCell(null);
        }}
        onSave={handleDoctorUpdate}
        isRemove={!!selectedCell?.doctor}
        currentDoctor={selectedCell?.doctor}
        cellData={selectedCell}
      />
    </div>
  );
};
export default RoomSchedulePage;
