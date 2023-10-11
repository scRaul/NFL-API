class Cache{
    url = 'http://localhost:8080';
    seasonCache = new Map(); //(year,Season)
    matchesCache = new Map(); //(match.id,Match>)
};


const cache = new Cache();

module.exports = cache;