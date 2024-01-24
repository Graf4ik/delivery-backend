export type JwtPayload = {
  id: number;
  email: string;
};

export type JwtPayloadWithRefresh = JwtPayload & { refreshToken: string };
