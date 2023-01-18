import { useState } from 'react';
import Modal from 'react-modal';

function SelectEntity(props: { windows: string[], screens: string[], onSubmit: (selected: string) => void }) {
    const [selected, setSelected] = useState("");
    const [openPopup, setOpenPopup] = useState({ open: false, tab: "screens" });

    const onSelectScreenButtonClick = () => {
        setOpenPopup({ open: true, tab: "screens" });
    }
    const onSelectWindowButtonClick = () => {
        setOpenPopup({ open: true, tab: "windows" });
    }
    Modal.setAppElement('#root');

    const onSelectedEntityChange = (event: React.FormEvent<HTMLInputElement>) => {
        setSelected(event.currentTarget.value);
    };

    const screensTab = props.screens.map((screen) => {
        return (
            <div key={screen}>
                <input type="radio" id={screen} name="entity" value={screen} onChange={onSelectedEntityChange} checked={screen === selected}></input>
                <label htmlFor={screen}>{screen}</label>
            </div>
        );
    });

    const windowsTab = props.windows.map((window) => {
        return (
            <div key={window}>
                <input type="radio" id={window} name="entity" value={window} onChange={onSelectedEntityChange} checked={window === selected}></input>
                <label htmlFor={window}>{window}</label>
            </div>
        );
    });

    const handleClose = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setOpenPopup({ ...openPopup, open: false });
        props.onSubmit(selected);
    };

    let screenClass = "";
    let windowClass = "";
    if (openPopup.tab === "screens") {
        screenClass = "active";
    }
    else if (openPopup.tab === "windows") {
        windowClass = "active";
    }

    const selectButtons = (
        <span>
            {props.windows.length > 0 && <button onClick={onSelectWindowButtonClick}>Select window</button>}
            {props.screens.length > 0 && <button onClick={onSelectScreenButtonClick}>Select screen</button>}
        </span>);
    const waitingMessage = <span>Waiting for server</span>;


    return (<div>
        {props.screens.length > 0 ? selectButtons : waitingMessage}
        <Modal
            isOpen={openPopup.open}
            contentLabel="Choose Screen / Window"
        >

            <form onSubmit={handleClose}>
                <div className="tabs">
                    <div className="tab">
                        {props.windows.length > 0 && <button type="button" onClick={() => setOpenPopup({ ...openPopup, tab: "windows" })} className={windowClass}>Windows</button>}
                        {props.screens.length > 0 && <button type="button" onClick={() => setOpenPopup({ ...openPopup, tab: "screens" })} className={screenClass}>Screens</button>}
                    </div>

                    <div className={`tab-content ${screenClass}`}>
                        {screensTab}
                    </div>
                    <div className={`tab-content ${windowClass}`}>
                        {windowsTab}
                    </div>
                    <button className="ok-button">OK</button>
                </div>
            </form>
        </Modal>
    </div>);
}

export default SelectEntity;