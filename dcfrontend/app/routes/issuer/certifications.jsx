import {backend_request} from "../../lib/backend";
import {Link} from "react-router";
import styles from "./styles/commons.module.css";

export async function clientLoader({params}){
    const response_json = await backend_request(
        "/issuer/certifications-list", {
            method: "GET",
            credentials: "include"
        }
    );

    if(response_json.success)
        return response_json;
    else
        return {success: false, data: []};
}

function CertificationCard({certification}){
    return <div className={styles.card}>
        ID: {certification.id} <br/>
        Title: {certification.title} <br/>
        <Link to={`/issuer/certification/${certification.id}`}>Edit</Link> <br/>
        <Link to={`/issuer/issue/${certification.id}`}>Issue</Link>
    </div>;
}

export default function Certifications({loaderData}){
    return (<>
        <h1>Certifications</h1>
        <div className={styles.card_list}>
            {loaderData.data.map((certification) => <CertificationCard certification={certification} />)}
        </div>
        <Link to="/issuer/certification/0">Launch New Certification</Link>
    </>);
}