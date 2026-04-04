import styles from "./styles/certificate.module.css";
import certified from "../assets/certified.png";

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
        <section>
        <h1>{data.title}</h1>
        <p>
            {data.pre_subject} 
            <b> {data.recipient_display_name} ({data.recipient_username}) </b>
            {data.post_subject}
        </p>
        <p>
            <b>Certificate ID</b> {data.certificate_id} <br/>
            <b>Issued at</b> {data.issue_time} UTC
        </p>
        <img src={certified} height="100px" width="100px"/>
        <p>
            This certificate is issued and authentic 
            on <a href={import.meta.env.VITE_FRONTEND_URL}>Dcertificate Website</a>.
        </p>
        </section>
        <section className={styles.meta_section}>
            <p>- Issued by -</p>
            <h2>{data.issuer_display_name}</h2>
            {(data.other_approvers.length !== 0) &&
            <>
                <p>- Approved by -</p>
                <div className={styles.approvers}>
                    {data.other_approvers.map((approver)=>(<span>{approver}</span>))}
                </div>
                </>
            }
        </section>
    </div>;
}