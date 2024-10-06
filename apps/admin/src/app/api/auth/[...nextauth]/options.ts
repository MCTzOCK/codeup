import KeycloakProvider from "next-auth/providers/keycloak";

const authOptions = {
  // Configure one or more authentication providers
  providers: [
    // !!! Should be stored in .env file.
    KeycloakProvider({
      clientId: `codeup-admin`,
      clientSecret: `${process.env.KEYCLOAK_CLIENT_SECRET}`,
      issuer: `https://iam.ben-siebert.com/realms/codeup-admin`,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name ?? profile.preferred_username,
          email: profile.email,
          image: `https://codeup.space/codeup.png`,
        };
      },
    }),
  ],
  secret: `${process.env.NEXT_AUTH_SECRET}`,
};

export default authOptions;
