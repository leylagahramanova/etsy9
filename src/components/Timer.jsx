import React, { useEffect, useRef, useState } from "react";

const Timer = () => {
    const [timeLeft, setTimeLeft] = useState("");  // Qalan vaxtı saxlayan state
    useEffect(() => {
        const dealDuration = 30 * 60 * 60 * 1000; // 30 saatlıq endirim müddəti (millisaniyə ilə)
        const endTime = Date.now() + dealDuration; // İndiki zamana 30 saat əlavə edilir
    // Qalan vaxtı hesablayan və state-i yeniləyən funksiya
        const updateCountdown = () => {
            const now = Date.now(); // Hazırkı zaman
            const diff = endTime - now; // Qalan vaxt (millisaniyə ilə)

            if (diff <= 0) {
                setTimeLeft("00:00:00");  // Vaxt bitibsə, sıfır göstər
                return;
            }

            const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
            const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
            const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, "0");

            setTimeLeft(`${hours}:${minutes}:${seconds}`);
        };

        updateCountdown();// Komponent yüklənən kimi bir dəfə işlədilir
        const interval = setInterval(updateCountdown, 1000); // Hər saniyədə bir yenilənir

        return () => clearInterval(interval);  // Komponent unmount olduqda interval təmizlənir
    }, []);
    return (

        <div>
            {timeLeft}
        </div>
    )
}

export default Timer
