import React, { createContext, useState, useContext, useEffect } from "react";
import { Token } from "src/types";

export const CURRENCIES = {
  "us-dollar-usd": { code: "USD", symbol: "$", name: "US Dollar", flag: "USA" },
  "euro-eur": { code: "EUR", symbol: "€", name: "Euro", flag: "EU" },
  "british-pound-gbp": {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    flag: "GB",
  },
  "nigerian-naira-ngn": {
    code: "NGN",
    symbol: "₦",
    name: "Nigerian Naira",
    flag: "NG",
  },
  "japanese-yen-jpy": {
    code: "JPY",
    symbol: "¥",
    name: "Japanese Yen",
    flag: "JP",
  },
  "australian-dollar-aud": {
    code: "AUD",
    symbol: "A$",
    name: "Australian Dollar",
    flag: "AU",
  },
  "canadian-dollar-cad": {
    code: "CAD",
    symbol: "C$",
    name: "Canadian Dollar",
    flag: "CA",
  },
  "swiss-franc-chf": {
    code: "CHF",
    symbol: "Fr",
    name: "Swiss Franc",
    flag: "CH",
  },
  "chinese-yuan-cny": {
    code: "CNY",
    symbol: "¥",
    name: "Chinese Yuan",
    flag: "CN",
  },
  "indian-rupee-inr": {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
    flag: "IN",
  },
  "uae-dirham-aed": {
    code: "AED",
    symbol: "د.إ",
    name: "UAE Dirham",
    flag: "AE",
  },
  "afghan-afghani-afn": {
    code: "AFN",
    symbol: "؋",
    name: "Afghan Afghani",
    flag: "AF",
  },
  "albanian-lek-all": {
    code: "ALL",
    symbol: "L",
    name: "Albanian Lek",
    flag: "AL",
  },
  "armenian-dram-amd": {
    code: "AMD",
    symbol: "֏",
    name: "Armenian Dram",
    flag: "AM",
  },
  "netherlands-antillean-guilder-ang": {
    code: "ANG",
    symbol: "ƒ",
    name: "Netherlands Antillean Guilder",
    flag: "CW",
  },
  "angolan-kwanza-aoa": {
    code: "AOA",
    symbol: "Kz",
    name: "Angolan Kwanza",
    flag: "AO",
  },
  "argentine-peso-ars": {
    code: "ARS",
    symbol: "$",
    name: "Argentine Peso",
    flag: "AR",
  },
  "aruban-florin-awg": {
    code: "AWG",
    symbol: "ƒ",
    name: "Aruban Florin",
    flag: "AW",
  },
  "azerbaijani-manat-azn": {
    code: "AZN",
    symbol: "₼",
    name: "Azerbaijani Manat",
    flag: "AZ",
  },
  "bosnia-herzegovina-convertible-mark-bam": {
    code: "BAM",
    symbol: "KM",
    name: "Bosnia-Herzegovina Convertible Mark",
    flag: "BA",
  },
  "barbadian-dollar-bbd": {
    code: "BBD",
    symbol: "$",
    name: "Barbadian Dollar",
    flag: "BB",
  },
  "bangladeshi-taka-bdt": {
    code: "BDT",
    symbol: "৳",
    name: "Bangladeshi Taka",
    flag: "BD",
  },
  "bulgarian-lev-bgn": {
    code: "BGN",
    symbol: "лв",
    name: "Bulgarian Lev",
    flag: "BG",
  },
  "bahraini-dinar-bhd": {
    code: "BHD",
    symbol: ".د.ب",
    name: "Bahraini Dinar",
    flag: "BH",
  },
  "burundian-franc-bif": {
    code: "BIF",
    symbol: "FBu",
    name: "Burundian Franc",
    flag: "BI",
  },
  "bermudan-dollar-bmd": {
    code: "BMD",
    symbol: "$",
    name: "Bermudan Dollar",
    flag: "BM",
  },
  "brunei-dollar-bnd": {
    code: "BND",
    symbol: "$",
    name: "Brunei Dollar",
    flag: "BN",
  },
  "bolivian-boliviano-bob": {
    code: "BOB",
    symbol: "Bs.",
    name: "Bolivian Boliviano",
    flag: "BO",
  },
  "brazilian-real-brl": {
    code: "BRL",
    symbol: "R$",
    name: "Brazilian Real",
    flag: "BR",
  },
  "bahamian-dollar-bsd": {
    code: "BSD",
    symbol: "$",
    name: "Bahamian Dollar",
    flag: "BS",
  },
  "bhutanese-ngultrum-btn": {
    code: "BTN",
    symbol: "Nu.",
    name: "Bhutanese Ngultrum",
    flag: "BT",
  },
  "botswanan-pula-bwp": {
    code: "BWP",
    symbol: "P",
    name: "Botswanan Pula",
    flag: "BW",
  },
  "belarusian-ruble-byn": {
    code: "BYN",
    symbol: "Br",
    name: "Belarusian Ruble",
    flag: "BY",
  },
  "belize-dollar-bzd": {
    code: "BZD",
    symbol: "BZ$",
    name: "Belize Dollar",
    flag: "BZ",
  },
  "congolese-franc-cdf": {
    code: "CDF",
    symbol: "FC",
    name: "Congolese Franc",
    flag: "CD",
  },
  "chilean-peso-clp": {
    code: "CLP",
    symbol: "$",
    name: "Chilean Peso",
    flag: "CL",
  },
  "colombian-peso-cop": {
    code: "COP",
    symbol: "$",
    name: "Colombian Peso",
    flag: "CO",
  },
  "costa-rican-colon-crc": {
    code: "CRC",
    symbol: "₡",
    name: "Costa Rican Colón",
    flag: "CR",
  },
  "cuban-peso-cup": {
    code: "CUP",
    symbol: "₱",
    name: "Cuban Peso",
    flag: "CU",
  },
  "cape-verdean-escudo-cve": {
    code: "CVE",
    symbol: "$",
    name: "Cape Verdean Escudo",
    flag: "CV",
  },
  "czech-koruna-czk": {
    code: "CZK",
    symbol: "Kč",
    name: "Czech Koruna",
    flag: "CZ",
  },
  "djiboutian-franc-djf": {
    code: "DJF",
    symbol: "Fdj",
    name: "Djiboutian Franc",
    flag: "DJ",
  },
  "danish-krone-dkk": {
    code: "DKK",
    symbol: "kr",
    name: "Danish Krone",
    flag: "DK",
  },
  "dominican-peso-dop": {
    code: "DOP",
    symbol: "RD$",
    name: "Dominican Peso",
    flag: "DO",
  },
  "algerian-dinar-dzd": {
    code: "DZD",
    symbol: "دج",
    name: "Algerian Dinar",
    flag: "DZ",
  },
  "egyptian-pound-egp": {
    code: "EGP",
    symbol: "E£",
    name: "Egyptian Pound",
    flag: "EG",
  },
  "eritrean-nakfa-ern": {
    code: "ERN",
    symbol: "Nfk",
    name: "Eritrean Nakfa",
    flag: "ER",
  },
  "ethiopian-birr-etb": {
    code: "ETB",
    symbol: "Br",
    name: "Ethiopian Birr",
    flag: "ET",
  },
  "fijian-dollar-fjd": {
    code: "FJD",
    symbol: "FJ$",
    name: "Fijian Dollar",
    flag: "FJ",
  },
  "falkland-islands-pound-fkp": {
    code: "FKP",
    symbol: "£",
    name: "Falkland Islands Pound",
    flag: "FK",
  },
  "faroese-krona-fok": {
    code: "FOK",
    symbol: "kr",
    name: "Faroese Króna",
    flag: "FO",
  },
  "georgian-lari-gel": {
    code: "GEL",
    symbol: "₾",
    name: "Georgian Lari",
    flag: "GE",
  },
  "guernsey-pound-ggp": {
    code: "GGP",
    symbol: "£",
    name: "Guernsey Pound",
    flag: "GG",
  },
  "ghanaian-cedi-ghs": {
    code: "GHS",
    symbol: "₵",
    name: "Ghanaian Cedi",
    flag: "GH",
  },
  "gibraltar-pound-gip": {
    code: "GIP",
    symbol: "£",
    name: "Gibraltar Pound",
    flag: "GI",
  },
  "gambian-dalasi-gmd": {
    code: "GMD",
    symbol: "D",
    name: "Gambian Dalasi",
    flag: "GM",
  },
  "guinean-franc-gnf": {
    code: "GNF",
    symbol: "FG",
    name: "Guinean Franc",
    flag: "GN",
  },
  "guatemalan-quetzal-gtq": {
    code: "GTQ",
    symbol: "Q",
    name: "Guatemalan Quetzal",
    flag: "GT",
  },
  "guyanaese-dollar-gyd": {
    code: "GYD",
    symbol: "G$",
    name: "Guyanaese Dollar",
    flag: "GY",
  },
  "hong-kong-dollar-hkd": {
    code: "HKD",
    symbol: "HK$",
    name: "Hong Kong Dollar",
    flag: "HK",
  },
  "honduran-lempira-hnl": {
    code: "HNL",
    symbol: "L",
    name: "Honduran Lempira",
    flag: "HN",
  },
  "croatian-kuna-hrk": {
    code: "HRK",
    symbol: "kn",
    name: "Croatian Kuna",
    flag: "HR",
  },
  "haitian-gourde-htg": {
    code: "HTG",
    symbol: "G",
    name: "Haitian Gourde",
    flag: "HT",
  },
  "hungarian-forint-huf": {
    code: "HUF",
    symbol: "Ft",
    name: "Hungarian Forint",
    flag: "HU",
  },
  "indonesian-rupiah-idr": {
    code: "IDR",
    symbol: "Rp",
    name: "Indonesian Rupiah",
    flag: "ID",
  },
  "israeli-new-shekel-ils": {
    code: "ILS",
    symbol: "₪",
    name: "Israeli New Shekel",
    flag: "IL",
  },
  "manx-pound-imp": {
    code: "IMP",
    symbol: "£",
    name: "Manx Pound",
    flag: "IM",
  },
  "iraqi-dinar-iqd": {
    code: "IQD",
    symbol: "ع.د",
    name: "Iraqi Dinar",
    flag: "IQ",
  },
  "iranian-rial-irr": {
    code: "IRR",
    symbol: "﷼",
    name: "Iranian Rial",
    flag: "IR",
  },
  "icelandic-krona-isk": {
    code: "ISK",
    symbol: "kr",
    name: "Icelandic Króna",
    flag: "IS",
  },
  "jersey-pound-jep": {
    code: "JEP",
    symbol: "£",
    name: "Jersey Pound",
    flag: "JE",
  },
  "jamaican-dollar-jmd": {
    code: "JMD",
    symbol: "J$",
    name: "Jamaican Dollar",
    flag: "JM",
  },
  "jordanian-dinar-jod": {
    code: "JOD",
    symbol: "JD",
    name: "Jordanian Dinar",
    flag: "JO",
  },
  "kenyan-shilling-kes": {
    code: "KES",
    symbol: "KSh",
    name: "Kenyan Shilling",
    flag: "KE",
  },
  "kyrgystani-som-kgs": {
    code: "KGS",
    symbol: "с",
    name: "Kyrgystani Som",
    flag: "KG",
  },
  "cambodian-riel-khr": {
    code: "KHR",
    symbol: "៛",
    name: "Cambodian Riel",
    flag: "KH",
  },
  "kiribati-dollar-kid": {
    code: "KID",
    symbol: "$",
    name: "Kiribati Dollar",
    flag: "KI",
  },
  "comorian-franc-kmf": {
    code: "KMF",
    symbol: "CF",
    name: "Comorian Franc",
    flag: "KM",
  },
  "south-korean-won-krw": {
    code: "KRW",
    symbol: "₩",
    name: "South Korean Won",
    flag: "KR",
  },
  "kuwaiti-dinar-kwd": {
    code: "KWD",
    symbol: "د.ك",
    name: "Kuwaiti Dinar",
    flag: "KW",
  },
  "cayman-islands-dollar-kyd": {
    code: "KYD",
    symbol: "$",
    name: "Cayman Islands Dollar",
    flag: "KY",
  },
  "kazakhstani-tenge-kzt": {
    code: "KZT",
    symbol: "₸",
    name: "Kazakhstani Tenge",
    flag: "KZ",
  },
  "laotian-kip-lak": {
    code: "LAK",
    symbol: "₭",
    name: "Laotian Kip",
    flag: "LA",
  },
  "lebanese-pound-lbp": {
    code: "LBP",
    symbol: "ل.ل",
    name: "Lebanese Pound",
    flag: "LB",
  },
  "sri-lankan-rupee-lkr": {
    code: "LKR",
    symbol: "Rs",
    name: "Sri Lankan Rupee",
    flag: "LK",
  },
  "liberian-dollar-lrd": {
    code: "LRD",
    symbol: "$",
    name: "Liberian Dollar",
    flag: "LR",
  },
  "lesotho-loti-lsl": {
    code: "LSL",
    symbol: "L",
    name: "Lesotho Loti",
    flag: "LS",
  },
  "libyan-dinar-lyd": {
    code: "LYD",
    symbol: "ل.د",
    name: "Libyan Dinar",
    flag: "LY",
  },
  "moroccan-dirham-mad": {
    code: "MAD",
    symbol: "د.م.",
    name: "Moroccan Dirham",
    flag: "MA",
  },
  "moldovan-leu-mdl": {
    code: "MDL",
    symbol: "L",
    name: "Moldovan Leu",
    flag: "MD",
  },
  "malagasy-ariary-mga": {
    code: "MGA",
    symbol: "Ar",
    name: "Malagasy Ariary",
    flag: "MG",
  },
  "macedonian-denar-mkd": {
    code: "MKD",
    symbol: "ден",
    name: "Macedonian Denar",
    flag: "MK",
  },
  "myanmar-kyat-mmk": {
    code: "MMK",
    symbol: "K",
    name: "Myanmar Kyat",
    flag: "MM",
  },
  "mongolian-tugrik-mnt": {
    code: "MNT",
    symbol: "₮",
    name: "Mongolian Tugrik",
    flag: "MN",
  },
  "macanese-pataca-mop": {
    code: "MOP",
    symbol: "MOP$",
    name: "Macanese Pataca",
    flag: "MO",
  },
  "mauritanian-ouguiya-mru": {
    code: "MRU",
    symbol: "UM",
    name: "Mauritanian Ouguiya",
    flag: "MR",
  },
  "mauritian-rupee-mur": {
    code: "MUR",
    symbol: "₨",
    name: "Mauritian Rupee",
    flag: "MU",
  },
  "maldivian-rufiyaa-mvr": {
    code: "MVR",
    symbol: "Rf",
    name: "Maldivian Rufiyaa",
    flag: "MV",
  },
  "malawian-kwacha-mwk": {
    code: "MWK",
    symbol: "MK",
    name: "Malawian Kwacha",
    flag: "MW",
  },
  "mexican-peso-mxn": {
    code: "MXN",
    symbol: "$",
    name: "Mexican Peso",
    flag: "MX",
  },
  "malaysian-ringgit-myr": {
    code: "MYR",
    symbol: "RM",
    name: "Malaysian Ringgit",
    flag: "MY",
  },
  "mozambican-metical-mzn": {
    code: "MZN",
    symbol: "MT",
    name: "Mozambican Metical",
    flag: "MZ",
  },
  "namibian-dollar-nad": {
    code: "NAD",
    symbol: "$",
    name: "Namibian Dollar",
    flag: "NA",
  },
  "nicaraguan-cordoba-nio": {
    code: "NIO",
    symbol: "C$",
    name: "Nicaraguan Córdoba",
    flag: "NI",
  },
  "norwegian-krone-nok": {
    code: "NOK",
    symbol: "kr",
    name: "Norwegian Krone",
    flag: "NO",
  },
  "nepalese-rupee-npr": {
    code: "NPR",
    symbol: "₨",
    name: "Nepalese Rupee",
    flag: "NP",
  },
  "new-zealand-dollar-nzd": {
    code: "NZD",
    symbol: "NZ$",
    name: "New Zealand Dollar",
    flag: "NZ",
  },
  "omani-rial-omr": {
    code: "OMR",
    symbol: "ر.ع.",
    name: "Omani Rial",
    flag: "OM",
  },
  "panamanian-balboa-pab": {
    code: "PAB",
    symbol: "B/.",
    name: "Panamanian Balboa",
    flag: "PA",
  },
  "peruvian-sol-pen": {
    code: "PEN",
    symbol: "S/",
    name: "Peruvian Sol",
    flag: "PE",
  },
  "papua-new-guinean-kina-pgk": {
    code: "PGK",
    symbol: "K",
    name: "Papua New Guinean Kina",
    flag: "PG",
  },
  "philippine-peso-php": {
    code: "PHP",
    symbol: "₱",
    name: "Philippine Peso",
    flag: "PH",
  },
  "pakistani-rupee-pkr": {
    code: "PKR",
    symbol: "₨",
    name: "Pakistani Rupee",
    flag: "PK",
  },
  "polish-zloty-pln": {
    code: "PLN",
    symbol: "zł",
    name: "Polish Złoty",
    flag: "PL",
  },
  "paraguayan-guarani-pyg": {
    code: "PYG",
    symbol: "₲",
    name: "Paraguayan Guarani",
    flag: "PY",
  },
  "qatari-riyal-qar": {
    code: "QAR",
    symbol: "ر.ق",
    name: "Qatari Riyal",
    flag: "QA",
  },
  "romanian-leu-ron": {
    code: "RON",
    symbol: "lei",
    name: "Romanian Leu",
    flag: "RO",
  },
  "serbian-dinar-rsd": {
    code: "RSD",
    symbol: "дин.",
    name: "Serbian Dinar",
    flag: "RS",
  },
  "russian-ruble-rub": {
    code: "RUB",
    symbol: "₽",
    name: "Russian Ruble",
    flag: "RU",
  },
  "rwandan-franc-rwf": {
    code: "RWF",
    symbol: "RF",
    name: "Rwandan Franc",
    flag: "RW",
  },
  "saudi-riyal-sar": {
    code: "SAR",
    symbol: "ر.س",
    name: "Saudi Riyal",
    flag: "SA",
  },
  "solomon-islands-dollar-sbd": {
    code: "SBD",
    symbol: "$",
    name: "Solomon Islands Dollar",
    flag: "SB",
  },
  "seychellois-rupee-scr": {
    code: "SCR",
    symbol: "₨",
    name: "Seychellois Rupee",
    flag: "SC",
  },
  "sudanese-pound-sdg": {
    code: "SDG",
    symbol: "ج.س.",
    name: "Sudanese Pound",
    flag: "SD",
  },
  "swedish-krona-sek": {
    code: "SEK",
    symbol: "kr",
    name: "Swedish Krona",
    flag: "SE",
  },
  "singapore-dollar-sgd": {
    code: "SGD",
    symbol: "S$",
    name: "Singapore Dollar",
    flag: "SG",
  },
  "saint-helena-pound-shp": {
    code: "SHP",
    symbol: "£",
    name: "Saint Helena Pound",
    flag: "SH",
  },
  "sierra-leonean-leone-sle": {
    code: "SLE",
    symbol: "Le",
    name: "Sierra Leonean Leone",
    flag: "SL",
  },
  "sierra-leonean-leone-old-sll": {
    code: "SLL",
    symbol: "Le",
    name: "Sierra Leonean Leone (old)",
    flag: "SL",
  },
  "somali-shilling-sos": {
    code: "SOS",
    symbol: "Sh",
    name: "Somali Shilling",
    flag: "SO",
  },
  "surinamese-dollar-srd": {
    code: "SRD",
    symbol: "$",
    name: "Surinamese Dollar",
    flag: "SR",
  },
  "south-sudanese-pound-ssp": {
    code: "SSP",
    symbol: "£",
    name: "South Sudanese Pound",
    flag: "SS",
  },
  "sao-tome-and-principe-dobra-stn": {
    code: "STN",
    symbol: "Db",
    name: "São Tomé and Príncipe Dobra",
    flag: "ST",
  },
  "syrian-pound-syp": {
    code: "SYP",
    symbol: "£S",
    name: "Syrian Pound",
    flag: "SY",
  },
  "swazi-lilangeni-szl": {
    code: "SZL",
    symbol: "L",
    name: "Swazi Lilangeni",
    flag: "SZ",
  },
  "thai-baht-thb": { code: "THB", symbol: "฿", name: "Thai Baht", flag: "TH" },
  "tajikistani-somoni-tjs": {
    code: "TJS",
    symbol: "ЅМ",
    name: "Tajikistani Somoni",
    flag: "TJ",
  },
  "turkmenistani-manat-tmt": {
    code: "TMT",
    symbol: "m",
    name: "Turkmenistani Manat",
    flag: "TM",
  },
  "tunisian-dinar-tnd": {
    code: "TND",
    symbol: "د.ت",
    name: "Tunisian Dinar",
    flag: "TN",
  },
  "tongan-paanga-top": {
    code: "TOP",
    symbol: "T$",
    name: "Tongan Paʻanga",
    flag: "TO",
  },
  "turkish-lira-try": {
    code: "TRY",
    symbol: "₺",
    name: "Turkish Lira",
    flag: "TR",
  },
  "trinidad-and-tobago-dollar-ttd": {
    code: "TTD",
    symbol: "TT$",
    name: "Trinidad and Tobago Dollar",
    flag: "TT",
  },
  "tuvaluan-dollar-tvd": {
    code: "TVD",
    symbol: "$",
    name: "Tuvaluan Dollar",
    flag: "TV",
  },
  "new-taiwan-dollar-twd": {
    code: "TWD",
    symbol: "NT$",
    name: "New Taiwan Dollar",
    flag: "TW",
  },
  "tanzanian-shilling-tzs": {
    code: "TZS",
    symbol: "TSh",
    name: "Tanzanian Shilling",
    flag: "TZ",
  },
  "ukrainian-hryvnia-uah": {
    code: "UAH",
    symbol: "₴",
    name: "Ukrainian Hryvnia",
    flag: "UA",
  },
  "ugandan-shilling-ugx": {
    code: "UGX",
    symbol: "USh",
    name: "Ugandan Shilling",
    flag: "UG",
  },
  "uruguayan-peso-uyu": {
    code: "UYU",
    symbol: "$U",
    name: "Uruguayan Peso",
    flag: "UY",
  },
  "uzbekistani-som-uzs": {
    code: "UZS",
    symbol: "so'm",
    name: "Uzbekistani Som",
    flag: "UZ",
  },
  "venezuelan-bolivar-ves": {
    code: "VES",
    symbol: "Bs.S",
    name: "Venezuelan Bolívar",
    flag: "VE",
  },
  "vietnamese-dong-vnd": {
    code: "VND",
    symbol: "₫",
    name: "Vietnamese Dong",
    flag: "VN",
  },
  "vanuatu-vatu-vuv": {
    code: "VUV",
    symbol: "VT",
    name: "Vanuatu Vatu",
    flag: "VU",
  },
  "samoan-tala-wst": {
    code: "WST",
    symbol: "WS$",
    name: "Samoan Tala",
    flag: "WS",
  },
  "central-african-cfa-franc-xaf": {
    code: "XAF",
    symbol: "FCFA",
    name: "Central African CFA Franc",
    flag: "CM",
  },
  "east-caribbean-dollar-xcd": {
    code: "XCD",
    symbol: "EC$",
    name: "East Caribbean Dollar",
    flag: "AI",
  },
  "special-drawing-rights-xdr": {
    code: "XDR",
    symbol: "SDR",
    name: "Special Drawing Rights",
    flag: "World",
  },
  "west-african-cfa-franc-xof": {
    code: "XOF",
    symbol: "CFA",
    name: "West African CFA Franc",
    flag: "SN",
  },
  "cfp-franc-xpf": { code: "XPF", symbol: "₣", name: "CFP Franc", flag: "PF" },
  "yemeni-rial-yer": {
    code: "YER",
    symbol: "﷼",
    name: "Yemeni Rial",
    flag: "YE",
  },
  "south-african-rand-zar": {
    code: "ZAR",
    symbol: "R",
    name: "South African Rand",
    flag: "ZA",
  },
  "zambian-kwacha-zmw": {
    code: "ZMW",
    symbol: "ZK",
    name: "Zambian Kwacha",
    flag: "ZM",
  },
  "zimbabwean-dollar-zwl": {
    code: "ZWL",
    symbol: "Z$",
    name: "Zimbabwean Dollar",
    flag: "ZW",
  },
  "east-caribbean-guilder-xcg": {
    code: "XCG",
    symbol: "ƒ",
    name: "East Caribbean Guilder",
    flag: "CW",
  },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  rates: Record<CurrencyCode, number>;
  convertPrice: (priceInUSD: number) => number;
  formatPrice: (price: number) => string;
  getCurrencySymbol: () => string;
  cryptoAmount: string;
  setCryptoAmount: (amount: string) => void;
  currencyAmount: string;
  setCurrencyAmount: (amount: string) => void;
  fiatCurrencies: any;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "us-dollar-usd",
  setCurrency: () => { },
  rates: Object.keys(CURRENCIES).reduce((acc, curr) => {
    acc[curr as CurrencyCode] = 1;
    return acc;
  }, {} as Record<CurrencyCode, number>),
  convertPrice: (price) => price,
  formatPrice: (price) => `$${price.toFixed(2)}`,
  getCurrencySymbol: () => "$",
  cryptoAmount: "",
  setCryptoAmount: () => { },
  currencyAmount: "",
  setCurrencyAmount: () => { },
  fiatCurrencies: [],
});

