import { useAuthStore } from "~/stores/auth";
import { useRouter } from "vue-router";

interface TokenResponse {
  Data: {
    AccessToken: string;
    RefreshToken: string;
    TokenType: string;
    ExpiresAt: string;
  };
}

export const useAuth = () => {
  const authStore = useAuthStore();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      const { data: tokenRes } = await useFetch<TokenResponse>("/oauth/token", {
        baseURL: "https://iapitest.eva.guru",
        method: "POST",
        body: {
          Email: email,
          Password: password,
          GrantType: "password",
          Scope: "amazon_data",
          ClientId: "C0001",
          ClientSecret: "SECRET0001",
          RedirectUri: "https://api.eva.guru",
        },
      });

      const token = tokenRes.value?.Data?.AccessToken;
      if (!token) throw new Error("Token alınamadı");

      authStore.setToken(token);

      const { data: userInfo } = await useFetch("/user/user-information", {
        baseURL: "https://iapitest.eva.guru",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          email: email,
        },
      });

      authStore.setUser(userInfo.value);
      await navigateTo("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return { login };
};
