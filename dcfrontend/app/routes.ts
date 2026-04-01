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
    ...prefix("recipient", [
        route("login", "routes/recipient/login.jsx"),
        route("register", "routes/recipient/register.jsx"),
        layout("routes/recipient/dashboard.jsx", [
            route("account", "routes/recipient/account.jsx"),
            route("certificates", "routes/recipient/certificates.jsx"),
            // route("certificate/:certificate_no", "routes/certificate.jsx")
        ])
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
