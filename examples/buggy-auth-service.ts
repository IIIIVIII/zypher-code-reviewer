// Example 4: TypeScript Authentication Service with bugs
// File: buggy-auth-service.ts

interface User {
  id: string;
  email: string;
  password: string;
  role: string;
}

class AuthService {
  private users: User[] = [];
  private tokens: Map<string, string> = new Map();
  
  // BUG 1: Synchronous password comparison (timing attack)
  async login(email: string, password: string): Promise<string | null> {
    const user = this.users.find(u => u.email === email);
    
    // BUG 2: No rate limiting
    // BUG 3: Plain text password comparison
    if (user && user.password === password) {
      // BUG 4: Weak token generation
      const token = Math.random().toString();
      this.tokens.set(token, user.id);
      return token;
    }
    
    // BUG 5: Information disclosure - reveals if email exists
    if (!user) {
      throw new Error('User not found');
    }
    throw new Error('Incorrect password');
  }
  
  // BUG 6: No token expiration
  validateToken(token: string): User | null {
    const userId = this.tokens.get(token);
    if (!userId) return null;
    
    return this.users.find(u => u.id === userId) || null;
  }
  
  // BUG 7: No input validation
  async register(email: string, password: string): Promise<User> {
    // BUG 8: No password strength validation
    // BUG 9: No email format validation
    
    const newUser: User = {
      id: Date.now().toString(), // BUG 10: Predictable ID
      email,
      password, // BUG 11: Storing plain text password
      role: 'user'
    };
    
    this.users.push(newUser);
    return newUser;
  }
  
  // BUG 12: No authorization check
  async deleteUser(userId: string): Promise<void> {
    const index = this.users.findIndex(u => u.id === userId);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }
  
  // BUG 13: Exposing all user data
  getAllUsers(): User[] {
    return this.users;
  }
}

export default AuthService;
