// add/modify a certification
// post certification id to edit
// load page to create new
// Unlike approvals
// we are using a separate page
// for add/update certifications
// because there are a lot of details.

export async function clientAction({request}) {
    const form_data = await request.formData();
    const request_json = Object.fromEntries(form_data);

    if(request_json.add){
        // logic to add a new certification
        return {action: 'add'};
    }

    if(request_json.load){
        return {action: 'load', certification_id: request_json.certification_id};
    }

    if(request_json.update){
        // logic to update the details
        // of an existing certification.
        return {action: 'add'};
    }
}

export default function CertificationPage({actionData}){
    switch(actionData?.action){
        case 'load':
            return <h1>Edit Certification {actionData.certification_id}</h1>;
        default:
            return <h1>Add Certification</h1>;
    }
}