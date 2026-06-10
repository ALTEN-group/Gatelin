export function cloneReq(req, token) {
    const clonedReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`,
        },
    });
    return clonedReq;
}
//# sourceMappingURL=clone-req.js.map