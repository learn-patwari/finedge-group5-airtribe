export function createUser({ id, email, password }) {
  return {
    id,
    email,
    password,
    role: "USER" | "ADMIN",
    createdAt: new Date(),
    updatedAt: new Date()
  };
}