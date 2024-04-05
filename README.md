## Vendure Practice Repo

### Things done

- Avatar field to customer entity using config file
- CoverImage field to customer entity using minimalistic plugin
- Wishlist plugin using nestjs like structure
- Google authentication
- Microsoft Entra ID authentication

### To run

- Create file `vendure.sqlite` in root
- `yarn install` then `yarn dev`
- Copy .env.example to .env and fill in the values

## Using Azure AD

- Get auth URL so that frontend and can go and a url with call back is written

```graphql
query getAuthURL {
  getAuthCodeUrl
}
```

Response:

```json
{
  "data": {
    "getAuthCodeUrl": "https://login.microsoftonline.com/1fb3105a-fb47-4b4a-a564-14c9ec290584/oauth2/v2.0/authorize?client_id=779e5087-4cae-4651-b285-54cbcac42c3f&scope=openid%20profile%20email%20User.Read%20openid%20profile%20offline_access&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fazure-ad&client-request-id=1cbf476e-79df-4d42-acf9-519acdb56513&response_mode=query&response_type=code&x-client-SKU=msal.js.node&x-client-VER=2.6.6&x-client-OS=linux&x-client-CPU=x64&client_info=1"
  }
}
```

- Go to url and get the code, you will be redirected to the following url, send the code to backend

```json
localhost:3000/api/auth/callback/azure-ad?code={code}&client_info={client_info}&session_state={session_state}
```

```graphql
mutation Login {
  authenticate(input: { azureAD: { code: $code } }) {
    ... on CurrentUser {
      id
      identifier
    }
  }
}
```

Note: We can also pass custom redirectURI from frontend in both queries and mutation

From where we get tokeResult which looks like this

```ts
type TokenResult = {
  authority: string;
  uniqueId: string; // unique always
  tenantId: string;
  scopes: string[];
  account: {
    homeAccountId: string;
    environment: string;
    tenantId: string;
    username: string;
    localAccountId: string;
    name: string;
    nativeAccountId?: any;
    authorityType: string;
    // tenantProfiles: Map<any, any>[];
    idTokenClaims: Record<string, any>;
    idToken: string;
  };
  idToken: string;
  idTokenClaims: {
    aud: string;
    iss: string;
    iat: number;
    nbf: number;
    exp: number;
    email: string;
    idp: string;
    name: string;
    oid: string;
    preferred_username: string;
    // prov_data: any[];
    rh: string;
    sub: string;
    tid: string;
    uti: string;
    ver: string;
  };
  accessToken: string;
  fromCache: boolean;
  expiresOn: Date;
  extExpiresOn: Date;
  refreshOn?: any;
  correlationId: string;
  requestId: string;
  familyId: string;
  tokenType: string;
  state: string;
  cloudGraphHostName: string;
  msGraphHost: string;
  code?: any;
  fromNativeBroker: boolean;
};
```
