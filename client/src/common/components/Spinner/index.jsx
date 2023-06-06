import React from 'react'
import styles from "./style.module.css"

const Spinner = ({ isLoading, message }) => {
    return (
        (isLoading &&
            <div className={`${styles.loading} bg-light`}>
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h6 className="mt-3 text-danger">loading...</h6>
                {message && <small>{message}</small>}
            </div>
        )
    );
};

Spinner.defaultProps = {
    isLoading: false
}

export default Spinner;