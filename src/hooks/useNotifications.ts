import * as Notifications from "expo-notifications";
import { useEffect } from "react";

export function useNotifications() {
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        await Notifications.requestPermissionsAsync();
      }
    })();
  }, []);

  const schedule = async (title: string, body: string, seconds = 5) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: { seconds },
    });
  };

  return { schedule };
}
