import React, { useEffect, useRef, useState } from 'react';
import './sidebar.css'

export default function Sidebar() {
    console.log("extension love and money");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setSidebarOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    let customerId = ShopifyAnalytics.meta.page.customerId;
    console.log("customerId =======", customerId);

    // const fetchData = async () => {
    //     const fetchCustomer = await fetch("https://codem-teststore.myshopify.com/apps/loveandmoney/api/getuserdata/$customerid")
    // }

    return (
        <div className="App">
            <div>
                <div onClick={toggleSidebar}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#EB3223" className="bi bi-chat-dots-fill openSidebarButton" viewBox="0 0 16 16">
                        <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                    </svg>
                </div>

            </div>

            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
                <div onClick={toggleSidebar}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg closeSidebarButton" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                    </svg>
                </div>
                <div className='padding'>
                    <h2 className='headTitle'>Your messages</h2>
                    <p className='headParagraph'>Updates, offers, and news personalized for you.</p>
                </div>

            </div>
        </div>
    );
}

