import {
  Form,
  Link,
  useSearchParams,
  useActionData,
  useNavigation,
  redirect,
} from "react-router-dom";
import Card from "../components/UI/Card";
import { FIREBASE_API_KEY } from "../firebase-config";
import styles from "./AuthenticationPage.module.css";

const ERROR_MESSAGES = {
  EMAIL_EXISTS: "That email is already registered.",
  INVALID_LOGIN_CREDENTIALS: "Invalid email or password.",
  INVALID_EMAIL: "Please enter a valid email address.",
};

// Firebase sends back codes like EMAIL_EXISTS, so turn them into readable text
const getErrorMessage = (code) => {
  if (code.startsWith("WEAK_PASSWORD"))
    return "Password must be at least 6 characters.";

  if (code.startsWith("TOO_MANY_ATTEMPTS_TRY_LATER"))
    return "Too many attempts. Please try again later.";

  return ERROR_MESSAGES[code] || "Could not authenticate user.";
};

const AuthenticationPage = () => {
  const data = useActionData();
  const navigation = useNavigation();

  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") !== "signup";
  const isSubmitting = navigation.state === "submitting";

  return (
    <main>
      <Card>
        <h2>{isLogin ? "Log In" : "Create New User"}</h2>

        {data?.message && <p className={styles["error-text"]}>{data.message}</p>}

        <Form method="post">
          <div className={styles.control}>
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" required />
          </div>

          <div className={styles.control}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.submit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : isLogin ? "Log In" : "Sign Up"}
            </button>
            <Link to={`?mode=${isLogin ? "signup" : "login"}`}>
              {isLogin ? "Need an account? Sign up." : "Already have an account? Log in."}
            </Link>
          </div>
        </Form>
      </Card>
    </main>
  );
};

export default AuthenticationPage;

export async function action({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") === "signup" ? "signUp" : "signInWithPassword";

  const data = await request.formData();
  const authData = {
    email: data.get("email"),
    password: data.get("password"),
    returnSecureToken: true,
  };

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authData),
    }
  );

  if (response.status === 400 || response.status === 401 || response.status === 422) {
    const errorData = await response.json();
    return { message: getErrorMessage(errorData.error?.message || "") };
  }

  if (!response.ok) {
    throw new Response(JSON.stringify({ message: "Could not authenticate user." }), {
      status: 500,
    });
  }

  const responseData = await response.json();
  localStorage.setItem("token", responseData.idToken);

  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + parseInt(responseData.expiresIn, 10));
  localStorage.setItem("expiration", expiration.toISOString());

  return redirect("/");
}
