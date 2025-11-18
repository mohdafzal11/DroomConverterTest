/**
 * Script to generate an Excel file with converter URLs
 * 
 * This script fetches all tokens that should be in the sitemap,
 * then creates an Excel file with columns for:
 * - URL (e.g., https://droomdroom.com/converter/bitcoin-btc/usd)
 * - Title (e.g., "Calculate BTC to USD Live Today (BTC-USD) | DroomDroom")
 * 
 * Run with: node scripts/generate-converter-excel.js [options]
 * 
 * Options:
 *   --output, -o    Specify output directory           [default: script directory]
 *   --limit, -l     Limit number of tokens             [default: 500]
 *   --baseUrl, -b   Base URL for links                 [default: from env or droomdroom.com/converter]
 *   --help          Show help
 */

const { PrismaClient } = require('@prisma/client');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
require('dotenv').config();

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .option('output', {
    alias: 'o',
    type: 'string',
    description: 'Output directory for the Excel file'
  })
  .option('limit', {
    alias: 'l',
    type: 'number',
    description: 'Limit the number of tokens to include',
    default: 500
  })
  .option('baseUrl', {
    alias: 'b',
    type: 'string',
    description: 'Base URL for generating links'
  })
  .help()
  .argv;

const prisma = new PrismaClient();

// Helper function to generate token URL slug
const generateTokenUrl = (name, ticker) => {
  // Only replace spaces with hyphens, preserve other special characters
  const processedName = name.toLowerCase().replace(/\s+/g, '-');
  const processedTicker = ticker.toLowerCase().replace(/\s+/g, '-');
  
  // Use double hyphen only if ticker contains spaces
  const separator = ticker.includes(' ') ? '--' : '-';
  
  return `${processedName}${separator}${processedTicker}`;
};

// Define fiat currencies (extensive list from the modified script)
// const fiatCurrencies = {
//   USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
//   EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
//   GBP: { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
//   NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬' },
//   JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
//   AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
//   CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
//   CHF: { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', flag: '🇨🇭' },
//   CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳' },
//   INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
//   // Additional popular currencies (subset of the full list for manageability)
//   BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷' },
//   RUB: { code: 'RUB', symbol: '₽', name: 'Russian Ruble', flag: '🇷🇺' },
//   ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand', flag: '🇿🇦' },
//   MXN: { code: 'MXN', symbol: '$', name: 'Mexican Peso', flag: '🇲🇽' },
//   SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬' },
//   TRY: { code: 'TRY', symbol: '₺', name: 'Turkish Lira', flag: '🇹🇷' },
//   KRW: { code: 'KRW', symbol: '₩', name: 'South Korean Won', flag: '🇰🇷' },
//   PLN: { code: 'PLN', symbol: 'zł', name: 'Polish Złoty', flag: '🇵🇱' },
//   THB: { code: 'THB', symbol: '฿', name: 'Thai Baht', flag: '🇹🇭' },
//   IDR: { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', flag: '🇮🇩' }
// };
// 

