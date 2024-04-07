import ReactDOM from 'react-dom/client';
import { BrowserRouter, RouterProvider, createBrowserRouter } from 'react-router-dom';
import React from 'react';
import Root from './routes/root';
import ErrorPage from './routes/error-page';
import Login from './routes/login';
import Register from './routes/register';
import "./globals.css";


const router = createBrowserRouter([
    {
    path: '/',
        element: <Root/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: '/login',
                element: <Login/>,
            },
            {
                path: '/register',
                element: <Register/>,
            },
        ]

    }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)