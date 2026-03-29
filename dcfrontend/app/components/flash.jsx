import styles from "./styles/flash.module.css";
import { useState, useEffect } from "react";

export default function FlashNotification(){
    const [flashData, setFlashData] = useState(null);
    
    // This useEffect is set to run
    // only on component mount (with empty dependency array).
    // Returns a function
    // to unsubscribe to flash-event
    // on component unmount.
    useEffect(()=>{
        function handleFlashEvent(event){
            setFlashData(event.detail);
        }

        document.addEventListener('flash-event', handleFlashEvent);

        return () => {
            document.removeEventListener('flash-event', handleFlashEvent);
        };
    }, []);

    function dismiss(){
        setFlashData(null);
    }

    return(
        flashData && (
            <div className={styles.flash}>
                {flashData.message}
                <button onClick={dismiss}>Dismiss</button>
            </div>
        )
    );
}