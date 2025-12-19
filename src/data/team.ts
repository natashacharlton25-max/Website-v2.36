// Team Members Data
// Example data for TeamCard components

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  department?: string;
  image?: string;
  bio?: string;
  email?: string;
  phone?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
}

// Empty for now - add team members when images are available
export const teamMembers: TeamMember[] = [];

// Helper functions
export function getTeamMemberById(id: string): TeamMember | undefined {
  return teamMembers.find(member => member.id === id);
}

export function getTeamMembersByDepartment(department: string): TeamMember[] {
  return teamMembers.filter(member => member.department === department);
}

export function getAllDepartments(): string[] {
  const departments = teamMembers
    .map(member => member.department)
    .filter((dept): dept is string => dept !== undefined);
  return [...new Set(departments)];
}

export function getLeadershipTeam(): TeamMember[] {
  const leadershipTitles = ['CEO', 'CTO', 'Chief', 'Director', 'VP'];
  return teamMembers.filter(member =>
    leadershipTitles.some(title => member.title.includes(title))
  );
}
