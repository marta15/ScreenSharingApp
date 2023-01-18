import { useRef, useEffect } from 'react';

import Api from '../api/websocket';

function Participant() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const updateScreen = (event: { data: string; }) => {

    };

    useEffect(() => {
        Api.subscribeToMessage("data", updateScreen);
    }, []);


    return (
        <div>
            <canvas ref={canvasRef} width="500" height="300">
                Screen sharing window.
            </canvas>

        </div>
    );

}

export default Participant;