import { Form, redirect } from 'react-router';
import { useState } from 'react';
import styles from './styles/commons.module.css';
import Certificate from '../../components/certificate';
import { backend_request } from '../../lib/backend';

export async function clientLoader({ params }) {
    // IDs start from 1
    // Use 0 for add page.
    if(params.id !== '0'){
        const response_json = backend_request(
            `issuer/certification-details/${params.id}`,{
                method: "GET",
                credentials: "include"
            }
        );

        return response_json;
    }
    else
        return {data: {id: 0, validity_limit: null}};
}

export async function clientAction({ request }) {
    const form_data = await request.formData();
    const request_form = Object.fromEntries(form_data);
    const request_json = JSON.stringify(request_form);

    // if (request_form.add) {
    //     // logic to add a new certification
    //     return { action: 'add' };
    // }

    // if (request_form.update) {
    //     // logic to update the details
    //     // of an existing certification.
    //     return { action: 'add' };
    // }

    const response_json = await backend_request(
        'issuer/certification',{
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: request_json,
            credentials: 'include'
        }
    );

    if(response_json.success)
        return redirect('/issuer/certifications');


}

export default function CertificationPage({ loaderData }) {
    const certification_id = Number(loaderData.data.id);
    const [preview_data, set_preview_data] = useState({
        title: loaderData.data.title,
        pre_subject: loaderData.data.pre_subject,
        post_subject: loaderData.data.post_subject,
        recipient_username: 'username',
        recipient_display_name: 'Abhijeet',
        issuer_display_name: localStorage.getItem('issuer_display_name'),
        other_approvers: ['Approver 1', 'Approver 2'],
        revoke_message: null,
        valid: true,
        certificate_id: 'xxxxxxxxxxxxxx-x-x',
        issue_time: 'yyyymmdd HH:MM:SS'
    });

    function update_preview(e) {
        const { name, value } = e.target;
        set_preview_data((prev) => ({ ...prev, [name]: value }));
    }

    return <>
        <h1>{(certification_id === 0)?'New Certification':'Edit Certification'}</h1>
        <Form method='post' className={styles.simple_form}>
            {(certification_id !== 0) &&
            <>  <label for='certification_id'>Certification ID</label>
                <input name='certification_id' type='text' value={certification_id} readonly={true}/>
            </>}
            <label for='title'>Title</label>
            <input name='title' type='text' required='true' onChange={update_preview} value={preview_data.title}/>
            <label for='pre_subject'>Text before recipient's name</label>
            <input name='pre_subject' type='text' onChange={update_preview} value={preview_data.pre_subject}/>
            <label for='post_subject'>Text after recepient's name</label>
            <input name='post_subject' type='text' onChange={update_preview} value={preview_data.post_subject}/>
            <label for='validity_limit'>Validity (No. of days or 0 for infinite)</label>
            <input name='validity_limit' type='number' required='true' defaultValue={loaderData.data.validity_limit || 0} />
            <input type='submit' value={(certification_id === 0)?'Launch':'Update'} />
        </Form>
        <h1>Preview</h1>
        <Certificate data={preview_data} />
    </>;
}