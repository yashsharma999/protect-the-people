'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { use } from 'react';

// Story data - in production, this would come from a CMS or database
const storiesData: Record<string, {
  title: string;
  subtitle: string;
  excerpt: string;
  author: string;
  authorRole: string;
  readTime: string;
  date: string;
  image: string;
  avatar: string;
  category: string;
  content: React.ReactNode;
}> = {
  'rural-education': {
    title: 'Bridging the Gap: Rural Education',
    subtitle: 'How quality education is transforming lives in India\'s most underserved communities',
    excerpt: 'Quality education is a fundamental right that is effectively breaking the cycle of poverty and empowering the next generation across India.',
    author: 'Mohit Sharma',
    authorRole: 'Founder, Protect The People Foundation',
    readTime: '5 min read',
    date: 'January 8, 2026',
    image: '/story_education.jpeg',
    avatar: '/author.jpeg',
    category: 'Education',
    content: (
      <>
        <p className="text-xl leading-relaxed text-gray-700 mb-8 first-letter:text-6xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1">
          In the remote villages of Rajasthan, where the sun beats down on dusty pathways and water is a precious commodity, a quiet revolution is taking place. Children who once spent their days helping with household chores or working in fields are now walking to school with books in their hands and dreams in their hearts.
        </p>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          Quality education is not just about reading and writing—it's about transformation. When a child from a marginalized community learns to read, they don't just decode letters on a page. They unlock doors to opportunities that their parents never had access to. They gain the confidence to question, to dream, and to aspire for a life beyond the limitations of their circumstances.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">The Ground Reality</h2>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          According to our Annual Report 2024-2025, the educational landscape in rural Rajasthan presents both challenges and opportunities. Many villages lack basic infrastructure—proper school buildings, trained teachers, and learning materials. But more than physical infrastructure, what's often missing is hope.
        </p>

        <blockquote className="border-l-4 border-lime pl-6 my-10 py-4 bg-gray-50 rounded-r-lg">
          <p className="text-xl italic text-gray-700 mb-2">
            "When I first started school, my parents didn't see the point. Now they tell everyone in the village about my marks."
          </p>
          <cite className="text-sm font-medium text-gray-500 not-italic">— Meera, 12 years old, Barmer District</cite>
        </blockquote>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          Parents, who themselves never received formal education, often struggle to understand its value. The immediate need for income, especially in families living below the poverty line, makes it difficult to prioritize something as seemingly abstract as education. This is where our work begins—not just with children, but with entire communities.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">Our Approach: Community-Centered Education</h2>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          The Protect The People Foundation believes that sustainable change happens when communities take ownership. Our programs are designed not to impose solutions from outside, but to work alongside families to identify barriers and build bridges.
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-10">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-3xl font-bold text-[#1a2e35] mb-2">2,500+</div>
            <div className="text-gray-600">Children enrolled in our learning centers</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-3xl font-bold text-[#1a2e35] mb-2">45</div>
            <div className="text-gray-600">Villages with active education programs</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-3xl font-bold text-[#1a2e35] mb-2">92%</div>
            <div className="text-gray-600">Student retention rate year-over-year</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-3xl font-bold text-[#1a2e35] mb-2">180+</div>
            <div className="text-gray-600">Trained local educators and volunteers</div>
          </div>
        </div>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          We train local youth as educators, creating employment within the community while ensuring cultural relevance in teaching methods. Our learning centers operate at flexible hours, accommodating children who help their families during peak agricultural seasons.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">Beyond Books: Holistic Development</h2>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          Education extends beyond textbooks. Our programs incorporate life skills training, nutritional support, and health awareness. A hungry child cannot focus on mathematics. A sick child cannot attend school. By addressing these interconnected challenges, we create an environment where learning can truly flourish.
        </p>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          We've seen remarkable transformations. Girls who were on the verge of early marriage are now completing their secondary education. Boys who would have dropped out to work as laborers are preparing for competitive examinations. Parents who once questioned the value of schooling are now its strongest advocates in their communities.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">The Road Ahead</h2>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          Our vision is ambitious but achievable: ensuring that every child in rural Rajasthan has access to quality education, regardless of their economic background, caste, or gender. This requires sustained effort, community partnership, and continued support from individuals and organizations who believe in the transformative power of education.
        </p>

        <p className="text-lg leading-relaxed text-gray-600 mb-8">
          Every child deserves the chance to dream—and the tools to make those dreams reality. Together, we're not just teaching children to read. We're rewriting the story of entire communities.
        </p>

        <div className="bg-[#1a2e35] text-white p-8 rounded-2xl my-12">
          <h3 className="text-xl font-semibold mb-4">Support Rural Education</h3>
          <p className="text-gray-300 mb-6">
            Your contribution can help us reach more children in underserved communities. Every donation makes a difference.
          </p>
          <Link 
            href="/#how-to-help" 
            className="inline-block bg-lime text-[#1a2e35] px-6 py-3 rounded-lg font-semibold hover:bg-lime/90 transition-colors"
          >
            Learn How to Help
          </Link>
        </div>
      </>
    ),
  },
  'zero-hunger': {
    title: 'Nourishing Hope: The Zero Hunger Mission',
    subtitle: 'How community kitchens and food security programs are restoring dignity to families across India',
    excerpt: 'Dignity is a fundamental right that is deeply rooted in the security of a daily meal.',
    author: 'Mohit Sharma',
    authorRole: 'Founder, Protect The People Foundation',
    readTime: '13 min read',
    date: 'December 15, 2025',
    image: '/story_hunger.jpeg',
    avatar: '/author.jpeg',
    category: 'Food Security',
    content: (
      <>
        <p className="text-xl leading-relaxed text-gray-700 mb-8 first-letter:text-6xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1">
          At 5:30 every morning, before the first light breaks over the horizon, Kamla Devi begins her day in a small community kitchen in eastern Uttar Pradesh. The aroma of dal cooking over wood fires mingles with the morning mist as she and twelve other women prepare meals that will feed over 400 people today. For many of those 400, this will be their only guaranteed meal.
        </p>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          Hunger is not just about empty stomachs. It is about the mother who skips meals so her children can eat. It is about the elderly widow who hasn't had a proper meal in days. It is about the daily wage laborer whose family goes hungry on days when there is no work. Hunger strips away dignity, clouds judgment, and steals futures.
        </p>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          The Protect The People Foundation's Zero Hunger Mission was born from a simple but profound realization: no sustainable development—whether in education, health, or economic empowerment—is possible when people are worried about their next meal.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">Understanding the Crisis</h2>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          India faces a paradox that defies easy explanation. We are a nation that produces enough food to feed our entire population, yet millions go to bed hungry every night. According to the Global Hunger Index, India continues to face serious hunger challenges, with child wasting rates among the highest in the world.
        </p>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          The causes are multifaceted: poverty, certainly, but also inadequate food distribution systems, lack of awareness about nutrition, gender inequality that affects women's and girls' access to food, and the devastating economic impacts of events like the pandemic that pushed millions into food insecurity.
        </p>

        <blockquote className="border-l-4 border-lime pl-6 my-10 py-4 bg-gray-50 rounded-r-lg">
          <p className="text-xl italic text-gray-700 mb-2">
            "Before the community kitchen opened, there were days when my children would cry themselves to sleep from hunger. Now they eat two meals a day and can focus on their studies."
          </p>
          <cite className="text-sm font-medium text-gray-500 not-italic">— Sunita, mother of three, Gorakhpur District</cite>
        </blockquote>

        <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">Our Multi-Pronged Approach</h2>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          The Zero Hunger Mission operates on multiple fronts, recognizing that food security is not a single problem but a web of interconnected challenges that require comprehensive solutions.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-10 mb-4">Community Kitchens</h3>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          Our flagship program establishes community-run kitchens in areas with the highest rates of food insecurity. These kitchens are not charity—they are dignity restored. Run by local women who receive fair wages for their work, they provide nutritious meals to those who need them most: the elderly, the disabled, single mothers, and families in crisis.
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-10">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-3xl font-bold text-[#1a2e35] mb-2">23</div>
            <div className="text-gray-600">Community kitchens across 3 states</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-3xl font-bold text-[#1a2e35] mb-2">8,500+</div>
            <div className="text-gray-600">Meals served daily</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-3xl font-bold text-[#1a2e35] mb-2">156</div>
            <div className="text-gray-600">Women employed in kitchen operations</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-3xl font-bold text-[#1a2e35] mb-2">₹12</div>
            <div className="text-gray-600">Average cost per nutritious meal</div>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mt-10 mb-4">Mid-Day Meal Enhancement</h3>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          While the government's mid-day meal scheme is an important initiative, implementation gaps often leave children with inadequate nutrition. Our program works to supplement and enhance these meals in 67 schools, adding protein-rich foods, fresh vegetables, and fruits to ensure children receive balanced nutrition.
        </p>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          Our 2024 Impact Study found that in schools where we operate, student attendance increased by 23%, and teachers reported significant improvements in concentration and academic performance. When children aren't hungry, they can learn.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-10 mb-4">Emergency Food Relief</h3>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          Disasters—whether natural calamities, economic crises, or health emergencies—hit the poor hardest. Our rapid response teams can mobilize within 48 hours to provide food relief to affected communities. During the pandemic, we distributed over 50,000 food packages to families who had lost their livelihoods overnight.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">The Nutrition Connection</h2>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          Fighting hunger is not just about calories—it's about nutrition. Malnutrition, even when food is available, remains a persistent challenge. Many families, even when they have food, lack knowledge about balanced diets, leading to hidden hunger: deficiencies in essential vitamins and minerals that affect physical and cognitive development.
        </p>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          Our nutrition awareness programs reach thousands of families each month, teaching them about locally available nutritious foods, proper feeding practices for infants and young children, and the importance of dietary diversity. We've developed simple visual guides in local languages that help families make healthier food choices within their budget constraints.
        </p>

        <blockquote className="border-l-4 border-lime pl-6 my-10 py-4 bg-gray-50 rounded-r-lg">
          <p className="text-xl italic text-gray-700 mb-2">
            "I used to think expensive foods were nutritious. The nutrition sessions taught me that dal, seasonal vegetables, and eggs can give my family everything they need. My daughter's anemia has improved without any medicine."
          </p>
          <cite className="text-sm font-medium text-gray-500 not-italic">— Rekha, participant in nutrition awareness program</cite>
        </blockquote>

        <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">Women at the Center</h2>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          In most households, women are responsible for food preparation and are often the last to eat, taking what remains after everyone else has been fed. This cultural practice contributes to alarming rates of anemia and malnutrition among women, which in turn affects the health of children born to malnourished mothers.
        </p>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          Our programs specifically target women's nutrition, running special health camps, distributing iron and folic acid supplements to pregnant and lactating women, and working with communities to change harmful norms around women's eating practices.
        </p>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          By employing women in our community kitchens, we achieve a dual purpose: ensuring family income that directly translates to better nutrition at home, and empowering women as providers and decision-makers in their communities.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">Sustainable Solutions</h2>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          We believe that true food security comes not from perpetual aid but from sustainable solutions that empower communities to feed themselves. Our kitchen garden initiative has helped over 1,200 families establish small vegetable gardens, providing fresh produce and reducing food expenses.
        </p>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          We're also working with local farmers to improve agricultural practices, reduce post-harvest losses, and connect them directly with consumers, ensuring fair prices for their produce while making nutritious food more affordable for families.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">The Ripple Effect</h2>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          The impact of food security extends far beyond the dinner plate. When families have reliable access to food, parents can focus on work without the constant anxiety of providing the next meal. Children can concentrate in school. Health improves. Household tensions decrease. Dreams become possible.
        </p>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          We've seen families who once lived meal-to-meal now saving money for their children's education. We've seen communities that once competed for scarce resources now sharing and supporting each other. We've seen dignity restored, one meal at a time.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">The Road to Zero Hunger</h2>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          The United Nations' Sustainable Development Goal of Zero Hunger by 2030 is ambitious, but it is not impossible. It requires political will, systemic change, and sustained commitment from governments, organizations, and individuals.
        </p>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          At the Protect The People Foundation, we believe that hunger is not an inevitable condition—it is a solvable problem. Every meal we serve, every kitchen we establish, every family we reach brings us one step closer to a world where no one goes to bed hungry.
        </p>

        <p className="text-lg leading-relaxed text-gray-600 mb-8">
          Kamla Devi, who starts her day in that community kitchen at 5:30 AM, puts it simply: "When I see children eating with full stomachs, laughing and playing instead of crying from hunger, I know this work matters. Every grain of rice we cook is a grain of hope."
        </p>

        <div className="bg-[#1a2e35] text-white p-8 rounded-2xl my-12">
          <h3 className="text-xl font-semibold mb-4">Support the Zero Hunger Mission</h3>
          <p className="text-gray-300 mb-6">
            ₹12 can provide a nutritious meal. ₹360 can feed a child for a month. Your support directly translates to food on plates and hope in hearts.
          </p>
          <Link 
            href="/#how-to-help" 
            className="inline-block bg-lime text-[#1a2e35] px-6 py-3 rounded-lg font-semibold hover:bg-lime/90 transition-colors"
          >
            Learn How to Help
          </Link>
        </div>
      </>
    ),
  },
  'rights-for-all': {
    title: 'Restoring Dignity: Rights for All',
    subtitle: 'Legal aid and awareness programs empowering marginalized communities to claim their fundamental rights',
    excerpt: 'Justice is a fundamental pillar that is deeply essential to the safety and equality of our people.',
    author: 'Mohit Sharma',
    authorRole: 'Founder, Protect The People Foundation',
    readTime: '6 min read',
    date: 'November 22, 2025',
    image: '/story_rights.jpeg',
    avatar: '/author.jpeg',
    category: 'Human Rights',
    content: (
      <>
        <p className="text-xl leading-relaxed text-gray-700 mb-8 first-letter:text-6xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1">
          Suman had never seen the inside of a police station until the day her husband was arrested on false charges. A domestic worker in Delhi, she had no idea how to navigate the legal system, no money for a lawyer, and no one to turn to. Her husband remained in jail for eight months before anyone reviewed his case—eight months of lost income, mounting debt, and a family teetering on the edge of survival.
        </p>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          Suman's story is not unique. Across India, millions of people from marginalized communities face a justice system they cannot access, understand, or afford. Their rights exist on paper but remain out of reach in practice. This gap between law and reality is where our Rights for All program operates.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">The Justice Gap</h2>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          India's constitution guarantees fundamental rights to every citizen. But for the poor, the illiterate, and the socially marginalized, these rights often remain theoretical. Language barriers, complex procedures, corruption, and sheer intimidation keep the most vulnerable from accessing justice.
        </p>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          Women facing domestic violence don't know their legal protections. Workers exploited by employers don't know they can file complaints. Families whose land has been illegally occupied don't know the process to reclaim it. The law exists, but knowledge of it doesn't reach those who need it most.
        </p>

        <blockquote className="border-l-4 border-lime pl-6 my-10 py-4 bg-gray-50 rounded-r-lg">
          <p className="text-xl italic text-gray-700 mb-2">
            "I didn't know I had rights. I thought the way my employer treated me was just how things were. The awareness camp changed everything."
          </p>
          <cite className="text-sm font-medium text-gray-500 not-italic">— Lakshmi, domestic worker, Mumbai</cite>
        </blockquote>

        <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">Our Approach</h2>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          The Rights for All program works on three interconnected fronts: awareness, access, and advocacy. We believe that lasting change happens when communities are empowered to claim their own rights, not when they remain dependent on external help.
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-10">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-3xl font-bold text-[#1a2e35] mb-2">340+</div>
            <div className="text-gray-600">Rights awareness camps conducted</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-3xl font-bold text-[#1a2e35] mb-2">12,000+</div>
            <div className="text-gray-600">People reached through legal literacy</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-3xl font-bold text-[#1a2e35] mb-2">890</div>
            <div className="text-gray-600">Cases supported through legal aid</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-3xl font-bold text-[#1a2e35] mb-2">78%</div>
            <div className="text-gray-600">Success rate in supported cases</div>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mt-10 mb-4">Legal Literacy</h3>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          Our awareness camps, conducted in villages and urban slums, use simple language, street theater, and visual materials to explain key rights and legal processes. We focus on practical knowledge: how to file a complaint, what documents to keep, where to seek help, what protections exist against abuse.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-10 mb-4">Free Legal Aid</h3>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          For those who need legal representation, we connect them with a network of volunteer lawyers and legal aid organizations. Our paralegals help with documentation, court procedures, and navigation of bureaucratic processes that would otherwise be insurmountable obstacles.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-10 mb-4">Community Advocates</h3>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          We train community members as paralegal volunteers—people who understand both the law and their community's specific challenges. These advocates become permanent resources, helping neighbors understand their rights and access appropriate remedies long after our camps have ended.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">Stories of Change</h2>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          After attending our awareness camp, Suman learned about free legal aid services. A volunteer lawyer took her husband's case, and he was released within weeks when the charges were shown to be baseless. Today, Suman herself volunteers at our camps, helping other women navigate crises she knows all too well.
        </p>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          In a village in Uttar Pradesh, our program helped 45 families reclaim land that had been illegally occupied by a local strongman for over a decade. The families had assumed nothing could be done—they didn't know about legal remedies or have the resources to pursue them. With proper documentation and legal support, they won their case and reclaimed their livelihoods.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">Looking Forward</h2>

        <p className="text-lg leading-relaxed text-gray-600 mb-6">
          Rights without access to justice are merely words. Our vision is a society where every person, regardless of their economic status or social position, can claim and exercise their fundamental rights. This requires not just individual interventions but systemic change.
        </p>

        <p className="text-lg leading-relaxed text-gray-600 mb-8">
          We continue to advocate for simplified legal processes, greater legal aid funding, and training for officials who interact with marginalized communities. Every person who learns their rights, every case successfully resolved, every community advocate trained is a step toward that vision.
        </p>

        <div className="bg-[#1a2e35] text-white p-8 rounded-2xl my-12">
          <h3 className="text-xl font-semibold mb-4">Support Rights for All</h3>
          <p className="text-gray-300 mb-6">
            Help us bring legal awareness and aid to communities that need it most. Your support empowers people to claim their dignity.
          </p>
          <Link 
            href="/#how-to-help" 
            className="inline-block bg-lime text-[#1a2e35] px-6 py-3 rounded-lg font-semibold hover:bg-lime/90 transition-colors"
          >
            Learn How to Help
          </Link>
        </div>
      </>
    ),
  },
};

// Helper to get other stories for "More Stories" section
const getOtherStories = (currentSlug: string) => {
  return Object.entries(storiesData)
    .filter(([slug]) => slug !== currentSlug)
    .map(([slug, story]) => ({ slug, ...story }));
};

export default function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const story = storiesData[slug];

  if (!story) {
    return (
      <div className="font-sans text-slate-900 bg-white min-h-screen flex flex-col">
        <Navbar forceScrolled />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Story Not Found</h1>
            <p className="text-gray-600 mb-8">The story you're looking for doesn't exist.</p>
            <Link href="/#our-stories" className="text-[#1a2e35] underline hover:no-underline">
              ← Back to Stories
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-sans text-slate-900 bg-white min-h-screen flex flex-col">
      <Navbar forceScrolled />
      <main className="flex-grow">
        {/* Hero Section */}
        <motion.article 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <header className="pt-32 pb-12 ">
            <div className="container mx-auto max-w-4xl">
              <Link 
                href="/#our-stories" 
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8 group"
              >
                <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </Link>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-sm font-bold tracking-widest text-gray-500 mb-4 block uppercase">{story.category}</span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 mb-6">
                  {story.title}
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl">
                  {story.subtitle}
                </p>
              </motion.div>

              {/* Author Info */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4 mt-10 pt-8 border-t border-gray-200"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200">
                  <img src={story.avatar} alt={story.author} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{story.author}</div>
                  <div className="text-sm text-gray-500">{story.authorRole}</div>
                </div>
                <div className="ml-auto text-right hidden sm:block">
                  <div className="text-sm text-gray-500">{story.date}</div>
                  <div className="text-sm font-medium text-gray-700">{story.readTime}</div>
                </div>
              </motion.div>
            </div>
          </header>

          {/* Featured Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="container mx-auto px-6 max-w-5xl -mt-4"
          >
            <div className="aspect-[2/1] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={story.image} 
                alt={story.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="container mx-auto px-6 max-w-3xl py-16"
          >
            {story.content}
          </motion.div>

          {/* Share Section */}
          <div className="border-t border-gray-200 py-12">
            <div className="container mx-auto px-6 max-w-3xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    <img src={story.avatar} alt={story.author} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Written by</div>
                    <div className="font-semibold text-gray-900">{story.author}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">Share this story</span>
                  <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* More Stories */}
          <div className="bg-gray-50 py-16">
            <div className="container mx-auto px-6 max-w-4xl">
              <h3 className="text-2xl font-bold mb-8">More Stories</h3>
              <div className="grid md:grid-cols-2 gap-8">
                {getOtherStories(slug).map((otherStory) => (
                  <Link key={otherStory.slug} href={`/stories/${otherStory.slug}`} className="group">
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={otherStory.image} 
                          alt={otherStory.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <h4 className="font-semibold text-lg mb-2 group-hover:text-gray-600 transition-colors">
                          {otherStory.title}
                        </h4>
                        <p className="text-sm text-gray-500">{otherStory.readTime}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.article>
      </main>
      <Footer />
    </div>
  );
}

