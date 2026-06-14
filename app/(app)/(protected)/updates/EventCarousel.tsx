"use client";

import React, { useState } from 'react';
import { Calendar, MapPin, ChevronLeft, ChevronRight, User } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  slug: string;
  location?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  description?: unknown;
  thumbnail?: { url: string | null } | null;
  author?: { name: string } | null;
}

export default function EventCarousel({ events }: { events: Event[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!events || events.length === 0) {
    return (
      <div className="neo-card bg-white p-8 text-center border-2 border-neo-black shadow-neo-sm">
        <p className="text-neo-black/60 font-heading font-extrabold">Belum ada event kampus mendatang.</p>
      </div>
    );
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const currentEvent = events[currentIndex];

  // Helper to extract text from Lexical format
  const getExcerpt = (content: unknown) => {
    if (!content) return '';
    try {
      const data = (typeof content === 'string' ? JSON.parse(content) : content) as {
        root?: {
          children?: {
            children?: {
              text?: string;
            }[];
          }[];
        };
      };
      if (data?.root?.children) {
        return data.root.children
          .map((node) => {
            if (node.children) {
              return node.children.map((child) => child.text || '').join('');
            }
            return '';
          })
          .join(' ');
      }
    } catch (e) {}
    return '';
  };

  const formattedDate = (dateStr?: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const thumbnailUrl = currentEvent.thumbnail && typeof currentEvent.thumbnail === 'object'
    ? currentEvent.thumbnail.url
    : null;

  return (
    <div className="neo-card bg-white p-0 overflow-hidden relative border-2 border-neo-black shadow-neo-sm">
      {/* Event Header Ribbon */}
      <div className="bg-orange text-neo-black px-6 py-2 border-b-2 border-neo-black font-heading font-black text-sm uppercase tracking-wider flex items-center justify-between">
        <span>🔥 Event Kampus Mendatang</span>
        <span className="text-xs">
          {currentIndex + 1} dari {events.length}
        </span>
      </div>

      <div className="grid md:grid-cols-5 min-h-[320px]">
        {/* Cover Image / Thumbnail */}
        <div className="md:col-span-2 relative bg-cream/30 min-h-[200px] md:min-h-full border-b-2 md:border-b-0 md:border-r-2 border-neo-black flex items-center justify-center overflow-hidden">
          {thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnailUrl}
              alt={currentEvent.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange/20 to-sky/20 flex flex-col items-center justify-center p-6 text-center">
              <Calendar className="h-12 w-12 text-orange mb-2" />
              <span className="text-xs font-bold text-neo-black/60">UNNES Board Events</span>
            </div>
          )}
        </div>

        {/* Event Details */}
        <div className="md:col-span-3 p-6 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <h3 className="text-2xl font-heading font-black text-neo-black leading-tight">
              {currentEvent.title}
            </h3>

            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold text-neo-black/75">
              {currentEvent.startDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-orange" />
                  <span>{formattedDate(currentEvent.startDate)}</span>
                </div>
              )}
              {currentEvent.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-sky" />
                  <span>{currentEvent.location}</span>
                </div>
              )}
            </div>

            <p className="text-sm font-semibold text-neo-black/80 line-clamp-4 leading-relaxed">
              {getExcerpt(currentEvent.description) || 'Tidak ada deskripsi acara.'}
            </p>
          </div>

          {/* Author & Actions Row */}
          <div className="flex items-center justify-between border-t border-neo-black/10 pt-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-mint border border-neo-black flex items-center justify-center text-[10px] font-heading font-black">
                {currentEvent.author && typeof currentEvent.author === 'object'
                  ? currentEvent.author.name?.charAt(0).toUpperCase()
                  : 'A'}
              </div>
              <span className="text-xs font-bold text-neo-black/60">
                Oleh:{' '}
                {currentEvent.author && typeof currentEvent.author === 'object'
                  ? currentEvent.author.name
                  : 'Panitia'}
              </span>
            </div>

            {/* Slider Navigation Buttons */}
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                className="p-1.5 rounded-sm border-2 border-neo-black bg-white shadow-[2px_2px_0px_0px_#1A1A1A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#1A1A1A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4 text-neo-black" />
              </button>
              <button
                onClick={nextSlide}
                className="p-1.5 rounded-sm border-2 border-neo-black bg-white shadow-[2px_2px_0px_0px_#1A1A1A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#1A1A1A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
              >
                <ChevronRight className="h-4 w-4 text-neo-black" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
