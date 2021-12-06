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
            <div className="m-4 flex flex-col inline-flex">
                <h1 className="text-4xl">Find users</h1>
                <input
                    className="mt-4 mb-4 border-2 border-yellow-300 rounded"
                    type="text"
                    onChange={(e) => findUsers(e.target.value)}
                />
                {results &&
                    results.map((result) => (
                        <div
                            key={result.id}
                            className="border-4 border-white m-4"
                        >
                            <Link to={`/user/${result.id}`}>
                                <img
                                    className="results rounded-full h-48 w-48 mt-4 mb-4 ml-2 mr-2 ring ring-gray-400 ring-offset-4 ring-offset-blue-100"
                                    src={result.image_url}
                                ></img>
                                <hr className="border-yellow-300" />
                                <p className="mt-2 mb-2 text-center">
                                    {result.first} {result.last}
                                </p>
                            </Link>
                        </div>
                    ))}
            </div>
        </div>
    );
}
