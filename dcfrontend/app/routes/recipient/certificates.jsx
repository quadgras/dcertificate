import { Link } from "react-router";
import { backend_request } from "../../lib/backend.js";
import { useEffect, useState } from "react";
import styles from "./styles/certificates.module.css";

export async function clientLoader() {

    const response_json = await backend_request('/recipient/certificates-list', {
        method: 'GET',
        credentials: 'include'
    });

    if (response_json.success)
        return response_json.data;
    else
        return [];

}

function CertificatePreviewCard({ certificate }) {
    const certificate_relative_url = `/certificate/${certificate.title}`;

    return <div className={certificate.valid?
        styles.certificate_card : `${styles.certificate_card} ${styles.invalid_certificate_card}`
    }>
        <p>
            <u><b>{certificate.title}</b></u><br/>
            by {certificate.issuer_display_name} <br />
            Issue Time: {certificate.issue_time} UTC<br />
            Certificate ID: {certificate.certificate_id} 
        </p>
        <Link to={certificate_relative_url}>View</Link>
    </div>;
}

export default function CertificatesPage({ loaderData }) {
    const [valid, set_valid] = useState(() => {

        // if present in session storage
        // load from session storage
        // otherwise set to true

        const v = sessionStorage.getItem('valid');
        if (v) {
            if (v === 'true') return true;
            else return false;
        } else
            return true;

    });

    // Following useEffect saves the valid state to session storage
    // whenever valid state changes.
    // For good UX, this state should persist between page changes.
    // Want to do this just on component unmount
    // but the simple logic isn't working
    // because the unmount function only captures
    // initial value of 'valid' when its not on dependency array.
    // So, the intial value of valid (no updates) is saved on unmount.
    // A resource suggested using useRef
    // where you update the ref value with useEffect
    // and finally use the ref value on unmount.
    // We can go that route when
    // the operation is much expensive than updating ref value
    // like storing over the network.
    // Storing in session storage is not so expensive.

    useEffect(() => sessionStorage.setItem('valid', valid), [valid]);

    function toggle_valid() {
        set_valid((v) => !v);
    }

    return (<>
        <h1>Certificates</h1>
        <input type='checkbox' name="valid" checked={valid} onChange={toggle_valid} />
        <label for='valid'> Valid certificates only</label>

        <div className={styles.certificate_list}>
            {valid ? //<p>Only valid certificates will be shown. Functionality not implemented yet</p> :
                loaderData.map(certificate => (certificate.valid && <CertificatePreviewCard certificate={certificate} />)) :
                loaderData.map(certificate => <CertificatePreviewCard certificate={certificate} />)
            }
        </div>
    </>);

}