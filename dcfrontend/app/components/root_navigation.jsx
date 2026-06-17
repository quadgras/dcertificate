import { useState, useEffect } from "react";
import styles from "./styles/root_navigation.module.css";
import { NavLink } from "react-router";
import { Menu, X } from "lucide-react";

export default function RootNavigation() {
    const [open, set_open] = useState(false);
    /* shouldRender is added to facilitate exit animation */
    const [shouldRender, setShouldRender] = useState(false);

    function toggle() {
        set_open((last_state) => !last_state);
    }

    function handleAnimationEnd() {
        if(!open)
            setShouldRender(false);
    }

    useEffect(()=>{
        if(open)
            setShouldRender(true);
    },[open]);

    return <>
        <button className={styles.toggle} onClick={toggle}>
            {open ? <X /> : <Menu />}
        </button>
        {shouldRender &&
            <div className={`${styles.nav_container} ${open?styles.slideIn:styles.slideOut}`} onAnimationEnd={handleAnimationEnd}>
                <nav className={styles.root_navigation}>
                    {/* <h1>Menu</h1>
                    <hr style={{width:'300px'}} /> */}
                    <h2>Recipient</h2>
                    <NavLink className={({ isActive }) => isActive ? styles.active_navlink : styles.navlink} to='/recipient/login'>Login</NavLink>
                    <NavLink className={({ isActive }) => isActive ? styles.active_navlink : styles.navlink} to='/recipient/register'>Register</NavLink>

                    <h2>Issuer</h2>
                    <NavLink className={({ isActive }) => isActive ? styles.active_navlink : styles.navlink} to='/issuer/login'>Login</NavLink>
                    <NavLink className={({ isActive }) => isActive ? styles.active_navlink : styles.navlink} to='/issuer/register'>Register</NavLink>

                    <h2>Other Options</h2>
                    <NavLink className={({ isActive }) => isActive ? styles.active_navlink : styles.navlink} to='/'>Home</NavLink>
                    <NavLink className={({ isActive }) => isActive ? styles.active_navlink : styles.navlink} to='/search-certificate'>Search</NavLink>
                    <NavLink className={({ isActive }) => isActive ? styles.active_navlink : styles.navlink} to='/user-manual'>User Manual</NavLink>
                </nav>
            </div>
        }
    </>;
}