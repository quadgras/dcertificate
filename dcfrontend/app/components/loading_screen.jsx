import styles from "./styles/loading_screen.module.css";

export default function LoadingScreen(){
    return <div className={styles.loading_screen}>
        <div className={styles.loader}></div>
    </div>;
}