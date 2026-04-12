// ═══════════════════════════════════════════════════════
//  GLOBAL SCOUT — Game Logic
// ═══════════════════════════════════════════════════════

const COUNTRIES = [
  // AFRICA
  { id: 'DZ', name: 'Algeria', population: 45600000, export: 'Petroleum & natural gas', capital: 'Algiers', area: 2381741 },
  { id: 'AO', name: 'Angola', population: 34500000, export: 'Crude oil', capital: 'Luanda', area: 1246700 },
  { id: 'BJ', name: 'Benin', population: 12800000, export: 'Cotton', capital: 'Porto-Novo', area: 112622 },
  { id: 'BW', name: 'Botswana', population: 2400000, export: 'Diamonds', capital: 'Gaborone', area: 581730 },
  { id: 'BF', name: 'Burkina Faso', population: 22700000, export: 'Gold', capital: 'Ouagadougou', area: 274200 },
  { id: 'BI', name: 'Burundi', population: 12600000, export: 'Coffee', capital: 'Gitega', area: 27834 },
  { id: 'CV', name: 'Cabo Verde', population: 560000, export: 'Fish', capital: 'Praia', area: 4033 },
  { id: 'CM', name: 'Cameroon', population: 27200000, export: 'Crude oil', capital: 'Yaoundé', area: 475442 },
  { id: 'CF', name: 'Central African Republic', population: 4900000, export: 'Timber', capital: 'Bangui', area: 622984 },
  { id: 'TD', name: 'Chad', population: 17400000, export: 'Crude oil', capital: "N'Djamena", area: 1284000 },
  { id: 'KM', name: 'Comoros', population: 870000, export: 'Vanilla', capital: 'Moroni', area: 1861 },
  { id: 'CD', name: 'Democratic Republic of the Congo', population: 99000000, export: 'Cobalt', capital: 'Kinshasa', area: 2344858 },
  { id: 'CG', name: 'Republic of the Congo', population: 5800000, export: 'Petroleum', capital: 'Brazzaville', area: 342000 },
  { id: 'CI', name: "Côte d'Ivoire", population: 27500000, export: 'Cocoa', capital: 'Yamoussoukro', area: 322463 },
  { id: 'DJ', name: 'Djibouti', population: 1080000, export: 'Re-exports', capital: 'Djibouti', area: 23200 },
  { id: 'EG', name: 'Egypt', population: 105000000, export: 'Petroleum products', capital: 'Cairo', area: 1001449 },
  { id: 'GQ', name: 'Equatorial Guinea', population: 1500000, export: 'Crude oil', capital: 'Malabo', area: 28051 },
  { id: 'ER', name: 'Eritrea', population: 3600000, export: 'Gold', capital: 'Asmara', area: 117600 },
  { id: 'SZ', name: 'Eswatini', population: 1200000, export: 'Sugar', capital: 'Mbabane', area: 17364 },
  { id: 'ET', name: 'Ethiopia', population: 123000000, export: 'Coffee', capital: 'Addis Ababa', area: 1104300 },
  { id: 'GA', name: 'Gabon', population: 2200000, export: 'Crude oil', capital: 'Libreville', area: 267668 },
  { id: 'GM', name: 'Gambia', population: 2600000, export: 'Groundnuts', capital: 'Banjul', area: 10689 },
  { id: 'GH', name: 'Ghana', population: 33500000, export: 'Gold', capital: 'Accra', area: 238533 },
  { id: 'GN', name: 'Guinea', population: 13500000, export: 'Bauxite', capital: 'Conakry', area: 245857 },
  { id: 'GW', name: 'Guinea-Bissau', population: 2100000, export: 'Cashew nuts', capital: 'Bissau', area: 36125 },
  { id: 'KE', name: 'Kenya', population: 55100000, export: 'Tea', capital: 'Nairobi', area: 580367 },
  { id: 'LS', name: 'Lesotho', population: 2200000, export: 'Diamonds', capital: 'Maseru', area: 30355 },
  { id: 'LR', name: 'Liberia', population: 5300000, export: 'Rubber', capital: 'Monrovia', area: 111369 },
  { id: 'LY', name: 'Libya', population: 7000000, export: 'Crude oil', capital: 'Tripoli', area: 1759541 },
  { id: 'MG', name: 'Madagascar', population: 27700000, export: 'Vanilla', capital: 'Antananarivo', area: 587041 },
  { id: 'MW', name: 'Malawi', population: 20200000, export: 'Tobacco', capital: 'Lilongwe', area: 118484 },
  { id: 'ML', name: 'Mali', population: 22400000, export: 'Gold', capital: 'Bamako', area: 1240192 },
  { id: 'MR', name: 'Mauritania', population: 4600000, export: 'Iron ore', capital: 'Nouakchott', area: 1030700 },
  { id: 'MU', name: 'Mauritius', population: 1300000, export: 'Textiles', capital: 'Port Louis', area: 2040 },
  { id: 'MA', name: 'Morocco', population: 37500000, export: 'Phosphates', capital: 'Rabat', area: 446550 },
  { id: 'MZ', name: 'Mozambique', population: 32800000, export: 'Aluminium', capital: 'Maputo', area: 801590 },
  { id: 'NA', name: 'Namibia', population: 2600000, export: 'Diamonds', capital: 'Windhoek', area: 824292 },
  { id: 'NE', name: 'Niger', population: 25300000, export: 'Uranium', capital: 'Niamey', area: 1267000 },
  { id: 'NG', name: 'Nigeria', population: 218500000, export: 'Crude oil', capital: 'Abuja', area: 923768 },
  { id: 'RW', name: 'Rwanda', population: 13800000, export: 'Coffee', capital: 'Kigali', area: 26338 },
  { id: 'ST', name: 'São Tomé and Príncipe', population: 220000, export: 'Cocoa', capital: 'São Tomé', area: 964 },
  { id: 'SN', name: 'Senegal', population: 17200000, export: 'Fish', capital: 'Dakar', area: 196722 },
  { id: 'SC', name: 'Seychelles', population: 100000, export: 'Fish', capital: 'Victoria', area: 459 },
  { id: 'SL', name: 'Sierra Leone', population: 8400000, export: 'Iron ore', capital: 'Freetown', area: 71740 },
  { id: 'SO', name: 'Somalia', population: 16400000, export: 'Livestock', capital: 'Mogadishu', area: 637657 },
  { id: 'ZA', name: 'South Africa', population: 60000000, export: 'Gold', capital: 'Pretoria', area: 1219090 },
  { id: 'SS', name: 'South Sudan', population: 11100000, export: 'Crude oil', capital: 'Juba', area: 619745 },
  { id: 'SD', name: 'Sudan', population: 45700000, export: 'Gold', capital: 'Khartoum', area: 1861484 },
  { id: 'TZ', name: 'Tanzania', population: 63300000, export: 'Gold', capital: 'Dodoma', area: 945087 },
  { id: 'TG', name: 'Togo', population: 8800000, export: 'Cotton', capital: 'Lomé', area: 56785 },
  { id: 'TN', name: 'Tunisia', population: 12000000, export: 'Petroleum products', capital: 'Tunis', area: 163610 },
  { id: 'UG', name: 'Uganda', population: 47200000, export: 'Coffee', capital: 'Kampala', area: 241038 },
  { id: 'ZM', name: 'Zambia', population: 19500000, export: 'Copper', capital: 'Lusaka', area: 752618 },
  { id: 'ZW', name: 'Zimbabwe', population: 15100000, export: 'Tobacco', capital: 'Harare', area: 390757 },

  // ASIA
  { id: 'AF', name: 'Afghanistan', population: 40100000, export: 'Fruits & nuts', capital: 'Kabul', area: 652230 },
  { id: 'AM', name: 'Armenia', population: 2960000, export: 'Copper ore', capital: 'Yerevan', area: 29743 },
  { id: 'AZ', name: 'Azerbaijan', population: 10100000, export: 'Crude oil', capital: 'Baku', area: 86600 },
  { id: 'BH', name: 'Bahrain', population: 1470000, export: 'Petroleum products', capital: 'Manama', area: 778 },
  { id: 'BD', name: 'Bangladesh', population: 167000000, export: 'Garments', capital: 'Dhaka', area: 147570 },
  { id: 'BT', name: 'Bhutan', population: 780000, export: 'Electricity', capital: 'Thimphu', area: 38394 },
  { id: 'BN', name: 'Brunei', population: 440000, export: 'Crude oil', capital: 'Bandar Seri Begawan', area: 5765 },
  { id: 'KH', name: 'Cambodia', population: 16700000, export: 'Garments', capital: 'Phnom Penh', area: 181035 },
  { id: 'CN', name: 'China', population: 1400000000, export: 'Electronics', capital: 'Beijing', area: 9596960 },
  { id: 'CY', name: 'Cyprus', population: 1250000, export: 'Pharmaceuticals', capital: 'Nicosia', area: 9251 },
  { id: 'GE', name: 'Georgia', population: 3700000, export: 'Copper ore', capital: 'Tbilisi', area: 69700 },
  { id: 'IN', name: 'India', population: 1428000000, export: 'Petroleum products', capital: 'New Delhi', area: 3287263 },
  { id: 'ID', name: 'Indonesia', population: 277000000, export: 'Palm oil', capital: 'Jakarta', area: 1904569 },
  { id: 'IR', name: 'Iran', population: 87000000, export: 'Petroleum', capital: 'Tehran', area: 1648195 },
  { id: 'IQ', name: 'Iraq', population: 42200000, export: 'Crude oil', capital: 'Baghdad', area: 438317 },
  { id: 'IL', name: 'Israel', population: 9800000, export: 'Diamonds', capital: 'Jerusalem', area: 20770 },
  { id: 'JP', name: 'Japan', population: 125000000, export: 'Motor vehicles', capital: 'Tokyo', area: 377930 },
  { id: 'JO', name: 'Jordan', population: 10300000, export: 'Phosphates', capital: 'Amman', area: 89342 },
  { id: 'KZ', name: 'Kazakhstan', population: 19300000, export: 'Crude oil', capital: 'Astana', area: 2724900 },
  { id: 'KW', name: 'Kuwait', population: 4300000, export: 'Crude oil', capital: 'Kuwait City', area: 17818 },
  { id: 'KG', name: 'Kyrgyzstan', population: 6900000, export: 'Gold', capital: 'Bishkek', area: 199951 },
  { id: 'LA', name: 'Laos', population: 7400000, export: 'Electricity', capital: 'Vientiane', area: 236800 },
  { id: 'LB', name: 'Lebanon', population: 5500000, export: 'Jewellery', capital: 'Beirut', area: 10452 },
  { id: 'MY', name: 'Malaysia', population: 33200000, export: 'Semiconductors', capital: 'Kuala Lumpur', area: 329847 },
  { id: 'MV', name: 'Maldives', population: 520000, export: 'Fish', capital: 'Malé', area: 298 },
  { id: 'MN', name: 'Mongolia', population: 3400000, export: 'Coal', capital: 'Ulaanbaatar', area: 1564116 },
  { id: 'MM', name: 'Myanmar', population: 54400000, export: 'Natural gas', capital: 'Naypyidaw', area: 676578 },
  { id: 'NP', name: 'Nepal', population: 30000000, export: 'Carpets', capital: 'Kathmandu', area: 147181 },
  { id: 'KP', name: 'North Korea', population: 25900000, export: 'Coal', capital: 'Pyongyang', area: 120538 },
  { id: 'OM', name: 'Oman', population: 4600000, export: 'Crude oil', capital: 'Muscat', area: 309500 },
  { id: 'PK', name: 'Pakistan', population: 231000000, export: 'Textiles', capital: 'Islamabad', area: 881913 },
  { id: 'PH', name: 'Philippines', population: 113000000, export: 'Semiconductors', capital: 'Manila', area: 300000 },
  { id: 'QA', name: 'Qatar', population: 2700000, export: 'Liquefied natural gas', capital: 'Doha', area: 11586 },
  { id: 'SA', name: 'Saudi Arabia', population: 36000000, export: 'Crude oil', capital: 'Riyadh', area: 2149690 },
  { id: 'SG', name: 'Singapore', population: 5900000, export: 'Semiconductors', capital: 'Singapore', area: 728 },
  { id: 'KR', name: 'South Korea', population: 51700000, export: 'Semiconductors', capital: 'Seoul', area: 100210 },
  { id: 'LK', name: 'Sri Lanka', population: 22200000, export: 'Tea', capital: 'Sri Jayawardenepura Kotte', area: 65610 },
  { id: 'SY', name: 'Syria', population: 21300000, export: 'Crude oil', capital: 'Damascus', area: 185180 },
  { id: 'TJ', name: 'Tajikistan', population: 9750000, export: 'Aluminium', capital: 'Dushanbe', area: 143100 },
  { id: 'TH', name: 'Thailand', population: 72000000, export: 'Vehicles & parts', capital: 'Bangkok', area: 513120 },
  { id: 'TL', name: 'Timor-Leste', population: 1360000, export: 'Petroleum', capital: 'Dili', area: 14874 },
  { id: 'TR', name: 'Turkey', population: 85200000, export: 'Motor vehicles', capital: 'Ankara', area: 783562 },
  { id: 'TM', name: 'Turkmenistan', population: 6100000, export: 'Natural gas', capital: 'Ashgabat', area: 488100 },
  { id: 'AE', name: 'United Arab Emirates', population: 9600000, export: 'Crude oil', capital: 'Abu Dhabi', area: 83600 },
  { id: 'UZ', name: 'Uzbekistan', population: 35800000, export: 'Gold', capital: 'Tashkent', area: 448978 },
  { id: 'VN', name: 'Vietnam', population: 97500000, export: 'Electronics', capital: 'Hanoi', area: 331212 },
  { id: 'YE', name: 'Yemen', population: 33700000, export: 'Crude oil', capital: "Sana'a", area: 527968 },

  // EUROPE
  { id: 'AL', name: 'Albania', population: 2800000, export: 'Chromium ore', capital: 'Tirana', area: 28748 },
  { id: 'AD', name: 'Andorra', population: 80000, export: 'Tobacco', capital: 'Andorra la Vella', area: 468 },
  { id: 'AT', name: 'Austria', population: 9100000, export: 'Machinery', capital: 'Vienna', area: 83871 },
  { id: 'BY', name: 'Belarus', population: 9400000, export: 'Petroleum products', capital: 'Minsk', area: 207600 },
  { id: 'BE', name: 'Belgium', population: 11500000, export: 'Pharmaceuticals', capital: 'Brussels', area: 30528 },
  { id: 'BA', name: 'Bosnia and Herzegovina', population: 3200000, export: 'Iron & steel', capital: 'Sarajevo', area: 51197 },
  { id: 'BG', name: 'Bulgaria', population: 6500000, export: 'Copper', capital: 'Sofia', area: 110879 },
  { id: 'HR', name: 'Croatia', population: 3900000, export: 'Pharmaceuticals', capital: 'Zagreb', area: 56594 },
  { id: 'CZ', name: 'Czech Republic', population: 10700000, export: 'Machinery', capital: 'Prague', area: 78867 },
  { id: 'DK', name: 'Denmark', population: 5900000, export: 'Pharmaceuticals', capital: 'Copenhagen', area: 43094 },
  { id: 'EE', name: 'Estonia', population: 1330000, export: 'Machinery', capital: 'Tallinn', area: 45228 },
  { id: 'FI', name: 'Finland', population: 5500000, export: 'Paper & pulp', capital: 'Helsinki', area: 338145 },
  { id: 'FR', name: 'France', population: 67800000, export: 'Aircraft', capital: 'Paris', area: 551695 },
  { id: 'DE', name: 'Germany', population: 84300000, export: 'Motor vehicles', capital: 'Berlin', area: 357114 },
  { id: 'GR', name: 'Greece', population: 10400000, export: 'Petroleum products', capital: 'Athens', area: 131957 },
  { id: 'HU', name: 'Hungary', population: 9700000, export: 'Motor vehicles', capital: 'Budapest', area: 93028 },
  { id: 'IS', name: 'Iceland', population: 370000, export: 'Fish', capital: 'Reykjavik', area: 103000 },
  { id: 'IE', name: 'Ireland', population: 5100000, export: 'Pharmaceuticals', capital: 'Dublin', area: 70273 },
  { id: 'IT', name: 'Italy', population: 60000000, export: 'Machinery', capital: 'Rome', area: 301340 },
  { id: 'LV', name: 'Latvia', population: 1840000, export: 'Wood products', capital: 'Riga', area: 64589 },
  { id: 'LI', name: 'Liechtenstein', population: 38500, export: 'Machinery', capital: 'Vaduz', area: 160 },
  { id: 'LT', name: 'Lithuania', population: 2820000, export: 'Petroleum products', capital: 'Vilnius', area: 65300 },
  { id: 'LU', name: 'Luxembourg', population: 650000, export: 'Steel', capital: 'Luxembourg City', area: 2586 },
  { id: 'MT', name: 'Malta', population: 530000, export: 'Machinery', capital: 'Valletta', area: 316 },
  { id: 'MD', name: 'Moldova', population: 2600000, export: 'Beverages', capital: 'Chișinău', area: 33846 },
  { id: 'MC', name: 'Monaco', population: 36000, export: 'Pharmaceuticals', capital: 'Monaco', area: 2 },
  { id: 'ME', name: 'Montenegro', population: 620000, export: 'Aluminium', capital: 'Podgorica', area: 13812 },
  { id: 'NL', name: 'Netherlands', population: 17600000, export: 'Petroleum products', capital: 'Amsterdam', area: 41543 },
  { id: 'MK', name: 'North Macedonia', population: 2080000, export: 'Clothing', capital: 'Skopje', area: 25713 },
  { id: 'NO', name: 'Norway', population: 5400000, export: 'Crude oil', capital: 'Oslo', area: 385207 },
  { id: 'PL', name: 'Poland', population: 38000000, export: 'Machinery', capital: 'Warsaw', area: 312696 },
  { id: 'PT', name: 'Portugal', population: 10300000, export: 'Motor vehicles', capital: 'Lisbon', area: 92212 },
  { id: 'RO', name: 'Romania', population: 19000000, export: 'Motor vehicles', capital: 'Bucharest', area: 238397 },
  { id: 'RU', name: 'Russia', population: 144000000, export: 'Crude oil', capital: 'Moscow', area: 17098242 },
  { id: 'SM', name: 'San Marino', population: 34000, export: 'Machinery', capital: 'San Marino', area: 61 },
  { id: 'RS', name: 'Serbia', population: 6800000, export: 'Motor vehicles', capital: 'Belgrade', area: 77474 },
  { id: 'SK', name: 'Slovakia', population: 5500000, export: 'Motor vehicles', capital: 'Bratislava', area: 49035 },
  { id: 'SI', name: 'Slovenia', population: 2100000, export: 'Machinery', capital: 'Ljubljana', area: 20273 },
  { id: 'ES', name: 'Spain', population: 47400000, export: 'Motor vehicles', capital: 'Madrid', area: 505990 },
  { id: 'SE', name: 'Sweden', population: 10500000, export: 'Machinery', capital: 'Stockholm', area: 450295 },
  { id: 'CH', name: 'Switzerland', population: 8700000, export: 'Pharmaceuticals', capital: 'Bern', area: 41285 },
  { id: 'UA', name: 'Ukraine', population: 37000000, export: 'Steel', capital: 'Kyiv', area: 603550 },
  { id: 'GB', name: 'United Kingdom', population: 67300000, export: 'Machinery', capital: 'London', area: 242495 },

  // NORTH & CENTRAL AMERICA + CARIBBEAN
  { id: 'AG', name: 'Antigua and Barbuda', population: 98000, export: 'Petroleum products', capital: "Saint John's", area: 442 },
  { id: 'BS', name: 'Bahamas', population: 400000, export: 'Petroleum products', capital: 'Nassau', area: 13943 },
  { id: 'BB', name: 'Barbados', population: 280000, export: 'Sugar', capital: 'Bridgetown', area: 430 },
  { id: 'BZ', name: 'Belize', population: 400000, export: 'Petroleum', capital: 'Belmopan', area: 22966 },
  { id: 'CA', name: 'Canada', population: 38200000, export: 'Crude oil', capital: 'Ottawa', area: 9984670 },
  { id: 'CR', name: 'Costa Rica', population: 5200000, export: 'Medical devices', capital: 'San José', area: 51100 },
  { id: 'CU', name: 'Cuba', population: 11200000, export: 'Tobacco', capital: 'Havana', area: 109884 },
  { id: 'DM', name: 'Dominica', population: 72000, export: 'Bananas', capital: 'Roseau', area: 751 },
  { id: 'DO', name: 'Dominican Republic', population: 11000000, export: 'Medical instruments', capital: 'Santo Domingo', area: 48671 },
  { id: 'SV', name: 'El Salvador', population: 6500000, export: 'Coffee', capital: 'San Salvador', area: 21041 },
  { id: 'GD', name: 'Grenada', population: 113000, export: 'Nutmeg', capital: "Saint George's", area: 344 },
  { id: 'GT', name: 'Guatemala', population: 17600000, export: 'Coffee', capital: 'Guatemala City', area: 108889 },
  { id: 'HT', name: 'Haiti', population: 11500000, export: 'Apparel', capital: 'Port-au-Prince', area: 27750 },
  { id: 'HN', name: 'Honduras', population: 10300000, export: 'Coffee', capital: 'Tegucigalpa', area: 112492 },
  { id: 'JM', name: 'Jamaica', population: 2800000, export: 'Alumina', capital: 'Kingston', area: 10991 },
  { id: 'MX', name: 'Mexico', population: 128000000, export: 'Motor vehicles', capital: 'Mexico City', area: 1964375 },
  { id: 'NI', name: 'Nicaragua', population: 6700000, export: 'Coffee', capital: 'Managua', area: 130373 },
  { id: 'PA', name: 'Panama', population: 4300000, export: 'Gold', capital: 'Panama City', area: 75417 },
  { id: 'KN', name: 'Saint Kitts and Nevis', population: 53000, export: 'Electronics', capital: 'Basseterre', area: 261 },
  { id: 'LC', name: 'Saint Lucia', population: 180000, export: 'Bananas', capital: 'Castries', area: 616 },
  { id: 'VC', name: 'Saint Vincent and the Grenadines', population: 110000, export: 'Bananas', capital: 'Kingstown', area: 389 },
  { id: 'TT', name: 'Trinidad and Tobago', population: 1400000, export: 'Petroleum products', capital: 'Port of Spain', area: 5128 },
  { id: 'US', name: 'United States', population: 335000000, export: 'Petroleum products', capital: 'Washington, D.C.', area: 9833517 },

  // SOUTH AMERICA
  { id: 'AR', name: 'Argentina', population: 45600000, export: 'Soybeans', capital: 'Buenos Aires', area: 2780400 },
  { id: 'BO', name: 'Bolivia', population: 12100000, export: 'Natural gas', capital: 'Sucre', area: 1098581 },
  { id: 'BR', name: 'Brazil', population: 215000000, export: 'Soybeans', capital: 'Brasília', area: 8515767 },
  { id: 'CL', name: 'Chile', population: 19600000, export: 'Copper', capital: 'Santiago', area: 756102 },
  { id: 'CO', name: 'Colombia', population: 51900000, export: 'Crude oil', capital: 'Bogotá', area: 1141748 },
  { id: 'EC', name: 'Ecuador', population: 18000000, export: 'Petroleum', capital: 'Quito', area: 283561 },
  { id: 'GY', name: 'Guyana', population: 800000, export: 'Crude oil', capital: 'Georgetown', area: 214969 },
  { id: 'PY', name: 'Paraguay', population: 7400000, export: 'Soybeans', capital: 'Asunción', area: 406752 },
  { id: 'PE', name: 'Peru', population: 33000000, export: 'Copper', capital: 'Lima', area: 1285216 },
  { id: 'SR', name: 'Suriname', population: 610000, export: 'Gold', capital: 'Paramaribo', area: 163820 },
  { id: 'UY', name: 'Uruguay', population: 3600000, export: 'Soybeans', capital: 'Montevideo', area: 176215 },
  { id: 'VE', name: 'Venezuela', population: 28000000, export: 'Crude oil', capital: 'Caracas', area: 912050 },

  // OCEANIA
  { id: 'AU', name: 'Australia', population: 26000000, export: 'Iron ore', capital: 'Canberra', area: 7692024 },
  { id: 'FJ', name: 'Fiji', population: 900000, export: 'Sugar', capital: 'Suva', area: 18274 },
  { id: 'KI', name: 'Kiribati', population: 120000, export: 'Fish', capital: 'South Tarawa', area: 811 },
  { id: 'MH', name: 'Marshall Islands', population: 42000, export: 'Fish', capital: 'Majuro', area: 181 },
  { id: 'FM', name: 'Micronesia', population: 115000, export: 'Fish', capital: 'Palikir', area: 702 },
  { id: 'NR', name: 'Nauru', population: 10000, export: 'Phosphate', capital: 'Yaren', area: 21 },
  { id: 'NZ', name: 'New Zealand', population: 5100000, export: 'Dairy products', capital: 'Wellington', area: 270467 },
  { id: 'PW', name: 'Palau', population: 18000, export: 'Fish', capital: 'Ngerulmud', area: 459 },
  { id: 'PG', name: 'Papua New Guinea', population: 10000000, export: 'Gold', capital: 'Port Moresby', area: 462840 },
  { id: 'WS', name: 'Samoa', population: 220000, export: 'Fish', capital: 'Apia', area: 2842 },
  { id: 'SB', name: 'Solomon Islands', population: 720000, export: 'Timber', capital: 'Honiara', area: 28896 },
  { id: 'TO', name: 'Tonga', population: 100000, export: 'Fish', capital: "Nuku'alofa", area: 747 },
  { id: 'TV', name: 'Tuvalu', population: 11000, export: 'Fish', capital: 'Funafuti', area: 26 },
  { id: 'VU', name: 'Vanuatu', population: 320000, export: 'Copra', capital: 'Port Vila', area: 12189 },
];

