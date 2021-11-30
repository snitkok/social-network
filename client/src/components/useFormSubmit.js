import { useState } from "react";

export default function useFormSubmit(url, userInput) {
    const [error, setError] = useState(false);
    return (
        <div>
            submit()
            {
                //add prevent default
                fetch(url, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(userInput),
                })
                    .then((resp) => resp.json())
                    .then((data) => {
                        if (data.success) {
                            location.replace("/");
                        } else {
                            this.setState({
                                error: true,
                            });
                        }
                    })
            }
        </div>
    );
}
