"use client"
import dynamic from 'next/dynamic';

export const ArtFrameCanvasDynamic = dynamic(() => import('@/app/frame/frame-canvas.component').then((module) => module.default), {
    ssr: false,
    loading: () => <></>,
});