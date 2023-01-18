import { useState } from 'react';

import Api from '../api/websocket';

function TransmissionControls(props: { onStop: () => void }) {
    const [transmissionState, setTransmissionState] = useState({ active: true, paused: false });

    const onPauseButtonClick = () => {
        if (transmissionState.paused) Api.send({ command: "resume" });
        else Api.send({ command: "pause" });
        setTransmissionState({ ...transmissionState, paused: !transmissionState.paused });
    };
    const onStopButtonClick = () => {
        Api.send({ command: "stop" });
        setTransmissionState({ ...transmissionState, active: false });
        props.onStop();
    };

    const pauseButton = <button onClick={onPauseButtonClick}>{transmissionState.paused ? "Resume" : "Pause"}</button>;
    const stopButton = <button onClick={onStopButtonClick}>Stop</button>;
    const canvasEl = transmissionState.active ? (
        <canvas width="500" height="300">
            Screen sharing window.
        </canvas>) : <div>Nothing to preview</div>;

    return (
        <div>
            {stopButton}
            {pauseButton}
            {canvasEl}
        </div>
    )


}

export default TransmissionControls;