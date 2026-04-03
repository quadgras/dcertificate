import styles from "./styles/certificate.module.css";

function InvalidOverlay({data}){
    if(!data.valid){
        return <div className={styles.invalid_overlay}>{
            data.revoke_message === null?
                "This certificate has expired.":
                `This certificate is revoked by issuer. Reason: ${data.revoke_message}`
            }
        </div>;
    }
}

export default function Certificate({data}){
    return <div className={styles.certificate}>
        <InvalidOverlay data={data} />
        <h1>Certificate</h1>
        <p>
            {data.pre_subject} 
            <b> {data.recipient_display_name} </b>
            {data.post_subject}
            Certificate No.: {data.certificate_id}
        </p>
    </div>;
}