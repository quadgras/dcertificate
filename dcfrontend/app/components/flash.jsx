import styles from "./styles/flash.module.css";
import { useState, useEffect } from "react";
import { CircleAlert, CircleCheck, CircleX, Info } from "lucide-react";

export default function FlashNotification(){
    const [flashData, setFlashData] = useState(null);

    const [show, setShow] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    
    // This useEffect is set to run
    // only on component mount (with empty dependency array).
    // Returns a function
    // to unsubscribe to flash-event
    // on component unmount.
    
    useEffect(()=>{
        function handleFlashEvent(event){
            setFlashData(event.detail);
            setShow(true);

            // following sets the flash to disappear
            // after a certain amount of time.

            // setTimeout(()=>setShow(false), 5000);
        }

        document.addEventListener('flash-event', handleFlashEvent);

        return () => {
            document.removeEventListener('flash-event', handleFlashEvent);
        };
    }, []);

    function dismiss(){
        // setFlashData(null);
        setShow(false);
    }

    function handleAnimationEnd(){
        if(!show){
            setShouldRender(false);
            setFlashData(null);
        }
    }

    useEffect(()=>{
        if(show)
            setShouldRender(true);
    }, [show]);

    return(
        shouldRender && (
            <div className={`${styles.flash} ${show?styles.slideIn:styles.slideOut}`} onAnimationEnd={handleAnimationEnd}>
                {flashData.map(notification => {
                    switch(notification.type){
                        case 'success': 
                            return <p className={styles.message}><CircleCheck /> {notification.message}</p>;
                        case 'error': 
                            return <p className={styles.message}><CircleX /> {notification.message}</p>;
                        case 'info': 
                            return <p className={styles.message}><Info /> {notification.message}</p>;
                        case 'warning': 
                            return <p className={styles.message}><CircleAlert /> {notification.message}</p>;
                    }
                })}
                <button onClick={dismiss}>Dismiss</button>
            </div>
        )
    );
}