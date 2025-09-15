import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const handleFacebookLogin = () => {
  FB.login(
    (response) => {
      if (response.authResponse) {
        console.log("Logged in!", response);
      } else {
        console.log("User cancelled login or did not fully authorize.");
      }
    },
    { scope: "public_profile,email" }
  );
};
