require('dotenv').config();
const mongoose = require('mongoose');
const Expert = require('./models/Expert');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bookmyexpert';

const expertTemplates = [
  { name: 'Alex Rivera', category: 'Tech', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&h=300&auto=format&fit=crop' },
  { name: 'Sarah Chen', category: 'Tech', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&h=300&auto=format&fit=crop' },
  { name: 'Michael Smith', category: 'Tech', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&h=300&auto=format&fit=crop' },
  { name: 'Marcus Johnson', category: 'Finance', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&h=300&auto=format&fit=crop' },
  { name: 'Elena Rodriguez', category: 'Finance', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&h=300&auto=format&fit=crop' },
  { name: 'David Lee', category: 'Finance', avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=300&h=300&auto=format&fit=crop' },
  { name: 'Dr. James Wilson', category: 'Health', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&h=300&auto=format&fit=crop' },
  { name: 'Dr. Emily Blunt', category: 'Health', avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=300&h=300&auto=format&fit=crop' },
  { name: 'Dr. Maria Garcia', category: 'Health', avatar: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=300&h=300&auto=format&fit=crop' },
  { name: 'Robert Taylor', category: 'Legal', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&h=300&auto=format&fit=crop' },
  { name: 'Sophia Martinez', category: 'Legal', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=300&h=300&auto=format&fit=crop' },
  { name: 'William Brown', category: 'Legal', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=300&h=300&auto=format&fit=crop' },
  { name: 'Daniel Kim', category: 'Career', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&h=300&auto=format&fit=crop' },
  { name: 'Olivia White', category: 'Career', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&h=300&auto=format&fit=crop' },
  { name: 'Rachel Green', category: 'Career', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&h=300&auto=format&fit=crop' },
  { name: 'Kevin Park', category: 'Tech', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&h=300&auto=format&fit=crop' },
  { name: 'Linda Wu', category: 'Finance', avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=300&h=300&auto=format&fit=crop' },
  { name: 'Dr. Anil Gupta', category: 'Health', avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&h=300&auto=format&fit=crop' }
];

const times = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Expert.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const expertsToCreate = expertTemplates.map(template => {
      const slots = [];
      const today = new Date();
      for (let d = 1; d <= 7; d++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + d);
        const dateStr = nextDate.toISOString().split('T')[0];
        const numSlots = Math.floor(Math.random() * 3) + 1;
        for (let t = 0; t < numSlots; t++) {
          const time = times[Math.floor(Math.random() * times.length)];
          if (!slots.some(s => s.date === dateStr && s.time === time)) {
            slots.push({ date: dateStr, time, isBooked: false });
          }
        }
      }
      while(slots.length > 10) slots.pop();
      return {
        ...template,
        experience: Math.floor(Math.random() * 19) + 2,
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        bio: `I am a professional ${template.category} expert with years of experience helping clients achieve their goals.`,
        availableSlots: slots
      };
    });

    const createdExperts = await Expert.create(expertsToCreate);
    console.log(`Seeded ${createdExperts.length} experts`);

    const expertUsers = createdExperts.map(exp => ({
      name: exp.name,
      email: `${exp.name.toLowerCase().replace(/\s/g, '')}@expert.com`,
      password: hashedPassword,
      role: 'expert'
    }));

    expertUsers.push({
      name: 'Global Admin',
      email: 'admin@expert.com',
      password: hashedPassword,
      role: 'expert'
    });

    await User.insertMany(expertUsers);
    console.log(`Created ${expertUsers.length} user accounts with password "admin123"`);

    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

seedDB();
