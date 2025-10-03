import React from 'react';
import Header from '../Header/Header.js';
import Footer from '../Footer/Footer.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GuideAvatar from '../GuideAvatar/GuideAvatar.js';

const Layout = ({ children }) => {
    return (
        <div className="App">
            <Header />
            <main className="main-content container">
                {children}
            </main>
            <Footer />
            <GuideAvatar />
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default Layout;
