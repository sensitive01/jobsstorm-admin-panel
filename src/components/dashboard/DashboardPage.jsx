import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Building2, 
  Briefcase, 
  FileText,
  Eye,
  MoreVertical,
  ArrowUpRight,
  Clock
} from 'lucide-react';

export default function DashboardPage() {
  // Stats Data
  const stats = [
    {
      id: 1,
      label: 'Total Jobs',
      value: '1,234',
      change: '+12.5%',
      changeType: 'increase',
      icon: Briefcase,
      color: 'blue',
      description: 'Active job postings'
    },
    {
      id: 2,
      label: 'Active Employers',
      value: '456',
      change: '+8.2%',
      changeType: 'increase',
      icon: Building2,
      color: 'green',
      description: 'Registered companies'
    },
    {
      id: 3,
      label: 'Total Candidates',
      value: '8,901',
      change: '+23.1%',
      changeType: 'increase',
      icon: Users,
      color: 'purple',
      description: 'Job seekers registered'
    },
    {
      id: 4,
      label: 'Applications',
      value: '3,567',
      change: '+15.3%',
      changeType: 'increase',
      icon: FileText,
      color: 'orange',
      description: 'Total applications'
    }
  ];

  // Recent Activities
  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'applied for', target: 'Senior React Developer', time: '5 min ago', type: 'application' },
    { id: 2, user: 'Tech Corp', action: 'posted', target: 'Product Manager position', time: '15 min ago', type: 'job' },
    { id: 3, user: 'Sarah Smith', action: 'registered as', target: 'New Candidate', time: '1 hour ago', type: 'user' },
    { id: 4, user: 'Design Studio', action: 'updated', target: 'Company Profile', time: '2 hours ago', type: 'employer' },
    { id: 5, user: 'Mike Johnson', action: 'applied for', target: 'UI/UX Designer', time: '3 hours ago', type: 'application' },
    { id: 6, user: 'Marketing Inc', action: 'posted', target: 'Marketing Manager position', time: '4 hours ago', type: 'job' }
  ];

  // Top Jobs
  const topJobs = [
    { id: 1, title: 'Senior React Developer', company: 'Tech Corp', applications: 87, views: 234, status: 'active' },
    { id: 2, title: 'Product Manager', company: 'Innovate Ltd', applications: 65, views: 189, status: 'active' },
    { id: 3, title: 'UI/UX Designer', company: 'Design Studio', applications: 54, views: 156, status: 'active' },
    { id: 4, title: 'Data Scientist', company: 'AI Solutions', applications: 48, views: 142, status: 'active' },
    { id: 5, title: 'Backend Engineer', company: 'Cloud Systems', applications: 42, views: 128, status: 'active' }
  ];

  // Recent Employers
  const recentEmployers = [
    { id: 1, name: 'Tech Corp', jobs: 12, joined: '2 days ago', status: 'verified' },
    { id: 2, name: 'Design Studio', jobs: 8, joined: '5 days ago', status: 'verified' },
    { id: 3, name: 'Marketing Inc', jobs: 6, joined: '1 week ago', status: 'pending' },
    { id: 4, name: 'AI Solutions', jobs: 10, joined: '2 weeks ago', status: 'verified' }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
            Download Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            View Analytics
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <div className="flex items-center space-x-2">
                    {stat.changeType === 'increase' ? (
                      <TrendingUp size={16} className="text-green-600" />
                    ) : (
                      <TrendingDown size={16} className="text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500">vs last month</span>
                  </div>
                </div>
                <div className={`${getColorClasses(stat.color)} p-3 rounded-lg`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activity.type === 'application' ? 'bg-blue-100' :
                  activity.type === 'job' ? 'bg-green-100' :
                  activity.type === 'user' ? 'bg-purple-100' : 'bg-orange-100'
                }`}>
                  {activity.type === 'application' ? <FileText size={18} className="text-blue-600" /> :
                   activity.type === 'job' ? <Briefcase size={18} className="text-green-600" /> :
                   activity.type === 'user' ? <Users size={18} className="text-purple-600" /> :
                   <Building2 size={18} className="text-orange-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">{activity.user}</span>
                    {' '}{activity.action}{' '}
                    <span className="font-semibold">{activity.target}</span>
                  </p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Clock size={12} className="mr-1" />
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Employers */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Employers</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {recentEmployers.map((employer) => (
              <div key={employer.id} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{employer.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{employer.name}</p>
                    <p className="text-xs text-gray-500">{employer.jobs} jobs • {employer.joined}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  employer.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {employer.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Jobs Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Jobs</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
            View All <ArrowUpRight size={16} className="ml-1" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Job Title</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Company</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Applications</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Views</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topJobs.map((job) => (
                <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-4 px-4">
                    <p className="text-sm font-semibold text-gray-900">{job.title}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-600">{job.company}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <FileText size={16} className="text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">{job.applications}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Eye size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600">{job.views}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                      {job.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <MoreVertical size={16} className="text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}