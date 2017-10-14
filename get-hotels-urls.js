var _ = require('underscore'),
    scrapy = require('node-scrapy'),
    cheerio = require('cheerio'),
    axios = require('axios'),
    mysql = require('mysql'),
    async = require('async'),
    domain = 'https://www.tripadvisor.ru';

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "trip_hotels"
});

var regions =  [
    //{ url: 'https://www.tripadvisor.ru/Hotels-g294197-Seoul-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g297884-Busan-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g297885-Jeju_Jeju_Island-Hotels.html' },
        { url: 'Токио https://www.tripadvisor.ru/Hotels-g298184-Tokyo_Tokyo_Prefecture_Kanto-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g298564-Kyoto_Kyoto_Prefecture_Kinki-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g298566-Osaka_Osaka_Prefecture_Kinki-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g298182-Nikko_Tochigi_Prefecture_Kanto-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g298561-Hiroshima_Hiroshima_Prefecture_Chugoku-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g298207-Fukuoka_Fukuoka_Prefecture_Kyushu_Okinawa-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g298198-Nara_Nara_Prefecture_Kinki-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g298173-Yokohama_Kanagawa_Prefecture_Kanto-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g303156-Kamakura_Kanagawa_Prefecture_Kanto-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g294009-Doha-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g294003-Kuwait_City-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g295424-Dubai_Emirate_of_Dubai-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g298064-Sharjah_Emirate_of_Sharjah-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g298063-Ras_Al_Khaimah_Emirate_of_Ras_Al_Khaimah-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g2630222-Emirate_of_Fujairah-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g294007-Muscat_Governorate-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g293937-Brunei_Darussalam-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g293924-Hanoi-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g293925-Ho_Chi_Minh_City-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g298085-Da_Nang_Quang_Nam_Province-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g293926-Hue_Thua_Thien_Hue_Province-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g293928-Nha_Trang_Khanh_Hoa_Province-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g303946-Vung_Tau_Ba_Ria_Vung_Tau_Province-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g303942-Can_Tho_Mekong_Delta-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g311304-Sapa_Lao_Cai_Province-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g737052-Lao_Cai_Lao_Cai_Province-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g293923-Halong_Bay_Quang_Ninh_Province-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g659924-Dong_Hoi_Quang_Binh_Province-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g293922-Da_Lat_Lam_Dong_Province-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g298207-Fukuoka_Fukuoka_Prefecture_Kyushu_Okinawa-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g1024768-Con_Dao_Islands_Ba_Ria_Vung_Tau_Province-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g1633422-Dak_Lak_Province-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g294229-Jakarta_Java-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g297697-Kuta_Bali-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g297696-Jimbaran_Bali-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g297698-Nusa_Dua_Nusa_Dua_Peninsula_Bali-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g1599559-Lovina_Beach_Bali-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g297700-Sanur_Denpasar_Bali-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g1465999-Tanjung_Benoa_Nusa_Dua_Peninsula_Bali-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g469404-Seminyak_Bali-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g608487-Legian_Bali-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g297701-Ubud_Bali-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g293940-Phnom_Penh-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g297390-Siem_Reap_Siem_Reap_Province-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g3698381-Sihanoukville_Province-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g608455-Kampot_Kampot_Province-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g608456-Kep_Kep_Province-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g293950-Vientiane_Vientiane_Prefecture-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g424933-Luang_Namtha_Luang_Namtha_Province-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g670161-Pakse_Champasak_Province-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g298570-Kuala_Lumpur_Wilayah_Persekutuan-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g303991-Port_Dickson_Negeri_Sembilan-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g298320-Kuala_Terengganu_Terengganu-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g298283-Langkawi_Langkawi_District_Kedah-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g298307-Kota_Kinabalu_Kota_Kinabalu_District_West_Coast_Division_Sabah-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g298278-Johor_Bahru_Johor_Bahru_District_Johor-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g304006-Pulau_Redang_Terengganu-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g660784-Genting_Highlands_Pahang-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g298302-Penang-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g298281-Kedah-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g298309-Kuching_Sarawak-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g1761622-Pulau_Gaya_Kota_Kinabalu_District_West_Coast_Division_Sabah-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g1777471-Kuala_Selangor_Selangor-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g298305-Putrajaya_Wilayah_Persekutuan-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g304006-Pulau_Redang_Terengganu-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g303993-Pulau_Tioman_Rompin_District_Pahang-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g298300-Pangkor_Pulau_Pangkor_Manjung_District_Perak-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g1137936-Pulau_Mabul_Semporna_District_Sabah-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g303996-Pulau_Sipadan_Semporna_District_Sabah-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g294191-Yangon_Rangoon_Yangon_Region-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g295408-Mandalay_Mandalay_Region-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g317112-Bagan_Mandalay_Region-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g1195668-Ngwe_Saung_Ayeyarwady_Region-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g294265-Singapore-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g294264-Sentosa_Island-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g293916-Bangkok-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g293919-Pattaya_Chonburi_Province-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g293920-Phuket-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g2280929-Ko_Chang_Tai_Ko_Chang_Trat_Province-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g297922-Hua_Hin_Prachuap_Khiri_Khan_Province-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g293918-Ko_Samui_Surat_Thani_Province-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g303907-Ko_Pha_Ngan_Surat_Thani_Province-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g297927-Krabi_Town_Krabi_Province-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g297914-Khao_Lak_Phang_Nga_Province-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g298573-Manila_Metro_Manila_Luzon-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g294260-Boracay_Malay_Aklan_Province_Panay_Island_Visayas-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g294255-Palawan_Island_Palawan_Province_Mimaropa-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g294252-Mindanao-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g294259-Bohol_Island_Bohol_Province_Visayas-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g294261-Cebu_Island_Visayas-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g321541-Paro_Paro_District-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g297602-National_Capital_Territory_of_Delhi-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g297683-Agra_Agra_District_Uttar_Pradesh-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g304555-Jaipur_Jaipur_District_Rajasthan-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g297667-Jaisalmer_Jaisalmer_District_Rajasthan-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g297672-Udaipur_Udaipur_District_Rajasthan-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g304554-Mumbai_Bombay_Maharashtra-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g297604-Goa-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g297633-Kochi_Cochin_Kerala-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g297637-Thiruvananthapuram_Trivandrum_Thiruvananthapuram_District_Kerala-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g297685-Varanasi_Varanasi_District_Uttar_Pradesh-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g616028-Haridwar_Haridwar_District_Uttarakhand-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g580106-Rishikesh_Dehradun_District_Uttarakhand-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g293999-Tehran_Tehran_Province-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g316021-Shiraz_Fars_Province-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g680023-Kashan_Isfahan_Province-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g293890-Kathmandu_Kathmandu_Valley_Bagmati_Zone_Central_Region-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g1927709-Chitwan_District_Narayani_Zone_Central_Region-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g293891-Pokhara_Gandaki_Zone_Western_Region-Hotels.html' },
        { url: 'https://www.tripadvisor.ru/Hotels-g293953-Maldives-Hotels.html' }
    ],
    index = 0;

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

