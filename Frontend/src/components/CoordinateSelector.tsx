import React, { useRef, useState, useEffect } from 'react';

interface CoordinateSelectorProps {
 children: React.ReactNode;
 onCoordinatesUpdate: (coordinates: { x: number; y: number }) => void;
}

export default function CoordinateSelector({ children, onCoordinatesUpdate }: CoordinateSelectorProps) {
 const containerRef = useRef<HTMLDivElement>(null);
 const [coordinates, setCoordinates] = useState<{ x: number; y: number } | null>(null);

 useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      setCoordinates({ x, y });
      onCoordinatesUpdate({ x, y });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('click', handleClick);
    }

    return () => {
      if (container) {
        container.removeEventListener('click', handleClick);
      }
    };
 }, [onCoordinatesUpdate]);

 return (
    <div ref={containerRef} className='w-max h-max relative'>
      {children}
      {coordinates && (
        <div
        className={`absolute w-[30px] h-[30px] border-2 bg-primary/30 border-secondary rounded-full`}
        style={{
          left: `${coordinates.x}%`,
          top: `${coordinates.y}%`,
          transform: "translate(-50%, -50%)",
        }}
      />
      )}
    </div>
 );
}

