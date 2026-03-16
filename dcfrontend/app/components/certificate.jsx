import styles from "./styles/certificate.module.css";

export default function Certificate({cno, name}){
    return <div className={styles.certificate}>
        <h1>Certificate</h1>
        <p>
            It is certified that <b>{name}</b> is 
            the most innovative engineer.
            Certificate No.: {cno}
        </p>
    </div>;
}