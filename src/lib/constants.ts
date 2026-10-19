export const ROLES = [
  'Marketing Lead',
  'Operations Lead',
  'Treasurer Lead',
  'Technical Lead',
  'Partnerships Lead',
  'Tech & Entrepreneurship Lead',
  'Entertainment & Communication Lead',
] as const;

export const QUESTIONS = [
  { key: 'q1_vision', scoreKey: 'q1_score', title: 'Vision & Dream', prompt: 'COB’s vision is to build the best tech students in South Africa and be a home for builders. What are your thoughts on this, and what is your dream for how we achieve it?' },
  { key: 'q2_leading_people', scoreKey: 'q2_score', title: 'Leading a Structure', prompt: 'What are your thoughts on leading a structure of people? How do you view the relationship between a lead and their team?' },
  { key: 'q3_handling_pressure', scoreKey: 'q3_score', title: 'Pressure & Speed', prompt: 'COB can be demanding, and often decisions need to be made fast to protect the students’ interests. What are your thoughts on this, and what is your suggestion for handling high-pressure situations?' },
  { key: 'q4_disagreement', scoreKey: 'q4_score', title: 'Disagreement & Authority', prompt: 'If you are leading a project and you strongly believe your approach is the best way to succeed, but your team disagrees with you and wants to try a different strategy, how do you handle that disagreement?' },
  { key: 'q5_active_initiative', scoreKey: 'q5_score', title: 'Active Initiative', prompt: 'What is something you are currently building, learning, or working on right now outside of your schoolwork? Why are you doing it?' },
] as const;
