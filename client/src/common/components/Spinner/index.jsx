import React from 'react'
import styles from "./style.module.css"

const Spinner = ({ isLoading, message }) => {
    return (
        (isLoading &&
            <div className={`${styles.loading} bg-dark text-light`}>
                <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h6 className="mt-3 text-light">loading...</h6>
                {message && <small className="text-light">{message}</small>}
            </div>
        )
    );
};

Spinner.defaultProps = {
    isLoading: false
}

export default Spinner;