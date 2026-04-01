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

    return <div className={styles.certificate_card}>
        <p><u><b>{certificate.title}</b></u> <br/> {certificate.issue_date} <br /> certificate no.</p>
        <Link to={certificate_relative_url}>View</Link>
    </div>;
}

export default function CertificatesPage({ loaderData }) {
    const [valid, set_valid] = useState(() => {
        const v = sessionStorage.getItem('valid');
        if(v){
            if(v === 'true') return true;
            else return false;
        } else
            return true;
    });

    // Following useEffect saves the valid state to session storage
    // whenever valid state changes.
    // For good UX, this state should persist between page changes.
    // Want to do this just on component unmount
    // but the logic isn't working (not sure why).

    useEffect(()=>sessionStorage.setItem('valid', valid), [valid]);

    function toggle_valid() {
        set_valid((v) => !v);
    }

    return (<>
        <h1>Certificates</h1>
        <input type='checkbox' name="valid" checked={valid} onChange={toggle_valid} />
        <label for='valid'> Valid certificates only</label>

        <div className={styles.certificate_list}>
            {valid ? <p>Only valid certificates will be shown. Functionality not implemented yet</p> :
                // loaderData.map(certificate => (certificate.valid && <CertificatePreviewCard certificate={certificate} />)) :
                loaderData.map(certificate => <CertificatePreviewCard certificate={certificate} />)
            }
        </div>
    </>);

}