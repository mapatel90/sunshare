import { PrismaClient } from '@prisma/client';
import { insertLocationData } from '../server/utils/location-data-package.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌍 Starting location data insertion...');
  
  try {
    const stats = await insertLocationData();
    
    // console.log('\n📊 Final Statistics:');
    // console.log(`✅ Countries inserted: ${stats.countries}`);
    // console.log(`✅ States/Provinces inserted: ${stats.states}`);
    // console.log(`✅ Cities inserted: ${stats.cities}`);
    // console.log(`🎉 Total locations: ${stats.countries + stats.states + stats.cities}`);
    
    // Show some sample data
    console.log('\n📍 Sample data verification:');
    
    const sampleCountries = await prisma.country.findMany({
      take: 3,
      include: {
        states: {
          take: 2,
          include: {
            cities: {
              take: 3
            }
          }
        }
      }
    });
    
    sampleCountries.forEach(country => {
      console.log(`🏳️ ${country.name} (${country.code})`);
      country.states.forEach(state => {
        console.log(`  🏛️ ${state.name} (${state.code || 'N/A'})`);
        state.cities.forEach(city => {
          console.log(`    🏙️ ${city.name}`);
        });
      });
    });
    
    console.log('\n✨ Location data insertion completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error('❌ Unexpected error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });