import { useState, useEffect } from 'react';

import Api from '../api/websocket';
import SelectEntity from './SelectEntity';
import TransmissionControls from './TransmissionControls';

function WebRtcMode(props: { onStop: () => void }) {
    const [selectedEntity, setSelectedEntity] = useState('');
    const [availableEntities, setAvailableEntities] = useState([]);

    const processAvailableEntities = (event: { data: string; }) => {
        const response = JSON.parse(event.data);
        const receivedEntities = response.data?.screens;

        setAvailableEntities(receivedEntities);

    };

    useEffect(() => {
        Api.subscribeToMessage("available-entities", processAvailableEntities);
    }, []);

    const selectEntity = (entity: string) => {
        setSelectedEntity(entity);
    };

    const stopTransmission = () => {
        setSelectedEntity('');
        props.onStop();
    }

    if (selectedEntity === '') {
        return (
            <div>
                <SelectEntity
                    windows={[]}
                    screens={availableEntities}
                    onSubmit={selectEntity}
                />
            </div>
        );
    }
    else {
        return (
            <div>
                <span>{selectedEntity}</span>
                <SelectEntity
                    windows={[]}
                    screens={availableEntities}
                    onSubmit={selectEntity}
                />
                <TransmissionControls onStop={stopTransmission} />
            </div>
        );
    }
}

export default WebRtcMode;