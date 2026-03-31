import 
{ 
    type RouteConfig, 
    index, 
    prefix, 
    route, 
    layout 

} from "@react-router/dev/routes";

export default [
    index("routes/home.jsx"),
    route("search-certificate", "routes/search.jsx"),
    route("certificate/:certificate_no", "routes/certificate.jsx"),
    // route("user-manual", "")
    ...prefix("recepient", [
        route("login", "routes/recepient/login.jsx"),
        route("register", "routes/recepient/register.jsx"),
        layout("routes/recepient/dashboard.jsx", [
            route("account", "routes/recepient/account.jsx"),
            route("certificates", "routes/recepient/certificates.jsx"),
            // route("certificate/:certificate_no", "routes/certificate.jsx")
        ])
        // route("account","routes/recepient/account_layout.jsx", [
        //     index("routes/recepient/account.jsx"),
        //     route("certificates", "routes/recepient/certificates.jsx")
        // ])
    ]),
    // ...prefix("issuer", [
    //     route("login", ""),
    //     route("register", ""),
    //     layout("", [
    //         route("account", ""),
    //         route("certifications", ""),
    //         route("certificates", ""),
    //         route("approvals", "")
    //     ])
    // ])
] satisfies RouteConfig;
