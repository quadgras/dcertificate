import { Form, redirect, useNavigate } from 'react-router';
import { backend_request } from '../../lib/backend';
import Certificate from '../../components/certificate';
import styles from './styles/commons.module.css';

export async function clientLoader({ request }) {

    const url = new URL(request.url);
    const certificate_id = url.searchParams.get('certificate_id');
    if (certificate_id !== null) {
        const response_json = await backend_request(
            `certificate/details/${certificate_id}`, {
            method: 'GET',
            credentials: 'include'
        }
        );
        return response_json;
    }

}

export async function clientAction({ request }) {

    const form_data = await request.formData();
    const request_form = Object.fromEntries(form_data);
    const request_json = JSON.stringify(request_form);

    const response_json = await backend_request(
        'issuer/revoke-certificate', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: request_json
    }
    );

    console.log(response_json);

    if (response_json.success)
        return redirect('/issuer/revoke');

}

export default function RevokePage({ loaderData }) {
    const navigate = useNavigate();

    return <>
        <h1>Revoke Certificate</h1>
        {(loaderData?.success) ?
            <>
                <Certificate data={loaderData.data} />

                {(loaderData.data.valid) ?
                    <Form method='POST' className={styles.simple_form}>
                        <label for='certificate_id'>Certificate ID</label>
                        <input type='text' name='certificate_id' value={loaderData.data.certificate_id} readOnly={true} />
                        <label for='revoke_message'>Revoke Message</label>
                        <input type='text' name='revoke_message' required />
                        <input type='submit' value='Revoke' />
                    </Form> :
                    <p>Certificate is already revoked or expired.</p>
                }
                <button onClick={() => navigate('/issuer/revoke')}>Back</button>
            </> :
            <Form method='GET' className={styles.simple_form}>
                <label for='certificate_id'>Enter Certificate ID</label>
                <input type='text' name='certificate_id' placeholder='Example 20260501000001-1-1' required />
                <input type='submit' value='Fetch Details' />
            </Form>
        }
    </>
}