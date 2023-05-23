import BootstrapModal from 'react-bootstrap/Modal';
import Spinner from '../Spinner';
import styles from "./style.module.css"

const Modal = ({ isShown, isLoading, header, body, footer, handleClose, dependency=[] }) => {
    return (
        <BootstrapModal 
            key={dependency}
            show={isShown} onHide={handleClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <div className={styles.modal}>
                {header && 
                    <BootstrapModal.Header closeButton>
                        {header}
                    </BootstrapModal.Header>
                }
                {body &&
                    <BootstrapModal.Body>
                        {body}
                    </BootstrapModal.Body>
                }
                {footer &&
                    <BootstrapModal.Footer>
                        {footer}
                    </BootstrapModal.Footer>
                }
                <Spinner isLoading={isLoading} />
            </div>
        </BootstrapModal>
    );
};

Modal.defaultProps = {
    isShown: true,
    isLoading: false,
    header: (<></>),
    body: (<></>),
    handleClose: () => {}
}

export default Modal;