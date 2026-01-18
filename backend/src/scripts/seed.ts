import { PrismaClient } from '@prisma/client';
import { UserRole } from '../types/prisma';
import { createSupabaseUser } from '../lib/supabase-auth';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  console.log('Creating admin user...');
  let adminSupabaseUser;
  try {
    adminSupabaseUser = await createSupabaseUser(
      'admin@internshub.com',
      'admin123',
      { role: 'ADMIN', firstName: 'Admin', lastName: 'User' }
    );
  } catch (error: any) {
    if (error.message.includes('already been registered')) {
      console.log('Admin user already exists in Supabase Auth, skipping creation...');
      // Get existing user ID from Supabase
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseAdmin = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );
      const { data } = await supabaseAdmin.auth.admin.listUsers();
      adminSupabaseUser = data.users.find(u => u.email === 'admin@internshub.com');
      if (!adminSupabaseUser) {
        throw new Error('Could not find existing admin user in Supabase');
      }
    } else {
      throw error;
    }
  }

  const admin = await prisma.user.upsert({
    where: { email: 'admin@internshub.com' },
    update: {},
    create: {
      id: adminSupabaseUser.id, // Use Supabase user ID
      email: 'admin@internshub.com',
      passwordHash: '', // Not needed with Supabase Auth
      role: UserRole.ADMIN,
      emailVerified: true,
      adminProfile: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
        },
      },
    },
    include: {
      adminProfile: true,
    },
  });

  console.log('Created admin:', admin.email);

  // Create sample guide
  console.log('Creating guide user...');
  let guideSupabaseUser;
  try {
    guideSupabaseUser = await createSupabaseUser(
      'guide@internshub.com',
      'guide123',
      { role: 'GUIDE', firstName: 'John', lastName: 'Guide' }
    );
  } catch (error: any) {
    if (error.message.includes('already been registered')) {
      console.log('Guide user already exists in Supabase Auth, skipping creation...');
      // Get existing user ID from Supabase
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseAdmin = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );
      const { data } = await supabaseAdmin.auth.admin.listUsers();
      guideSupabaseUser = data.users.find(u => u.email === 'guide@internshub.com');
      if (!guideSupabaseUser) {
        throw new Error('Could not find existing guide user in Supabase');
      }
    } else {
      throw error;
    }
  }

  const guide = await prisma.user.upsert({
    where: { email: 'guide@internshub.com' },
    update: {},
    create: {
      id: guideSupabaseUser.id, // Use Supabase user ID
      email: 'guide@internshub.com',
      passwordHash: '', // Not needed with Supabase Auth
      role: UserRole.GUIDE,
      emailVerified: true,
      guideProfile: {
        create: {
          firstName: 'John',
          lastName: 'Guide',
          bio: 'Experienced software engineer and mentor',
          expertise: ['Full Stack Development', 'React', 'Node.js'],
          organization: 'Tech Corp',
        },
      },
    },
    include: {
      guideProfile: true,
    },
  });

  console.log('Created guide:', guide.email);

  // Create sample intern
  console.log('Creating intern user...');
  let internSupabaseUser;
  try {
    internSupabaseUser = await createSupabaseUser(
      'intern@internshub.com',
      'intern123',
      { role: 'INTERN', firstName: 'Jane', lastName: 'Intern' }
    );
  } catch (error: any) {
    if (error.message.includes('already been registered')) {
      console.log('Intern user already exists in Supabase Auth, skipping creation...');
      // Get existing user ID from Supabase
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseAdmin = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );
      const { data } = await supabaseAdmin.auth.admin.listUsers();
      internSupabaseUser = data.users.find(u => u.email === 'intern@internshub.com');
      if (!internSupabaseUser) {
        throw new Error('Could not find existing intern user in Supabase');
      }
    } else {
      throw error;
    }
  }

  const intern = await prisma.user.upsert({
    where: { email: 'intern@internshub.com' },
    update: {},
    create: {
      id: internSupabaseUser.id, // Use Supabase user ID
      email: 'intern@internshub.com',
      passwordHash: '', // Not needed with Supabase Auth
      role: UserRole.INTERN,
      emailVerified: true,
      internProfile: {
        create: {
          firstName: 'Jane',
          lastName: 'Intern',
          bio: 'Computer Science student passionate about web development',
          skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
          institution: 'University of Technology',
          yearOfStudy: '3rd Year',
        },
      },
    },
    include: {
      internProfile: true,
    },
  });

  console.log('Created intern:', intern.email);

  // Create sample project (draft)
  if (guide.guideProfile) {
    const project = await prisma.project.upsert({
      where: { id: 'sample-project-id' },
      update: {},
      create: {
        id: 'sample-project-id',
        guideId: guide.guideProfile.id,
        title: 'E-Commerce Platform',
        shortDescription: 'Build a modern e-commerce platform with React and Node.js',
        detailedDescription: 'This project involves building a full-stack e-commerce platform with features like product catalog, shopping cart, user authentication, and payment integration.',
        scope: 'The project will include frontend development with React, backend API with Node.js, database design with PostgreSQL, and deployment on cloud infrastructure.',
        useCases: [
          'Product browsing and search',
          'User registration and authentication',
          'Shopping cart management',
          'Order processing',
        ],
        durationWeeks: 12,
        status: 'DRAFT',
        phases: {
          create: [
            {
              title: 'Planning & Design',
              description: 'Define requirements, create wireframes, and design database schema',
              order: 1,
            },
            {
              title: 'Backend Development',
              description: 'Implement REST API, authentication, and database models',
              order: 2,
            },
            {
              title: 'Frontend Development',
              description: 'Build React components, implement routing, and integrate with API',
              order: 3,
            },
            {
              title: 'Testing & Deployment',
              description: 'Write tests, fix bugs, and deploy to production',
              order: 4,
            },
          ],
        },
        roles: {
          create: [
            {
              title: 'Frontend Developer',
              description: 'Responsible for building React components and UI/UX',
              requiredSkills: ['React', 'TypeScript', 'CSS'],
              maxInterns: 2,
            },
            {
              title: 'Backend Developer',
              description: 'Responsible for API development and database design',
              requiredSkills: ['Node.js', 'PostgreSQL', 'REST API'],
              maxInterns: 2,
            },
          ],
        },
      },
      include: {
        phases: true,
        roles: true,
      },
    });

    console.log('Created sample project:', project.title);
  }

  console.log('Seeding completed!');
  console.log('\nSample credentials:');
  console.log('Admin: admin@internshub.com / admin123');
  console.log('Guide: guide@internshub.com / guide123');
  console.log('Intern: intern@internshub.com / intern123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

