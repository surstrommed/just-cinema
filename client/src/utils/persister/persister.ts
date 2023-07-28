export const storagePersister = {
  getPersistedItem: (fieldName: string, withParse = false) => {
    if (withParse) {
      return JSON.parse(`${localStorage.getItem(fieldName)}`);
    } else {
      return localStorage.getItem(fieldName);
    }
  },
  persistItem: (fieldName: string, data: string) => {
    return localStorage.setItem(fieldName, data);
  },
  deletePersistedItem: (fieldName: string) => {
    return localStorage.removeItem(fieldName);
  },
};
