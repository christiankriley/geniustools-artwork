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
        params[tmparr[0]] = decodeURIComponent(tmparr[1]);
    }
    return params;
}

function performSearch() {
    $('#results').html('<h3>Searching...</h3>');

    var query = $('#query').val();
    if (!query.length) return false;

    var entity = ($('#entity').val()) ? $('#entity').val() : 'tvSeason';
    var country = ($('#country').val()) ? $('#country').val() : 'us';

    var itunesURL = 'https://itunes.apple.com/search?term=' + encodeURIComponent(query) + '&country=' + country + '&entity=' + entity;
    
    if (entity === 'shortFilm') {
        itunesURL = 'https://itunes.apple.com/search?term=' + encodeURIComponent(query) + '&country=' + country + '&entity=movie&attribute=shortFilmTerm';
    } else if (entity === 'id' || entity === 'idAlbum') {
        itunesURL = 'https://itunes.apple.com/lookup?id=' + encodeURIComponent(query) + '&country=' + country;
    }
    itunesURL += '&limit=25';

    $.ajax({
        type: "GET",
        url: itunesURL,
        dataType: 'jsonp'
    }).done(function(data) {
        $('#results').html('');
        
        if (!data.results || data.results.length === 0) {
            $('#results').append('<h3>No results found.</h3>');
            return;
        }

        data.results.forEach(function(item) {
            if ((entity === 'id' && item.kind !== 'feature-movie' && item.wrapperType !== 'collection') ||
                (entity === 'idAlbum' && item.collectionType !== 'Album')) {
                return;
            }

            var result = {};
            var width = 600;
            var height = 600;

            result.url = item.artworkUrl100.replace('100x100', '1000x1000');
            
            var hires = item.artworkUrl100.replace('100x100bb', '100000x100000-999');
            var urlObj = new URL(hires);
            result.hires = 'https://is5-ssl.mzstatic.com' + urlObj.pathname;

            if (entity === 'album' || entity === 'idAlbum') {
                var parts = result.hires.split('/image/thumb/');
                if (parts.length === 2) {
                    var thumbParts = parts[1].split('/');
                    thumbParts.pop();
                    result.uncompressed = 'https://a5.mzstatic.com/us/r1000/0/' + thumbParts.join('/');
                }
            }

            switch (entity) {
                case 'musicVideo':
                    result.title = item.trackName + ' (by ' + item.artistName + ')';
                    result.url = result.hires;
                    width = 640; height = 464;
                    break;
                case 'movie': case 'id': case 'shortFilm':
                    result.title = item.trackName || item.collectionName;
                    width = 400;
                    break;
                case 'ebook':
                    result.title = item.trackName + ' (by ' + item.artistName + ')';
                    width = 400;
                    break;
                case 'software': case 'iPadSoftware': case 'macSoftware':
                    result.url = item.artworkUrl512.replace('512x512bb', '1024x1024bb');
                    result.appstore = item.trackViewUrl;
                    result.title = item.trackName;
                    width = 512; height = 512;
                    break;
                default:
                    result.title = item.collectionName || (item.trackName + ' (by ' + item.artistName + ')');
            }

            var html = '<div><h3>' + result.title + '</h3>';
            if (!['software', 'iPadSoftware', 'macSoftware'].includes(entity)) {
                var uncompressedLink = result.uncompressed ? '<a href="' + result.uncompressed + '" target="_blank">Uncompressed High Resolution</a>' : '<a href="' + result.hires + '" target="_blank">Highest Resolution</a>';
                html += '<p><a href="' + result.url + '" target="_blank">Best resolution for Genius</a> | ' + uncompressedLink + '</p>';
            } else {
                html += '<p><a href="./app/?url=' + encodeURIComponent(result.appstore) + '&country=' + country + '" target="_blank">View screenshots / videos</a></p>';
            }
            html += '<a href="' + result.url + '" target="_blank" download="' + result.title + '"><img src="' + result.url + '" width="' + width + '" height="' + height + '"></a></div>';
            
            $('#results').append(html);
        });
    });
}

$(document).ready(function() {
    var sortable = Object.keys(countries).map(key => [key, countries[key]]).sort((a, b) => b[1].localeCompare(a[1]));
    sortable.forEach(array => $('#country').append('<option value="' + array[0] + '">' + array[1] + '</option>'));

    var params = getSearchParameters();
    if (params.entity) $('#entity').val(params.entity);
    if (params.query) $('#query').val(params.query);
    if (params.country) $('#country').val(params.country);
    if (params.entity && params.query && params.country) performSearch();

    $('#iTunesSearch').submit(function() { performSearch(); return false; });
});