// ═══════════════════════════════════════════════════════
//  CONTINENT MAP
// ═══════════════════════════════════════════════════════
const CONTINENT_BY_ID = {
  // Africa
  DZ:'Africa',AO:'Africa',BJ:'Africa',BW:'Africa',BF:'Africa',BI:'Africa',
  CV:'Africa',CM:'Africa',CF:'Africa',TD:'Africa',KM:'Africa',CD:'Africa',
  CG:'Africa',CI:'Africa',DJ:'Africa',EG:'Africa',GQ:'Africa',ER:'Africa',
  SZ:'Africa',ET:'Africa',GA:'Africa',GM:'Africa',GH:'Africa',GN:'Africa',
  GW:'Africa',KE:'Africa',LS:'Africa',LR:'Africa',LY:'Africa',MG:'Africa',
  MW:'Africa',ML:'Africa',MR:'Africa',MU:'Africa',MA:'Africa',MZ:'Africa',
  NA:'Africa',NE:'Africa',NG:'Africa',RW:'Africa',ST:'Africa',SN:'Africa',
  SC:'Africa',SL:'Africa',SO:'Africa',ZA:'Africa',SS:'Africa',SD:'Africa',
  TZ:'Africa',TG:'Africa',TN:'Africa',UG:'Africa',ZM:'Africa',ZW:'Africa',
  // Asia
  AF:'Asia',AM:'Asia',AZ:'Asia',BH:'Asia',BD:'Asia',BT:'Asia',BN:'Asia',
  KH:'Asia',CN:'Asia',CY:'Asia',GE:'Asia',IN:'Asia',ID:'Asia',IR:'Asia',
  IQ:'Asia',IL:'Asia',JP:'Asia',JO:'Asia',KZ:'Asia',KW:'Asia',KG:'Asia',
  LA:'Asia',LB:'Asia',MY:'Asia',MV:'Asia',MN:'Asia',MM:'Asia',NP:'Asia',
  KP:'Asia',OM:'Asia',PK:'Asia',PH:'Asia',QA:'Asia',SA:'Asia',SG:'Asia',
  KR:'Asia',LK:'Asia',SY:'Asia',TJ:'Asia',TH:'Asia',TL:'Asia',TR:'Asia',
  TM:'Asia',AE:'Asia',UZ:'Asia',VN:'Asia',YE:'Asia',
  // Europe
  AL:'Europe',AD:'Europe',AT:'Europe',BY:'Europe',BE:'Europe',BA:'Europe',
  BG:'Europe',HR:'Europe',CZ:'Europe',DK:'Europe',EE:'Europe',FI:'Europe',
  FR:'Europe',DE:'Europe',GR:'Europe',HU:'Europe',IS:'Europe',IE:'Europe',
  IT:'Europe',LV:'Europe',LI:'Europe',LT:'Europe',LU:'Europe',MT:'Europe',
  MD:'Europe',MC:'Europe',ME:'Europe',NL:'Europe',MK:'Europe',NO:'Europe',
  PL:'Europe',PT:'Europe',RO:'Europe',RU:'Europe',SM:'Europe',RS:'Europe',
  SK:'Europe',SI:'Europe',ES:'Europe',SE:'Europe',CH:'Europe',UA:'Europe',
  GB:'Europe',
  // North & Central America + Caribbean
  AG:'N. America',BS:'N. America',BB:'N. America',BZ:'N. America',CA:'N. America',
  CR:'N. America',CU:'N. America',DM:'N. America',DO:'N. America',SV:'N. America',
  GD:'N. America',GT:'N. America',HT:'N. America',HN:'N. America',JM:'N. America',
  MX:'N. America',NI:'N. America',PA:'N. America',KN:'N. America',LC:'N. America',
  VC:'N. America',TT:'N. America',US:'N. America',
  // South America
  AR:'S. America',BO:'S. America',BR:'S. America',CL:'S. America',CO:'S. America',
  EC:'S. America',GY:'S. America',PY:'S. America',PE:'S. America',SR:'S. America',
  UY:'S. America',VE:'S. America',
  // Oceania
  AU:'Oceania',FJ:'Oceania',KI:'Oceania',MH:'Oceania',FM:'Oceania',NR:'Oceania',
  NZ:'Oceania',PW:'Oceania',PG:'Oceania',WS:'Oceania',SB:'Oceania',TO:'Oceania',
  TV:'Oceania',VU:'Oceania',
};

