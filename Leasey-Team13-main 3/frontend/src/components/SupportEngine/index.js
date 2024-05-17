import React, { useRef, useEffect } from "react";
import SupportWindow from './SupportWindow';
import Avatar from './Avatar';

const SupportEngine = ({ isVisible, setVisible,user }) => {
    const wrapperRef = useRef(null);

    // Function to handle clicking outside the support window to close it
    function useOutsideAlerter(ref) {
        useEffect(() => {
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    setVisible(false);
                }
            }

            // Add event listener for mouse down
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                // Cleanup the event listener
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref, setVisible]);
    }

    useOutsideAlerter(wrapperRef);

    return (
        <div ref={wrapperRef} style={{ position: 'relative' }}>
            <SupportWindow visible={isVisible} user = {user}/>
            <Avatar 
                onClick={() => setVisible(true)}
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    cursor: 'pointer'
                }}
            />
        </div>
    );
};

export default SupportEngine;
