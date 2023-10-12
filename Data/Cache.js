class Cache{
    url = 'http://localhost:8080';
    seasonCache = new Map(); //(year,Season)
    seasonMatchesCache = new Map(); //(query, [matches])
    clients = new Set();
    prevLiveMatches = undefined; // there would only ever be 1 set of live set
};


const cache = new Cache();

module.exports = cache;