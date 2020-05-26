import react from 'React';
import { useRouter } from 'next/router';

function logout() {
  return fetch("http://localhost:3001/logout", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  })
}



function LogoutButton() {
  const router = useRouter();

  async function onLogout() {
    const result = await logout();

    if (result.status === 401) {
      throw new Error("AHHH BAD GO AWAY");
    }

    router.push("/");
  }

  return <div>
    <button onClick={onLogout}>Logout</button>
  </div>
}

export default LogoutButton;