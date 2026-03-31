export interface MetricData {
  id: string;
  category: string;
  title: string;
  value: string;
  unit: string;
  progress: number;
  trend: 'up' | 'down';
  trendValue: string;
  icon: string;
  color: string;
  description: string;
  target: string;
  timeline: string;
}

export interface HistoricalData {
  date: string;
  value: number;
}

export interface CountyData {
  county: string;
  value: number;
  rank: number;
  percentage: number;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

export const metricsData: MetricData[] = [
  {
    id: 'sha-registrations',
    category: 'blue',
    title: 'Universal Healthcare',
    value: '29.75M',
    unit: 'SHA Registrations',
    progress: 64,
    trend: 'up',
    trendValue: '+12.5%',
    icon: 'Heart',
    color: '#3B82F6',
    description: 'Social Health Authority (SHA) registrations under Universal Health Coverage initiative providing accessible healthcare to all Kenyans.',
    target: '47M citizens',
    timeline: '2027'
  },
  {
    id: 'job-creation',
    category: 'blue',
    title: 'Job Creation',
    value: '400K',
    unit: 'Jobs Created',
    progress: 40,
    trend: 'up',
    trendValue: '+8.3%',
    icon: 'Users',
    color: '#3B82F6',
    description: 'Employment opportunities generated through various government initiatives including manufacturing, digital economy, and infrastructure projects.',
    target: '1M jobs annually',
    timeline: '2027'
  },
  {
    id: 'national-budget',
    category: 'blue',
    title: 'National Budget',
    value: '4,635.58B',
    unit: 'KES',
    progress: 82,
    trend: 'up',
    trendValue: '+15.2%',
    icon: 'DollarSign',
    color: '#3B82F6',
    description: 'Total national budget allocation for fiscal year 2025/26 supporting all government development and recurrent expenditure.',
    target: '5,650B KES',
    timeline: '2026'
  },
  {
    id: 'affordable-housing',
    category: 'blue',
    title: 'Affordable Housing',
    value: '228,331',
    unit: 'Units Completed',
    progress: 46,
    trend: 'up',
    trendValue: '+22.1%',
    icon: 'Home',
    color: '#3B82F6',
    description: 'Housing units delivered under the Affordable Housing Programme providing decent homes to low and middle-income earners.',
    target: '500K units',
    timeline: '2027'
  },
  {
    id: 'hustler-fund',
    category: 'red',
    title: 'Hustler Fund',
    value: '55.8B',
    unit: 'KES Disbursed',
    progress: 56,
    trend: 'up',
    trendValue: '+18.7%',
    icon: 'Wallet',
    color: '#EF4444',
    description: 'Total financial support provided to micro-enterprises and small businesses through the Hustler Fund empowering grassroots entrepreneurs.',
    target: '100B KES',
    timeline: '2027'
  },
  {
    id: 'digital-jobs',
    category: 'red',
    title: 'Digital Jobs',
    value: '1.2M',
    unit: 'Youth Registered',
    progress: 80,
    trend: 'up',
    trendValue: '+25.4%',
    icon: 'Laptop',
    color: '#EF4444',
    description: 'Young Kenyans registered on digital platforms for freelance and remote work opportunities through the Digital Jobs Initiative.',
    target: '1.5M youth',
    timeline: '2026'
  },
  {
    id: 'roads-construction',
    category: 'red',
    title: 'Roads Construction',
    value: '8,542',
    unit: 'KM Completed',
    progress: 68,
    trend: 'up',
    trendValue: '+14.2%',
    icon: 'Construction',
    color: '#EF4444',
    description: 'Kilometers of roads constructed and rehabilitated improving connectivity across all 47 counties and boosting economic activity.',
    target: '12,500 KM',
    timeline: '2027'
  },
  {
    id: 'school-feeding',
    category: 'red',
    title: 'School Feeding Program',
    value: '3.8M',
    unit: 'Students Fed',
    progress: 76,
    trend: 'up',
    trendValue: '+9.8%',
    icon: 'UtensilsCrossed',
    color: '#EF4444',
    description: 'Students benefiting from the school feeding programme ensuring improved nutrition and increased school attendance rates.',
    target: '5M students',
    timeline: '2027'
  },
  {
    id: 'fertilizer-subsidy',
    category: 'green',
    title: 'Fertilizer Subsidy',
    value: '8.5M',
    unit: 'Farmers Reached',
    progress: 85,
    trend: 'up',
    trendValue: '+31.2%',
    icon: 'Sprout',
    color: '#10B981',
    description: 'Farmers receiving subsidized fertilizer under the agricultural transformation agenda to boost food security and increase farm productivity.',
    target: '10M farmers',
    timeline: '2026'
  },
  {
    id: 'revenue-collection',
    category: 'green',
    title: 'Revenue Collection',
    value: '2,456.89B',
    unit: 'KES',
    progress: 73,
    trend: 'up',
    trendValue: '+11.4%',
    icon: 'TrendingUp',
    color: '#10B981',
    description: 'Total government revenue collected through KRA supporting national development programs and service delivery.',
    target: '3,360B KES',
    timeline: '2027'
  },
  {
    id: 'internet-coverage',
    category: 'green',
    title: 'Internet Coverage',
    value: '92.3%',
    unit: 'Population',
    progress: 92,
    trend: 'up',
    trendValue: '+6.7%',
    icon: 'Wifi',
    color: '#10B981',
    description: 'Percentage of Kenyan population with access to internet connectivity through expanded digital infrastructure and fiber optic networks.',
    target: '100%',
    timeline: '2027'
  },
  {
    id: 'electricity-access',
    category: 'green',
    title: 'Electricity Access',
    value: '79.8%',
    unit: 'Households',
    progress: 80,
    trend: 'up',
    trendValue: '+4.2%',
    icon: 'Zap',
    color: '#10B981',
    description: 'Households connected to the national electricity grid under the Last Mile Connectivity Programme improving quality of life.',
    target: '100%',
    timeline: '2030'
  },
  {
    id: 'tree-planting',
    category: 'green',
    title: 'Tree Planting',
    value: '2.5B',
    unit: 'Trees Planted',
    progress: 50,
    trend: 'up',
    trendValue: '+167%',
    icon: 'Trees',
    color: '#10B981',
    description: 'Trees planted across Kenya as part of the 15 Billion Trees Initiative combating climate change and restoring forest cover.',
    target: '5B trees',
    timeline: '2027'
  }
];

// Historical data for trend charts (last 12 months)
export const generateHistoricalData = (metricId: string): HistoricalData[] => {
  const baseValues: { [key: string]: number } = {
    'sha-registrations': 25000000,
    'job-creation': 350000,
    'national-budget': 4000000000000,
    'affordable-housing': 180000,
    'hustler-fund': 45000000000,
    'digital-jobs': 950000,
    'roads-construction': 7200,
    'school-feeding': 3400000,
    'fertilizer-subsidy': 6500000,
    'revenue-collection': 2100000000000,
    'internet-coverage': 85,
    'electricity-access': 75,
    'tree-planting': 1500000000
  };

  const months = ['Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025', 
                  'Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026'];
  
  const baseValue = baseValues[metricId] || 1000000;
  const data: HistoricalData[] = [];
  
  for (let i = 0; i < 12; i++) {
    const growth = 1 + (i * 0.015) + (Math.random() * 0.01 - 0.005); // Slight upward trend with noise
    data.push({
      date: months[i],
      value: Math.round(baseValue * growth)
    });
  }
  
  return data;
};

// Top 10 counties by metric
export const generateCountyData = (metricId: string): CountyData[] => {
  const counties = [
    'Nairobi', 'Kiambu', 'Nakuru', 'Mombasa', 'Machakos', 'Kajiado', 
    'Uasin Gishu', 'Meru', 'Kisumu', 'Nyeri', 'Kakamega', 'Kilifi',
    'Bungoma', 'Nyandarua', 'Murang\'a', 'Embu', 'Kitui', 'Makueni',
    'Laikipia', 'Nandi', 'Bomet', 'Kericho', 'Trans Nzoia', 'Elgeyo Marakwet',
    'Baringo', 'Samburu', 'Turkana', 'West Pokot', 'Narok', 'Kajiado'
  ];

  const topCounties = counties.sort(() => Math.random() - 0.5).slice(0, 10);
  
  return topCounties.map((county, index) => ({
    county,
    value: Math.round(1000000 * (1 - index * 0.12) * (Math.random() * 0.2 + 0.9)),
    rank: index + 1,
    percentage: Math.round((100 - index * 8) * (Math.random() * 0.1 + 0.95))
  }));
};

// News and updates
export const newsData: NewsItem[] = [
  {
    id: '1',
    title: 'Universal Health Coverage Reaches 30 Million Milestone',
    date: 'March 20, 2026',
    category: 'Healthcare',
    description: 'SHA registrations surpass 30 million mark, bringing Kenya closer to achieving universal healthcare for all citizens by 2027.',
    impact: 'high'
  },
  {
    id: '2',
    title: 'Digital Jobs Platform Onboards 100,000 Youth This Month',
    date: 'March 18, 2026',
    category: 'Employment',
    description: 'Record number of young Kenyans join digital workforce, accessing international remote work opportunities through government platform.',
    impact: 'high'
  },
  {
    id: '3',
    title: 'Affordable Housing Units Delivered in Nairobi, Mombasa',
    date: 'March 15, 2026',
    category: 'Housing',
    description: '5,000 new affordable housing units completed and ready for occupancy in major urban centers.',
    impact: 'medium'
  },
  {
    id: '4',
    title: 'Fertilizer Subsidy Program Expanded to All 47 Counties',
    date: 'March 12, 2026',
    category: 'Agriculture',
    description: 'Government extends subsidized fertilizer distribution ensuring all counties benefit from agricultural transformation program.',
    impact: 'high'
  },
  {
    id: '5',
    title: 'New Highway Sections Open in Western Kenya',
    date: 'March 10, 2026',
    category: 'Infrastructure',
    description: '250 kilometers of new highway infrastructure inaugurated, improving connectivity and trade in the region.',
    impact: 'medium'
  },
  {
    id: '6',
    title: 'KRA Surpasses Monthly Revenue Target by 18%',
    date: 'March 8, 2026',
    category: 'Revenue',
    description: 'Enhanced tax compliance and economic growth drive record revenue collection for the month of February.',
    impact: 'high'
  },
  {
    id: '7',
    title: 'School Feeding Program Reduces Dropout Rates',
    date: 'March 5, 2026',
    category: 'Education',
    description: 'Latest data shows 23% reduction in school dropout rates in areas covered by the feeding program.',
    impact: 'medium'
  },
  {
    id: '8',
    title: '500 Million Trees Planted in National Campaign',
    date: 'March 2, 2026',
    category: 'Environment',
    description: 'Major milestone achieved in environmental conservation as citizens rally behind tree planting initiative.',
    impact: 'high'
  },
  {
    id: '9',
    title: 'Hustler Fund Beneficiaries Report 40% Income Growth',
    date: 'February 28, 2026',
    category: 'Finance',
    description: 'Survey reveals significant economic impact on small businesses accessing micro-credit through the fund.',
    impact: 'medium'
  },
  {
    id: '10',
    title: 'Last Mile Connectivity Reaches Remote Areas',
    date: 'February 25, 2026',
    category: 'Energy',
    description: '50,000 additional households in remote regions connected to national electricity grid this quarter.',
    impact: 'low'
  }
];

// All 47 counties with sample data
export const allCountiesData = [
  { name: 'Nairobi', population: 4397073, projects: 156, budget: 45000000000 },
  { name: 'Kiambu', population: 2417735, projects: 98, budget: 28000000000 },
  { name: 'Nakuru', population: 2162202, projects: 87, budget: 24000000000 },
  { name: 'Mombasa', population: 1208333, projects: 76, budget: 22000000000 },
  { name: 'Machakos', population: 1421932, projects: 65, budget: 18000000000 },
  { name: 'Kajiado', population: 1117840, projects: 54, budget: 16000000000 },
  { name: 'Meru', population: 1545714, projects: 72, budget: 19000000000 },
  { name: 'Kisumu', population: 1155574, projects: 68, budget: 17500000000 },
  { name: 'Kakamega', population: 1867579, projects: 71, budget: 18500000000 },
  { name: 'Uasin Gishu', population: 1163186, projects: 63, budget: 17000000000 },
  { name: 'Kilifi', population: 1453787, projects: 59, budget: 16500000000 },
  { name: 'Bungoma', population: 1670570, projects: 67, budget: 17800000000 },
  { name: 'Nyeri', population: 759164, projects: 48, budget: 13000000000 },
  { name: 'Murang\'a', population: 1056640, projects: 52, budget: 14000000000 },
  { name: 'Kitui', population: 1136187, projects: 58, budget: 15000000000 },
  { name: 'Nyandarua', population: 638289, projects: 42, budget: 11000000000 },
  { name: 'Kirinyaga', population: 610411, projects: 45, budget: 12000000000 },
  { name: 'Embu', population: 608599, projects: 46, budget: 12200000000 },
  { name: 'Trans Nzoia', population: 990341, projects: 51, budget: 13500000000 },
  { name: 'Kericho', population: 901777, projects: 49, budget: 13200000000 },
  { name: 'Bomet', population: 875689, projects: 47, budget: 12800000000 },
  { name: 'Nandi', population: 885711, products: 50, budget: 13400000000 },
  { name: 'Laikipia', population: 518560, projects: 38, budget: 10500000000 },
  { name: 'Narok', population: 1157873, projects: 55, budget: 14500000000 },
  { name: 'Baringo', population: 666763, projects: 43, budget: 11500000000 },
  { name: 'Elgeyo Marakwet', population: 454480, projects: 36, budget: 10000000000 },
  { name: 'West Pokot', population: 621241, projects: 40, budget: 11000000000 },
  { name: 'Samburu', population: 310327, projects: 32, budget: 9000000000 },
  { name: 'Turkana', population: 926976, projects: 44, budget: 12000000000 },
  { name: 'Kwale', population: 866820, projects: 41, budget: 11200000000 },
  { name: 'Taita Taveta', population: 340671, projects: 34, budget: 9500000000 },
  { name: 'Tana River', population: 315943, projects: 30, budget: 8800000000 },
  { name: 'Lamu', population: 143920, projects: 25, budget: 7500000000 },
  { name: 'Garissa', population: 841353, projects: 37, budget: 10200000000 },
  { name: 'Wajir', population: 781263, projects: 35, budget: 9800000000 },
  { name: 'Mandera', population: 1025756, projects: 39, budget: 10800000000 },
  { name: 'Marsabit', population: 459785, projects: 33, budget: 9200000000 },
  { name: 'Isiolo', population: 268002, projects: 28, budget: 8200000000 },
  { name: 'Siaya', population: 993183, projects: 53, budget: 14200000000 },
  { name: 'Kisii', population: 1266860, projects: 62, budget: 16000000000 },
  { name: 'Nyamira', population: 605576, projects: 44, budget: 11800000000 },
  { name: 'Homa Bay', population: 1131950, projects: 56, budget: 14800000000 },
  { name: 'Migori', population: 1116436, projects: 54, budget: 14400000000 },
  { name: 'Busia', population: 893681, projects: 48, budget: 12600000000 },
  { name: 'Vihiga', population: 590013, projects: 43, budget: 11600000000 },
  { name: 'Makueni', population: 987653, projects: 50, budget: 13300000000 },
  { name: 'Tharaka Nithi', population: 393177, projects: 35, budget: 9600000000 }
];
