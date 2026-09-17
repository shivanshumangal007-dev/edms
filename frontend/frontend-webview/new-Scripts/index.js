// FilePaths
const ROOT_FOLDER = "data-new-2";
const INDEX_FILE_NAME = "EndpointIndex.json";
const ALLEID_DATA_FOLDER = "allEIDs";
const EIDs_FOLDER = "EIDs";
const ENDPOINT_PER_PAGE = 500;
const DEFAULT_CATEGORY = "ALL";
const META_DATA_FILE = "meta-data.json";
// endpoint details cache
const endpointDetailsCache = new Map();
// fetching endpoints Index
export const LoadendpointsIndex = async () => {
    const path = `./${ROOT_FOLDER}/${ALLEID_DATA_FOLDER}/${INDEX_FILE_NAME}`;
    const endpointsIndex = await fetch(path).then((r) => r.json());
    return endpointsIndex;
};
const FetchEndpointDetail = async (eid) => {
    if (endpointDetailsCache.has(eid))
        return endpointDetailsCache.get(eid);
    try {
        const path = `./${ROOT_FOLDER}/${EIDs_FOLDER}/${eid}.json`;
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
    // indexArray is array of objects like {eid: 'E0001-BG'}
    const details = [];
    const CONCURRENCY_LIMIT = 100;
    for (let i = 0; i < indexArray.length; i += CONCURRENCY_LIMIT) {
        // Slice the array into a batch of 100 items
        const batch = indexArray.slice(i, i + CONCURRENCY_LIMIT);
        // Run 100 promises concurrently and wait for them to finish
        const batchResults = await Promise.all(batch.map((it) => FetchEndpointDetail(it.eid)));
        const validResults = batchResults.filter((item) => item !== null);
        details.push(...validResults);
    }
    return details;
};
export const LoadMetaData = async () => {
    try {
        const path = `./${ROOT_FOLDER}/${ALLEID_DATA_FOLDER}/${META_DATA_FILE}`;
        const data = await fetch(path).then((res) => res.json());
        return data;
    }
    catch (error) {
        console.error("failed to load meta data", error);
        return null;
    }
};
