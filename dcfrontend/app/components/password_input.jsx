import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./styles/password_input.module.css";

export default function PasswordInput({name}){
    const [showPassword, setShowPassword] = useState(false);

    function toggle_visibility(){
        setShowPassword((last_state)=>!last_state);
    }

    return <div className={styles.password_div}>
        <input className={styles.password_box} type={showPassword?"text":"password"} name={name} required/>
        <button className={styles.visibility_button} type='button' onClick={toggle_visibility}>
            {showPassword?<Eye size={16} />:<EyeOff size={16}/>}
        </button>
    </div>;
}