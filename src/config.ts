const remoteBootstrap = 'https://iaales.lat';
const localBootstrap = 'http://localhost:8000';

const BOOTSTRAP_URL = __DEV__ ? localBootstrap : remoteBootstrap;
export const SIMULATE = Boolean(__DEV__);

export const API_URL = `${BOOTSTRAP_URL}/api/v1`;

// Web OAuth 2.0 client ID for GCP project quiniela-492804 (project number 859548115306).
// Must belong to the same GCP project as android/app/google-services.json, and must be
// of the type "Web application" (not Android). @react-native-google-signin v10 requires this
// to be passed explicitly to GoogleSignin.configure() — it does not auto-read the
// default_web_client_id Android string resource.
export const GOOGLE_WEB_CLIENT_ID =
  '859548115306-342jbj9ufv08iomd3ojecnfn6srbj0sv.apps.googleusercontent.com';

console.info(`conectando con URL api: ${API_URL}`);