// ═══════════════════════════════════════════════════════
//  ISO2 → ISO NUMERIC MAP  (for world-atlas GeoJSON lookup)
// ═══════════════════════════════════════════════════════
const ISO2_TO_NUMERIC = {
  // Africa
  DZ:'012',AO:'024',BJ:'204',BW:'072',BF:'854',BI:'108',CV:'132',CM:'120',
  CF:'140',TD:'148',KM:'174',CD:'180',CG:'178',CI:'384',DJ:'262',EG:'818',
  GQ:'226',ER:'232',SZ:'748',ET:'231',GA:'266',GM:'270',GH:'288',GN:'324',
  GW:'624',KE:'404',LS:'426',LR:'430',LY:'434',MG:'450',MW:'454',ML:'466',
  MR:'478',MU:'480',MA:'504',MZ:'508',NA:'516',NE:'562',NG:'566',RW:'646',
  ST:'678',SN:'686',SC:'690',SL:'694',SO:'706',ZA:'710',SS:'728',SD:'729',
  TZ:'834',TG:'768',TN:'788',UG:'800',ZM:'894',ZW:'716',
  // Asia
  AF:'004',AM:'051',AZ:'031',BH:'048',BD:'050',BT:'064',BN:'096',KH:'116',
  CN:'156',CY:'196',GE:'268',IN:'356',ID:'360',IR:'364',IQ:'368',IL:'376',
  JP:'392',JO:'400',KZ:'398',KW:'414',KG:'417',LA:'418',LB:'422',MY:'458',
  MV:'462',MN:'496',MM:'104',NP:'524',KP:'408',OM:'512',PK:'586',PH:'608',
  QA:'634',SA:'682',SG:'702',KR:'410',LK:'144',SY:'760',TJ:'762',TH:'764',
  TL:'626',TR:'792',TM:'795',AE:'784',UZ:'860',VN:'704',YE:'887',
  // Europe
  AL:'008',AD:'020',AT:'040',BY:'112',BE:'056',BA:'070',BG:'100',HR:'191',
  CZ:'203',DK:'208',EE:'233',FI:'246',FR:'250',DE:'276',GR:'300',HU:'348',
  IS:'352',IE:'372',IT:'380',LV:'428',LI:'438',LT:'440',LU:'442',MT:'470',
  MD:'498',MC:'492',ME:'499',NL:'528',MK:'807',NO:'578',PL:'616',PT:'620',
  RO:'642',RU:'643',SM:'674',RS:'688',SK:'703',SI:'705',ES:'724',SE:'752',
  CH:'756',UA:'804',GB:'826',
  // N. America
  AG:'028',BS:'044',BB:'052',BZ:'084',CA:'124',CR:'188',CU:'192',DM:'212',
  DO:'214',SV:'222',GD:'308',GT:'320',HT:'332',HN:'340',JM:'388',MX:'484',
  NI:'558',PA:'591',KN:'659',LC:'662',VC:'670',TT:'780',US:'840',
  // S. America
  AR:'032',BO:'068',BR:'076',CL:'152',CO:'170',EC:'218',GY:'328',PY:'600',
  PE:'604',SR:'740',UY:'858',VE:'862',
  // Oceania
  AU:'036',FJ:'242',KI:'296',MH:'584',FM:'583',NR:'520',NZ:'554',PW:'585',
  PG:'598',WS:'882',SB:'090',TO:'776',TV:'798',VU:'548',
};

