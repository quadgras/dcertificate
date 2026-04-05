import RootNavigation from "../components/root_navigation.jsx";
import {Form, redirect} from "react-router";

export async function clientAction({request}) {
    const form_data = await request.formData();
    const certificate_id = Object.fromEntries(form_data).certificate_id;
    return redirect(`/certificate/${certificate_id}`);
}

export default function SearchPage(){
    return <>
        <h1>Search & Verify Certificates</h1>
        <Form method='POST'>
            <label for="certificate_id">Certificate ID</label>
            <input type="text" name="certificate_id" />
            <button type="submit">Search Certificate</button>
        </Form>
        <RootNavigation />
    </>;
}