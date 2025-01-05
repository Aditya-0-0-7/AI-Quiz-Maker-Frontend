// General API call function
const apiCall = async (endpoint, method = 'POST', body = {}, notFile = true) => {
    try {
        const response = await fetch(endpoint, {
            method: method,
            mode: "cors",
            headers: {
                // Only set Content-Type if the body is not FormData
                ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' })
            },
            body: body instanceof FormData ? body : JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData?.detail || `Error: ${response.status}`;
            return {isError:true, msg:errorMessage}
        }

        if(notFile)
        {
            const data = await response.json();
            return {isError:false, msg:data};
        }
        else
        {
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = "Quiz File";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return {isError:false};
        }
    } 
    catch (error) 
    {
        throw error;
    }
};

export default apiCall;
