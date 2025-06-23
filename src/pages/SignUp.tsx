import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)' }}>
      <SignUp routing="hash" signInUrl="/signin" />
    </div>
  );
};

export default SignUpPage;