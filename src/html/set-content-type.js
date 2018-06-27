module.exports = ({ response }) => {
    // somebody already set a content type, keep as is
    if (response && response.headers && response.headers["Content-Type"]) {
        return;
    } else {
        return {
            response: {
                headers: {
                    "Content-Type": "text/html"
                }
            }
        };
    }
};
