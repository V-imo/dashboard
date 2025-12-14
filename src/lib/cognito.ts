import {
  ChangePasswordCommand,
  CognitoIdentityProviderClient,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  GetUserCommand,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  UpdateUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { createHmac } from "crypto";

export type CognitoConfig = {
  region: string;
  clientId: string;
};

export class Cognito {
  private client = new CognitoIdentityProviderClient({
    region: this.config.region,
  });

  constructor(public config: CognitoConfig) {}

  private calculateSecretHash(username: string): string {
    const clientSecret = process.env.COGNITO_CLIENT_SECRET;
    if (!clientSecret) {
      throw new Error("COGNITO_CLIENT_SECRET environment variable is required");
    }
    return createHmac("SHA256", clientSecret)
      .update(username + this.config.clientId)
      .digest("base64");
  }

  async updateUserAttributes(params: {
    accessToken: string;
    userAttributes: Record<string, string>;
  }) {
    const attributes = Object.entries(params.userAttributes).map(
      ([Name, Value]) => ({
        Name,
        Value,
      })
    );

    return await this.client.send(
      new UpdateUserAttributesCommand({
        AccessToken: params.accessToken,
        UserAttributes: attributes,
      })
    );
  }

  async getUserAttributes(accessToken: string) {
    const { UserAttributes } = await this.client.send(
      new GetUserCommand({
        AccessToken: accessToken,
      })
    );

    const attributes: Record<string, string> = {};
    if (UserAttributes) {
      for (const attribute of UserAttributes) {
        if (attribute.Name && attribute.Value !== undefined) {
          attributes[attribute.Name] = attribute.Value;
        }
      }
    }
    return attributes;
  }

  async signIn(credentials: { username: string; password: string }) {
    const secretHash = this.calculateSecretHash(credentials.username);

    const { AuthenticationResult, ChallengeName, Session } = await this.client
      .send(
        new InitiateAuthCommand({
          AuthFlow: "USER_PASSWORD_AUTH",
          ClientId: this.config.clientId,
          AuthParameters: {
            USERNAME: credentials.username,
            PASSWORD: credentials.password,
            SECRET_HASH: secretHash,
          },
        })
      )
      .catch((error) => {
        console.error("Error authenticating user: ", error);
        throw new Error(error.name);
      });

    // Handle NEW_PASSWORD_REQUIRED challenge for temporary passwords
    if (ChallengeName === "NEW_PASSWORD_REQUIRED") {
      return {
        challengeName: ChallengeName,
        session: Session,
        username: credentials.username,
      };
    }

    if (!AuthenticationResult) {
      throw new Error("No authentication result");
    }

    const token = {
      accessToken: AuthenticationResult.AccessToken!,
      idToken: AuthenticationResult.IdToken!,
      refreshToken: AuthenticationResult.RefreshToken!,
      tokenType: "Bearer",
    };

    const user = await this.getUserAttributes(token.accessToken);

    return { token, user };
  }

  async completeNewPasswordChallenge({
    username,
    session,
    newPassword,
  }: {
    username: string;
    session: string;
    newPassword: string;
  }) {
    const secretHash = this.calculateSecretHash(username);

    const command = new RespondToAuthChallengeCommand({
      ClientId: this.config.clientId,
      ChallengeName: "NEW_PASSWORD_REQUIRED",
      Session: session,
      ChallengeResponses: {
        USERNAME: username,
        NEW_PASSWORD: newPassword,
        SECRET_HASH: secretHash,
      },
    });

    try {
      const response = await this.client.send(command);
      if (response.AuthenticationResult) {
        const token = {
          accessToken: response.AuthenticationResult.AccessToken!,
          idToken: response.AuthenticationResult.IdToken!,
          refreshToken: response.AuthenticationResult.RefreshToken!,
          tokenType: "Bearer",
        };

        const user = await this.getUserAttributes(token.accessToken);

        // Return a structure that matches the signIn response
        return {
          token,
          user,
        };
      }
      throw new Error("No authentication result in response");
    } catch (error) {
      console.error("Error completing new password challenge:", error);
      throw error;
    }
  }

  async forgotPassword(username: string) {
    const secretHash = this.calculateSecretHash(username);

    await this.client.send(
      new ForgotPasswordCommand({
        Username: username,
        ClientId: this.config.clientId,
        SecretHash: secretHash,
      })
    );
  }

  async resetPassword(params: {
    username: string;
    code: string;
    password: string;
  }) {
    const secretHash = this.calculateSecretHash(params.username);

    return await this.client.send(
      new ConfirmForgotPasswordCommand({
        Username: params.username,
        ConfirmationCode: params.code,
        Password: params.password,
        ClientId: this.config.clientId,
        SecretHash: secretHash,
      })
    );
  }

  async changePassword(params: {
    currentPassword: string;
    newPassword: string;
    accessToken: string;
  }) {
    return await this.client.send(
      new ChangePasswordCommand({
        PreviousPassword: params.currentPassword,
        ProposedPassword: params.newPassword,
        AccessToken: params.accessToken,
      })
    );
  }

  async refreshToken(params: { refreshToken: string; username: string }) {
    const secretHash = this.calculateSecretHash(params.username);

    const { AuthenticationResult } = await this.client
      .send(
        new InitiateAuthCommand({
          AuthFlow: "REFRESH_TOKEN_AUTH",
          ClientId: this.config.clientId,
          AuthParameters: {
            REFRESH_TOKEN: params.refreshToken,
            USERNAME: params.username,
            SECRET_HASH: secretHash,
          },
        })
      )
      .catch((error) => {
        console.error("Error refreshing token: ", error);
        throw new Error(error.name);
      });

    if (!AuthenticationResult) {
      throw new Error("No authentication result");
    }

    return {
      accessToken: AuthenticationResult.AccessToken!,
      idToken: AuthenticationResult.IdToken!,
    };
  }

  async updateUserAttributesAndGetTokens(params: {
    accessToken: string;
    userAttributes: Record<string, string>;
    refreshToken: string;
    username: string;
  }) {
    // First update the attributes
    await this.updateUserAttributes({
      accessToken: params.accessToken,
      userAttributes: params.userAttributes,
    });

    // Then get new tokens
    const tokens = await this.refreshToken({
      refreshToken: params.refreshToken,
      username: params.username,
    });

    // Get updated user attributes with new access token
    const user = await this.getUserAttributes(tokens.accessToken);

    return {
      tokens,
      user,
    };
  }
}

// Extract region from COGNITO_ISSUER if available, otherwise use default
const getRegionFromIssuer = (issuer?: string): string => {
  if (issuer) {
    // Cognito issuer format: https://cognito-idp.{region}.amazonaws.com/{userPoolId}
    const match = issuer.match(/cognito-idp\.([^.]+)\.amazonaws\.com/);
    if (match) {
      return match[1];
    }
  }
  return process.env.NEXT_PUBLIC_COGNITO_REGION || "eu-central-1";
};

// Lazy initialization function to avoid errors during module load
function getCognitoConfig() {
  const cognitoRegion = process.env.COGNITO_ISSUER
    ? getRegionFromIssuer(process.env.COGNITO_ISSUER)
    : process.env.NEXT_PUBLIC_COGNITO_REGION || "eu-central-1";

  const cognitoClientId =
    process.env.COGNITO_CLIENT_ID || process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;

  if (!cognitoClientId) {
    throw new Error(
      "COGNITO_CLIENT_ID or NEXT_PUBLIC_COGNITO_CLIENT_ID environment variable is required"
    );
  }

  if (!process.env.COGNITO_CLIENT_SECRET) {
    throw new Error("COGNITO_CLIENT_SECRET environment variable is required");
  }

  return {
    region: cognitoRegion,
    clientId: cognitoClientId,
  };
}

// Lazy initialization - only create instance when needed
let cognitoInstance: Cognito | null = null;

export function getCognito(): Cognito {
  if (!cognitoInstance) {
    const config = getCognitoConfig();
    cognitoInstance = new Cognito(config);
  }
  return cognitoInstance;
}
