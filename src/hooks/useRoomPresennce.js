import { useEffect, useState } from "react";

export default function useRoomPresence(provider) {

  const [users, setUsers] = useState([]);

  useEffect(() => {

    if (!provider) return;

    const awareness = provider.awareness;

    const updateUsers = () => {
      const states = Array.from(awareness.getStates().values());
      setUsers(states);
    };

    awareness.on("change", updateUsers);
    updateUsers();

    return () => {
      awareness.off("change", updateUsers);
    };

  }, [provider]);

  return users;

}