const ENABLE_APPLE_MUSIC = false;

var countries = {
    ae: 'United Arab Emirates',
    ag: 'Antigua and Barbuda',
    ai: 'Anguilla',
    al: 'Albania',
    am: 'Armenia',
    ao: 'Angola',
    ar: 'Argentina',
    at: 'Austria',
    au: 'Australia',
    az: 'Azerbaijan',
    bb: 'Barbados',
    be: 'Belgium',
    bf: 'Burkina-Faso',
    bg: 'Bulgaria',
    bh: 'Bahrain',
    bj: 'Benin',
    bm: 'Bermuda',
    bn: 'Brunei Darussalam',
    bo: 'Bolivia',
    br: 'Brazil',
    bs: 'Bahamas',
    bt: 'Bhutan',
    bw: 'Botswana',
    by: 'Belarus',
    bz: 'Belize',
    ca: 'Canada',
    cg: 'Democratic Republic of the Congo',
    ch: 'Switzerland',
    cl: 'Chile',
    cn: 'China',
    co: 'Colombia',
    cr: 'Costa Rica',
    cv: 'Cape Verde',
    cy: 'Cyprus',
    cz: 'Czech Republic',
    de: 'Germany',
    dk: 'Denmark',
    dm: 'Dominica',
    do: 'Dominican Republic',
    dz: 'Algeria',
    ec: 'Ecuador',
    ee: 'Estonia',
    eg: 'Egypt',
    es: 'Spain',
    fi: 'Finland',
    fj: 'Fiji',
    fm: 'Federated States of Micronesia',
    fr: 'France',
    gb: 'United Kingdom',
    gd: 'Grenada',
    gh: 'Ghana',
    gm: 'Gambia',
    gr: 'Greece',
    gt: 'Guatemala',
    gw: 'Guinea Bissau',
    gy: 'Guyana',
    hk: 'Hong Kong',
    hn: 'Honduras',
    hr: 'Croatia',
    hu: 'Hungary',
    id: 'Indonesia',
    ie: 'Ireland',
    il: 'Israel',
    in: 'India',
    is: 'Iceland',
    it: 'Italy',
    jm: 'Jamaica',
    jo: 'Jordan',
    jp: 'Japan',
    ke: 'Kenya',
    kg: 'Krygyzstan',
    kh: 'Cambodia',
    kn: 'Saint Kitts and Nevis',
    kr: 'South Korea',
    kw: 'Kuwait',
    ky: 'Cayman Islands',
    kz: 'Kazakhstan',
    la: 'Laos',
    lb: 'Lebanon',
    lc: 'Saint Lucia',
    lk: 'Sri Lanka',
    lr: 'Liberia',
    lt: 'Lithuania',
    lu: 'Luxembourg',
    lv: 'Latvia',
    md: 'Moldova',
    mg: 'Madagascar',
    mk: 'Macedonia',
    ml: 'Mali',
    mn: 'Mongolia',
    mo: 'Macau',
    mr: 'Mauritania',
    ms: 'Montserrat',
    mt: 'Malta',
    mu: 'Mauritius',
    mw: 'Malawi',
    mx: 'Mexico',
    my: 'Malaysia',
    mz: 'Mozambique',
    na: 'Namibia',
    ne: 'Niger',
    ng: 'Nigeria',
    ni: 'Nicaragua',
    nl: 'Netherlands',
    np: 'Nepal',
    no: 'Norway',
    nz: 'New Zealand',
    om: 'Oman',
    pa: 'Panama',
    pe: 'Peru',
    pg: 'Papua New Guinea',
    ph: 'Philippines',
    pk: 'Pakistan',
    pl: 'Poland',
    pt: 'Portugal',
    pw: 'Palau',
    py: 'Paraguay',
    qa: 'Qatar',
    ro: 'Romania',
    ru: 'Russia',
    sa: 'Saudi Arabia',
    sb: 'Soloman Islands',
    sc: 'Seychelles',
    se: 'Sweden',
    sg: 'Singapore',
    si: 'Slovenia',
    sk: 'Slovakia',
    sl: 'Sierra Leone',
    sn: 'Senegal',
    sr: 'Suriname',
    st: 'Sao Tome e Principe',
    sv: 'El Salvador',
    sz: 'Swaziland',
    tc: 'Turks and Caicos Islands',
    td: 'Chad',
    th: 'Thailand',
    tj: 'Tajikistan',
    tm: 'Turkmenistan',
    tn: 'Tunisia',
    tr: 'Turkey',
    tt: 'Republic of Trinidad and Tobago',
    tw: 'Taiwan',
    tz: 'Tanzania',
    ua: 'Ukraine',
    ug: 'Uganda',
    us: 'United States of America',
    uy: 'Uruguay',
    uz: 'Uzbekistan',
    vc: 'Saint Vincent and the Grenadines',
    ve: 'Venezuela',
    vg: 'British Virgin Islands',
    vn: 'Vietnam',
    ye: 'Yemen',
    za: 'South Africa',
    zw: 'Zimbabwe'
}

const resultsMap = new Map();

function fetchJSONP(url) {
    return new Promise((resolve, reject) => {
        const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
        window[callbackName] = (data) => {
            delete window[callbackName];
            document.body.removeChild(script);
            resolve(data);
        };

        const script = document.createElement('script');
        script.src = `${url}${url.includes('?') ? '&' : '?'}cb=${Date.now()}&callback=${callbackName}`;
        script.onerror = () => {
            delete window[callbackName];
            document.body.removeChild(script);
            reject(new Error('JSONP request failed.'));
        };
        document.body.appendChild(script);
    });
}

