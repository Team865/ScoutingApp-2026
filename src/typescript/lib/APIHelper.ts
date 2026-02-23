
export async function genericGetRequest(apiEndpoint: string, headers?: {[key: string]: any}) {
    const response = await fetch(apiEndpoint, {
        headers: headers
    });
    
    return await response.json();
}

export async function genericPostRequest(apiEndpoint: string, data: {}) {
    const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(data)
    });

    return await response.json();
}