// ═══════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════
let pool = [];           // countries still to be guessed
let currentCountry = null;
let score = 0;
let highScore = parseInt(localStorage.getItem('globalScoutHigh') || '0');
let acSelected = -1;    // autocomplete keyboard selection index
let acItems = [];       // filtered autocomplete entries
let selectedContinents = new Set(['Africa','Asia','Europe','N. America','S. America','Oceania']);
let wrongAttempts = 0;  // consecutive wrong guesses for current country
let neighborIndices = []; // topojson neighbor sets per feature index
let numericToCountry = {}; // numeric id string → COUNTRIES entry

// ═══════════════════════════════════════════════════════
//  DOM REFS
// ═══════════════════════════════════════════════════════
const mapContainer  = document.getElementById('map-container');
const globeCanvas   = document.getElementById('globe-canvas');
const scoreEl       = document.getElementById('score-value');
const highScoreEl   = document.getElementById('high-score-value');
const inputEl       = document.getElementById('country-input');
const acList        = document.getElementById('autocomplete-list');
const modalOverlay  = document.getElementById('modal-overlay');
const modalName     = document.getElementById('modal-country-name');
const modalPop      = document.getElementById('modal-population');
const modalExport   = document.getElementById('modal-export');
const modalCapital  = document.getElementById('modal-capital');
const modalArea     = document.getElementById('modal-area');
const nextBtn       = document.getElementById('next-btn');
const endGameBtn    = document.getElementById('end-game-btn');
const progressBar   = document.getElementById('status-progress');
const endgameOverlay= document.getElementById('endgame-overlay');
const endgameFinal  = document.getElementById('endgame-final-score');
const endgameTotal  = document.getElementById('endgame-total');
const restartBtn    = document.getElementById('restart-btn');
const passBtn       = document.getElementById('pass-btn');
const hintEl        = document.getElementById('hint-text');
const modalNeighbors= document.getElementById('modal-neighbors-value');

