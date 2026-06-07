const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: 'AIzaSyCaA50SlV1UVCALmai_9-eGIWfehOQ0Hk0',
    authDomain: 'gigapp-390f8.firebaseapp.com',
    projectId: 'gigapp-390f8',
    storageBucket: 'gigapp-390f8.firebasestorage.app',
    messagingSenderId: '144594523664',
    appId: '1:144594523664:web:f764c5aedf45f6a0abdc95',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const now = new Date().toISOString();
const fakeEmployerId = 'emp_seed_001';

const companies = [
    { name: 'TechNova Solutions', logo: '' },
    { name: 'Zephyr Digital', logo: '' },
    { name: 'CloudBridge Inc', logo: '' },
    { name: 'ByteForge Labs', logo: '' },
    { name: 'NexGen Systems', logo: '' },
];

const jobs = [
    {
        title: 'Flutter Developer',
        description: 'Build and maintain high-quality cross-platform mobile apps using Flutter and Dart. Collaborate with UI/UX designers to implement beautiful, performant interfaces.',
        location: 'Bangalore, IN',
        employmentType: 'Full-Time',
        experienceLevel: 'Mid Level',
        salaryRange: '₹8L - ₹14L per year',
        workFrom: 'Hybrid',
        requiredSkills: ['Flutter', 'Dart', 'Firebase', 'REST APIs', 'Git'],
        responsibilities: ['Develop Flutter mobile apps', 'Write clean, testable code', 'Integrate Firebase backend', 'Collaborate with design team'],
        requirements: ['2+ years Flutter experience', 'Strong Dart knowledge', 'Published apps on Play Store or App Store'],
        benefits: ['Health insurance', 'Flexible hours', 'Stock options', 'Annual bonus'],
        company: companies[0],
    },
    {
        title: 'Backend Engineer (Node.js)',
        description: 'Design and build scalable RESTful APIs and microservices. Work with cloud infrastructure on AWS or GCP to deliver robust backend solutions.',
        location: 'Remote',
        employmentType: 'Full-Time',
        experienceLevel: 'Senior Level',
        salaryRange: '₹18L - ₹28L per year',
        workFrom: 'Remote',
        requiredSkills: ['Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS'],
        responsibilities: ['Design RESTful APIs', 'Write database schemas', 'Optimize query performance', 'Code reviews'],
        requirements: ['4+ years backend experience', 'Strong SQL skills', 'Experience with Docker/Kubernetes'],
        benefits: ['Remote-first culture', 'Home office stipend', 'Health & dental', 'Learning budget'],
        company: companies[1],
    },
    {
        title: 'UI/UX Designer',
        description: 'Create intuitive and visually stunning user interfaces for mobile and web products. Conduct user research, build wireframes, and work closely with engineering teams.',
        location: 'Delhi, IN',
        employmentType: 'Full-Time',
        experienceLevel: 'Mid Level',
        salaryRange: '₹7L - ₹12L per year',
        workFrom: 'On-site',
        requiredSkills: ['Figma', 'Prototyping', 'User Research', 'Design Systems', 'Adobe XD'],
        responsibilities: ['Design mobile and web UIs', 'Conduct usability testing', 'Create design systems', 'Handoff to developers'],
        requirements: ['3+ years UX experience', 'Strong Figma skills', 'Portfolio of shipped products'],
        benefits: ['Creative environment', 'Health insurance', 'Team retreats', 'Flexible PTO'],
        company: companies[2],
    },
    {
        title: 'Android Developer (Kotlin)',
        description: 'Develop and maintain feature-rich Android applications. Optimize app performance, implement Material Design, and ensure seamless user experiences across Android devices.',
        location: 'Hyderabad, IN',
        employmentType: 'Full-Time',
        experienceLevel: 'Mid Level',
        salaryRange: '₹9L - ₹16L per year',
        workFrom: 'Hybrid',
        requiredSkills: ['Kotlin', 'Android SDK', 'Jetpack Compose', 'MVVM', 'Coroutines'],
        responsibilities: ['Build Android features', 'Write unit and integration tests', 'Maintain legacy code', 'Review PRs'],
        requirements: ['3+ years Android experience', 'Kotlin proficiency', 'Apps on Play Store'],
        benefits: ['Relocation assistance', 'Medical coverage', 'Gym membership', '5-day work week'],
        company: companies[3],
    },
    {
        title: 'Data Analyst',
        description: 'Analyze business data to generate insights that drive product and strategic decisions. Build dashboards, create reports, and present findings to stakeholders.',
        location: 'Mumbai, IN',
        employmentType: 'Full-Time',
        experienceLevel: 'Entry Level',
        salaryRange: '₹5L - ₹8L per year',
        workFrom: 'On-site',
        requiredSkills: ['Python', 'SQL', 'Power BI', 'Excel', 'Pandas'],
        responsibilities: ['Clean and analyze data', 'Build dashboards', 'Present insights to stakeholders', 'Automate reports'],
        requirements: ['1+ year experience', 'Strong SQL skills', 'Knowledge of data visualization'],
        benefits: ['Mentorship program', 'Health coverage', 'Books/courses allowance', 'Performance bonus'],
        company: companies[4],
    },
    {
        title: 'DevOps Engineer',
        description: 'Build and manage CI/CD pipelines, cloud infrastructure, and monitoring systems. Champion automation and reliability across engineering teams.',
        location: 'Remote',
        employmentType: 'Full-Time',
        experienceLevel: 'Senior Level',
        salaryRange: '₹20L - ₹32L per year',
        workFrom: 'Remote',
        requiredSkills: ['Kubernetes', 'Terraform', 'AWS', 'Jenkins', 'Linux'],
        responsibilities: ['Manage cloud infra', 'Build CI/CD pipelines', 'Monitor system health', 'Incident response'],
        requirements: ['5+ years DevOps', 'AWS/GCP certification preferred', 'Strong scripting skills'],
        benefits: ['Remote-first', 'Top-tier salary', 'Stock options', 'Unlimited PTO'],
        company: companies[0],
    },
    {
        title: 'Machine Learning Engineer',
        description: 'Design, train, and deploy ML models for real-world product features including recommendations, NLP, and computer vision. Collaborate with data scientists and engineers.',
        location: 'Bangalore, IN',
        employmentType: 'Full-Time',
        experienceLevel: 'Senior Level',
        salaryRange: '₹22L - ₹40L per year',
        workFrom: 'Hybrid',
        requiredSkills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'SQL'],
        responsibilities: ['Train ML models', 'Deploy to production', 'Monitor model drift', 'Research new techniques'],
        requirements: ['MS/PhD in CS or related field preferred', '3+ years ML engineering', 'Experience with model deployment'],
        benefits: ['Research budget', 'Conference sponsorship', 'ESOP', 'Health insurance'],
        company: companies[1],
    },
    {
        title: 'Product Manager',
        description: 'Own the product roadmap and work cross-functionally with engineering, design, and business teams to ship features that delight users and grow the business.',
        location: 'Pune, IN',
        employmentType: 'Full-Time',
        experienceLevel: 'Mid Level',
        salaryRange: '₹15L - ₹24L per year',
        workFrom: 'Hybrid',
        requiredSkills: ['Roadmapping', 'Agile', 'Data Analysis', 'Stakeholder Management', 'JIRA'],
        responsibilities: ['Define product vision', 'Prioritize backlog', 'Coordinate with engineering', 'Track KPIs'],
        requirements: ['3+ years PM experience', 'Strong analytical skills', 'Excellent communication'],
        benefits: ['Leadership development', 'Health & wellness', 'Travel allowance', 'ESOPs'],
        company: companies[2],
    },
    {
        title: 'React Native Developer',
        description: 'Build cross-platform mobile applications using React Native. Write clean, maintainable JavaScript/TypeScript code and work closely with the product team.',
        location: 'Chennai, IN',
        employmentType: 'Full-Time',
        experienceLevel: 'Mid Level',
        salaryRange: '₹9L - ₹15L per year',
        workFrom: 'On-site',
        requiredSkills: ['React Native', 'JavaScript', 'TypeScript', 'Redux', 'REST APIs'],
        responsibilities: ['Build RN features', 'Debug performance issues', 'Write tests', 'Code reviews'],
        requirements: ['2+ years React Native', 'Published mobile apps', 'TypeScript experience'],
        benefits: ['5-day week', 'Health insurance', 'Meal allowance', 'Annual bonus'],
        company: companies[3],
    },
    {
        title: 'QA Engineer',
        description: 'Ensure product quality through manual and automated testing. Develop test plans, report bugs, and work closely with developers to ship polished software.',
        location: 'Remote',
        employmentType: 'Full-Time',
        experienceLevel: 'Entry Level',
        salaryRange: '₹4L - ₹7L per year',
        workFrom: 'Remote',
        requiredSkills: ['Selenium', 'Appium', 'JIRA', 'Test Planning', 'API Testing'],
        responsibilities: ['Write test cases', 'Automate test suites', 'Log and track bugs', 'Regression testing'],
        requirements: ['1+ year QA experience', 'Knowledge of testing tools', 'Attention to detail'],
        benefits: ['Remote work', 'Learning stipend', 'Health coverage', 'Flexible hours'],
        company: companies[4],
    },
    {
        title: 'Full Stack Developer',
        description: 'Work on both frontend and backend systems to deliver end-to-end features. Use React for web, Node.js for APIs, and PostgreSQL for data.',
        location: 'Bangalore, IN',
        employmentType: 'Full-Time',
        experienceLevel: 'Mid Level',
        salaryRange: '₹12L - ₹20L per year',
        workFrom: 'Hybrid',
        requiredSkills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Docker'],
        responsibilities: ['Build full-stack features', 'Design database schemas', 'Write unit tests', 'Deploy to cloud'],
        requirements: ['3+ years full-stack experience', 'Strong React and Node.js skills', 'Cloud deployment experience'],
        benefits: ['Flexible hours', 'Health insurance', 'Team events', 'Performance bonus'],
        company: companies[0],
    },
    {
        title: 'iOS Developer (Swift)',
        description: 'Build and maintain high-quality iOS applications using Swift and SwiftUI. Optimize for performance and ensure great user experience across all iPhone and iPad sizes.',
        location: 'Delhi, IN',
        employmentType: 'Full-Time',
        experienceLevel: 'Senior Level',
        salaryRange: '₹16L - ₹26L per year',
        workFrom: 'On-site',
        requiredSkills: ['Swift', 'SwiftUI', 'UIKit', 'Xcode', 'Core Data'],
        responsibilities: ['Develop iOS features', 'Optimize app performance', 'App Store submissions', 'Mentor juniors'],
        requirements: ['4+ years iOS development', 'Apps on App Store', 'Strong Swift/SwiftUI skills'],
        benefits: ['Macbook provided', 'Health & dental', 'Relocation bonus', 'ESOPs'],
        company: companies[1],
    },
    {
        title: 'Cybersecurity Analyst',
        description: 'Protect company systems and data by monitoring for threats, conducting vulnerability assessments, and implementing security best practices across the organization.',
        location: 'Mumbai, IN',
        employmentType: 'Full-Time',
        experienceLevel: 'Mid Level',
        salaryRange: '₹12L - ₹18L per year',
        workFrom: 'Hybrid',
        requiredSkills: ['Penetration Testing', 'SIEM', 'Network Security', 'Python', 'OWASP'],
        responsibilities: ['Monitor security events', 'Conduct audits', 'Incident response', 'Security training'],
        requirements: ['CEH/CISSP preferred', '3+ years in security', 'Strong analytical mindset'],
        benefits: ['Certification sponsorship', 'Health coverage', 'Threat intel access', 'Bonus program'],
        company: companies[2],
    },
    {
        title: 'Cloud Solutions Architect',
        description: 'Design and oversee cloud infrastructure architecture on AWS/Azure/GCP. Guide development teams on best practices for scalability, reliability, and cost optimization.',
        location: 'Remote',
        employmentType: 'Contract',
        experienceLevel: 'Senior Level',
        salaryRange: '₹80k - ₹1.2L per month',
        workFrom: 'Remote',
        requiredSkills: ['AWS', 'Azure', 'Terraform', 'Kubernetes', 'Microservices'],
        responsibilities: ['Design cloud architecture', 'Cost optimization', 'Security compliance', 'Team guidance'],
        requirements: ['AWS Solutions Architect certification', '6+ years cloud experience', 'Excellent communication'],
        benefits: ['High day rate', 'Remote work', 'Flexible contract', '6-month renewable'],
        company: companies[3],
    },
    {
        title: 'Technical Content Writer',
        description: 'Create developer-focused content including blog posts, API documentation, tutorials, and release notes. Bridge the gap between engineering and end-users.',
        location: 'Remote',
        employmentType: 'Part-Time',
        experienceLevel: 'Entry Level',
        salaryRange: '₹3L - ₹5L per year',
        workFrom: 'Remote',
        requiredSkills: ['Technical Writing', 'Markdown', 'Git', 'API Documentation', 'English'],
        responsibilities: ['Write developer docs', 'Create tutorials', 'Maintain changelog', 'Review content PRs'],
        requirements: ['Strong English writing skills', 'Basic programming knowledge', 'Experience with docs tools'],
        benefits: ['Fully remote', 'Flexible hours', 'Part-time friendly', 'Growth to full-time'],
        company: companies[4],
    },
];

async function seed() {
    console.log('🌱 Seeding 15 jobs into Firestore...\n');
    let count = 0;

    for (const job of jobs) {
        const docRef = doc(collection(db, 'jobs', job.company.name, 'jobPostings'));
        const id = docRef.id;
        const createdAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString();

        await setDoc(docRef, {
            id,
            title: job.title,
            description: job.description,
            location: job.location,
            employmentType: job.employmentType,
            experienceLevel: job.experienceLevel,
            salaryRange: job.salaryRange,
            workFrom: job.workFrom,
            requiredSkills: job.requiredSkills,
            responsibilities: job.responsibilities,
            requirements: job.requirements,
            benefits: job.benefits,
            companyName: job.company.name,
            companyLogo: job.company.logo,
            employerId: fakeEmployerId,
            createdAt,
            updatedAt: createdAt,
            isActive: true,
            applicantsCount: Math.floor(Math.random() * 30),
            viewCount: Math.floor(Math.random() * 200),
        });

        count++;
        console.log(`✅ [${count}/15] ${job.title} @ ${job.company.name}`);
    }

    console.log('\n🎉 Done! 15 jobs seeded successfully.');
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
});
