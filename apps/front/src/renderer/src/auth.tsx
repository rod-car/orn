import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import { Login, Register, Auth } from './pages'

const router = createHashRouter([
    {
        path: '/',
        element: <Auth />,
        errorElement: <Auth error={true} />,
        children: [
            {
                path: '',
                element: <Login />
            },
            {
                path: 'register',
                element: <Register />
            }
        ]
    }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)
