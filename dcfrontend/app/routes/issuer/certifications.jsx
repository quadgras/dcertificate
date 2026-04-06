import {backend_request} from "../../lib/backend";
import {Link, Form} from "react-router";
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
        <Form method="POST" action="/issuer/certification">
            <input type="hidden" name="certification_id" value={certification.id}/>
            <input type="submit" name="load" value="Edit" />
        </Form>
    </div>;
}

export default function Certifications({loaderData}){
    return (<>
        <h1>Certifications</h1>
        <div className={styles.card_list}>
            {loaderData.data.map((certification) => <CertificationCard certification={certification} />)}
        </div>
        <Link to="/issuer/certification">Launch New Certification</Link>
    </>);
}