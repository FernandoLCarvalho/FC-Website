"use client";
import styles from '../../styles/loadingScreen.module.css';
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
    const [visible, setVisible] = useState(true);
    const [isBlue, setIsBlue] = useState(false);
    const [fadePortfolio, setFadePortfolio] = useState(false);
    const [fadeFernando, setFadeFernando] = useState(false);
    const [fadeScreen, setFadeScreen] = useState(false);

    useEffect(() => {
        const timer1 = setTimeout(() => setIsBlue(true), 500); // Changes the "Portfolio" to blue after 0.5s
        const timer2 = setTimeout(() => setFadePortfolio(true), 1500); // "Portfolio" starts to fade after 1.5s
        const timer3 = setTimeout(() => setFadeFernando(true), 2500); // "Fernando Carvalho" starts to fade after 2.5s
        const timer4 = setTimeout(() => setFadeScreen(true), 3500); // Screen starts to fade after 3.5s
        const timer5 = setTimeout(() => setVisible(false),4500); // Screen totally gone after 4.5s    

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
            clearTimeout(timer5);
        };
    }, []);

    if (!visible) return null;

    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black text-white z-50 gap-4 transition-opacity duration-1000 ${fadeScreen ? 'opacity-0' : 'opacity-100'}`}>
            <h1
                className={`text-2xl transition-opacity duration-1000 ${fadeFernando ? 'opacity-0' : 'opacity-100'}`}
                style={{ fontFamily: 'Roboto Mono' }}
            >
                Fernando Carvalho
            </h1>
            <div className="flex items-center gap-3 h-16">
                <h1
                    className={`text-2xl duration-1000 transition-colors transition-opacity ${isBlue ? 'text-blue-300' : 'text-white'} ${fadePortfolio ? 'opacity-0' : 'opacity-100'}`}
                >
                    Portfolio
                </h1>
                {/* Jumping Ball */}
                <div className={`w-4 h-4 rounded-full bg-blue-300 ${styles.customBounce}`}></div>
            </div>
        </div>
    );
}
