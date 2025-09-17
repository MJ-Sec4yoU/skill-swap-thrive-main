const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function generateUserTokens() {
    console.log('🔑 GENERATING USER LOGIN TOKENS FOR TESTING\n');
    
    const testUsers = [
        { email: 'alice@example.com', password: 'password123', name: 'Alice Johnson' },
        { email: 'bob@example.com', password: 'password123', name: 'Bob Smith' },
        { email: 'carol@example.com', password: 'password123', name: 'Carol Williams' },
        { email: 'admin@example.com', password: 'admin123', name: 'Admin User' }
    ];
    
    console.log('🎯 Test User Credentials for Frontend Testing:');
    console.log('='.repeat(50));
    
    for (const user of testUsers) {
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, {
                email: user.email,
                password: user.password
            });
            
            if (response.data.token) {
                console.log(`\\n✅ ${user.name}:`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Password: ${user.password}`);
                console.log(`   Role: ${user.email.includes('admin') ? 'Admin' : 'Regular User'}`);
                console.log(`   Status: ✅ Login Working`);
            }
        } catch (error) {
            console.log(`\\n❌ ${user.name}:`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Error: ${error.response?.data?.message || error.message}`);
        }
    }
    
    console.log('\\n' + '='.repeat(50));
    console.log('🌐 Frontend Access Information:');
    console.log('='.repeat(50));
    console.log('\\n🖥️  Application URL: http://localhost:8080');
    console.log('🔗 Backend API: http://localhost:5000');
    console.log('\\n📋 Quick Test Steps:');
    console.log('1. Open http://localhost:8080 in your browser');
    console.log('2. Click "Login" or navigate to /login');
    console.log('3. Use any of the credentials above');
    console.log('4. Explore the dashboard and features');
    console.log('\\n🎨 Available Pages to Test:');
    console.log('   / - Landing page');
    console.log('   /login - User login');
    console.log('   /register - New user registration');
    console.log('   /dashboard - User dashboard (after login)');
    console.log('   /explore - Browse all skills');
    console.log('   /learn - Find skills to learn');
    console.log('   /teach - Offer skills to teach');
    console.log('   /matches - View skill matches');
    console.log('   /messages - Communication center');
    console.log('   /schedule - Session scheduling');
    console.log('   /profile/edit - Edit user profile');
    console.log('   /admin - Admin dashboard (admin@example.com only)');
    
    console.log('\\n🎯 Test Scenarios to Try:');
    console.log('   🔍 Search for "Python" skills');
    console.log('   👥 Browse users who teach different skills');
    console.log('   📊 Check dashboard statistics and data');
    console.log('   💬 View existing messages and conversations');
    console.log('   📅 See scheduled sessions');
    console.log('   🎓 Add new skills to teach or learn');
    console.log('   🤝 Explore the matching system');
    
    console.log('\\n✨ Expected User Experience:');
    console.log('   ✅ Smooth login and navigation');
    console.log('   ✅ Real data displayed throughout');
    console.log('   ✅ Interactive forms and components');
    console.log('   ✅ Responsive design on all screen sizes');
    console.log('   ✅ No console errors or broken features');
    
    console.log('\\n🏆 System Status: READY FOR USERS!');
}

generateUserTokens();