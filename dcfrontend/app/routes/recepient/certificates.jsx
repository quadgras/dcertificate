import Certificate from "../../components/certificate.jsx";
import { useState } from "react";
import { backend_url } from "../../config.js";

export async function clientLoader({}) {

    const res = await fetch(`${backend_url}/recepient/certificates-list`,
        {method:"GET",credentials:'include'}
    );

    const responseJson = await res.json();

    return {
        certificates: responseJson.data
    };
    
}

function CertificatePreviewCard({title, cno, display_name, setCertificateData}){
    const name = display_name;
    
    function viewCertificate(){
        setCertificateData(name);
    }

    return <div style={{margin:"10px", border:"1px solid black", padding:"10px",
        display:"flex", "justify-content": "space-between"
    }}>
        <p>{cno} <br/> <b>{title}</b></p>
        <button onClick={viewCertificate}>View</button>
    </div>;
}

export default function CertificatesPage({loaderData}){
    const [certificateData, setCertificateData] = useState("");

    function close() {
        setCertificateData("");
    }

    if(certificateData === ""){
        return (<>
            <h1>Certificates</h1>
            {loaderData.certificates.map(
                certificate => <CertificatePreviewCard title={certificate.title} cno={certificate.cno} display_name={certificate.display_name} setCertificateData={setCertificateData}/>
            )}
        </>);
    }
    else{
        return (<>
            <Certificate name={certificateData} cno="20260320-5-1"/>
            <button onClick={close}>Close</button>
        </>);
    }
}