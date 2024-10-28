/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

export const Navigation = (className: { className?: string }): ReactNode => {
    const navigate = useNavigate()

    return (
        <div
            style={{
                position: 'fixed',
                zIndex: 1000,
                left: 10
            }}
            className={`d-flex ${className} rounded-circle shadow-lg`}
        >
            <button
                style={{ borderRadius: '50% 0px 0px 50%', marginRight: '2px' }}
                className="btn shadow btn-primary btn-sm"
                onClick={(): void => navigate(-1)}
            >
                <i className="bi bi-chevron-left"></i>
            </button>
            <button
                style={{ borderRadius: '0px 50% 50% 0px' }}
                className="btn shadow btn-success btn-sm"
                onClick={(): void => navigate(-1)}
            >
                <i className="bi bi-chevron-right"></i>
            </button>
        </div>
    )
}
