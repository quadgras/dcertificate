export async function clientLoader({}) {


    return {
        certificates: [{"id":1, "title":"Certificate1"},{"id":2,"title":"Certificate2"}]
    };
    
}

export default function CertificatesPage({loaderData}){
    return <>
        <h1>Certificates {JSON.stringify(loaderData.certificates)}</h1>
    </>
}