// ═══════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════
function filteredCountries() {
  return COUNTRIES.filter(c => selectedContinents.has(CONTINENT_BY_ID[c.id]));
}

function init() {
  pool = filteredCountries();
  score = 0;
  updateScoreDisplay();
  pickNext();
}

function updateScoreDisplay() {
  scoreEl.textContent = score;
  highScoreEl.textContent = highScore;
  const total = filteredCountries().length;
  const pct = total > 0 ? ((total - pool.length) / total) * 100 : 0;
  progressBar.style.width = pct + '%';
}

function pickNext() {
  clearActive();

  if (pool.length === 0) {
    showEndgame();
    return;
  }

  const idx = Math.floor(Math.random() * pool.length);
  currentCountry = pool[idx];

  // Find GeoJSON feature and rotate globe to it
  const numId = ISO2_TO_NUMERIC[currentCountry.id];
  activeFeature = numId ? (countriesGeo.find(f => String(f.id) === numId) || null) : null;

  // Compute base (tier 10) scale from current canvas size
  const W = globeCanvas.clientWidth;
  const H = globeCanvas.clientHeight;
  const baseScale = Math.min(W, H) * 0.46;
  if (!globeScale) {
    globeScale = baseScale;
    projection.scale(globeScale).translate([W / 2, H / 2]);
  }

  // Auto-zoom: 10 logarithmic tiers from micro-states to continental giants
  const area = currentCountry.area;
  const zoomMultiplier = area <      200 ? 12    // Monaco, Nauru, San Marino, Liechtenstein
                       : area <      700 ? 8     // Maldives, Malta, Grenada, Barbados
                       : area <    2000  ? 6     // Bahrain, Tonga, Comoros, São Tomé
                       : area <    5000  ? 4.5   // Luxembourg, Samoa, Cabo Verde
                       : area <   15000  ? 3.5   // Brunei, Cyprus, Qatar, Jamaica
                       : area <   50000  ? 2.5   // Kuwait, Belize, Belgium, Armenia
                       : area <  200000  ? 2     // Ireland, Austria, UAE, Czech Republic
                       : area <  600000  ? 1.5   // UK, Germany, Japan, Sweden
                       : area < 2500000  ? 1.2   // Turkey, Pakistan, Mexico, Saudi Arabia
                       :                  1;     // India, Brazil, Russia, Canada, USA
  const targetScale = baseScale * zoomMultiplier;

  // Sequence: zoom out to world view → rotate to country → zoom in to target tier
  animateZoom(baseScale, 350, () => {
    if (activeFeature) {
      rotateTo(activeFeature, () => animateZoom(targetScale, 500, startPulse));
    } else {
      animateZoom(targetScale, 500, () => renderGlobe());
    }
  });

  wrongAttempts = 0;
  updateHintText();
  inputEl.value = '';
  inputEl.placeholder = `Identify this country… (${pool.length} remaining) · Enter to skip`;
  closeAC();
  inputEl.focus();
}