export const useCurrency = () => useContext(CurrencyContext);

interface CurrencyProviderProps {
  children: React.ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({
  children,
}) => {
  const [currency, setCurrency] = useState<CurrencyCode>("us-dollar-usd");
  const [rates, setRates] = useState<Record<CurrencyCode, number>>({
    "us-dollar-usd": 1,
    "euro-eur": 0.88,
    "british-pound-gbp": 0.77,
    "nigerian-naira-ngn": 1587.35,
    "japanese-yen-jpy": 143.37,
    "australian-dollar-aud": 1.6,
    "canadian-dollar-cad": 1.39,
    "swiss-franc-chf": 0.82,
    "chinese-yuan-cny": 7.3,
    "indian-rupee-inr": 86.16,
    "uae-dirham-aed": 3.67,
    "afghan-afghani-afn": 72.32,
    "albanian-lek-all": 89.82,
    "armenian-dram-amd": 391.76,
    "netherlands-antillean-guilder-ang": 1.79,
    "angolan-kwanza-aoa": 918.76,
    "argentine-peso-ars": 1077.38,
    "aruban-florin-awg": 1.79,
    "azerbaijani-manat-azn": 1.7,
    "bosnia-herzegovina-convertible-mark-bam": 1.72,
    "barbadian-dollar-bbd": 2,
    "bangladeshi-taka-bdt": 121.49,
    "bulgarian-lev-bgn": 1.72,
    "bahraini-dinar-bhd": 0.38,
    "burundian-franc-bif": 2981.68,
    "bermudan-dollar-bmd": 1,
    "brunei-dollar-bnd": 1.32,
    "bolivian-boliviano-bob": 6.93,
    "brazilian-real-brl": 5.88,
    "bahamian-dollar-bsd": 1,
    "bhutanese-ngultrum-btn": 86.16,
    "botswanan-pula-bwp": 14.02,
    "belarusian-ruble-byn": 3.15,
    "belize-dollar-bzd": 2,
    "congolese-franc-cdf": 2889.4,
    "chilean-peso-clp": 986.73,
    "colombian-peso-cop": 4360.5,
    "costa-rican-colon-crc": 513.67,
    "cuban-peso-cup": 24,
    "cape-verdean-escudo-cve": 97.24,
    "czech-koruna-czk": 22.16,
    "djiboutian-franc-djf": 177.72,
    "danish-krone-dkk": 6.58,
    "dominican-peso-dop": 62.12,
    "algerian-dinar-dzd": 133.47,
    "egyptian-pound-egp": 51.33,
    "eritrean-nakfa-ern": 15,
    "ethiopian-birr-etb": 130.27,
    "fijian-dollar-fjd": 2.29,
    "falkland-islands-pound-fkp": 0.77,
    "faroese-krona-fok": 6.58,
    "georgian-lari-gel": 2.76,
    "guernsey-pound-ggp": 0.77,
    "ghanaian-cedi-ghs": 15.6,
    "gibraltar-pound-gip": 0.77,
    "gambian-dalasi-gmd": 72.68,
    "guinean-franc-gnf": 8686.42,
    "guatemalan-quetzal-gtq": 7.71,
    "guyanaese-dollar-gyd": 209.33,
    "hong-kong-dollar-hkd": 7.76,
    "honduran-lempira-hnl": 25.89,
    "croatian-kuna-hrk": 6.64,
    "haitian-gourde-htg": 130.69,
    "hungarian-forint-huf": 361.45,
    "indonesian-rupiah-idr": 16795.78,
    "israeli-new-shekel-ils": 3.72,
    "manx-pound-imp": 0.77,
    "iraqi-dinar-iqd": 1310.0,
    "iranian-rial-irr": 41984.1,
    "icelandic-krona-isk": 127.93,
    "jersey-pound-jep": 0.77,
    "jamaican-dollar-jmd": 157.96,
    "jordanian-dinar-jod": 0.71,
    "kenyan-shilling-kes": 129.41,
    "kyrgystani-som-kgs": 87.03,
    "cambodian-riel-khr": 4000.04,
    "kiribati-dollar-kid": 1.6,
    "comorian-franc-kmf": 433.86,
    "south-korean-won-krw": 1425.84,
    "kuwaiti-dinar-kwd": 0.31,
    "cayman-islands-dollar-kyd": 0.83,
    "kazakhstani-tenge-kzt": 516.99,
    "laotian-kip-lak": 21833.87,
    "lebanese-pound-lbp": 89500.0,
    "sri-lankan-rupee-lkr": 297.87,
    "liberian-dollar-lrd": 200.14,
    "lesotho-loti-lsl": 19.19,
    "libyan-dinar-lyd": 5.55,
    "moroccan-dirham-mad": 9.33,
    "moldovan-leu-mdl": 17.67,
    "malagasy-ariary-mga": 4626.01,
    "macedonian-denar-mkd": 55.62,
    "myanmar-kyat-mmk": 2103.18,
    "mongolian-tugrik-mnt": 3545.12,
    "macanese-pataca-mop": 7.99,
    "mauritanian-ouguiya-mru": 39.82,
    "mauritian-rupee-mur": 44.33,
    "maldivian-rufiyaa-mvr": 15.46,
    "malawian-kwacha-mwk": 1746.28,
    "mexican-peso-mxn": 20.35,
    "malaysian-ringgit-myr": 4.43,
    "mozambican-metical-mzn": 63.92,
    "namibian-dollar-nad": 19.19,
    "nicaraguan-cordoba-nio": 36.81,
    "norwegian-krone-nok": 10.68,
    "nepalese-rupee-npr": 137.86,
    "new-zealand-dollar-nzd": 1.72,
    "omani-rial-omr": 0.38,
    "panamanian-balboa-pab": 1.0,
    "peruvian-sol-pen": 3.73,
    "papua-new-guinean-kina-pgk": 4.09,
    "philippine-peso-php": 56.97,
    "pakistani-rupee-pkr": 280.38,
    "polish-zloty-pln": 3.78,
    "paraguayan-guarani-pyg": 8047.86,
    "qatari-riyal-qar": 3.64,
    "romanian-leu-ron": 4.39,
    "serbian-dinar-rsd": 103.71,
    "russian-ruble-rub": 83.74,
    "rwandan-franc-rwf": 1444.14,
    "saudi-riyal-sar": 3.75,
    "solomon-islands-dollar-sbd": 8.21,
    "seychellois-rupee-scr": 14.39,
    "sudanese-pound-sdg": 510.71,
    "swedish-krona-sek": 9.79,
    "singapore-dollar-sgd": 1.32,
    "saint-helena-pound-shp": 0.77,
    "sierra-leonean-leone-sle": 22.79,
    "sierra-leonean-leone-old-sll": 22790.63,
    "somali-shilling-sos": 571.88,
    "surinamese-dollar-srd": 36.61,
    "south-sudanese-pound-ssp": 4534.37,
    "sao-tome-and-principe-dobra-stn": 21.61,
    "syrian-pound-syp": 12911.82,
    "swazi-lilangeni-szl": 19.19,
    "thai-baht-thb": 33.48,
    "tajikistani-somoni-tjs": 10.91,
    "turkmenistani-manat-tmt": 3.5,
    "tunisian-dinar-tnd": 3.01,
    "tongan-paanga-top": 2.41,
    "turkish-lira-try": 38.1,
    "trinidad-and-tobago-dollar-ttd": 6.76,
    "tuvaluan-dollar-tvd": 1.6,
    "new-taiwan-dollar-twd": 32.21,
    "tanzanian-shilling-tzs": 2657.35,
    "ukrainian-hryvnia-uah": 41.4,
    "ugandan-shilling-ugx": 3685.68,
    "uruguayan-peso-uyu": 42.93,
    "uzbekistani-som-uzs": 12971.82,
    "venezuelan-bolivar-ves": 78.36,
    "vietnamese-dong-vnd": 25740.25,
    "vanuatu-vatu-vuv": 125.08,
    "samoan-tala-wst": 2.85,
    "central-african-cfa-franc-xaf": 578.48,
    "east-caribbean-dollar-xcd": 2.7,
    "special-drawing-rights-xdr": 0.73,
    "west-african-cfa-franc-xof": 578.48,
    "cfp-franc-xpf": 105.24,
    "yemeni-rial-yer": 245.33,
    "south-african-rand-zar": 19.17,
    "zambian-kwacha-zmw": 28.2,
    "zimbabwean-dollar-zwl": 26.81,
    "east-caribbean-guilder-xcg": 1.79,
  });

  const currencyList = Object.entries(CURRENCIES).map(
    ([slug, details], index) => {
      let countryCode = details.code.toLowerCase();

      return {
        id: (index + 1).toString(),
        rank: index + 1,
        ticker: details.code,
        name: details.name,
        slug: slug,
        cmcId: "100000",
        price: rates[details.code as keyof typeof rates] ?? 1,
        symbol: details.symbol,
        isCrypto: false,
        status: "stable",
        logo: `https://flagcdn.com/w80/${details.flag}.png`,
        priceChanges: {
          hour1: 0,
          day1: 0,
          week1: 0,
        },
        marketCap: 0,
        volume24h: 0,
        circulatingSupply: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
  );

  const [fiatCurrencies, setFiatCurrencies] = useState<Token[]>(currencyList);
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [currencyAmount, setCurrencyAmount] = useState("");

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await response.json();

        if (data.rates) {
          const newRates = Object.keys(CURRENCIES).reduce(
            (acc, curr) => {
              if (data.rates[curr]) {
                acc[curr as CurrencyCode] = data.rates[curr];
              }
              return acc;
            },
            { ...rates }
          );

          const newFiatCurrencies = currencyList.map((curr) => ({
            ...curr,
            price: newRates[curr.slug as CurrencyCode],
          }));

          setRates(newRates);
          setFiatCurrencies(newFiatCurrencies);
        }
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    fetchRates();
    const intervalId = setInterval(fetchRates, 3600000);
    return () => clearInterval(intervalId);
  }, []);

  const convertPrice = (priceInUSD: number): number => {
    return priceInUSD * rates[currency];
  };

  const formatPrice = (price: number): string => {
    const convertedPrice = convertPrice(price);

    if (currency === "japanese-yen-jpy" || currency === "indian-rupee-inr") {
      return `${CURRENCIES[currency].symbol}${Math.round(
        convertedPrice
      ).toLocaleString()}`;
    }

    return `${CURRENCIES[currency].symbol}${convertedPrice.toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  const getCurrencySymbol = (): string => {
    return CURRENCIES[currency].symbol;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        rates,
        convertPrice,
        formatPrice,
        getCurrencySymbol,
        cryptoAmount,
        setCryptoAmount,
        currencyAmount,
        setCurrencyAmount,
        fiatCurrencies,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyContext;
