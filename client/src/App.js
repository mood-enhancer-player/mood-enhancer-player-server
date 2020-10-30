import React from "react";
import "./App.css";

import { useQuery, gql } from "@apollo/client";
import UploadSong from "./UploadSong";
import UploadSongData from "./UploadSongData";
const ME = gql`
  query {
    me {
      id
      email
      username
    }
  }
`;
function App() {
  const { data, loading, error } = useQuery(ME);
  console.log(data, loading, error);
  //   {
  //   variables: { code },
  //   skip: code.length !== 2,
  // });
  return (
    <div className="App">
      {error && <h1>{`You Broken It ! ${error.message}`}</h1>}
      {!data || loading ? (
        <h1>Loading...</h1>
      ) : (
        <div>
          <h3>Name</h3> {data.me.username} <br />
          <h3>Email</h3>
          {data.me.email}
          <br />
          <h3>ID</h3> {data.me.id}
        </div>
      )}

      <UploadSongData />
      {/* <UploadSong /> */}
    </div>
  );
}

export default App;

// // import React from "react";
// // import "./App.css";
// // import { BrowserRouter as Router, Route } from "react-router-dom";

// // import Home from "./Pages/Home";
// // import Login from "./Pages/Login";
// // import Register from "./Pages/Register";

// // const App = () => {
// //   return (
// //     <Router>
// //       <Route exact path="/" component={Home}></Route>
// //       <Route exact path="/login" component={Login}></Route>
// //       <Route exact path="/register" component={Register}></Route>
// //     </Router>
// //   );
// // };

// // export default App;
