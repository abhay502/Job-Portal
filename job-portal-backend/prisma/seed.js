import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create Admin
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@jobportal.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@jobportal.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin created:', admin.email)

  // Create User
  const userPassword = await bcrypt.hash('user123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'user@jobportal.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'user@jobportal.com',
      password: userPassword,
      role: 'USER',
    },
  })
  console.log('✅ User created:', user.email)

  // Create Sample Jobs
  const jobs = [
    {
      title: 'Senior React Developer',
      company: 'TechCorp India',
      location: 'Bangalore, India',
      category: 'Technology',
      experienceLevel: 'Senior Level',
      jobType: 'Full-time',
      salaryMin: 1200000,
      salaryMax: 1800000,
      description: 'We are looking for a Senior React Developer to join our growing team. You will be responsible for building and maintaining high-quality web applications using React.js and related technologies.',
      requirements: '5+ years of experience with React.js\nStrong knowledge of Redux and state management\nExperience with REST APIs and GraphQL\nProficiency in TypeScript\nGood understanding of CI/CD pipelines',
      responsibilities: 'Develop new user-facing features using React.js\nBuild reusable components and libraries\nOptimize components for maximum performance\nCollaborate with backend developers and designers',
      status: 'active',
      deadline: new Date('2026-08-30'),
    },
    {
      title: 'Node.js Backend Engineer',
      company: 'StartupHub',
      location: 'Hyderabad, India',
      category: 'Technology',
      experienceLevel: 'Mid Level',
      jobType: 'Full-time',
      salaryMin: 800000,
      salaryMax: 1200000,
      description: 'Join our backend team to build scalable APIs and microservices. You will work with Node.js, Express, and PostgreSQL to deliver high-performance backend solutions.',
      requirements: '3+ years of Node.js experience\nExperience with Express.js and REST APIs\nStrong knowledge of PostgreSQL or MySQL\nFamiliarity with Docker and AWS\nUnderstanding of microservices architecture',
      responsibilities: 'Design and implement RESTful APIs\nOptimize database queries\nWrite unit and integration tests\nParticipate in code reviews',
      status: 'active',
      deadline: new Date('2026-09-15'),
    },
    {
      title: 'UI/UX Designer',
      company: 'DesignStudio',
      location: 'Mumbai, India',
      category: 'Design',
      experienceLevel: 'Mid Level',
      jobType: 'Full-time',
      salaryMin: 600000,
      salaryMax: 1000000,
      description: 'We need a talented UI/UX Designer to create amazing user experiences. You will work closely with product and engineering teams to design intuitive interfaces.',
      requirements: '3+ years of UI/UX design experience\nProficiency in Figma and Adobe XD\nStrong portfolio of design projects\nUnderstanding of user research and testing\nBasic knowledge of HTML/CSS',
      responsibilities: 'Create wireframes and prototypes\nConduct user research and usability testing\nCollaborate with developers for implementation\nMaintain design system and style guides',
      status: 'active',
      deadline: new Date('2026-08-15'),
    },
    {
      title: 'Digital Marketing Manager',
      company: 'GrowthAgency',
      location: 'Chennai, India',
      category: 'Marketing',
      experienceLevel: 'Senior Level',
      jobType: 'Full-time',
      salaryMin: 900000,
      salaryMax: 1400000,
      description: 'Lead our digital marketing efforts across SEO, SEM, social media, and content marketing. Drive growth and brand awareness through data-driven campaigns.',
      requirements: '5+ years in digital marketing\nExperience with Google Ads and Meta Ads\nStrong analytical skills with Google Analytics\nSEO/SEM expertise\nExcellent communication skills',
      responsibilities: 'Plan and execute digital marketing campaigns\nManage SEO/SEM strategies\nAnalyze campaign performance and optimize\nLead a team of marketing specialists',
      status: 'active',
      deadline: new Date('2026-09-01'),
    },
    {
      title: 'Data Analyst',
      company: 'FinTech Solutions',
      location: 'Pune, India',
      category: 'Finance',
      experienceLevel: 'Entry Level',
      jobType: 'Full-time',
      salaryMin: 400000,
      salaryMax: 700000,
      description: 'Analyze financial data and generate insights to support business decisions. Work with large datasets using SQL, Python, and visualization tools.',
      requirements: 'Bachelor\'s degree in Statistics, Mathematics, or related field\nProficiency in SQL and Python\nExperience with Excel and Power BI\nStrong analytical and problem-solving skills',
      responsibilities: 'Collect and analyze financial data\nCreate dashboards and reports\nIdentify trends and patterns\nPresent findings to stakeholders',
      status: 'active',
      deadline: new Date('2026-07-31'),
    },
    {
      title: 'DevOps Engineer',
      company: 'CloudTech',
      location: 'Remote',
      category: 'Technology',
      experienceLevel: 'Mid Level',
      jobType: 'Remote',
      salaryMin: 1000000,
      salaryMax: 1500000,
      description: 'Join our DevOps team to build and maintain cloud infrastructure. Work with AWS, Docker, Kubernetes, and CI/CD pipelines to ensure smooth deployments.',
      requirements: '3+ years of DevOps experience\nStrong knowledge of AWS services\nExperience with Docker and Kubernetes\nProficiency in CI/CD tools (Jenkins, GitHub Actions)\nScripting skills in Bash or Python',
      responsibilities: 'Manage cloud infrastructure on AWS\nImplement and maintain CI/CD pipelines\nMonitor system performance and reliability\nAutomate deployment processes',
      status: 'active',
      deadline: new Date('2026-09-30'),
    },
  ]

  for (const job of jobs) {
    await prisma.job.create({ data: job })
    console.log(`✅ Job created: ${job.title}`)
  }

  console.log('\n🎉 Seeding complete!')
  console.log('─────────────────────────────')
  console.log('Admin login: admin@jobportal.com / admin123')
  console.log('User login:  user@jobportal.com / user123')
  console.log('─────────────────────────────')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })