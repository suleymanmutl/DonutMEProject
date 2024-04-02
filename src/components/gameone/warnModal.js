import React from 'react';
import styles from './Modal.module.css';


const Modal = ({ show, onClose, children }) => {
    if (!show) {
        return null;
    }

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modal}>
                {children}
            </div>
        </div>
    );
};

export default Modal;
