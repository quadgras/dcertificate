// view and add your approvals

import { backend_request } from "../../lib/backend";
import { Form, useActionData } from "react-router";
import styles from "./styles/commons.module.css";
import {useEffect, useState} from "react";

export async function clientLoader({ params }) {
    const response_json = await backend_request(
        'issuer/approval/list', {
        method: 'GET',
        credentials: 'include'
    }
    );

    if (response_json.success)
        return response_json
}

export async function clientAction({ request }) {
    const form_data = await request.formData();
    const form_object = Object.fromEntries(form_data);
    const request_json = JSON.stringify(form_object);

    if(form_object.delete){
        // delete approval form submitted
        const response_json = await backend_request(
            'issuer/approval/delete',{
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: request_json,
                credentials: 'include'
            }
        );
    }

    if(form_object.fetch){
        // fetch certification form submitted
        const response_json = await backend_request(
            `issuer/approval/certification/${form_object.certification_id}`, {
                method: 'GET',
                credentials: 'include'
            }
        );

        if(response_json.success)
            response_json.action = 'fetch';
            return response_json;
    }

    if(form_object.approve){
        // approve certification form submitted
        const response_json = await backend_request(
            'issuer/approval/add', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: request_json,
                credentials: 'include'
            }
        );

        if(response_json.success){
            response_json.action = 'approve';
            return response_json;
        }
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

export default function Approvals({ loaderData }) {
    const [certification, setCertification] = useState(null);
    const action_data = useActionData();

    useEffect(()=>{
        if(action_data?.action === 'fetch')
            setCertification(action_data.data);
        else if (action_data?.action === 'approve')
            setCertification(null);
    }, [action_data]);

    return <>
        <h1>Approvals</h1>
        <div className={styles.card_list}>
            {(loaderData?.data.length === 0)?
            <p>No Approvals</p>:
            loaderData.data.map((approval) => <ApprovalCard approval={approval} />)
            }
        </div>
        <div>
            <h1>Add Approval</h1>
            {(certification === null)?
                <Form method="POST" className={styles.simple_form}>
                    <label for="certification_id">Enter Certification ID</label>
                    <input name="certification_id" type="text" required="true"/>
                    <input name="fetch" type="submit" value="Fetch Details" />
                </Form>:
                <>
                    <p><b>{certification.title}</b> by {certification.issuer_display_name}</p>
                    <Form method='POST'>
                        <input name='certification_id' type='hidden' value={certification.id}/>
                        <input name='approve' type="submit" value="Approve"/>
                    </Form>
                    <button onClick={()=>setCertification(null)}>Cancel</button>
                </>
            }
        </div>
    </>;
}