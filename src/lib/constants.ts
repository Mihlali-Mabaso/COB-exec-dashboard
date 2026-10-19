export const ROLES = [
  'Technical Lead',
  'Tech & Entrepreneurship Lead',
  'Marketing Lead',
  'Entertainment & Communication Lead',
  'Operations Lead',
  'Treasurer Lead',
  'Partnerships & Sponsorships Lead',
] as const;

export const DASHBOARD_ROLES = [...ROLES, 'Partnerships Lead'] as const;

export const ROLE_DETAILS: Record<string, { description: string; finalQuestion: string }> = {
  'Technical Lead': {
    description: 'As Technical Lead, you’re the head builder. You’ll oversee our coding workshops, guide students on their portfolio projects, and manage the technical subcommittee to ensure we’re actually shipping real work.',
    finalQuestion: 'If you step into this role, you\'ll be dealing with students at completely different skill levels—from absolute beginners to advanced coders. How would you structure a technical workshop or project to make sure the beginners aren\'t lost, but the advanced students don\'t get bored?',
  },
  'Tech & Entrepreneurship Lead': {
    description: 'As the Tech & Entrepreneurship Lead, you are the startup catalyst. You’ll partner with business incubators, guide tech students on the business side of IT, and help students pitch their software ideas and launch their startups.',
    finalQuestion: 'A student comes to you with an amazing technical project, but they have zero idea how to turn it into a business or pitch it. What is the very first step you would take to help them bridge that gap between “tech project” and “business”?',
  },
  'Marketing Lead': {
    description: 'As Marketing Lead, you are the brand architect. You’ll manage COB’s visual identity, create posters and digital content, run our social media pages, and make sure our events reach the right audience.',
    finalQuestion: 'We can have the best tech events on campus, but if no one shows up, it means nothing. If you had to launch a campaign to get 100 new students to join COB, what would be your strategy to actually get them through the door?',
  },
  'Entertainment & Communication Lead': {
    description: 'As the Entertainment & Communication Lead, you are the voice and energy of COB. You’ll be the direct line of communication in the group chat, plan fun social activities, and keep the community alive so it doesn’t feel like just a mailing list.',
    finalQuestion: 'It’s week 6 of the semester. Exams are coming, and the group chat has been completely dead for two weeks. As the Entertainment Lead, what is the first message you send, or the first activity you plan, to wake the Cobbies up and get them engaging again?',
  },
  'Operations Lead': {
    description: 'As Operations Lead, you are the logistics master. You’ll own venue bookings, manage UFS compliance, handle event logistics, and ensure that every COB activity runs smoothly and professionally on the day.',
    finalQuestion: 'It’s the day before a major COB event, and suddenly the venue cancels on you. You have 50 students expecting an event tomorrow. What are the exact steps you would take in those 24 hours to save the event?',
  },
  'Treasurer Lead': {
    description: 'As Treasurer Lead, you are the financial gatekeeper. You’ll manage the COB budget, oversee funding requests to the university and SRC, track expenses, and ensure we have the money to run our initiatives.',
    finalQuestion: 'Imagine a portfolio lead comes to you and says they need funding for an event next week, but they didn’t submit the quote on time. You know the event is important, but the process is broken. How do you handle the lead, and how do you handle the money?',
  },
  'Partnerships & Sponsorships Lead': {
    description: 'As Partnerships Lead, you are the bridge to industry. You’ll build relationships with tech companies, secure guest speakers, find open-source projects for students, and explore sponsorship opportunities.',
    finalQuestion: 'You reach out to a company on LinkedIn about partnering with COB, and they leave you on read for three weeks. How do you handle the silence, and what is your next move to actually get them on board?',
  },
};

export function getRoleDetails(role: string) {
  return ROLE_DETAILS[role] ?? (role === 'Partnerships Lead' ? ROLE_DETAILS['Partnerships & Sponsorships Lead'] : undefined);
}

export const QUESTIONS = [
  { key: 'q1_vision', scoreKey: 'q1_score', title: 'Vision & Dream', prompt: 'COB’s vision is to build the best tech students in South Africa and be a home for builders. What are your thoughts on this, and what is your dream for how we achieve it?' },
  { key: 'q2_leading_people', scoreKey: 'q2_score', title: 'Leading a Structure', prompt: 'What are your thoughts on leading a structure of people? How do you view the relationship between a lead and their team?' },
  { key: 'q3_handling_pressure', scoreKey: 'q3_score', title: 'Pressure & Speed', prompt: 'COB can be demanding, and often decisions need to be made fast to protect the students’ interests. What are your thoughts on this, and what is your suggestion for handling high-pressure situations?' },
  { key: 'q4_disagreement', scoreKey: 'q4_score', title: 'Disagreement & Authority', prompt: 'If you are leading a project and you strongly believe your approach is the best way to succeed, but your team disagrees with you and wants to try a different strategy, how do you handle that disagreement?' },
] as const;

export const QUESTION_SCORE_KEYS = ['q1_score', 'q2_score', 'q3_score', 'q4_score', 'q5_score'] as const;
