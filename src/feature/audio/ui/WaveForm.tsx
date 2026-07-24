'use client';

import {useEffect, useRef} from "react";
import WaveSurfer from "wavesurfer.js";

interface Props {
    uuid: string|null,
}

export default function WaveForm({uuid}: Props) {
    const divRef = useRef<HTMLDivElement>(null)
    const wavesurferRef = useRef<WaveSurfer | null>(null);

    useEffect(() => {

        if (!divRef.current) return;

        if (wavesurferRef.current) {
            wavesurferRef.current.destroy();
        }

        const options = {
            container: divRef.current,
            waveColor: '#818cf8',
            progressColor: '#4f46e5',
            url: `/api/audio/${uuid}`,
            barHeight: 0.5,
            mediaControls: true,
            autoplay: true
        }

        wavesurferRef.current = WaveSurfer.create(options)

        wavesurferRef.current.on('click', async () => {
            if (!wavesurferRef.current) return;
            await wavesurferRef.current.play();
        })

        wavesurferRef.current.on('finish', () => {
            if (!wavesurferRef.current) return;
            wavesurferRef.current.destroy();
        })

        return () => {
            if (wavesurferRef.current) {
                wavesurferRef.current.destroy();
                wavesurferRef.current = null;
            }

        }

    }, [uuid])

    return (
        <div ref={divRef}></div>
    )
}