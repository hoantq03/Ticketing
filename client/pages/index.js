import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You're Signed In</h1>
  ) : (
    <h1>You're Not Signed In</h1>
  );
};

LandingPage.getInitialProps = async (context) => {
  const { data } = await buildClient(context)
    .get("/api/users/currentuser")
    .catch((err) => {
      console.log(err);
    });
  return data;
};

export default LandingPage;
