import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [search, findUsers] = useState("");

    const [results, setResults] = useState([]);

    console.log("results############", results);

    useEffect(() => {
        let abort;
        (async () => {
            if (!search) {
                const res = await fetch("/users/last");
                const data = await res.json();
                console.log("data*******************", data);
                if (!abort) {
                    setResults(data.lastThree.rows);
                }
            } else {
                const res = await fetch(`/users/${search}`);
                const data = await res.json();
                console.log("data&&&&&&&&&&&&&&&&&&", data);
                if (!abort) {
                    setResults(data.searchedUserInfo.rows);
                }
            }
        })();
        return () => {
            console.log("about to update the three recent peoples");
            abort = true;
        };
    }, [search]);

    return (
        <div>
            <input type="text" onChange={(e) => findUsers(e.target.value)} />
            {results &&
                results.map((result) => (
                    <div key={result.id}>
                        <Link to={`/user/${result.id}`}>
                            <img
                                className="results"
                                src={result.image_url}
                            ></img>
                            <p>
                                {result.first} {result.last}
                            </p>
                        </Link>
                    </div>
                ))}
        </div>
    );
}
