const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Initial users data
const users = [
    {
        // This will be the UID after Google Sign-In
        // For now, we'll use placeholder UIDs
        email: 'atul.kumar.singh20052005@gmail.com',
        fullName: 'Atul Kumar Singh',
        role: 'CORE_TEAM',
        domain: 'Android',
        year: 3,
        regId: '2100001',
        photoUrl: null
    },
    {
        email: 'coordinator@example.com',
        fullName: 'Test Coordinator',
        role: 'COORDINATOR',
        domain: 'Web',
        year: 2,
        regId: '2200001',
        photoUrl: null
    },
    {
        email: 'member@example.com',
        fullName: 'Test Member',
        role: 'MEMBER',
        domain: 'Android',
        year: 1,
        regId: '2300001',
        photoUrl: null
    }
];

async function createUsers() {
    console.log('Creating initial users in Firestore...\n');

    for (const user of users) {
        try {
            // Create a document with email as the ID (temporary)
            // When users sign in with Google, we'll update with their actual UID
            const docId = user.email.replace(/[@.]/g, '_');

            await db.collection('users').doc(docId).set({
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                domain: user.domain,
                year: user.year,
                regId: user.regId,
                photoUrl: user.photoUrl,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });

            console.log(`✓ Created user: ${user.fullName} (${user.email})`);
        } catch (error) {
            console.error(`✗ Error creating user ${user.email}:`, error);
        }
    }

    console.log('\n✓ All users created successfully!');
    console.log('\nNote: These are temporary document IDs based on email.');
    console.log('When users sign in with Google, the app will:');
    console.log('1. Look up user by email');
    console.log('2. Create a new document with their Firebase Auth UID');
    console.log('3. Copy the data from the email-based document\n');
}

createUsers()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Error:', error);
        process.exit(1);
    });
