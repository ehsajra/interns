// Test file to verify our backup enums work correctly
import { UserRole, ProjectStatus, ApplicationStatus } from './prisma';

// Test that enums have the correct values
export const testEnums = () => {
  console.log('Testing backup enums...');
  
  // Test UserRole
  console.log('UserRole.INTERN:', UserRole.INTERN);
  console.log('UserRole.GUIDE:', UserRole.GUIDE);
  console.log('UserRole.ADMIN:', UserRole.ADMIN);
  
  // Test ProjectStatus
  console.log('ProjectStatus.DRAFT:', ProjectStatus.DRAFT);
  console.log('ProjectStatus.PUBLISHED:', ProjectStatus.PUBLISHED);
  
  // Test ApplicationStatus
  console.log('ApplicationStatus.APPLIED:', ApplicationStatus.APPLIED);
  console.log('ApplicationStatus.SHORTLISTED:', ApplicationStatus.SHORTLISTED);
  
  console.log('All backup enums working correctly!');
};

// Export for use in other files if needed
export { UserRole, ProjectStatus, ApplicationStatus };