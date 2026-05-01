import { backend_request } from "../../lib/backend";
import { redirect, Form, useActionData, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import styles from "./styles/commons.module.css";

export async function clientLoader({params}){
    const certification_id = params.id;

    const response_json = await backend_request(
        `issuer/approval/certification/${certification_id}`,
        {
            method: 'GET',
            credentials: 'include'
        }
    );

    return response_json.success?response_json:redirect('/issuer/certifications');
}

export async function clientAction({request}){
    const form_data = await request.formData();
    const request_form = Object.fromEntries(form_data);
    const request_json = JSON.stringify(request_form);

    if(request_form.fetch){
        // request to fetch reciever details recieved
        const response_json = await backend_request(
            `issuer/recipient-details/${request_form.recipient_id}`,
            {method:"GET", credentials:"include"}
        );

        response_json.action = "fetch";
        return response_json;
    }

    if(request_form.issue){
        // request to issue certificate recieved
        const response_json = await backend_request(
            'issuer/issue-certificate', {
                method: 'POST',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body: request_json
            }
        );

        response_json.action = 'issue';
        return response_json;
    }
}

export default function Certificates({loaderData}){
    const navigate = useNavigate();
    const certification_id = loaderData.data.id;
    const certification_title = loaderData.data.title;
    const action_data = useActionData();
    const [recipient, setRecipient] = useState(null);
    
    useEffect(()=>{
        if(action_data?.success){
            if(action_data?.action === 'fetch'){
                setRecipient(action_data.data);
            } else {
                setRecipient(null);
            }
        }
    }, [action_data]);
    
    return <>
        <h1>Issue Certificate</h1>
        {(function () {
            if(recipient !== null)
                return <>
                <Form method="POST" className={styles.simple_form}>
                    <p><b>Preview</b></p>
                    <label for="certification_id">Certification ID</label>
                    <input type="text" name="certification_id" value={certification_id} readonly/>
                    <label for="certification_title">Certification Title</label>
                    <input type="text" name="certification_title" value={certification_title} readonly/>
                    <label for="recipient_id">Recipient ID</label>
                    <input type="text" name="recipient_id" value={recipient.id} readonly />
                    <label for="recipient_username">Recipient's Username</label>
                    <input type="text" name="recipient_username" value={recipient.username} readonly />
                    <input type="submit" name="issue" value="Issue Certificate" />
                </Form>
                <button onClick={() => navigate(-1)}>Back</button>
                </>;
            else
                return <Form method="POST" className={styles.simple_form}>
                    <label for="reciever_id">Recipient ID</label>
                    <input type="number" name="recipient_id" required />
                    <input type="submit" name="fetch" value="Fetch Details" />
                </Form>;
        })()}
    </>;
}