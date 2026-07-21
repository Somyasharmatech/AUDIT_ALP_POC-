import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/src/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { ApiClient } from '@/src/lib/api';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';

export default function AuditCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: audits = [], isLoading } = useQuery({
    queryKey: ['audits'],
    queryFn: () => ApiClient.get('/audits')
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const today = () => setCurrentDate(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Create padding days for grid alignment
  const startDayOfWeek = monthStart.getDay();
  const paddingDays = Array.from({ length: startDayOfWeek }).map((_, i) => i);

  const getAuditsForDay = (date: Date) => {
    return audits.filter((audit: any) => {
      if (!audit.startDate) return false;
      const start = parseISO(audit.startDate);
      // For a simple view, we just show start date.
      return isSameDay(start, date);
    });
  };

  return (
    <PageLayout>
      <div className="p-6 max-w-[1600px] mx-auto h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#212529] mb-1">Audit Calendar</h1>
            <p className="text-sm text-[#6C757D]">Timeline of planned and active engagements.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={today} className="h-8 text-[13px] border-[#DEE2E6]">Today</Button>
            <div className="flex items-center border border-[#DEE2E6] rounded-sm bg-white">
              <button onClick={prevMonth} className="h-8 w-8 flex items-center justify-center text-[#495057] hover:bg-[#F8F9FA] transition-colors"><ChevronLeft className="h-4 w-4" /></button>
              <div className="h-8 px-4 flex items-center justify-center font-semibold text-[13px] text-[#212529] border-x border-[#DEE2E6] min-w-[140px]">
                {format(currentDate, 'MMMM yyyy')}
              </div>
              <button onClick={nextMonth} className="h-8 w-8 flex items-center justify-center text-[#495057] hover:bg-[#F8F9FA] transition-colors"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>

        <Card className="rounded-sm shadow-sm border-[#DEE2E6] bg-white flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-[#DEE2E6] bg-[#F8F9FA]/50 shrink-0">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-2 text-center text-[11px] font-semibold text-[#6C757D] uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto bg-[#F8F9FA]">
            <div className="grid grid-cols-7 auto-rows-[minmax(120px,1fr)] gap-[1px] bg-[#DEE2E6]">
              {paddingDays.map(i => (
                <div key={`padding-${i}`} className="bg-white min-h-[120px] p-2 opacity-50"></div>
              ))}
              
              {days.map(day => {
                const isToday = isSameDay(day, new Date());
                const dayAudits = getAuditsForDay(day);
                
                return (
                  <div key={day.toString()} className={`bg-white min-h-[120px] p-2 flex flex-col ${!isSameMonth(day, currentDate) ? 'opacity-50' : ''}`}>
                    <div className={`text-[12px] font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-[#005A9E] text-white' : 'text-[#495057]'}`}>
                      {format(day, 'd')}
                    </div>
                    <div className="flex-1 flex flex-col gap-1 overflow-y-auto">
                      {dayAudits.map((audit: any) => (
                        <div key={audit.id} className="text-[10px] p-1.5 rounded-sm bg-[#E5F0FA] border border-[#005A9E]/20 text-[#005A9E] leading-tight group relative cursor-pointer hover:border-[#005A9E]/50">
                           <div className="font-semibold truncate">{audit.name}</div>
                           <div className="text-[9px] opacity-80 truncate">{audit.department}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
