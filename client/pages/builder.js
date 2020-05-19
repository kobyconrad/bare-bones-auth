import { useEffect } from "react";

function whoami() {
  return fetch("http://localhost:3001/user-info", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export default () => {
  async function load() {
    const result = await whoami();

    if (result.status === 401) {
      throw new Error("not logged in");
    }

    const data = await result.json();
    console.log(data);
  }

  return (
    <div>
      <button onClick={load}>Load info</button>
    </div>
  );
};
