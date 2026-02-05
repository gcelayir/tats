
// Bu dosya Supabase bağlantısı bozuk olduğunda (500 hatası) devreye giren tam kapsamlı bir Mock istemcisidir.
console.warn('⚠️ MOCK SUPABASE CLIENT AKTİF: Gerçek veritabanı bağlantısı kullanılmıyor.');

const mockUser = {
    id: 'mock-user-id',
    email: 'teknik@teknoasteknoloji.com',
    role: 'authenticated',
    user_metadata: { full_name: 'Teknik Admin (Mock)' }
};

const mockProfile = {
    id: 'mock-user-id',
    email: 'teknik@teknoasteknoloji.com',
    role: 'admin',
    full_name: 'Teknik Admin (Mock)',
    created_at: new Date().toISOString()
};

const mockUsersList = [
    mockProfile,
    { id: '2', email: 'calisan@sirket.com', role: 'user', full_name: 'Çalışan (Mock)', created_at: '2023-01-01' },
    { id: '3', email: 'yeni@sirket.com', role: 'user', full_name: 'Yeni Üye (Mock)', created_at: '2023-05-05' }
];

export const mockSupabase = {
    auth: {
        getUser: async () => ({ data: { user: mockUser }, error: null }),
        getSession: async () => ({ data: { session: { user: mockUser } }, error: null }),
        signInWithPassword: async ({ email, password }: any) => {
            console.log('Mock Login:', email);
            return { data: { user: mockUser, session: {} }, error: null };
        },
        signOut: async () => ({ error: null }),
        admin: {
            createUser: async (params: any) => {
                console.log('Mock Create User:', params);
                return { data: { user: { ...mockUser, email: params.email } }, error: null };
            },
            deleteUser: async () => ({ error: null }),
            listUsers: async () => ({ data: { users: [mockUser] }, error: null })
        }
    },
    from: (table: string) => {
        return {
            select: (columns: string) => {
                // Zincirleme metodları destekle
                const builder: any = Promise.resolve({ data: table === 'profiles' ? mockUsersList : [], error: null });

                builder.order = () => builder;
                builder.eq = (col: string, val: string) => {
                    // Mock profile tekil sorgu
                    if (table === 'profiles' && col === 'id') {
                        return Promise.resolve({ data: mockProfile, error: null });
                    }
                    return builder;
                };
                builder.single = () => Promise.resolve({ data: mockProfile, error: null });
                builder.update = (updates: any) => {
                    console.log(`Mock Update ${table}:`, updates);
                    // update().eq() zinciri için promise dönmeli, ama basitçe burada kesiyoruz
                    const updateBuilder: any = Promise.resolve({ error: null });
                    updateBuilder.eq = () => Promise.resolve({ error: null });
                    return updateBuilder;
                };
                builder.insert = (data: any) => Promise.resolve({ error: null });
                builder.delete = () => {
                    console.log(`Mock Delete ${table}`);
                    const deleteBuilder: any = {};
                    deleteBuilder.eq = () => Promise.resolve({ error: null });
                    return deleteBuilder;
                };

                return builder;
            },
            update: (updates: any) => {
                const builder: any = {};
                builder.eq = () => Promise.resolve({ error: null });
                return builder;
            },
            insert: () => Promise.resolve({ error: null }),
            upsert: () => Promise.resolve({ error: null }),
            delete: () => {
                console.log(`Mock Delete`);
                const deleteBuilder: any = {};
                deleteBuilder.eq = () => Promise.resolve({ error: null });
                return deleteBuilder;
            }
        };
    }
};
