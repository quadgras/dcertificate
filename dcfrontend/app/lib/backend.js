import { flash } from "./flash";

export const backend_url = import.meta.env.VITE_BACKEND_URL;

export async function backend_request(route, params) {

    const route_url = `${backend_url}/${route}`;

    try {

        const response = await fetch(route_url, params);
        const handled_responses = [200, 201, 400, 401, 403, 404];

        if (handled_responses.includes(response.status)) {

            // json response is expected
            // on handled HTTP status codes.
            const response_json = await response.json();

            // logging any available debug message to browser console
            if (response_json.debug)
                console.log(`HTTP Status ${response.status} while fetching ${route_url}. Debug message: ${response_json.debug}`);

            // collecting any available notifications for user
            let flash_notifications = [];

            // adding any available info messages (info array of messages)
            if (response_json.info)
                flash_notifications = response_json.info.map(message => ({ type: 'info', message: message }));

            // adding any available message (message string)
            if (response_json.message) {
                if (response_json.success)
                    flash_notifications = [{ type: 'success', message: response_json.message }, ...flash_notifications];
                else
                    flash_notifications = [{ type: 'error', message: response_json.message }, ...flash_notifications];
            } else {

                // Adding a failure message
                // in case success is false
                // but there is no message.
                // User must know if request failed.

                if (!response_json.success)
                    flash_notifications = [{ type: 'error', message: 'Some error occured while processing the request.' }, ...flash_notifications];
            }

            // flashing if any notifications found
            if (flash_notifications.length > 0)
                await flash(flash_notifications);

            return response_json;


        } else {

            // we don't expect a json in responses 
            // having unhandled response codes.

            console.log(`HTTP Status (${response.status}) while trying to fetch ${route_url}`);
            await flash([{ type: "error", message: "Some error occured while processing the request." }]);
            return { success: false };

        }

    } catch (error) {
        console.log(`Error while trying to fetch ${route_url}.\n${error}`);
        await flash([{ type: 'error', message: 'Probable causes - no internet connection, server unavailable & application errors.' }]);
        return { success: false };
    }

}