import { Heart, Home, Sprout, GraduationCap, Briefcase, Wallet, Wifi, Construction, TrendingUp, Landmark, MapPin } from 'lucide-react';

interface MetricData {
  label: string;
  value: string;
  sublabel?: string;
  progress?: number;
  trend?: number;
}

interface ProjectCardProps {
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  metrics: MetricData[];
}

function ProjectCard({ title, icon, bgColor, metrics }: ProjectCardProps) {
  // Get the primary metric (first one)
  const primaryMetric = metrics[0];
  
  return (
    <div className="bg-[#1f2333] dark:bg-[#1f2333] bg-white rounded-xl border border-gray-700 dark:border-gray-700 border-gray-200 overflow-hidden hover:border-gray-600 dark:hover:border-gray-600 hover:border-gray-400 transition-all">
      {/* Colored border top */}
      <div className={`${bgColor} h-1`}></div>
      
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {/* Title */}
            <p className="text-gray-400 dark:text-gray-400 text-gray-600 text-xs uppercase mb-3">{title}</p>
            
            {/* Main Value */}
            <p className="text-white dark:text-white text-black text-3xl font-bold mb-3">{primaryMetric.value}</p>
            
            {/* Trend Indicator */}
            {primaryMetric.trend !== undefined && (
              <div className="flex items-center gap-1">
                <TrendingUp className={`w-3 h-3 ${primaryMetric.trend >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                <span className={`text-sm font-medium ${primaryMetric.trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {primaryMetric.trend >= 0 ? '+' : ''}{primaryMetric.trend}%
                </span>
                <span className="text-gray-500 dark:text-gray-500 text-gray-600 text-xs ml-1">Since last month</span>
              </div>
            )}
            
            {/* Progress bar if no trend */}
            {primaryMetric.trend === undefined && primaryMetric.progress !== undefined && (
              <div>
                <div className="w-full bg-gray-700 dark:bg-gray-700 bg-gray-200 rounded-full h-1.5 overflow-hidden mb-2">
                  <div
                    className={`h-full ${bgColor} transition-all duration-500`}
                    style={{ width: `${primaryMetric.progress}%` }}
                  />
                </div>
                <p className="text-gray-500 dark:text-gray-500 text-gray-600 text-xs">{primaryMetric.progress}% Complete</p>
              </div>
            )}
          </div>
          
          {/* Icon Badge */}
          <div className={`${bgColor} bg-opacity-20 p-4 rounded-full ml-4`}>
            <div className="w-8 h-8 flex items-center justify-center">
              {icon}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function KenyaDashboardCards() {
  return (
    <>
      {/* Row 1 - Blue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <ProjectCard
          title="Universal Healthcare"
          icon={<Heart className="w-5 h-5 text-white" />}
          bgColor="bg-blue-600"
          metrics={[
            { label: 'SHA REGISTRATIONS', value: '29.75M', sublabel: 'Registrations', progress: 74.3, trend: 8.5 },
            { label: 'TARGET', value: '40,029,876', sublabel: '100% of Target', progress: 100 },
          ]}
        />
        <ProjectCard
          title="Affordable Housing"
          icon={<Home className="w-5 h-5 text-white" />}
          bgColor="bg-blue-600"
          metrics={[
            { label: 'UNDER CONSTRUCTION', value: '1.1M', sublabel: 'Units', progress: 45, trend: 12.3 },
            { label: 'COMPLETION TARGET', value: '50%', progress: 50 },
          ]}
        />
        <ProjectCard
          title="Agricultural Transformation"
          icon={<Sprout className="w-5 h-5 text-white" />}
          bgColor="bg-blue-600"
          metrics={[
            { label: 'REGISTERED', value: '7.25M', sublabel: 'Farmers', progress: 85, trend: 15.2 },
            { label: 'FERTILIZER', value: '18M', sublabel: 'Bags', progress: 72 },
            { label: 'IRRIGATION', value: '6.2M', sublabel: 'Acres', progress: 68 },
          ]}
        />
        <ProjectCard
          title="Education"
          icon={<GraduationCap className="w-5 h-5 text-white" />}
          bgColor="bg-blue-600"
          metrics={[
            { label: 'TVET ENROLL', value: '2.3M', sublabel: 'Students', progress: 92, trend: 18.7 },
            { label: 'JHS ENROLL', value: '2.3M', sublabel: 'Students', progress: 88 },
            { label: 'HELB', value: '41B', sublabel: 'KSH', progress: 95 },
          ]}
        />
      </div>

      {/* Row 2 - Red Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <ProjectCard
          title="Job Creation"
          icon={<Briefcase className="w-5 h-5 text-white" />}
          bgColor="bg-red-600"
          metrics={[
            { label: 'TOTAL OVERSEAS', value: '400,000', progress: 80, trend: 25.6 },
          ]}
        />
        <ProjectCard
          title="National Budget"
          icon={<Wallet className="w-5 h-5 text-white" />}
          bgColor="bg-red-600"
          metrics={[
            { label: 'TOTAL ESTIMATES', value: '4,635.58B', sublabel: 'KSH 1.75 BILLION', progress: 59.4 },
          ]}
        />
        <ProjectCard
          title="National Revenue"
          icon={<TrendingUp className="w-5 h-5 text-white" />}
          bgColor="bg-red-600"
          metrics={[
            { label: 'TOTAL RECEIPTS', value: '2,753.03B', sublabel: 'KSH 1.01B / 6 MONTHS', progress: 59.4, trend: 7.2 },
          ]}
        />
        <ProjectCard
          title="MSME & Finance"
          icon={<Landmark className="w-5 h-5 text-white" />}
          bgColor="bg-red-600"
          metrics={[
            { label: 'BORROWERS', value: '26M', sublabel: 'Borrowers', progress: 87, trend: 22.1 },
            { label: 'REPAYMENT', value: '79%', progress: 79 },
            { label: 'SAVINGS', value: '4.5B', sublabel: 'KSH', progress: 65 },
          ]}
        />
      </div>

      {/* Row 3 - Green Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <ProjectCard
          title="Digital Superhighway"
          icon={<Wifi className="w-5 h-5 text-white" />}
          bgColor="bg-green-600"
          metrics={[
            { label: 'FIBER OPTIC BUILT', value: '24,000', sublabel: 'KM', progress: 80, trend: 35.2 },
          ]}
        />
        <ProjectCard
          title="Infrastructure"
          icon={<Construction className="w-5 h-5 text-white" />}
          bgColor="bg-green-600"
          metrics={[
            { label: 'ROADS BUILT', value: '10,500', sublabel: 'KM', progress: 70, trend: 14.8 },
          ]}
        />
        <ProjectCard
          title="Macroeconomic"
          icon={<TrendingUp className="w-5 h-5 text-white" />}
          bgColor="bg-green-600"
          metrics={[
            { label: 'GDP GROWTH RATE', value: '5.2%', progress: 52, trend: 2.1 },
          ]}
        />
        <ProjectCard
          title="KDC Funding"
          icon={<Wallet className="w-5 h-5 text-white" />}
          bgColor="bg-green-600"
          metrics={[
            { label: 'KSH + 86 ONGOING OFFERS', value: '37.81B', progress: 76 },
          ]}
        />
        <ProjectCard
          title="Counties"
          icon={<MapPin className="w-5 h-5 text-white" />}
          bgColor="bg-green-600"
          metrics={[
            { label: 'FEATURED COUNTIES', value: '2', progress: 4.3 },
          ]}
        />
      </div>
    </>
  );
}