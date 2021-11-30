<BrowserRouter>
    {results &&
        results.map((index, user) => (
            <div key={index}>
                <Link to={`/user/${user.id}`}>
                    <img className="results" src={user.image_url}></img>
                    <p>
                        {user.first} {user.last}
                    </p>
                </Link>
            </div>
        ))}
</BrowserRouter>;