async function performSearch() {
    const queryInput = document.getElementById('query');
    const entityInput = document.getElementById('entity');
    const countryInput = document.getElementById('country');
    const resultsContainer = document.getElementById('results');

    let query = queryInput.value.trim();
    if (!query.length) return false;

    const entity = entityInput.value || 'album';
    
    if (entity === 'idAlbum') {
        query = query.replace(/\D/g, '');
        if (!query.length) {
            resultsContainer.innerHTML = '<h3 style="color: #e74c3c;">Please enter a valid numeric Apple ID.</h3>';
            return false;
        }
        queryInput.value = query;
    }

    const country = countryInput.value || 'us';

    resultsContainer.innerHTML = '<h3>Searching...</h3>';
    resultsMap.clear();

    const searchTasks = [fetchItunes(query, country, entity)];
    if (ENABLE_APPLE_MUSIC) searchTasks.push(fetchAppleMusic(query, country, entity));

    await Promise.allSettled(searchTasks);

    resultsContainer.innerHTML = '';
    if (resultsMap.size === 0) {
        resultsContainer.innerHTML = '<h3>No results found</h3>';
    } else {
        resultsMap.forEach(item => renderResultCard(item.title, item.url1k, item.url10k));
    }
}

async function fetchAppleMusic(query, country, entity) {
    try {
        const url = new URL('/am-search', window.location.origin);
        url.searchParams.append('term', query);
        url.searchParams.append('country', country);
        url.searchParams.append('entity', entity);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        const typeKey = data.results?.albums ? 'albums' : data.results?.songs ? 'songs' : null;
        
        if (typeKey) {
            data.results[typeKey].data.forEach(item => {
                const id = String(item.id);
                if (!resultsMap.has(id)) {
                    resultsMap.set(id, {
                        title: `${item.attributes.name} (by ${item.attributes.artistName})`,
                        url1k: item.attributes.artwork.url.replace('{w}', '1000').replace('{h}', '1000').replace(/\.jpg$/, '.png'),
                        url10k: item.attributes.artwork.url.replace('{w}', '10000').replace('{h}', '10000').replace(/\.jpg$/, '.png')
                    });
                }
            });
        }
    } catch (error) {
        console.error("Apple Music fetch error: ", error);
    }
}

async function fetchItunes(query, country, entity) {
    const itunesURL = (entity === 'idAlbum') 
        ? `https://itunes.apple.com/lookup?id=${encodeURIComponent(query)}&country=${country}&limit=25`
        : `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&country=${country}&entity=${entity}&limit=25`;

    try {
        const data = await fetchJSONP(itunesURL);
        
        if (data?.results) {
            data.results.forEach(item => {
                const id = item.collectionId || item.trackId;
                
                if (id && item.artworkUrl100 && !resultsMap.has(String(id))) {
                    const basePath = item.artworkUrl100.replace(/\/[^\/]+$/, '');
                    resultsMap.set(String(id), {
                        title: `${item.trackName || item.collectionName} (by ${item.artistName})`,
                        url1k: `${basePath}/1000x1000bb.png`,
                        url10k: `${basePath}/10000x10000bb.png`
                    });
                }
            });
        }
    } catch (error) {
        console.error("iTunes JSONP fetch error: ", error);
    }
}

function renderResultCard(title, url1k, url10k) {
    const wrapper = document.createElement('div');
    
    const h3 = document.createElement('h3');
    h3.textContent = title;
    wrapper.appendChild(h3);

    wrapper.insertAdjacentHTML('beforeend', `
        <p><a href="${url1k}" target="_blank">Best resolution for Genius</a> | <a href="${url10k}" target="_blank">Highest resolution</a></p>
        <a href="${url1k}" target="_blank" download>
            <img src="${url1k}" width="600" height="600" alt="">
        </a>
    `);
    
    document.getElementById('results').appendChild(wrapper);
}

function initScript() {
    const countrySelect = document.getElementById('country');
    const entitySelect = document.getElementById('entity');
    const queryInput = document.getElementById('query');
    const form = document.getElementById('iTunesSearch');

    Object.entries(countries)
        .sort((a, b) => a[1].localeCompare(b[1]))
        .forEach(([code, name]) => {
            countrySelect.insertAdjacentHTML('beforeend', `<option value="${code}">${name}</option>`);
        });

    const params = new URLSearchParams(window.location.search);
    if (params.has('entity') && entitySelect) entitySelect.value = params.get('entity');
    if (params.has('query') && queryInput) queryInput.value = params.get('query');

    let savedCountry = params.get('country') || localStorage.getItem('lastCountry') || 'us';
    countrySelect.value = savedCountry;
    if (params.has('country')) localStorage.setItem('lastCountry', savedCountry);

    countrySelect.addEventListener('change', (e) => {
        localStorage.setItem('lastCountry', e.target.value);
    });

    if (params.has('entity') && params.has('query') && params.has('country')) {
        performSearch();
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const currentUrl = new URL(window.location);
            currentUrl.searchParams.set('entity', entitySelect.value);
            currentUrl.searchParams.set('query', queryInput.value);
            currentUrl.searchParams.set('country', countrySelect.value);
            window.history.pushState({}, '', currentUrl);

            performSearch();
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScript);
} else {
    initScript();
}