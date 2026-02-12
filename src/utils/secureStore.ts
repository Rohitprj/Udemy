import * as SecureStore from "expo-secure-store";

export const secureSave = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
  });
};
export const secureGet = async (key: string) =>
  await SecureStore.getItemAsync(key);
export const secureDelete = async (key: string) =>
  await SecureStore.deleteItemAsync(key);
