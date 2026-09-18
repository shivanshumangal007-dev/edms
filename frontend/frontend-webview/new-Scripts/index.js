// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// CONSTANTS  (import these instead of re-declaring in other files)
// ─────────────────────────────────────────────
const ROOT_FOLDER = "data-new-2";
const ALLEID_DATA_FOLDER = "allEIDs";
const EIDs_FOLDER = "EIDs";
// const REQUESTS_FOLDER = "requests";
// const RESPONSES_FOLDER = "responses";
// File name patterns — change these to rename all request/response files at once
const REQUEST_FILE_SUFFIX = "request"; // e.g. E0001-BG-request1.json
const RESPONSE_FILE_SUFFIX = "response"; // e.g. E0001-BG-response1.json
export const ENDPOINT_PER_PAGE = 500;
export const DEFAULT_CATEGORY = "ALL";
// ─────────────────────────────────────────────
// CACHE
// ─────────────────────────────────────────────
const endpointDetailsCache = new Map();
// ─────────────────────────────────────────────
// ENDPOINT INDEX FETCH
// ─────────────────────────────────────────────
export const LoadEndpointsIndex = async () => {
    const path = `./${ROOT_FOLDER}/${ALLEID_DATA_FOLDER}/EndpointIndex.json`;
    const endpointsIndex = await fetch(path).then((r) => r.json());
    return endpointsIndex;
};
// ─────────────────────────────────────────────
// ENDPOINT DETAIL FETCH
// ─────────────────────────────────────────────
export const FetchEndpointDetail = async (eid) => {
    if (endpointDetailsCache.has(eid))
        return endpointDetailsCache.get(eid);
    try {
        const path = `./${ROOT_FOLDER}/${EIDs_FOLDER}/${eid}/${eid}.json`;
        const res = await fetch(path);
        const data = await res.json();
        endpointDetailsCache.set(eid, data);
        return data;
    }
    catch (err) {
        console.error("failed to load", eid, err);
        return null;
    }
};
export const FetchEndpointsByIndex = async (indexArray) => {
    const details = [];
    const CONCURRENCY_LIMIT = 100;
    for (let i = 0; i < indexArray.length; i += CONCURRENCY_LIMIT) {
        const batch = indexArray.slice(i, i + CONCURRENCY_LIMIT);
        const batchResults = await Promise.all(batch.map((it) => FetchEndpointDetail(it.eid)));
        const validResults = batchResults.filter((item) => item !== null);
        details.push(...validResults);
    }
    return details;
};
// ─────────────────────────────────────────────
// META DATA FETCH
// ─────────────────────────────────────────────
export const LoadMetaData = async () => {
    try {
        const path = `./${ROOT_FOLDER}/${ALLEID_DATA_FOLDER}/meta-data.json`;
        const data = await fetch(path).then((res) => res.json());
        return data;
    }
    catch (error) {
        console.error("failed to load meta data", error);
        return null;
    }
};
// ─────────────────────────────────────────────
// REQUEST / RESPONSE PANEL FETCH
// ─────────────────────────────────────────────
export const LoadRequestPanelData = async (eid, rqIndex) => {
    const path = `./${ROOT_FOLDER}/${EIDs_FOLDER}/${eid}/${REQUEST_FILE_SUFFIX}-${rqIndex + 1}.json`;
    try {
        return await fetch(path).then((res) => res.json());
    }
    catch (error) {
        console.error(`Failed to load request data: ${path}`, error);
        return null;
    }
};
export const LoadResponsePanelData = async (eid, rqIndex) => {
    const path = `./${ROOT_FOLDER}/${EIDs_FOLDER}/${eid}/${RESPONSE_FILE_SUFFIX}-${rqIndex + 1}.json`;
    try {
        return await fetch(path).then((res) => res.json());
    }
    catch (error) {
        console.error(`Failed to load response data: ${path}`, error);
        return null;
    }
};
// ─────────────────────────────────────────────
// SIDEBAR DATA FETCH
// ─────────────────────────────────────────────
export const LoadSegments = async () => {
    const path = `./${ROOT_FOLDER}/${ALLEID_DATA_FOLDER}/EndpointSegments_EID.json`;
    return await fetch(path).then((res) => res.json());
};
export const LoadAllTags = async () => {
    const path = `./${ROOT_FOLDER}/${ALLEID_DATA_FOLDER}/Tags_EID.json`;
    return await fetch(path).then((res) => res.json());
};