function clearActive() {
  activeFeature = null;
  stopPulse();
  if (zoomFrameId) { cancelAnimationFrame(zoomFrameId); zoomFrameId = null; }
  if (rotateFrameId) { cancelAnimationFrame(rotateFrameId); rotateFrameId = null; }
  renderGlobe();
}

// ═══════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════
function flagEmoji(iso2) {
  const code = iso2.toLowerCase();
  return `<img class="flag-img" src="https://flagcdn.com/w40/${code}.png" alt="${iso2} flag" width="32" height="22">`;
}

function updateHintText() {
  if (!currentCountry || wrongAttempts === 0) {
    hintEl.textContent = '↑↓ navigate · Enter select · scroll/pinch to zoom';
    hintEl.classList.remove('hint-active');
    return;
  }
  let hint;
  if (wrongAttempts === 1)      hint = `Hint: Starts with "${currentCountry.name[0]}"`;
  else                          hint = `Hint: Capital is ${currentCountry.capital}`;
  hintEl.textContent = hint;
  hintEl.classList.add('hint-active');
}

function computeNeighbors(geometries) {
  const arcToFeatures = new Map();
  geometries.forEach((geom, idx) => {
    const rings = geom.type === 'Polygon'      ? geom.arcs
                : geom.type === 'MultiPolygon' ? geom.arcs.flat()
                : [];
    for (const ring of rings) {
      for (const arc of ring) {
        const key = arc < 0 ? ~arc : arc;
        if (!arcToFeatures.has(key)) arcToFeatures.set(key, []);
        arcToFeatures.get(key).push(idx);
      }
    }
  });
  const neighbors = geometries.map(() => new Set());
  for (const features of arcToFeatures.values()) {
    for (let a = 0; a < features.length; a++) {
      for (let b = a + 1; b < features.length; b++) {
        neighbors[features[a]].add(features[b]);
        neighbors[features[b]].add(features[a]);
      }
    }
  }
  return neighbors;
}

function getNeighborNames(country) {
  const numId = ISO2_TO_NUMERIC[country.id];
  if (!numId) return [];
  const featureIndex = countriesGeo.findIndex(f => String(f.id) === numId);
  if (featureIndex === -1 || !neighborIndices[featureIndex]) return [];
  return [...neighborIndices[featureIndex]]
    .map(j => {
      const nId = String(countriesGeo[j].id);
      return numericToCountry[nId]?.name;
    })
    .filter(Boolean)
    .sort();
}

// ═══════════════════════════════════════════════════════
//  GUESSING
// ═══════════════════════════════════════════════════════
function checkGuess(guess) {
  if (!currentCountry) return;
  const norm = s => s.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  if (norm(guess) === norm(currentCountry.name)) {
    handleCorrect();
  } else {
    wrongAttempts++;
    updateHintText();
    inputEl.classList.add('incorrect-shake');
    setTimeout(() => {
      inputEl.classList.remove('incorrect-shake');
      inputEl.value = '';
      closeAC();
      inputEl.focus();
    }, 400);
  }
}

