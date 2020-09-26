import React, { useState } from "react";
import "./App.css";

import { useQuery, gql } from "@apollo/client";
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
    </div>
  );
}

export default App;

// import React, { useState } from "react";
// import "./App.css";

// import { Mutation } from "react-apollo";
// import { useQuery, gql } from "@apollo/client";

// export const UPLOAD_FILE = gql`
//   mutation uploadFile($file: Upload!) {
//     uploadFile(file: $file) {
//       filename
//     }
//   }
// `;

// function App() {
//   return (
//     <Mutation mutation={UPLOAD_FILE}>
//       {(uploadFile) => (
//         <input
//           type="file"
//           required
//           onChange={({
//             target: {
//               validity,
//               files: [file],
//             },
//           }) => validity.valid && uploadFile({ variables: { file } })}
//         />
//       )}
//     </Mutation>
//   );
// }

// export default App;

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