function getNextPage (regionUrl) {
    var pagesUrl = [],
        surl = regionUrl,
        model = {
            selector: '.prw_common_standard_pagination a.nav.next',
            get: 'href'
        };

    scrapy.scrape(surl, model, function(err, data) {
        if (err) return console.error(err);
        if (data) {
            var nextUrl = domain + data;
            getHotelsUrlFromPage(nextUrl);
            getNextPage (nextUrl);
        } else {
            index++;
            if (index <= regions.length-1) {
                getHotelsUrlFromPage(regions[index].url);
                getNextPage (regions[index].url);
            }
        }
    });
}

function getHotelsUrlFromPage(pageUrl) {
    axios.get(pageUrl)
        .then(function (response) {
            var $ = cheerio.load(response.data),
                $list = $('.ppr_priv_hsx_hotel_list .prw_rup a.property_title');
                console.log('----------');
                console.log(pageUrl);
                console.log('----------');

            async.each($list, function(item, callback) {
                var link = domain + item.attribs.href,
                    sql = "INSERT INTO urls (url) VALUES ('" + link + "')";

                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log(link);
                });

            }, function(err) {
                // if any of the file processing produced an error, err would equal that error
                if( err ) {
                    // One of the iterations produced an error.
                    // All processing will now stop.
                    console.log('A file failed to process');
                } else {
                    console.log('All files have been processed successfully');
                }
            });

        })
        .catch(function (error) {
            console.log(error);
        });
}

getHotelsUrlFromPage(regions[index].url);
getNextPage (regions[index].url);