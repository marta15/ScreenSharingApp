import { useState, useEffect } from 'react';

import Api from '../api/websocket';
import SelectEntity from './SelectEntity';
import TransmissionControls from './TransmissionControls';

function VncMode(props: { mobile: boolean, onStop: () => void }) {
    const [selectedEntity, setSelectedEntity] = useState('');
    const [availableEntities, setAvailableEntities] = useState({ screens: [], windows: [] });


    const processAvailableEntities = (event: { data: string; }) => {
        const response = JSON.parse(event.data);
        const receivedEntities = { screens: response.data?.screens, windows: response.data?.windows };

        setAvailableEntities(receivedEntities);

    };

    useEffect(() => {
        Api.subscribeToMessage("available-entities", processAvailableEntities);
    }, []);

    const selectEntity = (entity: string) => {
        Api.send({ selected: entity });
        setSelectedEntity(entity);
    };

    const stopTransmission = () => {
        setSelectedEntity('');
        props.onStop();
    }


    if (props.mobile) {
        return (
            <div>
                <span>Mobile Display</span>
                <TransmissionControls onStop={stopTransmission} />

            </div>
        );
    }
    else if (selectedEntity === '') {
        return (
            <div>
                <SelectEntity
                    windows={availableEntities.windows}
                    screens={availableEntities.screens}
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
                    windows={availableEntities.windows}
                    screens={availableEntities.screens}
                    onSubmit={selectEntity}
                />
                <TransmissionControls onStop={stopTransmission} />
            </div>
        );
    }
}

export default VncMode;