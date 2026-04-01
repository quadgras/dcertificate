import { Link } from "react-router";
import { backend_request } from "../../lib/backend.js";

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
    const certificate_path = `/certificate/${certificate.title}`;

    return <div style={{
        margin: "10px", border: "1px solid black", padding: "10px",
        display: "flex", "justify-content": "space-between"
    }}>
        <p>{certificate.issue_date} <br /> <b>{certificate.title}</b></p>
        <Link to={certificate_path}>View</Link>
    </div>;
}

export default function CertificatesPage({ loaderData }) {

    return (<>
        <h1>Certificates</h1>
        {loaderData.map(certificate => <CertificatePreviewCard certificate={certificate} />)}
    </>);

}