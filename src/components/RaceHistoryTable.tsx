'use client';

import React from 'react';

interface RaceData {
  date: Date;
  sessionName: string;
  position: number;
  kartNumber: number;
  bestTime: number;
  totalLaps: number;
}

interface RaceHistoryTableProps {
  races: RaceData[];
}

function formatTime(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = ((milliseconds % 60000) / 1000).toFixed(3);
  return `${minutes}:${seconds.padStart(6, '0')}`;
}

function getPositionColor(position: number): string {
  if (position === 1) return 'text-karting-gold';
  if (position === 2) return 'text-sky-blue';
  if (position === 3) return 'text-rb-blue';
  if (position <= 5) return 'text-electric-blue';
  return 'text-sky-blue/70';
}

function getPositionIcon(position: number): string {
  if (position === 1) return '🥇';
  if (position === 2) return '🥈';
  if (position === 3) return '🥉';
  return '🏁';
}

export default function RaceHistoryTable({ races }: RaceHistoryTableProps) {
  return (
    <div className="bg-midnight/60 border border-electric-blue/20 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🏁</span>
        <h3 className="font-bold text-2xl text-electric-blue">HISTORIAL DE CARRERAS</h3>
      </div>
      
      {races.length === 0 ? (
        <div className="text-center py-8 text-sky-blue/60">
          <div className="text-4xl mb-2">🎯</div>
          <p>¡Ve a correr para ver tu historial aquí!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {races.map((race, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between bg-rb-blue/10 border border-rb-blue/20 rounded-md p-3 hover:bg-rb-blue/15 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{getPositionIcon(race.position)}</span>
                  <div className="text-electric-blue text-sm font-medium">
                    {race.sessionName}
                  </div>
                </div>
                <div className="text-sky-blue/60 text-xs flex items-center gap-4">
                  <span>{race.date.toLocaleDateString()}</span>
                  <span>Kart #{race.kartNumber}</span>
                  <span>{race.totalLaps} vueltas</span>
                </div>
              </div>
              
              <div className="text-right ml-4">
                <div className={`font-bold text-lg ${getPositionColor(race.position)}`}>
                  #{race.position}
                </div>
                <div className="text-sky-blue/80 text-xs">
                  {formatTime(race.bestTime)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}