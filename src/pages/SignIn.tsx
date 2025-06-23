import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)' }}>
      <SignIn routing="hash" signUpUrl="/signup" />
    </div>
  );
};

export default SignInPage;