const fiatCurrencies = {
    USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
    EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
    GBP: { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
    NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬' },
    JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
    AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
    CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
    CHF: { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', flag: '🇨🇭' },
    CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳' },
    INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
    AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪' },
    AFN: { code: 'AFN', symbol: '؋', name: 'Afghan Afghani', flag: '🇦🇫' },
    ALL: { code: 'ALL', symbol: 'L', name: 'Albanian Lek', flag: '🇦🇱' },
    AMD: { code: 'AMD', symbol: '֏', name: 'Armenian Dram', flag: '🇦🇲' },
    ANG: { code: 'ANG', symbol: 'ƒ', name: 'Netherlands Antillean Guilder', flag: '🇨🇼' },
    AOA: { code: 'AOA', symbol: 'Kz', name: 'Angolan Kwanza', flag: '🇦🇴' },
    ARS: { code: 'ARS', symbol: '$', name: 'Argentine Peso', flag: '🇦🇷' },
    AWG: { code: 'AWG', symbol: 'ƒ', name: 'Aruban Florin', flag: '🇦🇼' },
    AZN: { code: 'AZN', symbol: '₼', name: 'Azerbaijani Manat', flag: '🇦🇿' },
    BAM: { code: 'BAM', symbol: 'KM', name: 'Bosnia-Herzegovina Convertible Mark', flag: '🇧🇦' },
    BBD: { code: 'BBD', symbol: '$', name: 'Barbadian Dollar', flag: '🇧🇧' },
    BDT: { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', flag: '🇧🇩' },
    BGN: { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev', flag: '🇧🇬' },
    BHD: { code: 'BHD', symbol: '.د.ب', name: 'Bahraini Dinar', flag: '🇧🇭' },
    BIF: { code: 'BIF', symbol: 'FBu', name: 'Burundian Franc', flag: '🇧🇮' },
    BMD: { code: 'BMD', symbol: '$', name: 'Bermudan Dollar', flag: '🇧🇲' },
    BND: { code: 'BND', symbol: '$', name: 'Brunei Dollar', flag: '🇧🇳' },
    BOB: { code: 'BOB', symbol: 'Bs.', name: 'Bolivian Boliviano', flag: '🇧🇴' },
    BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷' },
    BSD: { code: 'BSD', symbol: '$', name: 'Bahamian Dollar', flag: '🇧🇸' },
    BTN: { code: 'BTN', symbol: 'Nu.', name: 'Bhutanese Ngultrum', flag: '🇧🇹' },
    BWP: { code: 'BWP', symbol: 'P', name: 'Botswanan Pula', flag: '🇧🇼' },
    BYN: { code: 'BYN', symbol: 'Br', name: 'Belarusian Ruble', flag: '🇧🇾' },
    BZD: { code: 'BZD', symbol: 'BZ$', name: 'Belize Dollar', flag: '🇧🇿' },
    CDF: { code: 'CDF', symbol: 'FC', name: 'Congolese Franc', flag: '🇨🇩' },
    CLP: { code: 'CLP', symbol: '$', name: 'Chilean Peso', flag: '🇨🇱' },
    COP: { code: 'COP', symbol: '$', name: 'Colombian Peso', flag: '🇨🇴' },
    CRC: { code: 'CRC', symbol: '₡', name: 'Costa Rican Colón', flag: '🇨🇷' },
    CUP: { code: 'CUP', symbol: '₱', name: 'Cuban Peso', flag: '🇨🇺' },
    CVE: { code: 'CVE', symbol: '$', name: 'Cape Verdean Escudo', flag: '🇨🇻' },
    CZK: { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', flag: '🇨🇿' },
    DJF: { code: 'DJF', symbol: 'Fdj', name: 'Djiboutian Franc', flag: '🇩🇯' },
    DKK: { code: 'DKK', symbol: 'kr', name: 'Danish Krone', flag: '🇩🇰' },
    DOP: { code: 'DOP', symbol: 'RD$', name: 'Dominican Peso', flag: '🇩🇴' },
    DZD: { code: 'DZD', symbol: 'دج', name: 'Algerian Dinar', flag: '🇩🇿' },
    EGP: { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', flag: '🇪🇬' },
    ERN: { code: 'ERN', symbol: 'Nfk', name: 'Eritrean Nakfa', flag: '🇪🇷' },
    ETB: { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr', flag: '🇪🇹' },
    FJD: { code: 'FJD', symbol: 'FJ$', name: 'Fijian Dollar', flag: '🇫🇯' },
    FKP: { code: 'FKP', symbol: '£', name: 'Falkland Islands Pound', flag: '🇫🇰' },
    FOK: { code: 'FOK', symbol: 'kr', name: 'Faroese Króna', flag: '🇫🇴' },
    GEL: { code: 'GEL', symbol: '₾', name: 'Georgian Lari', flag: '🇬🇪' },
    GGP: { code: 'GGP', symbol: '£', name: 'Guernsey Pound', flag: '🇬🇬' },
    GHS: { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi', flag: '🇬🇭' },
    GIP: { code: 'GIP', symbol: '£', name: 'Gibraltar Pound', flag: '🇬🇮' },
    GMD: { code: 'GMD', symbol: 'D', name: 'Gambian Dalasi', flag: '🇬🇲' },
    GNF: { code: 'GNF', symbol: 'FG', name: 'Guinean Franc', flag: '🇬🇳' },
    GTQ: { code: 'GTQ', symbol: 'Q', name: 'Guatemalan Quetzal', flag: '🇬🇹' },
    GYD: { code: 'GYD', symbol: 'G$', name: 'Guyanaese Dollar', flag: '🇬🇾' },
    HKD: { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', flag: '🇭🇰' },
    HNL: { code: 'HNL', symbol: 'L', name: 'Honduran Lempira', flag: '🇭🇳' },
    HRK: { code: 'HRK', symbol: 'kn', name: 'Croatian Kuna', flag: '🇭🇷' },
    HTG: { code: 'HTG', symbol: 'G', name: 'Haitian Gourde', flag: '🇭🇹' },
    HUF: { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', flag: '🇭🇺' },
    IDR: { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', flag: '🇮🇩' },
    ILS: { code: 'ILS', symbol: '₪', name: 'Israeli New Shekel', flag: '🇮🇱' },
    IMP: { code: 'IMP', symbol: '£', name: 'Manx Pound', flag: '🇮🇲' },
    IQD: { code: 'IQD', symbol: 'ع.د', name: 'Iraqi Dinar', flag: '🇮🇶' },
    IRR: { code: 'IRR', symbol: '﷼', name: 'Iranian Rial', flag: '🇮🇷' },
    ISK: { code: 'ISK', symbol: 'kr', name: 'Icelandic Króna', flag: '🇮🇸' },
    JEP: { code: 'JEP', symbol: '£', name: 'Jersey Pound', flag: '🇯🇪' },
    JMD: { code: 'JMD', symbol: 'J$', name: 'Jamaican Dollar', flag: '🇯🇲' },
    JOD: { code: 'JOD', symbol: 'JD', name: 'Jordanian Dinar', flag: '🇯🇴' },
    KES: { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', flag: '🇰🇪' },
    KGS: { code: 'KGS', symbol: 'с', name: 'Kyrgystani Som', flag: '🇰🇬' },
    KHR: { code: 'KHR', symbol: '៛', name: 'Cambodian Riel', flag: '🇰🇭' },
    KID: { code: 'KID', symbol: '$', name: 'Kiribati Dollar', flag: '🇰🇮' },
    KMF: { code: 'KMF', symbol: 'CF', name: 'Comorian Franc', flag: '🇰🇲' },
    KRW: { code: 'KRW', symbol: '₩', name: 'South Korean Won', flag: '🇰🇷' },
    KWD: { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar', flag: '🇰🇼' },
    KYD: { code: 'KYD', symbol: '$', name: 'Cayman Islands Dollar', flag: '🇰🇾' },
    KZT: { code: 'KZT', symbol: '₸', name: 'Kazakhstani Tenge', flag: '🇰🇿' },
    LAK: { code: 'LAK', symbol: '₭', name: 'Laotian Kip', flag: '🇱🇦' },
    LBP: { code: 'LBP', symbol: 'ل.ل', name: 'Lebanese Pound', flag: '🇱🇧' },
    LKR: { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee', flag: '🇱🇰' },
    LRD: { code: 'LRD', symbol: '$', name: 'Liberian Dollar', flag: '🇱🇷' },
    LSL: { code: 'LSL', symbol: 'L', name: 'Lesotho Loti', flag: '🇱🇸' },
    LYD: { code: 'LYD', symbol: 'ل.د', name: 'Libyan Dinar', flag: '🇱🇾' },
    MAD: { code: 'MAD', symbol: 'د.م.', name: 'Moroccan Dirham', flag: '🇲🇦' },
    MDL: { code: 'MDL', symbol: 'L', name: 'Moldovan Leu', flag: '🇲🇩' },
    MGA: { code: 'MGA', symbol: 'Ar', name: 'Malagasy Ariary', flag: '🇲🇬' },
    MKD: { code: 'MKD', symbol: 'ден', name: 'Macedonian Denar', flag: '🇲🇰' },
    MMK: { code: 'MMK', symbol: 'K', name: 'Myanmar Kyat', flag: '🇲🇲' },
    MNT: { code: 'MNT', symbol: '₮', name: 'Mongolian Tugrik', flag: '🇲🇳' },
    MOP: { code: 'MOP', symbol: 'MOP$', name: 'Macanese Pataca', flag: '🇲🇴' },
    MRU: { code: 'MRU', symbol: 'UM', name: 'Mauritanian Ouguiya', flag: '🇲🇷' },
    MUR: { code: 'MUR', symbol: '₨', name: 'Mauritian Rupee', flag: '🇲🇺' },
    MVR: { code: 'MVR', symbol: 'Rf', name: 'Maldivian Rufiyaa', flag: '🇲🇻' },
    MWK: { code: 'MWK', symbol: 'MK', name: 'Malawian Kwacha', flag: '🇲🇼' },
    MXN: { code: 'MXN', symbol: '$', name: 'Mexican Peso', flag: '🇲🇽' },
    MYR: { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', flag: '🇲🇾' },
    MZN: { code: 'MZN', symbol: 'MT', name: 'Mozambican Metical', flag: '🇲🇿' },
    NAD: { code: 'NAD', symbol: '$', name: 'Namibian Dollar', flag: '🇳🇦' },
    NIO: { code: 'NIO', symbol: 'C$', name: 'Nicaraguan Córdoba', flag: '🇳🇮' },
    NOK: { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', flag: '🇳🇴' },
    NPR: { code: 'NPR', symbol: '₨', name: 'Nepalese Rupee', flag: '🇳🇵' },
    NZD: { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', flag: '🇳🇿' },
    OMR: { code: 'OMR', symbol: 'ر.ع.', name: 'Omani Rial', flag: '🇴🇲' },
    PAB: { code: 'PAB', symbol: 'B/.', name: 'Panamanian Balboa', flag: '🇵🇦' },
    PEN: { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol', flag: '🇵🇪' },
    PGK: { code: 'PGK', symbol: 'K', name: 'Papua New Guinean Kina', flag: '🇵🇬' },
    PHP: { code: 'PHP', symbol: '₱', name: 'Philippine Peso', flag: '🇵🇭' },
    PKR: { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', flag: '🇵🇰' },
    PLN: { code: 'PLN', symbol: 'zł', name: 'Polish Złoty', flag: '🇵🇱' },
    PYG: { code: 'PYG', symbol: '₲', name: 'Paraguayan Guarani', flag: '🇵🇾' },
    QAR: { code: 'QAR', symbol: 'ر.ق', name: 'Qatari Riyal', flag: '🇶🇦' },
    RON: { code: 'RON', symbol: 'lei', name: 'Romanian Leu', flag: '🇷🇴' },
    RSD: { code: 'RSD', symbol: 'дин.', name: 'Serbian Dinar', flag: '🇷🇸' },
    RUB: { code: 'RUB', symbol: '₽', name: 'Russian Ruble', flag: '🇷🇺' },
    RWF: { code: 'RWF', symbol: 'RF', name: 'Rwandan Franc', flag: '🇷🇼' },
    SAR: { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal', flag: '🇸🇦' },
    SBD: { code: 'SBD', symbol: '$', name: 'Solomon Islands Dollar', flag: '🇸🇧' },
    SCR: { code: 'SCR', symbol: '₨', name: 'Seychellois Rupee', flag: '🇸🇨' },
    SDG: { code: 'SDG', symbol: 'ج.س.', name: 'Sudanese Pound', flag: '🇸🇩' },
    SEK: { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', flag: '🇸🇪' },
    SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬' },
    SHP: { code: 'SHP', symbol: '£', name: 'Saint Helena Pound', flag: '🇸🇭' },
    SLE: { code: 'SLE', symbol: 'Le', name: 'Sierra Leonean Leone', flag: '🇸🇱' },
    SLL: { code: 'SLL', symbol: 'Le', name: 'Sierra Leonean Leone (old)', flag: '🇸🇱' },
    SOS: { code: 'SOS', symbol: 'Sh', name: 'Somali Shilling', flag: '🇸🇴' },
    SRD: { code: 'SRD', symbol: '$', name: 'Surinamese Dollar', flag: '🇸🇷' },
    SSP: { code: 'SSP', symbol: '£', name: 'South Sudanese Pound', flag: '🇸🇸' },
    STN: { code: 'STN', symbol: 'Db', name: 'São Tomé and Príncipe Dobra', flag: '🇸🇹' },
    SYP: { code: 'SYP', symbol: '£S', name: 'Syrian Pound', flag: '🇸🇾' },
    SZL: { code: 'SZL', symbol: 'L', name: 'Swazi Lilangeni', flag: '🇸🇿' },
    THB: { code: 'THB', symbol: '฿', name: 'Thai Baht', flag: '🇹🇭' },
    TJS: { code: 'TJS', symbol: 'ЅМ', name: 'Tajikistani Somoni', flag: '🇹🇯' },
    TMT: { code: 'TMT', symbol: 'm', name: 'Turkmenistani Manat', flag: '🇹🇲' },
    TND: { code: 'TND', symbol: 'د.ت', name: 'Tunisian Dinar', flag: '🇹🇳' },
    TOP: { code: 'TOP', symbol: 'T$', name: 'Tongan Paʻanga', flag: '🇹🇴' },
    TRY: { code: 'TRY', symbol: '₺', name: 'Turkish Lira', flag: '🇹🇷' },
    TTD: { code: 'TTD', symbol: 'TT$', name: 'Trinidad and Tobago Dollar', flag: '🇹🇹' },
    TVD: { code: 'TVD', symbol: '$', name: 'Tuvaluan Dollar', flag: '🇹🇻' },
    TWD: { code: 'TWD', symbol: 'NT$', name: 'New Taiwan Dollar', flag: '🇹🇼' },
    TZS: { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling', flag: '🇹🇿' },
    UAH: { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia', flag: '🇺🇦' },
    UGX: { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling', flag: '🇺🇬' },
    UYU: { code: 'UYU', symbol: '$U', name: 'Uruguayan Peso', flag: '🇺🇾' },
    UZS: { code: 'UZS', symbol: 'so\'m', name: 'Uzbekistani Som', flag: '🇺🇿' },
    VES: { code: 'VES', symbol: 'Bs.S', name: 'Venezuelan Bolívar', flag: '🇻🇪' },
    VND: { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', flag: '🇻🇳' },
    VUV: { code: 'VUV', symbol: 'VT', name: 'Vanuatu Vatu', flag: '🇻🇺' },
    WST: { code: 'WST', symbol: 'WS$', name: 'Samoan Tala', flag: '🇼🇸' },
    XAF: { code: 'XAF', symbol: 'FCFA', name: 'Central African CFA Franc', flag: '🇨🇲' },
    XCD: { code: 'XCD', symbol: 'EC$', name: 'East Caribbean Dollar', flag: '🇦🇮' },
    XDR: { code: 'XDR', symbol: 'SDR', name: 'Special Drawing Rights', flag: '🌐' },
    XOF: { code: 'XOF', symbol: 'CFA', name: 'West African CFA Franc', flag: '🇸🇳' },
    XPF: { code: 'XPF', symbol: '₣', name: 'CFP Franc', flag: '🇵🇫' },
    YER: { code: 'YER', symbol: '﷼', name: 'Yemeni Rial', flag: '🇾🇪' },
    ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand', flag: '🇿🇦' },
    ZMW: { code: 'ZMW', symbol: 'ZK', name: 'Zambian Kwacha', flag: '🇿🇲' },
    ZWL: { code: 'ZWL', symbol: 'Z$', name: 'Zimbabwean Dollar', flag: '🇿🇼' },
    XCG: { code: 'XCG', symbol: 'ƒ', name: 'East Caribbean Guilder', flag: '🇨🇼' }
  };
  

// Get the base URL from environment variables or command line
const getBaseUrl = () => {
  const baseUrl = argv.baseUrl || process.env.NEXT_PUBLIC_DOMAIN || 'https://www.droomdroom.com';
  return `${baseUrl}/converter`;
};

// Generate page title for converter
function generateConverterTitle(fromTicker, toTicker) {
  return `Calculate ${fromTicker} to ${toTicker} Live Today (${fromTicker}-${toTicker}) | DroomDroom`;
}

async function generateConverterUrlsExcel() {
  console.log('Fetching tokens from database...');
  
  // Define key base tokens for conversion pairs
  const baseTokens = [
    { name: 'Bitcoin', ticker: 'BTC' },
    { name: 'Ethereum', ticker: 'ETH' },
    { name: 'Tether', ticker: 'USDT' }
  ];
  
  // Get tokens that should be in the sitemap
  // First, try to get tokens that are explicitly marked for sitemap
  let tokens = await prisma.token.findMany({
    where: {
      inSitemap: true
    },
    orderBy: {
      rank: 'asc'
    },
    select: {
      id: true,
      name: true,
      ticker: true,
      rank: true,
      inSitemap: true,
      cmcId: true
    }
  });
  
  // If no explicit tokens, fall back to top ranked tokens
  if (tokens.length === 0) {
    console.log(`No tokens explicitly marked for sitemap, using top ${argv.limit} ranked tokens`);
    tokens = await prisma.token.findMany({
      where: {
        rank: {
          not: null,
          lte: argv.limit
        }
      },
      orderBy: {
        rank: 'asc'
      },
      select: {
        id: true,
        name: true,
        ticker: true,
        rank: true,
        cmcId: true
      },
      take: argv.limit
    });
  }
  
  console.log(`Found ${tokens.length} tokens for the converter URLs`);
  
  // Add base tokens if they're not already in the list
  for (const baseToken of baseTokens) {
    if (!tokens.some(t => t.ticker === baseToken.ticker)) {
      tokens.push({
        id: `base-${baseToken.ticker}`,
        name: baseToken.name,
        ticker: baseToken.ticker,
        rank: 0,
        cmcId: null
      });
    }
  }
  
  const baseUrl = getBaseUrl();
  const excelData = [];
  
  // 1. BTC to fiat currencies
  const btcToken = tokens.find(t => t.ticker === 'BTC');
  if (btcToken) {
    const btcSlug = generateTokenUrl(btcToken.name, btcToken.ticker);
    Object.values(fiatCurrencies).forEach(fiat => {
      const url = `${baseUrl}/${btcSlug}/${generateTokenUrl(fiat.name, fiat.code)}`;
      const title = generateConverterTitle(btcToken.ticker, fiat.code);
      excelData.push({
        'From Token': btcToken.name,
        'From Ticker': btcToken.ticker,
        'To Token/Currency': fiat.name,
        'To Ticker': fiat.code,
        'URL': url,
        'Title': title
      });
    });
  }
  
  // 2. ETH to fiat currencies
  const ethToken = tokens.find(t => t.ticker === 'ETH');
  if (ethToken) {
    const ethSlug = generateTokenUrl(ethToken.name, ethToken.ticker);
    Object.values(fiatCurrencies).forEach(fiat => {
      const url = `${baseUrl}/${ethSlug}/${generateTokenUrl(fiat.name, fiat.code)}`;
      const title = generateConverterTitle(ethToken.ticker, fiat.code);
      excelData.push({
        'From Token': ethToken.name,
        'From Ticker': ethToken.ticker,
        'To Token/Currency': fiat.name,
        'To Ticker': fiat.code,
        'URL': url,
        'Title': title
      });
    });
  }
  
  
  // 3. BTC to top tokens
  if (btcToken) {
    const btcSlug = generateTokenUrl(btcToken.name, btcToken.ticker);
    const allTokens = tokens.filter(t => t.ticker !== 'BTC');
    
    allTokens.forEach(token => {
      const tokenSlug = generateTokenUrl(token.name, token.ticker);
      const url = `${baseUrl}/${btcSlug}/${tokenSlug}`;
      const title = generateConverterTitle(btcToken.ticker, token.ticker);
      excelData.push({
        'From Token': btcToken.name,
        'From Ticker': btcToken.ticker,
        'To Token/Currency': token.name,
        'To Ticker': token.ticker,
        'URL': url,
        'Title': title
      });
    });
  }
  
  // 4. ETH to top tokens
  if (ethToken) {
    const ethSlug = generateTokenUrl(ethToken.name, ethToken.ticker);
    const allTokens = tokens.filter(t => t.ticker !== 'ETH');
    
    allTokens.forEach(token => {
      const tokenSlug = generateTokenUrl(token.name, token.ticker);
      const url = `${baseUrl}/${ethSlug}/${tokenSlug}`;
      const title = generateConverterTitle(ethToken.ticker, token.ticker);
      excelData.push({
        'From Token': ethToken.name,
        'From Ticker': ethToken.ticker,
        'To Token/Currency': token.name,
        'To Ticker': token.ticker,
        'URL': url,
        'Title': title
      });
    });
  }

  // 5. USDT to top tokens
  const usdtToken = tokens.find(t => t.ticker === 'USDT');
  if (usdtToken) {
    const usdtSlug = generateTokenUrl(usdtToken.name, usdtToken.ticker);
    const allTokens = tokens.filter(t => t.ticker !== 'USDT');
    
    allTokens.forEach(token => {
      const tokenSlug = generateTokenUrl(token.name, token.ticker);
      const url = `${baseUrl}/${tokenSlug}/${usdtSlug}`;
      const title = generateConverterTitle(usdtToken.ticker, token.ticker);
      excelData.push({
        'From Token': usdtToken.name,
        'From Ticker': usdtToken.ticker,
        'To Token/Currency': token.name,
        'To Ticker': token.ticker,
        'URL': url,
        'Title': title
      });
    });
  }
  
//   // 6. All tokens to USD
//   tokens.forEach(token => {
//     const tokenSlug = generateTokenUrl(token.name, token.ticker);
//     const url = `${baseUrl}/${tokenSlug}/usd`;
//     const title = generateConverterTitle(token.ticker, 'USD');
//     excelData.push({
//       'From Token': token.name,
//       'From Ticker': token.ticker,
//       'To Token/Currency': 'US Dollar',
//       'To Ticker': 'USD',
//       'URL': url,
//       'Title': title
//     });
//   });
  
  console.log(`Generated ${excelData.length} URL combinations`);
  
  // Create Excel workbook and worksheet
  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(excelData);
  
  // Set column widths for better readability
  const colWidths = [
    { wch: 25 },  // From Token
    { wch: 15 },  // From Ticker
    { wch: 25 },  // To Token/Currency
    { wch: 15 },  // To Ticker
    { wch: 70 },  // URL
    { wch: 80 }   // Title
  ];
  
  worksheet['!cols'] = colWidths;
  
  // Add the worksheet to the workbook
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Converter URLs');
  
  // Create the output directory if it doesn't exist
  const outputDir = argv.output || path.join(__dirname, '..');
  if (!fs.existsSync(outputDir)) {
    console.log(`Creating output directory: ${outputDir}`);
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Define the output file path with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputPath = path.join(outputDir, `converter-urls-${timestamp}.xlsx`);
  
  // Write the workbook to a file
  xlsx.writeFile(workbook, outputPath);
  
  console.log(`Excel file generated successfully: ${outputPath}`);
}

// Execute the main function
generateConverterUrlsExcel()
  .catch(error => {
    console.error('Error generating converter URLs Excel:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 