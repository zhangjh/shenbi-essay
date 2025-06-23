import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return (
    <>
      <h1 className="sr-only">用户注册 - 神笔作文</h1>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)' }}>
        <SignUp routing="hash" signInUrl="/signin" />
      </div>
    </>
  );
};

export default SignUpPage;