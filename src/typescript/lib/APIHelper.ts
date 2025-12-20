
export async function genericGetRequest(apiEndpoint: string) {
    const response = await fetch(apiEndpoint);
    if (!response.ok) {
        throw new Error(`GET request for ${apiEndpoint} failed with status code: ${response.status}`);
    }
    return await response.json();
}

export async function genericPostRequest(apiEndpoint: string, data: string) {
    const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: data
    });

    if(!response.ok) {
        throw new Error(`POST request for ${apiEndpoint} failed with status code: ${response.status}`);
    }

    return await response.json();
}