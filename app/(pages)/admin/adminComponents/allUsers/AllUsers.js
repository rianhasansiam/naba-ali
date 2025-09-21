import AllUsersClient from './AllUsersClient';

// Server Component - Handles data fetching
const AllUsers = () => {
  // Server-side users data (could come from database/API)
 

  // Pass data to client component
  return <AllUsersClient  />;
};

export default AllUsers;