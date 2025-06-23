import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <>
      <h1 className="sr-only">用户登录 - 神笔作文</h1>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)' }}>
        <SignIn routing="hash" signUpUrl="/signup" />
      </div>
    </>
  );
};

export default SignInPage;