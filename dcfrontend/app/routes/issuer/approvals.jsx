// view and add your approvals

import { backend_request } from "../../lib/backend";
import { Form } from "react-router";
import styles from "./styles/commons.module.css";
import {useState} from "react";

export async function clientLoader({ params }) {
    const response_json = await backend_request(
        '/issuer/approvals-list', {
        method: 'GET',
        credentials: 'include'
    }
    );

    if (response_json.success)
        return response_json
    else
        return { data: [] };
}

export async function clientAction({ request }) {
    const form_data = await request.formData();
    const form_object = Object.fromEntries(form_data);
    const request_json = JSON.stringify(form_object);

    if(form_object.delete){
        // delete form submitted
        //console.log(`Delete request raised with certification_id ${form_object.certification_id} `);
        const response_json = await backend_request(
            'issuer/delete-approval',{
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: request_json,
                credentials: 'include'
            }
        );
    }

}

function ApprovalCard({ approval }) {
    return <div className={styles.card}>
        <p>
            <b>{approval.certification_title}</b> <br />
            by {approval.issuer_display_name}
        </p>
        <Form method="POST">
            <input type="hidden" name="certification_id" value={approval.certification_id} />
            <input type="submit" name="delete" value="Delete" />
        </Form>
    </div>;
}

export default function Approvals({ loaderData, actionData }) {
    const [certification, setCertification] = useState(null);

    return <>
        <h1>Approvals</h1>
        <div className={styles.card_list}>
            {loaderData.data.map((approval) => <ApprovalCard approval={approval} />)}
        </div>
        <div>
            <h1>Add New</h1>
            {(certification === null)?
                <p>Fetch UI</p>:
                <p>Add UI</p>
            }
        </div>
    </>;
}