function handleCorrect() {
  score++;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('globalScoutHigh', highScore);
  }
  updateScoreDisplay();

  // Remove from pool
  pool = pool.filter(c => c.id !== currentCountry.id);

  // Show modal
  showModal(currentCountry);
  closeAC();
}

function passCountry() {
  if (!currentCountry) return;
  // Move current to end of pool (put back, skip it for now)
  const skipped = pool.find(c => c.id === currentCountry.id);
  pool = pool.filter(c => c.id !== currentCountry.id);
  if (skipped) pool.push(skipped);
  showModal(currentCountry, '⏭ Skipped');
}

// ═══════════════════════════════════════════════════════
//  MODAL
// ═══════════════════════════════════════════════════════
function showModal(country, label = '✓ Correct!') {
  document.getElementById('modal-correct-label').textContent = label;
  modalName.innerHTML = flagEmoji(country.id) + ' ' + country.name;
  modalPop.textContent = formatPop(country.population);
  modalExport.textContent = country.export;
  modalCapital.textContent = country.capital;
  modalArea.textContent = country.area.toLocaleString() + ' km²';
  const neighbors = getNeighborNames(country);
  modalNeighbors.textContent = neighbors.length > 0 ? neighbors.join(', ') : 'No land borders';
  modalOverlay.classList.add('open');
  nextBtn.focus();
}

function closeModal() {
  modalOverlay.classList.remove('open');
  clearActive();
  pickNext();
  inputEl.focus();
}

function formatPop(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + ' billion';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + ' million';
  if (n >= 1e3) return (n / 1e3).toFixed(0) + ',000';
  return n.toLocaleString();
}

// ═══════════════════════════════════════════════════════
//  END GAME
// ═══════════════════════════════════════════════════════
function showEndgame() {
  clearActive();
  endgameFinal.textContent = score;
  endgameTotal.textContent = filteredCountries().length;
  endgameOverlay.classList.add('open');
}

function restart() {
  endgameOverlay.classList.remove('open');
  modalOverlay.classList.remove('open');
  init();
}

// ═══════════════════════════════════════════════════════
//  AUTOCOMPLETE
// ═══════════════════════════════════════════════════════
function buildAC(query) {
  const q = query.toLowerCase().trim();
  if (!q) { closeAC(); return; }

  const wordStartRe = new RegExp('(?:^|\\s)' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  acItems = pool.filter(c => wordStartRe.test(c.name));
  acSelected = 0;

  if (acItems.length === 0) { closeAC(); return; }

  const highlightRe = new RegExp('((?:^|(?<=\\s))' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'i');
  acList.innerHTML = '';
  acItems.slice(0, 12).forEach((c, i) => {
    const div = document.createElement('div');
    div.className = 'autocomplete-item' + (i === 0 ? ' selected' : '');
    // Highlight matching portion at word start
    const idx = c.name.toLowerCase().search(new RegExp('(?:^|(?<=\\s))' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
    if (idx >= 0) {
      div.innerHTML = c.name.slice(0, idx) +
        '<strong>' + c.name.slice(idx, idx + q.length) + '</strong>' +
        c.name.slice(idx + q.length);
    } else {
      div.textContent = c.name;
    }
    div.addEventListener('mousedown', e => {
      e.preventDefault();
      selectAC(i);
    });
    acList.appendChild(div);
  });

  acList.classList.add('open');
}

function selectAC(index) {
  const item = acItems[index];
  if (!item) return;
  inputEl.value = item.name;
  closeAC();
  checkGuess(item.name);
}

function closeAC() {
  acList.classList.remove('open');
  acSelected = -1;
}

function moveAC(dir) {
  const items = acList.querySelectorAll('.autocomplete-item');
  if (!items.length) return;
  items.forEach(el => el.classList.remove('selected'));
  acSelected = (acSelected + dir + items.length) % items.length;
  items[acSelected].classList.add('selected');
  items[acSelected].scrollIntoView({ block: 'nearest' });
}

// ═══════════════════════════════════════════════════════
//  EVENT LISTENERS
// ═══════════════════════════════════════════════════════
inputEl.addEventListener('input', e => buildAC(e.target.value));

inputEl.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') { e.preventDefault(); moveAC(1); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); moveAC(-1); }
  else if (e.key === 'Enter') {
    e.preventDefault();
    if (acSelected >= 0 && acList.classList.contains('open')) {
      selectAC(acSelected);
    } else if (inputEl.value.trim() === '') {
      passCountry();
    } else {
      checkGuess(inputEl.value);
    }
  }
  else if (e.key === 'Escape') { closeAC(); }
});

inputEl.addEventListener('blur', () => setTimeout(closeAC, 150));

nextBtn.addEventListener('click', closeModal);
endGameBtn.addEventListener('click', showEndgame);
restartBtn.addEventListener('click', restart);
passBtn.addEventListener('click', passCountry);

// Continent filter toggle
document.querySelectorAll('.continent-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const continent = btn.dataset.continent;
    if (selectedContinents.has(continent)) {
      // Don't allow deselecting the last continent
      if (selectedContinents.size === 1) return;
      selectedContinents.delete(continent);
      btn.classList.remove('active');
    } else {
      selectedContinents.add(continent);
      btn.classList.add('active');
    }
    restart();
  });
});

// ═══════════════════════════════════════════════════════
//  GLOBE  (D3 orthographic — canvas-based)
// ═══════════════════════════════════════════════════════
let countriesGeo   = [];
let activeFeature  = null;
let pulsePhase     = 0;
let pulseFrameId   = null;
let rotateFrameId  = null;
let zoomFrameId    = null;
let globeScale     = 0;           // set on first resize
let globeRotate    = [0, -25, 0]; // [λ, φ, γ]
let isDragging     = false;
let dragStart      = null;
let rotateAtDrag   = null;
let lastTouchDist  = null;

const ctx        = globeCanvas.getContext('2d');
const projection = d3.geoOrthographic().clipAngle(90).precision(0.3);
const geoPath    = d3.geoPath().projection(projection).context(ctx);
const graticule  = d3.geoGraticule()();

function resizeGlobe() {
  const W = globeCanvas.clientWidth;
  const H = globeCanvas.clientHeight;
  const dpr = window.devicePixelRatio || 1;
  globeCanvas.width  = W * dpr;
  globeCanvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (!globeScale) globeScale = Math.min(W, H) * 0.46;
  projection.scale(globeScale).translate([W / 2, H / 2]).rotate(globeRotate);
}

