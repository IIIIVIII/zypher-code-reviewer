// Example 3: React Component with bugs
// File: BuggyUserProfile.jsx

import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  // BUG 1: Missing initial state type
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  
  // BUG 2: Missing dependency array causes infinite loop
  useEffect(() => {
    fetchUser();
  });
  
  // BUG 3: No error handling
  async function fetchUser() {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();
    setUser(data);
    setLoading(false);
  }
  
  // BUG 4: Directly mutating state
  function updateName(newName) {
    user.name = newName;
    setUser(user);
  }
  
  // BUG 5: Memory leak - no cleanup for subscription
  useEffect(() => {
    const subscription = subscribeToUpdates(userId, (update) => {
      setUser(prevUser => ({ ...prevUser, ...update }));
    });
    // Missing: return () => subscription.unsubscribe();
  }, [userId]);
  
  // BUG 6: XSS vulnerability
  function renderBio() {
    return <div dangerouslySetInnerHTML={{ __html: user.bio }} />;
  }
  
  // BUG 7: No null check before accessing properties
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="profile">
      {/* BUG 8: user might be undefined */}
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      {renderBio()}
      
      {/* BUG 9: onClick should use callback, not direct call */}
      <button onClick={updateName('New Name')}>Update Name</button>
      
      {/* BUG 10: Key missing in list rendering */}
      <ul>
        {user.posts.map(post => (
          <li>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserProfile;
