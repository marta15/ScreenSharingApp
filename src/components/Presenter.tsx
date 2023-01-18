import { useState, useEffect, useRef } from 'react';

import VncMode from './VncMode';
import WebRtcMode from './WebRtcMode';
import Api from '../api/websocket';

function Presenter() {
    const [config, setConfig] = useState('');
    const [mobileFlag, setMobileFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [configs, setConfigs] = useState([]);
    const configsRef = useRef([]);
    configsRef.current = configs;
    let configIndex = 0;
    const configIndexRef = useRef(0);
    configIndexRef.current = configIndex;

    const onStartButtonClick = () => {
        let configToTry = { config: configs[configIndex] };
        Api.send(configToTry);
    }



    useEffect(() => {
        const processSetConfig = (event: { data: string; }) => {
            const response = JSON.parse(event.data);

            if (response.data?.ack) {
                setConfig(configsRef.current[configIndexRef.current]);
                if (response.data?.mobile) {
                    setMobileFlag(true);
                }
            }
            else if (configIndexRef.current < configsRef.current.length - 1) {
                let configToTry = { config: configsRef.current[++(configIndexRef.current)] };
                Api.send(configToTry);
            }
            else {
                setErrorMessage(`Error connecting to server: ${response.data.error}`);
            }
        };

        const processConfig = (event: { data: string; }) => {
            const response = JSON.parse(event.data);
            if (response.data?.configPref) {
                console.log("setting prefConfig: ", response.data?.configPref);
                setConfigs(response.data.configPref);
            }
        };
        Api.subscribeToMessage("config-ack", processSetConfig);
        Api.subscribeToMessage("config-pref", processConfig);
    }, []);

    const onStopTransmission = () => {
        setConfig('');
    };

    const startButton = <button onClick={onStartButtonClick}>Start presenting</button>;


    if (config === 'VNC') {
        return (
            <div>
                <VncMode mobile={mobileFlag} onStop={onStopTransmission} />
            </div>
        );
    }
    else if (config === 'WebRTC') {
        return (
            <div>
                <WebRtcMode onStop={onStopTransmission} />
            </div>
        );
    }
    else {
        return (
            <div>
                {startButton}
                <div>{errorMessage}</div>
            </div>
        );
    }

}

export default Presenter;