function renderGlobe() {
  const W = globeCanvas.clientWidth;
  const H = globeCanvas.clientHeight;
  ctx.clearRect(0, 0, W, H);

  // Ocean
  ctx.beginPath();
  geoPath({ type: 'Sphere' });
  ctx.fillStyle = '#DBEAFE';
  ctx.fill();

  // Graticule lines
  ctx.beginPath();
  geoPath(graticule);
  ctx.strokeStyle = 'rgba(96,130,182,0.12)';
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Countries
  for (const feature of countriesGeo) {
    const isActive = activeFeature && feature.id === activeFeature.id;
    ctx.beginPath();
    geoPath(feature);
    if (isActive) {
      // Animated terracotta pulse
      const t = (Math.sin(pulsePhase) + 1) / 2;
      const r = Math.round(217 + t * 20);
      const g = Math.round(119 - t * 20);
      const b = Math.round(86 - t * 20);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.shadowColor = `rgba(217,119,86,${0.3 + t * 0.35})`;
      ctx.shadowBlur = 10 + t * 8;
    } else {
      ctx.fillStyle = '#C8D8C0';
      ctx.shadowBlur = 0;
    }
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  // Globe rim
  ctx.beginPath();
  geoPath({ type: 'Sphere' });
  ctx.strokeStyle = 'rgba(180,200,220,0.6)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function startPulse() {
  stopPulse();
  (function loop() {
    pulsePhase += 0.06;
    renderGlobe();
    pulseFrameId = requestAnimationFrame(loop);
  })();
}

function stopPulse() {
  if (pulseFrameId) { cancelAnimationFrame(pulseFrameId); pulseFrameId = null; }
}

function rotateTo(feature, onDone) {
  if (rotateFrameId) { cancelAnimationFrame(rotateFrameId); rotateFrameId = null; }
  stopPulse();

  const [cx, cy] = d3.geoCentroid(feature);
  const target   = [-cx, -cy, 0];
  const start    = [...globeRotate];
  const t0       = performance.now();
  const dur      = 750;

  // Interpolate along shortest great-circle arc for λ
  let dLambda = target[0] - start[0];
  if (dLambda >  180) dLambda -= 360;
  if (dLambda < -180) dLambda += 360;

  (function step(now) {
    const raw  = Math.min(1, (now - t0) / dur);
    const ease = raw < 0.5 ? 2 * raw * raw : -1 + (4 - 2 * raw) * raw;
    globeRotate = [
      start[0] + dLambda * ease,
      start[1] + (target[1] - start[1]) * ease,
      0,
    ];
    projection.rotate(globeRotate);
    renderGlobe();
    if (raw < 1) {
      rotateFrameId = requestAnimationFrame(step);
    } else {
      rotateFrameId = null;
      if (onDone) onDone();
    }
  })(t0);
}

function animateZoom(targetScale, duration, onDone) {
  if (zoomFrameId) { cancelAnimationFrame(zoomFrameId); zoomFrameId = null; }
  const startScale = globeScale;
  const t0 = performance.now();
  (function step(now) {
    const raw  = Math.min(1, (now - t0) / duration);
    const ease = raw < 0.5 ? 2 * raw * raw : -1 + (4 - 2 * raw) * raw;
    globeScale = startScale + (targetScale - startScale) * ease;
    projection.scale(globeScale);
    renderGlobe();
    if (raw < 1) {
      zoomFrameId = requestAnimationFrame(step);
    } else {
      zoomFrameId = null;
      globeScale = targetScale;
      projection.scale(globeScale);
      if (onDone) onDone();
    }
  })(t0);
}

// ── Drag to rotate ──
globeCanvas.addEventListener('mousedown', e => {
  if (e.button !== 0) return;
  isDragging   = true;
  dragStart    = [e.clientX, e.clientY];
  rotateAtDrag = [...globeRotate];
  if (rotateFrameId) { cancelAnimationFrame(rotateFrameId); rotateFrameId = null; }
  stopPulse();
  mapContainer.classList.add('panning');
});

window.addEventListener('mousemove', e => {
  if (!isDragging) return;
  const k = 180 / globeScale;
  globeRotate = [
    rotateAtDrag[0] + (e.clientX - dragStart[0]) * k,
    Math.max(-90, Math.min(90, rotateAtDrag[1] - (e.clientY - dragStart[1]) * k)),
    0,
  ];
  projection.rotate(globeRotate);
  renderGlobe();
});

window.addEventListener('mouseup', () => {
  if (isDragging && activeFeature) startPulse();
  isDragging = false;
  mapContainer.classList.remove('panning');
});

// ── Scroll to zoom ──
globeCanvas.addEventListener('wheel', e => {
  e.preventDefault();
  globeScale = Math.max(120, Math.min(4000, globeScale * (e.deltaY > 0 ? 0.9 : 1.1)));
  projection.scale(globeScale);
  renderGlobe();
}, { passive: false });

// ── Touch rotate + pinch-zoom ──
globeCanvas.addEventListener('touchstart', e => {
  if (e.touches.length === 1) {
    isDragging   = true;
    dragStart    = [e.touches[0].clientX, e.touches[0].clientY];
    rotateAtDrag = [...globeRotate];
    if (rotateFrameId) { cancelAnimationFrame(rotateFrameId); rotateFrameId = null; }
    stopPulse();
  } else if (e.touches.length === 2) {
    isDragging    = false;
    lastTouchDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY);
  }
}, { passive: true });

globeCanvas.addEventListener('touchmove', e => {
  e.preventDefault();
  if (e.touches.length === 1 && isDragging) {
    const k = 180 / globeScale;
    globeRotate = [
      rotateAtDrag[0] + (e.touches[0].clientX - dragStart[0]) * k,
      Math.max(-90, Math.min(90, rotateAtDrag[1] - (e.touches[0].clientY - dragStart[1]) * k)),
      0,
    ];
    projection.rotate(globeRotate);
    renderGlobe();
  } else if (e.touches.length === 2 && lastTouchDist) {
    const dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY);
    globeScale = Math.max(120, Math.min(4000, globeScale * (dist / lastTouchDist)));
    projection.scale(globeScale);
    lastTouchDist = dist;
    renderGlobe();
  }
}, { passive: false });

globeCanvas.addEventListener('touchend', e => {
  if (e.touches.length === 0) {
    if (isDragging && activeFeature) startPulse();
    isDragging    = false;
    lastTouchDist = null;
  }
}, { passive: true });

// ── Zoom buttons ──
document.getElementById('zoom-in').addEventListener('click', () => {
  globeScale = Math.min(4000, globeScale * 1.3);
  projection.scale(globeScale); renderGlobe();
});
document.getElementById('zoom-out').addEventListener('click', () => {
  globeScale = Math.max(120, globeScale / 1.3);
  projection.scale(globeScale); renderGlobe();
});
document.getElementById('zoom-reset').addEventListener('click', () => {
  globeScale  = 0;
  globeRotate = [0, -25, 0];
  resizeGlobe(); renderGlobe();
});

window.addEventListener('resize', () => {
  globeScale = 0;
  resizeGlobe();
  renderGlobe();
});

// ═══════════════════════════════════════════════════════
//  START
// ═══════════════════════════════════════════════════════
async function loadWorld() {
  resizeGlobe();
  // Faint placeholder globe while data loads
  renderGlobe();

  const topo = await d3.json(
    'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json'
  );
  countriesGeo = topojson.feature(topo, topo.objects.countries).features;
  neighborIndices = computeNeighbors(topo.objects.countries.geometries);
  for (const c of COUNTRIES) {
    const num = ISO2_TO_NUMERIC[c.id];
    if (num) numericToCountry[num] = c;
  }
  init();
}

window.addEventListener('DOMContentLoaded', loadWorld);
