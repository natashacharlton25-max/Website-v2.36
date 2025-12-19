// Project data for dynamic pages
export interface Project {
  slug: string;
  title: string;
  category: string;
  date: string;
  description: string;
  longDescription: string;
  whoItsFor: string;
  image: string;
  titleCardImage?: string; // Optional background image for title card
  gallery?: string[];
  tags: string[];
  // Resources included in this project (references to asset slugs)
  resourceSlugs: string[];
  // Professional resources
  professional: {
    intention: string;
    summary: string;
    guidanceNotes: string;
    evidenceBasedBenefits: string[];
    downloadableResources?: string[]; // Professional-specific downloads
  };
}

export const projects: Project[] = [
  {
    slug: 'mindful-moments',
    title: 'Mindful Moments',
    category: 'Wellbeing',
    date: '2024',
    description: 'A curated collection of mindfulness activities and resources designed to promote emotional wellbeing and self-awareness.',
    longDescription: `Mindful Moments is a carefully curated collection of resources that help individuals of all ages develop mindfulness skills and emotional awareness. This project brings together breathing exercises, guided meditations, reflection prompts, and visual aids to support mental wellbeing.

Each resource has been selected for its accessibility and effectiveness in promoting calm, focus, and self-regulation. Whether you're new to mindfulness or looking to deepen your practice, this collection offers something for everyone.`,
    whoItsFor: 'Everyone - children, adults, families, educators, and practitioners. Perfect for home use, classrooms, therapy sessions, or community groups.',
    image: '/Project placeholders/ex2.jpg',
    titleCardImage: '/Project Title Cards/Project title card - example.png',
    tags: ['Mindfulness', 'Wellbeing', 'Self-Care', 'Emotional Health'],
    resourceSlugs: ['breathing-cards', 'emotion-wheel', 'meditation-guide', 'reflection-journal'],
    professional: {
      intention: 'To provide accessible, evidence-based mindfulness tools that can be easily integrated into daily routines, educational settings, or therapeutic practice.',
      summary: 'This project combines visual aids, guided practices, and reflective activities to support the development of mindfulness skills. The resources are designed to be flexible and adaptable to different contexts and age groups.',
      guidanceNotes: `**Getting Started:**
Start with the breathing cards to introduce basic mindfulness concepts. These can be used individually or in group settings.

**Integration Tips:**
- Use at the beginning of sessions to help settle and focus
- Incorporate into daily routines (morning, transitions, bedtime)
- Adapt language and duration based on age and ability
- Model the practices yourself to encourage engagement

**Best Practices:**
- Create a calm, comfortable environment
- Keep initial sessions short (2-5 minutes)
- Be patient and non-judgmental
- Celebrate small successes and efforts

**Contraindications:**
Be mindful that some individuals may find quiet reflection challenging or triggering. Always provide choice and alternatives.`,
      evidenceBasedBenefits: [
        'Reduces stress and anxiety by activating the parasympathetic nervous system',
        'Improves attention span and executive function through regular practice',
        'Enhances emotional regulation and self-awareness',
        'Supports better sleep quality and overall wellbeing',
        'Builds resilience and coping skills for challenging situations'
      ],
      downloadableResources: [
        'Mindful Moments Implementation Guide (PDF)',
        'Session Planning Template (PDF)',
        'Progress Tracking Sheet (PDF)'
      ]
    }
  },
  {
    slug: 'sensory-exploration',
    title: 'Sensory Exploration',
    category: 'Development',
    date: '2024',
    description: 'A hands-on collection of sensory activities and resources to support sensory processing and integration.',
    longDescription: `Sensory Exploration brings together activities and resources that engage all the senses, supporting sensory processing, body awareness, and regulation. This project is designed to help individuals explore their sensory preferences and develop healthy sensory processing patterns.

From tactile experiences to movement activities, each resource encourages active engagement and discovery. The collection can be adapted for individual or group use, and is particularly valuable for those with sensory processing differences.`,
    whoItsFor: 'Everyone - particularly beneficial for children, individuals with sensory processing differences, autism, ADHD, or developmental coordination challenges.',
    image: '/Project placeholders/ex3.jpg',
    tags: ['Sensory', 'Development', 'Integration', 'Body Awareness'],
    resourceSlugs: ['sensory-cards', 'movement-breaks', 'texture-guide', 'calm-corner-setup'],
    professional: {
      intention: 'To provide varied, engaging sensory experiences that support sensory integration, body awareness, and self-regulation across different environments.',
      summary: 'This collection offers evidence-informed sensory activities that can be incorporated into therapeutic practice, educational settings, or home environments. Resources are designed to be adaptable and accessible.',
      guidanceNotes: `**Assessment & Observation:**
Observe individual responses to different sensory inputs. Note preferences, aversions, and neutral responses.

**Creating a Sensory Diet:**
Work with occupational therapy guidance to develop a personalized sensory diet that meets individual needs throughout the day.

**Safety Considerations:**
- Always supervise sensory activities
- Check for allergies and sensitivities
- Ensure materials are age-appropriate
- Provide choice and control over intensity

**Adapting Activities:**
Modify intensity, duration, and complexity based on individual needs and responses. Follow the child's lead and watch for signs of overwhelm.

**Integration:**
Use sensory activities as part of transitions, breaks, or focused intervention time. Consistency helps build predictability and routine.`,
      evidenceBasedBenefits: [
        'Supports sensory integration and processing through varied input',
        'Improves body awareness and motor planning skills',
        'Enhances focus and attention through appropriate sensory regulation',
        'Reduces sensory-seeking or sensory-avoiding behaviors',
        'Builds tolerance and flexibility in sensory experiences'
      ],
      downloadableResources: [
        'Sensory Profile Observation Form (PDF)',
        'Activity Adaptation Guide (PDF)',
        'Sensory Diet Planning Template (PDF)'
      ]
    }
  },
  {
    slug: 'creative-expression',
    title: 'Creative Expression',
    category: 'Creativity',
    date: '2024',
    description: 'An inspiring collection of creative activities and prompts to encourage self-expression, imagination, and artistic exploration.',
    longDescription: `Creative Expression celebrates the power of creativity as a tool for communication, self-discovery, and joy. This curated collection includes art prompts, storytelling activities, music exploration, and movement-based expression.

Creativity is not about perfection - it's about process, exploration, and authentic self-expression. These resources are designed to lower barriers to creative engagement and support individuals in finding their unique creative voice.`,
    whoItsFor: 'Everyone - all ages, all abilities, all experience levels. Perfect for individuals seeking creative outlets or professionals supporting creative development.',
    image: '/Project placeholders/ex4.jpg',
    tags: ['Creativity', 'Art', 'Expression', 'Imagination'],
    resourceSlugs: ['art-prompts', 'story-starters', 'music-exploration', 'expressive-movement'],
    professional: {
      intention: 'To foster creative confidence, self-expression, and emotional literacy through accessible, process-focused creative activities.',
      summary: 'This project emphasizes the therapeutic and developmental benefits of creative expression. Resources are designed to be open-ended and adaptable, focusing on process over product.',
      guidanceNotes: `**Creating a Safe Space:**
Establish a judgment-free environment where all creative expressions are valued. Emphasize that there are no mistakes in creative work.

**Facilitating Creative Activities:**
- Provide choice in materials and mediums
- Model creativity without demonstrating "correct" outcomes
- Use open-ended questions rather than directives
- Celebrate effort and exploration, not just finished products

**Supporting Different Learning Styles:**
Offer multiple modalities (visual, auditory, kinesthetic, tactile) and allow individuals to choose their preferred mode of expression.

**Working with Resistance:**
Some individuals may feel anxious about creative activities. Start small, provide structure when needed, and normalize the creative process.

**Linking to Other Skills:**
Creative expression supports language development, fine motor skills, emotional regulation, and problem-solving.`,
      evidenceBasedBenefits: [
        'Enhances emotional expression and processing through creative outlets',
        'Builds self-confidence and sense of agency through creative success',
        'Develops fine motor skills, hand-eye coordination, and spatial awareness',
        'Supports language development and narrative skills',
        'Reduces stress and promotes positive mood through creative engagement'
      ],
      downloadableResources: [
        'Creative Session Planning Guide (PDF)',
        'Material Suggestions & Adaptations (PDF)',
        'Portfolio Documentation Template (PDF)'
      ]
    }
  }
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return projects.map(p => p.slug);
}
