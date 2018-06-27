const client = require("request-promise");

module.exports = function({
    REPO_RAW_ROOT = "https://raw.githubusercontent.com/"
}) {
    return function({
        request,
        resource,
        context,
        request: {
            params: { owner, repo, ref, path }
        }
    } = {}) {
        //console.log(request);

        const options = {
            uri: `${REPO_RAW_ROOT}${owner}/${repo}/${ref}/${path}`,
            headers: {
                "User-Agent": "Request-Promise"
            },
            json: false
        };

        return client(options)
            .then(resp => { return { resource: { body: resp } };})
            .catch(err => { return {error: err}});
    };
};
