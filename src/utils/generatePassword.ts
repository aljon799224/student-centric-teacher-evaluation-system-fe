export default function generatePassword(
  setPassword: React.Dispatch<React.SetStateAction<string>>,
  setFormData: any
) {
  const length = 12; // Length of the password
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let newPassword = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    newPassword += charset[randomIndex];
  }
  setPassword(newPassword);
  setFormData((prevData: any) => ({
    ...prevData,
    password: newPassword,
  }));
}
