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

function getSearchParameters() {
    var prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
    var params = {};
    var prmarr = prmstr.split("&");
    for ( var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        if (tmparr[0]) {
            params[tmparr[0]] = decodeURIComponent(tmparr[1] || "");
        }
    }
    return params;
}

let resultsMap = new Map();

async function performSearch() {
    var query = $('#query').val().trim();
    if (!query.length) return false;

    var entity = ($('#entity').val()) ? $('#entity').val() : 'album';
    
    if (entity === 'idAlbum') {
        query = query.replace(/\D/g, '');
        if (!query.length) {
            $('#results').html('<h3 style="color: #e74c3c;">Please enter a valid numeric Apple ID.</h3>');
            return false;
        }
        $('#query').val(query);
    }

    var country = ($('#country').val()) ? $('#country').val() : 'us';

    $('#results').html('<h3>Searching...</h3>');
    resultsMap.clear();

    const searchTasks = [fetchItunes(query, country, entity)];
    if (ENABLE_APPLE_MUSIC) {
        searchTasks.push(fetchAppleMusic(query, country, entity));
    }

    await Promise.allSettled(searchTasks);

    $('#results').html('');
    if (resultsMap.size === 0) {
        $('#results').html('<h3>No results found</h3>');
    } else {
        resultsMap.forEach(item => {
            renderResultCard(item.title, item.url1k, item.url10k);
        });
    }
}

function fetchAppleMusic(query, country, entity) {
    return $.ajax({
        url: '/am-search',
        data: { term: query, country: country, entity: entity },
        dataType: 'json',
        timeout: 10000
    }).done(function(data) {
        var typeKey = (data.results && data.results.albums) ? 'albums' : 
                      (data.results && data.results.songs) ? 'songs' : null;
        
        if (typeKey) {
            data.results[typeKey].data.forEach(function(item) {
                const id = String(item.id);
                if (!resultsMap.has(id)) {
                    var attrs = item.attributes;
                    resultsMap.set(id, {
                        title: attrs.name + ' (by ' + attrs.artistName + ')',
                        url1k: attrs.artwork.url.replace('{w}', '1000').replace('{h}', '1000'),
                        url10k: attrs.artwork.url.replace('{w}', '10000').replace('{h}', '10000')
                    });
                }
            });
        }
    });
}

function fetchItunes(query, country, entity) {
    var itunesURL = (entity === 'idAlbum') 
        ? 'https://itunes.apple.com/lookup?id=' + encodeURIComponent(query) + '&country=' + country
        : 'https://itunes.apple.com/search?term=' + encodeURIComponent(query) + '&country=' + country + '&entity=' + entity;
    
    itunesURL += '&limit=25';

    return $.ajax({
        type: "GET",
        url: itunesURL,
        dataType: 'jsonp',
        timeout: 10000 
    }).done(function(data) {
        if (data.results) {
            data.results.forEach(function(item) {
                const id = String(item.collectionId || item.trackId);
                
                if (id && !resultsMap.has(id)) {
                    var itemName = item.trackName ? item.trackName : item.collectionName;
                    var basePath = item.artworkUrl100.replace(/\/[^\/]+$/, '');
                    
                    resultsMap.set(id, {
                        title: itemName + ' (by ' + item.artistName + ')',
                        url1k: basePath + '/1000x1000bb.png',
                        url10k: basePath + '/10000x10000bb.png'
                    });
                }
            });
        }
    });
}

function renderResultCard(title, url1k, url10k) {
    var html = '<div><h3>' + title + '</h3>';
    html += '<p><a href="' + url1k + '" target="_blank">Best resolution for Genius</a> | ';
    html += '<a href="' + url10k + '" target="_blank">Highest resolution</a></p>';
    html += '<a href="' + url1k + '" target="_blank" download="' + title + '"><img src="' + url1k + '" width="600" height="600"></a></div>';
    
    $('#results').append(html);
}

$(document).ready(function() {
    var sortable = Object.keys(countries).map(key => [key, countries[key]]).sort((a, b) => a[1].localeCompare(b[1]));
    sortable.forEach(array => $('#country').append('<option value="' + array[0] + '">' + array[1] + '</option>'));

    var params = getSearchParameters();
    if (params.entity) $('#entity').val(params.entity);
    if (params.query) $('#query').val(params.query);

    if (params.country) {
        $('#country').val(params.country);
        localStorage.setItem('lastCountry', params.country);
    } else {
        var savedCountry = localStorage.getItem('lastCountry');
        if (savedCountry) {
            $('#country').val(savedCountry);
        } else {
            $('#country').val('us');
        }
    }

    $('#country').change(function() {
        localStorage.setItem('lastCountry', $(this).val());
    });

    if (params.entity && params.query && params.country) performSearch();

    $('#iTunesSearch').submit(function() { 
        performSearch(); 
        return false; 
    });
});