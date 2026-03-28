export const readFileAsBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result !== "string") {
                reject(new Error("The uploaded file could not be read."));
                return;
            }

            const base64Content = reader.result.includes(",")
                ? reader.result.split(",")[1]
                : reader.result;
            resolve(base64Content);
        };

        reader.onerror = () => {
            reject(new Error("The uploaded file could not be read."));
        };

        reader.readAsDataURL(file);
    });
